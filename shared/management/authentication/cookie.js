import constant from "shared/constant";
import cookie from "../cookie";

export default {
    /**
     * 유저 정보를 설정한다.
     * @param id
     * @param data
     */
    setUser(id, data) {
        cookie.setCookie({
            [constant.USER.ID]: id,
            [constant.USER.API_TOKEN]: data.apiToken
        });
    },

    /**
     * 유저 정보를 가져온다.
     * @returns {*}
     */
    getUser() {
        const id = cookie.getCookies(constant.USER.ID);
        if (id) {
            const apiToken = cookie.getCookies(constant.USER.API_TOKEN);
            return { id, apiToken };
        }

        return null;
    },

    /**
     * 유저 정보를 제거한다.
     */
    removeUser() {
        cookie.removeCookie(constant.USER.ID, constant.USER.API_TOKEN, constant.USER.USER_AUTO);
    },

    /**
     * 검색기록 가져오기
     */
    getSearch() {
        const keywords = cookie.getCookies("FORSNAP_SEARCH_KEYWORD");
        return keywords ? keywords.split(" ") : [];
    },
    /**
     * 검색기록 추가
     * @param keyword - String
     */
    setSearch(keyword) {
        const keywords = this.getSearch();
        const index = keywords.findIndex(obj => {
            return obj === keyword;
        });

        if (index !== -1) {
            keywords.splice(index, 1);
        } else if (keywords.length > 9) {
            keywords.pop();
        }

        keywords.unshift(keyword);

        cookie.setCookie({
            FORSNAP_SEARCH_KEYWORD: keywords.join(" ")
        });
    },

    /**
     * 검색 키워드 삭제
     * @param keyword - String (값이 없을시 전체삭제)
     */
    deleteSearch(keyword) {
        let keywords = [];

        if (keyword) {
            keywords = this.getSearch();
            const index = keywords.findIndex(obj => {
                return obj === keyword;
            });

            if (index !== -1) {
                keywords.splice(index, 1);
            }
        }

        cookie.setCookie({
            FORSNAP_SEARCH_KEYWORD: keywords.join(" ")
        });
    }
};
