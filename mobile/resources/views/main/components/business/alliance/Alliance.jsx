import "./alliance.scss";
import React, { Component } from "react";
import Img from "shared/components/image/Img";
import { BUSINESS_MAIN } from "shared/constant/main.const";
import utils from "forsnap-utils";
import Swiper from "swiper";

class Alliance extends Component {
    constructor() {
        super();
        this.state = {
            ALLIANCE_CONST: BUSINESS_MAIN.ALLIANCE
        };
    }
    componentDidMount() {
        this.setSwiperConfig();
    }

    setSwiperConfig() {
        this.bizAllianceSwiper = new Swiper(".biz-alliance__list-wrapper-container", {
            slidesPerView: "auto",
            spaceBetween: 15,
            setWrapperSize: true
        });
    }

    render() {
        const { ALLIANCE_CONST } = this.state;
        const IMG_BASE_URL = ALLIANCE_CONST.OLD_IMG_BASE_URL;

        return (
            <section className="biz-alliance">
                <h3 className="sr-only">제휴고객사</h3>
                <article className="biz-alliance__describe">
                    <p className="biz-alliance__describe-content">
                        {utils.linebreak(ALLIANCE_CONST.DESCRIBE)}
                    </p>
                </article>
                <article className="biz-alliance__list">
                    <div className="biz-alliance__list-wrapper-container swiper-container">
                        <div className="biz-alliance__list-wrapper swiper-wrapper">
                            {ALLIANCE_CONST.LIST.map((obj, idx) => {
                                return (
                                    <div className="biz-alliance__list-item swiper-slide" key={`biz-alliance__list__item__${idx}`}>
                                        <Img image={{ src: `${IMG_BASE_URL}${obj.IMG_SRC}`, type: "image" }} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </article>
            </section>
        );
    }
}

export default Alliance;
