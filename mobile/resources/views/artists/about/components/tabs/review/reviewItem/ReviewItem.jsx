import "./reviewItem.scss";
import React, { Component, PropTypes } from "react";
import Img from "desktop/resources/components/image/Img";
import utils from "forsnap-utils";
import Swiper from "swiper";
import constant from "shared/constant";

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
                <div className="review-img-swiper swiper-container" id={UUID}>
                    <div className="swiper-wrapper">
                        {obj.review_img.map((image, idx) => {
                            return (
                                <div className="swiper-slide" key={`review_img_${obj.review_no}__${idx}`}>
                                    <Img image={{ src: image, content_width: 504, content_height: 504, width: 3, height: 2 }} isCrop />
                                </div>
                            );
                        })}
                    </div>
                    <div className="count-wrap">
                        <span className="current-count">{activeIndex}</span>
                        <span className="total-count">{obj.review_img.length}</span>
                    </div>
                </div>
            );
        }

        return (
            <div className="about-artist-user_review">
                {reviewImg}
                <div className="user">
                    <div className="user-profile">
                        <Img image={{ src: obj.profile_img, content_width: 90, content_height: 90, default: constant.DEFAULT_IMAGES.PROFILE }} isCrop />
                    </div>
                    <div className="user-content">
                        <p className="name">{obj.name}</p>
                        <p className="comment">{utils.linebreak(obj.comment)}</p>
                        <p className="reg_dt">{obj.reg_dt}</p>
                    </div>
                    {/*<div className="recommend-heart">*/}
                    {/*<div className="heart full" />*/}
                    {/*<div className="heart half" />*/}
                    {/*<div className="heart" />*/}
                    {/*<div className="heart" />*/}
                    {/*<div className="heart" />*/}
                    {/*<p className="rating">{obj.rating_avg}</p>*/}
                    {/*</div>*/}
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
            <article className="m-about-artist-review-item">
                {this.renderReview(reviewItem)}
            </article>
        );
    }
}
