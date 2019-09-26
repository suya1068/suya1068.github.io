import "./search_side_bar.scss";
import React, { Component } from "react";
import classnames from "classnames";
import { Container } from "flux/utils";
// import Auth from "forsnap-authentication";
// import redirect from "forsnap-redirect";
// import utils from "forsnap-utils";
import cookie from "forsnap-cookie";
// import PopModal from "shared/components/modal/PopModal";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import { UIStore, SearchStore } from "mobile/resources/stores";
import SearchBar from "./components/SearchBar";
import KeywordList from "./components/KeywordList";
import HashtagList from "./components/HashtagList";

class SearchSidebar extends Component {
    static getStores() {
        return [SearchStore, UIStore];
    }

    static calculateState() {
        return {
            ui: UIStore.getState(),
            search: SearchStore.getState()
        };
    }

    constructor() {
        super();
        this.ENTER = "ENTER";
        this.state = {
            enter: cookie.getCookies(this.ENTER)
        };
    }

    onTab(key) {
        AppDispatcher.dispatch({ type: CONST.GLOBAL_SEARCH_TAB, payload: key });
    }

    render() {
        const { ui, search, enter } = this.state;
        const { keywordList, tab } = search;

        return (
            <div className={classnames("site-search-sidebar", { "site-search-sidebar--show": ui.showSearchSidebar })}>
                <h2 className="sr-only">검색</h2>
                <SearchBar />
                <div className="header__search__tab">
                    <div className={classnames({ active: tab === "keyword" })}><a role="button" onClick={() => this.onTab("keyword")}>최근 검색어</a></div>
                </div>
                <div className="header__search__content">
                    {tab === "keyword"
                        ? <KeywordList data={keywordList} />
                        : <HashtagList data={{ list: ["테스트1", "테스트2", "테스트3", "테스트4", "테스트5", "테스트6", "테스트7", "테스트8", "테스트9", "테스트10"] }} />
                    }
                </div>
            </div>
        );
    }
}

export default Container.create(SearchSidebar);
