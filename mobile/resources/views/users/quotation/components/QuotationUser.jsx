import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import API from "forsnap-api";
import auth from "forsnap-authentication";
// import utils from "forsnap-utils";
// import { STATUS } from "shared/constant/quotation.const";
import RequestJS, { STATE } from "shared/components/quotation/request/QuotationRequest";
import PopModal from "shared/components/modal/PopModal";
import Img from "shared/components/image/Img";
import DropDown from "mobile/resources/components/dropdown/DropDown";

const phone_start_list = [
    { value: "010", name: "010" },
    { value: "011", name: "011" },
    { value: "016", name: "016" },
    { value: "018", name: "018" }
];

class QuotationUser extends Component {
    constructor() {
        super();

        const reserve = RequestJS.getState(STATE.RESERVE.key);

        this.state = {
            [STATE.USER.key]: RequestJS.getState(STATE.USER.key),
            [STATE.AGREE]: RequestJS.getState(STATE.AGREE),
            [STATE.RESERVE.CATEGORY]: reserve[STATE.RESERVE.CATEGORY],
            [STATE.PHONE.key]: RequestJS.getState(STATE.PHONE.key)
        };

        this.onChangeValue = this.onChangeValue.bind(this);
        this.onChangeNumber = this.onChangeNumber.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onAgree = this.onAgree.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const authUser = auth.getUser();
        const user = this.state[STATE.USER.key];

        if (!user[STATE.USER.PHONE] || !user[STATE.USER.EMAIL]) {
            PopModal.progress();
            API.users.find(authUser.id).then(response => {
                PopModal.closeProgress();
                if (response.status === 200) {
                    const data = response.data;
                    let props = {};
                    if (!user[STATE.USER.NAME]) {
                        props = Object.assign(props, RequestJS.setUserState(STATE.USER.NAME, data.name ? data.name : ""));
                    }

                    if (!user[STATE.USER.PHONE]) {
                        Object.assign(
                            props,
                            RequestJS.setUserState(STATE.USER.PHONE, data.phone ? data.phone : ""),
                            RequestJS.setState(STATE.PHONE.key, this.phoneToJson(data.phone))
                        );
                    }

                    if (!user[STATE.USER.EMAIL]) {
                        props = Object.assign(props, RequestJS.setUserState(STATE.USER.EMAIL, data.email ? data.email : ""));
                    }

                    this.setState(props);
                }
            }).catch(error => {
                PopModal.closeProgress();
            });
        }
        window.scroll(0, 0);
    }

    onChangeValue(e, key) {
        const target = e.target;
        const value = target.value;
        const maxLength = target.maxLength;

        if (maxLength && maxLength > -1 && value.length > maxLength) {
            return;
        }

        this.setState(RequestJS.setUserState(key, value));
    }

    onChangeNumber(e, key) {
        const { phone } = this.state;
        const target = e.target;
        const value = target.value.replace(/\D/g, "");
        const maxLength = target.maxLength;

        if (maxLength && maxLength > -1 && value.length > maxLength) {
            return;
        }

        phone[key] = value;
        this.setState(RequestJS.setUserState(STATE.USER.PHONE, this.phoneToString(phone)));
        this.setState({ phone });

        // this.setState(RequestJS.setUserState(key, value));
    }

    phoneToJson(phone = "") {
        let start = "010";
        let center = "";
        let end = "";

        if (phone && phone.length > 9) {
            const list = phone_start_list;
            const isNumberStart = list.filter(ph => {
                return ph.value === phone.substr(0, 3);
            })[0] || "";
            if (isNumberStart) {
                start = phone.substr(0, 3);
                const temp = phone.substr(3);
                if (temp.length === 7) {
                    center = temp.substr(0, 3);
                    end = temp.substr(3);
                } else if (temp.length === 8) {
                    center = temp.substr(0, 4);
                    end = temp.substr(4);
                }
            }
        }

        return { start, center, end };
    }

    phoneToString(phone) {
        return `${phone[STATE.PHONE.START]}${phone[STATE.PHONE.CENTER]}${phone[STATE.PHONE.END]}`;
    }

    onFocus(e) {
        // const target = e.target;
        // setTimeout(() => {
        //     target.scrollIntoView();
        //     setTimeout(() => {
        //         window.scrollTo(0, 0);
        //     }, 0);
        // }, 500);
    }

