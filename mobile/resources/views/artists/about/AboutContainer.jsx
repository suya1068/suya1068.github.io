import "./aboutContainer.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, Footer, OverlayContainer } from "mobile/resources/containers/layout";
import API from "forsnap-api";
import PopModal from "shared/components/modal/PopModal";
import redirect from "forsnap-redirect";
// import cookie from "forsnap-cookie";
// import CONSTANT from "shared/constant";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import AboutTop from "./components/top/AboutTop";
import AboutTabsContainer from "./components/tabs/AboutTabsContainer";
import ArtistTrust from "./components/artist_trust/ArtistTrust";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";
// import utils from "forsnap-utils";

class AboutContainer extends Component {
    constructor(props) {
        super(props);
        const pathName = location.pathname;
        this.state = {
            nick_name: pathName && pathName.startsWith("/@") && (pathName.substr(2) || ""),
            is_loading: false
        };

        this.getArtistAbout = this.getArtistAbout.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.getArtistAbout();
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "작가소개" });
        }, 0);
    }

    getArtistAbout() {
        PopModal.progress();
        const { nick_name } = this.state;

        API.artists.getArtistsIntroPublicNew({ nick_name, enter: "N" }).then(response => {
            PopModal.closeProgress();
            const data = response.data;
            this.setState(this.setAboutData(data));
        }).catch(error => {
            PopModal.alert(error.data, { callBack: () => redirect.main() });
        });
    }

    setAboutData(data) {
        return {
            intro: data.intro,
            career: data.career,
            nick_name: data.nick_name,
            profile_img: data.profile_img,
            product: data.product,
            review: data.review,
            is_corp: data.is_corp,
            rating_avg: data.rating_avg,
            reserve_cnt: data.reserve_cnt,
            response_time: data.response_time,
            region: data.region,
            artist_id: data.artist_id,
            is_loading: true
        };
    }

    render() {
        const {
            is_loading,
            career, intro,
            nick_name,
            profile_img,
            outside_review,
            review,
            is_corp,
            rating_avg,
            reserve_cnt,
            response_time,
            region,
            // ignore_product,
            // enter_product,
            // ordinary_product,
            product,
            artist_id,
        } = this.state;

        if (!is_loading) {
            return null;
        }

        const aboutTopData = { profile_img, nick_name, intro, is_corp };
        const productData = { nick_name, product, profile_img };
        const outsideReviewData = { nick_name, outside_review, career };
        const artistTrustData = { rating_avg, reserve_cnt, response_time, region };
        const reviewData = { review };

        return (
            <div className="artist-about-container">
                <AboutTop {...aboutTopData} />
                <ArtistTrust {...artistTrustData} />
                <AboutTabsContainer data={{ productData, outsideReviewData, reviewData, artist_id }} getArtistAbout={this.getArtistAbout} />
                <Footer>
                    <ScrollTop />
                </Footer>
            </div>
        );
    }
}

ReactDOM.render(
    <AppContainer>
        <HeaderContainer />
        <div className="site-main ">
            <LeftSidebarContainer />
            <AboutContainer />
            <OverlayContainer />
        </div>
    </AppContainer>,
    document.getElementById("root")
);
