import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Icon from "../icon/Icon";
import "./button.scss";

export const classSize = {
    undefined: "",
    tiny: "btn-tiny",
    small: "btn-small",
    large: "btn-large",
    xlarge: "btn-xlarge"
};

export const classWidth = {
    undefined: "",
    w52: "btn-w52",
    w68: "btn-w68",
    w83: "btn-w83",
    w113: "btn-w113",
    w135: "btn-w135",
    w179: "btn-w179",
    w276: "btn-w276",
    w310: "btn-w310",
    w412: "btn-w412",
    w491: "btn-w491",
    block: "btn-block"
};

export const classShape = {
    undefined: "",
    circle: "btn-circle",
    round: "btn-round",
    rect: "btn-rect"
};

export const classTheme = {
    undefined: "",
    default: "btn-default",
    reverse: "btn-reverse",
    muted: "btn-muted",
    gray: "btn-gray",
    blue: "btn-blue",
    "bg-lightgray": "btn-bg-lightgray",
    "bg-white": "btn-bg-white",
    pink: "btn-pink",
    yellow: "btn-yellow",
    "fill-emphasis": "btn-fill-emphasis",
    "fill-pink": "btn-fill-pink",
    "fill-dark": "btn-fill-dark",
    opacity: "btn-opacity",
    "opacity-low": "btn-opacity-low",
    "fill-facebook": "btn-fill-facebook",
    "fill-naver": "btn-fill-naver",
    "fill-enter": "btn-fill-enter"
};

/**
 * 기본 버튼
 * @param buttonStyle - Object형
 *           size - 버튼 크기
 *           width - 버튼 넓이
 *           shape - 버튼 모양
 *           theme - 버튼 테마
 *           icon - 아이콘 추가시 아이콘명
 * @param inline - 태그 inline 속성 (type, className, event 등)
 * @param children - 버튼 내부 컨텐츠
 *
 * 각 키값은 상단에 선언한 키값 참조
 */
class Buttons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            buttonStyle: props.buttonStyle,
            inline: props.inline,
            isActive: props.buttonStyle.isActive,
            isHover: false
        };

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    componentWillMount() {
    }

    // 부모가 props를 변경했을시 state에 적용
    componentWillReceiveProps(nextProps) {
        const prop = {};

        if (JSON.stringify(nextProps.buttonStyle) !== JSON.stringify(this.state.buttonStyle)) {
            prop.buttonStyle = nextProps.buttonStyle;
            prop.isActive = nextProps.buttonStyle.isActive;
        }

        prop.inline = nextProps.inline;

        this.setState(prop);
    }

    onMouseEnter(e) {
        this.setState({
            isHover: true
        });

        if (typeof this.state.inline.onMouseEnter === "function") {
            this.state.inline.onMouseEnter(e);
        }
    }

    onMouseLeave(e) {
        this.setState({
            isHover: false
        });

        if (typeof this.state.inline.onMouseLeave === "function") {
            this.state.inline.onMouseLeave(e);
        }
    }

    onFocus(e) {
        this.setState({
            isActive: true
        });

        if (typeof this.state.inline.onFocus === "function") {
            this.state.inline.onFocus(e);
        }
    }

    onBlur(e) {
        const buttonStyle = this.state.buttonStyle;

        if (!buttonStyle.isActive) {
            this.setState({
                isActive: false
            });
        }

        if (typeof this.state.inline.onBlur === "function") {
            this.state.inline.onBlur(e);
        }
    }

    getClassName(className = {}) {
        const btnStyle = this.state.buttonStyle;
        return classNames("btn", classSize[btnStyle.size], classWidth[btnStyle.width], classShape[btnStyle.shape], classTheme[btnStyle.theme], (this.isActive() ? "active" : ""), className);
    }

    isActive() {
        return (this.state.isActive || this.state.isHover || this.state.buttonStyle.isActive);
    }

    render() {
        const { children } = this.props;
        const inline = Object.assign({}, this.state.inline);
        const inlineClass = inline.className;
        const btnStyle = this.state.buttonStyle;
        const icon = btnStyle.icon !== "" && typeof btnStyle.icon !== "undefined" ? <Icon name={btnStyle.icon} active={this.isActive() ? "active" : ""} /> : "";
        const content = (
            <div className="btn-container">
                <div className="btn-content">
                    {btnStyle.iconAlign !== "right" ? icon : ""}
                    {typeof children !== "undefined" ? <div className="btn-name">{children}</div> : ""}
                    {btnStyle.iconAlign === "right" ? icon : ""}
                </div>
            </div>
        );

        delete inline["onFocus"];
        delete inline["onBlur"];
        delete inline["onMouseEnter"];
        delete inline["onMouseLeave"];
        delete inline["className"];

        const props = Object.assign({
            className: this.getClassName(inlineClass),
            onFocus: this.onFocus,
            onBlur: this.onBlur,
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave
        }, inline);

        let tag = "a";

        if (typeof inline.href === "undefined") {
            tag = "button";

            if (typeof inline.type === "undefined" || inline.type === "") {
                inline.type = "button";
            }
        }

        return React.createElement(tag, props, content);
    }
}

Buttons.propTypes = {
    buttonStyle: PropTypes.shape({
        size: PropTypes.oneOf(Object.keys(classSize)),
        width: PropTypes.oneOf(Object.keys(classWidth)),
        shape: PropTypes.oneOf(Object.keys(classShape)),
        theme: PropTypes.oneOf(Object.keys(classTheme)),
        icon: PropTypes.string,
        iconAlign: PropTypes.oneOf(["left", "right"]),
        isActive: PropTypes.oneOf([true, false])
    }),
    inline: PropTypes.shape([PropTypes.node, PropTypes.func]),
    children: PropTypes.node
};

Buttons.defaultProps = {
    buttonStyle: {
        size: undefined,
        width: undefined,
        shape: undefined,
        theme: undefined,
        icon: undefined,
        iconAlign: "left",
        isActive: false
    },
    inline: {}
};

export default Buttons;
