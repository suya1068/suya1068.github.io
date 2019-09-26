import "./myHeart.scss";
import React, { Component, PropTypes } from "react";

import auth from "forsnap-authentication";
import utils from "shared/helper/utils";
import API from "forsnap-api";
import cookie from "forsnap-cookie";
import Buttons from "desktop/resources/components/button/Buttons";

import PopModal from "shared/components/modal/PopModal";
import HeartList from "./list/HeartList";
import HeartNoneList from "./list/HeartNoneList";
import CONSTANT from "shared/constant";

class HeartContainer extends Component {
    constructor(props) {
        super(props);
        this.LIMIT = 4;
        this.state = {
            enter: props.enter,
            params: {
                offset: 0,
                limit: this.LIMIT,
                page: 1,
                max_page: 1
            },
            entity: {
                list: [],
                total_cnt: 0
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

    /**
     * 하트 삭제
     * @param id
     * @param no
     * @returns {*|axios.Promise}
     */
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
            window.open(`${url}?new=true`, "_blank,");
        } else {
            window.location.href = `${url}?biz=true`;
        }
    }

    /**
     * 하트목록을 화면에 출력합니다.
     * @param list
     * @param total_cnt
     * @returns {*}
     */
    renderLikeListContainer(list, total_cnt) {
        if (Array.isArray(list) && list.length > 0) {
            return (
                <HeartList
                    list={list}
                    total_count={total_cnt}
                    onRemoveLike={this.onRemoveLike}
                    onMoveLike={this.onMoveLike}
                />
            );
        }

        return <HeartNoneList />;
    }

    render() {
        const { entity, params } = this.state;

        return (
            <div className="myHeart-page">
                {this.renderLikeListContainer(entity.list, entity.total_cnt)}
                {params.page < params.max_page &&
                    <div className="more-list">
                        <Buttons
                            buttonStyle={{ width: "block", shape: "round", theme: "bg-white" }}
                            inline={{ onClick: this.onMoreList }}
                        >
                            더보기
                        </Buttons>
                    </div>
                }
            </div>
        );
    }
}

HeartContainer.propTypes = {
    enter: PropTypes.string
};

HeartContainer.defaultProps = {
    enter: ""
};

export default HeartContainer;
