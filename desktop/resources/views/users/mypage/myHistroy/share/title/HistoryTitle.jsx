import "./HistoryTitle.scss";
import React, { PropTypes } from "react";

export default function HistoryTitle(props) {
    return (
        <div className="history-title">
            <h3 className="h4-sub">{ props.title } <span className="history-total">{ props.total }</span></h3>
            { props.caption && <p className="h5-caption">{ props.caption }</p> }
        </div>
    );
}

HistoryTitle.propTypes = {
    total: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    caption: PropTypes.string
};

HistoryTitle.defaultprops = {
    caption: ""
};
