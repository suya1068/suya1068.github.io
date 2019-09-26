import "./reviewItem.scss";
import React, { Component, PropTypes } from "react";
import Img from "desktop/resources/components/image/Img";
import Profile from "desktop/resources/components/image/Profile";
import Icon from "desktop/resources/components/icon/Icon";
import Heart from "desktop/resources/components/form/Heart";
import utils from "forsnap-utils";
import classNames from "classnames";

import Swiper from "swiper";

export default class ReviewItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 1,
            reviewItem: props.reviewItem,
            UUID: utils.getUUID()
        };

        this.renderReview = this.renderReview.bind(this);
        this.renderUserReview = this.renderUserReview.bind(this);
        this.onInitSwiper = this.onInitSwiper.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.onInitSwiper(this.state.UUID);
    }

    onInitSwiper(UUID) {
        this.aboutReivewSwiper = new Swiper(`#${UUID}`, {
            slidesPerView: 1,
            nextButton: ".right-navigation",
            prevButton: ".left-navigation",
            onSlideNextStart: s => {
                this.setState({
                    activeIndex: s.activeIndex + 1
                });
            },
            onSlidePrevStart: s => {
                this.setState({
                    activeIndex: s.activeIndex + 1
                });
            }
        });
    }

    renderReview(obj) {
        let userReview = null;
        let artistReview = null;

        if (obj.user_review) {
            userReview = this.renderUserReview(obj.user_review);
        }

        if (obj.artist_review) {
            artistReview = this.renderArtistReview(obj.artist_review);
        }

        return (
            <div className="review-unit">
                {userReview}
                {artistReview}
            </div>
        );
    }

    renderUserReview(obj) {
        let reviewImg = null;

        const { activeIndex, UUID } = this.state;

        if (obj.review_img[0] !== null) {
            reviewImg = (
                <div className="wrap">
                    <div className="review-img-swiper swiper-container" id={UUID} /*onLoad={() => this.onInitSwiper(`review_${obj.review_no}`)}*/>
                        <div className="swiper-wrapper">
                            {obj.review_img.map((image, idx) => {
                                return (
                                    <div className="swiper-slide" key={`review_img_${obj.review_no}__${idx}`}>
                                        <Img image={{ src: image, content_width: 504, content_height: 504 }} isCrop />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="count-wrap">
                            <span className="current-count">{activeIndex}</span>
                            <span className="total-count">{obj.review_img.length}</span>
                        </div>
                        <div className="navigation">
                            <div className={classNames("left-navigation", { "hide": activeIndex === 1 })}><Icon name="lt_shadow" /></div>
                            <div className={classNames("right-navigation", { "hide": activeIndex === obj.review_img.length })}><Icon name="gt_shadow" /></div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="about-artist-user_review">
                {reviewImg}
                <div className="user">
                    <div className="user-profile">
                        <Profile image={{ src: obj.profile_img }} />
                    </div>
                    <div className="user-content">
                        <p className="name">{obj.name}</p>
                        <p className="comment">{utils.linebreak(obj.comment)}</p>
                        <p className="reg_dt">{obj.reg_dt}</p>
                    </div>
                    <div className="user-rating">
                        <Heart count={obj.rating_avg} disabled="disabled" />
                    </div>
                </div>
            </div>
        );
    }

    renderArtistReview(obj) {
        return (
            <div className="about-artist-artist_review">
                <div className="artist">
                    <p className="name">{obj.name}님의 댓글</p>
                    <p className="comment">{utils.linebreak(obj.comment)}</p>
                    <p className="reg_dt">{obj.reg_dt}</p>
                </div>
            </div>
        );
    }

    render() {
        const { reviewItem } = this.state;
        return (
            <article className="about-artist-review-item">
                {this.renderReview(reviewItem)}
            </article>
        );
    }
}
