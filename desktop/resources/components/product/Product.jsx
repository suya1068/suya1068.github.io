import "./product.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "shared/helper/utils";

import ImageCheck from "desktop/resources/components/image/ImageCheck";
import Img from "desktop/resources/components/image/Img";

// import Heart from "../form/Heart";
import Icon from "../icon/Icon";
import Profile from "../image/Profile";
// import Buttons from "../button/Buttons";

const classSize = {
    default: "",
    small: "product-small",
    large: "product-large"
};

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: props.size,
            isActive: false,
            children: props.children
        };
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
    }

    render() {
        const { data, check, type, children } = this.props;

        let tempChildren = children;

        if (!children) {
            tempChildren = null;
        }

        return (
            <div className={classNames("product-box", classSize[this.state.size])}>
                {
                    !check ?
                        <div className="box-image">
                            <Img image={{ src: data.thumb_img }} />
                            <div className="image-bg" />
                            <div className="product-popular">
                                <div className="popular-heart"><Icon name={this.state.size === "small" ? "heart_s" : "heart"} /><span>{data.like_cnt}</span></div>
                                <div className="popular-comment"><Icon name={this.state.size === "small" ? "chat_s" : "chat_m"} /><span>{data.review_cnt}</span></div>
                                {tempChildren}
                            </div>
                        </div>
                        :
                        <div className="box-image">
                            {/*<div className="image-bg" />*/}
                            {
                                type === "heart" ?
                                    <div>
                                        <div className={classNames("heartUnit-bg", this.props.isHover ? "active" : "")} />
                                        <ImageCheck image={{ src: data.thumb_img }} pno={data.product_no} />
                                    </div> : <ImageCheck image={{ src: data.thumb_img }} pno={data.product_no} />
                            }
                            {/*<ImageCheck image={{ src: data.thumb_img }} pno={data.product_no} />*/}
                        </div>
                }
                <div className="box-conent">
                    <div className="product-artist-profile">
                        <Profile image={{ src: data.profile_img }} />
                    </div>
                    <div className="product-info">
                        <p className="product-artist-name">{data.nick_name}</p>
                        <div className="product-sub-info">
                            <h6 className="product-title">{data.title}</h6>
                            <p className="product-price">
                                {utils.format.price(data.price)}<small>원</small>
                            </p>
                            {/*<Heart count={data.rating_avg} disabled="disabled" size={(this.state.size === "small") || (this.state.size === "large") ? "small" : ""} />*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Product.propTypes = {
    data: PropTypes.shape({
        product_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        nick_name: PropTypes.string,
        profile_img: PropTypes.string,
        title: PropTypes.string,
        thumb_img: PropTypes.string,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        rating_avg: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        like_cnt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        review_cnt: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }),
    size: PropTypes.oneOf(Object.keys(classSize)),
    check: PropTypes.bool,
    children: PropTypes.node
};

export default Product;
