import "./simple_consult_content.scss";
import React, { Component, PropTypes } from "react";
import DropDown from "mobile/resources/components/dropdown/DropDown";
import CONSTANT from "shared/constant";
import classNames from "classnames";
import utils from "forsnap-utils";

export default class SimpleConsultContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onChangeHandler: props.onChangeHandler,
            area_code: CONSTANT.AREA_CODE,                              // 지역번호
            user_name: props.user_name,                                 // 상담신청 고객 이름
            counsel_time: props.counsel_time,
            phone_start: "010",                                         // 연락처 앞 번호 초기값
            phone_center: { value: "", error: "" },                     // 연락처 중간 번호
            phone_end: { value: "", error: "" },                        // 연락처 끝 번호
            user_phone: props.user_phone,                               // 입력된 연락처 번호
            user_email: props.user_email
        };
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    /**
     * 연락처 중 지역번호를 저장한다.
     * @param value
     * @param name
     */
    onSetPhoneNumberStart(value, name) {
        this.setState(this.setConsultData(value, name), () => { this.phoneToString(); });
    }

    /**
     * 상담신청 내용 반환한다.
     * @param value
     * @param name
     * @returns {function(*): {}}
     */
    setConsultData(value, name) {
        if (typeof value !== "string") {
            throw new TypeError("The data must be a string type.");
        }

        return state => ({ [name]: value });
    }

    /**
     * 연락처 유효성 오류에 에러메시지를 저장한다.
     * @param message
     * @param name
     */
    setErrorMessageForPhoneNumber(message, name) {
        if (typeof message !== "string") {
            throw new TypeError("The message parameter must be a string type");
        }
        const targetData = this.state[name];
        this.setState({
            [name]: Object.assign(targetData, { error: message })
        });
    }

    /**
     * 저장된 연락처를 합친다.
     */
    phoneToString() {
        const { phone_start, phone_center, phone_end } = this.state;
        const { onChangeHandler } = this.props;

        const phone = {
            phone_start,
            phone_center: phone_center.value,
            phone_end: phone_end.value
        };

        this.setState({
            user_phone: `${phone["phone_start"]}${phone["phone_center"]}${phone["phone_end"]}`
        }, () => {
            onChangeHandler("user_phone", this.state.user_phone);
        });
    }

    /**
     * 연락처를 입력받는다.
     * 저장시 숫자를 제외한 문자의 입력은 배제한다.
     * @param e
     * @param name
     */
    onSetPhoneData(e, name) {
        const value = e.target.value && e.target.value.replace(/,/gi, "").replace(/\D/gi, "");
        this.validatePhoneNumber(value, name);
        this.setPhoneData(value, name);
    }

    /**
     * 연락처를 저장한다.
     * @param value - String (연락처 3 ~ 4자리)
     * @param name - String (저장할 프로퍼티 명)
     */
    setPhoneData(value, name) {
        const target_data = this.state[name];
        if (target_data) {
            Object.assign(target_data, { value });
        }

        this.setState({ [name]: target_data }, () => { this.phoneToString(); });
    }


    /**
     * 연락처 입력 시 유효성 체크를 한다.
     * @param data - String (폰번호)
     * @param name - String (저장할 프로퍼티 명)
     * @returns {string}
     */
    validatePhoneNumber(data, name) {
        if (!data) {
            const message = "연락처를 입력해주세요.";
            this.setErrorMessageForPhoneNumber(message, name);
            return message;
        }

        if (name === "phone_center" && data.length < 3) {
            const message = "연락처를 전부 입력해 주세요.";
            this.setErrorMessageForPhoneNumber(message, name);
            return message;
        } else if (name === "phone_end" && data.length < 4) {
            const message = "연락처를 전부 입력해 주세요.";
            this.setErrorMessageForPhoneNumber(message, name);
            return message;
        }

        this.setErrorMessageForPhoneNumber("", name);
        return "";
    }

    /**
     * 인풋 창을 비활성화 시킨다.
     * @param e
     * @param target
     */
    onBlur(e, target) {
        if (target) {
            target.style.borderColor = "#e1e1e1";
        }
    }

    /**
     * 인풋창을 활성화 시킨다.
     * @param e
     * @param target
     */
    onFocus(e, target) {
        if (target) {
            target.style.borderColor = "#000";
        }
    }

    /**
     * 유효성 체크
     * @returns {string}
     */
    valid() {
        const { phone_center, phone_end } = this.state;
        const { user_name, user_phone, user_email } = this.props;

        let message = "";
        if (!user_name) {
            message = "이름을 입력해 주세요.";
        } else if (!user_phone) {
            message = "연락받으실 전화번호를 입력해 주세요.";
        } else if (!phone_center.value || phone_center.value.length < 3) {
            message = "유효한 연락처를 입력해 주세요.";
        } else if (!phone_end.value || phone_end.value.length <= 3) {
            message = "유효한 연락처를 입력해 주세요.";
        } else if (user_email && !utils.isValidEmail(user_email)) {
            message = "이메일을 정확히 입력해주세요.";
        }

        return message;
    }

    getData() {
        const { name, user_phone, counsel_time } = this.state;
        return {
            name, user_phone, counsel_time
        };
    }


    render() {
        const { onChangeHandler, user_name, counsel_time, user_phone, user_email } = this.props;
        const { area_code, phone_start, phone_center, phone_end } = this.state;

        return (
            <div className="simple-consult__body__content-box">
                <div className="simple-consult__body__content-box__row">
                    <div className="row-title">담당자 이름<span className="required">*</span></div>
                    <div
                        className="row-input"
                        ref={node => { this.write_name = node; }}
                    >
                        <input
                            //className="f__input"
                            placeholder="이름"
                            value={user_name}
                            maxLength={10}
                            type="text"
                            name="user_name"
                            onChange={e => onChangeHandler(e.target.name, e.target.value)}
                            onFocus={e => this.onFocus(e, this.write_name)}
                            onBlur={e => this.onBlur(e, this.write_name)}
                        />
                    </div>
                </div>
                <div className="simple-consult__body__content-box__row">
                    <div className="row-title">연락처<span className="required">*</span></div>
                    <div className="step-content__info-phone">
                        <div className="step-content__info-phone__box">
                            <DropDown
                                list={area_code}
                                select={phone_start}
                                keys={{ value: "value" }}
                                icon="triangle_dt"
                                resultFunc={value => this.onSetPhoneNumberStart(value, "phone_start")}
                            />
                            <div
                                className={classNames("row-input", phone_center.error && "error_input")}
                                ref={node => { this.write_phone_center = node; }}
                            >
                                <input
                                    style={{ marginLeft: "5px" }}
                                    type="tel"
                                    value={phone_center.value}
                                    maxLength={4}
                                    onChange={e => this.onSetPhoneData(e, "phone_center")}
                                    onFocus={e => this.onFocus(e, this.write_phone_center)}
                                    onBlur={e => this.onBlur(e, this.write_phone_center)}
                                />
                            </div>
                            <div
                                className={classNames("row-input", phone_end.error && "error_input")}
                                ref={node => { this.write_phone_end = node; }}
                                style={{ float: "right" }}
                            >
                                <input
                                    style={{ marginLeft: "5px" }}
                                    type="tel"
                                    value={phone_end.value}
                                    maxLength={4}
                                    onChange={e => this.onSetPhoneData(e, "phone_end")}
                                    onFocus={e => this.onFocus(e, this.write_phone_end)}
                                    onBlur={e => this.onBlur(e, this.write_phone_end)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="simple-consult__body__content-box__row">
                    <div className="row-title">이메일</div>
                    <div className="row-input" ref={node => (this.user_email = node)}>
                        <input
                            //className="f__input"
                            placeholder=""
                            value={user_email}
                            maxLength={30}
                            type="text"
                            name="user_email"
                            onChange={e => onChangeHandler(e.target.name, e.target.value)}
                            onFocus={e => this.onFocus(e, this.user_email)}
                            onBlur={e => this.onBlur(e, this.user_email)}
                        />
                    </div>
                </div>
                <div className="simple-consult__body__content-box__row">
                    <div className="row-title">상담가능시간</div>
                    <div className="row-input" ref={node => (this.counsel_time = node)}>
                        <input
                            //className="f__input"
                            placeholder="가능한 빨리"
                            value={counsel_time}
                            maxLength={30}
                            type="text"
                            name="counsel_time"
                            onChange={e => onChangeHandler(e.target.name, e.target.value)}
                            onFocus={e => this.onFocus(e, this.counsel_time)}
                            onBlur={e => this.onBlur(e, this.counsel_time)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
