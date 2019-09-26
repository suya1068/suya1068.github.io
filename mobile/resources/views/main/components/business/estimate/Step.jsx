import "./step.scss";
import React, { Component, PropTypes } from "react";
import { BUSINESS_MAIN, PERSONAL_MAIN } from "shared/constant/main.const";
import utils from "forsnap-utils";
import classNames from "classnames";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";

const EstimateStep = props => {
    const STEP_DATA = BUSINESS_MAIN.ESTIMATE_STEP;

    /**
     * 기업메인 하단견적요청 gaEvent
     */
    const gaEvent_bizMain = () => {
        const eCategory = "기업메인";
        const eAction = "기업";
        const eLabel = "하단견적요청";
        utils.ad.gaEvent(eCategory, eAction, eLabel);

        if (typeof props.gaEvent === "function") {
            props.gaEvent(eLabel);
        }
    };

    const onConsult = () => {
        gaEvent_bizMain();

        if (typeof props.onConsult === "function") {
            props.onConsult(CONSULT_ACCESS_TYPE.MAIN_ESTIMATE.CODE);
        }
    };

    return (
        <div className="m_main-estimate-step">
            <div className="step-container">
                {STEP_DATA.map(obj => {
                    const isNo4 = obj.no === 4;
                    return (
                        <div className="step" key={`estimate-step__${obj.no}`}>
                            <p className="step-no">STEP <span style={{ fontWeight: "bold" }}>{obj.no}</span></p>
                            <div className="step-info">
                                {!isNo4 ? <icon className={`m-icon m-icon-${obj.icon}`} /> : null}
                                <p className="title">{obj.title}</p>
                                <p className="description">{obj.description}</p>
                                {obj.no === 4 ?
                                    <div>
                                        <button
                                            className={classNames("button estimate-button button-block", "button__theme__enter")}
                                            onClick={onConsult}
                                            style={{ whiteSpace: "pre-wrap", wordBreak: "keep-all" }}
                                        >
                                            무료견적 요청하기
                                        </button>
                                    </div>
                                    : null
                                }
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EstimateStep;
