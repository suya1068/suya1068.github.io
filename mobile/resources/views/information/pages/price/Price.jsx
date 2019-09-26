import "./price.scss";
import React from "react";
import api from "forsnap-api";
import { Footer } from "mobile/resources/containers/layout";
import Img from "shared/components/image/Img";
import utils from "forsnap-utils";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import PopModal from "shared/components/modal/PopModal";
// import PersonalConsult from "shared/components/consulting/personal/ConsultContainer";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";
// import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
// import SimpleConsult from "shared/components/consulting/renew/SimpleConsult";
import ConsultModal from "mobile/resources/components/modal/consult/ConsultModal";

class Price extends React.Component {
    constructor() {
        super();
        this.state = {};
        // this.gaEvent = this.gaEvent.bind(this);
        this.onConsult = this.onConsult.bind(this);
        this.moveMain = this.moveMain.bind(this);
    }
    componentDidMount() {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "가격 정가제 이용안내" });
        }, 0);
    }

    moveMain(e) {
        e.preventDefault();
        const node = e.currentTarget;
        const url = node.href;
        // this.gaEvent("메인보러가기");
        location.href = url;
    }

    onConsult() {
        // this.gaEvent("무료견적요청하기");
        // const modal_name = "personal_consult";
        //
        // PopModal.createModal(modal_name, <PersonalConsult device_type="mobile" access_type={CONSULT_ACCESS_TYPE.PRICE.CODE} />, { className: modal_name });
        // PopModal.show(modal_name);
        // const modal_name = "simple__consult";
        //
        // Modal.show({
        //     type: MODAL_TYPE.CUSTOM,
        //     content: <SimpleConsult modal_name={modal_name} access_type={CONSULT_ACCESS_TYPE.PRICE.CODE} device_type="mobile" onClose={() => Modal.close(modal_name)} />,
        //     name: modal_name
        // });
        const modal_name = "simple__consult";
        // PopModal.createModal(modal_name,
        //     <SimpleConsult modal_name={modal_name} access_type={CONSULT_ACCESS_TYPE.PRICE.CODE} device_type="mobile" onClose={() => PopModal.close(modal_name)} />,
        //     { className: modal_name, modal_close: false });
        PopModal.createModal(modal_name,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({
                        access_type: CONSULT_ACCESS_TYPE.PRICE.CODE,
                        device_type: "mobile",
                        page_type: "biz"
                    }, data);

                    // 상담요청 api
                    api.orders.insertAdviceOrders(params)
                        .then(response => {
                            // utils.ad.fbqEvent("InitiateCheckout");
                            utils.ad.wcsEvent("4");
                            utils.ad.gtag_report_conversion(location.href);
                            utils.ad.gaEvent("기업고객", "상담전환");
                            utils.ad.gaEventOrigin("기업고객", "상담전환");
                            PopModal.alert("상담신청해 주셔서 감사합니다.\n곧 연락 드리겠습니다.", { callBack: () => PopModal.close(modal_name) });
                        })
                        .catch(error => {
                            if (error && error.date) {
                                PopModal.alert(error.data);
                            }
                        });
                }}
                onClose={() => PopModal.close(modal_name)}
            />,
            { modal_close: false }
        );

        PopModal.show(modal_name);
    }

    // gaEvent(label) {
    //     const eCategory = "가격정가제";
    //     const eAction = "";
    //     utils.ad.gaEvent(eCategory, eAction, label);
    // }

    render() {
        return (
            <section id="information-price">
                <div className="information-price-component mobile">
                    <div className="mobile-information-banner">
                        <h2 className="mobile-information-heading">포스냅 가격 정가제</h2>
                        <p className="mobile-information-description">
                            알아보면 알아볼수록 어려운 촬영비용,<br />
                            적당한 촬영 비용이 얼마인지 알기 어려우셨죠?<br />
                            포스냅에서는 가격 정가제를 실시하고 있습니다.<br />
                            세부 촬영 단가 공개를 통한 투명한 촬영 금액을 제안합니다.
                        </p>
                    </div>
                    <div className="mobile-information-panel" style={{ backgroundColor: "#fff" }}>
                        <h2 className="mobile-information-heading">투명한 세부 촬영 금액 공개</h2>
                        <p className="mobile-information-description">
                            원하는 포트폴리오와 옵션선택으로 문의 없이도<br />
                            촬영 별 세부 촬영 금액 확인이 가능합니다.
                        </p>
                        <div className="img-wrap">
                            <div className="img-package">
                                <Img image={{ src: "/mobile/price/price_01.png", type: "image" }} />
                            </div>
                            <div className="img-arrow">
                                <img src={`${__SERVER__.img}/mobile/price/price_02.png`} alt="화살표" />
                            </div>
                            <div className="img-package-detail">
                                <Img image={{ src: "/mobile/price/price_03.png", type: "image" }} />
                            </div>
                        </div>
                    </div>
                    <div className="mobile-information-panel" style={{ backgroundColor: "#fafafa" }}>
                        <h2 className="mobile-information-heading">포스냅크루 스튜디오의<br />평균 촬영 단가</h2>
                        <div className="mobile-information-content">
                            <h3 className="mobile-information-content-heading">포스냅 크루 스튜디오</h3>
                            <p className="mobile-information-content-description">
                                포스냅 크루 스튜디오에서는 촬영 품질<br />
                                보증제도를 실시하고 있습니다.<br />
                                만족하실때까지 무제한 수정을 통한 <br />
                                퀄리티 보장서비스를 제공합니다.
                            </p>
                            <div className="img-wrap">
                                <Img image={{ src: "/mobile/price/price_04.png", type: "image" }} />
                            </div>
                        </div>
                        <div className="mobile-information-content">
                            <h3 className="mobile-information-content-heading">촬영 평균 촬영 단가</h3>
                            <p className="mobile-information-content-description">
                                무제한 수정이 보장된 촬영 가능 최소 ~ 최대 단가이며<br />
                                촬영 상품의 종류에 따라 가격의 차이가 발생합니다.
                            </p>
                            <div className="price-table">
                                <p className="table-title">제품 / 패션 / 음식</p>
                                <div className="price-table-outer">
                                    <div className="table-row">
                                        <div className="row-title">
                                            누끼촬영 컷 당
                                        </div>
                                        <div className="row-price">5,000 ~ 15,000</div>
                                    </div>
                                    <div className="table-row">
                                        <div className="row-title">
                                            연출촬영 컷 당
                                        </div>
                                        <div className="row-price">15,000 ~ 40,000</div>
                                    </div>
                                    <div className="table-row">
                                        <div className="row-title">
                                            고급연출촬영 컷 당
                                        </div>
                                        <div className="row-price">50,000 ~ 70,000</div>
                                    </div>
                                </div>
                            </div>
                            <div className="price-table">
                                <p className="table-title">기업프로필</p>
                                <div className="price-table-outer">
                                    <div className="table-row">
                                        <div className="row-title">
                                            보정본 컷 당
                                        </div>
                                        <div className="row-price">15,000 ~ 30,000</div>
                                    </div>
                                </div>
                            </div>
                            <div className="price-table">
                                <p className="table-title">인테리어</p>
                                <div className="price-table-outer">
                                    <div className="table-row">
                                        <div className="row-title">
                                            보정본 컷 당
                                        </div>
                                        <div className="row-price">15,000 ~ 30,000</div>
                                    </div>
                                </div>
                            </div>
                            <div className="price-table">
                                <p className="table-title">행사</p>
                                <div className="price-table-outer">
                                    <div className="table-row">
                                        <div className="row-title">
                                            시간당 당
                                        </div>
                                        <div className="row-price">80,000 ~ 150,000</div>
                                    </div>
                                </div>
                            </div>
                            <p className="content-footer">
                                해당 금액은 포스냅 크루스튜디오의 촬영 평균 단가이며,<br />
                                수량, 연출난이도 및 후보정 방법에 따라 변동 될 수 있습니다.
                            </p>
                        </div>
                    </div>
                    <div className="mobile-information-footer-price">
                        <div className="mobile-information-footer-panel">
                            <h3 className="mobile-information-footer-panel__heading">포스냅에서 원하는 촬영을 확인해보세요.</h3>
                            <a className="mobile-information-footer-button" href="/" onClick={this.moveMain}>메인 바로가기</a>
                        </div>
                        <div className="mobile-information-footer-panel">
                            <h3 className="mobile-information-footer-panel__heading">무료 맞춤 견적을 받아보고 싶다면?</h3>
                            <button className="mobile-information-footer-button" onClick={this.onConsult}>무료견적요청하기</button>
                        </div>
                    </div>
                </div>
                <Footer>
                    <ScrollTop />
                </Footer>
                <div className="floating_banner">
                    <a className="button button__rect button__theme__skyblue" href="/" onClick={this.moveMain}>메인 바로가기</a>
                    <button className="button button__rect button__theme__yellow" onClick={this.onConsult}>무료견적요청하기</button>
                </div>
            </section>
        );
    }
}

export default Price;
