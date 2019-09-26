import utils from "forsnap-utils";
import React, { Component, PropTypes } from "react";
// import Img from "shared/components/image/Img";
import PopModal from "shared/components/modal/PopModal";
// import classNames from "classnames";
// import { STEP_KEY } from "../helper/const/base.const";
import LastStep from "./LastStep";
import StepsForPc from "./StepsForPc";
import StepsForMobile from "./StepsForMobile";

export default class VirtualEstimateContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: props.step,
            form: props.form,
            data: props.data,
            totalPrice: props.totalPrice,
            totalStep: props.totalStep,
            estimateUtils: props.estimateUtils,
            category: props.category,
            stepData: {},
            isEstimate: false,              // 견적 산출 알림 노출 플래그 값
            isInit: false                   // 다시 계산하기 기능 플래그 값
        };

        // interaction
        this.onChange = this.onChange.bind(this);               // input 데이터 저장 기능
        this.onCheck = this.onCheck.bind(this);                 // 체크박스 기능
        this.onRadio = this.onRadio.bind(this);
        // --
        this.setStepProcess = this.setStepProcess.bind(this);
        this.getReadyStepActive = this.getReadyStepActive.bind(this);
        this.onSetStep = this.onSetStep.bind(this);
        this.receiveChangeForm = this.receiveChangeForm.bind(this);
        this.onActiveStep = this.onActiveStep.bind(this);
        // this.onChangeStep = this.onChangeStep.bind(this);
        this.receiveFlag = this.receiveFlag.bind(this);
    }

    componentWillMount() {
        const { step, data } = this.props;
        this.setState({ stepData: data[step] });
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

    // 다시 시작하기 기능 플래그 저장
    receiveInitFlag(flag) {
        const { form } = this.props;
        if (flag) {
            this.setState({ form, isInit: false });
        }
    }

    /**
     * 견적산출완료 문구 표시 플래그
     * @param flag
     */
    receiveFlag(flag) {
        if (flag) {
            this.setState({ isEstimate: flag }, () => {
                setTimeout(() => {
                    this.setState({ isEstimate: false });
                }, 1000);
            });
        }
    }

    /**
     * 현재 스텝의 활성화 상태
     * @returns {*}
     */
    getReadyStepActive() {
        const { stepData } = this.state;
        return stepData.ACTIVE;
    }

    /**
     * 현재 스텝을 그립니다.
     * @param currentData
     * @returns {*}
     */
    renderStep(currentData) {
        const { category, step, device_type } = this.props;
        const { form } = this.state;
        let content = (
            <StepsForPc
                data={currentData}
                category={category}
                step={step}
                form={form}
                onChange={this.onChange}
                onCheck={this.onCheck}
                onRadio={this.onRadio}
            />
        );

        if (device_type === "mobile") {
            content = (
                <StepsForMobile
                    data={currentData}
                    category={category}
                    device_type={device_type}
                    step={step}
                    form={form}
                    onChange={this.onChange}
                    onCheck={this.onCheck}
                    onRadio={this.onRadio}
                />
            );
        }

        return content;
    }

    /**
     * 체크박스 기능
     * @param e
     * @param data
     */
    onCheck(e, data) {
        const { estimateUtils, onChangeStepData } = this.props;
        const { form } = this.state;
        const _allData = this.state.data;
        const target = e.currentTarget;
        const propKey = data.CODE;
        const isChecked = target.classList[1] === "select";

        if (isChecked) {
            target.classList.remove("select");
        } else {
            target.classList.add("select");
        }

        if (this.props.category === "FASHION") {
            if (!isChecked && propKey === "nukki") {
                if (!form.nukki_kind) {
                    _allData.SECOND.ACTIVE = false;
                    if (typeof onChangeStepData === "function") {
                        onChangeStepData(_allData);
                    }
                }
            }
        }

        this.setState({
            form: { ...estimateUtils.onCheck(form, propKey, isChecked) }
        }, () => {
            if (typeof this.props.onChangeForm === "function") {
                this.props.onChangeForm(this.state.form);
            }
            this.onSetStep();
        });
    }

    /**
     * 라디오 버튼 기능
     * @param code
     */
    onRadio(e, code) {
        e.preventDefault();
        const { estimateUtils } = this.props;
        const { form, data } = this.state;
        const location = this.state.form.location;

        if (this.props.category === "FOOD") {
            if (location !== "outside" && code === "outside") {
                data.THIRD.ACTIVE = false;
                if (typeof this.props.onChangeStepData === "function") {
                    this.props.onChangeStepData(data);
                }
            }
        }

        if (this.props.category === "VIDEO_BIZ") {
            const shotKind = this.state.form.shot_kind;
            if ((shotKind === "viral_video" && code === "interview_video") || (shotKind === "interview_video" && code === "viral_video")) {
                data.THIRD.ACTIVE = false;
                estimateUtils.changeLastFlag(false);
                if (typeof this.props.onChangeStepData === "function") {
                    this.props.onChangeStepData(data);
                }
            }
        }

        if (this.props.category === "BEAUTY") {
            const directingKind = this.state.form.directing_kind;

            if (directingKind !== "basic") {
                data.THIRD.ACTIVE = false;
                //estimateUtils.changeLastFlag(false);

                if (typeof this.props.onChangeStepData === "function") {
                    this.props.onChangeStepData(data);
                }
            }
        }

        this.setState({
            form: { ...estimateUtils.onRadio(form, code) }
        }, () => {
            this.props.onChangeForm(this.state.form);
            this.onSetStep();
        });
    }

    /**
     * 인풋창 데이터를 저장합니다.
     * @param e
     * @param inputType
     */
    onChange(e, inputType) {
        const { estimateUtils } = this.props;
        const { form, timer } = this.state;
        const _form = Object.assign({}, form);
        const target = e.target;
        const name = target.name;
        let value = target.value;

        if (timer) {
            clearTimeout(timer);
        }

        if (inputType === "number") {
            value = value.replace(/,/gi, "").replace(/\D/gi, "");

            if (name === "total_time") {
                if (value > 99) {
                    PopModal.alert("2시간~99시간까지 입력 가능합니다.\n장기 촬영의 경우 고객센터로 문의해 주세요.");
                    value = 99;
                }
            } else if (name !== "total_time" && value > 99) {
                PopModal.alert("1~99컷까지 입력 가능합니다.\n대량촬영의 경우 고객센터로 문의주시면 별도계약 가능합니다.");
                value = 99;
            }
        }

        this.setState({
            form: { ...estimateUtils.onChange(_form, name, value) }
            // form: { ...form, [name]: value }
        }, () => {
            if (typeof this.props.onCheckMoveFlag === "function") {
                this.props.onCheckMoveFlag(false);
            }
            this.state.timer = setTimeout(() => {
                this.setState({ except: true }, () => {
                    clearTimeout(this.state.timer);
                    if (this.state.form.total_time === "1") {
                        this.state.form.total_time = "2";
                    }
                    this.receiveChangeForm(this.state.form);
                });
                this.onSetStep();
            }, 500);
            //
            // if (JSON.stringify(form) !== JSON.stringify(this.state.form)) {
            //     console.log("5");
            //     this.state.timer = setTimeout(() => {
            //         this.setState({ except: true }, () => {
            //             clearTimeout(this.state.timer);
            //             if (this.state.form.total_time === "1") {
            //                 this.state.form.total_time = "2";
            //             }
            //             this.receiveChangeForm(this.state.form);
            //         });
            //         this.onSetStep();
            //     }, 500);
            // }
        });
    }

    /**
     * 폼 데이터 전달
     * @param form
     * @param flag
     */
    receiveChangeForm(form) {
        if (typeof this.props.onChangeForm === "function") {
            this.setState({ form }, () => {
                this.onSetStep();
                this.props.onChangeForm(form);
            });
        }
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
     * 스텝 셋
     * @param step
     * @returns {*}
     */
    setStepProcess(step) {
        const { totalStep, estimateUtils } = this.props;
        const { form, data } = this.state;
        const st = estimateUtils.stepToNumber(step);

        estimateUtils.setStepProcess(data, { step, totalStep, st, form });

        return data;
    }

    onActiveStep() {
        this.onSetStep();
    }

    render() {
        const { step, form, totalStep, category, estimateUtils, device_type } = this.props;
        const { stepData, isEstimate } = this.state;
        const caption = device_type === "mobile" ? utils.linebreak(stepData.CAPTION) : stepData.CAPTION;
        const title = device_type === "mobile" ? stepData.TITLE : `${stepData.CODE}. ${stepData.TITLE}`;

        return (
            <div className="virtual-estimate__steps">
                <p className="virtual-estimate__steps__title" style={{ marginBottom: stepData.CAPTION ? 5 : 10 }}>{title}</p>
                {stepData.CAPTION &&
                <p className="virtual-estimate__steps__caption">{caption}</p>
                }
                <div className="virtual-estimate__steps__content">
                    {estimateUtils.stepToNumber(step) !== totalStep ?
                        this.renderStep(stepData) :
                        <LastStep
                            data={stepData}
                            form={form}
                            category={category}
                            device_type={device_type}
                            onChangeForm={this.receiveChangeForm}
                            onRadio={this.onRadio}
                            estimateUtils={estimateUtils}
                            onCheckMoveFlag={this.props.onCheckMoveFlag}
                        />
                    }
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
