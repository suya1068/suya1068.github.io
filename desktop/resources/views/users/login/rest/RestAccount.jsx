import "./rest_account.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import classNames from "classnames";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import API from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";

export default class RestAccount extends Component {
    constructor(props) {
        super(props);
        const search = location.search && utils.query.parse(location.search);

        this.state = {
            rest_dt: props.rest_dt,
            user_id: props.user_id,
            is_agree: false,
            is_clear: false,
            redirectURL: search && search.redirectURL
        };

        this.onAgree = this.onAgree.bind(this);
        this.onRestClear = this.onRestClear.bind(this);
    }

    componentWillMount() {
        window.scrollTo(0, 0);
    }

    /**
     * 휴면계정 활성화 동의 / 비동의
     * @param e
     */
    onAgree(e) {
        const { is_agree } = this.state;
        this.setState({ is_agree: !is_agree });
    }

    /**
     * 취소버튼 눌렀을 때 유저정보 삭제 후 메인으로 이동
     */
    onRedirectMain() {
        auth.removeUser();
        location.href = "/";
    }

    /**
     * 휴면계정 해제
     * 미 동의시 경고 문구 출력
     * 동의시 활성화 완료 문구 출력 후 로그인 페이지로 이동
     */
    onRestClear() {
        const { is_agree, redirectURL } = this.state;
        const { user_id } = this.props;
        if (!is_agree) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "휴면회원 해제에 동의하셔야 해제가 가능합니다."
            });
        } else {
            API.users.restClear(user_id, { agree: is_agree ? "Y" : "N" })
                .then(response => {
                    const data = response.data;
                    auth.setUser(data.user_id, {
                        id: data.user_id,
                        artistNo: data.artist_no,
                        apiToken: data.api_token,
                        // sns: clone.data.type,
                        email: data.email,
                        name: data.name,
                        profile_img: data.profile_img,
                        rest_dt: data.rest_dt
                    });

                    return data;
                })
                .then(() => {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: "계정이 활성화 되었습니다.",
                        onSubmit: () => { location.href = redirectURL || "/"; }
                    });
                })
                .catch(error => {
                    Modal.show({
                        typ: MODAL_TYPE.ALERT,
                        content: error.data ? error.data : "계정 활성화 중 오류가 발생했습니다.\n문제가 지속되면 고객센터에 문의해 주세요.",
                        onSubmit: () => { location.href = "/"; }
                    });
                });
        }
    }

    render() {
        const { is_agree } = this.state;
        return (
            <div className="rest_account_page">
                <div className="container">
                    <div className="rest_account__box">
                        <div className="rest_account__box__header">
                            <p className="rest_account__box__header-title">반갑습니다. 고객님!<br />
                                <strong>휴면계정을 활성화 하시면, 포스냅을 계속 이용하실 수 있습니다.</strong>
                            </p>
                        </div>
                        <div className="rest_account__box__body">
                            <div className="rest_account__box__body-image">
                                <div className="test">
                                    <Img image={{ src: "/common/login_dormant.png", type: "image" }} />
                                </div>
                            </div>
                            <div className="rest_account__box__body-check" onClick={this.onAgree}>
                                <div className={classNames("yellow_check", { "check": is_agree })} />
                                <span className={classNames("rest_account__box__body-agree-test", { "check": is_agree })}>휴면회원 해제에 동의합니다.</span>
                            </div>
                        </div>
                        <div className="rest_account__box__footer">
                            <div className="rest_account__box__footer-buttons">
                                <button className="_button rest_cancel" onClick={this.onRedirectMain}>취소</button>
                                <button className="_button _button__black rest_ok" onClick={this.onRestClear}>확인</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
