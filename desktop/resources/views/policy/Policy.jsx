import "./policy.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import APP from "desktop/resources/components/App";
import { Router, Route, browserHistory, IndexRoute, Link } from "react-router";
import Footer from "desktop/resources/components/layout/footer/Footer";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Navigation from "desktop/resources/components/layout/navigation/Navigation";
import { navUrlData } from "./policy_config";
import Term from "./Term";
import PrivacyPolicy from "./PrivacyPolicy";
import ScrollTop from "desktop/resources/components/scroll/ScrollTop";

class Policy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navigationData: navUrlData
        };
    }

    componentWillMount() {
        if (!this.props.children) {
            browserHistory.replace("/policy/private");
        }
        window.addEventListener("scroll", this.onScroll, false);
    }

    componentDidMount() {
        const browserNotice = document.getElementById("browser_notice");

        if (browserNotice) {
            const nav = document.querySelector(".nav-default");
            nav.style.position = "relative";
        }
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll, false);
    }

    onScroll(e) {
        const browserNotice = document.getElementById("browser_notice");
        const scrollY = typeof window.scrollY === "undefined" ? window.pageYOffset : window.scrollY;
        const nav = document.querySelector(".nav-default");
        const browserNoticeHeight = 60;

        if (browserNotice) {
            const navTarget = nav || false;
            if (navTarget && scrollY && scrollY > browserNoticeHeight && navTarget.style.position && navTarget.style.position !== "fixed") {
                navTarget.style.top = `${browserNoticeHeight}px`;
                navTarget.style.position = "fixed";
            } else if (navTarget && scrollY && scrollY < browserNoticeHeight && navTarget.style.position && navTarget.style.position === "fixed") {
                navTarget.style.top = "auto";
                navTarget.style.position = "relative";
            }
        } else {
            const navTarget = nav || false;
            if (navTarget && navTarget.style.position && navTarget.style.position !== "fixed") {
                navTarget.style.top = `${browserNoticeHeight}px`;
                navTarget.style.position = "fixed";
            }
        }
    }

    render() {
        return (
            <div className="policy" >
                <HeaderContainer />
                <Navigation navData={this.state.navigationData} />
                <main id="site_main" className="site_main">
                    {this.props.children}
                </main>
                <Footer>
                    <ScrollTop />
                </Footer>
            </div>
        );
    }
}

Policy.propTypes = {
    children: PropTypes.node
};

ReactDOM.render(
    <APP>
        <Router history={browserHistory}>
            <Route path="/policy" component={Policy}>
                <IndexRoute component={PrivacyPolicy} />
                <Route path="/policy/private" component={PrivacyPolicy} />
                <Route path="/policy/term" component={Term} />
                <Route path="*" component={null} />
            </Route>
        </Router>
    </APP>, document.getElementById("root")
);
