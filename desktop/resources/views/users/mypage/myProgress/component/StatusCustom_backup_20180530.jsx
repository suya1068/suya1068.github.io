import React, { Component, PropTypes } from "react";
import API from "forsnap-api";
import utils from "forsnap-utils";
import Buttons from "desktop/resources/components/button/Buttons";
import PopModal from "shared/components/modal/PopModal";
import ImageCheck from "desktop/resources/components/image/ImageCheck";
import update from "immutability-helper";

// import ImageController from "desktop/resources/components/image/image_controller";

class StatusCustom_backup_20180530 extends Component {
    constructor(props) {
        super(props);

        // console.log(props);
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
            userType: "U",
            checkList: [],
            checkedNumber: [],
            originMaxCount: 0,
            customAbleCount: 0,
            due_date: props.due_date
        };

        // 사진 원본 및 보정 목록 불러오기
        this.apiReservePhotosOrigin = this.apiReservePhotosOrigin.bind(this);
        this.apiReservePhotosCustom = this.apiReservePhotosCustom.bind(this);
        this.onScroll = this.onScroll.bind(this);

        this.photosAllDownLoad = this.photosAllDownLoad.bind(this);
        this.buyComplete = this.buyComplete.bind(this);
    }

    componentWillMount() {
        // ImageController.setMaxThread(1);
        // this.apiReservePhotosCustom();
    }

    componentDidMount() {
        this.apiReservePhotosOrigin(this.state.originLoad.offset, this.state.originLoad.limit);
        this.apiReservePhotosCustom(this.state.customLoad.offset, this.state.customLoad.limit);
    }

    // 이미지 목록 스크롤처리
    onScroll(e, target) {
        const current = e.currentTarget.children[0];
        const scrollTop = Math.round(current.scrollTop);
        // const scrollTop = current.scrollTop;
        const scrollHeight = current.scrollHeight;
        const height = current.offsetHeight;

        if (scrollTop === (scrollHeight - height)) {
            if (target === "Origin") {
                this.apiReservePhotosOrigin(this.state.originLoad.offset, this.state.originLoad.limit);
            } else {
                this.apiReservePhotosCustom(this.state.customLoad.offset, this.state.customLoad.limit);
            }
            // console.log(target, "entry");
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

    /**
     * 보정이미지 목록
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

    /**
     * 사진목록을 그린다.
     * @param status 옵션에 따라 키 프로퍼티를 바꿈
     * @returns {*}
     */
    createPhotoImage(status) {
        const list = (status === "UPLOAD") ? this.state.originLoad.list : this.state.customLoad.list;

        if (list.length > 0) {
            return (
                list.map((obj, idx) => {
                    let url = "";
                    if (status === "UPLOAD") {
                        url = `/${obj.thumb_key}`;
                    } else if (status === "CUSTOM") {
                        url = `/${obj.custom_thumb_key}`;
                    }
                    return (
                        <li key={idx}>
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
        const type = "custom";
        let text = "보정사진";
        if (status === "origin") {
            text = "원본사진";
        }
        for (let i = 0, max = maxDownLoadCnt; i < max; i += 1) {
            content.push(
                <div className="download-buttons" key={`downloadcontnet__${i}`}>
                    <p className="download-file-name">
                        {`${text}_${utils.fillSpace(i, 3, 0, "front")}`}
                        {/*{`${buyNo}_${status}_${utils.fillSpace(i, 3, 0, "front")}`}*/}
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

        // const buyNo = this.props.buyNo;
        // const productNo = this.props.productNo;
        // const request = API.reservations.getDownloadKey(buyNo, productNo);
        // request.then(response => {
        //     console.log(response);
        //     if (response.status === 200) {
        //         const downLoadKey = response.data.download_key;
        //         const incodeDownLoadKey = encodeURIComponent(downLoadKey);
        //         const url = `${__SERVER__.api}/reservations/${buyNo}/photos/download/${incodeDownLoadKey}`;
        //         PopModal.toast("다운로드를 진행합니다.", undefined, 2000);
        //
        //         const node = utils.dom.createDownloadLink(url);
        //         node.click();
        //
        //         // if (downWin === null) {
        //         //     PopModal.toast("팝업 차단을 해제하신 후 다시 시도해 주세요.");
        //         // } else {
        //         //     PopModal.toast("다운로드를 진행합니다.", undefined, 2000);
        //         // }
        //     }
        // }).catch(error => {
        //     PopModal.alert(error.data);
        // });
    }
    /**
     * 구매완료 최종처리
     */
    buyComplete() {
        const buyNo = this.props.buyNo;
        const productNo = this.props.productNo;
        const request = API.reservations.photoBuyComplete(buyNo, { product_no: productNo });
        request.then(response => {
            // console.log(response);
            const customCount = response.data.custom_cnt;
            if (response.status === 200) {
                PopModal.toast("완료되었습니다.<br />'서비스 이용내역'에서 다시 확인할 수 있어요.");

                if (typeof this.props.completeFunc === "function") {
                    this.props.completeFunc(customCount);
                }
            }
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    render() {
        const originMaxCnt = this.state.originMaxCount;
        const customAbleCnt = this.state.customAbleCount;
        return (
            <div className="photo-page">
                <div className="progress-title">
                    <h3 className="h4-sub" data-count={customAbleCnt}>보정사진</h3>
                    <p className="h5-caption text-normal">보정된 사진을 다운로드후 완료하기 버튼을 눌러주세요.</p>
                </div>
                <div className="photo-container photoList">
                    <div className="photoList__custom" onScroll={e => this.onScroll(e, "Custom")}>
                        <ul
                            className="photo-list"
                        >
                            {this.createPhotoImage("CUSTOM")}
                        </ul>
                    </div>
                </div>
                <div className="progress-title">
                    <h3 className="h4-sub" data-count={originMaxCnt}>원본사진</h3>
                    <p className="h5-caption text-normal">촬영된 사진은 서비스 이용내역에서 다시 확인하실 수 있습니다.</p>
                </div>
                <div className="photo-container photoList">
                    <div className="photoList__origin" onScroll={e => this.onScroll(e, "Origin")}>
                        <ul
                            className="photo-list"
                        >
                            {this.createPhotoImage("UPLOAD")}
                        </ul>
                    </div>
                </div>
                <div className="choice">
                    <div className="choice__button">
                        <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "pink" }} inline={{ onClick: () => this.photosAllDownLoad("origin") }}>원본사진 다운로드</Buttons>
                        <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "pink" }} inline={{ onClick: () => this.photosAllDownLoad("custom") }}>보정사진 다운로드</Buttons>
                        <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ onClick: () => this.buyComplete() }}>완료하기</Buttons>
                    </div>
                    <p><span className="pinkText">보정사진 {customAbleCnt}장</span>과 원본사진 {originMaxCnt}장을 다운로드 받을 수 있습니다.</p>
                    <p className="due_date">완료하기를 누르시면 최종완료가 됩니다. ({this.state.due_date} 최종완료)</p>
                </div>
            </div>
        );
    }
}

export default StatusCustom_backup_20180530;
