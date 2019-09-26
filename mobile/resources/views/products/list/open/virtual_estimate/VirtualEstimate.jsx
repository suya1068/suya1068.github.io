import "./virtual_estimate.scss";
import React, { Component, PropTypes } from "react";
// import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";
import { VIRTUAL_ESTIMATE_DATA, CATEGORY_KEYS } from "./virtual_estimate.const";
import cookie from "forsnap-cookie";
import utils from "forsnap-utils";
import classNames from "classnames";
// virtual estimate component
import VirtualProduct from "./list/VirtualProduct";
import VirtualFood from "./list/VirtualFood";
import VirtualInterior from "./list/VirtualInterior";
import VirtualEvent from "./list/VirtualEvent";
import VirtualFashion from "./list/VirtualFashion";
import VirtualProfileBiz from "./list/VirtualProfileBiz";
import VirtualBeauty from "./list/VirtualBeauty";
import VirtualVideoBiz from "./list/VirtualVideoBiz";
import * as EstimateSession from "../extraInfoSession";

export default class VirtualEstimate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: props.category,
            data: VIRTUAL_ESTIMATE_DATA[props.category],
            detailPage: props.detailPage,
            receiveEstimate: props.receiveEstimate,
            isMobile: utils.agent.isMobile(),
            resData: null
        };
        this.onConsultSearchArtist = this.onConsultSearchArtist.bind(this);
        this.onConsultEstimate = this.onConsultEstimate.bind(this);
        this.onConsultForsnap = this.onConsultForsnap.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.onSendKaKaoEstimate = this.onSendKaKaoEstimate.bind(this);
        // interaction
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
     * 상담신청하기(작가에게 상담신청하기로 변경)
     */
    onConsultSearchArtist() {
        const { onConsultSearchArtist } = this.props;
        if (typeof onConsultSearchArtist === "function") {
            onConsultSearchArtist();
        }
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
     * ga이벤트
     * @param action
     */
    gaEvent(action) {
        const { gaEvent, renewDetail } = this.props;
        let _action = action;
        if (renewDetail) {
            _action = `유료_${action}`;
        }

        if (typeof gaEvent === "function") {
            gaEvent(_action);
        }
    }

    onSendKaKaoEstimate() {
        if (typeof this.props.onSendKaKaoEstimate === "function") {
            this.props.onSendKaKaoEstimate();
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
        const { detailPage, receiveEstimate, renewDetail, mainTest } = this.props;
        const { resData } = this.state;

        const virtualData = {
            data: VIRTUAL_ESTIMATE_DATA[category],
            estimateFlags: {
                detailPage,
                mainTest,
                renewDetail
            },
            category,
            receiveEstimate,
            gaEvent: this.gaEvent,
            onConsultSearchArtist: this.onConsultSearchArtist,
            onConsultForsnap: this.onConsultForsnap,
            onConsultEstimate: this.onConsultEstimate,
            onSendKaKaoEstimate: this.onSendKaKaoEstimate,
            receiveTotalPrice: this.receiveTotalPrice
        };

        if (resData) {
            virtualData.resData = resData;
        }

        switch (category) {
            case CATEGORY_KEYS.PRODUCT: return <VirtualProduct {...virtualData} />;
            case CATEGORY_KEYS.FOOD: return <VirtualFood {...virtualData} />;
            case CATEGORY_KEYS.INTERIOR: return <VirtualInterior {...virtualData} />;
            case CATEGORY_KEYS.EVENT: return <VirtualEvent {...virtualData} />;
            case CATEGORY_KEYS.FASHION: return <VirtualFashion {...virtualData} />;
            case CATEGORY_KEYS.PROFILE_BIZ: return <VirtualProfileBiz {...virtualData} />;
            case CATEGORY_KEYS.BEAUTY: return <VirtualBeauty {...virtualData} />;
            case CATEGORY_KEYS.VIDEO_BIZ: return <VirtualVideoBiz {...virtualData} />;
            default: return null;
        }
    }

    render() {
        const { detailPage, renewDetail, category, mainTest } = this.props;
        const { isMobile } = this.state;
        let title = "포스냅 견적가로 추천작가에게\n문의를 남겨보세요.";
        if (renewDetail && !isMobile) {
            title = "촬영정보를 선택해주세요.";
        } else if (renewDetail && isMobile) {
            title = "견적 금액을 확인해보세요!";
        }
        return (
            <div className="virtual-mo" style={{ backgroundColor: (!isMobile || mainTest) && "transparent" }}>
                <section
                    className={classNames(
                        "product_list__virtual-estimate virtual-estimate section__padding",
                        { "detail-page__modal": detailPage },
                        { "detail_renew-page": renewDetail && !isMobile }
                    )}
                    style={{
                        paddingTop: ((renewDetail && isMobile) || mainTest) && 0,
                        margin: renewDetail && isMobile && "0 15px",
                        paddingBottom: renewDetail && isMobile && 30
                    }}
                    id="virtual_estimate"
                >
                    {!mainTest &&
                    <div className="product_list__virtual-estimate__title">
                        <h2
                            className={classNames("virtual-estimate__title", { "renew-detail": renewDetail && !isMobile })}
                        >{utils.linebreak(title)}</h2>
                        {detailPage &&
                        <button className="_button _button__close black" onClick={() => this.props.onClose()} />
                        }
                    </div>
                    }
                    {this.renderVirtualEstimate(category)}
                    {!detailPage && !renewDetail && !mainTest &&
                    <div className="virtual-estimate__consult-btn shared">
                        <button
                            className={classNames("consult-btn", "share-btn")}
                            onClick={this.onSendKaKaoEstimate}
                        >
                            <div className="logo-wrapper">
                                <img src={`${__SERVER__.img}/common/icon/kakao_logo_g.png`} alt="kakao-logo" />
                            </div>
                            카카오톡으로 견적공유
                        </button>
                    </div>
                    }
                </section>
            </div>
        );
    }
}

VirtualEstimate.propTypes = {
    //onConsult: PropTypes.func,
    detailPage: PropTypes.bool,
    gaEvent: PropTypes.func,
    onConsultEstimate: PropTypes.func
};

VirtualVideoBiz.defaultProps = {
    detailPage: false,
    receiveEstimate: null
};
