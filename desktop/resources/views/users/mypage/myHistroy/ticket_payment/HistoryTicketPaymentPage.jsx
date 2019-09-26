import "./HistoryTicketPaymentPage.scss";
import classnames from "classnames";
import React, { Component, PropTypes } from "react";
import Table from "../share/table/Table";

import utils from "forsnap-utils";
import Redirect from "forsnap-redirect";
import API from "forsnap-api";
import CONSTANT from "shared/constant";

import PopModal from "shared/components/modal/PopModal";
import Img from "shared/components/image/Img";
import Buttons from "desktop/resources/components/button/Buttons";
import EmptyList from "../share/empty/EmptyList";
import HistoryTitle from "../share/title/HistoryTitle";
import MorePagination from "../share/pagination/MorePagination";

const { CODE, PAYMENT_STATUS_CODE, TICKET_PRODUCT } = CONSTANT.TICKET;
const Style = {
    button: {
        cancel: { size: "tiny", width: "w68", shape: "circle", theme: "default" },
        more: { width: "block", shape: "round", theme: "bg-white" }
    }
};

export default class HistoryTicketPaymentPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetching: false,
            total: 0,
            ids: [],
            data: {},
            paging: { offset: 0, limit: 10 },
            columnDefs: [
                { field: "buy_no", name: "주문번호", width: 200, className: "text-center", template: entity => this.renderBuyNo(entity) },
                { field: "pay_type", name: "결제내역", width: 135, className: "text-center", template: entity => this.renderPay(entity) },
                { field: "title", name: "상품정보", className: "text-center", template: entity => this.renderProduct(entity) },
                { field: "status", name: "티켓현황", width: 120, className: "text-center", template: entity => this.renderStatus(entity) }
            ]
        };

        this.onQuery = this.onQuery.bind(this);
        this.onShowCancelPopup = this.onShowCancelPopup.bind(this);

        this.setPaymentList = this.setPaymentList.bind(this);
        this.updateTicket = this.updateTicket.bind(this);
        this.isVBank = this.isVBank.bind(this);
        this.isUsableTiket = this.isUsableTiket.bind(this);

        this.cancelTicket = this.cancelTicket.bind(this);

        this.renderBuyNo = this.renderBuyNo.bind(this);
        this.renderPay = this.renderPay.bind(this);
        this.renderVBank = this.renderVBank.bind(this);
        this.renderProduct = this.renderProduct.bind(this);
        this.renderStatus = this.renderStatus.bind(this);
        this.renderCancelButton = this.renderCancelButton.bind(this);
        this.renderNoneListView = this.renderNoneListView.bind(this);
        this.renderListView = this.renderListView.bind(this);
    }

    componentDidMount() {
        this.onQuery(this.state.paging);
    }

    /**
     * 티켓 결제 내역을 조회한다.
     * @param {object} params
     * @param {number} params.limit
     * @param {number} params.offset
     */
    onQuery(params) {
        API.life.findTicketPaymentList(params).then(response => this.setPaymentList(params, response.data));
    }

    /**
     * 티켓 결제 취소 팝업을 띄운다.
     * @param data
     */
    onShowCancelPopup(data) {
        if (this.isVBank(data)) {
            PopModal.confirm(
                <div className="ticket-cancel-popup">
                    <div className="ticket-cancel-popup-title">
                        무통장입금 환불 건은<br />
                        <span>마이페이지 &#62; 대화하기 &#62; 고객센터로 접수해주세요.</span>
                    </div>
                    <div className="ticket-cancel-popup-description">
                        주문번호/환불계좌정보(은행, 예금주, 계좌번호)를 남겨주세요.
                    </div>
                </div>,
                () => Redirect.chatUserHelp(),
                null,
                "center",
                { titleOk: "바로가기" }
            );
        } else {
            PopModal.confirm(
                <div className="ticket-cancel-popup">
                    <div className="ticket-cancel-popup-title">환불하시겠습니까?</div>
                    <div className="ticket-cancel-popup-description">
                        티켓의 일부만 환불을 원하시는 경우 전체티켓취소 후 재 결제 해주세요.
                    </div>
                </div>
                ,
                () => this.cancelTicket(data)
                    .then(
                        response => this.updateTicket(response.data),
                        error => PopModal.alert(error.data)
                    )
            );
        }
    }

    /**
     * 조회된 티켓 내역을 모델에 저장한다.
     * @param {object} params
     * @param {{total_count:number, list:Array}} data
     */
    setPaymentList(params, data) {
        const { entity, ids } = utils.normalize(data.list, "buy_no", item => Object.assign(item, TICKET_PRODUCT.product_1));

        this.setState({
            paging: params,
            total: Number(data.total_count),
            data: { ...this.state.data, ...entity },
            ids: utils.uniq(this.state.ids.concat(ids)),
            isFetching: true
        });
    }

    /**
     * 티켓내역을 업데이트한다.
     * @param data
     */
    updateTicket(data) {
        this.setState({
            data: { ...this.state.data, [data.buy_no]: Object.assign(data, TICKET_PRODUCT.product_1) }
        });

        PopModal.alert("환불처리되었습니다.");
    }

    /**
     * 티켓을 취소한다.
     * @param data
     * @returns {Promise}
     */
    cancelTicket(data) {
        return API.life.cancelTickets(data.buy_no);
    }

    /**
     * 가상계좌인지 판단한다.
     * @param {object} data
     * @return {boolean}
     */
    isVBank(data) {
        return data.pay_type === CONSTANT.PAY_METHOD.vbank.value;
    }

    /**
     * 티켓을 사용가능한지 판단한다.
     * @param code
     * @returns {boolean}
     */
    isUsableTiket(code) {
        return CODE.PAYMENT === code;
    }


    /**
     * 주문번호와 환불 버튼을 랜더링한다.
     * @param data
     * @returns {XML}
     */
    renderBuyNo(data) {
        return (
            <div>
                <div className="pay-group">{ data.buy_no }</div>
                { data.cancel_display === "Y" && (
                    <div className="pay-group">
                        <Buttons buttonStyle={Style.button.cancel} inline={{ onClick: () => this.onShowCancelPopup(data) }}>취소하기</Buttons>
                    </div>
                ) }
            </div>
        );
    }

    /**
     * 결제내역을 랜더링한다.
     * @param data
     * @returns {XML}
     */
    renderPay(data) {
        return (
            <div>
                <div className="pay-method">{ CONSTANT.PAY_METHOD[data.pay_type].name }</div>
                <div className="pay-price">{ utils.format.price(data.total_price) }원</div>
                { this.isVBank(data) && this.renderVBank(data) }
            </div>
        );
    }

    /**
     * 가상계좌를 랜더링한다.
     * @param data
     * @return {XML}
     */
    renderVBank(data) {
        return (
            <div className="pay-vbank pay-divider">
                <div className="pay-group">
                    <div>{ data.vbank_name }</div>
                    <div>{ data.vbank_num }</div>
                </div>
                <div className="pay-group pay-vbank-date">
                    <div>만료일</div>
                    <div>{ data.vbank_date }까지</div>
                </div>
            </div>
        );
    }

    renderProduct(data) {
        return (
            <div className="pay-product">
                <div className="pay-product__image profile-img img-medium">
                    <Img image={{ type: "image", src: data.profile_img }} />
                </div>
                <div className="pay-product__content">
                    <div className="pay-group">
                        <div className="pay-product-title" title={data.main_title}>{ data.main_title }</div>
                    </div>
                    <div className="pay-group">
                        { data.option.map(item => (
                            <div key={item.ticket_code} className="pay-product-option">
                                <span className={classnames("pay-product-option__text", { "pay-product-option__text--usable": item.status === CODE.PAYMENT })}>
                                    { `${item.place} ∙ ${item.option}` }
                                </span>
                            </div>
                        )) }
                    </div>
                </div>
            </div>
        );
    }

    /**
     * 티켓현황을 랜더링한다.
     * @param data
     * @returns {XML}
     */
    renderStatus(data) {
        if (![CODE.PAYMENT, CODE.USE].includes(data.status)) {
            return <div>{ PAYMENT_STATUS_CODE[data.status].name }</div>;
        }

        const { length } = data.option;
        const usableLength = data.option.filter(item => item.status === CODE.PAYMENT).length;

        return usableLength === 0
            ? <div>사용완료</div>
            : (
                <div>
                    <div><span className="pay-status--emphasis">{ length }</span>장 중 <span className="pay-status--emphasis">{ usableLength }</span>장</div>
                    <div>사용가능</div>
                </div>
            );
    }

    /**
     * 진행현황을 랜더링한다.
     * @param data
     * @return {XML}
     */
    renderCancelButton(data) {
        return (
            <div>
                { this.isUsableTiket(data.status) && (
                    <div className="pay-group">
                        <Buttons buttonStyle={Style.button.cancel} inline={{ onClick: () => this.onShowCancelPopup(data) }} >취소하기</Buttons>
                    </div>
                )}
            </div>
        );
    }

    renderNoneListView() {
        return <EmptyList title="티켓 예매 내역이 없습니다." />;
    }

    renderListView() {
        const { paging, total, data, ids, columnDefs } = this.state;

        return (
            <div className="my-ticket-page">
                <div className="ticket-payment-page__header">
                    <HistoryTitle
                        total={total}
                        title="티켓구매내역"
                        caption="구매한 티켓내역을 확인하실 수 있습니다."
                    />
                </div>
                <div className="ticket-payment-page__body">
                    <Table data={ids.map(id => data[id])} columnDefs={columnDefs} />
                </div>
                <div className="ticket-payment-page__footer">
                    <MorePagination total={total} {...paging} onQuery={this.onQuery}>더보기</MorePagination>
                </div>
            </div>
        );
    }

    render() {
        const { isFetching, ids } = this.state;

        if (!isFetching) {
            return null;
        }

        return ids.length > 0 ? this.renderListView() : this.renderNoneListView();
    }
}
