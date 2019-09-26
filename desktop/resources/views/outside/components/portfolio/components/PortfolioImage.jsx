import React, { Component, PropTypes } from "react";

import Img from "desktop/resources/components/image/Img";

class PortfolioImage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data || {},
            error: false
        };

        this.onLoad = this.onLoad.bind(this);
    }

    onLoad({ thumbSrc }) {
        const { onLoad } = this.props;
        const { data } = this.state;
        const { url, no, signed } = data;
        let src = thumbSrc;
        if (signed) {
            src = `${__SERVER__.thumb}/signed/crop/90x90${url}`;
        }

        onLoad(no, src);
    }

    render() {
        const { data } = this.state;
        const { url, signed } = data;

        return (
            <div className="portfolio__image">
                <Img
                    image={{ src: url, content_width: 1400, content_height: 1000, type: signed ? "private" : null }}
                    isCrop={false}
                    isImageCrop={false}
                    onLoad={this.onLoad}
                />
            </div>
        );
    }
}

PortfolioImage.propTypes = {
    data: PropTypes.shape({
        url: PropTypes.string,
        no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        display_order: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        signed: PropTypes.bool
    }),
    onLoad: PropTypes.func
};

export default PortfolioImage;
