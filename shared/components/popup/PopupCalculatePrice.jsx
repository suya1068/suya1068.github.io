import "./scss/calculate_price.scss";
import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import PopModal from "shared/components/modal/PopModal";

class PopupCalculatePrice extends Component {
    constructor(props) {
        super(props);

        let price;

        try {
            price = isNaN(props.price) || !props.price ? "" : parseInt(props.price, 10);
        } catch (e) {
            price = "";
        }

        this.state = {
            price,
            calculate: utils.calculatePrice(price)
        };

        this.onChangePrice = this.onChangePrice.bind(this);
    }

    onChangePrice(e) {
        const current = e.currentTarget;
        let value = current.value;
        const maxLength = current.maxLength;
        const prop = {};
        value = value.replace(/,/g, "").replace(/\D/g, "");

        if (maxLength && maxLength > -1 && value.length > maxLength) {
            return;
        }

        prop.price = value && !isNaN(value) ? parseInt(value, 10) : "";

        if (prop.price >= 100000) {
            prop.calculate = utils.calculatePrice(prop.price);
        } else {
            prop.calculate = utils.calculatePrice(0);
        }

        this.setState(prop, () => {
            setTimeout(() => {
                const length = current.value.length;
                current.setSelectionRange(length, length);
            }, 0);
        });
    }

    render() {
        const { price, calculate } = this.state;
        let totalPrice = 0;

        return (
            <div className="calculate__price">
                <div className="calculate__price__header">
                    <div className="title">
                        예상정산금액 계산기
                    </div>
                    <button className="modal-close" onClick={() => PopModal.close()} />
                </div>
                <div className="calculate__price__body">
                    <div className="price__input">
                        <div className="title">총 결제금액</div>
                        <div className="price">
                            <input type="tel" value={utils.format.price(price)} maxLength="13" onChange={this.onChangePrice} /><span className="won">원</span>
                        </div>
                    </div>
                    <div className="price__graph">
                        <div className="price__graph__row">
                            <div className="price">금액</div>
                            <div className="per">수수료</div>
                            <div className="total">수익금</div>
                        </div>
                        {calculate.map(p => {
                            totalPrice += p.price;
                            return (
                                <div key={`calculate-${p.standard}`} className="price__graph__row">
                                    <div className="price">{utils.format.price(p.standard)} ~ {utils.format.price(p.max)}</div>
                                    <div className="per">{p.per * 100}%</div>
                                    <div className="total">{utils.format.price(p.price)}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="price__total">
                        <div className="title">총 수익금</div>
                        <div className="price">{utils.format.price(totalPrice)}<span className="won">원</span></div>
                    </div>
                    <div className="price__noti">
                        <span className="exclamation">!</span>정산예정금액 / 판매금액에 따라 수수료율이 달라집니다.
                    </div>
                </div>
            </div>
        );
    }
}

PopupCalculatePrice.propTypes = {
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

PopupCalculatePrice.defaultProps = {
    price: ""
};

export default PopupCalculatePrice;
