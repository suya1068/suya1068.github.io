import "./chargePayment.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

export default class ChargePayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectPaymentMethod: "trans",
            payMethods: [
                { no: 1, code: "trans", name: "계좌이체" },
                { no: 2, code: "card", name: "카드" },
                { no: 3, code: "vbank", name: "무통장 입금" }
            ]
        };
        this.checkMethod = this.checkMethod.bind(this);
        this.getPaymentMethod = this.getPaymentMethod.bind(this);
    }

    /**
     * 선택된 결제방법 체크
     * @param code
     * @returns {boolean}
     */
    checkMethod(code) {
        const { selectPaymentMethod } = this.state;
        return code === selectPaymentMethod;
    }

    /**
     * 결제방법 선택
     * @param code
     */
    onSelectMethod(code) {
        this.setState({ selectPaymentMethod: code });
    }

    /**
     * 결제방법 조회
     * @returns {string}
     */
    getPaymentMethod() {
        return this.state.selectPaymentMethod;
    }

    render() {
        const { payMethods } = this.state;
        return (
            <div className="charge-artist__paymethod">
                <p className="paymethod-title">결제수단</p>
                <div className="paymethod-content">
                    <div className="paymethod-box">
                        {payMethods.map(method => {
                            return (
                                <div
                                    key={`paymethod__${method.code}`}
                                    className={classNames("paymethod", { "select": this.checkMethod(method.code) })}
                                    onClick={() => this.onSelectMethod(method.code)}
                                >
                                    <div className="select-circle" />
                                    <p className="method-title">{method.name}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
