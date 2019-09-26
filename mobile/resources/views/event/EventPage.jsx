import "./EventPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRoute, Link, routerShape } from "react-router";

import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer, Footer } from "mobile/resources/containers/layout";

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
    <AppContainer>
        <HeaderContainer />
        <div className="site-main">
            <LeftSidebarContainer />
            <Router history={browserHistory}>
                <Route path="/event" component={EventPage}>
                    <Route path="201907" component={DirectionProxyPage} />
                </Route>
            </Router>
            <OverlayContainer />
        </div>
        <Footer />
    </AppContainer>,
    document.getElementById("root")
);
