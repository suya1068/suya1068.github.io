import "./usersLeave.scss";
import React, { Component, PropTypes } from "react";
import LeaveContainer from "shared/components/leave/LeaveContainer";
import auth from "forsnap-authentication";

export default class UsersLeave extends Component {
    constructor(props) {
        super(props);
        document.title = "회원탈퇴 - 포스냅";
        this.state = {
            user: auth.getUser()
        };
    }

    componentWillMount() {
        const { user } = this.state;
        const isArtist = user.data.is_artist;
        this.setState({
            is_artist: isArtist
        });
    }
    
    render() {
        const { is_artist, user } = this.state;
        return (
            <div className="users-leave-page">
                <LeaveContainer view="desktop" is_artist={is_artist} user_id={user && user.id} />
            </div>
        );
    }
}
