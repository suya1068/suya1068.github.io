import "./selectPhotos.scss";
import React, { Component, PropTypes } from "react";
import Icon from "desktop/resources/components/icon/Icon";
import Img from "shared/components/image/Img";
// import PopModal from "shared/components/modal/PopModal";
import classNames from "classnames";

export default class SelectPhotos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked_photos_obj: props.checked_photos_obj,                               // 선택된 사진 리스트
            checked_photos_number: props.checked_photos_number,
            theme: props.theme || "default",
            length: 0,
            page_per_photos: 5,                                 // 한 페이지에 나타날 사진 갯수 (고정)
            page: 1,                                            // 현재 페이지
            max_page: 1,                                        // 최대 페이지 (페이징을 위한 값)
            dist_x: 475,                                        // 1회 슬라이드 될 거리 (고정)
            left: 0                                             // 슬라이드 박스 위치
        };

        this.calculateMaxPage = this.calculateMaxPage.bind(this);
        this.onSlidePhotoBox = this.onSlidePhotoBox.bind(this);
        this.autoSlidePhotoBox = this.autoSlidePhotoBox.bind(this);
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        this.calculateMaxPage(nextProps.checked_photos_obj);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { length } = this.state;
        this.calculateMaxPage(nextProps.checked_photos_obj, nextState.length > length);
        return true;
    }

    /**
     * 담겨진 사진을 삭제한다.
     * @param photo
     */
    onDelPhoto(photo) {
        const { checked_photos_obj, checked_photos_number } = this.state;
        const find_index = checked_photos_obj.findIndex(item => {
            return item.photo_no === photo.photo_no;
        });

        if (find_index !== -1) {
            checked_photos_obj.splice(find_index, 1);
            checked_photos_number.splice(find_index, 1);
            this.setState(this.deletePhotos({ checked_photos_obj, checked_photos_number }));
        }
    }

    /**
     * 삭제처리한 사진을 부모 컴포넌트에 알린 후 반영한다.
     * @param photos
     * @returns {function(*): {photos: *}}
     */
    deletePhotos({ ...photos }) {
        if (typeof this.props.onDeletePhoto === "function") {
            this.props.onDeletePhoto({ ...photos });
        }

        return { ...photos };
    }

    /**
     * 페이지에 따라 자동으로 슬라이드 한다.
     */
    autoSlidePhotoBox(max_page) {
        this.setState(this.calculateLeftDist(max_page));
    }

    /**
     * 화살표를 이용해 슬라이드 박스를 움직인다.
     */
    onSlidePhotoBox(e) {
        const { page, max_page } = this.state;
        const arrow_target = e.target;
        const right_arrow = arrow_target.classList[0] === "icon-gt";
        const left_arrow = arrow_target.classList[0] === "icon-lt";
        if (max_page > 1 && page < max_page && right_arrow) {
            this.setState(this.calculateLeftDist(page + 1));
        } else if (page > 1 && page <= max_page && left_arrow) {
            this.setState(this.calculateLeftDist(page - 1));
        }
    }

    /**
     * 최대 페이지를 계산한다.
     * @param list
     */
    calculateMaxPage(list, flag) {
        const max_page_temp = this.state.max_page;
        if (Array.isArray(list) && list.length > 0) {
            const { page_per_photos } = this.state;
            const total_cnt = list.length;
            const max_page = Math.ceil(total_cnt / page_per_photos);
            this.setState({ max_page, length: total_cnt }, () => {
                if ((max_page_temp !== this.state.max_page) || (this.state.max_page > this.state.page && flag)) {
                    this.autoSlidePhotoBox(this.state.max_page);
                }
            });
        }
    }

    /**
     * 이동할 거리를 계산한다.
     * @param page
     * @returns {function(*): {left: string, page: *}}
     */
    calculateLeftDist(page) {
        if (typeof page !== "number") {
            throw new TypeError("page is always number");
        }
        const { dist_x } = this.state;
        const left = -((page - 1) * dist_x);

        return ({ left, page });
    }

    onShowPhotoViewer(idx) {
        // if (typeof this.props.onShowPhotoViewer === "function") {
        //     this.props.onShowPhotoViewer();
        // }
    }

    /**
     * 선택된 사진들을 그린다.
     * @param list
     * @returns {*}
     */
    renderSelectPhotoUnit(list) {
        return (
            list.map((obj, idx) => {
                return (
                    <li className="photo-list__select-photo-image-box__unit" key={`photo-list__select_photos_item__${obj.photo_no}`}>
                        <div className="select_bg" />
                        <div className="photo-unit__delete_btn" onClick={() => this.onDelPhoto(obj)}>
                            <Icon name="close_tiny" />
                        </div>
                        <div className="photo-unit-background" onClick={() => this.onShowPhotoViewer(idx)} />
                        <Img
                            image={{ src: `/${obj.thumb_key}`, type: "private", content_width: 90, content_height: 90 }}
                            isScreenChange
                            isImageResize={false}
                            isCrop
                            isContentResize
                            isImageCrop={false}
                        />
                    </li>
                );
            })
        );
    }

    render() {
        const { left, page, max_page, theme } = this.state;
        const { checked_photos_obj } = this.props;
        return (
            <div className={classNames("photo-list__select-photo-container", { "black": theme === "black" })}>
                <div className="photo-list__select-photo-box">
                    <ul className="photo-list__select-photo-image-box">
                        <div className="photo-list__select-photo-image-box-inner" style={{ transform: `translateX(${left}px)` }}>
                            {this.renderSelectPhotoUnit(checked_photos_obj)}
                        </div>
                    </ul>
                    <div className="photo-list__select-photo__paging-arrow" onClick={this.onSlidePhotoBox}>
                        <div className="left-arrow">{page && page === 1 ? null : <Icon name="lt" />}</div>
                        <div className="right-arrow">{max_page === page ? null : <Icon name="gt" />}</div>
                    </div>
                </div>
            </div>
        );
    }
}
