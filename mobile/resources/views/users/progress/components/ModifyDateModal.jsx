import React, { Component, PropTypes } from "react";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import CheckBox from "shared/components/ui/checkbox/CheckBox";

class ModifyDateModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            agree: false
        };

        this.onConfirm = this.onConfirm.bind(this);
    }

    onConfirm() {
        const { onConfirm } = this.props;
        const { agree } = this.state;

        if (!agree) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "'촬영일 변경에 동의합니다'에 체크해주세요."
            });
        } else {
            Modal.close();
            onConfirm();
        }
    }

    render() {
        const { agree } = this.state;

        return (
            <div className="modal__users__modify__date">
                작가님께서 촬영일 변경을 요청하셨습니다.<br />
                협의된 촬영일 변경이 아닌 경우 변경확인하지 마시고 작가님께 문의하시거나 고객센터로 접수해주세요.<br />
                촬영일 변경 후 환불기준일 등은 변경된 일자에 맞춰 적용됩니다.
                <div className="modify__date__agree">
                    <CheckBox checked={agree} onChange={b => this.setState({ agree: b })}>촬영일 변경에 동의합니다.</CheckBox>
                </div>
                <div className="modify__date__buttons">
                    <button className="_button radius__full _button__white" onClick={this.onConfirm}>확인</button>
                    <button className="_button radius__full _button__black" onClick={this.props.onCancel}>취소</button>
                </div>
            </div>
        );
    }
}

ModifyDateModal.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default ModifyDateModal;
