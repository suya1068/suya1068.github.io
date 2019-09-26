import "./leaveContainer.scss";
import React, { Component, PropTypes } from "react";
import API from "forsnap-api";
import Reason from "./component/reason/Reason";
import Information from "./component/information/Information";
import PopModal from "shared/components/modal/PopModal";
import redirect from "forsnap-redirect";
import classNames from "classnames";
import auth from "forsnap-authentication";

export default class LeaveContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_artist: props.is_artist,
            user_id: props.user_id,
            is_agree: false,
            view: props.view
        };
        this.onAgree = this.onAgree.bind(this);
        this.onCustomerLeave = this.onCustomerLeave.bind(this);
        this.validate = this.validate.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    /**
     * 안내사항 동의여부 체크 / 체크해제
     * @param flag
     */
    onAgree(flag) {
        this.setState({
            is_agree: flag
        });
    }

    /**
     * 회원탈퇴 폼
     */
    onCustomerLeave() {
        const { is_agree, user_id } = this.state;
        const is_valid = this.validate();

        if (is_valid) {
            if (!is_agree) {
                PopModal.alert("안내사항에 동의하여야 탈퇴가 가능합니다.");
                return;
            }

            PopModal.progress();

            if (!user_id) {
                PopModal.closeProgress();
                PopModal.alert("잘못된 유저아이디 입니다. 다시 로그인해 주세요.", {
                    callBack: () => redirect.login()
                });
                return;
            }

            this.leave(user_id)
                .then(response => {
                    PopModal.closeProgress();
                    auth.removeUser();
                    PopModal.alert("탈퇴 되었습니다.", {
                        callBack: () => { location.href = "/"; }
                    });
                }).catch(error => {
                    PopModal.closeProgress();
                    PopModal.alert(error.data);
                });
        }
    }

    /**
     * 회원탈퇴 API 반환
     * @returns {IDBRequest|Promise<void>}
     */
    leave(user_id) {
        const leave_reason = this.reason.state.comment;

        return API.auth.getout(user_id, { leave_reason });
    }

    /**
     * 유효성 체크
     * @returns {boolean}
     */
    validate() {
        const reason = this.reason;
        if (reason.validate()) {
            PopModal.alert(reason.validate());
            return false;
        }
        return true;
    }

    render() {
        const { is_agree, is_artist, view } = this.state;
        return (
            <div className={classNames("customer-leave-component", view || "")} style={{ width: "100%" }}>
                <Reason ref={instance => { this.reason = instance; }} />
                <div style={{ marginTop: "25px" }}>
                    <Information onAgree={this.onAgree} is_agree={is_agree} is_artist={is_artist} />
                </div>
                <div className="customer-leave-button">
                    <button className="customer-leave-button__ok" onClick={this.onCustomerLeave}>확인</button>
                </div>
            </div>
        );
    }
}

LeaveContainer.propTypes = {
    is_artist: PropTypes.bool,
    user_id: PropTypes.string,
    view: PropTypes.string.isRequired
};

LeaveContainer.defaultProps = {
    is_artist: false,
    user_id: ""
};
