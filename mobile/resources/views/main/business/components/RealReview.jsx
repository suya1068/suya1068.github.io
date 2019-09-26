import React, { Component, PropTypes } from "react";
import Swiper from "swiper";

import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Img from "shared/components/image/Img";

import Heart from "desktop/resources/components/form/Heart";

import ReviewModal from "./ReviewModal";

class RealReview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            isLoaded: false
        };

        this.onClick = this.onClick.bind(this);
        this.moveSlide = this.moveSlide.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const option = {
            slidesPerView: "auto",
            spaceBetween: 15,
            initialSlide: 0,
            loop: true,
            onSlideNextStart: swiper => {
                this.moveSlide("next");
                this.setState({
                    index: swiper.realIndex + 1
                });
            },
            onSlidePrevStart: swiper => {
                this.moveSlide("prev");
                this.setState({
                    index: swiper.realIndex + 1
                });
            }
        };

        setTimeout(() => {
            this.SwiperList = new Swiper(".review__swiper .swiper-container", option);
        }, 500);
    }

    moveSlide(side) {
        const { isLoaded } = this.state;
        if (isLoaded) {
            this.gaEvent(side === "next" ? "다음" : "이전");
        }

        this.setState({ isLoaded: true });
    }

    onClick(data) {
        this.gaEvent("클릭");
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            close: true,
            content: <ReviewModal data={data} />
        });
    }

    gaEvent(label) {
        utils.ad.gaEvent("M_기업_메인", "고객후기", label);
    }

    render() {
        const { data } = this.props;
        const { index } = this.state;

        return (
            <div className="main__real__review">
                <div className="real__review__list">
                    <div className="review__swiper">
                        <div className="swiper-container">
                            <div className="swiper-wrapper">
                                {data.map(o => {
                                    return (
                                        <div className="swiper-slide" key={`review_${o.review_no}`} onClick={() => this.onClick(o)}>
                                            <div className="review__item">
                                                <div>
                                                    {utils.isArray(o.review_img) && o.review_img.length ?
                                                        <div className="review_image">
                                                            <Img image={{ src: o.review_img[0], width: 2, height: 1.33 }} />
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
                    </div>
                </div>
                <div className="review__count">
                    <span>{index} / {data.length}</span>
                </div>
            </div>
        );
    }
}

RealReview.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape([PropTypes.node]))
};

export default RealReview;
