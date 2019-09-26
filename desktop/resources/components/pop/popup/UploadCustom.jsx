import React, { Component, PropTypes } from "react";
import update from "immutability-helper";
import classNames from "classnames";

import API from "forsnap-api";
import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import ImageController from "desktop/resources/components/image/image_controller";
import Buttons from "desktop/resources/components/button/Buttons";
import Img from "desktop/resources/components/image/Img";

class UploadCustom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            files: [],
            loadImages: [],
            offset: 0,
            limit: 9999,
            customLength: 0,
            isProcess: false,
            isUpload: false,
            isLoadImage: false,
            uploadInfo: undefined
        };

        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.uploadPhotos = this.uploadPhotos.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.addFileList = this.addFileList.bind(this);
    }

    componentWillMount() {
        ImageController.setMaxThread(1);
    }

    componentDidMount() {
        this.apiReservePhotosCustom();
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
                this.apiReservePhotosCustom();
            }
        }
    }

    /**
     * API 보정요청 목록
     */
    apiReservePhotosCustom() {
        const data = this.props.data;
        const buyNo = data.buyNo;
        const productNo = data.productNo;
        const userType = this.props.userType;
        const offset = this.state.offset;
        const limit = this.state.limit;

        API.reservations.reservePhotosCustom(buyNo, productNo, userType, offset, limit)
            .then(response => {
                // console.log(response);
                const resData = response.data;
                const dataList = resData.list;
                const length = dataList.length;

                this.state.uploadInfo = resData.upload_info;
                if (length > 0) {
                    const obj = utils.mergeArrayTypeObject(this.state.list, dataList, ["origin_no", "custom_no"], ["origin_no", "custom_no"]);
                    this.state.offset = offset + obj.count;

                    this.setState({
                        list: update(this.state.list, { $set: obj.list })
                    });
                    // this.state.loadImages = dataList;
                    // this.state.isLoadImage = true;
                    // if (dataList.length > 0) {
                    //     this.loadOriginImage(this.state.isUpload, this.state.loadImages.length);
                    // }
                }
            })
            .catch(error => {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: utils.linebreak(error.data)
                });
            });
    }

    // API 보정 완료 처리
    apiReserveCompletePhotoCustom() {
        const data = this.props.data;
        const buyNo = data.buyNo;
        const productNo = data.productNo;
        const objData = {
            product_no: productNo
        };

        API.reservations.reserveCompletePhotoCustom(buyNo, objData)
            .then(response => {
                if (response.status === 200) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: "고객님께 보정사진을 전달했습니다."
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

    // 원본 이미지 업로드
    uploadPhotos(e) {
        const current = e.currentTarget;
        this.addFileList(current.files);
    }

    // 파일업로드 파일 추가
    addFileList(files) {
        if (files && files.length > 0) {
            const pushFiles = [];
            let isExt = false;

            for (let i = 0; i < files.length; i += 1) {
                const file = files.item(i);
                const ext = utils.fileExtension(file.name);

                if ((/(jpg|jpeg|png|bmp)$/i).test(ext)) {
                    pushFiles.push(files.item(i));
                } else {
                    isExt = true;
                }
            }

            if (isExt) {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "파일 업로드는\nJPG, JPEG, PNG, BMP 확장자만 가능합니다."
                });
            }

            this.state.files = update(this.state.files, { $push: pushFiles });
            if (!this.state.isUpload) {
                if (pushFiles.length > 0) {
                    this.state.isUpload = true;
                    this.uploadProcess(this.state.files.length);
                }
            }
        }
    }

    // 이미지 업로드 처리
    uploadProcess(length) {
        const form = new FormData();
        const files = this.state.files;

        Modal.show({
            type: MODAL_TYPE.PROGRESS_BAR,
            count: length - files.length,
            total: length
        });

        if (files !== null && files.length > 0 && this.state.isUpload) {
            const uploadInfo = this.state.uploadInfo;
            const data = this.props.data;
            const buyNo = data.buyNo;
            const productNo = data.productNo;
            const file = files[0];

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
                        API.reservations.reserveUploadCustom(buyNo, { product_no: productNo, file_name: file.name, key: uploadKey })
                            .then(response => {
                                // console.log("UPLOAD : ", response);
                                if (response.status === 200) {
                                    const resData = response.data;
                                    const custom = {
                                        custom_no: resData.custom_no,
                                        custom_photo_type: resData.custom_photo_type,
                                        custom_thumb_key: resData.thumb_key
                                    };

                                    const index = this.state.list.findIndex(obj => {
                                        return obj.custom_no === resData.custom_no;
                                    });

                                    this.state.files.shift();
                                    this.uploadProcess(length);
                                    this.setState({
                                        list: update(this.state.list, { [index]: { $merge: custom } })
                                    });

                                    // this.state.loadImages = update(this.state.loadImages, { $push: [resData] });
                                    //
                                    // if (!this.state.isLoadImage) {
                                    //     this.state.isLoadImage = true;
                                    //     this.loadOriginImage(true, this.state.loadImages.length);
                                    // }
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
    completeCustom() {
        const data = this.props.data;
        Modal.show({
            type: MODAL_TYPE.CONFIRM,
            content: "업로드된 보정사진을 고객님께 전달하겠습니까?",
            onSubmit: () => {
                const customLength = this.state.list.reduce((result, obj) => {
                    if (obj.custom_photo_type !== "REQ_CUSTOM") {
                        result += 1;
                    }

                    return result;
                }, 0);

                if (customLength < data.custom_cnt) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: `보정사진 ${data.custom_cnt - customLength}장을 더 올려주세요.`
                    });
                } else {
                    this.apiReserveCompletePhotoCustom();
                }
            }
        });
    }

    // 보정요청 목록 그리기
    createCustomImage() {
        const list = this.state.list;

        if (list.length > 0) {
            return (
                list.map((obj, i) => {
                    const fullName = obj.file_name;
                    const index = fullName.lastIndexOf(".");
                    const fileName = fullName.substr(0, index);
                    const ext = fullName.substr(index + 1).toUpperCase();
                    return (
                        <li key={`photo-origin-no-${obj.origin_no}`}>
                            <div className="photo-origin">
                                <Img image={{ src: `/${obj.origin_thumb_key}`, type: "private", content_width: 90, content_height: 90 }} />
                            </div>
                            <div className={classNames("photo-custom none", obj.custom_photo_type === "REQ_CUSTOM" ? "none" : "")}>
                                {obj.custom_photo_type === "REQ_CUSTOM"
                                    ?
                                        <div className="photo-file">
                                            <span className="photo-file-ext">{ext.toUpperCase()}</span>
                                            <span className="photo-file-name">{fileName}</span>
                                        </div>
                                    :
                                        <Img image={{ src: `/${obj.custom_thumb_key}`, type: "private", content_width: 90, content_height: 90 }} />
                                }
                            </div>
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
        const listLength = this.state.list.length;
        const isCustom = (listLength < 1);
        const customLength = this.state.list.reduce((result, obj) => {
            if (obj.custom_photo_type !== "REQ_CUSTOM") {
                result += 1;
            }

            return result;
        }, 0);

        return (
            <div className="pop-upload-photos custom-list">
                <input className="photos-uploadfile" type="file" multiple="multiple" accept="image/jpeg, image/png, image/bmp" name="custom_img" id="upload_photos" onChange={this.uploadPhotos} />
                <div className="photos-title">
                    <p><strong>보정요청</strong>된 사진<span><strong>보정요청 {data.custom_cnt}장</strong>중 <strong>{customLength}장</strong>이 업로드되었습니다.</span></p>
                </div>
                <div className={classNames("photos-list", (isCustom ? "empty-list" : ""))} onDrop={this.onDrop} onDragEnter={this.onDragEnter} onDragOver={this.onDragOver}>
                    <ul>
                        {this.createCustomImage()}
                    </ul>
                </div>
                <div className="photos-caption">
                    {"사진은 한 장당 최대 50mb까지 업로드 가능합니다. 업로드가 불가능 한 경우 이메일, 웹하드 등을 이용하여 전달하신 후 \"외부업로드\" 기능을 통해 다음 단계로 진행 가능합니다."}
                </div>
                <div className="photos-buttons">
                    <Buttons buttonStyle={{ shape: "circle", theme: "default" }} inline={{ className: "btn-add-photo", onClick: () => document.getElementById("upload_photos").click() }}>추가하기</Buttons>
                    <Buttons buttonStyle={{ shape: "circle", theme: "pink" }} inline={{ className: "btn-complete", onClick: () => this.completeCustom() }}>변경사항 저장하기</Buttons>
                </div>
            </div>
        );
    }
}

UploadCustom.propTypes = {
    data: PropTypes.shape([PropTypes.node]),
    userType: PropTypes.oneOf(["U", "A"]).isRequired
};

export default UploadCustom;
