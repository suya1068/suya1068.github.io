import "./Information.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRoute } from "react-router";

import APP from "desktop/resources/components/App";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";

import InformationContainer from "./InformationContainer";
import Introduction from "./pages/introduction/Introduction";
import StrongPoint from "./pages/strong_point/StrongPoint";
import ServiceGuide from "./pages/service_guide/ServiceGuide";
import ServicePolicy from "./pages/service_policy/ServicePolicy";
import BrandGuide from "./pages/brand_guide/BrandGuide";
import IntroVideoPage from "./pages/video/IntroVideoPage";
import Price from "./pages/price/Price";


class Information extends Component {
    componentWillMount() {
        if (!this.props.children) {
            browserHistory.replace("/information/introduction");
        }
    }

    render() {
        return (
            <div>
                <HeaderContainer />
                <div className="information">
                    <main id="site-main">
                        {this.props.children}
                    </main>
                </div>
            </div>
        );
    }
}

Information.propTypes = {
    children: PropTypes.node
};

ReactDOM.render(
    <APP>
        <Router history={browserHistory}>
            <Route path="/information" component={Information}>
                <Route path="" component={InformationContainer}>
                    <Route path="/information/introduction" component={Introduction} />
                    <Route path="/information/strong-point" component={StrongPoint} />
                    <Route path="/information/service-guide" component={ServiceGuide} />
                    <Route path="/information/service-policy" component={ServicePolicy} />
                    <Route path="/information/brand-guide" component={BrandGuide} />
                    <Route path="/information/video" component={IntroVideoPage} />
                    <Route path="/information/price" component={Price} />
                </Route>
                {/*<IndexRoute component={Introduction} />*/}
                {/*<Route path="/information/awesome" component={Awesome} />*/}
                {/*<Route path="/information/photographer" component={Photographer} />*/}
                {/*<Route path="/information/reason" component={Reason} />*/}
                {/*<Route path="/information/sign" component={Sign} />*/}
                <Route path="*" component={null} />
            </Route>
        </Router>
    </APP>, document.getElementById("root")
);
