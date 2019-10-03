import "./virtualEstimateSteps.scss";
import utils from "forsnap-utils";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import PopModal from "shared/components/modal/PopModal";
import classNames from "classnames";
import { STEP_KEY } from "../helper/const/base.const";
import LastStep from "./LastStep";

export default class VirtualEstimateContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: props.step,
            form: props.form,
            data: props.data,
            access_type: props.access_type,
            totalPrice: props.totalPrice,
            totalStep: props.totalStep,
            estimateUtils: props.estimateUtils,
            category: props.category,
            stepData: {},
            isTest: true,
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
        this.onChangeStep = this.onChangeStep.bind(this);
        this.receiveFlag = this.receiveFlag.bind(this);
    }

    componentWillMount() {
        const { step, data } = this.props;
        this.setState({ stepData: data[step] });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const { isTest, access_type, totalStep } = this.state;
        const { step, data, form } = nextProps;

        if (this.props.step !== step) {
            this.setState({
                stepData: data[step],
                form: nextProps.form,
                data
            }, () => {
                this.onSetStep(step);
            });
        } else if (JSON.stringify(data) !== JSON.stringify(this.state.data)) {
            this.setState({
                stepData: data[step],
                data,
                form
            });
        }

        if (isTest && access_type === "list" && JSON.stringify(form) !== JSON.stringify(this.state.form)) {
            this.setState({
                form: nextProps.form,
                stepData: data[step],
                data,
                isTest: false
            });
        }

        // console.log(this.state, nextProps);
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
        const prop = currentData.PROP;
        const { category, step } = this.props;
        const { form } = this.state;

        if (category === "FASHION" && form.shot_kind === "n_plus_m_shot" && step === "SECOND") {
            const bottomSide = [prop[3], prop[4]];
            const topSide = [prop[0], prop[1], prop[2]];

            return (
                <div className="last-step">
                    <div className="info-item-box column-dir">
                        {this.renderFashionAllTop(topSide)}
                        {this.renderFashionAllBottom(bottomSide)}
                    </div>
                </div>
            );
        }

        return (
            <div className="last-step">
                <div className="info-item-box">
                    {prop.map((obj, idx) => {
                        const image = obj.IMAGE;
                        const isImage = !utils.type.isEmpty(image);
                        const optionType = obj.TYPE;
                        const radioType = optionType === "radio";
                        const selectType = optionType === "select";
                        const isNumber = obj.NUMBER;
                        const isText = obj.TEXT;
                        const isProp = !utils.type.isEmpty(obj.PROP);

                        const boxWidth = obj.WIDTH;
                        const stepGroup = obj.GROUP;

                        let renderFlag = false;

                        if (category === "FASHION") {
                            if (form.shot_kind === "nukki") {
                                renderFlag = stepGroup === 2;
                            } else if (form.shot_kind === "model_shot") {
                                renderFlag = stepGroup === 1;
                            }
                        }

                        return (!stepGroup || (stepGroup && renderFlag)) && (
                            <div
                                className={classNames("info-item", { "col": !isImage })}
                                key={`information__item__${obj.CODE}_${idx}`}
                                style={{ width: boxWidth || "" }}
                            >
                                {isImage &&
                                <div className="info-item__image">
                                    <Img image={{ src: image, type: "image" }} />
                                </div>
                                }
                                <div className={classNames("info-item__footer", { "full": !isImage })}>
                                    <div className="footer-title-wrap">
                                        {(radioType || selectType) && this.renderBoxType(radioType, selectType, obj)}
                                        <p className="footer-title">{utils.linebreak(obj.NAME)}</p>
                                    </div>
                                    <p className="footer-caption">{utils.linebreak(obj.CAPTION)}</p>
                                    {(this.props.category !== "FASHION" || (this.props.category === "FASHION" && (form.shot_kind === "nukki" || form.shot_kind === "n_plus_m_shot"))) &&
                                    (isNumber || isText) && this.renderInputArea(isNumber, isText, obj)
                                    }
                                    {isProp && (this.props.category !== "FASHION" || ((this.props.category === "FASHION" && (form.shot_kind === "model_shot" || form.shot_kind === "n_plus_m_shot")))) &&
                                    <div className="flexArea test">
                                        {obj.PROP.map((sub_o, i) => {
                                            const subRadioType = sub_o.TYPE === "radio";
                                            let content = null;
                                            if (subRadioType) {
                                                content = this.renderBoxType(true, false, sub_o);
                                            }
                                            return (
                                                <div className={classNames("footer-title-wrap", { "fashion": this.props.category === "FASHION" })} key={`sub_prop__${i}`}>
                                                    {content}
                                                    <p className="footer-caption">{utils.linebreak(sub_o.NAME)}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    renderFashionAllTop(prop) {
        return (
            <div className="info-item-outer">
                {prop.map((obj, idx) => {
                    const image = obj.IMAGE;
                    const isImage = !utils.type.isEmpty(image);
                    const optionType = obj.TYPE;
                    const radioType = optionType === "radio";
                    const selectType = optionType === "select";
                    const isNumber = obj.NUMBER;
                    const isText = obj.TEXT;
                    const boxWidth = obj.WIDTH;

                    return (
                        <div
                            className={classNames("info-item", { "col": !isImage })}
                            key={`information__item__${obj.CODE}_${idx}`}
                            style={{ width: boxWidth || "" }}
                        >
                            {isImage &&
                            <div className="info-item__image">
                                <Img image={{ src: image, type: "image" }} />
                            </div>
                            }
                            <div className={classNames("info-item__footer", { "full": !isImage })}>
                                <div className="footer-title-wrap">
                                    {(radioType || selectType) && this.renderBoxType(radioType, selectType, obj)}
                                    <p className="footer-title">{utils.linebreak(obj.NAME)}</p>
                                </div>
                                <p className="footer-caption">{utils.linebreak(obj.CAPTION)}</p>
                                {(isNumber || isText) && this.renderInputArea(isNumber, isText, obj)}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    renderFashionAllBottom(prop) {
        return (
            <div className="info-item-outer bar">
                <p className="bar-title">섭외가 필요한 경우 선택해주세요.</p>
                {prop.map((obj, idx) => {
                    const optionType = obj.TYPE;
                    const radioType = optionType === "radio";
                    const selectType = optionType === "select";
                    return (
                        <div
                            className={classNames("info-item", "bar-sec")}
                            key={`information__item__${obj.CODE}_${idx}`}
                        >
                            {this.renderBoxType(radioType, selectType, obj)}
                            <p className="box-title">{obj.NAME}</p>
                            <p className="box-caption">{obj.CAPTION}</p>
                        </div>
                    );
                })}
            </div>
        );
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
            this.receiveChangeForm();
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
            } else if (code === "studio") {
                data.THIRD.ACTIVE = !!form.note || false;
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

        this.setState({
            form: { ...estimateUtils.onRadio(form, code) }
        }, () => {
            this.receiveChangeForm();
        });
    }

    /**
     * 인풋을 그립니다.
     * @param numberFlag
     * @param textFlag
     * @param obj
     * @returns {*}
     */
    renderInputArea(numberFlag, textFlag, obj) {
        const { form } = this.state;
        const unit = obj.UNIT;
        const code = obj.CODE;

        let inputType = null;
        if (numberFlag) {
            inputType = "number";
        } else if (textFlag) {
            inputType = "text";
        }

        let value = form[code];

        if (code === "nukki_shot") {
            value = form.number;
        } else if (code === "directing_shot") {
            value = form.directing_number;
        } else if (code === "nukki" || form.shot_kind === "n_plus_m_shot") {
            value = form.need_number;
        }

        return (
            <div className="footer-input__box">
                {!textFlag &&
                <p className="input-title">{unit.PRE.NAME}</p>
                }
                <input
                    className={classNames("virtual-input", { "free": textFlag })}
                    name={code}
                    placeholder={obj.PLACEHOLDER}
                    maxLength={!textFlag && 3}
                    type="text"
                    value={value}
                    onChange={e => this.onChange(e, inputType)}
                />
                <p className="input-unit">{unit.NAME}</p>
            </div>
        );
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
            if (JSON.stringify(form) !== JSON.stringify(this.state.form)) {
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
            }
        });
    }

    /**
     * 폼 데이터 전달
     * @param form
     * @param flag
     */
    receiveChangeForm(form = this.state.form) {
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
        const st = this.stepToNumber(step);

        estimateUtils.setStepProcess(data, { step, totalStep, st, form });

        return data;
    }

    /**
     * 체크박스 혹은 라디오 버튼을 그립니다.
     * @param radioFlag
     * @param selectFlag
     * @param data
     * @returns {null}
     */
    renderBoxType(radioFlag, selectFlag, data) {
        const { form } = this.state;
        let boxContent = null;
        if (radioFlag) {
            const locationArr = ["studio", "outside", "outside_s", "outside_e"];
            const placeArr = ["seoul", "etc", "gyeonggi"];
            const videoDirectingArr = ["viral_video", "interview_video"];
            const videoLengthArr = ["1", "2", "3", "4"];
            const modelTimeArr = ["shot", "half", "full"];
            const nukkiKindArr = ["floor_nukki", "mannequin_nukki", "ghost_cut"];
            const isLocationProperty = locationArr.includes(data.CODE);
            const isPlaceProperty = placeArr.includes(data.CODE);
            const isVideoDirectingArrArrProperty = videoDirectingArr.includes(data.CODE);
            const isVideoLengthArrProperty = videoLengthArr.includes(data.CODE);
            const isModelTimeArrProperty = modelTimeArr.includes(data.CODE);
            const isNukkiKindArrProperty = nukkiKindArr.includes(data.CODE);
            boxContent = (
                <div
                    className={classNames(
                        "radio-btn",
                        { "select":
                                (isLocationProperty && form.location === data.CODE) ||
                                (isPlaceProperty && form.place === data.CODE) ||
                                (isVideoDirectingArrArrProperty && form.shot_kind === data.CODE) ||
                                (isVideoLengthArrProperty && form.video_length === data.CODE) ||
                                (isModelTimeArrProperty && form.model_time === data.CODE) ||
                                (isNukkiKindArrProperty && form.nukki_kind === data.CODE)
                        }
                    )}
                    onClick={e => this.onRadio(e, data.CODE)}
                >
                    <div className="circle-outer">
                        <div className="circle-inner" />
                    </div>
                </div>
            );
        } else if (selectFlag) {
            const targetValue = form[data.CODE];
            const code = data.CODE;
            let isChecked = false;

            if (code === "size") {
                isChecked = targetValue === "large";
            } else if (code === "material") {
                isChecked = targetValue === "gloss";
            } else if (code === "nukki") {
                isChecked = form.shot_kind === "nukki";
            } else if (code === "model_shot") {
                isChecked = form.shot_kind === "model_shot";
            } else if (code === "model_casting" || code === "h_m_casting") {
                isChecked = targetValue === "need";
            }

            if ((code === "nukki" || code === "model_shot") && form.shot_kind === "n_plus_m_shot") {
                isChecked = true;
            }

            boxContent = (
                <div className={classNames("check-box", { "select": isChecked })} onClick={e => this.onCheck(e, data)}>
                    <div className="select-box">
                        <div className="check-mark" />
                    </div>
                </div>
            );
        }

        return boxContent;
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

    onActiveStep() {
        this.onSetStep();
    }

    render() {
        const { step, form, totalStep, category, estimateUtils } = this.props;
        const { stepData, isEstimate } = this.state;

        if (utils.type.isEmpty(stepData)) {
            return null;
        }

        return (
            <div className="virtual-estimate__steps">
                <p className="virtual-estimate__steps__title">{`${stepData.CODE}. ${stepData.TITLE}`}</p>
                <p className="virtual-estimate__steps__caption">{stepData.TEST ? "" : stepData.CAPTION}</p>
                <div className="virtual-estimate__steps__content">
                    {this.stepToNumber(step) !== totalStep ?
                        this.renderStep(stepData) :
                        <LastStep
                            data={stepData}
                            form={form}
                            category={category}
                            onChangeForm={this.receiveChangeForm}
                            estimateUtils={estimateUtils}
                            onCheckMoveFlag={this.props.onCheckMoveFlag}
                        />
                    }
                </div>
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
