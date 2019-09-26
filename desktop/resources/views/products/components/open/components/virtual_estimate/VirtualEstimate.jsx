import "./virtual_estimate.scss";
import React, { Component, PropTypes } from "react";
import { VIRTUAL_ESTIMATE_DATA, CATEGORY_KEYS } from "./virtual_estimate.const";
import cookie from "forsnap-cookie";
import classNames from "classnames";
import Icon from "desktop/resources/components/icon/Icon";
// virtual estimate component
import VirtualProduct from "./list/VirtualProduct";
import VirtualFood from "./list/VirtualFood";
import VirtualInterior from "./list/VirtualInterior";
import VirtualEvent from "./list/VirtualEvent";
import VirtualFashion from "./list/VirtualFashion";
import VirtualProfileBiz from "./list/VirtualProfileBiz";
import VirtualBeauty from "./list/VirtualBeauty";
import VirtualVideoBiz from "./list/VirtualVideoBiz";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import * as EstimateSession from "../../components/extraInfoSession";
import utils from "forsnap-utils";

export default class VirtualEstimate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: props.category,
            data: VIRTUAL_ESTIMATE_DATA[props.category],
            detailPage: props.detailPage,
            receiveEstimate: props.receiveEstimate,
            mainTest: props.mainTest || false,
            resData: null
        };
        this.onConsultSearchArtist = this.onConsultSearchArtist.bind(this);
        this.onConsultEstimate = this.onConsultEstimate.bind(this);
        this.onConsultForsnap = this.onConsultForsnap.bind(this);
        this.onChangeShotKind = this.onChangeShotKind.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.onReceiveEmail = this.onReceiveEmail.bind(this);
        this.receiveTotalPrice = this.receiveTotalPrice.bind(this);
        this.getSessionEstimateData = this.getSessionEstimateData.bind(this);
    }

    componentWillMount() {
        this.getSessionEstimateData();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.getSessionEstimateData();
    }

    componentWillUnmount() {
        if (typeof this.props.init === "function") {
            this.props.init(true);
        }
    }

    getSessionEstimateData() {
        if (sessionStorage) {
            //const currentCategory = this.props.category;
            const data = EstimateSession.getSessionEstimateData(EstimateSession.EXTRA_INFO_KEY);

            if (data) {
                this.setState({ resData: data });
            }
        }
    }

    /**
     * 견적산출
     * @param form
     * @param totalPrice
     * @param hasAlphas
     * @returns {null}
     */
    onConsultEstimate(form, totalPrice, hasAlphas) {
        const { onConsultEstimate, category } = this.props;
        if (typeof onConsultEstimate === "function") {
            onConsultEstimate({
                form,
                agent: cookie.getCookies("FORSNAP_UUID"),
                category,
                totalPrice,
                hasAlphas
            });
        }

        return null;
    }

    /**
     * 포스냅에게 상담신청하기
     * @param consult_code
     */
    onConsultForsnap(consult_code) {
        const { onConsultForsnap } = this.props;
        if (typeof onConsultForsnap === "function") {
            onConsultForsnap(consult_code);
        }
    }

    /**
     * 상담신청하기(작가에게 상담신청하기로 변경)
     */
    onConsultSearchArtist() {
        const { onConsultSearchArtist } = this.props;
        if (typeof onConsultSearchArtist === "function") {
            onConsultSearchArtist();
        }
    }

    onChangeShotKind() {
        if (typeof this.props.onChangeShotKind === "function") {
            this.props.onChangeShotKind();
        }
    }

    /**
     * ga이벤트
     * @param action
     */
    gaEvent(action) {
        const { gaEvent } = this.props;

        if (typeof gaEvent === "function") {
            gaEvent(action);
        }
    }

    receiveTotalPrice(price) {
        const { receiveTotalPrice } = this.props;

        if (typeof receiveTotalPrice === "function") {
            receiveTotalPrice(price);
        }
    }

    /**
     * 카테고리에 따라 렌더링 컴포넌트를 변경한다.
     */
    renderVirtualEstimate(category) {
        const { resData } = this.state;
        const { detailPage, mainTest, receiveEstimate } = this.props;
        const prop = {
            data: VIRTUAL_ESTIMATE_DATA[category],
            estimateFlags: {
                detailPage,
                mainTest
            },
            category,
            receiveEstimate,
            gaEvent: this.gaEvent,
            onConsultSearchArtist: this.onConsultSearchArtist,
            onConsultForsnap: this.onConsultForsnap,
            onConsultEstimate: this.onConsultEstimate,
            ////
            onChangeShotKind: this.onChangeShotKind,
            receiveTotalPrice: this.receiveTotalPrice
        };

        if (!utils.type.isEmpty(resData)) {
            prop.resData = resData;
        }

        switch (category) {
            case CATEGORY_KEYS.PRODUCT:
                return <VirtualProduct {...prop} />;
            case CATEGORY_KEYS.FOOD:
                return <VirtualFood {...prop} />;
            case CATEGORY_KEYS.INTERIOR:
                return <VirtualInterior {...prop} />;
            case CATEGORY_KEYS.EVENT:
                return <VirtualEvent {...prop} />;
            case CATEGORY_KEYS.FASHION:
                return <VirtualFashion {...prop} />;
            case CATEGORY_KEYS.PROFILE_BIZ:
                return <VirtualProfileBiz {...prop} />;
            case CATEGORY_KEYS.BEAUTY:
                return <VirtualBeauty {...prop} />;
            case CATEGORY_KEYS.VIDEO_BIZ:
                return <VirtualVideoBiz {...prop} />;
            default: return null;
        }
    }

    /**
     * 고객에게 이메일로 견적발송 이벤트
     */
    onReceiveEmail() {
        if (typeof this.props.onReceiveEmail === "function") {
            this.props.onReceiveEmail();
        }
    }

    render() {
        const { detailPage, mainTest, category } = this.props;
        // const {  } = this.state;
        return (
            <section className={classNames("product_list__virtual-estimate", "product__dist", "virtual-estimate", { "detail-page__modal": detailPage })}>
                <div className={classNames({ "container": !mainTest })} style={{ padding: mainTest && "30px 60px 0" }}>
                    <div className="product_list__virtual-estimate__title">
                        <h2 className="virtual-estimate__title">
                            {/*촬영 정보를 선택하면 견적을 바로 확인할 수 있어요.*/}
                            {!mainTest && "견적을 바로 계산해보세요."}
                        </h2>
                        {detailPage &&
                        <div className="virtual-estimate__close-btn" onClick={this.props.onClose}>
                            <Icon name="big_black_close" />
                        </div>
                        }
                    </div>
                    {this.renderVirtualEstimate(category)}
                    {!detailPage && !mainTest &&
                        <div className="send-email-btn">
                            <button className="_button" onClick={this.onReceiveEmail}>
                                이메일로 견적 저장
                                <Icon name="arrow_r_off" />
                            </button>
                        </div>
                    }
                </div>
            </section>
        );
    }
}

VirtualEstimate.propTypes = {
    gaEvent: PropTypes.func,
    onConsultEstimate: PropTypes.func
};

VirtualEstimate.defaultProps = {
    receiveEstimate: null
};
