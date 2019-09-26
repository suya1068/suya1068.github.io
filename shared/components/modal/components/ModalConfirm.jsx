import React, { Component, PropTypes } from "react";

class ModalConfirm extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onSubmit() {
        const { onModalClose, onSubmit } = this.props;
        onModalClose();
        if (typeof onSubmit === "function") {
            onSubmit();
        }
    }

    onCancel() {
        const { onModalClose, onCancel } = this.props;
        onModalClose();
        if (typeof onCancel === "function") {
            onCancel();
        }
    }

    render() {
        const { content } = this.props;

        return (
            <div className="_modal__confirm">
                {content}
                <div className="_modal__buttons">
                    <button className="_button _button__default" onClick={this.onCancel} autoFocus>취소</button>
                    <button className="_button _button__default" onClick={this.onSubmit}>확인</button>
                </div>
            </div>
        );
    }
}

ModalConfirm.propTypes = {
    content: PropTypes.node,
    onModalClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
};

export default ModalConfirm;
