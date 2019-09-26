import "./scss/PopupProductPayment.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import API from "forsnap-api";
import auth from "forsnap-authentication";
import mewtime from "forsnap-mewtime";
import utils from "forsnap-utils";

import { EXTRA_OPTION } from "shared/constant/package.const";
import PopModal from "shared/components/modal/PopModal";
import Input from "shared/components/ui/input/Input";

import SlimCalendar from "desktop/resources/components/calendar/SlimCalendar";
import Qty from "desktop/resources/components/form/Qty";

class PopupProductPayment extends Component {
    constructor(props) {
        super(props);

        const user = auth.getUser();
        const toDay = mewtime();
        const date = mewtime(props.data.date || "");

        this.state = {
            packageList: props.data.packageList,
            user_name: props.data.name || user.data.name || "",
            user_email: props.data.email || "",
            user_phone: props.data.phone || "",
            user_msg: "",
            calendar: {
                events: props.data.calendar || [],
                min: toDay.clone().subtract(1).format("YYYY-MM-DD"),
                max: toDay.clone().add(3, mewtime.const.MONTH).format("YYYY-MM-DD"),
                date: date.format("YYYY-MM-DD")
            },
            date: date.format("YYYYMMDD"),
            method: [
                { name: "신용카드", value: "card", checked: true },
                { name: "계좌이체", value: "trans", checked: false },
                { name: "무통장 입금", value: "vbank", checked: false }
            ],
            paymentName: "",
            agree_pay: false,
            agree_refund: false,
            agree_info: false,
            agree_get: false,
            accordion_refund: false,
            accordion_info: false,
            accordion_get: false,
            // clauseAgree: false,
            isProcess: false,
            gaData: props.gaData
        };

        this.onSelectDate = this.onSelectDate.bind(this);
        this.onAgreeClause = this.onAgreeClause.bind(this);
        this.onSelectPackage = this.onSelectPackage.bind(this);
        this.onSelectOption = this.onSelectOption.bind(this);
        this.onChangePackageCount = this.onChangePackageCount.bind(this);
        this.onChangeCount = this.onChangeCount.bind(this);
        this.onChangePhone = this.onChangePhone.bind(this);
        this.onChangeMsg = this.onChangeMsg.bind(this);
        this.onAccordion = this.onAccordion.bind(this);
        this.onAgree = this.onAgree.bind(this);
        this.onPay = this.onPay.bind(this);

        this.getTotalPrice = this.getTotalPrice.bind(this);
        this.getIMPParam = this.getIMPParam.bind(this);

        this.isUser = this.isUser.bind(this);
        this.checkMethod = this.checkMethod.bind(this);
        // this.wcsEvent = this.wcsEvent.bind(this);

        this.layoutPayment = this.layoutPayment.bind(this);
    }

    componentWillMount() {
        this.checkMethod(this.state.method.find(obj => (obj.checked)));

        utils.loadIMP(result => {
            if (result) {
                IMP.init(__IMP__);
            } else {
                PopModal.alert("결제모듈을 가져오지 못했습니다.\n잠시 후 다시 시도해주세요.\n지속적인 오류시 고객센터로 문의해주세요.");
            }
        });
    }

    /**
     * 날짜선택
     * @param obj
     */
    onSelectDate(obj) {
        this.setState({
            date: obj.date.clone().format("YYYYMMDD")
        });
    }

    onAgreeClause(value) {
        this.setState({
            clauseAgree: value
        });
    }

    onSelectPackage(no) {
        const { packageList } = this.state;

        const result = packageList.reduce((resultPackage, p, i) => {
            const selected = i === no;
            p.selected = selected;

            // if (!selected) {
            //     p.optionList.reduce((resultOption, o) => {
            //         o.selected = false;
            //         o.count = 0;
            //         o.total_price = o.price;
            //         resultOption.push(o);
            //         return resultOption;
            //     }, []);
            // }

            resultPackage.push(p);
            return resultPackage;
        }, []);

        this.setState({
            packageList: result
        });
    }

    onSelectOption(code, checked = true) {
        const { packageList } = this.state;

        if (utils.isArray(packageList)) {
            const pkg = packageList.find(p => (p.selected));

            if (pkg) {
                const item = pkg.optionList.find(o => (o.code === code));

                if (item) {
                    if (checked && item.selected !== checked) {
                        item.count = 1;
                    } else if (!checked) {
                        item.count = 0;
                    }
                    item.total_price = item.count * item.price;
                    item.selected = checked;
                }

                this.setState({
                    packageList
                });
            }
        }
    }

