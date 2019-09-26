import React, { Component, PropTypes } from "react";
import Buttons from "desktop/resources/components/button/Buttons";
import utils from "forsnap-utils";
import PopModal from "shared/components/modal/PopModal";
import PhotoListContainer from "../component/photoList/PhotoListContainer";
import ProgressHelper from "./util/ProgressHelper";
import DownloadContent from "./downLoad/DownLoadContent";

class StatusCustom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            origin_count: 0,
            custom_count: 0,
            select_count: 0,
            buy_no: props.buy_no,
            product_no: props.product_no,
            due_date: props.due_date,
            photo_viewer_data: props.fullSliderData,
            type: "custom",
            is_loading: false
        };

        this.progress_helper = new ProgressHelper({ buy_no: this.state.buy_no, product_no: this.state.product_no, type: this.state.type });

        this.photosAllDownLoad = this.photosAllDownLoad.bind(this);
        this.buyComplete = this.buyComplete.bind(this);
        this.onSetCounts = this.onSetCounts.bind(this);
        // this.onSetSelectCount = this.onSetSelectCount.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    /**
     * 사진 목록 로드 후 카운트 데이터를 저장한다.
     * @param obj
     */
    onSetCounts(obj) {
        this.setState({ ...obj, is_loading: true });
    }

    getDownLoadUnit(idx, reserve_type) {
        this.progress_helper.getDownloadPhotos(idx, reserve_type)
            .then(response => {
                const url = this.progress_helper.getDownloadUrl();
                const node = utils.dom.createDownloadLink(url, `downloadIdx__${idx}`);
                if (node) {
                    node.click();
                }
            }).catch(error => {
                PopModal.alert(error.data);
            });
    }

    /**
     * 구매완료 최종처리
     */
    buyComplete() {
        this.progress_helper.fetchComplete()
            .then(response => {
                PopModal.toast("완료되었습니다.<br />'서비스 이용내역'에서 다시 확인할 수 있어요.");
                if (typeof this.props.completeFunc === "function") {
                    this.props.completeFunc(response.custom_count);
                }
            }).catch(error => {
                PopModal.toast(error);
            });
    }

    /**
     * 전체사진을 다운로드한다.
     */
    photosAllDownLoad(reserve_type) {
        this.progress_helper.getAllPhotosDownload(reserve_type)
            .then(response => {
                const modalName = "downloadPhotos";
                const data = {
                    file_count: this.progress_helper.getDownFileCount(),
                    download_able_array: this.progress_helper.getArrAbleDownload(),
                    type: this.state.type,
                    reserve_type
                };
                PopModal.createModal(modalName, <DownloadContent {...data} onDownLoadUnit={idx => this.getDownLoadUnit(idx, reserve_type)} />);
                PopModal.show(modalName);
            })
            .catch(error => {
                PopModal.alert(error.data);
            });
    }

    render() {
        const { product_no, buy_no, origin_count, custom_count, photo_viewer_data } = this.state;

        const photo_list_data = {
            product_no, buy_no
        };

        if (photo_viewer_data) {
            photo_list_data["photo_viewer_data"] = photo_viewer_data;
        }

        photo_list_data.photo_type = "reserve";

        let line = 1;
        if (custom_count > 10) {
            line = 2;
        }

        const counts = { origin_count, custom_count };

        return (
            <div className="photo-page">
                <div className="progress-title">
                    <h3 className="h4-sub" data-count={custom_count}>보정사진</h3>
                    <p className="h5-caption text-normal">보정된 사진을 다운로드후 완료하기 버튼을 눌러주세요.</p>
                </div>
                <div className="photo-container photoList">
                    <PhotoListContainer
                        //onSetCounts={this.onSetCounts}
                        line={line}
                        {...photo_list_data}
                        counts={counts}
                        type="custom"
                        reserve_type="custom"
                        //is_origin
                    />
                </div>
                <div className="progress-title">
                    <h3 className="h4-sub" data-count={origin_count}>원본사진</h3>
                    <p className="h5-caption text-normal">촬영된 사진은 서비스 이용내역에서 다시 확인하실 수 있습니다.</p>
                </div>
                <div className="photo-container photoList">
                    <PhotoListContainer
                        onSetCounts={this.onSetCounts}
                        line={5}
                        {...photo_list_data}
                        reserve_type="upload"
                        type="origin"
                        is_origin
                    />
                </div>
                <div className="choice">
                    <div className="choice__button">
                        <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "pink" }} inline={{ onClick: () => this.photosAllDownLoad("origin") }}>원본사진 다운로드</Buttons>
                        <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "pink" }} inline={{ onClick: () => this.photosAllDownLoad("custom") }}>보정사진 다운로드</Buttons>
                        <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ onClick: () => this.buyComplete() }}>완료하기</Buttons>
                    </div>
                    <p><span className="pinkText">보정사진 {custom_count}장</span>과 원본사진 {origin_count}장을 다운로드 받을 수 있습니다.</p>
                    <p className="due_date">완료하기를 누르시면 최종완료가 됩니다. ({this.state.due_date} 최종완료)</p>
                </div>
            </div>
        );
    }
}

export default StatusCustom;
