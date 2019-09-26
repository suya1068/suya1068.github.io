import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import Img from "shared/components/image/Img";
import constant from "shared/constant";
import cookie from "forsnap-cookie";

class ProductsRecommend extends Component {
    // gaEvent(title, price, no) {
    //     const eCategory = "상품상세";
    //     const eAction = "포스냅 추천상품";
    //     const eLabel = `상품명: ${title}, 가격: ${price} 상품번호: ${no}`;
    //     utils.ad.gaEvent(eCategory, eAction, eLabel);
    // }

    onMoveProduct(e, item) {
        e.preventDefault();
        // this.gaEvent(item.title, item.price, item.product_no);
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("추천상품", `작가명: ${item.nick_name} / 상품번호: ${item.product_no} / 상품명: ${item.title}`)
        }
        const enter = cookie.getCookies(constant.USER.ENTER);

        const enter_session = sessionStorage.getItem(constant.USER.ENTER);
        const url = e.currentTarget.href;
        const category = item.category;
        let targetWindow = window;

        if (typeof enter === "string" && enter === "indi" && enter_session) {
            targetWindow.location.href = url;
            return;
        }

        if (!utils.checkCategoryForEnter(category)) {
            targetWindow = window.open();
            targetWindow.opener = null;
            targetWindow.location.href = `${url}?new=true`;
        } else {
            targetWindow.location.href = (enter && !enter_session) ? `${url}?biz=true` : url;
        }
    }

    render() {
        const recommList = this.props.recommList;

        if (recommList && recommList.length > 0) {
            return (
                <div className="products__detail__recomm">
                    <h3 className="recomm__title">포스냅 추천상품</h3>
                    <div className="products__detail__recomm__list">
                        {recommList.map((item, i) => {
                            const is_biz = utils.checkCategoryForEnter(item.category);
                            const url = is_biz ? `/portfolio/${item.product_no}` : `/products/${item.product_no}?new=true`;
                            return (
                                <a
                                    key={`recomm-number-${i}`}
                                    className="detail__recomm__item"
                                    onClick={e => this.onMoveProduct(e, item)}
                                    href={url}
                                >
                                    <div className="recomm__item__thumb">
                                        <Img image={{ src: item.thumb_img, content_width: 200, content_height: 200 }} isContentResize />
                                    </div>
                                    <div className="recomm__item__info">
                                        <div className="title">
                                            {item.title}
                                        </div>
                                        <div className="price">
                                            {utils.format.price(item.price)}<span className="won">원</span>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            );
        }

        return null;
    }
}

ProductsRecommend.propTypes = {
    recommList: PropTypes.arrayOf(PropTypes.shape([PropTypes.node]))
};

export default ProductsRecommend;
