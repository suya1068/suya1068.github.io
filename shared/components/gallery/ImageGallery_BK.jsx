import "./ImageGallery.scss";
import React, { Component, PropTypes } from "react";

// import API from "forsnap-api";
import utils from "forsnap-utils";

import Img from "desktop/resources/components/image/Img";
import ImageController from "desktop/resources/components/image/image_controller";
// import "mobile/resources/views/products/detail/components/lazyLoderTest";

// import Img from "shared/components/image/Img";
// import PopModal from "shared/components/modal/PopModal";

class ImageGallery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            imagesRender: [],
            defaultHeight: props.thumbHeight,
            defaultImageHeight: props.imageHeight,
            defaultMargin: props.thumbGap,
            defaultRadius: props.radius,
            isResize: false,
            lazy: props.lazy,
            lazyLoader: {
                cache: [],
                mobileScreenSize: 500,
                throttleTimer: new Date().getTime()
            }
        };

        this.onResize = this.onResize.bind(this);
        ///////
        this.throttledLoad = this.throttledLoad.bind(this);
        this.loadVisibleImages = this.loadVisibleImages.bind(this);
    }

    componentWillMount() {
        // ImageController.setMaxThread(1);
        window.addEventListener("resize", this.onResize, false);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                images: this.props.images
            }, () => {
                this.calculImages(this.state.images);
            });
        }, 100);
    }

    componentWillReceiveProps(nextProps) {
        setTimeout(() => {
            this.setState({
                images: nextProps.images
            }, () => {
                this.calculImages(this.state.images);
            });
        }, 100);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize, false);
    }

    onResize() {
        if (!this.state.isResize) {
            setTimeout(() => {
                this.state.isResize = false;

                setTimeout(() => {
                    if (!this.state.isResize) {
                        this.calculImages(this.state.images);
                    }
                }, 500);
            }, 500);
        }

        this.state.isResize = true;
    }

    onClick(i) {
        if (typeof this.props.onClick === "function") {
            this.props.onClick(i);
        }
    }

    onLoad() {
    }

    getOffsetTop(el) {
        let val = el.offsetTop;
        if (el.offsetParent) {
            val = el.offsetParent.offsetTop;
            // val = el.offsetTop;
            // while (el === el.offsetParent) {
            //     val += el.offsetTop;
            // }
            // do {
            //     val += el.offsetTop;
            // } while (el = el.offsetParent);
        }
        return val;
    }

    loadVisibleImages(e) {
        const { lazyLoader } = this.state;
        const target = e.target;
        // const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const pageHeight = window.innerHeight || document.documentElement.clientHeight;
        const scrollY = target.scrollTop || window.pageYOffset || document.documentElement.scrollTop;
        // const pageHeight = target.clientHeight;
        const range = {
            min: scrollY - 200,
            max: scrollY + pageHeight + 200
        };

        console.log(lazyLoader.cache);

        let i = 0;
        while (i < lazyLoader.cache.length) {
            const image = lazyLoader.cache[i];
            const imagePosition = this.getOffsetTop(image);
            const imageHeight = image.height || 0;

            console.log("i: ", i, ">>", scrollY, range);
            console.log("imagePosition: ", imagePosition);
            console.log("imageHeight: ", imageHeight);

            if ((imagePosition >= range.min - imageHeight) && (imagePosition <= range.max)) {
                console.log("(imagePosition >= range.min - imageHeight): ", (imagePosition >= range.min - imageHeight));
                console.log("(imagePosition <= range.max): ", (imagePosition <= range.max));
                //const mobileSrc = image.getAttribute("data-src-mobile");

                image.onload = function () {
                    this.className = this.className.replace(/(^|\s+)lazy-load(\s+|$)/, "$1lazy-loaded$2");
                };

                // if (mobileSrc && screen.width <= lazyLoader.mobileScreenSize) {
                //     image.src = mobileSrc;
                // } else {
                //     image.src = image.getAttribute("data-src");
                // }

                image.src = image.getAttribute("data-src");

                image.removeAttribute("data-src");
                //image.removeAttribute("data-src-mobile");

                lazyLoader.cache.splice(i, 1);
                // continue;
            }

            i += 1;
        }

        if (lazyLoader.cache.length === 0) {
            this.removeObservers();
        }
    }

    throttledLoad(e) {
        const { lazyLoader } = this.state;
        const now = new Date().getTime();
        if ((now - lazyLoader.throttleTimer) >= 200) {
            lazyLoader.throttleTimer = now;
            this.loadVisibleImages(e);
        }
    }

    addObservers() {
        const target = document.getElementsByClassName("products__detail__scroll")[0];
        target.addEventListener("scroll", this.throttledLoad);
    }

    removeObservers() {
        const target = document.getElementsByClassName("products__detail__scroll")[0];
        target.removeEventListener("scroll", this.throttledLoad, false);
    }
