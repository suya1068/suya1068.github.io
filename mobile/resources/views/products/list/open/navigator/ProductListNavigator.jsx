import "./product_list_navigator.scss";
import React, { Component, PropTypes } from "react";
import { OPEN_KEYS, OPEN_DATA } from "./navigator.const";
import classNames from "classnames";

export default class ProductListNavigator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open_tabs: this.tabDataExcArray(OPEN_DATA)
        };
        this.onScroll = this.onScroll.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
    }

    onScroll(e = {}) {
        const preRecommendArtistDiv = document.querySelector(`#${OPEN_KEYS.PRE_RECOMMNED_ARTIST}`);
        const virtualEstimateDiv = document.querySelector(`#${OPEN_KEYS.VIRTUAL_ESTIMATE}`);
        const categoryReviewDiv = document.querySelector(`#${OPEN_KEYS.CATEGORY_REVIEW}`);
        // const recommendPortfolioDiv = document.querySelector(`#${OPEN_KEYS.RECOMMEND_PORTFOLIO}`);
        // const portfolioListDiv = document.querySelector(`#${OPEN_KEYS.PORTFOLIO_LIST}`);
        // const shotExampleDiv = document.querySelector(`#${OPEN_KEYS.SHOT_EXAMPLE}`);

        const dist = 80;

        if (virtualEstimateDiv && preRecommendArtistDiv && categoryReviewDiv) {
        // if (virtualEstimateDiv && shotExampleDiv && categoryReviewDiv && recommendPortfolioDiv && portfolioListDiv) {
            if (preRecommendArtistDiv.getBoundingClientRect() && preRecommendArtistDiv.getBoundingClientRect().bottom > dist) {
                this.onSelect(OPEN_KEYS.PRE_RECOMMNED_ARTIST);
            } else if (virtualEstimateDiv.getBoundingClientRect() && virtualEstimateDiv.getBoundingClientRect().bottom > dist) {
                this.onSelect(OPEN_KEYS.VIRTUAL_ESTIMATE);
            // } else if (shotExampleDiv.getBoundingClientRect() && shotExampleDiv.getBoundingClientRect().bottom > dist) {
            //     this.onSelect(OPEN_KEYS.SHOT_EXAMPLE);
            } else if (categoryReviewDiv.getBoundingClientRect() && categoryReviewDiv.getBoundingClientRect().bottom > dist) {
                this.onSelect(OPEN_KEYS.CATEGORY_REVIEW);
            // } else if (recommendPortfolioDiv.getBoundingClientRect() && recommendPortfolioDiv.getBoundingClientRect().bottom > dist) {
            //     this.onSelect(OPEN_KEYS.RECOMMEND_PORTFOLIO);
            // } else if (portfolioListDiv.getBoundingClientRect() && portfolioListDiv.getBoundingClientRect().bottom > dist) {
            //     this.onSelect(OPEN_KEYS.PORTFOLIO_LIST);
            }
        }
    }

    tabDataExcArray(data) {
        const entity = Object.keys(data);

        return entity.reduce((result, tab) => {
            result.push(data[tab]);
            return result;
        }, []);
    }

    onSelect(type, flag = false) {
        const { open_tabs } = this.state;
        const combine_list = open_tabs.reduce((result, tab) => {
            if (tab.type === type) {
                tab.active = true;
            } else {
                tab.active = false;
            }

            result.push(tab);
            return result;
        }, []);

        this.setState({ open_tabs: combine_list }, () => {
            if (flag) {
                const t = document.getElementById(type);

                if (t) {
                    const rect = t.getBoundingClientRect();
                    const top = rect.top;
                    window.scrollBy(0, top - 70);
                }
            }
        });
    }

    render() {
        const { open_tabs } = this.state;

        return (
            <div className="product_list__navigator">
                <div
                    className="navigator__list"
                    ref={node => (this.navigator = node)}
                >
                    {open_tabs && open_tabs.length > 0 &&
                    open_tabs.map(tab => {
                        return (
                            <div
                                key={`product_open__navigator__${tab.type}`}
                                className={classNames("navigator__item", tab.type, { "active": tab.active })}
                                onClick={() => this.onSelect(tab.type, true)}
                            >
                                <p className="title">{tab.title}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
