import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Input from "shared/components/ui/input/Input";

class RefundModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comment: ""
        };

        this.onReserveCancel = this.onReserveCancel.bind(this);
    }

    onReserveCancel() {
        const { data, onReserveCancel } = this.props;
        const { comment } = this.state;
        let message = "";

        const params = {
            comment
        };

        if (data.product_no) {
            params.product_no = data.product_no;
        }

        if (!comment.replace(/\s/g, "")) {
            message = "취소이유를 알려주세요.";
        } else if (comment.length < 5) {
            message = "취소이유를 5자 이상 적어주세요.";
        }

        if (message) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                close: false,
                content: utils.linebreak(message)
            });
        } else {
            onReserveCancel(data.buy_no, params);
        }
    }

    render() {
        const { comment } = this.state;

        return (
            <div className="refund__modal">
                <div className="title"><strong>취소하시는 이유</strong>를 입력해주세요.</div>
                <div className="reason">
                    <Input
                        value={comment}
                        id="comment"
                        name="comment"
                        placeholder="취소하시는 이유를 입력해주세요."
                        onChange={(e, n, v) => this.setState({ [n]: v })}
                    />
                </div>
                <div className="buttons">
                    <button className="_button _button__white" onClick={() => Modal.close()}>취소</button>
                    <button className="_button _button__white" onClick={this.onReserveCancel}>확인</button>
                </div>
            </div>
        );
    }
}

RefundModal.propTypes = {
    data: PropTypes.shape([PropTypes.node]),
    onReserveCancel: PropTypes.func
};

export default RefundModal;
