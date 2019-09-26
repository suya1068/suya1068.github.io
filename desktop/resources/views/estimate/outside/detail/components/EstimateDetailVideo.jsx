import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

class EstimateDetailVideo extends Component {
    constructor(props) {
        super(props);

        this.onLoad = this.onLoad.bind(this);

        this.queryUrl = this.queryUrl.bind(this);
    }

    componentDidMount() {
    }

    onLoad(e) {
        const target = e.target;
        const resize = utils.resize(16, 9, target.offsetWidth, 1, true);
        target.setAttribute("height", resize.height);
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
        const { data } = this.props;
        return (
            <div>
                {data.list.map(o => {
                    return (
                        <iframe
                            key={`portfolio_video_${o.portfolio_no}`}
                            src={this.queryUrl(o.portfolio_video)}
                            width="100%"
                            frameBorder="0"
                            allowFullScreen
                            onLoad={this.onLoad}
                        />
                    );
                })}
            </div>
        );
    }
}

EstimateDetailVideo.propTypes = {
    data: PropTypes.shape([PropTypes.node])
};

export default EstimateDetailVideo;
