import "./popQuestion.scss";
import React, { Component, PropTypes } from "react";
import FTextarea from "shared/components/ui/input/FTextarea";
import Icon from "desktop/resources/components/icon/Icon";
import Img from "shared/components/image/Img";

export default class PopQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: "",
            data: props.data
        };
        this.onSendMessage = this.onSendMessage.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSendMessage() {
        const { msg } = this.state;
        if (typeof this.props.onSendMessage === "function") {
            this.props.onSendMessage(msg);
        }
    }

    onChange(value) {
        this.setState({ msg: value });
    }

    render() {
        const { data } = this.props;
        const { msg } = this.state;
        return (
            <div className="pop-question">
                <div className="pop-question__head">
                    <div className="forsnap-logo">
                        <Img image={{ src: "/common/f_logo_black.png", type: "image" }} />
                    </div>
                    <div className="close-button" onClick={() => this.props.onClose()}>
                        <Icon name="big_black_close" />
                    </div>
                </div>
                <div className="pop-question__content">
                    <p className="nick_name"><span className="yellow-text">[{data.artist_name}]</span>작가님에게 문의를 남겨주세요</p>
                    <div className="question__message">
                        <FTextarea
                            value={msg}
                            onChange={(e, value) => this.onChange(value)}
                            inline={{
                                rows: 6,
                                placeholder: "연락처, 이메일 등을 입력하시면 문의가 전달되지 않습니다."
                                //readOnly: !!data.message
                            }}
                        />
                    </div>
                </div>
                <div className="pop-question__button">
                    <button className="_button" onClick={this.onSendMessage}>확인</button>
                </div>
            </div>
        );
    }
}
