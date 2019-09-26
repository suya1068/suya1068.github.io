import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Icon from "../icon/Icon";

class CheckboxText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: props.checked
        };

        this.buttonCheck = this.buttonCheck.bind(this);
    }

    // 부모에서 체크상태 변경시 받아서 다시 그려줌
    componentWillReceiveProps(nextProps) {
        if (nextProps.checked !== this.props.checked ||
            nextProps.checked !== this.state.checked) {
            this.state.checked = nextProps.checked;
        }
    }

    getClassName() {
        return classNames(
            "checkbox checkbox-text",
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
        return (
            <button className={this.getClassName()} onClick={this.props.disabled === "disabled" ? "" : this.buttonCheck}>
                <span className="check-text">{this.props.children}</span>
                <Icon name="check" active={this.state.checked ? "active" : ""} />
            </button>
        );
    }
}

CheckboxText.propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    resultFunc: PropTypes.func,
    children: PropTypes.node
};

CheckboxText.defaultProps = {
    checked: false,
    disabled: false,
    resultFunc: undefined,
    children: undefined
};

export default CheckboxText;
