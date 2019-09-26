import "./EventPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRoute, Link, routerShape } from "react-router";

import App from "desktop/resources/components/App";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Footer from "desktop/resources/components/layout/footer/Footer";

import EventNonExistentPage from "./EventNonExistentPage";
import DirectionProxyPage from "./201907/DirectionProxyPage";

class EventPage extends Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

ReactDOM.render(
    <App>
        <HeaderContainer />
        <div id="site-main">
            <Router history={browserHistory}>
                <Route path="/event" component={EventPage}>
                    <Route path="201907" component={DirectionProxyPage} />
                </Route>
            </Router>
        </div>
        <Footer />
    </App>,
    document.getElementById("root")
);
