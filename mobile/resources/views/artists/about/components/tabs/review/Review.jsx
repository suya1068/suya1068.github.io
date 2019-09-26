import "./review.scss";
import React, { Component, PropTypes } from "react";

import API from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";

import PopModal from "shared/components/modal/PopModal";

import ProductPackageReview from "mobile/resources/views/products/package/components/ProductPackageReview";
import NoneList from "mobile/resources/views/users/mypage/component/none-list/NoneList";

// import ReviewItem from "./reviewItem/ReviewItem";

const LIMIT = 5;

export default class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reviewList: [],
            reviewCount: 0,
            reviewLimit: 3,
            isLoading: true
        };

        this.onScroll = this.onScroll.bind(this);
        this.onMoreReview = this.onMoreReview.bind(this);

        this.writeReview = this.writeReview.bind(this);
        this.getMoreReview = this.getMoreReview.bind(this);
    }

    componentWillMount() {
        this.onMoreReview();
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll);
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

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
    }

    onScroll(e) {
        const { review } = this.props;
        const { reviewCount } = this.state;
        //현재문서의 높이
        const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        //현재 스크롤탑의 값
        const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

        //현재 화면 높이 값
        const clientHeight = (document.documentElement.clientHeight);
        const clientHalf = Number(clientHeight) !== 0 && clientHeight / 2;

        if (clientHeight + scrollTop >= (scrollHeight - clientHalf) && review.total_cnt > reviewCount) {
            this.setLoadingFlag();
        }
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

    setLoadingFlag() {
        this.onMoreReview();
    }

    renderReview(list) {
        const { artist_id, review } = this.props;
        let content = "";
        if (utils.isArray(list)) {
            content = (<ProductPackageReview data={{ list, total_cnt: review.total_cnt }} artist_id={artist_id} onWrite={this.writeReview} />);
        } else {
            const props = {
                mainCaption: "후기가 아직 없습니다.",
                subCaption: "",
                src: "/mobile/imges/f_img_bg_03.png",
                noneKey: "artist_product_list"
            };

            content = (
                <NoneList {...props} />
            );
        }

        return content;
    }

    render() {
        const { nick_name, reviewList } = this.state;

        return (
            <section className="about-artist-review">
                <h2 className="sr-only">{nick_name}작가님의 후기</h2>
                <div className="about-artist-review_list">
                    {this.renderReview(reviewList)}
                </div>
            </section>
        );
    }
}
