import React, { Component, PropTypes } from "react";
import ElementsPage from "./elements/ElementsPage";

const route = {
    path: "/form",
    indexRoute: {
        onEnter: (nextState, replace) => replace("/form/elements")
    },
    childRoutes: [
        { path: "elements", component: ElementsPage }
    ]
};

export default route;

