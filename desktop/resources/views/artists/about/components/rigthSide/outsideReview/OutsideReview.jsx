import "./outsideReview.scss";
import React, { Component, PropTypes } from "react";
import Img from "desktop/resources/components/image/Img";

export default class OutsideReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nick_name: props.nick_name,
            outside_review: props.outside_review,
            list: props.outside_review.list
        };
    }
    render() {
        const { list } = this.state;
        return (
            <section className="about-artist-rightside_outside-review">
                <h2 className="title">블로그후기</h2>
                <div className="outside-review_list">
                    {list.map((obj, idx) => {
                        let blog_url = obj.url;
                        if (!blog_url.match("//") !== true) {
                            blog_url = blog_url.substr(blog_url.indexOf("//") + 2);
                        }
                        return (
                            <a
                                className="product_unit"
                                target="_blank"
                                rel="noopener"
                                key={`about-artist_outside-review__${idx}`}
                                href={obj.url}
                            >
                                <div className="image-part">
                                    <Img image={{ src: obj.img_path, content_width: 504, content_height: 504 }} isCrop isImageResize />
                                </div>
                                <div className="content-part">
                                    <div className="title">{obj.title}</div>
                                    <p className="blog_url">{blog_url}</p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </section>
        );
    }
}

OutsideReview.propTypes = {
    nick_name: PropTypes.string.isRequired,
    outside_review: PropTypes.shape([PropTypes.node]).isRequired
};

OutsideReview.defaultProps = {
    nick_name: "",
    outside_review: {}
};
