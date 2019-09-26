import "./account.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import update from "immutability-helper";
import API from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import redirect from "forsnap-redirect";
import Img from "shared/components/image/Img";
import Input from "shared/components/form/Input";
import PopModal from "shared/components/modal/PopModal";
import constant from "shared/constant";
import DropDown from "mobile/resources/components/dropdown/DropDown";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, Footer, OverlayContainer } from "mobile/resources/containers/layout";
// import UpperState from "../../component/upperState/UpperState";
import SocialSyncList from "../../component/socialSync/SociallSyncList";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

const { year, month, day } = (() => {
    const yearList = [{ value: "", name: "선택" }];
    const monthList = [{ value: "", name: "선택" }];
    const dayList = [{ value: "", name: "선택" }];

    const date = new Date();
    const yearDate = date.getFullYear();

    for (let i = yearDate; i > 1899; i -= 1) {
        yearList.push({ value: i, name: `${i}년` });
    }

    for (let i = 1; i < 13; i += 1) {
        monthList.push({ value: i, name: `${i}월` });
    }

    for (let i = 1; i <= 31; i += 1) {
        dayList.push({ value: i, name: `${i}일` });
    }

    return {
        year: yearList,
        month: monthList,
        day: dayList
    };
})();

export default class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year,
            month,
            day,
            birth: {
                year: "",
                month: "",
                day: ""
            },
            gender: constant.GENDER.SERVICE_TYPE,
            user: {
                name: "",
                gender: "",
                birth: "",
                email: "",
                email_agree: "Y",
                phone: "",
                region: "",
                profile_img: "",
                sns_list: [
                    { name: "naver", click: result => this.syncSocial(result), sync: false },
                    { name: "facebook", click: result => this.syncSocial(result), sync: false },
                    { name: "kakao", click: result => this.syncSocial(result), sync: false }
                ],
                join_type: null
            },
            form: {
                phone: "",
                code: "",
                password: "",
                password1: "",
                password2: ""
            },
            changeEmail: "",
            signEmail: "",
            signCode: "",
            uploadInfo: undefined,
            isLoading: false,
            editPhone: false,
            editPassword: false,
            time: 0,
            phone: "",
            retry: 0,
            process: false
        };

        this.onPhoneCode = this.onPhoneCode.bind(this);
        this.onConfirmCode = this.onConfirmCode.bind(this);
        this.onPassword = this.onPassword.bind(this);
        this.onEmailAgree = this.onEmailAgree.bind(this);
        this.setUserData = this.setUserData.bind(this);
        this.setUserKey = this.setUserKey.bind(this);
        this.setBirth = this.setBirth.bind(this);
        this.syncSocial = this.syncSocial.bind(this);

        this.apiUserEmailCode = this.apiUserEmailCode.bind(this);
        this.apiUserEmailSign = this.apiUserEmailSign.bind(this);

        this.validationCheck = this.validationCheck.bind(this);
        this.apiUpdateUser = this.apiUpdateUser.bind(this);
        this.uploadUsersImage = this.uploadUsersImage.bind(this);
        this.setProcess = this.setProcess.bind(this);

        this.renderPhone = this.renderPhone.bind(this);
        this.renderPassword = this.renderPassword.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        const user = auth.getUser();
        const userInfo = API.users.find(user.id);
        userInfo.then(response => {
            const data = response.data;
            this.setUserData(data);
            this.setState({
                isLoading: true
            });
        }).catch(error => {
            PopModal.alert(error.data);
        });

        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "계정설정" });
        }, 0);
    }

    onPhoneCode() {
        const { form, time, phone, process } = this.state;
        let message = null;
        const length = form.phone.length;
        const elapse = Date.now() - time;
        const isTime = elapse > 30000;
        const user = auth.getUser();

        if (form.phone === phone && !isTime) {
            PopModal.alert(`인증번호 재발송은\n${(30 - (elapse / 1000)).toFixed()}초 후에 가능합니다.`);
        } else if (!form.phone) {
            message = "전화번호를 입력해주세요.";
        } else if (length < 10 || length > 11) {
            message = "전화번호를 확인해주세요.";
        }

        if (message) {
            PopModal.alert(message);
        } else if (!process) {
            this.setProcess(true);
            API.users.phoneCode(user.id, { phone: form.phone })
                .then(response => {
                    this.setProcess(false);
                    this.setState({
                        time: Date.now(),
                        phone: form.phone
                    });

                    PopModal.alert("인증번호가 전송되었습니다.");
                })
                .catch(error => {
                    this.setProcess(false);
                    if (error && error.data) {
                        PopModal.alert(error.data);
                    }
                });
        }
    }

    onConfirmCode() {
        const { form, phone, retry, process } = this.state;
        let message = null;
        const length = form.code.length;
        const user = auth.getUser();

        if (!phone) {
            message = "인증번호를 전송받으세요.";
        }
        if (retry > 4) {
            message = "인증번호를 5회 잘못 입력하셨습니다.\n새롭게 인증번호를 받아주세요.";
        } else if (!form.code) {
            message = "인증번호를 입력해주세요.";
        } else if (length !== 6) {
            message = "인증번호를 확인해주세요.";
        } else if (form.phone !== phone) {
            message = "인증받을 휴대폰번호가 잘못되었습니다.\n새롭게 인증번호를 받아주세요.";
        }

        if (message) {
            PopModal.alert(message);
        } else if (!process) {
            this.setProcess(true);
            API.users.confirmPhoneCode(user.id, { phone: form.phone, code: form.code })
                .then(response => {
                    this.setProcess(false);
                    const data = response.data;
                    this.setState(state => {
                        return {
                            user: Object.assign({}, state.user, { phone: data.phone }),
                            editPhone: false,
                            form: Object.assign({}, state.form, {
                                phone: "",
                                code: ""
                            })
                        };
                    });
                    PopModal.alert("전화번호가 변경되었습니다");
                })
                .catch(error => {
                    this.setProcess(false);
                    if (error && error.data) {
                        PopModal.alert(error.data);
                    }
                });
        }
    }

    onPassword() {
        const { form } = this.state;
        let message = null;
        const { password, password1, password2 } = form;
        const length = form.password1.length;
        const user = auth.getUser();

        if (!password.replace(/\s/g, "")) {
            message = "현재 비밀번호를 입력해주세요.";
        } else if (!password1.replace(/\s/g, "")) {
            message = "비밀번호를 입력해주세요.";
        } else if (length < 8 || length > 15) {
            message = "대문자,소문자,숫자,특수문자 중 3가지를 포함한 조합으로 8자~15자를 입력해주세요.";
        } else {
            let count = 0;
            if (password1.match(/[a-z]+/)) {
                count += 1;
            }

            if (password1.match(/[A-Z]+/)) {
                count += 1;
            }

            if (password1.match(/[0-9]+/)) {
                count += 1;
            }

            if (password1.match(/[`~!@#$%^&*()\-=_+;':",./<>?[\]\\{}|]+/)) {
                count += 1;
            }

            if (count < 3) {
                message = "대문자,소문자,숫자,특수문자 중 3가지를 포함한 조합으로 8자~15자를 입력해주세요.";
            }
        }

        if (!message) {
            if (!password2) {
                message = "비밀번호 확인은 필수입니다.";
            } else if (password1 !== password2) {
                message = "입력하신 비밀번호와 동일하게 입력해주세요.";
            }
        }

        if (message) {
            PopModal.alert(message);
        } else {
            API.users.updatePassword(user.id, { password, new_password: password1 })
                .then(response => {
                    const data = response.data;
                    this.setState(state => {
                        return {
                            user: Object.assign({}, state.user, { phone: data.phone }),
                            editPassword: false,
                            form: Object.assign({}, state.form, {
                                password: "",
                                password1: "",
                                password2: ""
                            })
                        };
                    });
                    PopModal.alert("비밀번호가 변경되었습니다");
                })
                .catch(error => {
                    if (error && error.data) {
                        PopModal.alert(error.data);
                    }
                });
        }
    }

    onChangeForm(name, value) {
        this.setState(state => {
            return {
                form: Object.assign({}, state.form, { [name]: value })
            };
        });
    }

    onEmailAgree() {
        const { user } = this.state;
        user.email_agree = user.email_agree === "Y" ? "N" : "Y";
        this.setState({ user });
    }

    setUserData(data) {
        const user = this.state.user;
        const social = user.sns_list;

        user.email = data.email ? data.email : "";
        user.name = data.name ? data.name : "";
        user.gender = data.gender ? data.gender : "";
        user.birth = data.birth ? data.birth : "";
        user.phone = data.phone ? data.phone : "";
        user.profile_img = data.profile_img ? data.profile_img : "";
        user.region = data.region ? data.region : "";
        user.email_agree = data.email_agree ? data.email_agree : "Y";
        user.join_type = data.join_type ? data.join_type : null;

        if (data.sns_list) {
            user.sns_list = social.reduce((result, obj) => {
                const index = data.sns_list.indexOf(obj.name);
                if (index !== -1) {
                    obj.sync = true;
                } else {
                    obj.sync = false;
                }

                result.push(obj);
                return result;
            }, []);
        }

        let birth = {};

        let y = "";
        let m = "";
        let d = "";

        // dropbox에 세팅 할 생년월일
        if (user.birth !== null) {
            y = user.birth.substr(0, 4);
            m = user.birth.substr(4, 2);
            d = user.birth.substr(6, 2);
            if (m.startsWith("0")) {
                m = m.slice(1, 2);
            }
            if (d.startsWith("0")) {
                d = d.slice(1, 2);
            }
        } else {
            user.birth = "";
        }

        birth = { year: y, month: m, day: d };

        this.setState({
            gender: this.getGenderList(user.gender),
            year: this.getBirthData(y, year),
            month: this.getBirthData(m, month),
            day: this.getBirthData(d, day),
            user,
            birth,
            changeEmail: user.email,
            uploadInfo: data.upload_info
        });
    }

    setUserKey(key, value) {
        const user = this.state.user;
        user[key] = value;

        this.setState({
            user
        });
    }

    setBirth(key, value) {
        const user = this.state.user;
        const birth = this.state.birth;
        const props = {};

        birth[key] = value;

        const changeMonth = utils.fillSpace(birth.month);
        const changeDay = utils.fillSpace(birth.day);
        user.birth = Number(`${birth.year}${changeMonth}${changeDay}`);

        props.user = user;
        props.birth = birth;
        props.birth[key] = value;

        this.setState(props);
    }

    getGenderList(gender = "") {
        return gender
            ? constant.GENDER.SERVICE_TYPE.slice(1)
            : constant.GENDER.SERVICE_TYPE;
    }

    getBirthData(key = "", date) {
        return key
            ? date.slice(1)
            : date;
    }

    syncSocial(result) {
        let social = this.state.user.sns_list;

        social = social.reduce((rs, obj) => {
            if (obj.name === result.type) {
                obj.sync = !obj.sync;
            }

            rs.push(obj);
            return rs;
        }, []);

        this.setState({
            user: update(this.state.user, { sns_list: { $set: social } })
        }, () => {
            PopModal.alert(result.message);
        });
    }

    /**
     * 밸리데이션 체크
     * @returns {boolean}
     */
    validationCheck() {
        const user = this.state.user;
        const birth = this.state.birth;
        const changeEmail = this.state.changeEmail;
        let message = "";
        const yearCheck = birth.year === "";
        const monthCheck = birth.month === "";
        const dayCheck = birth.day === "";

        if (user.name === "" || user.name === null) {
            message = "이름을 입력해 주세요.";
        } else if (user.name.length > 8) {
            message = "이름은 8자 이하로 입력해주세요.";
        } else if (((yearCheck && monthCheck && !dayCheck) || (yearCheck && dayCheck && !monthCheck) || (monthCheck && dayCheck && !yearCheck))
            || ((!yearCheck && !monthCheck && dayCheck) || (!yearCheck && monthCheck && !dayCheck) || (yearCheck && !monthCheck && !dayCheck))) {
            message = "년, 월, 일 중 일부만 입력하실 순 없습니다.";
        } else if (user.email !== changeEmail) {
            message = "이메일 인증을 해주세요.";
        } else if (this.state.signEmail !== "" && this.state.signCode === "") {
            message = "인증번호를 입력해주세요.";
        } else if (user.phone.length >= 1 && user.phone.length < 10) {
            message = "폰번호는 10자 이상 11자 이하로 입력해주세요.";
        } else {
            return true;
        }
        if (message !== "") {
            PopModal.toast(message);
        }

        return false;
    }

    apiUpdateUser() {
        const user = this.state.user;
        const userId = auth.getUser().id;
        const data = {
            name: user.name,
            gender: user.gender,
            birth: user.birth,
            phone: user.phone,
            region: user.region,
            email_agree: user.email_agree
        };

        const request = API.users.updateUserData(userId, data);

        request.then(response => {
            // console.log(response);
            PopModal.toast(`${user.name}님의 정보가 수정되었습니다.`);
            auth.local.updateUser(userId, { name: user.name, email: user.email });
            setTimeout(redirect.myAccount, 1000);
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    /**
     * 유저 프로파일 사진을 등록한다.
     * @param e
     */
    uploadUsersImage(e) {
        const form = new FormData();
        const current = e.currentTarget;
        const file = current.files.item(0);

        if (file !== undefined && file !== null) {
            const ext = utils.fileExtension(file.name);

            if ((/(jpg|jpeg|png|bmp)$/i).test(ext)) {
                let message = "";
                const _URL = window.URL || window.webkitURL;
                const img = new Image();
                const self = this;

                img.onload = function () {
                    if (file.size >= 20971520) {
                        message = "그림파일은 20MB 이하를 선택해 주세요.";
                    } else if (this.width < 110) {
                        message = "가로길이는 110픽셀 이상으로 선택해 주세요.";
                    } else if (this.height < 110) {
                        message = "세로길이는 110픽셀 이상으로 선택해 주세요.";
                    } else {
                        self.setState({}, () => {
                            const uploadInfo = self.state.uploadInfo;

                            if (uploadInfo) {
                                const uploadKey = `${uploadInfo.key}${utils.uniqId()}.${ext}`;

                                form.append("key", uploadKey);
                                form.append("acl", uploadInfo.acl);
                                form.append("policy", uploadInfo.policy);
                                form.append("X-Amz-Credential", uploadInfo["X-Amz-Credential"]);
                                form.append("X-Amz-Algorithm", uploadInfo["X-Amz-Algorithm"]);
                                form.append("X-Amz-Date", uploadInfo["X-Amz-Date"]);
                                form.append("X-Amz-Signature", uploadInfo["X-Amz-Signature"]);
                                form.append("file", file);

                                API.common.uploadS3(uploadInfo.action, form)
                                    .then(res => {
                                        // console.log(res);
                                        const user = auth.getUser();
                                        API.users.uploadUserPhoto(user.id, { key: uploadKey })
                                            .then(response => {
                                                // console.log(response);
                                                if (response.status === 200) {
                                                    const data = response.data;
                                                    self.setState({
                                                        user: update(self.state.user, { profile_img: { $set: data.profile_img } })
                                                    });
                                                }
                                            })
                                            .catch(error => {
                                                PopModal.alert(error.data);
                                            });
                                    })
                                    .catch(error => {
                                        PopModal.alert("프로필 사진 업로드중 오류가 발생했습니다.\n고객센터로 문의해주세요.");
                                    });
                            }
                        });
                    }

                    if (message !== "") {
                        current.value = "";
                        PopModal.toast(message);
                    }
                };
                img.onerror = function () {
                    message = "그림파일이 제대로 불려지지 않았습니다.";

                    if (message !== "") {
                        current.value = "";
                        PopModal.toast(message);
                    }
                };
                img.src = _URL.createObjectURL(file);
            } else {
                PopModal.toast("파일 업로드는\nJPG, JPEG, PNG, BMP 확장자만 가능합니다.");
            }
        }
    }

    buttonClickProfile() {
        document.getElementsByClassName("users-profile-image")[0].click();
    }

    /**
     * API 이메일 인증 코드 받기
     */
    apiUserEmailCode() {
        const user = auth.getUser();
        const email = this.state.user.email;
        const changeEmail = this.state.changeEmail;

        if (changeEmail === "") {
            PopModal.toast("이메일을 입력해주세요.");
        } else if (email !== changeEmail) {
            if (utils.isValidEmail(changeEmail)) {
                const request = API.users.userEmailConfirm(user.id, { email: changeEmail });
                request.then(response => {
                    if (response.status === 200) {
                        this.setState({
                            signEmail: changeEmail
                        }, () => PopModal.toast(`${changeEmail}로 인증메일이 전송되었습니다.`));
                    }
                }).catch(error => {
                    PopModal.alert(error.data);
                });
            } else {
                PopModal.toast("이메일을 정확히 입력해주세요.");
            }
        } else {
            PopModal.toast("이미 인증된 이메일입니다.");
        }
    }

    /**
     * API 이메일 인증
     */
    apiUserEmailSign() {
        if (this.state.signCode === "" || this.state.signCode === null) {
            PopModal.toast("인증코드를 입력해 주세요.");
            return;
        }
        const user = auth.getUser();
        const data = {
            email: this.state.signEmail,
            code: this.state.signCode,
            type: "JOIN"
        };

        if (this.state.changeEmail === this.state.signEmail) {
            const request = API.users.userEmailConfirmCheck(user.id, data);
            request.then(response => {
                // console.log(response);
                if (response.status === 200) {
                    this.setState({
                        signCode: "",
                        signEmail: "",
                        user: update(this.state.user, { email: { $set: data.email } })
                    }, () => {
                        let message = "이메일이 변경되었습니다.";
                        if (this.state.user.join_type === "email") {
                            message += "\n다음 로그인부터는 변경된 이메일로 로그인 가능합니다.";
                        }
                        PopModal.alert(message);
                    });
                }
            }).catch(error => {
                PopModal.toast(error.data);
            });
        } else {
            PopModal.toast("인증받을 이메일이 다릅니다.");
        }
    }

    /**
     *  유저 정보 수정
     *  (저장하기 버튼)
     **/
    saveUsersData() {
        if (this.validationCheck()) {
            if (this.state.user.email_agree !== "Y") {
                PopModal.confirm("포스냅 알림 및 업데이트 소식을 받으면 더 많은 혜택을 누릴 수 있습니다.<br />알림 및 업데이트 소식을 받으시겠습니까?",
                    () => {
                        this.setState({
                            user: update(this.state.user, { email_agree: { $set: "Y" } })
                        }, this.apiUpdateUser);
                    }, this.apiUpdateUser);
            } else {
                this.apiUpdateUser();
            }
        }
    }

    onLeavePage(e) {
        e.preventDefault();
        const node = e.currentTarget;
        const href = node.href;

        location.href = href;
    }

    setProcess(b) {
        if (b) {
            this.state.process = true;
            PopModal.progress();
        } else {
            this.state.process = false;
            PopModal.closeProgress();
        }
    }

    renderPhone() {
        const { user, form, editPhone } = this.state;

        if (user.join_type === "email") {
            if (editPhone) {
                return [
                    <div className="info-content" key="account_phone">
                        <span className="content-name">연락처</span>
                        <div className="info__row">
                            <Input
                                inputStyle={{ size: "mobile" }}
                                type="number"
                                inline={{
                                    type: "number",
                                    maxLength: 11,
                                    placeholder: "'-'없이 번호만 입력해주세요",
                                    value: form.phone,
                                    onChange: (e, value) => this.onChangeForm("phone", value)
                                }}
                            />
                            <button className="_button _button__white" onClick={this.onPhoneCode}>인증번호 발송</button>
                        </div>
                    </div>,
                    <div className="info-content" key="account_phone_code">
                        <div className="info__row">
                            <Input
                                inputStyle={{ size: "mobile" }}
                                type="number"
                                inline={{
                                    type: "number",
                                    maxLength: 6,
                                    placeholder: "인증번호 입력",
                                    value: form.code,
                                    onChange: (e, value) => this.onChangeForm("code", value)
                                }}
                            />
                            <button className="_button _button__white" onClick={this.onConfirmCode}>인증번호 확인</button>
                        </div>
                    </div>
                ];
            }

            return (
                <div className="info-content">
                    <span className="content-name">연락처</span>
                    <div className="info__row">
                        <Input
                            inputStyle={{ size: "mobile" }}
                            type="number"
                            inline={{ id: "users_user_phone", type: "number", maxLength: 11, placeholder: "'-'없이 번호만 입력해주세요", value: user.phone, onChange: (e, value) => this.setUserKey("phone", value) }}
                        />
                        <button className="_button _button__white" onClick={() => this.setState({ editPhone: true })}>전화번호 변경</button>
                    </div>
                </div>
            );
        }

        return (
            <div className="info-content">
                <span className="content-name">연락처</span>
                <Input
                    inputStyle={{ size: "mobile" }}
                    type="number"
                    inline={{ id: "users_user_phone", type: "number", maxLength: 11, placeholder: "'-'없이 번호만 입력해주세요", value: user.phone, onChange: (e, value) => this.setUserKey("phone", value) }}
                />
            </div>
        );
    }

    renderPassword() {
        const { user, form, editPassword } = this.state;

        if (user.join_type === "email") {
            if (editPassword) {
                return [
                    <div className="info-content" key="account_password">
                        <span className="content-name">비밀번호</span>
                        <Input
                            inputStyle={{ size: "mobile" }}
                            type="password"
                            inline={{
                                type: "password",
                                maxLength: 15,
                                placeholder: "기존 비밀번호 입력",
                                value: form.password,
                                onChange: (e, value) => this.onChangeForm("password", value)
                            }}
                        />
                    </div>,
                    <div className="info-content" key="account_new_password">
                        <Input
                            inputStyle={{ size: "mobile" }}
                            type="password"
                            inline={{
                                type: "password",
                                maxLength: 15,
                                placeholder: "신규 비밀번호 입력",
                                value: form.password1,
                                onChange: (e, value) => this.onChangeForm("password1", value)
                            }}
                        />
                    </div>,
                    <div className="info-content" key="account_new_password2">
                        <div className="info__row">
                            <Input
                                inputStyle={{ size: "mobile" }}
                                type="password"
                                inline={{
                                    type: "password",
                                    maxLength: 15,
                                    placeholder: "신규 비밀번호 확인",
                                    value: form.password2,
                                    onChange: (e, value) => this.onChangeForm("password2", value)
                                }}
                            />
                            <button className="_button _button__white" onClick={this.onPassword}>비밀번호 변경</button>
                        </div>
                    </div>
                ];
            }

            return (
                <div className="info-content">
                    <span className="content-name">비밀번호</span>
                    <button className="_button _button__white" onClick={() => this.setState({ editPassword: true })}>비밀번호 변경</button>
                </div>
            );
        }

        return null;
    }

    render() {
        const state = this.state;
        const user = state.user;
        const changeEmail = state.changeEmail;
        const gender = state.gender;
        const birth = state.birth;
        // const user = this.state.user;
        // const changeEmail = this.state.changeEmail;
        // const gender = this.state.gender;
        const isLoading = this.state.isLoading;
        const profileImg = user.profile_img;
        const content = [];

        if (isLoading) {
            content.push(
                <div key="user-profile_image/key">
                    <div className="user-profile_img">
                        <div className="profile_img-outer">
                            <Img image={{ src: user.profile_img, content_width: 110, content_height: 110, width: 90, height: 90, default: "/common/default_profile_img.jpg" }} />
                        </div>
                        <form name="uploadForm" id="uploadForm" method="PUT">
                            <Input
                                inline={{ type: "file", id: "account-profile-upload", value: "", name: "profile_img", accept: /*"image/jpeg, image/png, image/bmp"*/"image/*", className: "users-profile-image", onChange: this.uploadUsersImage }}
                            />
                        </form>
                        <div className="cameraIcon" onClick={this.buttonClickProfile}>
                            <div className="cameraIcon-inner">
                                <i className="m-icon m-icon-camera_s" />
                            </div>
                        </div>
                    </div>
                    <p className="text_changeProfile" onClick={this.buttonClickProfile}>프로필 사진 바꾸기</p>
                </div>
            );
        }

        return (
            <div className="users-account">
                <div className="user-profile">
                    {content}
                </div>
                <div className="user-info">
                    <div className="info-content">
                        <span className="content-name">이름<span className="isRequired">*</span></span>
                        <Input inputStyle={{ size: "mobile" }} inline={{ id: "users_user_name", maxLength: 8, placeholder: "이름", value: user.name, onChange: (e, value) => this.setUserKey("name", value) }} />
                    </div>
                    <div className="info-content">
                        <span className="content-name">성별<span className="isRequired">*</span></span>
                        <DropDown list={gender} select={this.state.user.gender} resultFunc={value => this.setUserKey("gender", value)} />
                    </div>
                    <div className="info-content">
                        <span className="content-name">생년월일</span>
                        <div className="dropdown-wrap">
                            <DropDown list={state.year} size="small" select={birth.year} resultFunc={value => this.setBirth("year", value)} />
                            <DropDown list={state.month} size="small" select={birth.month} resultFunc={value => this.setBirth("month", value)} />
                            <DropDown list={state.day} size="small" select={birth.day} resultFunc={value => this.setBirth("day", value)} />
                        </div>
                    </div>
                    <div className="info-content">
                        <span className="content-name">이메일</span>
                        <Input inputStyle={{ size: "mobile" }} type="email" inline={{ id: "users_user_email", type: "email", maxLength: 50, placeholder: "이메일", value: changeEmail, onChange: (e, value) => this.setState({ changeEmail: value }) }} />
                    </div>
                    <div className="info-content">
                        <button
                            className={classNames("button", "button__round", "button-block", "button__theme__liteblue")}
                            onClick={this.apiUserEmailCode}
                        >
                            이메일 변경
                        </button>
                    </div>
                    {this.state.signEmail !== "" ?
                        <div className="info-content">
                            <span className="content-name" />
                            <Input
                                inputStyle={{ size: "mobile" }}
                                type="number"
                                inline={{ id: "email_signCode", type: "number", maxLength: 6, placeholder: "인증번호 확인", value: this.state.signCode, onChange: (e, value) => this.setState({ signCode: value }) }}
                            />
                            <button
                                className={classNames("button", "button__round", "button-block", "button__theme__yellow")}
                                onClick={this.apiUserEmailSign}
                            >
                                확인
                            </button>
                        </div> : null
                    }
                    <div className="info-content" onClick={this.onEmailAgree}>
                        <div className="email__agree">
                            <div className={classNames("info__check", { active: user.email_agree === "Y" })}>
                                <icon className={user.email_agree === "Y" ? "m-icon-check-white" : "m-icon-check"} />
                            </div>
                            포스냅 알림 및 업데이트 소식 받기
                        </div>
                    </div>
                    {this.renderPhone()}
                    {this.renderPassword()}
                    <div className="info-content">
                        <span className="content-name">사는지역</span>
                        <Input inputStyle={{ size: "mobile" }} inline={{ id: "users_user_region", maxLength: 50, placeholder: "시, 도, 군, 구", value: user.region, onChange: (e, value) => this.setUserKey("region", value) }} />
                    </div>
                </div>
                <div className="user-info social">
                    <div className="info-content">
                        <span className="content-name">로그인</span>
                        <SocialSyncList data={user.sns_list} join_type={user.join_type} />
                    </div>
                </div>
                <div className="user-info logout">
                    <span className="content-name">회원탈퇴 신청하기</span>
                    <a href="/users/myaccount/leave" className="button button__theme__dark" role="button" onClick={this.onLeavePage}>회원탈퇴</a>
                </div>
                <div className="user-info-save">
                    <button
                        className="button button-block button__theme__yellow"
                        onClick={() => this.saveUsersData()}
                    >저장하기</button>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <AppContainer roles={["customer"]}>
        <HeaderContainer />
        <div className="site-main">
            <LeftSidebarContainer />
            <Account />
            <Footer>
                <ScrollTop />
            </Footer>
            <OverlayContainer />
        </div>
    </AppContainer>,
    document.getElementById("root")
);
