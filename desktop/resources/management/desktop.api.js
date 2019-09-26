import axios from "axios";
import api from "shared/api";
import siteDispatcher from "desktop/resources/components/siteDispatcher";
import constant from "shared/constant";
import utils from "forsnap-utils";
import authentication from "forsnap-authentication";
import redirect from "./redirect";

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

    const user = authentication.getUser();
    if (user) {
        const ignorePattern = "\\/guest-orders";
        const regUserPattern = "\\/guest-orders\\/[0-9]*\\/user";
        if (result.url.match(ignorePattern)) {
            if (result.url.match(regUserPattern)) {
                result.headers["API-TOKEN"] = user.apiToken;
            } else {
                return result;
            }
        } else {
            result.headers["API-TOKEN"] = user.apiToken;
        }
    } else {
        authentication.removeUser();
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

        if (!isExcept && data.session_info !== null && data.session_info !== undefined) {
            const session = data.session_info;

            if (session.is_login) {
                if (session.is_artist) {
                    // const match = location.pathname.match(/(^\/users$)|(^\/users\/.*$)|(^\/users?.*$)/g);
                    // if (!match || (!!match && match.length === 0)) {
                    session.profile_img = session.artist_profile_img;
                    session.notice_count = session.artist_notice_count;
                    // }
                }
            }

            siteDispatcher.dispatch({
                actionType: constant.DISPATCHER.HEADER_USER_UPDATE,
                userInfo: session
            });
        }
    }

    return response;
}, error => {
    if (error) {
        switch (error.status) {
            case 401:
                authentication.removeUser();
                redirect.login({ redirectURL: `${location.pathname}${location.search}${location.hash}` });
                break;

            default:
                break;
        }
    }

    return Promise.reject(error);
});

export default api.inject(instance);
