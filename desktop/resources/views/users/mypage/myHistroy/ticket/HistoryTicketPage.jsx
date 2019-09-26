import classnames from "classnames";
import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";
import API from "forsnap-api";
import CONSTANT from "shared/constant";

import Img from "shared/components/image/Img";
import Buttons from "desktop/resources/components/button/Buttons";
import { Table, EmptyList, HistoryTitle, MorePagination, SearchBox } from "../share";

const { CODE, PAYMENT_STATUS_CODE, TICKET_LIST_FILTER_CODE, TICKET_PRODUCT } = CONSTANT.TICKET;
const TICKET_FILTER_LIST = Object.keys(TICKET_LIST_FILTER_CODE).map(key => TICKET_LIST_FILTER_CODE[key]);
const Style = {
    button: {
        search: { size: "small", theme: "bg-white" }
    }
};

export default class HistoryTicketPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetching: false,
            total: 0,
            ids: [],
            data: {},
            params: {
                offset: 0,
                limit: 10,
                status: TICKET_LIST_FILTER_CODE.PAYMENT.code
            },
            columnDefs: [
                { field: "ticket_code", name: "티켓번호", width: 120, className: "text-center" },
                {
                    field: "title",
                    name: "티켓정보",
                    template: entity => this.renderTicketProduct(entity)
                },
                { field: "price", name: "티켓 가격", width: 110, format: entity => `${utils.format.price(entity.price)}원`, className: "text-center pay-price pay-price--emphasis" },
                {
                    field: "expire_dt",
                    name: "유효기간",
                    width: 140,
                    className: "text-center",
                    format: entity => {
                        return entity.expire_dt ? `${mewtime(entity.expire_dt).format("YYYY-MM-DD")}까지` : "";
                    }
                },
                {
                    field: "status",
                    name: "티켓현황",
                    width: 100,
                    className: "text-center",
                    template: entity => this.renderTicketStatus(entity)
                }
            ]
        };

        this.onQuery = this.onQuery.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);

        this.getHistoyTicketTitle = this.getHistoyTicketTitle.bind(this);
        this.setPaymentList = this.setPaymentList.bind(this);
        this.isUsableTiket = this.isUsableTiket.bind(this);

        this.renderTicketProduct = this.renderTicketProduct.bind(this);
        this.renderTicketStatus = this.renderTicketStatus.bind(this);
        this.renderNoneListView = this.renderNoneListView.bind(this);
        this.renderListView = this.renderListView.bind(this);
    }

    componentDidMount() {
        this.onQuery(this.state.params);
    }

    /**
     * 티켓 결제 내역을 조회한다.
     * @param {object} params
     * @param {number} params.limit
     * @param {number} params.offset
     * @param {number} params.status
     */
    onQuery(params) {
        params = { ...this.state.params, ...params };
        API.life.findTicketList(params).then(response => this.setPaymentList(params, response.data, params.offset === 0));
    }

    /**
     * 티켓 진행현황 상태를 변경한다.
     * @param code
     */
    onChangeStatus(code) {
        event.preventDefault();
        //this.onInit(code);
        this.onQuery(Object.assign(this.state.params, { offset: 0, status: code }));
    }

    /**
     * 선택된 탭에 따른 제목을 가져온다.
     * @returns {string}
     */
    getHistoyTicketTitle() {
        return this.state.params.status === TICKET_LIST_FILTER_CODE.PAYMENT.code
            ? "사용 가능한 티켓"
            : "전체 티켓";
    }

    /**
     * 조회된 티켓 내역을 모델에 저장한다.
     * @param {object} params
     * @param {{total_count:number, list:Array}} data
     * @param {boolean} isInit
     */
    setPaymentList(params, data, isInit = false) {
        const { entity, ids } = utils.normalize(data.list, "ticket_code", item => Object.assign(item, TICKET_PRODUCT.product_1));

        this.setState({
            params,
            total: Number(data.total_count),
            data: isInit ? entity : { ...this.state.data, ...entity },
            ids: isInit ? ids : utils.uniq(this.state.ids.concat(ids)),
            isFetching: true
        });
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
     * 티켓정보를 랜더링한다.
     * @param data
     * @returns {XML}
     */
    renderTicketProduct(data) {
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
                        <div className="pay-product-option">
                            <span className="pay-product-option__label">장소</span>
                            <span className="pay-product-option__text">{ data.place }</span>
                        </div>
                        <div className="pay-product-option">
                            <span className="pay-product-option__label">옵션</span>
                            <span className="pay-product-option__text">{ data.option }</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * 티켓 현황을 랜더링한다.
     * @param data
     * @returns {XML}
     */
    renderTicketStatus(data) {
        return (
            <div className={classnames("pay-status", { "pay-status--emphasis": this.isUsableTiket(data.status) })}>
                { PAYMENT_STATUS_CODE[data.status].name }
            </div>
        );
    }

    renderNoneListView() {
        return <EmptyList title="티켓 예매 내역이 없습니다." />;
    }

    renderListView() {
        const { params, total, data, ids, columnDefs } = this.state;

        return (
            <div>
                <div className="ticket-payment-page__header">
                    <HistoryTitle
                        total={total}
                        title={this.getHistoyTicketTitle()}
                        caption="티켓 사용은 모바일에서 가능합니다."
                    />
                </div>
                <div className="ticket-payment-page__body">
                    <Table data={ids.map(id => data[id])} columnDefs={columnDefs} />
                </div>
                <div className="ticket-payment-page__footer">
                    <MorePagination
                        total={total}
                        offset={params.offset}
                        limit={params.limit}
                        onQuery={this.onQuery}
                    >더보기</MorePagination>
                </div>
            </div>
        );
    }

    render() {
        const { isFetching, params, total, data, ids, columnDefs } = this.state;

        return (
            <div className="my-ticket-page">
                <SearchBox>
                    <div className="button-group">
                        { TICKET_FILTER_LIST.map(item => (
                            <Buttons
                                key={item.code}
                                buttonStyle={{ ...Style.button.search, isActive: params.status === item.code }}
                                inline={{ onClick: () => this.onChangeStatus(item.code) }}
                            >{ item.name }</Buttons>
                        )) }
                    </div>
                </SearchBox>
                { isFetching && ids.length > 0 && this.renderListView() }
                { isFetching && ids.length === 0 && this.renderNoneListView() }
            </div>
        );
    }
}
