import "./portfolioCategoryFullScreen.scss";
import React, { Component, PropTypes } from "react";
import Swiper from "swiper";
import classNames from "classnames";
import InduceConsult from "./InduceConsult";
import utils from "forsnap-utils";

class PortfolioCategoryFullScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            index: props.index,
            isMount: true,
            render_list: [],
            category_name: props.category_name
        };

        this.onClose = this.onClose.bind(this);
        this.combineList = this.combineList.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        this.combineList();
    }

    componentDidMount() {
        const { index } = this.state;
        const option = {
            slidesPerView: "auto",
            // slidesPerView: "1",
            lazyLoading: true,
            lazyLoadingInPrevNext: true,
            lazyLoadingInPrevNextAmount: 5,
            preloadImages: false,
            initialSlide: index,
            loop: true,
            keyboardControl: true,
            mousewheelControl: true,
            nextButton: ".swiper__arrow.next",
            prevButton: ".swiper__arrow.prev",
            onSlideNextStart: swiper => {
                this.gaEvent();
                // this.state.index = swiper.activeIndex;
            },
            onSlidePrevStart: swiper => {
                this.gaEvent();
                // this.state.index = swiper.activeIndex;
            }
        };

        this.SwiperList = new Swiper(".portfolio__category__full .swiper-container", option);
    }

    componentWillReceiveProps(np) {
        if (this.state.index !== np.index) {
            this.SwiperList.slideTo(np.index);
        }
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    gaEvent() {
        const { category_name } = this.props;
        if (this.state.isMount) {
            utils.ad.gaEvent("기업_리스트", "추천포폴_갤러리페이지", category_name);
        }
    }


    /**
     * 리스트 조합. 추후 개선예정
     */
    combineList() {
        const { index, list } = this.props;
        const list_count = list.length;
        const total_count = list_count + 2;
        const newArray = [];

        let idx = index;

        let prev_consult = (index) - 4;
        let next_consult = (index) + 4;
        // let t = [];

        if (index < 4) {
            prev_consult = total_count - (4 - index);
        } else if (index > list_count - 5) {
            next_consult = (index + 4) - total_count;
        }

        for (let i = 0; i < total_count; i += 1) {
            if (index < 4) {
                if (i < next_consult) {
                    newArray.push(list[i]);
                } else if (prev_consult === i || next_consult === i) {
                    newArray.push({ induce_show: true });
                } else if (next_consult < i && i < prev_consult) {
                    newArray.push(list[i - 1]);
                } else if (prev_consult < i) {
                    newArray.push(list[i - 2]);
                }
            } else if (index > 3 && index < list_count - 4) {
                const prev = prev_consult + 1;
                const next = next_consult + 1;
                if (i < prev) {
                    newArray.push(list[i]);
                } else if (prev === i || next === i) {
                    newArray.push({ induce_show: true });
                } else if (prev < i && i < next) {
                    newArray.push(list[i - 1]);
                } else if (next < i) {
                    newArray.push(list[i - 2]);
                }

                idx = index + 1;
            } else if (index > list_count - 5) {
                const prev = prev_consult + 2;
                const next = next_consult + 2;

                if (i < next) {
                    newArray.push(list[i]);
                } else if (prev === i || next === i) {
                    newArray.push({ induce_show: true });
                } else if (next < i && i < prev) {
                    newArray.push(list[i - 1]);
                } else if (prev < i) {
                    newArray.push(list[i - 2]);
                }

                idx = index + 2;
            }
        }

        if (this.state.isMount) {
            this.setState({ render_list: newArray, index: idx });
        }
    }

    onClose() {
        const { onClose } = this.props;

        if (typeof onClose === "function") {
            onClose();
        }
    }

    render() {
        const { render_list } = this.state;
        return (
            <div className={classNames("portfolio__category__full")}>
                <div className="category__full__container">
                    <button className="_button _button__close white" onClick={this.onClose} />
                    <div className="swiper-container" onClick={this.onClose}>
                        <div className="swiper-wrapper">
                            {render_list.map((o, i) => {
                                const is_consult = o.induce_show || false;

                                let content = "";

                                if (is_consult) {
                                    content = (
                                        <InduceConsult />
                                    );
                                } else {
                                    content = (
                                        <div className="portfolio__img">
                                            <img
                                                alt="portfolio_img"
                                                className="swiper-lazy"
                                                data-src={`${__SERVER__.thumb}/normal/resize/${o.full_width}x${o.full_height}${o.portfolio_img}`}
                                            />
                                            <div className="swiper-lazy-preloader" />
                                            <div className="artist__info">
                                                <span className="artist__by">by artist</span><span className="artist__name">{o.artist_name}</span>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="swiper-slide" style={{ display: is_consult && "flex", alignItems: is_consult && "center", justifyContent: is_consult && "center" }} key={`portfolio_${i}`}>
                                        {content}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="swiper__arrow prev">
                        <i className="_icon__arrow__ml" />
                    </div>
                    <div className="swiper__arrow next">
                        <i className="_icon__arrow__mr" />
                    </div>
                </div>
            </div>
        );
    }
}

PortfolioCategoryFullScreen.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    index: PropTypes.number,
    // show: PropTypes.bool,
    onClose: PropTypes.func.isRequired
};

PortfolioCategoryFullScreen.defaultProps = {
    list: [],
    index: 0
};

export default PortfolioCategoryFullScreen;
