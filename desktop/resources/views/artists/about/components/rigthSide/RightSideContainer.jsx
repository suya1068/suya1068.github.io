import "./rightSideContainer.scss";
import React, { Component, PropTypes } from "react";
import Product from "./product/Product";
import Review from "./review/Review";
// import OutsideReview from "./outsideReview/OutsideReview";

export default class RightSideContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productData: props.data.productData,
            reviewData: props.data.reviewData,
            outsideReviewData: props.data.outsideReviewData,
            getArtistAbout: props.getArtistAbout
        };
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        const { data, getArtistAbout } = this.props;
        const { productData, reviewData, artist_id } = data;
        return (
            <section className="about-artist-rightside">
                <div className="layer">
                    <div className="layer__body">
                        <div className="layer__container">
                            <div className="layer__column">
                                <Product {...productData} />
                            </div>
                            <div className="layer__column">
                                <Review {...reviewData} artist_id={artist_id} getArtistAbout={getArtistAbout} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
