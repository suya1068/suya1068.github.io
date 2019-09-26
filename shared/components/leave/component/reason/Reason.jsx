import "./reason.scss";
import React, { Component, PropTypes } from "react";

export default class Reason extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            size: 0
        };
    }

    /**
     * 입력문구를 저장한다.
     * @param value
     */
    onChangeFormHandler(value) {
        this.validateComment(value);
        this.setState(this.setComment(value));
    }

    /**
     * 입력받은 데이터의 유효성을 체크한다.
     * @param data
     * @returns {string}
     */
    validateComment(data) {
        if (!data) {
            const message = "탈퇴 이유를 입력해주세요";
            this.setErrorMessage(message);
            return message;
        }

        if (data.length < 5 || data.length > 500) {
            const message = "탈퇴 이유는 5자 이상 500자 이하로 입력해주세요.";
            this.setErrorMessage(message);
            return message;
        }

        this.setErrorMessage("");
        return "";
    }

    /**
     * 유효성 체크 결과를 리턴한다.
     * @returns {string}
     */
    validate() {
        const { comment } = this.state;
        return this.validateComment(comment);
    }

    /**
     * 입력문구 유효성 에러 시 에러문구를 저장한다.
     * @param message
     */
    setErrorMessage(message) {
        if (typeof message !== "string") {
            throw new TypeError("The message parameter must be a string type.");
        }
        this.setState({ error: message });
    }

    /**
     * 입력문구와 입력문구의 길이를 저장한다.
     * @param data
     * @returns {{comment: string, size: number}}
     */
    setComment(data) {
        if (typeof data !== "string") {
            throw new TypeError("The data must be a string type.");
        }
        return { comment: data, size: data.length };
    }

    render() {
        const { comment, size, error } = this.state;
        return (
            <div className="customer-leave-reason-component leave-reason">
                <div className="leave-reason__head">
                    <h3 className="leave-reason__head-heading"><span style={{ color: "#ff326c" }}>[필수]</span> 회원탈퇴하시려는 이유를 알려주세요.</h3>
                </div>
                <div className="leave-reason__content">
                    <textarea
                        className="leave-reason__content-textarea"
                        placeholder="회원탈퇴하시려는 이유를 알려주세요."
                        maxLength={500}
                        cols="30"
                        style={{ height: "150px" }}
                        value={comment}
                        onChange={e => this.onChangeFormHandler(e.target.value)}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                        <span className="form-text">{""}</span>
                        <span className="form-text"><span className={error && "is_error"}>{ size }</span>/500</span>
                    </div>
                </div>
            </div>
        );
    }
}
