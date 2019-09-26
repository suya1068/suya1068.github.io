import React, { Component, PropTypes } from "react";

import FSN from "forsnap";
import API from "forsnap-api";
import auth from "forsnap-authentication";

import Icon from "desktop/resources/components/icon/Icon";
import Buttons from "desktop/resources/components/button/Buttons";
import PopModal from "shared/components/modal/PopModal";


class SocialSync extends Component {
    constructor(props) {
        super(props);

        this.state = this.getCompositeData();

        this.snsSync = this.snsSync.bind(this);
        this.snsSyncSuccess = this.snsSyncSuccess.bind(this);
        this.snsSyncFail = this.snsSyncFail.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sync !== this.state.sync) {
            this.setState({
                sync: nextProps.sync
            });
        }
    }

    /**
     * 초기 state 데이터를 가져온다.
     * @returns {*}
     */
    getCompositeData() {
        const defaultButton = { style: { size: "small", width: "w135", shape: "circle", theme: "gray" } };

        const types = {
            naver: {
                icon: { displayName: "네이버", name: "naver" },
                button: defaultButton
            },
            facebook: {
                icon: { displayName: "페이스북", name: "facebook_c" },
                button: defaultButton
            },
            kakao: {
                icon: { displayName: "카카오톡", name: "kakao" },
                button: defaultButton
            }
        };

        const { icon, button } = types[this.props.type];

        return {
            sync: this.props.sync,
            icon: this.props.icon ? Object.assign(icon, this.props.icon) : icon,
            button: this.props.button ? Object.assign(button, this.props.button) : button
        };
    }

    /**
     * SNS 연동 성공시 호출되는 메서드
     * @param result
     */
    snsSyncSuccess(result) {
        const data = Object.assign(result.data, { user_id: auth.getUser().id });
        const deferred = !this.state.sync ? API.auth.addSnsSync(data) : API.auth.removeSnsSync(data);

        deferred.then(response => {
            const sync = !this.state.sync;
            this.setState({ sync });
            this.props.click({ data: response.data, message: sync ? "연동되었습니다." : "연동해제되었습니다.", type: this.props.type });
        })
        .catch(response => {
            // console.log(response);
            this.snsSyncFail(response);
        });
    }

    /**
     * SNS 연동 실패시 호출되는 메서드
     * @param result
     */
    snsSyncFail(result) {
        PopModal.alert(result.data);
    }

    /**
     * SNS 연동한다.
     */
    snsSync() {
        if (this.props.join_type !== "email" && this.props.count === 1 && this.state.sync) {
            this.props.click({ data: null, message: "두개이상 SNS연동시 해제 가능합니다." });
        } else {
            const social = FSN.sns.create(FSN.sns.constant[this.props.type.toUpperCase()], { context: this, success: this.snsSyncSuccess, fail: this.snsSyncFail });
            social.login();
        }
    }

    render() {
        const { button, icon } = this.state;

        button.style.isActive = this.state.sync;

        return (
            <div>
                <Icon name={icon.name}>{icon.displayName}</Icon>
                <Buttons buttonStyle={button.style} inline={{ onClick: () => this.snsSync() }}>{ this.state.sync ? "해제하기" : "연동하기"}</Buttons>
            </div>
        );
    }
}

SocialSync.propTypes = {
    type: PropTypes.string.isRequired,
    icon: PropTypes.shape({
        displayName: PropTypes.string,
        name: PropTypes.string
    }),
    button: PropTypes.shape({
        displayName: PropTypes.string,
        style: PropTypes.shape({
            size: PropTypes.string,
            width: PropTypes.string,
            shape: PropTypes.string,
            theme: PropTypes.string
        })
    }),
    sync: PropTypes.bool,
    click: PropTypes.func.isRequired,
    count: PropTypes.number,
    join_type: PropTypes.string
};

SocialSync.defaultProps = {
    icon: null,
    button: null,
    sync: false
};

export default SocialSync;
