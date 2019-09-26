import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRoute } from "react-router";
import AppContainer from "mobile/resources/containers/AppContainer";

import Quotation from "./Quotation";
import QuotationResponse from "./components/QuotationResponse";
import QuotationUser from "./components/QuotationUser";
// import QuotationOptions from "./components/QuotationOptions";
import QuotationPrice from "./components/QuotationPrice";
import QuotationContent from "./components/QuotationContent";
import QuotationSubmit from "./components/QuotationSubmit";
import QuotationComplete from "./components/QuotationComplete";

ReactDOM.render(
    <AppContainer>
        <Router history={browserHistory} >
            <Route path="/artists/quotation" component={Quotation}>
                <IndexRoute component={QuotationResponse} />
                <Route path=":order_no" component={QuotationResponse}>
                    <IndexRoute component={QuotationUser} />
                    <Route path="basic" component={QuotationUser} />
                    {/*<Route path="quantity" component={QuotationOptions} />*/}
                    <Route path="option" component={QuotationPrice} />
                    <Route path="content" component={QuotationContent} />
                    <Route path="submit" component={QuotationSubmit} />
                    <Route path="complete" component={QuotationComplete} />
                    <Route path="*" component={() => location.replace("/")} />
                </Route>
            </Route>
        </Router>
    </AppContainer>,
    document.getElementById("root")
);
