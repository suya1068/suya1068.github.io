import "./offerDetailFooter.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
// import PopInquire from "./PopInquire";
import PopModal from "shared/components/modal/PopModal";
import PopupPayment from "mobile/resources/components/popup/PopupPayment";

export default class OfferDetailFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
        this.onReservation = this.onReservation.bind(this);
        this.onInquire = this.onInquire.bind(this);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data });
    }

    onInquire() {
        const data = this.state.data;
        const isMobile = utils.agent.isMobile();

        // this.wcsEvent();
        //utils.ad.wcsEvent("5");

        if (isMobile) {
            document.location.href = `/users/chat?user_id=${data.artist_id}&offer_no=${data.no}`;
        } else {
            document.location.href = `/users/chat/${data.artist_id}/offer/${data.no}`;
        }

        // const inquireData = {
        //     no: data.no,
        //     artist_id: data.artist_id,
        //     order_no: data.order_no,
        //     id: data.session_info.user_id
        // };
        // const modalName = "offer-inquire";
        // const option = {
        //     className: modalName
        // };
        //
        // PopModal.createModal(modalName, <PopInquire {...inquireData} onCloseInquire={this.onCloseInquire} />, option);
        // PopModal.show(modalName);
    }

    onCloseInquire() {
        PopModal.close("offer-inquire");
    }

    /**
     * 예약하기
     */
    onReservation() {
        const data = this.props.data;
        const isMobile = utils.agent.isMobile();

        const modalName = "popup-payment";
        PopModal.createModal(
            modalName,
            <PopupPayment data={{ offer_no: data.no, order_no: data.order_no, option: data.option, price: data.price, redirect_url: `${__DOMAIN__}/users/estimate/${data.order_no}/offer/${data.no}/process` }} />,
            { className: isMobile ? "modal-fullscreen" : "", modal_close: false }
        );
        PopModal.show(modalName);
    }

    // wcsEvent() {
    //     if (wcs && wcs.cnv && wcs_do) {
    //         const _nasa = {};
    //         _nasa["cnv"] = wcs.cnv("5", "1");
    //         wcs_do(_nasa);
    //     }
    // }

    render() {
        return (
            <div className="offer-detail-footer">
                <button
                    onClick={this.onInquire}
                    className="button button-block button__rect inquire"
                >작가와 협의하기</button>
                <button
                    className="button button-block button__rect reserve"
                    onClick={this.onReservation}
                >결제하기</button>
            </div>
        );
    }
}
