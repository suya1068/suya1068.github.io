import "./applyConsulting.scss";
import React, { Component, PropTypes } from "react";
import API from "forsnap-api";
import PopModal from "shared/components/modal/PopModal";
import auth from "forsnap-authentication";
import classNames from "classnames";
import ConsultingAgree from "../components/agree/ConsultingAgree";
import ConsultingUserInfo from "../components/userInfo/ConsultingUserInfo";
import MainConsult from "../main/MainConsult";
import cookie from "forsnap-cookie";
import utils from "forsnap-utils";

export default class Consulting extends Component {
    constructor(props) {
        super(props);

        this.state = {
            is_login: !!auth.getUser(),
            is_close: false,
            product_no: props.product_no || "",
            referer: props.referer || {},
            referer_keyword: props.referer_keyword || {},
            category: props.category,
            is_enter: cookie.getCookies("ENTER") && sessionStorage.getItem("ENTER")
        };

        this.onClose = this.onClose.bind(this);
        this.onAdviceOrders = this.onAdviceOrders.bind(this);
        this.onAdviceOrdersPC = this.onAdviceOrdersPC.bind(this);
        this.renderInfo = this.renderInfo.bind(this);
        this.gaEvent_bizMain = this.gaEvent_bizMain.bind(this);
    }

