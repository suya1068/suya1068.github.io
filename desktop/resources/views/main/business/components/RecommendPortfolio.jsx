import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";

import { PORTFOLIO_CATEGORY } from "shared/constant/portfolio.const";

class RecommendPortfolio extends Component {
    constructor(props) {
        super(props);

        this.state = {
            portfolio: null,
            select: null
        };

        this.onSelect = this.onSelect.bind(this);
    }

    componentWillMount() {
        const { category } = this.props;
        if (utils.isArray(category) && category.length) {
            this.state.select = category[0].code;
            this.state.portfolio = category.reduce((r, o) => {
                const portfolio = [].concat(PORTFOLIO_CATEGORY[o.code]);
                const list = [];
                for (let i = 0; i < 16; i += 1) {
                    const index = Math.floor(Math.random() * portfolio.length);
                    const item = portfolio.splice(index, 1)[0];
                    const start = item.path.lastIndexOf("-");
                    const end = item.path.lastIndexOf(".");
                    const artist_name = item.path.substring(start + 1, end);
                    const w = Number(item.width);
                    const h = Number(item.height);
                    const vw = 320;
                    const vh = 320;
                    const resize = utils.resize(w, h, vw, vh, (w / vw) < (h / vh));
                    list.push(Object.assign({
                        artist_name,
                        resize_width: resize.width,
                        resize_height: resize.height
                    }, item));
                }
                r[o.code] = list;
                return r;
            }, {});
        }
    }

    onSelect(code) {
        this.setState({ select: code });
    }

    gaEvent(category) {
        utils.ad.gaEvent("기업_메인", "추천포폴", category);
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("추천포폴");
        }
    }

    render() {
        const { category } = this.props;
        const { portfolio, select } = this.state;

        if (!utils.isArray(category) || !category.length) {
            return null;
        }

        return (
            <div className="main__recommend__portfolio">
                <div className="category__list">
                    {category.map((o, i) => {
                        return (
                            <div key={`item_${i}`} className={classNames("item", { active: o.code === select })} data-title={o.name} onClick={() => this.onSelect(o.code)}>
                                <div className="title">{o.name}</div>
                            </div>
                        );
                    })}
                </div>
                <div className="portfolio__list">
                    {select && utils.isArray(portfolio[select]) ?
                        portfolio[select].map((o, i) => {
                            const prop = {
                                left: o.left,
                                top: o.top
                            };

                            if (o.width > o.height) {
                                prop.height = "100%";
                            } else {
                                prop.width = "100%";
                            }

                            const src = utils.image.make2({ host: __SERVER__.thumb, type1: "normal", type2: "resize", width: o.resize_width, height: o.resize_height, src: `/main_portfolio/${select.toLowerCase()}/${o.path}` });

                            return (
                                <a key={`item_${select}_${i}`} className="item" href={`/portfolio/category/${select.toLowerCase()}`} onClick={() => this.gaEvent(select)}>
                                    <div className="thumb">
                                        <img
                                            alt="thumb"
                                            src={src}
                                            style={prop}
                                        />
                                    </div>
                                    <div className="artist_name">by {o.artist_name}</div>
                                </a>
                            );
                        }) : null
                    }
                </div>
            </div>
        );
    }
}

RecommendPortfolio.propTypes = {
    category: PropTypes.arrayOf(PropTypes.shape({
        code: PropTypes.string,
        name: PropTypes.string
    })),
    gaEvent: PropTypes.func
};

export default RecommendPortfolio;
