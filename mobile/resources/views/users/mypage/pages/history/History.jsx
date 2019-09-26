import "./history.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
// import classNames from "classnames";
// import redirect from "forsnap-redirect";
// import Input from "shared/components/form/Input";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, Footer, OverlayContainer } from "mobile/resources/containers/layout";
import UpperState from "../../component/upperState/UpperState";

export default class History extends Component {
    constructor(props) {
        const params = document.getElementById("params").getAttribute("content");
        super(props);
        this.state = {
            params: params === "" ? undefined : params
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    render() {
        // console.log(this.state.params);
        return (
            <div className="users-history">
                <UpperState title="이용내역" />
            </div>
        );
    }
}

ReactDOM.render(
    <AppContainer roles={["customer"]}>
        <HeaderContainer />
        <div className="site-main">
            <LeftSidebarContainer />
            <History />
            <Footer />
            <OverlayContainer />
        </div>
    </AppContainer>,
    document.getElementById("root")
);
