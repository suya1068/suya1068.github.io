import "./estimate.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import EstimateStep from "./Step";
import utils from "forsnap-utils";

const Estimate = props => {
    const title = "무료견적 요청하기";
    const desciption = "광고사진촬영, CF, 바이럴 영상제작 등\n 전문촬영의 무료 견적을 요청해보세요.";

    const gaEvent = action => {
        if (typeof props.gaEvent === "function") {
            props.gaEvent(action);
        }
    };

    const onConsult = access_type => {
        if (typeof props.onConsult === "function") {
            props.onConsult(access_type);
        }
    };

    return (
        <div className="m_main-estimate" id="estimate">
            <div className={classNames("text-wrap", "enter")}>
                <h3 className="estimate-text">{title}</h3>
                <h3 className="estimate-description">{utils.linebreak(desciption)}</h3>
            </div>
            <EstimateStep gaEvent={gaEvent} onConsult={onConsult} />
        </div>
    );
};

export default Estimate;
