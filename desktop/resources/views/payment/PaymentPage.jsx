import "./PaymentPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import App from "desktop/resources/components/App";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Footer from "desktop/resources/components/layout/footer/Footer";

import CheckBox from "shared/components/ui/checkbox/CheckBox";

import PaymentProductReady from "shared/components/payments/ready/PaymentProductReady";
import PaymentProcess from "shared/components/payments/process/PaymentProcess";

class PaymentPage extends Component {
    constructor() {
        super();

        this.state = {
            isMount: true,
            pay_type: document.getElementById("pay_type").getAttribute("content"),
            pay_no: document.getElementById("pay_no").getAttribute("content")
        };

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    setStateData(update, callBack) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callBack);
        }
    }

    render() {
        const { pay_no, pay_type } = this.state;

        return (
            <main id="site-main">
                <div className="payment__page">
                    <div className="payment__page__main">
                        <PaymentProcess />
                        <PaymentProductReady product_no={pay_no} ref={ref => (this.refReady = ref)} />
                    </div>
                    <div className="payment__page__side">
                        <div className="payment__summary">
                            <div className="summary__content">
                                <div className="summary__row">
                                    <div className="title">예약날짜</div>
                                    <div className="content">111</div>
                                </div>
                                <div className="summary__row">
                                    <div className="title">예약인원</div>
                                    <div className="content">222</div>
                                </div>
                                <div className="summary__row highlight">
                                    <div className="title">최종결제금액</div>
                                    <div className="content">333</div>
                                </div>
                            </div>
                            <button className="_button _button__block _button__fill__yellow" onClick={() => this.refReady.onPayment()}>결제하기</button>
                        </div>
                        <div>
                            주문하실 상품을 확인하였으며, 구매에 동의하시겠습니까?
                            <CheckBox>동의합니다.</CheckBox> <a href="/" target="_blank">(전자상거래법 제8조 제2항)</a>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

ReactDOM.render(
    <App>
        <HeaderContainer />
        <PaymentPage />
        <Footer />
    </App>, document.getElementById("root")
);
