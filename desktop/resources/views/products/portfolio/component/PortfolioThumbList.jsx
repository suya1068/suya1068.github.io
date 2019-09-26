import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Swiper from "swiper";

import utils from "forsnap-utils";

import PortfolioImageThumb from "./PortfolioImageThumb";
import PortfolioVideoThumb from "./PortfolioVideoThumb";

class PortfolioThumbList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: [],
            total: 0
        };

        this.onLoad = this.onLoad.bind(this);
    }

    componentWillMount() {
        const { images, videos } = this.props;

        if (utils.isArray(videos)) {
            this.state.list = [].concat(
                videos.reduce((r, o) => { r.push(Object.assign({}, o)); return r; }, []),
                images ? images.reduce((r, o) => { r.push(Object.assign({}, o)); return r; }, []) : []);
        } else if (utils.isArray(images)) {
            this.state.list = [].concat(images.reduce((r, o) => { r.push(Object.assign({}, o)); return r; }, []));
        }

        this.state.total = this.state.list.length;
    }

    componentDidMount() {
        const { onIndex } = this.props;
        const option = {
            slidesPerView: "auto",
            spaceBetween: 10,
            initialSlide: this.props.index,
            normalizeSlideIndex: false
        };

        this.SwiperList = new Swiper(".thumb__swiper", option);
    }

    componentWillReceiveProps(np) {
        if (this.props.index !== np.index) {
            this.SwiperList.slideTo(np.index);
        }
    }

    onLoad(no, src) {
        const { list } = this.state;
        const item = list.find(o => o.no === no);

        if (item) {
            item.src = src;
            item.thumb = true;
        }

        this.setState({
            list
        });
    }

    render() {
        const { index, onIndex } = this.props;
        const { list } = this.state;

        return (
            <div className={classNames("thumb__swiper", "portfolio__thumb", { show: true })}>
                <div className="swiper-wrapper">
                    {list.map((o, i) => {
                        let content = "";
                        if (o.type === "image") {
                            content = <PortfolioImageThumb data={o} />;
                        } else if (o.type === "video") {
                            content = <PortfolioVideoThumb data={o} />;
                        }

                        return (
                            <div
                                key={`thumb_${o.no || "default"}`}
                                className={classNames("swiper-slide", { active: index === i })}
                                onClick={() => onIndex(i)}
                            >
                                {content}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

PortfolioThumbList.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    videos: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    index: PropTypes.number,
    onIndex: PropTypes.func.isRequired
};

export default PortfolioThumbList;
