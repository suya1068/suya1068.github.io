import React, { PropTypes } from "react";
import utils from "shared/helper/utils";

const PosterText = props => {
    const data = props.data;

    return props.children
        ? <div className="poster__text">{props.children}</div>
        : (
            <div className="poster__text">
                { data.title ? <h3 className="poster__text__title">{utils.linebreak(data.title)}</h3> : "" }
                { data.caption ? <p className="poster__text__caption">{utils.linebreak(data.caption)}</p> : "" }
            </div>
        );
};

PosterText.propTypes = {
    data: PropTypes.shape({
        title: PropTypes.string,
        caption: PropTypes.string
    }),
    children: PropTypes.node
};

PosterText.defaultProps = {
    data: {
        title: "",
        caption: ""
    },
    children: null
};

export default PosterText;
