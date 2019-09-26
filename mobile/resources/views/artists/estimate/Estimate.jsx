import "./estimate.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRoute } from "react-router";
import CONSTANT from "shared/constant";
import cookie from "forsnap-cookie";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer } from "mobile/resources/containers/layout";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import EstimateListContainer from "./estimateList/EstimateListContainer";
import EstimateDetail from "./estimateDetail/EstimateDetail";
import EstimateOfferDetail from "./estimateOfferDetail/EstimateOfferDetail";
import EstimateContainer from "./estimateContainer/EstimateContainer";
import EstimateAbout from "./estimateAbout/EstimateAbout";

import Quotation from "../quotation/Quotation";
import QuotationResponse from "../quotation/components/QuotationResponse";
import QuotationUser from "../quotation/components/QuotationUser";
import QuotationOptions from "../quotation/components/QuotationOptions";
import QuotationPrice from "../quotation/components/QuotationPrice";
import QuotationContent from "../quotation/components/QuotationContent";
import QuotationSubmit from "../quotation/components/QuotationSubmit";
import QuotationComplete from "../quotation/components/QuotationComplete";

class ArtistEstimate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enter: cookie.getCookies(CONSTANT.USER.ENTER),
            enter_session: sessionStorage.getItem(CONSTANT.USER.ENTER)
        };
    }

    componentWillMount() {
        const { enter, enter_session } = this.state;
        if (enter) {
            cookie.removeCookie(CONSTANT.USER.ENTER);
        }

        if (enter_session) {
            sessionStorage.removeItem(CONSTANT.USER.ENTER);
        }

        if (!this.props.children) {
            browserHistory.replace("/artists/estimate/list");
        }
        this.setTitle();
    }

    componentDidMount() {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: this.setTitle() });
        }, 0);
    }

    componentWillReceiveProps(nextProps) {
        const c_routes = this.props.routes;
        const n_routes = nextProps.routes;
        if (c_routes && c_routes[1] && c_routes[1].path !== n_routes && n_routes[1] && n_routes[1].path) {
            setTimeout(() => {
                AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: this.setTitle() });
            }, 0);
        }
    }

    setTitle() {
        const offer_no = this.props.params.offer_no;
        const order_no = this.props.params.order_no;
        const routes = this.props.routes;
        let title = "촬영요청 리스트";
        if (offer_no) {
            title = "견적서 자세히 보기";
        } else if (order_no) {
            title = "촬영요청 보기";
        } else if (routes && routes[1] && routes[1].path === "about") {
            title = "촬영요청 이용안내";
        }
        return title;
    }

    render() {
        return (
            <div>
                <HeaderContainer />
                <div className="site-main">
                    <LeftSidebarContainer />
                    {this.props.children}
                    <OverlayContainer />
                </div>
            </div>
        );
    }
}

ArtistEstimate.propTpyes = {
    children: PropTypes.node
};

ReactDOM.render(
    <AppContainer roles={["artist"]}>
        <Router history={browserHistory}>
            <Route path="/artists/estimate" component={ArtistEstimate}>
                <IndexRoute component={EstimateContainer} />
                <Route path="about" component={EstimateContainer}>
                    <IndexRoute component={EstimateAbout} />
                </Route>
                <Route path="list" component={EstimateContainer}>
                    <IndexRoute component={EstimateListContainer} />
                    <Route path="list?page=(:page_no)" component={EstimateListContainer} />
                    <Route path="/artists/estimate/(:order_no)" component={EstimateDetail} />
                    <Route path="/artists/estimate/(:order_no)/offer(/:offer_no)" component={EstimateOfferDetail} />
                    <Route path="*" component={null} />
                </Route>
                <Route path="*" component={null} />
            </Route>
            <Route path="/artists/quotation" component={Quotation}>
                <IndexRoute component={QuotationResponse} />
                <Route path=":order_no" component={QuotationResponse}>
                    <IndexRoute component={QuotationUser} />
                    <Route path="basic" component={QuotationUser} />
                    <Route path="quantity" component={QuotationOptions} />
                    <Route path="option" component={QuotationPrice} />
                    <Route path="content" component={QuotationContent} />
                    <Route path="submit" component={QuotationSubmit} />
                    <Route path="complete" component={QuotationComplete} />
                    <Route path="*" component={() => location.replace("/")} />
                </Route>
            </Route>
        </Router>
    </AppContainer>,
    document.getElementById("root")
);
