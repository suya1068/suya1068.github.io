import "./review.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import { PERSONAL_MAIN } from "shared/constant/main.const";
import Img from "shared/components/image/Img";

export default class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    moveProduct(e, data) {
        // e.preventDefault();
        if (data.pno) {
            this.gaEvent(data.label);
            // const node = e.currentTarget;
            // location.href = node.href;
        }
    }

    gaEvent(label) {
        utils.ad.gaEvent("개인_메인", "리얼후기", label);
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("리얼후기");
        }
    }

    render() {
        const reviewData = PERSONAL_MAIN.REVIEW;
        return (
            <div className="main-review">
                <div className="container">
                    <h1 className="section-title">포스냅 리얼 고객 후기</h1>
                    <div className="review-content-container">
                        {reviewData.map((obj, idx) => {
                            return (
                                <a
                                    role="button"
                                    onClick={e => this.moveProduct(e, obj)}
                                    className="review-content"
                                    href={obj.pno}
                                    target="_blank"
                                    key={`review-content__${idx}`}
                                >
                                    <div className="review-content__top">
                                        <div className="image-side">
                                            <Img image={{ src: obj.thumb, type: "image" }} />
                                        </div>
                                        <div className="info-side" style={{ position: "relative" }}>
                                            <p className="title">{`by ${obj.nick_name}`}</p>
                                            <p className="description">{utils.linebreak(obj.description)}</p>
                                            <p className="user_name" style={{ position: "absolute", bottom: "0" }}>{`${obj.user_name} 고객님`}</p>
                                        </div>
                                    </div>
                                    {/*<div className="review-content__bottom">*/}
                                    {/*<p className="user_name">{`${obj.user_name} 고객님`}</p>*/}
                                    {/*</div>*/}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
