import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";

import PopModal from "shared/components/modal/PopModal";
import Img from "shared/components/image/Img";
import FTextarea from "shared/components/ui/input/FTextarea";

import Heart from "mobile/resources/components/heart/Heart";

class ProductPackageReviewItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "",
            isWrite: false
        };

        this.onWrite = this.onWrite.bind(this);
        this.onToggleWrite = this.onToggleWrite.bind(this);
    }

    onWrite() {
        const { data, onWrite } = this.props;
        const { message } = this.state;

        if (!message || message.replace(/\s/g, "") === "") {
            PopModal.alert("내용을 입력해주세요", { key: "error-review-message" });
        } else if (message.length < 10) {
            PopModal.alert("최소 10자 이상 입력해주세요.", { key: "error-review-message" });
        } else if (typeof onWrite === "function") {
            onWrite(data.review_no, message);
        }
    }

    onToggleWrite() {
        this.setState({
            isWrite: !this.state.isWrite
        });
    }

    render() {
        const { data, isComment, artist_id } = this.props;
        const { message, isWrite } = this.state;
        const {
            review_no,
            user_type,
            comment,
            name,
            profile_img,
            review_img,
            reg_dt,
            rating_avg,
            auto_reg_dt
        } = data;
        const content = [];
        const user = auth.getUser();
        const change_rating = !auto_reg_dt ? rating_avg : 5;

        if (user_type === "U") {
            let reviewImage = null;
            if (utils.isArray(review_img)) {
                const images = review_img.reduce((result, img) => {
                    if (img) {
                        result.push({
                            src: img,
                            content_width: 193,
                            content_height: 145
                        });
                    }

                    return result;
                }, []);

                if (utils.isArray(images)) {
                    reviewImage = (
                        <div className="review__images">
                            <div className="review__images__container">
                                {images.map((img, imgIndex) => {
                                    return (
                                        <Img key={`review-images-item-${imgIndex}`} image={img} />
                                    );
                                })}
                            </div>
                        </div>
                    );
                }
            }

            content.push(
                <div key={`review-${user_type}-${review_no}`} className="review__item">
                    <div>
                        <div className="review__item__user">
                            <div className="user__profile">
                                <Img image={{ src: profile_img, content_width: 110, content_height: 110, default: "/common/default_profile_img.jpg" }} />
                            </div>
                            <div className="user__info">
                                <div className="title">
                                    {name}
                                </div>
                                <div className="score">
                                    <div className="heart">
                                        <Heart score={change_rating} />
                                    </div>
                                    <div className="date">
                                        {mewtime(reg_dt).format("YYYY-MM-DD")}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="review__item__content">
                            {utils.linebreak(comment)}
                        </div>
                    </div>
                    {reviewImage}
                    {user && user.id === artist_id && !isComment ?
                        <div>
                            <div className="review__item__content">
                                {!isComment ?
                                    <div className={classNames("review__item__write", { show: isWrite })}>
                                        <FTextarea
                                            value={message}
                                            onChange={(e, value) => (this.state.message = value)}
                                            inline={{
                                                rows: "6",
                                                maxLength: "1000",
                                                placeholder: ""
                                            }}
                                        />
                                        <button key="button" className="f__button f__button__block" onClick={this.onWrite}>등록하기</button>
                                    </div> : null
                                }
                                {!isComment && !isWrite && !auto_reg_dt ? <button className="f__button" onClick={this.onToggleWrite}>답글쓰기</button> : null}
                            </div>
                        </div> : null
                    }
                </div>
            );
        } else {
            content.push(
                <div key={`review-${user_type}-${review_no}`} className="review__item artist__review">
                    <div className="review__item__artist">
                        <div className="title">
                            {name}
                        </div>
                        <div className="date">
                            {mewtime(reg_dt).format("YYYY-MM-DD")}
                        </div>
                        <div className="content">
                            {utils.linebreak(comment)}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                {content}
            </div>
        );
    }
}

ProductPackageReviewItem.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired,
    isComment: PropTypes.bool,
    artist_id: PropTypes.string,
    onWrite: PropTypes.func
};

ProductPackageReviewItem.defaultProps = {
    artist_id: null
};

export default ProductPackageReviewItem;
