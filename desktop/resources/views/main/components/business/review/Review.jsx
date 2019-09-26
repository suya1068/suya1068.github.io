import "./review.scss";
import React, { Component, PropTypes } from "react";
import { BUSINESS_MAIN } from "shared/constant/main.const";
import Img from "shared/components/image/Img";
import utils from "forsnap-utils";
import Heart from "desktop/resources/components/form/Heart";
import Icon from "desktop/resources/components/icon/Icon";
import classNames from "classnames";
import A from "shared/components/link/A";

export default class Review extends Component {
    constructor() {
        super();
        this.state = {
            reviews: BUSINESS_MAIN.RENEW_REVIEW,
            active_no: 1,
            review_max_length: BUSINESS_MAIN.RENEW_REVIEW.length
        };
        this.onChangeReview = this.onChangeReview.bind(this);
        this.arrowEnter = this.arrowEnter.bind(this);
        this.arrowLeave = this.arrowLeave.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentDidMount() {
    }

    /**
     * 리뷰 이동
     * @param e
     */
    onChangeReview(e, side) {
        e.preventDefault();
        const { review_max_length } = this.state;
        let { active_no } = this.state;
        if (side === "right") {
            active_no += 1;

            if (active_no % review_max_length === 1) {
                active_no = 1;
            }
        }

        if (side === "left") {
            active_no -= 1;
            if (active_no % review_max_length < 1) {
                active_no = review_max_length;
            }
        }

        this.setState({ active_no });
    }

    /**
     * 상품 사진 마우스 진입 이벤트
     * @param e
     */
    onEnter(e) {
        const node = e.currentTarget;
        const target = node.querySelector(".image-wrap");
        if (target) {
            target.classList.add("on");
        }
    }

    /**
     * 상품 사진 마우스 이탈 이벤트
     * @param e
     */
    onLeave(e) {
        const node = e.currentTarget;
        const target = node.querySelector(".image-wrap");
        if (target) {
            target.classList.remove("on");
        }
    }

    /**
     * 작가 정보 페이지 이동
     * @param artist
     */
    onMoveArtistAbout(artist) {
        this.gaEvent(artist);
        location.href = `/@${artist}`;
    }

    /**
     * 리뷰 이동 버튼 마우스 진입 이벤트
     * @param side
     */
    arrowEnter(e, side) {
        if (side === "left") {
            this.arrow_left.classList.remove("icon-arrow_l_off");
            this.arrow_left.classList.add("icon-arrow_l_on");
        }

        if (side === "right") {
            this.arrow_right.classList.remove("icon-arrow_r_off");
            this.arrow_right.classList.add("icon-arrow_r_on");
        }
    }

    /**
     * 리뷰 이동 버튼 마우스 이탈 이벤트
     * @param side
     */
    arrowLeave(e, side) {
        if (side === "left") {
            this.arrow_left.classList.remove("icon-arrow_l_on");
            this.arrow_left.classList.add("icon-arrow_l_off");
        }

        if (side === "right") {
            this.arrow_right.classList.remove("icon-arrow_r_on");
            this.arrow_right.classList.add("icon-arrow_r_off");
        }
    }

    /**
     * 기업메인 추천작가 gaEvent
     */
    gaEvent(artist) {
        utils.ad.gaEvent("기업_메인", "고객후기", artist);
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("고객후기");
        }
    }

    render() {
        const { reviews, active_no } = this.state;
        const index = active_no - 1;

        return (
            <section className="biz-review biz-panel__dist">
                <div className="container">
                    <h3 className="biz-panel__title">포스냅 고객님께서 추천하는 작가를 만나보세요!</h3>
                    <div className="biz-review__content">
                        <div className="biz-review__content-box">
                            <div className="arrows">
                                <div
                                    className="arrows-left"
                                    onMouseEnter={e => this.arrowEnter(e, "left")}
                                    onMouseLeave={e => this.arrowLeave(e, "left")}
                                    onClick={e => this.onChangeReview(e, "left")}
                                >
                                    <i className="icon icon-arrow_l_off" ref={node => (this.arrow_left = node)} />
                                </div>
                                <div
                                    className="arrows-right"
                                    onMouseEnter={e => this.arrowEnter(e, "right")}
                                    onMouseLeave={e => this.arrowLeave(e, "right")}
                                    onClick={e => this.onChangeReview(e, "right")}
                                >
                                    <i className="icon icon-arrow_r_off" ref={node => (this.arrow_right = node)} />
                                    {/*<Icon name={right_arrow} ref={node => (this.arrow_right = node)} />*/}
                                </div>
                            </div>
                            <div className="biz-review__content-box__head">
                                <div className="artist" onClick={() => this.onMoveArtistAbout(reviews[index].artist)}>
                                    <span>{`${reviews[index].artist} 작가님`}</span>
                                </div>
                                <div className="artist_info">
                                    <p className="title">{utils.linebreak(reviews[index].title)}</p>
                                    <p className="desc">{utils.linebreak(reviews[index].desc)}</p>
                                </div>
                            </div>
                            <div className="biz-review__content-box__image">
                                {reviews[index].images.map((obj, idx) => {
                                    return (
                                        <a
                                            className="biz-review__content-box__image-item"
                                            key={`biz-review--item__${idx}`}
                                            onMouseEnter={this.onEnter}
                                            onMouseLeave={this.onLeave}
                                            href={`/portfolio/${obj.pno}`}
                                            target="_blank"
                                        >
                                            <div className="image-wrap">
                                                <Icon name="main_enlarge" />
                                            </div>
                                            <Img image={{ src: obj.src, type: "image" }} />
                                        </a>
                                    );
                                })}
                            </div>
                            <div className="biz-review__content-box__review">
                                {reviews[index].reviews.map((obj, idx) => {
                                    return (
                                        <div className="biz-review__content-box__review-item" key={`biz-review--review__${idx}`}>
                                            <div className="text">{utils.linebreak(obj.content)}</div>
                                            <div className="score">
                                                <p className="customer">{obj.customer} - 고객님</p>
                                                <Heart count={obj.score} disabled="disabled" visibleContent={false} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="biz-review__content__dots">
                        <div>
                            <div className={classNames("biz-review__dot", { "active": active_no === 1 })} />
                            <div className={classNames("biz-review__dot", { "active": active_no === 2 })} />
                            <div className={classNames("biz-review__dot", { "active": active_no === 3 })} />
                            <div className={classNames("biz-review__dot", { "active": active_no === 4 })} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
