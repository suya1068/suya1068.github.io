import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import ProductsVideoItem from "./ProductsVideoItem";

class ProductsVideo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            main_img: props.main_img
        };

        this.queryUrl = this.queryUrl.bind(this);
    }

    componentDidMount() {
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
        const { data, main_img } = this.state;
        const resize = utils.resize(16, 9, window.outerWidth || 1, 1, true);

        return (
            <div className="portfolio__video">
                {main_img ?
                    <ProductsVideoItem
                        key="portfolio_video_main"
                        data={main_img.indexOf("vimeo") !== -1 ? this.queryUrl(main_img) : main_img}
                    /> : null
                }
                {data.map(o => {
                    return (
                        <ProductsVideoItem
                            key={`portfolio_video_${o.portfolio_no}`}
                            data={this.queryUrl(o.portfolio_video)}
                        />
                    );
                })}
            </div>
        );
    }
}

ProductsVideo.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    main_img: PropTypes.string
};

export default ProductsVideo;
