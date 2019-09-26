import React, { Component, PropTypes } from "react";
import api from "forsnap-api";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import utils from "forsnap-utils";
import WideScreen from "./business/wide-screen/WideScreen";
import RealReview from "./business/real-review/RealReview";
import Category from "./business/category/Category";
import Estimate from "./business/estimate/Estimate";
import Consult from "./business/consult/Consult";
import Alliance from "./business/alliance/Alliance";
import PopModal from "../../../../../shared/components/modal/PopModal";
// import SimpleConsult from "shared/components/consulting/renew/SimpleConsult";
import ConsultModal from "mobile/resources/components/modal/consult/ConsultModal";

class Business extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mainType: "entermain",
            is_fb_ad: props.is_fb_ad
        };

        this.fetchMain = this.fetchMain.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onConsult = this.onConsult.bind(this);
    }

    componentDidMount() {
        this.fetchMain()
            .then(data => {
                const { entermain } = data;
                const init = { list: [], total_cnt: 0 };

                this.setState({
                    order: Object.assign(init, entermain.order),
                    reserve: Object.assign(init, entermain.reserve)
                });
            });
        this.gaEvent("메인로딩");
    }

    fetchMain() {
        return api.products.findMainProducts(this.state.mainType)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: error.data
                    });
                }
            });
    }

    /**
     * 상담신청 페이지로 이동한다.
     */
    onConsult(access_type) {
        const modal_name = "simple__consult";
        // PopModal.createModal(modal_name,
        //     <SimpleConsult
        //         modal_name={modal_name}
        //         access_type={access_type}
        //         device_type="mobile"
        //         onClose={() => PopModal.close(modal_name)}
        //         onSubmit={this.onSubmit}
        //     />,
        //     { className: modal_name, modal_close: false });
        PopModal.createModal(modal_name,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({
                        access_type,
                        device_type: "mobile",
                        page_type: "biz"
                    }, data);

                    // 기존 상담요청 onSubmit함수 (기존에도 상담 요청전에 호출함)
                    // this.onSubmit();

                    // 상담요청 api
                    api.orders.insertAdviceOrders(params)
                        .then(response => {
                            // utils.ad.fbqEvent("InitiateCheckout");
                            this.gaEvent("상담전환");
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

    // onSubmit() {
    // }

    gaEvent(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(true, action);
        }
    }

    render() {
        const { reserve } = this.state;

        return (
            <main>
                <WideScreen gaEvent={this.gaEvent} onConsult={this.onConsult} />
                <RealReview reserve={reserve || null} gaEvent={this.gaEvent} />
                <Category gaEvent={this.gaEvent} />
                <Estimate gaEvent={this.gaEvent} onConsult={this.onConsult} />
                <Consult gaEvent={this.gaEvent} />
                <Alliance />
            </main>
        );
    }
}

export default Business;
