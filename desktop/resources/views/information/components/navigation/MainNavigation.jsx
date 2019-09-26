import "./Navigation.scss";
import React, { Component, PropTypes } from "react";

import { main_navigation } from "../../information.const";
import Navigation from "./Navigation";


class MainNavigation extends Component {
    render() {
        return (
            <div className="information-navigation">
                <div className="container">
                    <Navigation data={main_navigation} />
                </div>
            </div>
        );
    }
}

MainNavigation.contextTypes = {
    router: PropTypes.object
};

export default MainNavigation;
