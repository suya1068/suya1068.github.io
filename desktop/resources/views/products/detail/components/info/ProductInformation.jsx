import "./productInformation.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import BusinessTab from "../tab/BusinessTab";
import ArtistInfo from "./artist/ArtistInfo";
import Review from "./review/Review";
import ArtistReview from "./exmaple/ArtistReview";
import AboutArtist from "../artist/AboutArtist";

export default class ProductInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            review: props.review,
            career: props.career,
            artistReview: props.artistReview,
            nickName: props.nickName
        };
        this.onShow = this.onShow.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.onConsult = this.onConsult.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    /**
     * 작가 셀프 리뷰 보기
     * @param obj
     */
    onShow(obj) {
        this.gaEvent("유료_촬영사례");
        if (typeof this.props.onShow === "function") {
            this.props.onShow(obj);
        }
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

    onConsult(access_type) {
        if (typeof this.props.onConsult === "function") {
            // access_type === "detail_artist" // 상세_작가문의
            this.props.onConsult(access_type);
        }
    }

    render() {
        const { review, career, artistReview, nickName, data, region } = this.props;
        return (
            <section className={classNames("product__information")}>
                <h2 className="sr-only">상품정보</h2>
                <BusinessTab />
                <div className="tab-clone" />
                <div className="product__information__content-box">
                    <div className="product__information__content" id="artist_info">
                        <AboutArtist
                            intro={data.intro}
                            nickName={data.nick_name}
                            isCorp={data.is_corp}
                            profile={data.profile_img}
                            region={region}
                            onConsult={this.onConsult}
                            gaEvent={this.gaEvent}
                        />
                    </div>
                    <div className="product__information__content" id="career">
                        <ArtistInfo career={career} gaEvent={this.gaEvent} />
                    </div>
                    <div className="product__information__content" id="review">
                        <Review review={review} nickName={nickName} gaEvent={this.gaEvent} />
                    </div>
                    <div className="product__information__content" id="artist_review">
                        <ArtistReview artistReview={artistReview} onShow={this.onShow} />
                    </div>
                </div>
            </section>
        );
    }
}

ProductInformation.propTypes = {
    review: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    career: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    artistReview: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    nickName: PropTypes.string.isRequired
};

ProductInformation.defaultProps = {
    review: [],
    career: [],
    artistReview: []
};
