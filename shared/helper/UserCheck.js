import "./userCheck.scss";
import React, { Component } from "react";
import auth from "forsnap-authentication";
import API from "forsnap-api";
import PopModal from "shared/components/modal/PopModal";
import utils from "forsnap-utils";
import redirect from "forsnap-redirect";

export default class UserCheck {
    /**
     * 유저 정보 체크
     */
    checkUser() {
        const user = auth.getUser();
        if (user) {
            return API.users.find(user.id);
        }
        return null;
    }

    /**
     * 로그인 여부 체크
     * @returns {*}
     */
    isLogin(isAlert = true) {
        const user = auth.getUser();

        if (user) {
            return user;
        }
        if (isAlert) {
            const agent = utils.agent.isMobile();
            const modal_name = "is_login_alert";

            const content = (
                <div className={`is_login_alert ${agent ? "mobile" : "web"}`}>
                    <div className="is_login_alert__heading">
                        <p>{utils.linebreak("\"로그인하셔야 문의에 대한\n 답변을 받으실 수 있어요.\"")}</p>
                    </div>
                    <div className="is_login_alert__describe">
                        <p>{utils.linebreak("로그인하셔야 문의에 대한 답변을 받으실 수 있어요.\n회원가입 및 로그인은 1초면 가능합니다.\n회원가입 및 로그인 하시겠습니까?")}</p>
                    </div>
                    <div className="is_login_alert__buttons">
                        <button className="is_login_alert__buttons-ok" onClick={this.alertOK}>확인</button>
                        <button className="is_login_alert__buttons-cancel" onClick={() => this.alertCancel(modal_name)}>취소</button>
                    </div>
                </div>
            );

            PopModal.createModal(modal_name, content, { modal_close: false });
            PopModal.show(modal_name);
            return false;
        }
        return false;
    }

    alertCancel(name) {
        PopModal.close(name);
    }

    alertOK() {
        const param = location.search;
        redirect.login({ redirectURL: `${location.pathname}${param || ""}` });
    }
}
