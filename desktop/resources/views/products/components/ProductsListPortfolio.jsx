import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import { PRODUCT_LIST_PORTFOLIO } from "shared/constant/product.const";

class ProductsListPortfolio extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            openEstimate: props.openEstimate
        };

        this.onVideo = this.onVideo.bind(this);
        this.onEvent = this.onEvent.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onVideo(url) {
        this.onEvent();
        Modal.show({
            type: MODAL_TYPE.ALERT,
            content: (
                <iframe
                    src={url}
                    width="800"
                    height="450"
                    frameBorder="0"
                    allowFullScreen
                />
            )
        });
    }

    onEvent() {
        const { category } = this.props;
        utils.ad.gaEvent("기업_리스트", "추천포폴영역", `category=${category}`);

        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("추천포폴");
        }
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setStateData(state => {
                return update(state);
            }, callback);
        }
    }

    render() {
        const { category, openEstimate } = this.props;
        const portfolio = category ? PRODUCT_LIST_PORTFOLIO[category.toUpperCase()] : null;

        if (!category || !portfolio) {
            return null;
        }

        const portfolioUrl = `/portfolio/category/${category.toLowerCase()}`;

        return (
            <div className="products__list__portfolio">
                <div>
                    <div className="portfolio__header">
                        <h1 className="title" style={{ fontWeight: openEstimate && "bold" }}>추천 포트폴리오</h1>
                        {category.toLowerCase() !== "video_biz" ?
                            <a className="more" href={portfolioUrl} target="_blank" onClick={this.onEvent}>포트폴리오 더보기 +</a> : null
                        }
                    </div>
                    <div className={classNames("portfolio__list", category.toLowerCase(), { "open_estimate": openEstimate })}>
                        {portfolio.map((o, i) => {
                            let url = `${__SERVER__.img}${o.src}`;
                            const isVideo = category.toLowerCase() === "video_biz";
                            if (isVideo) {
                                url = o.src;
                            }
                            const prop = {
                                key: `portfolio_${i}`,
                                className: "list__item",
                                style: { width: openEstimate ? "323px" : o.width, height: o.height, background: `url(${url}) center center / cover no-repeat` }
                            };

                            if (isVideo) {
                                prop.role = "button";
                                prop.onClick = () => this.onVideo(o.video_url);
                            } else {
                                prop.href = portfolioUrl;
                                prop.target = "_blank";
                                prop.onClick = this.onEvent;
                            }

                            return (
                                <a {...prop}>
                                    <span className="artist__name" style={{ color: o.color || null }}>{`by ${o.artist_name}`}</span>
                                    {isVideo ? <div className="video__play__button"><span className="play__button" /></div> : null}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

ProductsListPortfolio.propTypes = {
    category: PropTypes.string,
    openEstimate: PropTypes.bool
};

ProductsListPortfolio.defaultProps = {
    openEstimate: false
};

export default ProductsListPortfolio;
