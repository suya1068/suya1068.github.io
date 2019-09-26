import "./tab.scss";
import React, { Component, PropTypes } from "react";
import Tab from "./Tab";
import { TAB_DATA } from "./tab.const";

export default class TabContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab_list: this.tabDataExcArray(TAB_DATA)
        };
        this.onSelect = this.onSelect.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.tabStyleSet = this.tabStyleSet.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll, false);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
    }

    tabStyleSet(tab) {
        tab.style.position = "fixed";
        tab.style.zIndex = "2";
        tab.style.width = "680px";
        tab.style.display = "block";
    }

    onScroll(e) {
        // const rootDiv = document.querySelector(".products__detail__content__extend-tab");
        // const content = rootDiv.querySelector(".products__detail__content");
        // const tabClone = rootDiv.querySelector(".tab-clone");
        //
        // const tabContainer = document.querySelector(".product_detail__tab");
        // const tabBox = tabContainer.querySelector(".tab-box");
        // const pad1 = tabContainer.querySelector("#pad1");
        // const pad2 = tabContainer.querySelector("#pad2");

        const rootDiv = document.getElementsByClassName("products__detail__content__extend-tab")[0];
        const content = document.getElementById("test");
        const tabClone = document.getElementsByClassName("tab-clone")[0];

        const tabContainer = document.getElementsByClassName("product_detail__tab")[0];
        const tabBox = document.getElementsByClassName("tab-box")[0];
        const pad1 = document.getElementById("pad1");
        const pad2 = document.getElementById("pad2");

        if (rootDiv && pad1 && pad2 && tabBox) {
            const rect = rootDiv.getBoundingClientRect();
            if (rect && rect.top < 130 && tabBox.style.position !== "fixed") {
                tabBox.style.position = "fixed";
                tabBox.style.top = "130px";

                this.tabStyleSet(pad1);
                pad1.style.height = "25px";

                this.tabStyleSet(pad2);
                pad2.style.height = "20px";
                pad1.style.top = "110px";
                pad1.style.backgroundColor = "#fafafa";
                pad2.style.top = "186px";
                pad2.style.backgroundColor = "#fff";
                pad2.style.borderRight = "1px solid #cdcdcd";
                pad2.style.borderLeft = "1px solid #cdcdcd";
            } else if (rect && rect.top > 129 && tabBox.style.position !== "") {
                tabBox.removeAttribute("style");
                pad1.removeAttribute("style");
                pad2.removeAttribute("style");
                tabContainer.removeAttribute("style");
                tabClone.removeAttribute("style");
            }

            if (tabContainer) {
                if (content.getBoundingClientRect().bottom < 185 && tabBox.style.position === "fixed") {
                    tabBox.style.position = "relative";
                    tabBox.style.top = "0";
                    tabClone.style.display = "block";
                    tabContainer.style.position = "absolute";
                    tabContainer.style.height = "56px";
                    tabContainer.style.bottom = "0";
                    pad2.removeAttribute("style");
                }
            }

            if (rect) {
                const infoRect = document.getElementById("info");
                const portfolioRect = document.getElementById("portfolio");
                const priceRect = document.getElementById("price");
                const reviewRect = document.getElementById("review");

                if (infoRect.getBoundingClientRect() && infoRect.getBoundingClientRect().bottom > 186) {
                    this.onSelect("info");
                } else if (portfolioRect.getBoundingClientRect() && portfolioRect.getBoundingClientRect().bottom > 186) {
                    this.onSelect("portfolio");
                } else if (priceRect.getBoundingClientRect() && priceRect.getBoundingClientRect().bottom > 186) {
                    this.onSelect("price");
                } else if (reviewRect.getBoundingClientRect() && reviewRect.getBoundingClientRect().bottom > 186) {
                    this.onSelect("review");
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
                    window.scrollBy(0, top - 150 - 56);
                }
            }
        });
    }

    render() {
        const { tab_list } = this.state;
        return (
            <div className="product_detail__tab">
                <div className="tab-pad" id="pad1" />
                <div className="tab-box">
                    {tab_list && tab_list.length > 0 &&
                    tab_list.map(tab => {
                        return (
                            <Tab {...tab} key={`tab_items__${tab.type}`} onSelect={this.onSelect} />
                        );
                    })}
                </div>
                <div className="tab-pad" id="pad2" />
            </div>
        );
    }
}
