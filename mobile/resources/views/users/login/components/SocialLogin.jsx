import classnames from "classnames";
import React, { Component, PropTypes } from "react";
import CONST from "shared/constant";
import utils from "forsnap-utils";
import PopModal from "shared/components/modal/PopModal";


const SNS_TYPE = CONST.SNS.SNS_TYPE;

const SNS_CLASS_NAMES = {
    naver: "social__naver",
    facebook: "social__facebook",
    kakao: "social__kakaotalk"
};


export default function SocialLogin(props) {
    /**
     * 로그인을 위한 csrf token 을 생성한다.
     * @returns {*}
     */
    const createCSRFToken = () => {
        const state = utils.getUUID();

        try {
            localStorage.setItem(CONST.USER.CSRF_TOKEN, state);
            return state;
        } catch (e) {
            if (e.name === "QuotaExceededError") {
                PopModal.alert("개인정보보호모드(사파리) 또는 시크릿모드(크롬)를 해제후 이용해주세요.\n지속적인 오류 발생시 고객센터로 문의해주세요.");
            } else {
                PopModal.alert("로그인중 오류가 발생했습니다.\n고객센터로 문의해주세요.");
            }
        }

        return null;
    };

    /**
     * type에 해당하는 로그인에 필요한 소셜정보를 가져온다.
     * @param type
     * @param state
     * @returns {{state: *, clientId: (string|string|string|string|string|string), requestURI: (string|string|string), redirectURI: string, responseType: string}}
     */
    const createSocailConfig = (type, state) => {
        if (![SNS_TYPE.NAVER, SNS_TYPE.FACEBOOK, SNS_TYPE.KAKAO].includes(type)) {
            throw new Error(`The ${name} is not exists.`);
        }

        const sns = __SNS__[type];

        return {
            state,
            clientId: sns.client_id,
            requestURI: sns.code_token_uri,
            redirectURI: `${__DOMAIN__}/${sns.redirect_uri}`,
            responseType: sns.response_type
        };
    };

    /**
     * 로그인 유청 URL을 생성한다.
     * @param config
     * @returns {string}
     */
    const createRequestURL = config => {
        const url = `${config.requestURI}?response_type=${config.responseType}&client_id=${config.clientId}&redirect_uri=${config.redirectURI}&state=${config.state}`;
        return config.type === SNS_TYPE.FACEBOOK ? `${url}&scope=email,public_profile` : url;
    };

    /**
     * location 객체에서 redirectURL을 가져온다.
     * @returns {null|string}
     */
    const getRedirectURL = () => {
        if (window.location.search) {
            return utils.query.parse(window.location.search).redirectURL || null;
        }

        return null;
    };

    /**
     * SNS 로그인을 한다.
     * @param event
     */
    const onLogin = event => {
        const state = createCSRFToken();

        if (state) {
            const redirectURL = getRedirectURL();
            if (redirectURL) {
                localStorage.setItem(CONST.FORSNAP_REDIRECT, redirectURL);
            }

            location.href = createRequestURL(createSocailConfig(props.type, state));
        }
    };

    return (
        <button className={classnames("_button", SNS_CLASS_NAMES[props.type])} onClick={onLogin}>
            <span>{ props.children }</span>
        </button>
    );
}

SocialLogin.propTypes = {
    type: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};
