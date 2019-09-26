import React, { Component, PropTypes } from "react";
import FSN from "forsnap";
import API from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";

import Profile from "desktop/resources/components/image/Profile";
import Buttons from "desktop/resources/components/button/Buttons";
import Input from "desktop/resources/components/form/Input";
import Dropdown from "desktop/resources/components/form/Dropdown";
import Checkbox from "desktop/resources/components/form/Checkbox";
import PopModal from "shared/components/modal/PopModal";
import SocialSyncList from "../../../login/social_sync/SociallSyncList";
import redirect from "desktop/resources/management/redirect";
import update from "immutability-helper";
import constant from "shared/constant";

import { ADDRESS_LIST } from "shared/constant/quotation.const";

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile_type: "data",
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
                    { name: "naver", click: result => this.socialSync(result), sync: false },
                    { name: "facebook", click: result => this.socialSync(result), sync: false },
                    { name: "kakao", click: result => this.socialSync(result), sync: false }
                ],
                join_type: null
            },
            isNickname: false,
            changeEmail: "",
            checkNickname: "",
            signCode: "",
            signEmail: "",
            encode_data: "",
            uploadInfo: undefined,
            uploadFile: "",
            bank: [{ value: "", name: "선택해주세요" }].concat(constant.BANK),
            address_list: ADDRESS_LIST,
            add_address: []
        };

        this.apiRegistArtist = this.apiRegistArtist.bind(this);

        this.setUserKey = this.setUserKey.bind(this);
        this.registArtistData = this.registArtistData.bind(this);
        this.uploadArtistImage = this.uploadArtistImage.bind(this);
        this.socialSync = this.socialSync.bind(this);
        this.parseBirth = this.parseBirth.bind(this);

        // 실명인증용 메서드
        this.onCheckUser = this.onCheckUser.bind(this);
        this.checkUserSuccess = this.checkUserSuccess.bind(this);
        this.checkUserFail = this.checkUserFail.bind(this);

        // 이메일 인증 메서드
        this.apiArtistEmailCode = this.apiArtistEmailCode.bind(this);
        this.apiArtistEmailSign = this.apiArtistEmailSign.bind(this);

        // 닉네임 체크
        this.checkNickname = this.checkNickname.bind(this);
        this.loadProfileImage = this.loadProfileImage.bind(this);

        this.onAddressClick = this.onAddressClick.bind(this);
    }

    componentWillMount() {
        const { address_list } = this.state;
        const origin_address_list = address_list.slice(1);
        this.setState({
            origin_address_list
        });
    }

    componentDidMount() {
        API.users.find(auth.getUser().id)
            .then(response => {
                // console.log(response);
                if (response.status === 200) {
                    const data = response.data;
                    const social = this.state.user.sns_list;
                    const user = this.state.user;

                    user.email = data.email ? data.email : "";
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

                    this.setState({
                        user,
                        changeEmail: user.email,
                        uploadInfo: data.upload_info
                    });
                }
            })
            .catch(error => {
                PopModal.alert(error.data);
            });
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

        this.setState({
            add_address
        });
    }

    onCheckUser() {
        const form = document.forms.user_check;
        window.open("", "popupChk", "width=500, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no");

        form.action = "https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb";
        form.target = "popupChk";
        form.submit();

        FSN.auth.create(result => this.checkUserSuccess(result), result => this.checkUserFail(result));
    }

    setUserKey(key, value) {
        this.setState({
            user: update(this.state.user, { [key]: { $set: value } })
        });
    }

    parseBirth(birth) {
        const year = birth.substr(0, 4);
        const month = birth.substr(4, 2);
        const day = birth.substr(6, 2);

        return `${year}-${month}-${day}`;
    }

    checkNickname(e) {
        const current = e.currentTarget;
        const user = this.state.user;
        let message = "";
        const props = {};

        if (user.nick_name === "") {
            message = "작가명을 입력해주세요.";
        } else if (user.nick_name.length > 20) {
            message = "작가명은 20자 이하만 가능합니다.";
        } else if (user.nick_name !== this.state.checkNickname) {
            API.artists.artistCheckNickname(auth.getUser().id, user.nick_name)
                .then(response => {
                    if (response.status === 200) {
                        props.isNickname = true;
                        props.checkNickname = user.nick_name;
                        message = "등록 가능한 작가명입니다.";
                    } else {
                        props.isNickname = false;
                        props.checkNickname = "";
                        message = "이미 등록된 작가명 입니다.\n다른작가명으로 변경해주세요.";
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
            props.isNickname = false;
            PopModal.toast(message);
        }

        if (Object.keys(props).length > 0) {
            this.setState(props);
        }
    }

    uploadArtistImage(e) {
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
                        self.loadProfileImage(file);
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

    loadProfileImage(file) {
        const reader = new FileReader();

        reader.onload = () => {
            const dataUrl = reader.result;
            this.setState({
                profile_type: "reader",
                user: update(this.state.user, { profile_img: { $set: dataUrl } }),
                uploadFile: file
            });
        };
        reader.readAsDataURL(file);
    }

    checkUserSuccess(result) {
        PopModal.toast("인증되었습니다.");
        const data = result.data;

        const props = {
            user: {
                birth: { $set: data.birth },
                gender: { $set: data.gender },
                name: { $set: data.name },
                nick_name: { $set: data.name },
                phone: { $set: data.phone }
            },
            encode_data: { $set: data.encode_data }
        };

        this.setState(update(this.state, props));
    }

    checkUserFail(result) {
        const data = { ...result };
        PopModal.alert(data.message ? data.message.replace(/"/g, "") : "인증에 실패하였습니다.");
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
                            }, () => PopModal.toast(`${changeEmail}로 인증메일이 전송되었습니다.`));
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
        let message = "";

        if (this.state.changeEmail !== this.state.signEmail) {
            message = "인증받을 이메일이 다릅니다.";
        } else if (this.state.signCode === "") {
            message = "인증번호를 입력해주세요.";
        } else {
            const data = {
                email: this.state.changeEmail,
                code: this.state.signCode,
                type: "JOIN"
            };

            API.artists.artistEmailConfirmCheck(user.id, data)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            signCode: "",
                            signEmail: "",
                            user: update(this.state.user, { email: { $set: data.email } })
                        }, () => {
                            PopModal.toast("이메일 인증이 완료되었습니다.");
                        });
                    }
                })
                .catch(error => {
                    PopModal.toast(error.data);
                });
        }

        if (message !== "") {
            PopModal.toast(message);
        }
    }

    validationCheck() {
        const user = this.state.user;
        const changeEmail = this.state.changeEmail;
        const region = this.state.add_address.join(",");
        user.region = region;

        let message = "";

        if (this.state.encode_data === "") {
            message = "실명인증을 해주세요.";
        } else if (user.profile_img === "") {
            message = "프로필 이미지를 업로드해주세요.";
        } else if (user.nick_name === "") {
            message = "작가명을 입력해주세요.";
        } else if (user.nick_name.length > 20) {
            message = "작가명은 20자 이하만 입력 가능합니다.";
        } else if (!this.state.isNickname || user.nick_name !== this.state.checkNickname) {
            message = "작가명 중복체크를 해주세요.";
        } else if (changeEmail === "") {
            message = "이메일을 입력해주세요.";
        } else if (!utils.isValidEmail(changeEmail)) {
            message = "이메일을 정확하게 입력해주세요.";
        } else if (this.state.signEmail !== "" && this.state.signCode === "") {
            message = "인증번호를 입력해주세요.";
        } else if (user.email !== changeEmail) {
            message = "이메일 인증을 해주세요.";
        } else if (user.region === "") {
            message = "주 활동지역을 입력해주세요.";
        } else if (user.region.length > 50) {
            message = "주 할동지역은 50자 이하만 입력 가능합니다.";
        } else if (user.bank_name === "") {
            message = "은행명을 선택해주세요.";
        } else if (user.bank_num === "") {
            message = "계좌번호를 입력해주세요.";
        } else if (user.bank_num.length > 15) {
            message = "계좌번호는 15자 이하만 입력 가능합니다.";
        } else {
            return true;
        }

        if (message !== "") {
            PopModal.toast(message);
        }

        return false;
    }

    /**
     *  작가 등록
     **/
    registArtistData() {
        if (this.validationCheck()) {
            const uploadInfo = this.state.uploadInfo;
            const uploadFile = this.state.uploadFile;
            const form = new FormData();

            if (uploadInfo) {
                const uploadKey = `${uploadInfo.key}${utils.uniqId()}.${utils.fileExtension(uploadFile.name)}`;

                form.append("key", uploadKey);
                form.append("acl", uploadInfo.acl);
                form.append("policy", uploadInfo.policy);
                form.append("X-Amz-Credential", uploadInfo["X-Amz-Credential"]);
                form.append("X-Amz-Algorithm", uploadInfo["X-Amz-Algorithm"]);
                form.append("X-Amz-Date", uploadInfo["X-Amz-Date"]);
                form.append("X-Amz-Signature", uploadInfo["X-Amz-Signature"]);
                form.append("file", uploadFile);

                API.common.uploadS3(uploadInfo.action, form)
                    .then(response => {
                        this.state.uploadKey = uploadKey;
                        if (this.state.user.email_agree !== "Y") {
                            PopModal.confirm("포스냅 알림 및 업데이트 소식을 받으면 더 많은 혜택을 누릴 수 있습니다.<br />알림 및 업데이트 소식을 받으시겠습니까?",
                                () => {
                                    this.setState({
                                        user: update(this.state.user, { email_agree: { $set: "Y" } })
                                    }, this.apiRegistArtist);
                                }, this.apiRegistArtist);
                        } else {
                            this.apiRegistArtist();
                        }
                    })
                    .catch(error => {
                        PopModal.alert("프로필 사진 업로드중 오류가 발생했습니다.\n고객센터로 문의해주세요.");
                    });
            }
        }
    }

    apiRegistArtist() {
        const user = this.state.user;
        const uploadKey = this.state.uploadKey;
        const userId = auth.getUser().id;
        const formData = new FormData();

        formData.append("user_id", auth.getUser().id);
        formData.append("enc_data", this.state.encode_data);
        formData.append("email", user.email);
        formData.append("nick_name", user.nick_name.replace(" ", ""));
        formData.append("region", user.region);
        formData.append("bank_name", user.bank_name);
        formData.append("bank_num", user.bank_num);
        formData.append("email_agree", user.email_agree);
        formData.append("key", uploadKey);

        API.artists.registerArtist(userId, formData)
            .then(response => {
                if (response.status === 200) {
                    auth.local.updateUser(userId, { email: user.email });
                    PopModal.alert("포스냅작가로 등록되셨어요<br />잘부탁드립니다", { callBack: () => {
                        redirect.redirectArtistPage();
                    } });
                }
            })
            .catch(error => {
                PopModal.alert(error.data);
            });
    }

    buttonClickProfile() {
        document.getElementsByClassName("users-profile-image")[0].click();
    }

    socialSync(result) {
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
        const changeEmail = this.state.changeEmail;
        const session = auth.getUser();
        const gender = constant.GENDER.GENDER_NAME;
        const origin_address_list = this.state.origin_address_list;

        if (session.data.is_artist) {
            PopModal.alert("이미 작가로 등록되어있습니다.", { callBack: () => redirect.redirectArtistPage() });
            return null;
        }
        return (
            <div className="myAccount-page">
                <h1 className="sr-only">등록정보 입력하기</h1>
                <section>
                    <div className="account-thumb">
                        <h6 className="title">프로필 이미지<span className="isRequired">*</span></h6>
                        <div>
                            <div>
                                <Profile image={{ src: user.profile_img, type: this.state.profile_type }} size="large" />
                            </div>
                            <input type="file" value="" accept="image/jpeg, image/png, image/bmp" className="users-profile-image" onChange={this.uploadArtistImage} />
                            <Buttons buttonStyle={{ size: "small", shape: "circle", theme: "default" }} inline={{ onClick: this.buttonClickProfile }}>이미지 업로드</Buttons>
                        </div>
                        <span className="caption">
                        프로필 이미지를 등록해 주세요.<br />
                        110 x 110 픽셀 크기의 이미지를 권장합니다.
                        </span>
                    </div>
                </section>
                <div className="users-content-row">
                    <div className="content-columns">
                        <span className="title">본인확인<span className="isRequired">*</span></span>
                        <Buttons buttonStyle={{ size: "small", width: "w135", shape: "circle", theme: "default" }} inline={{ onClick: this.onCheckUser }}>실명인증 확인</Buttons>
                        <span className="caption">작가로 활동하실 경우 실명입력이  필수입니다.</span>
                    </div>
                    <div className="content-columns">
                        <span className="title">이름<span className="isRequired">*</span></span>
                        <Input inputStyle={{ size: "small", width: "w412" }} inline={{ disabled: true, value: user.name }} />
                        <span className="caption">전체 이름은 예약이 완료될 경우에만 공개돼요.</span>
                    </div>
                    <div className="content-columns">
                        <span className="title">작가명<span className="isRequired">*</span></span>
                        <Input
                            inputStyle={{ size: "small", width: "w267" }}
                            inline={{
                                type: "text",
                                value: this.state.user.nick_name,
                                maxLength: 20,
                                onChange: (e, value) => this.setUserKey("nick_name", this.replaceChar(e, value))
                            }}
                        />
                        <Buttons buttonStyle={{ size: "small", width: "w135", shape: "circle", theme: "default" }} inline={{ onClick: this.checkNickname }}>작가명 중복체크</Buttons>
                        <span className="caption">한글, 영문, 숫자만 입력가능합니다.</span>
                    </div>
                    <div className="content-columns">
                        <span className="title">성별<span className="isRequired">*</span></span>
                        <Input inputStyle={{ size: "small", width: "w412" }} inline={{ disabled: true, value: user.gender !== "" ? gender[user.gender] : "" }} />
                        <span className="caption">이 정보는 통계 목적으로 사용되며 다른 회원들에게 절대 공개되지 않아요.</span>
                    </div>
                    <div className="content-columns">
                        <span className="title">생년월일<span className="isRequired">*</span></span>
                        <Input inputStyle={{ size: "small", width: "w412" }} inline={{ disabled: true, value: user.birth !== "" ? mewtime(mewtime.strToDate(user.birth)).format("YYYY년 MM월 DD일") : "" }} />
                    </div>
                    <div className="content-columns">
                        <span className="title">이메일<span className="isRequired">*</span></span>
                        <Input inputStyle={{ size: "small", width: "w267" }} inline={{ disabled: !!user.email, placeholder: "이메일@주소", value: changeEmail, maxLength: 30, onChange: (e, value) => this.setState({ changeEmail: value }) }} type="email" />
                        {!user.email ? <Buttons buttonStyle={{ size: "small", width: "w135", shape: "circle", theme: "default" }} inline={{ onClick: this.apiArtistEmailCode }}>인증번호 보내기</Buttons> : null}
                        <span className="caption">{user.email ? "이메일은 작가페이지 계정설정에서 수정가능합니다." : "본인확인 인증코드가 메일로 전송됩니다."}</span>
                    </div>
                    {this.state.signEmail !== "" ?
                        <div className="content-columns">
                            <span className="title" />
                            <Input inputStyle={{ size: "small", width: "w267" }} inline={{ type: "text", placeholder: "인증번호 확인", maxLength: 6, value: this.state.signCode, onChange: (e, value) => this.setState({ signCode: value }) }} type="number" />
                            <Buttons buttonStyle={{ size: "small", width: "w135", shape: "circle", theme: "default" }} inline={{ onClick: this.apiArtistEmailSign }}>확인</Buttons>
                        </div>
                        : ""}
                    <div className="content-columns">
                        <span className="title" />
                        <Checkbox type="yellow_circle" checked={user.email_agree === "Y"} resultFunc={value => this.setUserKey("email_agree", value ? "Y" : "N")}>포스냅 알림 및 업데이트 소식 받기</Checkbox>
                        <span className="caption">이메일은 예약이 완료될 경우에만 공개돼요.</span>
                    </div>
                    <div className="content-columns">
                        <span className="title">전화번호<span className="isRequired">*</span></span>
                        <Input inputStyle={{ size: "small", width: "w276" }} inline={{ disabled: true, value: user.phone }} />
                        <span className="caption">전화번호는 예약이 완료될 경우에만 공개돼요.</span>
                    </div>
                    <div className="content-columns">
                        <span className="title">주 활동지역<span className="isRequired">*</span></span>
                        <div className="address-list">
                            <div className="list-wrap">
                                {Array.isArray(origin_address_list) ?
                                    origin_address_list.map((obj, idx) => {
                                        return (
                                            <div className="address-box" key={`address_${idx}`} onClick={e => this.onAddressClick(e, obj.title)}>
                                                {obj.title}
                                            </div>
                                        );
                                    }) : null
                                }
                            </div>
                        </div>
                        <span className="caption">주 활동 지역을 선택해주세요.</span>
                        {/*<Input inputStyle={{ size: "small", width: "w412" }} inline={{ type: "text", value: user.region, maxLength: 50, onChange: (e, value) => this.setUserKey("region", value) }} />*/}
                        {/*<span className="caption">이 정보는 통계 목적으로 사용되며 다른 회원들에게 절대 공개되지 않아요.</span>*/}
                    </div>
                    <div className="content-columns">
                        <span className="title">은행명<span className="isRequired">*</span></span>
                        <Dropdown list={this.state.bank} size="small" width="w412" select={user.bank_name} resultFunc={value => this.setUserKey("bank_name", value)} />
                        <span className="caption">은행명을 선택해주세요.</span>
                    </div>
                    <div className="content-columns">
                        <span className="title">계좌번호<span className="isRequired">*</span></span>
                        <Input
                            inputStyle={{ size: "small", width: "w412" }}
                            inline={{ type: "text", placeholder: "'-'없이 번호만 입력해주세요", value: user.bank_num, maxLength: 15, onChange: (e, value) => this.setUserKey("bank_num", value) }}
                            type="number"
                        />
                        <span className="caption">계좌번호를 입력해주세요. 잘못된 계좌번호 또는 예금주명이 다를 시 불이익을 받으실 수 있습니다.</span>
                    </div>
                </div>
                <div className="users-content-row social">
                    <div className="content-columns">
                        <span className="title">로그인</span>
                        <SocialSyncList data={this.state.user.sns_list} join_type={user.join_type} />
                        <span className="caption social">카카오톡 또는 페이스북, 네이버로 연결하시면<br />간편하게 로그인할 수 있어요.</span>
                    </div>
                </div>
                <div className="users-content-row text-center">
                    <Buttons buttonStyle={{ width: "w179", shape: "circle", theme: "default" }} inline={{ onClick: this.registArtistData }}>등록하기</Buttons>
                </div>
            </div>
        );
    }
}

export default AccountPage;
