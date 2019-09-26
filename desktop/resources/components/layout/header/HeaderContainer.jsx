import React, { Component, PropTypes } from "react";
import Header from "desktop/resources/components/layout/header/component/header/Header";
import BannerContainer from "./component/banner/BannerContainer";
import utils from "forsnap-utils";
import classNames from "classnames";
import LogLocation from "shared/helper/logLocation/LogLocation";

export default class HeaderContainer extends Component {
    constructor(props) {
        super(props);
        const search = location.search;
        this.logLocation = new LogLocation();
        this.state = {
            external: (search && utils.query.parse(search)["NaPm"]) || false,
            category: props.category,
            url: location.href,
            invisible: props.invisible || false
        };
    }

    componentWillMount() {
        this.logLocation.init(document.referrer);
        window.addEventListener("scroll", this.scrollCheck);
    }

    componentDidMount() {
        const browserNotice = document.getElementById("browser_notice");
        const beltBanner = document.getElementById("belt_banner");
        if (browserNotice || beltBanner) {
            const header = document.querySelector(".forsnav");
            const nav = document.querySelector(".nav");

            if (header) {
                header.style.position = "absolute";

                if (nav) {
                    header.style.top = "0";
                } else {
                    header.style.top = "auto";
                }
            }
        }

        if (localStorage) {
            this.removeItems();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.url !== location.href) {
            if (!utils.type.isEmpty(this.logLocation.getSessionItemsForLogData(["uuid"]))) {
                this.logLocation.setLogParams({ url: location.href });
                const log_params = this.logLocation.getLogParams();

                if (Object.keys(log_params).length > 3) {
                    this.logLocation.setLogLocationData("move");
                }
                this.state.url = location.href;
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.scrollCheck);
    }

    /**
     * 로컬에 저장되어 있는 값들을 제거한다.
     */
    removeItems() {
        if (localStorage.getItem("temp_user_id")) {
            localStorage.removeItem("temp_user_id");
        }
        if (localStorage.getItem("advice_order_no")) {
            localStorage.removeItem("advice_order_no");
        }
    }

    /**
     * 스크롤 이벤트
     */
    scrollCheck() {
        const scrollY = typeof window.scrollY === "undefined" ? window.pageYOffset : window.scrollY;
        const browserNotice = document.getElementById("browser_notice");
        const beltBanner = document.getElementById("belt_banner");

        let browserNoticeHeight = 0;
        let beltBannerHeight = 0;
        const eventBannerHeight = 0;

        if (beltBanner) {
            beltBannerHeight = beltBanner.clientHeight;
        }
        if (browserNotice) {
            browserNoticeHeight = 60;
        }
        const header = document.querySelector(".forsnav");

        if (header) {
            if (browserNotice) {
                if (beltBanner/* && !eventBanner*/) {
                    if ((scrollY > (beltBannerHeight + browserNoticeHeight)) && header.style.position !== "fixed") {     // 스크롤이 배너크기보다 커질 때
                        header.style.position = "fixed";
                        header.style.top = 0;
                    } else if ((scrollY < (beltBannerHeight + browserNoticeHeight)) && header.style.position === "fixed") {  // 스크롤이 배너크기보다 작아질때
                        header.style.position = "absolute";
                        header.style.top = "auto";
                        browserNotice.style.top = 0;
                        beltBanner.style.top = "60px;";
                    }
                } else if (!beltBanner/* && !eventBanner*/) {
                    if ((scrollY > browserNoticeHeight) && header.style.position !== "fixed") {     // 스크롤이 배너크기보다 커질 때
                        header.style.position = "fixed";
                        header.style.top = 0;
                    } else if ((scrollY < browserNoticeHeight) && header.style.position === "fixed") {  // 스크롤이 배너크기보다 작아질때
                        header.style.position = "absolute";
                        // header.style.top = 0;
                    }
                }

                if (/*eventBanner && */!beltBanner) {
                    if ((scrollY > (eventBannerHeight + browserNoticeHeight)) && header.style.position !== "fixed") {     // 스크롤이 배너크기보다 커질 때
                        header.style.position = "fixed";
                        header.style.top = 0;
                    } else if ((scrollY < (eventBannerHeight + browserNoticeHeight)) && header.style.position === "fixed") {  // 스크롤이 배너크기보다 작아질때
                        header.style.position = "absolute";
                        header.style.top = "auto";
                        browserNotice.style.top = 0;
                        // eventBanner.style.top = "70px;";
                    }
                }
            } else {
                if (beltBanner/* && !eventBanner*/) {
                    if ((scrollY > beltBannerHeight) && header.style.position !== "fixed") {     // 스크롤이 배너크기보다 커질 때
                        header.style.position = "fixed";
                        header.style.top = 0;
                    } else if ((scrollY < beltBannerHeight) && header.style.position === "fixed") {  // 스크롤이 배너크기보다 작아질때
                        header.style.position = "absolute";
                        header.style.top = "auto";
                        beltBanner.style.top = 0;
                    }
                } else if (!beltBanner/* && !eventBanner*/) {
                    if (header.style.position !== "fixed") {
                        header.style.position = "fixed";
                    }
                }

                if (/*eventBanner && */!beltBanner) {
                    if ((scrollY > eventBannerHeight) && header.style.position !== "fixed") {     // 스크롤이 배너크기보다 커질 때
                        header.style.position = "fixed";
                        header.style.top = 0;
                    } else if (scrollY < eventBannerHeight && header.style.position === "fixed") {  // 스크롤이 배너크기보다 작아질때
                        header.style.position = "absolute";
                        header.style.top = "auto";
                        //eventBanner.style.top = 0;
                    }
                }
            }
        }
    }

    render() {
        const { external } = this.state;
        const { invisible } = this.props;
        const data = { external };
        return (
            <div className={classNames("header-container", { "invisible": invisible })}>
                <h1 className="sr-only">네비게이션</h1>
                <BannerContainer {...data} />
                <Header category={this.props.category} />
            </div>
        );
    }
}
