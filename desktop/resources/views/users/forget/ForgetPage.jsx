import "./ForgetPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import auth from "forsnap-authentication";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import App from "desktop/resources/components/App";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Footer from "desktop/resources/components/layout/footer/Footer";

import ForgetEmail from "./components/ForgetEmail";
import ForgetPassword from "./components/ForgetPassword";

class ForgetPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            process: false,
            loading: false,
            tab: ""
        };

        this.onTab = this.onTab.bind(this);

        this.renderTab = this.renderTab.bind(this);
    }

    componentWillMount() {
        const user = auth.getUser();
        if (user) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "로그아웃 후 이메일/비밀번호 찾기가 가능합니다.",
                onSubmit: () => {
                    location.href = "/";
                }
            });
        } else {
            this.state.loading = true;
            this.state.tab = "email";
        }

        this.setStateData = this.setStateData.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onTab(tab) {
        this.setStateData(() => {
            return {
                tab
            };
        });
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    renderTab() {
        const { tab } = this.state;

        switch (tab) {
            case "email":
                return <ForgetEmail />;
            case "password":
                return <ForgetPassword />;
            default:
                return null;
        }
    }

    render() {
        const { loading, tab } = this.state;

        if (!loading) {
            return null;
        }

        return (
            <div id="site-main">
                <div className="forget__container">
                    <div className="forget__content">
                        <div className="forget__tab">
                            <div className={classNames({ active: tab === "email" })} onClick={() => this.onTab("email")}><h2 className="title">아이디 찾기</h2></div>
                            <div className={classNames({ active: tab === "password" })} onClick={() => this.onTab("password")}><h2 className="title">비밀번호 찾기</h2></div>
                        </div>
                        <div className="forget__tab__content">
                            {this.renderTab()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App>
        <HeaderContainer />
        <ForgetPage />
        <Footer />
    </App>,
    document.getElementById("root")
);
