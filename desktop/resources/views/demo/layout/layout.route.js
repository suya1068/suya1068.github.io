import React, { Component, PropTypes } from "react";
import NavigationPage from "./navigation/NavPage";

const route = {
    path: "/layout",
    indexRoute: {
        onEnter: (nextState, replace) => replace("/layout/navigation")
    },
    childRoutes: [
        { path: "navigation", component: NavigationPage }
    ]
};

export default route;

