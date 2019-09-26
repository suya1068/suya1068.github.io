import "./preRecommendArtist.scss";
import React, { Component, PropTypes } from "react";
// import utils from "forsnap-utils";
// import ArtistItem from "../recom_artist/ArtistItem";
import RecommendItem from "../recom_artist/RecommendItem";
import Swiper from "swiper";
import * as EstimateSession from "../extraInfoSession";
import authentication from "forsnap-authentication";

export default class PreRecommendArtist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            renderList: [],
            limit: 5,
            isFirst: true
        };
        this.onShowReview = this.onShowReview.bind(this);
        this.onConsult = this.onConsult.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const user = authentication.getUser();
        EstimateSession.setSessionEstimateData(EstimateSession.EXTRA_INFO_KEY, { category: this.props.category, user_id: user ? user.id : "" });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.list.length > 0 && this.state.isFirst) {
            const { list } = nextProps;
            const { limit, renderList } = this.state;
            const max = list.length > limit ? limit : list.length;

            for (let i = 0; i < max; i += 1) {
                renderList.push(list[i]);
            }

            this.setState({
                isFirst: false,
                renderList
            }, () => {
                this.configSwiper();
            });
        }
    }

    /**
     * 스와이프 설정
     */
    configSwiper() {
        const { renderList } = this.state;
        const length = renderList.length;
        this.preRecommendArtistSwiper = new Swiper(".pre-recommend-artist__list", {
            // slidesPerView: 4,
            initialSlide: 1,
            slidesPerView: "auto",
            spaceBetween: 12,
            setWrapperSize: true
        });
    }

    onShowReview(data) {
        if (typeof this.props.onShowReview === "function") {
            this.props.onShowReview(data);
        }
    }

    onConsult(item) {
        if (typeof this.props.onConsult === "function") {
            this.props.onConsult(item);
        }
    }

    render() {
        const { total_price } = this.props;
        const { isFirst, renderList } = this.state;

        return (
            <section className="product_list__pre-recommend-artist pre-recommend-artist">
                <div className="pre-recommend-artist__head">
                    <div className="container">
                        <div className="pre-recommend-artist__head__text">
                            <h2 className="section-title">추천 작가의 포트폴리오를 확인해보세요.</h2>
                        </div>
                    </div>
                </div>
                {!isFirst &&
                    <div className="pre-recommend-artist__content">
                        <div className="pre-recommend-artist__list swiper-container container">
                            <div className="swiper-wrapper pre-recommend-wrapper">
                                {renderList.map((item, idx) => {
                                    return (
                                        <div className="swiper-slide test" key={`another_artist__${idx}`}>
                                            <RecommendItem
                                                preRecommend
                                                data={item}
                                                onShowReview={this.onShowReview}
                                                onConsult={this.onConsult}
                                                total_price={total_price}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                }
            </section>
        );
    }
}

PreRecommendArtist.propTypes = {

};

PreRecommendArtist.defaultProps = {

};
