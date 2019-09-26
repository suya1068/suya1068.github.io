import React, { PropTypes } from "react";
import Icon from "../Icon";

const TYPES = {
    icon: "icon"
};

const PosterVisual = props => {
    const data = props.data;

    switch (data.type) {
        default:
            return <Icon name={data.img} />;
    }
};

PosterVisual.propTypes = {
    data: PropTypes.shape({
        type: PropTypes.string,
        img: PropTypes.string
    })
};

PosterVisual.defaultProps = {
    data: {
        type: TYPES.icon,
        img: ""
    }
};

export default PosterVisual;
