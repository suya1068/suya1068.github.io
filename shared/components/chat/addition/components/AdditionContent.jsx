import "../scss/AdditionContent.scss";
import React, { Component, PropTypes } from "react";

import PopModal from "shared/components/modal/PopModal";

class AdditionContent extends Component {
    constructor() {
        super();

        this.state = {
            placeholder: "해당 촬영에 대한 촬영종류,촬영컨셉,옵션포함여부 등을 자세히 남겨주세요. 추후 분쟁이 생겼을때의 근거자료가 됩니다.",
            maxLength: 100,
            message: ""
        };

        this.onChange = this.onChange.bind(this);

        this.setContent = this.setContent.bind(this);
    }

    onChange(e) {
        if (e && e.currentTarget) {
            const target = e.currentTarget;
            const v = target.value;
            const maxLength = target.maxLength;

            if (maxLength && v.length <= maxLength) {
                this.setState({
                    message: this.setContent(v)
                });
            }
        }
    }

    setContent(content) {
        const { IF } = this.props.data;

        if (IF && typeof IF.setContent === "function") {
            return IF.setContent(content);
        }

        return "";
    }

    render() {
        const { placeholder, maxLength, message } = this.state;

        return (
            <div className="addition__content">
                <div className="addition__content__message">
                    <div className="message__area">
                        <textarea placeholder={placeholder} value={message} rows="8" maxLength={maxLength} onChange={this.onChange} />
                    </div>
                    <div className="message__count">
                        {message ? message.length : 0} / {maxLength}
                    </div>
                </div>
            </div>
        );
    }
}

AdditionContent.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired
};

export default AdditionContent;
