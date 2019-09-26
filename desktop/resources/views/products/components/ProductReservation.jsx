import "../scss/product_reservation.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import redirect from "forsnap-redirect";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";
import tracking from "forsnap-tracking";
import Auth from "forsnap-authentication";
import API from "forsnap-api";
import PopSendChat from "./PopSendChat";

import SlimCalendar from "desktop/resources/components/calendar/SlimCalendar";
import Qty from "desktop/resources/components/form/Qty";
import Dropdown from "desktop/resources/components/form/Dropdown";
import PopDownContent from "desktop/resources/components/pop/popdown/PopDownContent";
import Buttons from "desktop/resources/components/button/Buttons";
import PopModal from "shared/components/modal/PopModal";
import Input from "desktop/resources/components/form/Input";
import Icon from "desktop/resources/components/icon/Icon";

import PopupPayment from "desktop/resources/components/pop/popup/PopupPayment";

/**
 * 사용하지 않은 컴포넌트 date : 19.04.10
 */
class ProductReservation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            user: Auth.getUser(),
            no: this.props.no,
            productName: this.props.title,
            events: this.props.events,
            isLike: this.props.isLike === "Y",
            artistId: this.props.artistId,
            msg: "",
            services: this.props.options.map(d => {
                return {
                    name: d.option_name,
                    value: d.option_no,
                    price: d.price * 1,
                    addPrice: d.add_price * 1,
                    basicPerson: d.basic_person * 1,
                    maxPerson: d.max_person * 1
                };
            }),
            payMethod: null,
            selectedService: null,
            //date: mewtime().add(1).format("YYYY-MM-DD"),
            date: "",
            person: "",
            price: "",
            option: "",
            clauseAgree: false,
            ////////////////////////
            callBack: undefined,
            phone: "",
            email: "",
            isProcess: false,
            isQuick: false
        };

        this.isLogIn = this.isLogIn.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.changeServiceType = this.changeServiceType.bind(this);
        this.changeNumberOfPeople = this.changeNumberOfPeople.bind(this);
        this.calculatePrice = this.calculatePrice.bind(this);
        this.onQuickMessage = this.onQuickMessage.bind(this);
        this.onProgress = this.onProgress.bind(this);

        // 캐린더 HOOK 이벤트
        this.onPrev = this.onPrev.bind(this);
        this.onNext = this.onNext.bind(this);

        this.onShare = this.onShare.bind(this);
        this.onCopy = this.onCopy.bind(this);

        this.onSelectPayMethod = this.onSelectPayMethod.bind(this);
        this.onAgreeClause = this.onAgreeClause.bind(this);
        this.onReserve = this.onReserve.bind(this);

        // API
        this.reserveOnPc = this.reserveOnPc.bind(this);
        this.reserveOnMobile = this.reserveOnMobile.bind(this);
        this.like = this.like.bind(this);
        this.queryProductCalendar = this.queryProductCalendar.bind(this);

        // generate the param
        this.getReserveToProductParam = this.getReserveToProductParam.bind(this);
        this.getReserveToProductIMPParam = this.getReserveToProductIMPParam.bind(this);
        this.getReserveToProductPayParam = this.getReserveToProductPayParam.bind(this);
        this.getLikeParamf = this.getLikeParam.bind(this);

        // valid the param
        this.isValidReservationParam = this.isValidReservationParam.bind(this);

        // 유저 대화하기
        this.requestChatBtn = this.requestChatBtn.bind(this);
        this.checkPhone = this.checkPhone.bind(this);
    }

    componentWillMount() {
        const service = this.getLowest(this.state.services, "price");

        if (service) {
            this.changeServiceType(service);
        }

        this.checkPhone();

        // set pay method
        const list = [
            { name: "신용카드", value: "card", checked: true },
            { name: "계좌이체", value: "trans", checked: false },
            { name: "무통장 입금", value: "vbank", checked: false }
        ];

        const checkedItem = list.find(item => item.checked);

        this.setState({
            payMethod: {
                list,
                checkedItem,
                value: checkedItem.value
            }
        });
    }

    onPrev(payload) {
        this.queryProductCalendar(this.state.no, { date: payload.date })
            .then(response => {
                this.setState({
                    events: response.data.list
                });
            }, error => {
                // console.log(error);
            });
    }

    onNext(payload) {
        this.queryProductCalendar(this.state.no, { date: payload.date })
            .then(response => {
                this.setState({
                    events: response.data.list
                });
            }, error => {
                // console.log(error);
            });
    }

    /**
     * 예약 날짜를 선택한다.
     */
    onSelect({ date }) {
        this.setState({
            date: date.format("YYYY-MM-DD")
        });
    }

    onShare(type) {
        let sns;
        let params;

        switch (type) {
            case "naver": {
                sns = __SNS__.naver;
                params = {
                    url: location.href,
                    title: document.querySelector("meta[property='og:title']").getAttribute("content")
                };
                break;
            }
            case "facebook":
                sns = __SNS__.facebook;
                params = {
                    app_id: sns.client_id,
                    display: "popup",
                    href: location.href
                };
                break;
            default:
                break;
        }

        const options = "titlebar=1, resizable=1, scrollbars=yes, width=600, height=550";
        window.open(`${sns.share_uri}?${utils.query.stringify(params)}`, "sharePopup", options);
    }

    onCopy() {
        let state = true;
        try {
            window.getSelection().removeAllRanges();

            const text = document.getElementById("copyText");
            const range = document.createRange();
            range.selectNode(text);
            window.getSelection().addRange(range);

            document.execCommand("copy");

            window.getSelection().removeAllRanges();
        } catch (error) {
            state = false;
        }

        PopModal.alert(state ? "URL이 복사되었습니다." : "지원하지 않는 브라우저입니다.");
    }

    /**
     * 지불방법을 선택한다.
     * @param item
     */
    onSelectPayMethod(item) {
        const payMethod = this.state.payMethod;

        if (item.value === payMethod.checkedItem.value) {
            return;
        }

        payMethod.checkedItem.checked = false;
        item.checked = true;

        this.setState({
            payMethod: { ...payMethod, checkedItem: item, value: item.value }
        });
    }

    onAgreeClause(value) {
        this.setState({
            clauseAgree: value
        });
    }

    onReserve() {
        const { user, phone, email, date, person, option, price } = this.state;
        const { title, options, events, no } = this.props;

        if (user) {
            const props = {
                nick_name: user.data.nick_name,
                phone,
                email,
                date,
                title,
                options,
                events,
                product_no: no,
                person,
                option,
                price
            };

            const modalName = "popup_payment";
            PopModal.createModal(modalName, <PopupPayment data={props} />, {});
            PopModal.show(modalName);
        } else {
            PopModal.alert("로그인후 이용해주세요", {
                callBack: () => {
                    redirect.login({ redirectURL: location.pathname });
                }
            });
        }

        // IMP.init(__IMP__);
        //
        // const reserve = utils.agent.isMobile() ? this.reserveOnMobile : this.reserveOnPc;
        //
        // const entryReserve = () => {
        //     if (!this.state.user.data.email) {
        //         PopModal.alert("이메일 인증을 하시면 진행상황을 이메일로 받을 수 있습니다.", { callBack: () => {
        //             reserve();
        //         } });
        //     } else {
        //         reserve();
        //     }
        // };
        //
        // if (!this.isLogIn()) {
        //     return;
        // }
        //
        // const result = this.isValidReservationParam();
        // if (!result.valid) {
        //     PopModal.alert(result.message);
        //     return;
        // }
        //
        //
        // if (!this.state.clauseAgree) {
        //     PopModal.alert("구매 동의 후 예약이 가능합니다.");
        //     return;
        // }
        //
        // if (this.state.loading) {
        //     PopModal.alert("예약 중입니다. 잠시만 기다려주세요.");
        //     return;
        // }
        //
        // if (this.state.phone === "") {
        //     const { phone } = this.state;
        //     const modalName = "pop-check-phone";
        //     const option = {
        //         callBack: () => { this.checkPhone(); }
        //     };
        //     PopModal.createModal(modalName, <PopInputPhone isPhone={!!phone} name={modalName} close={entryReserve} />, option);
        //     PopModal.show(modalName);
        // } else {
        //     entryReserve();
        // }
    }

    onQuickMessage(type) {
        const { no, artistId, isProcess, isQuick } = this.state;
        let message = "";

        switch (type) {
            case "date":
                message = "일정문의합니다.";
                break;
            case "photo":
                message = "촬영문의합니다.";
                break;
            case "option":
                message = "옵션문의합니다.";
                break;
            default:
                break;
        }

        if (!isProcess && message && artistId && no) {
            if (!isQuick) {
                this.onProgress(true);
                API.talks.send(artistId, no, "U", "PRODUCT_BOT", message).then(response => {
                    this.onProgress(false);
                    if (response.status === 200) {
                        PopModal.close();
                        PopModal.confirm(
                            "문의가 등록되었습니다.\n답변이 완료되면 sms로 알려드려요!\n지금 메시지를 확인하시겠습니까?",
                            () => {
                                document.location.href = `/users/chat/${artistId}/${no}`;
                            }
                        );
                        this.setState({
                            isQuick: true
                        });
                    }
                }).catch(error => {
                    this.onProgress(false);
                    if (error.status === 412) {
                        PopModal.alert(error.data);
                    } else if (error.status === 400) { // 작가가 자기자신의 상품에 대화하기를 하였을 경우 에러
                        PopModal.alert(error.data);
                    }
                });
            }
        }
    }

    onProgress(b) {
        this.state.isProcess = b;

        if (b) {
            PopModal.progress();
        } else {
            PopModal.closeProgress();
        }
    }

    /**
     * 예약을 위한 데이터를 가져온다.
     * @returns {null|{product_no: (String|*), date: string, option: (number|*|string), person: number}}
     */
    getReserveToProductParam() {
        return {
            product_no: this.state.no * 1,
            date: this.state.date.replace(/-/g, "") * 1,
            option_no: this.state.option,
            person: this.state.person
        };
    }

    /**
     * 아임포트 결제를 위한 Parameter를 가져온다.
     * @param {object} data
     * @returns {{pay_method: *, amount: string, name: (String|*), merchant_uid: (buy_no|{$set}|string), buyer_email: string, buyer_name: string, custom_data: {user_id: string}}}
     */
    getReserveToProductIMPParam(data) {
        const { user, payMethod, date } = this.state;
        const params = {
            pay_method: payMethod.value,
            amount: this.state.price,
            name: this.state.productName,
            merchant_uid: data.buy_no,
            buyer_email: user ? user.data.email : "",
            buyer_name: user ? user.data.name : "구매자",
            custom_data: {
                user_id: user ? user.id : ""
            }
        };

        if (utils.agent.isMobile()) {
            params.m_redirect_url = `${__DOMAIN__}/products/${this.state.no}/process`;
        }

        if (payMethod.value === "vbank") {
            // 가상계좌 입금 기한은 최대 3일이다.
            // 3일이 남지 않았으면, 예약일 전날 까지 입금해야한다
            const dueDate = mewtime().add(3, mewtime.const.DATE);
            const reserveDate = mewtime(date);
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
            product_no: this.state.no * 1,
            pay_uid: data.imp_uid
        }];
    }

    /**
     * 하트 등록, 취소를 위한 Parameter를 가져온다.
     * @returns {[*,*]}
     */
    getLikeParam() {
        return [
            this.state.user.id,
            this.state.no
        ];
    }

    /**
     * 가장 낮은 데이터를 가져온다.
     * @param {Array} list
     * @param {string} key
     * @returns {object}
     */
    getLowest(list, key) {
        return list.sort((a, b) => {
            const v1 = a[key];
            const v2 = b[key];
            let result = 0;

            if (v1 > v2) {
                result = 1;
            } else if (v1 < v2) {
                result = -1;
            } else {
                result = 0;
            }

            return result;
        })[0];
    }

    /**
     * 유저의 핸드폰 번호가 있는지 체크한다.
     */
    checkPhone() {
        // PopModal.progress();
        const request = this.apiUserFind();
        if (request) {
            return request.then(response => {
                // PopModal.closeProgress();
                if (response.status === 200) {
                    this.setState({
                        phone: response.data.phone || "",
                        email: response.data.email || ""
                    });
                }
            }).catch(error => {
                // PopModal.closeProgress();
            });
        }
        return null;
    }

    apiUserFind() {
        const { user } = this.state;
        if (user) {
            return API.users.find(user.id);
        }

        return null;
    }

    isLogIn() {
        if (!this.state.user) {
            PopModal.alert("로그인 후  이용이 가능합니다.");
            return false;
        }

        return true;
    }

    /**
     * 예약을 위한 데이터 유효성을 체크한다.
     * @returns {{valid: boolean, message: string}}
     */
    isValidReservationParam() {
        const { date } = this.state;
        if (!date) {
            return { valid: false, message: "예약날짜를 선택해주세요." };
        }

        return {
            valid: true,
            message: "OK"
        };
    }

    /**
     * 서비스 타입을 변경한다.
     * @param {object|string} item
     */
    changeServiceType(item) {
        const selected = utils.type.isString(item) ? this.state.services.find(d => d.value === item) : item;

        this.setState({
            selectedService: selected,
            price: selected.price,
            person: selected.basicPerson,
            option: selected.value
        });
    }

    /**
     * 촬영 인원 수를 변경한다.
     * @param {number} count
     */
    changeNumberOfPeople(count) {
        if (this.state.person !== count) {
            this.state.person = count;
            this.calculatePrice();
        }
    }

    /**
     * 가격을 계산한다.
     */
    calculatePrice() {
        const item = this.state.selectedService;
        const person = this.state.person;
        const price = item.price + (item.addPrice * (person - item.basicPerson));

        this.setState({ person, price });
    }

    /**
     * PC 에서 상품 예약을 처리한다.
     */
    reserveOnPc() {
        this.setState({ loading: true }, () => {
            //window.fbq("track", "InitiateCheckout")
        });

        API.reservations.reserveToProduct(this.getReserveToProductParam())
            .then(response => API.reservations.reserveToProductIMP(this.getReserveToProductIMPParam(response.data)))
            .then(response => API.reservations.reserveToProductPay(...this.getReserveToProductPayParam(response)))
            .then(response => {
                tracking.conversion();

                //console.log("productReservation", response, this.state);

                //utils.ad.fbqEvent("Purchase", { value: this.state.price, currency: "KRW" });

                // window.fbq("track", "Purchase", { value: this.state.price, currency: "KRW" });

                PopModal.alert("예약요청이 완료되었습니다.\n예약내용은 마이페이지 > 진행상황에서 확인가능합니다.");

                return this.queryProductCalendar(this.state.no, { date: mewtime(this.state.date).format("YYYYMM") });
            })
            .then(response => {
                this.setState({
                    events: response.data.list,
                    loading: false
                });
            })
            .catch(response => {
                const message = response.data ? response.data : response.error_msg;
                PopModal.alert(message);

                this.setState({ loading: false });
            });
    }

    /**
     * Mobile 에서 상품 예약을 처리한다.
     */
    reserveOnMobile() {
        this.setState({ loading: true }, () => {
            //window.fbq("track", "InitiateCheckout")
        });

        tracking.conversion();

        API.reservations.reserveToProduct(this.getReserveToProductParam())
            .then(response => API.reservations.reserveToProductIMP(this.getReserveToProductIMPParam(response.data)))
            .catch(response => {
                const message = response.data ? response.data : response.error_msg;
                PopModal.alert(message);

                this.setState({ loading: false });
            });
    }

    /**
     * 하트를 등록 또는 취소한다.
     */
    like() {
        if (!this.isLogIn()) {
            return;
        }

        const process = isLike => {
            const params = this.getLikeParam();

            if (!isLike) {
                // window.fbq("track", "AddToWishlist");
                PopModal.toast("하트 상품은 <br /> 마이페이지 > 내 하트 목록<br />에서 확인가능합니다.");
                return API.users.like(...params);
            }
            PopModal.toast("하트를 취소하셨습니다.", 1000);
            return API.users.unlike(...params);
        };

        process(this.state.isLike).then(response => {
            this.props.onLike(response.data.like_cnt);
            this.setState({ isLike: !this.state.isLike });
        }).catch(error => PopModal.alert(error.data));
    }

    /**
     * 상품 캘린더 정보를 조회한다.
     * @param no
     * @param date
     * @returns {*}
     */
    queryProductCalendar(no, { date }) {
        return API.products.queryCalendar(no, { date });
    }

    /**
     *  해당 작가에게 대화하기 동작
     */
    requestChatBtn() {
        const { phone, artistId, no, user } = this.state;
        const { title } = this.props;

        const data = {
            artistId,
            no,
            title
        };

        if (!this.isLogIn()) {
            return;
        }

        if (user.id === artistId) {
            PopModal.alert("자기 자신에게 메시지를 보낼 수 없습니다.");
        } else {
            const modalName = "requestTalk";
            const option = {
                callBack: () => { this.checkPhone(); }
            };
            PopModal.createModal(modalName, <PopSendChat data={data} isPhone={!!phone} />, option);
            PopModal.show(modalName);
        }
    }

    render() {
        const { isQuick, payMethod } = this.state;
        const selectedSv = this.state.selectedService;
        const today = mewtime();

        if (!selectedSv) {
            return null;
        }

        const calendar = {
            events: this.state.events,
            min: today.clone().subtract(1).format("YYYY-MM-DD"),
            max: today.clone().add(90).format("YYYY-MM-DD"),
            date: this.state.date || today.clone().format("YYYY-MM-DD"),
            onSelect: this.onSelect,
            onPrev: this.onPrev,
            onNext: this.onNext,
            autoSelect: false
        };

        return (
            <div className="reservation">
                <div className="panel">
                    <div className="panel__body">
                        <div className="reservation__calendar">
                            <SlimCalendar {...calendar} />
                        </div>
                        <div className="reservation__contents">
                            <div className="reservation-row">
                                <Dropdown list={this.state.services} width="block" size="small" select={this.state.option} resultFunc={selectedItem => this.changeServiceType(selectedItem)} keys={{ caption: "price" }} />
                            </div>
                            <div className="reservation-row">
                                <div className="reservation-col reservation-label">촬영인원</div>
                                <div className="reservation-col reservation-content">
                                    <Qty count={this.state.person} min={selectedSv.basicPerson} max={selectedSv.maxPerson} resultFunc={numberOfPerson => this.changeNumberOfPeople(numberOfPerson)} />
                                </div>
                            </div>
                            <div className="reservation-row" itemProp="offers" itemScope itemType="http://schema.org/Offer">
                                <meta content="KRW" itemProp="priceCurrency" />
                                <meta content={`${utils.format.price(this.state.price)}`} itemProp="price" />
                                <div className="reservation-col reservation-label">최종 결제금액</div>
                                <div className="reservation-col reservation-content reservation-price">
                                    <span>{utils.format.price(this.state.price)}</span>&nbsp;원
                                </div>
                            </div>
                            <div className="reservation-row">
                                <div className="reservation__buttons">
                                    <Buttons buttonStyle={{ size: "small", width: "block", shape: "circle", theme: "fill-emphasis" }} inline={{ onClick: this.onReserve }}>예약 & 결제하기</Buttons>
                                    <Buttons buttonStyle={{ size: "small", width: "block", shape: "circle", theme: "bg-lightgray" }} inline={{ onClick: this.requestChatBtn }}>대화하기</Buttons>
                                    <div className="simple__talk__buttons">
                                        <h2>원클릭 간편문의</h2>
                                        <div className={classNames("buttons__list", { disabled: isQuick })}>
                                            <Buttons buttonStyle={{ size: "small", shape: "round", theme: "bg-white" }} inline={{ onClick: () => this.onQuickMessage("date") }}>일정문의</Buttons>
                                            <Buttons buttonStyle={{ size: "small", shape: "round", theme: "bg-white" }} inline={{ onClick: () => this.onQuickMessage("photo") }}>촬영문의</Buttons>
                                            <Buttons buttonStyle={{ size: "small", shape: "round", theme: "bg-white" }} inline={{ onClick: () => this.onQuickMessage("option") }}>옵션문의</Buttons>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="panel__footer">
                        <div className="reservation__social">
                            <div className="reservation__social__item">
                                <PopDownContent
                                    target={<Buttons buttonStyle={{ icon: "share" }}>공유</Buttons>}
                                    align={"right"}
                                    posy={20}
                                >
                                    <div className="row">
                                        <div className="columns col-6">
                                            <button type="button" className="share-brand" onClick={() => this.onShare("naver")}>
                                                <div className="share-brand__icon"><Icon name={"naver"} /></div>
                                                <div className="share-brand__text">네이버</div>
                                            </button>
                                        </div>
                                        <div className="columns col-6">
                                            <button type="button" className="share-brand" onClick={() => this.onShare("facebook")}>
                                                <div className="share-brand__icon"><Icon name={"facebook_c"} /></div>
                                                <div className="share-brand__text">페이스북</div>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row share-copy">
                                        <div className="columns col-8">
                                            <Input inputStyle={{ size: "small", width: "block" }} inline={{ id: "copyText", value: location.href }} disabled="disabled" />
                                        </div>
                                        <div className="columns col-4">
                                            <Buttons buttonStyle={{ size: "small", shape: "circle", theme: "bg-lightgray" }} inline={{ onClick: this.onCopy }}>복사</Buttons>
                                        </div>
                                    </div>
                                </PopDownContent>
                            </div>
                            <div className="reservation__social__item">
                                <Buttons buttonStyle={{ icon: "pink_heart", isActive: this.state.isLike }} inline={{ onClick: this.like }}>하트</Buttons>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// <div className="reservation-row">
//     <div className="reservation-col reservation-label">결제방법</div>
//     <div className="reservation-col reservation-content reservation-pay-methods">
//         {
//             payMethod.list.map(item => (
//                 <button type="button" className={item.checked ? "checked" : ""} key={item.value} onClick={() => this.onSelectPayMethod(item)}>{item.name}</button>
//             ))
//         }
//     </div>
// </div>
// <div className="reservation-row clause">
//     <p className="clause__desc">주문하실 상품을 확인하였으며, 구매에 동의하시겠습니까?</p>
//     <p className="clause__agree">
//         <Checkbox type="yellow_circle" checked={this.state.clauseAgree} resultFunc={value => this.onAgreeClause(value)}>
//             <strong>동의합니다.</strong> (전자상거래법 제8조 제2항)
//         </Checkbox>
//     </p>
// </div>


ProductReservation.propTypes = {
    no: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isLike: PropTypes.string.isRequired,
    artistId: PropTypes.string,
    events: PropTypes.arrayOf(PropTypes.shape({
        no: PropTypes.string,
        type: PropTypes.string,
        year: PropTypes.string,
        month: PropTypes.string,
        day: PropTypes.string
    })),
    options: PropTypes.arrayOf(PropTypes.shape({
        option_type: PropTypes.string,  // 상품 서비스 타입
        price: PropTypes.string,        // 기본 가격
        add_price: PropTypes.string,    // 추가가격
        basic_person: PropTypes.string, // 기본인원
        max_person: PropTypes.string    // 최대인원
    })).isRequired,
    onLike: PropTypes.func.isRequired
};

ProductReservation.defaultProps = {
    events: []
};

export default ProductReservation;
