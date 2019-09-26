import "../scss/products_payment.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import Auth from "forsnap-authentication";
import API from "forsnap-api";
import mewtime from "forsnap-mewtime";
import utils from "forsnap-utils";

import PopModal from "shared/components/modal/PopModal";
import Input from "shared/components/ui/input/Input";

import SlimCalendar from "desktop/resources/components/calendar/SlimCalendar";

class ProductsPayment extends Component {
    constructor(props) {
        super(props);

        const user = Auth.getUser();
        const toDay = mewtime();
        const date = mewtime(props.data.date || "");

        this.state = {
            user,
            isProcess: false,
            user_name: props.data.name || user.data.name || "",
            user_email: props.data.email || "",
            user_phone: props.data.phone || "",
            agree_pay: false,
            agree_refund: false,
            agree_info: false,
            agree_get: false,
            accordion_refund: false,
            accordion_info: false,
            accordion_get: false,
            method: [
                { name: "신용카드", value: "card", checked: true },
                { name: "계좌이체", value: "trans", checked: false },
                { name: "무통장 입금", value: "vbank", checked: false }
            ],
            user_msg: "",
            calendar: {
                events: props.data.calendar || [],
                min: toDay.clone().subtract(1).format("YYYY-MM-DD"),
                max: toDay.clone().add(3, mewtime.const.MONTH).format("YYYY-MM-DD"),
                date: date.format("YYYY-MM-DD")
            },
            date: date.format("YYYYMMDD"),
            gaData: props.gaData
        };

        this.onSelectOption = this.onSelectOption.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onAgree = this.onAgree.bind(this);
        this.onPay = this.onPay.bind(this);
        this.onChangePhone = this.onChangePhone.bind(this);
        this.onChangeMsg = this.onChangeMsg.bind(this);
        this.onPerson = this.onPerson.bind(this);
        this.onAccordion = this.onAccordion.bind(this);

        this.getReserveToProductParam = this.getReserveToProductParam.bind(this);
        this.getReserveToProductIMPParam = this.getReserveToProductIMPParam.bind(this);
        this.getReserveToProductPayParam = this.getReserveToProductPayParam.bind(this);

        this.checkMethod = this.checkMethod.bind(this);
        this.calculPrice = this.calculPrice.bind(this);
    }

    componentWillMount() {
        const { options } = this.props.data;

        if (utils.isArray(options)) {
            this.onSelectOption(options[0].option_no);
        }

        this.checkMethod(this.state.method.find(obj => (obj.checked)));

        utils.loadIMP(result => {
            if (result) {
                IMP.init(__IMP__);
            } else {
                PopModal.alert("결제모듈을 가져오지 못했습니다.\n잠시 후 다시 시도해주세요.\n지속적인 오류시 고객센터로 문의해주세요.");
                this.setState({
                    isProcess: false
                }, () => {
                    PopModal.closeProgress();
                });
            }
        });
    }

    /**
     * 상품 옵션 선택
     * @param value - Number (옵션 번호)
     */
    onSelectOption(value) {
        const { options, nick_name, title } = this.props.data;
        const option = options.find(obj => (value === obj.option_no));
        const props = {
            selectOption: option,
            person: option.basic_person * 1
        };

        props.price = option.price * 1;
        props.productName = `[${nick_name}]${title} ${option.option_name}`;

        this.setState(props);
    }

