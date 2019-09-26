import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory } from "react-router";
// import redirect from "mobile/resources/management/redirect";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer } from "mobile/resources/containers/layout";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import QuotationRequest from "./components/QuotationRequest";
import QuotationUser from "./components/QuotationUser";
import QuotationReserve from "./components/QuotationReserve";
import QuotationOptions from "./components/QuotationOptions";
import QuotationContent from "./components/QuotationContent";
import QuotationInspect from "./components/QuotationInspect";
import QuotationComplete from "./components/QuotationComplete";

browserHistory.listen((location, action) => {
    setTimeout(() => { window.scrollTo(0, 1); }, 1);
});

class QuotationRequestPage extends Component {
    componentDidMount() {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "촬영요청" });
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

QuotationRequestPage.propTypes = {
    children: PropTypes.node
};

ReactDOM.render(
    <AppContainer>
        <Router history={browserHistory} >
            <Route path="/users" component={QuotationRequestPage}>
                <Route path="quotation" component={QuotationRequest}>
                    <Route path="basic" component={QuotationUser} />
                </Route>
                <Route path="quotation/:order_no" component={QuotationRequest}>
                    <Route path="basic" component={QuotationUser} />
                    <Route path="category" component={QuotationReserve} />
                    {/*<Route path="quantity" component={QuotationOptions} />*/}
                    <Route path="content" component={QuotationContent} />
                    <Route path="inspect" component={QuotationInspect} />
                    <Route path="complete" component={QuotationComplete} />
                    <Route path="*" component={() => location.replace("/users/estimate")} />
                </Route>
            </Route>
        </Router>
    </AppContainer>,
    document.getElementById("root")
);
