import PopModal from "shared/components/modal/PopModal";

import CONST from "../../constant";
import utils from "../../helper/utils";
import Social from "./social";

const NAVER = __SNS__.naver;
const FACEBOOK = __SNS__.facebook;
const KAKAO = __SNS__.kakao;

const TYPE = {
    KAKAO: "kakao",
    NAVER: "naver",
    FACEBOOK: "facebook"
};

const sns = {
    constant: Object.assign({}, TYPE),

    /**
     * sns로그인을 위한 인스턴스를 생성한다.
     * @param {string} name - sns type
     * @param {{context:object, success:function, fail:?function}} option
     * @returns {*}
     */
    create(name, option) {
        let instance = null;

        const state = utils.getUUID();

        if (this.setCSRFToken(state)) {
            switch (name) {
                case TYPE.KAKAO: {
                    const config = {
                        type: "kakao",
                        state,
                        clientId: KAKAO.client_id,
                        requestURI: KAKAO.code_token_uri,
                        redirectURI: `${__DOMAIN__}/${KAKAO.redirect_uri}`,
                        responseType: KAKAO.response_type
                    };

                    instance = new Social(config);
                    break;
                }
                case TYPE.NAVER: {
                    const config = {
                        type: "naver",
                        state,
                        clientId: NAVER.client_id,
                        requestURI: NAVER.code_token_uri,
                        redirectURI: `${__DOMAIN__}/${NAVER.redirect_uri}`,
                        responseType: NAVER.response_type
                    };

                    instance = new Social(config);
                    break;
                }
                case TYPE.FACEBOOK: {
                    const config = {
                        type: "facebook",
                        state,
                        clientId: FACEBOOK.client_id,
                        requestURI: FACEBOOK.code_token_uri,
                        redirectURI: `${__DOMAIN__}/${FACEBOOK.redirect_uri}`,
                        responseType: FACEBOOK.response_type,
                        scope: "public_profile, email"
                    };

                    instance = new Social(config);
                    break;
                }
                default:
                    throw new Error(`The ${name} is not exists.`);
            }

            if (option) {
                if (typeof option.success === "function") {
                    this.success = option.context ? option.success.bind(option.context) : option.success;
                }
                if (typeof option.fail === "function") {
                    this.fail = option.context ? option.fail.bind(option.context) : option.fail;
                }
            }
        }

        return instance;
    },

    /**
     * 로그인 성공시 호출할 콜백
     * @type {function|null}
     */
    success: null,

    /**
     * 로그인 실패시 호출할 콜백
     * @type {function|null}
     */
    fail: null,

    /**
     * token을 설정한다.
     * @param token
     */
    setCSRFToken(token) {
        try {
            localStorage.setItem(CONST.USER.CSRF_TOKEN, token);
            return true;
        } catch (e) {
            if (e.name === "QuotaExceededError") {
                PopModal.alert("개인정보보호모드(사파리) 또는 시크릿모드(크롬)를 해제후 이용해주세요.\n지속적인 오류 발생시 고객센터로 문의해주세요.");
            } else {
                PopModal.alert("로그인중 오류가 발생했습니다.\n고객센터로 문의해주세요.");
            }
        }

        return false;
    },

    /**
     * token을 제거한다.
     */
    removeCSRFToken() {
        localStorage.removeItem(CONST.USER.CSRF_TOKEN);
    },

    /**
     * 위변조 여부를 체크한다.
     * @param {string} token
     * @returns {boolean}
     */
    isCSRFToken(token) {
        return localStorage.getItem(CONST.USER.CSRF_TOKEN) === token;
    },

    /**
     * SNS callback url을 파싱한다.
     * @param {string} type - naver, facebook, kakao
     * @param {string} uri
     * @returns {{}}
     */
    parseURI(type, uri) {
        const params = {};
        const regexp = /([^#?&=]+)=([^&]*)/g;
        let match = regexp.exec(uri);

        while (match !== null) {
            params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
            match = regexp.exec(uri);
        }

        // Facebook은 인증 후 #_=_ 해쉬가 추가된다. 정확한 state 비교를 위해 추가된 해쉬를 제거한다.
        if (type === TYPE.FACEBOOK && params.state.length - 4 === params.state.lastIndexOf("#_=_")) {
            params.state = params.state.substring(0, params.state.length - 4);
        }

        return params;
    }
};

export default sns;
