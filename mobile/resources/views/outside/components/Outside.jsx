import "./outside.scss";
import React, { Component } from "react";

import auth from "forsnap-authentication";

import PopModal from "shared/components/modal/PopModal";

import Detail from "mobile/resources/components/estimate/offer/detail/Detail";
import { Footer } from "mobile/resources/containers/layout";

import PaymentOfferMobile from "shared/components/payment/PaymentOfferMobile";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

export default class Outside extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offer_data: props.offer_data,
            order_data: props.order_data,
            portfolio: props.portfolio
        };

        this.onPayment = this.onPayment.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    onPayment() {
        const user = auth.getUser();

        if (user) {
            const { offer_data, order_data } = this.props;
            const data = {
                offer_no: offer_data.no,
                order_no: order_data.no,
                option: offer_data.option,
                price: offer_data.price,
                redirect_url: `${__DOMAIN__}/users/estimate/${order_data.no}/offer/${offer_data.no}/process`
            };

            const modalName = "payment-offer";
            PopModal.createModal(modalName, <PaymentOfferMobile data={data}/>, {
                className: "modal-fullscreen",
                modal_close: false
            });
            PopModal.show(modalName);
        } else {
            PopModal.alert("로그인 후 이용가능합니다");
        }
    }

    render() {
        const { offer_data, order_data, portfolio } = this.props;
        return (
            <div className="mobile-outside">
                <Detail outside offerData={offer_data} orderData={order_data} portfolio={portfolio} read_dt={offer_data.read_dt} userType="U" />
                <div className="outside__button__group">
                    <button className="button__payment" onClick={this.onPayment}>결제하기</button>
                </div>
                <Footer>
                    <ScrollTop />
                </Footer>
            </div>
        );
    }
}
