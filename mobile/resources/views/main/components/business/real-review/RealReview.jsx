import "./realReview.scss";
import React, { Component } from "react";
import ReserveComplete from "./components/reserve-complete/ReserveComplete";
// import ReserveComplete from "../../common/reserve-complete/ReserveComplete";
import Review from "./components/review/Review";

const RealReview = props => {
    const gaEvent = action => {
        if (typeof props.gaEvent === "function") {
            props.gaEvent(action);
        }
    };

    return (
        <section className="biz-real-review-component">
            <h2 className="biz-real-review-component-heading">포스냅 리얼 고객 후기</h2>
            <Review gaEvent={gaEvent} />
            {props.reserve ? <ReserveComplete {...props} gaEvent={gaEvent} /> : null}
        </section>
    );
};

export default RealReview;
