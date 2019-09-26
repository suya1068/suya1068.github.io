import React, { Component, PropTypes } from "react";
import ProductPage from "./product/ProductPage";
import SlimCalendarPage from "./calendar/SlimCalendarPage";
import FullCalendarPage from "./fullcalendar/FullCalendarPage";

const route = {
    path: "/widgets",
    indexRoute: {
        onEnter: (nextState, replace) => replace("/widgets/product")
    },
    childRoutes: [
        { path: "product", component: ProductPage },
        {
            path: "calendar",
            indexRoute: {
                onEnter: (nextState, replace) => replace("/widgets/calendar/slim")
            },
            childRoutes: [
                { path: "slim", component: SlimCalendarPage }
            ]
        },
        { path: "fullcalendar", component: FullCalendarPage }
    ]
};

export default route;

