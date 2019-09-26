import "../scss/ProductItem.scss";
import React, { Component, PropTypes, createElement } from "react";

import utils from "forsnap-utils";

import Img from "shared/components/image/Img";
import A from "shared/components/link/A";

class ProductListItem extends Component {
    constructor(props) {
        super(props);

        this.onMoveProductDetailPage = this.onMoveProductDetailPage.bind(this);
    }

    onMoveProductDetailPage(event, data) {
        event.preventDefault();
        this.gaEvent(data.product_no, data.title);
        if (typeof this.props.onClick === "function") {
            // this.improvedGaForDetailProductClick(data);
            const node = event.currentTarget;
            this.props.onClick(node.href);
        }
    }

    /**
     * 향상된 ga이벤트
     * @param data
     */
    improvedGaForDetailProductClick(data) {
        window.dataLayer.splice(0, window.dataLayer.length);
        window.dataLayer.push({
            "event": "product_click",
            "ecommerce": {
                "click": {
                    "actionField": { "step": "product_click", "list": data.category || "" },      // Optional list property.
                    "products": [{
                        "name": data.title,                      // Name or ID is required.
                        "id": data.product_no,
                        "price": data.price || 0,
                        "brand": `${data.artist_id}-${data.nick_name}`,
                        "category": data.category || "",
                        "position": this.props.no
                    }]
                }
            }
        });
        // console.log(window.dataLayer);
    }

    gaEvent(no, title) {
        const eCategory = "M_개인_리스트";
        const eAction = "상품선택";
        const eLabel = `상품번호: ${no} / 상품명: ${title}`;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
        // ga("Event.send", "event", {
        //     eventCategory: "목록상품선택",
        //     eventAction: "데스크탑",
        //     eventLabel: `상품번호: ${no} / 상품명: ${title}`
        // });
    }

    render() {
        const { children, data, tag, size } = this.props;
        const content = (
            <div>
                <A href={`/products/${data.product_no}`} onClick={e => this.onMoveProductDetailPage(e, data)} className="products__item__thumb">
                    <Img image={{ src: data.thumb_img, content_width: 504, content_height: 504, ...size }} isContentResize />
                    <div className="products__item__popular" />
                </A>
                <div className="products__item__info">
                    {children}
                </div>
            </div>
        );
        const props = {
            className: "products__item"
        };

        return createElement(tag, props, content);
    }
}

ProductListItem.propTypes = {
    children: PropTypes.node.isRequired,
    data: PropTypes.shape([PropTypes.node]).isRequired,
    tag: PropTypes.string,
    size: PropTypes.shape([PropTypes.node]),
    onClick: PropTypes.func
};

ProductListItem.defaultProps = {
    tag: "li",
    size: {
        width: 3,
        height: 2
    },
    onClick: null
};

export default ProductListItem;
