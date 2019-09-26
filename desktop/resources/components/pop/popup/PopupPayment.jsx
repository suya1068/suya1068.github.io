import "../scss/PopupPayment.scss";
import "desktop/resources/components/table/table.scss";
import "mobile/resources/scss/utils/_m-icon.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import Auth from "forsnap-authentication";
import API from "forsnap-api";
import mewtime from "forsnap-mewtime";
import utils from "forsnap-utils";
import tracking from "forsnap-tracking";

import PopModal from "shared/components/modal/PopModal";

import Checkbox from "desktop/resources/components/form/Checkbox";
import Icon from "desktop/resources/components/icon/Icon";
import SlimCalendar from "desktop/resources/components/calendar/SlimCalendar";
import Buttons from "desktop/resources/components/button/Buttons";

class PopupPayment extends Component {
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
            clauseAgree: false,
            accordion_refund: false,
            accordion_info: false,
            accordion_get: false,
            method: [
                { name: "신용카드", value: "card", checked: true },
                { name: "계좌이체", value: "trans", checked: false },
                { name: "무통장 입금", value: "vbank", checked: false }
            ],
            methodStr: {
                card: "신용카드",
                trans: "계좌이체",
                vbank: "무통장 입금"
            },
            user_msg: "",
            calendar: {
                events: props.data.events || [],
                min: toDay.clone().subtract(1).format("YYYY-MM-DD"),
                max: toDay.clone().add(3, mewtime.const.MONTH).format("YYYY-MM-DD"),
                date: date.format("YYYY-MM-DD")
            },
            date: date.format("YYYYMMDD"),
            person: 1,
            receipt: null,
            reserve: null,
            gaData: props.gaData
        };

        this.onScroll = this.onScroll.bind(this);
        this.onSelectOption = this.onSelectOption.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onAgree = this.onAgree.bind(this);
        this.onAgreeClause = this.onAgreeClause.bind(this);
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

        // this.improvedGaForPurchase = this.improvedGaForPurchase.bind(this);
    }

    componentWillMount() {
        // console.log("1 ga", this.state.gaData, this.props.gaData);
        const { option, options, person } = this.props.data;

        if (Array.isArray(options) && options.length > 0) {
            if (option) {
                this.onSelectOption(option, person);
            } else {
                this.onSelectOption(options[0].option_no);
            }
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

    onScroll(e) {
        const aside = this.aside;

        if (aside && e && e.currentTarget) {
            const target = e.currentTarget;
            aside.style.top = `${target.scrollTop}px`;
        }
    }

    /**
     * 상품 옵션 선택
     * @param value - Number (옵션 번호)
     */
    onSelectOption(value, person) {
        const { options, title } = this.props.data;
        const option = options.find(obj => (value === obj.option_no));
        const p = person || option.basic_person * 1;
        const props = {
            selectOption: option,
            person: p,
            price: this.calculPrice(option.price, option.add_price, p, option.basic_person),
            productName: `${title} ${option.option_name}`
        };

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

    onAgreeClause(value) {
        this.setState({
            clauseAgree: value
        });
    }

    /**
     * 향상된 ga 이벤트 For 결제완료
     * @param data
     */
    improvedGaForPurchase(data) {
        window.dataLayer.splice(0, window.dataLayer.length);
        const { category, nick_name } = this.props.data;
        //상품 결제 완료시
        window.dataLayer.push({
            "event": "payment",
            "ecommerce": {
                "purchase": {
                    "actionField": {
                        "id": data.buy_no,
                        "affiliation": "Online Store",
                        "revenue": data.total_price,
                        "tax": "",
                        "shipping": "0",
                        "step": "payment"
                    },
                    "products": [{
                        "name": data.title,
                        "id": data.product_no,
                        "price": data.total_price,
                        "brand": `${data.artist_id}-${nick_name}`,
                        "category": category || ""
                    }]
                }
            }
        });
    }

    /**
     * 결제 진행 - 아임포트
     */
    onPay() {
        const { gaData, isProcess, date, agree_pay, agree_refund, agree_info, agree_get, user_phone, user_email, user_msg, clauseAgree } = this.state;
        let message = "";

        if (!date || date === "") {
            message = "예약일을 선택해주세요";
        } else if (user_phone === "") {
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
        } else if (!isProcess) {
            this.state.isProcess = true;
            PopModal.progress();

            API.reservations.reserveToProduct(this.getReserveToProductParam())
                .then(response => API.reservations.reserveToProductIMP(this.getReserveToProductIMPParam(response.data)))
                .then(response => API.reservations.reserveToProductPay(...this.getReserveToProductPayParam(response)))
                .then(response => {
                    PopModal.closeProgress();
                    const props = {
                        isProcess: false
                    };

                    if (response && response.status === 200) {
                        props.reserve = response.data;
                        tracking.conversion();
                        //console.log("popupPayment", response, this.state);

                        //utils.ad.fbqEvent("Purchase", { value: props.reserve.total_price, currency: "KRW" });
                        //window.fbq("track", "Purchase", { value: props.reserve.total_price, currency: "KRW" });
                        //utils.ad.wcsEvent("1", props.reserve.total_price);
                        // this.wcsEvent(props.reserve.total_price);
                        // this.improvedGaForPurchase(response.data);

                        if (!utils.type.isEmpty(gaData)) {
                            utils.ad.gaEvent(gaData.category, gaData.action, gaData.label);
                        }
                    }
                    this.setState(props);
                })
                .catch(response => {
                    this.setState({
                        isProcess: false
                    }, () => {
                        PopModal.closeProgress();
                        PopModal.alert(response.data ? response.data : response.error_msg);
                    });
                });
        } else {
            message = "이미 결제가 진행중입니다.";
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
        const { product_no } = this.props.data;
        this.setState({
            receipt: data
        });

        return [data.merchant_uid, {
            product_no: product_no * 1,
            pay_uid: data.imp_uid
        }];
    }
    //
    // wcsEvent(price) {
    //     if (wcs && wcs.cnv && wcs_do) {
    //         const _nasa = {};
    //         _nasa["cnv"] = wcs.cnv("1", `${price}`);
    //         wcs_do(_nasa);
    //     }
    // }

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
        const { email, options, product_no } = this.props.data;
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
            methodStr,
            agree_pay,
            agree_refund,
            agree_info,
            agree_get,
            user_msg,
            clauseAgree,
            receipt,
            reserve,
            accordion_refund,
            accordion_info,
            accordion_get
        } = this.state;
        const content = [];

        if (receipt) {
            const isSuccess = !!receipt.success;

            content.push(
                <div key="popup_payment_receipt" className="products__payment__desktop process">
                    <div className="products__payment__content">
                        <div className="products__payment__status">
                            <h1 className="title">{`예약과 결제가 ${isSuccess ? "완료" : "취소"} 되었습니다.`}</h1>
                            <div className="caption">주문번호 : {utils.format.formatByNo(receipt.merchant_uid)}</div>
                        </div>
                        {isSuccess && reserve ? [
                            <div key="receipt_payment" className="products__payment__info">
                                <h1 className="info__title">예약정보</h1>
                                <div className="info__text">
                                    <h4 className="title">촬영날짜</h4>
                                    <div className="text"><span>{mewtime(reserve.reserve_dt).format("YYYY년 MM월 DD일")}</span></div>
                                </div>
                                <div className="info__text">
                                    <h4 className="title">옵션</h4>
                                    <div className="text">
                                        <span>{reserve.title}</span>
                                    </div>
                                </div>
                                <div className="info__text">
                                    <h4 className="title">촬영인원</h4>
                                    <div className="text"><span>{reserve.person_cnt}명</span></div>
                                </div>
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
                                        {user.data.name || user_name}
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
                                        {email || user_email}
                                    </div>
                                </div>
                            </div>,
                            <div key="receipt_buttons" className="products__payment__button">
                                <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "yellow" }} inline={{ href: "/" }}>메인페이지가기</Buttons>
                                {isSuccess && reserve ?
                                    <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ href: `/users/progress/${reserve.pay_type === "vbank" ? "ready" : "payment"}` }}>예약확인하기</Buttons>
                                    : <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ href: `/products/${product_no}` }}>상품페이지가기</Buttons>
                                }
                            </div>] : null
                        }
                    </div>
                </div>
            );
        } else {
            content.push(
                <div key="popup_payment_ready" className="products-detail__goodsInfo" onScroll={this.onScroll}>
                    <div className="container">
                        <div className="multistage">
                            <div className="products__payment__desktop">
                                <div className="products__payment__content">
                                    <div className="products__payment__info">
                                        <h1 className="info__title">날짜선택</h1>
                                        <div className="info__text">
                                            <SlimCalendar {...this.state.calendar} onSelect={obj => this.onSelect(obj, "sCalendar")} />
                                        </div>
                                        <div className="info-alarm-msg">
                                            <div className="msg-row">
                                                <span className="exclamation">!</span>
                                                <span className="text">촬영일이 3개월 이후인 예약 건은 임의 날짜로 예약 후 고객센터로 변경할 날짜를 알려주세요!</span>
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
                                                        <Icon name="check_s" />
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
                                    <div className="products__payment__info">
                                        <h1 className="info__title">예약자 정보</h1>
                                        <div className="info__text">
                                            <h4 className="title">예약자</h4>
                                            <div className="text">
                                                <div className={classNames("box", "disable")}>
                                                    {user.data.name || <input type="text" className="input" value={user_name} onChange={e => this.setState({ user_name: e.currentTarget.value })} maxLength="8" />}
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
                                        <div className="info__text">
                                            <h1 className="title">예약날짜</h1>
                                            <div className="text">{date ? mewtime(mewtime.strToDate(date)).format("YYYY년 M월 D일") : "촬영날짜를 선택해주세요"}</div>
                                        </div>
                                        <div className="info__text">
                                            <h1 className="title">예약인원</h1>
                                            <div className="text">{person}</div>
                                        </div>
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
                    <h2 className="sr-only">예약 결제하기</h2>
                    <div className="products__payment__breadcrumb">
                        <div className={classNames("payment__breadcrumb__process", !receipt ? "active" : "")}>
                            <i className={`m-icon m-icon-won-${!receipt ? "sky" : "gray"}`} />
                            <div className="title">
                                예약 결제하기
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
                    {content}
                </main>
            </div>
        );
    }
}

PopupPayment.propTypes = {
    data: PropTypes.shape([PropTypes.node])
};

export default PopupPayment;
