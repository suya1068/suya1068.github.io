import "./scss/ConceptBanner.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import { CATEGORY, CATEGORY_CODE } from "shared/constant/product.const";
import Img from "shared/components/image/Img";

class ConceptBanner extends Component {
    constructor(props) {
        super(props);

        this.state = {
            category: props.category ? props.category.toLowerCase() : ""
        };
    }

    render() {
        const { gaEvent } = this.props;
        const { category } = this.state;

        if (!category) {
            return (
                <div className="concept__banner">
                    <div className="banner__image">
                        <Img image={{ src: "/banner/concept/bg_concept_banner.jpg", type: "image" }} />
                    </div>
                    <div className="banner__content">
                        <div className="title">촬영에 꼭 필요한 레퍼런스를 찾고계신가요?</div>
                        <div className="description">컨셉 검색으로 기획서를 쉽게 만들어보세요!</div>
                        <div className="banner__button">
                            <a href="/products/concept/product" onClick={() => gaEvent()}>
                                <button className="_button _button__trans__black">바로가기</button>
                            </a>
                        </div>
                    </div>
                </div>
            );
        } else if (!CATEGORY_CODE[category.toUpperCase()]) {
            return null;
        }

        const category_name = CATEGORY[category.toUpperCase()].name;

        return (
            <div className={classNames("concept__banner", category)}>
                <div className="banner__image">
                    <Img image={{ src: `/banner/concept/bg_concept${category ? `_${category}` : ""}_banner.jpg`, type: "image" }} />
                </div>
                <div className="banner__content">
                    <div className="title">{category_name}촬영 레퍼런스를 찾고계신가요?</div>
                    <div className="description">컨셉 검색으로 기획서를 쉽게 만들어보세요!</div>
                    <div className="banner__button">
                        <a href={`/products/concept/${category}`} onClick={() => gaEvent(category, category_name)}>
                            <button className={classNames("_button", category.toUpperCase() === CATEGORY_CODE.PROFILE_BIZ ? "_button__trans__white" : "_button__trans__black")}>바로가기</button>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

ConceptBanner.propTypes = {
    category: PropTypes.string,
    gaEvent: PropTypes.func.isRequired
};

export default ConceptBanner;
