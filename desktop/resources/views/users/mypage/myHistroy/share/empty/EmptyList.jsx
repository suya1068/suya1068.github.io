import "./EmptyList.scss";
import React, { PropTypes } from "react";

export default function EmptyList(props) {
    return (
        <div className="empty-list">
            <h4 className="h4 text-bold">{ props.title }</h4>
            { props.caption && <p className="h5-caption empty-cpation">{ props.caption }</p> }
        </div>
    );
}

EmptyList.propTypes = {
    title: PropTypes.string.isRequired,
    caption: PropTypes.string
};

EmptyList.defaultProps = {
    caption: null
};
