import CONST from "shared/constant";
import type from "./type";
import agent from "./agent";

const query = {
    /**
     * json data를 query string으로 변환한다.
     * @name query.stringify
     * @param {object|string} [data = ""]
     * @returns {string}
     */
    stringify(data = "") {
        if (type.isString(data)) { return data; }
        if (!type.isObject(data)) { throw new TypeError("The type is incorrect."); }

        const result = [];

        function add(key, value) {
            result.push(`${encodeURIComponent(key)}=${encodeURIComponent(value === null ? "" : value)}`);
        }

        function param(prefix, value, root = false) {
            if (type.isArray(value)) {
                value.forEach((subData, idx) => {
                    param(`${prefix}[${idx}]`, subData);
                });
            } else if (type.isObject(value)) {
                Object.entries(value).forEach(subData => {
                    param(`${prefix}[${subData[0]}]`, subData[1]);
                });
            } else {
                add(prefix, value);
            }
        }

        Object.entries(data).forEach(subData => {
            param(subData[0], subData[1], true);
        });

        return result.join("&");
    },
    /**
     * query string을 json 데이터로 변환한다.
     * @param {string} queryString
     * @returns {{}}
     */
    parse(queryString) {
        const params = {};
        const regexp = /([^#?&=]+)=([^&]*)/g;
        let match = regexp.exec(queryString);

        while (match !== null) {
            let key = "";
            let value = "";

            try {
                key = decodeURIComponent(match[1]);
            } catch (e) {
                key = match[1];
            }

            try {
                value = decodeURIComponent(match[2]);
            } catch (e) {
                value = match[2];
            }

            params[key] = value;
            match = regexp.exec(queryString);
        }

        return params;
    },

    /**
     * sns 인증 result uri를 json 데이터를 변환한다.
     * @param snsType
     * @param uri
     * @returns {*|{}}
     */
    parseSNSURI(snsType, uri) {
        const params = this.parse(uri);

        // Facebook은 인증 후 #_=_ 해쉬가 추가된다. 정확한 state 비교를 위해 추가된 해쉬를 제거한다.
        if (snsType === CONST.SNS.SNS_TYPE.FACEBOOK && params.state.length - 4 === params.state.lastIndexOf("#_=_")) {
            params.state = params.state.substring(0, params.state.length - 4);
        }

        return params;
    },
    encodeSC(str) {
        if (typeof str !== "string") {
            return str;
        }

        return str.replace(/['"<>]/g, match => {
            if (match === "'") {
                return "＇";
            } else if (match === "\"") {
                return "＂";
            } else if (match === "<") {
                return "ᐸ";
            } else if (match === ">") {
                return "ᐳ";
            }

            return "";
        });
    },
    querySearchParse(str) {
        const pairs = str.slice(1).split("&");
        const result = {};
        pairs.map(s => {
            const o = s.split("=");
            result[o[0]] = o[1];
            return null;
        });

        return result;
    },
    querySearchToObejct(key, checkValue) {
        const searchPath = location.search;
        const checkValueToString = checkValue.toString();
        if (searchPath) {
            const searchPathToObject = this.parse(searchPath);
            if (searchPathToObject[key] && (searchPathToObject[key] === checkValueToString)) {
                return true;
            }
        }
        return false;
    },
    querySearchValue(key) {
        const searchPath = location.search;
        if (searchPath) {
            const searchPathToObject = this.parse(searchPath);
            if (searchPathToObject[key]) {
                return searchPathToObject[key];
            }
        }
        return null;
    },
    addQuery(path = "", flag = false, target = "") {
        if (flag) {
            let extension = "?";
            if (path.indexOf("?") !== -1) {
                extension = "&";
            }
            return `${path}${extension}${target}`;
        }
        return path;
    },
    /**
     * 전달받은 주소를 변환하여 host 와 search 로 나눈다.
     * @param url
     * @returns {{domain: string, search: string}}
     */
    combineConsultToReferrer(url) {
        const referer_a = document.createElement("a");
        referer_a.href = url;
        const domain = `${referer_a.host}${referer_a.pathname}`;
        const search = referer_a.search;
        return { domain, search };
    },
    /**
     * 플랫폼에 따라 파라미터를 생성한다.
     * @param domain
     * @param search
     * @returns {*}
     */
    setConsultParams({ domain, search }) {
        const platForms = ["naver", "daum", "facebook", "google"];
        const sDomain = platForms.filter(platform => {
            return domain.indexOf(platform) !== -1;
        }).join();

        switch (sDomain) {
            case "naver": return this.setConsultParamsToNaver({ domain, search });
            case "daum": return this.setConsultParamsToDaum({ domain, search });
            case "facebook": return this.setConsultParamsToFacebook({ domain, search });
            case "google": return this.setConsultParamsToGoogle({ domain, search });
            default: return null;
        }
    },
    /**
     * 타겟에 해당 문자열이 포함되어 있는지 체크한다.
     * @param target
     * @param str
     * @returns {boolean}
     */
    hasStrToTarget(target, str) {
        return target.indexOf(str) !== -1;
    },
    /**
     * 네이버 파라미터를 체크한다.
     * @param domain
     * @param search_obj
     * @returns {string}
     */
    checkParamsToNaver({ domain }, search_obj) {
        let referer = "";
        const isShopping = this.hasStrToTarget(domain, "shopping"); // 주소에 shopping 문자열이 포함
        const isBlog = this.hasStrToTarget(domain, "blog");         // 주소에 blog 문자열이 포함

        // 주소에 shopping 문자열이 포함되어 있다면
        if (isShopping) {
            referer = "naver_shopping";
        }

        // 주소에 blog 문자열이 포함되어 있다면
        if (isBlog) {
            referer = "naver_blog";
        }

        // 주소에 blog 문자열이 포함되어 있으면서 forsnap 문자열도 함께 포함한다면
        if (isBlog && (this.hasStrToTarget(domain, "forsnap") || (search_obj && search_obj.blogId && search_obj.blogId === "forsnap"))) {
            referer = "naver_forsnap_blog";
        }

        // 주소에 search 문자열이 포함되어 있다면
        if (this.hasStrToTarget(domain, "search")) {
            // 현재 주소를 파싱하여
            const c_parse = this.parse(location.search);
            referer = this.checkParamsToNaverSearch(c_parse);
        }

        return referer;
    },
    /**
     * 네이버 파라미터 중 search에 관련된 referer를 체크한다.
     * @param parse_str
     * @returns {string}
     */
    checkParamsToNaverSearch(parse_str) {
        let referer = "";
        // NaPm 파라미터가 존재한다면
        if (Object.keys(parse_str).length > 0 && parse_str["NaPm"]) {
            // 네이퍼 파워링크
            referer = "naver_power";
        } else {
            // 아니면 네이버 검색
            referer = "naver_search";
        }

        // 모바일 네이버 쇼핑 대응 코드
        if (this.hasStrToTarget(location.host, "m.") && this.hasStrToTarget(location.pathname, "products/")) {
            referer = "naver_shopping";
        }

        return referer;
    },
    checkParamsToFacebook() {
        let referer = "facebook";
        const c_parse = this.parse(location.search);

        if (c_parse && c_parse.inflow && c_parse.inflow.indexOf("fb") !== -1) {
            referer = "facebook_ad";
        }

        return referer;
    },
    checkParamsToGoogle() {
        let referer = "";
        const c_parse = this.parse(location.search);

        if (c_parse && c_parse.inflow && c_parse.inflow === "google_ad") {
            referer = "google_ad";
        }

        return referer;
    },
    /**
     * 네이버에 관련된 파라미터를 생성한다.
     * @param domain
     * @param search
     */
    setConsultParamsToNaver({ domain, search }) {
        const params = {};
        const referer_search = this.parse(search);

        params.referer = this.checkParamsToNaver({ domain }, referer_search);

        if (!type.isEmpty(referer_search) && referer_search.query) {
            params.referer_keyword = referer_search.query;
        }

        return params;
    },
    /**
     * 다음에 관련된 파라미터를 생성한다.
     * @param domain
     * @param search
     */
    setConsultParamsToDaum({ domain, search }) {
        const params = {};
        const isShopping = this.hasStrToTarget(domain, "shopping");
        const isSearch = this.hasStrToTarget(domain, "search");

        if (isShopping) {
            params.referer = "daum_shopping";
            const referer_search = this.parse(search);
            if (referer_search && referer_search.beforreferer) {
                const beforreferer = referer_search.beforreferer;
                const st = beforreferer.substr(beforreferer.indexOf("/search/") + 8).split("/");
                if (Array.isArray(st) && st.length > 0) {
                    params.referer_keyword = decodeURIComponent(st[0]);
                }
            }
        }

        if (isSearch) {
            const referer_search = this.parse(search);
            params.referer = "daum_search";

            if (referer_search && referer_search.q) {
                params.referer_keyword = referer_search.q;
            }
        }
        return params;
    },

    setConsultParamsToFacebook({ domain, search }) {
        const params = {};
        // const referer_search = this.parse(search);

        params.referer = this.checkParamsToFacebook();

        return params;
    },

    setConsultParamsToGoogle({ domain, search }) {
        const params = {};

        params.referer = this.checkParamsToGoogle();

        return params;
    }
};

export default query;
