import "./landingPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import DirectionProxyPage from "../event/201907/DirectionProxyPage";
import AppContainer from "mobile/resources/containers/AppContainer";
import { Router, Route, browserHistory, IndexRoute, Link, routerShape } from "react-router";
import LandingSection from "./component/date/201907/LandingSection";
import LandingFooter from "./component/footer/LandingFooter";
import HeaderContainer from "../../containers/layout/header/HeaderContainer";

class LandingPage extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div className="landing__container">
                <HeaderContainer invisible />
                {this.props.children}
            </div>
        );
    }
}

ReactDOM.render(
    <AppContainer>
        <div>
            <Router history={browserHistory}>
                <Route path="/landing" component={LandingPage}>
                    <Route path="201907" component={LandingSection} />
                </Route>
            </Router>
        </div>
        <LandingFooter />
    </AppContainer>,
    document.getElementById("root")
);
