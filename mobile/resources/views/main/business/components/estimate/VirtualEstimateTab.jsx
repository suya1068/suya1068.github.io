import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import { BUSINESS_CATEGORY } from "shared/constant/main.const";

export default class VirtualEstimateTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categorys: BUSINESS_CATEGORY,
            active: "PRODUCT"
        };
        this.onChangeCategory = this.onChangeCategory.bind(this);
    }

    onChangeCategory(category, index) {
        this.setState({
            active: category
        }, () => {
            if (typeof this.props.onSelectTab === "function") {
                this.props.onSelectTab(category);
            }
        });
    }

    render() {
        const { categorys, active } = this.state;
        return (
            <div className="estimate_category__tab">
                <div className="tab-box">
                    {categorys.map((c, i) => {
                        return (
                            <div
                                key={`tab-category__${c.code}`}
                                className={classNames("tab-category", { "active": active === c.code })}
                                onClick={() => this.onChangeCategory(c.code, i)}
                            >
                                {c.name}
                            </div>
                        );
                    })}
                </div>
                <div className="estimate-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
