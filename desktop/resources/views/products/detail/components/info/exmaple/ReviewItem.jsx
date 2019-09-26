import "./artistReview.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import regular from "shared/constant/regular.const";

export default class ReviewItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            isEnter: false
        };
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {

    }

    onMouseEnter() {
        this.setState({ isEnter: true });
    }

    onMouseLeave() {
        this.setState({ isEnter: false });
    }

    onShow(obj) {
        if (typeof this.props.onShow === "function") {
            this.props.onShow(obj);
        }
    }

    render() {
        const { data } = this.props;
        const { isEnter } = this.state;
        const regexp = new RegExp(regular.HTML_TAG, "gi");
        const content = data.content;
        const str = content.replace(regexp, "");
        const str2 = str.replace(/&nbsp;/gi, " ");

        return (
            <div className="artist-review__item" onClick={() => this.onShow(data)} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <div className="thumb-bg" style={{ background: `url(${__SERVER__.thumb}/normal/crop/320x320${data.thumb_img}) center center no-repeat` }}>
                    <div className={classNames("review-bottom", { "show-content": isEnter })}>
                        <div className="content-box">
                            <p className={isEnter ? "review-content" : "review-title"}>{isEnter ? str2 : data.title}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReviewItem.propTypes = {
};

ReviewItem.defaultProps = {
};
