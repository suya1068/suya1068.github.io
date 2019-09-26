import "./personal_side_bar.scss";
import classnames from "classnames";
import React, { Component } from "react";
import { Container } from "flux/utils";
import cookie from "forsnap-cookie";
import { SessionStore, UIStore } from "mobile/resources/stores";
import TopMenu from "./components/TopMenu";

class PersonalSidebar extends Component {
    static getStores() {
        return [UIStore, SessionStore];
    }

    static calculateState() {
        return {
            ui: UIStore.getState(),
            session: SessionStore.getState()
        };
    }

    constructor() {
        super();
        this.ENTER = "ENTER";
        this.state = {
            enter: cookie.getCookies(this.ENTER)
        };
    }

    render() {
        const { ui, session, enter } = this.state;

        return (
            <aside className={classnames("site-left-sidebar", { "site-left-sidebar--show": ui.showLeftSidebar })}>
                <h1 className="sr-only">메뉴</h1>
                <TopMenu session={session.entity} ui={ui} enter={enter} />
            </aside>
        );
    }
}

export default Container.create(PersonalSidebar);
