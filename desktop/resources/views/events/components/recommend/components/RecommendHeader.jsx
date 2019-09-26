import "./recommendHeader.scss";
import React, { Component } from "react";
import CONST from "shared/constant";
import classNames from "classnames";

export default class RecommendHeader extends Component {
    constructor(props) {
        super(props);
        const category = CONST.PRODUCTS_CATEGORY.reduce((result, obj) => {
            if (["광고", "영상", "의상대여"].indexOf(obj.name) === -1) {
                result.push(obj);
            }

            return result;
        }, []);

        this.state = {
            categoryList: category,
            activeCategory: "WEDDING"
        };
    }

    setCategory(code) {
        this.setState({
            activeCategory: code
        }, () => {
            if (typeof this.props.getCategory === "function") {
                this.props.getCategory(this.getCategory());
            }
        });
    }

    getCategory() {
        return this.state.activeCategory;
    }

    isActive(code) {
        return this.state.activeCategory === code;
    }

    render() {
        const { categoryList } = this.state;
        return (
            <article className="event-recommend-header">
                <h4 className="sr-only">카테고리</h4>
                <div className="container">
                    <div className="category-list">
                        {categoryList.map(obj => {
                            return (
                                <div
                                    onClick={() => this.setCategory(obj.code)}
                                    className={classNames("category-unit", { "active": this.isActive(obj.code) })}
                                    key={`event-recommend-header__category-is__${obj.code}`}
                                >
                                    <span>{obj.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </article>
        );
    }
}
