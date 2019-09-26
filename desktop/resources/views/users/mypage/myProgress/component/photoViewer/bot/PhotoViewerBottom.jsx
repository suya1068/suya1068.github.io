import "./photoViewerBottom.scss";
import React, { Component, PropTypes } from "react";
// import Img from "shared/components/image/Img";
import SelectPhotos from "../../photoList/selectPhotos/SelectPhotos";
/**
 * 슬라이더 정보 flag
 * 1. photo_type: reserve || product
 * 2. reserve_type: upload || custom
 * 3. is_custom: true || false
 *
 * 필요 데이터
 * 공통 - profile_img, nick_name, title
 * 분기 - 1. photo_type = reserve && reserve_type = upload && is_custom = true
 *          :: origin_count, custom_count, select_photos_array
 *       2. photo_type = reserve && reserve_type = upload && is_custom = false
 *          :: origin_count
 *       3. photo_type = reserve && reserve_type = custom
 *          :: custom_count
 *       4. photo_type = product
 *          :: portfolio_count
 */

export default class PhotoViewerBottom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photo_viewer_data: props.photo_viewer_data,
            photo_type: props.photo_type,
            reserve_type: props.reserve_type || null,
            counts: props.counts,
            checked_photos_obj: props.checked_photos_obj || [],
            checked_photos_number: props.checked_photos_number || [],
            is_origin: props.is_origin
        };
        this.onDeleteSelectPhotos = this.onDeleteSelectPhotos.bind(this);
    }

    changeText({ reserve_type, photo_type, counts, is_origin }) {
        if (is_origin || (counts && parseInt(counts.custom_count, 10) === 0)) {
            return { base_text: `원본사진 ${counts && counts.origin_count}`, remain_text: "" };
        } else if (photo_type === "product") {
            return { base_text: `포트폴리오 ${counts.portfolio_cnt}장`, remain_text: "" };
        } else if (reserve_type === "custom") {
            return { base_text: `보정사진 ${counts && counts.custom_count}장`, remain_text: "" };
        } else if (reserve_type === "upload" && counts && counts.custom_count) {
            const { checked_photos_obj } = this.state;
            return {
                base_text: `원본사진 ${counts.origin_count} 중 ${checked_photos_obj.length}장을 선택하셨어요.`,
                remain_text: `보정요청 갯수 ${counts.custom_count - checked_photos_obj.length}장 남음`
            };
        }

        return { base_text: "", remain_text: "" };
    }

    onDeleteSelectPhotos(objects) {
        if (typeof this.props.onSelectPhoto === "function") {
            this.props.onSelectPhoto({ ...objects });
            this.setState({ ...objects });
        }
    }

    render() {
        const { photo_viewer_data, checked_photos_obj, reserve_type, photo_type, counts, is_origin } = this.props;
        const { checked_photos_number } = this.state;
        const message = this.changeText({ reserve_type, photo_type, counts, is_origin });
        const select_photos = { checked_photos_obj, checked_photos_number };
        return (
            <div className="photo-viewer-bottom">
                <div className="photo-viewer-bottom__left-info">
                    <div className="artist-profile">
                        <img src={`${__SERVER__.thumb}/normal/crop/90x90${photo_viewer_data.profile_img}`} alt={photo_viewer_data.nick_name} />
                        {/*<Img*/}
                        {/*image={{ src: photo_viewer_data.profile_img, content_width: 90, content_height: 90 }}*/}
                        {/*isScreenChange*/}
                        {/*isImageResize={false}*/}
                        {/*isCrop*/}
                        {/*isContentResize*/}
                        {/*isImageCrop={false}*/}
                        {/*/>*/}
                    </div>
                    <div className="artist-product-info">
                        <p className="artist-info">{`[${photo_viewer_data.nick_name}]${photo_viewer_data.title}`}</p>
                        <p className="product-info">{message.base_text}<span className="pink_text">{message.remain_text}</span></p>
                    </div>
                </div>
                {is_origin || (counts && parseInt(counts.custom_count, 10) === 0) || reserve_type === "custom" ?
                    null :
                    <div className="photo-viewer-bottom__right-info">
                        <SelectPhotos {...select_photos} theme="black" onDeletePhoto={this.onDeleteSelectPhotos} />
                    </div>
                }
            </div>
        );
    }
}
