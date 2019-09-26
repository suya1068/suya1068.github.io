import "./photoView_original.scss";
import React, { Component, PropTypes } from "react";
import update from "immutability-helper";
import classNames from "classnames";

import API from "forsnap-api";
import utils from "forsnap-utils";

import Buttons from "desktop/resources/components/button/Buttons";
import ImageCheck from "desktop/resources/components/image/ImageCheck";
import PopModal from "shared/components/modal/PopModal";

// import ImageController from "desktop/resources/components/image/image_controller";

class PhotoView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            originLoad: {
                list: [],
                offset: 0,
                limit: 50,
                isMore: true
            },
            customLoad: {
                list: [],
                offset: 0,
                limit: 20,
                isMore: true
            },
            // limit: 50,
            userType: "U",
            checkedNumber: [],
            originMaxCount: 0,
            customAbleCount: 0,
            optionType: props.optionType,
            isCustom: props.customCount > 0
        };

        // 사진 원본 및 보정 목록 불러오기
        this.apiReservePhotosOrigin = this.apiReservePhotosOrigin.bind(this);
        this.apiReservePhotosCustom = this.apiReservePhotosCustom.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    componentWillMount() {
        // ImageController.setMaxThread(1);
    }

    componentDidMount() {
        // const optionType = this.state.optionType;
        const isCustom = this.state.isCustom;
        if (isCustom) {
            this.apiReservePhotosOrigin(this.state.originLoad.offset, this.state.originLoad.limit);
            this.apiReservePhotosCustom(this.state.customLoad.offset, this.state.customLoad.limit);
        } else {
            this.apiReservePhotosOrigin(this.state.originLoad.offset, this.state.originLoad.limit);
        }
    }

    componentWillUnmount() {
    }

    // 이미지 목록 스크롤처리 (바닥에 다을시 더 불러오기
    onScroll(e, target) {
        const current = e.currentTarget;
        const scrollTop = Math.round(current.scrollTop);
        const scrollHeight = current.scrollHeight;
        const height = current.offsetHeight;

        if (scrollTop === (scrollHeight - height)) {
            if (target === "origin") {
                this.apiReservePhotosOrigin(this.state.originLoad.offset, this.state.originLoad.limit);
            } else {
                this.apiReservePhotosCustom(this.state.customLoad.offset, this.state.customLoad.limit);
            }
        }
    }

    getDownLoadUnit(idx, status) {
        const buyNo = this.props.buyNo;
        const productNo = this.props.productNo;
        const request = API.reservations.getDownloadKey(buyNo, productNo, status);
        request.then(response => {
            if (response.status === 200) {
                const downLoadKey = response.data.download_key;
                const encodeDownLoadKey = encodeURIComponent(downLoadKey);

                const url = `${__SERVER__.api}/reservations/${buyNo}/photos/download/${encodeDownLoadKey}/${idx}`;
                PopModal.toast("다운로드를 진행합니다.", undefined, 2000);

                const node = utils.dom.createDownloadLink(url, `downloadIdx__${idx}`);
                node.click();

                // if (downWin === null) {
                //     PopModal.toast("팝업 차단을 해제하신 후 다시 시도해 주세요.");
                // } else {
                //     PopModal.toast("다운로드를 진행합니다.", undefined, 2000);
                // }
            }
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    /**
     * 원본이미지 목록
     */
    apiReservePhotosOrigin(offset, limit) {
        const buyNo = this.props.buyNo;
        const productNo = this.props.productNo;
        const userType = this.state.userType;

        const isMore = this.state.originLoad.isMore;

        if (isMore) {
            const request = API.reservations.reservePhotosOrigin(buyNo, productNo, userType, offset, limit);
            request.then(response => {
                // console.log("origin :", response);
                const data = response.data;
                const dataList = data.list;

                this.state.originLoad.offset = offset + dataList.length;
                this.state.originLoad.isMore = !(dataList.length < limit);

                this.setState({
                    originLoad: update(this.state.originLoad, { list: { $push: dataList } }),
                    originMaxCount: update(this.state.originMaxCount, { $set: data.origin_count }),
                    customAbleCount: update(this.state.customAbleCount, { $set: data.custom_count })
                });
            }).catch(error => {
                PopModal.alert(error.data);
            });
        }
    }

    // /**
    //  * 원본이미지 목록
    //  */
    // apiReservePhotosOrigin() {
    //     const buyNo = this.props.buyNo;
    //     const productNo = this.props.productNo;
    //     const userType = this.state.userType;
    //
    //     const offset = this.state.originLoad.offset;
    //     const limit = this.state.originLoad.limit;
    //     const isMore = this.state.originLoad.isMore;
    //
    //     if (isMore) {
    //         const request = API.reservations.reservePhotosOrigin(buyNo, productNo, userType, offset, limit);
    //         request.then(response => {
    //             const data = response.data;
    //             const dataList = data.list;
    //
    //             this.state.originLoad.offset = offset + dataList.length;
    //             this.state.originLoad.isMore = !(dataList.length < limit);
    //
    //             this.setState({
    //                 originLoad: update(this.state.originLoad, { list: { $push: dataList } }),
    //                 originMaxCount: update(this.state.originMaxCount, { $set: data.origin_count }),
    //                 customAbleCount: update(this.state.customAbleCount, { $set: data.custom_count })
    //             });
    //         }).catch(error => {
    //             PopModal.alert(error.data);
    //         });
    //     }
    // }

    /**
     * 원본이미지 목록
     */
    apiReservePhotosCustom(offset, limit) {
        const buyNo = this.props.buyNo;
        const productNo = this.props.productNo;
        const userType = this.state.userType;

        const isMore = this.state.customLoad.isMore;

        if (isMore) {
            const request = API.reservations.reservePhotosCustom(buyNo, productNo, userType, offset, limit);
            request.then(response => {
                // console.log("custom :", response);
                const data = response.data;
                const dataList = data.list;
                const length = dataList.length;

                // const obj = utils.mergeArrayTypeObject(this.state.customLoad.list, dataList, ["origin_no"], ["origin_no"], true);
                // this.state.customLoad.offset = offset + obj.count;
                // this.state.customLoad.isMore = !(length < limit);
                //
                // this.setState({
                //     customLoad: update(this.state.customLoad, { list: { $set: obj.list } })
                // });
                this.state.customLoad.offset = offset + dataList.length;
                this.state.customLoad.isMore = !(dataList.length < limit);

                this.setState({
                    customLoad: update(this.state.customLoad, { list: { $push: dataList } })
                });
            }).catch(error => {
                PopModal.alert(error.data);
            });
        }
    }

    // /**
    //  * API 보정요청 목록
    //  */
    // apiReservePhotosCustom() {
    //     const buyNo = this.props.buyNo;
    //     const productNo = this.props.productNo;
    //     const userType = this.state.userType;
    //     const offset = this.state.customLoad.offset;
    //     const limit = this.state.customLoad.limit;
    //
    //     const request = API.reservations.reservePhotosCustom(buyNo, productNo, userType, offset, limit);
    //     request.then(response => {
    //         const data = response.data;
    //         const dataList = data.list;
    //         const length = dataList.length;
    //
    //         const obj = utils.mergeArrayTypeObject(this.state.customLoad.list, dataList, ["origin_no"], ["origin_no"]);
    //         this.state.customLoad.offset = offset + obj.count;
    //         this.state.customLoad.isMore = !(length < limit);
    //
    //         this.setState({
    //             customLoad: update(this.state.customLoad, { list: { $set: obj.list } })
    //         }, () => {
    //             this.apiReservePhotosOrigin();
    //         });
    //     }).catch(error => {
    //         PopModal.alert(error.data);
    //     });
    // }

    /**
     * 사진목록을 그린다.
     * @param status 옵션에 따라 키 프로퍼티를 바꿈
     * @returns {*}
     */
    createPhotoImage(status) {
        const list = (status === "ORIGIN") ? this.state.originLoad.list : this.state.customLoad.list;
        const isCustom = this.state.isCustom;
        // const list = isCustom ? this.state.customLoad.list : this.state.originLoad.list;

        if (list.length > 0) {
            return (
                list.map((obj, idx) => {
                    let url = "";
                    if (status === "CUSTOM") {
                        url = `/${obj.custom_thumb_key}`;
                    } else {
                        url = `/${obj.thumb_key}`;
                    }
                    return (
                        <li key={`photo-${idx}`}>
                            <ImageCheck image={{ src: url, type: "private" }} size="small" />
                        </li>
                    );
                })
            );
        }
        return (<div />);
    }

    createDownLoadButtons(status) {
        const content = [];
        const maxDownLoadCnt = this.state.maxDownLoadCnt;
        const buyNo = this.props.buyNo;
        const type = this.state.isCustom ? "custom" : "origin";
        let text = "원본사진";
        if (status === "custom") {
            text = "보정사진";
        }
        for (let i = 0, max = maxDownLoadCnt; i < max; i += 1) {
            content.push(
                <div className="download-buttons" key={`downloadcontnet__${i}`}>
                    <p className="download-file-name">
                        {`${text}_${utils.fillSpace(i, 3, 0, "front")}`}
                        {/*{`${buyNo}_${type}_${utils.fillSpace(i, 3, 0, "front")}`}*/}
                    </p>
                    <Buttons
                        buttonStyle={{ width: "w179", shape: "round", theme: "default" }}
                        inline={{ onClick: () => this.getDownLoadUnit(i, status) }}
                    >
                        다운로드</Buttons>
                </div>
            );
        }
        const downLoadContent = (
            <div className="download-pop" key="sasfe">
                <p className="download-pop__title">{text} <strong>분할 다운로드</strong></p>
                <p className="download-pop__caption">촬영한 사진이 1GB 이상일 경우 분할 다운로드로 받으실 수 있습니다.</p>
                <div className="wrap-download">
                    <div>
                        { content }
                    </div>
                </div>
            </div>
        );

        return downLoadContent;
    }

    /**
     * 전체사진을 다운로드한다.
     */
    photosAllDownLoad(status) {
        const buyNo = this.props.buyNo;
        const productNo = this.props.productNo;
        const request = API.reservations.getDownloadKey(buyNo, productNo, status);
        request.then(response => {
            const maxDownLoadCnt = response.data.file_count;
            this.setState({
                maxDownLoadCnt
            }, () => {
                const modalName = "downloadPhotos";
                PopModal.createModal(modalName, this.createDownLoadButtons(status));
                PopModal.show(modalName);
            });
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    createPopViewer() {
        const optionType = this.props.optionType;
        const isCustom = this.state.isCustom;
        const content = [];
        if (isCustom) {
            content.push(
                <div className="drawPhoto-custom" key="customPhotoView">
                    <div className="photos-title">
                        <div className="title">보정사진<div className="circleCount">{this.state.customAbleCount}장</div></div>
                    </div>
                    <ul
                        className="photos-list custom"
                        onScroll={e => this.onScroll(e, "custom")}
                    >
                        {this.createPhotoImage("CUSTOM")}
                    </ul>
                    <div className="photos-title">
                        <div className="title">원본사진<div className="circleCount">{this.state.originMaxCount}장</div></div>
                    </div>
                    <ul
                        className="photos-list custom__origin"
                        onScroll={e => this.onScroll(e, "origin")}
                    >
                        {this.createPhotoImage("ORIGIN")}
                    </ul>
                </div>
            );
        } else {
            content.push(
                <div className="drawPhoto-origin" key="originPhotoView">
                    <div className="photos-title">
                        <div className="title">원본사진<div className="circleCount">{this.state.originMaxCount}장</div></div>
                    </div>
                    <ul
                        className="photos-list origin"
                        onScroll={e => this.onScroll(e, "origin")}
                    >
                        {this.createPhotoImage("ORIGIN")}
                    </ul>
                </div>
            );
        }

        return (<div>{content}</div>);
    }

    render() {
        const isCustom = this.state.isCustom;
        return (
            <div className="pop-view-photos" key="popViewPhoto">
                {this.createPopViewer()}
                <div className={classNames("photos-buttons", { "is_custom": isCustom })}>
                    <div className="origin-down">
                        <Buttons buttonStyle={{ shape: "circle", theme: "default", width: "block" }} inline={{ className: "btn-complete", onClick: () => this.photosAllDownLoad("origin") }}>원본사진 다운로드</Buttons>
                    </div>
                    {isCustom ?
                        <div className="custom-down">
                            <Buttons buttonStyle={{ shape: "circle", theme: "default", width: "block" }} inline={{ className: "btn-complete", onClick: () => this.photosAllDownLoad("custom") }}>보정사진 다운로드</Buttons>
                        </div> : null
                    }
                </div>
            </div>
        );
    }
}

PhotoView.propTypes = {
    buyNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    productNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default PhotoView;
