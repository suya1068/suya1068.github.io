import { PropTypes } from "react";
import CONST from "shared/constant";

const TICKET_CODE = CONST.TICKET.CODE;

export const Ticket = PropTypes.shape({
    user_id: PropTypes.string.isRequired,
    pay_type: PropTypes.string.isRequired,
    place: PropTypes.string.isRequired,
    option: PropTypes.string.isRequired,
    status: PropTypes.oneOf([TICKET_CODE.READY, TICKET_CODE.PAYMENT, TICKET_CODE.USE, TICKET_CODE.CANCEL, TICKET_CODE.EXPIRE]).isRequired
});
