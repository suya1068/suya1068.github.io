import React, { Component, PropTypes } from "react";
import { Container } from "flux/utils";
import auth from "forsnap-authentication";
import API from "forsnap-api";
import utils from "forsnap-utils";
import redirect from "forsnap-redirect";
import AppDispatcher from "mobile/resources/AppDispatcher";
import * as CONST from "mobile/resources/stores/constants";
import { SessionStore, UIStore } from "mobile/resources/stores";
import constant from "shared/constant";
import PopModal from "shared/components/modal/PopModal";

class App extends Component {
    static getStores() {
        return [SessionStore, UIStore];
    }

    static calculateState() {
        return {
            session: SessionStore.getState(),
            ui: UIStore.getState()
        };
    }

    constructor() {
        super();

        this.onError = this.onError.bind(this);
    }

    componentWillMount() {
        window.addEventListener("error", this.onError);
    }

    componentDidMount() {
        let rest_path = false;
        if (location.pathname.startsWith("/login")) {
            rest_path = true;
        }
        this.init(rest_path);
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

                if (message.indexOf("Script error") !== -1 || message.indexOf("checkDomStatus") !== -1) {
                    type = "DEBUG";
                }

                // 네이버 크롤러 봇 예외
                if (userAgent.indexOf("AdsBot-Naver") !== -1) {
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

                // 네이버 봇 추정 ip 예외 처리
                if (document.getElementById("except_ip") && document.getElementById("except_ip").getAttribute("content") === "0") {
                    type = "DEBUG";
                }

                if (e.error && message.indexOf("Uncaught TypeError") !== -1) {
                    // 삼성 브라우저 이슈 (이슈 keep)
                    if (e.error.message && e.error.message === "document.getElementsByClassName.ToString is not a function") {
                        type = "DEBUG";
                    }
                }

                return API.logs.log("script-error", log.join("\n"), type).then(response => {
                    const browser = utils.getBrowser();
                    if (type === "ERROR" && browser.browser !== "naver(higgs)") {
                        redirect.error();
                    }
                });
            }
        }

        return null;
    }


    /**
     * 세션 정보를 체크 후 페이지를 로드한다.
     */
    init(rest_path) {
        const { session } = this.state;

        if (!rest_path && session && session.entity && !utils.type.isEmpty(session.entity.rest_dt)) {
            auth.removeUser();
        }

        if (session.entity) {
            if (!utils.type.isEmpty(session.entity.rest_dt)) {
                this.checkRole();
            } else {
                API.auth.session(this.props.userType)
                    .then(response => response.data.session_info)
                    .then(data => this.checkRole(data))
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
                            PopModal.alert(error.data ? error.data : "오류가 발생했습니다.", func);
                        }
                    });
            }
        } else {
            this.checkRole();
        }

        // if (session.entity) {
        //     API.auth.session(this.props.userType)
        //         .then(response => response.data.session_info)
        //         .then(data => this.checkRole(data))
        //         .catch(error => {
        //             if (error instanceof Error || error instanceof ErrorEvent) {
        //                 this.onError(error);
        //                 // const request = this.onError(error);
        //                 // if (request) {
        //                 //     request.then(result => {
        //                 //         redirect.error();
        //                 //     });
        //                 // } else {
        //                 //     redirect.error();
        //                 // }
        //             } else {
        //                 let func;
        //
        //                 switch (error.status) {
        //                     case 403: {
        //                         func = () => redirect.registArtist();
        //                         break;
        //                     }
        //                     default:
        //                         break;
        //                 }
        //                 PopModal.alert(error.data ? error.data : "오류가 발생했습니다.", func);
        //             }
        //         });
        // } else {
        //     this.checkRole();
        // }
    }

    /**
     * 접근권한 결과에 따라 처리한다.
     * @param {?object} [data = null]
     */
    checkRole(data = null) {
        const result = this.isValidRole(data);
        if (result.valid) {
            this.approveAccess(result);
        } else {
            this.refuseAccess(result);
        }
    }

    /**
     * 유효한 권한인지 판단한다.
     * @param data
     * @returns {{valid: boolean, redirect: null, url: null}}
     */
    isValidRole(data) {
        const roles = this.props.roles;
        const result = { valid: true, redirect: null, url: null };

        if (roles) {
            const { protocol, host, pathname, search, hash } = location;
            const domain = `${protocol}//${host}`;
            const url = `${domain}${location.pathname}${search}`;

            if (!data || !data.is_login) {
                result.redirect = redirect.login;
                result.url = url;
                result.valid = false;
                return result;
            }

            if (roles.includes("artist") && !data.is_artist) {
                result.redirect = redirect.main;
                result.valid = false;
                return result;
            }

            if (roles.includes("customer") && !data.is_login) {
                result.redirect = redirect.login;
                result.url = url;
                result.valid = false;
                return result;
            }
        }

        return result;
    }

    /**
     * 페이지 접근을 승인한다
     */
    approveAccess() {
        AppDispatcher.dispatch({ type: CONST.GLOBAL_SESSION_ACCESS_PAGE });
    }

    /**
     * 페이지 접근을 거부한다.
     * @param result
     */
    refuseAccess(result) {
        // AppDispatcher.dispatch({ type: CONST.GLOBAL_SESSION_NOT_ACCESS_PAGE });

        if (result.url) {
            result.redirect({ redirectURL: result.url });
        } else {
            result.redirect();
        }
    }

    layoutLoading() {
        return (
            <div style={{ width: "100%", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
                <img
                    alt="loading-progress"
                    src={__SERVER__.img + constant.PROGRESS.COLOR_CAT}
                    style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: "100%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                />
            </div>
        );
    }

    layoutRender() {
        const { children } = this.props;

        if (children) {
            return children;
        }

        return null;
    }

    render() {
        const { session } = this.state;

        return (
            <div style={{ width: "100%", minHeight: "100vh" }}>
                { !session.access ? this.layoutLoading() : this.layoutRender()}
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

export default Container.create(App);
