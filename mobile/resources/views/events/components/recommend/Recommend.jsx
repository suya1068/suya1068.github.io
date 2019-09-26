import "./recommend.scss";
import React, { Component } from "react";
import RecommendHeader from "./components/RecommendHeader";
import RecommendProduct from "./components/RecommendProduct";
import API from "forsnap-api";
import PopModal from "shared/components/modal/PopModal";

export default class Recommend extends Component {
    constructor() {
        super();
        this.state = {
            category: "WEDDING",
            list: [],
            loading: false
        };
        this.getRecommendList = this.getRecommendList.bind(this);
        this.getCategory = this.getCategory.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        const { category } = this.state;
        this.getRecommendList(category);
    }

    getCategory(code) {
        this.getRecommendList(code);
    }

    getRecommendAPI(category) {
        const params = {
            category,
            limit: 4,
            offset: 0
        };
        return API.products.findAllRecommends(params);
    }

    getRecommendList(category) {
        const request = this.getRecommendAPI(category);
        request.then(response => {
            const data = response.data;
            const list = data.list;
            const total = data.total_cnt;
            this.setState({
                list,
                total,
                loading: true
            });
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    render() {
        const { loading, list } = this.state;
        if (!loading) {
            return null;
        }

        return (
            <article className="event-recommend-component">
                <h3 className="sr-only">예약하고 페이백 받기</h3>
                <RecommendHeader
                    ref={instance => (this.slider = instance)}
                    getCategory={this.getCategory}
                />
                <RecommendProduct list={list} />
            </article>
        );
    }
}
