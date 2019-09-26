import classnames from "classnames";
import React, { Component } from "react";
import { Container } from "flux/utils";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import { UIStore } from "mobile/resources/stores";


const hideOverlay = () => {
    AppDispatcher.dispatch({ type: CONST.GLOBAL_LEFT_SIDEBAR_HIDE });
};

class Overlay extends Component {
    static getStores() {
        return [UIStore];
    }

    static calculateState() {
        return {
            ui: UIStore.getState()
        };
    }

    onHide() {
        AppDispatcher.dispatch({ type: CONST.GLOBAL_LEFT_SIDEBAR_HIDE });
    }

    render() {
        const { showOverlay } = this.state.ui;

        if (showOverlay) {
            document.getElementsByTagName("html")[0].style.overflow = "hidden";
        } else {
            document.getElementsByTagName("html")[0].style.overflow = "auto";
        }

        return (
            <div className={classnames("overlay", { "overlay--show": showOverlay })} onClick={this.onHide} />
        );
    }
}

export default Container.create(Overlay);
