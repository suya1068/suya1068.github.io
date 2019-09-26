import React, { Component, PropTypes } from "react";
import InfoBox from "./component/InfoBox";

export default class ContactResStart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_step: props.cur_step,
            cur_info: props.cur_info,
            onChangeHandler: props.onChangeHandler,
            is_agree: props.is_agree
        };
    }

    onInitKey() {
        return {
            is_agree: false
        };
    }

    render() {
        const { is_agree, onChangeHandler, cur_info } = this.props;
        return (
            <div className="chat-contact-res__body__start-step">
                <InfoBox info={cur_info} is_agree={is_agree} onChangeHandler={onChangeHandler} />
            </div>
        );
    }
}

ContactResStart.propTypes = {
    cur_step: PropTypes.string.isRequired,
    cur_info: PropTypes.shape([PropTypes.node]),
    onChangeHandler: PropTypes.func.isRequired,
    is_agree: PropTypes.bool.isRequired
};
