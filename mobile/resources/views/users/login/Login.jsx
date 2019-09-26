import React, { Component } from "react";

import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import api from "forsnap-api";
import redirect from "forsnap-redirect";

import constant from "shared/constant";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Input from "shared/components/ui/input/Input";

import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";

import SocialLogin from "./components/SocialLogin";
import PopModal from "shared/components/modal/PopModal";

export default class Login extends Component {
    constructor(props) {
        super(props);
        const search = location.search && utils.query.parse(location.search);
        this.state = {
            isMount: true,
            rest: search && search.rest,
            redirectURL: search && search.redirectURL,
            user: undefined,
            form: {
                email: "",
                password: ""
            }
        };

        this.onLoginEmail = this.onLoginEmail.bind(this);
        this.onChangeForm = this.onChangeForm.bind(this);
        this.onValidEmail = this.onValidEmail.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
        if (localStorage) {
            localStorage.removeItem(constant.FORSNAP_REDIRECT);
        }
        const user = auth.getUser();
        if (user) {
            this.setState({ user });
        }
    }

    componentDidMount() {
        const { rest, user, redirectURL } = this.state;
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "로그인" });
        }, 0);

        if (rest && rest === "true" && user && user.data.rest_dt) {
            let url = "/login/rest";
            if (redirectURL) {
                url += `?redirectURL=${redirectURL}`;
            }
            PopModal.alert("해당 계정은 휴면계정입니다.\n포스냅을 계속 이용하시려면 계정을 활성화 시켜주세요.",
                { callBack: () => { location.href = url; } }
            );
            // Modal.show({
            //     type: MODAL_TYPE.ALERT,
            //     content: "해당계정은 휴면계정입니다.\n포스냅을 계속 이용하시려면 계정을 활성화 시켜주세요.",
            //     onSubmit: () => { location.href = url; }
            // });
        }
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onLoginEmail() {
        const { form } = this.state;

        if (!this.onValidEmail("email", form.email)) {
            auth.removeUser();

            api.auth.loginEmail(form)
                .then(response => {
                    const data = response.data;

                    auth.setUser(data.user_id, {
                        id: data.user_id,
                        artistNo: data.artist_no,
                        apiToken: data.api_token,
                        email: data.email,
                        name: data.name,
                        profile_img: data.profile_img,
                        rest_dt: data.rest_dt,
                        join_type: data.join_type
                    });

                    if (location.search) {
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

    onValidEmail(name, value) {
        let message = null;
        if (!value) {
            message = "이메일을 입력해주세요.";
        } else if (!utils.isValidEmail(value)) {
            message = "이메일 형식이 유효하지 않습니다.";
        }

        return message;
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    render() {
        const { form } = this.state;

        return (
            <main className="site-main">
                <div className="login__container">
                    <div className="login__logo">
                        <img src={`${__SERVER__.img}/common/f_logo_cat_block.png`} alt="logo" />
                    </div>
                    <div className="email__login">
                        <form className="login__form" onSubmit={e => e.preventDefault()}>
                            <Input
                                type="email"
                                name="email"
                                placeholder="이메일"
                                value={form.email}
                                onChange={(e, n, v) => this.onChangeForm(n, v)}
                            />
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
                        <div className="social__login__buttons">
                            <SocialLogin type="naver">네이버<br />로그인</SocialLogin>
                            <SocialLogin type="facebook">페이스북<br />로그인</SocialLogin>
                            <SocialLogin type="kakao">카카오톡<br />로그인</SocialLogin>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}