    /**
     * 비즈메인 하단상담신청 gaEvent
     */
    gaEvent_bizMain() {
        const eCategory = "기업메인";
        const eAction = "기업";
        const eLabel = "하단상담신청";
        utils.ad.gaEvent(eCategory, eAction, eLabel);
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(eLabel);
        }
    }

    /**
     * 상담신청 등록 api
     * @param data
     * @returns {*}
     */
    setApiAdviceOrders(data) {
        return API.orders.insertAdviceOrders(data);
    }


    onAdviceOrdersPC() {
        const valid = this.validate();
        const {
            product_no,
            referer,
            referer_keyword,
            name,
            accessType,
            deviceType
        } = this.props;

        if (valid) {
            PopModal.progress();
            const info_data = { ...this.UserInfo.getFormData() };

            // const enter = cookie.getCookies("ENTER");
            // const enter_session = sessionStorage.getItem("ENTER");
            // let page_type = "biz";
            // if (enter && enter_session) {
            //     page_type = "personal";
            // }

            info_data.page_type = "biz";
            info_data.access_type = accessType;
            info_data.device_type = deviceType;

            if (product_no) {
                info_data.product_no = product_no;
            }

            if (referer) {
                info_data.referer = referer;
            }

            if (referer_keyword) {
                info_data.referer_keyword = referer_keyword;
            }
            this.onFetchAdviceOrder(info_data);
        }
    }

    /**
     * 상담신청 등록
     * @param name
     * @param device_type
     * @param access_type
     */
    onAdviceOrders(name, device_type, access_type) {
        const valid = this.validate();
        const { product_no, referer, referer_keyword } = this.props;

        if (!valid) {
            PopModal.progress();
            const info_data = this.UserInfo.getApplyInfo();
            const user_email = this.UserInfo.getUserEmail();
            const agent = cookie.getCookies("FORSNAP_UUID");

            // const enter = cookie.getCookies("ENTER");
            // const enter_session = sessionStorage.getItem("ENTER");
            // const page_type = "biz";
            // if (enter && enter_session) {
            //     page_type = "personal";
            // }

            info_data.page_type = "biz";
            info_data.access_type = access_type;
            info_data.device_type = device_type;

            if (product_no) {
                info_data.product_no = product_no;
            }

            if (referer) {
                info_data.referer = referer;
            }

            if (referer_keyword) {
                info_data.referer_keyword = referer_keyword;
            }

            if (user_email) {
                info_data.user_email = user_email;
            }

            if (agent) {
                info_data.agent = agent;
            }

            this.onFetchAdviceOrder(info_data);
        } else {
            PopModal.alert(valid);
        }

        // if (is_valid) {
        //     PopModal.progress();
        //     const user_info = this.UserInfo.getApplyInfo();
        //     // const url = this.UserInfo.getUrl();
        //     // const attach_info = this.UserInfo.getAttachFiles();
        //     // const temp_user_id = this.UserInfo.getTempUserId();
        //     // const counsel_type = this.UserInfo.getCounselType();
        //     const user_email = this.UserInfo.getUserEmail();
        //
        //     const enter = cookie.getCookies("ENTER");
        //     const enter_session = sessionStorage.getItem("ENTER");
        //     let page_type = "biz";
        //     if (enter && enter_session) {
        //         page_type = "personal";
        //     }
        //
        //     user_info.device_type = device_type;
        //     user_info.access_type = access_type;
        //     user_info.page_type = page_type;
        //     // user_info.counsel_type = counsel_type;
        //
        //     if (product_no) {
        //         user_info.product_no = product_no;
        //     }
        //
        //     if (referer) {
        //         user_info.referer = referer;
        //     }
        //
        //     if (referer_keyword) {
        //         user_info.referer_keyword = referer_keyword;
        //     }
        //
        //     // if (url) {
        //     //     user_info.url = url;
        //     // }
        //     //
        //     // if (temp_user_id) {
        //     //     user_info.temp_user_id = temp_user_id;
        //     // }
        //
        //     if (user_email) {
        //         user_info.user_email = user_email;
        //     }
        //
        //     // if (Array.isArray(attach_info) && attach_info.length > 0) {
        //     //     user_info.attach_info = JSON.stringify(attach_info);
        //     // }
        //     this.onFetchAdviceOrder(user_info);
        // }
    }

    onFetchAdviceOrder(data) {
        const is_enter = this.state.is_enter;
        const { name, accessType, deviceType } = this.props;

        this.setApiAdviceOrders({ ...data }).then(response => {
            if (response.status === 200) {
                PopModal.closeProgress();
                utils.ad.wcsEvent("4");
                // utils.ad.fbqEvent("InitiateCheckout");
                utils.ad.gtag_report_conversion(location.href);
                utils.ad.gaEvent("기업고객", "상담전환");
                utils.ad.gaEventOrigin("기업고객", "상담전환");
                if (!is_enter && (accessType === "main")) {
                    this.gaEvent_bizMain();
                }
            }
            PopModal.alert("상담신청해 주셔서 감사합니다.\n곧 연락 드리겠습니다.", { callBack: () => this.onClose(name, accessType, deviceType) });
        }).catch(error => {
            PopModal.closeProgress();
            PopModal.alert(error.data);
        });
    }

    // /**
    //  * 네이버 프리미엄 로그 전환설치
    //  * 신청 / 예약
    //  */
    // wcsEvent() {
    //     if (wcs && wcs.cnv && wcs_do) {
    //         const _nasa = {};
    //         _nasa["cnv"] = wcs.cnv("4", "1");
    //         wcs_do(_nasa);
    //     }
    // }

    /**
     * 상담신청 유효성 검사
     * @returns {boolean}
     */
    validate() {
        // const agree_message = this.UserAgree.validate();
        // const userInfo_message = this.UserInfo.validate();
        //
        // let message = "";
        // let flag = false;
        // if (userInfo_message) {
        //     message = userInfo_message;
        // } else if (agree_message) {
        //     message = agree_message;
        // } else {
        //     flag = true;
        // }
        // if (message) {
        //     PopModal.alert(message);
        // }
        //
        // return flag;
        const { renew } = this.props;
        let agree_message;
        if (!renew) {
            agree_message = this.UserAgree.validate();
        }
        const userInfo_message = this.UserInfo.validate();

        let message = "";
        if (userInfo_message) {
            message = userInfo_message;
        } else if (agree_message) {
            message = agree_message;
        }

        return message;
    }

    /**
     * 상담신청 창을 닫는다.
     */
    onClose(name, access_type, device_type) {
        this.UserInfo.initData();
        this.UserAgree.initData();
        // if (device_type !== "mobile" && (access_type === "main" || name)) {
        //     PopModal.close(name);
        //     if (!this.state.is_login && auth.getUser()) {
        //         location.reload();
        //     }
        //
        //     return;
        // }
        // location.href = "/";
    }

    renderInfo(type) {
        const { category, accessType, deviceType } = this.props;
        return type === "pc"
            ? this.renderMainForPC({ category, accessType, deviceType }) : this.renderMainForMobile({ category, accessType, deviceType });
    }


    renderMainForPC() {
        return (
            <MainConsult ref={instance => { this.UserInfo = instance; }} />
        );
    }

    renderMainForMobile({ category, accessType, deviceType }) {
        return (
            <ConsultingUserInfo
                category={category}
                accessType={accessType}
                deviceType={deviceType}
                ref={instance => { this.UserInfo = instance; }}
            />
        );
    }

    render() {
        // const { is_login } = this.state;
        const { name, accessType, deviceType } = this.props;
        const isDesktopMain = accessType === "main" && deviceType === "pc";

        let buttonContent = "";

        if (isDesktopMain) {
            buttonContent = (
                <div
                    onClick={this.onAdviceOrdersPC}
                    className={classNames("button", "button-circle", "button__theme__dm", "consulting-button", "orders")}
                >
                    <h4 className="consulting-buttons__button">신청하기</h4>
                </div>
            );
        } else {
            buttonContent = ([
                accessType !== "main" && deviceType !== "mobile" ?
                    <button
                        onClick={() => this.onClose(name, accessType === "main")}
                        className="button button__rect button__theme__gray consulting-button"
                        key="consulting-button__close"
                    >
                        <h4 className="consulting-buttons__button">닫기</h4>
                    </button> : null,
                <div
                    onClick={() => this.onAdviceOrders(name, deviceType, accessType)}
                    className="button button__rect button__theme__yellow consulting-button orders"
                    key="consulting-button__apply"
                >
                    <h4 className="consulting-buttons__button">신청하기</h4>
                </div>
            ]);
        }

        return (
            <section className="pop-consulting-component">
                <div className="consulting-heading">
                    <h2 className="consulting-heading__title">상담신청하기</h2>
                    <p className="consulting-heading__description description">
                        포스냅 담당자가 세부적으로 체크하여 최적의 작가를 빠르게 안내해드립니다.
                    </p>
                </div>
                <div className="consulting-content">
                    {this.renderInfo(deviceType)}
                </div>
                <ConsultingAgree name={name} ref={instance => { this.UserAgree = instance; }} />
                <article className="consulting-buttons">
                    <h3 className="sr-only">상담신청 버튼</h3>
                    <div className={classNames("consulting-buttons-container", { "dm": isDesktopMain })}>
                        {buttonContent}
                    </div>
                </article>
            </section>
        );
    }
}


Consulting.propTypes = {
    accessType: PropTypes.string,
    deviceType: PropTypes.string,
    name: PropTypes.string
};

Consulting.defaultProps = {
    accessType: "float",
    deviceType: "mobile",
    name: ""
};
