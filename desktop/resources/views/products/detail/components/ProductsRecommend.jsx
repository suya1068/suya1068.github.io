import "../scss/products_recommend.scss";
import React, { Component, PropTypes } from "react";
import Profile from "desktop/resources/components/image/Profile";
import Heart from "desktop/resources/components/form/Heart";
import utils from "forsnap-utils";
import Img from "shared/components/image/Img";
import A from "shared/components/link/A";

export default class ProductsRecommend extends Component {
    /**
     * 추천상품 하단의 태그 표시
     * @param tags
     * @returns {string}
     */
    recomSetCommaSplit(tags = "") {
        let hashTags = "";
        tags.split(",").forEach(item => {
            hashTags += `#${item} `;
        });
        return hashTags;
    }

    onMoveProduct(e, item) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("추천상품", `작가명: ${item.nick_name} / 상품번호: ${item.product_no} / 상품명: ${item.title}`);
        }
    }

    render() {
        const { list } = this.props;
        if (list && list.length > 0) {
            return (
                <div className="products__detail__recommend">
                    <div className="container">
                        <div className="recommend__title">
                            <h2 className="h6 text-bold">포스냅 추천상품</h2>
                        </div>
                        <div>
                            {list.map((panelItem, idx) => {
                                const is_biz = utils.checkCategoryForEnter(panelItem.category);
                                const url = is_biz ? `/portfolio/${panelItem.product_no}` : `/products/${panelItem.product_no}?new=true`;
                                return (
                                    <A
                                        href={url}
                                        target="_blank"
                                        key={`product_forsnap_recommend_products__${idx}`}
                                        onClick={e => this.onMoveProduct(e, panelItem)}
                                    >
                                        <div className="panel columns col-3">
                                            <Img image={{ src: panelItem.thumb_img }} />
                                            <div className="panel-wrapBG">
                                                <div className="panel-info">
                                                    <Profile image={{ src: panelItem.profile_img }} size="medium" />
                                                    <p className="author_nick">{panelItem.nick_name}</p>
                                                    <div className="panel-info__state">
                                                        <Heart count={panelItem.rating_avg} disabled="disabled" size="small" />
                                                        <p>{`${utils.format.price(panelItem.price)}원`}</p>
                                                        <p className="panel-tag">{this.recomSetCommaSplit(panelItem.tag)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </A>
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

ProductsRecommend.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node]))
};
