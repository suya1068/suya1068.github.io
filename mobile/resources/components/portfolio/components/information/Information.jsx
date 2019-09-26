import React, { Component, PropTypes } from "react";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import ExampleReviewDetail from "mobile/resources/views/products/list/open/example_review/ExampleReviewDetail";

export default class Information extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chargeArtistNo: props.chargeArtistNo,
            information: props.information,
            active_index: props.active_index,
            category: props.category,
            is_direct: props.is_direct,
            is_biz: props.is_biz,
            review: props.review,
            self_review: props.self_review,
            renewDetail: props.renewDetail
        };
        this.onClose = this.onClose.bind(this);
        this.onShowReview = this.onShowReview.bind(this);
        this.onShowSelfReview = this.onShowSelfReview.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillReceiveProps(np) {
        this.setState({
            review: np.review,
            self_review: np.self_review
        });
    }

    componentWillUnmount() {

    }

    onClose(e) {
        if (typeof this.props.onClose === "function") {
            this.props.onClose();
        }
    }

    /**
     * 후기보기 버튼 클릭
     * @param id
     */
    onShowReview(id) {
        const { onShowReview, gaEvent, chargeArtistNo } = this.props;
        if (typeof onShowReview === "function") {
            onShowReview();
            if (chargeArtistNo) {
                gaEvent("유료_포폴_촬영후기");
            }
        }
    }

    onShowSelfReview() {
        const { category, chargeArtistNo, gaEvent } = this.props;
        const { self_review } = this.state;
        if (chargeArtistNo) {
            gaEvent("유료_포폴_촬영사례");
        }
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: (
                <ExampleReviewDetail
                    data={self_review}
                    category={category}
                    onClose={() => Modal.close()}
                />
            ),
            overflow: false
        });
    }

    reviewLength(obj) {
        if (obj) {
            const list = obj.list.concat().filter(chk => {
                return chk.user_type === "U" && !chk.auto_reg_dt;
            });

            return list.length > 0 ? list.length : null;
        }
        return null;
    }

    render() {
        const { information, active_index, is_biz, renewDetail } = this.props;
        const { review, self_review } = this.state;
        const length = this.reviewLength(review);

        return (
            <div className="forsnap-portfolio__information">
                <div className="information__product">
                    <div className="information__product-artist">
                        <div className="artist-profile">
                            <img src={`${__SERVER__.thumb}/normal/crop/50x50${information.profile_img}`} role="presentation" alt={information.nick_name} />
                        </div>
                        <div className="product-info">
                            <p>{`[${information.artist_name}] ${information.title}`}</p>
                            {is_biz ?
                                <div className="information__review-btn">
                                    {review && review.total_cnt > 0 && length &&
                                        <button onClick={() => this.onShowReview(information.artist_id)} className="review-btn">촬영후기보기 &gt;</button>
                                    }
                                    {self_review ? <button className="review-btn" onClick={this.onShowSelfReview}>촬영사례보기 &gt;</button> : null}
                                </div> :
                                <div className="information__count">
                                    <span style={{ color: "#fff" }}>포트폴리오</span>
                                    <span style={{ color: "#febf16", marginLeft: 10 }}>{`(${active_index} / ${information.total})`}</span>
                                </div>
                            }

                        </div>
                    </div>
                </div>
                {(!is_biz || renewDetail) &&
                <div className="information__etc">
                    <div className="close-button" style={{ color: "#fff" }}>
                        <div className="close" onClick={this.onClose} />
                    </div>
                </div>
                }
            </div>
        );
    }
}

Information.propTypes = {
    information: PropTypes.shape({
        profile_img: PropTypes.string,
        nick_name: PropTypes.string,
        title: PropTypes.string,
        total: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    active_index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};
