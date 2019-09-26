import "./products.scss";
import React from "react";
import { render } from "react-dom";

import App from "desktop/resources/components/App";
import ProductsContainer from "./components/ProductsListContainer";

// const seo = document.getElementById("seo").getAttribute("content");
const responseData = document.getElementById("product-data").getAttribute("content");
const params = document.getElementById("params").getAttribute("content");

render(
    <App>
        <ProductsContainer data={responseData} params={params} />
    </App>, document.getElementById("root")
);
