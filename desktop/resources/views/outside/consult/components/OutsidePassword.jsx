import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Input from "shared/components/ui/input/Input";
import Img from "shared/components/image/Img";

class OutsidePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: ""
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        const { password } = this.state;
        let message = "";

        if (!password.replace(/\s/g, "")) {
            message = "비밀번호를 입력해주세요.";
        }

        if (message) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: message
            });
        } else {
            this.props.onPassword(password);
        }
    }

    render() {
        const { password } = this.state;

        return (
            <div className="outside__consult__password">
                <div className="outside__bg">
                    <Img image={{ src: "/common/consult_bg.jpg", type: "image" }} />
                </div>
                <div className="outside__wrap">
                    <div className="outside__container">
                        <div className="consult__logo">
                            <div className="">
                                <img alt="consult_logo" src={`${__SERVER__.img}/common/f_logo_yellow.png`} />
                            </div>
                        </div>
                        <div className="outside__about">
                            <div className="outside__row">
                                <div className="outside__icon">
                                    <img alt="consult_logo" src={`${__SERVER__.img}/common/outside_01.png`} />
                                </div>
                                <div className="outside__title">촬영 견적 전문가</div>
                                <div className="outside__content">중개수수료가 0%로<br />자신있게 제안하는 견적</div>
                            </div>
                            <div className="outside__row">
                                <div className="outside__icon">
                                    <img alt="consult_logo" src={`${__SERVER__.img}/common/outside_02.png`} />
                                </div>
                                <div className="outside__title">높은 고객 만족도</div>
                                <div className="outside__content">촬영 전문가가<br />확인하는 품질보증</div>
                            </div>
                            <div className="outside__row">
                                <div className="outside__icon">
                                    <img alt="consult_logo" src={`${__SERVER__.img}/common/outside_03.png`} />
                                </div>
                                <div className="outside__title">수백건의 촬영 진행</div>
                                <div className="outside__content">담당 매니저가<br />전 과정을 전담</div>
                            </div>
                        </div>
                        <div className={classNames("outside__password", { show: this.props.limit })}>
                            <div className="password__title">비밀번호를 입력하시면 파일을 업로드 하실 수 있습니다.</div>
                            <form className="password__form" onSubmit={this.onSubmit} autoComplete="off">
                                <Input
                                    className={password ? null : "none__spacing"}
                                    type="password"
                                    name="password"
                                    value={password}
                                    max="15"
                                    placeholder="전달받은 비밀번호를 입력해주세요."
                                    onChange={(e, n, v) => this.setState({ [n]: v })}
                                />
                                <button className="_button _button__fill__yellow">확인</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

OutsidePassword.propTypes = {
    limit: PropTypes.bool.isRequired,
    onPassword: PropTypes.func.isRequired
};
OutsidePassword.defaultProps = {};

export default OutsidePassword;
