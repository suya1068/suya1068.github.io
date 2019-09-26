import axios from "axios";
import api from "shared/api";
import constant from "shared/constant";
import utils from "forsnap-utils";
//import siteDispatcher from "desktop/resources/components/siteDispatcher";
import AppDispatcher from "mobile/resources/AppDispatcher";
import * as CONST from "mobile/resources/stores/constants";
import { SessionStore } from "mobile/resources/stores";


const instance = axios.create({
    baseURL: __SERVER__.api,
    timeout: 0
});

/* ================================================
 Header Config
 ================================================ */
Object.assign(instance.defaults, {
    headers: {
        common: {
            Accept: "application/json",
            "API-TYPE": "public",
            "API-VERSION": "v1",
            "Content-Type": "application/json"
        },
        post: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }
});

/* ================================================
 Interceptors - Request
 ================================================ */
instance.interceptors.request.use(config => {
    const result = config;
    result.headers["API-UA"] = navigator.userAgent;
    result.headers["API-DEVICE"] = utils.agent.isMobile() ? "mobile" : "pc";
    const session = SessionStore.getState().entity;
    if (session) {
        const ignorePattern = "\\/guest-orders";
        const regUserPattern = "\\/guest-orders\\/[0-9]*\\/user";
        if (result.url.match(ignorePattern)) {
            if (result.url.match(regUserPattern)) {
                result.headers["API-TOKEN"] = session.apiToken;
            } else {
                return result;
            }
        } else {
            result.headers["API-TOKEN"] = session.apiToken;
        }
    }

    return result;
}, error => {
    return Promise.reject(error);
});

/* ================================================
 Interceptors - Response
 ================================================ */
instance.interceptors.response.use(response => {
    if (response !== null) {
        const data = response.data;

        const url = document.createElement("a");
        url.href = response.config.url;

        // session_info 업데이트 제외 api url체크
        const isExcept = new RegExp(constant.EXCEPT.SESSION_INFO_MATCH.join("|")).test(url.pathname);
        if (!isExcept && data.session_info && SessionStore.getState().entity) {
            AppDispatcher.dispatch({
                type: CONST.GLOBAL_SESSION_UPDATE,
                payload: data.session_info
            });
        }
    }

    return response;
}, error => {
    if (error) {
        switch (error.status) {
            case 401: {
                AppDispatcher.dispatch({ type: CONST.GLOBAL_SESSION_REMOVE });

                const { protocol, host, pathname, search, hash } = location;
                const domain = `${protocol}//${host}`;
                // redirect.login({ redirectURL: `${domain}${pathname}` });
                break;
            }

            default:
                break;
        }
    }

    return Promise.reject(error);
});

export default api.inject(instance);
