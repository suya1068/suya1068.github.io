import "./category_reviews.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import classNames from "classnames";
import Img from "desktop/resources/components/image/Img";
import Heart from "desktop/resources/components/form/Heart";

export default class CategoryReviews extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            limit: 5,
            offset: 0,
            page: 1,
            max_page: 1,
            is_loading: true,
            is_start: false,
            render_list: [],
            timer: undefined,
            set_timer: undefined
        };
        this.arrowEnter = this.arrowEnter.bind(this);
        this.arrowLeave = this.arrowLeave.bind(this);
        this.onTimer = this.onTimer.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.list && nextProps.list.length > 0 && JSON.stringify(nextProps.list) !== JSON.stringify(this.props.list)) {
            const { limit, render_list } = this.state;
            let offset = this.state.offset;
            const { list } = nextProps;

            for (let i = offset; i < limit; i += 1) {
                render_list.push(list[i]);
                offset += 1;
            }

            if (!this.state.is_start) {
                // this.onTimer();
            }

            this.state.is_start = true;

            this.setState({ render_list, total_count: list.length, max_page: Math.ceil(list.length / limit), offset, is_loading: false });
        }
    }

    /**
     * 후기 영역 오토플레이 타이머
     * @returns {number}
     */
    onTimer() {
        this.state.timer = setInterval(() => this.onChangeReview(null, "right"), 5000);
    }

    /**
     * 타이머를 종료한다.
     */
    onRemoveTimer() {
        clearInterval(this.state.timer);
    }

    /**
     * 리뷰 다음 버튼
     * @param data
     * @param list
     * @returns {{page: *}}
     */
    reviewNextStep(data, list) {
        const { page, max_page, limit, offset, total_count } = data;
        let _page = page + 1;
        let i_data = {};

        if (_page > max_page) {
            _page %= max_page;
        }

        if (_page <= max_page) {
            const max_limit = _page * limit > total_count ? total_count : _page * limit;
            i_data = this.iterateReviewStep({ page: _page, offset, max_limit, limit }, list);
        }

        return { ...i_data, page: _page };
    }

    /**
     * 파라미터에 따라 알맞은 리뷰를 저장한다.
     * @param data
     * @param list
     * @returns {{render_list: Array, offset: number}}
     */
    iterateReviewStep(data, list) {
        const { page, max_limit, limit } = data;
        const render_list = [];
        let _offset = (page - 1) * limit;

        for (let i = _offset; i < max_limit; i += 1) {
            render_list.push(list[i]);
            _offset += 1;
        }

        return { render_list, offset: _offset };
    }

    /**
     * 리뷰 이전 버튼
     * @param data
     * @param list
     * @returns {{page: number}}
     */
    reviewPrevStep(data, list) {
        const { page, max_page, limit, offset, total_count } = data;
        let _page = page - 1;
        let i_data = {};

        if (_page < 1) {
            _page = max_page;
        }

        if (_page >= 1) {
            const max_limit = _page * limit < total_count ? _page * limit : total_count;
            i_data = this.iterateReviewStep({ page: _page, offset, max_limit, limit }, list);
        }

        return { ...i_data, page: _page };
    }

    /**
     * 후기 이동 버튼 컨테이너
     * @param e
     * @param side
     */
    onChangeReview(e, side) {
        if (e) {
            // this.onRemoveTimer();
            // this.state.set_timer = setTimeout(() => {
            //     this.onTimer();
            //     clearTimeout(this.state.set_timer);
            // }, 15);
        }
        const { page, max_page, limit, offset, total_count } = this.state;
        const { list } = this.props;
        let _data = {};

        if (side === "right") {
            _data = this.reviewNextStep({ page, max_page, limit, offset, total_count }, list);
        } else if (side === "left") {
            _data = this.reviewPrevStep({ page, max_page, limit, offset, total_count }, list);
        }

        this.setState({ ..._data });
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

    render() {
        const { render_list, is_loading } = this.state;

        if (is_loading) {
            return null;
        }

        return (
            <section className="product_list__category-reviews category-reviews product__dist">
                <div className="container">
                    <div className="category-reviews__head">
                        <div className="category-reviews__head__text">
                            <h2 className="section-title title">촬영후기</h2>
                            <span className="desc">포스냅에서 촬영하신 고객님들의 후기를 확인해 보세요</span>
                        </div>
                        <div className="category-reviews__head__arrow">
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="category-reviews__content">
                        {Array.isArray(render_list) && render_list.length > 0 && render_list.map((review, idx) => {
                            const has_image = review && review.review_img;
                            return (
                                <div className={classNames("category-reviews__content__row", { "has_image": has_image })} key={`category__reviews__content__${idx}`}>
                                    <div className={classNames("category-reviews__content__row__comment", { "h": !has_image })}>
                                        <div className="comment-box">
                                            {review && review.comment && utils.linebreak(review.comment)}
                                        </div>
                                    </div>
                                    {review && review.review_img &&
                                    <div className="category-reviews__content__row__img">
                                        <div className="review_image">
                                            <Img image={{ src: review.review_img }} />
                                        </div>
                                    </div>
                                    }
                                    <div className="category-reviews__content__row__rate">
                                        <div className="score">
                                            <p className="customer">{review && review.name && review.name} - 고객님</p>
                                            <Heart count={review && review.rating_avg && Number(review.rating_avg)} disabled="disabled" visibleContent={false} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }
}

