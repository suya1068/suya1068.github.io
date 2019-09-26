import "./MainPage.scss";
import React, { Component } from "react";
import ReactDOM from "react-dom";

import utils from "forsnap-utils";

import cookie from "shared/management/cookie";

import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer, Footer } from "mobile/resources/containers/layout";

// import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

import BusinessPage from "./business/BusinessPage";
import PersonalPage from "./personal/PersonalPage";

const TAG = "ENTER";

class MainPage extends Component {

    constructor() {
        super();
        const search = location.search;

        this.state = {
            search_param: search ? utils.query.parse(search) : {},
            is_fb_ad: false
        };
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        const { search_param } = this.state;
        const enter = cookie.getCookies(TAG);
        const enter_session = sessionStorage.getItem(TAG);
        // const enter_query = utils.query.querySearchValue("enter");

        if (!utils.type.isEmpty(search_param) && search_param.utm_source && search_param.utm_source === "fb_ad") {
            if (sessionStorage && sessionStorage.getItem("referer")) {
                if (sessionStorage.getItem("referer") === "facebook_ad") {
                    sessionStorage.setItem("facebook_ad_content", search_param.utm_content);
                    this.state.is_fb_ad = true;
                }
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
        const { search_param, is_fb_ad } = this.state;
        if (is_fb_ad && !utils.type.isEmpty(search_param) && search_param.utm_source && search_param.utm_source === "fb_ad") {
            utils.ad.gaEvent(`M_페이스북광고_${is_biz ? "기업" : "개인"}`, search_param.utm_content || (sessionStorage && sessionStorage.getItem("facebook_ad_content")), action);
        }
    }

    render() {
        const { enter, enter_session, is_fb_ad } = this.state;

        return (
            <div className="main__page">
                {(enter && enter_session)
                    ? <PersonalPage gaEvent={this.gaEvent} />
                    : <BusinessPage gaEvent={this.gaEvent} is_fb_ad={is_fb_ad} />
                }
            </div>
        );
    }
}

// <PersonalPage />}

ReactDOM.render(
    <AppContainer>
        <HeaderContainer />
        <div className="site-main">
            <LeftSidebarContainer />
            <MainPage />
            <OverlayContainer />
        </div>
        <Footer />
    </AppContainer>,
    document.getElementById("root")
);

