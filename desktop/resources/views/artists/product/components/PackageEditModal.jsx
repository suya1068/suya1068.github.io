import "../scss/PackageEditModal.scss";
import React, { Component, PropTypes } from "react";

import PackagePage from "../package/PackagePage";

class PackageEditModal extends Component {
    render() {
        const { product_no, path } = this.props;

        return (
            <div className="package__edit__modal">
                <PackagePage productNo={product_no} path={path} />
            </div>
        );
    }
}

export default PackageEditModal;
