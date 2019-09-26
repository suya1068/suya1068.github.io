import React, { Component } from "react";
import ReactDOM from "react-dom";

// layouts
import App from "desktop/resources/components/App";
// import Header from "desktop/resources/components/layout/header/Header";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Footer from "desktop/resources/components/layout/footer/Footer";
import ScrollTop from "desktop/resources/components/scroll/ScrollTop";

// global utils
import redirect from "forsnap-redirect";
import utils from "forsnap-utils";

// common components
import PopModal from "shared/components/modal/PopModal";

// page component
import ProductsDetailPage from "./ProductsDetailPage";
import ProductDetailBusiness from "./business/ProductDetailBusiness";

const responseData = document.getElementById("product-data").getAttribute("content");
// const isEvent = document.getElementById("event").getAttribute("content");

class ProductsDetailContainer extends Component {
    constructor() {
        super();
        this.state = {
            // event: isEvent && JSON.parse(isEvent)
        };
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        const result = JSON.parse(responseData);
        const status = result.status;
        this.state.status = status;
        this.state.data = result.data;
        const emptyAlam = "해당 상품은 마감된 상품입니다.";

        if (status === 400) {
            PopModal.alert(emptyAlam, { callBack: () => {
                redirect.main();
            } });
        } else if (status === 404) {
            PopModal.alert(emptyAlam, { callBack: () => {
                redirect.main();
            } });
        } else if (status !== 200) {
            redirect.main();
        // } else if (result.data.category && utils.checkCategoryForEnter(result.data.category)) {
            // location.href = `/portfolio/${result.data.product_no}`;
            // console.log("까꿍");
        }
    }

    componentDidMount() {
    }

    gaEvent(action) {
        const { data } = this.state;
        utils.ad.gaEvent("기업_상세", action, `${data.category}_${data.nick_name}_${data.product_no}`);
    }

    render() {
        const { data, status } = this.state;

        if (status !== 200) {
            return null;
        }

        const isBusiness = !!(data.category && utils.checkCategoryForEnter(data.category)) || false;

        return (
            <App>
                <HeaderContainer category={data.category || ""} />
                <div className="site-main" id="site-main">
                    {isBusiness
                        ? <ProductDetailBusiness data={data} />
                        : <ProductsDetailPage data={data} />
                    }
                </div>
                <Footer>
                    <ScrollTop category={data.category} product_no={data.product_no} gaEvent={this.gaEvent} />
                </Footer>
            </App>
        );
    }
}

ReactDOM.render(
    <ProductsDetailContainer />,
    document.getElementById("root")
);
