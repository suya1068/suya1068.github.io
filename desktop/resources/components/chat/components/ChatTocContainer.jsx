import React, { Component, PropTypes } from "react";

import TocList from "shared/components/chat/toc/TocList";

class ChatTocContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_type: props.user_type,
            params: props.params
        };
        this.getIsGuestUser = this.getIsGuestUser.bind(this);
    }

    getIsGuestUser() {
        if (typeof this.props.getIsGuestUser === "function") {
            this.props.getIsGuestUser(this.toc_list.getUserType());
        }
    }

    render() {
        const { user_type, params, getTocInterface, onSelect, onUpdate } = this.props;
        return (
            <TocList
                ref={instance => { this.toc_list = instance; }}
                getIsGuestUser={this.getIsGuestUser}
                userType={user_type}
                interface={getTocInterface}
                onSelect={onSelect}
                onUpdate={onUpdate}
                userId={params.user_id}
                productNo={params.product_no}
                offerNo={params.offer_no}
            />
        );
    }
}

ChatTocContainer.propTypes = {
    user_type: PropTypes.string.isRequired,
    params: PropTypes.shape({
        user_id: PropTypes.string,
        product_no: PropTypes.string,
        offer_no: PropTypes.string
    }),
    getTocInterface: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired
};

export default ChatTocContainer;
