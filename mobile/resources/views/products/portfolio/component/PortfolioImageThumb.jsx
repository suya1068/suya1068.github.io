import React, { Component, PropTypes } from "react";

import constant from "shared/constant";

class PortfolioImageThumb extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.onLoad = this.onLoad.bind(this);
    }

    onLoad(e) {
        const image = e.target;
        const parent = image.parentElement;
        const vw = image.offsetWidth;
        const vh = image.offsetHeight;
        const cw = parent.offsetWidth;
        const ch = parent.offsetHeight;

        const iAspect = vw / vh;
        const cAspect = cw / ch;

        if (iAspect < cAspect) {
            const h = (vh / vw) * cw;
            image.style.width = `${cw}px`;
            image.style.height = `${h}px`;
        } else if (iAspect > cAspect) {
            const w = (vw / vh) * ch;
            image.style.width = `${w}px`;
            image.style.height = `${ch}px`;
        } else {
            image.style.width = `${cw}px`;
            image.style.height = `${ch}px`;
        }
    }

    render() {
        const { thumb, src } = this.props.data;

        return (
            <div className="portfolio__image__thumb">
                {thumb ?
                    <div className="thumb__image">
                        <img src={src} alt="thumb" onLoad={this.onLoad} />
                    </div>
                    : <div className="thumb__loading"><img src={`${__SERVER__.img}${constant.PROGRESS.COLOR_CAT}`} alt="loading" /></div>
                }
            </div>
        );
    }
}

PortfolioImageThumb.propTypes = {
    data: PropTypes.shape({
        type: PropTypes.string,
        no: PropTypes.number,
        display_order: PropTypes.number,
        url: PropTypes.string
    })
};

export default PortfolioImageThumb;
