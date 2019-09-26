import "./review.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import { PERSONAL_MAIN } from "shared/constant/main.const";
import Swiper from "swiper";
import Img from "shared/components/image/Img";

export default class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 1,
            reviewData: PERSONAL_MAIN.REVIEW,
            cList: []
        };
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        const { reviewData } = this.state;
        this.setReviewArray(reviewData);
    }

    componentDidMount() {
        this.mainReview = new Swiper(".review-content-container", {
            slidesPerView: "auto",
            spaceBetween: 10,
            initialSlide: 0,
            onSlideNextStart: swiper => {
                const activeIndex = swiper.activeIndex + 1;
                this.setState({
                    activeIndex
                });
            },
            onSlidePrevStart: swiper => {
                const activeIndex = swiper.activeIndex + 1;
                this.setState({
                    activeIndex
                });
            }
        });
    }

    /**
     * 개인메인 리얼후기선택 gaEvent
     */
    gaEvent(data) {
        utils.ad.gaEvent("M_개인_메인", "리얼후기", data.label);
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("리얼후기");
        }
    }

    setReviewArray(list) {
        const testArr = [
            [list[0], list[1], list[2]],
            [list[3], list[4], list[5]],
            [list[6], list[7], list[8]]
        ];
        this.state.cList = testArr;
    }

    moveProduct(e, data) {
        // e.preventDefault();
        this.gaEvent(data);
        // if (data.pno) {
        //     const node = e.currentTarget;
        //     location.href = node.href;
        // }
    }

    renderArr(array) {
        const content = [];
        if (Array.isArray(array)) {
            for (let i = 0; i < array.length; i += 1) {
                content.push(
                    <a
                        href={array[i].pno}
                        onClick={e => this.moveProduct(e, array[i])}
                        className="content-wrap"
                        key={`review-content-wrap__${array[i].pno}`}
                    >
                        <div className="content-wrap-test">
                            <div className="review-panel__content-top">
                                <div className="image-side">
                                    <Img image={{ src: array[i].thumb, type: "image" }} />
                                </div>
                                <div className="info-side">
                                    <p className="title">{`by ${array[i].nick_name}`}</p>
                                    <p className="description">{utils.linebreak(array[i].description)}</p>
                                    <p className="user_name">{`${array[i].user_name} 고객님`}</p>
                                </div>
                            </div>
                        </div>
                    </a>
                );
            }
        }

        return content;
    }

    render() {
        const reviewData = PERSONAL_MAIN.REVIEW;
        const total = reviewData.length / 3;
        const { cList } = this.state;

        return (
            <div className="m_main-review">
                <h3 className="review-text">포스냅 리얼 고객 후기</h3>
                <div className="review-content-container swiper-container">
                    <div className="review-content-wrapper swiper-wrapper">
                        {cList.map((obj, idx) => {
                            return (
                                <div className="review-panel swiper-slide" key={`review-${idx}`}>
                                    {this.renderArr(obj)}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="list-counting">
                    <span className="current-count">{this.state.activeIndex}</span>
                    <span className="total_count">{total}</span>
                </div>
            </div>
        );
    }
}
