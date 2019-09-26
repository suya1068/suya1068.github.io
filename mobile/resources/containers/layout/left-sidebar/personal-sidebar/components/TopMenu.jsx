import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import auth from "forsnap-authentication";
import API from "forsnap-api";
import utils from "forsnap-utils";
import redirect from "forsnap-redirect";
import { BUSINESS_MAIN, PERSONAL_MAIN } from "shared/constant/main.const";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";

import Img from "shared/components/image/Img";
// import PopModal from "shared/components/modal/PopModal";
// import PersonalConsult from "shared/components/consulting/personal/ConsultContainer";

import A from "shared/components/link/A";
// import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
// import SimpleConsult from "shared/components/consulting/renew/SimpleConsult";
import ConsultModal from "mobile/resources/components/modal/consult/ConsultModal";
import PopModal from "shared/components/modal/PopModal";

class TopMenu extends Component {
    constructor(props) {
        super(props);
        this.ENTER = "ENTER";
        this.state = {
            // match: location.pathname.match(/(^\/users$)|(^\/users\/.*$)|(^\/users?.*$)/g)
            is_enter: props.enter && (sessionStorage && sessionStorage.getItem(this.ENTER))
        };

        this.onNotice = this.onNotice.bind(this);
        this.onHide = this.onHide.bind(this);
        this.onMoveQuotation = this.onMoveQuotation.bind(this);

        this.moveToLoginPage = this.moveToLoginPage.bind(this);
        this.setProductData = this.setProductData.bind(this);
        this.onCheckCategory = this.onCheckCategory.bind(this);
        this.onMoveConsult = this.onMoveConsult.bind(this);
    }