//                    {/*<img className="lazy-load" src={`${__SERVER__.img}/common/forsnap_bg_default.jpg`} data-src={`${__SERVER__.thumb}/normal/resize/350x250${image.src}`} role="presentation" />*/}

    /**
     * 이미지 크기 계산
     * @param images - Array
     */
    calculImages(images) {
        const { defaultHeight, defaultImageHeight, defaultMargin, defaultRadius, lazy } = this.state;
        const { thumbCrop, min, max } = this.props;
        const length = images.length;
        const rect = this.gallery.getBoundingClientRect();
        const galleryWidth = rect.width;
        let imagesWidth = 0;
        let startIndex = 0;
        let lastCount = 0;
        let lastWidth = 0;

        for (let i = 0; i < length; i += 1) {
            const image = images[i];
            const defaultResize = utils.resize(image.width, image.height, undefined, defaultHeight);
            const isLast = i === length - 1;

            image.resize_width = defaultResize.float;
            image.resize_height = defaultResize.height;

            const gap = galleryWidth - imagesWidth;
            const isNotMore = gap < defaultResize.float;
            const lineCount = (i + 1) - startIndex;
            const isMin = lineCount >= min;
            const isMax = lineCount >= max;

            if ((isNotMore && isMin) || (!isNotMore && isMax) || isLast) {
                let endIndex = 0;
                let lineResize = 0;
                const isNext = gap < (defaultResize.float * 0.8) && lineCount - 1 >= min && !isLast;

                if (isNext) {
                    // next
                    endIndex = i - 1;
                } else {
                    // current
                    imagesWidth += defaultResize.float;
                    endIndex = i;
                }

                const count = (Math.abs(startIndex - endIndex) + 1);

                if (isLast && count < lastCount) {
                    lineResize = utils.resize(lastWidth, defaultHeight, galleryWidth - (lastCount * defaultMargin), undefined, true);
                } else {
                    lineResize = utils.resize(imagesWidth, defaultHeight, galleryWidth - (count * defaultMargin), undefined, true);
                    lastCount = count;
                    lastWidth = imagesWidth;
                }

                imagesWidth = 0;
                for (let j = startIndex; j <= endIndex; j += 1) {
                    const rImage = images[j];
                    const rsResize = utils.resize(rImage.width, rImage.height, undefined, (lineResize.float), false);
                    const defaultThumb = utils.resize(image.width, image.height, undefined, (lineResize.float > defaultImageHeight ? lineResize.float : defaultImageHeight));

                    rImage.thumb_width = defaultThumb.width;
                    rImage.thumb_height = defaultThumb.height;

                    imagesWidth += rsResize.float;

                    rImage.resize_width = rsResize.float;
                    rImage.resize_height = rsResize.height;
                }

                if (isNext) {
                    imagesWidth = defaultResize.float;
                } else {
                    imagesWidth = 0;
                }

                startIndex = endIndex + 1;
            } else {
                imagesWidth += defaultResize.float;
            }
        }

        const imagesRender = images.map((image, i) => {
            const lazyMode = this.state.lazy;
            let content;
            if (lazyMode) {
                content = (
                    <div>
                        <img className="lazy-load" data-src={`${__SERVER__.thumb}/normal/crop/350x250${image.src}`} role="presentation" />
                    </div>
                );
            } else {
                content = (
                    <Img image={{ src: image.src, content_width: image.thumb_width, content_height: image.thumb_height }} isCrop={thumbCrop} />
                );
            }
            return (
                <div
                    key={`image__gallery__thumb__${i}`}
                    className="image__gallery__thumb"
                    style={{ width: image.resize_width, height: image.resize_height, margin: defaultMargin / 2, borderRadius: defaultRadius }}
                    onClick={() => this.onClick(i)}
                >
                    {content}
                </div>
            );
        });

        this.setState({
            images,
            imagesRender,
            isResize: false
        }, () => {
            if (this.props.lazy) {
                const { lazyLoader } = this.state;
                const imageNodes = document.querySelectorAll("img[data-src]");

                for (let i = 0; i < imageNodes.length; i += 1) {
                    const imageNode = imageNodes[i];

                    // Add a placeholder if one doesn"t exist
                    //imageNode.src = imageNode.src || lazyLoader.tinyGif;

                    lazyLoader.cache.push(imageNode);
                }

                this.addObservers();
                this.loadVisibleImages();

                // removeEventListener("load", _lazyLoaderInit, false);
            }
        });
    }

    render() {
        const { imagesRender } = this.state;

        return (
            <div className="image__gallery" ref={ref => (this.gallery = ref)}>
                <div className="image__gallery__container" ref={ref => (this.gallery_container = ref)}>
                    <div className="image__gallery__list">
                        {imagesRender}
                    </div>
                </div>
                <div className="imaeg__gallery__preview">
                    PREVIEW
                </div>
            </div>
        );
    }
}

ImageGallery.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    thumbHeight: PropTypes.number,
    imageHeight: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    thumbGap: PropTypes.number,
    radius: PropTypes.string,
    thumbCrop: PropTypes.bool,
    lazy: PropTypes.bool
};

ImageGallery.defaultProps = {
    thumbHeight: 200,
    imageHeight: 250,
    min: 1,
    max: 6,
    thumbGap: 10,
    radius: "10px",
    thumbCrop: false,
    lazy: false
};

export default ImageGallery;
