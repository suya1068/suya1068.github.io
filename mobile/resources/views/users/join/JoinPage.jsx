import "./JoinPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import api from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import cookie from "forsnap-cookie";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import regular from "shared/constant/regular.const";
import constant from "shared/constant";

import Input from "shared/components/ui/input/Input";
import DropDown from "shared/components/ui/dropdown/DropDown";

import AppDispatcher from "mobile/resources/AppDispatcher";
import * as CONST from "mobile/resources/stores/constants";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, Footer, OverlayContainer } from "mobile/resources/containers/layout";

class JoinPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            form: {
                email: "",
                password1: "",
                password2: "",
                phone_first: "",
                phone: "",
                code: "",
                duplicate: null
            },
            error: {
                email: "",
                password1: "",
                password2: "",
                phone: "",
                code: ""
            },
            phoneList: [
                { name: "010", value: "010" },
                { name: "011", value: "011" },
                { name: "016", value: "016" },
                { name: "017", value: "017" },
                { name: "018", value: "018" },
                { name: "019", value: "019" }
            ],
            time: 0,
            phone: "",
            phone_code: "",
            retry: 0,
            agree: false,
            process: false,
            loading: false
        };

        this.onChangeForm = this.onChangeForm.bind(this);
        this.onChangeError = this.onChangeError.bind(this);
        this.onCheckEmail = this.onCheckEmail.bind(this);
        this.onPhoneCode = this.onPhoneCode.bind(this);
        this.onConfirmPhoneCode = this.onConfirmPhoneCode.bind(this);
        this.onValidForm = this.onValidForm.bind(this);
        this.onAgree = this.onAgree.bind(this);
        this.onJoin = this.onJoin.bind(this);

        this.apiCheckEmail = this.apiCheckEmail.bind(this);
        this.apiPhoneCode = this.apiPhoneCode.bind(this);
        this.apiConfirmPhoneCode = this.apiConfirmPhoneCode.bind(this);
        this.apiJoin = this.apiJoin.bind(this);

        this.validForm = this.validForm.bind(this);
        this.setStateData = this.setStateData.bind(this);
        this.setProcess = this.setProcess.bind(this);
    }

    componentWillMount() {
        const user = auth.getUser();
        if (user) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "로그아웃 후 회원가입이 가능합니다.",
                onSubmit: () => {
                    location.href = "/";
                }
            });
        } else {
            this.state.loading = true;
            this.onChangeForm("phone_first", this.state.phoneList[0].value);
        }
    }

    componentDidMount() {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "이메일 회원가입" });
        }, 0);
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onChangeForm(name, value) {
        this.setStateData(({ form }) => {
            const prop = {
                [name]: value
            };

            if (name === "email") {
                prop.duplicate = null;
            }

            return {
                form: Object.assign({}, form, prop)
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

    onCheckEmail() {
        const { form, process } = this.state;
        const message = this.validForm("email", form.email);

        if (message) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: message
            });
        } else if (!process) {
            this.apiCheckEmail({ email: form.email })
                .then(data => {
                    if (data) {
                        if (data.result) {
                            this.onChangeError("email", null);
                            this.onChangeForm("duplicate", false);
                            Modal.show({
                                type: MODAL_TYPE.ALERT,
                                content: "사용 가능한 이메일입니다."
                            });
                        } else {
                            this.onChangeError("email", "이미 등록되어있는 이메일 입니다.");
                            this.onChangeForm("duplicate", true);
                        }
                    }
                });
        }
    }

    onPhoneCode() {
        const { form, time, phone, process } = this.state;
        const elapse = Date.now() - time;
        const isTime = elapse > 30000;
        const number = `${form.phone_first}${form.phone}`;

        if (number === phone && !isTime) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(`인증번호 재발송은\n${(30 - (elapse / 1000)).toFixed()}초 후에 가능합니다.`)
            });
        } else if (!process) {
            this.apiPhoneCode({ phone: number })
                .then(data => {
                    if (data) {
                        this.setStateData(() => {
                            return {
                                time: Date.now(),
                                phone: number
                            };
                        }, () => {
                            Modal.show({
                                type: MODAL_TYPE.ALERT,
                                content: "인증번호가 전송되었습니다."
                            });
                        });
                    }
                });
        }
    }

    onConfirmPhoneCode() {
        const { form, phone, retry, process } = this.state;
        const number = `${form.phone_first}${form.phone}`;
        let message = null;

        if (retry > 4) {
            message = "인증번호를 5회 잘못 입력하셨습니다.\n새롭게 인증번호를 받아주세요.";
        } else if (!form.code) {
            message = "인증번호를 입력해주세요.";
        } else if (number !== phone) {
            message = "인증받을 휴대폰번호가 잘못되었습니다.\n새롭게 인증번호를 받아주세요.";
        } else if (!process) {
            this.apiConfirmPhoneCode({ phone: number, code: form.code })
                .then(data => {
                    if (data) {
                        this.setStateData(() => {
                            return {
                                phone_code: form.code
                            };
                        }, () => {
                            cookie.setCookie({ [constant.USER.PHONE_CODE]: form.code });

                            Modal.show({
                                type: MODAL_TYPE.ALERT,
                                content: "인증되었습니다."
                            });
                        });
                    }
                });
        }

        if (message) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: message
            });
        }
    }

    onValidForm(name, value) {
        const message = this.validForm(name, value);
        this.onChangeError(name, message);
        return message;
    }

    onAgree() {
        this.setStateData(({ agree }) => {
            return {
                agree: !agree
            };
        });
    }

    onJoin() {
        const { form, phone, agree, process } = this.state;
        const validCode = cookie.getCookies(constant.USER.PHONE_CODE);
        const keys = Object.keys(form);
        const valid = {
            message: "",
            status: true
        };
        keys.forEach(key => {
            const message = this.onValidForm(key, form[key]);
            if (valid.status && message) {
                valid.message = message;
                valid.status = false;
            }
        });

        if (!valid.status) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: valid.message
            });
        } else if (!agree) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "개인정보 수집 및 이용에 동의해주세요."
            });
        } else if (`${form.phone_first}${form.phone}` !== phone) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "휴대폰 번호가 인증받은 휴대폰 번호와 다릅니다.\n다시 인증해주세요."
            });
        } else if (form.code !== validCode) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "인증번호를 다시 확인해주세요."
            });
        } else if (!process) {
            const params = {
                email: form.email,
                password: form.password1,
                phone: `${form.phone_first}${form.phone}`
            };

            this.apiJoin(params)
                .then(data => {
                    if (data) {
                        cookie.removeCookie(constant.USER.PHONE_CODE);
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: "회원가입이 되었습니다.",
                            onSubmit: () => {
                                document.location.href = "/login";
                            }
                        });
                    }
                });
        }
    }

    apiCheckEmail(data) {
        this.setProcess(true);
        return api.join.checkEmail(data)
            .then(response => {
                this.setProcess(false);
                return response.data;
            })
            .catch(error => {
                this.setProcess(false);
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: error.data
                });
            });
    }

    apiPhoneCode(data) {
        this.setProcess(true);
        return api.join.phoneCode(data)
            .then(response => {
                this.setProcess(false);
                return response.data;
            })
            .catch(error => {
                this.setProcess(false);
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: error.data
                });
            });
    }

    apiConfirmPhoneCode(data) {
        this.setProcess(true);
        return api.join.confirmPhoneCode(data)
            .then(response => {
                this.setProcess(false);
                return response.data;
            })
            .catch(error => {
                this.setProcess(false);
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: error.data
                });
            });
    }

    apiJoin(data) {
        this.setProcess(true);
        return api.join.join(data)
            .then(response => {
                this.setProcess(false);
                return response.data;
            })
            .catch(error => {
                this.setProcess(false);
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: error.data
                });
            });
    }

    validForm(name, value) {
        const { form } = this.state;
        let message = "";

        switch (name) {
            case "email": {
                if (!value) {
                    message = "이메일을 입력해주세요.";
                } else if (!utils.isValidEmail(value)) {
                    message = "이메일 형식이 유효하지 않습니다.";
                }
                break;
            }
            case "password1": {
                const length = value.length;

                if (!value) {
                    message = "비밀번호를 입력해주세요.";
                } else if (length < 8 || length > 15) {
                    message = "대문자,소문자,숫자,특수문자 중 3가지를 포함한 조합으로 8자~15자를 입력해주세요.";
                } else {
                    let count = 0;
                    if (value.match(/[a-z]+/)) {
                        count += 1;
                    }

                    if (value.match(/[A-Z]+/)) {
                        count += 1;
                    }

                    if (value.match(/[0-9]+/)) {
                        count += 1;
                    }

                    if (value.match(/[`~!@#$%^&*()\-=_+;':",./<>?[\]\\{}|]+/)) {
                        count += 1;
                    }

                    if (count < 3) {
                        message = "대문자,소문자,숫자,특수문자 중 3가지를 포함한 조합으로 8자~15자를 입력해주세요.";
                    }
                }
                break;
            }
            case "password2": {
                const password = form.password1;
                if (!value) {
                    message = "비밀번호 확인은 필수입니다.";
                } else if (password !== value) {
                    message = "입력하신 비밀번호와 동일하게 입력해주세요.";
                }
                break;
            }
            case "phone": {
                const length = value.length;

                if (!value) {
                    message = "전화번호를 입력해주세요.";
                } else if (length < 7 || length > 8) {
                    message = "전화번호를 확인해주세요.";
                }
                break;
            }
            case "code": {
                const length = value.length;

                if (!value) {
                    message = "인증번호를 입력해주세요.";
                } else if (length !== 6) {
                    message = "인증번호를 확인해주세요.";
                }
                break;
            }
            case "duplicate": {
                if (value === null) {
                    message = "이메일 중복체크를 해주세요.";
                } else if (value) {
                    message = "이미 등록되어있는 이메일 입니다.";
                }
                break;
            }
            default:
                break;
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

    setProcess(b) {
        if (b) {
            this.setStateData(() => {
                return {
                    progress: true
                };
            }, () => {
                Modal.show({
                    type: MODAL_TYPE.PROGRESS
                });
            });
        } else {
            this.setStateData(() => {
                return {
                    progress: false
                };
            }, () => {
                Modal.close(MODAL_TYPE.PROGRESS);
            });
        }
    }

    render() {
        const { loading, form, error, phone, phone_code, phoneList, agree } = this.state;

        if (!loading) {
            return null;
        }

        const keysForm = Object.keys(form);
        const keysError = Object.keys(error);

        return (
            <div className="site-main">
                <div className="join__page">
                    <div>
                        <div className="join__container">
                            <div className="join__content">
                                <h2 className="title">고객 정보 입력</h2>
                                <form className="join__row join__email" onSubmit={e => e.preventDefault()}>
                                    <Input
                                        className={error.email ? "_input__error" : ""}
                                        type="text"
                                        name="email"
                                        value={form.email}
                                        placeholder="이메일"
                                        onChange={(e, n, v) => this.onChangeForm(n, v)}
                                        onValidate={(e, n, v) => this.onValidForm(n, v)}
                                    />
                                    <button className="_button _button__default" onClick={this.onCheckEmail}>중복체크</button>
                                </form>
                                {error.email ?
                                    <div className="join__row">
                                        <span className="error__line">{error.email}</span>
                                    </div> : null
                                }
                                <div className="join__row join__password">
                                    <Input
                                        className={error.password1 ? "_input__error" : ""}
                                        type="password"
                                        name="password1"
                                        value={form.password1}
                                        regular={/\s/}
                                        placeholder="비밀번호"
                                        onChange={(e, n, v) => this.onChangeForm(n, v)}
                                        onValidate={(e, n, v) => this.onValidForm(n, v)}
                                    />
                                </div>
                                {error.password1 ?
                                    <div className="join__row">
                                        <span className="error__line">{error.password1}</span>
                                    </div> : null
                                }
                                <div className="join__row">
                                    <Input
                                        className={error.password2 ? "_input__error" : ""}
                                        type="password"
                                        name="password2"
                                        value={form.password2}
                                        regular={/\s/}
                                        onChange={(e, n, v) => this.onChangeForm(n, v)}
                                        onValidate={(e, n, v) => this.onValidForm(n, v)}
                                        placeholder="비밀번호 재확인"
                                    />
                                </div>
                                {error.password2 ?
                                    <div className="join__row">
                                        <span className="error__line">{error.password2}</span>
                                    </div> : null
                                }
                                <form className="join__row join__phone" onSubmit={e => e.preventDefault()}>
                                    <div className={classNames("phone__number", { error: error.phone })}>
                                        <DropDown
                                            data={phoneList}
                                            select={form.phone_first}
                                            disabled={!!phone_code}
                                            onSelect={value => this.onChangeForm("phone_first", value)}
                                        />
                                        <Input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            regular={regular.INPUT.NUMBER}
                                            max="8"
                                            disabled={!!phone_code}
                                            placeholder="전화번호"
                                            onChange={(e, n, v) => this.onChangeForm(n, v)}
                                            onValidate={(e, n, v) => this.onValidForm(n, v)}
                                        />
                                    </div>
                                    <button
                                        className={classNames("_button", !form.phone || error.phone || phone_code ? "_button__disable" : "_button__default")}
                                        onClick={!form.phone || error.phone || phone_code ? null : this.onPhoneCode}
                                    >인증번호 받기</button>
                                </form>
                                {error.phone ?
                                    <div className="join__row">
                                        <span className="error__line">{error.phone}</span>
                                    </div> : null
                                }
                                <form className="join__row" onSubmit={e => e.preventDefault()}>
                                    <Input
                                        className={error.code ? "_input__error" : ""}
                                        type="tel"
                                        name="code"
                                        value={form.code}
                                        regular={regular.INPUT.NUMBER}
                                        max="6"
                                        disabled={!phone || error.phone || !!phone_code}
                                        placeholder="인증번호 입력"
                                        onChange={(e, n, v) => this.onChangeForm(n, v)}
                                        onValidate={(e, n, v) => this.onValidForm(n, v)}
                                    />
                                    <button
                                        className={classNames("_button", !phone || error.phone || phone_code ? "_button__disable" : "_button__black")}
                                        onClick={!phone || error.phone || phone_code ? null : this.onConfirmPhoneCode}
                                    >확인</button>
                                </form>
                                {error.code ?
                                    <div className="join__row">
                                        <span className="error__line">{error.code}</span>
                                    </div> : null
                                }
                                <div className="join__agree">
                                    <div className="agree__content">
                                        <strong>
                                            [<a href="https://forsnap.com/policy/private" target="_blank">개인정보 수집</a>
                                            및
                                            <a href="https://forsnap.com/policy/term" target="_blank">이용동의</a>]
                                        </strong>
                                    </div>
                                    <div className="agree__button" onClick={this.onAgree}>
                                        <div className={classNames("agree__button__icon", { active: agree })}><span className="circle" /></div>
                                        <div className="agree__button__content">동의합니다.</div>
                                    </div>
                                </div>
                                <div className="join__row join__policy">
                                    포스냅은 고객의 요청에 정확하고 성실한 답변을 드리기 위해<br />
                                    필요한 최소한의 개인정보를 수집하고 있습니다.<br />
                                    <br />
                                    개인정보 수집 이용목적 : 고객지원 담당자 확인 및 문의내용 처리<br />
                                    수집하는 개인정보 항목 : 이름 전화번호<br />
                                    수집하는 개인정보의 처리 및 보존기간 : 1년 보관 후 파기
                                </div>
                                <div className="join__buttons">
                                    <button className={classNames("_button", "_button__fill__yellow")} onClick={this.onJoin}>가입하기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <AppContainer>
        <HeaderContainer />
        <JoinPage />
        <LeftSidebarContainer />
        <Footer />
        <OverlayContainer />
    </AppContainer>,
    document.getElementById("root")
);
