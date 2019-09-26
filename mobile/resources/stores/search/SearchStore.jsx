import { ReduceStore } from "flux/utils";
import Auth from "forsnap-authentication";
import AppDispatcher from "mobile/resources/AppDispatcher";
import * as CONST from "../constants";

class SearchStore extends ReduceStore {
    getInitialState() {
        return {
            tag: "",
            keywordList: Auth.cookie.getSearch(),
            tab: "keyword"
        };
    }

    reduce(state, action) {
        switch (action.type) {
            case CONST.GLOBAL_SEARCH_TAG_UPDATE: {
                const payload = action.payload;
                return { ...state, tag: payload };
            }
            case CONST.GLOBAL_SEARCH_TAG_DELETE: {
                const payload = action.payload;
                Auth.cookie.deleteSearch(payload);

                return { ...state, keywordList: Auth.cookie.getSearch() };
            }
            case CONST.GLOBAL_SEARCH_TAB: {
                const payload = action.payload;
                return { ...state, tab: payload };
            }
            default:
                return state;
        }
    }
}

export default new SearchStore(AppDispatcher);
