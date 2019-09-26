import "./recommendItem.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Img from "desktop/resources/components/image/Img";
import utils from "forsnap-utils";
import * as EstimateSession from "../extraInfoSession";
import { CATEGORY_CODE } from "shared/constant/product.const";
import VideoThumb from "./VideoThumb";

export default class RecommendItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            limit: 4,
            total_price: props.total_price
        };
        this.onShowReview = this.onShowReview.bind(this);
        this.createPortfolio = this.createPortfolio.bind(this);
        this.onSelectArtist = this.onSelectArtist.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    /**
     * 후기 보기
     * @param item
     */
    onShowReview(item) {
        if (typeof this.props.onShowReview === "function") {
            // utils.ad.gaEvent("기업_리스트", "추천작가에게문의", `${item.category}_${item.nick_name}_${item.product_no}`);
            this.props.onShowReview(item);
            //this.gaEvent("상단_추천작가_후기보기", `${item.category}_${item.nick_name}_${item.product_no}`);
        }
    }

    gaEvent(action, label) {
        utils.ad.gaEvent("기업_리스트", action, label);
    }

    /**
     * 포트폴리오 페이지 링크
     * @param e
     * @param data
     * @param url
     */
    movePortfolioPage(e, data, url) {
        e.preventDefault();
        const params = EstimateSession.getSessionEstimateData(EstimateSession.EXTRA_INFO_KEY);
        const addParams = Object.assign(params || {}, { artist_id: data.user_id, product_no: data.product_no });
        EstimateSession.setSessionEstimateData(EstimateSession.EXTRA_INFO_KEY, addParams);
        const myWindow = window.open("", "_blank");
        myWindow.location.href = url;
    }

    onBigImage(e) {
        e.currentTarget.classList.add("keep__up");
    }

    onSmallImage(e) {
        e.currentTarget.classList.remove("keep__up");
    }

    createPortfolio() {
        const { data, limit } = this.state;
        const pl = [].concat(data.portfolio && Array.isArray(data.portfolio.list) ? data.portfolio.list : []);
        const pvl = [].concat(data.portfolio_video && Array.isArray(data.portfolio_video.list) ? data.portfolio_video.list : []);

        if (data.category.toUpperCase() === CATEGORY_CODE.VIDEO_BIZ) {
            pvl.unshift({ portfolio_video: data.main_img });
        }

        const detailUrl = `/portfolio/${data.product_no}`;

        return (
            <div className="portfolio-item" key={`portfolio__list__${data.no}`}>
                {Array.from(new Array(limit)).map((a, index) => {
                    if (pvl.length) {
                        const item = pvl.splice(0, 1)[0];
                        return (
                            <div className="portfolio__image" key={`portfolio__group__${index}`} onMouseEnter={this.onBigImage} onMouseLeave={this.onSmallImage}>
                                <a onClick={e => this.movePortfolioPage(e, data, detailUrl, "")} href={detailUrl}>
                                    <VideoThumb url={item.portfolio_video} />
                                </a>
                            </div>
                        );
                    }

                    const item = pl.splice(0, 1)[0];
                    if (item) {
                        return (
                            <div className="portfolio__image" key={`portfolio__group__${index}`} onMouseEnter={this.onBigImage} onMouseLeave={this.onSmallImage}>
                                <a onClick={e => this.movePortfolioPage(e, data, detailUrl, "")} href={detailUrl}>
                                    <img
                                        style={{ width: 148, height: 148 }}
                                        role="presentation"
                                        className="swiper-lazy changeSize"
                                        src={`${__SERVER__.thumb}/normal/crop/320x320${item.portfolio_img}`}
                                    />
                                </a>
                            </div>
                        );
                    }

                    return null;
                })}
            </div>
        );
    }

    onSelectArtist(no) {
        if (typeof this.props.onSelectArtist === "function") {
            this.props.onSelectArtist(no);
        }
    }

    render() {
        const { subClassName, isSelect, enough } = this.props;
        const { data } = this.state;

        const detailUrl = `/portfolio/${data.product_no}`;
        return (
            <div className={classNames("content__box", subClassName || "")}>
                {enough && !isSelect &&
                <div className="enough" />
                }
                <div className="artist__info">
                    <div className="artist__info__profile-img" onClick={e => this.movePortfolioPage(e, data, detailUrl)}>
                        <Img image={{ src: data.portfolio.list.length > 0 ? data.portfolio.list[0].portfolio_img : "" }} />
                    </div>
                    <p className="artist__info__name" onClick={e => this.movePortfolioPage(e, data, detailUrl)}>{data.nick_name}</p>
                    <p className="artist__info__text">작가님</p>
                    <div className="artist__info__select">
                        <div className={classNames("wrap-box", { "select": isSelect })} onClick={() => this.onSelectArtist(data.no)}>
                            <div className="select-box">
                                <div className="check-mark" />
                            </div>
                            <p>작가 선택하기</p>
                        </div>
                    </div>
                </div>
                <div className={classNames("artist__portfolio")}>
                    {this.createPortfolio()}
                </div>
            </div>
        );
    }
}

RecommendItem.defaultProps = {
};