    componentWillMount() {
        const { is_enter } = this.state;
        this.onCheckCategory();
        // this.setReferrerData();
        this.setProductData();
        this.state.categoryList = is_enter ? PERSONAL_MAIN.CATEGORY : BUSINESS_MAIN.CATEGORY;
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

    onCheckCategory() {
        const search = location.search;
        if (search) {
            const params = utils.query.parse(search);
            if (params.category) {
                this.state.category = params.category;
            }
        }
    }

    onMoveConsult() {
        const { productData } = this.state;
        const { ui } = this.props;
        const category = (productData && productData.category) || this.state.category || (ui && ui.category);
        const product_no = productData && productData.product_no;

        // 상담신청페이지 시작
        // const modal_name = "personal_consult";
        const consult_data = {};
        //
        // if (location.pathname === "/information/video") {
        //     category = "VIDEO";
        // }

        if (product_no) {
            consult_data.product_no = product_no;
        }
        //
        if (category) {
            consult_data.category = category.toUpperCase();
        }

        // PopModal.createModal(modal_name, <PersonalConsult {...consult_data} device_type="mobile" access_type={CONSULT_ACCESS_TYPE.MOBILE_MENU.CODE} />, { className: modal_name });
        // PopModal.show(modal_name);

        const modal_name = "simple__consult";
        // PopModal.createModal(modal_name,
        //     <SimpleConsult modal_name={modal_name} {...consult_data} access_type={CONSULT_ACCESS_TYPE.MOBILE_MENU.CODE} device_type="mobile" onClose={() => PopModal.close(modal_name)} />,
        //     { className: modal_name, modal_close: false });
        PopModal.createModal(modal_name,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({
                        ...consult_data,
                        access_type: CONSULT_ACCESS_TYPE.MOBILE_MENU.CODE,
                        device_type: "mobile",
                        page_type: "biz"
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

        // const modal_name = "simple__consult";
        //
        // Modal.show({
        //     type: MODAL_TYPE.CUSTOM,
        //     content: <SimpleConsult
        //         modal_name={modal_name}
        //         {...consult_data}
        //         access_type={CONSULT_ACCESS_TYPE.MOBILE_MENU.CODE}
        //         device_type="mobile"
        //         onClose={() => Modal.close(modal_name)}
        //     />,
        //     name: modal_name
        // });
    }

    onNotice(e) {
        const { session } = this.props;

        if (session && session.is_login) {
            const { is_artist, id } = session;
            let request = null;
            let href;
            if (is_artist) {
                request = API.artists.notice(id);
                href = "/artists/chat";
            } else {
                request = API.users.notice(id);
                href = "/users/chat";
            }

            request.then(response => {
                location.href = href;
            }).catch(error => {
                location.href = href;
            });
        }
    }

    onHide() {
        redirect.back();
    }

    onLogout(event) {
        event.preventDefault();

        API.auth.logout().then(response => {
            auth.removeUser();
            location.reload();
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    onMoveQuotation(e) {
        e.preventDefault();
        if (this.props.session) {
            location.href = e.currentTarget.href;
        } else {
            this.guest_gaEvent();
            location.href = "/guest/quotation/";
        }
    }

    guest_gaEvent() {
        const eCategory = "게스트 촬영요청서작성";
        const eAction = "";
        const eLabel = "";
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    /**
     * 로그인 페이지로 이동한다.
     */
    moveToLoginPage(event) {
        event.preventDefault();

        const url = `${location.pathname}${location.search}${location.hash}`;

        if (location.pathname === "/login") {
            location.reload();
        } else if (url !== "/") {
            redirect.login({ redirectURL: url });
        } else {
            redirect.login();
        }
    }

    render() {
        const { session, ui } = this.props;
        const { match, categoryList, is_enter } = this.state;
        const isLogin = session && session.is_login;
        const isArtist = session && session.is_artist;

        let noticeCount = 0;
        let profileImage = "";
        let nickName = "";

        if (isLogin) {
            profileImage = session.profile_img || "";
            noticeCount = session.notice_count || 0;

            if (isArtist && !match) {
                profileImage = session.artist_profile_img || "";
                noticeCount = session.artist_notice_count || 0;
                nickName = session.nick_name;
            } else {
                profileImage = session.profile_img || "";
                noticeCount = session.notice_count || 0;
                nickName = session.name;
            }
        }

        return (
            <div className="side__left__top">
                <div className="top__login">
                    <div className="login__profile">
                        <Img image={{ src: isLogin ? profileImage : "", content_width: 110, content_height: 110, width: 110, height: 110, default: "/common/default_profile_img.jpg" }} />
                    </div>
                    <div className="login__name">
                        {isLogin ?
                            <span className="name">{nickName || "이름을 설정해주세요."}</span> :
                            <span className="name"onClick={this.moveToLoginPage}>로그인이 필요합니다.</span>
                        }
                    </div>
                    <div className={classNames("login__notice", isLogin && noticeCount > 0 ? "badge" : "")} title={isLogin ? noticeCount : ""} onClick={this.onNotice}>
                        {isLogin ? <i className="m-icon-message" /> : null}
                    </div>
                    <div className="side__left__close">
                        <button className="f__button__close close__small" onClick={this.onHide} />
                    </div>
                </div>
                {isLogin ?
                    <div className="top__menu">
                        <a className="top__menu__item" href={isArtist ? `${__DESKTOP__}/artists` : "/users"}>
                            {/*<a href={`${__DESKTOP__}/users/myaccount`} target="_blank" rel="noopener">*/}
                            <div>
                                <i className="m-icon m-icon-outline-people" />
                            </div>
                            <p className="text">{isArtist ? "작가페이지" : "마이페이지"}</p>
                        </a>
                        <a className="top__menu__item" href={`/${isArtist ? "artists" : "users"}/progress`}>
                            <div>
                                <i className="m-icon m-icon-outline-calendar" />
                            </div>
                            <p className="text">진행상황</p>
                        </a>
                        <a className="top__menu__item" href="/users/like" rel="noopener">
                            {/*<a href={`${__DESKTOP__}/users/like`} target="_blank" rel="noopener">*/}
                            <div>
                                <i className="m-icon m-icon-outline-heart" />
                            </div>
                            <p className="text">나의하트</p>
                        </a>
                    </div> : null
                }
                <div className="side__left__middle">
                    <div className="middle__ladder__menu">
                        {session && session.is_login
                            ? <a className="logout mobile__menu" href="" onClick={this.onLogout}>로그아웃</a>
                            : <a href="" className="mobile__menu" onClick={this.moveToLoginPage}>로그인 / 회원가입</a>}
                        <a href="/" className="mobile__menu">홈</a>
                        {session && session.is_artist ? <a className="mobile__menu" href="/users">마이페이지</a> : null}
                        {isLogin ? session && !session.is_artist && !is_enter && <button className="mobile__menu" onClick={this.onMoveConsult}>촬영상담요청</button>
                        : !is_enter && ui.category && utils.checkCategoryForEnter(ui.category) && <button className="mobile__menu" onClick={this.onMoveConsult}>촬영상담요청</button>}
                        <a className="mobile__menu" href="/information/introduction">포스냅소개</a>
                        <a className="mobile__menu" href="/cs/qna">고객센터</a>
                    </div>
                </div>
                <div className="top__menu">
                    {utils.isArray(categoryList) ?
                        categoryList.map(obj => {
                            if (obj.code === "DRESS_RENT") {
                                return (
                                    <A key={`top-menu-item-${obj.code}`} className="top__menu__item" href={`/products?category=${obj.code}`}>
                                        <img alt="icon" src={`${__SERVER__.img}/common/icon_category_dress.png`} />
                                        <span className="text">{obj.name}</span>
                                    </A>
                                );
                            }
                            return (
                                <A key={`top-menu-item-${obj.code}`} className="top__menu__item" href={`/products?category=${obj.code}`}>
                                    <i className={`m-icon m-icon-${obj.m_icon}`} />
                                    <span className="text">{obj.name}</span>
                                </A>
                            );
                        }) : null
                    }
                </div>
            </div>
        );
    }
}

TopMenu.propTypes = {
    session: PropTypes.shape([PropTypes.node])
};

export default TopMenu;