    onAgree() {
        this.setState(RequestJS.setState(STATE.AGREE, !this.state[STATE.AGREE]));
    }

    setPhone(key, value) {
        const phone = this.state.phone;
        const props = {};
        phone[key] = value;
        props.phone = phone;
        this.setState(RequestJS.setUserState(STATE.USER.PHONE, this.phoneToString(phone)));
    }

    render() {
        const user = this.state[STATE.USER.key];
        const agree = this.state[STATE.AGREE];
        const category = this.state[STATE.RESERVE.CATEGORY];
        const phone = this.state.phone;
        const currentPath = location.pathname;
        const is_guest_step = currentPath.startsWith("/guest");
        const isBanner = category !== "VIDEO";

        return (
            <div className="quotation__basic">
                <div className="content__column">
                    {isBanner && !is_guest_step ?
                        <div className="content__column__banner">
                            <Img image={{ src: "/introduce/int_top_img.jpg?v=20170508_1548", type: "image" }} />
                            <div className="column__banner__content">
                                <h1 className="title">촬영 문의하고 무료 견적을 받아보세요!</h1>
                                <div className="content">
                                    다음 몇가지 질문에 답해주시면,<br />
                                    요청에 적합한 작가님께서 맞춤견적서를 보내드려요.<br />
                                    다양한 견적서 중 마음에 드는 작가님을<br />
                                    선택하여 촬영을 진행해보세요!
                                </div>
                            </div>
                        </div> : null
                    }
                    <div className="content__column__head">
                        <h1>기본정보를 입력해주세요.</h1>
                    </div>
                    <div className="content__column__body">
                        <div className="column__box">
                            <div className="column__row">
                                <div className="row__title">
                                    <span className="required">이름</span>
                                </div>
                                <div className="row__content">
                                    <input
                                        className="input"
                                        type="text"
                                        maxLength="15"
                                        value={user[STATE.USER.NAME]}
                                        onChange={e => this.onChangeValue(e, STATE.USER.NAME)}
                                        onFocus={this.onFocus}
                                    />
                                </div>
                            </div>
                            <div className="column__row">
                                <div className="row__title">
                                    <span className="required">연락처</span>
                                </div>
                                <div className="row__content" style={{ flexDirection: "row" }}>
                                    <div className="dropdown-wrap">
                                        <DropDown list={phone_start_list} size="small" select={phone.start} resultFunc={value => this.setPhone("start", value)} />
                                    </div>
                                    <input
                                        className="input telephone"
                                        type="tel"
                                        maxLength="4"
                                        value={phone.center}
                                        onChange={e => this.onChangeNumber(e, "center")}
                                        onFocus={this.onFocus}
                                    />
                                    <input
                                        className="input telephone"
                                        type="tel"
                                        maxLength="4"
                                        value={phone.end}
                                        onChange={e => this.onChangeNumber(e, "end")}
                                        onFocus={this.onFocus}
                                    />
                                </div>
                            </div>
                            <div className="column__row">
                                <div className="row__title">
                                    <span className="required">이메일</span>
                                </div>
                                <div className="row__content">
                                    <input
                                        id="email"
                                        className="input"
                                        type="email"
                                        maxLength="50"
                                        value={user[STATE.USER.EMAIL]}
                                        onChange={e => this.onChangeValue(e, STATE.USER.EMAIL)}
                                        onFocus={this.onFocus}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="column__row">
                            <div className="row__content direction__row justify-center">
                                <span className="exclamation">!</span>
                                <span className="content__caption text-left">
                                    입력하신 정보로 SMS와 이메일이 발송되며, 전화상담을 요청하시는 경우 추천작가에게 연락처가 공개됩니다. (영상 카테고리의 경우 전화상담이 필수로 진행됩니다.)
                                </span>
                            </div>
                        </div>
                        <div className="column__row">
                            <div className="row__content direction__row justify-center">
                                <button className={classNames("button__check", agree ? "active" : "")} onClick={() => this.onAgree()}>
                                    <span className="icon__circle">
                                        <span className={classNames("m-icon", agree ? "m-icon-check-white" : "m-icon-check")} />
                                    </span>
                                    <span>동의하기</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default QuotationUser;
