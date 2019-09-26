import "../scss/ProductPackageReview.scss";
import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import ProductPackageReviewItem from "./ProductPackageReviewItem";

class ProductPackageReview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMobile: utils.agent.isMobile()
        };
    }

    componentWillMount() {
    }

    render() {
        const { data, isHeader, artist_id, onWrite } = this.props;
        const {
            list,
            total_cnt,
            rating_avg,
            product_no
            // rating_kind,
            // rating_price,
            // rating_qual,
            // rating_service,
            // rating_talk,
            // rating_trust
        } = data;

        if (!utils.isArray(list)) {
            return null;
        }

        return (
            <div className="layer__column">
                {isHeader ?
                    <div className="text__header padding__default review__header">
                        후기<span className="count">{total_cnt}</span>개
                    </div> : null
                }
                {list.map((obj, objIndex) => {
                    const nextIndex = objIndex + 1;
                    const isComment = list.length > nextIndex && list[nextIndex].user_type === "A";

                    return <ProductPackageReviewItem key={`review-item-${obj.review_no}`} data={obj} isComment={isComment} artist_id={artist_id} onWrite={onWrite} />;
                })}
            </div>
        );
    }
}

// <div className="review__rating margin__horizontal">
//     <div className="review__rating__item">
//         <Heart score={rating_avg} />
//         <span className="score">{rating_avg}</span>
//     </div>
// </div>

ProductPackageReview.propTypes = {
    data: PropTypes.shape([PropTypes.node]),
    artist_id: PropTypes.string,
    isHeader: PropTypes.bool,
    onWrite: PropTypes.func
};

ProductPackageReview.defaultPrpos = {
    isHeader: false,
    artist_id: null
};

export default ProductPackageReview;
