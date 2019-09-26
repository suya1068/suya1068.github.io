import React, { Component } from "react";
import BeltBanner from "./beltBanner/BeltBanner";
// import cookie from "forsnap-cookie";
// import CONST from "shared/constant";

export default class BannerContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            external: props.external
        };
        this.onCancelToBanner = this.onCancelToBanner.bind(this);
    }

    componentWillMount() {
    }

    renderBanner(external) {
        if (location.pathname.startsWith("/products/")) {
            // return <BeltBanner onCancelToBanner={() => this.onCancelToBanner("belt")} external={external} />;
        }

        return null;
    }

    onCancelToBanner(type) {
        const browserNotice = document.getElementById("browser_notice");
        const header = document.querySelector(".forsnav");

        let target = null;

        if (type === "belt") {
            target = document.getElementById("belt_banner");
        }
        // else if (type === "event") {
        //     target = document.getElementById("event_banner");
        // }

        if (target) {
            target.parentNode.removeChild(target);
        }

        if (browserNotice) {
            header.style.top = 0;
        } else {
            header.style.top = 0;

            if (header.style.position !== "fixed") {
                header.style.position = "fixed";
            }
        }
    }

    render() {
        const { external } = this.props;
        return (
            <div className="banner-container">
                {this.renderBanner(external)}
            </div>
        );
    }
}
