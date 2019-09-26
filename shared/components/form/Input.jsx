import "./input.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";

// 크기 클래스
export const classSize = {
    small: "size-small",
    default: "",
    large: "size-large",
    mobile: "size-mobile"
};

// 넓이 클래스
export const classWidth = {
    default: "",
    w98: "w98",
    w154: "w154",
    w175: "w175",
    w206: "w206",
    w267: "w267",
    w276: "w276",
    w296: "w296",
    w412: "w412",
    w520: "w520",
    w660: "w660",
    block: "block"
};

// 모양 클래스
export const classShape = {
    default: "shape-rect",
    circle: "shape-circle",
    round: "shape-round"
};

// 테마 클래스
export const classTheme = {
    default: "",
    reverse: "theme-reverse",
    muted: "theme-muted",
    opacity: "theme-opacity"
};

// type, pattern
// this.props type , number, 한글만,

/**
 * @param inputStyle - Object형
 *          size - input 크기
 *          width - input 넓이
 *          theme - input 테마
 * @param inline - 태그 inline 속성 (value, defaultValue, type, className, event 등)
 *
 * 상세값은 위에 class~ 변수 확인요망
 */
class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputStyle: props.inputStyle,
            inline: props.inline
        };

        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    componentWillMount() {
    }

    // 부모가 props를 변경했을시 state에 적용
    componentWillReceiveProps(nextProps) {
        const props = {};

        if (JSON.stringify(nextProps.inputStyle) !== JSON.stringify(this.state.inputStyle)) {
            props.inputStyle = nextProps.inputStyle;
        }

        if (JSON.stringify(nextProps.inline) !== JSON.stringify(this.state.inline)) {
            props.inline = nextProps.inline;
        }

        this.setState(props);
    }

    // 텍스트 변경시 데이터 반영 및 값넘김
    onChange(e) {
        const inline = this.state.inline;
        let value = e.target.value;
        const type = this.props.type;
        // let pattern;

        if (inline.maxLength && value.length > inline.maxLength) {
            return;
        }

        if (type === "number") {
            value = value.replace(/,/gi, "").replace(/\D/gi, "");
            // pattern = /^[0-9]*$/;
            // if (value.match(pattern) === null) {
            //     value = "";
            // } else {
            //     inline.value = value;
            // }
        }
        // else if (type === "title") {
        //     value = utils.replaceChar(value);
        // }

        inline.value = value;

        this.setState({
            inline
        });

        if (typeof inline.onChange === "function") {
            inline.onChange(e, value);
        }
    }

    onKeyDown(e) {
        const inline = this.state.inline;
        const keyCode = (e.keyCode ? e.keyCode : e.which);
        const value = e.target.value;

        if (typeof inline.onKeyDown === "function") {
            inline.onKeyDown(e, value);
        } else if (typeof inline.onEnter === "function" && keyCode === 13) {
            inline.onEnter(e, value);
        }
    }

    onBlur(e) {
        const inline = this.state.inline;

        if (typeof inline.onBlur === "function") {
            inline.onBlur(e);
        }
    }

    getClassName(className = {}) {
        const inputStyle = this.state.inputStyle;

        return classNames(
            "input",
            classSize[inputStyle.size],
            classWidth[inputStyle.width],
            classShape[inputStyle.shape],
            classTheme[inputStyle.theme],
            className
        );
    }

    render() {
        const inputStyle = this.state.inputStyle;
        const inline = Object.assign({}, this.state.inline);
        const inlineClass = inline.className;

        delete inline["onChange"];
        delete inline["onKeyDown"];
        delete inline["onEnter"];
        delete inline["className"];

        const props = Object.assign({
            value: "",
            className: this.getClassName(inlineClass),
            onChange: this.onChange,
            onKeyDown: this.onKeyDown,
            disabled: this.props.disabled
        }, inline);

        return React.createElement("input", props);
    }
}

Input.propTypes = {
    inputStyle: PropTypes.shape({
        size: PropTypes.oneOf(Object.keys(classSize)),
        width: PropTypes.oneOf(Object.keys(classWidth)),
        shape: PropTypes.oneOf(Object.keys(classShape)),
        theme: PropTypes.oneOf(Object.keys(classTheme))
    }),
    inline: PropTypes.shape([PropTypes.node, PropTypes.func]),
    disabled: PropTypes.oneOf(["disabled", ""]),
    type: PropTypes.string
};

Input.defaultProps = {
    inputStyle: {
        size: "default",
        width: "default",
        shape: "circle",
        theme: "default"
    },
    inline: {},
    disabled: ""
};

export default Input;
