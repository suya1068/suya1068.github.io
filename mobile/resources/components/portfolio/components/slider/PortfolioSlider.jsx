import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Swiper from "swiper";
import PortfolioImg from "../PortfolioImg";
import utils from "forsnap-utils";

export default class PortfolioSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMount: true,
            index: props.index,
            is_config: false
        };
        this.onClose = this.onClose.bind(this);
        this.configSwiper = this.configSwiper.bind(this);
        this.onEnter = this.onEnter.bind(this);
        this.onLeave = this.onLeave.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        // this.configSwiper();
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps(np) {
        if (np.show) {
            if (!this.props.show && !this.state.is_config) {
                this.configSwiper();
                this.state.is_config = true;
            }
        }

        if (this.state.index !== np.index) {
            this.SwiperList.slideTo(np.index);
        }
    }

    /**
     * 스와이퍼 설정
     */
    configSwiper() {
        const { index } = this.state;

        const option = {
            // slidesPerView: "auto",
            slidesPerView: 1,
            lazyLoading: true,
            lazyLoadingOnTransitionStart: true,
            lazyLoadingInPrevNext: true,
            lazyLoadingInPrevNextAmount: 2,
            preloadImages: false,
            initialSlide: index,
            loop: true,
            keyboardControl: true,
            mousewheelControl: true,
            onSlideNextStart: swiper => {
                this.state.index = swiper.activeIndex;
            },
            onSlidePrevStart: swiper => {
                this.state.index = swiper.activeIndex;
            }
        };

        this.SwiperList = new Swiper(".forsnap-portfolio__swiper", option);
    }

    onClose() {
        const { onClose } = this.props;

        if (typeof onClose === "function") {
            onClose();
        }
    }

    onEnter(e) {
        const target = e.target;
        const target_className = target.classList[1];
        if (target_className) {
            this.setState({ is_hover: target_className });
        }
    }

    onLeave(e) {
        this.setState({ is_hover: "" });
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

    onLoad(e) {
        const target = e.target;
        const w = target.offsetWidth;
        const h = target.offsetHeight;
        const resize = utils.resize(16, 9, w, h, (w / 16) < (h / 9));

        target.setAttribute("width", resize.width);
        target.setAttribute("height", resize.height);
    }

    render() {
        const { list, show } = this.props;
        const { is_hover } = this.state;

        return (
            <div className={classNames("forsnap-portfolio__slider", { show })}>
                <div className="portfolio__full__container">
                    <button className="_button _button__close white" onClick={this.onClose} />
                    <div className="swiper-container forsnap-portfolio__swiper" onClick={this.onClose}>
                        <div className="swiper-wrapper">
                            {list.map((o, i) => {
                                const isVideo = o.type === "video";
                                let videoType = "";
                                let src = `${__SERVER__.thumb}/normal/resize/1400x1000${o.url}`;
                                if (isVideo) {
                                    src = this.queryUrl(o.url);
                                    videoType = o.url.indexOf("vimeo") !== -1 ? "youtube" : "vimeo";
                                }

                                return (
                                    <div className="swiper-slide" key={`portfolio_${i}`}>
                                        {isVideo
                                            ?
                                                <div className="portfolio__video" onLoad={this.onLoad}>
                                                    <iframe
                                                        id={`${videoType}_${i}`}
                                                        src={src}
                                                        width="100%"
                                                        height="100%"
                                                        frameBorder="0"
                                                        allowFullScreen
                                                    />
                                                </div>
                                            :
                                                <div className="portfolio__img">
                                                    <PortfolioImg className="swiper-lazy" src={`${__SERVER__.thumb}/normal/resize/1400x1000${o.url}`} xhr={false} />
                                                    <div className="swiper-lazy-preloader" />
                                                </div>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

PortfolioSlider.propTypes = {
    // list: PropTypes.arrayOf(PropTypes.shape(PropTypes.node)).isRequired,
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
