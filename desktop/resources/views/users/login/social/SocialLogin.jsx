import React, { Component, PropTypes } from "react";

class SocialLogin extends Component {
    constructor(props) {
        super(props);

        this.className = {
            naver: "sns-naver-btn",
            facebook: "sns-facebook-btn",
            kakao: "sns-kakaotalk-btn"
        }[props.type];
        this.login = this.login.bind(this);
    }

    login(event) {
        event.preventDefault();
        this.props.click(this.props.type.toUpperCase());
    }

    render() {
        return (
            <div>
                <a href="" className={this.className} onClick={event => this.login(event)}>
                    <span>{this.props.children}</span>
                </a>
            </div>
        );
    }
}

SocialLogin.propTypes = {
    type: PropTypes.string.isRequired,
    click: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

export default SocialLogin;
