import "../scss/products_none_list.scss";
import React, { Component, PropTypes } from "react";
import api from "forsnap-api";
import Icon from "desktop/resources/components/icon/Icon";
import Buttons from "desktop/resources/components/button/Buttons";
import utils from "forsnap-utils";
// import PersonalConsult from "shared/components/consulting/personal/ConsultContainer";
import PopModal from "shared/components/modal/PopModal";
// import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
// import SimpleConsult from "shared/components/consulting/renew/SimpleConsult";
import ConsultModal from "desktop/resources/components/modal/consult/ConsultModal";

const imageName = "list/list_none_img_01.jpg";
const styles = {
    main: {
        background: `url(${__SERVER__.img}/${imageName}) center center / cover no-repeat`
    }
};

const stepData = [
    { no: "01", step: "step1", title: "무료견적 요청서 작성", icon: "document" },
    { no: "02", step: "step2", title: "작가님들의 견적서 접수", icon: "document_check" },
    { no: "03", step: "step3", title: "견적서 선택 및 촬영", icon: "person_check" }
];

/**
 * 사용하지 않은 컴포넌트 date : 19.04.10
 */
export default class ProductsNoneList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.setCommaSplit = this.setCommaSplit.bind(this);
    }

    componentDidMount() {
        //utils.ad.fbqEvent("Search");
    }

    /**
     * 검색 태그를 파싱합니다.
     * @param tags
     * @returns {string}
     */
    setCommaSplit(tags = "") {
        return tags.split(",").reduce((result, tag) => `${result} #${tag}`, "");
    }

    /**
     * 상담신청하기 모달창을 엽니다.
     */
    onConsult() {
        // const modal_name = "personal_consult";
        // const options = {
        //     className: "personal_consult"
        // };
        // const consult_component = <PersonalConsult device_type="pc" access_type="product_list" />;
        // PopModal.createModal(modal_name, consult_component, options);
        // PopModal.show(modal_name);

        const modal_name = "simple__consult";
        // PopModal.createModal(modal_name, <SimpleConsult modal_name={modal_name} access_type="product_list" device_type="pc" onClose={() => PopModal.close(modal_name)} />, { className: modal_name, modal_close: false });
        PopModal.createModal(modal_name,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({
                        access_type: "product_list",
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

        // const modal_name = "simple__consult";
        //
        // Modal.show({
        //     type: MODAL_TYPE.CUSTOM,
        //     content: <SimpleConsult modal_name={modal_name} access_type="product_list" device_type="pc" onClose={() => Modal.close(modal_name)} />,
        //     name: modal_name
        // });
    }

    render() {
        return (
            <main id="site-main" style={styles.main}>
                <div className="vbox bg-overlay">
                    <div className="box vertical-middle none-container">
                        <div className="h1 tag-title">
                            <strong>{this.setCommaSplit(this.props.params.tag)}</strong>
                        </div>
                        <div className="lead">
                            검색결과가 없어요. 언제 어디서나 쉽고 빠른 무료 견적을 요청해보세요.
                        </div>
                        <div className="step-container container">
                            <div className="middle-line" />
                            {stepData.map((obj, idx) => {
                                return (
                                    <div className="step" key={`product_none-list__step${obj.no}`}>
                                        <div className="step-no">{obj.step}</div>
                                        <Icon name={obj.icon} />
                                        <p className="title">{obj.title}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <Buttons
                            buttonStyle={{ shape: "round", size: "large", width: "w276", theme: "fill-emphasis" }}
                            inline={{ onClick: this.onConsult }}
                        >무료견적 요청하기</Buttons>
                    </div>
                    <p className="auth-sign">Photographer Highlight Daegun</p>
                </div>
            </main>
        );
    }
}

ProductsNoneList.propTypes = {
    params: PropTypes.shape({
        tag: PropTypes.string.isRequired,
        sort: PropTypes.string.isRequired,
        limit: PropTypes.number.isRequired,
        offset: PropTypes.number.isRequired
    }).isRequired
};
