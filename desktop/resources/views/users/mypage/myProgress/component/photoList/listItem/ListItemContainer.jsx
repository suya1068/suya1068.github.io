import "./listItemContainer.scss";
import React, { Component } from "react";
// import Img from "shared/components/image/Img";
import Img from "desktop/resources/components/image/Img";
import Icon from "desktop/resources/components/icon/Icon";
import classNames from "classnames";
import PopModal from "shared/components/modal/PopModal";

export default class ListItemContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,                       // 부모에게서 받는 사진 리스트
            photo_temp_arr: [],                     // 업데이트 용 임시 사진 리스트
            render_list: [],                        // 실제 그려질 사진 리스트
            checked_photos_number: props.checked_photos_number,
            checked_photos_obj: props.checked_photos_obj,
            custom_count: props.custom_count,
            reserve_type: props.reserve_type,
            type: props.type,
            is_origin: props.is_origin
        };
        this.onCheck = this.onCheck.bind(this);
    }

    componentWillMount() {
        const { list } = this.state;
        this.setPhotoListToTempArr(list);
        this.setPhotoListToRender(list);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.list.length !== this.props.list.length) {
            this.setPhotoListToRender(nextProps.list);
            this.setPhotoListToTempArr(nextProps.list);
        } else if (JSON.stringify(nextProps.list) !== JSON.stringify(this.props.list)) {
            this.setPhotoListToTempArr(nextProps.list);
        }

        if (JSON.stringify(nextProps.checked_photos_number) !== JSON.stringify(this.state.checked_photos_number)) {
            this.setCheckedPhotos(nextProps.checked_photos_obj, nextProps.checked_photos_number);
        }
    }

    /**
     * 사진 삭제 후 photo_list 에서 활성화 UI 삭제
     * @param list
     * @param numbers
     */
    setCheckedPhotos(list, numbers) {
        this.setState({
            checked_photos_number: numbers,
            checked_photos_obj: list
        });
    }

    /**
     * 사진목록을 임시 리스트에 저장한다.
     * @param list
     */
    setPhotoListToTempArr(list) {
        this.state.photo_temp_arr = list;
    }

    /**
     * 렌더링할 리스트를 저장한다.
     * @param list
     */
    setPhotoListToRender(list) {
        this.setState({
            render_list: list
        });
    }

    /**
     * 클릭한 사진의 번호를 담는다.
     * @param photo_no
     * @param obj
     */
    onCheck(photo_no, obj) {
        const { checked_photos_number, checked_photos_obj, custom_count } = this.state;
        const findIndex = checked_photos_number.indexOf(photo_no);

        const number_of_checked_numbers = parseInt(checked_photos_number.length, 10);
        const number_of_custom_count = parseInt(custom_count, 10);

        const check_obj = this.onPushSelectPhotoThumbKeyCheck(obj);

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

        this.setState(this.onPushSelectPhotos({ checked_photos_number, checked_photos_obj }));
    }

    /**
     * 보정사진 선택전 thumb_key 가 변경되었다면 변경된 사진 객체를을 반환한다.
     * @param obj - Object : select_image
     * @returns {*}
     */
    onPushSelectPhotoThumbKeyCheck(obj) {
        const { photo_temp_arr } = this.state;            // 부모 컴포넌트에서 업데이트 된 사진 리스트 데이터
        const find_image_obj = photo_temp_arr.find(image => { return image.photo_no === obj.photo_no; });

        return find_image_obj.thumb_key !== obj.thumb_key ? find_image_obj : obj;
    }

    /**
     * 부모 컴포넌트 함수 실행
     * - 보정사진 선택 시 사진번호 리스트와 선택된 사진 리스트를 넘긴다.
     * @param objects
     * @returns {{checked_photos_number: (*|Array)}}
     */
    onPushSelectPhotos(objects) {
        if (typeof this.props.onPushSelectPhotos === "function") {
            this.props.onPushSelectPhotos({ ...objects });
        }

        return { checked_photos_number: objects.checked_photos_number };
    }

    onShowPhotoViewer(idx) {
        if (typeof this.props.onShowPhotoViewer === "function") {
            this.props.onShowPhotoViewer(idx);
        }
    }

    /**
     * 사진 리스트를 그린다.
     * @param list
     * @returns {*}
     */
    renderList(list) {
        const { checked_photos_number, is_origin, reserve_type, type, custom_count } = this.state;
        if (Array.isArray(list) && list.length > 0) {
            return (
                list.map((obj, idx) => {
                    const image_src = obj.thumb_key || obj.custom_thumb_key;
                    const url = `/${image_src}`;
                    let icon_name = "check_s_gray";
                    const selected = checked_photos_number && checked_photos_number.indexOf(obj.photo_no) !== -1;
                    if (selected) {
                        icon_name = "check_s";
                    }

                    return (
                        <li key={idx}>
                            {selected ? <div className="select_bg" style={{ zIndex: 2 }} /> : null}
                            {!is_origin && type !== "custom" && custom_count > 0 &&
                                <div onClick={() => this.onCheck(obj.photo_no, obj)} style={{ zIndex: 4 }} className={classNames("photo-selected-box", { "select": selected })}>
                                    <Icon name={icon_name} />
                                </div>
                            }
                            <div className="photo-selected-background" style={{ zIndex: 3 }} onClick={() => this.onShowPhotoViewer(idx)} />
                            <Img image={{ src: url, type: "private" }} />
                        </li>
                    );
                })
            );
        }

        return null;
    }

    render() {
        const { render_list } = this.state;
        return (
            <div className="photo-list-item-component">
                <ul className="photo-list__wrapper">
                    {this.renderList(render_list)}
                </ul>
            </div>
        );
    }
}

/**
 * 기능
 * 감싸고 있는 박스의 크기만큼 사진 리스트를 그려줌
 */
