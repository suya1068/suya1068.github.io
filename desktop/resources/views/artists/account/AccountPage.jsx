import "./AccountPage.scss";
import React, { Component, PropTypes } from "react";
import update from "immutability-helper";
import classNames from "classnames";
import { Link } from "react-router";

import API from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "shared/helper/utils";
import constant from "shared/constant";
import mewtime from "forsnap-mewtime";

import regular from "shared/constant/regular.const"
import Input from "shared/components/ui/input/Input";
import DropDown from "shared/components/ui/dropdown/DropDown";

import Profile from "desktop/resources/components/image/Profile";
import Buttons from "desktop/resources/components/button/Buttons";
import Checkbox from "desktop/resources/components/form/Checkbox";
import PopModal from "shared/components/modal/PopModal";
import SocialSyncList from "desktop/resources/views/users/login/social_sync/SociallSyncList";

import { ADDRESS_LIST } from "shared/constant/quotation.const";

import PopupArtistNickName from "./popup/PopupArtistNickName";

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                email: "",
                nick_name: "",
                name: "",
                gender: "",
                birth: "",
                phone: "",
                profile_img: "",
                region: [],
                bank_name: "",
                bank_num: "",
                email_agree: "Y",
                sns_list: [
                    { name: "naver", click: result => this.syncSocial(result), sync: false },
                    { name: "facebook", click: result => this.syncSocial(result), sync: false },
                    { name: "kakao", click: result => this.syncSocial(result), sync: false }
                ],
                join_type: null
            },
            editUser: {
                nick_name: "",
                email_agree: "Y",
                region: [],
                bank_name: "",
                bank_num: ""
            },
            form: {
                password: "",
                password1: "",
                password2: ""
            },
            isNickname: false,
            checkNickname: "",
            changeEmail: "",
            signCode: "",
            signEmail: "",
            uploadInfo: undefined,
            address_list: ADDRESS_LIST,
            add_address: [],
            editPassword: false
        };

        this.onPassword = this.onPassword.bind(this);
        this.onChangeForm = this.onChangeForm.bind(this);
        this.onPopupArtistNickName = this.onPopupArtistNickName.bind(this);
        this.apiArtistFind = this.apiArtistFind.bind(this);
        this.apiArtistSave = this.apiArtistSave.bind(this);
        this.apiArtistEmailCode = this.apiArtistEmailCode.bind(this);
        this.apiArtistEmailSign = this.apiArtistEmailSign.bind(this);
        this.apiUpdateArtist = this.apiUpdateArtist.bind(this);
        this.apiArtistNickName = this.apiArtistNickName.bind(this);
        this.uploadArtistImage = this.uploadArtistImage.bind(this);
        this.setUserData = this.setUserData.bind(this);
        this.socialSync = this.socialSync.bind(this);
        this.setUserKey = this.setUserKey.bind(this);
        this.buttonClickProfile = this.buttonClickProfile.bind(this);
        this.onAddressClick = this.onAddressClick.bind(this);

        this.renderPassword = this.renderPassword.bind(this);
    }

    componentWillMount() {
        const { address_list } = this.state;
        const origin_address_list = address_list.slice(1);
        this.setState({
            origin_address_list
        });
    }

    componentDidMount() {
        this.apiArtistFind();
    }

    componentWillUnmount() {
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

    onPopupArtistNickName() {
        const modalName = "popup_artist_nickname";
        PopModal.createModal(modalName, <PopupArtistNickName />, { className: "modal-normal", callBack: () => this.apiArtistFind() });
        PopModal.show(modalName);
    }

    onLeavePage() {
        ga("send", "pageview");
        window.scrollTo(0, 0);
    }

    onAddressClick(e, address) {
        const { add_address } = this.state;
        const currentTarget = e.currentTarget;
        currentTarget.classList.toggle("selected");

        if (currentTarget.classList[1]) {
            add_address.push(address);
        } else {
            const index = add_address.indexOf(address);
            add_address.splice(index, 1);
        }

        // console.log(add_address);

        this.setState({
            add_address
        });
    }

    setUserData(data) {
        const user = this.state.user;
        const editUser = this.state.editUser;
        const social = user.sns_list;

        user.email = data.email;
        user.nick_name = data.nick_name;
        user.name = data.name;
        user.gender = data.gender;
        user.birth = this.setBirth(data.birth);
        user.phone = data.phone;
        user.profile_img = data.profile_img;
        user.region = data.region || [];
        user.bank_name = data.bank_name;
        user.bank_num = data.bank_num;
        user.email_agree = data.email_agree;
        user.nick_name_status = data.nick_name_status || "";
        user.join_type = data.join_type ? data.join_type : "";

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

        editUser.nick_name = user.nick_name;
        editUser.email_agree = user.email_agree;
        editUser.region = user.region;
        editUser.bank_name = user.bank_name;
        editUser.bank_num = user.bank_num;

        if (!this._calledComponentWillUnmount) {
            this.setState({
                user,
                editUser,
                isNickname: true,
                checkNickname: editUser.nick_name,
                changeEmail: user.email,
                uploadInfo: data.upload_info,
                add_address: user.region
            });
        }
    }

    setUserKey(key, value) {
        this.setState({
            editUser: update(this.state.editUser, { [key]: { $set: value } })
        });
    }

    setBirth(birth) {
        return `${birth.substr(0, 4)}-${birth.substr(4, 2)}-${birth.substr(6, 2)}`;
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
     * 작가 정보 가져오기
     */
    apiArtistFind() {
        const user = auth.getUser();

        if (user) {
            API.artists.find(user.id)
                .then(response => {
                    // console.log(response);
                    const data = response.data;

                    this.setUserData(data);
                })
                .catch(error => {
                    PopModal.alert(error.data);
                });
        } else {
            PopModal.alert("로그인 후 이용해주세요");
        }
    }

    /**
     * API 작가정보 저장
     */
    apiArtistSave() {
        if (this.validationCheck()) {
            if (this.state.editUser.email_agree !== "Y") {
                PopModal.confirm("포스냅 알림 및 업데이트 소식을 받으면 더 많은 혜택을 누릴 수 있습니다.<br />알림 및 업데이트 소식을 받으시겠습니까?",
                    () => {
                        this.setState({
                            editUser: update(this.state.editUser, { email_agree: { $set: "Y" } })
                        }, this.apiUpdateArtist);
                    }, this.apiUpdateArtist);
            } else {
                this.apiUpdateArtist();
            }
        }
    }

    apiUpdateArtist() {
        const user = auth.getUser();
        const editUser = this.state.editUser;
        editUser.nick_name = editUser.nick_name.replace(" ", "");

        API.artists.saveArtist(user.id, editUser)
            .then(response => {
                // console.log(response);
                const data = response.data;
                this.setUserData(data);
                PopModal.toast("정보가 변경되었습니다.");
                auth.local.updateUser(user.id, { email: this.state.user.email });
            })
            .catch(error => {
                PopModal.alert(error.data);
            });
    }

    apiArtistNickName(e) {
        const current = e.currentTarget;
        const user = this.state.user;
        const editUser = this.state.editUser;
        let message = "";
        const props = {};

        if (editUser.nick_name === "") {
            message = "작가명을 입력해주세요.";
            props.isNickname = false;
        } else if (editUser.nick_name.length > 20) {
            message = "작가명은 20자 이하만 가능합니다.";
            props.isNickname = false;
        } else if (user.nick_name === editUser.nick_name) {
            props.isNickname = true;
            props.checkNickname = editUser.nick_name;
            message = "이미 사용하고 계신 작가명입니다.";
        } else {
            API.artists.artistCheckNickname(auth.getUser().id, editUser.nick_name)
                .then(response => {
                    // console.log(response);
                    if (response.status === 200) {
                        props.isNickname = true;
                        props.checkNickname = editUser.nick_name;
                        message = "사용 가능한 작가명입니다.";
                    } else {
                        props.isNickname = false;
                        props.checkNickname = "";
                        message = "이미 사용중인 작가명입니다.";
                        current.previousSibling.focus();
                    }

                    PopModal.toast(message);
                    if (Object.keys(props).length > 0) {
                        this.setState(props);
                    }
                })
                .catch(error => {
                    PopModal.alert(error.data);
                });
        }

        if (message !== "") {
            current.previousSibling.focus();
            PopModal.toast(message);
        }

        if (Object.keys(props).length > 0) {
            this.setState(props);
        }
    }

    /**
     * API 이메일 인증 코드 받기
     */
    apiArtistEmailCode() {
        const user = auth.getUser();
        const email = this.state.user.email;
        const changeEmail = this.state.changeEmail;

        if (changeEmail === "") {
            PopModal.toast("이메일을 입력해주세요.");
        } else if (email !== changeEmail) {
            if (utils.isValidEmail(changeEmail)) {
                API.artists.artistEmailConfirm(user.id, { email: changeEmail })
                    .then(response => {
                        if (response.status === 200) {
                            this.setState({
                                signEmail: changeEmail
                            }, () => PopModal.toast(`${changeEmail}로 인증메일이 전송되었습니다.`, undefined, 3000));
                        }
                    })
                    .catch(error => {
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
    apiArtistEmailSign() {
        const user = auth.getUser();
        const data = {
            email: this.state.signEmail,
            code: this.state.signCode,
            type: "UPDATE"
        };

        if (this.state.changeEmail === this.state.signEmail) {
            API.artists.artistEmailConfirmCheck(user.id, data)
                .then(response => {
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
                })
                .catch(error => {
                    PopModal.toast(error.data);
                });
        } else {
            PopModal.toast("인증받을 이메일이 다릅니다.");
        }
    }

    uploadArtistImage(e) {
        const current = e.currentTarget;
        const file = current.files.item(0);
        const self = this;

        if (file !== undefined && file !== null) {
            const ext = utils.fileExtension(file.name);

            if ((/(jpg|jpeg|png|bmp)$/i).test(ext)) {
                const _URL = window.URL || window.webkitURL;
                const img = new Image();
                img.onload = function () {
                    let message = "";

                    if (file.size >= 20971520) {
                        message = "그림파일은 20MB 이하를 선택해 주세요.";
                    } else if (this.width < 110) {
                        message = "가로길이는 110픽셀 이상으로 선택해 주세요.";
                    } else if (this.height < 110) {
                        message = "세로길이는 110픽셀 이상으로 선택해 주세요.";
                    } else {
                        const uploadInfo = self.state.uploadInfo;

                        if (uploadInfo) {
                            const form = new FormData();
                            const uploadKey = `${uploadInfo.key}${utils.uniqId()}.${utils.fileExtension(file.name)}`;

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
                                    const user = auth.getUser();
                                    API.artists.uploadArtistPhoto(user.id, { key: uploadKey })
                                        .then(response => {
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
                    }

                    if (message !== "") {
                        current.value = "";
                        PopModal.toast(message);
                    }
                };
                img.onerror = function () {
                    current.value = "";
                    PopModal.toast("그림파일이 제대로 불려지지 않았습니다.");
                };

                img.src = _URL.createObjectURL(file);
            } else {
                PopModal.toast("파일 업로드는\nJPG, JPEG, PNG, BMP 확장자만 가능합니다.");
            }
        }
    }

    /**
     * 입력정보 검증
     */
    validationCheck(type = "") {
        const user = this.state.user;
        const editUser = this.state.editUser;
        const changeEmail = this.state.changeEmail;
        const region = this.state.add_address.join(",");
        editUser.region = region;
        let message = "";
        const props = {};

        if (editUser.nick_name === "") {
            message = "작가명을 입력해주세요.";
            props.isNickname = false;
        } else if (!this.state.isNickname || editUser.nick_name !== this.state.checkNickname) {
            message = "작가명 중복체크를 해주세요.";
        } else if (user.email !== changeEmail) {
            message = "이메일 인증을 해주세요.";
        } else if (this.state.signEmail !== "" && this.state.signCode === "") {
            message = "인증번호를 입력해주세요.";
        } else if (editUser.region === "") {
            message = "주 활동지역을 선택해주세요.";
        } else if (editUser.bank_name === "") {
            message = "은행명을 선택해주세요.";
        } else if (editUser.bank_num === "") {
            message = "계좌번호를 입력해주세요.";
        } else {
            return true;
        }

        if (message !== "") {
            PopModal.toast(message);
        }

        if (Object.keys(props).length > 0) {
            this.setState(props);
        }

        return false;
    }

    buttonClickProfile() {
        document.getElementById("account-profile-upload").click();
    }

    socialSync(result) {
        PopModal.alert(result.message);
    }

    renderPassword() {
        const { user, form, editPassword } = this.state;

        if (user.join_type === "email") {
            if (editPassword) {
                return [
                    <div className="content-columns" key="account_password">
                        <span className="title">비밀번호</span>
                        <Input
                            type="password"
                            name="password"
                            placeholder="기존 비밀번호를 입력해주세요."
                            max="15"
                            value={form.password}
                            onChange={(e, n, v) => this.onChangeForm(n, v)}
                        />
                        <span className="caption">대문자,소문자,숫자,특수문자 중 3개를 포함한 조합으로 8자~15자</span>
                    </div>,
                    <div className="content-columns" key="account_new_password">
                        <span className="title" />
                        <Input
                            type="password"
                            name="password1"
                            placeholder="새로운 비밀번호를 입력해주세요."
                            max="15"
                            value={form.password1}
                            onChange={(e, n, v) => this.onChangeForm(n, v)}
                        />
                    </div>,
                    <div className="content-columns" key="account_new_password2">
                        <span className="title" />
                        <Input
                            type="password"
                            name="password2"
                            placeholder="비밀번호를 한번 더 입력해 주세요."
                            max="15"
                            value={form.password2}
                            onChange={(e, n, v) => this.onChangeForm(n, v)}
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
                    <span className="title required">비밀번호</span>
                    <Buttons
                        buttonStyle={{ size: "small", width: "w135", shape: "circle", theme: "default" }}
                        inline={{ onClick: () => this.setState({ editPassword: true }) }}
                    >비밀번호 변경</Buttons>
                </div>
            );
        }

        return null;
    }

    /**
     * 작가명 입력 및 체크
     * @param e
     * @param value
     */
    replaceChar(e, value) {
        const test = value.replace(/[^{\d}{a-zA-Z}{가-힣ㄱ-ㅎㅏ-ㅣ}]+/gi, "");
        return test.replace(/\{|\}+/gi, "");
    }

    render() {
        const user = this.state.user;
        const editUser = this.state.editUser;
        const changeEmail = this.state.changeEmail;
        const gender = constant.GENDER.GENDER_NAME;
        const origin_address_list = this.state.origin_address_list;

        return (
            <div className="artists-page-account">
                <div className="artist-content-row account-thumb">
                    <div className="content-columns">
                        <span className="title required">프로필 이미지</span>
                    </div>
                    <div>
                        <div>
                            <Profile image={{ src: user.profile_img }} size="large" />
                        </div>
                        <input className="artist-profile-image" type="file" id="account-profile-upload" name="profile_img" value="" accept="image/jpeg, image/png, image/bmp" onChange={this.uploadArtistImage} />
                        <Buttons buttonStyle={{ size: "small", shape: "circle", theme: "default" }} inline={{ onClick: this.buttonClickProfile }}>이미지 업로드</Buttons>
                    </div>
                    <span className="caption">
                        프로필 이미지를 등록해 주세요.<br />
                        프로필 이미지는 작가님의<br />
                        인물 이미지 사용을 권장합니다. (110px * 110px)
                    </span>
                </div>
                <div className="artist-content-row">
                    <div className="content-columns">
                        <span className="title required">이름</span>
                        <Input className="w412" value={user.name} disabled />
                    </div>
                    <div className="content-columns">
                        <span className="title required">작가명</span>
                        <Input
                            type="text"
                            name="nick_name"
                            value={editUser.nick_name}
                            max="20"
                            onChange={(e, n, v) => this.setUserKey(n, this.replaceChar(e, v))}
                        />
                        <Buttons buttonStyle={{ size: "small", width: "w135", shape: "circle", theme: "default" }} inline={{ onClick: this.apiArtistNickName }}>작가명 중복체크</Buttons>
                        <span className="caption">한글, 영문, 숫자만 입력가능합니다.</span>
                    </div>
                    <div className="content-columns">
                        <span className="title required">성별</span>
                        <Input className="w412" value={user.gender !== "" ? gender[user.gender] : ""} disabled />
                        <span className="caption">이 정보는 통계 목적으로 사용되며 다른 회원들에게 절대 공개되지 않아요.</span>
                    </div>
                    <div className="content-columns">
                        <span className="title required">생년월일</span>
                        <Input className="w412" value={user.birth !== "" ? mewtime(user.birth).format("YYYY년 MM월 DD일") : ""} disabled />
                    </div>
                    <div className="content-columns">
                        <span className="title required">이메일</span>
                        <Input type="email" value={changeEmail} name="changeEmail" max="30" onChange={(e, n, v) => this.setState({ [n]: v })} />
                        <Buttons buttonStyle={{ size: "small", width: "w135", shape: "circle", theme: "default" }} inline={{ onClick: this.apiArtistEmailCode }}>이메일 변경</Buttons>
                        <span className="caption">본인확인 인증코드가 메일로 전송됩니다.</span>
                    </div>
                    {this.state.signEmail !== "" ?
                        <div className="content-columns">
                            <span className="title" />
                            <Input type="number" value={this.state.signCode} name="signCode" max="6" onChange={(e, n, v) => this.setState({ [n]: v })} />
                            <Buttons buttonStyle={{ size: "small", width: "w135", shape: "circle", theme: "default" }} inline={{ onClick: this.apiArtistEmailSign }}>확인</Buttons>
                        </div>
                        : ""}
                    <div className="content-columns">
                        <span className="title" />
                        <Checkbox type="yellow_circle" checked={editUser.email_agree === "Y"} resultFunc={value => this.setUserKey("email_agree", value ? "Y" : "N")}>포스냅 알림 및 업데이트 소식 받기</Checkbox>
                    </div>
                    <div className="content-columns">
                        <span className="title required">전화번호</span>
                        <Input value={user.phone} disabled />
                    </div>
                    {this.renderPassword()}
                    <div className="content-columns">
                        <span className="title required">주 활동지역</span>
                        <div className="address-list">
                            <div className="list-wrap">
                                {Array.isArray(origin_address_list) ?
                                    origin_address_list.map((obj, idx) => {
                                        const selected = user.region.findIndex(chk => {
                                            return chk === obj.title;
                                        });
                                        return (
                                            <div className={classNames("address-box", { "selected": selected !== -1 })} key={`address_${idx}`} onClick={e => this.onAddressClick(e, obj.title)}>
                                                {obj.title}
                                            </div>
                                        );
                                    }) : null
                                }
                            </div>
                        </div>
                        <span className="caption">주 활동 지역을 선택해주세요.</span>
                    </div>
                    <div className="content-columns">
                        <span className="title required">은행명</span>
                        <DropDown data={constant.BANK} select={editUser.bank_name} onSelect={value => this.setUserKey("bank_name", value)} />
                        <span className="caption">은행명을 선택해주세요.</span>
                    </div>
                    <div className="content-columns">
                        <span className="title required">계좌번호</span>
                        <Input className="w412" type="text" value={editUser.bank_num} name="bank_num" max="15" regular={regular.INPUT.NUMBER} onChange={(e, n, v) => this.setUserKey(n, v)} />
                        <span className="caption">잘못된 계좌번호 또는 예금주명이 다를 시 불이익을 받으실 수 있습니다.</span>
                    </div>
                </div>
                <div className="artist-content-row social">
                    <div className="content-columns">
                        <span className="title">로그인</span>
                        <SocialSyncList data={user.sns_list} join_type={user.join_type} />
                        <span className="caption social">카카오톡 또는 페이스북, 네이버로 연결하시면<br />간편하게 로그인할 수 있어요.</span>
                    </div>
                </div>
                <div className="artist-content-row text-center">
                    <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ onClick: this.apiArtistSave }}>저장하기</Buttons>
                    <div className="artist-leave">
                        <Link to="/artists/account/leave" className="artist-leave-button" onClick={this.onLeavePage}>탈퇴하기</Link>
                        {/*<a href="/artists/account/leave" onClick={this.onLeavePage} className="artist-leave-button" role="button">탈퇴하기</a>*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountPage;
