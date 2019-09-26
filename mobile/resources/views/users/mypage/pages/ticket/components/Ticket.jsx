import classnames from "classnames";
import React, { Component, PropTypes } from "react";
import { Ticket as TicketType } from "../TicketPropType";
import CONSTANT from "shared/constant";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";
import Img from "shared/components/image/Img";

const { CODE, PAYMENT_STATUS_CODE } = CONSTANT.TICKET;

export default class Ticket extends Component {
    constructor(props) {
        super(props);

        this.onSelect = this.onSelect.bind(this);
        this.onUseTicket = this.onUseTicket.bind(this);

        this.getCardClassName = this.getCardClassName.bind(this);
        this.getTicketStatusName = this.getTicketStatusName.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.data !== this.props.data;
    }

    /**
     * 티켓을 선택한다.
     * @param event
     */
    onSelect(event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.isUsableTiket(this.props.data.status)) {
            this.props.onSelect(this.props.data);
        }
    }

    /**
     * 티켓을 사용한다.
     * @param event
     */
    onUseTicket(event) {
        event.stopPropagation();
        this.props.onUseTicket(this.props.data);
    }

    getCardClassName(data) {
        if (!this.isUsableTiket(data.status)) {
            return { "ticket-card--disabled": true };
        }

        return null;
    }

    /**
     * 티켓 현황 이름을 가져온다.
     * @param status
     * @returns {string}
     */
    getTicketStatusName(status) {
        if (PAYMENT_STATUS_CODE.PAYMENT.code === status) {
            return "사용하기";
        }

        return PAYMENT_STATUS_CODE[status].name;
    }

    /**
     * 티켓을 사용가능한지 판단한다.
     * @param code
     * @returns {boolean}
     */
    isUsableTiket(code) {
        return CODE.PAYMENT === code;
    }

    render() {
        const { data } = this.props;

        return (
            <div className={classnames("ticket-card", this.getCardClassName(data))} onClick={this.onSelect}>
                <div className="ticket-card__header">
                    { this.isUsableTiket(data.status)
                        ? (
                            <label className="fs-checkbox" htmlFor={data.ticket_code}>
                                <input id={data.ticket_code} type="checkbox" checked={data.checked} />
                                <div className="fs-checkbox-container">
                                    <span className="fs-checkbox__icon" />
                                    <span>{ data.ticket_code }</span>
                                </div>
                            </label>
                        )
                        : <span>{ data.ticket_code }</span>
                    }
                </div>
                <div className="ticket-card__body">
                    <div className="ticket-card-row">
                        <div className="ticket-card__image">
                            <Img image={{ type: "image", src: data.profile_img }} />
                        </div>
                        <section className="ticket-card__content">
                            <h5 className="ticket-card-title">{ data.main_title }</h5>
                            <div className="ticket-card-option">
                                <span className="ticket-card-option__label">장소</span>
                                <span className="ticket-card-option__text">{ data.place }</span>
                            </div>
                            <div className="ticket-card-option">
                                <span className="ticket-card-option__label">옵션</span>
                                <span className="ticket-card-option__text">{ data.option }</span>
                            </div>
                        </section>
                        <div className="ticket-card__aside text-right">
                            <span className="ticket-card-price">{ utils.format.price(data.price) }</span>
                        </div>
                    </div>
                    <div className="ticket-card-row ticket-card-row-divider ticket-card-row-space-between">
                        <div>
                            <span className="ticket-card-status">{ PAYMENT_STATUS_CODE[data.status].name }</span>
                            <sapn className="ticket-card-expire">
                                { data.expire_dt ? `만료일 : ${mewtime(data.expire_dt).format("YYYY-MM-DD")}까지` : "" }
                            </sapn>
                        </div>
                        <div className="text-right">
                            { this.isUsableTiket(data.status)
                                ? <button className="button button-small button__theme__white" onClick={this.onUseTicket}>{ this.getTicketStatusName(data.status) }</button>
                                : <span className="ticket-card-datetime">{ data.use_dt }</span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Ticket.propTypes = {
    data: TicketType.isRequired
};
