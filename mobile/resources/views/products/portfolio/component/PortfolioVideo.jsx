import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

class PortfolioVideo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data || {}
        };

        this.onLoad = this.onLoad.bind(this);

        this.queryUrl = this.queryUrl.bind(this);
    }

    onLoad(e) {
        const { onLoad } = this.props;
        const { no } = this.state.data;
        const target = e.target;
        const w = target.offsetWidth;
        const h = target.offsetHeight;
        const resize = utils.resize(16, 9, w, h, (w / 16) < (h / 9));

        target.setAttribute("width", resize.width);
        target.setAttribute("height", resize.height);
        onLoad(no);
    }

    queryUrl(url) {
        const a = document.createElement("a");
        a.href = url;
        const search = utils.query.parse(a.search);

        if (url.indexOf("vimeo") !== -1) {
            search.title = 0;
            search.color = "ffffff";
            search.byline = 0;
            search.portrait = 0;
            search.autopause = 1;
        } else if (url.indexOf("youtube") !== -1 || url.indexOf("youtu") !== -1) {
            search.enablejsapi = 1;
            search.modestbranding = 1;
            search.rel = 0;
        }

        return `${a.protocol}//${a.hostname}${a.pathname[0] === "/" ? "" : "/"}${a.pathname}?${utils.query.stringify(search)}`;
    }

    render() {
        const { url } = this.state.data;

        return (
            <div className="portfolio__video">
                <iframe
                    src={this.queryUrl(url)}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    onLoad={this.onLoad}
                />
            </div>
        );
    }
}

PortfolioVideo.propTypes = {
    data: PropTypes.shape({
        type: PropTypes.string,
        no: PropTypes.number,
        display_order: PropTypes.number,
        url: PropTypes.string
    }),
    onLoad: PropTypes.func.isRequired
};

export default PortfolioVideo;
