import "../scss/keyword_list.scss";
import React, { Component, PropTypes } from "react";
import Auth from "forsnap-authentication";
import utils from "forsnap-utils";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import A from "shared/components/link/A";

class KeywordList extends Component {

    onSelect(keyword) {
        utils.ad.gaEvent("M_공통", "키워드검색", keyword);
        Auth.cookie.setSearch(keyword);
        // redirect.productList(`tag=${tag}`);
    }

    onDelete(keyword) {
        AppDispatcher.dispatch({ type: CONST.GLOBAL_SEARCH_TAG_DELETE, payload: keyword });
    }

    render() {
        return (
            <div className="header__search__keyword">
                <ul>
                    {this.props.data.map((obj, i) => {
                        return (
                            <li key={`search-keyword-${i}`}>
                                <A role="button" href={`/products?keyword=${encodeURI(obj)}`} onClick={() => this.onSelect(obj)}>{obj}</A>
                                <button className="f__button__close close__tiny" onClick={() => this.onDelete(obj)} />
                            </li>
                        );
                    })}
                </ul>
                <div className="header__search__buttons">
                    <button className="keyword__all__delete" onClick={() => this.onDelete()}>검색 기록 전체 삭제</button>
                </div>
            </div>
        );
    }
}

KeywordList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.string)
};

KeywordList.defaultProps = {
    data: []
};

export default KeywordList;
