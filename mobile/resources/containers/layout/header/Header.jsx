import React, { Component } from "react";
import { Container } from "flux/utils";
import classNames from "classnames";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import { UIStore, SessionStore } from "mobile/resources/stores";
import cookie from "forsnap-cookie";
import CONSTANT from "shared/constant";
import utils from "forsnap-utils";
import PopModal from "shared/components/modal/PopModal";
import ConsultModal from "mobile/resources/components/modal/consult/ConsultModal";
import API from "forsnap-api";

const CUSTOMER_TYPE = {
    ENTERPRISE: "enterprise",
    NORMAL: "normal"
};

class Header extends Component {
    static getStores() {
        return [UIStore, SessionStore];
    }

    static calculateState() {
        return {
            ui: UIStore.getState(),
            session: SessionStore.getState(),
            enter: cookie.getCookies(CONSTANT.USER.ENTER),
            enter_session: sessionStorage.getItem(CONSTANT.USER.ENTER),
            current_path: location.pathname
        };
    }

    constructor() {
        super();
        this.state = {};
        this.onMain = this.onMain.bind(this);
        this.showLeftSidebar = this.showLeftSidebar.bind(this);
        this.onMovePage = this.onMovePage.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    onMain(e) {
        const { category } = this.props;
        const { enter, enter_session } = this.state;
        this.gaEvent("로고", category ? utils.format.categoryCodeToName(category) : "");
        e.preventDefault();
        const type = (enter && enter_session) ? CUSTOMER_TYPE.NORMAL : CUSTOMER_TYPE.ENTERPRISE;
        this.changeCustomerType(type);
    }

    renderLeftSide() {
        const { artist } = this.props;
        const { enter, enter_session } = this.state;
        let content = (
            <div className="site-change">
                <span role="button" className={!(enter && enter_session) ? "yellow-text" : ""} onClick={() => this.changeCustomerType(CUSTOMER_TYPE.ENTERPRISE)}>기업</span>
                <span role="button" className={enter && enter_session ? "yellow-text" : ""} onClick={() => this.changeCustomerType(CUSTOMER_TYPE.NORMAL)}>개인</span>
            </div>
        );

        if ((location.search && utils.query.parse(location.search).category && utils.checkCategoryForEnter(utils.query.parse(location.search).category))
            || this.props.category) {
            const category = (location.search && (utils.query.parse(location.search).category)) || this.props.category;
            const category_name = (category && utils.format.categoryCodeToName(category)) || "";
            content = (
                <div className="site-category">
                    <a onClick={e => this.onMovePage(e, "홈")} href="/" style={{ color: "#000" }} target="_blank" rel="noopener noreferrer">
                        <span>홈</span>
                    </a>
                    <div className="hr" />
                    <a onClick={e => this.onMovePage(e, category_name)} href={`/products?category=${category}`} style={{ color: "#000" }} target="_blank" rel="noopener noreferrer">
                        <span>{category_name}</span>
                    </a>
                    {artist ? <div key="hr" className="hr" /> : null}
                    {artist ?
                        <a onClick={e => this.onMovePage(e, artist.nick_name)} href={`/portfolio/${artist.product_no}`} style={{ color: "#000" }} target="_blank" rel="noopener noreferrer">
                            <span>{artist.nick_name}</span>
                        </a> : null
                    }
                </div>
            );
        }

        return content;
    }

    onMovePage(e, name) {
        e.preventDefault();
        const node = e.currentTarget;
        const href = node.href;

        this.gaEvent("헤더", name);

        window.location.href = href;
    }

    gaEvent(action, label) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(action, label);
        }
    }

    showLeftSidebar(event) {
        const { category } = this.props;
        event.preventDefault();
        AppDispatcher.dispatch({ type: CONST.GLOBAL_LEFT_SIDEBAR_SHOW, payload: { category: category || "" } });
    }

    showSearchSidebar(event) {
        event.preventDefault();
        AppDispatcher.dispatch({ type: CONST.GLOBAL_SEARCH_SIDEBAR_SHOW });
    }

    changeCustomerType(type) {
        //초기화
        cookie.removeCookie(CONSTANT.USER.ENTER);

        if (type === CUSTOMER_TYPE.ENTERPRISE) {
            sessionStorage.removeItem(CONSTANT.USER.ENTER);
            location.href = "/";
        } else {
            sessionStorage.setItem(CONSTANT.USER.ENTER, "indi");
            location.href = "/?enter=indi";
        }
    }

    onConsult() {
        const modal_name = "simple__consult";
        const category = utils.query.parse(location.search) && utils.query.parse(location.search).category;
        PopModal.createModal(modal_name,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({
                        access_type: "header",
                        device_type: "mobile",
                        page_type: "biz",
                        category: category || ""
                    }, data);

                    // 상담요청 api
                    API.orders.insertAdviceOrders(params)
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

    render() {
        const { category } = this.props;
        const { ui, current_path, enter, enter_session } = this.state;
        const session = this.state.session.entity;
        let noticeCount = 0;

        if (session && session.is_login) {
            if (session.is_artist) {
                noticeCount = session.artist_notice_count;
            } else {
                noticeCount = session.notice_count;
            }
        }
        const main_path = current_path === "/";

        const isBiz = category ? utils.checkCategoryForEnter(category) : false;
        // const isListPage = location.pathname.startsWith("/products");
        const isMainPage = location.pathname === "/";
        // const isPortfolioPage = location.pathname.startsWith("/portfolio/");
        // const isSearchCategory = location.search && utils.query.parse(location.search) && utils.query.parse(location.search).category;
        const isEnter = !(enter && enter_session);

        return (
            <header className="site-header">
                <div className="site-header-container">
                    <div className="site-headerbar">
                        <div className="site-headerbar-inner">
                            <h1 className="site-brand">
                                <a href="/" onClick={this.onMain}>
                                    <img src={`${__SERVER__.img}/mobile/common/m_logo_f.png`} role="presentation" width="13" />
                                    <span className="sr-only">FORSNAP</span>
                                </a>
                            </h1>
                        </div>
                        <div className="site-change-outer">
                            {main_path || current_path.startsWith("/products") || current_path.startsWith("/portfolio/") ?
                                this.renderLeftSide() :
                                <h2 className="site-breadcrumb">
                                    {ui.breadcrumb || ""}
                                </h2>
                            }
                            <div className="site-side-buttons">
                                <a href="" className={classNames("site-nav-toggler", session && session.is_login && noticeCount > 0 ? "badge" : "")} title={session ? noticeCount : ""} role="button" onClick={this.showLeftSidebar}>
                                    <i className="m-icon m-icon-bars" />
                                </a>
                                {
                                    (isMainPage && isEnter) || isBiz ?
                                    // (isListPage && isBiz) ||
                                    // (isPortfolioPage && isBiz) ?
                                        null :
                                        <a href="" className="site-search" role="button" onClick={this.showSearchSidebar}>
                                            <i className="m-icon m-icon-search" />
                                        </a>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default Container.create(Header);

