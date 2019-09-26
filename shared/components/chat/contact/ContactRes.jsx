import "./contact_res.scss";
import React, { Component, PropTypes } from "react";
import ContactResStart from "./ContactResStart";
import ContactResReason from "./ContactResReason";
import ContactResProgress from "./ContactResProgress";
import { CONTACT_RES } from "./contact_res";
import auth from "forsnap-authentication";
import API from "forsnap-api";
import PopModal from "../../modal/PopModal";

export default class ContactRes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: ["START", "REASON", "PROGRESS"],
            cur_step: props.cur_step || "START",
            group_key: props.group_key,
            cur_info: {},
            cur_valid: [],
            head_desc: "",
            is_agree: false,
            reason: props.reason || "",
            progress_content: ""
            // button_active: false
        };
        this.setCurStep = this.setCurStep.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.validCheck = this.validCheck.bind(this);
        //
        this.contactReason = this.contactReason.bind(this);
    }

    componentWillMount() {
        const { cur_step } = this.state;
        this.setCurStep(cur_step);
    }

    componentDidMount() {
    }

    validCheck(valid, state) {
        let flag = true;
        let message = "";
        // const button = this.contact_ok;
        valid.map((v, i) => {
            const check = state[v];
            switch (v) {
                case "reason":
                    if (check.length < 30) {
                        flag = false;
                        message = "연락처 전달 사유를 30자 이상 입력해주세요.";
                    }
                    break;
                case "progress_content":
                    if (check.length < 30) {
                        flag = false;
                        message = "진행상황을 30자 이상 입력해주세요.";
                    }
                    break;
                case "is_agree":
                    if (!check) {
                        flag = false;
                        message = "안내사항 확인 후 동의해주세요.";
                    }
                    break;
                default: break;
            }
            return null;
        });

        // if (flag) {
        //     button.classList.add("active");
        // } else {
        //     button.classList.remove("active");
        // }
        //
        // this.setState({ button_active: flag });
        return message;
    }

    /**
     * 사용자 조작 데이터를 저장한다.
     * @param name
     * @param value
     */
    onChangeHandler(name, value) {
        this.setState({
            [name]: value
        }, () => {
            // const { cur_valid } = this.state;
            // this.validCheck(cur_valid, this.state);
        });
    }

    /**
     * 작가 연락처 전달 요청
     * @param params
     * @returns {*}
     */
    apiCreatePhoneSend(params) {
        return API.talks.createPhoneSend(params);
    }

    /**
     * 작가 연락처 전달 후 진행상황 등록
     * @param params
     * @returns {*}
     */
    apiUpdatePhoneSend(params) {
        return API.talks.updatePhoneSend(params);
    }

    /**
     * 작가정보를 조회한다.
     * @param id
     * @returns {*}
     */
    apiGetArtistData(id) {
        return API.artists.find(id);
    }

    /**
     * 현재 스텝 데이터를 저장한다..
     * @param cur_step
     */
    setCurStep(cur_step) {
        const head_desc = CONTACT_RES[cur_step].HEAD_DESC;
        const cur_valid = CONTACT_RES[cur_step].VALID_KEYS;
        this.setState({
            cur_step,
            head_desc,
            cur_info: CONTACT_RES[cur_step].INFO,
            cur_valid
        });
    }

    /**
     * 각 단계별 확인 버튼
     * @param e
     */
    onSubmit(e) {
        const { cur_step, group_key, reason, progress_content, cur_valid } = this.state;
        const message = this.validCheck(cur_valid, this.state);
        if (!message) {
            if (cur_step === "START") {
                const user = auth.getUser();
                if (user) {
                    this.contactStart(user);
                }
            } else if (cur_step === "REASON") {
                const data = { group_key, reason };
                this.contactReason(data);
            } else if (cur_step === "PROGRESS") {
                const data = { group_key, progress_content };
                this.contactProgress(data);
            }
        } else {
            PopModal.alert(message);
        }
    }

    /**
     * 연락처 전달 첫번째 단계
     * @param user
     */
    contactStart(user) {
        this.apiGetArtistData(user.id)
            .then(response => {
                const data = response.data;
                this.setState({
                    phone: data.phone,
                    nick_name: data.nick_name
                }, () => {
                    this.setCurStep("REASON");
                    this.onInit(this.Start.onInitKey());
                });
            })
            .catch(error => {
                PopModal.alert(error.data);
            });
    }

    /**
     * 연락처 전달 두번째 단계
     * 사유 입력
     * @param params
     */
    contactReason(params) {
        PopModal.progress();
        this.apiCreatePhoneSend(params)
            .then(response => {
                const data = response.data;
                PopModal.closeProgress();
                if (typeof this.props.receiveMessage === "function") {
                    this.props.receiveMessage(data.list[0]);
                }
                this.onInit(this.Reason.onInit());
                PopModal.alert("연락처 전달이 완료되었습니다.", { callBack: () => PopModal.close() });
            })
            .catch(error => {
                PopModal.alert(error.data);
                PopModal.closeProgress();
            });
    }

    /**
     * 연락처 전달 세번째 단계
     * 진행상황 입력
     * @param params
     */
    contactProgress(params) {
        PopModal.progress();
        this.apiUpdatePhoneSend(params)
            .then(response => {
                const data = response.data;
                PopModal.closeProgress();
                if (typeof this.props.receiveMessage === "function") {
                    this.props.receiveMessage({ progress_status: data.progress_status });
                }
                this.onInit(this.Progress.onInit());
                PopModal.alert("진행상황 등록이 완료되었습니다.", { callBack: () => PopModal.close() });
            })
            .catch(error => {
                PopModal.alert(error.data);
                PopModal.closeProgress();
            });
    }

    /**
     * 데이터 초기화
     * @param obj
     */
    onInit(obj) {
        this.setState({ ...obj });
    }

    /**
     * 렌더링 컴포넌트 설정
     * @returns {*}
     */
    renderContent() {
        const { cur_step, cur_info, is_agree, reason, phone, nick_name, progress_content } = this.state;
        switch (cur_step) {
            case "START": {
                return (
                    <ContactResStart
                        cur_step={cur_step}
                        cur_info={cur_info}
                        is_agree={is_agree}
                        ref={instance => (this.Start = instance)}
                        onChangeHandler={this.onChangeHandler}
                    />
                );
            }
            case "REASON": {
                const artist_data = { phone, nick_name };
                return (
                    <ContactResReason
                        {...artist_data}
                        cur_step={cur_step}
                        cur_info={cur_info}
                        is_agree={is_agree}
                        reason={reason}
                        ref={instance => (this.Reason = instance)}
                        onChangeHandler={this.onChangeHandler}
                    />
                );
            }
            case "PROGRESS": {
                return (
                    <ContactResProgress
                        cur_step={cur_step}
                        cur_info={cur_info}
                        is_agree={is_agree}
                        reason={reason}
                        progress_content={progress_content}
                        ref={instance => (this.Progress = instance)}
                        onChangeHandler={this.onChangeHandler}
                    />
                );
            }
            default: return null;
        }
    }

    render() {
        const { title, onClose } = this.props;
        const { head_desc } = this.state;

        return (
            <div className="chat-contact-res">
                <div className="chat-contact-res__header">
                    <p className="chat-contact-res__header-title">{title}</p>
                    <p className="chat-contact-res__header-desc">{head_desc}</p>
                </div>
                <div className="chat-contact-res__body">
                    {this.renderContent()}
                </div>
                <div className="chat-contact-res__footer">
                    <div className="contact-button">
                        <button className="contact_cancel" onClick={onClose}>취소</button>
                    </div>
                    <div className="contact-button" style={{ position: "relative" }}>
                        {/*{!button_active &&*/}
                        {/*<div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }} />*/}
                        {/*}*/}
                        <button className="contact-button contact_ok" ref={node => (this.contact_ok = node)} onClick={this.onSubmit}>확인</button>
                    </div>
                </div>
            </div>
        );
    }
}

ContactRes.propTypes = {
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};
