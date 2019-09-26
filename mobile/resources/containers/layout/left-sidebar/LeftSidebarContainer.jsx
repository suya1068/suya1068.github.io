import React, { Component } from "react";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import PersonalSidebarContainer from "./personal-sidebar/PersonalSidebarContainer";
import SearchSidebarContainer from "./search-sidebar/SearchSidebarContainer";

class LeftSidebarContainer extends Component {
    componentWillMount() {
        window.addEventListener("popstate", this.onPopState, false);
    }

    componentWillUnmount() {
        window.removeEventListener("popstate", this.onPopState, false);
    }

    onPopState() {
        AppDispatcher.dispatch({ type: CONST.GLOBAL_LEFT_SIDEBAR_HIDE });
        AppDispatcher.dispatch({ type: CONST.GLOBAL_SEARCH_SIDEBAR_HIDE });
    }

    render() {
        return (
            <div>
                <PersonalSidebarContainer />
                <SearchSidebarContainer />
            </div>
        );
    }
}

export default LeftSidebarContainer;
