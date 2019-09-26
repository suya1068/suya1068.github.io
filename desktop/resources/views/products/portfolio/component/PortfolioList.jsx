import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Swiper from "swiper";

import utils from "forsnap-utils";

import PortfolioImage from "./PortfolioImage";
import PortfolioVideo from "./PortfolioVideo";

class PortfolioList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            list: [],
            total: 0,
            toggle: true,
            enter: false
        };

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
        const { images, videos } = this.props;

        if (utils.isArray(videos)) {
            this.state.list = [].concat(videos, images || []);
        } else if (utils.isArray(images)) {
            this.state.list = [].concat(images);
        }

        this.state.total = this.state.list.length;
    }

    componentDidMount() {
        const { onIndex } = this.props;
        const option = {
            slidesPerView: "auto",
            // spaceBetween: 20,
            initialSlide: this.props.index,
            nextButton: ".swiper__arrow.next",
            prevButton: ".swiper__arrow.prev",
            onSlideNextStart: o => {
                onIndex(o.activeIndex);
            },
            onSlidePrevStart: o => {
                onIndex(o.activeIndex);
            }
        };

        this.SwiperList = new Swiper(".portfolio__swiper", option);
        this.onMouseLeave();
    }

    componentWillReceiveProps(np) {
        if (this.props.index !== np.index) {
            this.SwiperList.slideTo(np.index);
        }
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onMouseEnter() {
        this.state.enter = true;
        if (!this.state.toggle) {
            this.setStateData(() => {
                return {
                    toggle: true
                };
            });
        }
    }

    onMouseLeave() {
        this.state.enter = false;
        setTimeout(() => {
            if (!this.state.enter && this.state.toggle) {
                this.setStateData(() => {
                    return {
                        toggle: false
                    };
                });
            }
        }, 2000);
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    render() {
        const { onLoad } = this.props;
        const { list, toggle } = this.state;

        return (
            <div className="portfolio__swiper">
                <div className="swiper-wrapper">
                    {list.map(o => {
                        let content = "";
                        if (o.type === "image") {
                            content = <PortfolioImage data={o} onLoad={onLoad} />;
                        } else if (o.type === "video") {
                            content = <PortfolioVideo data={o} onLoad={onLoad} />;
                        }

                        return (
                            <div key={`portfolio_${o.no || "default"}`} className="swiper-slide">
                                {content}
                            </div>
                        );
                    })}
                </div>
                <div
                    className={classNames("swiper__arrow prev")}
                    // className={classNames("swiper__arrow prev", { show: toggle })}
                    // onMouseEnter={this.onMouseEnter}
                    // onMouseLeave={this.onMouseLeave}
                >
                    <i className="_icon__arrow__ml" />
                </div>
                <div
                    className={classNames("swiper__arrow next")}
                    // className={classNames("swiper__arrow next", { show: toggle })}
                    // onMouseEnter={this.onMouseEnter}
                    // onMouseLeave={this.onMouseLeave}
                >
                    <i className="_icon__arrow__mr" />
                </div>
            </div>
        );
    }
}

PortfolioList.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    videos: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    index: PropTypes.number,
    onIndex: PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired
};

export default PortfolioList;
