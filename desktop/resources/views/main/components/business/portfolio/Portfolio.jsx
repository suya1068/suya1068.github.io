import "./portfolio.scss";
import React, { Component, PropTypes } from "react";
import { PORTFOLIO_DATA } from "./portfolio.const";
import Img from "shared/components/image/Img";
import Icon from "desktop/resources/components/icon/Icon";
import utils from "forsnap-utils";

export default class Portfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            portfolio_data: PORTFOLIO_DATA
        };
        this.gaEvent = this.gaEvent.bind(this);
    }

    onEnter(e) {
        const node = e.currentTarget;
        node.classList.add("on");
    }

    onLeave(e) {
        const node = e.currentTarget;
        node.classList.remove("on");
    }

    gaEvent(category, label) {
        utils.ad.gaEvent("기업_메인", "추천포폴", `${category} | ${label}`);
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("추천포폴");
        }
    }

    onMovePage(e, category, label) {
        // e.preventDefault();
        // const href = e.currentTarget.href;
        this.gaEvent(category, label);
        // window.open(href, "_black");
        // location.href = href;
    }

    render() {
        const { portfolio_data } = this.state;
        return (
            <section className="biz-portfolio biz-panel__dist biz-page__hr">
                <div className="container">
                    <h3 className="sr-only">포트폴리오</h3>
                    {portfolio_data.map(portfolio => {
                        return (
                            <div className="biz-portfolio__row" key={`biz-portfolio__${portfolio.CATEGORY_CODE}`}>
                                <div className="biz-portfolio__row__head">
                                    <p className="biz-portfolio__row__head-title">{portfolio.CATEGORY_NAME} 촬영</p>
                                    <a
                                        className="biz-portfolio__row__head-more"
                                        href={portfolio.LINK}
                                        target="_blank"
                                        onClick={e => this.onMovePage(e, portfolio.CATEGORY_NAME, "더보기")}
                                    >
                                        추천포트폴리오 보기
                                        <div>
                                            <Icon name="more" />
                                        </div>
                                    </a>
                                </div>
                                <div className="biz-portfolio__row-image-box">
                                    {portfolio.LIST.map((image, idx) => {
                                        return (
                                            <div
                                                className="image-box__item"
                                                style={{ width: image.WIDTH, height: image.HEIGHT }}
                                                key={`biz-portfolio__image__${portfolio.CATEGORY_CODE}__${idx}`}
                                                onMouseEnter={this.onEnter}
                                                onMouseLeave={this.onLeave}
                                            >
                                                <a
                                                    href={portfolio.LINK}
                                                    style={{ width: "inherit", height: "inherit" }}
                                                    target="_blank"
                                                    onClick={e => this.onMovePage(e, portfolio.CATEGORY_NAME, image.NAME)}
                                                >
                                                    <div className="image-wrap">
                                                        <Icon name="main_enlarge" />
                                                    </div>
                                                    <Img image={{ src: image.SRC, type: "image" }} />
                                                    <div className="image-box__item-artist">
                                                        <span>{`by ${image.ARTIST}`}</span>
                                                    </div>
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    }
}