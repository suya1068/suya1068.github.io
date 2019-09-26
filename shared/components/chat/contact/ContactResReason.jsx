import React, { Component, PropTypes } from "react";
import InfoBox from "./component/InfoBox";

export default class ContactResReason extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_step: props.cur_step,
            cur_info: props.cur_info,
            onChangeHandler: props.onChangeHandler,
            is_agree: props.is_agree,
            reason: props.reason,
            // artist data
            phone: props.phone,
            nick_name: props.nick_name
        };
    }

    componentWillMount() {
    }

    onInit() {
        return {
            is_agree: false,
            reason: ""
        };
    }

    onBlur(e, target) {
        if (target) {
            target.style.borderColor = "#e1e1e1";
        }
    }

    onFocus(e, target) {
        if (target) {
            target.style.borderColor = "#000";
        }
    }

    render() {
        const { is_agree, onChangeHandler, cur_info, reason, phone, nick_name } = this.props;
        return (
            <div className="chat-contact-res__body__Reason-step">
                <div className="contact-row">
                    <p className="contact-row__title">전달할 연락처</p>
                    <div className="contact-row__content-box box-disabled">
                        <p className="row-name">작가명<span className="row-content">{nick_name}</span></p>
                        <p className="row-name">연락처<span className="row-content">{phone}</span></p>
                    </div>
                </div>
                <div className="contact-row">
                    <p className="contact-row__title"><span className="require-color">[필수]</span>연락처 전달 사유</p>
                    <div className="contact-row__content-box" style={{ padding: "15px 20px" }} ref={node => (this.content_box = node)}>
                        <div className="contact-textarea__wrap">
                            <textarea
                                className="contact-textarea"
                                value={reason}
                                rows="5"
                                maxLength={5000}
                                placeholder="정확한 연락처 전달 사유를 입력해주세요.(30자이상)"
                                name="reason"
                                onChange={e => onChangeHandler(e.target.name, e.target.value)}
                                onFocus={e => this.onFocus(e, this.content_box)}
                                onBlur={e => this.onBlur(e, this.content_box)}
                            />
                        </div>
                        <div className="contact-row__content-box__valid-textarea">
                            <span style={{ color: reason.length < 30 && "#ec0909" }}>{reason.length}</span>/5000
                        </div>
                    </div>
                </div>
                <InfoBox info={cur_info} is_agree={is_agree} onChangeHandler={onChangeHandler} />
            </div>
        );
    }
}

ContactResReason.propTypes = {
    cur_step: PropTypes.string.isRequired,
    cur_info: PropTypes.shape([PropTypes.node]),
    onChangeHandler: PropTypes.func.isRequired,
    is_agree: PropTypes.bool.isRequired
};
