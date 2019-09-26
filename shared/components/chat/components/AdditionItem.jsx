import "../scss/addition_item.scss";
import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

class AdditionItem extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.onPayment = this.onPayment.bind(this);
    }

    onPayment() {
        const { data, onPayment } = this.props;

        if (typeof onPayment === "function") {
            onPayment(data);
        }
    }

    render() {
        const { data } = this.props;

        if (!data) {
            return null;
        }

        const { content, message_type, price, status } = data;

        return (
            <div className="addition__item">
                <div className="addition__item__content">
                    {utils.linebreak(content)}
                </div>
                <div className="addition__item__title">
                    <span className="title">{`${message_type === "RESERVE_CUSTOM" ? "맞춤결제" : "추가결제"}금액`}</span>
                    <span className="price">{utils.format.price(price)}원</span>
                </div>
                <div className="addition__item__buttons">
                    {status && status.toUpperCase() === "CANCEL" ?
                        <button className="payment disable"><span>맞춤결제가 취소되었습니다.</span></button> :
                        <button className="payment" onClick={this.onPayment}><span>결제하기</span></button>
                    }
                </div>
                <div className="addition__item__alert">
                    <p className="addition__item__alert-desc">세금계산서 발급이 필요한 경우 결제 전 작가님께 문의해주세요.</p>
                </div>
            </div>
        );
    }
}

AdditionItem.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired,
    onPayment: PropTypes.func
};

export default AdditionItem;
