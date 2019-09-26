import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";
import PopModal from "shared/components/modal/PopModal";
import CONSTANT from "shared/constant";
import AlertSvg from "shared/image/svg/alert.svg";
import { Ticket as TicketType } from "../TicketPropType";

const { TICKET_PRODUCT } = CONSTANT.TICKET;

export default class TicketConfirm extends Component {
    constructor(props) {
        super(props);

        this.onUseTicket = this.onUseTicket.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    onUseTicket() {
        this.props.onUseTicket(this.props.data);
    }

    onClose() {
        history.back();
        PopModal.close();
    }

    render() {
        const { data } = this.props;

        return (
            <div className="ticket-confirm">
                <div className="ticket-confirm__header">
                    <div className="ticket-confirm-title">
                        티켓 사용하기
                    </div>
                    <div className="text-right">
                        <button className="modal-close" onClick={this.onClose} />
                    </div>
                </div>
                <div className="ticket-confirm__body">
                    <div>
                        { data.map(item => (
                            <div key={item.ticket_code} className="ticket-card">
                                <div className="ticket-card__header">
                                    <span>{ item.ticket_code }</span>
                                </div>
                                <div className="ticket-card__body">
                                    <div className="ticket-card-row">
                                        <section className="ticket-card__content">
                                            <h5 className="ticket-card-title">{ item.main_title }</h5>
                                            <div className="ticket-card-option">
                                                <span className="ticket-card-option__label">장소</span>
                                                <span className="ticket-card-option__text">{ item.place }</span>
                                            </div>
                                            <div className="ticket-card-option">
                                                <span className="ticket-card-option__label">옵션</span>
                                                <span className="ticket-card-option__text">{ item.option }</span>
                                            </div>
                                            <div className="ticket-card-option">
                                                <span className="ticket-card-option__label">만료일</span>
                                                <span className="ticket-card-option__text">
                                                    { item.expire_dt ? `${mewtime(item.expire_dt).format("YYYY-MM-DD")}까지` : "" }
                                                </span>
                                            </div>
                                        </section>
                                        <div className="ticket-card__aside text-right">
                                            <span className="ticket-card-price">{ utils.format.price(item.price) }</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) }
                    </div>
                    <div className="ticket-confirm-description">
                        <div className="ticket-confirm-warn-message">
                            <span className="ticket-confirm-icon">
                                <img src={AlertSvg} alt="경고" />
                            </span>
                            <span className="ticket-confirm-warn-message__text">
                                사용하기 클릭 시 티켓이 사용처리 되어 입장이 불가할 수 있습니다.
                            </span>
                        </div>
                        <div className="ticket-confirm-actions">
                            <button className="button button-block button__theme__yellow" onClick={this.onUseTicket}>사용하기</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

TicketConfirm.propTypes = {
    data: PropTypes.arrayOf(TicketType).isRequired,
    onUseTicket: PropTypes.func.isRequired
};
