import "./wideScreen.scss";
import React, { Component } from "react";
import ScreenTop from "./components/top/ScreenTop";
import ScreenMiddle from "./components/mid/ScreenMiddle";
import ScreenBottom from "./components/bot/ScreenBottom";

export default class WideScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.gaEvent = this.gaEvent.bind(this);
        this.onConsult = this.onConsult.bind(this);
    }

    gaEvent(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(action);
        }
    }

    onConsult(access_type) {
        if (typeof this.props.onConsult === "function") {
            this.props.onConsult(access_type);
        }
    }

    render() {
        return (
            <section className="biz-wide-screen-component">
                <h2 className="sr-only">기업페이지 스크린</h2>
                <ScreenTop gaEvent={this.gaEvent} onConsult={this.onConsult} />
                <ScreenMiddle />
                <ScreenBottom gaEvent={this.gaEvent} />
            </section>
        );
    }
}
