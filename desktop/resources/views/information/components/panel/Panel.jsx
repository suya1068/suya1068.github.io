import "./Panel.scss";
import classnames from "classnames";
import React, { Component, PropTypes } from "react";
import Swiper from "swiper";
import utils from "forsnap-utils";

class Panel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: props.image,
            slide: props.slide || false,
            slideImages: props.slideImages,
            onActiveIndex: props.onActiveIndex || undefined,
            transform: props.transform || "",
            floatImg: props.floatImg || ""
        };
        this.setSwiperConfig = this.setSwiperConfig.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        const { slide } = this.state;
        if (slide) {
            this.setSwiperConfig();
        }
    }

    componentWillUnmount() {

    }

    /**
     * 스와이퍼 환경을 설정한다.
     * - 터치 이벤트 x
     * - 오토 롤링
     */
    setSwiperConfig() {
        this.information_extra_slide = new Swiper(".information-image-slide-container", {
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
        const { image, slide, slideImages, transform, floatImg } = this.state;
        const imageURL = image && image.src ? `${__SERVER__.img}${image.src}?v=20180629_1725` : null;
        const extraClassName = (image.className || []).join(" ");

        return (
            <section className="information-panel">
                <div className="information-inner">
                    <div className="container information-contents">
                        <div className="row">
                            <div className={classnames("columns", { "col-9": !utils.agent.isMobile() })}>
                                {this.props.children}
                            </div>
                            <div className={classnames("information-image", extraClassName)}>
                                { imageURL && <img src={imageURL} alt={image.alt} /> }
                                { imageURL && floatImg &&
                                    <img
                                        src={`${__SERVER__.img}${floatImg.src}`}
                                        className={floatImg.className}
                                        style={{ transform: `translate(${floatImg.position.x}, ${floatImg.position.y})` }}
                                        alt="test"
                                    />
                                }
                                { imageURL && slide &&
                                    <div className="slide-wrapper" style={{ transform: transform && transform.y && `translate(-71px, ${transform.y}px)` }}>
                                        <div className="information-image-slide-container swiper-container">
                                            <div className="information-image-slide-wrapper swiper-wrapper">
                                                {slideImages && slideImages.length > 0 && slideImages.map((obj, idx) => {
                                                    return (
                                                        <div className="information-image-slide swiper-slide" key={`information-image-slide__${idx}`}>
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
                </div>
            </section>
        );
    }
}

Panel.propTypes = {
    image: PropTypes.shape({
        src: PropTypes.string,
        className: PropTypes.array,
        alt: PropTypes.string
    }),
    children: PropTypes.node.isRequired,
    slide: PropTypes.bool
};

Panel.defaultProps = {
    image: { src: "", className: [], alt: "" }
};


export default Panel;
