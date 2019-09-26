import React, { Component, PropTypes } from "react";
import { Ticket as TicketType } from "../TicketPropType";
import Ticket from "./Ticket";
import TicketMoreButton from "./TicketMoreButton";

export default class TicketList extends Component {
    constructor(props) {
        super(props);

        this.onMore = this.onMore.bind(this);
        this.isMore = this.isMore.bind(this);
    }

    onMore() {
        const { params } = this.props;
        this.props.onQuery({ ...params, offset: params.offset + params.limit });
    }

    isMore() {
        const { total, params } = this.props;
        return total > (params.offset + params.limit);
    }

    render() {
        const { data, onSelect, onUseTicket } = this.props;

        return (
            <div className="ticket-app-list">
                { data.map(item => (
                    <Ticket
                        key={item.ticket_code}
                        data={item}
                        onSelect={onSelect}
                        onUseTicket={onUseTicket}
                    />
                )) }
                <TicketMoreButton isShow={this.isMore()} onClick={this.onMore} />
            </div>
        );
    }
}

TicketList.propTypes = {
    params: PropTypes.shape({
        status: PropTypes.string,
        offset: PropTypes.number,
        limit: PropTypes.number
    }).isRequired,
    total: PropTypes.number.isRequired,
    data: PropTypes.arrayOf(TicketType).isRequired,
    onQuery: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onUseTicket: PropTypes.func.isRequired
};
