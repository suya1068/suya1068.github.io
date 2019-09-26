import "./customerCenter.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRoute, Link } from "react-router";
import APP from "desktop/resources/components/App";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Footer from "desktop/resources/components/layout/footer/Footer";
import ScrollTop from "desktop/resources/components/scroll/ScrollTop";

//component
// import NoticeBoard from "./component/NoticeBoard";
import QnABoard from "./component/QnABoard";

class CustomerCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div className="customerCenter-page">
                <HeaderContainer />
                <main id="site-main" className="site_main">
                    {this.props.children}
                </main>
                <Footer>
                    <ScrollTop />
                </Footer>
            </div>
        );
    }
}

CustomerCenter.propTypes = {
    children: PropTypes.node
};

ReactDOM.render(
    <APP>
        <Router history={browserHistory}>
            <Route path="/cs" component={CustomerCenter}>
                <IndexRoute component={QnABoard} />
                {/*<Route path="notice" component={NoticeBoard} />*/}
                <Route path="qna" component={QnABoard} />
            </Route>
        </Router>
    </APP>,
    document.getElementById("root")
);
