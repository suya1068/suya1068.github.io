import React, { Component, PropTypes } from "react";

import API from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";

import { STATE, CATEGORY_CODE } from "shared/constant/package.const";
import ProductObject from "shared/components/products/edit/ProductObject";
import UploadController from "shared/components/upload/UploadController";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import Img from "desktop/resources/components/image/Img";
import Icon from "desktop/resources/components/icon/Icon";

import UploadItem from "shared/components/upload/components/UploadItem";

class PackagePortfolio extends Component {
    constructor(props) {
        super(props);

        this.state = {
            [STATE.PORTFOLIO]: ProductObject.getState(STATE.PORTFOLIO),
            [STATE.THUMBNAIL]: ProductObject.getState(STATE.THUMBNAIL),
            uploadList: [],
            uploadThumb: null,
            limit: 100,
            autoThumbLimit: 4,
            isUnMount: false,
            isProcess: false,
            dragNo: ""
        };

        this.onDrop = this.onDrop.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onPortfolioReady = this.onPortfolioReady.bind(this);
        this.onPortfolioLoad = this.onPortfolioLoad.bind(this);
        this.onPortfolioAbort = this.onPortfolioAbort.bind(this);
        this.onThumbReady = this.onThumbReady.bind(this);
        this.onThumbLoad = this.onThumbLoad.bind(this);
        this.onPortfolioDragStart = this.onPortfolioDragStart.bind(this);
        this.onPortfolioDrop = this.onPortfolioDrop.bind(this);

        this.setProcess = this.setProcess.bind(this);
        this.findFile = this.findFile.bind(this);
        this.addFile = this.addFile.bind(this);
        this.uploadThumb = this.uploadThumb.bind(this);
        this.deletePortfolio = this.deletePortfolio.bind(this);
        this.changeDisplayOrder = this.changeDisplayOrder.bind(this);

        this.layoutPortfolio = this.layoutPortfolio.bind(this);
        this.layoutThumb = this.layoutThumb.bind(this);
        this.layoutAutoThumb = this.layoutAutoThumb.bind(this);
    }

    componentWillMount() {
        UploadController.setMaxThread(1);
    }

