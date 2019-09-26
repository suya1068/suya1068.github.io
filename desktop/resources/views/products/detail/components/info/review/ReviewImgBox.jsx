import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import Swiper from "swiper";

export default class ReviewImgBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            index: props.index
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        setTimeout(() => {
            this.configSwiper();
        }, 1000);
    }

    configSwiper() {
        const { index } = this.props;
        this.reviewImageBox = new Swiper(`#review-image__${index}`, {
            slidesPerView: 5,
            spaceBetween: 5,
            nextButton: `.right-arrow_${index}`,
            prevButton: `.left-arrow_${index}`
        });
    }

    render() {
        const { list, index } = this.props;
        return (
            <div style={{ position: "relative" }}>
                <div className="review-image-box swiper-container" id={`review-image__${index}`}>
                    <div className="review-image-box__wrapper swiper-wrapper">
                        {list.map((obj, idx) => {
                            return (obj ?
                                <div className="review-image swiper-slide" key={`review_image__${idx}__${obj}`}>
                                    <img style={{ width: "100%", height: "100%" }} src={`${__SERVER__.thumb}/normal/crop/320x320${obj}`} role="presentation" />
                                    {/*<Img image={{ src: obj, content_width: 320, content_height: 320 }} isScreenChange />*/}
                                </div> : null
                            );
                        })}
                    </div>
                </div>
                {list.length > 5 &&
                    <div className="arrows">
                        <div className={`left-arrow left-arrow_${index}`}>
                            <i className="_icon _icon__gray_lt_g" />
                        </div>
                        <div className={`right-arrow right-arrow_${index}`}>
                            <i className="_icon _icon__gray_gt_g" />
                        </div>
                    </div>
                }
            </div>
        );
    }
}
