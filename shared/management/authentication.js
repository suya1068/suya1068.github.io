import constant from "shared/constant";
import local from "./authentication/localstorage";
import cookie from "./authentication/cookie";

/**
 * 인증을 위한 메서드를 제공한다.
 */
const authentication = {
    /**
     * API TOKEN, 유저 ID 등 인증에 필요한 정보를 저장한다.
     * @param {string} id
     * @param {object} data
     */
    setUser(id, data) {
        cookie.setUser(id, data);
        local.setUser(id, data);
    },
    /**
     * 유저 정보를 가져온다.
     * @returns {*|{id, apiToken, data}}
     */
    getUser() {
        const user = cookie.getUser();
        if (user) {
            let storage = local.getUser();

            localStorage.setItem(constant.USER.API_TOKEN, encodeURIComponent(user.apiToken));

            if (!storage) {
                localStorage.setItem(constant.USER.ID, user.id);
            } else if (storage.data) {
                localStorage.setItem(constant.USER.DATA, JSON.stringify({
                    ...storage.data,
                    id: user.id,
                    apiToken: user.apiToken
                }));
            }

            storage = local.getUser();
            user.data = storage.data;
        }

        return user;
    },
    /**
     * API TOKEN, 유저 ID 등 인증에 필요한 정보를 제거한다.
     */
    removeUser() {
        local.removeUser();
        cookie.removeUser();
    },

    /**
     * CSRF TOKEN을 반환한다.
     * @return {string}
     */
    getCSRFToken() {
        return local.getCSRFToken();
    },

    /**
     * CSRF TOKEN을 로컬 스토리지에 저장한다.
     * @param {string} [token= ""]
     */
    setCSRFToken(token = "") {
        local.setCSRFToken(token);
    },

    /**
     * CSRF TOKEN을 로컬 스토리지에서 제거한다.
     */
    removeCSRFToken() {
        local.removeCSRFToken();
    },

    /**
     * 로그인 되었는지 판단한다.
     * @returns {boolean}
     */
    isLoginned() {
        return !!this.getUser();
    },

    local,

    cookie
};

export default authentication;
