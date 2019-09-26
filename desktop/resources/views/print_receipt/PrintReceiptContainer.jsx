import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRoute } from "react-router";
import PrintReceipt from "./PrintReceipt";
import API from "forsnap-api";
import utils from "forsnap-utils";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

class PrintReceiptContainer extends Component {
    constructor(props) {
        super(props);
        const search = location.search && utils.query.parse(location.search);
        this.state = {
            user_type: "U",
            status: this.setStatusReservation(search),
            type: this.setTypeReservation(search),
            searchDate: this.setSearchDate(search)
        };
    }

    componentWillMount() {
        this.setState({
            buy_no: this.props.routeParams && this.props.routeParams.buy_no
        });
    }

    componentDidMount() {
        const { type } = this.state;
        if (type === "COMPLETE") {
            this.getCompleteDataForBuyNo();
        } else {
            this.getReservationDataForBuyNo();
        }
    }

    /**
     * 예약내역 조회 api
     * @returns {*}
     */
    apiGetReservations() {
        const { buy_no, user_type, status } = this.state;
        const params = { buy_no, user_type, status, offset: 0, limit: 10 };
        return API.reservations.findReserveAll(params);
    }

    /**
     * 완료된 촬영 내역 조회 api
     * @returns {*}
     */
    apiGetComplete() {
        const { buy_no, user_type, searchDate } = this.state;
        const params = { buy_no, user_type, start_dt: searchDate.start_dt, end_dt: searchDate.end_dt };
        return API.reservations.fetchAllCompleteList(params);
    }

    /**
     * 예약내역 조회 처리
     */
    getCompleteDataForBuyNo() {
        this.apiGetComplete()
            .then(response => {
                const data = response.data.list[0];
                this.setState(() => this.setFormData(data));
            })
            .catch(error => {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "잘못된 접근입니다.",
                    onSubmit: () => (location.href = "/")
                });
            });
    }

    /**
     * 완료된 촬영 내역 조회 처리
     * @returns {Promise<T>}
     */
    getReservationDataForBuyNo() {
        return this.apiGetReservations()
            .then(response => {
                const data = response.data;
                this.setState(() => this.setFormData(data.list[0]));
            })
            .catch(error => {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "잘못된 접근입니다.",
                    onSubmit: () => (location.href = "/")
                });
            });
    }

    /**
     * 진행단계 파라미터 저장
     * @param search
     * @returns {*|string}
     */
    setStatusReservation(search) {
        return search.status || "PAYMENT";
    }

    /**
     * 내역조회 타입 저장
     * @param search
     * @returns {*|undefined}
     */
    setTypeReservation(search) {
        return search.type || undefined;
    }

    /**
     * 조회기간 저장
     * @param search
     * @returns {{start_dt: *, end_dt: *}}
     */
    setSearchDate(search) {
        return { start_dt: search.start, end_dt: search.end };
    }

    /**
     * 폼데이터 저장
     * @param data
     * @returns {{form: {buy_no: *, paid_dt: *, total_price: *, title: *, user_name: *}}}
     */
    setFormData(data) {
        return {
            form: {
                buy_no: data.buy_no,
                paid_dt: data.paid_dt,
                total_price: data.total_price,
                title: data.title,
                user_name: data.user_name
            }
        };
    }

    /**
     * 윈도우창 닫기
     * @param e
     */
    onClose(e) {
        window.close();
    }

    render() {
        const { form } = this.state;
        return (
            <div>
                <PrintReceipt form={form} onClose={this.onClose} />
            </div>
        );
    }
}

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/reserve/receipt/(:buy_no)" component={PrintReceiptContainer} />
    </Router>, document.getElementById("root")
);
