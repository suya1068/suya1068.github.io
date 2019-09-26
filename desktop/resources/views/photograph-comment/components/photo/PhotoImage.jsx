import classnames from "classnames";
import React, { PropTypes } from "react";

import Img from "desktop/resources/components/image/Img";

function PhotoImage({ selected, image, onClick }) {
    return (
        <div
            className={classnames(
                "photograph-comment-image",
                { "is-active": selected.includes(image.id) }
            )}
            onClick={() => onClick(image.id)}
        ><Img image={{ type: "reader", src: image.file_content, draggable: "false" }} /></div>
    );
}

PhotoImage.propTypes = {
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    image: PropTypes.shape({
        id: PropTypes.string.isRequired,
        file: PropTypes.object.isRequired,
        file_content: PropTypes.string.isRequired
    }).isRequired,
    onClick: PropTypes.func.isRequired
};

export default PhotoImage;
