import "./Banner.scss";
import React, { PropTypes } from "react";

const Banner = ({ image, children }) => {
    const style = {};

    if (image && image.src) {
        style.backgroundImage = `url(${__SERVER__.img}${image.src}?v=20170508_1548)`;
    }

    return (
        <div className="information-banner" style={style}>
            <div className="information-inner">
                <div className="container">
                    <div className="information-contents">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

Banner.propTypes = {
    image: PropTypes.shape({
        src: PropTypes.string,
        className: PropTypes.string,
        alt: PropTypes.string
    }),
    children: PropTypes.node.isRequired
};

export default Banner;
