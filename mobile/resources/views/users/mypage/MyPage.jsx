import "./myPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import cookie from "forsnap-cookie";
import API from "forsnap-api";

import constant from "shared/constant";
import { PROCESS_BREADCRUMB_CODE, COMBINE_PROCESS_BREADCRUMB } from "shared/constant/reservation.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import redirect from "mobile/resources/management/redirect";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, Footer, OverlayContainer } from "mobile/resources/containers/layout";

import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

import ProgressBreadcrumb from "../progress/components/ProgressBreadcrumb";
import { pages_data } from "./pages_data";

class MyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumb: {
                READY: 0,
                PAYMENT: 0,
                PREPARE: 0,
                SHOT: 0,
                UPLOAD: 0,
                CUSTOM: 0,
                COMPLETE: 0
            },
            limit: 10,
            pagesData: pages_data,
            enter: cookie.getCookies(constant.USER.ENTER)
        };
        this.apiReserveList = this.apiReserveList.bind(this);

        this.findStatus = this.findStatus.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.apiReserveList();

        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "마이페이지" });
        }, 0);
    }

    onClick(e, obj) {
        e.preventDefault();
        const enter = this.state.enter || "";
        const enter_session = sessionStorage.getItem(constant.USER.ENTER);
        const node = e.currentTarget;
        const url = node.href;
        const add_query = enter ? `&enter=${enter}` : "";

        if (typeof enter === "string" && (enter === "naver" || enter === "header") && enter_session && !obj.has_mobile) {           // 쿠키가 있느냐
            window.open(`${__MOBILE__}/simple-redirect?url=${node.href}${add_query}`, "_blank");
        } else {
            window.location.href = url;
        }
    }

    // API 예약목록 가져오기
    apiReserveList() {
        const request = API.reservations.reserveList(PROCESS_BREADCRUMB_CODE.READY, "U");
        request.then(response => {
            const data = response.data;

            this.setState({
                breadcrumb: data.count_list
            });
        }).catch(error => {
            if (error && error.data) {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: error.data
                });
            }
        });
    }

    /**
     * breadcrumb 상태변경 시 콜백
     * @param obj
     */
    redirectProgress(obj) {
        redirect.myProgressType(obj.value);
    }

    wcsEvent() {
        //utils.ad.wcsEvent("5");
        // if (wcs && wcs.cnv && wcs_do) {
        //     const _nasa = {};
        //     _nasa["cnv"] = wcs.cnv("5", "1");
        //     wcs_do(_nasa);
        // }
    }

    findStatus(status) {
        if (status) {
            return Object.keys(COMBINE_PROCESS_BREADCRUMB).reduce((r, key) => {
                const o = COMBINE_PROCESS_BREADCRUMB[key];
                const find = o.status.find(code => code.toLowerCase() === status.toLowerCase());
                if (find) {
                    return key;
                }

                return r;
            }, PROCESS_BREADCRUMB_CODE.READY);
        }

        return PROCESS_BREADCRUMB_CODE.READY;
    }

    render() {
        const { breadcrumb } = this.state;

        return (
            <div className="users-myPage">
                <div className="users-myPage-pages">
                    <ul className="pages-list">
                        {
                            this.state.pagesData.map((obj, idx) => {
                                return (
                                    <li className="list-unit" key={`myPage-${obj.id}`}>
                                        <a href={obj.link} role="button" onClick={e => this.onClick(e, obj)}>
                                            <i className={classNames("m-icon", obj.icon)} />
                                            <p>{obj.name}</p>
                                        </a>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
                <div className="progress__top__container">
                    <div className="title">
                        <p>진행상황</p>
                        <a href="/users/progress"><button>전체보기 &gt;</button></a>
                    </div>
                    <ProgressBreadcrumb breadcrumb={breadcrumb} status={PROCESS_BREADCRUMB_CODE.READY} zero />
                </div>
                <div className="users-inquire-chat">
                    <a href="/users/chat?user_id=help" onClick={this.wcsEvent}>
                        <div className="chat-btn" style={{ borderTop: "1px solid #e1e1e1" }}>
                            <i className="m-icon m-icon-doubletalk" /><span>1:1 채팅문의</span>
                        </div>
                    </a>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <AppContainer roles={["customer"]}>
        <HeaderContainer />
        <div className="site-main">
            <LeftSidebarContainer />
            <MyPage />
            <Footer>
                <ScrollTop />
            </Footer>
            <OverlayContainer />
        </div>
    </AppContainer>,
    document.getElementById("root")
);

