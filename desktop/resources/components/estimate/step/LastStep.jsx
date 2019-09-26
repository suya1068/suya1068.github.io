import React, { Component } from "react";
import classNames from "classnames";
import Img from "shared/components/image/Img";
import utils from "forsnap-utils";
import PopModal from "shared/components/modal/PopModal";

export default class LastStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            form: props.form,
            estimateUtils: props.estimateUtils,
            except: false,
            timer: null
        };
        this.renderNukki = this.renderNukki.bind(this);
        this.renderDirecting = this.renderDirecting.bind(this);
        this.renderFood = this.renderFood.bind(this);
        this.profileInputArea = this.profileInputArea.bind(this);
        this.renderInterior = this.renderInterior.bind(this);
        this.onRadio = this.onRadio.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        const { estimateUtils, onChangeForm } = this.props;

        if (estimateUtils.isLastFlag()) {
            if (!estimateUtils.getLastFlag()) {
                estimateUtils.changeLastFlag(true);
                if (typeof onChangeForm === "function") {
                    onChangeForm(this.state.form);
                }
            }
        }
    }

    renderStep(form) {
        let content;
        if (this.props.category === "FOOD") {
            switch (form.location) {
                case "studio": content = this.renderNukki("note"); break;
                case "outside": content = this.renderDirecting(); break;
                default:
            }
        } else if (this.props.category === "PROFILE_BIZ") {
            content = this.renderProfileBiz();
        } else if (this.props.category === "INTERIOR" || this.props.category === "EVENT" || this.props.category === "FASHION") {
            content = this.renderInterior();
        } else {
            switch (form.shot_kind) {
                case "nukki_shot": case "interview_video": {
                    content = this.renderNukki(form.shot_kind === "nukki_shot" ? "note" : "interview_person");
                    break;
                }
                case "directing_shot": case "n_plus_d_shot": case "viral_video": content = this.renderDirecting(); break;
                default:
            }
        }

        return content;
    }

    renderNukki(key) {
        const { data } = this.props;
        const { form } = this.state;
        const prop = data.PROP[0];

        return (
            <div className="info-item third-nukki">
                <p>{prop.NAME}</p>
                {this.renderInputSide(prop, form[key])}
            </div>
        );
    }

    renderInterior() {
        const { data } = this.props;
        const { form } = this.state;

        const prop = data.PROP;

        return (
            <div className="last-step interior">
                <div className="info-item-box">
                    {prop.map((obj, idx) => {
                        const image = obj.IMAGE;
                        const isImage = !utils.type.isEmpty(image);
                        const optionType = obj.TYPE;
                        const radioType = optionType === "radio";
                        const selectType = optionType === "select";
                        const isNumber = obj.NUMBER;
                        const isText = obj.TEXT;

                        const isShowInput = (obj.CODE === "is_exterior" && form.is_exterior === "need") ||
                            (obj.CODE === "inside_cut_compose" && form.inside_cut_compose === "need") ||
                            (obj.CODE === "is_all_shot" && form.is_all_shot === "need") ||
                            (obj.CODE === "is_detail_cut" && form.is_detail_cut === "need") ||
                            (obj.CODE === "is_retouch_add" && form.is_retouch_add === "need");

                        return (
                            <div className={classNames("info-item", { "col": !isImage })} key={`information__item__${obj.CODE}_${idx}`}>
                                {isImage &&
                                <div className="info-item__image">
                                    <Img image={{ src: image, type: "image" }} />
                                </div>
                                }
                                <div className={classNames("info-item__footer")}>
                                    <div className="footer-title-wrap">
                                        {(radioType || selectType) && this.renderBoxType(radioType, selectType, obj)}
                                        <p className="footer-title">{utils.linebreak(obj.NAME)}</p>
                                    </div>
                                    <p className="footer-caption">{utils.linebreak(obj.CAPTION)}</p>
                                    {isShowInput &&
                                    isNumber && this.renderInputArea(isNumber, obj)
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    renderProfileBiz() {
        const { data } = this.props;
        const { form } = this.state;

        return (
            <div className="last-step food">
                <div className="info-item-box" style={{ width: 600, height: 360 }}>
                    {data.PROP.map((obj, idx) => {
                        return (
                            <div
                                className={classNames("info-item__footer")}
                                style={{
                                    height: "100%",
                                    padding: "0 90px"
                                }}
                                key={`information__item__${obj.CODE}_${idx}`}
                            >
                                <div className="footer-title-wrap" style={{ flexDirection: "column" }}>
                                    <p className="footer-title" style={{ fontWeight: "normal", marginBottom: 30, fontSize: 18 }}>{utils.linebreak(obj.NAME)}</p>
                                    <div
                                        className=""
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            width: "100%"
                                        }}
                                    >
                                        {obj.PROP.map((o, i) => {
                                            const optionType = o.TYPE;
                                            const radioType = optionType === "radio";
                                            const selectType = optionType === "select";
                                            return (
                                                <div
                                                    key={`profile_biz__${i}`}
                                                    style={{
                                                        display: "flex",
                                                        backgroundColor: "#efefef",
                                                        height: 54,
                                                        alignItems: "center",
                                                        justifyContent: "flex-start",
                                                        paddingLeft: 54,
                                                        marginTop: i === 1 && 5
                                                    }}
                                                >
                                                    {this.renderBoxType(radioType, selectType, o)}
                                                    <p className="footer-title" style={{ fontWeight: "normal", marginBottom: 0 }}>{utils.linebreak(o.NAME)}</p>
                                                    {o.CODE === "need" && form.is_all_shot === "need" &&
                                                    this.profileInputArea(o)
                                                    }
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <p className="footer-caption">{utils.linebreak(obj.CAPTION)}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    profileInputArea(o) {
        const { form } = this.state;
        const unit = o.UNIT;

        return (
            <div className="footer-input__box" style={{ marginTop: 0, marginLeft: 36 }}>
                <p className="input-title">총</p>
                <input
                    className={classNames("virtual-input", "bg-white")}
                    name="all_shot_need_number"
                    placeholder={o.PLACEHOLDER}
                    maxLength={3}
                    type="text"
                    value={form["all_shot_need_number"]}
                    onChange={e => this.onChange(e, "number")}
                />
                <p className="input-unit">{unit.NAME}</p>
            </div>
        );
    }

    renderFood() {
        const { data } = this.props;
        const { form } = this.state;
        const freeProp = data.PROP[0];
        const imageProp = [];
        data.PROP.map((obj, idx) => {
            if (idx !== 0) {
                imageProp.push(obj);
            }
            return null;
        });

        return (
            <div className="last-step food">
                <div className="info-item-box">
                    <div className="info-item col" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", border: "1px solid #dedede" }}>
                        <p style={{ textAlign: "center", fontSize: 18 }}>{utils.linebreak(freeProp.NAME)}</p>
                        {this.renderInputSide(freeProp, form.note)}
                    </div>
                </div>
                <div className="info-item-box">
                    {imageProp.map((obj, idx) => {
                        const image = obj.IMAGE;
                        const isImage = !utils.type.isEmpty(image);

                        return (
                            <div className={classNames("info-item", { "col": !isImage })} key={`information__item__${obj.CODE}_${idx}`}>
                                <div className={classNames("info-item__footer")} style={{ height: "100%" }}>
                                    <div className="footer-title-wrap" style={{ flexDirection: "column" }}>
                                        <p className="footer-title" style={{ fontWeight: "normal", marginBottom: 30, fontSize: 18 }}>{utils.linebreak(obj.NAME)}</p>
                                        <div className="" style={{ display: "flex" }}>
                                            {obj.PROP.map((o, i) => {
                                                const optionType = o.TYPE;
                                                const radioType = optionType === "radio";
                                                const selectType = optionType === "select";
                                                return (
                                                    <div key={`food_${i}`} style={{ display: "flex", marginLeft: i === 1 && 27 }}>
                                                        {this.renderBoxType(radioType, selectType, o)}
                                                        <p className="footer-title" style={{ fontWeight: "normal" }}>{utils.linebreak(o.NAME)}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <p className="footer-caption">{utils.linebreak(obj.CAPTION)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    onChange(e, inputType) {
        const { form } = this.state;
        const target = e.target;
        const name = target.name;
        let value = target.value;

        if (this.state.timer) {
            clearTimeout(this.state.timer);
        }

        if (name === "proxy_number" && value && form.directing_kind === "basic") {
            form.directing_kind = "proxy";
        }

        if (name === "directing_proxy_number" && value && form.directing_kind === "basic") {
            form.directing_kind = "directing_proxy";
        }

        if (inputType === "number") {
            value = value.replace(/,/gi, "").replace(/\D/gi, "");

            if (name !== "interview_person") {
                if (value > 99) {
                    PopModal.alert("1~99컷까지 입력 가능합니다.\n대량촬영의 경우 고객센터로 문의주시면 별도계약 가능합니다.");
                    value = 99;
                }
            } else if (name === "interview_person" && value > 99) {
                PopModal.alert("1~99명까지 입력가능합니다.");
                value = 99;
            }

            if (Number(value) === 0) {
                value = "";
            }
        }

        if (inputType === "text") {
            if (value.length > 20) {
                PopModal.alert("제품명은 20자 이내로 작성해주세요.");
                value = value.slice(0, 20);
            }
        }

        this.setState({
            form: { ...form, [name]: value }
        }, () => {
            this.props.onCheckMoveFlag();
            const _form = this.state.form;
            if (typeof this.props.onChangeForm === "function") {
                if (Object.hasOwnProperty.call(_form, "directing_kind")) {
                    if (_form.shot_kind === "nukki_shot" && _form.note) {
                        _form.directing_kind = "";
                    } else if ((_form.shot_kind === "directing_shot" || _form.shot_kind === "n_plus_d_shot") && _form.proxy_number) {
                        _form.directing_kind = "proxy";
                    } else if ((_form.shot_kind === "directing_shot" || _form.shot_kind === "n_plus_d_shot") && _form.directing_proxy_number) {
                        _form.directing_kind = "directing_proxy";
                    }
                }
                this.state.timer = setTimeout(() => {
                    this.setState({ except: true }, () => {
                        clearTimeout(this.state.timer);
                        this.props.onChangeForm(_form);
                    });
                }, 500);
            }
        });
    }

    renderInputSide(obj, value) {
        const unit = obj.UNIT;
        const isNumber = obj.NUMBER;

        return (
            <div className="footer-input__box">
                {unit.PRE &&
                <p className="input-title">{unit.PRE.NAME}</p>
                }
                <input
                    className={classNames("virtual-input", { "free": obj.UNIT === "FREE" })}
                    style={{ width: unit === "FREE" && "200px" }}
                    name={obj.CODE}
                    placeholder={obj.PLACEHOLDER}
                    maxLength={isNumber ? 3 : 20}
                    type="text"
                    value={value}
                    onChange={e => this.onChange(e, isNumber ? "number" : "text")}
                />
                {unit.NAME &&
                <p className="input-unit">{unit.NAME}</p>
                }
            </div>
        );
    }

    renderDirectingFood(imageProp, freeProp) {
        const { form } = this.state;
        return (
            <div className="last-step food">
                <div className="info-item-box">
                    <div className="info-item col" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", border: "1px solid #dedede" }}>
                        <p style={{ textAlign: "center", fontSize: 18 }}>{utils.linebreak(freeProp.NAME)}</p>
                        {this.renderInputSide(freeProp, form.note)}
                    </div>
                </div>
                <div className="info-item-box">
                    {imageProp.map((obj, idx) => {
                        const image = obj.IMAGE;
                        const isImage = !utils.type.isEmpty(image);
                        return (
                            <div className={classNames("info-item", { "col": !isImage })} key={`information__item__${obj.CODE}_${idx}`}>
                                <div className={classNames("info-item__footer")} style={{ height: "100%" }}>
                                    <div className="footer-title-wrap" style={{ flexDirection: "column" }}>
                                        <p className="footer-title" style={{ fontWeight: "normal", marginBottom: 30, fontSize: 18 }}>{utils.linebreak(obj.NAME)}</p>
                                        <div className="" style={{ display: "flex" }}>
                                            {obj.PROP.map((o, i) => {
                                                const optionType = o.TYPE;
                                                const radioType = optionType === "radio";
                                                const selectType = optionType === "select";
                                                return (
                                                    <div key={`food_${i}`} style={{ display: "flex", marginLeft: i === 1 && 27 }}>
                                                        {this.renderBoxType(radioType, selectType, o)}
                                                        <p className="footer-title" style={{ fontWeight: "normal" }}>{utils.linebreak(o.NAME)}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <p className="footer-caption">{utils.linebreak(obj.CAPTION)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    renderDirectingDefault(imageProp, freeProp) {
        const { form } = this.state;

        return (
            <div className="third-directing">
                <div className="info-item-box">
                    {imageProp.map((obj, idx) => {
                        const image = obj.IMAGE;
                        const isImage = !utils.type.isEmpty(image);
                        const optionType = obj.TYPE;
                        const radioType = optionType === "radio";
                        const selectType = optionType === "select";
                        const isNumber = obj.NUMBER;
                        const isText = obj.TEXT;

                        return (
                            <div className={classNames("info-item", { "col": !isImage })} key={`information__item__${obj.CODE}_${idx}`}>
                                {isImage &&
                                <div className="info-item__image">
                                    <Img image={{ src: image, type: "image" }} />
                                </div>
                                }
                                <div className={classNames("info-item__footer")}>
                                    <div className="footer-title-wrap">
                                        {(radioType || selectType) && this.renderBoxType(radioType, selectType, obj)}
                                        <p className="footer-title">{utils.linebreak(obj.NAME)}</p>
                                    </div>
                                    <p className="footer-caption">{utils.linebreak(obj.CAPTION)}</p>
                                    {form.directing_kind === obj.CODE &&
                                    (isNumber || isText) && this.renderInputArea(isNumber, obj)
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
                {!["VIDEO_BIZ", "FASHION"].includes(this.props.category) &&
                <div className="info-item directing">
                    <p>{freeProp.NAME}</p>
                    {this.renderInputSide(freeProp, form.note)}
                </div>
                }
            </div>
        );
    }

    renderDirecting(category = this.props.category) {
        const { data } = this.props;
        const freeProp = data.PROP[0];
        const imageProp = [];
        data.PROP.map((obj, idx) => {
            if (idx !== 0) {
                imageProp.push(obj);
            }
            return null;
        });

        let content = this.renderDirectingDefault(imageProp, freeProp);

        if (category === "FOOD") {
            content = this.renderDirectingFood(imageProp, freeProp);
        }

        return (content);
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
            boxContent = (
                <div
                    className={classNames("radio-btn", { "select": (form.directing_kind === data.CODE || form.place === data.CODE || form.is_all_shot === data.CODE) })}
                    onClick={() => this.onRadio(data.CODE)}
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

            if (code === "is_exterior" ||
                code === "inside_cut_compose" ||
                code === "video_directing" ||
                code === "is_all_shot" ||
                code === "actor_casting" ||
                code === "h_m_casting" ||
                code === "plan_conti" ||
                code === "is_detail_cut" ||
                code === "is_retouch_add") {
                isChecked = targetValue === "need";
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
     * 체크박스 기능
     * @param e
     * @param data
     */
    onCheck(e, data) {
        const { estimateUtils } = this.props;
        const { form } = this.state;
        const target = e.currentTarget;
        const propKey = data.CODE;
        const isChecked = target.classList[1] === "select";

        if (isChecked) {
            target.classList.remove("select");
        } else {
            target.classList.add("select");
        }

        this.setState({
            form: { ...estimateUtils.onCheck(form, propKey, isChecked) }
        }, () => {
            if (typeof this.props.onChangeForm === "function") {
                this.props.onChangeForm(this.state.form);
            }
        });
    }

    /**
     * 라디오 버튼 클릭
     * @param code
     */
    onRadio(code) {
        const { estimateUtils } = this.props;
        const { form } = this.state;

        this.setState({
            form: { ...estimateUtils.onRadio(form, code) }
        }, () => {
            this.props.onChangeForm(this.state.form);
        });
    }

    /**
     * 인풋 그리기
     * @param numberFlag
     * @param obj
     * @returns {*}
     */
    renderInputArea(numberFlag, obj) {
        const { form } = this.state;
        const unit = obj.UNIT;
        const code = obj.CODE;

        let _code = code;

        if (code === "proxy") {
            _code = "proxy_number";
        } else if (code === "directing_proxy") {
            _code = "directing_proxy_number";
        } else if (code === "is_exterior") {
            _code = "exterior_number";
        } else if (code === "inside_cut_compose") {
            _code = "inside_compose_number";
        } else if (code === "is_all_shot") {
            _code = "all_shot_need_number";
        } else if (code === "is_detail_cut") {
            _code = "detail_number";
        } else if (code === "is_retouch_add") {
            _code = "retouch_number";
        }

        return (
            <div className="footer-input__box">
                <p className="input-title">{unit.PRE.NAME}</p>
                <input
                    className={classNames("virtual-input")}
                    name={_code}
                    placeholder={obj.PLACEHOLDER}
                    maxLength={3}
                    type="text"
                    value={form[_code]}
                    onChange={e => this.onChange(e, "number")}
                />
                <p className="input-unit">{unit.NAME}</p>
            </div>
        );
    }
    render() {
        return (
            <div>
                {this.renderStep(this.props.form)}
            </div>
        );
    }
}
