import "./ImageGallery.scss";
import React, { Component, PropTypes } from "react";

// import API from "forsnap-api";
import utils from "forsnap-utils";

// import Img from "desktop/resources/components/image/Img";
import Img from "shared/components/image/Img";
// import PopModal from "shared/components/modal/PopModal";

class ImageGallery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images: props.images,
            imagesRender: [],
            defaultHeight: props.thumbHeight,
            defaultImageHeight: props.imageHeight,
            defaultMargin: props.thumbGap,
            defaultRadius: props.radius,
            isResize: false
        };

        this.onResize = this.onResize.bind(this);
    }

    componentWillMount() {
        window.addEventListener("resize", this.onResize, false);
    }

    componentDidMount() {
        this.calculImages(this.state.images);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            images: nextProps.images,
            defaultHeight: nextProps.thumbHeight,
            defaultImageHeight: nextProps.imageHeight,
            defaultMargin: nextProps.thumbGap,
            defaultRadius: nextProps.radius
        }, () => {
            this.calculImages(nextProps.images);
        });
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

    /**
     * 이미지 크기 계산
     * @param images - Array
     */
    calculImages(images) {
        const { defaultHeight, defaultImageHeight, defaultMargin, defaultRadius } = this.state;
        const { thumbCrop, min, max, isSame } = this.props;
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
                    let rsResize;
                    let defaultThumb;
                    if (isSame) {
                        const lw = lineResize.width / lastCount;
                        rsResize = {
                            float: lw,
                            width: lw,
                            height: lw
                        };

                        const p = rImage.width > rImage.height;
                        const defHeight = defaultImageHeight || defaultHeight;

                        defaultThumb = utils.resize(rImage.width, rImage.height, p ? undefined : defHeight, p ? defHeight : undefined, !p);
                    } else {
                        rsResize = utils.resize(rImage.width, rImage.height, undefined, lineResize.float);
                        defaultThumb = utils.resize(rImage.width, rImage.height, undefined, defaultImageHeight || lineResize.float);
                    }

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
            return (
                <div
                    key={`image__gallery__thumb__${i}`}
                    className="image__gallery__thumb"
                    style={{ width: image.resize_width, height: image.resize_height, margin: defaultMargin / 2, borderRadius: defaultRadius }}
                    onClick={() => this.onClick(i)}
                >
                    <Img image={{ src: image.src, content_width: image.thumb_width, content_height: image.thumb_height }} isCrop={thumbCrop} />
                </div>
            );
        });

        this.setState({
            images,
            imagesRender,
            isResize: false
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
    isSame: PropTypes.bool
};

ImageGallery.defaultProps = {
    thumbHeight: 200,
    imageHeight: 250,
    min: 1,
    max: 6,
    thumbGap: 10,
    radius: "10px",
    thumbCrop: false,
    isSame: false
};

export default ImageGallery;
