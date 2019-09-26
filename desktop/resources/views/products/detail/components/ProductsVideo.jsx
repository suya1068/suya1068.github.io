import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

class ProductsVideo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            total_cnt: props.total_cnt
        };

        this.queryUrl = this.queryUrl.bind(this);
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
        } else if (url.indexOf("youtube") !== -1 || url.indexOf("youtu") !== -1) {
            search.enablejsapi = 1;
            search.modestbranding = 1;
            search.rel = 0;
        }

        return `${a.protocol}//${a.hostname}${a.pathname[0] === "/" ? "" : "/"}${a.pathname}?${utils.query.stringify(search)}`;
    }

    render() {
        const { data } = this.state;

        return (
            <div className="portfolio__video">
                {data.map(o => {
                    return (
                        <iframe
                            key={`portfolio_video_${o.portfolio_no}`}
                            src={this.queryUrl(o.portfolio_video)}
                            width="648"
                            height="365"
                            frameBorder="0"
                            allowFullScreen
                        />
                    );
                })}
            </div>
        );
    }
}

ProductsVideo.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    total_cnt: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default ProductsVideo;
