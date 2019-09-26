import "./scss/ConceptBanner.scss";
import React, { Component, PropTypes } from "react";

import Img from "shared/components/image/Img";

class ConceptBanner extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="concept__banner">
                <div className="banner__image">
                    <Img image={{ src: "/banner/concept/bg_concept_banner.jpg", type: "image" }} />
                </div>
                <div className="banner__content">
                    <div className="title">코스메틱촬영 레퍼런스를 찾고계신가요?</div>
                    <div className="description">컨셉 검색으로 기획서를 쉽게 만들어보세요!</div>
                    <div className="banner__button">
                        <a href="/products/concept/beauty"><button className="_button _button__trans__black">바로가기</button></a>
                    </div>
                </div>
            </div>
        );
    }
}

export default ConceptBanner;
