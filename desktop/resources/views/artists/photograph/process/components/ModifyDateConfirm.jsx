import React, { Component, PropTypes } from "react";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import CheckBox from "shared/components/ui/checkbox/CheckBox";

class ModifyDateConfirm extends Component {
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
                content: "'확인하였습니다'에 체크해주세요"
            });
        } else {
            Modal.close();
            onConfirm();
        }
    }

    render() {
        const { agree } = this.state;

        return (
            <div className="artist__progress__modify__date">
                고객님과 협의된 경우에만 촬영일 변경을 진행할 수 있습니다.<br />
                변경된 촬영일은 고객님이 변경확인 해주시거나 3일이 지나면 자동변경됩니다.<br />
                촬영일 변경 후 환불기준일 등은 변경된 일자에 맞춰 적용됩니다.
                <div className="modify__date__agree">
                    <CheckBox checked={agree} onChange={b => this.setState({ agree: b })}>확인하였습니다.</CheckBox>
                </div>
                <div className="modify__date__buttons">
                    <button className="_button radius__full _button__white" onClick={this.onConfirm}>확인</button>
                    <button className="_button radius__full _button__black" onClick={this.props.onCancel}>취소</button>
                </div>
            </div>
        );
    }
}

ModifyDateConfirm.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default ModifyDateConfirm;
