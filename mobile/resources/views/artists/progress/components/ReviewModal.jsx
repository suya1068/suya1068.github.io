import React, { Component, PropTypes } from "react";
import Swiper from "swiper";

import api from "forsnap-api";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Img from "shared/components/image/Img";
import TextArea from "shared/components/ui/textarea/TextArea";

import Heart from "mobile/resources/components/heart/Heart";

class ReviewModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            user_type: "A",
            comments: null,
            reply: null,
            replyText: ""
        };

        this.onReply = this.onReply.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const { buy_no } = this.props;
        const { user_type } = this.state;
        api.reservations.reserveComment(buy_no, user_type)
            .then(response => {
                const data = response.data;

                this.setState({
                    comment: data.comment,
                    reply: data.reply
                }, () => {
                    const { comment } = this.state;

                    if (utils.isArray(comment.review_img) && comment.review_img.length) {
                        const option = {
                            slidesPerView: 1,
                            initialSlide: 0,
                            preloadImages: false
                        };

                        this.SwiperList = new Swiper(".review__images", option);
                    }
                });
            }).catch(error => {
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak(error.data)
                    });
                }
            });
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onReply() {
        const { buy_no, review_no, onReply } = this.props;
        const { replyText } = this.state;

        if (typeof onReply === "function") {
            onReply(buy_no, review_no, replyText);
        }
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    render() {
        const { comment, reply, replyText } = this.state;

        if (!comment) {
            return null;
        }

        return (
            <div className="progress__review__modal">
                {!reply ?
                    <div className="review__modal__title">
                        <strong>후기</strong>에 대한 댓글을 달아주세요.
                    </div> :
                    <div className="review__modal__title">
                        <strong>후기 & 댓글</strong>
                    </div>
                }
                <div className="review__content">
                    {utils.isArray(comment.review_img) && comment.review_img.length ?
                        <div className="review__images">
                            <div className="swiper-wrapper">
                                {comment.review_img.map((o, i) => {
                                    return (
                                        <div key={i} className="swiper-slide">
                                            <div className="image__item">
                                                <Img image={{ src: o, content_width: 320, content_height: 320 }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div> : null
                    }
                    <div className="review__comment">
                        <div className="profile">
                            <div className="profile_img"><Img image={{ src: comment.profile_img, content_width: 110, content_height: 110 }} /></div>
                        </div>
                        <div className="content">
                            <div className="nick_name">{comment.name}</div>
                            <div className="option">
                                <div className="rate"><Heart total="5" score={comment.rating_avg} /></div>
                                <div className="date">{mewtime(comment.reg_dt).format("YYYY년 MM월 DD일")}</div>
                            </div>
                            <div className="comment">{comment.comment}</div>
                        </div>
                    </div>
                </div>
                {reply
                    ?
                        <div className="review__reply">
                            <div className="review__comment">
                                <div className="profile">
                                    <div className="profile_img"><div><Img image={{ src: reply.profile_img, content_width: 110, content_height: 110 }} /></div></div>
                                </div>
                                <div className="content">
                                    <div className="nick_name">{comment.nick_name}</div>
                                    <div className="option">
                                        <div className="date">{mewtime(reply.reg_dt).format("YYYY년 MM월 DD일")}</div>
                                    </div>
                                    <div className="comment">{reply.comment}</div>
                                </div>
                            </div>
                            <div className="buttons">
                                <button className="_button _button__white" onClick={() => Modal.close()}>확인</button>
                            </div>
                        </div>
                    :
                        <div className="review__reply">
                            <div className="reply__text">
                                <TextArea
                                    value={replyText}
                                    name="replyText"
                                    rows="10"
                                    max="1000"
                                    placeholder="후기에 댓글을 달아주세요."
                                    onChange={(e, n, v) => this.setStateData(() => ({ [n]: v }))}
                                />
                                <div className="length">{replyText.length} / 1000</div>
                            </div>
                            <div className="buttons">
                                <button className="_button _button__white" onClick={() => Modal.close()}>취소</button>
                                <button className="_button _button__white" onClick={this.onReply}>댓글 쓰기</button>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

ReviewModal.propTypes = {
    buy_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    review_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onReply: PropTypes.func
};

export default ReviewModal;
