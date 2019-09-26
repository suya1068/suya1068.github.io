import "../pop_common.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import API from "forsnap-api";
import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import ImageController from "desktop/resources/components/image/image_controller";
import Buttons from "desktop/resources/components/button/Buttons";
import ImageCheck from "desktop/resources/components/image/ImageCheckXHR";

class UploadPhotos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            files: [],
            loadImages: [],
            offset: 0,
            limit: 9999,
            checkList: [],
            isProcess: false,
            isUpload: false,
            isLoadImage: false,
            uploadInfo: undefined
        };

        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.uploadPhoto = this.uploadPhoto.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.checkImage = this.checkImage.bind(this);
        this.allCheckImage = this.allCheckImage.bind(this);
        this.deletePhotos = this.deletePhotos.bind(this);
        this.addFileList = this.addFileList.bind(this);
    }

    componentWillMount() {
        ImageController.setMaxThread(1);
    }

    componentDidMount() {
        this.apiReservePhotosOrigin();
    }

    componentWillUnmount() {
    }

    onDragEnter(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    onDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    // 이미지 드롭시 파일 업로드
    onDrop(e) {
        e.stopPropagation();
        e.preventDefault();

        const dt = e.dataTransfer;

        this.addFileList(dt.files);
    }

    // 이미지 목록 스크롤처리 (바닥에 다을시 더 불러오기
    onScroll(e) {
        if (e && e.currentTarget) {
            const current = e.currentTarget;
            const scrollTop = current.scrollTop;
            const scrollHeight = current.scrollHeight;
            const height = current.offsetHeight;
            if (scrollTop === (scrollHeight - height)) {
                this.apiReservePhotosOrigin();
            }
        }
    }

    // 원본이미지 목록 불러오기
    apiReservePhotosOrigin() {
        const data = this.props.data;
        const buyNo = data.buyNo;
        const productNo = data.productNo;
        const userType = this.props.userType;
        const offset = this.state.offset;
        const limit = this.state.limit;

        API.reservations.reservePhotosOrigin(buyNo, productNo, userType, offset, limit)
            .then(response => {
                // console.log("PHOTO ORIGIN : ", response);
                const resData = response.data;
                const dataList = resData.list;
                const length = dataList.length;

                this.state.uploadInfo = resData.upload_info;

                if (length > 0) {
                    this.setState({
                        list: dataList
                    });
                }
            });
    }

    // API 원본 이미지 업로드 완료
    apiReserveCompletePhotoOrigin() {
        const data = this.props.data;
        const buyNo = data.buyNo;
        const productNo = data.productNo;
        const objData = {
            product_no: productNo
        };

        API.reservations.reserveCompletePhotoOrigin(buyNo, objData)
            .then(response => {
                if (response.status === 200) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: "고객님께 사진을 전달했습니다."
                    });

                    if (typeof data.onClose === "function") {
                        data.onClose();
                    }
                }
            })
            .catch(error => {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: utils.linebreak(error.data)
                });
            });
    }

    // API 원본 이미지 삭제
    apiReserveDeletePhotoOrigin(checkList) {
        const data = this.props.data;
        const buyNo = data.buyNo;
        const productNo = data.productNo;
        const photoNo = checkList.toString();

        API.reservations.reserveDeletePhotoOrigin(buyNo, photoNo, productNo)
            .then(response => {
                // console.log("PHOTO DELETE : ", response);
                const list = this.state.list;
                const updateList = list.reduce((result, obj) => {
                    const index = checkList.indexOf(obj.photo_no);

                    if (index !== -1) {
                        checkList.splice(index, 1);
                    } else {
                        result.push(obj);
                    }

                    return result;
                }, []);

                this.setState({
                    list: updateList,
                    checkList: [],
                    isProcess: false
                }, () => {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: "삭제되었습니다."
                    });
                });
            });
    }

    // 원본 이미지 업로드
    uploadPhoto(e) {
        const current = e.currentTarget;
        this.addFileList(current.files);
    }

    // 파일업로드 파일 추가
    addFileList(files) {
        const data = this.props.data;
        const listLength = this.state.list.length;
        const limit = (Number(data.max_cut_cnt) || 9999) - (listLength + this.state.files.length);

        if (files && files.length > 0) {
            if (files.length > limit) {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: utils.linebreak(`업로드 할 수 있는 사진 수를 넘겼습니다.\n남은 장수는 ${limit}장입니다`)
                });
            } else {
                let isExt = false;
                let count = 0;

                for (let i = 0; i < files.length; i += 1) {
                    const file = files.item(i);
                    const ext = utils.fileExtension(file.name);

                    if ((/(jpg|jpeg|png|bmp)$/i).test(ext)) {
                        this.state.files.push(file);
                        count += 1;
                    } else {
                        isExt = true;
                    }
                }

                if (isExt) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak("파일 업로드는\nJPG, JPEG, PNG, BMP 확장자만 가능합니다.")
                    });
                }

                if (!this.state.isUpload) {
                    if (count > 0) {
                        this.state.isUpload = true;
                        this.uploadProcess(this.state.files.length);
                    }
                }
            }
        }
    }

    // 이미지 업로드 처리
    uploadProcess(length) {
        const files = this.state.files;
        const isUpload = this.state.isUpload;

        Modal.show({
            type: MODAL_TYPE.PROGRESS_BAR,
            count: length - files.length,
            total: length
        });

        if (files !== null && files.length > 0 && isUpload) {
            const uploadInfo = this.state.uploadInfo;
            const data = this.props.data;
            const buyNo = data.buyNo;
            const productNo = data.productNo;
            const file = files[0];
            const form = new FormData();

            if (uploadInfo) {
                const uploadKey = `${uploadInfo.key}${utils.uniqId()}.${utils.fileExtension(file.name)}`;

                form.append("key", uploadKey);
                form.append("acl", uploadInfo.acl);
                form.append("policy", uploadInfo.policy);
                form.append("X-Amz-Credential", uploadInfo["X-Amz-Credential"]);
                form.append("X-Amz-Algorithm", uploadInfo["X-Amz-Algorithm"]);
                form.append("X-Amz-Date", uploadInfo["X-Amz-Date"]);
                form.append("X-Amz-Signature", uploadInfo["X-Amz-Signature"]);
                form.append("file", file);

                API.common.uploadS3(uploadInfo.action, form)
                    .then(res => {
                        API.reservations.reserveUploadOrigin(buyNo, { product_no: productNo, file_name: file.name, key: uploadKey })
                            .then(response => {
                                // console.log("UPLOAD PHOTO : ", response);
                                if (response.status === 200) {
                                    const resData = response.data;
                                    const { list } = this.state;

                                    if (resData.session_info !== undefined) {
                                        delete resData.session_info;
                                    }

                                    this.state.files.shift();
                                    list.push(resData);

                                    this.setState({
                                        list
                                    });

                                    this.uploadProcess(length);
                                }
                            })
                            .catch(error => {
                                Modal.show({
                                    type: MODAL_TYPE.ALERT,
                                    name: "upload-photo-error",
                                    content: utils.linebreak(error.data)
                                });
                                this.state.files.shift();
                                this.uploadProcess(length - 1);
                            });
                    })
                    .catch(error => {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            name: "upload-photo-error",
                            content: utils.linebreak("이미지 업로드중 오류가 발생했습니다.\n잠시후 다시 시도해주세요.\n계속 오류가 발생하면 고객센터로 문의해주세요.")
                        });
                        this.state.files.shift();
                        this.uploadProcess(length - 1);
                    });
            }
        } else {
            this.state.isUpload = false;
            setTimeout(() => {
                Modal.close(MODAL_TYPE.PROGRESS_BAR);
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "업로드가 완료되었습니다."
                });
            }, 500);
        }
    }

    // 업로드 완료 함수
    completeUpload() {
        const data = this.props.data;

        Modal.show({
            type: MODAL_TYPE.CONFIRM,
            content: "업로드된 사진을 고객님께 전달하겠습니까?",
            onSubmit: () => {
                if (this.state.list.length < data.min_cut_cnt) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: "원본사진이 최소컷수보다 작게 업로드되었습니다."
                    });
                } else {
                    this.apiReserveCompletePhotoOrigin();
                }
            }
        });
    }

    // 이미지 체크
    checkImage(checked, obj) {
        const checkList = this.state.checkList;
        const photoNo = obj.photo_no;
        const index = checkList.indexOf(photoNo);

        if (checked && index === -1) {
            checkList.push(photoNo);
        } else if (!checked && index !== -1) {
            checkList.splice(index, 1);
        }

        this.setState({
            checkList
        });
    }

    /**
     * 이미지 전체선택/해제
     */
    allCheckImage() {
        const checkList = this.state.checkList;
        const props = {};

        if (checkList.length > 0) {
            props.checkList = [];
        } else {
            props.checkList = this.state.list.reduce((result, obj) => {
                result.push(obj.photo_no);
                return result;
            }, []);
        }

        this.setState(props);
    }

    // 이미지 삭제
    deletePhotos() {
        const checkList = this.state.checkList;
        const isProcess = this.state.isProcess;

        if (checkList.length > 0 && !isProcess) {
            Modal.show({
                type: MODAL_TYPE.CONFIRM,
                content: "선택된 사진을 삭제하시겠습니까?",
                onSubmit: () => {
                    this.state.isProcess = true;
                    this.apiReserveDeletePhotoOrigin(checkList);
                }
            });
        }
    }

    // 원본 이미지 목록 그리기
    createPhotoImage() {
        const list = this.state.list;
        const checkList = this.state.checkList;

        if (list.length > 0) {
            return (
                list.map((obj, i) => {
                    const checked = checkList.indexOf(obj.photo_no);
                    return (
                        <li key={`photo-no-${obj.photo_no}`}>
                            <ImageCheck image={{ src: `/${obj.thumb_key}`, type: "private", content_width: 90, content_height: 90 }} checked={(checked !== -1)} resultFunc={chk => this.checkImage(chk, obj)} />
                            {/*<ImageCheck image={{ src: obj.originData, type: "base64", width: obj.width, height: obj.height }} checked={(checked !== -1)} size="small" resultFunc={chk => this.checkImage(chk, obj)} />*/}
                        </li>
                    );
                })
            );
        }

        return (
            <li className="empty-cpation">
                <h6 className="h6-sub">파일 올리기도 손쉽게!</h6>
                <p className="h6-caption-sub">파일을 여기에 끌어다 놓으면 파일 올리기가 바로 시작됩니다.</p>
            </li>
        );
    }

    render() {
        const data = this.props.data;
        const { list, checkList } = this.state;
        const length = list.length;
        const isEmpty = (length < 1);
        const isChecked = checkList.length > 0;

        return (
            <div className="pop-upload-photos">
                <input className="photos-uploadfile" type="file" multiple="multiple" accept="image/jpeg, image/png, image/bmp" name="origin_img" id="upload_photos" onChange={this.uploadPhoto} />
                <div className="photos-title">
                    <p>
                        <strong>업로드</strong>된 사진
                        <span>
                            <strong>원본사진 {Number(data.max_cut_cnt) ? `${utils.format.price(data.min_cut_cnt)} ~ ${utils.format.price(data.max_cut_cnt)}` : utils.format.price(data.min_cut_cnt)} 중 {utils.format.price(length)}장</strong>이 업로드 되었습니다.
                        </span>
                    </p>
                </div>
                <div className={classNames("photos-list", isEmpty ? "empty-list" : "")} onDrop={this.onDrop} onDragEnter={this.onDragEnter} onDragOver={this.onDragOver}>
                    <ul>
                        {this.createPhotoImage()}
                    </ul>
                </div>
                <div className="photos-caption">
                    {"사진은 한 장당 최대 50mb까지 업로드 가능합니다. 업로드가 불가능 한 경우 이메일, 웹하드 등을 이용하여 전달하신 후 \"외부업로드\" 기능을 통해 다음 단계로 진행 가능합니다."}
                </div>
                <div className="photos-buttons">
                    <Buttons buttonStyle={{ shape: "circle", theme: "default" }} inline={{ className: "btn-all-check", onClick: this.allCheckImage }}>{isChecked ? "전체 선택 해제" : "전체 선택"}</Buttons>
                    <Buttons buttonStyle={{ shape: "circle", theme: "default" }} inline={{ className: "btn-delete-photo", onClick: this.deletePhotos }}>선택 삭제</Buttons>
                    <Buttons buttonStyle={{ shape: "circle", theme: "default" }} inline={{ className: "btn-add-photo", onClick: () => document.getElementById("upload_photos").click() }}>추가하기</Buttons>
                    <Buttons buttonStyle={{ shape: "circle", theme: "pink" }} inline={{ className: "btn-complete", onClick: () => this.completeUpload() }}>변경사항 저장하기</Buttons>
                </div>
            </div>
        );
    }
}

UploadPhotos.propTypes = {
    data: PropTypes.shape([PropTypes.node]),
    userType: PropTypes.oneOf(["U", "A"]).isRequired
};

export default UploadPhotos;
