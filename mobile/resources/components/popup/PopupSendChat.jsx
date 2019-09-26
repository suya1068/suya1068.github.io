import "./scss/PopupSendChat.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import API from "forsnap-api";
import auth from "forsnap-authentication";
import redirect from "forsnap-redirect";
// import constant from "shared/constant";
import utils from "forsnap-utils";
import PopModal from "shared/components/modal/PopModal";
import Img from "shared/components/image/Img";

class PopupSendChat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            isPhone: props.isPhone,
            msg: props.data.msg || "",
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
        const eAction = "";
        const eLabel = `상품번호: ${no} / 상품명: ${title}`;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    sendMessage() {
        const data = this.state.data;
        this.apiTalksSend(data.user_id, data.no).then(response => {
            this.progress(false);
            PopModal.closeProgress();
            if (response.status === 200) {
                PopModal.close();
                //utils.ad.wcsEvent("5");
                this.gaEvent(data.product_no, data.title);
                PopModal.confirm(
                    "문의가 등록되었습니다.\n답변이 완료되면 sms로 알려드려요!\n지금 메시지를 확인하시겠습니까?",
                    () => {
                        document.location.href = `/users/chat?user_id=${data.user_id}&product_no=${data.no}`;
                    }
                );
                // this.wcsEvent();
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

    // wcsEvent() {
    //     if (wcs && wcs.cnv && wcs_do) {
    //         const _nasa = {};
    //         _nasa["cnv"] = wcs.cnv("5", "1");
    //         wcs_do(_nasa);
    //     }
    // }

    progress(b) {
        this.state.isProcess = b;

        if (b) {
            PopModal.progress();
        } else {
            PopModal.closeProgress();
        }
    }

    render() {
        const { data } = this.props;
        const { isPhone, msg, phone } = this.state;

        return (
            <div className="popup__send__chat">
                <div className="popup__send__chat__head">
                    <div className="profile_img">
                        <Img image={{ src: data.profile_img ? data.profile_img : "", content_width: 90, content_height: 90 }} />
                    </div>
                    <h1 className="send__chat__title">[{data.nick_name ? data.nick_name : ""}] 작가님께 <strong>문의</strong>를 남겨주세요.</h1>
                </div>
                <div className={classNames("send__chat__text", { disabled: !!data.msg })}>
                    <textarea
                        className="textarea"
                        disabled={!!data.msg}
                        placeholder={"촬영내용, 일정, 컷 수 등을 상세하게 남겨주실수록 더욱 자세한 상담이 가능합니다."}
                        value={msg}
                        onChange={!data.msg ? e => this.setState({ msg: e.currentTarget.value }) : null}
                    />
                </div>
                {!isPhone ?
                    <div className="popup__phone__body">
                        <div className="body__phone">
                            <input type="tel" value={phone} className="input" maxLength="11" onChange={this.onChange} />
                        </div>
                        <span className="body__caption"><span className="icon">!</span>연락처를 입력하시면 SMS로 알림을 드립니다.</span>
                    </div>
                    : null
                }
                <div className="send__chat__button">
                    <button className="button button-block button__rect button__theme__yellow" onClick={this.onSend}>확인</button>
                </div>
            </div>
        );
    }
}

PopupSendChat.propTypes = {
    data: PropTypes.shape([PropTypes.node]),
    isPhone: PropTypes.bool
};

export default PopupSendChat;
