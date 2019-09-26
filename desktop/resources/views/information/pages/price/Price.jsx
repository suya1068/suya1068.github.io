import "./price.scss";
import React from "react";
import api from "forsnap-api";
import { Banner, MainNavigation, Panel, Footer } from "../../components";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Buttons from "desktop/resources/components/button/Buttons";
import utils from "forsnap-utils";
// import cookie from "forsnap-cookie";
import PopModal from "shared/components/modal/PopModal";
// import PersonalConsult from "shared/components/consulting/personal/ConsultContainer";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";
// import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
// import SimpleConsult from "shared/components/consulting/renew/SimpleConsult";
import ConsultModal from "desktop/resources/components/modal/consult/ConsultModal";

const Price = () => {
    const onMove = url => {
        // const eCategory = "가격정가제";
        // const eAction = "";
        // const eLabel = url === "/" ? "메인보러가기" : "무료견적요청하기";
        // utils.ad.gaEvent(eCategory, eAction, eLabel);
        //
        // const enter = cookie.getCookies("ENTER");
        // const enter_session = sessionStorage.getItem("ENTER");
        // let convert_url = url;
        // if (enter && enter_session && url === "/") {
        //     convert_url = "/?enter=indi";
        // }
        location.href = url;
    };

    const onConsult = () => {
        utils.ad.gaEvent("가격정가제", "정가제", "무료견적요청하기");
        const modal_name = "simple__consult";
        // PopModal.createModal(modal_name, <SimpleConsult modal_name={modal_name} access_type={CONSULT_ACCESS_TYPE.PRICE.CODE} device_type="pc" onClose={() => PopModal.close(modal_name)} />, { className: modal_name, modal_close: false });
        // const modal_name = "simple__consult";
        // Modal.show({
        //     type: MODAL_TYPE.CUSTOM,
        //     content: <SimpleConsult modal_name={modal_name} access_type={CONSULT_ACCESS_TYPE.PRICE.CODE} device_type="pc" onClose={() => Modal.close(modal_name)} />,
        //     name: modal_name
        // });

        PopModal.createModal(modal_name,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({
                        access_type: CONSULT_ACCESS_TYPE.PRICE.CODE,
                        device_type: "pc",
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
    };

    return (
        <div className="information-price-component">
            <HeaderContainer />
            <section>
                <Banner>
                    <h1 className="information-heading">포스냅 가격 정가제</h1>
                    <p className="information-description">
                        알아보면 알아볼수록 어려운 촬영비용, 적당한 촬영 비용이 얼마인지 알기 어려우셨죠?<br />
                        포스냅에서는 가격 정가제를 실시하고 있습니다.<br />
                        세부 촬영 단가 공개를 통한 투명한 촬영 금액을 제안합니다.
                    </p>
                </Banner>
                <div className="information-footer" style={{ height: 200 }}>
                    <div className="information-inner">
                        <div className="container">
                            <div className="information-contents">
                                <div className="information-footer-left">
                                    <h2 className="information-heading">포스냅에서 원하는 촬영을 확인해보세요.</h2>
                                    <Buttons buttonStyle={{ width: "w179", theme: "blue" }} inline={{ onClick: () => onMove("/") }}>메인 바로가기</Buttons>
                                </div>
                                <div className="information-footer-right">
                                    <h2 className="information-heading">무료 맞춤 견적을 받아보고 싶다면?</h2>
                                    <Buttons buttonStyle={{ width: "w179", theme: "fill-emphasis" }} inline={{ onClick: () => onConsult() }}>무료견적요청하기</Buttons>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="information-panel" style={{ backgroundColor: "#fff" }}>
                    <div className="container">
                        <div className="paragraph">
                            <div className="paragraph-left">
                                <h2 className="information-heading">
                                    투명한 세부 촬영 금액 공개
                                </h2>
                                <p className="information-description">
                                    원하는 포트폴리오와 옵션선택으로 문의 없이도<br />
                                    촬영 별 세부 촬영 금액 확인이 가능합니다.
                                </p>
                                <div className="img-wrap">
                                    <img src={`${__SERVER__.img}/price/price_01.png`} alt="상품 패키지" />
                                </div>
                                <div className="img-arrow">
                                    <img src={`${__SERVER__.img}/price/price_02.png`} alt="화살표" />
                                </div>
                            </div>
                            <div className="paragraph-right">
                                <div className="gradient" />
                                <img src={`${__SERVER__.img}/price/price_03.png`} alt="투명한 세부 촬영 금액 공개" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="information-panel" style={{ backgroundColor: "#fafafa" }}>
                    <div className="container">
                        <h2 className="information-heading text-center" style={{ textAlign: "center" }}>
                            포스냅 크루 스튜디오의<br />
                            평균 촬영 단가
                        </h2>
                        <div className="paragraph text-center">
                            <div className="paragraph-left">
                                <p className="content-heading">포스냅 크루스튜디오</p>
                                <p className="content-description">
                                    포스냅크루 스튜디오에서는 촬영 품질 보증제도를 실시하고 있습니다.<br />
                                    만족하실때까지 무제한 수정을 통한 퀄리티 보장서비스를 제공합니다.
                                </p>
                                <div className="img-wrap">
                                    <img src={`${__SERVER__.img}/price/price_04.png`} alt="포스냅 크루스튜디오" />
                                </div>
                            </div>
                            <div className="paragraph-right">
                                <p className="content-heading">촬영 평균 촬영 단가</p>
                                <p className="content-description">
                                    무제한 수정이 보장된 촬영 가능 최소~최대 단가이며<br />
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
                                                시간 당
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
                    </div>
                </div>
                <Footer>
                    <div className="information-footer-left">
                        <h2 className="information-heading">포스냅에서 원하는 촬영을 확인해보세요.</h2>
                        <Buttons buttonStyle={{ width: "w179", theme: "blue" }} inline={{ onClick: () => onMove("/") }}>메인 바로가기</Buttons>
                    </div>
                    <div className="information-footer-right">
                        <h2 className="information-heading">무료 맞춤 견적을 받아보고 싶다면?</h2>
                        <Buttons buttonStyle={{ width: "w179", theme: "fill-emphasis" }} inline={{ onClick: () => onConsult() }}>무료견적요청하기</Buttons>
                    </div>
                </Footer>
            </section>
        </div>
    );
};

export default Price;
