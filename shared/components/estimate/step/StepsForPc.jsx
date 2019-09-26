import utils from "forsnap-utils";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import classNames from "classnames";

export default class StepsForPc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: props.step,
            form: props.form,
            data: props.data,
            category: props.category
        };
        this.renderInputArea = this.renderInputArea.bind(this);
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
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
     * 체크박스 혹은 라디오 버튼을 그립니다.
     * @param radioFlag
     * @param selectFlag
     * @param data
     * @returns {null}
     */
    renderBoxType(radioFlag, selectFlag, data) {
        const { form } = this.props;
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
                    onClick={e => this.props.onRadio(e, data.CODE)}
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
                <div className={classNames("check-box", { "select": isChecked })} onClick={e => this.props.onCheck(e, data)}>
                    <div className="select-box">
                        <div className="check-mark" />
                    </div>
                </div>
            );
        }

        return boxContent;
    }

    /**
     * 인풋을 그립니다.
     * @param numberFlag
     * @param textFlag
     * @param obj
     * @returns {*}
     */
    renderInputArea(numberFlag, textFlag, obj) {
        const { form } = this.props;
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
                    onChange={e => this.props.onChange(e, inputType)}
                />
                <p className="input-unit">{unit.NAME}</p>
            </div>
        );
    }

    render() {
        const { data, category, step, form } = this.props;
        const prop = data.PROP;

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
}
