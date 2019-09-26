import "./popArtistReveiw.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import Heart from "mobile/resources/components/heart/Heart";
import ReviewSlider from "./ReviewSlider";

export default class PopArtistReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickName: props.nickName,
            list: props.list
            // totalCnt: props.total_cnt
        };
    }

    componentWillMount() {
        this.setReview(this.props.list);
    }

    componentDidMount() {
    }

    setReview(list) {
        const _list = list.concat().filter(chk => {
            return chk.user_type === "U" && !chk.auto_reg_dt;
        });
        this.setState({
            list: _list
        });
    }

    render() {
        const { nickName } = this.props;
        const { list } = this.state;
        return (
            <div className="pop-artist-review">
                <div className="pop-artist-review__head">
                    <p className="nick-name">{nickName} 작가님 촬영 후기</p>
                    <div className="close-btn" onClick={() => this.props.onClose()}>
                        <button className="_button _button__close white" />
                    </div>
                </div>
                <div className="pop-artist-review__content">
                    <div className="content-wrap">
                        {list.map((review, idx) => {
                            const reviewImg = review.review_img && review.review_img.length > 0 ? review.review_img[0] : null;
                            const name = review.name;
                            let _name = name ? name.substr(0, name.length - 1) : "";
                            _name += "*";
                            return (
                                <div className="pop-artist-review__content__review" key={`review__${idx}`}>
                                    {reviewImg &&
                                    <ReviewSlider list={review.review_img} index={idx} />
                                    }
                                    <p className="user-name">{_name} - 고객님</p>
                                    <p className="comment">{utils.linebreak(review.comment)}</p>
                                    <Heart
                                        score={review && review.rating_avg && Number(review.rating_avg)}
                                        size="tiny"
                                        disabled="disabled"
                                        visibleContent={false}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
