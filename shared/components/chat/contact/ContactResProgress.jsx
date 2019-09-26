import React, { Component, PropTypes } from "react";
import InfoBox from "./component/InfoBox";
import utils from "forsnap-utils";

export default class ContactResProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_step: props.cur_step,
            cur_info: props.cur_info,
            onChangeHandler: props.onChangeHandler,
            reason: props.reason,
            progress_content: props.progress_content
        };
    }

    componentWillMount() {
    }

    onInit() {
        return {
            progress_content: ""
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
        const { onChangeHandler, cur_info, reason, progress_content } = this.props;
        return (
            <div className="chat-contact-res__body__Reason-step">
                <div className="contact-row">
                    <p className="contact-row__title">접수 내용</p>
                    <div className="contact-row__content-box box-disabled">
                        {utils.linebreak(reason)}
                    </div>
                </div>
                <div className="contact-row">
                    <p className="contact-row__title"><span className="require-color">[필수]</span>진행상황 입력</p>
                    <div className="contact-row__content-box" style={{ padding: "15px 20px" }} ref={node => (this.content_box = node)}>
                        <div className="contact-textarea__wrap">
                            <textarea
                                className="contact-textarea"
                                value={progress_content}
                                rows="5"
                                maxLength={5000}
                                placeholder="진행상황을 입력해주세요.(30자이상)"
                                name="progress_content"
                                onChange={e => onChangeHandler(e.target.name, e.target.value)}
                                onFocus={e => this.onFocus(e, this.content_box)}
                                onBlur={e => this.onBlur(e, this.content_box)}
                            />
                        </div>
                        <div className="contact-row__content-box__valid-textarea">
                            <span style={{ color: progress_content.length < 30 && "#ec0909" }}>{progress_content.length}</span>/5000
                        </div>
                    </div>
                </div>
                <InfoBox info={cur_info} onChangeHandler={onChangeHandler} />
            </div>
        );
    }
}

ContactResProgress.propTypes = {
    cur_step: PropTypes.string.isRequired,
    cur_info: PropTypes.shape([PropTypes.node]),
    onChangeHandler: PropTypes.func.isRequired
};
