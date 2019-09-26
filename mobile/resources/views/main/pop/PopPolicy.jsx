import "./popPolicy.scss";
import React, { Component, PropTypes } from "react";

export default class PopPolicy extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        const { onClose } = this.props;

        return (
            <div className="pop-policy__modal">
                <div className="forsnap__logo">
                    <img alt="logo" src={`${__SERVER__.img}/common/f_logo_black.png`} />
                    <button className="_button _button__close black__lighten" onClick={onClose} />
                </div>
                <div className="pop__desc pop-bold">
                    포스냅은 고객의 요청에 정확하고 성실한 답변을<br />
                    드리기 위해 필요한 최소한의 개인정보를 수집하고 있습니다.
                </div>
                <div className="pop__content">
                    <p>목적 : 촬영문의내용 처리</p>
                    <p>정보 : 이름, 전화번호</p>
                    <p>보유 및 이용 기간 : 1년 보관 후 파기</p>
                </div>
                <div className="pop__button">
                    <button className="_button _button__fill__yellow1" onClick={onClose}>확인</button>
                </div>
            </div>
        );
    }
}
