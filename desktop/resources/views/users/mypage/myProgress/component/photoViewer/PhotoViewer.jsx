import "./photoViewer.scss";
import React, { Component, PropTypes } from "react";
import PhotoViewerTop from "./top/PhotoViewerTop";
import PhotoViewerMiddle from "./mid/PhotoViewerMiddle";
import PhotoViewerBottom from "./bot/PhotoViewerBottom";

export default class PhotoViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: props.activeIndex,
            images: props.images,
            photo_temp_arr: props.photo_temp_arr,
            render_list: props.render_list,
            counts: props.counts,
            photo_viewer_data: props.photo_viewer_data,
            checked_photos_number: props.checked_photos_number,
            checked_photos_obj: props.checked_photos_obj,
            middle_slider_height: 0,
            reserve_type: props.reserve_type,
            photo_type: props.photo_type,
            is_origin: props.is_origin
        };
        this.onChangeActiveIndex = this.onChangeActiveIndex.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onSelectPhoto = this.onSelectPhoto.bind(this);
        this.onMoreScroll = this.onMoreScroll.bind(this);
    }

    componentWillMount() {
        window.addEventListener("resize", this.onResize);
    }

    componentDidMount() {
        this.onResize();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeIndex !== this.props.activeIndex) {
            this.setState({ activeIndex: nextProps.activeIndex });
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    onResize(e) {
        const clientHeight = window.innerHeight;
        // const top_slider = this.top_slider.top_height_node;
        // const bottom_slider = this.bottom_slider.bottom_height_node;
        let height = clientHeight - (150 + 170);
        // let height = clientHeight - (top_slider.offsetHeight + bottom_slider.offsetHeight);
        if (height < 250) {
            height = 250;
        }

        this.setState({ middle_slider_height: height - 5 });
    }

    /**
     * 전달받은 activeIndex 를 저장한다.
     * @param idx
     */
    onChangeActiveIndex(idx) {
        this.setState({ activeIndex: idx });
    }

    onSelectPhoto(data) {
        if (typeof this.props.onSelectPhoto === "function") {
            this.props.onSelectPhoto({ ...data });
        }
    }

    onMoreScroll(flag) {
        if (flag) {
            if (typeof this.props.onMoreScroll === "function") {
                this.props.onMoreScroll(true);
            }
        }
    }

    render() {
        const { activeIndex, checked_photos_number, is_origin, checked_photos_obj, photo_viewer_data, middle_slider_height, reserve_type, photo_type } = this.state;
        const { images, render_list, counts, photo_temp_arr } = this.props;
        const total_count = counts && reserve_type === "upload" ? counts.origin_count : counts.custom_count;
        const data = { images: render_list, activeIndex, checked_photos_number };
        const middle_data = { ...data, photo_temp_arr, is_origin, checked_photos_obj, counts, reserve_type, total_count };
        const info_data = { photo_viewer_data, is_origin, reserve_type, checked_photos_number, checked_photos_obj, photo_type, counts };
        return (
            <div className="photo-viewer">
                <PhotoViewerTop
                    // ref={instance => { this.top_slider = instance; }}
                    {...data}
                    onMoreScroll={this.onMoreScroll}
                    onChangeActiveIndex={this.onChangeActiveIndex}
                />
                <PhotoViewerMiddle
                    // ref={instance => { this.middle_slider = instance; }}
                    {...middle_data}
                    height={middle_slider_height}
                    onMoreScroll={this.onMoreScroll}
                    onSelectPhoto={this.onSelectPhoto}
                    onChangeActiveIndex={this.onChangeActiveIndex}
                />
                <PhotoViewerBottom
                    // ref={instance => { this.bottom_slider = instance; }}
                    {...info_data}
                    onSelectPhoto={this.onSelectPhoto}
                />
            </div>
        );
    }
}
