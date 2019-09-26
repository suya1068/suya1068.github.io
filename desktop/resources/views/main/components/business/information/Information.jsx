import "./information.scss";
import React, { Component, PropTypes } from "react";
import { BUSINESS_MAIN } from "shared/constant/main.const";
import utils from "forsnap-utils";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";

export default class Information extends Component {
    constructor(props) {
        super(props);
        this.state = {
            information: BUSINESS_MAIN.INFORMATION_V2
        };
        this.onClick = this.onClick.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    onClick() {
        this.gaEvent();
        if (typeof this.props.onConsult === "function") {
            this.props.onConsult({ access_type: CONSULT_ACCESS_TYPE.MAIN_ESTIMATE.CODE });
        }
    }

    gaEvent() {
        utils.ad.gaEvent("기업_메인", "견적신청하기", "클릭");
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("견적신청하기");
        }
    }

    render() {
        const { information } = this.state;
        return (
            <section className="biz-information biz-page__hr biz-panel__dist">
                <div className="container">
                    <p className="biz-information__sub">촬영이 필요한데 어떻게 진행해야 하는지 모르겠어요.</p>
                    <h3
                        className="biz-panel__title"
                        style={{ marginBottom: 20 }}
                    >
                        촬영에 필요한 모든 분야의 상담을 한번에 받을 수 있습니다.
                    </h3>
                    <div className="biz-information__box">
                        <p className="biz-information__desr">
                            촬영에서부터 모델, 헤어메이크업 및 스타일리스트 섭외,<br />
                            장소섭외, 편집까지 촬영과 관련된 모든 부분의 상담 및 합리적인 견적을 한번에 받아 보실 수 있습니다.
                        </p>
                        <div className="biz-information__box__abs-box">
                            {information.map((obj, idx) => {
                                return (
                                    <div className="images-row" key={`information__rows__${idx}`}>
                                        <i className={`icon-${obj.ICON}`} />
                                        <div className="name">{obj.NAME}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="button-div">
                            <div className="biz-page__hover_btn" onClick={this.onClick} />
                            <button
                                className="_button biz-page__btn biz-information__box-btn"
                            >견적 신청하기</button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
