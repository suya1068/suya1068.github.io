import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import utils from "forsnap-utils";
import redirect from "forsnap-redirect";

import PopModal from "shared/components/modal/PopModal";
// import classnames from "classnames";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer } from "mobile/resources/containers/layout";
// import ProductListPage from "./ProductsListPage";
import ProductList from "./list/ProductList";
import ProductsListOpenEstimate from "./list/open/ProductOpenList";
// import ProductsListOpenEstimate from "./list/open/ProductOpenList";
// import ProductNoneList from "./list/ProductNoneList";

const d_data = document.getElementById("product-data").getAttribute("content");
const d_params = document.getElementById("params").getAttribute("content");
// const isEvent = document.getElementById("event").getAttribute("content");
// import utils from "forsnap-utils";

class ProductListContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: JSON.parse(d_data),
            params: JSON.parse(d_params),
            category: []
        };

        this.gaEventHeader = this.gaEventHeader.bind(this);
    }

    componentWillMount() {
        const { result } = this.state;
        if (result.status === 200) {
            if (document.getElementById("category-data")) {
                const content = document.getElementById("category-data").getAttribute("content");
                // const time_flag = utils.stringToBoolen(document.getElementById("time_flag").getAttribute("content"));
                this.state.category = content ? JSON.parse(content) : [];
                // this.state.time_flag = time_flag
            }
        } else {
            PopModal.alert(result.message, { callBack: () => {
                redirect.main();
            } });
        }
    }

    gaEventHeader(action, label) {
        utils.ad.gaEvent("M_기업_리스트", action, label);
    }

    render() {
        const { result, params, category } = this.state;

        const session = result.session_info;
        const data = result.data;
        const id = session && session.is_login ? session.user_id : "";
        let component;

        if (result.status === 200) {
            component = ["EVENT", "PRODUCT", "BEAUTY", "FOOD", "FASHION", "INTERIOR", "PROFILE_BIZ", "VIDEO_BIZ"].indexOf(params.category) === -1
                ? <ProductList data={data} params={params} category={category} />
                : <ProductsListOpenEstimate data={data} params={params} category={category} />;
        }

        return (
            <AppContainer>
                <HeaderContainer category={params.category} gaEvent={this.gaEventHeader} />
                <div className="site-main">
                    <LeftSidebarContainer />
                    {component}
                    <OverlayContainer />
                </div>
            </AppContainer>
        );
    }
}

ReactDOM.render(
    <ProductListContainer />,
    document.getElementById("root")
);
