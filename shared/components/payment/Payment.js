import API from "forsnap-api";
import utils from "forsnap-utils";
import auth from "forsnap-authentication";
import mewtime from "forsnap-mewtime";

class Payment {
    constructor() {
        this._state = {
            user_name: "",
            user_phone: "",
            user_email: "",
            method: [
                { name: "신용카드", value: "card", checked: true },
                { name: "계좌이체", value: "trans", checked: false },
                { name: "무통장 입금", value: "vbank", checked: false }
            ]
        };
    }

    setUserInfo(data) {
        if (data) {
            if (data.name) {
                this._state.user_name = data.name;
            }

            if (data.phone) {
                this._state.user_phone = data.phone;
            }

            if (data.email) {
                this._state.user_email = data.email;
            }
        }
    }

    getPayMethod() {
        return this._state.method.slice();
    }

    loadIMP(callBack) {
        utils.loadIMP(callBack);
    }

    getUser() {
        const user = auth.getUser();
        return API.users.find(user.id).then(response => {
            if (response.status === 200) {
                const data = response.data;

                this._state.user_name = data.name;
                this._state.user_phone = data.phone;
                this._state.user_email = data.email;

                return {
                    name: data.name,
                    phone: data.phone,
                    email: data.email
                };
            }

            return null;
        });
    }

    /**
     * 견적서 결제 준비하기
     * @param offerNo - Number (견적서 번호)
     * @param date - String (촬영일)
     * @param payMethod - Object (결제방식)
     * @param paymentName - String (결제명)
     * @param redirectUrl - String (모바일용 리다이렉스 주소)
     * @return {Promise.<TResult>} (null - 오류, Object - 파라미터들)
     */
    readyToEstimate(offerNo, date, payMethod, paymentName = "", redirectUrl = "", userMsg = "") {
        const promise = [];
        const user = auth.getUser();

        // window.fbq("track", "InitiateCheckout");
        promise.push(API.reservations.reserveToEstimate({ offer_no: offerNo, date }));

        return Promise.all(promise).then(response => {
            const payment = response[0];
            const name = this._state.user_name || user.data.name;
            const email = this._state.user_email || "";

            if (payment) {
                if (payment.status === 200) {
                    const data = payment.data;

                    const params = {
                        pay_method: payMethod.value,
                        amount: data.total_price,
                        name: paymentName || data.option_name,
                        merchant_uid: data.buy_no,
                        buyer_email: email,
                        buyer_name: name,
                        custom_data: {
                            user_id: user.id
                        }
                    };

                    if (userMsg) {
                        params.custom_data.user_msg = userMsg;
                    }

                    if (utils.agent.isMobile()) {
                        params.m_redirect_url = redirectUrl;
                    }

                    if (payMethod.value === "vbank") {
                        // 가상계좌 입금 기한은 최대 3일이다.
                        const dueDate = mewtime().add(3, mewtime.const.DATE);
                        params.vbank_due = `${dueDate.format("YYYYMMDD")}2359`;
                    }

                    return params;
                }
            }

            return null;
        }).catch(error => {
            return error.data || "";
        });
    }

    readyToTicket(readyParam, payMethod, paymentName = "", redirectUrl = "") {
        const promise = [];
        const user = auth.getUser();

        // window.fbq("track", "InitiateCheckout");
        promise.push(API.life.paymentReady(readyParam));

        return Promise.all(promise).then(response => {
            const payment = response[0];
            const name = this._state.user_name || user.data.name;
            const email = this._state.user_email || "";

            if (payment) {
                if (payment.status === 200) {
                    const data = payment.data;

                    const params = {
                        pay_method: payMethod.value,
                        amount: data.total_price,
                        name: paymentName || "",
                        merchant_uid: data.buy_no,
                        buyer_email: email,
                        buyer_name: name,
                        custom_data: {
                            user_id: user.id
                        }
                    };

                    if (utils.agent.isMobile()) {
                        params.m_redirect_url = redirectUrl;
                    }

                    if (payMethod.value === "vbank") {
                        // 가상계좌 입금 기한은 최대 3일이다.
                        const dueDate = mewtime().add(3, mewtime.const.DATE);
                        params.vbank_due = `${dueDate.format("YYYYMMDD")}2359`;
                    }

                    return params;
                }
            }

            return null;
        });
    }

    readyToTalk(messageNo, payMethod, paymentName, redirectUrl, userMsg) {
        const user = auth.getUser();
        const name = this._state.user_name || user.data.name;
        const email = this._state.user_email || "";

        // window.fbq("track", "InitiateCheckout");
        return API.reservations.reserveTalk({ talk_no: messageNo }).then(response => {
            if (response.status === 200) {
                const data = response.data;

                const params = {
                    pay_method: payMethod.value,
                    amount: data.total_price,
                    name: paymentName || data.option_name,
                    merchant_uid: data.buy_no,
                    buyer_email: email,
                    buyer_name: name,
                    custom_data: {
                        user_id: user.id
                    }
                };

                if (userMsg) {
                    params.custom_data.user_msg = userMsg;
                }

                if (utils.agent.isMobile()) {
                    params.m_redirect_url = redirectUrl;
                }

                if (payMethod.value === "vbank") {
                    // 가상계좌 입금 기한은 최대 3일이다.
                    const dueDate = mewtime().add(3, mewtime.const.DATE);
                    params.vbank_due = `${dueDate.format("YYYYMMDD")}2359`;
                }

                return params;
            }

            return null;
        });
    }

    payment(params) {
        return new Promise((resolve, reject) => {
            if (params) {
                IMP.request_pay(params, result => {
                    resolve(result);
                });
            } else {
                reject();
            }
        });
    }
}

export default new Payment();
