import utils from "forsnap-utils";
import cookie from "forsnap-cookie";
import auth from "forsnap-authentication";
import CONST from "shared/constant";
import API from "forsnap-api";

export default class LogLocation {
    constructor() {
        this.FORSNAP_UUID = "FORSNAP_UUID";
        this.referer = "";
        this.referer_list = CONST.INFLOW_REFERER;
        this.log_params = {};
        this.log_param_keys = ["uuid", "referer", "referer_keyword", "url", "user_id"];
    }

    init(referer = "") {
        this.referer = referer;
        // 현재 세션에 log_param_keys 중 존재하는 키들의 카운트를 계산한다.
        const has_session_count = Object.keys(this.getSessionItemsForLogData()).length;

        // 필수 요소인 uuid가 현재 세션에 존재하는지 확인한다.
        const is_session_uuid = !utils.type.isEmpty(this.getSessionItemsForLogData(["uuid"]));

        // 필수 요소를 포함하지 않거나 포함한 키의 갯수가 (uuid, referer, url) 3 이하라면
        // 즉 최초로 외부유입(네이버 쇼핑, 다음 쇼핑 등)이 된 경우라면
        if (!is_session_uuid && has_session_count < 3) {
            // 유입 사이트가 레퍼러 리스트 중 하나라면 해당 파라미터를 가져온다 (referer, referer_keyword)
            let params = this.checkInflowToReferer(this.referer, this.referer_list);
            if (utils.query.parse(location.search) && utils.query.parse(location.search)["inflow"] === "google_ad") {
                params = { referer: "google_ad" };
            }
            if (utils.query.parse(location.search) && utils.query.parse(location.search)["utm_source"] === "10ping_ad") {
                params = { referer: "10ping_ad" };
            }
            if (utils.query.parse(location.search) && utils.query.parse(location.search)["inflow"] === "gdn") {
                params = { referer: "gdn" };
            }
            // params 가 존재한다면 세션 및 로그 api 호출
            if (params) {
                this.setLogLocationData("in", params);
            }
        } else if (is_session_uuid && has_session_count > 2) {
            this.setLogLocationData("move");
        }
    }

    /**
     * 외부 유입 로그 api 호출
     * @param params
     */
    apiLogLocation(params) {
        const p_keys = Object.keys(params);
        if (!p_keys.includes("uuid") && p_keys.length < 3) {
            return;
        }
        const device_type = utils.agent.isMobile() ? "MOBILE" : "PC";
        API.logs.logLocation({ ...params, device_type });
    }

    /**
     * 유입 파라미터를 저장한다.
     * @param params
     */
    setLogParams(params) {
        if (params) {
            this.log_params = { ...this.log_params, ...params };
        }
    }

    /**
     * 유입 파라미터를 가져온다.
     * @returns {{}}
     */
    getLogParams() {
        return this.log_params;
    }

    /**
     * 유입사이트 체크
     * @param referer
     * @param referer_list - object
     */
    checkInflowToReferer(referer, referer_list) {
        const params = this.parseReferer(referer);
        // params가 있고 params에 referer 값이 있다면
        if (Object.keys(params).length > 0 && !utils.type.isEmpty(params.referer)) {
            return this.checkFromRefererList(params.referer, referer_list) ? params : false;
        }

        return false;
    }

    /**
     * 레퍼러 파싱
     * @param referer
     * @returns {{}}
     */
    parseReferer(referer) {
        // 레퍼러를 파싱한다.
        const refData = utils.query.combineConsultToReferrer(referer);
        // 파싱한 파라미터를 가져온다.
        const params = utils.query.setConsultParams({ ...refData });
        return { ...params };
    }

    /**
     * 유입된 레퍼가 유입사이트 리스트에 있는지 체크한다.
     * @param refer_code
     * @param referer_list
     * @returns {boolean}
     */
    checkFromRefererList(refer_code, referer_list) {
        return !!referer_list[refer_code.toUpperCase()];
    }

    /**
     * 유입 분석을 위한 데이터를 저장한다.
     * @param type
     * @param params
     */
    setLogLocationData(type, params = {}) {
        if (cookie.getCookies(this.FORSNAP_UUID)) {
            const log_params = {
                uuid: cookie.getCookies(this.FORSNAP_UUID)
            };

            if (auth.getUser()) {
                log_params.user_id = auth.getUser().id;
            }

            if (location) {
                log_params.url = location.href;
            }

            if (type === "in") {
                Object.assign(log_params, params);
            }

            if (type === "move") {
                const referer_data = this.getSessionItemsForLogData(["referer", "referer_keyword"]);

                if (Object.keys(referer_data).length > 0) {
                    Object.assign(log_params, referer_data);
                }
            }

            log_params.log_type = type;

            this.setLogParams(log_params);
            this.setSessionItemsLogData(log_params);
            this.apiLogLocation(log_params);
        }
    }

    /**
     * 세션에 저장된 키 값들을 꺼내온다.
     * arg가 없다면 지정된 5가지 파라미터 키를 가져온다. (array)
     * @param keys
     */
    getSessionItemsForLogData(keys = this.log_param_keys) {
        // 조회할 파라미터 키들의 배열을 가져온다.
        const log_param_keys = this.log_param_keys;

        return log_param_keys.reduce((result, key) => {
            // 조회를 할 파라미터의 키만을 선택하여
            if (keys.filter(k => k === key)[0]) {
                // 세션에 저장된 아이템을 꺼낸다.
                if (sessionStorage && sessionStorage.getItem(key)) {
                    result[key] = sessionStorage.getItem(key);
                }
            }
            return { ...result };
        }, {});
    }

    /**
     * 로그에 필요한 파라미터를 세션에 저장한다.
     * @param params
     */
    setSessionItemsLogData(params) {
        const log_params_keys = this.log_param_keys;
        if (sessionStorage) {
            Object.keys(params).map((key, idx) => {
                if (log_params_keys.indexOf(key) !== -1) {
                    sessionStorage.setItem(key, params[key]);
                }
                return null;
            });
        }
    }
}
