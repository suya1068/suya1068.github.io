import React, { Component, PropTypes } from "react";
import Swiper from "swiper";
import Img from "desktop/resources/components/image/Img";
import classNames from "classnames";
import Icon from "desktop/resources/components/icon/Icon";

class PhotoViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: props.images,
            activeIndex: props.activeIndex,
            sliderWidth: window.innerWidth,
            lazy: props.lazy,
            middleHeight: props.middleHeight
        };
        this.onResize = this.onResize.bind(this);
        this.setSwiper = this.setSwiper.bind(this);
    }

    componentWillMount() {
        window.addEventListener("resize", this.onResize);
    }

    componentDidMount() {
        this.setSwiper();
        setTimeout(() => {
            const evt = document.createEvent("HTMLEvents");
            evt.initEvent("resize", true, false);
            window.dispatchEvent(evt);
        }, 0);
    }

    componentWillReceiveProps(nextProps) {
        this.middleSlider.slideTo(nextProps.activeIndex);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize, false);
    }

    onResize() {
        this.setState({
            sliderWidth: window.innerWidth
        });
    }

    setSwiper() {
        const { lazy } = this.props;
        const data = {};
        if (lazy === true) {
            data.lazyLoading = true;
            data.lazyLoadingInPrevNext = true;
            data.lazyLoadingInPrevNextAmount = 4;
            data.preloadImages = false;
        }

        this.middleSlider = new Swiper(".middle-slider", {
            nextButton: ".slider-arrow-right",
            prevButton: ".slider-arrow-left",
            paginationClickable: true,
            slidesPerView: 1,
            initialSlide: this.props.activeIndex,
            speed: 200,
            mousewheelControl: true,
            keyboardControl: true,
            ...data,
            onSlideNextStart: swiper => {
                const activeIndex = swiper.activeIndex;
                this.setState({
                    activeIndex
                }, () => {
                    if (typeof this.props.onChangeIndex === "function") {
                        this.props.onChangeIndex(activeIndex);
                    }
                });
            },
            onSlidePrevStart: swiper => {
                const activeIndex = swiper.activeIndex;
                this.setState({
                    activeIndex
                }, () => {
                    if (typeof this.props.onChangeIndex === "function") {
                        this.props.onChangeIndex(activeIndex);
                    }
                });
            }
        });
    }

    onError(e, idx, src) {
        const { images, photoType } = this.state;
        const _type = photoType !== "private" ? "normal" : "signed";
        const _src = `${__SERVER__.thumb}/${_type}/resize/1400x1000${src}`;
        const target = e.target;

        const error_url = "/common/forsnap_bg_default.jpg";
        images[idx].is_error = true;
        images[idx].count += 1;

        this.setState({ images }, () => {
            if (images[idx].count < 30) {
                target.src = _src;
            } else {
                target.src = `${__SERVER__.img}${error_url}`;
            }
        });
    }

    onLoad(e, idx) {
        const { images } = this.state;
        images[idx].is_error = false;
        this.setState({ images });
    }


    /**
     * middle slider 를 그린다.
     * @returns {XML}
     */
    drawMiddleSlider() {
        const images = this.state.images;
        const { isCustom, photoType, lazy } = this.props;
        const serverType = photoType === "private" ? "signed" : "normal";
        return (
            <div className="swiper-container middle-slider" style={{ width: this.state.sliderWidth }} /*onWheel={e => this.onWheelSliderMiddle(e, changeCount)}*/>
                <div className="swiper-wrapper middle-slider-list">
                    {/*{content}*/}
                    {images.map((image, idx) => {
                        if (lazy) {
                            return (
                                <div key={`${isCustom ? "custom" : "origin"}_image_${idx}`} className="swiper-slide middle-slide-unit"/*{this.isActive(idx) ? "active" : ""}*/>
                                    {/*<img role="presentation" data-src={`${__SERVER__.thumb}/normal2/1400/1000${image.src}`} onError={this.onError} className="swiper-lazy" />*/}
                                    <img
                                        role="presentation"
                                        data-src={`${__SERVER__.thumb}/${serverType}/resize/1400x1000${image.src}`}
                                        className="swiper-lazy"
                                        onError={e => this.onError(e, idx, image.src)}
                                        onLoad={e => this.onLoad(e, idx)}
                                    />
                                    <div className="swiper-lazy-preloader forsnap-loading-img">
                                        <img role="presentation" src={`${__SERVER__.img}/common/loading.gif`} />
                                    </div>
                                    {image.is_error ?
                                        <div className="swiper-lazy-preloader forsnap-loading-img">
                                            <img role="presentation" src={`${__SERVER__.img}/common/loading.gif`} />
                                        </div> : null
                                    }
                                </div>
                            );
                        }
                        return (
                            <div key={`${isCustom ? "custom" : "origin"}_image_${idx}`} className="swiper-slide middle-slide-unit"/*{this.isActive(idx) ? "active" : ""}*/>
                                <Img image={{ src: image.src, type: image.type, content_width: 1400, content_height: 1000 }} isCrop={false} isImageCrop={false} />
                            </div>
                        );
                    })}
                </div>
                <div className={classNames("slider-arrow-left", this.state.activeIndex === 0 ? "hide" : "")} style={{ left: 0 }}>
                    <Icon name="arrow_l" />
                </div>
                <div className={classNames("slider-arrow-right", this.state.activeIndex === images.length ? "hide" : "")} style={{ right: 0 }}>
                    <Icon name="arrow_r" />
                </div>
            </div>
        );
    }

    render() {
        return (
            <section className="photoViewer-middle" style={{ height: this.props.middleHeight }}>
                <h2 className="sr-only">MiddleSlider</h2>
                {this.drawMiddleSlider()}
            </section>
        );
    }
}

PhotoViewer.propTypes = {
    isCustom: PropTypes.bool
};

PhotoViewer.defaultProps = {
    images: [],
    activeIndex: 0,
    isCustom: false
    // checkList: []
};

export default PhotoViewer;
