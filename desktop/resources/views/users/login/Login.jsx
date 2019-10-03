import "./login.scss";
import React, { Component, PropTypes } from "react";
import { render } from "react-dom";

import FSN from "forsnap";
import API from "forsnap-api";
import utils from "forsnap-utils";
import authentication from "forsnap-authentication";
import redirect from "forsnap-redirect";

import PopModal from "shared/components/modal/PopModal";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Input from "shared/components/ui/input/Input";

import App from "desktop/resources/components/App";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Footer from "desktop/resources/components/layout/footer/Footer";
import ScrollTop from "desktop/resources/components/scroll/ScrollTop";
import RestAccount from "./rest/RestAccount";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            isMount: true,
            is_rest: null,
            form: {
                email: "",
                password: ""
            },
            error: {
                email: "",
                password: ""
            }
        };

        this.onLoginEmail = this.onLoginEmail.bind(this);
        this.onChangeForm = this.onChangeForm.bind(this);
        this.onChangeError = this.onChangeError.bind(this);
        this.onValidEmail = this.onValidEmail.bind(this);

        this.login = this.login.bind(this);
        this.success = this.success.bind(this);
        this.fail = this.fail.bind(this);

        this.setStateData = this.setStateData.bind(this);
        this.onRestAccount = this.onRestAccount.bind(this);
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onLoginEmail() {
        const { form, error } = this.state;

        if (!this.onValidEmail("email", form.email)) {
            authentication.removeUser();

            API.auth.loginEmail(form)
                .then(response => {
                    const data = response.data;

                    authentication.setUser(data.user_id, {
                        id: data.user_id,
                        artistNo: data.artist_no,
                        apiToken: data.api_token,
                        email: data.email,
                        name: data.name,
                        profile_img: data.profile_img,
                        rest_dt: data.rest_dt,
                        join_type: data.join_type,
                        block_dt: data.block_dt
                    });

                    if (data.artist_no) {
                        redirect.redirectArtistPage();
                    } else if (location.search) {
                        redirect.main(utils.query.parse(location.search).redirectURL);
                    } else {
                        redirect.main();
                    }
                })
                .catch(e => {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak(e.data)
                    });
                });
        }
    }

    onChangeForm(name, value) {
        this.setStateData(({ form }) => {
            return {
                form: Object.assign({}, form, { [name]: value })
            };
        });
    }

    onChangeError(name, value) {
        this.setStateData(({ error }) => {
            return {
                error: Object.assign({}, error, { [name]: value })
            };
        });
    }

    onValidEmail(name, value) {
        let message = null;
        if (!value) {
            message = "이메일을 입력해주세요.";
        } else if (!utils.isValidEmail(value)) {
            message = "이메일 형식이 유효하지 않습니다.";
        }

        this.onChangeError(name, message);

        return message;
    }

    gaEvent(label) {
        const eCategory = `게스트 촬영요청서${label}`;
        const eAction = "";
        const eLabel = "";
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    success(result) {
        const clone = {
            data: { ...result.data },
            status: result.status,
            statusText: result.statusText
        };

        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });

        API.auth.login(clone.data)
            .then(response => {
                const data = response.data;
                // this.wcsEvent();
                //utils.ad.wcsEvent("2");
                // const guestReferrer = document.referrer;
                // if (guestReferrer && (guestReferrer.indexOf("guest") !== -1 && guestReferrer.indexOf("content") !== -1)) {
                //     this.gaEvent("로그인");
                // }

                authentication.setUser(data.user_id, {
                    id: data.user_id,
                    artistNo: data.artist_no,
                    apiToken: data.api_token,
                    sns: clone.data.type,
                    email: data.email,
                    name: data.name,
                    profile_img: data.profile_img,
                    rest_dt: data.rest_dt,
                    block_dt: data.block_dt
                });

                return data;
            })
            .then(data => {
                if (data.rest_dt) {
                    Modal.close(MODAL_TYPE.PROGRESS);
                    PopModal.alert("해당 계정은 휴면계정입니다.\n포스냅을 계속 이용하시려면 계정을 활성화 시켜주세요.",
                        { callBack: () => this.onRestAccount(data) }
                    );
                    // Modal.show({
                    //     type: MODAL_TYPE.ALERT,
                    //     content: utils.linebreak("해당 계정은 휴면계정입니다.\n포스냅을 계속 이용하시려면 계정을 활성화 시켜주세요."),
                    //     onSubmit: () => {
                    //         console.log("entry");
                    //         this.setState({ is_rest: data.rest_dt, user_id: data.user_id });
                    //     }
                    // });
                } else if (data.artist_no) {
                    redirect.redirectArtistPage();
                } else if (location.search) {
                    redirect.main(utils.query.parse(location.search).redirectURL);
                } else {
                    redirect.main();
                }
            })
            .catch(response => {
                this.fail(response);
            });
    }

    onRestAccount(data) {
        this.setState({ is_rest: data.rest_dt, user_id: data.user_id });
    }

    fail(result) {
        Modal.show({
            type: MODAL_TYPE.ALERT,
            content: utils.linebreak(result.data ? result.data : "에러가 발생했습니다.\n고객센터로 문의해주세요"),
            onSubmit: () => {
                location.reload();
            }
        });
    }

    login(type) {
        // 기존 세션 제거를 위해 호출한다.
        authentication.removeUser();

        const social = FSN.sns.create(FSN.sns.constant[type], { context: this, success: this.success, fail: this.fail });
        if (social) {
            social.login();
        }
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    render() {
        const { is_rest, form, error } = this.state;
        const user = authentication.getUser();
        if (user && is_rest) {
            return (
                <RestAccount rest_dt={is_rest} user_id={user.id} />
            );
        }

        return (
            <main id="site-main">
                <div className="login__container">
                    <div>
                        <div className="email__login">
                            <h2 className="login__header__title">이메일 로그인</h2>
                            <form className="login__form" onSubmit={e => e.preventDefault()}>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="이메일"
                                    value={form.email}
                                    onChange={(e, n, v) => this.onChangeForm(n, v)}
                                    onValidate={(e, n, v) => this.onValidEmail(n, v)}
                                />
                                {error.email ? <div className="login__error">{error.email}</div> : null}
                                <Input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    placeholder="비밀번호"
                                    onChange={(e, n, v) => this.onChangeForm(n, v)}
                                />
                                <button className="_button" onClick={this.onLoginEmail}>로그인</button>
                            </form>
                            <div className="login__options">
                                <a className="find" href="/forget">아이디 / 비밀번호 찾기</a>
                                <a className="join" href="/join">이메일로 회원가입</a>
                            </div>
                        </div>
                        <div className="social__login">
                            <h2 className="login__header__title">SNS 로그인</h2>
                            <div className="lead">
                                별도의 회원 가입 없이 <br />
                                네이버, 페이스북, 카카오톡으로 로그인이 가능합니다.
                            </div>
                            <div className="social__login__buttons">
                                <button className="_button social__naver" onClick={() => this.login("NAVER")}>네이버로 로그인</button>
                                <button className="_button social__facebook" onClick={() => this.login("FACEBOOK")}>페이스북으로 로그인</button>
                                <button className="_button social__kakaotalk" onClick={() => this.login("KAKAO")}>카카오톡으로 로그인</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

render(
    <App>
        <div className="login-page">
            <HeaderContainer />
            <Login />
            <Footer>
                <ScrollTop />
            </Footer>
        </div>
    </App>,
    document.getElementById("root")
);
