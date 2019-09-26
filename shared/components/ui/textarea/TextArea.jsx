import React, { Component, PropTypes } from "react";
import classNames from "classnames";

class TextArea extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            className: props.className,
            name: props.name,
            id: props.id,
            value: props.value,
            placeholder: props.placeholder,
            max: Number(props.max),
            rows: Number(props.rows),
            message: null
        };

        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const prop = {};
        const { className, name, id, value, placeholder, max, rows } = this.state;

        if (nextProps.className !== className) {
            prop.className = nextProps.className;
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

        if (Number(nextProps.rows) !== rows) {
            prop.rows = Number(nextProps.rows);
        }

        this.setStateData(() => prop);
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

        if (typeof onValidate === "function" && v) {
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
        const { onChange } = this.props;
        const { max } = this.state;
        const t = e.target;
        const n = t.name;
        let v = "";

        this.setStateData(
            ({ value }) => {
                if (max < 1 || (max > 0 && (value.length < max || t.value.length < value.length))) {
                    v = t.value;
                } else {
                    v = value;
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
        const { className, name, id, value, max, rows, placeholder } = this.state;

        const prop = {
            className: classNames("_textarea", className),
            name,
            id,
            value,
            rows,
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

        return React.createElement("textarea", prop, null);
    }
}

TextArea.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placeholder: PropTypes.string,
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    inline: PropTypes.shape([PropTypes.node]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onValidate: PropTypes.func
};
TextArea.defaultProps = {
    className: "",
    name: "",
    id: "",
    value: "",
    placeholder: "",
    max: 0,
    rows: 1,
    readOnly: false,
    disabled: false
};

export default TextArea;
