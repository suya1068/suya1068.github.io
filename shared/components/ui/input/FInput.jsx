import React, { Component, PropTypes } from "react";

class FInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
            message: ""
        };

        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const pValue = nextProps.value;
        const { value } = this.state;
        const prop = {};

        if (pValue !== value) {
            prop.value = pValue;
        }

        this.setState(prop);
    }

    onChange(e) {
        const { onChange, onValidate } = this.props;
        const prop = {};
        const target = e.target;
        prop.value = target.value;
        const maxLength = Number(target.max);

        if (maxLength && !isNaN(maxLength) && maxLength > 0 && prop.value.length > maxLength) {
            return;
        }

        if (typeof onValidate === "function") {
            const validate = onValidate(e, prop.value);

            if (!validate.status) {
                prop.message = validate.message || "";
                delete prop.value;
            }
        }

        this.setState(prop, () => {
            if (typeof onChange === "function") {
                onChange(e, prop.value);
            }
        });
    }

    render() {
        const { inline } = this.props;
        const { value } = this.state;

        return (
            <input
                {...Object.assign({
                    className: "f__input",
                    type: "text",
                    value,
                    onChange: this.onChange
                },
                inline)}
            />
        );
    }
}

// data - ()
FInput.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onValidate: PropTypes.func,
    inline: PropTypes.shape([PropTypes.node])
};

FInput.defaultProps = {
    value: "",
    inline: {}
};

export default FInput;
