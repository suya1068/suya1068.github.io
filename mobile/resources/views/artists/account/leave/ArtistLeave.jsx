import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import LeaveContainer from "shared/components/leave/LeaveContainer";
import auth from "forsnap-authentication";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, Footer, OverlayContainer } from "mobile/resources/containers/layout/index";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

class ArtistLeave extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: auth.getUser()
        };
    }

    componentWillMount() {
        const { user } = this.state;
        const isArtist = user.data.is_artist;
        this.setState({
            is_artist: isArtist
        });
    }

    componentDidMount() {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "작가 - 회원탈퇴" });
        }, 0);
    }

    render() {
        const { is_artist, user } = this.state;
        return (
            <div className="users-leave-page">
                <LeaveContainer view="mobile" is_artist={is_artist} user_id={user && user.id} />
            </div>
        );
    }
}

ReactDOM.render(
    <AppContainer roles={["artist"]}>
        <div className="site-main">
            <LeftSidebarContainer />
            <HeaderContainer />
            <ArtistLeave />
            <Footer>
                <ScrollTop />
            </Footer>
            <OverlayContainer />
        </div>
    </AppContainer>,
    document.getElementById("root")
);
