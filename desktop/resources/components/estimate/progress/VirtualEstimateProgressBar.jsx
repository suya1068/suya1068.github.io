import "./virtualEstimateProgressBar.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import { STEP_KEY } from "../helper/const/base.const";

export default class VirtualEstimateProgressBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: props.step,
            data: props.data,
            totalStep: props.totalStep
        };
        this.onChangeStep = this.onChangeStep.bind(this);
    }

    /**
     * 스텝 변경
     * @param e
     */
    onChangeStep(e) {
        const target = e.target;
        const classList = target.classList;
        const checkClass = classList[1];

        if (checkClass) {
            if (typeof this.props.onChangeStep === "function") {
                this.props.onChangeStep(checkClass);
            }
        }
    }

    /**
     * 진행상황 바를 그립니다.
     * @param step
     * @param data
     * @param totalStep
     * @returns {*[]}
     */
    renderProgressBar(step, data, totalStep) {
        const arrKeys = Object.keys(data);
        return arrKeys.map((s, i) => {
            return (
                <div
                    key={`progress-step__${s}`}
                    style={{ width: `calc(100% / ${totalStep} - 1px)` }}
                    className={classNames("progress-step", s, { "active": step === STEP_KEY[s] })}
                >
                    {data[s].CODE}
                    {step === STEP_KEY[s] && i !== totalStep - 1 &&
                    <div className="gt">
                        <img src={`${__SERVER__.img}/common/icon/small_gt.png`} alt="small_gt" />
                    </div>
                    }
                </div>
            );
        });
    }

    render() {
        const { step, totalStep, data } = this.props;
        return (
            <div className="virtual-estimate__progress" onClick={this.onChangeStep}>
                {this.renderProgressBar(step, data, totalStep)}
            </div>
        );
    }
}
