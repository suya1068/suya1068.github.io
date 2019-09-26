import "../scss/search_bar.scss";
import React, { Component, PropTypes } from "react";
import Auth from "forsnap-authentication";
import redirect from "forsnap-redirect";
import utils from "forsnap-utils";
import cookie from "forsnap-cookie";
import CONSTANT from "shared/constant";
import PopModal from "shared/components/modal/PopModal";


class SearchBar extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();

        const enter = cookie.getCookies(CONSTANT.USER.ENTER);
        const enter_session = sessionStorage.getItem(CONSTANT.USER.ENTER);
        if (!enter && enter_session) {
            cookie.setCookie({ [CONSTANT.USER.ENTER]: enter_session });
        }

        const target = e.currentTarget;
        const keyword = target.keyword.value;

        if (keyword.replace(/\s/g, "") === "") {
            PopModal.toast("검색어를 입력해주세요.");
        } else {
            utils.ad.gaEvent("M_공통", "키워드검색", keyword);
            Auth.cookie.setSearch(keyword);

            const url = `keyword=${encodeURI(keyword)}`;
            // if (enter && enter_session) {
            //     url = `keyword=${encodeURI(keyword)}&biz=true`;
            // }

            redirect.productList(url);
        }
    }

    onHide() {
        redirect.back();
    }

    render() {
        return (
            <div className="header__search__bar">
                <div className="search__keyword__input">
                    <form className="search__keyword__form" onSubmit={this.onSubmit} autoComplete="off">
                        <input name="keyword" className="f__input f__input__round" type="text" maxLength="38" placeholder="어떤 촬영을 원하세요?" onFocus={e => e.currentTarget.select()} />
                    </form>
                    <button className="f__button__close close__small" onClick={this.onHide} />
                </div>
            </div>
        );
    }
}

export default SearchBar;
