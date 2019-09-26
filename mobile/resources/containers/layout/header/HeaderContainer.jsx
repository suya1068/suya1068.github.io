import React, { Component } from "react";
import Header from "./Header";
import classNames from "classnames";
import BannerContainer from "./component/banner/BannerContainer";
import utils from "forsnap-utils";
import LogLocation from "shared/helper/logLocation/LogLocation";

export default class HeaderContainer extends Component {
    constructor(props) {
        super(props);
        const search = location.search;
        this.logLocation = new LogLocation();

        this.state = {
            external: (search && utils.query.parse(search)["NaPm"]) || false,
            isStatic: props.isStatic || "false",
            category: props.category || "",
            invisible: props.invisible || false
        };
        this.onScroll = this.onScroll.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        this.logLocation.init(document.referrer);
        window.addEventListener("scroll", this.onScroll, false);
    }

    componentDidMount() {
        const browserNotice = document.getElementById("browser_notice");
        const beltBanner = document.getElementById("belt_banner");
        // const productNavigator = document.querySelector(".product_list__navigator");
        const header = document.querySelector(".site-header");

        // if (productNavigator) {
        //     const siteMain = document.querySelector(".site-main");
        //     header.style.position = "relative";
        //     siteMain.style.paddingTop = 0;
        // }

        if (browserNotice || beltBanner) {
            if (header) {
                header.style.position = "absolute";
                header.style.top = "auto";
            }
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
        window.removeEventListener("scroll", this.onScroll, false);
    }

    // /**
    //  * 비 로그인 상담신청 정보가 존재하면 삭제한다.
    //  */
    // removeItems() {
    //     if (localStorage.getItem("temp_user_id")) {
    //         localStorage.removeItem("temp_user_id");
    //     }
    //     if (localStorage.getItem("advice_order_no")) {
    //         localStorage.removeItem("advice_order_no");
    //     }
    // }

    onScroll(e) {
        const scrollY = typeof window.scrollY === "undefined" ? window.pageYOffset : window.scrollY;
        const browserNotice = document.getElementById("browser_notice");
        const beltBanner = document.getElementById("belt_banner");
        // const productNavigator = document.querySelector(".product_list__navigator");

        let browserNoticeHeight = 0;
        let beltBannerHeight = 0;
        const eventBannerHeight = 0;

        if (beltBanner) {
            beltBannerHeight = beltBanner.clientHeight;
        }
        if (browserNotice) {
            browserNoticeHeight = 70;
        }

        const header = document.querySelector(".site-header");

        if (browserNotice) {
            if (beltBanner) {
                if ((scrollY > (beltBannerHeight + browserNoticeHeight)) && header.style.position !== "fixed") {     // 스크롤이 배너크기보다 커질 때
                    header.style.position = "fixed";
                    header.style.top = 0;
                } else if ((scrollY < (beltBannerHeight + browserNoticeHeight)) && header.style.position === "fixed") {  // 스크롤이 배너크기보다 작아질때
                    header.style.position = "absolute";
                    header.style.top = "auto";
                    browserNotice.style.top = 0;
                    beltBanner.style.top = "70px;";
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

            if (!beltBanner) {
                if ((scrollY > (eventBannerHeight + browserNoticeHeight)) && header.style.position !== "fixed") {     // 스크롤이 배너크기보다 커질 때
                    header.style.position = "fixed";
                    header.style.top = 0;
                } else if ((scrollY < (eventBannerHeight + browserNoticeHeight)) && header.style.position === "fixed") {  // 스크롤이 배너크기보다 작아질때
                    header.style.position = "absolute";
                    header.style.top = "auto";
                    browserNotice.style.top = 0;
                    //eventBanner.style.top = "70px;";
                }
            }
        } else {
            if (beltBanner) {
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

            if (!beltBanner) {
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

    gaEvent(action, label) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(action, label);
        }
    }

    render() {
        const { external, isStatic } = this.state;
        const { category, artist, invisible } = this.props;

        const data = { external };

        return (
            <div className={classNames("m-header-container", { "invisible": invisible })}>
                <h1 className="sr-only">헤더 컨테이너</h1>
                <BannerContainer {...data} />
                <Header static={isStatic} category={category} artist={artist} gaEvent={this.gaEvent} />
            </div>
        );
    }
}
