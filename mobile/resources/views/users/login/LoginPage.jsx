import "./LoginPage.scss";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, Footer, OverlayContainer } from "mobile/resources/containers/layout";
import Login from "./Login";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

ReactDOM.render(
    <AppContainer>
        <div className="login-page">
            <HeaderContainer />
            <LeftSidebarContainer />
            <Login />
            <Footer>
                <ScrollTop />
            </Footer>
            <OverlayContainer />
        </div>
    </AppContainer>,
    document.getElementById("root")
);
