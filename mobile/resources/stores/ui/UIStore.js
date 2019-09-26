import { ReduceStore } from "flux/utils";
import AppDispatcher from "mobile/resources/AppDispatcher";
import * as CONST from "../constants";


class UIStore extends ReduceStore {
    getInitialState() {
        return {
            showOverlay: false,
            showLeftSidebar: false,
            showSearchSidebar: false,
            breadcrumb: "",
            category: ""
        };
    }

    reduce(state, action) {
        switch (action.type) {
            case CONST.GLOBAL_LEFT_SIDEBAR_SHOW:
                this.pushState();
                return { ...state, category: (action.payload && action.payload.category) || "", showOverlay: true, showLeftSidebar: true, showSearchSidebar: false };
            case CONST.GLOBAL_LEFT_SIDEBAR_HIDE:
                return { ...state, showOverlay: false, showLeftSidebar: false };
            case CONST.GLOBAL_SEARCH_SIDEBAR_SHOW:
                this.pushState();
                return { ...state, showOverlay: true, showSearchSidebar: true, showLeftSidebar: false };
            case CONST.GLOBAL_SEARCH_SIDEBAR_HIDE:
                return { ...state, showOverlay: false, showSearchSidebar: false };
            case CONST.GLOBAL_BREADCRUMB:
                return { ...state, breadcrumb: action.payload || "" };
            default:
                return state;
        }
    }

    pushState() {
        if (window.history) {
            window.history.pushState(null, null, document.location.href);
        }
    }
}

export default new UIStore(AppDispatcher);
