import React, { PropTypes } from "react";

export default function TicektMoreButton(props) {
    return props.isShow
        ? (
            <div className="ticket-app-buttons">
                <span className="more-button" onClick={props.onClick}>&#8595;</span>
            </div>
        )
        : null;
}

TicektMoreButton.propTypes = {
    isShow: PropTypes.bool,
    onClick: PropTypes.func.isRequired
};

TicektMoreButton.defaultProps = {
    isShow: false
};
