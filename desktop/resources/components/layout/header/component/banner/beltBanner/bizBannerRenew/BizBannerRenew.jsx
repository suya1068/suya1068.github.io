import "./bizBanner_renew.scss";
import React, { Component } from "react";
import api from "forsnap-api";
import auth from "forsnap-authentication";
import PopModal from "shared/components/modal/PopModal";
import utils from "forsnap-utils";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";
// import SimpleConsult from "shared/components/consulting/renew/SimpleConsult";
import TypesConst from "desktop/resources/views/main/components/business/wideScreen/types.const";
import Type from "desktop/resources/views/main/components/business/wideScreen/components/type/Type";
import ConsultModal from "desktop/resources/components/modal/consult/ConsultModal";

export default class BizBannerRenew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: auth.getUser(),
            external: props.external,
            test_data: TypesConst.TYPE_B
        };
        this.onClose = this.onClose.bind(this);
        this.onMovePage = this.onMovePage.bind(this);
    }

    componentWillMount() {
        this.setProductData();
    }

    componentDidMount() {
    }

    /**
     * 상품정보를 저장한다.
     */
    setProductData() {
        const responseData = document.getElementById("product-data");
        if (responseData) {
            const getAtt = responseData.getAttribute("content");
            this.state.productData = JSON.parse(getAtt).data;
        }
    }

    /**
     * N쇼핑 배너 버튼 클릭 시 gaEvent
     * @param label
     * @param data
     */
    gaEvent_inflow_click(label, data) {
        const eCategory = "기업_상세";
        const eAction = "N쇼핑배너";
        //const eLabel = label;
        utils.ad.gaEvent(eCategory, eAction, label);
    }

    gaEvent_click(label, data) {
        utils.ad.gaEvent("기업_상세", "상단배너", label);
    }

    /**
     * 배너 창을 닫는다.
     */
    onClose(e) {
        if (typeof this.props.onClose === "function") {
            this.props.onClose();
        }
    }

    /**
     * 상담신청 모달창을 생성한다.
     */
    onConsult() {
        const { external } = this.props;
        const { productData } = this.state;
        const product_no = productData && productData.product_no;
        // const modal_name = "personal_consult";
        const access_type = external ? CONSULT_ACCESS_TYPE.INFLOW.CODE : CONSULT_ACCESS_TYPE.PRODUCT_DETAIL.CODE;

        const modal_name = "simple__consult";
        // PopModal.createModal(modal_name,
        //     <SimpleConsult modal_name={modal_name} product_no={product_no} access_type={access_type} device_type="pc" onClose={() => PopModal.close(modal_name)} />,
        //     { className: modal_name, modal_close: false });

        PopModal.createModal(
            modal_name,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({
                        access_type,
                        device_type: "pc",
                        page_type: "biz",
                        product_no
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

    /**
     * @param label
     */
    onMovePage(label) {
        const { productData } = this.state;
        const { external } = this.props;
        if (external) {
            this.gaEvent_inflow_click(label, productData);
        } else {
            this.gaEvent_click(label, productData);
        }

        this.onConsult();
    }

    render() {
        const { test_data } = this.state;
        return (
            <section className="biz-banner-renew biz-page__hr">
                <div className="container">
                    <div className="biz-banner-renew-container">
                        <h3 className="biz-panel__title" style={{ color: "#fff" }}>
                            상담부터 견적과 촬영까지 포스냅에 맡기세요.
                        </h3>
                        {
                            test_data.list &&
                            <div className="test-banner-container">
                                {test_data.list.map((obj, idx) => {
                                    return (
                                        <Type
                                            data={obj}
                                            width={test_data.width}
                                            height={test_data.height}
                                            button_pa={test_data.button_pa}
                                            key={`test__${idx}`}
                                            onConsult={this.onMovePage}
                                        />
                                    );
                                })}
                            </div>
                        }
                    </div>
                    <div className="close-button" onClick={this.onClose}>
                        <img src={`${__SERVER__.img}/${test_data.close_button}`} role="presentation" style={{ width: "100%", height: "100%" }} />
                        {/*<Img image={{ src: test_data.close_button, type: "image" }} />*/}
                    </div>
                </div>
            </section>
        );
    }
}
