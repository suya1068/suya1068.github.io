import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import Checkbox from "desktop/resources/components/form/Checkbox";

class PassOriginModal extends Component {
    constructor() {
        super();

        this.state = {
            agree: false
        };

        this.onCheck = this.onCheck.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    onCheck(value) {
        this.setState({
            agree: value
        });
    }

    onConfirm() {
        const { error_msg } = this.props;
        if (this.state.agree) {
            Modal.close();
            this.props.confirm();
        } else {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(error_msg)
            });
        }
    }

    render() {
        const { pass_msg, check_msg } = this.props;
        return (
            <div className="photograph__pass__origin">
                {utils.linebreak(pass_msg)}
                <div className="pass__origin__agree">
                    <Checkbox
                        type="yellow_small"
                        checked={this.state.agree}
                        resultFunc={this.onCheck}
                    >{check_msg}</Checkbox>
                </div>
                <div className="pass__origin__confirm">
                    <button className="f__button f__button__circle f__button__theme__black" onClick={this.onConfirm}>확인</button>
                    <button className="f__button f__button__circle f__button__theme__black" onClick={() => Modal.close()}>취소</button>
                </div>
            </div>
        );
    }
}

PassOriginModal.propTypes = {
    confirm: PropTypes.func.isRequired,
    pass_msg: PropTypes.string.isRequired,
    check_msg: PropTypes.string.isRequired,
    error_msg: PropTypes.string.isRequired
};

export default PassOriginModal;
