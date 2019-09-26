import "./bizBanner.scss";
import React, { Component } from "react";

import api from "forsnap-api";

import Img from "shared/components/image/Img";
import { BIZ_DATA } from "shared/constant/banner.const";
// import ApplyConsulting from "shared/components/consulting/register/ApplyConsulting";
// import PersonalConsult from "shared/components/consulting/personal/ConsultContainer";
import auth from "forsnap-authentication";
import PopModal from "shared/components/modal/PopModal";
import utils from "forsnap-utils";
import classNames from "classnames";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";
// import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
// import SimpleConsult from "shared/components/consulting/renew/SimpleConsult";
import ConsultModal from "desktop/resources/components/modal/consult/ConsultModal";

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
        this.gaEvent_display = this.gaEvent_display.bind(this);
        this.gaEvent_inflow_display = this.gaEvent_inflow_display.bind(this);
    }

    componentWillMount() {
        this.setProductData();
    }

    componentDidMount() {
        const { external } = this.props;
        if (external) {
            this.gaEvent_inflow_display();
        } else {
            this.gaEvent_display();
        }
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
     * N쇼핑 유입 노출 시 gaEvent
     */
    gaEvent_inflow_display() {
        const { productData } = this.state;
        const eCategory = "N쇼핑배너";
        const eAction = "기업노출 | 배너";
        const eLabel = `${productData.category_name || ""} - ${productData.product_no}`;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    /**
     * N쇼핑 배너 버튼 클릭 시 gaEvent
     * @param label
     */
    gaEvent_inflow_click(label, data) {
        const eCategory = "N쇼핑배너";
        const eAction = `기업클릭 | ${label}`;
        const eLabel = `${data.category_name || ""} - ${data.product_no}`;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    gaEvent_display() {
        const { productData } = this.state;
        utils.ad.gaEvent("상품상세", "상단배너 | 노출", productData.product_no);
    }

    gaEvent_click(label, data) {
        utils.ad.gaEvent("상품상세", `상단배너 | 클릭 - ${label}`, data.product_no);
    }

    /**
     * 상담신청 모달창을 생성한다.
     */
    onConsult(category) {
        const { external } = this.props;
        const { productData } = this.state;
        const product_no = productData && productData.product_no;
        // const modal_name = "personal_consult";
        const access_type = external ? CONSULT_ACCESS_TYPE.INFLOW.CODE : CONSULT_ACCESS_TYPE.PRODUCT_DETAIL.CODE;

        const modal_name = "simple__consult";
        // PopModal.createModal(modal_name,
        //     <SimpleConsult modal_name={modal_name} product_no={product_no} access_type={access_type} device_type="pc" onClose={() => PopModal.close(modal_name)} />,
        //     { className: modal_name, modal_close: false });
        // PopModal.show(modal_name);

        // const modal_name = "simple__consult";
        // const consult_data = {};
        //
        // Modal.show({
        //     type: MODAL_TYPE.CUSTOM,
        //     content: <SimpleConsult modal_name={modal_name} product_no={product_no} category={category && category !== "ETC" ? category : ""} access_type={access_type} device_type="pc" onClose={() => Modal.close(modal_name)} />,
        //     name: modal_name
        // });

        // const consult_component = (
        //     <PersonalConsult
        //         category={category && category !== "ETC" ? category : ""}
        //         product_no={product_no}
        //         device_type="pc"
        //         access_type={access_type}
        //     />
        // );
        //
        // PopModal.createModal(modal_name, consult_component, { className: modal_name });
        // PopModal.show(modal_name);

        PopModal.createModal(
            modal_name,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({
                        access_type,
                        device_type: "pc",
                        page_type: "biz",
                        product_no,
                        category: category && category !== "ETC" ? category : ""
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
     * 배너 창을 닫는다.
     */
    onClose(e) {
        if (typeof this.props.onClose === "function") {
            this.props.onClose();
        }
    }

    /**
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

        this.onConsult(category);
    }

    /**
     * 렌더할 배너의 데이터를 설정한다.
     * @param flag
     */
    setRenderData(flag) {
        const { user } = this.state;
        // let content = "";
        // if (flag) {
        //     content = this.multiBannerData(user);
        // } else {
        //     content = this.singleBannerData(user);
        // }
        return this.multiBannerData(user);
    }

    // /**
    //  * 띠 배너
    //  * @param data
    //  * @param user
    //  * @returns {XML}
    //  */
    // singleBannerData(user) {
    //     const { productData } = this.state;
    //     const category = productData.category;
    //     const renderData = BIZ_DATA.PRODUCT.filter(obj => {
    //         return obj.CATEGORY === category;
    //     })[0];
    //
    //     return (
    //         <div className="biz-banner-singleButton">
    //             <div className="biz-banner-singleButton__image-side">
    //                 <Img image={{ src: renderData.IMG_BG, type: "image" }} />
    //             </div>
    //             <div className="biz-banner-singleButton__image-side-wrapper">
    //                 <div className="left-side">
    //                     <p className="title">{renderData.TITLE}</p>
    //                     <p className="describe">{utils.linebreak(renderData.DESCRIBE)}</p>
    //                 </div>
    //                 <div className="right-side">
    //                     <buttons
    //                         onClick={() => this.onMovePage(renderData.LABEL, category)}
    //                         style={{ backgroundColor: renderData.BUTTON_BG_COLOR }}
    //                         className="p-button p-button__round biz-button"
    //                     >{renderData.BUTTON_TITLE}</buttons>
    //                 </div>
    //                 <p className="nick_name">{`by ${renderData.ARTIST}`}</p>
    //             </div>
    //         </div>
    //     );
    // }

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
                                <img src={`${__SERVER__.img}/${obj.IMG_BG_P}`} role="presentation" alt={obj.TITLE} />
                                {/*<Img image={{ src: obj.IMG_BG_P, type: "image" }} />*/}
                            </div>
                            <div className="biz-banner-wideButton__bgWrap">
                                <div>
                                    <h5 className="biz-banner-wideButton-title">{obj.TITLE}촬영</h5>
                                    <p className="biz-banner-wideButton-description">{obj.DESCRIBE}</p>
                                    <button
                                        onClick={() => this.onMovePage(obj.LABEL, obj.CATEGORY)}
                                        className="p-button p-button__round p-button__block biz-button"
                                        style={{ backgroundColor: obj.BUTTON_BG_COLOR }}
                                    >{obj.BUTTON_TITLE}</button>
                                </div>
                                <p className="nick_name">{`by ${obj.ARTIST}`}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {
        const { multi } = this.props;
        const bg_img = multi ? BIZ_DATA.OLD_IMG_BG_P : BIZ_DATA.IMG_BG_P;
        return (
            <section className="biz-banner-component">
                <h2 className="sr-only">비즈니스 배너</h2>
                <div className={classNames("biz-banner", multi ? "multi" : "single")}>
                    <div className="biz-banner-bgImage">
                        {/*<img src={`${__SERVER__.img}/${bg_img}`} role="presentation" alt={BIZ_DATA.TITLE_01} />*/}
                        <Img image={{ src: bg_img, type: "image" }} isCrop isImageCrop />
                    </div>
                    <div className="biz-banner-bgWrap">
                        <div className="flex-box">
                            <h4 className="biz-banner-title">
                                {`${BIZ_DATA.TITLE_01} ${BIZ_DATA.TITLE_02}`}
                            </h4>
                            {this.setRenderData(multi)}
                            <div className="close-button" onClick={this.onClose}>
                                <Img image={{ src: BIZ_DATA.CLOSE_BUTTON, type: "image" }} />
                            </div>
                            <p className="nick_name">{`by ${BIZ_DATA.ARTIST}`}</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
