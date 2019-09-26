import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Link, hashHistory } from "react-router";
import "./demo.scss";

import formRoute from "./form/form.route";
import uiRoute from "./ui/ui.route";
import widgetsRoute from "./widgets/widgets.route";
import layoutRoute from "./layout/layout.route";


class Demo extends Component {
    constructor() {
        super();
        this.state = {
            route: window.location.hash.substr(1)
        };
    }

    render() {
        return (
            <div style={{ width: "100%", height: "100%" }}>
                <ul className="demo-left">
                    <li>
                        <Link to="ui/typo">UI</Link>
                        <ul>
                            <li><Link to="ui/typo">Typography</Link></li>
                            <li><Link to="ui/buttons">Buttons</Link></li>
                            <li><Link to="ui/icons">Icons</Link></li>
                            <li><Link to="ui/images">Images</Link></li>
                            <li><Link to="ui/gallery">Gallery</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="form/elements">Form</Link>
                        <ul>
                            <li><Link to="form/elements">Elements</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="widgets/product">Widgets</Link>
                        <ul>
                            <li><Link to="widgets/product">Product</Link></li>
                            <li><Link to="widgets/calendar">Calendar</Link></li>
                            <li><Link to="widgets/fullcalendar">FullCalendar</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="layout/navigation">Layout</Link>
                        <ul>
                            <li><Link to="layout/navigation">Navigation</Link></li>
                        </ul>
                    </li>
                </ul>
                <div className="demo-container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

Demo.propTypes = {
    children: PropTypes.node
};

const routes = {
    path: "/",
    component: Demo,
    indexRoute: {
        onEnter: (nextState, replace) => replace("/form")
    },
    childRoutes: [
        formRoute,
        uiRoute,
        widgetsRoute,
        layoutRoute
    ]
};

ReactDOM.render(
    <Router history={hashHistory} routes={routes} />,
    document.getElementById("demo-root")
);
