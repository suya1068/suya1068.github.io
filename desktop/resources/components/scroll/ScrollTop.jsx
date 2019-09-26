import "./scrollTop.scss";
import React, { Component, PropTypes } from "react";

import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import cookie from "shared/management/cookie";
// import Img from "shared/components/image/Img";

// import Icon from "desktop/resources/components/icon/Icon";
// import PersonalConsult from "shared/components/consulting/personal/ConsultContainer";
// import PopModal from "shared/components/modal/PopModal";
import CONSTANT from "shared/constant";
import PopModal from "shared/components/modal/PopModal";
import PopupShotInfo from "desktop/resources/components/pop/popup/shot_info/PopupShotInfo";

class ScrollTop extends Component {
    constructor(props) {
        super(props);
        const path = location.pathname;
        const search = location.search;
        this.state = {
            is_enter: !(cookie.getCookies(CONSTANT.USER.ENTER) && sessionStorage.getItem(CONSTANT.USER.ENTER)),
            main: path === "/",
            products: path === "/products",
            products_detail: path.match(/\/products\/[0-9]+/),
            search_param: search ? utils.query.parse(search) : {}
        };

        this.onKakaoTalk = this.onKakaoTalk.bind(this);
        this.createParameter = this.createParameter.bind(this);
    }

    componentWillMount() {
        this.setState({
            parameter: this.createParameter()
        });
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            parameter: this.createParameter()
        });
    }

    onKakaoTalk() {
        const { main, products, products_detail, search_param } = this.state;
        const { category } = this.props;

        const category_pos =
            (main && "기업_메인") ||
            (products && "기업_리스트") ||
            (products_detail && "기업_상세");


        if (products_detail && !utils.type.isEmpty(search_param) && search_param.utm_source && search_param.utm_source === "fb_ad") {
            const is_biz = utils.checkCategoryForEnter(category);
            utils.ad.gaEvent(`페이스북광고_${is_biz ? "기업" : "개인"}`, search_param.utm_content || "", "카카오톡 상담신청");
        }

        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("카카오톡 상담신청");
        }

        // utils.ad.gaEvent(category_pos, "카카오톡 상담신청", "");
        return true;
    }

    /**
     * 기업메인 플로팅 상담신청 gaEvent
     */
    // gaEvent_bizMain_consult() {
    //     const eCategory = "기업메인";
    //     const eAction = "";
    //     const eLabel = "플로팅상담신청";
    //     utils.ad.gaEvent(eCategory, eAction, eLabel);
    // }

    /**
     * 상담신청 모달이 띄운다.
     * @param is_enter
     */
    // onConsult(is_enter) {
    //     if (location.pathname === "/" && is_enter) {
    //         this.gaEvent_bizMain_consult();
    //     }
    //     const modal_name = "personal_consult";
    //
    //     const options = {
    //         className: "personal_consult"
    //     };
    //
    //     const consult_component = <PersonalConsult {...this.getConsultParams()} device_type="pc" access_type="float" />;
    //     PopModal.createModal(modal_name, consult_component, options);
    //     PopModal.show(modal_name);
    // }

    /**
     * 상담신청에 필요한 데이터를 조합한다.
     */
    // getConsultParams() {
    //     const { referer, referer_keyword, product_no, category } = this.props;
    //     let exchange_category = category;
    //     const consult_data = {};
    //
    //     if (location.pathname === "/information/video") {
    //         exchange_category = "VIDEO";
    //     }
    //
    //     if (referer) {
    //         consult_data.referer = referer;
    //     }
    //     if (referer_keyword) {
    //         consult_data.referer_keyword = referer_keyword;
    //     }
    //     if (product_no) {
    //         consult_data.product_no = product_no;
    //     }
    //
    //     if (category) {
    //         consult_data.category = exchange_category;
    //     }
    //
    //     return consult_data;
    // }

    createParameter() {
        if (window.location) {
            // const { is_enter } = this.state;
            const user = auth.getUser();
            const parameter = {
                yid: "%40forsnap",
                site_id: "4000000720",
                category_id: "81350",
                division_id: "81351",
                site_uid: user ? user.id : ""
            };
            const { pathname, search } = window.location;
            const query = utils.query.parse(search);
            const path = {
                main: pathname === "/",
                products: pathname === "/products",
                products_detail: pathname.match(/\/products\/[0-9]+/)
            };

            if (path.main || path.products || path.products_detail) {
                parameter.parameter1 = pathname;
                // 기업메인, 기업리스트, 기업상세만
                // parameter.parameter2 = is_enter ? "CORP" : "USER";
                parameter.parameter2 = "CORP";
                parameter.parameter3 = query.category || "";
                parameter.parameter4 = query.keyword || "";
                delete query.category;
                delete query.keyword;
                parameter.parameter5 = utils.query.stringify(query);

                let pathName = "";
                const enter = "기업";
                if (path.main) {
                    pathName = `${enter} 메인`;
                } else if (path.products) {
                    pathName = `${enter} 상품리스트`;
                } else if (path.products_detail) {
                    pathName = `${enter} 상품상세`;
                }
                // else if (path.video) {
                //     pathName = `${enter} 영상촬영`;
                // }

                this.state.pathName = pathName;
            } else {
                return null;
            }

            return parameter;
        }

        return null;
    }

    gaEventSI() {
        const { main, products, products_detail } = this.state;
        const category_pos =
            (main && "기업_메인") ||
            (products && "기업_리스트") ||
            (products_detail && "기업_상세");
        if (category_pos) {
            utils.ad.gaEvent(category_pos, "촬영상담TIP", "촬영상담TIP");
        }
    }

    onPopShotInfo() {
        this.gaEventSI();
        const modal_name = "shot_info";
        PopModal.createModal(modal_name, <PopupShotInfo modal_name={modal_name} />, { className: modal_name, modal_close: false });
        PopModal.show(modal_name);
    }

    render() {
        const { is_enter, parameter, main, products, products_detail } = this.state;
        const { category } = this.props;
        let is_biz = is_enter;
        if (category) {
            is_biz = utils.checkCategoryForEnter(category);
        }

        return (
            <div className="scroll-top__inner-container">
                {this.props.children}
                {is_biz &&
                <div className="float__button" style={{ width: "100%", minWidth: 70 }} onClick={() => this.onPopShotInfo()}>
                    <div className="float__icon">
                        <img src={`${__SERVER__.img}/common/popup/shot_info/shot_info_icon.png`} role="presentation" alt="상담요청TIP" />
                    </div>
                    <div className="float__text">촬영상담TIP</div>
                </div>
                }
                {is_biz && parameter && (main || products || products_detail) ?
                    <a
                        className="float__button"
                        href={`https://api.happytalk.io/api/kakao/chat_open?${utils.query.stringify(parameter)}`}
                        onClick={() => this.onKakaoTalk()}
                        target="_blank"
                    >
                        <div className="float__icon">
                            <img className="kakaotalk__icon" alt="kakaotalk" src="//happytalk.io/assets/main/img/btn-chat-kakao.png" />
                        </div>
                        <div className="float__text">카톡상담</div>
                    </a> : null
                }
                {/*{!is_enter &&*/}
                {/*<div className="float__button" onClick={() => this.onConsult(is_enter)}>*/}
                {/*<div className="float__icon consult"><Icon name="consulting" /></div>*/}
                {/*<div className="float__text">상담신청</div>*/}
                {/*</div>*/}
                {/*}*/}
            </div>
        );
    }
}

ScrollTop.propTypes = {
};

ScrollTop.defaultProps = {
};

export default ScrollTop;
