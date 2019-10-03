import "./photoListContainer.scss";
import React, { Component, PropTypes } from "react";
import ListItemContainer from "./listItem/ListItemContainer";
import ListBox from "./listBox/ListBox";
import PhotoListHelperManager from "./helper/PhotoListHelperManager";
import PopModal from "shared/components/modal/PopModal";
import SelectPhotos from "../photoList/selectPhotos/SelectPhotos";
import PhotoViewer from "../photoViewer/PhotoViewerContainer";
import classNames from "classnames";

export default class PhotoListContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,                                   // 원본사진목록 or 보정사진목록, required
            product_no: props.product_no,                       // 상품번호, required
            buy_no: props.buy_no,                               // 구매번호, required
            photo_viewer_data: props.photo_viewer_data,         // 포토뷰어 데이터
            photo_type: props.photo_type,                       // 구매사진 || 샹품사진
            reserve_type: props.reserve_type,                   // 원본구매 || 보정구매
            list: [],                                           // 사진목록 배열
            user_type: "U",                                     // 유저타입
            intervalId: undefined,                              // setInterval id
            is_mount: false,                                    // 렌더링 타이밍,
            checked_photos_number: [],                          // 보정사진 선택 번호 리스트
            checked_photos_obj: [],                             // 보정사진 선택 데이터 리스트
            counts: props.type !== "upload" ? props.counts : {},                                         // 각 카운팅 데이터들
            //////////
            activeIndex: 0,
            line: props.line || 1,
            is_origin: props.is_origin || false,
            is_loading: false,
            //////////
            on_start_viewer: false,
            on_show_viewer: false
        };
        this.manager = PhotoListHelperManager.create(props.type);

        // event
        this.onMoreScroll = this.onMoreScroll.bind(this);
        this.onPushSelectPhotos = this.onPushSelectPhotos.bind(this);
        this.onDeletePhoto = this.onDeletePhoto.bind(this);
        this.onSetSelectCount = this.onSetSelectCount.bind(this);
        this.onShowPhotoViewer = this.onShowPhotoViewer.bind(this);

        this.setPhotoList = this.setPhotoList.bind(this);
        this.setTimer = this.setTimer.bind(this);
        this.clearTimer = this.clearTimer.bind(this);
        this.onCloseViewer = this.onCloseViewer.bind(this);
        this.getCheckedPhotoNumbers = this.getCheckedPhotoNumbers.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const { product_no, buy_no, user_type } = this.state;
        this.setPhotoList(this.getMorePhotos(buy_no, product_no, user_type));
        this.setTimer(() => this.setPhotoList(this.getIntervalPhotos(buy_no, product_no, user_type)));
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.counts && JSON.stringify(nextProps.counts !== this.props.counts)) {
        //     this.setState({ counts: nextProps.counts });
        // }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.list.length !== nextState.list.length ||
            JSON.stringify(this.state.list) !== JSON.stringify(nextState.list)) {
            const target = this.photo_viewer;
            if (target) {
                target.setReceiveImages(nextState.list);
            }
        }
        return true;
    }

    componentWillUnmount() {
        this.clearTimer(this.state.intervalId);
    }

    /**
     * 사진리스트를 property에 저장한다.
     * @param func
     */
    setPhotoList(func) {
        func.then(
            () => this.setState(state => ({ list: this.manager.getList(), counts: this.manager.getCounts(), is_mount: true, is_loading: false }), () => {
                if (this.state.type === "origin") {
                    this.onSetCounts(this.state.counts);
                }
            }),
            error => PopModal.alert(error.data)
        );
    }

    /**
     * 부모 컴포넌트에 객체 카운트를 전달한다.
     * @param counts
     */
    onSetCounts(counts) {
        if (typeof this.props.onSetCounts === "function") {
            this.props.onSetCounts(counts);
        }
    }

    /**
     * 이벤트 시 사진리스트를 불러온다.
     * @param buy_no
     * @param product_no
     * @param user_type
     * @returns {*}
     */
    getMorePhotos(buy_no, product_no, user_type) {
        return this.manager.getMorePhotoList(buy_no, product_no, user_type);
    }

    /**
     * 일정간격으로 사진리스트를 불러온다.
     * thumb_nail key update
     * @param buy_no
     * @param product_no
     * @param user_type
     * @returns {*}
     */
    getIntervalPhotos(buy_no, product_no, user_type) {
        return this.manager.getPhotoList(buy_no, product_no, user_type);
    }

    /**
     * api interval 호출 : thumb key update
     * @param func
     * @param sec (기본 9분)
     */
    // setTimer(func, sec = 20000) {
    setTimer(func, sec = 540000) {
        const props = {};
        props.intervalId = setInterval(() => { func(); }, sec);
        this.setState(props);
    }

    /**
     * 컴포넌트 제거 시 설정된 intervalID 제거
     * @param intervalId
     */
    clearTimer(intervalId) {
        clearInterval(intervalId);
    }

    /**
     * 사진 더 불러오기 스크롤 이벤트
     * @param flag
     */
    onMoreScroll(flag) {
        const { is_loading } = this.state;
        if (flag && !is_loading) {
            if (this.manager.getIsMore()) {
                this.setState({
                    is_loading: true
                }, () => {
                    if (this.state.is_loading) {
                        const { product_no, buy_no, user_type } = this.state;
                        this.setPhotoList(this.getMorePhotos(buy_no, product_no, user_type));
                    }
                });
            }
        }
    }

    /**
     * 보정사진 선택 리스트 저장
     * @param list
     */
    onPushSelectPhotos(list) {
        this.setState(this.onSetSelectCount(list));
    }

    /**
     * 보정선택된 사진의 갯수를 부모 컴포넌트에 전달한다.
     * @param list
     * @returns {{}}
     */
    onSetSelectCount(list) {
        if (typeof this.props.onSetSelectCount === "function") {
            this.props.onSetSelectCount(list.checked_photos_number.length);
        }

        return { ...list };
    }

    /**
     * 보정사진 선택 박스에서 사진 삭제
     * @param obj
     */
    onDeletePhoto(obj) {
        if (typeof this.props.onSetSelectCount === "function") {
            this.props.onSetSelectCount(obj.checked_photos_number.length);
        }
        this.setState({ ...obj });
    }

    /**
     * 카운트 객체를 불러온다.
     * @returns {{}|PhotoListContainer.state.counts}
     */
    getCounts() {
        return this.state.counts;
    }
    onCloseViewer() {
        this.setState({ on_show_viewer: false }, () => {
            if (!this.state.on_show_viewer) {
                document.getElementsByTagName("html")[0].style.overflow = "auto";
            }
        });
    }
    /**
     * 보정선택된 사진들의 번호 목록을 불러온다.
     * @returns {Array}
     */
    getCheckedPhotoNumbers() {
        return this.state.checked_photos_number;
    }

    onShowPhotoViewer(idx) {
        const { on_start_viewer, on_show_viewer } = this.state;
        this.setState({
            activeIndex: idx,
            on_start_viewer: !on_start_viewer || true,
            on_show_viewer: !on_show_viewer
        }, () => {
            if (this.state.on_show_viewer) {
                document.getElementsByTagName("html")[0].style.overflow = "hidden";
            }
        });
        // const { list, is_origin, counts, photo_viewer_data, checked_photos_number, checked_photos_obj, reserve_type, photo_type } = this.state;
        // const data = { images: list, counts, is_origin, photo_viewer_data, activeIndex: idx, checked_photos_number, checked_photos_obj, reserve_type, photo_type };
        // const modal_name = "photo_viewer";
        // PopModal.createModal(modal_name, <PhotoViewer {...data} ref={instance => { this.photo_viewer = instance; }} onMoreScroll={this.onMoreScroll} onSelectPhoto={this.onPushSelectPhotos} />, { className: "modal-fullscreen slider" });
        // PopModal.show(modal_name);
    }

    render() {
        const { list, on_start_viewer, activeIndex, on_show_viewer, counts, type, is_origin, is_mount, checked_photos_obj, checked_photos_number, photo_type, reserve_type } = this.state;
        const { line, photo_viewer_data } = this.props;
        const list_item_data = {
            checked_photos_obj,
            checked_photos_number,
            custom_count: counts && counts.custom_count,
            type,
            is_origin
        };

        const select_photos = { checked_photos_obj, checked_photos_number };

        if (photo_type === "reserve") {
            list_item_data.reserve_type = reserve_type;
        }

        const data = { images: list, is_origin, counts, photo_viewer_data, activeIndex, checked_photos_number, checked_photos_obj, reserve_type, photo_type };
        if (!is_mount) {
            return false;
        }
        return (
            <div className="photo-list-container-component">
                <ListBox line={line} onMoreScroll={this.onMoreScroll}>
                    <ListItemContainer onShowPhotoViewer={this.onShowPhotoViewer} list={list} onPushSelectPhotos={this.onPushSelectPhotos} {...list_item_data} />
                </ListBox>
                {!is_origin && type !== "custom" && counts && parseInt(counts.custom_count, 10) !== 0 && <SelectPhotos {...select_photos} onDeletePhoto={this.onDeletePhoto} />}
                {on_start_viewer &&
                    <div className={classNames("shower-photo-viewer", { "hide": !on_show_viewer })}>
                        <div className="viewer-close-button" onClick={this.onCloseViewer} />
                        <PhotoViewer {...data} ref={instance => { this.photo_viewer = instance; }} onMoreScroll={this.onMoreScroll} onSelectPhoto={this.onPushSelectPhotos} />
                    </div>
                }
            </div>
        );
    }
}

PhotoListContainer.propTypes = {
    type: PropTypes.oneOf(["origin", "custom"]).isRequired
};

/**
 * 기능
 * 원본사진 api 와 보정사진 api를 넘겨받고
 * 매 9분마다 전달받은 api를 호출하여 thumb-key를 update 한다.
 */
