import React, { Component, PropTypes } from "react";
import CONST from "shared/constant";
import utils from "forsnap-utils";
import API from "forsnap-api";
import auth from "forsnap-authentication";
import PopModal from "shared/components/modal/PopModal";

const { SNS_TYPE, SNS_LINK } = CONST.SNS;

/**
 * 로그인을 위한 csrf token 을 생성한다.
 * @returns {*}
 */
function createCSRFToken() {
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
}

/**
 * type에 해당하는 로그인에 필요한 소셜정보를 가져온다.
 * @param type
 * @param state
 * @returns {{state: *, clientId: (string|string|string|string|string|string), requestURI: (string|string|string), redirectURI: string, responseType: string}}
 */
function createSocialConfig(type, state) {
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
}

/**
 * 로그인 유청 URL을 생성한다.
 * @param config
 * @returns {string}
 */
function createRequestURL(config) {
    const url = `${config.requestURI}?response_type=${config.responseType}&client_id=${config.clientId}&redirect_uri=${config.redirectURI}&state=${config.state}`;
    return config.type === SNS_TYPE.FACEBOOK ? `${url}&scope=email,public_profile` : url;
}

/**
 * location 객체에서 redirectURL을 가져온다.
 * @returns {null|string}
 */
function getRedirectURL(type) {
    const params = utils.query.parse(window.location.search);
    const query = params && params.message ? "" : `?message=${SNS_LINK[type.toUpperCase()]}`;
    return `${window.location}${query}`;
}


class SocialSync extends Component {
    constructor(props) {
        super(props);

        this.state = this.getCompositeData();

        this.onToggleLinkSocial = this.onToggleLinkSocial.bind(this);
        this.onLinkSocial = this.onLinkSocial.bind(this);
        this.onUnlinkSocial = this.onUnlinkSocial.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sync !== this.state.sync) {
            this.setState({ sync: nextProps.sync });
        }
    }

    onToggleLinkSocial() {
        const { type, count } = this.props;
        const data = {
            type,
            count,
            user_id: auth.getUser().id
        };

        if (this.state.sync) {
            this.onUnlinkSocial(data);
        } else {
            this.onLinkSocial(data);
        }
    }

    onLinkSocial(data) {
        const state = createCSRFToken();

        if (state) {
            const redirectURL = getRedirectURL(data.type);
            if (redirectURL) {
                localStorage.setItem(CONST.FORSNAP_REDIRECT, redirectURL);
            }

            location.href = createRequestURL(createSocialConfig(data.type, state));
        }
    }

    onUnlinkSocial(data) {
        if (this.props.join_type === "email" || data.count > 1) {
            API.auth.removeSnsSync({ type: data.type, user_id: data.user_id })
                .then(() => this.props.click({ type: data.type, message: "연동해제되었습니다." }))
                .catch(error => PopModal.alert(error.data ? error.data : "소셜연동 처리중 에러가 발생했습니다.\n고객센터로 문의해주세요"));
        } else {
            PopModal.alert("두개이상 SNS연동 시 해제 가능합니다.");
        }
    }

    /**
     * 초기 state 데이터를 가져온다.
     * @returns {*}
     */
    getCompositeData() {
        const defaultButton = { style: { className: "button button__theme__gray" } };

        const types = {
            naver: {
                icon: { displayName: "네이버", name: "m-icon m-icon-naver" },
                button: defaultButton
            },
            facebook: {
                icon: { displayName: "페이스북", name: "m-icon m-icon-facebook" },
                button: defaultButton
            },
            kakao: {
                icon: { displayName: "카카오톡", name: "m-icon m-icon-kakao" },
                button: defaultButton
            }
        };

        const { icon, button } = types[this.props.type];
        return {
            sync: this.props.sync,
            icon: this.props.icon ? Object.assign(icon, this.props.icon) : icon,
            button: this.props.button ? Object.assign(button, this.props.button) : button
        };
    }

    render() {
        const { button, icon } = this.state;
        const syncButton = "button button__theme__yellow";
        button.style.isActive = this.state.sync;

        return (
            <div>
                <i className={icon.name} />
                <span className={this.state.sync ? "active" : ""}>{icon.displayName}</span>
                <button className={button.style.isActive ? syncButton : button.style.className} onClick={this.onToggleLinkSocial}>
                    { this.state.sync ? "해제하기" : "연결하기"}
                </button>
            </div>
        );
    }
}

SocialSync.propTypes = {
    type: PropTypes.string.isRequired,
    icon: PropTypes.shape({
        displayName: PropTypes.string,
        name: PropTypes.string
    }),
    button: PropTypes.shape({
        displayName: PropTypes.string,
        style: PropTypes.shape({
            size: PropTypes.string,
            width: PropTypes.string,
            shape: PropTypes.string,
            theme: PropTypes.string
        })
    }),
    sync: PropTypes.bool,
    count: PropTypes.number.isRequired,
    click: PropTypes.func.isRequired,
    join_type: PropTypes.string
};

SocialSync.defaultProps = {
    icon: null,
    button: null,
    sync: false
};

export default SocialSync;
