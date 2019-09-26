import "./category.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import { BUSINESS_MAIN } from "shared/constant/main.const";
import utils from "forsnap-utils";
import A from "shared/components/link/A";
import classNames from "classnames";

export default class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CATEGORY: BUSINESS_MAIN.CATEGORY || [],
            activeIndex: 0
        };
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        const { CATEGORY } = this.state;
        this.setCategory(CATEGORY);
    }

    componentDidMount() {
    }

    /**
     * 카테고리 목록을 설정한다.
     * @param categoryData
     */
    setCategory(categoryData) {
        const category = categoryData.reduce((result, obj) => {
            if (obj.code !== "MODEL") {
                result.push(obj);
            }
            return result;
        }, []);

        this.setState({
            CATEGORY: category
        });
    }

    /**
     * ga이벤트를 설정한다.
     * @param code
     */
    gaEvent(code) {
        const eCategory = "기업메인";
        const eAction = "";
        const eLabel = "카테고리";
        utils.ad.gaEvent(eCategory, eAction, eLabel);
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(eLabel);
        }
    }

    onMovePage(e, code) {
        e.preventDefault();
        const node = e.currentTarget;
        this.gaEvent(code);
        location.href = node.href;
    }

    render() {
        const { CATEGORY } = this.state;
        return (
            <div className="main-category-business" id="category">
                <h3 className="category-text">카테고리</h3>
                <div className="category-container">
                    <div className="category-unit__outer">
                        {CATEGORY.map(obj => {
                            return (
                                <A
                                    role="button"
                                    onClick={e => this.onMovePage(e, obj.code)}
                                    href={`/products?category=${obj.code}`}
                                    className={classNames("category-unit-per", { "block": obj.code === "VIDEO" })}
                                    key={`category__${obj.code}`}
                                >
                                    <h4 className="sr-only">{obj.name}</h4>
                                    <div className="category-unit-per__inner">
                                        <div className="category-unit-per__inner-content">
                                            <p className="name">{obj.name}</p>
                                            <p className="tags">{utils.linebreak(obj.tags)}</p>
                                        </div>
                                    </div>
                                    <p className="artist_nickname">{obj.artist && `by ${obj.artist}`}</p>
                                    <Img image={{ src: obj.src_m, type: "image" }} isImageCrop />
                                </A>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
