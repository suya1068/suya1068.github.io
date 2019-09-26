import React, { Component, PropTypes } from "react";

class ModalAlert extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.onClose = this.onClose.bind(this);
    }

    componentDidMount() {
    }

    onClose() {
        const { onModalClose, onSubmit } = this.props;
        onModalClose();
        if (typeof onSubmit === "function") {
            onSubmit();
        }
    }

    render() {
        const { content } = this.props;

        return (
            <div className="_modal__alert">
                {content}
                <div className="_modal__buttons">
                    <button className="_button _button__default" onClick={this.onClose} autoFocus>확인</button>
                </div>
            </div>
        );
    }
}

ModalAlert.propTypes = {
    content: PropTypes.node,
    onModalClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func
};

export default ModalAlert;
