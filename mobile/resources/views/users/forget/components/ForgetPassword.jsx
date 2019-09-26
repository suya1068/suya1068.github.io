import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import api from "forsnap-api";
import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import regular from "shared/constant/regular.const";

import Input from "shared/components/ui/input/Input";
import DropDown from "shared/components/ui/dropdown/DropDown";

class ForgetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            form: {
                email: "",
                phone_first: "",
                phone: "",
                code: ""
            },
            error: {
                email: "",
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
            confirm: false,
            retry: 0,
            process: false,
            notice: "계정에 등록된 이메일과 전화번호를 입력해주세요."
        };

        this.onChangeForm = this.onChangeForm.bind(this);
        this.onChangeError = this.onChangeError.bind(this);
        this.onPhoneCode = this.onPhoneCode.bind(this);
        this.onConfirmPhoneCode = this.onConfirmPhoneCode.bind(this);

        this.onValidEmail = this.onValidEmail.bind(this);
        this.onValidPhone = this.onValidPhone.bind(this);
        this.onValidCode = this.onValidCode.bind(this);

        this.apiPhoneCode = this.apiPhoneCode.bind(this);
        this.apiConfirmPhoneCode = this.apiConfirmPhoneCode.bind(this);

        this.setStateData = this.setStateData.bind(this);
        this.setProcess = this.setProcess.bind(this);
    }

    componentWillMount() {
        this.onChangeForm("phone_first", this.state.phoneList[0].value);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.state.isMount = false;
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
        const { form, phone, retry } = this.state;
        const number = `${form.phone_first}${form.phone}`;
        let message = null;

        if (retry > 4) {
            message = "인증번호를 5회 잘못 입력하셨습니다.\n새롭게 인증번호를 받아주세요.";
        } else if (!form.code) {
            message = "인증번호를 입력해주세요.";
        } else if (number !== phone) {
            message = "인증받을 휴대폰번호가 잘못되었습니다.\n새롭게 인증번호를 받아주세요.";
        } else {
            message = this.onValidEmail("email", form.email);
        }

        if (message) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: message
            });
        } else {
            this.apiConfirmPhoneCode({ email: form.email, phone: number, code: form.code })
                .then(data => {
                    if (data) {
                        if (data.result) {
                            this.setStateData(() => {
                                return {
                                    notice: "SMS로 임시 비밀번호가 발송되었습니다.",
                                    confirm: true
                                };
                            }, () => {
                                Modal.show({
                                    type: MODAL_TYPE.ALERT,
                                    content: "인증되었습니다."
                                });
                            });
                        } else {
                            Modal.show({
                                type: MODAL_TYPE.ALERT,
                                content: "인증실패"
                            });
                        }
                    }
                });
        }
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

    onValidPhone(name, value) {
        let message = null;
        const length = value.length;

        if (!value) {
            message = "전화번호를 입력해주세요.";
        } else if (length < 7 || length > 8) {
            message = "전화번호를 확인해주세요.";
        }

        this.onChangeError(name, message);
        return message;
    }

    onValidCode(name, value) {
        let message = null;
        const length = value.length;

        if (!value) {
            message = "인증번호를 입력해주세요.";
        } else if (length !== 6) {
            message = "인증번호를 확인해주세요.";
        }

        this.onChangeError(name, message);
        return message;
    }

    apiPhoneCode(data) {
        this.setProcess(true);
        return api.auth.phoneCodeAccount(data)
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
        return api.auth.confirmPhoneCodePassword(data)
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
        const { form, error, phone, confirm, phoneList, notice } = this.state;

        return (
            <div className="forget__password">
                <div className="forget__notice">{notice}</div>
                {confirm ?
                    <div className="forget__buttons">
                        <a className="_button _button__fill__yellow1" href="/login">로그인하러 가기</a>
                    </div> :
                    <div>
                        <form className="forget__row" onSubmit={e => e.preventDefault()}>
                            <Input
                                className={error.email ? "_input__error" : ""}
                                type="text"
                                name="email"
                                value={form.email}
                                placeholder="이메일"
                                onChange={(e, n, v) => this.onChangeForm(n, v)}
                                onValidate={(e, n, v) => this.onValidEmail(n, v)}
                            />
                        </form>
                        {error.email ?
                            <div className="forget__row">
                                <span className="error__line">{error.email}</span>
                            </div> : null
                        }
                        <form className="forget__row" onSubmit={e => e.preventDefault()}>
                            <div className={classNames("phone__number", { error: error.phone })}>
                                <DropDown
                                    data={phoneList}
                                    select={form.phone_first}
                                    disabled={!!confirm}
                                    onSelect={value => this.onChangeForm("phone_first", value)}
                                />
                                <Input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    regular={regular.INPUT.NUMBER}
                                    max="8"
                                    disabled={!!confirm}
                                    placeholder="전화번호"
                                    onChange={(e, n, v) => this.onChangeForm(n, v)}
                                    onValidate={(e, n, v) => this.onValidPhone(n, v)}
                                />
                            </div>
                            <button
                                className={classNames("_button", !form.phone || error.phone || confirm ? "_button__disable" : "_button__default")}
                                onClick={!form.phone || error.phone || confirm ? null : this.onPhoneCode}
                            >인증번호 받기</button>
                        </form>
                        {error.phone ?
                            <div className="forget__row">
                                <span className="error__line">{error.phone}</span>
                            </div> : null
                        }
                        <form className="forget__row" onSubmit={e => e.preventDefault()}>
                            <Input
                                className={error.code ? "_input__error" : ""}
                                type="tel"
                                name="code"
                                value={form.code}
                                regular={regular.INPUT.NUMBER}
                                max="6"
                                disabled={!phone || error.phone || !!confirm}
                                placeholder="인증번호를 입력해주세요."
                                onChange={(e, n, v) => this.onChangeForm(n, v)}
                                onValidate={(e, n, v) => this.onValidCode(n, v)}
                            />
                            <button
                                className={classNames("_button", !phone || error.phone || confirm ? "_button__disable" : "_button__black")}
                                onClick={!phone || error.phone || confirm ? null : this.onConfirmPhoneCode}
                            >확인</button>
                        </form>
                    </div>
                }
            </div>
        );
    }
}

ForgetPassword.propTypes = {
};

export default ForgetPassword;
