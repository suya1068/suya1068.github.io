import "../scss/popInputPhone.scss";
import React, { Component, PropTypes } from "react";

import API from "forsnap-api";
import auth from "forsnap-authentication";
import redirect from "forsnap-redirect";
import utils from "forsnap-utils";

import Buttons from "desktop/resources/components/button/Buttons";
import Input from "desktop/resources/components/form/Input";

import PopModal from "shared/components/modal/PopModal";

export default class PopInputPhone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPhone: props.isPhone,
            phone: "",
            isProcess: false
        };

        this.onSend = this.onSend.bind(this);
        this.onChange = this.onChange.bind(this);
        this.apiModifyPhone = this.apiModifyPhone.bind(this);
        this.modifyPhone = this.modifyPhone.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.progress = this.progress.bind(this);
    }

    onSend() {
        const user = auth.getUser();
        const { isPhone, phone, isProcess } = this.state;
        const length = phone.replace(/\s/g, "").length;

        if (!isProcess) {
            this.progress(true);

            if (!user) {
                redirect.login({ redirectURL: location.pathname });
            } else if (!isPhone && length < 1) {
                PopModal.toast("핸드폰 번호를 입력해주세요");
            } else if (!isPhone && length < 10) {
                PopModal.toast("핸드폰 번호를 10 ~ 11자 사이로 입력해주세요");
            } else {
                if (isPhone) {
                    this.sendMessage();
                } else {
                    this.modifyPhone(this.sendMessage);
                }

                return;
            }

            this.progress(false);
        }
    }

    onChange(e) {
        const target = e.currentTarget;
        const maxLength = target.maxLength;
        const phone = target.value.replace(/[\D]+/g, "");

        if (maxLength && phone.length > maxLength) {
            return;
        }

        this.setState({
            phone
        });
    }

    apiModifyPhone(id, obj) {
        return API.users.modifyPhone(id, obj);
    }

    modifyPhone(callBack = undefined) {
        const user = auth.getUser();
        const { phone } = this.state;
        this.apiModifyPhone(user.id, { phone }).then(response => {
            this.progress(false);
            if (response.status === 200) {
                if (typeof callBack === "function") {
                    callBack();
                }
            }
        }).catch(error => {
            this.progress(false);
            PopModal.alert(error.data);
        });
    }

    progress(b) {
        this.state.isProcess = b;

        if (b) {
            PopModal.progress();
        } else {
            PopModal.closeProgress();
        }
    }

    sendMessage() {
        PopModal.toast("감사합니다. 핸드폰 번호가 등록되었습니다. ");
        PopModal.close(this.props.name, this.props.close);
    }

    render() {
        const { isPhone, phone } = this.state;

        return (
            <div className="phonePop">
                <h1 className="h6 chat-title">연락처를 입력해 주세요.</h1>
                <div className="chat-phone">
                    <div className="phone-input">
                        <Input inputStyle={{ width: "w412" }} inline={{ placeholder: "휴대폰 번호*", type: "tel", value: phone, maxLength: "11", onChange: this.onChange }} />
                    </div>
                    <span className="phone-caption"><span className="icon">!</span>연락처를 입력하시면 SMS로 알림을 드립니다.</span>
                </div>
                <div className="chat-btn">
                    <Buttons buttonStyle={{ width: "w412", shape: "circle", theme: "default" }} inline={{ onClick: this.onSend }} >확인</Buttons>
                </div>
            </div>
        );
    }
}

PopInputPhone.propTYpes = {
    isPhone: PropTypes.bool
};
