import React, { PropTypes } from "react";

import Buttons from "../../../../../../components/button/Buttons";

const Style = {
    button: {
        cancel: { size: "small", width: "w113", shape: "circle", theme: "default" },
        more: { width: "block", shape: "round", theme: "bg-white" }
    }
};

export default function MorePagination(props) {
    const isShow = props.total > props.offset + props.limit;
    const onQuery = event => {
        props.onQuery({ offset: props.offset + props.limit, limit: props.limit });
    };

    return isShow
        ? <Buttons buttonStyle={Style.button.more} inline={{ onClick: onQuery }}>{ props.children }</Buttons>
        : null;
}

MorePagination.propTypes = {
    children: PropTypes.node.isRequired,
    total: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    onQuery: PropTypes.func.isRequired
};

