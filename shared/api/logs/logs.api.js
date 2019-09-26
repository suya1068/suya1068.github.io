import axios from "axios";
import utils from "shared/helper/utils";

class Auth {
    constructor(instance) {
        this.base = "/log";
        this.instance = instance;
    }

    /**
     * 로그 저장
     * @param message_id
     * @param message
     * @param level
     * @returns {*|{"Content-Type"}}
     */
    log(message_id, message, level) {
        const data = {
            message_id,
            message,
            level
        };
        return this.instance.post(`${this.base}`, utils.query.stringify(data));
    }

    /**
     * 페이지 이동 로그 저장
     * @param params - object({ uuid(required), user_id, url, referer, referer_keyword })
     * @returns {*|{"Content-Type"}}
     */
    logLocation(params) {
        return this.instance.post(`${this.base}/location`, utils.query.stringify(params));
    }
}

export default Auth;
