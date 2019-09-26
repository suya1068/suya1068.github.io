import React, { Component, PropTypes } from "react";
import BizBanner from "./bizBannerRe/BizBannerRe";
// import BizBanner from "./bizBanner/BizBanner";
import PersonalBanner from "./personalBanner/PersonalBanner";
import utils from "forsnap-utils";
// import EventBanner from "../eventBanner/EventBanner";

export default class BeltBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            external: props.external
        };
        this.onCancelToBanner = this.onCancelToBanner.bind(this);
    }

    componentDidMount() {
    }

    onCancelToBanner() {
        if (typeof this.props.onCancelToBanner === "function") {
            this.props.onCancelToBanner();
        }
    }

    renderBannerAtCsType() {
        const { external } = this.props;
        let content = null;
        const category = document.getElementById("product-category");
        if (category && utils.checkCategoryForEnter(category.getAttribute("content"))) {
            // content = (
            //     <BizBanner onClose={this.onCancelToBanner} category={category.getAttribute("content")} multi external={external} />
            // );
        } else if (external) {
            content = (
                <PersonalBanner onClose={this.onCancelToBanner} />
            );
        }

        if (!content) {
            return null;
        }

        return (
            <div id="belt_banner">
                {content}
            </div>
        );
    }

    render() {
        return this.renderBannerAtCsType();
    }
}

BeltBanner.propTypes = {
    onCancelToBanner: PropTypes.func
};

