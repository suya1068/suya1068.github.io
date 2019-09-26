import "./estimateList.scss";
import React, { Component, PropTypes } from "react";
import { History } from "react-router";
import utils from "forsnap-utils";
import auth from "forsnap-authentication";
import PopModal from "shared/components/modal/PopModal";
import classNames from "classnames";
import cookie from "forsnap-cookie";
import CONSTANT from "shared/constant";
import EstimateList from "./EstimateList";

import EstimateListManager from "../component/helper/list/EstimateListManager";
import redirect from "forsnap-redirect";

export default class EstimateListContainer extends Component {
    constructor() {
        super();
        this.state = {
            user_id: auth.getUser() && auth.getUser().id,
            page: 1,
            max_page: 1,
            tab: "progress",
            list: [],
            enter: cookie.getCookies(CONSTANT.USER.ENTER),
            is_mount: false,
            is_loading: true,
            tab_loading: false
        };
        this.list_manager = null;
        this.initData = this.initData.bind(this);
        this.onSelectTab = this.onSelectTab.bind(this);
        this.createMorePushURL = this.createMorePushURL.bind(this);
        this.onRedirect = this.onRedirect.bind(this);
    }

    componentWillMount() {
        this.initData();
    }

    componentDidMount() {
        const { page, tab } = this.state;
        this.list_manager = EstimateListManager.create(tab);
        this.list_manager.setOffset(this.parseToOffsetFromPage(page));
        this.setList(page);
        if (isNaN(page)) {
            PopModal.alert("잘못된 접근입니다.", { callBack: () => this.onPushURL(1) });
        }
    }

    /**
     * 리스트 데이터를 저장한다.
     */
    setList() {
        if (this.list_manager) {
            this.list_manager.getEstimateList()
                .then(
                    () =>
                        this.setState(state =>
                            ({
                                list: this.list_manager.getList(),
                                total_cnt: this.list_manager.getTotalCount(),
                                max_page: this.list_manager.getMaxPage(),
                                is_mount: true,
                                is_loading: true,
                                tab_loading: true
                            }), () => {
                            if (this.state.max_page < this.state.page) {
                                this.onQuery(this.state.max_page);
                            }
                        }),
                    error => PopModal.alert(error.data, { callBack: () => redirect.main() })
                );
        }
    }

    /**
     * 페이지 로딩 시 필요한 데이터를 준비한다.
     */
    initData() {
        const { page, tab } = this.props.location.query;
        const isNewQuery = this.props.location.query.new;

        const tabs = ["progress", "complete"];
        const index = tabs.findIndex(chk => {
            return chk === tab;
        });

        let initPage = page;
        if (initPage < 1 || !initPage) {
            initPage = 1;
        }

        this.setState({
            page: initPage || 1,
            tab: index === -1 ? "progress" : tab,
            isNewQuery: isNewQuery || ""
        }, () => {
            this.onPushURL(initPage);
        });
    }

    onSelectTab(tab) {
        this.list_manager = EstimateListManager.create(tab);
        this.setState({
            tab_loading: false,
            tab,
            is_loading: false
        }, () => {
            this.setList();
            this.onPushURL(1);
        });
    }

    onPushURL(page, push = false) {
        const url = this.createMorePushURL(page);
        if (push) {
            utils.history.push(url);
        } else {
            utils.history.replace(url);
        }
    }

    onQuery(page) {
        this.onPushURL(page);
        let offset = 0;
        if (page > 0) {
            offset = this.parseToOffsetFromPage(page);
        }
        this.list_manager.setOffset(offset);
        this.setList();
        window.scrollTo(0, 0);
    }

    onRedirect(url, category) {
        const { enter } = this.state;
        const enter_session = sessionStorage.getItem(CONSTANT.USER.ENTER);

        if (enter && typeof enter === "string" && (enter === "naver" || enter === "header") && enter_session) {           // 쿠키가 있느냐
            if (!utils.checkCategoryForEnter(category) && category !== "") {           // 기업용 카테고리가 아니면
                window.open(`${url}?new=true`, "_blank");
            } else {
                window.location.href = url;
            }
        } else {
            utils.history.replace(window.location.href, { path: window.location.href, scrollTop: document.body.scrollTop });
            window.location.href = url;
        }
    }

    createMorePushURL(page) {
        const { tab, isNewQuery } = this.state;
        this.setState({
            page
        });
        return `/users/estimate/list?tab=${tab}&page=${page}&new=${isNewQuery}`;
    }

    /**
     * page를 사용하여, offset을 반환한다.
     * @param {number} [page = 1]
     * @returns {{offset: number }}
     */
    parseToOffsetFromPage(page = 1) {
        return (page - 1) * 6;
    }

    render() {
        const { tab, total_cnt, is_mount, list, page, is_loading, tab_loading } = this.state;

        if (!is_mount) {
            return null;
        }

        return (
            <div style={{ minHeight: "calc(100vh - 290px)" }} >
                <div className="user-estimate-tab">
                    <button
                        className={classNames("estimate-list", { "active": tab === "progress" })}
                        disabled={!tab_loading && "disabled"}
                        onClick={() => this.onSelectTab("progress")}
                    >
                        나의촬영
                    </button>
                    <button
                        className={classNames("estimate-complete", { "active": tab === "complete" })}
                        disabled={!tab_loading && "disabled"}
                        onClick={() => this.onSelectTab("complete")}
                    >
                        최근매칭완료
                    </button>
                </div>
                {tab === "complete" && <p className="complete-msg">{this.list_manager.getCompleteMsg()}</p>}
                {is_loading &&
                    <div style={{ minHeight: "100%" }}>
                        <EstimateList
                            onRedirect={this.onRedirect}
                            onQuery={p => this.onQuery(p)}
                            list={list}
                            limit={6}
                            page={page}
                            total={total_cnt}
                            tab={tab}
                        />
                    </div>
                }
            </div>
        );
    }
}