    /**
     * 날짜선택
     * @param obj
     */
    onSelect(obj) {
        this.setState({
            date: obj.date.clone().format("YYYYMMDD")
        });
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

    /**
     * 결제 진행 - 아임포트
     */
    onPay() {
        const { isProcess, date, agree_pay, agree_refund, agree_info, agree_get, user_phone, user_email, user_msg, gaData } = this.state;

        if (!date || date === "") {
            PopModal.toast("예약일을 선택해주세요");
        } else if (user_phone === "") {
            PopModal.toast("핸드폰 번호를 입력해주세요");
        } else if (user_email.replace(/\s/g, "") === "") {
            PopModal.toast("이메일을 입력해주세요");
        } else if (!utils.isValidEmail(user_email)) {
            PopModal.toast("이메일 형식을 정확하게 입력해주세요");
        } else if (user_msg && utils.domain.includesExceptForsnap(user_msg)) {
            PopModal.alert("요청사항에는\n외부 URL, 일부 특수문자는 사용할 수 없습니다");
        } else if (!agree_pay) {
            PopModal.toast("촬영의 계약조건 및 결재진행 동의에 체크해주세요");
        } else if (!agree_refund) {
            PopModal.toast("환불규정 안내에 대한 동의에 체크해주세요");
        } else if (!agree_info) {
            PopModal.toast("개인정보 제3자 제공 동의에 체크해주세요");
        } else if (!agree_get) {
            PopModal.toast("개인정보 수집 및 이용 동의에 체크해주세요");
        } else if (!isProcess) {
            this.state.isProcess = true;
            PopModal.progress();

            if (!utils.type.isEmpty(gaData)) {
                utils.ad.gaEvent(gaData.category, gaData.action, gaData.label);
            }

            API.reservations.reserveToProduct(this.getReserveToProductParam())
                .then(response => API.reservations.reserveToProductIMP(this.getReserveToProductIMPParam(response.data)))
                .then(response => API.reservations.reserveToProductPay(...this.getReserveToProductPayParam(response)))
                .then(response => {
                    PopModal.alert("예약요청이 완료되었습니다<br />예쁜사진을 남기시길 바래요.");
                    return null;
                })
                .then(response => {
                    this.setState({
                        isProcess: false
                    }, () => {
                        PopModal.closeProgress();
                    });
                })
                .catch(response => {
                    this.setState({
                        isProcess: false
                    }, () => {
                        PopModal.closeProgress();
                        const message = response.data ? response.data : response.error_msg;
                        PopModal.alert(message);
                    });
                });
        } else {
            PopModal.toast("이미 결제가 진행중입니다.");
        }
    }

    /**
     * 예약자 연락처 수정
     */
    onChangePhone(e, n, v) {
        const phone = v.replace(/[\D]+/g, "");

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

    onPerson(isIncrease) {
        const { selectOption, person } = this.state;
        const { price, add_price, basic_person, max_person } = selectOption;
        const props = {
            person
        };

        if (isIncrease && person < (max_person * 1)) {
            props.person += 1;
        } else if (!isIncrease && person > (basic_person * 1)) {
            props.person -= 1;
        }

        props.price = this.calculPrice(price, add_price * 1, props.person, basic_person * 1);

        this.setState(props);
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
     * 예약을 위한 데이터를 가져온다.
     * @returns {null|{product_no: (String|*), date: string, option: (number|*|string), person: number}}
     */
    getReserveToProductParam() {
        const { product_no } = this.props.data;
        const { user_email, user_phone, selectOption, person, date } = this.state;

        const result = {
            product_no: product_no * 1,
            date,
            option_no: selectOption.option_no,
            person,
            phone: user_phone
        };

        if (user_email) {
            result.email = user_email;
        }

        return result;
    }

    /**
     * 아임포트 결제를 위한 Parameter를 가져온다.
     * @param {object} data
     * @returns {{pay_method: *, amount: string, name: (String|*), merchant_uid: (buy_no|{$set}|string), buyer_email: string, buyer_name: string, custom_data: {user_id: string}}}
     */
    getReserveToProductIMPParam(data) {
        const { user, user_name, user_email, user_msg, payMethod, date, price, productName } = this.state;
        const { product_no } = this.props.data;
        const params = {
            pay_method: payMethod.value,
            amount: price,
            name: productName,
            merchant_uid: data.buy_no,
            buyer_email: user_email,
            buyer_name: user_name,
            custom_data: {
                user_id: user.id,
                user_msg
            }
        };

        if (utils.agent.isMobile()) {
            params.m_redirect_url = `${__DOMAIN__}/products/${product_no}/process`;
        }

        if (payMethod.value === "vbank") {
            // 가상계좌 입금 기한은 최대 3일이다.
            // 3일이 남지 않았으면, 예약일 전날 까지 입금해야한다
            const dueDate = mewtime().add(3, mewtime.const.DATE);
            const reserveDate = mewtime(mewtime.strToDate(date));
            params.vbank_due = dueDate.isSameOrBefore(reserveDate, mewtime.const.DATE) ? `${dueDate.format("YYYYMMDD")}2359` : `${reserveDate.format("YYYYMMDD")}2359`;
        }

        return params;
    }

    /**
     * 예약 결제 완료를 위한 Parameter를 가져온다.
     * @param {object} data
     * @returns {[*,*]}
     */
    getReserveToProductPayParam(data) {
        return [data.merchant_uid, {
            product_no: this.state.product_no * 1,
            pay_uid: data.imp_uid
        }];
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
        const { title, nick_name, email, options } = this.props.data;
        const {
            user,
            user_name,
            user_email,
            user_phone,
            selectOption,
            person,
            price,
            date,
            method,
            agree_pay,
            agree_refund,
            agree_info,
            agree_get,
            user_msg,
            accordion_refund,
            accordion_info,
            accordion_get
        } = this.state;
        const isMobile = utils.agent.isMobile();

        return (
            <div className={classNames("products__payment", { is__mobile: isMobile })}>
                <div className="products__payment__header">
                    <div className="payment__header__left" />
                    <div className="payment__header__center">
                        예약 결제하기
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
                    <div className="products__payment__info">
                        <h1 className="info__title">날짜선택</h1>
                        <div className="info__text">
                            <SlimCalendar {...this.state.calendar} onSelect={obj => this.onSelect(obj, "sCalendar")} />
                        </div>
                        <div className="info-alarm-msg">
                            <div className="msg-row">
                                <span className="exclamation">!</span><span className="text">촬영일이 3개월 이후인 예약 건은 임의 날짜로 예약 후 고객센터로 변경할 날짜를 알려주세요!</span>
                            </div>
                        </div>
                    </div>
                    <div className="products__payment__info info__options">
                        <h1 className="info__title">옵션선택</h1>
                        {options.map(obj => {
                            const active = obj.option_no === selectOption.option_no;

                            return (
                                <div className="info__text" key={`payment-option-${obj.option_no}`} onClick={() => this.onSelectOption(obj.option_no)}>
                                    <div className={classNames("info__check", active ? "active" : "")}>
                                        <icon className={active ? "m-icon-check-white" : "m-icon-check"} />
                                    </div>
                                    <h4 className="title">
                                        {obj.option_name}
                                    </h4>
                                    <div className="text">
                                        {`${utils.format.price(obj.price)}원`}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="products__payment__info">
                        <h1 className="info__title">인원선택</h1>
                        <div className="info__person">
                            <button className="minus" onClick={() => this.onPerson(false)}>
                                -
                            </button>
                            <div className="value">
                                {person}
                            </div>
                            <button className="plus" onClick={() => this.onPerson(true)}>
                                +
                            </button>
                        </div>
                    </div>

                    <div className="products__payment__info total__info">
                        <h1 className="info__title">예약정보</h1>
                        <div className="info__text">
                            <h4 className="title">촬영날짜</h4>
                            <div className="text">{date ? mewtime(mewtime.strToDate(date)).format("YYYY년 M월 D일") : "촬영날짜를 선택해주세요"}</div>
                        </div>
                        <div className="info__text">
                            <h4 className="title">상품명</h4>
                            <div className="text">{`[${nick_name}] ${title}`}</div>
                        </div>
                        <div className="info__text">
                            <h4 className="title">옵션</h4>
                            <div className="text">{selectOption.option_name}</div>
                        </div>
                        <div className="info__text">
                            <h4 className="title">촬영인원</h4>
                            <div className="text">{person}</div>
                        </div>
                        <div className="info__text">
                            <h4 className="title">최종 결제금액</h4>
                            <div className="text"><span className="price">{utils.format.price(price)}</span><span>원</span></div>
                        </div>
                    </div>
                    <div className="products__payment__info">
                        <h1 className="info__title">예약자 정보</h1>
                        <div className="info__text">
                            <h4 className="title">예약자</h4>
                            <div className="text">
                                {user.data.name || <Input type="text" className="text-right" value={user_name} onChange={(e, n, v) => this.setState({ user_name: v })} max="8" />}
                            </div>
                        </div>
                        <div className="info__text">
                            <h4 className="title">핸드폰</h4>
                            <div className="text">
                                <Input type="tel" className="text-right" value={user_phone} onChange={this.onChangePhone} max="11" placeholder="- 없이 번호만 입력해주세요." />
                            </div>
                        </div>
                        <div className="info__text">
                            <h4 className="title">이메일</h4>
                            <div className="text">
                                {email || <Input type="email" className="text-right" value={user_email} onChange={(e, n, v) => this.setState({ user_email: v })} max="50" />}
                            </div>
                        </div>
                        <div className="info__text">
                            <h4 className="title">요청사항<span className="max-length">{user_msg.length}/100</span></h4>
                            <div className="text">
                                <textarea className="textarea" rows="5" onChange={this.onChangeMsg} placeholder="남기고 싶은말을 적어주세요." maxLength="100" value={user_msg} />
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
                    <div className="products__payment__button">
                        <button className="button button-block button__circle button__theme__yellow" onClick={this.onPay}><span className="price">{utils.format.price(price)}</span>원 결제하기</button>
                    </div>
                </div>
            </div>
        );
    }
}


/**
 * title, nick_name, phone, email, date, events, options, product_no
 */
ProductsPayment.propTypes = {
    data: PropTypes.shape([PropTypes.node])
};

export default ProductsPayment;
