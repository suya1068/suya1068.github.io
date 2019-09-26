import React, { Component, PropTypes } from "react";

import auth from "forsnap-authentication";
import API from "forsnap-api";
import redirect from "forsnap-redirect";
import utils from "forsnap-utils";

import siteDispatcher from "desktop/resources/components/siteDispatcher";
import constant from "shared/constant";
import PopModal from "shared/components/modal/PopModal";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            isProcess: true,
            session: null
        };

        this.onError = this.onError.bind(this);
        this.getUser = this.getUser.bind(this);
        this.checkRole = this.checkRole.bind(this);
        this.isRole = this.isRole.bind(this);
        this.onDivLoaded = this.onDivLoaded.bind(this);
    }

    componentWillMount() {
        window.addEventListener("error", this.onError);
    }

    componentDidMount() {
        this.getUser();
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
        window.removeEventListener("error", this.onError);
    }

    onError(e) {
        if (e) {
            const message = e.message ? e.message : "";

            if (message) {
                let type = "ERROR";
                const log = [];
                const user = auth.getUser();
                const userAgent = navigator.userAgent;

                log.push(`location: ${location.href}`);
                log.push(`agent: ${userAgent}`);

                if (user) {
                    log.push(`user_id: ${user.id}`);
                }

                log.push(`message: ${message}`);
                log.push(`time: ${new Date().toString()}`);

                if (e.error) {
                    log.push(`error_message: ${e.error.message}`);
                    log.push(`error_stack: ${e.error.stack}`);
                }

                // 네이버 크롤러 봇 예외
                if (userAgent.indexOf("AdsBot-Naver") !== -1) {
                    type = "DEBUG";
                }

                // 네이버 봇 추정 ip 예외 처리
                if (document.getElementById("except_ip") && document.getElementById("except_ip").getAttribute("content") === "0") {
                    type = "DEBUG";
                }

                // 다음 검색 봇 예외
                if (userAgent.indexOf("Daum/4.1") !== -1) {
                    type = "DEBUG";
                }

                // 구글 봇 예외
                if (userAgent.indexOf("Googlebot") !== -1 || userAgent.indexOf("AdsBot-Google")) {
                    type = "DEBUG";
                }

                if (message.indexOf("Script error") !== -1 || message.indexOf("checkDomStatus") !== -1) {
                    type = "DEBUG";
                }

                return API.logs.log("script-error", log.join("\n"), type).then(response => {
                    if (type === "ERROR") {
                        const browser = utils.getBrowser();
                        if (type === "ERROR" && browser.browser !== "naver(higgs)") {
                            redirect.error();
                        }
                    }
                });
            }
        }

        return null;
    }

    onDivLoaded() {
        const isLoading = this.state.loading;
        const isProcess = this.state.isProcess;

        if (!isLoading && isProcess) {
            if (this.state.session) {
                siteDispatcher.dispatch({
                    actionType: constant.DISPATCHER.HEADER_USER_UPDATE,
                    userInfo: this.state.session
                });
            }

            this.setState({
                isProcess: false
            });
        }
    }

    /**
     * 로그인 여부를 판단한다.
     *
     */
    getUser() {
        const user = auth.getUser();

        if (user) {
            const is_rest = user.data && !utils.type.isEmpty(user.data.rest_dt);
            if (is_rest) {
                auth.removeUser();
                this.checkRole();
            } else {
                API.auth.session(this.props.userType)
                    .then(response => {
                        return response.data.session_info;
                    })
                    .then(session => {
                        auth.local.updateUser(user.id,
                            {
                                profile_img: session.profile_img,
                                is_artist: utils.stringToBoolen(session.is_artist),
                                block_dt: session.block_dt
                            }
                        );
                        this.checkRole(session);
                    })
                    .catch(error => {
                        if (error instanceof Error || error instanceof ErrorEvent) {
                            this.onError(error);
                            // const request = this.onError(error);
                            // if (request) {
                            //     request.then(result => {
                            //         redirect.error();
                            //     });
                            // } else {
                            //     redirect.error();
                            // }
                        } else {
                            let func;
                            switch (error.status) {
                                case 403: {
                                    func = () => redirect.registArtist();
                                    break;
                                }
                                default:
                                    break;
                            }
                            PopModal.alert(error.data ? error.data : "오류가 발생했습니다.", { callBack: func });
                        }
                    });
            }
        } else {
            auth.removeUser();
            this.checkRole();
        }
    }

    /**
     * 권한을 체크한다.
     * @param {object} [info = null]
     */
    checkRole(info = null) {
        if (this.isRole(info)) {
            this.setState({
                loading: false,
                session: info
            }, () => {
                if (this.state.session) {
                    siteDispatcher.dispatch({
                        actionType: constant.DISPATCHER.HEADER_USER_UPDATE,
                        userInfo: this.state.session
                    });
                }
            });
        }
    }

    /**
     * 권한이 유효한지 판단한다.
     * @param {object} info
     * @returns {boolean}
     */
    isRole(info) {
        const roles = this.props.roles;

        if (roles) {
            const redirectURL = `${location.pathname}${location.search}${location.hash}`;

            if (!info || !info.is_login) {
                // AJAX에서 처리할지 공통 컴포넌트에서 처리할지 판단 필요!
                auth.removeUser();
                redirect.login({ redirectURL });
                return false;
            }

            if (roles.includes("artist") && !info.is_artist) {
                // 작가등록 페이지 또는 로그인 페이지로 이동
                redirect.main();
                return false;
            }

            if (roles.includes("customer") && !info.is_login) {
                // 로그인 없이 페이지 접근시 로그인 페이지로 이동
                redirect.login({ redirectURL });
                return false;
            }

            return true;
        }

        return true;
    }

    render() {
        const isLoading = this.state.loading;
        const isProcess = this.state.isProcess;

        return (
            <div style={{ width: "100%", height: "100%" }}>
                {isProcess ?
                    <div style={{ width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
                        <img
                            alt="로딩중입니다.."
                            src={__SERVER__.img + constant.PROGRESS.COLOR_CAT}
                            style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: "100%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                        />
                    </div>
                    : null }
                <div onLoad={this.onDivLoaded} style={{ transition: "opacity 0.6s ease", opacity: isProcess ? "0" : "1", width: "100%", height: "100%" }}>{isLoading ? null : this.props.children}</div>
            </div>
        );
    }
}

App.propTypes = {
    children: PropTypes.node.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
    userType: PropTypes.oneOf(["U", "A"])
};

App.defaultProps = {
    roles: null,
    userType: "U"
};

export default App;
