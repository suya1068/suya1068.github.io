import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Icon from "../icon/Icon";

const classType = {
    default: "",
    text: "check-box",
    yellow_small: "check-yellow check-small",
    yellow_circle: "check-yellow check-circle"
};

const classIcon = {
    check_s: ["yellow_small"],
    check: ["default", "text"]
};

class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkName: props.name,
            checkType: props.type,
            checkIcon: "",
            pno: "",
            checked: props.checked
        };

        this.buttonCheck = this.buttonCheck.bind(this);
    }

    // 체크 타입에 따라서 아이콘 변경
    componentWillMount() {
        let iconName = "check_s";
        Object.keys(classIcon).map(key => {
            const arr = classIcon[key];
            if (arr.indexOf(this.state.checkType) !== -1) {
                iconName = key;
            }
            return null;
        });

        this.setState({
            checkIcon: iconName,
            pNo: this.props.productNo
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.checked !== this.props.checked
            && nextProps.checked !== this.state.checked) {
            this.state.checked = nextProps.checked;
        }
    }

    getClassName() {
        return classNames(
            "checkbox",
            classType[this.state.checkType],
            this.state.checked ? "active" : "",
            this.props.disabled ? "disabled" : "",
            this.state.textAlign
        );
    }

    buttonCheck() {
        const checked = !this.state.checked;

        this.setState({
            checked
        }, () => {
            if (typeof this.props.resultFunc === "function") {
                this.props.resultFunc(checked);
            }
        });
    }

    render() {
        const checked = this.state.checked;
        const icon = this.state.checkIcon !== "" ? <Icon name={this.state.checkIcon} active={checked ? "active" : ""} /> : "";
        const children = typeof this.props.children !== "undefined" ? <span className="check-text">{this.props.children}</span> : "";

        return (
            <button className={this.getClassName()} onClick={this.props.disabled ? "" : this.buttonCheck}>
                <div className="checkbox-content">
                    <div className="check-icon">{icon}</div>{children}
                </div>
            </button>
        );
    }
}

Checkbox.propTypes = {
    name: PropTypes.string,
    type: PropTypes.oneOf(Object.keys(classType)),
    checked: PropTypes.oneOf([true, false]),
    disabled: PropTypes.oneOf([true, false]),
    resultFunc: PropTypes.func,
    children: PropTypes.node,
    productNo: PropTypes.string
};

Checkbox.defaultProps = {
    name: "",
    type: "default",
    checked: false,
    disabled: false,
    resultFunc: undefined
};

export default Checkbox;
