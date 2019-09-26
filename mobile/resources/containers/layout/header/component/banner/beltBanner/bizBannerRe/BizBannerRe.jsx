import "./bizBanner.scss";
import React, { Component } from "react";
import api from "forsnap-api";
import utils from "forsnap-utils";
import { ORD_TYPE, CARD_TYPE, SELECT_TYPE, CATEGORY_MESSAGE } from "./biz_banner.const";
// import CardType from "./type/CardType";
// import OrdType from "./type/OrdType";
import SelectType from "./type/SelectType";
import PopModal from "shared/components/modal/PopModal";
// import SimpleConsult from "shared/components/consulting/renew/SimpleConsult";
import ConsultModal from "mobile/resources/components/modal/consult/ConsultModal";

export default class BizBannerRe extends Component {
    constructor(props) {
        super(props);
        const search = location.search;
        this.state = {
            external: props.external,
            category: props.category,
            search_param: search ? utils.query.parse(search) : {}
        };
        this.onClose = this.onClose.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        this.setTypeData(this.props.category);
    }

    componentDidMount() {
    }

    setTypeData(category) {
        let type_background = `${__SERVER__.img}`;
        const type_padding = SELECT_TYPE.BG_PADDING;
        const type = SELECT_TYPE.TYPE;
        const mascote = SELECT_TYPE.MASCOTE;

        type_background += SELECT_TYPE.BG_IMG;

        this.setState({
            type_background: `url(${type_background}) center center / cover no-repeat`,
            type_padding,
            type,
            banner_data: CATEGORY_MESSAGE[category.toUpperCase()],
            mascote
        });
    }

    gaEvent(eAction, eLabel = "") {
        const { search_param } = this.state;
        const { category } = this.props;
        const is_biz = utils.checkCategoryForEnter(category);

        const eCategory = is_biz ? "M_기업_상세" : "M_개인_상세";

        if (!utils.type.isEmpty(search_param) && search_param.utm_source && search_param.utm_source === "fb_ad") {
            utils.ad.gaEvent(`M_페이스북광고_${is_biz ? "기업" : "개인"}`, search_param.utm_content || "", eAction);
        }
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    /**
     * 배너 창을 닫는다.
     */
    onClose(e) {
        if (typeof this.props.onClose === "function") {
            this.props.onClose();
        }
    }

    onConsult(access_type) {
        const modal_name = "simple__consult";

        // PopModal.createModal(modal_name,
        //     <SimpleConsult
        //         modal_name={modal_name}
        //         access_type={access_type}
        //         device_type="mobile"
        //         onClose={() => PopModal.close(modal_name)}
        //     />, { className: modal_name, modal_close: false });
        PopModal.createModal(modal_name,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({
                        access_type,
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

    renderBannerType() {
        const { type, banner_data, mascote } = this.state;
        const { external } = this.props;

        return <SelectType {...banner_data} mascote={mascote} external={external} onConsult={this.onConsult} onClose={this.onClose} gaEvent={this.gaEvent} />;
    }

    render() {
        const { type_background, type_padding } = this.state;

        return (
            <section className="biz-banner-component-m">
                <h2 className="sr-only">비즈니스 배너</h2>
                <div className="biz-banner-container" style={{ background: type_background, padding: type_padding }}>
                    {this.renderBannerType()}
                </div>
            </section>
        );
    }
}

BizBannerRe.defaultProps = {
    category: "PRODUCT"
};
