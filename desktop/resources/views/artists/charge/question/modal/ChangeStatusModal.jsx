import React, { Component, PropTypes } from "react";

class ChangeStatusModal extends Component {
    render() {
        const { close, confirm } = this.props;

        return (
            <div className="charge__question__status__modal">
                <button className="_button _button__close black__lighten" onClick={close} />
                <div className="content__header">
                    <img alt="i" src={`${__SERVER__.img}/common/f_logo_black.png`} />
                </div>
                <div className="content__body">
                    촬영완료 상태로 변경하시면 고객님께 감사문자가 전달되며,<br />
                    자동후기가 등록됩니다.<br />
                    촬영완료 상태로 변경하시겠습니까?
                </div>
                <div className="content__button">
                    <button className="_button _button__white" onClick={close}>취소</button>
                    <button className="_button _button__black" onClick={confirm}>확인</button>
                </div>
            </div>
        );
    }
}

ChangeStatusModal.propTypes = {
    close: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired
};

export default ChangeStatusModal;
