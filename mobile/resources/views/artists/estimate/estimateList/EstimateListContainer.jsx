import React, { Component, PropTypes } from "react";
import { History, browserHistory, Link, routerShape } from "react-router";
import API from "forsnap-api";
import utils from "forsnap-utils";
import auth from "forsnap-authentication";
import PopModal from "shared/components/modal/PopModal";
import classNames from "classnames";
import EstimateList from "./EstimateList";

export default class EstimateListContainer extends Component {
    constructor() {
        super();
        this.PAGE_LIMIT = 6;
        this.state = {
            params: {
                progress_offset: 0,
                complete_offset: 0,
                limit: this.PAGE_LIMIT
            },
            page: 1,
            tab: "progress",
            list: [],
            isLoading: false,
            is_tab_loading: true,
            is_mobile_host: location.hostname.startsWith("m")
        };
        this.onSelectTab = this.onSelectTab.bind(this);
        this.getEstimateListForArtist = this.getEstimateListForArtist.bind(this);
        this.getArtistOffers = this.getArtistOffers.bind(this);
        this.createMorePushURL = this.createMorePushURL.bind(this);
        this.onRedirect = this.onRedirect.bind(this);
    }

    componentWillMount() {
        const user = auth.getUser();
        const { page, tab } = this.props.location.query;
        const tabs = ["progress", "complete"];
        const index = tabs.findIndex(chk => {
            return chk === tab;
        });

        let initPage = page;
        if (initPage < 1) {
            initPage = 1;
        }

        if (user) {
            this.setState({
                userId: user.id,
                page: initPage || 1,
                tab: index === -1 ? "progress" : tab
            });
        }
    }

    componentDidMount() {
        const { page } = this.state;
        if (isNaN(page)) {
            PopModal.alert("잘못된 접근입니다.", { callBack: () => this.onPushURL(1) });
        }
        this.initRequest(page);
    }

    /**
     * 페이지 정보 얻기 위한 API 통신
     * @param page
     */
    initRequest(page) {
        const { params } = this.state;

        const request = API.orders.getOrders({ offset: params.progress_offset, limit: params.limit });
        request.then(response => {
            const data = response.data;

            this.setState({
                page_cnt: data.page_cnt || 0,
                total_cnt: data.page_cnt || 0
            }, () => {
                const p = this.checkToPage(page);
                this.onPushURL(p);

                this.onQuery(p);
            });
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    /**
     * history 에 url 정보 입력
     * @param page
     * @param push
     */
    onPushURL(page, push = false) {
        const url = this.createMorePushURL(page);
        if (push) {
            utils.history.push(url);
        } else {
            utils.history.replace(url);
        }
    }

    /**
     * 탭 선택
     * @param e
     * @param tab
     */
    onSelectTab(e, tab) {
        const { is_tab_loading } = this.state;

        if (is_tab_loading && this.state.tab !== tab) {
            this.setState({
                tab,
                is_tab_loading: false,
                page: 1
            }, () => {
                if (tab === "progress") {
                    this.getEstimateListForArtist(1);
                } else {
                    this.getArtistOffers(1);
                }
                this.onPushURL(1);
            });
        }
    }

    /**
     * 탭 별 리스트 불러오기
     * @param page
     */
    onQuery(page) {
        const { tab } = this.state;
        const p = this.checkToPage(page);
        this.onPushURL(p);

        if (tab === "progress") {
            this.getEstimateListForArtist(p);
        } else {
            this.getArtistOffers(p);
        }
        window.scrollTo(0, 0);
    }

    /**
     * 리다이렉트 코드
     * @param url
     */
    onRedirect(url) {
        if (this.context.router) {
            this.context.router.push(url);
        } else {
            location.href = url;
        }
    }

    /**
     * 페이지 체크
     * 입력된 페이지로 최대 페이지를 구한다.
     * 유효한 페이지를 입력하지 않으면 초깃값을 반환한다.
     * @param page
     * @returns {*}
     */
    checkToPage(page) {
        let p = page;
        const { page_cnt, params } = this.state;
        const maxPage = Math.ceil(page_cnt / params.limit);

        if (Number(page) < 0) {
            p = 1;
        } else if (Number(page) > Number(maxPage)) {
            p = maxPage;
        }

        return p;
    }

    /**
     * 작가가 작성한 견적서 리스트를 불러온다.
     * @param maxPage
     */
    getArtistOffers(maxPage) {
        const { params } = this.state;
        const complete_offset = this.parseToOffsetFromPage(maxPage);

        const request = API.offers.getOffers({ complete_offset, limit: params.limit });
        request.then(response => {
            const data = response.data;
            const list = data.list;
            this.setState({
                list,
                total_cnt: data.total_cnt,
                isLoading: true,
                is_tab_loading: true,
                page: maxPage,
                params: { ...params, complete_offset }
            });
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    /**
     * 촬영요청서 리스트를 불러온다.
     * @param maxPage
     */
    getEstimateListForArtist(maxPage) {
        const { params } = this.state;
        const progress_offset = this.parseToOffsetFromPage(maxPage);

        const request = API.orders.getOrders({ offset: progress_offset, limit: params.limit });
        request.then(response => {
            const data = response.data;
            const list = data.list;
            const { page_cnt } = data;
            this.setState({
                list,
                page_cnt,
                total_cnt: page_cnt,
                isLoading: true,
                is_tab_loading: true,
                params: { ...params, progress_offset }
            });
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    /**
     * url 문자열을 생성한다.
     * @param page
     * @returns {string}
     */
    createMorePushURL(page) {
        const { tab } = this.state;
        this.setState({
            page
        });
        return `/artists/estimate/list?tab=${tab}&page=${page}`;
    }

    /**
     * page를 사용하여, offset과 limit를 반환한다.
     * @param {number} [page = 1]
     * @param {number} [limit = PAGE_LIMIT]
     * @returns {{offset: number, limit: *}}
     */
    parseToOffsetFromPage(page = 1, limit = this.PAGE_LIMIT) {
        return (page > 1 ? page - 1 : 0) * limit;
    }

    render() {
        const { tab, isLoading, params, total_cnt, list, page, isBlock, is_tab_loading, is_mobile_host } = this.state;
        const data = {
            list,
            limit: params.limit,
            page,
            total: total_cnt,
            tab,
            isBlock
        };
        if (!isLoading) {
            return null;
        }

        return (
            <div className="artists-estimate-container" style={{ minHeight: "calc(100vh - 290px", backgroundColor: "#fafafa" }}>
                <div className="artists-estimate-tab">
                    <button
                        className={classNames("estimate-list", { "active": tab === "progress" })}
                        onClick={e => this.onSelectTab(e, "progress")}
                    >촬영요청</button>
                    <button
                        className={classNames("estimate-complete", { "active": tab === "complete" })}
                        onClick={e => this.onSelectTab(e, "complete")}
                    >내가 작성한 견적서</button>
                </div>
                <div className={classNames("artist-estimate-alert", { "mobile": is_mobile_host })}>
                    <Link to="/artists/estimate/about">
                        <button className="info-button"><span className="e" /> 견적서 작성 전 꼭 읽어주세요. </button>
                    </Link>
                </div>
                {is_tab_loading &&
                    <EstimateList
                        onRedirect={this.onRedirect}
                        onQuery={p => this.onQuery(p)}
                        {...data}
                    />
                }
            </div>
        );
    }
}

EstimateListContainer.contextTypes = {
    router: routerShape
};
