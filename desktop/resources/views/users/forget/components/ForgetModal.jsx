import React, { Component, PropTypes } from "react";

class ForgetModal extends Component {
    render() {
        return (
            <div className="forget__modal">
                <div className="forget__title">
                    등록된 계정이 없습니다.
                </div>
                <div className="forget__buttons">
                    <a className="_button _button__default" href="/">홈으로</a>
                    <a className="_button _button__black" href="/join">회원가입</a>
                </div>
            </div>
        );
    }
}

export default ForgetModal;
