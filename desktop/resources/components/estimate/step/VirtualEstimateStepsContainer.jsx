import React, { Component, PropTypes } from "react";
import PopModal from "shared/components/modal/PopModal";
import LastStep from "./LastStep";
import { STEP_KEY } from "../helper/const/base.const";
import classNames from "classnames";
import VirtualEstimateSteps from "./VirtualEstimateSteps";

export default class VirtualEstimateStepsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: props.step,
            form: props.form,
            data: props.data,
            totalPrice: props.totalPrice,
            totalStep: props.totalStep,
            stepData: {},
            isEstimate: false,              // 견적 산출 알림 노출 플래그 값
            isInit: false                   // 다시 계산하기 기능 플래그 값
        };
        // interaction
        this.onChange = this.onChange.bind(this);               // input 데이터 저장 기능
        this.onCheck = this.onCheck.bind(this);                 // 체크박스 기능
        this.onSetStep = this.onSetStep.bind(this);
        this.onChangeStep = this.onChangeStep.bind(this);
    }

    componentWillMount() {
        const { step, data } = this.props;
        this.setState({ stepData: data[step] });
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const { step } = nextProps;
        if (this.props.step !== step) {
            this.setState({
                stepData: this.props.data[step],
                form: nextProps.form
            }, () => {
                this.onSetStep(step);
            });
        }
    }


    /**
     * 스텝 네비게이션을 그린다.
     * @param currentStep
     * @returns {*}
     */
    renderArrow(currentStep) {
        const { data, totalStep } = this.props;
        const stepToNumber = this.stepToNumber(currentStep);
        const test = data[currentStep].ACTIVE;

        return (
            <div className="step-arrow">
                {stepToNumber !== 1 &&
                <div className={classNames("step-left-arrow", "active")} onClick={() => this.onChangeStep(stepToNumber, "prev")}>
                    <div className="arrow-box">
                        <i className="_icon _icon__arrow__b_l" />
                    </div>
                    {`Step0${stepToNumber - 1}`}
                </div>
                }
                {stepToNumber !== totalStep &&
                <div className={classNames("step-right-arrow", { "active": test && (data.FIRST.ACTIVE || data.SECOND.ACTIVE) })} onClick={() => this.onChangeStep(stepToNumber, "next")}>
                    {`Step0${stepToNumber + 1}`}
                    <i className={`_icon _icon__arrow__${test && (data.FIRST.ACTIVE || data.SECOND.ACTIVE) ? "b_r" : "mr"}`} />
                </div>
                }
            </div>
        );
    }

    onChangeStep(stepNo, side) {
        let step = stepNo === 1 ? "FIRST" : "";
        if (side === "prev") {
            if (stepNo === 2) {
                step = "FIRST";
            } else if (stepNo === 3) {
                step = "SECOND";
            }
        } else {
            if (stepNo === 1) {
                step = "SECOND";
            } else if (stepNo === 2) {
                step = "THIRD";
            }
        }

        if (typeof this.props.onChangeStep === "function") {
            this.props.onChangeStep(step);
        }
    }

    /**
     * 체크박스 기능
     * @param e
     * @param data
     */
    onCheck(e, data) {
        // const { step } = this.props;
        const { form } = this.state;
        const target = e.currentTarget;
        const propKey = data.CODE;
        const isChecked = target.classList[1] === "select";

        let value = "";

        if (propKey === "size") {
            value = isChecked ? "small" : "large";
        }

        if (propKey === "material") {
            value = isChecked ? "glossless" : "gloss";
        }

        if (isChecked) {
            target.classList.remove("select");
        } else {
            target.classList.add("select");
        }

        this.setState({
            form: { ...form, [propKey]: value }
        }, () => {
            if (typeof this.props.onChangeForm === "function") {
                this.props.onChangeForm(this.state.form);
            }
            this.onSetStep();
        });
    }

    /**
     * 인풋창 데이터를 저장합니다.
     * @param e
     * @param inputType
     */
    onChange(e, inputType) {
        const { form } = this.state;
        const target = e.target;
        let name = target.name;
        let value = target.value;

        if (this.state.timer) {
            clearTimeout(this.state.timer);
        }

        if (inputType === "number") {
            value = value.replace(/,/gi, "").replace(/\D/gi, "");

            if (value > 99) {
                PopModal.alert("1~99컷까지 입력 가능합니다.\n대량촬영의 경우 고객센터로 문의주시면 별도계약 가능합니다.");
                value = 99;
            }
        }

        if (name === "nukki_shot") {
            name = "number";
        } else if (name === "directing_shot") {
            name = "directing_number";
        }

        if (target.name === "nukki_shot") {
            let shot_kind = "nukki_shot";
            if (Number(value) && form.directing_number) {
                shot_kind = "n_plus_d_shot";
            } else if (!Number(value) && form.directing_number) {
                shot_kind = "directing_shot";
            } else if (!Number(value) && !form.directing_number) {
                shot_kind = "";
            }

            form.shot_kind = shot_kind;
        } else if (target.name === "directing_shot") {
            let shot_kind = "directing_shot";
            if (Number(value) && (form.directing_kind !== "proxy" || form.directing_kind !== "directing_proxy")) {
                form.directing_kind = "basic";
            }

            if (!Number(value)) {
                form.directing_kind = "";
                form.proxy_number = "";

                if (Object.hasOwnProperty.call(form, "directing_proxy_number")) {
                    form.directing_proxy_number = "";
                }
            }
            if (Number(value) && form.number) {
                shot_kind = "n_plus_d_shot";
            } else if (!Number(value) && form.number) {
                shot_kind = "nukki_shot";
            } else if (!Number(value) && !form.number) {
                shot_kind = "";
                form.total_price = "";
            }
            form.shot_kind = shot_kind;
        }

        if (Number(value) === 0) {
            value = "";
        }

        this.setState({
            form: { ...form, [name]: value }
        }, () => {
            if (typeof this.props.onCheckMoveFlag === "function") {
                this.props.onCheckMoveFlag(false);
            }
            if (JSON.stringify(form) !== JSON.stringify(this.state.form)) {
                this.state.timer = setTimeout(() => {
                    this.setState({ except: true }, () => {
                        clearTimeout(this.state.timer);
                        this.receiveChangeForm(this.state.form);
                    });
                    this.onSetStep();
                }, 500);
            }
        });
    }

    /**
     * 폼 데이터 전달
     * @param form
     * @param flag
     */
    receiveChangeForm(form, flag = false) {
        if (typeof this.props.onChangeForm === "function") {
            this.setState({ form }, () => {
                this.onSetStep();
                this.props.onChangeForm(form);
            });
        }
    }
    /**
     * 현재스텝을 숫자로 변경한다.
     * @param currentStep
     * @returns {null}
     */
    stepToNumber(currentStep) {
        let stepToNumber = null;
        switch (currentStep) {
            case STEP_KEY.FIRST: stepToNumber = 1; break;
            case STEP_KEY.SECOND: stepToNumber = 2; break;
            case STEP_KEY.THIRD: stepToNumber = 3; break;
            default:
        }

        return stepToNumber;
    }

    onActiveStep() {
        this.onSetStep();
    }

    setStepProcess(step) {
        const { totalStep } = this.props;
        const { form, data } = this.state;
        const st = this.stepToNumber(step);

        if (st === 1) {
            const prop = data[step].PROP;
            let name = "number";
            const test = prop.some(p => {
                if (p.CODE === "directing_shot") {
                    name = "directing_number";
                }
                return form[name];
            });

            if (test) {
                data[step].ACTIVE = true;
            } else {
                data[step].ACTIVE = false;
            }
        } else if (st !== totalStep && st === 2) {
            data[step].ACTIVE = true;
        } else if (st === totalStep) {
            if ((form.shot_kind !== "nukki_shot" && form.directing_kind && form.note) || (form.shot_kind === "nukki_shot" && form.note)) {
                data[step].ACTIVE = true;
            } else {
                data[step].ACTIVE = false;
            }
        }

        return data;
    }


    /**
     * 스텝 변경 데이터 저장
     * @param step
     */
    onSetStep(step = this.props.step) {
        this.setState({
            data: this.setStepProcess(step)
        }, () => {
            if (typeof this.props.onChangeStepData === "function") {
                this.props.onChangeStepData(this.state.data);
            }
        });
    }

    /**
     * 현재 스텝의 활성화 상태
     * @returns {*}
     */
    getReadyStepActive() {
        const { stepData } = this.state;
        return stepData.ACTIVE;
    }

    render() {
        const { step, form, totalStep } = this.props;
        const { stepData, isEstimate } = this.state;

        return (
            <div className="virtual-estimate__steps">
                <p className="virtual-estimate__steps__title">{`${stepData.CODE}. ${stepData.TITLE}`}</p>
                <p className="virtual-estimate__steps__caption">{stepData.CAPTION}</p>
                {this.stepToNumber(step) !== totalStep ?
                    <VirtualEstimateSteps
                        form={form}
                        stepData={stepData}
                        onChange={this.onChange}
                    /> :
                    <LastStep
                        data={stepData}
                        form={form}
                        onChangeForm={this.receiveChangeForm}
                        onActiveStep={this.onActiveStep}
                        onCheckMoveFlag={this.props.onCheckMoveFlag}
                    />
                }
                <div className="virtual-estimate__steps__arrow">
                    {this.renderArrow(step)}
                </div>
                {isEstimate &&
                <div className="estimate-overlay">
                    견적 산출이 완료되었습니다.
                </div>
                }
            </div>
        );
    }
}
