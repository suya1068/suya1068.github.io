import "../scss/products_question.scss";
import React, { Component, PropTypes } from "react";

import API from "forsnap-api";
import auth from "forsnap-authentication";
// import redirect from "forsnap-redirect";
import utils from "forsnap-utils";

import PopModal from "shared/components/modal/PopModal";

import Buttons from "desktop/resources/components/button/Buttons";
import Input from "desktop/resources/components/form/Input";
import FTextarea from "shared/components/ui/input/FTextarea";
import Img from "shared/components/image/Img";

class ProductsQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isProcess: false,
            phone: props.data.phone,
            msg: props.data.message || "",
            profile_img: props.data.profile_img || "",
            nick_name: props.data.nick_name || "",
            placeHolder: props.placeHolder || "촬영내용, 일정, 컷 수 등을 상세하게 남겨주실수록 더욱 자세한 상담이 가능합니다."
        };

        this.onProgress = this.onProgress.bind(this);
        this.onSend = this.onSend.bind(this);
        this.onChangePhone = this.onChangePhone.bind(this);

        this.isLogin = this.isLogin.bind(this);
        this.apiSendMessage = this.apiSendMessage.bind(this);
    }

    onProgress(b) {
        this.state.isProcess = b;

        if (b) {
            PopModal.progress();
        } else {
            PopModal.closeProgress();
        }
    }

    onSend() {
        const { data } = this.props;
        const { msg, phone, isProcess } = this.state;
        const user = this.isLogin();

        if (!isProcess && user) {
            this.onProgress(true);
            const length = phone && typeof phone === "string" ? phone.replace(/\s/g, "").length : "";

            if (msg.replace(/\s/g) === "") {
                PopModal.toast("메시지를 입력해주세요");
            } else if (length < 1) {
                PopModal.toast("핸드폰 번호를 입력해주세요");
            } else if (length < 10) {
                PopModal.toast("핸드폰 번호를 10 ~ 11자 사이로 입력해주세요");
            } else {
                if (!data.phone) {
                    API.users.modifyPhone(user.id, { phone }).then(response => {
                        if (response.status === 200) {
                            this.apiSendMessage();
                        }
                    }).catch(error => {
                        this.onProgress(false);
                        PopModal.alert(error.data);
                    });
                } else {
                    this.apiSendMessage();
                }

                return;
            }

            this.onProgress(false);
        }
    }

    onChangePhone(e) {
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

    isLogin() {
        const user = auth.getUser();

        if (user) {
            return user;
        }

        PopModal.alert("로그인 후 이용해주세요");
        return false;
    }

    // wcsEvent() {
    //     if (wcs && wcs.cnv && wcs_do) {
    //         const _nasa = {};
    //         _nasa["cnv"] = wcs.cnv("5", "1");
    //         wcs_do(_nasa);
    //     }
    // }

    apiSendMessage() {
        const { msg } = this.state;
        const { user_id, product_no, title } = this.props.data;

        API.talks.send(user_id, product_no, "U", "PRODUCT_BOT", msg).then(response => {
            this.onProgress(false);
            if (response.status === 200) {
                PopModal.close();
                //utils.ad.wcsEvent("5");
                // PopModal.toast("전송되었습니다. 고객님.<br />마이페이지 '대화하기'에서 확인 가능하세요.");
                PopModal.confirm(
                    "문의가 등록되었습니다.\n답변이 완료되면 sms로 알려드려요!\n지금 메시지를 확인하시겠습니까?",
                    () => {
                        document.location.href = `/users/chat/${user_id}/${product_no}`;
                    }
                );
                // this.wcsEvent();
                // this.gaEvent(product_no, title);
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

    getPhoneNumber() {
        return this.state.phone;
    }

    render() {
        const data = this.props.data;
        const { phone, msg, nick_name, profile_img, placeHolder } = this.state;

        return (
            <div className="popup__products__question">
                <div className="layout__header">
                    <div className="profile_image">
                        <Img image={{ src: profile_img, content_width: 90, content_height: 90 }} />
                    </div>
                    <h1>[{nick_name}] 작가님께 <strong>문의</strong>를 남겨주세요.</h1>
                </div>
                <div className="layout__body">
                    <div className="layout__body__main">
                        <div className="question__message">
                            <FTextarea
                                value={msg}
                                onChange={(e, value) => this.setState({ msg: value })}
                                inline={{
                                    rows: 7,
                                    placeholder: placeHolder,
                                    readOnly: !!data.message
                                }}
                            />
                        </div>
                        {!data.phone ? [
                            <div key="question__phone" className="question__phone">
                                <Input inputStyle={{ width: "w412" }} inline={{ placeholder: "휴대폰 번호*", type: "tel", value: phone, maxLength: "11", onChange: this.onChangePhone }} />
                            </div>,
                            <div key="question__caption" className="question__caption">
                                <span className="icon">!</span><span className="text">연락처를 입력하시면 SMS로 알림을 드립니다.</span>
                            </div>] : null
                        }
                        <div className="question__button">
                            <Buttons buttonStyle={{ width: "w412", shape: "circle", theme: "default" }} inline={{ onClick: this.onSend }} >확인</Buttons>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// data - phone
ProductsQuestion.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired
};

export default ProductsQuestion;
