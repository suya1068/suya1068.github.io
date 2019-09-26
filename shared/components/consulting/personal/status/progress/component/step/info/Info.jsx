import "./info.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import CONSTANT from "shared/constant";
import DropDown from "mobile/resources/components/dropdown/DropDown";
import { CATEGORY_TITLE } from "../advice_order.const";

export default class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: props.step,                                           // 현재 단계
            is_agree: false,                                            // 상담신청 동의 체크
            category: props.category,                                   // 선택된 카테고리
            area_code: CONSTANT.AREA_CODE,                              // 지역번호
            name: props.user_name,                                      // 상담신청 고객 이름
            phone_start: "010",                                         // 연락처 앞 번호 초기값
            phone_center: { value: "", error: "" },                     // 연락처 중간 번호
            phone_end: { value: "", error: "" },                        // 연락처 끝 번호
            user_phone: props.user_phone || "",                         // 입력된 연락처 번호
            // counsel_type: "tel",                                        // 상담가능방법 초기값
            counselTimeOption: [                                        // 상담가능시간 옵션값
                { name: "가능한빨리", value: "가능한빨리", is_write: false },
                { name: "1~2시간이내", value: "1~2시간이내", is_write: false },
                { name: "직접입력", value: "직접입력", is_write: true }
            ],
            counselTimeTempMsg: props.counsel_time || "가능한빨리",          // 상담가능시간 메시지
            counselTimeSelect: props.counsel_time || "가능한빨리",           // 상담가능시간 선택
            counsel_time: props.counsel_time || "가능한빨리",                // API호출 전달용
            is_write: false,                                              // 상담가능시간 직접 선택 시 입력 여부 체크
            extra_info_category: CATEGORY_TITLE[props.category]           // 카테고리 이름 (디스플레이 용)
        };
        this.onPrev = this.onPrev.bind(this);
        this.setName = this.setName.bind(this);
        this.setIsDisabled = this.setIsDisabled.bind(this);
        this.onChangeAgree = this.onChangeAgree.bind(this);
        this.onSubmitConsult = this.onSubmitConsult.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        // this.onClickConsultType = this.onClickConsultType.bind(this);
    }

    componentWillMount() {
        const { user_phone } = this.state;
        const { counselTimeOption, counsel_time } = this.state;
        this.initData(counselTimeOption, counsel_time);

        if (user_phone) {
            this.setState(this.combinePhoneNumber(user_phone));
        }
    }

    componentDidMount() {
        const { name, user_phone, phone_center, phone_end, is_agree } = this.state;
        this.setIsDisabled(name, user_phone, phone_center, phone_end, is_agree);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { name, user_phone, phone_center, phone_end } = nextState;
        this.setIsDisabled(name, user_phone, phone_center, phone_end, nextState.is_agree);

        return true;
    }

    /**
     * 고객 연락처를 파싱한다.
     * @param user_phone
     * @returns {{phone_start: string, phone_center: {value: string, error: string}, phone_end: {value: string, error: string}}}
     */
    combinePhoneNumber(user_phone) {
        const phone_start = user_phone.substr(0, 3);
        const phone_body = user_phone.substr(phone_start.length);
        let phone_center = "";
        if (phone_body.length === 7) {
            phone_center = user_phone.substr(phone_start.length, 3);
        } else if (phone_body.length === 8) {
            phone_center = user_phone.substr(phone_start.length, 4);
        }
        const phone_end = user_phone.substr(phone_start.length + phone_center.length);

        return {
            phone_start,
            phone_center: { value: phone_center, error: "" },
            phone_end: { value: phone_end, error: "" }
        };
    }

    /**
     * 값을 초기화한다.
     * @param options
     * @param time
     * @param content
     */
    initData(options, time) {
        const is_direct_counsel_time = options.filter(obj => { return obj.name === time; });
        const init_data = {};
        if (is_direct_counsel_time.length < 1) {
            init_data.counselTimeSelect = "직접입력";
            init_data.is_write = true;
        }

        this.setState({ ...init_data }, () => { this.onCheckState(this.state.counsel_time); });
    }

    /**
     * 밸리데이션 완료 시 신청하기 버튼 활성화
     * @param time
     */
    onCheckState(time) {
        let flag = true;
        const button = this.button;
        if (time !== "") {
            flag = false;
            button.classList.remove("disabled");
        } else {
            button.classList.add("disabled");
        }

        button.disabled = flag;
    }

    /**
     * 상담가능시간을 가져온다.
     * @returns {string}
     */
    getCounselTime() {
        return this.state.counsel_time;
    }

    /**
     * 상담가능시간 직접입력 시 빈 문자열로 만든다.
     * @param e
     */
    onCounselFocus(e, active_target) {
        const target = e.currentTarget;

        if (target.value === "직접입력") {
            target.value = "";
        }
        this.onFocus(e, active_target);
    }


    /**
     * 연락가능시간 체크버튼 클릭
     * @param name
     * @param value
     */
    onSelectToCounselTime(name, value) {
        this.setState({
            counselTimeSelect: value,
            counselTimeTempMsg: value,
            [name]: value !== "직접입력" ? value : "",
            is_write: value === "직접입력" || false
        });
    }

    /**
     * 연락가능시간을 저장한다.
     * @param e
     * @param name
     */
    onChangeCounselTime(e, name) {
        const target = e.target;
        const value = target.value;
        this.setState({
            counselTimeTempMsg: value,
            [name]: value
        });
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
     * 상담신청 하기 버튼 클릭
     */
    onSubmitConsult() {
        if (typeof this.props.onSubmitConsult === "function") {
            this.props.onSubmitConsult();
        }
    }

    /**
     * 상담가능 방법을 내보낸다.
     * @returns {string}
     */
    // getCounselType() {
    //     return this.state.counsel_type;
    // }

    /**
     * 다음단계 진행 전 유효성 체크 로직
     * @param name
     * @param is_agree
     * @param user_phone
     * @param phone_center
     * @param phone_end
     */
    setIsDisabled(name, user_phone, phone_center, phone_end, is_agree) {
        const validate_data = {
            name, user_phone, phone_center, phone_end
        };
        let flag = true;
        const next_button = this.button;
        const error_message = this.vaildateInfo(validate_data);
        if (name && (user_phone && !phone_center.error && !phone_end.error) && is_agree && !error_message) {
            flag = false;
            next_button.disabled = flag;
            next_button.classList.remove("disabled");
        } else {
            next_button.disabled = flag;
            next_button.classList.add("disabled");
        }
    }

    /**
     * 유효성 체크
     * @returns {string}
     */
    vaildateInfo({ name, user_phone, phone_center, phone_end }) {
        let message = "";
        if (!name) {
            message = "이름을 입력해 주세요.";
        } else if (!user_phone) {
            message = "연락받으실 전화번호를 입력해 주세요.";
        } else if (!phone_center.value || phone_center.value.length < 3) {
            message = "유효한 연락처를 입력해 주세요.";
        } else if (!phone_end.value || phone_end.value.length <= 3) {
            message = "유효한 연락처를 입력해 주세요.";
        }

        return message;
    }

    /**
     * 이전 단계
     * @param e
     */
    onPrev(e) {
        if (typeof this.props.onPrev === "function") {
            this.props.onPrev(3);
        }
    }

    /**
     * 이름을 가져온다.
     * @returns {string}
     */
    getName() {
        return this.state.name;
    }

    /**
     * 연락처를 가져온다.
     * @returns {string}
     */
    getPhone() {
        return this.state.user_phone;
    }

    /**
     * 이름을 저장한다.
     * @param e
     */
    setName(e) {
        const target = e.currentTarget;
        this.setState({ name: target.value });
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
     * 저장된 연락처를 합친다.
     */
    phoneToString() {
        const { phone_start, phone_center, phone_end } = this.state;

        const phone = {
            phone_start,
            phone_center: phone_center.value,
            phone_end: phone_end.value
        };

        this.setState({
            user_phone: `${phone["phone_start"]}${phone["phone_center"]}${phone["phone_end"]}`
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

    // /**
    //  * 상담가능방법 체크 여부
    //  */
    // onClickConsultType() {
    //     const { counsel_type } = this.state;
    //     this.setState({ counsel_type: counsel_type === "tel" ? "sms" : "tel" });
    // }

    /**
     * 상담신청 기본정보 입력 폼을 랜더링한다.
     * @returns {*}
     */
    renderPhoneInfo() {
        const { area_code, phone_start, phone_center, phone_end } = this.state;
        return (
            <div className="step-content__info-phone">
                <div className="step-content__info-phone__box">
                    <DropDown
                        list={area_code}
                        select={phone_start}
                        keys={{ value: "value" }}
                        resultFunc={value => this.onSetPhoneNumberStart(value, "phone_start")}
                        size="large"
                    />
                    <div
                        className={classNames("consult_input consulting-content__item-content__row_input", phone_center.error && "error_input")}
                        ref={node => { this.write_phone_center = node; }}
                    >
                        <input
                            className="f__input"
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
                        className={classNames("consult_input consulting-content__item-content__row_input", phone_end.error && "error_input")}
                        ref={node => { this.write_phone_end = node; }}
                        style={{ float: "right" }}
                    >
                        <input
                            className="f__input"
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
                {/*<div className="agree-send-msg" onClick={this.onClickConsultType}>*/}
                {/*<div className={classNames("check-div", { "active": this.state.counsel_type === "sms" })}>*/}
                {/*<div />*/}
                {/*</div>*/}
                {/*<h4 className="title">SMS로 상담받을래요!</h4>*/}
                {/*</div>*/}
            </div>
        );
    }

    /**
     * 동의버튼 클릭
     */
    onChangeAgree() {
        this.setState({ is_agree: !this.state.is_agree });
    }


    render() {
        const { name, is_agree, extra_info_category } = this.state;
        const { counselTimeOption, counselTimeTempMsg, counselTimeSelect, is_write } = this.state;
        const COUNSEL_TIME = "counsel_time";

        return (
            <div className="consult_progress__step-info">
                <div className="consult_progress__step-category">
                    <p className="consult_progress__step-category-name">{extra_info_category}</p>
                </div>
                <div className="step-content">
                    <div className="step-content__row">
                        <div className="step-content__row-title">
                            <h4 className="title"><span style={{ color: "#ff326c" }}>[필수]</span> 이름과 연락처를 남겨주세요.</h4>
                        </div>
                        <div className="step-content__row-content">
                            <div className="step-content__info-name" style={{ width: "100%", marginBottom: "0.5rem" }}>
                                <div className="consult_input" ref={node => { this.write_name = node; }}>
                                    <input
                                        //className="f__input"
                                        placeholder="이름"
                                        value={name}
                                        maxLength={10}
                                        type="text"
                                        onChange={this.setName}
                                        onFocus={e => this.onFocus(e, this.write_name)}
                                        onBlur={e => this.onBlur(e, this.write_name)}
                                    />
                                </div>
                            </div>
                            {this.renderPhoneInfo()}
                        </div>
                    </div>
                    <div className="step-content__row">
                        <div className="step-content__row-title" style={{ paddingBottom: 5 }}>
                            <h4 className="title phone-alert"><span className="exclamation">!</span>연락처를 입력하시면 원하시는 시간에 상담연락을 드립니다.</h4>
                        </div>
                        <div className="step-content__row-content">
                            <p className="step-content__alert-msg-content" style={{ color: "red", padding: "0 20px", textAlign: "left", fontSize: "0.8rem" }}>
                                남겨 주신 이름과 연락처는 상담목적으로만 이용됩니다.<br />
                                개인정보는 상담완료 후 자동으로 파기됩니다.
                            </p>
                        </div>
                    </div>
                    <div className="step-content__row">
                        <div className="step-content__row-title">
                            <h4 className="title"><span style={{ color: "#ff326c" }}>[필수]</span> 상담가능시간을 알려주세요.</h4>
                        </div>
                        <div className="step-content__row-content">
                            <div className="able-time">
                                <DropDown
                                    list={counselTimeOption}
                                    select={counselTimeSelect}
                                    keys={{ value: "value" }}
                                    resultFunc={value => this.onSelectToCounselTime(COUNSEL_TIME, value)}
                                    size="large"
                                />
                                {is_write &&
                                    <div
                                        className={classNames("consult_input consult-time-input", { "disabled": !is_write })}
                                        style={{ marginTop: "10px", width: "100%" }}
                                        ref={node => { this.write_consult = node; }}
                                    >
                                        <input
                                            type="text"
                                            value={counselTimeTempMsg}
                                            disabled={!is_write && "disabled"}
                                            maxLength={30}
                                            onChange={e => this.onChangeCounselTime(e, COUNSEL_TIME)}
                                            onFocus={e => this.onCounselFocus(e, this.write_consult)}
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="step-content__row">
                        <div className="step-content-agree-rule">
                            <div className="step-content-agree-rule-heading">
                                <div>
                                    <h4 className="step-content-agree-rule-heading__title">
                                        [ 개인정보 수집 및 이용동의 ]
                                    </h4>
                                </div>
                                <div
                                    className="step-content-agree-rule-heading__agree-button"
                                    onClick={this.onChangeAgree}
                                ><span style={{ color: "#ff326c", marginRight: 5 }}>[필수]</span>
                                    <div className={classNames("check-div", { "active": is_agree })}>
                                        <div />
                                    </div>
                                    <span>동의합니다.</span>
                                </div>
                            </div>
                            <div className="step-content-agree-rule-content">
                                <h5 className="step-content-agree-rule-content__description description">
                                    포스냅은 고객의 요청에 정확하고 성실한 답변을 드리기 위해<br />
                                    필요한 최소한의 개인정보를 수집하고 있습니다.<br /><br />
                                    개인정보 수집 이용목적: 고객지원 담당자 확인 및 문의내용 처리<br />
                                    수집하는 개인정보 항목: 이름, 전화번호<br />
                                    수집하는 개인정보 처리 및 보존기간: 1년 보관 후 파기
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="consult_progress__step-button">
                    <div className="button-box two-button">
                        <button className="theme_black" style={{ width: "calc(50% - 5px)" }} onClick={this.onPrev}>이전</button>
                        <button
                            className="theme_yellow"
                            ref={node => { this.button = node; }}
                            style={{ width: "calc(50% - 5px)" }}
                            onClick={this.onSubmitConsult}
                        >신청하기</button>
                    </div>
                </div>
            </div>
        );
    }
}
