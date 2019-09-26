import "./productListItemBar.scss";
import React, { Component, PropTypes, createElement } from "react";
import utils from "forsnap-utils";
import Img from "shared/components/image/Img";
import A from "shared/components/link/A";
import Heart from "mobile/resources/components/heart/Heart";

class ProductListItemBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onMoveProductDetailPage = this.onMoveProductDetailPage.bind(this);
        this.onLike = this.onLike.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
            // console.log("check", nextProps.data);
        }
    }

    onMoveProductDetailPage(event, data) {
        if (typeof this.props.onClick === "function") {
            // event.preventDefault();
            // this.improvedGaForDetailProductClick(data);
            this.gaEvent(data.product_no, data.title);
            // const node = event.currentTarget;
            // this.props.onClick(node.href);
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

    changeFormatForAvg(str) {
        let changeAvg = str;
        if (changeAvg && changeAvg.indexOf(".") === -1) {
            changeAvg = `${changeAvg}.0`;
        }
        return changeAvg;
    }

    // changeFormatForTags(tags) {
    //     const tagsArr = tags.split(",");
    //     let rTags = tagsArr;
    //
    //     if (tagsArr.length > 1) {
    //         rTags = tagsArr.filter((obj, idx) => { return idx < 8 ? obj : null; });
    //     }
    //
    //     return rTags.join(" ");
    // }

    onLike() {
        if (typeof this.props.onLike === "function") {
            const { data } = this.props;
            this.props.onLike(data);
        }
    }

    render() {
        const { data, defWidth, defHeight } = this.props;
        const props = {
            className: "product_display_bars_container"
        };

        const tags = utils.search.parse(data.tags);
        const is_biz = utils.checkCategoryForEnter(data.category);
        const url = data.category && !is_biz ? `/products/${data.product_no}?new=true` : `/portfolio/${data.product_no}`;

        const content = (
            <div>
                <div className="product_display_bars-info-area">
                    <a className="product_display_bars-info-area-left" href={url} target="_blank" onClick={e => this.onMoveProductDetailPage(e, data)}>
                        <div className="product_display_bars-info-area-left__thumb">
                            <Img image={{ src: data.thumb_img, content_width: defWidth, content_height: defHeight }} isContentResize />
                            <div className="product_display_bars-info-area-left__thumb_more">
                                <i className="m-icon m-icon-more_product" />
                            </div>
                        </div>
                        <div className="product_display_bars-info-area-left__info">
                            <p className="product_display_bars-info-area-left__info-title title-style">{data.title}</p>
                            {is_biz ? null :
                            <p className="product_display_bars-info-area-left__info-price title-style">{utils.format.price(data.price)} 원</p>
                            }
                            <p className="product_display_bars-info-area-left__info-nick_name description-style">{data.nick_name}</p>
                            <p className="product_display_bars-info-area-left__info-col description-style">
                                {data.is_corp === "Y" ? "세금계산서 발행 가능 작가" : ""}
                            </p>
                            {data.rating_avg ?
                                <div className="product_display_bars-info-area-left__info-heart">
                                    <Heart score={data.rating_avg} /><span style={{ color: "#ffba00" }} className="description-style">{this.changeFormatForAvg(data.rating_avg)}</span>
                                    <p className="product_display_bars_info-area-left__info-heart-review description-style">( 후기 {`${data.review_cnt}`}개 )</p>
                                </div> : null
                            }
                        </div>
                    </a>
                    <div className="product_display_bars-info-area-right">
                        <div className="select-like-box" onClick={this.onLike}>
                            <icon className={`m-icon m-icon-heart-${data.is_like === "Y" ? "pink" : "black"}-surface`} />
                        </div>
                    </div>
                </div>
                <div className="product_display_bars-tags-area">
                    <p className="product_display_bars-tags-area-tags description-style">{Array.isArray(tags) ? tags.map((t, i) => <span key={i}>#{t}</span>) : ""}</p>
                </div>
            </div>
        );

        return createElement("li", props, content);
    }
}

ProductListItemBar.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired,
    defWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClick: PropTypes.func
};

ProductListItemBar.defaultProps = {
    defWidth: 504,
    defHeight: 504,
    onClick: null
};

export default ProductListItemBar;
