import "./popReceiveEmail.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "forsnap-utils";
import Input from "shared/components/ui/input/Input";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

export default class PopReceiveEmail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_email: "",
            user_name: "",
            agree: false,
            checked: false,
            deviceType: props.deviceType
        };

        this.onConsult = this.onConsult.bind(this);
    }

    onConsult() {
        const { onConsult } = this.props;
        const {
            user_email,
            referer,
            referer_keyword
        } = this.state;

        let message = "";

        if (user_email && !utils.isValidEmail(user_email)) {
            message = "이메일을 정확하게 입력해주세요.";
        }

        if (message) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: message
            });
        } else {
            const params = {
                email: user_email
            };
            if (referer) {
                params.referer = referer;
            }

            if (referer_keyword) {
                params.referer_keyword = referer_keyword;
            }

            onConsult(params);
        }
    }

    render() {
        const { onClose, deviceType } = this.props;
        const { user_email } = this.state;

        return (
            <div className={classNames("pop-receive-email__modal", deviceType)}>
                <div className="forsnap__logo">
                    <img alt="logo" src={`${__SERVER__.img}/common/f_logo_black.png`} />
                    <button className="_button _button__close black__lighten" onClick={onClose} />
                </div>
                <div className="pop__title">
                    {/*{deviceType === "mobile" ? utils.linebreak("입력하신 이메일로\n산출된 견적이 발송됩니다.") : "입력하신 이메일로 산출된 견적이 발송됩니다."}*/}
                    입력하신 이메일로 산출된 견적이 발송됩니다.
                </div>
                <div className="pop__content">
                    <div className="consult__email">
                        <div className="label">이메일</div>
                        <Input
                            name="user_email"
                            value={user_email}
                            placeholder="이메일을 입력해주세요."
                            onChange={(e, n, v) => this.setState({ [n]: v })}
                        />
                    </div>
                </div>
                <div className="pop__artist__agree">
                    <p>등록하신 이메일은 견적발송용으로만 사용됩니다.</p>
                </div>
                <div className="pop__button">
                    <button className="_button _button__fill__yellow1" onClick={this.onConsult}>확인</button>
                </div>
            </div>
        );
    }
}
