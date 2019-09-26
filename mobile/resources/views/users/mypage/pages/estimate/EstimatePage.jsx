import "./estimatePage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRoute } from "react-router";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer, Footer } from "mobile/resources/containers/layout";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import EstimateOfferDetail from "./estimateOfferDetail/EstimateOfferDetail";
import utils from "forsnap-utils";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

class UserEstimate extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        if (!this.props.children) {
            location.href = "/users/myaccount";
        }
    }

    componentDidMount() {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: this.setTitle() });
        }, 0);
    }

    /**
     * 페이지의 upperState 타이틀을 변경한다.
     * @returns {string}
     */
    setTitle() {
        const offer_no = this.props.params.offer_no;
        // const order_no = this.props.params.order_no;
        // let title = "촬영요청 리스트";
        let title = "";
        if (offer_no) {
            title = "견적서 자세히 보기";
        // } else if (order_no) {
        //     title = "촬영요청 보기";
        }
        return title;
    }

    render() {
        return (
            <div>
                <HeaderContainer />
                <div className="site-main users-estimate">
                    <LeftSidebarContainer />
                    {this.props.children}
                    {utils.agent.isMobile()
                        ?
                            <div className="desktop-estimate">
                                <Footer>
                                    <ScrollTop />
                                </Footer>
                            </div>
                        : null
                    }
                    <OverlayContainer />
                </div>
            </div>
        );
    }
}

UserEstimate.propTpyes = {
    children: PropTypes.node
};


ReactDOM.render(
    <AppContainer roles={["customer"]}>
        <Router history={browserHistory}>
            <Route path="/users/estimate" component={UserEstimate}>
                <Route path="(:order_no)/offer(/:offer_no)" component={EstimateOfferDetail} />
                <Route path="*" component={null} />
            </Route>
        </Router>
    </AppContainer>,
    document.getElementById("root")
);
