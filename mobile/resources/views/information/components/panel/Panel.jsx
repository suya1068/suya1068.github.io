import "./panel.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import Swiper from "swiper";

export default class Panel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: props.image || {},
            slide_images: props.slide_images || undefined,
            onActiveIndex: props.onActiveIndex || undefined,
            float_img: props.float_img || undefined
        };
    }

    componentDidMount() {
        const { slide_images } = this.state;
        if (slide_images) {
            this.setSwiperConfig();
        }
    }

    /**
     * 스와이퍼 환경을 설정한다.
     * - 터치 이벤트 x
     * - 오토 롤링
     */
    setSwiperConfig() {
        this.extra_slide = new Swiper(".mobile-information-panel__slide-images", {
            slidesPerView: 1,
            autoplay: 3000,
            loop: true,
            simulateTouch: false,
            onSlideChangeStart: swiper => {
                if (this.props.onActiveIndex && typeof this.props.onActiveIndex === "function") {
                    this.props.onActiveIndex(swiper.realIndex);
                }
            }
        });
    }

    render() {
        const { image, slide_images, float_img } = this.state;
        const img_version = "20180629_1722";

        return (
            <div className="mobile-information-panel">
                {this.props.children}
                <div className="mobile-information-panel__image-content">
                    <div className="mobile-information-panel__image-box" style={{ width: image.width && image.width, height: image.height && image.height }}>
                        <Img image={{ src: `${image.src}?v=${img_version}`, type: "image" }} isContentResize isScreenChange />
                        {float_img &&
                            <div className="mobile-information-panel__float-img" style={{ top: float_img.y, left: float_img.x }}>
                                <img src={`${__SERVER__.img}${float_img.src}`} alt={float_img.alt} style={{ height: float_img.height, width: float_img.width }} />
                            </div>
                        }
                        {slide_images &&
                            <div className="mobile-information-panel__slide-inner">
                                <div className="mobile-information-panel__slide-images swiper-container">
                                    <div className="swiper-wrapper">
                                        {slide_images.map((obj, idx) => {
                                            return (
                                                <div className="mobile-information-panel__slider swiper-slide" key={`slide_images-panel__${idx}`}>
                                                    <img src={`${__SERVER__.img}${obj.src}`} alt={obj.alt} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
