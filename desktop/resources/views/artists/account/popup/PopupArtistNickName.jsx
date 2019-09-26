import "../scss/PopupArtistNickName.scss";
import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";
import api from "forsnap-api";
import auth from "forsnap-authentication";

import PopModal from "shared/components/modal/PopModal";
import Input from "shared/components/ui/input/Input";

class PopupArtistNickName extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nick_name: props.nick_name || "",
            error: "",
            isCheck: false,
            isProcess: false
        };

        this.onChangeNickname = this.onChangeNickname.bind(this);
        this.onCheckNickname = this.onCheckNickname.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeNickname(e, n, v) {
        this.setState({
            nick_name: this.replaceChar(v)
        });
    }

    onCheckNickname() {
        const user = auth.getUser();
        const { nick_name } = this.state;
        let message = "";

        if (user) {
            if (nick_name.replace(/\s/gi, "") === "") {
                message = "변경할 작가명을 입력해주세요";
            } else if (nick_name.length > 20) {
                message = "작가명은 20자 이하만 가능합니다.";
            }

            if (message) {
                this.setState({
                    error: message,
                    isCheck: false
                });
            } else if (!this.state.isProcess) {
                this.state.isProcess = true;
                PopModal.progress();
                api.artists.artistCheckNickname(user.id, nick_name)
                    .then(response => {
                        this.state.isProcess = false;
                        PopModal.closeProgress();
                        message = "사용가능한 작가명입니다.";

                        this.setState({
                            error: message,
                            isCheck: true
                        });
                    })
                    .catch(error => {
                        this.state.isProcess = false;
                        PopModal.closeProgress();
                        PopModal.alert(error.data || "작가명 중복체크중 오류가 발생했습니다.");
                    });
            }
        } else {
            PopModal.alert("로그인후 이용해주세요");
        }
    }

    onSubmit() {
        const user = auth.getUser();
        const { isCheck } = this.state;

        if (user) {
            if (!isCheck) {
                PopModal.alert("작가명 중복체크를 해주세요", { key: "alert_nickname_check" });
            } else if (!this.state.isProcess) {
                this.state.isProcess = true;
                PopModal.progress();
                api.artists.createNickname(user.id, { nick_name: this.state.nick_name })
                    .then(response => {
                        this.state.isProcess = false;
                        PopModal.closeProgress();
                        PopModal.alert("작가명 변경을 요청했습니다", { callBack: () => PopModal.close() });
                    })
                    .catch(error => {
                        this.state.isProcess = false;
                        PopModal.closeProgress();
                        PopModal.alert(error.data || "작가명 변경 요청중 오류가 발생했습니다.");
                    });
            }
        } else {
            PopModal.alert("로그인후 이용해주세요");
        }
    }

    /**
     * 작가명 입력 및 체크
     * @param value
     */
    replaceChar(value) {
        const test = value.replace(/[^{\d}{a-zA-Z}{가-힣ㄱ-ㅎㅏ-ㅣ}]+/gi, "");
        return test.replace(/\{|\}+/gi, "");
    }

    render() {
        const { nick_name, error } = this.state;

        return (
            <div className="popup__artist__nickname">
                <div className="popup__header">
                    작가명 변경요청
                </div>
                <div className="popup__body">
                    <div className="title">
                        변경하실 작가명을 입력해주세요.
                    </div>
                    <div className="content">
                        <div className="change__nickname">
                            <div className="title">작가명</div>
                            <div className="content">
                                <Input
                                    value={nick_name}
                                    onChange={this.onChangeNickname}
                                    max="20"
                                />
                                {error ? <div className="content__error">{`· ${error}`}</div> : null}
                            </div>
                            <div className="check__duplication">
                                <button className="f__button f__button__circle f__button__theme__black" onClick={this.onCheckNickname}>작가명 중복체크</button>
                            </div>
                        </div>
                        <div className="description">
                            실명 외의 작가명으로 활동을 원하시는 경우 작가명을 등록 해 주세요.<br />
                            영업일 기준 1~3일 소요되며, 운영 규정에 맞지 않는 경우 반영되지 않을 수 있습니다.<br />
                            작가명 변경 승인 후에도 정책에 맞지 않는 경우 실명으로 다시 변경 될 수있습니다.
                        </div>
                    </div>
                </div>
                <div className="popup__footer">
                    <button className="f__button f__button__large f__button__circle f__button__theme__black" onClick={this.onSubmit}>신청하기</button>
                </div>
            </div>
        );
    }
}

PopupArtistNickName.propTypes = {
    nick_name: PropTypes.string
};

export default PopupArtistNickName;
