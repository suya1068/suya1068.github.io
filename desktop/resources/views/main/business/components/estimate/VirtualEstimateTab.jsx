import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import { BUSINESS_CATEGORY } from "shared/constant/main.const";

export default class VirtualEstimateTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categorys: BUSINESS_CATEGORY,
            active: "PRODUCT",
            activeIndex: 0
        };
        this.onChangeCategory = this.onChangeCategory.bind(this);
    }

    onChangeCategory(category, index) {
        this.setState({
            active: category,
            activeIndex: index
        }, () => {
            if (typeof this.props.onSelectTab === "function") {
                this.props.onSelectTab(category);
            }
        });
    }

    render() {
        const { categorys, active, activeIndex } = this.state;
        return (
            <div className="estimate_category__tab">
                <div className="tab-box">
                    {categorys.map((c, i) => {
                        let nextActiveIndex = false;
                        if (i === activeIndex + 1) {
                            nextActiveIndex = true;
                        }

                        return (
                            <div
                                key={`tab-category__${c.code}`}
                                className={classNames("tab-category", { "active": active === c.code }, { "next-active": nextActiveIndex })}
                                onClick={() => this.onChangeCategory(c.code, i)}
                            >
                                {c.name}
                            </div>
                        );
                    })}
                </div>
                {this.props.children}
            </div>
        );
    }
}
