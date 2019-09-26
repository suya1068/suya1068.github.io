import "./products_item.scss";
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
        if (typeof this.props.onClick === "function") {
            event.preventDefault();
            // this.improvedGaForDetailProductClick(data);
            this.gaEvent(data.product_no, data.title);

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
        // console.log("detail_product_click", window.dataLayer);
    }


    gaEvent(no, title) {
        const eCategory = "M_개인_리스트";
        const eAction = "상품선택";
        const eLabel = `상품번호: ${no} / 상품명: ${title}`;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    render() {
        const { data, defWidth, defHeight } = this.props;
        const props = {
            className: "products__item"
        };
        const content = (
            <div>
                <A className="products__item__thumb" href={`/products/${data.product_no}`} onClick={e => this.onMoveProductDetailPage(e, data)}>
                    <Img image={{ src: data.thumb_img, content_width: defWidth, content_height: defHeight, width: 3, height: 2 }} isContentResize />
                </A>
                <div className="products__item__info">
                    <div>
                        <p className="item__heart" />
                        <p className="item__price">
                            {utils.format.price(data.price)}<span className="won">원</span>
                        </p>
                    </div>
                    <div>
                        <div className="item__title">
                            <p className="product__title">{data.title}</p>
                            <a className="artist__name" href={`/@${data.nick_name}`}>{data.is_corp === "Y" ? <span className="badge__corp">계산서</span> : null}by {data.nick_name}</a>
                            {/*<a className="artist__name" href={`/artists/${data.artist_id}/about`}>{data.is_corp === "Y" ? <span className="badge__corp">계산서</span> : null}by {data.nick_name}</a>*/}
                        </div>
                        <a className="item__favorite" href={`/@${data.nick_name}`}>
                            {/*<a className="item__favorite" href={`/artists/${data.artist_id}/about`}>*/}
                            <Img image={{ src: data.profile_img, content_width: 110, content_height: 110, default: "/common/default_profile_img.jpg" }} />
                        </a>
                    </div>
                </div>
            </div>
        );

        return createElement("li", props, content);
    }
}

ProductListItem.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired,
    defWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClick: PropTypes.func
};

ProductListItem.defaultProps = {
    defWidth: 504,
    defHeight: 504,
    onClick: null
};

export default ProductListItem;
