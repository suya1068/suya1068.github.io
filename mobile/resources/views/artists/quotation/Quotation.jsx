import React, { Component, PropTypes } from "react";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer } from "mobile/resources/containers/layout";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";

class Quotation extends Component {
    componentDidMount() {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "견적서 작성" });
        }, 0);
    }

    render() {
        return (
            <div>
                <HeaderContainer />
                <div className="site-main">
                    <LeftSidebarContainer />
                    {this.props.children}
                    <OverlayContainer />
                </div>
            </div>
        );
    }
}

Quotation.propTypes = {
    children: PropTypes.node
};

export default Quotation;
