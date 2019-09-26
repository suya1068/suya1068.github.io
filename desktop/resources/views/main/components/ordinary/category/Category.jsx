import "./category.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import { PERSONAL_MAIN } from "shared/constant/main.const";
import utils from "forsnap-utils";
import classNames from "classnames";

export default class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CATEGORY: this.combineCategoryList(PERSONAL_MAIN.CATEGORY),
            activeIndex: 0
        };
    }

    combineCategoryList(list) {
        return list.reduce((result, obj) => {
            if (obj.code !== "DRESS_RENT") {
                result.push(obj);
            }
            return result;
        }, []);
    }

    /**
     * ga이벤트를 설정한다.
     * @param code
     */
    gaEvent(code) {
        const eCategory = "개인메인";
        const eAction = "";
        const eLabel = "카테고리";
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    onMovePage(e, code) {
        e.preventDefault();
        const node = e.currentTarget;
        const href = node.href;
        this.gaEvent(code);
        location.href = href;
    }

    render() {
        const { CATEGORY } = this.state;
        return (
            <div className="main-category" id="category">
                <div className="container">
                    <h3 className="section-title">카테고리</h3>
                    <div className="category-container">
                        <div className="category-unit__outer">
                            {CATEGORY.map((obj, idx) => {
                                const nick_name = obj.code === "VIDEO" ? "" : `by ${obj.artist}`;
                                return (
                                    <a
                                        role="button"
                                        href={obj.code === "VIDEO" ? "/information/video" : `/products?category=${obj.code}`}
                                        className={classNames("category-unit")} key={`category__${obj.code}`}
                                        onClick={e => this.onMovePage(e, obj.code)}
                                    >
                                        <div className="category-unit__inner">
                                            <div className="category-unit__inner-content">
                                                <p className="name">{obj.name}</p>
                                                <p className="tags">{obj.tags}</p>
                                            </div>
                                        </div>
                                        <p className="artist_nickname">{nick_name}</p>
                                        <Img image={{ src: obj.src_p, type: "image" }} isImageCrop />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
