import "../scss/artist_outside_review.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";

export default class ArtistOutsideReview extends Component {
    render() {
        const { list, nick_name } = this.props;
        if (list && list.length > 0) {
            return (
                <div className="products__detail__blog">
                    <div>
                        <div className="blog__title">
                            <h2 className="h6 text-bold">{nick_name}작가 촬영리뷰</h2>
                        </div>
                        <div>
                            {list.map(obj => {
                                const urlStr = obj.url.substr(obj.url.indexOf("//") + 2);
                                return (
                                    <a
                                        className="review-unit"
                                        key={`artist_outside_review_${obj.review_no}`}
                                        href={obj.url}
                                        target="_blank" rel="noopener"
                                    >
                                        <div className="review-unit__image">
                                            <Img image={{ src: obj.img_path }} />
                                        </div>
                                        <div className="review-unit__info">
                                            <p className="review-unit__info-title">{obj.title}</p>
                                            <p className="review-unit__info-blog">{urlStr}</p>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}
