import "./subHeader.scss";
import React, { Component } from "react";
import utils from "shared/helper/utils";
import A from "shared/components/link/A";
import classNames from "classnames";

export default class SubHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryList: props.categoryList,
            enter: props.enter,
            category: props.category,
            isLogin: props.isLogin,
            isArtist: props.isArtist
        };
    }

    componentWillMount() {
        const { category } = this.props;
        if (!category) {
            this.setCategory();
        }
        this.setProductData();
    }

    /**
     * 상품정보를 저장한다.
     */
    setProductData() {
        const responseData = document.getElementById("product-data");
        let data = {};
        if (responseData) {
            const getAtt = responseData.getAttribute("content");
            data = JSON.parse(getAtt).data;
            this.state.productData = data;
        }
    }


    /**
     * 상품상세, 상품리스트에서 header gnb 를 위한 카테고리를 파싱한다.
     */
    setCategory() {
        const search = location.search;
        let category = "";

        if (location.pathname.startsWith("/products") && search) {
            const searchResult = utils.query.parse(search);
            if (searchResult && searchResult.category) {
                category = searchResult.category;
            }
        } else if (location.pathname.startsWith("/information/video")) {
            category = "VIDEO";
        }
        this.setState({
            category
        });
    }


    gaEventTrackForSearch(category) {
        utils.ad.gaEvent("공통", "GNB_카테고리 선택", category);
    }

    render() {
        const { enter, categoryList, category } = this.state;
        const { isArtist, isLogin } = this.props;

        return (
            <div id="sub-header" className="sub-header">
                <div className="container">
                    <div className="sub-header__left-content">
                        {categoryList.map((obj, idx) => {
                            return (
                                <div
                                    className={classNames("gnb-item", { "is_select": category && category.toUpperCase() === obj.code })}
                                    key={`header-gnb__${idx}`}
                                    onClick={() => this.gaEventTrackForSearch(obj.code)}
                                >
                                    <A href={`/products?category=${obj.code}`}>
                                        {`${obj.name}${obj.code === "DRESS_RENT" ? "" : "촬영"}`}
                                    </A>
                                </div>
                            );
                        })}
                        {!enter ?
                            <a href="/products/concept/product" onClick={() => utils.ad.gaEvent("기업_컨셉", "GNB버튼", "GNB버튼")}><button className="btn_concept">빠른컨셉검색</button></a>
                            : null
                        }
                    </div>
                    <div className="sub-header__right-content">
                        {!isArtist && !enter &&
                            <div className="sub-header__right-content__csButton">
                                <span style={{ color: "#f89d06", marginRight: 5, fontSize: 15 }}>빠른상담전화</span>
                                <span style={{ fontWeight: "bold", fontSize: 15 }}>070-4060-4406</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
