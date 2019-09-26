import React, { Component, PropTypes } from "react";
import API from "forsnap-api";
import Buttons from "desktop/resources/components/button/Buttons";
import utils from "forsnap-utils";
import PopModal from "shared/components/modal/PopModal";
import ImageCheck from "desktop/resources/components/image/ImageCheck";
import update from "immutability-helper";
import ImageSliderTest from "desktop/resources/components/image/ImageSliderTest";

// import ImageController from "desktop/resources/components/image/image_controller";

class StatusUpload_backup_20180530 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            offset: 0,
            limit: 50,
            userType: "U",
            isMore: true,
            checkList: [],
            checkedNumber: [],
            originMaxCount: 0,
            customAbleCount: 0,
            fixedCustomCount: 0,
            moreCheck: false,
            maxDownLoadCnt: 0,
            due_date: props.due_date
        };
        this.apiReservePhotosOrigin = this.apiReservePhotosOrigin.bind(this);
        this.requestPhoto = this.requestPhoto.bind(this);
        this.checkImage = this.checkImage.bind(this);
        this.onScroll = this.onScroll.bind(this);

        this.photosAllDownLoad = this.photosAllDownLoad.bind(this);
        this.buyComplete = this.buyComplete.bind(this);
    }

    componentWillMount() {
        // ImageController.setMaxThread(1);
    }

    componentDidMount() {
        this.apiReservePhotosOrigin();
    }

    // 이미지 목록 스크롤처리
    onScroll(e) {
        const current = e.currentTarget;
        const scrollTop = Math.round(current.scrollTop);
        // const scrollTop = current.scrollTop;
        const scrollHeight = current.scrollHeight;
        const height = current.offsetHeight;

        if (scrollTop === (scrollHeight - height)) {
            this.apiReservePhotosOrigin();
        }
    }

    getDownLoadUnit(idx, status) {
        const buyNo = this.props.buyNo;
        const productNo = this.props.productNo;
        const isActiveDownload = this.state.isActiveDownload;
        API.reservations.getDownloadKey(buyNo, productNo, status, idx).then(response => {
            if (response.status === 200) {
                const downLoadKey = response.data.download_key;
                const encodeDownLoadKey = encodeURIComponent(downLoadKey);
                const url = `${__SERVER__.api}/reservations/${buyNo}/photos/download/${encodeDownLoadKey}/${idx}`;
                PopModal.toast("다운로드를 진행합니다.", undefined, 2000);

                // if (downWin === null) {
                //     PopModal.toast("팝업 차단을 해제하신 후 다시 시도해 주세요.");
                // } else {
                //     PopModal.toast("다운로드를 진행합니다.", undefined, 2000);
                // }
                const node = utils.dom.createDownloadLink(url, `downloadIdx__${idx}`);
                if (node) {
                    node.click();
                }

                this.setState({
                    isActiveDownload: update(isActiveDownload, { [idx]: { $set: true } })
                }, () => {
                    // console.log(this.state.isActiveDownload);
                });
            }
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    // 원본이미지 목록 불러오기
    apiReservePhotosOrigin() {
        const buyNo = this.props.buyNo;
        const productNo = this.props.productNo;
        const userType = this.state.userType;

        const offset = this.state.offset;
        const limit = this.state.limit;
        const isMore = this.state.isMore;

        if (isMore) {
            const request = API.reservations.reservePhotosOrigin(buyNo, productNo, userType, offset, limit);
            request.then(response => {
                const data = response.data;
                const dataList = data.list;

                this.state.offset = offset + dataList.length;
                this.state.isMore = !(dataList.length < limit);

                this.setState({
                    list: update(this.state.list, { $push: dataList }),
                    originMaxCount: update(this.state.originMaxCount, { $set: data.origin_count }),
                    customAbleCount: update(this.state.customAbleCount, { $set: data.custom_count }),
                    moreCheck: false
                });
            });
        }
    }

    checkImage(checked, obj) {
        const checkList = this.state.checkList;
        const customCount = parseInt(this.state.customAbleCount, 10);
        const photoNo = obj.photo_no;
        const thumbKey = obj.thumb_key;


        let putCheckData = "";
        let checkedPhotoNumber = "";            // 단순 체크를 위한 자료

        if (checked) {
            // 보정요청한 사진을 모두 선택하면
            if (customCount === this.state.checkList.length) {
                return;
            }
            putCheckData = { $push: [{ photo_no: photoNo, src: `/${thumbKey}`, type: "private" }] };
            checkedPhotoNumber = { $push: [photoNo] };
        } else {
            const index = checkList.findIndex(chk => {
                return chk.photo_no === photoNo;
            });
            putCheckData = { $splice: [[index, 1]] };
            checkedPhotoNumber = { $splice: [[index, 1]] };
        }
        this.setState({
            checkList: update(this.state.checkList, putCheckData),
            checkedNumber: update(this.state.checkedNumber, checkedPhotoNumber)
        }, () => {
            const checkListLength = this.state.checkList.length;
            if (customCount === checkListLength) {
                PopModal.toast("보정사진을 전부 선택하셨습니다.");
            }
        });
    }

    /**
     * 사진보정 요청하기
     */
    requestPhoto() {
        const buyNo = this.props.buyNo;
        const productNo = this.props.productNo;
        const checkList = this.state.checkedNumber;
        const customNumbers = checkList.join(",");

        if (this.state.customAbleCount - checkList.length !== 0) {
            PopModal.alert(`아직 ${this.state.customAbleCount - checkList.length}장 남았어요.`);
            return;
        }
        const request = API.reservations.reservePhotosSelect(buyNo, productNo, customNumbers);
        request.then(response => {
            if (response.status === 200) {
                PopModal.alert("사진보정 요청이 완료되었습니다.");

                if (typeof this.props.closeFunc === "function") {
                    this.props.closeFunc();
                }
            }
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    /**
     * 사진목록을 그린다.
     * @returns {*}
     */
    createPhotoImage() {
        const list = this.state.list;
        const checkedList = this.state.checkedNumber;
        const customCount = this.state.customAbleCount;

        if (list.length > 0) {
            return (
                list.map((obj, idx) => {
                    const url = `/${obj.thumb_key}`;
                    const checked = checkedList.indexOf(obj.photo_no);
                    return (
                        <li key={idx}>
                            {
                                customCount < 1
                                    ? <ImageCheck image={{ src: url, type: "private" }} size="small" />
                                    : <ImageCheck image={{ src: url, type: "private" }} checked={(checked !== -1)} size="small" resultFunc={chk => this.checkImage(chk, obj)} key={`option_${idx}`} />

                            }
                        </li>
                    );
                })
            );
        }
        return (<div />);
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
            PopModal.toast(error);
        });
    }

    createDownLoadButtons(status) {
        const content = [];
        const maxDownLoadCnt = this.state.maxDownLoadCnt;
        const isActiveDownload = this.state.isActiveDownload;
        const buyNo = this.props.buyNo;
        const type = "origin";
        for (let i = 0, max = maxDownLoadCnt; i < max; i += 1) {
            content.push(
                <div className="download-buttons" key={`downloadcontnet__${i}`}>
                    <p className="download-file-name">
                        {`원본사진_${utils.fillSpace(i, 3, 0, "front")}`}
                        {/*{`${buyNo}_${type}_${utils.fillSpace(i, 3, 0, "front")}`}*/}
                    </p>
                    <Buttons
                        buttonStyle={{ width: "w179", shape: "round", theme: "default", isActive: isActiveDownload[i] }}
                        inline={{ onClick: () => this.getDownLoadUnit(i, status) }}
                    >
                        다운로드</Buttons>
                </div>
            );
        }
        const downLoadContent = (
            <div className="download-pop" key="sasfe">
                <p className="download-pop__title">원본사진 <strong>분할 다운로드</strong></p>
                <p className="download-pop__caption">촬영한 사진이 1GB 이상일 경우 분할 다운로드로 받으실 수 있습니다.</p>
                <div className="wrap-download">
                    { content }
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

            const isActiveDownload = new Array(maxDownLoadCnt);
            for (let i = 0; i < maxDownLoadCnt; i += 1) {
                isActiveDownload[i] = false;
            }

            // console.log(isActiveDownload);
            this.setState({
                maxDownLoadCnt,
                isActiveDownload
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

    render() {
        const checkList = this.state.checkList;
        const originMaxCnt = this.state.originMaxCount;
        const customCount = this.state.customAbleCount;
        const content = [];
        let titleMsg = "사진을 확인해 보세요.";
        if (customCount > 0) {
            titleMsg = "마음에 드는 사진을 선택하여 보정을 요청하세요.";
        }

        if (customCount < 1) {
            content.push(
                <div className="photo-container photoList" key="origin_option">
                    <div className="photoList__origin">
                        <ul
                            className="photo-list"
                            onScroll={this.onScroll}
                        >
                            {this.createPhotoImage()}
                        </ul>
                    </div>
                    <div className="photoList__select">
                        <div className="photo-slide" />
                    </div>
                </div>
            );
            content.push(
                <div className="choice" key="origin_choice">
                    <div className="choice__button">
                        <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "pink" }} inline={{ onClick: () => this.photosAllDownLoad("origin") }}>원본사진 다운로드</Buttons>
                        <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ onClick: () => this.buyComplete() }}>완료하기</Buttons>
                    </div>
                    <p>원본사진은 {originMaxCnt}장 입니다.</p>
                    <p className="due_date">완료하기를 누르시면 최종완료가 됩니다. ({this.state.due_date} 최종완료)</p>
                </div>
            );
        } else if (customCount > 0) {
            content.push(
                <div className="photo-container photoList" key="origin_custom">
                    <div className="photoList__origin select">
                        <ul
                            className="photo-list"
                            onScroll={this.onScroll}
                        >
                            {this.createPhotoImage()}
                        </ul>
                    </div>
                    <div className="photoList__select">
                        <div className="photo-slide">
                            <ImageSliderTest images={checkList} type="photo">
                                {
                                    checkList.map((obj, idx) => {
                                        const checkedList = this.state.checkedNumber;
                                        const checked = checkedList.indexOf(obj.photo_no);
                                        return (
                                            <ImageCheck image={{ src: obj.src, type: "private" }} checked={(checked !== -1)} size="small" resultFunc={chk => this.checkImage(chk, obj)} key={`customOptionView${idx}`} />
                                        );
                                    })
                                }
                            </ImageSliderTest>
                        </div>
                    </div>
                </div>
            );
            content.push(
                <div className="choice" key="custom_choice">
                    <div className="choice__button">
                        <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "pink" }} inline={{ onClick: () => this.photosAllDownLoad("origin") }}>원본사진 다운로드</Buttons>
                        <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ onClick: this.requestPhoto }}>사진보정 요청하기</Buttons>
                    </div>
                    <p>원본사진 {originMaxCnt}장 중 <span className="pinkText">{checkList.length}</span>을 선택하셨어요. <span className="pinkText">보정요청 갯수 {this.state.customAbleCount - checkList.length}장 남음</span></p>
                </div>
            );
        }

        return (
            <div className="photo-page" key="photo-page" >
                <div className="progress-title">
                    <h3 className="h4-sub" data-count={originMaxCnt}>원본사진</h3 >
                    <p className="h5-caption text-normal">{titleMsg}</p>
                </div>
                {content}
            </div>
        );
    }
}

export default StatusUpload_backup_20180530;
