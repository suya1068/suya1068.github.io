import "./review.scss";
import React, { Component, PropTypes } from "react";
import Img from "desktop/resources/components/image/Img";
import utils from "forsnap-utils";
import PopModal from "shared/components/modal/PopModal";
import NoneList from "mobile/resources/views/users/mypage/component/none-list/NoneList";
import Swiper from "swiper";

const LIMIT = 4;

export default class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            review: props.review || {},
            list: [],
            render_list: [],
            offset: 0,
            total: props.review.total_cnt || 0,
            swiper: {},
            UUID: utils.getUUID()
        };
        this.onScroll = this.onScroll.bind(this);
        this.onMore = this.onMore.bind(this);
        this.renderUserReview = this.renderUserReview.bind(this);
        this.initSwiper = this.initSwiper.bind(this);
    }

    componentWillMount() {
        this.composeReviewData(this.state.review);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return true;
    // }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
    }

    onScroll(e) {
        const { render_list, list } = this.state;
        //현재문서의 높이
        const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        //현재 스크롤탑의 값
        const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

        //현재 화면 높이 값
        const clientHeight = (document.documentElement.clientHeight);

        if ((scrollTop + clientHeight) === scrollHeight && list.length > render_list.length) {
            this.onMore();
        }
    }

    onMore() {
        PopModal.progress();
        const { list, render_list } = this.state;
        const max = this.state.offset + LIMIT > list.length ? list.length : this.state.offset + LIMIT;

        let offset = this.state.offset;
        if (list.length > render_list.length) {
            for (let i = this.state.offset; i < max; i += 1) {
                render_list.push(list[i]);
                offset += 1;
            }
        }

        setTimeout(() => {
            this.setState({
                render_list,
                offset
            }, () => {
                PopModal.closeProgress();
            });
        }, 200);
    }

    initSwiper(swiperName) {
        const swiper = this.state.swiper;
        swiper[swiperName] = { activeIndex: 1 };
        this.state.swiper = swiper;
        this.reviewSwiper = new Swiper(`#${swiperName}`, {
            slidesPerView: 1,
            setWrapperSize: true,
            onSlideNextStart: s => {
                const activeIndex = s.activeIndex + 1;
                swiper[swiperName] = { activeIndex };
                this.setState({
                    swiper
                });
            },
            onSlidePrevStart: s => {
                const activeIndex = s.activeIndex + 1;
                swiper[swiperName] = { activeIndex };
                this.setState({
                    swiper
                });
            }
        });

        // this.setState({
        //     swiper
        // });
    }

    composeReviewData(review) {
        const origin_list = review.list;
        const _list = [];
        const render_list = [];
        let content = {};
        let limit = 0;

        for (let i = 0; i < origin_list.length; i += 1) {
            let userReview = null;
            let artistReview = null;

            if (origin_list.length > 1) {
                if (origin_list[i].user_type === "U" && origin_list[i + 1].user_type === "A") {
                    userReview = origin_list[i];
                    artistReview = origin_list[i + 1];

                    content = {
                        user_review: userReview,
                        artist_review: artistReview
                    };

                    _list.push(content);
                }

                if (origin_list[i].user_type === "U" && origin_list[i + 1].user_type === "U") {
                    userReview = origin_list[i];

                    if (origin_list[i].user_type === "A" && origin_list[i + 1].user_type === "U") {
                        artistReview = origin_list[i];
                    }

                    content = {
                        user_review: userReview,
                        artist_review: artistReview
                    };

                    _list.push(content);
                }
            } else { // 후기가 1개일 경우.
                userReview = origin_list[i];

                content = {
                    user_review: userReview,
                    artist_review: artistReview
                };

                _list.push(content);
            }
            // if (_list.length % 5 === 0) {
            //     break;
            // }
        }

        limit = _list.length > LIMIT ? LIMIT : _list.length;

        for (let i = 0; i < limit; i += 1) {
            render_list.push(_list[i]);
        }

        this.setState({
            list: _list,
            render_list
        });
    }

    renderReview(list) {
        let content = "";
        if (Array.isArray(list) && list.length > 0) {
            content = (
                list.map((obj, idx) => {
                    let userReview = null;
                    let artistReview = null;

                    if (obj.user_review) {
                        userReview = this.renderUserReview(obj.user_review);
                    }

                    if (obj.artist_review) {
                        artistReview = this.renderArtistReview(obj.artist_review);
                    }

                    return (
                        <div className="review-unit" key={`review-unit__${idx}`}>
                            {userReview}
                            {artistReview}
                        </div>
                    );
                })
            );
        } else {
            const props = {
                mainCaption: "댓글이 아직 없습니다.",
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

    renderUserReview(obj) {
        let reviewImg = null;

        const swiper = this.state.swiper;
        let count = 1;

        if (swiper[`review_${obj.review_no}`]) {
            count = swiper[`review_${obj.review_no}`].activeIndex;
        }

        if (obj.review_img[0] !== null) {
            reviewImg = (
                <div className="review-img-swiper swiper-container" id={`review_${obj.review_no}`}>
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
                        <span className="current-count">{count}</span>
                        <span className="total-count">{obj.review_img.length}</span>
                    </div>
                </div>
            );
        }

        return (
            <div className="about-artist-user_review" onLoad={() => this.initSwiper(`review_${obj.review_no}`)}>
                {reviewImg}
                <div className="user">
                    <div className="user-profile">
                        <Img image={{ src: obj.profile_img, content_width: 90, content_height: 90, default: "/common/default_profile_img.jpg" }} isCrop />
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
        const { nick_name, render_list } = this.state;

        return (
            <section className="about-artist-review">
                <h2 className="sr-only">{nick_name}작가님의 후기</h2>
                <div className="about-artist-review_list">
                    {this.renderReview(render_list)}
                </div>
            </section>
        );
    }
}
