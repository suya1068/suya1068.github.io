import React, { Component, PropTypes } from "react";
// import classnames from "classnames";

import redirect from "forsnap-redirect";

import ProductsList from "./ProductsList";
import ProductsListOpenEstimate from "./open/ProductList";
import PopModal from "shared/components/modal/PopModal";
import utils from "forsnap-utils";

class ProductsContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            result: JSON.parse(props.data),
            params: JSON.parse(props.params),
            // seo: JSON.parse(props.seo),
            category: []
        };
    }

    componentWillMount() {
        const { result } = this.state;
        if (result.status === 200) {
            if (document.getElementById("category-data")) {
                const content = document.getElementById("category-data").getAttribute("content");
                this.state.category = content ? JSON.parse(content) : [];
            }
        } else {
            PopModal.alert(result.message, { callBack: () => {
                redirect.main();
            } });
        }
    }

    render() {
        const { result, params, category } = this.state;
        const data = result.data || {};
        let component;
        if (result.status === 200) {
            component = ["EVENT", "PRODUCT", "BEAUTY", "FOOD", "FASHION", "INTERIOR", "PROFILE_BIZ", "VIDEO_BIZ"].indexOf(params.category) === -1
                ? <ProductsList data={data} params={params} category={category} />
                : <ProductsListOpenEstimate data={data} params={params} category={category} />;
        }
        return component;
    }
}

ProductsContainer.propTypes = {
    // seo: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    params: PropTypes.string.isRequired
};

export default ProductsContainer;
