import React, { Component, PropTypes } from "react";

import mewtime from "forsnap-mewtime";
import utils from "forsnap-utils";

import constant from "shared/constant";
import { PAYMENT_CODE } from "shared/constant/payment.const";
import { PROCESS_BREADCRUMB_CODE } from "shared/constant/reservation.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Input from "shared/components/ui/input/Input";
import DropDown from "shared/components/ui/dropdown/DropDown";

class RefundModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comment: "",
            vbank_user_name: "",
            vbank_code: "",
            vbank_num: "",
            bank_list: [{ name: "은행을 선택해주세요.", value: "" }].concat(constant.REFUND_BANK)
        };

        this.onReserveCancel = this.onReserveCancel.bind(this);
    }

    onReserveCancel() {
        const { data, onReserveCancel } = this.props;
        const { comment, vbank_user_name, vbank_code, vbank_num } = this.state;
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
        } else if (data.pay_type === PAYMENT_CODE.BANK && data.status_type !== PROCESS_BREADCRUMB_CODE.READY) {
            if (!vbank_code) {
                message = "환불받을 은행을 선택해 주세요.";
            } else if (!vbank_user_name.replace(/\s/g, "")) {
                message = "예금주 명을 입력해주세요.\n 입금자와 동일명의의 계좌만 가능합니다.";
            } else if (!vbank_num.replace(/\s/g, "")) {
                message = "계좌번호를 입력해주세요.";
            } else {
                params.vbank_user_name = vbank_user_name;
                params.vbank_code = vbank_code;
                params.vbank_num = vbank_num;
            }
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
        const { data } = this.props;
        const { comment, vbank_user_name, vbank_code, vbank_num, bank_list } = this.state;

        const today = mewtime().startOf();
        const reserveDate = mewtime(data.reserve_dt).startOf();
        const days = (reserveDate.numberOfDays(today) || 0).toFixed();
        let per = 0;

        if (days > 30) {
            per = 1;
        } else if (days > 14) {
            per = 0.5;
        } else if (days > 7) {
            per = 0.2;
        } else {
            return (
                <div className="refund__modal">
                    <div className="message">촬영일 기준 7일 이내 결제취소는 불가능합니다.<br />작가님과 협의해주세요.</div>
                    <div className="button__close">
                        <button className="_button _button__white" onClick={() => Modal.close()}>확인</button>
                    </div>
                </div>
            );
        }

        if (data.status_type !== PROCESS_BREADCRUMB_CODE.READY) {
            return (
                <div className="refund__modal">
                    <div className="title"><strong>취소하시는 이유</strong>를 입력해주세요.</div>
                    <div className="price">
                        {utils.format.price(Math.floor(data.total_price * per).toFixed())}원이 환불됩니다.
                    </div>
                    <div className="reason">
                        <p className="label">취소이유</p>
                        <Input
                            value={comment}
                            id="comment"
                            name="comment"
                            placeholder="취소하시는 이유를 입력해주세요."
                            onChange={(e, n, v) => this.setState({ [n]: v })}
                        />
                    </div>
                    {data.pay_type === PAYMENT_CODE.BANK ? [
                        <div key="bank" className="bank">
                            <div>
                                <p className="label">환불 은행명</p>
                                <DropDown data={bank_list} select={vbank_code} onSelect={v => this.setState({ vbank_code: v })} />
                            </div>
                            <div>
                                <p className="label">환불 예금주</p>
                                <Input
                                    value={vbank_user_name}
                                    name="vbank_user_name"
                                    placeholder="에금주"
                                    onChange={(e, n, v) => this.setState({ [n]: v })}
                                />
                            </div>
                            <div>
                                <p className="label">환불 계좌번호</p>
                                <Input
                                    value={vbank_num}
                                    name="vbank_num"
                                    placeholder="계좌번호"
                                    onChange={(e, n, v) => this.setState({ [n]: v })}
                                />
                            </div>
                        </div>,
                        <div key="attention" className="attention">
                            입금자와 동일명의의 계좌만 가능합니다.
                        </div>,
                        <div key="info" className="info">
                            <p className="title">포스냅에서 알려드립니다.</p>
                            <p className="content">
                                무통장 입금 취소시 환불 계좌 정보 (예금주, 은행, 계좌번호) 추가 입력해야 합니다.
                                입금자와 동일명의의 계좌만 가능합니다.
                            </p>
                        </div>] : null
                    }
                    <div className="buttons">
                        <button className="_button _button__white" onClick={() => Modal.close()}>취소</button>
                        <button className="_button _button__white" onClick={this.onReserveCancel}>확인</button>
                    </div>
                </div>
            );
        }

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
