import React, { Component, PropTypes } from "react";

class CompleteModal extends Component {
    render() {
        const { close } = this.props;

        return (
            <div className="concept__consult__complete__modal">
                <button className="_button _button__close black__lighten" onClick={close} />
                <div className="content__header">
                    <img alt="i" src={`${__SERVER__.img}/common/f_logo_black.png`} />
                </div>
                <div className="content__body">
                    <div className="title">작가님께 전달이 완료되었습니다. </div>
                    <div className="description">빠르게 연락드리겠습니다.</div>
                </div>
                <div className="content__button">
                    <button onClick={close}>닫기</button>
                </div>
            </div>
        );
    }
}

CompleteModal.propTypes = {
    close: PropTypes.func.isRequired
};

export default CompleteModal;
