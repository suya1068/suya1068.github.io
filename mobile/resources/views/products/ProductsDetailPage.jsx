import React, { Component } from "react";
import ReactDOM from "react-dom";
import redirect from "forsnap-redirect";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer } from "mobile/resources/containers/layout";
import PopModal from "shared/components/modal/PopModal";
import ProductPackage from "./package/ProductPackage";
import utils from "forsnap-utils";
import ProductDetailBusiness from "./detail/business/ProductDetailBusiness";

const responseData = document.getElementById("product-data").getAttribute("content");
// const isEvent = document.getElementById("event").getAttribute("content");

class ProductsDetailContainer extends Component {
    constructor() {
        super();
        this.state = {
            // event: JSON.parse(isEvent)
        };
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
            // 서버에서 리다이렉트 했음에도 불구하고 들어오는 경우에는 강제로 포폴페이지로 보낸다.
            // location.href = `/portfolio/${result.data.product_no}`;
        }
    }

    componentDidMount() {
    }

    render() {
        const { data, status } = this.state;

        if (status !== 200) {
            return null;
        }

        return (
            <AppContainer>
                <HeaderContainer category={data.category} />
                <div className="site-main">
                    <LeftSidebarContainer />
                    {utils.checkCategoryForEnter(data.category) ?
                        <ProductDetailBusiness data={data} /> :
                        <ProductPackage data={data} />
                    }
                    <OverlayContainer />
                </div>
            </AppContainer>
        );
    }
}

ReactDOM.render(
    <ProductsDetailContainer />,
    document.getElementById("root")
);
