import "../scss/addition_payment.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import API from "forsnap-api";
import mewtime from "forsnap-mewtime";
import utils from "forsnap-utils";

import PopModal from "shared/components/modal/PopModal";
import Payment from "shared/components/payment/Payment";

import Icon from "desktop/resources/components/icon/Icon";
import Buttons from "desktop/resources/components/button/Buttons";
import Checkbox from "desktop/resources/components/form/Checkbox";

class AdditionPayment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isProgress: false,
            email: "",
            user_name: "",
            user_phone: "",
            user_email: "",
            user_msg: "",
            price: props.data.price || 0,
            agree_pay: false,
            agree_refund: false,
            agree_info: false,
            agree_get: false,
            clauseAgree: false,
            accordion_refund: false,
            accordion_info: false,
            accordion_get: false,
            method: Payment.getPayMethod(),
            methodStr: {
                card: "신용카드",
                trans: "계좌이체",
                vbank: "무통장 입금"
            },
            receipt: null,
            reserve: null
        };

        this.onScroll = this.onScroll.bind(this);
        this.onAgree = this.onAgree.bind(this);
        this.onAgreeClause = this.onAgreeClause.bind(this);
        this.onPay = this.onPay.bind(this);
        this.onChangePhone = this.onChangePhone.bind(this);
        this.onChangeMsg = this.onChangeMsg.bind(this);
        this.onAccordion = this.onAccordion.bind(this);

        this.setProgress = this.setProgress.bind(this);

        this.checkMethod = this.checkMethod.bind(this);
        this.calculPrice = this.calculPrice.bind(this);
    }

    componentWillMount() {
        this.checkMethod(this.state.method.find(obj => (obj.checked)));
    }

    componentDidMount() {
        this.setProgress(true);

        Payment.getUser().then(response => {
            this.setProgress(false);
            if (response) {
                this.setState({
                    user_name: response.name || "",
                    email: response.email || "",
                    user_email: response.email || "",
                    user_phone: response.phone || ""
                });
            }
        }).catch(error => {
            this.setProgress(false);
        });
    }

    onScroll(e) {
        const aside = this.aside;

        if (aside && e && e.currentTarget) {
            const target = e.currentTarget;
            aside.style.top = `${target.scrollTop}px`;
        }
    }

    /**
     * 서비스 동의 체크
     * @param key
     */
    onAgree(key) {
        const { agree_pay, agree_refund, agree_info, agree_get } = this.state;
        const props = {};

        switch (key) {
            case "agree_pay": props.agree_pay = !agree_pay; break;
            case "agree_refund": props.agree_refund = !agree_refund; break;
            case "agree_info": props.agree_info = !agree_info; break;
            case "agree_get": props.agree_get = !agree_get; break;
            case "all": props.agree_pay = true; props.agree_refund = true; props.agree_info = true; props.agree_get = true; break;
            default: break;
        }

        this.setState(props);
    }

    onAgreeClause(value) {
        this.setState({
            clauseAgree: value
        });
    }

    /**
     * 결제 진행 - 아임포트
     */
    onPay() {
        const { agree_pay, agree_refund, agree_info, agree_get, user_phone, user_email, clauseAgree, payMethod, user_msg } = this.state;
        let message = "";

        if (user_phone === "") {
            message = "핸드폰 번호를 입력해주세요";
        } else if (user_email.replace(/\s/g, "") === "") {
            message = "이메일을 입력해주세요";
        } else if (!utils.isValidEmail(user_email)) {
            message = "이메일 형식을 정확하게 입력해주세요";
        } else if (user_msg && utils.domain.includesExceptForsnap(user_msg)) {
            message = "요청사항에는\n외부 URL, 일부 특수문자는 사용할 수 없습니다";
        } else if (!agree_pay) {
            message = "촬영의 계약조건 및 결재진행 동의에 체크해주세요";
        } else if (!agree_refund) {
            message = "환불규정 안내에 대한 동의에 체크해주세요";
        } else if (!agree_info) {
            message = "개인정보 제3자 제공 동의에 체크해주세요";
        } else if (!agree_get) {
            message = "개인정보 수집 및 이용 동의에 체크해주세요";
        } else if (!clauseAgree) {
            message = "구매 동의 후 예약이 가능합니다.";
        } else if (!this.state.isProgress) {
            this.setProgress(true);

            const { message_no, message_type } = this.props.data;

            Payment.readyToTalk(message_no, payMethod, message_type === "RESERVE_CUSTOM" ? "맞춤결제" : "추가결제", null, user_msg)
                .then(params => {
                    if (params) {
                        Payment.payment(params).then(receipt => {
                            if (receipt.success) {
                                const prop = {
                                    receipt
                                };

                                API.reservations.reservePayment(receipt.merchant_uid, { pay_uid: receipt.imp_uid })
                                    .then(response => {
                                        this.setProgress(false);
                                        if (response.status === 200) {
                                            prop.reserve = response.data;

                                            this.setState(prop);
                                        }
                                    })
                                    .catch(error => {
                                        this.setProgress(false);
                                        PopModal.alert(error.data ? error.data : error.error_msg);
                                    });
                            } else {
                                this.setProgress(false);
                                PopModal.alert(receipt.error_msg);
                            }
                        }).catch(error => {
                            this.setProgress(false);
                            PopModal.alert("결제중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.\n지속적인 오류시 고객센터로 문의해주세요.");
                        });
                    } else {
                        this.setProgress(false);
                        PopModal.alert("결제 준비중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.\n지속적인 오류시 고객센터로 문의해주세요.");
                    }
                })
                .catch(error => {
                    this.setProgress(false);
                    PopModal.alert(error && error.data ? error.data : "결제 준비중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.\n지속적인 오류시 고객센터로 문의해주세요.");
                });
        } else {
            message = "결제가 진행중입니다.";
        }

        if (message) {
            PopModal.toast(message);
        }
    }

    /**
     * 예약자 연락처 수정
     * @param e
     */
    onChangePhone(e) {
        const target = e.currentTarget;
        const maxLength = target.maxLength;
        const phone = target.value.replace(/[\D]+/g, "");

        if (maxLength && phone.length > maxLength) {
            return;
        }

        this.setState({
            user_phone: phone
        });
    }

    /**
     * 예약자 요청사항 수정
     * @param e
     */
    onChangeMsg(e) {
        const target = e.currentTarget;
        const maxLength = target.maxLength;
        const msg = target.value;

        if (maxLength && msg.length > maxLength) {
            return;
        }

        this.setState({
            user_msg: msg
        });
    }

    onAccordion(key, value) {
        this.setState({
            accordion_refund: false,
            accordion_info: false,
            accordion_get: false,
            [key]: !value
        });
    }

    setProgress(b) {
        this.state.isProgress = b;

        if (b) {
            PopModal.progress();
        } else {
            PopModal.closeProgress();
        }
    }

    /**
     * 결제방법 변경
     * @param method
     */
    checkMethod(method) {
        const m = this.state.method.reduce((r, obj) => {
            obj.checked = method.value === obj.value;
            r.push(obj);
            return r;
        }, []);

        this.setState({
            method: m,
            payMethod: method
        });
    }

    /**
     * 최종금액 계산
     * @param price - Number (가격)
     * @param addPrice - Number (추가가격)
     * @param person - Number (인원)
     * @param basicPerson - Number (기본인원)
     * @return {number}
     */
    calculPrice(price, addPrice, person, basicPerson) {
        return (price * 1) + (person > basicPerson ? addPrice * (person - basicPerson) : 0);
    }

    render() {
        const { reserve_date, message_type, content, buy_no } = this.props.data;
        const {
            email,
            user_name,
            user_email,
            user_phone,
            user_msg,
            price,
            method,
            methodStr,
            agree_pay,
            agree_refund,
            agree_info,
            agree_get,
            clauseAgree,
            receipt,
            reserve,
            accordion_refund,
            accordion_info,
            accordion_get
        } = this.state;
        const renderLayout = [];
        const title = message_type === "RESERVE_CUSTOM" ? "맞춤결제" : "추가결제";

        if (receipt) {
            const isSuccess = !!receipt.success;

            renderLayout.push(
                <div key="popup_payment_receipt" className="products__payment__desktop process">
                    <div className="products__payment__content">
                        <div className="products__payment__status">
                            <h1 className="title">{`${title}가 ${isSuccess ? "완료" : "취소"} 되었습니다.`}</h1>
                            <div className="caption">주문번호 : {utils.format.formatByNo(receipt.merchant_uid)}</div>
                        </div>
                        {isSuccess && reserve ? [
                            <div key="receipt_payment" className="products__payment__info">
                                <h1 className="info__title">예약정보</h1>
                                {message_type === "RESERVE_CUSTOM" ?
                                    <div className="info__text">
                                        <h4 className="title">촬영날짜</h4>
                                        <div className="text">
                                            <span>{mewtime(reserve.reserve_dt).format("YYYY년 MM월 DD일")}</span></div>
                                    </div> : null
                                }
                                <div className="info__text">
                                    <h4 className="title">옵션</h4>
                                    <div className="text">
                                        <span>{reserve.title}</span>
                                    </div>
                                </div>
                                <div className="info__text">
                                    <h4 className="title">설명</h4>
                                    <div className="text">
                                        <span>{reserve.option_content}</span>
                                    </div>
                                </div>
                                {message_type === "RESERVE_EXTRA" ?
                                    <div className="info__text">
                                        <h4 className="title">구매번호</h4>
                                        <div className="text">
                                            {buy_no}
                                        </div>
                                    </div> : null
                                }
                                <div className="info__text">
                                    <h4 className="title">결제방법</h4>
                                    <div className="text">
                                        <span>
                                            {reserve.pay_type === "vbank"
                                                ? utils.linebreak(`입금계좌 : ${reserve.vbank_name}\n계좌번호 : ${reserve.vbank_num}\n입금기한 : ${reserve.vbank_date}`)
                                                : methodStr[reserve.pay_type]
                                            }
                                        </span>
                                    </div>
                                </div>
                                <div className="info__text">
                                    <h4 className="title">최종 결제금액</h4>
                                    <div className="text"><span className="price">{utils.format.price(reserve.total_price)}</span><span>원</span></div>
                                </div>
                            </div>,
                            <div key="receipt_user" className="products__payment__info">
                                <h1 className="info__title">예약자 정보</h1>
                                <div className="info__text">
                                    <h4 className="title">예약자</h4>
                                    <div className="text">
                                        {user_name}
                                    </div>
                                </div>
                                <div className="info__text">
                                    <h4 className="title">핸드폰</h4>
                                    <div className="text">
                                        {user_phone}
                                    </div>
                                </div>
                                <div className="info__text">
                                    <h4 className="title">이메일</h4>
                                    <div className="text">
                                        {user_email}
                                    </div>
                                </div>
                            </div>,
                            <div key="receipt_buttons" className="products__payment__button">
                                <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "yellow" }} inline={{ href: "/" }}>메인페이지가기</Buttons>
                                {isSuccess && reserve ?
                                    <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ href: `/users/progress/${reserve.pay_type === "vbank" ? "ready" : "payment"}` }}>예약확인하기</Buttons>
                                    : null
                                }
                            </div>] : null
                        }
                    </div>
                </div>
            );
        } else {
            renderLayout.push(
                <div key="popup_payment_ready" className="products-detail__goodsInfo" onScroll={this.onScroll}>
                    <div className="container">
                        <div className="multistage">
                            <div className="products__payment__desktop">
                                <div className="products__payment__content">
                                    {content ?
                                        <div className="products__payment__info">
                                            <h1 className="info__title">예약 정보</h1>
                                            <div className="info__text">
                                                <h4 className="title">설명</h4>
                                                <div className="text">
                                                    {content}
                                                </div>
                                            </div>
                                            {message_type === "RESERVE_CUSTOM" ?
                                                <div className="info__text">
                                                    <h4 className="title">촬영일</h4>
                                                    <div className="text">
                                                        {reserve_date}
                                                    </div>
                                                </div> : null
                                            }
                                            {message_type === "RESERVE_EXTRA" ?
                                                <div className="info__text">
                                                    <h4 className="title">구매번호</h4>
                                                    <div className="text">
                                                        {buy_no}
                                                    </div>
                                                </div> : null
                                            }
                                        </div> : null
                                    }
                                    <div className="products__payment__info">
                                        <h1 className="info__title">예약자 정보</h1>
                                        <div className="info__text">
                                            <h4 className="title">예약자</h4>
                                            <div className="text">
                                                <div className="box disable">
                                                    {user_name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="info__text">
                                            <h4 className="title">핸드폰</h4>
                                            <div className="text">
                                                <div className="box">
                                                    <input type="tel" className="input" value={user_phone} onChange={this.onChangePhone} maxLength="11" placeholder="- 없이 번호만 입력해주세요." />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="info__text">
                                            <h4 className="title">이메일</h4>
                                            <div className="text">
                                                <div className={classNames("box", email ? "disable" : "")}>
                                                    {email || <input type="email" className="input" value={user_email} onChange={e => this.setState({ user_email: e.currentTarget.value })} maxLength="50" />}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="info__text">
                                            <h4 className="title">요청사항<span className="max-length">{user_msg.length}/100</span></h4>
                                            <div className="text">
                                                <div className="box">
                                                    <textarea className="textarea" rows="5" onChange={this.onChangeMsg} placeholder="남기고 싶은말을 적어주세요." maxLength="100" value={user_msg} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="products__payment__info">
                                        <h1 className="info__title">결제방법 선택</h1>
                                        <div className="info__text">
                                            {method.map(m => {
                                                return <button key={`pay-method-${m.value}`} className={classNames("button", m.checked ? "active" : "")} onClick={() => this.checkMethod(m)}>{m.name}</button>;
                                            })}
                                        </div>
                                    </div>
                                    <div className="products__payment__info">
                                        <h1 className="info__policy__title">환불규정 안내</h1>
                                        <div className="info__policy">
                                            <div className="policy__title">예약 30일전</div>
                                            <div className="policy__text">총 금액의 100%환불</div>
                                        </div>
                                        <div className="info__policy">
                                            <div className="policy__title">예약 14일전</div>
                                            <div className="policy__text">총 금액의 50%환불</div>
                                        </div>
                                        <div className="info__policy">
                                            <div className="policy__title">예약 7일전</div>
                                            <div className="policy__text">총 금액의 20%환불</div>
                                        </div>
                                        <div className="info__policy">
                                            <div className="policy__title">예약 7이내</div>
                                            <div className="policy__text">환불불가</div>
                                        </div>
                                    </div>
                                    <div className="products__payment__info">
                                        <h1 className="info__policy__title">
                                            서비스 동의
                                            <a className={classNames("policy__all__check", "agree__button", agree_pay && agree_refund && agree_info && agree_get ? "checked" : "")} role="button" onClick={() => this.onAgree("all")}>전체 동의</a>
                                        </h1>
                                        <div className="info__policy" onClick={() => this.onAgree("agree_pay")}>
                                            <div className={classNames("policy__agree", "agree__button", agree_pay ? "checked" : "")} />
                                            <div className="policy__text requierd">위 촬영의 계약조건 확인 및 결제진행 동의</div>
                                        </div>
                                        <div className="info__policy hr" />
                                        <div className="info__policy">
                                            <div className={classNames("policy__agree", "agree__button", agree_refund ? "checked" : "")} onClick={() => this.onAgree("agree_refund")} />
                                            <div className="policy__text requierd" onClick={() => this.onAgree("agree_refund")}>환불규정 안내에 대한 동의</div>
                                            <div className={classNames("policy__accordion__button", accordion_refund ? "accordion__down" : "")} onClick={() => this.onAccordion("accordion_refund", accordion_refund)}>
                                                <Icon name="dt_l" />
                                            </div>
                                        </div>
                                        <div className={classNames("info__policy", "policy__accordion", accordion_refund ? "accordion__down" : "")}>
                                            <div className="policy__text">
                                                부득이하게 예약한 상품의 날짜나 시간을 변경해야 하는 경우, 작가님과 고객님이 서로 상의하여 내용을 변경하시거나 예약을 취소하시면 됩니다.<br /><br />
                                                하지만, 협의가 무산되거나 한쪽의 일방적인 통보로 인해 예약을 취소해야 하는 경우, 회사가 정한 규정에 따라 환불이 진행됩니다. 이는 사진작가와 고객을 모두 보호하기 위한 포스냅의 정책입니다.<br /><br />
                                                고객 예약 취소의 경우<br />
                                                1. 30일 이전 취소 시 : 전액 환불<br />
                                                2. 14일 이전 취소 시 : 50% 환불<br />
                                                3. 7일 이전 취소 시 : 20% 환불<br />
                                                4. 7일 이내 취소 시 : 환불불가
                                            </div>
                                        </div>
                                        <div className="info__policy hr" />
                                        <div className="info__policy">
                                            <div className={classNames("policy__agree", "agree__button", agree_info ? "checked" : "")} onClick={() => this.onAgree("agree_info")} />
                                            <div className="policy__text requierd" onClick={() => this.onAgree("agree_info")}>개인정보 제3자 제공 동의</div>
                                            <div className={classNames("policy__accordion__button", accordion_info ? "accordion__down" : "")} onClick={() => this.onAccordion("accordion_info", accordion_info)}>
                                                <Icon name="dt_l" />
                                            </div>
                                        </div>
                                        <div className={classNames("info__policy", "policy__accordion", accordion_info ? "accordion__down" : "")}>
                                            <div className="policy__text">
                                                개인정보는 제3자에게 제공되지 않습니다. 하지만 포스냅과 연계된 서비스 또는 결제와 같이 제3자의 응대가 필요한 경우, 동의를 통해 개인정보가 전달 될 수도 있습니다.<br /><br />
                                                개인정보는 서비스 이용 완료 또는 고객 응대 후 파기됩니다.
                                            </div>
                                        </div>
                                        <div className="info__policy hr" />
                                        <div className="info__policy">
                                            <div className={classNames("policy__agree", "agree__button", agree_get ? "checked" : "")} onClick={() => this.onAgree("agree_get")} />
                                            <div className="policy__text requierd" onClick={() => this.onAgree("agree_get")}>개인정보 수집 및 이용 동의</div>
                                            <div className={classNames("policy__accordion__button", accordion_get ? "accordion__down" : "")} onClick={() => this.onAccordion("accordion_get", accordion_get)}>
                                                <Icon name="dt_l" />
                                            </div>
                                        </div>
                                        <div className={classNames("info__policy", "policy__accordion", accordion_get ? "accordion__down" : "")}>
                                            <div className="policy__text">
                                                <table className="table">
                                                    <colgroup>
                                                        <col span="3" width="33.33%" />
                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                            <td>수집하는 개인정보 항목</td>
                                                            <td>수집 및 이용목적</td>
                                                            <td>보유 및 이용기간</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <dl>
                                                                    <dt>계정정보</dt>
                                                                    <dd>이름, 성별, 생년월일, 이메일, 전화번호, 지역, 프로필이미지</dd>
                                                                    <dt>웹 결제 정보</dt>
                                                                    <dd>계약된 PG사에 전달된 결제 정보</dd>
                                                                    <dt>로그 데이터</dt>
                                                                    <dd>IP정보, 디바이스 또는 브라우저 정보, 조회된 도메인, 방문 웹페이지, 이용 통신사 구분, 이용 기록, 불량 이용 기록</dd>
                                                                    <dt>계정정보</dt>
                                                                    <dd>이름, 성별, 생년월일, 이메일, 전화번호, 지역, 프로필이미지</dd>
                                                                    <dt>SNS 연동 정보</dt>
                                                                    <dd>SNS에서 제공하는 사용자의 계정 정보와 친구 관계 정보 등 연동되는 SNS에서 허용하는 모든 정보 (지원 SNS는 운영에 따라 변경 가능합니다.)</dd>
                                                                </dl>
                                                            </td>
                                                            <td>
                                                                <ul>
                                                                    포스냅의 원활한 이용을 위해 개인정보를 수집합니다. 세부적인 이용 목적은 다음과 같습니다.
                                                                    <li>본인 확인과 부정 이용 방지를 위해</li>
                                                                    <li>서비스 이용 문의 응대를 위해</li>
                                                                    <li>이용 현황 파악을 위한 통계 데이터 축적을 위해</li>
                                                                    <li>캠페인 이벤트 등 추천 선물 발송을 위해</li>
                                                                    <li>중요 공지사항의 전달을 위해</li>
                                                                    <li>이벤트와 광고 전달을 위해</li>
                                                                    <li>유료 이용 시 전송, 배송, 요금 정산을 위해</li>
                                                                    <li>새로운 상품 추천을 위해</li>
                                                                </ul>
                                                            </td>
                                                            <td className="text-justify">
                                                                이용 목적을 위해 한시적으로 보유하고 목적 달성시 개인정보는 파기됩니다. 하지만 관계 법령 등으로 보존 필요가 있는 경우 일정 기간 보관합니다.
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="products__payment__info">
                                        <h1 className="info__policy__title">
                                            세금계산서 안내
                                        </h1>
                                        <div className="info__policy">
                                            <div className="policy__text">
                                                세금계산서를 발행해야 하는 경우 대화하기를 통해 작가님에게 발급 가능여부를 확인하여야 합니다.<br /><br />
                                                현금영수증은 ‘개인소득공제용’으로만 사용하실 수 있으며 발급당시 ‘지출증빙용’을 선택하셨더라도 매입세액공제를 받지 못합니다.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="multistage multistage--aside" ref={ref => (this.aside = ref)}>
                            <div className="products__payment__desktop">
                                <div className="products__payment__content">
                                    <div className="products__payment__info">
                                        {reserve_date ?
                                            <div className="info__text">
                                                <h1 className="title">촬영일</h1>
                                                <div className="text">{reserve_date}</div>
                                            </div> : null
                                        }
                                        <div className="info__text">
                                            <h1 className="title">결제예정금액</h1>
                                            <div className="text">{utils.format.price(price)}<span>원</span></div>
                                        </div>
                                        <div className="info__buttons">
                                            <button onClick={this.onPay}>결제하기</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="products__payment__content">
                                    <p className="clause__title">주문하실 상품을 확인하였으며, 구매에 동의하시겠습니까?</p>
                                    <p className="clause__agree">
                                        <Checkbox type="yellow_circle" checked={clauseAgree} resultFunc={value => this.onAgreeClause(value)}>
                                            <strong>동의합니다.</strong> (전자상거래법 제8조 제2항)
                                        </Checkbox>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="popup__payment__desktop">
                <main id="site-main" style={{ backgroundColor: "#fafafa" }}>
                    <h2 className="sr-only">{title}하기</h2>
                    <div className="products__payment__breadcrumb">
                        <div className={classNames("payment__breadcrumb__process", !receipt ? "active" : "")}>
                            <i className={`m-icon m-icon-won-${!receipt ? "sky" : "gray"}`} />
                            <div className="title">
                                {`${title}하기`}
                            </div>
                        </div>
                        <div className="payment__breadcrumb__bar">
                            <i className="m-icon m-icon-gray-gt_b" />
                        </div>
                        <div className={classNames("payment__breadcrumb__complete", receipt ? "active" : "")}>
                            <i className={`m-icon m-icon-complete-${receipt ? "sky" : "gray"}`} />
                            <div className="title">
                                주문완료
                            </div>
                        </div>
                    </div>
                    {renderLayout}
                </main>
            </div>
        );
    }
}

AdditionPayment.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired
};

export default AdditionPayment;
