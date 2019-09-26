import "./screenMiddle.scss";
import React, { Component } from "react";
import utils from "forsnap-utils";

const ScreenMiddle = () => {
    return (
        <article className="biz-wide-screen middle">
            <h3 className="sr-only">촬영진행과정</h3>
            <div className="middle-process-box">
                <div className="middle-process-box-div1">
                    <p className="middle-process-box__title">{utils.linebreak("최고의 촬영을 위해\n'포스냅'은 이렇게 진행합니다.")}</p>
                </div>
                <div className="middle-process-box-div2">
                    <div className="middle-process-box__steps">
                        <div className="middle-process-box__steps-step">
                            <div className="step-icon-box">
                                <i className="m-icon m-icon-process-step1" />
                            </div>
                            <p>고객님의<br /> 견적요청 작성</p>
                        </div>
                        <div className="middle-process-box__steps-step">
                            <div className="step-icon-box">
                                <i className="m-icon m-icon-process-step2" />
                            </div>
                            <p>전담매니저와<br /> 촬영과정 상담</p>
                        </div>
                        <div className="middle-process-box__steps-step">
                            <div className="step-icon-box">
                                <i className="m-icon m-icon-process-step3" />
                            </div>
                            <p>스튜디오<br /> 촬영상세 조율</p>
                        </div>
                        <div className="middle-process-box__steps-step">
                            <div className="step-icon-box">
                                <i className="m-icon m-icon-process-step4" />
                            </div>
                            <p>견적서 수령 및<br /> 촬영진행</p>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ScreenMiddle;
