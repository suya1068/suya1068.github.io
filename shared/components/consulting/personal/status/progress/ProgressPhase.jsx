import "./progress_phase.scss";
import React, { Component, Proptypes } from "react";
import StepContainer from "./component/step/StepContainer";
import LandingPhase from "./LandingPhase";
import classNames from "classnames";

export default class ProgressPhase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            product_no: props.product_no || "",
            referer: props.referer || {},
            referer_keyword: props.referer_keyword || {},
            category: props.category,
            access_type: props.access_type,
            device_type: props.device_type,
            // is_enter: props.is_enter || false,
            is_landing: true
        };
        this.onChangeStep = this.onChangeStep.bind(this);
        this.onSubmitConsult = this.onSubmitConsult.bind(this);
        this.renderProcess = this.renderProcess.bind(this);
    }


    /**
     * 상담신청 시작 전 화면을 그린다.
     * @returns {*}
     */
    renderLandingPhase() {
        return <LandingPhase onChangeStep={this.onChangeStep} />;
    }


    /**
     * 단계 변경시 스크롤 위치
     * @param step
     */
    onChangeStep(step) {
        this.setState({ step, is_landing: step === 2 && false }, () => {
            const modal_scroll = document.querySelector(".modal-wrap");
            modal_scroll.scrollTop = 0;

            if (typeof this.props.setStep === "function") {
                this.props.setStep(step);
            }
        });
    }

    /**
     * 신청하기 클릭시
     * @param data
     */
    onSubmitConsult(data) {
        if (typeof this.props.onSubmitConsult === "function") {
            this.props.onSubmitConsult({ ...data });
        }
    }

    /**
     * 선택한 카테고리를 불러온다.
     */
    getCategory() {
        const step_container = this.step_container;
        const category_state = step_container.getCategory();
        return category_state || "";
    }

    renderProcess(flag, data) {
        const { step } = this.state;
        if (!flag) {
            return <StepContainer step={step} {...data} ref={instance => { this.step_container = instance; }} onChangeStep={this.onChangeStep} onSubmitConsult={this.onSubmitConsult} />;
        }
        return this.renderLandingPhase();
    }

    render() {
        const { step, is_landing } = this.state;
        const { category, device_type, referer, referer_keyword, access_type, product_no } = this.props;
        const data = { category, device_type, referer, referer_keyword, access_type, product_no };
        return (
            <div className={classNames("consult_progress", device_type)}>
                {!is_landing &&
                    <div className="consult_progress__header">
                        <h3 className="consult_progress__header-title">상담신청하기</h3>
                        <p className="consult_progress__header-desc">포스냅 담당자가 세부적으로 체크하여 최적의 작가를 빠르게 안내해드립니다.</p>
                    </div>
                }
                <div className="consult-content" style={{ paddingTop: is_landing && 0 }}>
                    {this.renderProcess(is_landing, data)}
                </div>
                {this.step_container && this.step_container.getCurrentState() === "advice_choice" ?
                    null :
                    <div className="dots">
                        <div className={classNames("dot", step === 1 && "active")} />
                        <div className={classNames("dot", step === 2 && "active")} />
                        <div className={classNames("dot", step === 3 && "active")} />
                        <div className={classNames("dot", (step === 4 || step === 5) && "active")} />
                        {/*{step === 5 && <div className={classNames("dot", step === 5 && "active")} />}*/}
                    </div>
                }
            </div>
        );
    }
}
