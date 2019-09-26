import "./artistPanel.scss";
import React, { Component, PropTypes } from "react";
import Swiper from "swiper";

import { CATEGORY_CODE } from "shared/constant/product.const";

import Img from "shared/components/image/Img";
import * as EstimateSession from "../../extraInfoSession";
import utils from "forsnap-utils";

import VideoThumb from "./VideoThumb";

export default class ArtistVideoPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            limit: 2,
            activeIndex: props.activeIndex
        };
        this.onPopArtistReview = this.onPopArtistReview.bind(this);
        this.onConsult = this.onConsult.bind(this);
        this.createPortfolio = this.createPortfolio.bind(this);
    }

    componentDidMount() {
        this.setSwiperConfig();
    }

    componentWillReceiveProps(np) {
        if (np.activeIndex !== this.props.activeIndex) {
            this.test.slideTo(np.activeIndex);
        }
    }

    setSwiperConfig() {
        this.test = new Swiper(".pre-recommend-artist__content__box__info-wrap", {
            slidesPerView: 1,
            lazyLoading: true,
            lazyLoadingInPrevNext: true,
            lazyLoadingInPrevNextAmount: 2,
            paginationClickable: true,
            preloadImages: false,
            onSlideChangeStart: swiper => {
                const activeIndex = swiper.activeIndex;
                if (typeof this.props.setActiveIndex === "function") {
                    this.props.setActiveIndex(activeIndex);
                }
            }
        });
    }

    onPopArtistReview(list, nick, no) {
        if (typeof this.props.onPopArtistReview === "function") {
            this.props.onPopArtistReview(list, nick, no);
        }
    }

    onConsult(item) {
        if (typeof this.props.onConsult === "function") {
            this.props.onConsult(item);
        }
    }

    createPortfolio(idx, obj) {
        const { limit } = this.state;
        const { portfolio_video } = obj;

        const pv = [];
        const max = Object.prototype.hasOwnProperty.call(obj, "portfolio_video") && portfolio_video.list.length > limit ? limit : portfolio_video.list.length;
        const content = [];
        const link = `/products/${obj.product_no}`;


        for (let i = 0; i < max; i += 1) {
            pv.push(portfolio_video.list[i]);
        }

        if (Object.prototype.hasOwnProperty.call(obj, "portfolio_video") && portfolio_video.list.length > 0) {
            pv.map((video, i) => {
                content.push(
                    <div className="portfolio__thumb-video" style={{ cursor: "pointer" }} key={`artist__portfolio__${idx}__${i}`} onClick={() => this.onMoveDetailPage(obj, link, "추천_포트폴리오")}>
                        <VideoThumb url={video.portfolio_video} />
                    </div>
                );
                return null;
            });
        }

        return content;
    }

    /**
     * 포폴페이지 이동
     * @param data
     * @param url
     * @param action
     */
    onMoveDetailPage(data, url, action) {
        const params = EstimateSession.getSessionEstimateData(EstimateSession.EXTRA_INFO_KEY);
        utils.ad.gaEvent("M_기업_리스트", action, `${data.category}_${data.nick_name}_${data.product_no}`);

        const addParams = Object.assign(params || {}, { artist_id: data.user_id, product_no: data.product_no });
        EstimateSession.setSessionEstimateData(EstimateSession.EXTRA_INFO_KEY, addParams);

        // location.href = url;
        window.open(url, "_blank");
    }

    render() {
        const { list } = this.props;
        return (
            <div className="pre-recommend-artist__content__box__info">
                <div className="pre-recommend-artist__content__box__info-wrap swiper-container">
                    <div className="swiper-wrapper">
                        {list.map((item, idx) => {
                            const review = item.review;
                            const reviewTotalCnt = item.review.total_cnt;
                            const link = `/products/${item.product_no}`;
                            return (
                                <div className="swiper-slide" key={`pre-recommend-artist__${idx}`}>
                                    <div className="pre-recommend-artist__content__box__info-portfolio" style={{ minHeight: "auto" }}>
                                        {this.createPortfolio(idx, item)}
                                    </div>
                                    <div className="pre-recommend-artist__content__box__info-artist">
                                        <p className="nick-name">{item.nick_name}</p>
                                        <button className="inquire-btn" onClick={() => this.onMoveDetailPage(item, link, "추천_포폴더보기")}>포트폴리오 더보기</button>
                                        {reviewTotalCnt > 0 && <button className="review-btn" onClick={() => this.onPopArtistReview(review.list, item.nick_name, item.product_no)}>{"촬영후기 보기 >"}</button>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