    onChangePackageCount(num) {
        const { packageList } = this.state;

        if (utils.isArray(packageList)) {
            const pkg = packageList.find(p => (p.selected));

            if (pkg) {
                pkg.count = num;
                pkg.total_price = num > 0 ? pkg.price * num : 0;

                this.setState({
                    packageList
                });
            }
        }
    }

    onChangeCount(num, code) {
        const { packageList } = this.state;

        if (utils.isArray(packageList)) {
            const pkg = packageList.find(p => (p.selected));

            if (pkg) {
                const item = pkg.optionList.find(o => (o.code === code));

                if (item) {
                    if (!item.selected && num > 0) {
                        item.selected = true;
                    } else if (item.selected && num < 1) {
                        item.selected = false;
                    }

                    item.count = num;
                    item.total_price = num > 0 ? item.price * num : 0;
                }

                this.setState({
                    packageList
                });
            }
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

    onAccordion(key, value) {
        this.setState({
            accordion_refund: false,
            accordion_info: false,
            accordion_get: false,
            [key]: !value
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
        const {
            isProcess,
            date,
            agree_pay,
            agree_refund,
            agree_info,
            agree_get,
            user_phone,
            user_email,
            user_msg,
            packageList,
            gaData
        } = this.state;

        const { product_no } = this.props.data;
        let message = "";

        const pkg = packageList.find(p => (p.selected));
        const totalPrice = this.getTotalPrice();
        const user = this.isUser();

        if (!user) {
            return;
        }

        if (!date || date === "") {
            message = "예약일을 선택해주세요.";
        } else if (!pkg) {
            message = "예약하실 패키지를 선택해주세요.";
        } else if (user_phone === "") {
            message = "핸드폰 번호를 입력해주세요.";
        } else if (user_email.replace(/\s/g, "") === "") {
            message = "이메일을 입력해주세요.";
        } else if (!utils.isValidEmail(user_email)) {
            message = "이메일 형식을 정확하게 입력해주세요.";
        } else if (user_msg && utils.domain.includesExceptForsnap(user_msg)) {
            message = "요청사항에는\n외부 URL, 일부 특수문자는 사용할 수 없습니다.";
        } else if (!agree_pay) {
            message = "촬영의 계약조건 및 결재진행 동의에 체크해주세요.";
        } else if (!agree_refund) {
            message = "환불규정 안내에 대한 동의에 체크해주세요.";
        } else if (!agree_info) {
            message = "개인정보 제3자 제공 동의에 체크해주세요.";
        } else if (!agree_get) {
            message = "개인정보 수집 및 이용 동의에 체크해주세요.";
        } else if (totalPrice < pkg.min_price) {
            message = `${utils.format.price(pkg.min_price)}원 이상 진행 가능한 상품입니다.`;
        } else if (!isProcess) {
            this.state.isProcess = true;
            PopModal.progress();

            const readyParams = {
                product_no,
                date,
                package_no: pkg.package_no,
                // extra_no: ""
                // custom_no: ""
                phone: user_phone,
                email: user_email
            };

            let optionCnt = 0;

            if (pkg.count) {
                readyParams.package_count = pkg.count;
            }

            if (utils.isArray(pkg.optionList)) {
                const option = pkg.optionList.reduce((rs, o) => {
                    if (o.selected) {
                        if (o.extra_no) {
                            rs.extra.push({
                                extra_no: o.extra_no,
                                count: o.count
                            });
                        } else {
                            rs.custom.push({
                                custom_no: o.custom_no,
                                count: o.count
                            });
                        }
                    }
                    return rs;
                }, { extra: [], custom: [] });

                if (utils.isArray(option.extra)) {
                    optionCnt += option.extra.length;
                    readyParams.extra_option = JSON.stringify(option.extra);
                }

                if (utils.isArray(option.custom)) {
                    optionCnt += option.custom.length;
                    readyParams.custom_option = JSON.stringify(option.custom);
                }
            }

            this.state.paymentName = `${pkg.title}${optionCnt > 0 ? ` 외 옵션 ${optionCnt}개` : ""}`;
            API.reservations.reserveToPackage(readyParams).then(response => {
                if (!utils.type.isEmpty(gaData)) {
                    utils.ad.gaEvent(gaData.category, gaData.action, gaData.label);
                }
                return API.reservations.reserveToProductIMP(this.getIMPParam(response.data));
            })
            .catch(error => {
                PopModal.closeProgress();
                this.setState({
                    isProcess: false
                }, () => {
                    PopModal.alert(error.data ? error.data : error.error_msg);
                });
            });
        } else {
            message = "이미 결제가 진행중입니다.";
        }

        if (message) {
            PopModal.toast(message);
        }
    }

    getTotalPrice() {
        const { packageList } = this.state;
        let totalPrice = 0;

        if (utils.isArray(packageList)) {
            totalPrice = packageList.reduce((tot, p) => {
                if (p.selected) {
                    tot = Number(p.total_price) || 0;
                    if (utils.isArray(p.optionList)) {
                        p.optionList.reduce((rs, o) => {
                            if (!o.code) {
                                return rs;
                            }

                            tot += o.total_price;
                            return rs;
                        }, null);
                    }
                }

                return tot;
            }, 0);
        }

        return totalPrice;
    }

    /**
     * 아임포트 결제를 위한 Parameter를 가져온다.
     * @param {object} data
     * @returns {{pay_method: *, amount: string, name: (String|*), merchant_uid: (buy_no|{$set}|string), buyer_email: string, buyer_name: string, custom_data: {user_id: string}}}
     */
    getIMPParam(data) {
        const { user_name, user_email, user_msg, payMethod, date, paymentName } = this.state;
        const { product_no } = this.props.data;
        const user = this.isUser(false);

        const params = {
            pay_method: payMethod.value,
            amount: data.total_price,
            name: paymentName,
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
     * 로그인 확인
     * @return Object - 유저정보
     */
    isUser(isAlert = true) {
        const user = auth.getUser();

        if (!user) {
            if (isAlert) {
                PopModal.alert("로그인 후 이용해주세요");
            }

            return false;
        }

        return user;
    }

    /**
     * 결제방법 변경
     * @param method
     */
    checkMethod(method) {
        const methodList = this.state.method;
        const m = methodList.reduce((r, obj) => {
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

    layoutPayment() {
        const { name, email, phone } = this.props.data;
        const {
            packageList,
            calendar,
            date,
            agree_pay,
            agree_refund,
            agree_info,
            agree_get,
            accordion_refund,
            accordion_info,
            accordion_get,
            user_name,
            user_email,
            user_phone,
            user_msg,
            method
        } = this.state;
        let totalPrice = null;

        return (
            <div className="layout__body">
                <div className="layout__body__main">
                    <div className="layer">
                        <div className="layer__body">
                            <div className="layer__container">
                                <div className="layer__border reserve__date">
                                    <div className="layer__column">
                                        <h2 className="text__header padding__default">
                                            날짜선택
                                        </h2>
                                        <div className="hr" />
                                        <div className="layer__row padding__default">
                                            <div className="text__content">
                                                <SlimCalendar {...calendar} onSelect={this.onSelectDate} />
                                            </div>
                                        </div>
                                        <div className="info-alarm-msg">
                                            <div className="msg-row">
                                                <span className="exclamation">!</span>
                                                <span className="text">촬영일이 3개월 이후인 예약 건은 임의 날짜로 예약 후 고객센터로 변경할 날짜를 알려주세요!</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {packageList.map((p, i) => {
                                    const isExcept = ["PRODUCT", "FOOD", "FASHION"].indexOf(p.category) !== -1;
                                    if (p.selected) {
                                        totalPrice = Number(p.total_price) || 0;
                                    }

                                    return [
                                        <div key={`products-options-${i}`} className="layer__row">
                                            <div className={classNames("products__options__item", { show: p.selected })}>
                                                <div className="option__title" onClick={() => this.onSelectPackage(i)}>
                                                    <span className="title">{p.title}</span>
                                                    <span className="price"><span className="won">₩</span>{utils.format.price(p.price)}</span>
                                                    <span className="arrow"><icon className="f__icon__dt" /></span>
                                                </div>
                                                <div className="option__detail">
                                                    {p.category !== "DRESS_RENT" ?
                                                        <div className="option__info">
                                                            {p.photo_cnt ?
                                                                <div className="info__item">
                                                                    <div className="title"><icon className="f__icon__opt_print" />최소컷수</div>
                                                                    <div className="content">{utils.format.price(p.photo_cnt)} 장</div>
                                                                </div> : null
                                                            }
                                                            {p.custom_cnt ?
                                                                <div className="info__item">
                                                                    <div className="title"><icon className="f__icon__opt_custom" />보정</div>
                                                                    <div className="content">{p.custom_cnt > 0 ? `${utils.format.price(p.custom_cnt)} 장` : "없음"}</div>
                                                                </div> : null
                                                            }
                                                            {p.photo_time ?
                                                                <div className="info__item">
                                                                    <div className="title"><icon className="f__icon__opt_origin" />촬영시간</div>
                                                                    <div className="content">{p.photo_time === "MAX" ? "300분 이상" : `${p.photo_time || "-"} 분`}</div>
                                                                </div> : null
                                                            }
                                                            {p.min_price || p.min_price === 0 ?
                                                                <div key="package-min-price" className="info__item">
                                                                    <div className="title">최소진행금액</div>
                                                                    <div className="content">{`${utils.format.price(p.min_price)}원` || "없음"}</div>
                                                                </div> : null
                                                            }
                                                            {p.running_time ?
                                                                <div key="package-min-price" className="info__item">
                                                                    <div className="title">러닝타임</div>
                                                                    <div className="content">{`${p.running_time || "-"} 분`}</div>
                                                                </div> : null
                                                            }
                                                        </div> : null
                                                    }
                                                    <div className="option__content">
                                                        {utils.linebreak(p.content || "")}
                                                    </div>
                                                    <div className="option__info">
                                                        <div className="info__basic">
                                                            <div className="title"><icon className="f__icon__calendar_s" />{p.category === "DRESS_RENT" ? "대여기간" : "작업일"}</div>
                                                            <div className="content">{p.complete_period} 일</div>
                                                            {isExcept ?
                                                                <div className="qty">
                                                                    <Qty count={p.count || 1} min={1} max={9999} resultFunc={num => this.onChangePackageCount(num)} />
                                                                </div> : null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>,
                                        p.selected && utils.isArray(p.optionList) ? [
                                            <div key={`products-options-list-${i}`} className="layer__row">
                                                <div className="products__options__checkbox">
                                                    {p.optionList.map(o => {
                                                        if (!o.code) {
                                                            return null;
                                                        }

                                                        const exItem = EXTRA_OPTION.find(constEx => {
                                                            return constEx.code === o.code;
                                                        });
                                                        const opContent = exItem ? exItem.user_tooltip || "" : o.content;
                                                        totalPrice += o.total_price;
                                                        return (
                                                            <div key={`option-select-${o.code}`} className="products__options__checkbox__item">
                                                                <div>
                                                                    <div className="title">
                                                                        <div className="layer__row auto__flex">
                                                                            <button className={classNames("button__check", o.selected ? "active" : "")} onClick={() => this.onSelectOption(o.code, !o.selected)}>
                                                                                <div className="icon__circle">
                                                                                    <span className={classNames("m-icon", o.selected ? "m-icon-check-white" : "m-icon-check")} />
                                                                                </div>
                                                                                <span>{o.title}</span>
                                                                            </button>
                                                                        </div>
                                                                        <div className="price">
                                                                            <span><span className="won">₩</span>{utils.format.price(o.price)}</span>
                                                                        </div>
                                                                    </div>
                                                                    {o.selected ?
                                                                        <div className="option__content">
                                                                            <div className="content">{opContent}</div>
                                                                            <div className="qty">
                                                                                <Qty count={o.count || 0} min={0} max={9999} resultFunc={num => this.onChangeCount(num, o.code)} />
                                                                            </div>
                                                                        </div> : null
                                                                    }
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ] : null
                                    ];
                                })}
                                <div className="layer__border">
                                    <div className="layer__column text-right">
                                        <div className="layer__row padding__default">
                                            <h2 className="text__header">
                                                예약자
                                            </h2>
                                            <div>
                                                {name || <Input type="text" className="text-right" value={user_name} onChange={(e, n, v) => this.setState({ user_name: v })} max="8" />}
                                            </div>
                                        </div>
                                        <div className="hr" />
                                        <div className="layer__row padding__default">
                                            <h2 className="text__header">
                                                핸드폰
                                            </h2>
                                            <div>
                                                <Input className="text-right" type="tel" value={user_phone} onChange={this.onChangePhone} max="11" placeholder="- 없이 번호만 입력해주세요." />
                                            </div>
                                        </div>
                                        <div className="hr" />
                                        <div className="layer__row padding__default">
                                            <h2 className="text__header">
                                                이메일
                                            </h2>
                                            <div>
                                                {email || <Input type="email" className="text-right" value={user_email} onChange={(e, n, v) => this.setState({ user_email: v })} max="50" />}
                                            </div>
                                        </div>
                                        <div className="hr" />
                                        <div className="layer__row padding__default">
                                            <h2 className="text__header">
                                                요청사항
                                            </h2>
                                            <div>
                                                <textarea
                                                    placeholder="남기고 싶은말을 적어주세요."
                                                    maxLength="100"
                                                    rows="5"
                                                    value={user_msg}
                                                    onChange={this.onChangeMsg}
                                                />
                                                <div className="f__textarea__length text-right">
                                                    {user_msg.length || 0} / 100
                                                </div>
                                            </div>
                                        </div>
                                        <div className="layer__row auto__flex align__center caption__content padding__half">
                                            <span className="exclamation">!</span>
                                            <span>결제 완료 후 연락처가 작가에게 공개됩니다.</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="layer__border">
                                    <div className="layer__column padding__default">
                                        <h2 className="text__header">
                                            결제방법 선택
                                        </h2>
                                        <div className="text__content">
                                            <div className="layer__row">
                                                {method.map(m => {
                                                    return (
                                                        <button
                                                            key={`pay-method-${m.value}`}
                                                            className={classNames("f__button f__button__theme__select__pink", m.checked ? "active" : "")}
                                                            onClick={() => this.checkMethod(m)}
                                                        >{m.name}</button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="layer__border">
                                    <div className="layer__column">
                                        <h2 className="text__header padding__default">
                                            환불규정 안내
                                        </h2>
                                        <div className="hr" />
                                        <div className="products__payment__info">
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
                                    </div>
                                </div>
                                <div className="layer__border">
                                    <div className="layer__column">
                                        <div className="layer__row padding__default">
                                            <h2 className="text__header">
                                                서비스 동의
                                            </h2>
                                            <div className="text-right">
                                                <a className={classNames("policy__all__check", "agree__button", agree_pay && agree_refund && agree_info && agree_get ? "checked" : "")} role="button" onClick={() => this.onAgree("all")}>
                                                    <strong>전체 동의</strong>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="hr" />
                                        <div className="products__payment__info">
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
                                    </div>
                                </div>
                                <div className="layer__border">
                                    <div className="layer__column">
                                        <h2 className="text__header padding__default">
                                            세금계산서 안내
                                        </h2>
                                        <div className="hr" />
                                        <div className="info__policy">
                                            <div className="policy__text">
                                                세금계산서를 발행해야 하는 경우 대화하기를 통해 작가님에게 발급 가능여부를 확인하여야 합니다.<br /><br />
                                                현금영수증은 ‘개인소득공제용’으로만 사용하실 수 있으며 발급당시 ‘지출증빙용’을 선택하셨더라도 매입세액공제를 받지 못합니다.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="layer__container">
                                    <div className="layer__border overflow__hidden">
                                        <div className="layer__row">
                                            <button className="f__button f__button__theme__yellow padding__default" onClick={this.onPay}>
                                                {totalPrice ? `₩${utils.format.price(totalPrice)} ` : ""}결제하기
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
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
                    <div className="popup__product__payment">
                        <div className="layout">
                            {this.layoutPayment()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// <div className="layer__column">
//     <div className="agree__clause">
//         <div className="title">
//             주문하실 상품을 확인하였으며, 구매에 동의하시겠습니까?
//         </div>
//         <div className="content">
//             <span className={classNames("policy__agree", "agree__button", clauseAgree ? "checked" : "")} onClick={() => this.onAgreeClause(!clauseAgree)}>
//                 <strong>동의합니다.</strong> (전자상거래법 제8조 제2항)
//             </span>
//         </div>
//     </div>
// </div>

PopupProductPayment.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired
};

export default PopupProductPayment;
