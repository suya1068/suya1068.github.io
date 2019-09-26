import "./review.scss";
import React from "react";
import { BUSINESS_MAIN } from "shared/constant/main.const";
import Img from "shared/components/image/Img";
import utils from "forsnap-utils";
import A from "shared/components/link/A";

const RealReview = props => {
    const REVIEW_DATA = BUSINESS_MAIN.REVIEW;

    /**
     * 기업메인 리얼후기선택 gaEvent
     */
    const gaEvent_bizMain = () => {
        const eCategory = "기업메인";
        const eAction = "기업";
        const eLabel = "리얼후기선택";
        utils.ad.gaEvent(eCategory, eAction, eLabel);

        if (typeof props.gaEvent === "function") {
            props.gaEvent(eLabel);
        }
    };

    const moveProduct = (e, no, title) => {
        // e.preventDefault();
        gaEvent_bizMain();
        // if (no) {
        //     const node = e.currentTarget;
        //     location.href = node.href;
        // }
    };

    return (
        <article className="biz-review-component review">
            <h3 className="sr-only">리뷰</h3>
            <div className="review-item-container">
                {REVIEW_DATA.map((obj, idx) => {
                    return (
                        <a
                            role="button"
                            onClick={e => moveProduct(e, obj.pno, obj.title)}
                            className="review-item"
                            href={obj.pno}
                            target="_blank"
                            key={`biz-review__${idx}`}
                        >
                            <div className="review-item__image">
                                <Img image={{ src: obj.thumb, type: "image" }} isImageCrop />
                            </div>
                            <div className="review-item__content">
                                <div className="review-item__content__title">
                                    <p>{obj.title}</p>
                                    <p>{`( ${obj.nick_name} )`}</p>
                                </div>
                                <div className="review-item__content__content">
                                    <p>{utils.linebreak(obj.description)}</p>
                                </div>
                                <div className="review-item__user-info">
                                    <div className="review-item__user-info__name" style={{ width: "70%" }}>
                                        <p>{obj.user_name}</p>
                                    </div>
                                    <div className="review-item__user-info__profile" />
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        </article>
    );
};

export default RealReview;
