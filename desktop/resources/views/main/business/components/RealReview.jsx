import React, { Component, PropTypes } from "react";
import Swiper from "swiper";

import utils from "forsnap-utils";

import Heart from "desktop/resources/components/form/Heart";

class RealReview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false
        };

        this.gaEvent = this.gaEvent.bind(this);
        this.moveSlide = this.moveSlide.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const option = {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 30,
            loop: true,
            nextButton: ".swiper__arrow.next img",
            prevButton: ".swiper__arrow.prev img",
            onSlideNextStart: swiper => {
                this.moveSlide();
            },
            onSlidePrevStart: swiper => {
                this.moveSlide();
            }
        };

        // this.SwiperList = new Swiper(".review__swiper .swiper-container", option);

        setTimeout(() => {
            this.SwiperList = new Swiper(".review__swiper .swiper-container", option);
        }, 500);
    }

    gaEvent() {
        utils.ad.gaEvent("기업_메인", "후기확인", "");
    }

    moveSlide() {
        const { isLoaded } = this.state;
        if (isLoaded) {
            this.gaEvent();
        }

        this.setState({ isLoaded: true });
    }

    render() {
        const { data } = this.props;
        const { snapIndex } = this.state;
        // console.log("activeIndex:", snapIndex);

        return (
            <div className="main__real__review">
                <div className="real__review__title">
                    포스냅 고객님들의 생생후기
                </div>
                <div className="review__swiper">
                    <div className="swiper-container">
                        <div className="swiper-wrapper">
                            {data.map(o => {
                                const img = {
                                    host: __SERVER__.thumb,
                                    type1: "normal",
                                    type2: "crop",
                                    width: 284,
                                    height: 180,
                                    src: o.review_img[0]
                                };
                                return (
                                    <div className="swiper-slide" key={`review_${o.review_no}`}>
                                        <div className="review__item">
                                            <div>
                                                {utils.isArray(o.review_img) && o.review_img.length ?
                                                    <div className="review_image">
                                                        <img alt="" src={utils.image.make2(img)} />
                                                    </div> : null
                                                }
                                                <div className="user_name">{o.name} 고객님</div>
                                                <div className="comment">
                                                    {utils.linebreak(o.comment)}
                                                </div>
                                                <div className="rating">
                                                    <Heart count={o.rating_avg} disabled="disabled" visibleContent={false} size="small" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="swiper__arrow prev">
                        <img alt="ar" src={`${__SERVER__.img}/common/icon/arrow_left.png`} />
                    </div>
                    <div className="swiper__arrow next">
                        <img alt="ar" src={`${__SERVER__.img}/common/icon/arrow_right.png`} />
                    </div>
                </div>
            </div>
        );
    }
}

RealReview.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape([PropTypes.node]))
};

export default RealReview;
