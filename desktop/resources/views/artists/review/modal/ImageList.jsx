import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import UploadController from "shared/components/upload/UploadController";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import UploadItem from "shared/components/upload/components/UploadItem";

import Img from "desktop/resources/components/image/Img";
import ImageSizeChange from "./ImageSizeChange";

class ImageList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imageList: props.imageList.map(o => Object.assign({}, o)),
            uploadList: [],
            isMount: true,
            isProcess: false,
            dragNo: ""
        };

        this.onDrop = this.onDrop.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onImageReady = this.onImageReady.bind(this);
        this.onImageLoad = this.onImageLoad.bind(this);
        this.onImageAbort = this.onImageAbort.bind(this);
        this.onClickImage = this.onClickImage.bind(this);
        this.onPasteImage = this.onPasteImage.bind(this);

        this.setProcess = this.setProcess.bind(this);
        this.findFile = this.findFile.bind(this);
        this.addFile = this.addFile.bind(this);
        this.getImageLength = this.getImageLength.bind(this);

        this.layoutImage = this.layoutImage.bind(this);
    }

    componentWillMount() {
        UploadController.setMaxThread(1);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    // 이미지 드롭시 파일 업로드
    onDrop(e) {
        e.stopPropagation();
        e.preventDefault();

        const dt = e.dataTransfer;

        if (this.state.dragNo === "") {
            this.addFile(dt.files);
        }
    }

    onDragEnter(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    onDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    onImageReady(callBack) {
        const { upload_info } = this.props;

        return UploadController.addItem({
            uploadInfo: upload_info,
            ...callBack
        });
    }

    onImageLoad(result, data) {
        if (result && result.status && data) {
            const { insertSelfReviewImage } = this.props;
            const { file } = data;
            const params = {
                key: result.uploadKey,
                file_name: file.name
            };

            const request = insertSelfReviewImage(params);
            if (request) {
                request.then(res => {
                    this.setStateData(({ imageList, uploadList }) => {
                        const index = this.findFile(file.name, uploadList, true);

                        if (index !== -1) {
                            uploadList.splice(index, 1);
                        }

                        imageList.push(res);

                        return {
                            imageList,
                            uploadList
                        };
                    });
                });
            }
        }
    }

    onImageAbort(uid, fileName) {
        this.setStateData(({ uploadList }) => {
            if (utils.isArray(uploadList)) {
                const index = uploadList.findIndex(u => (u.file.name === fileName));
                uploadList.splice(index, 1);

                return {
                    uploadList
                };
            }

            return null;
        });
    }

    /**
     * 처리상태 변경
     * @param b
     */
    setProcess(b) {
        if (b) {
            this.state.isProcess = true;
            Modal.show({
                type: MODAL_TYPE.PROGRESS
            });
        } else {
            this.state.isProcess = false;
            Modal.close(MODAL_TYPE.PROGRESS);
        }
    }

    getImageLength() {
        const propLength = this.props.imageList.length;
        const stateLength = this.state.imageList.length;

        return propLength > stateLength ? propLength : stateLength;
    }

    findFile(fileName, data, isIndex) {
        let files;
        if (data) {
            files = data;
        } else {
            files = this.state.uploadList;
        }

        const index = files.findIndex(f => {
            return f.file.name === fileName;
        });

        if (index !== -1) {
            return isIndex ? index : files[index];
        }

        return null;
    }

    addFile(files) {
        const { uploadList } = this.state;

        if (files && files.length > 0) {
            let isExt = false;
            const names = [];

            for (let i = 0; i < files.length; i += 1) {
                const file = files.item(i);
                const ext = utils.fileExtension(file.name);

                if ((/(jpg|jpeg|png|bmp)$/i).test(ext)) {
                    if (!this.findFile(file.name, uploadList)) {
                        uploadList.push({
                            file
                        });
                    }
                } else {
                    names.push(file.name);
                    isExt = true;
                }
            }

            if (isExt) {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: utils.linebreak(`파일 업로드는\nJPG, JPEG, PNG, BMP 확장자만 가능합니다.\n\n${names.join("\n")}`)
                });
            }

            this.setStateData(() => {
                return {
                    uploadList
                };
            });
        }
    }

    onClickImage(data) {
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: (
                <ImageSizeChange
                    origin_width={data.origin_width}
                    origin_height={data.origin_height}
                    onConfirm={(width, height, type) => this.onPasteImage(Object.assign({}, data, { width, height, type }))}
                    onClose={() => Modal.close()}
                />
            )
        });
    }

    onPasteImage(data) {
        this.props.pasteImage(data);
        Modal.close();
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    layoutImage() {
        const { imageList, uploadList } = this.state;
        const isImage = utils.isArray(imageList);
        const isUpload = utils.isArray(uploadList);

        return (
            <div className={isImage || isUpload ? "package__border transparent" : "package__border package__border__dashed__trans"}>
                <div className="package__column portfolio__container" onDrop={this.onDrop} onDragEnter={this.onDragEnter} onDragOver={this.onDragOver}>
                    <input
                        className="portfolio__list__upload"
                        type="file"
                        multiple="multiple"
                        accept="image/jpeg, image/png, image/bmp"
                        onChange={e => this.addFile(e.currentTarget.files)}
                        ref={ref => (this.refImageUpload = ref)}
                    />
                    <div className="portfolio__list">
                        {isImage ?
                            imageList.map((o, i) => {
                                return (
                                    <div
                                        key={`portfolio-item-${o.key}`}
                                        className="portfolio__item"
                                        onClick={() => this.onClickImage(o)}
                                    >
                                        <div>
                                            <div>
                                                <Img image={{ src: o.path, content_width: 150, content_height: 150 }} />
                                                <div className="portfolio__overlay" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : null
                        }
                        {isUpload ?
                            uploadList.map(u => {
                                return (
                                    <div key={`portfolio-upload-item-${u.file.name}`} className="portfolio__item">
                                        <UploadItem
                                            data={u}
                                            onMount={this.onImageReady}
                                            onLoad={this.onImageLoad}
                                            onAbort={this.onImageAbort}
                                        />
                                    </div>
                                );
                            }) : null
                        }
                        <div className="portfolio__item upload__portfolio" onClick={() => this.refImageUpload.click()}>
                            <div>
                                <div className="upload__portfolio">
                                    <span>+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="self__review__image__list__modal">
                {this.layoutImage()}
                <div className="image__list__modal__buttons">
                    <button className="_button" onClick={() => Modal.close()}>닫기</button>
                </div>
            </div>
        );
    }
}

ImageList.propTypes = {
    imageList: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    upload_info: PropTypes.shape([PropTypes.node]),
    insertSelfReviewImage: PropTypes.func.isRequired,
    pasteImage: PropTypes.func.isRequired
};

export default ImageList;
