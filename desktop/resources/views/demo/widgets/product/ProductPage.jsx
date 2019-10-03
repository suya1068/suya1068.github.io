import React, { Component, PropTypes } from "react";
import Product from "desktop/resources/components/product/Product";

/**
 * 상품 컴포넌트 데모 페이지
 */

const product = {
    product_no: 26,
    nick_name: "보리",
    profile_img: "/main/m_pic_04.jpg",
    title: "웨딩사진6",
    thumb_img: "/common/l_tum_img.jpg",
    price: 150000,
    rating_avg: 3.5,
    like_cnt: 9999,
    review_cnt: 1234
};

class ProductPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div>
                <div className="demo-content">
                    <h2>Product Component</h2>
                    <hr />
                    <div>
                        <Product data={product} />
                        <Product data={product} size="large" />
                        <Product data={product} size="small" />
                    </div>
                    <hr />
                </div>
            </div>
        );
    }
}

export default ProductPage;
