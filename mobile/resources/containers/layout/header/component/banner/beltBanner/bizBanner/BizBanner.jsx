import "./bizBanner.scss";
import React, { Component } from "react";
import { BIZ_DATA } from "shared/constant/banner.const";
import api from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";
// import Img from "shared/components/image/Img";
import classNames from "classnames";
import PopModal from "shared/components/modal/PopModal";
// import PersonalConsult from "shared/components/consulting/personal/ConsultContainer";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";
// import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
// import SimpleConsult from "shared/components/consulting/renew/SimpleConsult";
import ConsultModal from "mobile/resources/components/modal/consult/ConsultModal";

export default class BizBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: auth.getUser(),
            external: props.external,
            multi: props.multi || false
        };
        this.onClose = this.onClose.bind(this);
        this.onMovePage = this.onMovePage.bind(this);
        this.onClose = this.onClose.bind(this);
        this.setRenderData = this.setRenderData.bind(this);
    }

    componentWillMount() {
        this.setProductData();
    }

    componentDidMount() {
        // const { external } = this.props;
        // if (external) {
        //     this.gaEvent_inflow_display();
        // } else {
        //     this.gaEvent_display();
        // }
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
     */
    gaEvent_inflow_click(label, data) {
        const eCategory = "M_기업_상세";
        const eAction = "N쇼핑배너";
        const eLabel = label;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    gaEvent_click(label, data) {
        utils.ad.gaEvent("M_기업_상세", "상단배너", label);
    }

    /**
     * 버튼 클릭 시 flag값에 따라 동작한다.
     * @param label
     * @param category
     */
    onMovePage(label, category) {
        const { productData } = this.state;
        const { external } = this.props;
        if (external) {
            this.gaEvent_inflow_click(label, productData);
        } else {
            this.gaEvent_click(label, productData);
        }
        const product_no = productData && productData.product_no;
        const access_type = external ? CONSULT_ACCESS_TYPE.INFLOW.CODE : CONSULT_ACCESS_TYPE.PRODUCT_DETAIL.CODE;
        // 상담신청페이지 시작
        // const modal_name = "personal_consult";

        const consult_data = {};

        if (product_no) {
            consult_data.product_no = product_no;
        }

        // const consult_component = (
        //     <PersonalConsult
        //         category={category && category !== "ETC" ? category : ""}
        //         product_no={product_no}
        //         device_type="mobile"
        //         access_type={access_type}
        //     />
        // );
        //
        // PopModal.createModal(modal_name, consult_component, { className: modal_name });
        // PopModal.show(modal_name);

        const modal_name = "simple__consult";
        // PopModal.createModal(modal_name,
        //     <SimpleConsult modal_name={modal_name} product_no={product_no} access_type={access_type} device_type="mobile" onClose={() => PopModal.close(modal_name)} />,
        //     { className: modal_name, modal_close: false });
        PopModal.createModal(modal_name,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({
                        access_type,
                        product_no,
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

        // const modal_name = "simple__consult";
        //
        // Modal.show({
        //     type: MODAL_TYPE.CUSTOM,
        //     content: <SimpleConsult
        //         modal_name={modal_name}
        //         category={category && category !== "ETC" ? category : ""}
        //         product_no={product_no}
        //         access_type={access_type}
        //         device_type="mobile"
        //         onClose={() => Modal.close(modal_name)}
        //     />,
        //     name: modal_name
        // });
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
     * 렌더할 배너의 데이터를 설정한다.
     * @param flag
     */
    setRenderData(flag) {
        const { user } = this.state;
        return this.multiBannerData(user);
    }


    /**
     * 멀티배너
     * @param user
     * @returns {XML}
     */
    multiBannerData(user) {
        return (
            <div className="biz-banner-wideButtons">
                {BIZ_DATA.MAIN.map((obj, idx) => {
                    return (
                        <div className="biz-banner-wideButton" key={`biz-banner-wideButton__${idx}`}>
                            <div className="biz-banner-wideButton__bgImage">
                                <img src={`${__SERVER__.img}${obj.IMG_BG_M}`} role="presentation" alt={obj.TITLE} />
                                {/*<Img image={{ src: obj.IMG_URL, type: "image" }} isScreenChange={false} />*/}
                            </div>
                            <div className="biz-banner-wideButton__bgWrap">
                                <div>
                                    <h5 className="biz-banner-wideButton-title">{obj.TITLE}촬영</h5>
                                    <p className="biz-banner-wideButton-description">{obj.DESCRIBE}</p>
                                    <button
                                        onClick={() => this.onMovePage(obj.TITLE, obj.CATEGORY)}
                                        className="p-button p-button__round"
                                        style={{ backgroundColor: obj.BUTTON_BG_COLOR }}
                                    >{obj.BUTTON_TITLE}</button>
                                    <p className="nick_name">{`by ${obj.ARTIST}`}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {
        const { multi } = this.props;
        const img_bg = multi ? BIZ_DATA.OLD_IMG_BG_M : BIZ_DATA.IMG_BG_M;
        return (
            <div className="biz-banner-component">
                <h2 className="sr-only">비즈니스 배너</h2>
                <div className={classNames("biz-banner", multi ? "multi" : "single")}>
                    <div className="biz-banner-bgImage">
                        <div className="biz-banner-bgImage-bg">
                            <img src={`${__SERVER__.img}${img_bg}`} role="presentation" alt={BIZ_DATA.TITLE_01} />
                        </div>
                        {/*<Img image={{ src: BANNER_DATA.BACKGROUND_IMG, type: "image" }} isScreenChange={false} />*/}
                        <div className="biz-banner-bgWrap">
                            <div className="flex-box">
                                <div className="biz-banner-bgWrap-heading">
                                    <h4 className="biz-banner-title">
                                        {BIZ_DATA.TITLE_01}<br />{BIZ_DATA.TITLE_02}
                                    </h4>
                                </div>
                                {this.setRenderData(multi)}
                                <p className="nick_name">{`by ${BIZ_DATA.ARTIST}`}</p>
                            </div>
                            <div className="close-button" onClick={this.onClose}>
                                <img src={`${__SERVER__.img}${BIZ_DATA.CLOSE_BUTTON}`} role="presentation" alt={BIZ_DATA.TITLE_01} />
                                {/*<Img image={{ src: BANNER_DATA.CLOSE_BUTTON, type: "image" }} isScreenChange={false} />*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