    componentDidMount() {
        const productNo = ProductObject.getState(STATE.PRODUCT_NO);
        const user = auth.getUser();

        if (user && productNo) {
            API.artists.getProductPortfolio(user.id, productNo).then(response => {
                if (response.status === 200) {
                    const data = response.data;

                    if (!this.state.isUnMount) {
                        this.setState({
                            ...ProductObject.setState(STATE.PORTFOLIO, data.list),
                            ...ProductObject.setState(STATE.THUMBNAIL, data.thumb_img),
                            ...ProductObject.setState(STATE.UPLOAD_INFO, data.upload_info)
                        });
                    }
                }
            }).catch(error => {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    name: "product-portfolio-error",
                    content: utils.linebreak("이미지 정보를 가져오지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.")
                });
            });
        }
    }

    componentWillUnmount() {
        this.state.isUnMount = true;
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

    onPortfolioReady(callBack) {
        const uploadInfo = this.state[STATE.UPLOAD_INFO];

        return UploadController.addItem({
            uploadInfo,
            ...callBack
        });
    }

    onPortfolioLoad(result, data) {
        if (result && result.status && data) {
            const { file, userId, productNo } = data;

            API.artists.uploadArtistPortfolio(userId, productNo, { key: result.uploadKey })
                .then(response => {
                    if (response.status === 200) {
                        const resData = response.data;

                        const { uploadList } = this.state;
                        const index = this.findFile(file.name, uploadList, true);

                        if (index !== -1) {
                            uploadList.splice(index, 1);
                        }

                        if (!this.state.isUnMount) {
                            this.setState({
                                ...ProductObject.setState(STATE.PORTFOLIO, resData.list),
                                uploadList
                            });
                        }
                    }
                })
                .catch(error => {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        name: "upload-portfolio-error",
                        content: utils.linebreak(error.data)
                    });
                });
        }
    }

    onPortfolioAbort(uid, fileName) {
        const { uploadList } = this.state;

        if (utils.isArray(uploadList)) {
            const index = uploadList.findIndex(u => (u.file.name === fileName));
            uploadList.splice(index, 1);
            if (!this.state.isUnMount) {
                this.setState({
                    uploadList
                });
            }
        }
    }

    onThumbReady(callBack) {
        const uploadInfo = this.state[STATE.UPLOAD_INFO];

        return UploadController.addPending({
            uploadInfo,
            ...callBack
        });
    }

    onThumbLoad(result, data) {
        if (result && result.status && data) {
            const { userId, productNo } = data;

            API.artists.uploadArtistThumb(userId, productNo, { key: result.uploadKey })
                .then(response => {
                    if (response.status === 200) {
                        const resData = response.data;

                        if (!this.state.isUnMount) {
                            this.setState({
                                uploadThumb: null,
                                ...ProductObject.setState(STATE.THUMBNAIL, resData.thumb_img)
                            });
                        }
                    }
                })
                .catch(error => {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        name: "upload-thumb-error",
                        content: utils.linebreak(error.data)
                    });
                });
        }
    }

    onPortfolioDragStart(index) {
        this.state.dragNo = index;
    }

    onPortfolioDrop(index) {
        const { dragNo } = this.state;

        this.changeDisplayOrder(dragNo, index);
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
        const { uploadList, limit } = this.state;
        const portfolioList = this.state[STATE.PORTFOLIO];
        const uploadInfo = this.state[STATE.UPLOAD_INFO];
        const productNo = ProductObject.getState(STATE.PRODUCT_NO);
        const limitCount = limit - portfolioList.length;
        const user = auth.getUser();

        if (user && productNo && uploadInfo && files && files.length > 0) {
            if (files.length > limitCount) {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: utils.linebreak(`업로드 할 수 있는 사진 수를 넘겼습니다.\n남은 장수는 ${limit}장입니다`)
                });
            } else {
                let isExt = false;
                const names = [];

                for (let i = 0; i < files.length; i += 1) {
                    const file = files.item(i);
                    const ext = utils.fileExtension(file.name);

                    if ((/(jpg|jpeg|png|bmp)$/i).test(ext)) {
                        if (!this.findFile(file.name, uploadList)) {
                            uploadList.push({
                                file,
                                userId: user.id,
                                productNo
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

                if (!this.state.isUnMount) {
                    this.setState({
                        uploadList
                    });
                }
            }
        }
    }

    uploadThumb(e) {
        const uploadInfo = this.state[STATE.UPLOAD_INFO];
        const productNo = ProductObject.getState(STATE.PRODUCT_NO);
        const user = auth.getUser();
        const target = e.currentTarget;
        const files = target.files;
        const file = files.item(0);

        if (user && productNo && uploadInfo && file) {
            const ext = utils.fileExtension(file.name);

            if ((/(jpg|jpeg|png|bmp)$/i).test(ext)) {
                if (!this.state.isUnMount) {
                    this.setState({
                        uploadThumb: {
                            file,
                            userId: user.id,
                            productNo
                        }
                    });
                }
            } else {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: utils.linebreak(`파일 업로드는\nJPG, JPEG, PNG, BMP 확장자만 가능합니다.\n\n${file.name}`)
                });
            }
        }
    }

    deletePortfolio(portfolioNo) {
        const productNo = ProductObject.getState(STATE.PRODUCT_NO);
        const user = auth.getUser();

        if (user && productNo && portfolioNo) {
            if (!this.state.isProcess) {
                this.setProcess(true);
                API.artists.deletePortfolio(user.id, productNo, portfolioNo).then(response => {
                    this.setProcess(false);
                    if (response.status === 200) {
                        const data = response.data;
                        if (!this.state.isUnMount) {
                            this.setState({
                                ...ProductObject.setState(STATE.PORTFOLIO, data.list || [])
                            });
                        }
                    }
                }).catch(error => {
                    this.setProcess(false);
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        name: "delete-portfolio-error",
                        content: utils.linebreak(error.data)
                    });
                });
            }
        }
    }

    changeDisplayOrder(target, index) {
        if (typeof target !== "number"
            || typeof index !== "number") {
            return;
        }
        const portfolioList = this.state[STATE.PORTFOLIO];
        const item = portfolioList.splice(target, 1);
        if (utils.isArray(item)) {
            portfolioList.splice(index, 0, item[0]);
        }

        this.setState({ ...ProductObject.setState(STATE.PORTFOLIO, portfolioList), dragNo: "" });
    }

    layoutPortfolio() {
        const { uploadList, limit } = this.state;
        const portfolioList = this.state[STATE.PORTFOLIO];
        const isPortfolio = utils.isArray(portfolioList);
        const isUpload = utils.isArray(uploadList);

        return (
            <div className={isPortfolio || isUpload ? "package__border transparent" : "package__border package__border__dashed__trans"}>
                <div className="package__column portfolio__container" onDrop={this.onDrop} onDragEnter={this.onDragEnter} onDragOver={this.onDragOver}>
                    <input
                        className="portfolio__list__upload"
                        type="file"
                        multiple="multiple"
                        accept="image/jpeg, image/png, image/bmp"
                        onChange={e => this.addFile(e.currentTarget.files)}
                        ref={ref => (this.refPortfolioUpload = ref)}
                    />
                    {!isPortfolio && !isUpload ?
                        <div className="portfolio__list__empty">
                            <img key="empty_image" alt="empty" src={`${__SERVER__.img}/common/none_visual.png`} style={{ marginBottom: "15px" }} />
                            <h2 key="empty_header" className="text__header">파일 올리기도 손쉽게!</h2>
                            <div key="empty_caption" className="caption__content"><span>파일을 여기에 끌어다 놓으면 파일 올리기가 바로 시작됩니다.</span></div>
                        </div> : null
                    }
                    <div className="portfolio__list">
                        {isPortfolio ?
                            portfolioList.map((p, i) => {
                                return (
                                    <div
                                        key={`portfolio-item-${p.portfolio_no}`}
                                        className="portfolio__item"
                                        draggable="true"
                                        onDragStart={() => this.onPortfolioDragStart(i)}
                                        onDragEnd={() => (this.state.dragNo = "")}
                                        onDrop={() => this.onPortfolioDrop(i)}
                                    >
                                        <div>
                                            <div>
                                                <Img image={{ src: p.portfolio_img, content_width: 90, content_height: 90 }} />
                                                <div className="portfolio__overlay" />
                                                <button className="f__button__close" onClick={() => this.deletePortfolio(p.portfolio_no)} />
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
                                            onMount={this.onPortfolioReady}
                                            onLoad={this.onPortfolioLoad}
                                            onAbort={this.onPortfolioAbort}
                                        />
                                    </div>
                                );
                            }) : null
                        }
                        {portfolioList && uploadList && (portfolioList.length + uploadList.length) < 100 ?
                            <div className="portfolio__item upload__portfolio" onClick={() => this.refPortfolioUpload.click()}>
                                <div>
                                    <div className="upload__portfolio">
                                        <span>+ {limit - (portfolioList.length + uploadList.length)}</span>
                                    </div>
                                </div>
                            </div> : null
                        }
                    </div>
                </div>
            </div>
        );
    }

    layoutThumb() {
        const { uploadThumb } = this.state;
        const thumbImg = this.state[STATE.THUMBNAIL];
        const content = [];

        if (uploadThumb) {
            content.push(
                <UploadItem
                    key={`upload-item-${uploadThumb.file.name}`}
                    data={uploadThumb}
                    onMount={this.onThumbReady}
                    onLoad={this.onThumbLoad}
                    onAbort={() => this.setState({ uploadThumb: null })}
                />
            );
        } else if (thumbImg) {
            content.push(
                <Img key="thumb-item-img" image={{ src: thumbImg, content_width: 90, content_height: 90 }} />
            );
        } else {
            content.push(
                <Icon key="thumb-item-empty" name="opt_print" />
            );
        }

        return content;
    }

    layoutAutoThumb() {
        const { autoThumbLimit } = this.state;
        const portfolioList = this.state[STATE.PORTFOLIO];
        const content = [];

        for (let i = 0; i < autoThumbLimit; i += 1) {
            if (utils.isArray(portfolioList) && portfolioList[i]) {
                content.push(
                    <div key={`portfolio-autothumb-${i}`} className="thumb__item">
                        <Img image={{ src: portfolioList[i].portfolio_img, content_width: 90, content_height: 90 }} />
                    </div>
                );
            } else {
                content.push(
                    <div key={`portfolio-autothumb-${i}`} className="thumb__item">
                        <Icon name="opt_print" />
                    </div>
                );
            }
        }

        return content;
    }

    render() {
        const code = ProductObject.getCategoryCode();
        const isBiz = ProductObject.isBiz();

        return (
            <div className="package__container">
                <div className="package__border package__border__round">
                    <div className="package__row">
                        {!isBiz ? [
                            <div className="padding__default" key="auto_thumb">
                                <div className="package__column">
                                    <h2 className="text__header">
                                        {code === CATEGORY_CODE.DRESS_RENT ? "이미지 업로드" : "포트폴리오 업로드"}
                                    </h2>
                                    <div className="text__content">
                                        <div className="package__row auto__flex">
                                            {this.layoutAutoThumb()}
                                        </div>
                                    </div>
                                </div>
                            </div>,
                            <div className="hr margin__default" key="auto_thumb_hr" />] : null
                        }
                        <div className="padding__default">
                            <div className="package__column padding__vertical">
                                <div className="caption__header">
                                    등록 시 안내사항
                                </div>
                                <div className="caption__content">
                                    <span>
                                        해상도가 낮거나 노출불가 이미지의 경우 임의 삭제될 수 있습니다.<br />
                                        등록된 사진은 포스냅 SNS에 광고용으로 게시될 수 있습니다.
                                    </span>
                                </div>
                                <div className="caption__content">
                                    <span>
                                        <div className="info__display-order"><span className="exclamation">!</span><strong>이미지를 끌어서 순서를 변경할 수 있어요.</strong></div>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.layoutPortfolio()}
                <div className="package__border">
                    <div className="package__row">
                        <div className="padding__default">
                            <div className="package__column">
                                <h2 className="text__header">
                                    썸네일
                                </h2>
                                <div className="text__content">
                                    <input
                                        type="file"
                                        accept="image/jpeg, image/png, image/bmp"
                                        ref={ref => (this.refInputThumb = ref)}
                                        onChange={this.uploadThumb}
                                        style={{ display: "none" }}
                                    />
                                    <div className="package__row">
                                        <div className="package__row auto__flex">
                                            <div className="thumb__item">
                                                {this.layoutThumb()}
                                            </div>
                                        </div>
                                        <div className="package__row auto__flex align__center justify__center">
                                            <button className="f__button" value="이미지 업로드" onClick={() => this.refInputThumb.click()}>이미지 업로드</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hr margin__default" />
                        <div className="padding__default">
                            <div className="package__column padding__vertical">
                                <div className="caption__header">
                                    썸네일 등록
                                </div>
                                <div className="caption__content">
                                    <span>
                                        504*504 px 사이즈의 썸네일 이미지를 등록해주세요.<br />
                                        홍보성 문구는 넣지 말아주세요.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PackagePortfolio;
