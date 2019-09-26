import "./businessTab.scss";
import React, { Component, PropTypes } from "react";
import Tab from "./Tab";
import { BUSINESS_TAB_DATA } from "./tab.const";

export default class BusinessTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab_list: this.tabDataExcArray(BUSINESS_TAB_DATA)
        };
        this.onSelect = this.onSelect.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll, false);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
    }

    onScroll(e) {
        const rootDiv = document.getElementsByClassName("product__information")[0];
        const content = document.getElementsByClassName("product__information__content-box")[0];
        const tabContainer = document.getElementsByClassName("business__tab")[0];
        const tabBox = document.getElementsByClassName("tab-box")[0];
        const pad1 = document.getElementById("pad1");

        if (rootDiv && pad1 && tabBox) {
            const rect = rootDiv.getBoundingClientRect();
            if (rect && rect.top < 50) {
                pad1.style.height = "20px";
                pad1.style.width = "100%";
                pad1.style.top = "-20px";
                pad1.style.display = "block";
                pad1.style.backgroundColor = "#fafafa";
            } else if (rect && rect.top > 50) {
                pad1.removeAttribute("style");
            }

            if (rect) {
                const careerRect = document.getElementById("artist_info");
                const reviewRect = document.getElementById("review");
                const artistReviewRect = document.getElementById("artist_review");

                if (careerRect.getBoundingClientRect() && careerRect.getBoundingClientRect().bottom > 110) {
                    this.onSelect("artist_info");
                } else if (reviewRect.getBoundingClientRect() && reviewRect.getBoundingClientRect().bottom > 110) {
                    this.onSelect("review");
                } else if (artistReviewRect.getBoundingClientRect() && artistReviewRect.getBoundingClientRect().bottom > 110) {
                    this.onSelect("artist_review");
                }
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
        const { tab_list } = this.state;
        const combine_list = tab_list.reduce((result, tab) => {
            if (tab.type === type) {
                tab.active = true;
            } else {
                tab.active = false;
            }

            result.push(tab);
            return result;
        }, []);

        this.setState({ tab_list: combine_list }, () => {
            if (flag) {
                const t = document.getElementById(type);

                if (t) {
                    const rect = t.getBoundingClientRect();
                    const top = rect.top;
                    window.scrollBy(0, top - 95);
                }
            }
        });
    }

    render() {
        const { tab_list } = this.state;
        return (
            <div className="business__tab">
                <div className="tab-pad" id="pad1" />
                <div className="tab-box">
                    {tab_list && tab_list.length > 0 &&
                    tab_list.map(tab => {
                        return (
                            <Tab {...tab} key={`tab_items__${tab.type}`} onSelect={this.onSelect} />
                        );
                    })}
                </div>
            </div>
        );
    }
}
