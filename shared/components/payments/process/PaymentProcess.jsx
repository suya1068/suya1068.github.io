import "../scss/payment_layout.scss";
import React, { Component, PropTypes } from "react";

class PaymentProcess extends Component {
    render() {
        return (
            <div className="payment__container payment__process">
                <div className="payment__contents">
                    <div className="payment__column">
                        <div className="content payment__result">
                            예약과 결제가 완료 되었습니다.
                        </div>
                    </div>
                    <div className="payment__column">
                        <div className="title">예약정보</div>
                        <div className="content">
                            <div className="payment__info">
                                <div className="info__row">
                                    <div className="title">촬영날짜</div>
                                    <div className="content">test</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="payment__column">
                        <div className="title">예약자</div>
                        <div className="content">
                            <div className="payment__info">
                                <div className="info__row">
                                    <div className="title">촬영날짜</div>
                                    <div className="content">test</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// apply_num: ""
// bank_name: null
// buyer_addr: ""
// buyer_email: "jaeuk1206@naver.com"
// buyer_name: "abcdefg"
// buyer_postcode: ""
// buyer_tel: ""
// card_name: null
// card_quota: 0
// currency: "KRW"
// custom_data: {…}
// imp_uid: "imp_802677061082"
// merchant_uid: "201809191604361852"
// name: "tetestetet"
// paid_amount: 100000
// paid_at: 0
// pay_method: "vbank"
// pg_provider: "html5_inicis"
// pg_tid: "StdpayVBNKINIpayTest20180919160454512545"
// pg_type: "payment"
// receipt_url: "https://iniweb.inicis.com/DefaultWebApp/mall/cr/cm/mCmReceipt_head.jsp?noTid=StdpayVBNKINIpayTest20180919160454512545&noMethod=1"
// request_id: "req_1537340677024"
// status: "ready"
// success: true
// vbank_date: "2018-09-19 23:59:00"
// vbank_holder: "（주）케이지이니시"
// vbank_name: "KB 국민은행"
// vbank_num: "99289014125929"

export default PaymentProcess;
