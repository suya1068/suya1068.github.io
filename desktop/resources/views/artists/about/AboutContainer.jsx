import "./aboutContainer.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import API from "forsnap-api";
import PopModal from "shared/components/modal/PopModal";
import redirect from "forsnap-redirect";
// import utils from "forsnap-utils";
// import cookie from "forsnap-cookie";
// import CONSTANT from "shared/constant";
import App from "desktop/resources/components/App";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Footer from "desktop/resources/components/layout/footer/Footer";
import ScrollTop from "desktop/resources/components/scroll/ScrollTop";

import LeftSide from "./components/leftSide/LeftSide";
import RightSideContainer from "./components/rigthSide/RightSideContainer";

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
    }

    /**
     * 작가정보 조회
     */
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
            artist_id
        } = this.state;

        if (!is_loading) {
            return null;
        }

        const leftSideData = { profile_img, nick_name, intro, career, is_corp };
        const productData = { nick_name, product, profile_img };
        const outsideReviewData = { nick_name, outside_review };
        const artistTrustData = { rating_avg, reserve_cnt, response_time, region };
        const reviewData = { review };

        return (
            <div id="site-main">
                <HeaderContainer />
                <section className="artist-about-container">
                    <h1 className="sr-only">{nick_name}작가 소개</h1>
                    <div className="container" style={{ height: "100%" }}>
                        <LeftSide {...leftSideData} artistTrustData={artistTrustData} />
                        <RightSideContainer data={{ productData, outsideReviewData, reviewData, artist_id }} getArtistAbout={this.getArtistAbout} />
                    </div>
                </section>
                <Footer>
                    <ScrollTop />
                </Footer>
            </div>
        );
    }
}

ReactDOM.render(
    <App>
        <AboutContainer />
    </App>, document.getElementById("root")
);
