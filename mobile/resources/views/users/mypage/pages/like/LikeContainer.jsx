import "./like.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

// global
import API from "forsnap-api";
import auth from "forsnap-authentication";

// layout
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, Footer, OverlayContainer } from "mobile/resources/containers/layout";
import AppDispatcher from "mobile/resources/AppDispatcher";
import * as CONST from "mobile/resources/stores/constants";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

// utils
import PopModal from "shared/components/modal/PopModal";
import cookie from "forsnap-cookie";
import CONSTANT from "shared/constant";
import utils from "forsnap-utils";

// chide component
import LikeCount from "./components/item/LikeCount";
import LikeList from "./components/list/LikeList";
import LikeNoneList from "./components/list/LikeNoneList";

class LikeContainer extends Component {
    constructor(props) {
        super(props);
        this.LIMIT = 4;
        this.state = {
            entity: {
                list: [],
                total_cnt: 0
            },
            params: {
                offset: 0,
                limit: this.LIMIT,
                page: 1,
                max_page: 1
            }
        };
        this.onUserLikeList = this.onUserLikeList.bind(this);
        this.onMoreList = this.onMoreList.bind(this);
        this.onMoveLike = this.onMoveLike.bind(this);
        this.onRemoveLike = this.onRemoveLike.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const { params } = this.state;
        this.onUserLikeList(params);

        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "나의하트" });
        }, 0);
    }

    /**
     * 하트목록 조회
     * @param params
     * @param isAbleMerge
     */
    onUserLikeList(params, isAbleMerge = true) {
        const user = auth.getUser();
        if (user) {
            this.apiGetHeartList(user.id, params).then(response => {
                const data = response.data;
                const list = isAbleMerge ? this.mergeList(data.list) : data.list;
                this.setState({
                    entity: { list, total_cnt: data.total_cnt },
                    params: { ...this.calculateParams(list, data.total_cnt) }
                });
            }).catch(error => {
                PopModal.alert(error.data);
            });
        } else {
            PopModal.alert("로그인 후 이용해 주세요.", { callBack: () => { location.href = "/"; } });
        }
    }

    /**
     * 리스트를 더 불러온다.
     */
    onMoreList() {
        const { params } = this.state;
        const { page, max_page } = params;
        if (page < max_page) {
            this.onUserLikeList(params);
        }
    }

    /**
     * 즐겨찾기 1개를 삭제한다.
     * @param no
     * @param idx
     */
    onRemoveLike(no, idx) {
        const user = auth.getUser();
        this.apiRemoveLike(user.id, no).then(() => {
            const { entity } = this.state;
            const list = entity.list;
            if (list.length > 0) {
                list.splice(idx, 1);
            }
            const total_cnt = entity.total_cnt - 1;
            this.setState({
                entity: { list, total_cnt },
                params: { ...this.calculateParams(list, total_cnt) }
            }, () => {
                const { limit, page } = this.state.params;
                this.onUserLikeList({ offset: 0, limit: limit * page }, false);
            });
        }, error => {
            PopModal.toast(error.data);
        });
    }

    /**
     * 즐겨찾기한 상품으로 이동한다.
     * @param e
     * @param obj
     */
    onMoveLike(e, obj) {
        e.preventDefault();
        const enter = cookie.getCookies(CONSTANT.USER.ENTER);
        const url = e.currentTarget && e.currentTarget.href;
        if (typeof enter === "string"
            //&& (utils.checkCookieEnter(enter))
            && sessionStorage.getItem(CONSTANT.USER.ENTER)) {
            location.href = url;
        } else {
            this.enterCategoryMoveProduct(url, obj.category || "");
        }
    }

    /**
     * 하트리스트 조회 api 호출한다.
     * @param id
     * @param params
     * @returns {*|axios.Promise}
     */
    apiGetHeartList(id, params) {
        return API.users.likeList(id, params.offset, params.limit);
    }

    apiRemoveLike(id, no) {
        return API.users.unlike(id, no);
    }

    /**
     * 하트리스트 조회 파라미터 계산한다.
     * @param list
     * @param total_cnt
     * @returns {{params: {offset: number, page, max_page}}}
     */
    calculateParams(list, total_cnt) {
        const { params } = this.state;
        const offset = list.length;

        return { ...params, offset, ...this.calculatePageParams(list, total_cnt) };
    }

    /**
     * 현재 페이지와 마지막 페이지를 계산한다.
     * @param list
     * @param total_cnt
     * @returns {{page: number, max_page: number}}
     */
    calculatePageParams(list, total_cnt) {
        const { params, entity } = this.state;
        const max_page = Math.ceil(total_cnt / params.limit);
        const page = Math.ceil(list.length / params.limit);
        return { page, max_page };
    }

    /**
     * 하트 리스트를 병합한다.
     * @param list
     * @returns {{entity: {list: *[]}}}
     */
    mergeList(list) {
        const { entity } = this.state;
        const b_list = entity.list;

        return b_list.concat(list);
    }

    /**
     * 카테고리에 따라 상품 상세 이동
     */
    enterCategoryMoveProduct(url, category) {
        if (!utils.checkCategoryForEnter(category)) {
            window.open(`${url}?new=true`, "_blank");
        } else {
            window.location.href = `${url}?biz=true`;
        }
    }

    /**
     * 하트목록을 화면에 출력합니다.
     * @param list
     * @returns {*}
     */
    renderLikeListContainer(list) {
        if (Array.isArray(list) && list.length > 0) {
            return (
                <LikeList
                    list={list}
                    onRemoveLike={this.onRemoveLike}
                    onMoveLike={this.onMoveLike}
                />
            );
        }

        return <LikeNoneList />;
    }

    render() {
        const { params, entity } = this.state;
        return (
            <div className="users-like">
                <div className="like-container">
                    <LikeCount total_cnt={Number(entity.total_cnt)} />
                    {this.renderLikeListContainer(entity.list)}
                    {params.page < params.max_page &&
                        <div className="more-list">
                            <button
                                id="moreTest"
                                className="button button-block button__default"
                                onClick={this.onMoreList}
                            >
                                더보기
                            </button>
                        </div>
                    }
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
            <LikeContainer />
            <Footer>
                <ScrollTop />
            </Footer>
            <OverlayContainer />
        </div>
    </AppContainer>,
    document.getElementById("root")
);
