import "./events.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRoute, Link } from "react-router";
import EventContainer from "./components/EventContainer";
import constant from "shared/constant";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer } from "mobile/resources/containers/layout";
import AppContainer from "mobile/resources/containers/AppContainer";
import AppDispatcher from "mobile/resources/AppDispatcher";
import * as CONST from "mobile/resources/stores/constants";

class Events extends Component {
    constructor() {
        super();
        this.state = {
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "페이백이벤트" });
        }, 0);
    }

    render() {
        return (
            <div className="site-main">
                <div className="events-page">
                    <h1 className="sr-only">포스냅 이벤트</h1>
                    <HeaderContainer />
                    <LeftSidebarContainer />
                    {this.props.children}
                    <OverlayContainer />
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <AppContainer>
        <Router history={browserHistory}>
            <Route path="/events/" component={Events}>
                <Route path=":regDt" component={EventContainer} />
                <Route path="*" component={null} />
            </Route>
        </Router>
    </AppContainer>,
    document.getElementById("root")
);
