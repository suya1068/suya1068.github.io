import "./recommend_portfolio.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

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

    render() {
        const { category, data } = this.props;

        const portfolioUrl = `/portfolio/category/${category.toLowerCase()}`;
        const portfolio = category ? data.list : null;

        return (
            <section className="product_list__recommend-portfolio recommend-portfolio product__dist">
                <div className="container">
                    <div className="recommend-portfolio__head">
                        <h2 className="section-title title">추천포트폴리오</h2>
                        {category.toLowerCase() !== "video_biz" ?
                            <a className="more" href={portfolioUrl} target="_blank" onClick={this.onEvent}>포트폴리오 더보기</a> : null
                        }
                    </div>
                    <div className={classNames("recommend-portfolio__content", category.toLowerCase())}>
                        {portfolio && portfolio.map((o, i) => {
                            let url = `${__SERVER__.img}${o.src_2x}`;
                            const isVideo = category.toLowerCase() === "video_biz";
                            let content = null;

                            if (isVideo) {
                                url = o.src;
                            }

                            const prop = {
                                className: "list__item",
                                key: `portfolio_${i}`,
                                style: { width: o.width, height: o.height, background: `url(${url}) center center / cover no-repeat` }
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
                                    <a {...props} key={props.key}>
                                        <span className="artist__name" style={{ color: obj.color || null }}>{`by ${obj.artist_name}`}</span>
                                        {isVideo ? <div className="video__play__button"><span className="play__button" /></div> : null}
                                    </a>
                                );
                            };

                            if (o.group) {
                                content = (
                                    <div className="wrap_test" key="wrapper_portfolio">
                                        {o.group_list.map(g => {
                                            const p = {
                                                className: "list__item",
                                                key: `wrap_portfolio_${g.no}`,
                                                style: { width: g.width, height: g.height, background: `url(${`${__SERVER__.img}${g.src_2x}`}) center center / cover no-repeat` },
                                                href: portfolioUrl,
                                                target: "_blank",
                                                onClick: this.onEvent
                                                // ...imageProp
                                            };

                                            return listItem(g, p);
                                        })}
                                    </div>
                                );
                            }

                            if (!o.group) {
                                content = listItem(o, prop);
                            }

                            return content;
                        })}
                    </div>
                </div>
            </section>
        );
    }
}
