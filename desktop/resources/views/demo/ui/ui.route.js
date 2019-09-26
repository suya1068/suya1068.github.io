import React, { Component, PropTypes } from "react";
import TypographyPage from "./typo/TypographyPage";
import ButtonsPage from "./buttons/ButtonPage";
import IconPage from "./icons/IconPage";
import ImagesPage from "./images/ImagesPage";
import GalleryPage from "./images/GalleryPage";

const route = {
    path: "/ui",
    indexRoute: {
        onEnter: (nextState, replace) => replace("/ui/typo")
    },
    childRoutes: [
        { path: "typo", component: TypographyPage },
        { path: "buttons", component: ButtonsPage },
        { path: "icons", component: IconPage },
        { path: "images", component: ImagesPage },
        { path: "gallery", component: GalleryPage }
    ]
};

export default route;

