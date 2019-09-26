import "./photoViewerM_swiper.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "forsnap-utils";
import Img from "desktop/resources/components/image/Img";
import PhotoThumbnail from "./component/photo_thumbnail/PhotoThumbnail";
import Swiper from "swiper";

class PhotoViewerM extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: props.images,
            total_cnt: props.total_cnt,
            data: props.data,
            activeIndex: props.activeIndex,
            onClick: true,
            type: props.type || "thumb",
            //////////////
            sliderWidth: window.innerWidth,
            sliderHeight: window.innerHeight,
            ////////
            viewerHeaderHeight: 0,
            noneClose: props.noneClose || false,
            ///////
            lazy: props.lazy,
            progress_img: `${__SERVER__.img}/common/loading.gif`
        };
        this.onClick = this.onClick.bind(this);
        this.close = this.close.bind(this);
        this.onResize = this.onResize.bind(this);
        this.setActiveIndex = this.setActiveIndex.bind(this);
        // this.onLoad = this.onLoad.bind(this);
        this.onError = this.onError.bind(this);
    }

    componentWillMount() {
        history.pushState(null, null, location.href);
        // this.combineImages(this.state.images);
        window.addEventListener("resize", this.onResize);
    }

    componentDidMount() {
        this.setSwiperConfig();
        const refViewerHeader = this.viewerheader;
        this.state.viewerHeaderHeight = refViewerHeader.clientHeight;
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
        if (typeof this.props.onClose === "function") {
            this.props.onClose();
        }
    }
    combineImages(images) {
        const _list = [];
        images.reduce((result, obj) => {
            result = obj;
            result.is_error = false;
            result.count = 0;
            _list.push(result);
            return result;
        }, []);
        this.setState({ images: _list });
    }
    /**
     * 모바일 포토뷰어 스와이퍼 환경을 설정한다.
     */
    setSwiperConfig() {
        // const { lazy } = this.props;
        // const lazy_config = {};
        // if (lazy) {
        //     lazy_config.preloadImages = false;
        //     lazy_config.lazyLoading = true;
        //     lazy_config.lazyLoadingInPrevNext = true;
        //     lazy_config.lazyLoadingInPrevNextAmount = 3;
        // }

        this.photoSliderM = new Swiper(".swiper-photoSlider", {
            nextButton: ".btn_next",
            prevButton: ".btn_prev",
            paginationClickable: true,
            effect: "slide",
            slidesPerView: 1,
            speed: 200,
            initialSlide: this.props.activeIndex - 1,
            // zoom: true,
            // ...lazy_config,
            onSlideNextStart: swiper => {
                const activeIndex = swiper.activeIndex + 1;

                this.setState({
                    activeIndex
                }, () => {
                    this.onChangeActiveIndex(activeIndex);
                });
            },
            onSlidePrevStart: swiper => {
                const activeIndex = swiper.activeIndex + 1;

                this.setState({
                    activeIndex
                }, () => {
                    this.onChangeActiveIndex(activeIndex);
                });
            }
        });
    }

    /**
     * 디바이스의 가로 세로 크기를 변화시 마다 저장한다.
     */
    onResize() {
        this.setState({
            sliderWidth: window.innerWidth,
            sliderHeight: window.innerHeight
        });
    }

    onClick() {
        let flag = true;

        if (this.state.onClick) {
            flag = false;
        }
        this.setState({
            onClick: flag
        }, () => {
            const viewerHeader = this.viewerheader;
            if (!this.state.onClick) {
                viewerHeader.style.top = `-${this.state.viewerHeaderHeight}px`;
            } else {
                viewerHeader.style.top = "0px";
            }
        });
    }

    onChangeActiveIndex(activeIndex) {
        if (typeof this.props.onChangeIndex === "function") {
            this.props.onChangeIndex(activeIndex);
        }
    }

    onError(e, idx, src) {
        // const { images, progress_img, type } = this.state;
        // const _type = type !== "private" ? "normal" : "signed";
        // const _src = `${__SERVER__.thumb}/${_type}/resize/1400x1000${src}`;
        // const target = e.target;
        //
        // console.log(idx, images[idx].count);
        // const isMobile = utils.agent.isMobile();
        // let url = "/common/forsnap_bg_default.jpg";
        //
        // if (isMobile) {
        //     url = "/mobile/common/forsnap_bg_default.jpg";
        // }
        //
        // console.log(e.target);
        //
        // images[idx].is_error = true;
        // images[idx].count += 1;
        //
        // this.setState({ images }, () => {
        //     if (images[idx].count < 30) {
        //         target.src = _src;
        //     } else {
        //         target.src = `${__SERVER__.img}${url}`;
        //     }
        // });
    }

    onLoad(e, idx) {
        // const { images } = this.state;
        // images[idx].is_error = false;
        // console.log("onLoad: ", idx);
        // this.setState({ images });
    }

    close() {
        history.back();
        this.setState({
        }, () => {
            if (typeof this.props.onClose === "function") {
                this.props.onClose();
            }
        });
    }
    setActiveIndex(activeIndex) {
        this.setState({
            activeIndex
        }, () => {
            this.photoSliderM.slideTo(activeIndex - 1);
        });
    }

    createImages() {
        const { images, activeIndex, total_cnt } = this.state;
        const { type } = this.props;
        const maxLength = parseInt(total_cnt, 10);
        return (
            <div
                className="swiper-container swiper-photoSlider"
                style={{ height: this.state.sliderHeight }}
            >
                <div className="swiper-wrapper m-slider-photoList" onClick={this.onClick}>
                    {images.map((image, idx) => {
                        const _type = type !== "private" ? "normal" : "signed";
                        return (
                            <div key={`mslider_${idx}`} className="swiper-slide mSlider">
                                {/*{type === "private" ?*/}
                                <div>
                                    <img role="presentation" data-src={`${__SERVER__.thumb}/${_type}/resize/1400x1000${image.src}`} className="swiper-lazy" /*onLoad={e => this.onLoad(e, idx)} onError={e => this.onError(e, idx, image.src)} *//>
                                    <div className="swiper-lazy-preloader forsnap-loading-img">
                                        <img role="presentation" src={`${__SERVER__.img}/common/loading.gif`} />
                                    </div>
                                </div>
                                {/*<img role="presentation" data-src={`${__SERVER__.thumb}/normal2/1400/1000${image.src}`} onError={this.onError} className="swiper-lazy" />*/}
                            </div>
                        );
                    })}
                </div>
                <div className={classNames("btn_area", this.state.onClick ? "is_show" : "")}>
                    <div className={classNames("moveArrow btn_prev", activeIndex === 1 ? "hide" : "")}>
                        &lt;
                    </div>
                    <div className={classNames("moveArrow btn_next", activeIndex === maxLength ? "hide" : "")}>
                        &gt;
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const maxLength = parseInt(this.state.total_cnt, 10);
        const { data, activeIndex, images, noneClose, type } = this.state;

        return (
            <div className="m-photoViewer">
                <div className="m-photoViewer-wrap">
                    <div className={classNames("group_info", this.state.onClick ? "is_show" : "")}>
                        <div className="viewer-header" ref={ref => (this.viewerheader = ref)}>
                            <div className="header-info-box">
                                <div className="photo-counter">
                                    <span className="current_photo">{activeIndex}</span>
                                    <span className="total_photo">{maxLength}</span>
                                </div>
                                {noneClose ?
                                    null :
                                    <div className="close" onClick={this.close}>
                                        <span className="close-btn"><i className="m-icon m-icon-white_cancel" /></span>
                                    </div>
                                }
                            </div>
                            <div className="header-photo_thumbnail">
                                <PhotoThumbnail
                                    //ref={instance => (this.photoThumbnail = instance)}
                                    images={images}
                                    activeIndex={activeIndex}
                                    onPhotoThumbnailClick={this.setActiveIndex}
                                    lazy={false}
                                    type={type}
                                />
                            </div>
                        </div>
                        {data !== "none" ?
                            <div className="viewer-info">
                                <div className="artistProfile">
                                    <Img image={{ src: data.profile_img, content_width: 110, content_height: 110 }} />
                                </div>
                                <div className="artistContent">
                                    <p className="title">[{data.nick_name}] {data.title}</p>
                                    <p className="text" key="onlyView-version">포트폴리오 <span className="pinkText">사진 {maxLength}장</span></p>
                                </div>
                            </div> : null
                        }
                    </div>
                    {this.createImages()}
                </div>
            </div>
        );
    }
}

export default PhotoViewerM;
