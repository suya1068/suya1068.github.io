import classnames from "classnames";
import React, { PropTypes } from "react";

export default function TicketTabList({ list, selected, onClick }) {
    return (
        <div className="ticket-app-tools text-center">
            <div className="button-group">
                { list.map(item => (
                    <button
                        key={item.code}
                        className={classnames("button", { "button--actived": selected === item.code })}
                        onClick={e => onClick(item)}
                    >{ item.name }</button>
                )) }
            </div>
        </div>
    );
}

TicketTabList.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    selected: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};
