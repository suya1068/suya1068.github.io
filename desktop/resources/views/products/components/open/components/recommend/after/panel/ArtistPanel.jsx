import "./artistPanel.scss";
import React, { Component, PropTypes } from "react";
import Swiper from "swiper";
// import classNames from "classnames";
import { CATEGORY_CODE } from "shared/constant/product.const";
import Img from "shared/components/image/Img";
import VideoThumb from "./VideoThumb";
import Icon from "desktop/resources/components/icon/Icon";
import * as EstimateSession from "../../../extraInfoSession";

export default class ArtistPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            activeIndex: props.activeIndex,
            limit: 10,
            renderList: [],
            selectArtist: []
        };
        this.createPortfolio = this.createPortfolio.bind(this);
        this.onSelectArtist = this.onSelectArtist.bind(this);
        this.setPortfolioList = this.setPortfolioList.bind(this);
        this.setRecommendArtistList = this.setRecommendArtistList.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.onShowReview = this.onShowReview.bind(this);
        this.onConsultArtist = this.onConsultArtist.bind(this);
    }

    componentWillMount() {
        const { list } = this.state;
        this.setState({
            renderList: this.setRecommendArtistList(list)
        });
    }

    componentDidMount() {
        this.setSwiperConfig();
    }

    componentWillReceiveProps(np) {
        if (np.activeIndex !== this.props.activeIndex) {
            this.test.slideTo(np.activeIndex);
        }

        if (JSON.stringify(np.list) !== JSON.stringify(this.props.list)) {
            this.setState({ renderList: this.setRecommendArtistList(np.list) }, () => {
                this.test.update();
            });
        }
    }

    /**
     * 추천작가 리스트를 세팅합니다.
     * @param list
     */
    setRecommendArtistList(list) {
        let renderList = [];
        if (list.length > 0) {
            list.map((item, idx) => {
                const portfolio = this.setPortfolioList(item.portfolio);
                renderList.push({ ...list[idx], portfolio });
                return null;
            });
        } else {
            renderList = [];
        }

        return renderList;
    }

    /**
     * 작가 포트폴리오를 세팅합니다.
     * @param portfolio
     * @returns {Array}
     */
    setPortfolioList(portfolio) {
        const limit = this.state.limit;
        const portfolioList = [];
        const maxThumbLimit = Number(portfolio.total_cnt) < limit ? Number(portfolio.total_cnt) : limit;
        let i = 0;
        while (i < maxThumbLimit) {
            portfolioList.push(portfolio.list[i]);
            i += 1;
        }

        return portfolioList;
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
                if (typeof this.props.setActiveIndex === "function") {
                    this.props.setActiveIndex(swiper.activeIndex);
                }
            }
        });
    }

    /**
     * 포폴페이지로 이동
     */
    onMovePage(obj, link, action) {
        this.gaEvent(action, `${obj.category}_${obj.nick_name}_${obj.product_no}`);
        const params = EstimateSession.getSessionEstimateData(EstimateSession.EXTRA_INFO_KEY);
        const addParams = Object.assign(params || {}, { artist_id: obj.user_id, product_no: obj.product_no });
        EstimateSession.setSessionEstimateData(EstimateSession.EXTRA_INFO_KEY, addParams);
        // location.href = link;
        const myWindow = window.open("", "_blank");
        myWindow.location.href = link;
    }

    createPortfolio(idx, obj) {
        const { limit } = this.state;
        const { portfolio } = obj;

        const pl = [].concat(Array.isArray(portfolio) ? portfolio : []);
        const content = [];

        const link = `/products/${obj.product_no}`;

        for (let i = 0; i < limit; i += 1) {
            const item = pl.splice(0, 1)[0];
            if (item) {
                content.push(
                    <div className="portfolio__thumb-image" style={{ cursor: "pointer" }} key={`artist__portfolio__${idx}__${i}`} onClick={() => this.onMovePage(obj, link, "추천_포폴")}>
                        <div className="overlay">
                            <img alt="icon" src={`${__SERVER__.img}/common/icon/icon_circle_plus.png`} />
                            <div className="title">포트폴리오 더보기</div>
                        </div>
                        <Img image={{ src: item.portfolio_img, content_width: 320, content_height: 320 }} />
                    </div>
                );
            }
        }

        return content;
    }

    /**
     * 작가를 선택한다.
     * @param no
     * @param item
     * @param action
     */
    onSelectArtist(no, item, action) {
        const { selectArtist } = this.state;
        if (selectArtist.includes(no)) {
            selectArtist.splice(selectArtist.indexOf(no), 1);
        } else {
            selectArtist.push(no);
        }
        this.setState({
            selectArtist
        });
    }

    /**
     * gaEvent
     * @param action
     * @param label
     */
    gaEvent(action, label) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(action, label);
        }
    }

    renderChoiceMsg(name, no) {
        const { selectArtist } = this.state;
        const isSelected = selectArtist.includes(no);

        let content = "";

        if (isSelected) {
            content = (
                <div className="selected-box">
                    <i className="_icon _icon__yellow__check_s" />
                    <span className="yellow-text" style={{ marginRight: 3, marginLeft: 5 }}>{name}</span> 작가님이 선택되었습니다.
                </div>
            );
        }

        return content;
    }

    /**
     * 리뷰보기
     */
    onShowReview(data) {
        if (typeof this.props.onShowReview === "function") {
            this.props.onShowReview(data);
            this.gaEvent("추천_후기", `${data.category}_${data.nick_name}_${data.product_no}`);
        }
    }

    /**
     * 작가에게 상담신청하기
     */
    onConsultArtist(data) {
        if (typeof this.props.onConsultArtist === "function") {
            this.props.onConsultArtist(data);
            this.gaEvent("추천_문의", `${data.category}_${data.nick_name}_${data.product_no}`);
        }
    }

    render() {
        const { list } = this.props;
        const { selectArtist, renderList } = this.state;
        return (
            <div className="pre-recommend-artist__content__box__info">
                <div className="pre-recommend-artist__content__box__info-wrap swiper-container">
                    <div className="swiper-wrapper">
                        {renderList.map((item, idx) => {
                            // const link = `/portfolio/${item.product_no}`;
                            const link = `/products/${item.product_no}`;
                            return (
                                <div className="swiper-slide" key={`pre-recommend-artist__${idx}`}>
                                    <div className="pre-recommend-artist__content__box__info-portfolio">
                                        {this.createPortfolio(idx, item)}
                                        {this.renderChoiceMsg(item.nick_name, item.no)}
                                    </div>
                                    <div className="pre-recommend-artist__content__box__info-artist">
                                        <p className="nick-name">{item.nick_name}</p>
                                        <div className="review-wrap">
                                            {/*{idx === 0 &&*/}
                                            {item.review.list.length > 0 &&
                                            <div className="review-button" onClick={() => this.onShowReview(item)}>
                                                {"촬영후기보기"}
                                                <Icon name="left_bracket_gray" />
                                            </div>
                                            }
                                        </div>
                                        <div className="inquire-btn">
                                            <button className="_button inquire" onClick={() => this.onMovePage(item, link, "추천_포폴더보기")}>포트폴리오 더보기</button>
                                        </div>
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
