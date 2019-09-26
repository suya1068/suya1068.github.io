import "./outsideReview.scss";
import React, { Component, PropTypes } from "react";
import Img from "desktop/resources/components/image/Img";

export default class OutsideReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nick_name: props.nick_name || "",
            outside_review: props.outside_review || {},
            list: props.outside_review.list || [],
            career: props.career || []
        };
    }
    componentWillMount() {
    }

    componentDidMount() {
    }

    renderArtistCareer(career) {
        let content = "";
        if (Array.isArray(career) && career.length > 0) {
            content = (
                <div className="artist-career">
                    <h4 className="artist-career-title">경력사항</h4>
                    {career.map((obj, idx) => {
                        const date = obj.date;
                        const changeDate = `${date.substr(0, 4)}.${date.substr(4)}`;
                        return (
                            <div className="artist-career-unit" key={`artist-career__${idx}`}>
                                <p className="date">{changeDate}</p>
                                <p className="content">{obj.content}</p>
                            </div>
                        );
                    })}
                </div>
            );
        }
        return content;
    }

    renderOutsideReview(list, nick_name) {
        return (
            <div className="outside-review">
                <h2 className="outside-review-title">블로그후기</h2>
                <div className="about-artist_outside-review_list">
                    {list.map((obj, idx) => {
                        let blog_url = obj.url;
                        if (!blog_url.match("//") !== true) {
                            blog_url = blog_url.substr(blog_url.indexOf("//") + 2);
                        }
                        return (
                            <a
                                className="product_unit"
                                key={`about-artist_outside-review__${idx}`}
                                href={obj.url}
                            >
                                <div className="image-part">
                                    <Img image={{ src: obj.img_path }} isCrop isContentResize />
                                </div>
                                <div className="content-part">
                                    <div className="title">{obj.title}</div>
                                    <p className="blog_url">{blog_url}</p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        );
    }

    render() {
        const { list, nick_name, career } = this.state;
        return (
            <section className="about-artist-outside-review">
                {this.renderArtistCareer(career)}
                {/*{Array.isArray(list) && list.length > 0 ? this.renderOutsideReview(list, nick_name) : null}*/}
            </section>
        );
    }
}

OutsideReview.propTypes = {
    nick_name: PropTypes.string,
    outside_review: PropTypes.shape([PropTypes.node]),
    career: PropTypes.arrayOf(PropTypes.shape)
};

OutsideReview.defaultProps = {
    nick_name: "",
    outside_review: {},
    career: []
};
