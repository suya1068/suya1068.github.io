import "./chatbox.scss";
import React, { Component, PropTypes } from "react";

import ChatTocContainer from "./components/ChatTocContainer";
import ChatMessageContainer from "./components/ChatMessageContainer";

class ChatBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            params: props.params,
            userType: props.userType,
            IFToc: undefined,
            IFMessage: undefined,
            user_type_guest: ""
        };

        this.onSelect = this.onSelect.bind(this);
        this.onUpdate = this.onUpdate.bind(this);

        this.getTocInterface = this.getTocInterface.bind(this);
        this.getMessageInterface = this.getMessageInterface.bind(this);
        this.getIsGuestUser = this.getIsGuestUser.bind(this);
    }

    /**
     * 대화목록 선택 CallBack
     * @param data
     */
    onSelect(data) {
        this.setState({
            talk: data
        }, () => {
            if (this.state.IFMessage) {
                this.state.IFMessage.initData(data);
            }
        });
    }

    /**
     * 대화목록 업데이트
     * @param data - Object
     */
    onUpdate(data) {
        if (this.state.IFMessage) {
            this.state.IFMessage.readMessage(data);
        }

        this.setState({
            phone_send_block_dt: data.phone_send_block_dt
        });
    }

    /**
     * 대화목록 컴포넌트 인터페이스
     * @param func
     */
    getTocInterface(func) {
        this.state.IFToc = func;
    }

    /**
     * 메세지 리스트 컴포넌트 인터페이스
     * @param func
     */
    getMessageInterface(func) {
        this.state.IFMessage = func;
    }

    getIsGuestUser(type) {
        this.setState({ user_type_guest: type });
    }

    render() {
        const { userType, params, talk, user_type_guest, phone_send_block_dt } = this.state;

        return (
            <div className="chat__page">
                <div className="chat__page__toc">
                    <ChatTocContainer
                        ref={instance => { this.toc_container = instance; }}
                        getIsGuestUser={this.getIsGuestUser}
                        user_type={userType}
                        params={params}
                        getTocInterface={this.getTocInterface}
                        onSelect={this.onSelect}
                        onUpdate={this.onUpdate}
                    />
                </div>
                <div className="chat__page__message">
                    <ChatMessageContainer
                        talk={talk}
                        user_type={userType}
                        guest_type={user_type_guest}
                        phone_send_block_dt={phone_send_block_dt}
                        getMessageInterface={this.getMessageInterface}
                    />
                </div>
            </div>
        );
    }
}

ChatBox.propTypes = {
    userType: PropTypes.oneOf(["U", "A"]).isRequired,
    params: PropTypes.shape([PropTypes.node])
};

ChatBox.defaultProps = {
    params: undefined
};

export default ChatBox;
