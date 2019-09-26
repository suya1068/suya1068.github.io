import React, { Component, PropTypes } from "react";
import Swiper from "swiper";

import utils from "forsnap-utils";

class PhotoViewModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: (props.data || []).reduce((r, o) => {
                r.push(Object.assign({}, o));
                return r;
            }, []),
            beforehand: 5
        };

        this.onLoadImages = this.onLoadImages.bind(this);
    }

    componentDidMount() {
        const option = {
            slidesPerView: 1,
            // spaceBetween: 20,
            initialSlide: this.props.index,
            loop: true,
            preloadImages: false,
            onSlideNextStart: o => {
                this.onLoadImages(o.activeIndex, o.slides);
            },
            onSlidePrevStart: o => {
                this.onLoadImages(o.activeIndex, o.slides);
            }
        };

        this.SwiperList = new Swiper(".photo__view__swiper", option);
    }

    onLoadImages(index, list) {
        const { beforehand } = this.state;
        const total = list.length;
        this.replaceImage(list[index]);
        for (let i = 1; i <= beforehand; i += 1) {
            const n = index + i;
            const p = index - i;

            if (n > total) {
                this.replaceImage(list[((n - 1) - total)]);
            } else {
                this.replaceImage(list[n]);
            }

            if (p < 0) {
                this.replaceImage(list[total + p]);
            } else {
                this.replaceImage(list[p]);
            }
        }
    }

    replaceImage(element) {
        if (element && element.querySelector("img")) {
            const img = element.querySelector("img");
            const src = img.getAttribute("data-src");
            if (src) {
                img.src = src;
                img.removeAttribute("data-src");
            }
        }
    }

    render() {
        const { onClose } = this.props;
        const { data } = this.state;

        return (
            <div className="photo__view__modal">
                <div className="photo__view__swiper">
                    <div className="swiper-wrapper" ref={ref => (this.refSwiper = ref)}>
                        {data.map((o, i) => {
                            const params = {
                                host: __SERVER__.thumb,
                                type1: "signed",
                                type2: "resize",
                                width: 800,
                                height: 800,
                                src: o.thumb_key
                            };

                            return (
                                <div key={i} className="swiper-slide">
                                    <div className="photo__item">
                                        <button className="_button _button__close white photo__view__close" onClick={onClose} />
                                        <img
                                            className="swiper-lazy"
                                            alt={`thumb_${i}`}
                                            id={`swiper_index_${i}`}
                                            role="presentation"
                                            data-src={utils.image.make2(params)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

PhotoViewModal.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    index: PropTypes.number,
    onClose: PropTypes.func.isRequired
};

PhotoViewModal.defaultProps = {
    index: 0
};

export default PhotoViewModal;
