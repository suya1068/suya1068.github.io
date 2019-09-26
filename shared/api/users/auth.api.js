import axios from "axios";
import utils from "shared/helper/utils";

class Auth {
    constructor(instance) {
        this.base = "";
        this.instance = instance;
    }

    /**
     * 세션 정보를 가져온다.
     * @param {string} id
     */
    session(userType) {
        return this.instance.get(`${this.base}/session?user_type=${userType}`);
    }

    /**
     * 로그인을 요청한다.
     * @param {object} [data = {}]
     * @param {object} [options= {}]
     * @returns {axios.Promise|*}
     */
    login(data = {}, options = {}) {
        return this.instance.post("login", utils.query.stringify(data), Object.assign({}, options));
    }

    /**
     * 이메일 로그인
     * @param data - Object(email, password)
     * @param options - Object
     * @returns {axios.Promise|*}
     */
    loginEmail(data = {}, options = {}) {
        return this.instance.post("email-login", utils.query.stringify(data), Object.assign({}, options));
    }

    /**
     * 로그아웃을 요청한다.
     * @param {object} [data = {}]
     * @param {object} [options= {}]
     * @returns {axios.Promise|*}
     */
    logout(data = {}, options = {}) {
        return this.instance.delete("logout", Object.assign({}, options));
    }

    /**
     * 추가적으로 SNS를 연동한다.
     * @param data
     * @param options
     * @returns {axios.Promise|*}
     */
    addSnsSync(data = {}, options = {}) {
        return this.instance.post("snssync", utils.query.stringify(data), Object.assign({}, options));
    }

    /**
     * 연동된 SNS을 해제한다.
     * @param data
     * @param options
     * @returns {*|boolean|axios.Promise}
     */
    removeSnsSync(data = {}, options = {}) {
        const query = utils.query.stringify({
            user_id: data.user_id,
            type: data.type
        });

        return this.instance.delete(`snssync?${query}`, Object.assign({}, options));
    }

    /**
     * 회원탈퇴를 한다.
     * @param id
     * @param data
     * @returns {IDBRequest | Promise<void>}
     */
    getout(id, data) {
        return this.instance.put(`getout/${id}`, utils.query.stringify(data));
    }

    /**
     * 계정정보 찾기 전화번호 인증코드 발송
     * @param data - Object (phone)
     * @return {*|{Content-Type}}
     */
    phoneCodeAccount(data) {
        return this.instance.post("/auth/phone-code", utils.query.stringify(data));
    }

    /**
     * 이메일 찾기 전화번호 인증코드 확인
     * @param data - Object (phone, code)
     * @return {*}
     */
    confirmPhoneCodeEmail(data) {
        return this.instance.put("/auth/email/phone-code", utils.query.stringify(data));
    }

    /**
     * 비밀번호 변경 전화번호 인증코드 확인
     * @param data - Object (email, phone, code)
     * @return {*}
     */
    confirmPhoneCodePassword(data) {
        return this.instance.put("/auth/password/phone-code", utils.query.stringify(data));
    }
}

export default Auth;
