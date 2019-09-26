import "../pop_common.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import desk from "desktop/resources/management/desktop.api";
import mewtime from "forsnap-mewtime";
import utils from "forsnap-utils";

import constant from "shared/constant";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import ImageSlider from "desktop/resources/components/image/ImageSlider";
import Profile from "desktop/resources/components/image/Profile";
import Heart from "desktop/resources/components/form/Heart";
import Buttons from "desktop/resources/components/button/Buttons";

class PopupReply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: undefined,
            reply: undefined,
            replyText: "",
            isProcess: false
        };

        this.setComment = this.setComment.bind(this);
        this.writeReply = this.writeReply.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.apiProductComment();
    }

    setComment(e) {
        const current = e.currentTarget;
        const value = current.value;

        this.setState({
            replyText: value
        });
    }

    /**
     * 등록된 후기상세
     */
    apiProductComment() {
        setTimeout(() => {
            const buyNo = this.props.buyNo;
            // const productNo = this.props.productNo;
            const userType = this.props.userType;

            const request = desk.reservations.reserveComment(buyNo, userType);
            request.then(response => {
                // console.log(response);
                const data = response.data;
                const comment = data.comment;
                const reply = data.reply;

                this.setState({
                    comment,
                    reply,
                    replyText: "",
                    isProcess: false
                });
            }).catch(error => {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: utils.linebreak(error.data)
                });
            });
        }, 1000);
    }

    /**
     * API 후기에 댓글 등록
     * @param replyText - String (등록할 댓글)
     */
    apiReserveCommentReply(replyText) {
        const buyNo = this.props.buyNo;
        // const productNo = this.props.productNo;
        const commentNo = this.props.reviewNo;
        const data = { comment: replyText };

        const request = desk.reservations.reserveCommentReplay(buyNo, commentNo, data);
        request.then(response => {
            if (response.status === 200) {
                this.state.isProcess = false;
                this.apiProductComment();
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "댓글이 등록되었습니다."
                });
            }
        }).catch(error => {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(error.data)
            });
        });
    }

    /**
     * 후기 댓글 작성
     */
    writeReply() {
        const replyText = this.state.replyText;

        if (!this.state.isProcess) {
            this.state.isProcess = true;
            if (replyText.trim().length > 1000) {
                this.state.isProcess = false;
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "댓글은 1000자 이하로 입력가능합니다."
                });
            } else if (replyText.trim().length < 10) {
                this.state.isProcess = false;
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "최소 10자 이상 적어주세요."
                });
            } else {
                Modal.show({
                    type: MODAL_TYPE.CONFIRM,
                    content: "댓글을 등록하시겠습니까?",
                    onSubmit: () => {
                        this.apiReserveCommentReply(replyText);
                    },
                    onCancel: () => {
                        this.state.isProcess = false;
                    }
                });
            }
        }
    }

    /**
     * 후기 확인
     */
    finalComplete() {
        Modal.close();
    }


    render() {
        const comment = this.state.comment;
        const reply = this.state.reply;
        let isReviewImg = false;

        let imageSlider = null;
        let userComment = null;
        let artistReply = null;
        let button = null;

        if (comment !== undefined) {
            const reviewImg = comment.review_img.reduce((result, obj) => {
                const data = {
                    src: obj,
                    type: "thumb"
                };
                result.push(data);
                return result;
            }, []);

            if (reviewImg.length > 0) {
                isReviewImg = true;
                imageSlider = (
                    <div className="reply-review-image">
                        <ImageSlider data={{ images: reviewImg, arrow: { posX: 10 }, nav: { position: "bottom" } }} />
                    </div>
                );
            }

            userComment = (
                <div className="reply-content">
                    <div className="reply-profile">
                        <Profile image={{ src: comment.profile_img }} />
                        <p className="reply-name">{comment.name}</p>
                    </div>
                    <div className="reply-comment">
                        <p className="reply-text">{comment.comment}</p>
                        <p className="reply-date">{mewtime(comment.reg_dt).format("YYYY년 MM월")}</p>
                    </div>
                    <div className="reply-rating">
                        <Heart count={comment.rating_avg} disabled="disabled" />
                    </div>
                </div>
            );

            if (reply) {
                artistReply = (
                    <div className="reply-content artist-reply">
                        <div className="reply-profile">
                            <Profile image={{ src: reply.profile_img }} />
                            <p className="reply-name">{reply.nick_name}</p>
                        </div>
                        <div className="reply-comment">
                            <p className="reply-text">{reply.comment}</p>
                            <p className="reply-date">{mewtime(reply.reg_dt).format("YYYY년 MM월")}</p>
                        </div>
                    </div>
                );

                button = (
                    <div className="reply-buttons">
                        <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ onClick: this.finalComplete }}>확인</Buttons>
                    </div>
                );
            } else {
                artistReply = (
                    <div className="reply-content">
                        <textarea className="reply-textarea" maxLength="1000" onChange={this.setComment} />
                        <span className="text-count">{this.state.replyText.length}/1000</span>
                    </div>
                );

                button = (
                    <div className="reply-buttons">
                        <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ onClick: this.writeReply }}>댓글 쓰기</Buttons>
                    </div>
                );
            }
        } else {
            userComment = (
                <div className="loading-progress">
                    <img alt="loading-progress" src={__SERVER__.img + constant.PROGRESS.COLOR_CAT} />
                </div>
            );
        }

        return (
            <div className="pop-reply">
                <div className={classNames("reply-head", isReviewImg ? "" : "underline")}>
                    <h3 className="reply-title"><strong>후기</strong>에 대한 댓글을 달아주세요.</h3>
                </div>
                {imageSlider}
                {userComment}
                {artistReply}
                {button}
            </div>
        );
    }
}

PopupReply.propTypes = {
    buyNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    // productNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    reviewNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    userType: PropTypes.oneOf(["U", "A"])
};

PopupReply.defaultProps = {
    userType: "U"
};

export default PopupReply;
