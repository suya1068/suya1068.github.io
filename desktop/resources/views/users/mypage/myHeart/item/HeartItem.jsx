import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import classNames from "classnames";
import Icon from "desktop/resources/components/icon/Icon";
import Product from "desktop/resources/components/product/Product";
import Buttons from "desktop/resources/components/button/Buttons";

export default class HeartItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.item,
            index: props.index,
            onMoveLike: props.onMoveLike,
            onRemoveLike: props.onRemoveLike,
            is_hover: false
        };
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.isHover = this.isHover.bind(this);
    }

    /**
     * 마우스 오버 여부
     * @returns {boolean}
     */
    isHover() {
        return this.state.is_hover;
    }

    /**
     * 마우스 enter 이벤트
     */
    onMouseEnter() {
        this.setState({
            is_hover: true
        });
    }

    /**
     * 마우스 leave 이벤트
     */
    onMouseLeave() {
        this.setState({
            is_hover: false
        });
    }

    render() {
        const { data, index, onMoveLike, onRemoveLike } = this.props;
        const { is_hover } = this.state;
        const category_name = utils.format.categoryCodeToName(data.category);

        return (
            <div
                className="heart-unit"
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
                <div className="heart-unit-bg">
                    <a href={`${__DOMAIN__}/products/${data.product_no}`} onClick={e => onMoveLike(e, data)} className="redirectProduct">
                        <div className="heart-unit-bg_click" />
                        <div className="category">{category_name}</div>
                        <div className={classNames("heart-unit-bg_info", is_hover ? "active" : "")}>
                            <div className="heart-unit-likeCount">
                                <Icon name="disable_heart_s" />
                                <span className="text">{data.like_cnt}</span>
                            </div>
                            <div className="heart-unit-reviewCount">
                                <Icon name="chat_s" />
                                <span className="text">{data.review_cnt}</span>
                            </div>
                        </div>
                    </a>
                    <Buttons buttonStyle={{ size: "small", isActive: is_hover, icon: "close_w" }} inline={{ className: "close", onClick: () => onRemoveLike(data.product_no, index) }} />
                </div>
                <Product data={data} size="large" check type="heart" isHover={is_hover} />
            </div>
        );
    }
}


HeartItem.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired,
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onMoveLike: PropTypes.func.isRequired,
    onRemoveLike: PropTypes.func.isRequired
};
