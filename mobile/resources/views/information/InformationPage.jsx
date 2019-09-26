import "./InformationPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory } from "react-router";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer } from "mobile/resources/containers/layout";
import PageContainer from "./pages/PageContainer";
import Introduction from "./pages/introduction/Introduction";
import StrongPoint from "./pages/strong_point/StrongPoint";
import ServiceGuide from "./pages/service_guide/ServiceGuide";
import ServicePolicy from "./pages/service_policy/ServicePolicy";
import IntroVideoPage from "./pages/video/IntroVideoPage";
import Price from "./pages/price/Price";
import AppDispatcher from "../../AppDispatcher";
import * as CONST from "../../stores/constants";

class InformationPage extends Component {
    constructor() {
        super();
        this.state = {
            title_list: {
                introduction: { code: "introduction", name: "포스냅소개" },
                "strong-point": { code: "strong-point", name: "작가로 활동하기" },
                "service-guide": { code: "service-guide", name: "이용안내" },
                "service-policy": { code: "service-policy", name: "서비스 정책" }
            }
        };
    }

    componentWillMount() {
        if (!this.props.children) {
            browserHistory.replace("/information/introduction");
        }
    }

    componentDidMount() {
        this.setTitle(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setTitle(nextProps);
    }

    /**
     * 모바일 헤더에 현재 페이지의 타이틀을 설정한다.
     */
    setTitle(props) {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: this.setInformationTitleToHeader(props) });
        }, 0);
    }

    /**
     * 현재 주소에 맞는 타이틀을 설정한다.
     */
    setInformationTitleToHeader(props) {
        const { routes } = props;
        const { title_list } = this.state;
        const current_page = routes[2] && routes[2].path;
        return current_page && title_list[current_page].name;
    }

    render() {
        return (
            <div>
                <HeaderContainer />
                <div className="site-main information__page">
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
            <Route path="/information" component={InformationPage}>
                <Route path="" component={PageContainer}>
                    <Route path="introduction" component={Introduction} />
                    <Route path="strong-point" component={StrongPoint} />
                    <Route path="service-guide" component={ServiceGuide} />
                    <Route path="service-policy" component={ServicePolicy} />
                </Route>
                <Route path="video" component={IntroVideoPage} />
                <Route path="price" component={Price} />
                {/*<Route path="price" component={Price} />*/}
                {/*<Route path="price" component={Price} />*/}
                {/*<Route path="price" component={Price} />*/}
                <Route path="*" component={null} />
            </Route>
        </Router>
    </AppContainer>, document.getElementById("root")
);
