import "./outside_main.scss";
import React, { Component } from "react";

export default class OutsideMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: props.password || "",
            onChangeFormHandler: props.onChangeFormHandler,
            onOutsideInfo: props.onOutsideInfo
        };
        this.onEnter = this.onEnter.bind(this);
    }

    onEnter(e) {
        if (e.keyCode === 13) {
            this.props.onOutsideInfo();
        }
    }

    render() {
        const { onChangeFormHandler, onOutsideInfo, password } = this.props;
        return (
            <div className="forsnap-outside__main" style={{ minHeight: "calc(100vh - 290px)" }}>
                <div className="forsnap-outside__main-outer">
                    <p
                        style={{ color: "#fff", fontSize: 12, opacity: "0.6", position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)" }}
                    >
                        Photographer 코코
                    </p>
                </div>
                <div className="container" style={{ top: "50%", transform: "translateY(-50%)" }}>
                    <article className="forsnap-outside__main-content">
                        <div className="forsnap-outside__main-heading">
                            <h3 className="forsnap-outside__main-heading__title">비밀번호를<br />입력해주세요</h3>
                            <p className="forsnap-outside__main-heading__description">
                                전달받은 비밀번호를 입력해주세요.<br />
                                비밀번호 확인이 어려운 경우<br />
                                포스냅 담당자에게 문의해 주세요.
                            </p>
                        </div>
                        <div className="forsnap-outside__main-form">
                            <div className="forsnap-outside__input">
                                <input
                                    placeholder="비밀번호를 입력해주세요."
                                    value={password}
                                    name="password"
                                    type="password"
                                    maxLength={20}
                                    onChange={onChangeFormHandler}
                                    onKeyUp={this.onEnter}
                                />
                            </div>
                            <button className="button button__theme__yellow" onClick={onOutsideInfo}>확인</button>
                        </div>
                    </article>
                </div>
            </div>
        );
    }
}
