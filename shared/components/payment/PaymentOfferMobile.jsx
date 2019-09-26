import "./scss/PaymentOffer.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import API from "forsnap-api";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";
import tracking from "forsnap-tracking";
import redirect from "forsnap-redirect";
import auth from "forsnap-authentication";

import PopModal from "shared/components/modal/PopModal";
import payment from "shared/components/payment/Payment";
import { STATE as RES_STATE } from "shared/components/quotation/response/QuotationResponse";
import SlimCalendar from "desktop/resources/components/calendar/SlimCalendar";
import FInput from "shared/components/ui/input/FInput";

class PaymentOfferMobile extends Component {
    constructor(props) {
        super(props);

        const toDay = mewtime();
        const date = mewtime(props.data.date || "");

        this.state = {
            isProcess: false,
            user_name: "",
            user_phone: "",
            user_email: "",
            agree_pay: false,
            agree_refund: false,
            agree_info: false,
            agree_get: false,
            accordion_refund: false,
            accordion_info: false,
            accordion_get: false,
            method: payment.getPayMethod(),
            calendar: {
                events: props.data.events || [],
                min: toDay.clone().subtract(1).format("YYYY-MM-DD"),
                max: toDay.clone().add(3, mewtime.const.MONTH).format("YYYY-MM-DD"),
                date: date.format("YYYY-MM-DD")
            },
            reserve_dt: ""
        };

        this.onPay = this.onPay.bind(this);
        this.onAgree = this.onAgree.bind(this);
        this.onSelectDate = this.onSelectDate.bind(this);
        this.onChangePhone = this.onChangePhone.bind(this);
        this.onAccordion = this.onAccordion.bind(this);

        this.checkMethod = this.checkMethod.bind(this);
    }

    componentWillMount() {
        this.checkMethod(this.state.method.find(obj => (obj.checked)));

        payment.loadIMP(() => {
            IMP.init(__IMP__);
        });
    }

