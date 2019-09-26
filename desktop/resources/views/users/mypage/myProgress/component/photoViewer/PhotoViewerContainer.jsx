import React, { Component, PropTypes } from "react";
import PhotoViewer from "./PhotoViewer";

export default class PhotoViewerContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: props.activeIndex,                     // required
            counts: props.counts,
            photo_viewer_data: props.photo_viewer_data,         // required
            checked_photos_number: props.checked_photos_number || [],
            checked_photos_obj: props.checked_photos_obj || [],
            reserve_type: props.reserve_type || "",
            photo_type: props.photo_type,                       // required
            is_origin: props.is_origin,
            images: props.images,                       // 부모에게서 받는 사진 리스트
            photo_temp_arr: [],                     // 업데이트 용 임시 사진 리스트
            render_list: []                         // 실제 그려질 사진 리스트
        };
        this.onSelectPhoto = this.onSelectPhoto.bind(this);
        this.onMoreScroll = this.onMoreScroll.bind(this);
        this.setPhotoListToTempArr = this.setPhotoListToTempArr.bind(this);
        this.setPhotoListToRender = this.setPhotoListToRender.bind(this);
        this.setReceiveImages = this.setReceiveImages.bind(this);
    }

    componentWillMount() {
        const { images } = this.state;
        this.setPhotoListToTempArr(images);
        this.setPhotoListToRender(images);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(nextState.images) !== JSON.stringify(this.state.images)) {
            this.setPhotoListToTempArr(nextState.images);
        }

        return true;
    }

    /**
     * 사진목록을 임시 리스트에 저장한다.
     * @param list
     */
    setPhotoListToTempArr(list) {
        this.setState({ photo_temp_arr: list });
    }

    /**
     * 렌더링할 리스트를 저장한다.
     * @param list
     */
    setPhotoListToRender(list) {
        this.setState({ render_list: list });
    }

    /**
     * 보정선택사진을 부모컴포넌트에 전달한다.
     * @param data
     */
    onSelectPhoto(data) {
        if (typeof this.props.onSelectPhoto === "function") {
            this.props.onSelectPhoto({ ...data });

            this.onCheck({ ...data });
        }
    }

    /**
     * 클릭한 사진의 번호를 담는다.
     */
    onCheck({ checked_photos_number, checked_photos_obj }) {
        this.setState({ checked_photos_number, checked_photos_obj });
    }

    onMoreScroll(flag) {
        if (typeof this.props.onMoreScroll === "function") {
            this.props.onMoreScroll(flag);
        }
    }

    /**
     * 모달창에 이미지 리스트를 전달한다.
     * @param images
     */
    setReceiveImages(images) {
        this.setState({ images }, () => {
            this.setPhotoListToRender(images);
            this.setPhotoListToTempArr(images);
        });
    }

    render() {
        const { is_origin, photo_viewer_data, checked_photos_number, checked_photos_obj, reserve_type, photo_type } = this.state;
        const { images, photo_temp_arr, render_list } = this.state;
        const { activeIndex, counts } = this.props;
        const data = { photo_temp_arr, render_list, activeIndex, is_origin, counts, photo_viewer_data, checked_photos_number, checked_photos_obj, reserve_type, photo_type };
        return (
            <div className="photo-viewer-component">
                <PhotoViewer {...data} onMoreScroll={this.onMoreScroll} onSelectPhoto={this.onSelectPhoto} />
            </div>
        );
    }
}
