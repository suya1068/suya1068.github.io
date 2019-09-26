import "./photoViewerMiddle.scss";
import React, { Component, PropTypes } from "react";
import Swiper from "swiper";
// import Img from "desktop/resources/components/image/Img";
import Icon from "desktop/resources/components/icon/Icon";
import PopModal from "shared/components/modal/PopModal";
import utils from "forsnap-utils";
import ViewImg from "./ViewImg";

export default class PhotoViewerMiddle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: props.images,
            photo_temp_arr: props.photo_temp_arr,
            activeIndex: props.activeIndex,
            checked_photos_number: props.checked_photos_number,
            checked_photos_obj: props.checked_photos_obj,
            height: props.height,
            width: window.innerWidth,
            counts: props.counts,
            uuid: utils.getUUID(),
            is_origin: props.is_origin,
            total_count: props.total_count
        };
        this.onResize = this.onResize.bind(this);
        // this.onMouseEnter = this.onMouseEnter.bind(this);
        // this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onClick = this.onClick.bind(this);
        this.setLoadImages = this.setLoadImages.bind(this);
    }

    componentWillMount() {
        // this.setTest(this.props.images);
        window.addEventListener("resize", this.onResize);
    }

    componentDidMount() {
        const { activeIndex } = this.props;
        this._isMounted = true;
        this.setSwipeConfig(activeIndex, this.state.uuid);
        this.forceEvent();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeIndex !== this.props.activeIndex) {
            this._middle_slider.slideTo(nextProps.activeIndex);
            // this.setState({ activeIndex: nextProps.activeIndex });
        }
        // if (JSON.stringify(nextProps.photo_temp_arr) !== JSON.stringify(this.props.photo_temp_arr)) {
        //     this.setTest(nextProps.photo_temp_arr);
        // }
    }

    componentWillUnmount() {
        this._isMounted = false;
        window.removeEventListener("resize", this.onResize);
    }

    // setTest(images) {
    //     const temp_images = [];
    //     for (let i = 0; i < images.length; i += 1) {
    //         temp_images[i] = new Image();
    //         temp_images[i].onload = this.onLoad;
    //         temp_images[i].src = `${__SERVER__.thumb}/signed/resize/1400x1000/${images[i].thumb_key}`;
    //     }
    //     this.setState({ temp_images });
    // }

    forceEvent() {
        setTimeout(() => {
            const evt = document.createEvent("HTMLEvents");
            evt.initEvent("resize", true, false);
            window.dispatchEvent(evt);
        }, 0);
    }

    onResize() {
        this.setState({ width: window.innerWidth });
    }

    /**
     * 스와이프 설정
     */
    setSwipeConfig(idx, uuid) {
        this._middle_slider = new Swiper(`#${uuid}`, {
            nextButton: ".slider-arrow-right",
            prevButton: ".slider-arrow-left",
            paginationClickable: true,
            slidesPerView: 1,
            initialSlide: idx,
            observer: true,
            observeParents: true,
            speed: 200,
            keyboardControl: true,
            mousewheelControl: false,
            // Disable preloading of all images
            preloadImages: false,
            // Enable lazy loading
            lazyLoading: true,
            lazyLoadingInPrevNext: true,
            lazyLoadingInPrevNextAmount: 3,
            onSlideNextStart: swiper => {
                const activeIndex = swiper.activeIndex;
                if (this._isMounted) {
                    this.setState({
                        activeIndex
                    });
                    if (typeof this.props.onChangeActiveIndex === "function") {
                        this.props.onChangeActiveIndex(activeIndex);
                    }
                }
                this.imageLoadFlag(this.state.total_count, this.setLoadImages);
            },
            onSlidePrevStart: swiper => {
                const activeIndex = swiper.activeIndex;
                if (this._isMounted) {
                    this.setState({
                        activeIndex
                    });
                    if (typeof this.props.onChangeActiveIndex === "function") {
                        this.props.onChangeActiveIndex(activeIndex);
                    }
                }
            },
            onLazyImageReady: (swiper, slide, image) => {
                // console.log("ready", slide);
            },
            onLazyImageLoad: (swiper, slide, image) => {
                // console.log("load", slide);
            }
        });
    }

    imageLoadFlag(total_count, call_func) {
        const { activeIndex } = this.state;
        const { images } = this.props;
        const image_max_length = parseInt(images.length, 10);
        const is_able_load = parseInt(total_count, 10) > image_max_length && activeIndex === image_max_length - 1;
        if (is_able_load) {
            call_func(is_able_load);
        }
    }

    setLoadImages(flag) {
        if (typeof this.props.onMoreScroll === "function") {
            this.props.onMoreScroll(flag);
        }
    }

    renderPhotos(images) {
        if (Array.isArray(images) && images.length > 0) {
            return images.map((image, idx) => {
                const image_src = image.thumb_key || image.custom_thumb_key;
                const src = `${__SERVER__.thumb}/signed/resize/1400x1000/${image_src}`;
                // const src = `/${image_src}`;
                return <ViewImg image={image} key={`render_photos__${idx}`} />;
            });
        }
        /**
         *  <li
         className="photo-viewer-middle__images-box swiper-slide"
         key={`middle-slider__${idx}`}
         ref={node => { this.photo = node; }}
         >
         <Img
         image={{ src, type: "private", content_width: 1400, content_height: 1000 }}
         isScreenChange
         isImageResize={false}
         isCrop
         isContentResize={false}
         isImageCrop={false}
         />
         </li>
         */

        return null;
    }

    onClick(e, image) {
        const { checked_photos_number, checked_photos_obj, counts } = this.state;
        const photo_no = image.photo_no;
        const findIndex = checked_photos_number.indexOf(photo_no);

        const number_of_checked_numbers = parseInt(checked_photos_number.length, 10);
        const number_of_custom_count = parseInt(counts.custom_count, 10);

        const check_obj = this.onPushSelectPhotoThumbKeyCheck(image);

        if (findIndex === -1) {
            if (number_of_custom_count === number_of_checked_numbers) {
                return;
            }
            if (number_of_checked_numbers === number_of_custom_count - 1) {
                PopModal.toast("보정사진을 전부 선택하였습니다.");
            }
            checked_photos_number.push(photo_no);
            checked_photos_obj.push(check_obj);
        } else {
            checked_photos_number.splice(findIndex, 1);
            checked_photos_obj.splice(findIndex, 1);
        }

        if (typeof this.props.onSelectPhoto === "function") {
            this.props.onSelectPhoto({ checked_photos_obj, checked_photos_number });
        }
    }

    /**
     * 보정사진 선택전 thumb_key 가 변경되었다면 변경된 사진 객체를을 반환한다.
     * @param obj - Object : select_image
     * @returns {*}
     */
    onPushSelectPhotoThumbKeyCheck(obj) {
        const { photo_temp_arr } = this.props;            // 부모 컴포넌트에서 업데이트 된 사진 리스트 데이터
        const find_image_obj = photo_temp_arr.find(image => { return image.photo_no === obj.photo_no; });

        return find_image_obj.thumb_key !== obj.thumb_key ? find_image_obj : obj;
    }

    // onMouseEnter() {
    //     this._middle_slider.disableMousewheelControl();
    // }
    //
    // onMouseLeave() {
    //     this._middle_slider.enableMousewheelControl();
    // }

    exchangeSelectButtonStyleAndTitle(image, numbers) {
        const is_select = numbers.find(photo_no => {
            return photo_no === image.photo_no;
        });

        if (is_select) {
            return { style: "#ffba00", title: "선택완료" };
        }

        return { style: "#e1e1e1", title: "선택하기" };
    }

    render() {
        const { is_origin, images, height, counts, reserve_type } = this.props;
        const { width, activeIndex, checked_photos_number, uuid } = this.state;
        return (
            <div className="photo-viewer-middle" style={{ height }}>
                <div className="photo-viewer-middle__images-box-container-outer swiper-container" id={uuid} style={{ width }}>
                    <ul className="photo-viewer-middle__images-box-container swiper-wrapper">
                        {this.renderPhotos(images)}
                    </ul>
                    {!is_origin && reserve_type !== "custom" && counts && parseInt(counts.custom_count, 10) !== 0 &&
                        <div className="select-button-container" onClick={e => this.onClick(e, images[activeIndex])}>
                            <button
                                style={{
                                    height: 50,
                                    width: 150,
                                    backgroundColor:
                                    this.exchangeSelectButtonStyleAndTitle(images[activeIndex], checked_photos_number).style,
                                    borderRadius: 10,
                                    cursor: "pointer",
                                    boxShadow: "0px 3px 5px 0 rgba(0, 0, 0, 0.3)",
                                    color: "#fff"
                                }}
                            >{this.exchangeSelectButtonStyleAndTitle(images[activeIndex], checked_photos_number).title}</button>
                        </div>
                    }
                    <div className="arrow-page-button-container">
                        <div className="slider-arrow-left">
                            {activeIndex !== 0 && <Icon name="arrow_l" />}
                        </div>
                        <div className="slider-arrow-right">
                            {activeIndex !== images.length && <Icon name="arrow_r" />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
