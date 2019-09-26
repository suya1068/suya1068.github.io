import "./result.scss";
import React, { Component, PropTypes } from "react";
import { BUSINESS_MAIN } from "shared/constant/main.const";
import Img from "shared/components/image/Img";
import Icon from "desktop/resources/components/icon/Icon";
import utils from "forsnap-utils";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";

export default class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: BUSINESS_MAIN.RESULT_IMAGES
        };
        this.onClick = this.onClick.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    onClick() {
        this.gaEvent();
        if (typeof this.props.onConsult === "function") {
            this.props.onConsult({ access_type: CONSULT_ACCESS_TYPE.MAIN_SAMPLE.CODE });
        }
    }

    gaEvent() {
        utils.ad.gaEvent("기업_메인", "샘플촬영 신청하기", "클릭");
    }

    render() {
        const { images } = this.state;
        return (
            <section className="biz-result biz-panel__dist">
                <div className="container">
                    <p className="biz-result__sub">촬영 결과물이 궁금해요!</p>
                    <div className="biz-result__title-wrap">
                        <Icon name="free" />
                        <h3 className="biz-panel__title" style={{ marginLeft: 10 }}>
                            샘플촬영을 통해 미리 결과물을 확인하실 수 있습니다.
                        </h3>
                    </div>
                    <div className="biz-result__box">
                        <p className="biz-result__desc">
                            처음해보는 작업이라 결과물 예측이 잘 되지 않으시거나 결과물이 궁금하시다면,<br />
                            포스냅에서 제공하는 샘플촬영을 통해 일부 촬영의 결과물을 받아보세요.
                        </p>
                    </div>
                    <div className="biz-result__images">
                        {images.map((image, idx) => {
                            return (
                                <div key={`result_image__${idx}`} >
                                    <Img image={{ src: image.src, type: "image" }} />
                                </div>
                            );
                        })}
                    </div>
                    <div className="button-div">
                        <div className="biz-page__hover_btn" onClick={this.onClick} />
                        <button
                            className="_button biz-page__btn biz-result__box-btn"
                            // onClick={this.onClick}
                        >샘플촬영 신청하기</button>
                    </div>
                </div>
            </section>
        );
    }
}
