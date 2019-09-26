import "./registPortfolio.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";
import API from "forsnap-api";
import { routerShape } from "react-router";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import PopModal from "shared/components/modal/PopModal";
import ImageCheck from "desktop/resources/components/image/ImageCheckXHR";

import Buttons from "desktop/resources/components/button/Buttons";
import Input from "desktop/resources/components/form/Input";

export default class RegistPortfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list || [],
            user: props.user,
            portfolio_no: props.portfolio_no,
            upload_info: props.upload_info,
            files: [],
            isUpload: false,
            isProcess: false,
            selectImages: [],
            upload_max: 100,
            dragNo: "",
            is_change_order: false
        };
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.addFileList = this.addFileList.bind(this);
        this.uploadPortfolio = this.uploadPortfolio.bind(this);
        this.uploadProcess = this.uploadProcess.bind(this);
        this.uploadS3 = this.uploadS3.bind(this);
        this.createPortfolioImage = this.createPortfolioImage.bind(this);
        this.selectImages = this.selectImages.bind(this);
        this.selectAllImages = this.selectAllImages.bind(this);
        this.deletePortfolioProcess = this.deletePortfolioProcess.bind(this);
        this.deletePortfolioImage = this.deletePortfolioImage.bind(this);
        this.deletePortfolioProcess = this.deletePortfolioProcess.bind(this);
        this.completeProduct = this.completeProduct.bind(this);
        this.complete = this.complete.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
            this.setState({ ...nextProps });
        }
    }

    /**
     * 파일 드래그 시작
     * @param e
     */
    onDragEnter(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    /**
     * 파일 드랍
     * @param e
     */
    onDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    /**
     * 파일 드래그 중
     * @param e
     */
    onDrop(e) {
        e.stopPropagation();
        e.preventDefault();

        const dt = e.dataTransfer;
        const files = dt.files;

        const valid = this.checkListCount(files);
        if (valid) {
            this.addFileList(files);
        }
    }

    // 삭제할 이미지 선택
    selectImages(photoNo, checked) {
        const selectImages = this.state.selectImages;

        if (checked) {
            selectImages.push(photoNo);
        } else {
            const index = selectImages.indexOf(photoNo);
            selectImages.splice(index, 1);
        }

        if (!this._calledComponentWillUnmount) {
            this.setState({
                selectImages
            });
        }
    }

    // 포트폴리오 이미지 삭제
    deletePortfolioImage() {
        if (this.state.selectImages.length > 0) {
            if (!this.state.isProcess) {
                this.state.isProcess = true;
                Modal.show({
                    type: MODAL_TYPE.PROGRESS
                });
                this.deletePortfolioProcess();
            } else {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "포트폴리오 이미지를 삭제중입니다"
                });
            }
        } else {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "삭제할 포트폴리오 이미지를 선택해주세요"
            });
        }
    }

    // 이미지 삭제 처리
    deletePortfolioProcess() {
        const { selectImages, list, user, portfolio_no } = this.state;

        if (selectImages !== null && selectImages.length > 0) {
            const photoNo = selectImages.splice(0, 1).toString();

            API.offers.deleteEstimatePortfolioPhotos(user.id, portfolio_no, photoNo)
                .then(response => {
                    if (response.status === 200) {
                        const index = list.findIndex(obj => (obj.photo_no === photoNo));
                        if (index !== -1) {
                            list.splice(index, 1);
                        }

                        this.setState({
                            list,
                            selectImages
                        }, () => {
                            if (selectImages.length < 1) {
                                this.state.isProcess = false;
                                Modal.close(MODAL_TYPE.PROGRESS);
                                Modal.show({
                                    type: MODAL_TYPE.ALERT,
                                    content: "삭제되었습니다."
                                });
                            } else {
                                this.deletePortfolioProcess();
                            }
                        });
                    }
                })
                .catch(error => {
                    this.setState({
                        selectItems: [],
                        isProcess: false
                    }, () => {
                        Modal.close(MODAL_TYPE.PROGRESS);
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: utils.linebreak(error.data)
                        });
                    });
                });
        }
    }
    /**
     * 이미지 전체선택
     */
    selectAllImages() {
        const selectImages = this.state.selectImages;
        const props = {};

        if (selectImages.length > 0) {
            props.selectImages = [];
        } else {
            props.selectImages = this.state.list.reduce((result, obj) => {
                result.push(obj.photo_no);
                return result;
            }, []);
        }

        if (!this._calledComponentWillUnmount) {
            this.setState(props);
        }
    }

    /**
     * 포트폴리오를 업로드한다.
     */
    uploadPortfolio(e) {
        const current = e.currentTarget;
        const files = current.files;
        const valid = this.checkListCount(files);
        if (valid) {
            this.addFileList(files);
        }
    }


    /**
     * 체크된 파일 갯수
     * @params files
     */
    checkListCount(files) {
        const { list, upload_max } = this.state;
        const portfolio_count = list.length + files.length;
        let flag = false;
        let message = "";

        if (list.length === upload_max) {
            message = "업로드 가능개수를 초과하였습니다.";
        } else if (portfolio_count > upload_max) {
            message = `업로드 가능개수를 초과하였습니다.\n 업로드 가능 개수 : ${upload_max - list.length}장`;
        } else {
            flag = true;
        }

        if (message) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(message)
            });
        }

        return flag;
    }

    /**
     * 업로드 파일 추가
     */
    addFileList(files) {
        const { upload_max } = this.state;
        if (files && files.length > 0) {
            let isExt = false;
            const pushFiles = [];

            for (let i = 0; i < files.length; i += 1) {
                const file = files.item(i);
                if (file && file.name) {
                    const ext = utils.fileExtension(file.name);

                    if ((/(jpg|jpeg|png|bmp)$/i).test(ext)) {
                        pushFiles.push(file);
                    } else {
                        isExt = true;
                    }
                }
            }

            if (isExt) {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: utils.linebreak("파일 업로드는\nJPG, JPEG, PNG, BMP 확장자만 가능합니다.")
                });
            }

            const test = this.state.files.concat(pushFiles);
            this.setState({
                files: test
            }, () => {
                if (!this.state.isUpload) {
                    if (pushFiles.length > 0) {
                        this.state.isUpload = true;
                        this.uploadProcess(this.state.files.length);
                    }
                }
            });
        }
    }

    /**
     * 이미지 업로드 처리
     */
    uploadProcess(length) {
        const { files, portfolio_no, user, upload_info } = this.state;

        PopModal.progressCount(length - files.length, length);

        if (files !== null && files.length > 0 && this.state.isUpload) {
            const uploadInfo = upload_info;
            const file = files[0];

            if (uploadInfo && file && file.name) {
                const uploadKey = `${uploadInfo.key}${utils.uniqId()}.${utils.fileExtension(file.name)}`;

                this.uploadS3(file, uploadKey)
                    .then(res => {
                        API.offers.registEstimatePortfolio(user.id, portfolio_no, { file_name: file.name, key: uploadKey })
                            .then(response => {
                                if (response.status === 200) {
                                    const responseData = response.data;

                                    if (responseData.session_info) {
                                        delete responseData.session_info;
                                    }

                                    if (responseData.upload_info) {
                                        delete responseData.upload_info;
                                    }

                                    this.state.files.shift();
                                    this.uploadProcess(length);
                                    if (!this._calledComponentWillUnmount) {
                                        this.setState({
                                            list: this.state.list.concat(responseData)
                                        });
                                    }
                                }
                            })
                            .catch(error => {
                                if (error instanceof Error) {
                                    this.state.files = [];
                                    this.state.isUpload = false;
                                    PopModal.closeProgressCount();
                                    Modal.show({
                                        type: MODAL_TYPE.ALERT,
                                        content: utils.linebreak("이미지 업로드중 오류가 발생했습니다.\n잠시후 다시 시도해주세요.\n계속 오류가 발생하면 고객센터로 문의해주세요")
                                    });
                                } else {
                                    this.state.files.shift();
                                    // this.state.files = [];
                                    // this.state.isUpload = false;
                                    // PopModal.closeProgressCount();
                                    Modal.show({
                                        type: MODAL_TYPE.ALERT,
                                        content: utils.linebreak(error.data),
                                        onClose: () => this.uploadProcess(length - 1)
                                    });
                                }
                            });
                    })
                    .catch(error => {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: utils.linebreak("이미지 업로드중 오류가 발생했습니다.\n잠시후 다시 시도해주세요.\n계속 오류가 발생하면 고객센터로 문의해주세요")
                        });
                    });
            }
        } else {
            this.state.isUpload = false;
            setTimeout(() => {
                PopModal.closeProgressCount();
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "업로드가 완료되었습니다"
                });
            }, 500);
        }
    }

    getChangeDisplayOrder() {
        return this.state.is_change_order;
    }

    getPhotoList() {
        return this.state.list;
    }

    /**
     * 사진 순서 드래그 시작
     */
    onPortfolioDragStart(index) {
        this.state.dragNo = index;
    }

    /**
     * 사진 순서 드랍
     */
    onPortfolioDrop(index) {
        const { dragNo } = this.state;

        this.changeDisplayOrder(dragNo, index);
    }

    /**
     * 포트폴리오 노출 순서 변경
     */
    changeDisplayOrder(target, index) {
        if (typeof target !== "number"
            || typeof index !== "number") {
            return;
        }
        const portfolioList = this.state.list;
        const item = portfolioList.splice(target, 1);
        if (utils.isArray(item)) {
            portfolioList.splice(index, 0, item[0]);
        }

        this.setState({
            list: this.combinePhotoList(portfolioList),
            dragNo: "",
            is_change_order: true
        });
    }

    combinePhotoList(list) {
        let result = null;
        if (list.length > 0) {
            result = list.reduce((rs, p, i) => {
                rs.push({
                    portfolio_no: p.portfolio_no,
                    display_order: i + 1,
                    file_name: p.file_name,
                    photo: p.photo,
                    thumb_key: p.thumb_key,
                    width: p.width,
                    height: p.height,
                    photo_no: p.photo_no
                });
                return rs;
            }, []);
        }

        return result;
    }

    /**
     * S3에 파일 업로드
     */
    uploadS3(file, uploadKey) {
        const form = new FormData();
        const uploadInfo = this.state.upload_info;

        form.append("key", uploadKey);
        form.append("acl", uploadInfo.acl);
        form.append("policy", uploadInfo.policy);
        form.append("X-Amz-Credential", uploadInfo["X-Amz-Credential"]);
        form.append("X-Amz-Algorithm", uploadInfo["X-Amz-Algorithm"]);
        form.append("X-Amz-Date", uploadInfo["X-Amz-Date"]);
        form.append("X-Amz-Signature", uploadInfo["X-Amz-Signature"]);
        form.append("file", file);

        return API.common.uploadS3(uploadInfo.action, form);
    }

    /**
     * 포트폴리오 이미지 렌더링
     */
    createPortfolioImage() {
        const list = this.state.list;
        const selectImages = this.state.selectImages;

        if (list.length > 0) {
            return (
                list.map((img, i) => {
                    const checked = selectImages.indexOf(img.photo_no);
                    return (
                        <li
                            key={`portfolio-no-${i}`}
                            style={{ cursor: "pointer" }}
                            onDragStart={() => this.onPortfolioDragStart(i)}
                            onDrop={() => this.onPortfolioDrop(i)}
                        >
                            <ImageCheck image={{ src: `/${img.thumb_key}`, type: "private", content_width: 90, content_height: 90 }} size="small" checked={(checked !== -1)} resultFunc={value => this.selectImages(img.photo_no, value)} />
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

    routerMoveList() {
        const router = this.context.router;
        router.push("/artists/product/portfolio");
        window.scrollTo(0, 0);
    }

    // 상품등록 완료
    completeProduct() {
        const { list } = this.state;
        if (["VIDEO", "VIDEO_BIZ"].indexOf(this.props.category_code) === -1 && list.length < 5) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "포트폴리오는 5개 이상 등록해야 합니다"
            });
        } else {
            Modal.close(MODAL_TYPE.PROGRESS);
            this.routerMoveList();
        }
    }

    completeUpdate() {
        return this.routerMoveList();
    }

    validate() {
        const { list } = this.state;
        let message = "";
        if (["VIDEO", "VIDEO_BIZ"].indexOf(this.props.category_code) === -1 && list.length < 5) {
            message = "포트폴리오는 5개 이상 등록해야 합니다.";
        }

        return message;
    }

    complete() {
        const { list } = this.state;
        if (["VIDEO", "VIDEO_BIZ"].indexOf(this.props.category_code) === -1 && list.length < 5) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "포트폴리오는 5개 이상 등록해야 합니다"
            });
        } else if (typeof this.props.completeFunc === "function") {
            Modal.close(MODAL_TYPE.PROGRESS);
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "변경되었습니다"
            });

            this.props.completeFunc(this.routerMoveList());
        }
    }

    render() {
        const { list, selectImages } = this.state;
        const isEmpty = list.length < 1;
        const isChecked = selectImages.length > 0;
        return (
            <div className="regist-portfolio-page">
                <Input inline={{ type: "file", multiple: "multiple", accept: "image/jpeg, image/png, image/bmp", name: "portfolio_img", id: "upload_portfolio", className: "product-imagefile", onChange: this.uploadPortfolio }} />
                <h5 className="portfolio-title h6-sub" style={{ position: "relative" }}>
                    {/*<Icon name="check_s" />*/}
                    포트폴리오 업로드
                    <div className="portfolio-count" style={{ position: "absolute", right: 0, bottom: 15 }}>
                        <span>{list.length}</span><span>{" / 100"}</span>
                    </div>
                </h5>
                <ul
                    className={classNames("portfolio-list", (isEmpty ? "empty-list" : ""))}
                    onDrop={this.onDrop}
                    onDragEnter={this.onDragEnter}
                    onDragOver={this.onDragOver}
                >
                    {this.createPortfolioImage()}
                </ul>
                <div className="portfolio-info">
                    <p><strong>사진 {list.length}장</strong>이 업로드 되었습니다</p>
                    <div className="portfolio-buttons">
                        <Buttons buttonStyle={{ size: "small", theme: "bg-lightgray" }} inline={{ onClick: this.selectAllImages }}>{isChecked ? "전체 해제" : "전체 선택"}</Buttons>
                        <Buttons buttonStyle={{ size: "small", theme: "bg-lightgray" }} inline={{ onClick: this.deletePortfolioImage }}>선택 삭제</Buttons>
                        <Buttons buttonStyle={{ size: "small", theme: "bg-lightgray" }} inline={{ onClick: () => document.getElementById("upload_portfolio").click() }}>사진 추가하기</Buttons>
                    </div>
                </div>
            </div>
        );
    }
}

RegistPortfolio.contextTypes = {
    router: routerShape
};

RegistPortfolio.propTypes = {
};

RegistPortfolio.defaultProps = {
};
