import "./recommend_portfolio.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Swiper from "swiper";

export default class RecommendPortfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: props.category,
            list: []
        };
        this.onEvent = this.onEvent.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.recommPortfolio = new Swiper(".recommend-portfolio__content", {
            slidesPerView: 2.3,
            spaceBetween: 10,
            slidesOffsetAfter: 20,
            setWrapperSize: true
        });
    }

    onEvent() {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("추천포폴");
        }
    }

    onVideo(url) {
        this.onEvent();
        Modal.show({
            type: MODAL_TYPE.ALERT,
            content: (
                <div style={{ backgroundColor: "#000" }}>
                    <iframe
                        src={url}
                        width="100%"
                        height="300"
                        frameBorder="0"
                        allowFullScreen
                    />
                </div>
            )
        });
    }

    render() {
        const { category, data } = this.props;

        const portfolioUrl = `/portfolio/category/${category.toLowerCase()}`;
        const portfolio = category ? data.list : null;

        return (
            <section className="product_list__recommend-portfolio recommend-portfolio product__dist gray-background-color" id="recommend_portfolio">
                <div className="recommend-portfolio__head">
                    <h2 className="section-title title">추천포트폴리오</h2>
                    {category.toLowerCase() !== "video_biz" ?
                        <a className="more" href={portfolioUrl} target="_blank" onClick={this.onEvent}>더보기</a> : null
                    }
                </div>
                <div className={classNames("recommend-portfolio__content swiper-container", category.toLowerCase())}>
                    <div className="recommend-portfolio__wrap swiper-wrapper">
                        {portfolio && portfolio.map((o, i) => {
                            let url = `${__SERVER__.img}${o.src}`;
                            const isVideo = category.toLowerCase() === "video_biz";

                            if (isVideo) {
                                url = o.src;
                            }

                            const prop = {
                                className: "list__item swiper-slide",
                                key: `portfolio_${i}`
                                //style: { width: 150, height: 150, display: "inline-block", background: `url(${url}) center center / cover no-repeat` }
                            };

                            if (isVideo) {
                                prop.role = "button";
                                prop.onClick = () => this.onVideo(o.video_url);
                            } else {
                                prop.href = portfolioUrl;
                                prop.target = "_blank";
                                prop.onClick = this.onEvent;
                            }

                            const listItem = (obj, props) => {
                                return (
                                    <a {...props} style={{ width: 150, height: 150 }}>
                                        <img className="recommend__img" src={url} role="presentation" />
                                        <span className="artist__name" style={{ color: obj.color || null }}>{`by ${obj.artist_name}`}</span>
                                        {isVideo ? <div className="video__play__button"><span className="play__button" /></div> : null}
                                    </a>
                                );
                            };


                            return listItem(o, prop);
                        })}
                    </div>
                </div>
            </section>
        );
    }
}
