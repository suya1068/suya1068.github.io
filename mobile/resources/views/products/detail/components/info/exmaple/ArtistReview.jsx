import "./artistReview.scss";
import React, { Component, PropTypes } from "react";
import ReviewItem from "./ReviewItem";
import Icon from "desktop/resources/components/icon/Icon";

export default class ArtistReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artistReview: props.artistReview,
            minCount: 2
        };
        this.onShow = this.onShow.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    renderArtistReview(list) {
        const { minCount } = this.state;
        let content = null;
        if (Array.isArray(list) && list.length < minCount) {
            content = (
                Array.from(new Array(minCount)).map((a, idx) => {
                    let second_content = null;
                    if (list[idx]) {
                        second_content = this.renderItem(list[idx], idx);
                    } else {
                        second_content = this.renderNoneItem(idx);
                    }
                    return second_content;
                })
            );
        } else {
            content = (
                list.map((obj, idx) => {
                    return (
                        this.renderItem(obj, idx)
                    );
                })
            );
        }

        return content;
    }

    /**
     * 작가리뷰 아이템
     * @param obj
     * @param index
     */
    renderItem(obj, index) {
        return (
            <ReviewItem data={obj} key={`render__item__${index}`} onShow={this.onShow} />
        );
    }

    onShow(obj) {
        if (typeof this.props.onShow === "function") {
            this.props.onShow(obj);
        }
    }


    /**
     * 작가리뷰 없을때
     * @param index
     */
    renderNoneItem(index) {
        return (
            <div className="artist-review__item none-list" key={`render__none__item__${index}`}>
                {/*<Icon name="" />*/}
                <i className="_icon _icon__pencil" />
                <p className="none-list__title">coming soon</p>
            </div>
        );
    }

    render() {
        const { artistReview } = this.props;
        return (
            <section className="product__artist-review artist-review" id="artist-review">
                <h3 className="sr-only">촬영사례</h3>
                <div className="artist-review__content">
                    <div className="artist-review__box">
                        <div className="artist-review__box__head">
                            <p className="artist-review__title">촬영사례</p>
                        </div>
                        <div className="artist-review__list">
                            {this.renderArtistReview(artistReview)}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

ArtistReview.propTypes = {
    artistReview: PropTypes.arrayOf(PropTypes.shape([PropTypes.node]))
};

ArtistReview.defaultProps = {
    artistReview: []
};
