import "./MainPage.scss";
import React, { Component } from "react";
import ReactDOM from "react-dom";

import utils from "forsnap-utils";

import cookie from "shared/management/cookie";

import App from "desktop/resources/components/App";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Footer from "desktop/resources/components/layout/footer/Footer";
import ScrollTop from "desktop/resources/components/scroll/ScrollTop";

import BusinessPage from "./business/BusinessPage";
import PersonalPage from "./personal/PersonalPage";

// import CONST from "shared/constant";

const TAG = "ENTER";

class MainPage extends Component {

    constructor() {
        super();
        const search = location.search;

        this.state = {
            search_param: search ? utils.query.parse(search) : {},
            is_fb_ad: false,
            is_naver_ad: false
        };
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        const { search_param } = this.state;
        const enter = cookie.getCookies(TAG);
        const enter_session = sessionStorage.getItem(TAG);
        // const enter_query = utils.query.querySearchValue("enter");

        const session = sessionStorage;

        if (!utils.type.isEmpty(search_param) && search_param.utm_source && search_param.utm_source === "fb_ad") {
            if (session && session.getItem("referer")) {
                if (session.getItem("referer") === "facebook_ad") {
                    session.setItem("facebook_ad_content", search_param.utm_content);
                    this.state.is_fb_ad = true;
                }
            }
        }

        if (!utils.type.isEmpty(search_param) && search_param.utm_source && search_param.utm_source === "naver") {
            const referer = session.getItem("referer");
            if (session && referer) {
                session.setItem("naver_ad_content", search_param.utm_content);
                if (referer === "naver_power") this.state.is_naver_ad = "power";
                if (referer === "naver_shopping") this.state.is_naver_ad = "shopping";
            }
        }

        this.state.enter = enter;
        this.state.enter_session = enter_session;
    }

    componentDidMount() {
        const { search_param } = this.state;
        // if (!utils.type.isEmpty(search_param) && search_param.utm_source && search_param.utm_source === "10ping_ad") {
        //     if (TenpingScript) {
        //         TenpingScript.SendConversion();
        //     }
        // }
    }

    gaEvent(is_biz, action) {
        const { search_param, is_fb_ad, is_naver_ad } = this.state;

        if (is_fb_ad && !utils.type.isEmpty(search_param) && search_param.utm_source && search_param.utm_source === "fb_ad") {
            utils.ad.gaEvent(`페이스북광고_${is_biz ? "기업" : "개인"}`, search_param.utm_content || (sessionStorage && sessionStorage.getItem("facebook_ad_content")), action);
        }

        if (is_naver_ad && !utils.type.isEmpty(search_param) && search_param.utm_source && search_param.utm_source === "naver") {
            const naver_ga = {
                action: search_param.utm_content || (sessionStorage && sessionStorage.getItem("naver_ad_content")),
                label: action
            };
            if (this.state.is_naver_ad === "power") naver_ga.category = "네이버광고";
            if (this.state.is_naver_ad === "shopping") naver_ga.category = "네이버쇼핑";

            utils.ad.gaEvent(`${naver_ga.category}_${is_biz ? "기업" : "개인"}`, naver_ga.action, naver_ga.label);
        }
    }

    render() {
        const { enter, enter_session, is_fb_ad, is_naver_ad } = this.state;

        return (
            <div className="main__page">
                {(enter && enter_session)
                    ? <PersonalPage gaEvent={this.gaEvent} />
                    : <BusinessPage gaEvent={this.gaEvent} is_fb_ad={is_fb_ad} is_naver_ad={is_naver_ad} />
                }
            </div>
        );
    }
}

ReactDOM.render(
    <App>
        <HeaderContainer />
        <div id="site-main">
            <MainPage />
        </div>
        <Footer>
            <ScrollTop />
        </Footer>
    </App>,
    document.getElementById("root")
);
