import "./SearchBox.scss";
import React, { PropTypes } from "react";

export default function SearchBox(props) {
    return (
        <div className="my-service-search">
            { props.children }
        </div>
    );
}

SearchBox.PropTypes = {
    children: PropTypes.node.isRequired
};