    componentDidMount() {
        const user = auth.getUser();
        PopModal.progress();

        API.users.find(user.id).then(response => {
            PopModal.closeProgress();
            const data = response.data;
            payment.setUserInfo({
                name: data.name,
                phone: data.phone,
                email: data.email
            });
            this.setState({
                user_name: data.name || "",
                user_phone: data.phone || "",
                user_email: data.email || ""
            });
        });
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
     * 결제 진행 - 아임포트
     */
    onPay() {
        const { date, payMethod, agree_pay, agree_refund, agree_info, agree_get, user_name, user_phone, user_email } = this.state;
        const { offer_no, title, redirect_url } = this.props.data;

        if (user_phone === "") {
            PopModal.toast("핸드폰 번호를 입력해주세요");
        } else if (user_email.replace(/\s/g, "") === "") {
            PopModal.toast("이메일을 입력해주세요");
        } else if (!utils.isValidEmail(user_email)) {
            PopModal.toast("이메일 형식을 정확하게 입력해주세요");
        } else if (!utils.isDate(date)) {
            PopModal.alert("촬영일을 선택해주세요");
        } else if (!agree_pay) {
            PopModal.toast("촬영의 계약조건 및 결재진행 동의에 체크해주세요");
        } else if (!agree_refund) {
            PopModal.toast("환불규정 안내에 대한 동의에 체크해주세요");
        } else if (!agree_info) {
            PopModal.toast("개인정보 제3자 제공 동의에 체크해주세요");
        } else if (!agree_get) {
            PopModal.toast("개인정보 수집 및 이용 동의에 체크해주세요");
        } else {
            payment.readyToEstimate(offer_no, date, payMethod, title, redirect_url)
                .then(params => {
                    if (params) {
                        PopModal.progress();
                        payment.payment(params).then(result => {
                            if (result) {
                                if (result.success) {
                                    API.reservations.reserveToProductPay(result.merchant_uid, { pay_uid: result.imp_uid }).then(response => {
                                        PopModal.closeProgress();
                                        if (response.status === 200) {
                                            tracking.conversion();
                                            //window.fbq("track", "Purchase", { value: params.amount, currency: "KRW" });

                                            PopModal.alert(
                                                "예약요청이 완료되었습니다.\n예약내용은 마이페이지 > 진행상황에서 확인가능합니다.",
                                                {
                                                    callBack: () => {
                                                        redirect.myProgressType("ready");
                                                    }
                                                }
                                            );
                                        }
                                    }).catch(error => {
                                        PopModal.closeProgress();
                                        const message = error.data ? error.data : error.error_msg;
                                        PopModal.alert(message);
                                    });
                                } else {
                                    PopModal.closeProgress();
                                    PopModal.alert(result.error_msg);
                                }
                            } else {
                                PopModal.closeProgress();
                            }
                        }).catch(error => {
                            PopModal.closeProgress();
                            PopModal.alert("요청서가 미노출이거나\n견적서를 이미 결재하셨습니다.");
                        });
                    } else {
                        PopModal.closeProgress();
                        PopModal.alert("결제 준비중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.\n지속적인 오류시 고객센터로 문의해주세요.");
                    }
                });
        }
    }

    /**
     * 서비스 동의 체크
     * @param key
     */
    onAgree(key) {
        const { agree_pay, agree_refund, agree_info, agree_get } = this.state;
        const prop = {};

        switch (key) {
            case "agree_pay": prop.agree_pay = !agree_pay; break;
            case "agree_refund": prop.agree_refund = !agree_refund; break;
            case "agree_info": prop.agree_info = !agree_info; break;
            case "agree_get": prop.agree_get = !agree_get; break;
            case "all": prop.agree_pay = true; prop.agree_refund = true; prop.agree_info = true; prop.agree_get = true; break;
            default: break;
        }

        this.setState(prop);
    }

    onSelectDate(data) {
        this.setState({
            date: data.date.format("YYYYMMDD")
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

    /**
     * 결제방법 변경
     * @param method
     */
    checkMethod(method) {
        const m = this.state.method.reduce((r, obj) => {
            if (method.value === obj.value) {
                obj.checked = true;
            } else {
                obj.checked = false;
            }
            r.push(obj);
            return r;
        }, []);

        this.setState({
            method: m,
            payMethod: method
        });
    }

    render() {
        const { option, price } = this.props.data;
        const {
            date,
            reserve_dt,
            method,
            user_name,
            user_phone,
            user_email,
            agree_pay,
            agree_refund,
            agree_info,
            agree_get,
            accordion_refund,
            accordion_info,
            accordion_get
        } = this.state;

        const totalPrice = option.reduce((r, o) => {
            r += o[RES_STATE.OPTION_PRICE.PRICE] * 1;
            return r;
        }, 0);

        const isMobile = utils.agent.isMobile();

        return (
            <div className={classNames("products__payment__mobile", { is__mobile: isMobile })}>
                <div className="products__payment__header">
                    <div className="payment__header__left" />
                    <div className="payment__header__center">
                        결제하기
                    </div>
                    <div className="payment__header__right">
                        <button className="f__button__close close__small theme__black" onClick={() => PopModal.close()} />
                    </div>
                </div>
                <div className="products__payment__breadcrumb">
                    <div className="payment__breadcrumb__process active">
                        결제하기
                    </div>
                    <div className="payment__breadcrumb__bar">
                        &gt;
                    </div>
                    <div className="payment__breadcrumb__complete">
                        주문완료
                    </div>
                </div>
                <div className="products__payment__content">
                    {!utils.isDate(reserve_dt) ?
                        <div className="products__payment__info">
                            <h1 className="info__title">날짜선택</h1>
                            <div className="info__text">
                                <SlimCalendar {...this.state.calendar} onSelect={this.onSelectDate} />
                            </div>
                            <div className="info-alarm-msg">
                                <div className="msg-row">
                                    <span className="exclamation">!</span>
                                    <span className="text">촬영일이 3개월 이후인 예약 건은 임의 날짜로 예약 후 고객센터로 변경할 날짜를 알려주세요!</span>
                                </div>
                            </div>
                        </div> : null
                    }
                    <div className="products__payment__info total__info">
                        <h1 className="info__title">예약정보</h1>
                        {utils.isDate(reserve_dt) ?
                            <div>
                                <div className="info__text">
                                    <h4 className="title">촬영일</h4>
                                    <div className="text">{`${reserve_dt.substr(0, 4)}년 ${reserve_dt.substr(4, 2)}월 ${reserve_dt.substr(6, 2)}일`}</div>
                                </div>
                                <div className="info__text hr" />
                            </div> : null
                        }
                        {option && Array.isArray(option) && option.length > 0 ?
                            option.map((op, i) => {
                                return (
                                    <div key={`option_${i}`}>
                                        <div className="info__text">
                                            <h4 className="title">{op[RES_STATE.OPTION_PRICE.NAME]}</h4>
                                            <div className="text">{utils.format.price(op[RES_STATE.OPTION_PRICE.PRICE])}</div>
                                        </div>
                                        <div className="info__text hr" />
                                    </div>
                                );
                            }) : null
                        }
                        <div className="info__text">
                            <h4 className="title">최종 결제금액</h4>
                            <div className="text"><span className="price">{utils.format.price(totalPrice)}</span><span>원</span></div>
                        </div>
                    </div>
                    <div className="products__payment__info">
                        <h1 className="info__title">예약자 정보</h1>
                        <div className="info__text">
                            <h4 className="title">예약자</h4>
                            <div className="text">
                                <span className="box disable">
                                    {user_name}
                                </span>
                            </div>
                        </div>
                        <div className="info__text">
                            <h4 className="title">핸드폰</h4>
                            <div className="text">
                                <input
                                    type="tel"
                                    value={user_phone}
                                    onChange={this.onChangePhone}
                                    maxLength="11"
                                />
                            </div>
                        </div>
                        <div className="info__text">
                            <h4 className="title">이메일</h4>
                            <div className="text">
                                <input
                                    type="email"
                                    value={user_email}
                                    onChange={e => this.setState({ user_email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="info-alarm-msg">
                            <div className="msg-row">
                                <span className="exclamation">!</span><span className="text">결제 완료 후 연락처가 작가에게 공개됩니다.</span>
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
                            <div className={classNames("m-icon", "m-icon-up", "policy__accordion__button", accordion_refund ? "accordion__down" : "")} onClick={() => this.onAccordion("accordion_refund", accordion_refund)} />
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
                            <div className={classNames("m-icon", "m-icon-up", "policy__accordion__button", accordion_info ? "accordion__down" : "")} onClick={() => this.onAccordion("accordion_info", accordion_info)} />
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
                            <div className={classNames("m-icon", "m-icon-up", "policy__accordion__button", accordion_get ? "accordion__down" : "")} onClick={() => this.onAccordion("accordion_get", accordion_get)} />
                        </div>
                        <div className={classNames("info__policy", "policy__accordion", accordion_get ? "accordion__down" : "")}>
                            {utils.agent.isMobile() ?
                                <div className="policy__text">
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <td>수집하는 개인정보 항목</td>
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
                                        </tr>
                                        </tbody>
                                    </table>
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <td>수집 및 이용목적</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
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
                                        </tr>
                                        </tbody>
                                    </table>
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <td>보유 및 이용기간</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td className="text-justify">
                                                이용 목적을 위해 한시적으로 보유하고 목적 달성시 개인정보는 파기됩니다. 하지만 관계 법령 등으로 보존 필요가 있는 경우 일정 기간 보관합니다.
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div> :
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
                            }
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
                    <div className="products__payment__button">
                        <button onClick={this.onPay}>
                            <span className="price">{utils.format.price(Number(price))}</span>원 결제하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

PaymentOfferMobile.popTypes = {};
PaymentOfferMobile.defaultProps = {};

export default PaymentOfferMobile;
