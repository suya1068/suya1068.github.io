import React from "react";
import redirect from "forsnap-redirect";
import utils from "forsnap-utils";
import tracking from "forsnap-tracking";
import API from "forsnap-api";

import PopModal from "shared/components/modal/PopModal";


const productNo = document.getElementById("product-data").content;
const params = utils.query.parse(document.location.href);

if (params.imp_success) {
    const buyNo = params.merchant_uid;
    const payUid = params.imp_uid;

    API.reservations.reserveToProductPay(buyNo, { product_no: productNo, pay_uid: payUid })
        .then(
            response => {
                const data = response.data;

                tracking.conversion();
                //console.log("productProcessPage", response, this.state);

                //utils.ad.fbqEvent("Purchase", { value: this.state.price, currency: "KRW" });

                PopModal.alert("예약요청이 완료되었습니다<br />예쁜사진을 남기시길 바래요.", { callBack: () => {
                    redirect.myProgressType(data.status_type, true);
                } });
            },
            error => {
                PopModal.alert(error.data, () => {
                    redirect.productOne(productNo, true);
                });
            }
        );
} else {
    PopModal.alert(params.error_msg, { callBack: () => {
        redirect.productOne(productNo, true);
    } });
}
