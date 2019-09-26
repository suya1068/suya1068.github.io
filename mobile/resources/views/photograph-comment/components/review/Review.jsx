import classnames from "classnames";
import React, { Component, PropTypes } from "react";

class Review extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comment: "",
            size: 0,
            error: ""
        };

        this.onChangeFormHandler = this.onChangeFormHandler.bind(this);
        this.setComment = this.setComment.bind(this);
        this.setErrorMessage = this.setErrorMessage.bind(this);
        this.createParameters = this.createParameters.bind(this);
        this.validate = this.validate.bind(this);
        this.validateComment = this.validateComment.bind(this);
        this.focus = this.focus.bind(this);
    }

    /**
     * 폼 핸들러
     * @private
     * @param value
     */
    onChangeFormHandler(value) {
        this.validateComment(value);
        this.setState(this.setComment(value));
    }

    /**
     * 리뷰 데이터와 길이를 셋한다.
     * @param {string} data - 데이터
     * @returns {function(*): {comment: *, size}}
     */
    setComment(data) {
        if (typeof data !== "string") {
            throw new TypeError("The data must be a string type.");
        }
        return state => ({ comment: data, size: data.length });
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
     * @returns {{comment: string}}
     */
    createParameters() {
        return { comment: this.state.comment };
    }

    /**
     * 유효한 데이터인지 판단한다.
     * @public
     * @returns {string}
     */
    validate() {
        const { comment } = this.state;
        return this.validateComment(comment);
    }

    /**
     * 리뷰 데이터가 유효한지 판단한다
     * @private
     * @param {string} data
     * @returns {*}
     */
    validateComment(data) {
        if (!data) {
            const message = "리뷰를 입력해주세요.";
            this.setErrorMessage(message);
            return message;
        }

        if (data.length < 50 || data.length > 1000) {
            const message = "50자 이상 1000자 이하로 입력해주세요.";
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
        const { comment, size, error } = this.state;

        return (
            <section className="photograph-comment-card">
                <div className="photograph-comment-card__header">
                    <h5 className="photograph-comment-card-title is-require">
                        <span className="photograph-comment-badge is-require">[필수]</span>작가에 대한 리뷰를 작성해주세요.
                    </h5>
                    <span className="form-text">{ size }/1000</span>
                </div>
                <div className="photograph-comment-card__body">
                    <textarea
                        ref={node => { this.element = node; }}
                        className={classnames("form-control", error && "is-error")}
                        value={comment}
                        cols="30"
                        rows="18"
                        maxLength={1000}
                        onChange={e => this.onChangeFormHandler(e.target.value, e.target.name)}
                    />
                    { error && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                            <span className="form-text is-error">{ error }</span>
                        </div>
                    ) }
                </div>
            </section>
        );
    }
}

export default Review;
