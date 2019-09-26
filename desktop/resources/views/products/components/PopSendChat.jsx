import "../scss/popSendChat.scss";
import React, { Component, PropTypes } from "react";

import API from "forsnap-api";
import auth from "forsnap-authentication";
import redirect from "forsnap-redirect";
import utils from "forsnap-utils";

import Buttons from "desktop/resources/components/button/Buttons";
import Input from "desktop/resources/components/form/Input";

import PopModal from "shared/components/modal/PopModal";

export default class PopSendChat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            isPhone: props.isPhone,
            msg: "",
            phone: "",
            isProcess: false
        };

        this.onSend = this.onSend.bind(this);
        this.onChange = this.onChange.bind(this);
        this.apiTalksSend = this.apiTalksSend.bind(this);
        this.apiModifyPhone = this.apiModifyPhone.bind(this);
        this.modifyPhone = this.modifyPhone.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.progress = this.progress.bind(this);
    }

    onSend() {
        const user = auth.getUser();
        const { isPhone, msg, phone, isProcess } = this.state;
        const length = phone.replace(/\s/g, "").length;

        if (!isProcess) {
            this.progress(true);

            if (!user) {
                redirect.login({ redirectURL: location.pathname });
            } else if (msg.replace(/\s/g) === "") {
                PopModal.toast("메시지를 입력해주세요");
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

    apiTalksSend(artistId, no) {
        return API.talks.send(artistId, no, "U", "PRODUCT_BOT", this.state.msg);
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

    gaEvent(no, title) {
        const eCategory = "상품대화하기시작";
        const eAction = "대화";
        const eLabel = `상품번호: ${no} / 상품명: ${title}`;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
        // ga("Event.send", "event", {
        //     eventCategory: "상품대화하기시작",
        //     eventAction: "데스크탑",
        //     eventLabel: `상품번호: ${no} / 상품명: ${title}`
        // });
    }

    sendMessage() {
        const data = this.state.data;
        this.apiTalksSend(data.artistId, data.no).then(response => {
            this.progress(false);
            PopModal.closeProgress();
            if (response.status === 200) {
                PopModal.close();
                PopModal.toast("전송되었습니다. 고객님.<br />마이페이지 '대화하기'에서 확인 가능하세요.");

                this.gaEvent(data.no, data.title);
            }
        }).catch(error => {
            this.progress(false);
            PopModal.closeProgress();
            if (error.status === 412) {
                PopModal.alert(error.data);
            } else if (error.status === 400) { // 작가가 자기자신의 상품에 대화하기를 하였을 경우 에러
                PopModal.alert(error.data);
            }
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

    render() {
        const { isPhone, msg, phone } = this.state;

        return (
            <div className="chatPop">
                <h1 className="h6 chat-title"><strong>간단한 메시지</strong>를 입력해주세요.</h1>
                <div className="chat-text">
                    <Input
                        inputStyle={{ width: "w412" }}
                        inline={{ placeholder: "촬영 문의 드립니다.", value: msg, onChange: (e, value) => this.setState({ msg: value }) }}
                    />
                </div>
                {!isPhone ?
                    <div className="chat-phone">
                        <div className="phone-input">
                            <Input inputStyle={{ width: "w412" }} inline={{ placeholder: "휴대폰 번호*", type: "tel", value: phone, maxLength: "11", onChange: this.onChange }} />
                        </div>
                        <span className="phone-caption"><span className="icon">!</span>연락처를 입력하시면 SMS로 알림을 드립니다.</span>
                    </div>
                    : null
                }
                <div className="chat-btn">
                    <Buttons buttonStyle={{ width: "w412", shape: "circle", theme: "default" }} inline={{ onClick: this.onSend }} >확인</Buttons>
                </div>
                <div className="forsnap-warning">
                    <p className="forsnap-warning-title">포스냅에서 알려드립니다.</p>
                    <p className="forsnap-warning-text">
                        {utils.linebreak("포스냅을 통하지 않은 거래는 매매보호서비스를 받을 수 없으며,\n" +
                        "촬영 진행과정에서 제공되는 다양한 서비스를 이용하실 수 없습니다.\n" +
                        "또한, 직거래시 발생하는 문제는 포스냅에서 도움을 드릴 수 없습니다.")}
                    </p>
                </div>
            </div>
        );
    }
}

PopSendChat.propTypes = {
    data: PropTypes.shape([PropTypes.node]),
    isPhone: PropTypes.bool
};
