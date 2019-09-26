import "./image.scss";
import React, { Component, PropTypes } from "react";

import API from "forsnap-api";
import utils from "forsnap-utils";
import constant from "shared/constant";
import ImageController from "./image_controller";

class Img extends Component {
    constructor(props) {
        super(props);

        this.state = {
            image: props.image,
            default: utils.agent.isMobile() ? constant.DEFAULT_IMAGES.M_BACKGROUND : constant.DEFAULT_IMAGES.BACKGROUND,
            thumbSrc: "",
            isProgress: true,
            isUpdate: false,
            imageUID: "",
            anchor: undefined,
            isResize: false,
            isUnMount: false
        };

        this.onError = this.onError.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onResize = this.onResize.bind(this);

        this.getThumb = this.getThumb.bind(this);
        this.imageResize = this.imageResize.bind(this);
        this.emptyCheck = this.emptyCheck.bind(this);
    }

    componentWillMount() {
        const { isScreenChange } = this.props;

        this.emptyCheck();

        if (isScreenChange) {
            window.addEventListener("resize", this.onResize, false);
        }
    }

    componentWillReceiveProps(nextProps) {
        let nextSrc = "";
        let propSrc = "";

        if (nextProps.image.src) {
            nextSrc = nextProps.image.src;
        }

        if (this.props.image.src) {
            propSrc = this.props.image.src;
        }

        if (nextSrc !== propSrc) {
            this.state.image = nextProps.image;
            this.emptyCheck();
            this.getThumb();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let nextSrc = "";
        let propSrc = "";

        if (nextProps.image.src) {
            nextSrc = nextProps.image.src;
        }

        if (this.props.image.src) {
            propSrc = this.props.image.src;
        }

        if (nextSrc !== propSrc
            || nextState.thumbSrc !== this.state.thumbSrc
            || nextState.isProgress !== this.state.isProgress) {
            return true;
        }

        return false;
    }

    componentWillUnmount() {
        this.state.isUnMount = true;
        window.removeEventListener("resize", this.onResize, false);
        if (this.state.imageUID !== "") {
            ImageController.deleteImage(this.state.imageUID);
        }
    }

    /**
     * 이미지 에러처리
     */
    onError() {
        const image = this.state.image;
        let defaultImg = this.state.default;

        if (image.default !== undefined && image.default !== "") {
            defaultImg = image.default;
        }

        const thumbSrc = this.getImageHost("image") + defaultImg;

        if (["base64", "reader"].indexOf(image.type) !== -1) {
            const log = {};
            if (image.type !== "private") {
                log.thumbSrc = thumbSrc;
            } else {
                log.thumbSrc = thumbSrc.replace(image.src, "***");
            }

            log.location = `${document.location.hostname}${document.location.pathname}`;
            API.auth.log(`${log.location}__${utils.uniqId()}`, log, "ERROR");
        }

        if (thumbSrc !== this.state.thumbSrc) {
            if (!this.state.isUnMount) this.setState({ thumbSrc });
        }
    }

    /**
     * 이미지 로딩 완료처리
     * @param result
     */
    onLoad(result) {
        this.state.imageUID = "";
        if (result.status) {
            if (!this.state.isUnMount) {
                this.setState({
                    thumbSrc: result.retrySrc ? result.retrySrc : result.src
                });
            }
        } else {
            this.onError();
        }
    }

    /**
     * 이미지 로딩중 처리
     */
    onProgress(result) {
    }

    onResize() {
        if (!this.state.isResize) {
            setTimeout(() => {
                this.state.isResize = false;

                setTimeout(() => {
                    if (!this.state.isResize) {
                        this.imageResize();
                    }
                }, 500);
            }, 500);
        }

        this.state.isResize = true;
    }

    /**
     * 이미지 호스트
     * @param type
     * @returns {string|string|string|string|string|string|*}
     */
    getImageHost(type) {
        let host = "";

        if (type === "base64") {
            host = "data:image/*;base64,";
        } else if (type === "image") {
            host = __SERVER__.img;
        } else if (type === "reader") {
            host = "";
        } else {
            host = __SERVER__.thumb;
        }

        return host;
    }

    /**
     * 이미지 주소 처리
     */
    getThumb() {
        const data = this.state.image;
        const imageType = data.type;

        const host = this.getImageHost(imageType);
        let thumbSrc = "";

        if (["base64", "image"].indexOf(imageType) !== -1) {
            thumbSrc = host + data.src;
        } else if (["reader"].indexOf(imageType) !== -1) {
            thumbSrc = data.src;
        } else {
            const content = this.content;
            let thumb;
            let vw;
            let vh;
            const cw = content.offsetWidth;
            const ch = content.offsetHeight;

            if (data.content_width && data.content_width !== 0 && data.content_height && data.content_height !== 0) {
                vw = data.content_width;
                vh = data.content_height;
            } else if (cw === 0 || ch === 0) {
                const resize = utils.resize(data.width || 1, data.height || 1, cw, ch, content.offsetWidth !== 0);
                vw = resize.width;
                vh = resize.height;
            } else {
                vw = cw;
                vh = ch;
            }

            this.resizeContent(vw, vh);

            if (imageType === "private") {
                thumb = "signed";
                // thumb += this.props.isCrop ? "/crop" : "/resize";
                // thumbSrc = `${host}/${thumb}/${vw}x${vh}${data.src}`;
            } else {
                thumb = "normal";
                // const path = utils.image.get({
                //     width: vw,
                //     height: vh,
                //     type: this.props.isCrop ? "thumb" : "resize"
                // });
                // thumbSrc = `${path}${data.src}`;
            }

            thumb += this.props.isCrop ? "/crop" : "/resize";
            thumbSrc = `${host}/${thumb}/${vw}x${vh}${data.src}`;
        }

        if (["base64", "reader"].indexOf(imageType) === -1) {
            this.state.imageUID = ImageController.addImage({ src: thumbSrc, onLoad: this.onLoad, onProgress: this.onProgress });
        } else {
            this.onLoad({ status: true, src: thumbSrc });
        }
    }

    /**
     * 이미지 체크 후 디폴트 처리
     * @param imageObj
     */
    emptyCheck() {
        const image = this.state.image;
        let defaultImg = this.state.default;

        if (!(image.src) || image.src === "null") {
            if (image.default && image.default !== "null") {
                defaultImg = image.default;
            }

            this.state.image.src = defaultImg;
            this.state.image.type = "image";
            // this.state.thumbSrc = this.getImageHost(this.state.image.type) + this.state.image.src;
        }
    }

    /**
     * 이미지 로드 후 리사이즈 및 크롭하기
     */
    imageResize() {
        const image = this.image;

        if (!image) {
            return;
        }

        const isImageCrop = this.props.isImageCrop;
        const isImageResize = this.props.isImageResize;
        const vw = image.offsetWidth;
        const vh = image.offsetHeight;
        const rc = this.resizeContent(vw, vh);
        const cw = rc.cw;
        const ch = rc.ch;

        const iAspect = vw / vh;
        const cAspect = cw / ch;

        if (isImageCrop) {
            if (iAspect < cAspect) {
                const h = (vh / vw) * cw;
                image.style.width = `${cw}px`;
                image.style.height = `${h}px`;
                image.style.top = `${(ch / 2) - (h / 2)}px`;
            } else if (iAspect > cAspect) {
                const w = (vw / vh) * ch;
                image.style.width = `${w}px`;
                image.style.height = `${ch}px`;
                image.style.left = `${(cw / 2) - (w / 2)}px`;
            } else {
                image.style.width = `${cw}px`;
                image.style.height = `${ch}px`;
            }
        } else if (isImageResize) {
            if (iAspect < cAspect) {
                const w = (vw / vh) * ch;
                image.style.width = `${w}px`;
                image.style.height = `${ch}px`;
                image.style.left = `${(cw / 2) - (w / 2)}px`;
            } else if (iAspect > cAspect) {
                const h = (vh / vw) * cw;
                image.style.width = `${cw}px`;
                image.style.height = `${h}px`;
                image.style.top = `${(ch / 2) - (h / 2)}px`;
            } else {
                image.style.width = `${cw}px`;
                image.style.height = `${ch}px`;
            }
        } else {
            image.style.maxWidth = "100%";
            image.style.maxHeight = "100% ";
        }

        if (this.state.isProgress) {
            if (!this.state.isUnMount) {
                this.setState({
                    isProgress: false
                }, () => {
                    if (typeof this.props.onLoad === "function") {
                        this.props.onLoad({ thumbSrc: this.state.thumbSrc });
                    }

                    if (this.state.isUpdate) {
                        this.setState({
                            isUpdate: false,
                            isProgress: true
                        });
                    }
                });
            }
        }
    }

    /**
     * 컨텐츠 영역 리사이즈
     * @param vw - Number (이미지 높이)
     * @param vh - Number (이미지 넓이)
     */
    resizeContent(vw, vh) {
        const data = this.state.image;
        const content = this.content;
        let cw = content.offsetWidth;
        let ch = content.offsetHeight;
        const zeroContent = cw === 0 || ch === 0;

        if (zeroContent || this.props.isContentResize) {
            if (content.style.width !== "") {
                cw = 0;
            }
            if (content.style.height !== "") {
                ch = 0;
            }

            const w = data.width || vw;
            const h = data.height || vh;

            const anchor = cw !== 0;
            const resize = utils.resize(w, h, cw, ch, anchor);
            cw = resize.width;
            ch = resize.height;

            if (anchor) {
                content.style.height = `${ch}px`;
            } else {
                content.style.width = `${cw}px`;
            }
        }

        return { cw, ch };
    }

    render() {
        const { image } = this.state;
        const thumbSrc = this.state.thumbSrc;
        const isProgress = this.state.isProgress;
        const progressPath = this.getImageHost("image") + constant.PROGRESS.COLOR_CAT;

        return (
            <div className="image-content" ref={ref => (this.content = ref)}>
                {isProgress ?
                    <img
                        alt="이미지로딩중.."
                        className="loading-progress"
                        src={progressPath}
                        onLoad={this.getThumb}
                        ref={ref => (this.progress = ref)}
                    />
                    : null}
                {thumbSrc ?
                    <img
                        alt={image.alt || "이미지"}
                        className={isProgress ? "image-invisible" : ""}
                        src={thumbSrc}
                        onLoad={this.imageResize}
                        onError={this.onError}
                        ref={ref => (this.image = ref)}
                    />
                    : null}
            </div>
        );
    }
}

Img.propTypes = {
    image: PropTypes.shape([PropTypes.node]),
    isCrop: PropTypes.bool,
    isImageCrop: PropTypes.bool,
    isImageResize: PropTypes.bool,
    isContentResize: PropTypes.bool,
    onLoad: PropTypes.func,
    isScreenChange: PropTypes.bool
};

Img.defaultProps = {
    image: {
        src: "",
        type: "data",
        width: undefined,
        height: undefined,
        content_width: undefined,
        content_height: undefined,
        default: undefined,
        alt: ""
    },
    isCrop: true,
    isImageCrop: true,
    isImageResize: false,
    isContentResize: false,
    onLoad: undefined,
    isScreenChange: true
};

export default Img;
