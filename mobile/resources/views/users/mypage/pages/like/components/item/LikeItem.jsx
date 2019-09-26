import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import Img from "shared/components/image/Img";

export default class LikeItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            index: props.index,
            onMoveLike: props.onMoveLike,
            onRemoveLike: props.onRemoveLike
        };
    }

    render() {
        const { data, index, onMoveLike, onRemoveLike } = this.props;
        return (
            <div className="users-like__item">
                <div className="users-like__item-product">
                    <div className="category">{utils.format.categoryCodeToName(data.category)}</div>
                    <a
                        href={`${__MOBILE__}/products/${data.product_no}`}
                        role="button"
                        onClick={e => onMoveLike(e, data)}
                        className="product-portfolio"
                    >
                        <Img image={{ src: data.thumb_img, content_width: 504, content_height: 504, width: 2, height: 1 }} isContentResize />
                    </a>
                    <div className="users-like__item-info">
                        <div className="price">
                            {`${utils.format.price(data.price)} 원`}
                        </div>
                        <div className="info">
                            <div className="info-left">
                                <p className="title">{data.title}</p>
                                <p className="nick_name">by {data.nick_name}</p>
                            </div>
                            <div className="info-right">
                                <div className="heart">
                                    <p>♡</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="users-like__item-button">
                        <button
                            className="button button-border like-del"
                            onClick={() => onRemoveLike(data.product_no, index)}
                        >
                            삭제하기</button>
                    </div>
                </div>
            </div>
        );
    }
}

LikeItem.propTypes = {
    data: PropTypes.shape({
        product_no: PropTypes.string,
        thumb_img: PropTypes.string,
        price: PropTypes.string,
        title: PropTypes.string,
        nick_name: PropTypes.string,
        category: PropTypes.string
    }).isRequired,
    index: PropTypes.number.isRequired,
    onMoveLike: PropTypes.func.isRequired,
    onRemoveLike: PropTypes.func.isRequired
};
