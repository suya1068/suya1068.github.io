import "./review.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import Img from "shared/components/image/Img";
import Heart from "mobile/resources/components/heart/Heart";
import ReviewImgBox from "./ReviewImgBox";
import MoreBtn from "../../../business/component/more/MoreBtn";

export default class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            review: props.review,
            nickName: props.nickName,
            renderList: [],
            limit: 3,
            offset: 0,
            isMore: false
        };
        this.onMore = this.onMore.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        const { review } = this.props;

    }

    componentDidMount() {

    }

    componentWillReceiveProps(np) {
        if (JSON.stringify(this.props.review) !== JSON.stringify(np.review)) {
            this.setState({
                ...this.combineRenderList(np.review)
            });
        }
    }

    combineRenderList(list) {
        const { renderList, offset, limit } = this.state;
        const lastListFlag = list.length > (limit + offset);
        const maxLength = lastListFlag ? (limit + offset) : list.length;
        let isMore = false;

        if (lastListFlag) {
            isMore = true;
        }

        for (let i = offset; i < maxLength; i += 1) {
            renderList.push(list[i]);
        }

        return { renderList, isMore, offset: limit + offset };
    }

    /**
     * ga이벤트 전달
     * @param action
     */
    gaEvent(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(action);
        }
    }

    onMovePage(nick) {
        location.href = `/@${nick}/review`;
    }

    renderReview(list) {
        let content = null;
        if (Array.isArray(list) && list.length > 0) {
            content = (
                list.map((obj, idx) => {
                    return (
                        <div className="review-row" key={`review__${idx}`}>
                            <div className="row-head">
                                <div className="profile">
                                    <Img image={{ src: obj.profile_img, content_width: 90, content_height: 90, default: "/common/default_profile_img.jpg" }} />
                                </div>
                                <div className="product-info">
                                    <p className="user-name">{obj.name}</p>
                                    <Heart count={obj.rating_avg} disabled="disabled" visibleContent={false} size="tiny" />
                                </div>
                            </div>
                            <div className="review-content">
                                <p className="content-text">{utils.linebreak(obj.comment)}</p>
                                {this.renderReviewImage(obj.review_img, idx)}
                                <p className="content-date">{obj.reg_dt.substr(0, 10)}</p>
                            </div>
                        </div>
                    );
                })
            );
        } else {
            content = (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 160, flexDirection: "column" }}>
                    <p style={{ color: "#666", fontSize: 14, fontWeight: "normal", marginBottom: 5 }}>작성된 후기가 없습니다.</p>
                    <p style={{ color: "#000", fontSize: 16, fontWeight: "bold" }}>첫 후기를 작성해 보세요.</p>
                </div>
            );
        }

        return content;
    }

    onMore() {
        const { review } = this.props;
        this.gaEvent("유료_후기더보기");
        this.setState({
            ...this.combineRenderList(review)
        });
    }

    renderReviewImage(list, index) {
        let content = null;
        if (Array.isArray(list) && list.length > 0) {
            content = (
                <ReviewImgBox list={list} index={index} />
            );
        }

        return content;
    }

    render() {
        const { review, nickName } = this.props;
        const { renderList, isMore } = this.state;
        return (
            <div className="product__review" id="review">
                <h3 className="sr-only">후기</h3>
                <div className="product__review__content">
                    <div className="review-box">
                        <div className="review-count">
                            <p className="review-box__title">후기 <span className="color-yellow">{review.length}</span>개</p>
                            <button className="write-review__btn" onClick={() => this.onMovePage(nickName)}>후기 남기기</button>
                        </div>
                        {this.renderReview(renderList)}
                    </div>
                </div>
                {isMore &&
                <MoreBtn title="후기더보기" onMore={this.onMore} moreStyle={{ fontSize: 12 }} />
                }
            </div>
        );
    }
}
