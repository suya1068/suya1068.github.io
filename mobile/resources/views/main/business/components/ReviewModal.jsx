import "../scss/ReveiwModal.scss";
import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import Img from "shared/components/image/Img";

import Heart from "desktop/resources/components/form/Heart";

class ReviewModal extends Component {
    render() {
        const { data } = this.props;

        return (
            <div className="review__modal">
                <div>
                    {utils.isArray(data.review_img) && data.review_img.length ?
                        <div className="review__image">
                            <Img image={{ src: data.review_img[0], width: 16, height: 9 }} />
                        </div> : null
                    }
                    <div className="review__content">
                        <div className="user_name">{data.name} 고객님</div>
                        <div className="comment">
                            {utils.linebreak(data.comment)}
                        </div>
                        <div className="rating">
                            <Heart count={data.rating_avg} disabled="disabled" visibleContent={false} size="small" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReviewModal.propTypes = {
    data: PropTypes.shape([PropTypes.node])
};

export default ReviewModal;
