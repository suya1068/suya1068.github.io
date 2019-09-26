import "./qna_container.scss";
import React, { Component } from "react";
import API from "forsnap-api";
import Qna from "./Qna";
import PopModal from "shared/components/modal/PopModal";
import classNames from "classnames";

const CUSTOMERCENTER = [
    { name: "알아두세요", value: "MANY", icon: "people_list", category: "MANY" },
    { name: "취소환불안내", value: "CANCEL", icon: "heart_recycle", category: "CANCEL" },
    { name: "촬영예약안내", value: "RESERVE", icon: "memo", category: "RESERVE" },
    { name: "상품등록안내", value: "CREATE", icon: "monitor", category: "CREATE" },
    { name: "상품판매안내", value: "SELL", icon: "paper", category: "SELL" },
    { name: "", value: "ETC", icon: "paper", category: "ETC" }
];

export default class QnaContainer extends Component {
    constructor() {
        super();
        this.state = {
            board_type: "QNA",
            category: "MANY",
            list: [],
            title: "알아두세요",
            is_loading: false
        };
        this.onSelectCategory = this.onSelectCategory.bind(this);
        this.getListForCsCategory = this.getListForCsCategory.bind(this);
        this.isActiveCategory = this.isActiveCategory.bind(this);
    }

    componentDidMount() {
        this.getListForCsCategory(this.state.category);
    }

    getListForCsCategory(category) {
        this.getCsBoardList(this.state.board_type, category)
            .then(response => {
                PopModal.closeProgress();
                const data = response.data;
                this.setState({
                    list: data.list,
                    total_cnt: data.total_cnt,
                    is_loading: true
                });
            }).catch(error => {
                PopModal.closeProgress();
                PopModal.alert(error.data);
            });
    }

    /**
     * qna 을 받아올 api
     * @param board_type
     * @param category
     * @returns {*}
     */
    getCsBoardList(board_type, category) {
        return API.cs.selectBoardList(board_type, category);
    }

    onSelectCategory(category, title) {
        if (category !== "ETC") {
            PopModal.progress();
            this.setState({ list: [], category, title, is_loading: false }, () => {
                if (!this.state.is_loading) {
                    this.getListForCsCategory(category);
                }
            });
        }
    }

    isActiveCategory(category) {
        return this.state.category === category;
    }

    render() {
        const { list, title } = this.state;
        return (
            <article className="qna" style={{ marginTop: 15 }}>
                <h3 className="sr-only">자주묻는질문</h3>
                <div className="qna__select-category-box">
                    {CUSTOMERCENTER.map((obj, idx) => {
                        return (
                            <div
                                key={`qna-category__${obj.category}-${idx}`}
                                className={classNames("qna__select-category-unit", { "select": this.isActiveCategory(obj.category) })}
                                onClick={() => this.onSelectCategory(obj.category, obj.name)}
                            >
                                <p>{obj.name}</p>
                            </div>
                        );
                    })}
                </div>
                <Qna list={list} title={title} />
            </article>
        );
    }
}