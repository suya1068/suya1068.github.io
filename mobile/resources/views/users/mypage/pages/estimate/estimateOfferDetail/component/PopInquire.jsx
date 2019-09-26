import "./popInquire.scss";
import React, { Component, PropTypes } from "react";
import API from "forsnap-api";
import PopModal from "shared/components/modal/PopModal";
import utils from "forsnap-utils";

export default class PopInquire extends Component {
    constructor(props) {
        super(props);
        this.state = {
            className: "chat",
            answer_type: "대화하기",
            content: "",
            isProcess: false
        };
        this.onClick = this.onClick.bind(this);
        this.onChangeContent = this.onChangeContent.bind(this);
    }

    componentWillMount() {
    }

    onClick(className) {
        const answer_type = "대화하기";
        // if (className === "phone") {
        //     answer_type = "전화답변";
        // }
        this.setState({
            className,
            answer_type
        });
    }

    onChangeContent(e) {
        this.setState({
            content: e.currentTarget.value
        });
    }

    onClose() {
        if (typeof this.props.onCloseInquire === "function") {
            this.props.onCloseInquire();
        }
    }

    isActive(className) {
        return className === this.state.className;
    }

    validationInquire() {
        const { content } = this.state;
        let message = "";
        if (content === "") {
            message = "문의 내용을 입력해 주세요";
        }

        if (message) {
            PopModal.toast(message);
            return false;
        }

        return true;
    }

    addTalkOfferInfo() {
        const { artist_id, id, order_no, no } = this.props;
        const { answer_type, content, isProcess } = this.state;
        if (this.validationInquire()) {
            // const data = {
            //     order_no,
            //     offer_no: no,
            //     answer_type,
            //     content
            // };
            // const request = API.talks.insertTalkOfferInfo(id, { ...data });

            if (!isProcess) {
                this.state.isProcess = true;
                PopModal.progress();

                const request = API.talks.send(artist_id, no, "U", "OFFER", content);
                request.then(response => {
                    PopModal.closeProgress();
                    if (response.status === 200) {
                        PopModal.confirm(
                            "문의가 등록되었습니다.\n마이페이지 > 대화하기에서 확인 가능합니다.",
                            () => {
                                this.onClose();
                            },
                            () => {
                                let url = `/users/chat/${artist_id}/offer/${no}`;
                                if (utils.agent.isMobile()) {
                                    url = `/users/chat?user_id=${artist_id}&offer_no=${no}`;
                                }

                                location.href = url;
                            },
                            "center",
                            {
                                titleOk: "확인",
                                titleCancel: "바로가기"
                            }
                        );
                    } else {
                        PopModal.alert("에러가 발생했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                            key: "popup-inquire-error"
                        });
                    }
                }).catch(error => {
                    PopModal.closeProgress();
                    PopModal.alert(error.data);
                });
            }
        }
    }

    render() {
        return (
            <div className="offer-detail-footer-inquire">
                <div className="inquire-content">
                    <div className="inquire-title">
                        <p>문의내용을 입력해주세요.</p>
                    </div>
                    <textarea
                        className="textarea"
                        maxLength={200}
                        placeholder="촬영문의 드립니다."
                        onChange={this.onChangeContent}
                        value={this.state.content}
                    />
                </div>
                <div className="inquire-mode" />
                <div className="inquire-buttons">
                    <button
                        className="button button-block button__rect close"
                        onClick={() => this.onClose()}
                    >닫기</button>
                    <button className="button button-block button__rect submit" onClick={() => this.addTalkOfferInfo()}>확인</button>
                </div>
            </div>
        );
    }
}

// <div className="inquire-mode">
//     <div className={classNames("mode chat", { "active": this.isActive("chat") })} onClick={() => this.onClick("chat")}>
//         <div className="circle">
//             <i className={classNames("m-icon", this.isActive("chat") ? "m-icon-check-white" : "m-icon-check")} />
//         </div>
//         <p>대화하기</p>
//     </div>
//     <div className={classNames("mode phone", { "active": this.isActive("phone") })} onClick={() => this.onClick("phone")}>
//         <div className="circle">
//             <i className={classNames("m-icon", this.isActive("phone") ? "m-icon-check-white" : "m-icon-check")} />
//         </div>
//         <p>전화답변</p>
//     </div>
// </div>
