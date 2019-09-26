import React, { Component, PropTypes } from "react";
import classNames from "classnames";

class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            className: props.className,
            type: props.type,
            name: props.name,
            id: props.id,
            value: props.value,
            placeholder: props.placeholder,
            max: Number(props.max),
            message: null
        };

        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const prop = {};
        const { className, type, name, id, placeholder, max } = this.props;
        const { value } = this.state;

        if (nextProps.className !== className) {
            prop.className = nextProps.className;
        }

        if (nextProps.type && nextProps.type !== type) {
            prop.type = nextProps.type;
        }

        if (nextProps.id && nextProps.id !== id) {
            prop.id = nextProps.id;
        }

        if (nextProps.name && nextProps.name !== name) {
            prop.name = nextProps.name;
        }

        if (nextProps.value !== value) {
            prop.value = nextProps.value;
        }

        if (nextProps.placeholder !== placeholder) {
            prop.placeholder = nextProps.placeholder;
        }

        if (Number(nextProps.max) !== max) {
            prop.max = Number(nextProps.max);
        }

        if (Object.keys(prop).length) {
            this.setStateData(() => prop);
        }
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onBlur(e) {
        const { onBlur, onValidate } = this.props;
        const t = e.target;
        const n = t.name;
        const v = t.value;
        let m = null;

        if (typeof onValidate === "function") {
            m = onValidate(e, n, v);
        }

        if (m || this.state.message) {
            this.setStateData(() => ({ message: m }));
        }

        if (typeof onBlur === "function") {
            onBlur(e, n, v);
        }
    }

    onChange(e) {
        const { regular, onChange } = this.props;
        const { max, type } = this.state;
        const t = e.target;
        const n = t.name;
        let v = t.value;

        this.setStateData(
            ({ value }) => {
                const length = value.toString().length;
                const isLength = max < 1 || (max > 0 && (length <= max || v.length < length));

                if (!isLength) {
                    v = value;
                } else if (regular instanceof RegExp) {
                    v = v.replace(regular, "");
                } else if (typeof regular === "function") {
                    v = regular(v);
                }

                if (type === "number" && v !== "") {
                    v = Number(v) || "";
                }

                return {
                    value: v,
                    message: null
                };
            },
            () => {
                if (typeof onChange === "function") {
                    onChange(e, n, v);
                }
            }
        );
    }

    setStateData(update, callBack) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callBack);
        }
    }

    render() {
        const { inline, readOnly, disabled } = this.props;
        const { className, type, name, id, value, max, placeholder, message } = this.state;
        const prop = {
            className: classNames(className, "_input", { _input__error: message }),
            type,
            name,
            id,
            value,
            placeholder,
            readOnly,
            disabled,
            onBlur: this.onBlur,
            onChange: this.onChange,
            ...inline
        };

        if (max) {
            prop.maxLength = max;
        }

        return React.createElement("input", prop, null);
    }
}

Input.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    regular: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(RegExp)]),
    name: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placeholder: PropTypes.string,
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    inline: PropTypes.shape([PropTypes.node]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onValidate: PropTypes.func
};
Input.defaultProps = {
    className: null,
    type: "text",
    regular: null,
    name: null,
    id: null,
    value: "",
    placeholder: null,
    max: 0,
    readOnly: false,
    disabled: false
};

export default Input;
