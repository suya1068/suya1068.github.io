import "./customer_center.scss";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Route, Router, browserHistory, routerShape } from "react-router";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer, Footer } from "mobile/resources/containers/layout";
import QnaContainer from "./components/qna/QnaContainer";
import Info from "./components/info/Info";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

class CustomerCenter extends Component {
    constructor() {
        super();
        this.state = {};
    }

    componentWillMount() {
        if (!this.props.children) {
            browserHistory.replace("/cs/qna");
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <section className="customer-center cs">
                <h2 className="sr-only">고객센터</h2>
                <Info />
                {this.props.children}
            </section>
        );
    }
}

CustomerCenter.contextTypes = {
    router: routerShape
};

ReactDOM.render(
    <AppContainer>
        <HeaderContainer />
        <div className="site-main">
            <LeftSidebarContainer />
            <Router history={browserHistory}>
                <Route path="cs" component={CustomerCenter}>
                    <Route path="qna" component={QnaContainer} />
                    <Route path="*" component={null} />
                </Route>
            </Router>
            <OverlayContainer />
        </div>
        <Footer>
            <ScrollTop />
        </Footer>
    </AppContainer>,
    document.getElementById("root")
);
