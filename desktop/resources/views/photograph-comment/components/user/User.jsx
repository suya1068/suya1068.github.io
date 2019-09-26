import classnames from "classnames";
import React, { Component, PropTypes } from "react";

class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_name: "",
            error: ""
        };

        this.onChangeFormHandler = this.onChangeFormHandler.bind(this);
        this.getUserName = this.getUserName.bind(this);
        this.validate = this.validate.bind(this);
    }

    /**
     * 폼 핸들러
     * @private
     * @param value
     * @param name
     */
    onChangeFormHandler(value, name) {
        this.validateUserName(value);
        this.setState({ [name]: value });
    }

    /**
     * 유저 이름을 가져온다.
     * @return {*}
     */
    getUserName() {
        return this.state.user_name;
    }

    /**
     * 에러 메시지를 셋한다.
     * @public
     * @param {string} message
     */
    setErrorMessage(message) {
        if (typeof message !== "string") {
            throw new TypeError("The message parameter must be a string type.");
        }
        this.setState(state => ({ error: message }));
    }

    /**
     * 등록을 위한 데이터를 생성한다.
     * @public
     * @returns {{name: string}}
     */
    createParameters() {
        return { name: this.state.user_name };
    }

    /**
     * 유효한 데이터인지 판단한다.
     * @public
     * @returns {string}
     */
    validate() {
        const { user_name } = this.state;
        return this.validateUserName(user_name);
    }

    /**
     * 리뷰 데이터가 유효한지 판단한다
     * @private
     * @param {string} data
     * @returns {*}
     */
    validateUserName(data) {
        if (!data) {
            const message = "이름을 입력해주세요.";
            this.setErrorMessage(message);
            return message;
        }

        this.setErrorMessage("");
        return "";
    }

    /**
     * 엘리먼트에 포커스를 준다.
     * @public
     */
    focus() {
        this.element.focus();
    }

    render() {
        const { user_name, error } = this.state;

        return (
            <section className="photograph-comment-card">
                <div className="photograph-comment-card__header">
                    <h5 className="photograph-comment-card-title">
                        <span className="photograph-comment-badge is-require">[필수]</span>본인 이름을 입력해주세요.
                    </h5>
                </div>
                <div className="photograph-comment-card__body">
                    <div className="row align-items-center">
                        <div className="columns col-1">
                            <span className="form-label">이름</span>
                        </div>
                        <div className="columns col-5">
                            <input
                                ref={node => { this.element = node; }}
                                type="text"
                                className={classnames("form-control", error && "is-error")}
                                name="user_name"
                                value={user_name}
                                maxLength="20"
                                onChange={e => this.onChangeFormHandler(e.target.value, e.target.name)}
                            />
                            { error && <span className={classnames("form-text", error && "is-error")}>{ error }</span> }
                        </div>
                        <div className="columns col-6 text-right">
                            <span className="form-text">비회원 경우 별도로 본인이름을 입력하셔야 합니다.</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default User;
