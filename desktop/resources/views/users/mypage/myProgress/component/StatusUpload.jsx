import React, { Component, PropTypes } from "react";
import Buttons from "desktop/resources/components/button/Buttons";
import utils from "forsnap-utils";
import PopModal from "shared/components/modal/PopModal";
import PhotoListContainer from "../component/photoList/PhotoListContainer";
import ProgressHelper from "./util/ProgressHelper";
import DownloadContent from "./downLoad/DownLoadContent";

class StatusUpload extends Component {
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
            type: "origin",
            is_loading: false
        };

        this.progress_helper = new ProgressHelper({ buy_no: this.state.buy_no, product_no: this.state.product_no, type: this.state.type });

        this.requestPhoto = this.requestPhoto.bind(this);
        this.photosAllDownLoad = this.photosAllDownLoad.bind(this);
        this.buyComplete = this.buyComplete.bind(this);
        this.onSetCounts = this.onSetCounts.bind(this);
        this.onSetSelectCount = this.onSetSelectCount.bind(this);
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
     * 사진보정 요청하기
     */
    requestPhoto() {
        const number_list = this.photo_list.getCheckedPhotoNumbers();
        const numbers = number_list.join(",");

        if (this.state.custom_count - number_list.length !== 0) {
            PopModal.alert(`아직 ${this.state.custom_count - number_list.length}장 남았어요.`);
            return;
        }

        this.progress_helper.fetchCustomPhotos(numbers)
            .then(response => {
                PopModal.alert(response);
                if (typeof this.props.closeFunc === "function") {
                    this.props.closeFunc();
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

    /**
     * 보정사진 선택 시 리스트 갯수를 저장한다.
     * @param count
     */
    onSetSelectCount(count) {
        this.setState({ select_count: count });
    }

    render() {
        const { product_no, buy_no, type, select_count, origin_count, custom_count, is_loading, photo_viewer_data } = this.state;
        const content = [];
        const message_content = [];
        const photo_list_data = {
            product_no, buy_no, type
        };

        if (photo_viewer_data) {
            photo_list_data["photo_viewer_data"] = photo_viewer_data;
        }

        photo_list_data.photo_type = "reserve";
        photo_list_data.reserve_type = "upload";

        if (is_loading) {
            if (custom_count < 1) {          // 보정사진 선택 단계가 없는 페이지
                content.push(
                    <div className="choice" key="origin_choice">
                        <div className="choice__button">
                            <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "pink" }} inline={{ onClick: () => this.photosAllDownLoad("origin") }}>원본사진 다운로드</Buttons>
                            <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ onClick: () => this.buyComplete() }}>완료하기</Buttons>
                        </div>
                        <p className="due_date">완료하기를 누르시면 최종완료가 됩니다. ({this.state.due_date} 최종완료)</p>
                    </div>
                );
                message_content.push(
                    <div key="origin_choice_message">
                        <p>원본사진은 {origin_count}장 입니다.</p>
                    </div>
                );
            } else if (custom_count > 0) {       // 보정사진 선택 단계가 있는 페이지
                content.push(
                    <div className="choice" key="custom_choice">
                        <div className="choice__button">
                            <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "pink" }} inline={{ onClick: () => this.photosAllDownLoad("origin") }}>원본사진 다운로드</Buttons>
                            <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ onClick: this.requestPhoto }}>사진보정 요청하기</Buttons>
                        </div>
                    </div>
                );
                message_content.push(
                    <div key="custom_choice_message">
                        <p>원본사진 {origin_count}장 중 <span className="pinkText">{select_count || 0}</span>장을 선택하셨어요. <span className="pinkText">보정요청 갯수 {custom_count - select_count}장 남음</span></p>
                    </div>
                );
            }
        }

        return (
            <div className="photo-page" key="photo-page" >
                <div className="progress-title">
                    <h3 className="h4-sub" data-count={origin_count}>원본사진</h3 >
                    {/*<p className="h5-caption text-normal">{titleMsg}</p>*/}
                    {message_content}
                </div>
                <PhotoListContainer
                    onSetCounts={this.onSetCounts}
                    onSetSelectCount={this.onSetSelectCount}
                    line={5}
                    {...photo_list_data}
                    ref={instance => { this.photo_list = instance; }}
                />
                {content}
            </div>
        );
    }
}

export default StatusUpload;
