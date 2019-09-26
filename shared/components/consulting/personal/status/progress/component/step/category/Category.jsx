import "./category.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import ADVICE_ORDER from "shared/constant/advice.const";
import Img from "shared/components/image/Img";

export default class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_disabled: true,
            category: [],
            is_loading: false,
            select_category: props.category || "",
            biz_category: ["PRODUCT", "EVENT", "FOOD", "FASHION", "INTERIOR", "PROFILE_BIZ", "VIDEO_BIZ"]
        };
        this.onNext = this.onNext.bind(this);
        this.getCategory = this.getCategory.bind(this);
        this.onCheckCategory = this.onCheckCategory.bind(this);
    }

    componentWillMount() {
        this.setState(this.combineCategorys(ADVICE_ORDER.CATEGORY));
    }

    componentDidMount() {
        const { select_category } = this.state;
        if (select_category) {
            this.onCheckCategory(select_category);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.select_category !== nextProps.category) {
            this.onCheckCategory(nextProps.category);
        }
    }

    /**
     * 카테고리를 재배열한다.
     * @param list
     * @returns {{category: Array, is_loading: boolean}}
     */
    combineCategorys(list) {
        const { biz_category } = this.state;

        const order_display = [];
        biz_category
            .reduce((result, obj) => {
                const item = list.filter(list_item => {
                    return list_item.code === obj;
                })[0];
                result.push(item);
                return result;
            }, order_display);
        return { category: order_display, is_loading: true };
    }

    /**
     * 다음단계로 이동한다.
     * @param e
     */
    onNext(e) {
        if (typeof this.props.onNext === "function") {
            this.props.onNext(2);
        }
    }

    /**
     * 카테고리를 선택한다.
     * @param code
     */
    onCheckCategory(code) {
        this.setState({ select_category: code, is_disabled: false });
    }

    /**
     * 선택한 카테고리와 일치하는지 판단한다.
     * @param code
     * @returns {boolean}
     */
    isSelectCategory(code) {
        return this.state.select_category === code;
    }

    /**
     * 카테고리를 반환한다.
     * @returns {*|string}
     */
    getCategory() {
        return this.state.select_category;
    }

    /**
     * 카테고리 선택화면을 렌더링한다.
     * @param list
     * @returns {*}
     */
    renderCategory(list) {
        if (Array.isArray(list) && list.length > 0) {
            return (
                <div className="step-content__container">
                    {list.map((obj, idx) => {
                        return (
                            <div className={classNames("step-content__category", { "select": this.isSelectCategory(obj.code) })} key={`step-content__category_${obj.code}`} onClick={() => this.onCheckCategory(obj.code)}>
                                <div className="category-image">
                                    <Img image={{ src: obj.src, type: "image" }} isCrop />
                                    {this.isSelectCategory(obj.code) &&
                                        <div className="category_select" >
                                            <div className="check-mark" />
                                        </div>
                                    }
                                    <div className="category-name">{obj.name}</div>
                                </div>
                                <div className="category-title">
                                    <p className="category-title__title">{`by ${obj.artist}`}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return "";
    }

    render() {
        const { is_disabled, category, is_loading } = this.state;
        return (
            <div className="consult_progress__step-category">
                <div className="consult_progress__step-category-header">
                    <h4 className="consult_progress__step-category-header-title"><span style={{ color: "#ff326c" }}>[필수]</span> 원하는 촬영을 선택해주세요.</h4>
                </div>
                <div className="step-content" ref={node => { this.category = node; }}>
                    {is_loading && this.renderCategory(category)}
                </div>
                <div className="consult_progress__step-button">
                    <div className="button-box one-button" style={{ width: "100%" }}>
                        <button className={classNames("theme_black", { "disabled": is_disabled })} disabled={is_disabled && "disabled"} onClick={this.onNext}>다음단계로 진행</button>
                    </div>
                </div>
            </div>
        );
    }
}
