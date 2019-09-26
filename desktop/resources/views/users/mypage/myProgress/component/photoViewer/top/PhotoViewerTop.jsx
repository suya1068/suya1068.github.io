import "./photoViewerTop.scss";
import React, { Component, PropTypes } from "react";
// import Img from "shared/components/image/Img";
import Img from "desktop/resources/components/image/Img";
import classNames from "classnames";

export default class PhotoViewerTop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: props.images,
            activeIndex: props.activeIndex,
            checked_photos_number: props.checked_photos_number,
            top_scroll_left: 0,
            is_loading: false
        };
        this.onWheelSlider = this.onWheelSlider.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.onSetPosition(this.props.activeIndex);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeIndex !== this.props.activeIndex) {
            this.onSetPosition(nextProps.activeIndex);
        }

        if (nextProps.images.length !== this.state.images.length) {
            this.setState({ is_loading: false });
        }
    }

    /**
     * 휠이벤트
     * @param e
     */
    onWheelSlider(e) {
        const target = this.image_box_outer;
        const scrollWidth = target.scrollWidth;
        const clientWidth = target.clientWidth;
        const { top_scroll_left, is_loading } = this.state;
        let change_scroll_left = top_scroll_left;
        const delta_y = e.deltaY;

        if (delta_y > 0 && clientWidth + top_scroll_left < scrollWidth) {
            change_scroll_left += 100;
        } else if (delta_y < 0 && top_scroll_left > 0) {
            change_scroll_left -= 100;
        }

        if (scrollWidth < (clientWidth + top_scroll_left)) {
            if (!is_loading) {
                this.setState({
                    is_loading: true
                }, () => {
                    this.onMorePhoto(true);
                });
            } else {
                this.onMorePhoto(false);
            }
        }

        target.scrollLeft = change_scroll_left;
        this.state.top_scroll_left = change_scroll_left;
    }

    onMorePhoto(flag) {
        if (flag) {
            if (typeof this.props.onMoreScroll === "function") {
                this.props.onMoreScroll(true);
            }
        } else {
            this.props.onMoreScroll(false);
        }
    }

    /**
     * 활성화된 사진 강조
     * @param idx
     */
    onActivePhoto(idx) {
        this.onSetPosition(idx);
        this.onChangeActiveIndex(idx);
    }

    onChangeActiveIndex(idx) {
        if (typeof this.props.onChangeActiveIndex === "function") {
            this.props.onChangeActiveIndex(idx);
        }
    }

    /**
     * 스크롤 포지션 변경
     * @param idx
     */
    onSetPosition(idx) {
        const target = this.image_box_outer;
        const thumbs = this.image_box_container;
        const thumb = thumbs.querySelector(":first-child");
        const thumb_width = thumb.offsetWidth;
        const thumb_list_width = target.offsetWidth;
        const top_scroll_left = ((thumb_width + 5) * idx) - ((thumb_list_width / 2) - (thumb_width / 2));
        target.scrollLeft = top_scroll_left;
        this.setState({
            top_scroll_left,
            activeIndex: idx
        });
    }

    // onLoad(e, src) {
    //     const target = e.currentTarget;
    //     target.classList.remove("loading-progress");
    //     target.src = src;
    //     // target.classList.add("loaded");
    // }

    /**
     * 사진 썸네일을 그린다.
     * @param list
     * @returns {*}
     */
    renderPhotos(list) {
        const { checked_photos_number } = this.props;
        if (Array.isArray(list) && list.length > 0) {
            return list.map((image, idx) => {
                const image_src = image.thumb_key || image.custom_thumb_key;
                // const src = `${__SERVER__.thumb}/signed/resize/90x90/${image_src}`;
                const src = `/${image_src}`;
                const is_select = checked_photos_number.find(photo_no => { return photo_no === image.photo_no; });
                return (
                    <li
                        className="photo-viewer-top__images-box__image-unit"
                        key={`full_slide_image__${idx}`}
                        onClick={() => this.onActivePhoto(idx)}
                    >
                        <div className={classNames("is_select", { "active": this.state.activeIndex === idx })} />
                        {is_select && <div className="select" />}
                        <Img
                            image={{ src, type: "private", content_width: 90, content_height: 90, height: 90, width: 90 }}
                            isScreenChange
                            isImageResize={false}
                            isCrop
                            isContentResize
                            isImageCrop={false}
                        />
                    </li>
                );
            });
        }

        return null;
    }
    render() {
        const { images } = this.props;
        return (
            <div className="photo-viewer-top">
                <div className="photo-viewer-top__images-box" onWheel={this.onWheelSlider}>
                    <div className="photo-viewer-top__images-box-container-outer" ref={node => { this.image_box_outer = node; }}>
                        <ul className="photo-viewer-top__images-box-container" ref={node => { this.image_box_container = node; }}>
                            {this.renderPhotos(images)}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
