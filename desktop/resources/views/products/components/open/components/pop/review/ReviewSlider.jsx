import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import Swiper from "swiper";

export default class ReviewSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: props.index
        };
        this.configSwiper = this.configSwiper.bind(this);
    }

    componentDidMount() {
        this.configSwiper();
    }

    /**
     * 스와이프 설정
     */
    configSwiper() {
        this.reviewslider = new Swiper(`#review_slider_${this.props.index}`, {
            slidesPerView: 1,
            paginationClickable: true,
            pagination: ".review_slider_pages",
            paginationBulletRender: (swiper, index, className) => {
                return `<span class="slide_page ${className}"></span>`;
            }
        });
    }

    render() {
        return (
            <div className="review-image-slider swiper-container" id={`review_slider_${this.props.index}`}>
                <div className="review-image-slider-wrapper swiper-wrapper">
                    {this.props.list.map((obj, idx) => {
                        return (
                            <div className="pop-artist-review__content__image swiper-slide" key={`review__portfolio__${idx}`}>
                                <Img image={{ src: obj, content_width: 1400, content_height: 1000 }} />
                            </div>
                        );
                    })}
                </div>
                <div className="review_slider_pages" />
            </div>
        );
    }
}
