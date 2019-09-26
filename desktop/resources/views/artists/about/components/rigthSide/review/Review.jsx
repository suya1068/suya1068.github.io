import "./review.scss";
import React, { Component, PropTypes } from "react";

import API from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";

import PopModal from "shared/components/modal/PopModal";

import ProductPackageReview from "mobile/resources/views/products/package/components/ProductPackageReview";

// import Buttons from "desktop/resources/components/button/Buttons";
import Icon from "desktop/resources/components/icon/Icon";

// import ReviewItem from "./reviewItem/ReviewItem";

const LIMIT = 5;

export default class Review extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reviewList: [],
            reviewCount: 0,
            reviewLimit: 3,
            isMore: false
        };

        this.onMoreReview = this.onMoreReview.bind(this);

        this.writeReview = this.writeReview.bind(this);
        this.getMoreReview = this.getMoreReview.bind(this);
    }

    componentWillMount() {
        this.onMoreReview();
    }

    componentWillReceiveProps(nextProps) {
        const { review } = nextProps;
        const { reviewList, reviewLimit } = this.state;
        const reviewObj = this.getMoreReview(review, 0, reviewList.length || reviewLimit);

        this.setState({
            reviewList: reviewObj.list,
            reviewCount: reviewObj.count
        });
    }

    onMoreReview() {
        const { review } = this.props;
        const { reviewList, reviewCount, reviewLimit } = this.state;
        const reviewObj = this.getMoreReview(review, reviewList.length, reviewLimit);

        this.setState({
            reviewList: reviewList.concat(reviewObj.list),
            reviewCount: reviewCount + reviewObj.count
        });
    }

    writeReview(reviewNo, message) {
        PopModal.progress();
        const user = auth.getUser();
        const { getArtistAbout } = this.props;

        if (user) {
            API.artists.writeReview(user.id, reviewNo, { reply: message })
                .then(response => {
                    PopModal.closeProgress();
                    if (response.status === 200) {
                        if (typeof getArtistAbout === "function") {
                            getArtistAbout();
                        }
                    }
                })
                .catch(error => {
                    if (error && error.data) PopModal.alert(error.data);
                });
        } else {
            PopModal.alert("로그인후 이용해주세요.");
        }
    }

    getMoreReview(review, offset, reviewLimit) {
        if (review) {
            const { list } = review;
            const result = {
                list: [],
                count: 0
            };
            let index = offset;

            while (result.count < reviewLimit) {
                const item = list[index];
                if (item) {
                    result.list.push(item);

                    index += 1;
                    if (item.user_type === "U") {
                        result.count += 1;
                    }

                    if (!(result.count < reviewLimit)) {
                        const nextItem = list[index];
                        if (nextItem && nextItem.user_type === "A") {
                            result.list.push(nextItem);
                        }
                    }
                } else {
                    break;
                }
            }

            return result;
        }

        return null;
    }

    renderReview(list) {
        const { artist_id, review } = this.props;
        let content = "";
        if (utils.isArray(list)) {
            content = (<ProductPackageReview data={{ list, total_cnt: review.total_cnt }} artist_id={artist_id} onWrite={this.writeReview} />);
            // content = (
            //     <div className="about-artist-review-list">
            //         {list.map((obj, idx) => {
            //             return (
            //                 <ReviewItem reviewItem={obj} key={`about-artist-review-item__${idx}`} />
            //             );
            //         })}
            //     </div>
            // );
        } else {
            content = (
                <div className="about-artist-review-list_none">
                    <p className="text">후기가 없습니다.</p>
                    <div className="image-wrap">
                        <Icon name="receipt_disabled" />
                        {/*<Img image={{ src: "/common/none_visual.png", type: "image" }} />*/}
                    </div>
                </div>
            );
        }

        return content;
    }

    render() {
        const { review } = this.props;
        const { reviewList, reviewCount } = this.state;
        return (
            <section className="about-artist-rightside_review">
                <h2 className="title">촬영후기</h2>
                {this.renderReview(reviewList)}
                {review.total_cnt > reviewCount ? <button className="f__button f__button__block" onClick={this.onMoreReview}>후기 더보기</button> : null}
            </section>
        );
    }
}
