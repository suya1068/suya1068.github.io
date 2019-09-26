import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import Input from "shared/components/ui/input/Input";
import Img from "shared/components/image/Img";

class OutsidePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: "",
            message: ""
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        const { password } = this.state;
        let message = "";
        e.preventDefault();

        if (!password.replace(/\s/g, "")) {
            message = "견적서 비밀번호를 입력해주세요.";
        }

        if (message) {
            this.setState({
                message
            });
        } else {
            this.props.onPassword(password);
        }
    }

    render() {
        const { password, message } = this.state;

        return (
            <div className="estimate__outside__password">
                <div className="outside__bg">
                    <Img image={{ src: "/estimate/estimate_bg.jpg", type: "image" }} />
                </div>
                <div className="outside__wrap">
                    <div className="outside__container">
                        <div className="estimate__logo">
                            <div className="">
                                <img alt="estimate_logo" src={`${__SERVER__.img}/estimate/logo_estimate_white.png`} />
                            </div>
                        </div>
                        <div className="outside__about">
                            <div className="outside__row">
                                <div className="outside__icon">
                                    <img alt="estimate_logo" src={`${__SERVER__.img}/estimate/icon/icon_price.png`} />
                                </div>
                                <div className="outside__title">최저가 진행</div>
                                <div className="outside__content">한달 100건 이상의 촬영을 통해<br />최저가로 촬영 진행이 가능합니다.</div>
                            </div>
                            <div className="outside__row">
                                <div className="outside__icon">
                                    <img alt="estimate_logo" src={`${__SERVER__.img}/estimate/icon/icon_quality.png`} />
                                </div>
                                <div className="outside__title">고퀄리티 촬영</div>
                                <div className="outside__content">고객평점 99점이상의 만족스러운<br />결과물을 제공해드립니다.</div>
                            </div>
                            <div className="outside__row">
                                <div className="outside__icon">
                                    <img alt="estimate_logo" src={`${__SERVER__.img}/estimate/icon/icon_commission.png`} />
                                </div>
                                <div className="outside__title">수수료 0%</div>
                                <div className="outside__content">작가님과 고객님 모두에게<br />중개수수료가 0%입니다.</div>
                            </div>
                            <div className="outside__row">
                                <div className="outside__icon">
                                    <img alt="estimate_logo" src={`${__SERVER__.img}/estimate/icon/icon_safety.png`} />
                                </div>
                                <div className="outside__title">안전한 거래 시스템</div>
                                <div className="outside__content">사진이 최종 전달될때까지 촬영대금을<br />포스냅에서 안전하게 보관합니다.</div>
                            </div>
                        </div>
                        <div className={classNames("outside__password", { show: this.props.limit })}>
                            <div className="password__title">비밀번호를 입력하시면 견적서를 확인하실 수 있습니다.</div>
                            <form className="password__form" onSubmit={this.onSubmit} autoComplete="off">
                                <Input
                                    type="password"
                                    name="password"
                                    value={password}
                                    max="15"
                                    onChange={(e, n, v) => this.setState({ [n]: v, message: "" })}
                                />
                                <div className="password__error">{message}</div>
                                <button className="_button _button__fill__yellow">확인</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// MTgxMDE4MTcxNTA2
// MTgxMDIzMTYyODU1

OutsidePassword.propTypes = {
    limit: PropTypes.bool.isRequired,
    onPassword: PropTypes.func.isRequired
};
OutsidePassword.defaultProps = {};

export default OutsidePassword;
