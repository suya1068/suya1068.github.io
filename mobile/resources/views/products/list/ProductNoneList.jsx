import "./productNoneList.scss";
import React, { Component, PropTypes } from "react";

import api from "forsnap-api";
import utils from "forsnap-utils";
import cookie from "forsnap-cookie";

import PopModal from "shared/components/modal/PopModal";
// import SimpleConsult from "shared/components/consulting/renew/SimpleConsult";
import ConsultModal from "mobile/resources/components/modal/consult/ConsultModal";

import AppDispatcher from "mobile/resources/AppDispatcher";
import * as CONST from "mobile/resources/stores/constants";

const imageName = "/list/list_none_img_01.jpg";
const styles = {
    main: {
        background: `url(${__SERVER__.img}${imageName}) center center / cover no-repeat`
    }
};

const stepData = [
    { no: "01", step: "step1", title: "무료견적 요청서 작성", icon: "document" },
    { no: "02", step: "step2", title: "작가님들의 견적서 접수", icon: "document_check" },
    { no: "03", step: "step3", title: "견적서 선택 및 촬영", icon: "person_check" }
];

export default class ProductNoneList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.setCommaSplit = this.setCommaSplit.bind(this);
        // this.setReferrerData = this.setReferrerData.bind(this);
        this.setProductData = this.setProductData.bind(this);
        this.onCheckCategory = this.onCheckCategory.bind(this);
        this.onConsult = this.onConsult.bind(this);
    }

    componentWillMount() {
        // this.setReferrerData();
        this.setProductData();
        this.onCheckCategory();
    }

    componentDidMount() {
        //utils.ad.fbqEvent("Search");

        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: this.setCommaSplit(this.props.params.tag) });
        }, 0);
    }
    /**
     * 유입경로 분석을 위한 데이터를 저장한다.
     */
    // setReferrerData() {
    //     const referrer = document.referrer;
    //     if (referrer) {
    //         const data = utils.query.combineConsultToReferrer(referrer);
    //         const params = utils.query.setConsultParams({ ...data });
    //         this.setState({ ...params });
    //     }
    // }

    onCheckCategory() {
        const search = location.search;
        if (search) {
            const params = utils.query.parse(search);
            if (params.category) {
                this.state.category = params.category;
            }
        }
    }
    /**
     * 상품정보를 저장한다.
     */
    setProductData() {
        const responseData = document.getElementById("product-data");
        let data = {};
        if (responseData) {
            const getAtt = responseData.getAttribute("content");
            data = JSON.parse(getAtt).data;
            this.state.productData = data;
        }
    }
    onConsult() {
        PopModal.progress();

        const { productData } = this.state;
        // const category = (productData && productData.category) || this.state.category;
        const product_no = productData && productData.product_no;
        // 상담신청페이지 시작
        // const modal_name = "personal_consult";
        const consult_data = {};

        // if (referer) {
        //     consult_data.referer = referer;
        // }
        // if (referer_keyword) {
        //     consult_data.referer_keyword = referer_keyword;
        // }
        // if (product_no) {
        //     consult_data.product_no = product_no;
        // }

        // if (category) {
        //     consult_data.category = category;
        // }
        //
        // PopModal.createModal(modal_name, <PersonalConsult {...consult_data} device_type="mobile" access_type="product_list" />, { className: modal_name });
        // PopModal.show(modal_name);

        // const modal_name = "simple__consult";
        //
        // Modal.show({
        //     type: MODAL_TYPE.CUSTOM,
        //     content: <SimpleConsult modal_name={modal_name} {...consult_data} access_type="product_list" device_type="mobile" onClose={() => Modal.close(modal_name)} />,
        //     name: modal_name
        // });
        const modal_name = "simple__consult";
        // PopModal.createModal(modal_name,
        //     <SimpleConsult modal_name={modal_name} {...consult_data} access_type="PRODUCT_LIST" device_type="mobile" onClose={() => PopModal.close(modal_name)} />,
        //     { className: modal_name, modal_close: false });
        PopModal.createModal(modal_name,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({
                        access_type: "PRODUCT_LIST",
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
    }

    // guest_gaEvent() {
    //     const eCategory = "게스트 촬영요청서작성";
    //     const eAction = "";
    //     const eLabel = "";
    //     utils.ad.gaEvent(eCategory, eAction, eLabel);
    // }

    setCommaSplit(tags = "") {
        return tags.split(",").reduce((result, tag) => `${result} #${tag}`, "");
    }

    render() {
        const enter = cookie.getCookies(CONST.USER.ENTER);
        const enter_session = sessionStorage.getItem(CONST.USER.ENTER);

        return (
            <main className="m-product-none-list" style={styles.main} >
                <div className="bg-overlay">
                    <div className="tag-title">
                        <strong>{this.setCommaSplit(this.props.params.tag)}</strong>
                    </div>
                    <div className="lead">
                        검색결과가 없어요. 언제 어디서나 쉽고 빠른 무료 견적을 요청해보세요.
                    </div>
                    <div className="step-container">
                        {stepData.map((obj, idx) => {
                            return (
                                <div className="step" key={`product_none-list__step${obj.no}`}>
                                    <div className="step-no">{obj.step}</div>
                                    <i className={`m-icon m-icon-${obj.icon}`} />
                                    <p className="title">{obj.title}</p>
                                </div>
                            );
                        })}
                        {enter && enter_session ? null
                            : <div className="step" style={{ margin: "auto 0" }}>
                                <button
                                    className="button button__theme__yellow redirect-buttons"
                                    onClick={this.onConsult}
                                >무료견적 요청하기
                                </button>
                            </div>
                        }
                    </div>
                    <p className="auth-sign">Photograher Highlight Daegun</p>
                </div>
            </main>
        );
    }
}

// return (
//  <main className="m-product-none-list" id="site-main" style={styles.main}>
//  <div className="vbox bg-overlay">
//  <div className="box vertical-middle">
//  <div className="h1 tag-title">
//  <strong>{this.setCommaSplit(this.props.params.tag)}</strong>
//  </div>
//  <div className="lead">
//  검색결과가 없어요. 언제 어디서나 쉽고 빠른 무료 견적을 요청해보세요.
//  </div>
//  <div className="step-container container">
//  <div className="middle-line" />
//  {stepData.map((obj, idx) => {
//      return (
//          <div className="step" key={`product_none-list__step${obj.no}`}>
//              <div className="step-no">{obj.step}</div>
//              <i className={`m-icon m-icon_${obj.icon}`} />
//              <p className="title">{obj.title}</p>
//          </div>
//      );
//  })}
//  </div>
//  <button
//  className="button button__theme__muted"
//  onClick={location.href = "/users/quotation"}
//  >무료견적 요청하기</button>
//  </div>
//  </div>
//  </main>
//  );

ProductNoneList.propTypes = {
    params: PropTypes.shape({
        tag: PropTypes.string.isRequired,
        sort: PropTypes.string.isRequired,
        limit: PropTypes.number.isRequired,
        offset: PropTypes.number.isRequired
    }).isRequired
};
