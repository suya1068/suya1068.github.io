import "./events.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRoute, Link } from "react-router";
import App from "desktop/resources/components/App";
import EventContainer from "./components/EventContainer";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";

class Events extends Component {
    render() {
        return (
            <div className="events-page">
                <HeaderContainer />
                <h1 className="sr-only">포스냅 이벤트</h1>
                {this.props.children}
            </div>
        );
    }
}

ReactDOM.render(
    <App>
        <Router history={browserHistory}>
            <Route path="/events/" component={Events}>
                <Route path=":regDt" component={EventContainer} />
                <Route path="*" component={null} />
            </Route>
        </Router>
    </App>,
    document.getElementById("root")
);
