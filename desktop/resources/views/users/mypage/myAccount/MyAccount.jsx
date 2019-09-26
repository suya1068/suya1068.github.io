import "./myAccount.scss";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import update from "immutability-helper";

import auth from "forsnap-authentication";
import API from "forsnap-api";
import desk from "desktop/resources/management/desktop.api";
import Profile from "desktop/resources/components/image/Profile";
import Buttons from "desktop/resources/components/button/Buttons";
import Input from "desktop/resources/components/form/Input";
import Dropdown from "desktop/resources/components/form/Dropdown";
import Checkbox from "desktop/resources/components/form/Checkbox";
import PopModal from "shared/components/modal/PopModal";
import SocialSyncList from "desktop/resources/views/users/login/social_sync/SociallSyncList";
import constant from "shared/constant";

import utils from "shared/helper/utils";
import redirect from "forsnap-redirect";

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


class MyAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sns_type: "",
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
                email: "",
                name: "",
                gender: "",
                birth: "",
                phone: "",
                profile_img: "",
                region: "",
                email_agree: "Y",
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
            isEmail: true,
            isNickname: false,
            changeEmail: "",
            signCode: "",
            signEmail: "",
            uploadInfo: undefined,
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

        this.setUserKey = this.setUserKey.bind(this);
        this.setBirth = this.setBirth.bind(this);
        this.saveUsersData = this.saveUsersData.bind(this);
        this.uploadUsersImage = this.uploadUsersImage.bind(this);
        this.setUserData = this.setUserData.bind(this);
        this.setProcess = this.setProcess.bind(this);

        // 이메일 등록
        this.apiUserEmailCode = this.apiUserEmailCode.bind(this);
        this.apiUserEmailSign = this.apiUserEmailSign.bind(this);
        // 밸리데이션 체크
        this.validationCheck = this.validationCheck.bind(this);

        this.apiUpdateUser = this.apiUpdateUser.bind(this);

        this.renderPhone = this.renderPhone.bind(this);
        this.renderPassword = this.renderPassword.bind(this);
    }

    componentDidMount() {
        const user = auth.getUser();
        const userInfo = desk.users.find(user.id);
        userInfo.then(response => {
            const data = response.data;
            this.setUserData(data);
        }).catch(error => {
            PopModal.alert(error.data);
        });
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

    onMoveLeavePage() {
        window.scrollTo(0, 0);
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

    setProcess(b) {
        if (b) {
            this.state.process = true;
            PopModal.progress();
        } else {
            this.state.process = false;
            PopModal.closeProgress();
        }
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

    apiUpdateUser() {
        const user = this.state.user;
        const userId = auth.getUser().id;
        const data = {
            name: user.name.replace(" ", ""),
            gender: user.gender,
            birth: user.birth,
            phone: user.phone,
            region: user.region,
            email_agree: user.email_agree
        };

        const request = desk.users.updateUserData(userId, data);

        request.then(response => {
            // console.log(response);
            PopModal.toast(`${user.name}님의 정보가 수정되었습니다.`);
            auth.local.updateUser(userId, { name: user.name, email: user.email });
            setTimeout(redirect.myAccount, 1000);
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    buttonClickProfile() {
        document.getElementById("account-profile-upload").click();
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

    renderPhone() {
        const { user, form, editPhone } = this.state;

        if (user.join_type === "email") {
            if (editPhone) {
                return [
                    <div className="content-columns" key="account_phone">
                        <span className="title">전화번호</span>
                        <Input
                            inputStyle={{ size: "small", width: "w267" }}
                            type="number"
                            inline={{
                                id: "",
                                maxLength: 11,
                                placeholder: "'-'없이 번호만 입력해주세요",
                                value: form.phone,
                                onChange: (e, value) => this.setState(state => {
                                    return {
                                        form: Object.assign({}, state.form, { phone: value })
                                    };
                                })
                            }}
                        />
                        <Buttons
                            buttonStyle={{ size: "small", width: "w135", shape: "circle", theme: "default" }}
                            inline={{ onClick: this.onPhoneCode }}
                        >인증번호 전송</Buttons>
                        <span className="caption">전화번호는 예약이 완료될 경우에만 공개돼요.</span>
                    </div>,
                    <div className="content-columns" key="account_phone_code">
                        <span className="title" />
                        <Input
                            inputStyle={{ size: "small", width: "w267" }}
                            type="number"
                            inline={{
                                id: "",
                                maxLength: 6,
                                placeholder: "인증번호를 입력해주세요",
                                value: form.code,
                                onChange: (e, value) => this.setState(state => {
                                    return {
                                        form: Object.assign({}, state.form, { code: value })
                                    };
                                })
                            }}
                        />
                        <Buttons
                            buttonStyle={{ size: "small", width: "w135", shape: "circle", theme: "default" }}
                            inline={{ onClick: this.onConfirmCode }}
                        >인증번호 확인</Buttons>
                    </div>
                ];
            }

            return (
                <div className="content-columns">
                    <span className="title">전화번호</span>
                    <Input inputStyle={{ size: "small", width: "w267" }} type="number" inline={{ id: "", maxLength: 11, placeholder: "'-'없이 번호만 입력해주세요", value: user.phone, onChange: (e, value) => this.setUserKey("phone", value) }} />
                    <Buttons
                        buttonStyle={{ size: "small", width: "w135", shape: "circle", theme: "default" }}
                        inline={{ onClick: () => this.setState({ editPhone: true }) }}
                    >전화번호 변경</Buttons>
                    <span className="caption">전화번호는 예약이 완료될 경우에만 공개돼요.</span>
                </div>
            );
        }

        return (
            <div className="content-columns">
                <span className="title">전화번호</span>
                <Input inputStyle={{ size: "small", width: "w267" }} type="number" inline={{ id: "", maxLength: 11, placeholder: "'-'없이 번호만 입력해주세요", value: user.phone, onChange: (e, value) => this.setUserKey("phone", value) }} />
                <span className="caption">전화번호는 예약이 완료될 경우에만 공개돼요.</span>
            </div>
        );
    }

    renderPassword() {
        const { user, form, editPassword } = this.state;

        if (user.join_type === "email") {
            if (editPassword) {
                return [
                    <div className="content-columns" key="account_password">
                        <span className="title">비밀번호</span>
                        <Input
                            inputStyle={{ size: "small", width: "w267" }}
                            type="password"
                            inline={{
                                type: "password",
                                maxLength: 15,
                                placeholder: "기존 비밀번호를 입력해주세요.",
                                value: form.password,
                                onChange: (e, value) => this.setState(state => {
                                    return {
                                        form: Object.assign({}, state.form, { password: value })
                                    };
                                })
                            }}
                        />
                        <span className="caption">대문자,소문자,숫자,특수문자 중 3개를 포함한 조합으로 8자~15자</span>
                    </div>,
                    <div className="content-columns" key="account_new_password">
                        <span className="title" />
                        <Input
                            inputStyle={{ size: "small", width: "w267" }}
                            type="password"
                            inline={{
                                type: "password",
                                maxLength: 15,
                                placeholder: "새로운 비밀번호를 입력해주세요.",
                                value: form.password1,
                                onChange: (e, value) => this.setState(state => {
                                    return {
                                        form: Object.assign({}, state.form, { password1: value })
                                    };
                                })
                            }}
                        />
                    </div>,
                    <div className="content-columns" key="account_new_password2">
                        <span className="title" />
                        <Input
                            inputStyle={{ size: "small", width: "w267" }}
                            type="password"
                            inline={{
                                type: "password",
                                maxLength: 15,
                                placeholder: "비밀번호를 한번 더 입력해 주세요.",
                                value: form.password2,
                                onChange: (e, value) => this.setState(state => {
                                    return {
                                        form: Object.assign({}, state.form, { password2: value })
                                    };
                                })
                            }}
                        />
                        <Buttons
                            buttonStyle={{ size: "small", width: "w135", shape: "circle", theme: "default" }}
                            inline={{ onClick: this.onPassword }}
                        >비밀번호 변경</Buttons>
                    </div>
                ];
            }

            return (
                <div className="content-columns">
                    <span className="title">비밀번호</span>
                    <Buttons
                        buttonStyle={{ size: "small", width: "w135", shape: "circle", theme: "default" }}
                        inline={{ onClick: () => this.setState({ editPassword: true }) }}
                    >비밀번호 변경</Buttons>
                </div>
            );
        }

        return null;
    }

    render() {
        const state = this.state;
        const user = state.user;
        const changeEmail = state.changeEmail;
        // const gender = constant.GENDER.SERVICE_TYPE;
        const gender = state.gender;
        const birth = state.birth;

        return (
            <div className="myAccount-page">
                <div className="account-thumb">
                    <span className="title">프로필 이미지</span>
                    <div>
                        <div>
                            <Profile image={{ src: user.profile_img }} size="large" />
                        </div>
                        <form name="uploadForm" id="uploadForm" method="PUT">
                            <input type="file" id="account-profile-upload" value="" name="profile_img" accept="image/jpeg, image/png, image/bmp" className="users-profile-image" onChange={this.uploadUsersImage} />
                        </form>
                        <Buttons buttonStyle={{ size: "small", shape: "circle", theme: "default" }} inline={{ onClick: this.buttonClickProfile }}>이미지 업로드</Buttons>
                    </div>
                    <span className="caption">
                        프로필 이미지를 등록해 주세요.<br />
                        110 x 110 픽셀 크기의 이미지를 권장합니다.
                    </span>
                </div>
                <div className="users-content-row">
                    <div className="content-columns">
                        <span className="title">이름<span className="isRequired">*</span></span>
                        <Input inputStyle={{ size: "small", width: "w412" }} inline={{ id: "users_user_name", maxLength: 8, placeholder: "이름", value: state.user.name, onChange: (e, value) => this.setUserKey("name", value.replace(/\s/g, "")) }} />
                        <span className="caption">
                            전체 이름은 예약이 완료될 경우에만 공개돼요.<br />
                            이름은 최대 8자까지만 입력됩니다.
                        </span>
                    </div>
                    <div className="content-columns">
                        <span className="title">성별</span>
                        <Dropdown list={gender} size="small" width="w412" select={state.user.gender} resultFunc={value => this.setUserKey("gender", value)} />
                        <span className="caption">이 정보는 통계 목적으로 사용되며 다른 회원들에게 절대 공개되지 않아요.</span>
                    </div>
                    <div className="content-columns">
                        <span className="title">생년월일</span>
                        <Dropdown list={state.year} size="small" width="w119" select={birth.year} resultFunc={value => this.setBirth("year", value)} />
                        <Dropdown list={state.month} size="small" width="w98" select={birth.month} resultFunc={value => this.setBirth("month", value)} />
                        <Dropdown list={state.day} size="small" width="w98" select={birth.day} resultFunc={value => this.setBirth("day", value)} />
                    </div>
                    <div className="content-columns">
                        <span className="title">이메일</span>
                        {/*<Input inputStyle={{ size: "small", width: "w267" }} inline={{ id: "artist_user_email", placeholder: "이메일@주소", value: state.user.email, onChange: (e, value) => this.setUserKey("email", value) }} />*/}
                        <Input inputStyle={{ size: "small", width: "w267" }} inline={{ placeholder: "이메일@주소", value: changeEmail, onChange: (e, value) => this.setState({ changeEmail: value }) }} type="email" />
                        <Buttons buttonStyle={{ size: "small", width: "w135", shape: "circle", theme: "default" }} inline={{ onClick: this.apiUserEmailCode }} >이메일 변경</Buttons>
                        <span className="caption" style={{ lineHeight: "18px" }}>
                            본인확인 인증코드가 메일로 전송됩니다.<br />
                            이메일은 예약이 완료될 경우에만 공개돼요.
                        </span>
                    </div>
                    {state.signEmail !== "" ?
                        <div className="content-columns">
                            <span className="title" />
                            <Input inputStyle={{ size: "small", width: "w267" }} type="number" inline={{ placeholder: "인증번호 확인", value: state.signCode, maxLength: 6, onChange: (e, value) => this.setState({ signCode: value }) }} />
                            <Buttons buttonStyle={{ size: "small", width: "w135", shape: "circle", theme: "default" }} inline={{ onClick: this.apiUserEmailSign }}>확인</Buttons>
                        </div>
                        : ""}
                    <div className="content-columns">
                        <span className="title" />
                        <Checkbox type="yellow_circle" checked={state.user.email_agree === "Y"} resultFunc={value => this.setUserKey("email_agree", value ? "Y" : "N")}>포스냅 알림 및 업데이트 소식 받기</Checkbox>
                    </div>
                    {this.renderPhone()}
                    {this.renderPassword()}
                    <div className="content-columns">
                        <span className="title">사는지역</span>
                        <Input inputStyle={{ size: "small", width: "w412" }} inline={{ id: "users_user_region", maxLength: 50, placeholder: "시, 도, 군, 구", value: state.user.region, onChange: (e, value) => this.setUserKey("region", value) }} />
                        <span className="caption">이 정보는 통계 목적으로 사용되며 다른 회원들에게 절대 공개되지 않아요.</span>
                    </div>
                </div>
                <div className="users-content-row social">
                    <div className="content-columns">
                        <span className="title">로그인</span>
                        <SocialSyncList data={user.sns_list} join_type={user.join_type} />
                        <span className="caption social">카카오톡 또는 페이스북, 네이버로 연결하시면<br />간편하게 로그인할 수 있어요.</span>
                    </div>
                </div>
                <div className="users-content-row text-center">
                    <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ onClick: this.saveUsersData }}>저장하기</Buttons>
                    <div className="user-leave-box">
                        <Link to="/users/myaccount/leave" className="users-leave" onClick={this.onMoveLeavePage}>탈퇴하기</Link>
                        {/*<a href="/users/myaccount/leave" className="users-leave" role="button">탈퇴하기</a>*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default MyAccount;
