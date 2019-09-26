import "./applyConsulting.scss";
import React, { Component, PropTypes } from "react";
import API from "forsnap-api";
import PopModal from "shared/components/modal/PopModal";
import auth from "forsnap-authentication";
import classNames from "classnames";
import ConsultingAgree from "../components/agree/ConsultingAgree";
import ConsultingUserInfo from "../components/userInfo/ConsultingUserInfo";
import MainConsult from "../main/MainConsult_dev";
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
            is_enter: cookie.getCookies("ENTER") && sessionStorage.getItem("ENTER"),
            renew: props.renew
        };

        this.onClose = this.onClose.bind(this);
        this.onAdviceOrders = this.onAdviceOrders.bind(this);
        this.onAdviceOrdersPC = this.onAdviceOrdersPC.bind(this);
        this.renderInfo = this.renderInfo.bind(this);
    }

    componentWillMount() {
    }

    /**
     * 비즈메인 하단상담신청 gaEvent
     */
    gaEvent_bizMain() {
        const eCategory = "기업메인";
        const eAction = "기업";
        const eLabel = "하단상담신청";
        utils.ad.gaEvent(eCategory, eAction, eLabel);
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
        const {
            product_no,
            referer,
            referer_keyword,
            name,
            accessType,
            deviceType
        } = this.props;

        const valid = this.validate();

        if (!valid) {
            PopModal.progress();
            const info_data = { ...this.UserInfo.getFormData() };

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
        } else {
            PopModal.alert(valid);
        }
    }

    /**
     * 상담신청 등록
     * @param name
     * @param device_type
     * @param access_type
     */
    onAdviceOrders(name, device_type, access_type) {
        const is_valid = this.validate();
        const { product_no, referer, referer_keyword, renew } = this.props;
        if (is_valid) {
            PopModal.progress();
            const user_info = this.UserInfo.getApplyInfo();
            const url = this.UserInfo.getUrl();
            const attach_info = this.UserInfo.getAttachFiles();
            const temp_user_id = this.UserInfo.getTempUserId();
            // const counsel_type = this.UserInfo.getCounselType();
            const user_email = this.UserInfo.getUserEmail();

            const enter = cookie.getCookies("ENTER");
            const enter_session = sessionStorage.getItem("ENTER");
            let page_type = "biz";
            if (enter && enter_session) {
                page_type = "personal";
            }

            user_info.device_type = device_type;
            user_info.access_type = access_type;
            user_info.page_type = page_type;
            // user_info.counsel_type = counsel_type;

            if (product_no) {
                user_info.product_no = product_no;
            }

            if (referer) {
                user_info.referer = referer;
            }

            if (referer_keyword) {
                user_info.referer_keyword = referer_keyword;
            }

            if (url) {
                user_info.url = url;
            }

            if (temp_user_id) {
                user_info.temp_user_id = temp_user_id;
            }

            if (user_email) {
                user_info.user_email = user_email;
            }

            if (Array.isArray(attach_info) && attach_info.length > 0) {
                user_info.attach_info = JSON.stringify(attach_info);
            }
            this.onFetchAdviceOrder(user_info);
        }
    }

    onFetchAdviceOrder(data) {
        const is_enter = this.state.is_enter;
        const { name, accessType, deviceType } = this.props;

        this.setApiAdviceOrders({ ...data }).then(response => {
            if (response.status === 200) {
                PopModal.closeProgress();
                utils.ad.wcsEvent("4");

                if (!is_enter && (accessType === "main")) {
                    this.gaEvent_bizMain();
                }
            }
            PopModal.alert("상담신청해 주셔서 감사합니다.\n곧 연락 드리겠습니다.", {
                callBack: () => this.onClose(name, accessType, deviceType)
            });
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
        const { renew } = this.props;
        if (typeof this.props.onClose === "function") {
            this.props.onClose();
            return;
        }
        this.UserInfo.initData();
        if (!renew) {
            this.UserAgree.initData();
        }

        if (device_type !== "mobile" && (access_type === "main" || name)) {
            PopModal.close(name);
            if (!this.state.is_login && auth.getUser()) {
                location.reload();
            }

            return;
        }
        location.href = "/";
    }

    renderInfo(type) {
        const { category, accessType, deviceType } = this.props;
        return type === "pc"
        ? this.renderMainForPC({ category, accessType, deviceType }) : this.renderMainForMobile({ category, accessType, deviceType });
    }


    renderMainForPC(params) {
        return (
            <MainConsult ref={instance => { this.UserInfo = instance; }} {...params} />
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
        const { name, accessType, deviceType, renew } = this.props;
        const isDesktopMain = (accessType === "main" || renew) && deviceType === "pc";

        let buttonContent = "";

        if (isDesktopMain) {
            buttonContent = (
                <div
                    onClick={this.onAdviceOrdersPC}
                    className={classNames("button", "button__theme__yellow", "consulting-button", "orders")}
                >
                    <div className="orders_btn__hover" />
                    <p className="consulting-buttons__button">신청하기</p>
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
            <div className="pop-consulting-component">
                {!renew &&
                    <div className="consulting-heading">
                        <h2 className="consulting-heading__title">상담신청하기</h2>
                        <p className="consulting-heading__description description">
                            포스냅 담당자가 세부적으로 체크하여 최적의 작가를 빠르게 안내해드립니다.
                        </p>
                    </div>
                }
                <div className="consulting-content">
                    {this.renderInfo(deviceType)}
                </div>
                {!renew &&
                    <ConsultingAgree name={name} ref={instance => { this.UserAgree = instance; }} />
                }
                <div className="consulting-buttons">
                    <div className={classNames("consulting-buttons-container", { "dm": isDesktopMain })}>
                        {buttonContent}
                    </div>
                </div>
            </div>
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
