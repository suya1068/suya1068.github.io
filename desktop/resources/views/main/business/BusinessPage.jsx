import "./BusinessPage.scss";
import React, { Component, PropTypes } from "react";
import api from "forsnap-api";
import utils from "forsnap-utils";
import { BUSINESS_MAIN } from "shared/constant/main.const";
import PopModal from "shared/components/modal/PopModal";
import PopupShotInfo from "desktop/resources/components/pop/popup/shot_info/PopupShotInfo";
import SecondConsult from "./components/SecondConsult";
import RealReview from "./components/RealReview";
import ConsultBar from "./components/ConsultBar";
import Trust from "../components/business/trust/Trust";
import Alliance from "../components/business/alliance/Alliance";
import ExampleReview from "./example_review/ExampleReview";
import MainEstimate from "./components/estimate/MainEstimate";

import ConceptBanner from "desktop/resources/components/banner/concept/ConceptBanner";

// import Interview from "../components/business/interview/Interview";
// import RecommendPortfolio from "./components/RecommendPortfolio";
// import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

class BusinessPage extends Component {
    constructor(props) {
        super(props);

        const search = location.search;

        this.state = {
            params: utils.query.parse(search),
            is_fb_ad: props.is_fb_ad,
            is_naver_ad: props.is_naver_ad
        };

        this.onPopCheck = this.onPopCheck.bind(this);
        this.onPopShotInfo = this.onPopShotInfo.bind(this);
        this.onConsult = this.onConsult.bind(this);
        this.preparePopupType = this.preparePopupType.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.externalSendEvent = this.externalSendEvent.bind(this);
    }
    componentWillMount() {
        this.preparePopupType(this.state.params);
        this.gaEvent("메인로딩");
    }

    /**
     * 넘어온 타입값에 따라 띄울 팝업을 결정
     * @param type
     */
    onPopCheck(type) {
        switch (type) {
            case "si": this.onPopShotInfo(); break;
            // case "mp": this.onPopMakeProduct(); break;
            default: break;
        }
    }

    /**
     * 촬영 안내 팝업
     */
    onPopShotInfo() {
        const modal_name = "shot_info";
        PopModal.createModal(modal_name, <PopupShotInfo modal_name={modal_name} />, { className: modal_name, modal_close: false });
        PopModal.show(modal_name);
    }

    onConsult(data) {
        const { is_fb_ad, is_naver_ad } = this.props;
        PopModal.progress();
        api.orders.insertAdviceOrders(data)
            .then(response => {
                PopModal.closeProgress();
                this.externalSendEvent();
                if (is_fb_ad || is_naver_ad) {
                    this.gaEvent("상담전환");
                }
                PopModal.alert("상담신청해 주셔서 감사합니다.\n곧 연락 드리겠습니다.");
            })
            .catch(error => {
                PopModal.closeProgress();
                if (error && error.data) {
                    PopModal.alert(error.data);
                }
            });
    }

    /**
     * 외부 이벤트
     */
    externalSendEvent() {
        utils.ad.wcsEvent("4");
        utils.ad.gtag_report_conversion(location.href);
        utils.ad.gaEvent("기업_메인", "포스냅 상담신청");
        utils.ad.gaEvent("기업고객", "상담전환");
        utils.ad.gaEventOrigin("기업고객", "상담전환");
    }

    /**
     * 파라미터를 체크하여 팝업을 띄운다.
     * @param params
     */
    preparePopupType(params) {
        const prepareKey = ["si", "mp"];
        const take = prepareKey.filter(k => params[k])[0];
        if (params[take] && utils.stringToBoolen(params[take])) {
            this.onPopCheck(take);
        }
    }

    gaEvent(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(true, action);
        }
    }

    render() {
        const textData = BUSINESS_MAIN.SECOND_CONSULT_DATA_2;
        return (
            <div className="business__page">
                <div className="main__row">
                    <SecondConsult
                        data={Object.keys(BUSINESS_MAIN.SECOND_CONSULT).map(o => Object.assign({ code: o }, BUSINESS_MAIN.SECOND_CONSULT[o]))}
                        title={textData.TITLE}
                        desc={textData.DESC}
                        test
                    />
                </div>
                <div className="main__row row__full">
                    <ConceptBanner />
                </div>
                <div className="main__row row__full" style={{ backgroundColor: "#f9f9f9" }}>
                    <MainEstimate />
                </div>
                <div className="main__row row__full">
                    <div className="main__trust">
                        <Trust />
                    </div>
                </div>
                {/*
                <div className="main__row row__full border__top">
                    <div className="container">
                        <RecommendPortfolio
                            category={Object.keys(BUSINESS_MAIN.RECOMMEND_PORTFOLIO).map(o => Object.assign({ code: o }, BUSINESS_MAIN.RECOMMEND_PORTFOLIO[o]))}
                            gaEvent={this.gaEvent}
                        />
                    </div>
                </div>
                */}
                <div className="main__row row__full border__top ">
                    <div className="container">
                        <ConsultBar onConsult={this.onConsult} access_type="main_consult" />
                    </div>
                </div>
                <div className="main__row row__full">
                    <div className="main__interview">
                        <div className="container">
                            {/*<ExampleReview page_type="main" />*/}
                            <RealReview data={BUSINESS_MAIN.MAIN_REVIEW} />
                        </div>
                    </div>
                </div>
                <div className="main__row row__full">
                    <div className="main__alliance">
                        <Alliance />
                    </div>
                </div>
            </div>
        );
    }
}

BusinessPage.propTypes = {
    gaEvent: PropTypes.func
};

export default BusinessPage;
