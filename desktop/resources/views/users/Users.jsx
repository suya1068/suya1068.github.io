import "./users.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRoute, Link } from "react-router";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Footer from "desktop/resources/components/layout/footer/Footer";
import Navigation from "desktop/resources/components/layout/navigation/Navigation";
import App from "desktop/resources/components/App";
import cookie from "forsnap-cookie";
import CONSTANT from "shared/constant";
import ScrollTop from "desktop/resources/components/scroll/ScrollTop";

// import utils from "forsnap-utils";

/// mypage component
import MyAccount from "./mypage/myAccount/MyAccount";
import UsersLeave from "./mypage/leave/UsersLeave";
import HeartContainer from "./mypage/myHeart/HeartContainer";
import navUrlData from "./users_config";
import MyChat from "./mypage/chat/ChatPage";
import MyProgress from "./mypage/myProgress/MyProgress";
import RegistArtist from "./mypage/myAccount/regArtist/RegistArtist";
// import ServiceHistory from "./mypage/myHistroy/ServiceHistory_bk";
import ServiceHistory from "./mypage/myHistroy/ServiceHistory";
import RegArtistHeader from "./mypage/myAccount/regArtist/RegAritstHeder";
// estimate Components
import EstimateOfferDetail from "mobile/resources/views/users/mypage/pages/estimate/estimateOfferDetail/EstimateOfferDetail";

browserHistory.listen((location, action) => {
    setTimeout(() => { window.scrollTo(0, 1); }, 1);
});

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUrl: "",
            testNav: navUrlData,
            enter: cookie.getCookies(CONSTANT.USER.ENTER),
            enter_session: sessionStorage.getItem(CONSTANT.USER.ENTER)
        };
    }

    componentWillMount() {
        if (!this.props.children) {
            browserHistory.replace("/users/myaccount");
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

    componentWillReceiveProps(nextProps) {
        // const testNav = this.state.testNav;
        // const path = location.pathname;
        // if (path.startsWith("/users/estimate")) {
        //     testNav[5].restUrl = "/estimate";
        // } else if (path.startsWith("/users/quotation")) {
        //     testNav[5].restUrl = "/quotation";
        // }

        if (!nextProps.children) {
            browserHistory.replace("/users/myaccount");
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
        const content = [];
        if (location.pathname !== "/users/registartist") {
            content.push(
                <Navigation navData={this.state.testNav} key="userKey" />
            );
        } else {
            content.push(
                <RegArtistHeader key="regartistheader" />
            );
        }

        const childWithProp = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, { enter: this.state.enter, enter_session: this.state.enter_session });
        });

        return (
            <div className="users-page">
                <HeaderContainer />
                {content}
                <main id="site_main">
                    <div className="users-container-center">
                        <div className="container">
                            {/*{this.props.children}*/}
                            {childWithProp}
                        </div>
                    </div>
                </main>
                <Footer>
                    <ScrollTop />
                </Footer>
            </div>
        );
    }
}

Users.propTypes = {
    children: PropTypes.node
};

ReactDOM.render(
    <App roles={["customer"]}>
        <Router history={browserHistory}>
            <Route path="/users" component={Users}>
                <IndexRoute component={MyAccount} />
                <Route path="myaccount" component={MyAccount} />
                <Route path="myaccount/leave" component={UsersLeave} />
                <Route path="like" component={HeartContainer} />
                <Route path="chat(/:user_id(/offer/:offer_no)(/:product_no))" component={MyChat} />
                <Route path="progress(/:status)" component={MyProgress} />
                <Route path="registartist" component={RegistArtist} />
                <Route path="history(/:type)" component={ServiceHistory} />
                <Route path="*" component={null} />
            </Route>
        </Router>
    </App>,
    document.getElementById("root")
);
