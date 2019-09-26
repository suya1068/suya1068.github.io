import "./category.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import { BUSINESS_MAIN } from "shared/constant/main.const";
import utils from "forsnap-utils";
import A from "shared/components/link/A";
import Icon from "desktop/resources/components/icon/Icon";

export default class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CATEGORY: BUSINESS_MAIN.RENEW_CATEGORY || []
        };
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        const { CATEGORY } = this.state;
        this.setCategory(CATEGORY);
    }

    componentDidMount() {
    }

    onEnter(e) {
        const node = e.currentTarget;
        const target = node.querySelector(".biz-category__item-box__image");
        if (target) {
            target.classList.add("on");
        }
    }

    onLeave(e) {
        const node = e.currentTarget;
        const target = node.querySelector(".biz-category__item-box__image");
        if (target) {
            target.classList.remove("on");
        }
    }

    /**
     * ga이벤트를 설정한다.
     * @param code
     */
    gaEvent(code) {
        const eCategory = "기업_메인";
        const eAction = "카테고리 선택";
        const eLabel = utils.format.categoryCodeToName(code);
        utils.ad.gaEvent(eCategory, eAction, eLabel);
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(eAction);
        }
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

    onMovePage(e, code) {
        e.preventDefault();
        const node = e.currentTarget;
        const href = node.href;
        this.gaEvent(code);
        // if (code === "VIDEO_BIZ" || code === "VIDEO") {
        //     href = "/information/video";
        // }
        location.href = href;
    }

    combineTags(tags) {
        const sp_tags = tags.split(",");
        return sp_tags.reduce((result, tag) => {
            result.push(tag);
            return result;
        }, []);
    }

    // onMoveTag(tag) {
    //     location.href = `/products?tag=${tag}`;
    // }

    render() {
        const { CATEGORY } = this.state;
        return (
            <section className="biz-category biz-page__hr biz-panel__dist" id="category">
                <div className="container">
                    <h3 className="biz-panel__title">원하는 촬영을 직접 검색해 보세요.</h3>
                    <div className="biz-category__box">
                        {CATEGORY.map((obj, idx) => {
                            return (
                                <div
                                    key={`category__${obj.code}`}
                                    className="biz-category__item"
                                    role="button"
                                    onMouseEnter={this.onEnter}
                                    onMouseLeave={this.onLeave}
                                >
                                    <A
                                        onClick={e => this.onMovePage(e, obj.code)}
                                        style={{ width: "inherit", height: "inherit" }}
                                        href={`/products?category=${obj.code}`}
                                        className="biz-category__item-box"
                                    >
                                        <div
                                            className="biz-category__item-box__image"
                                        >
                                            <Img image={{ src: obj.src, type: "image" }} isImageCrop />
                                            <div className="biz-category__item-box__image-category">
                                                <span className="category-title" data-category={`${obj.name}촬영`} />
                                            </div>
                                            <div className="image-wrap">
                                                <Icon name="main_enlarge" />
                                            </div>
                                            <div className="biz-category__item-box__image-nickname">
                                                {`${obj.artist && "by"} ${obj.artist}`}
                                            </div>
                                        </div>
                                        <div className="biz-category__item-box__tags">
                                            {this.combineTags(obj.tags).map((tag, i) => {
                                                return (
                                                    <span
                                                        key={`tag_${obj.code}__${i}`}
                                                        //onClick={() => this.onMoveTag(tag)}
                                                    >{`#${tag}`}</span>
                                                );
                                            })}
                                        </div>
                                    </A>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }
}
