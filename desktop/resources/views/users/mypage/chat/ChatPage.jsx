import "./userChat.scss";
import React, { Component, PropTypes } from "react";

import ChatBox from "desktop/resources/components/chat/ChatBox";

class ChatPage extends Component {
    render() {
        const { params } = this.props;

        return (
            <div className="users-chat">
                <ChatBox userType="U" params={params} />
            </div>
        );
    }
}

ChatPage.propTypes = {
    params: PropTypes.shape([PropTypes.node])
};


export default ChatPage;
