import "./BusinessPage.scss";
import React, { Component, PropTypes } from "react";
import api from "forsnap-api";
import utils from "forsnap-utils";
import { BUSINESS_MAIN } from "shared/constant/main.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import SecondConsult from "./components/SecondConsult";
import ConsultBar from "./components/ConsultBar";
import RealReview from "./components/RealReview";
import Trust from "./components/Trust";
import Alliance from "./components/Alliance";
// import ExampleReview from "./example_review/ExampleReview";
import MainEstimate from "./components/estimate/MainEstimate";

class BusinessPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };

        this.onConsult = this.onConsult.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        this.gaEvent("메인로딩");
    }

    onConsult(data) {
        const { is_fb_ad, is_naver_ad } = this.props;
        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });
        api.orders.insertAdviceOrders(data)
            .then(response => {
                Modal.close(MODAL_TYPE.PROGRESS);
                this.externalSendEvent();

                if (is_fb_ad || is_naver_ad) {
                    this.gaEvent("상담전환");
                }

                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: utils.linebreak("상담신청해 주셔서 감사합니다.\n곧 연락 드리겠습니다.")
                });
            })
            .catch(error => {
                Modal.close(MODAL_TYPE.PROGRESS);
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak(error.data)
                    });
                }
            });
    }

    gaEvent(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(true, action);
        }
    }

    /**
     * 외부 이벤트
     */
    externalSendEvent() {
        utils.ad.wcsEvent("4");
        utils.ad.gaEvent("M_기업_메인", "포스냅 상담신청");
        utils.ad.gtag_report_conversion(location.href);
        // utils.ad.gaEvent("기업고객", "상담전환");
        // utils.ad.gaEventOrigin("기업고객", "상담전환");
    }

    render() {
        const textData = BUSINESS_MAIN.SECOND_CONSULT_DATA_2;

        return (
            <div className="business__page">
                <div>
                    <div className="logo__transparent">
                        <img alt="forsnap" src={`${__SERVER__.img}/common/logo_transparent2.png`} width="100" />
                    </div>
                    <SecondConsult
                        data={Object.keys(BUSINESS_MAIN.SECOND_CONSULT).map(o => Object.assign({ code: o }, BUSINESS_MAIN.SECOND_CONSULT[o]))}
                        title={textData.TITLE}
                        desc={textData.DESC}
                        test
                    />
                </div>
                <div className="main__row">
                    <MainEstimate />
                </div>
                <div>
                    <Trust />
                </div>
                {/*
                <div className="main__row">
                    <div className="main__row__title">추천 포트폴리오</div>
                    <RecommendPortfolio
                        category={Object.keys(BUSINESS_MAIN.RECOMMEND_PORTFOLIO).map(o => Object.assign({ code: o }, BUSINESS_MAIN.RECOMMEND_PORTFOLIO[o]))}
                        gaEvent={this.gaEvent}
                    />
                </div>
                */}
                <div className="main__row interview">
                    {/*<ExampleReview />*/}
                    <div className="main__row__title">포스냅 고객님들의 생생후기</div>
                    <RealReview data={BUSINESS_MAIN.MAIN_REVIEW} />
                </div>
                <div className="main__row">
                    <div className="main__row__title">촬영에 대해 궁금한점이 있다면,<br />포스냅 전문가와 먼저 상담받아보세요!</div>
                    <ConsultBar onConsult={this.onConsult} access_type="main_consult" />
                </div>
                <div className="main__row">
                    <div className="main__row__title">포스냅 작가님들과 함께한 기업들</div>
                    <Alliance />
                </div>
            </div>
        );
    }
}

BusinessPage.propTypes = {
    gaEvent: PropTypes.func
};

export default BusinessPage;
