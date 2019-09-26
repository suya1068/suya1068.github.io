import "./complete_phase.scss";
import React, { Component, Proptypes } from "react";
import utils from "forsnap-utils";
import ConsultLogin from "./component/ConsultLoginManager";
import classNames from "classnames";

export default class CompletePhase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user || false,
            device_type: props.device_type,
            heading_desc: "",
            complete_alert: ""
        };
        this.consult_login_manager = ConsultLogin.create(props.device_type);
        this.onClose = this.onClose.bind(this);
        this.login = this.login.bind(this);
        this.onConsultLogin = this.onConsultLogin.bind(this);
    }

    componentWillMount() {
        const { user } = this.state;
        let heading_desc = "포스냅에 가입하시면 촬영과정을\n빠르고 편리하게 확인할 수 있습니다.";
        let complete_alert = "네이버, 페이스북, 카카오톡 아이디로 1초면 가입이 완료됩니다.";
        if (user) {
            heading_desc = "접수해주신 내용을 바탕으로\n포스내 담당자가 전화를 드릴 예정입니다.";
            complete_alert = "상담가능 시간 평일 10:00 ~ 17:00";
        }
        this.setState({ heading_desc, complete_alert });
    }

    /**
     * 로그인
     */
    login(type) {
        this.consult_login_manager.login(type);
    }


    onConsultLogin(e) {
        const target = e.target;
        // if (this.state.device_type === "mobile") {
        //     localStorage.setItem("redirect_url", document.referrer);
        // }
        const select_social = target.classList[1].toUpperCase();
        this.login(select_social);
    }

    onClose() {
        if (localStorage) {
            const temp_user_id = localStorage.getItem("temp_user_id");
            if (temp_user_id) {
                localStorage.removeItem("temp_user_id");
            }
            localStorage.removeItem("advice_order_no");
        }

        if (typeof this.props.onClose === "function") {
            this.props.onClose();
        }
    }

    /**
     * 로그인 시 노출내용
     * @returns {*}
     */
    renderIsLogin() {
        return (
            <div className="consult_complete__content">
                <div className="check-mark" onClick={this.onClose}>
                    <div className="mark-icon" />
                </div>
            </div>
        );
    }

    /**
     * 비 로그인 시 노출내용
     * @returns {*}
     */
    renderNoneLogin() {
        return (
            <div className="consult_complete__content">
                <div className="consult_complete__content-login_box" onClick={this.onConsultLogin}>
                    <button className="login_box naver button">네이버</button>
                    <button className="login_box facebook button">페이스북</button>
                    <button className="login_box kakao button">카카오톡</button>
                </div>
            </div>
        );
    }

    /**
     * 유저객체 여부에 따라 렌더링 결정
     * @returns {*}
     */
    renderDisplay() {
        const { user } = this.state;
        if (user) {
            return this.renderIsLogin();
        }

        return this.renderNoneLogin();
    }

    render() {
        const { device_type, heading_desc, complete_alert } = this.state;
        return (
            <div className={classNames("consult_complete", device_type)}>
                <div className="consult_complete__header">
                    <h3 className="consult_complete__header-title">상담신청이 완료되었습니다.</h3>
                    <p className="consult_complete__header-desc">{utils.linebreak(heading_desc)}</p>
                </div>
                {this.renderDisplay()}
                <p className="complete-alert">{complete_alert}</p>
            </div>
        );
    }
}
