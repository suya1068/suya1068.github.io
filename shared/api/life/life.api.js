import utils from "shared/helper/utils";

class Life {
    constructor(instance) {
        this.base = "/reservations-life-ticket";
        this.instance = instance;
    }

    /**
     * 티켓 리스트를 가져온다.
     * @param params
     * @returns {Promise}
     */
    findTicketList(params) {
        const options = utils.query.stringify(params);
        return this.instance.get(`${this.base}?${options}`);
    }

    /**
     * 티켓 구매내역을 가져온다.
     * @param {object} params
     * @param {number} params.limit
     * @param {number} params.offset
     * @returns {Promise}
     */
    findTicketPaymentList(params) {
        const options = utils.query.stringify(params);
        return this.instance.get(`${this.base}/groups?${options}`);
    }

    /**
     * 티켓을 사용한다.
     * @param params
     * @returns {Promise}
     */
    useTickets(params) {
        return this.instance.put(`${this.base}/use`, utils.query.stringify(params));
    }

    /**
     * 티켓을 취소한다.
     * @param buyNo - 주문번호
     * @returns {Promise}
     */
    cancelTickets(buyNo) {
        return this.instance.put(`${this.base}/${buyNo}/cancel`);
    }

     /* 티켓 예약 옵션 조회.
     * @param params
     * @returns {Promise}
     */
    findTicketOptions() {
        return this.instance.get(`${this.base}/option`);
    }

    /**
     * 티켓 예약 요청
     * @param data - Object (buy_data)
     * @return {*|{Content-Type}|axios.Promise}
     */
    paymentReady(data) {
        return this.instance.post(`${this.base}`, utils.query.stringify(data));
    }

    /**
     * 티켓 결제 완료
     * @param buyNo - String
     * @param data - Object ()
     * @return {*|axios.Promise}
     */
    paymentComplete(buyNo, data) {
        return this.instance.put(`${this.base}/${buyNo}/payment`, utils.query.stringify(data));
    }
}

export default Life;
