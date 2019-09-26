import utils from "shared/helper/utils";

class Join {
    constructor(instance) {
        this.base = "/join";
        this.instance = instance;
    }

    /**
     * 이메일 중복 체크
     * @param data - Object (email)
     */
    checkEmail(data) {
        return this.instance.get(`${this.base}/email?${utils.query.stringify(data)}`);
    }

    /**
     * 전화번호 인증코드 발송
     * @param data - Object (phone)
     * @return {Promise}
     */
    phoneCode(data) {
        return this.instance.post(`${this.base}/phone-code`, utils.query.stringify(data));
    }

    /**
     * 전화번호 인증코드 확인
     * @param data - Object (phone, code)
     * @return {Promise}
     */
    confirmPhoneCode(data) {
        return this.instance.put(`${this.base}/phone-code`, utils.query.stringify(data));
    }

    /**
     * 이메일 로그인 회원가입
     * @param data - Object (email, password, phone)
     * @return {Promise}
     */
    join(data) {
        return this.instance.post(this.base, utils.query.stringify(data));
    }
}

export default Join;
