import "./artistProfile.scss";
import React, { Component, PropTypes } from "react";
import { routerShape } from "react-router";
import classNames from "classnames";

import utils from "forsnap-utils";

import siteDispatcher from "desktop/resources/components/siteDispatcher";
import constant from "shared/constant";

import Profile from "desktop/resources/components/image/ProfileXHR";
import Icon from "desktop/resources/components/icon/Icon";

class ArtistsProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profileImage: "",
            nickName: "",
            dispatcherId: "",
            block_dt: ""
        };

        this.dispatcher = this.dispatcher.bind(this);
        this.goHome = this.goHome.bind(this);
        // this.onMoveAboutArtist = this.onMoveAboutArtist.bind(this);
    }

    componentWillMount() {
        const dispatcherId = siteDispatcher.register(this.dispatcher);

        this.state.dispatcherId = dispatcherId;

        window.addEventListener("scroll", this.onScroll, false);
    }

    componentDidMount() {
        const browserNotice = document.getElementById("browser_notice");

        if (browserNotice) {
            const artistContainerLeft = document.getElementsByClassName("artist-container-left")[0];
            if (artistContainerLeft) {
                artistContainerLeft.style.position = "absolute";
            }
        }
    }

    componentWillUnmount() {
        siteDispatcher.unregister(this.state.dispatcherId);
        window.removeEventListener("scroll", this.onScroll, false);
    }

    onScroll(e) {
        const browserNotice = document.getElementById("browser_notice");
        const scrollTop = typeof window.scrollY === "undefined" ? window.pageYOffset : window.scrollY;
        const artistContainerLeft = document.getElementsByClassName("artist-container-left")[0];

        if (browserNotice) {
            const browserNoticeHeight = 70;
            if (scrollTop && scrollTop > browserNoticeHeight && artistContainerLeft.style.position !== "fixed") {
                artistContainerLeft.style.position = "fixed";
            } else if (scrollTop && scrollTop < browserNoticeHeight && artistContainerLeft.style.position === "fixed") {
                artistContainerLeft.style.position = "absolute";
            }
        } else if (!browserNotice) {
            if (artistContainerLeft.style.position !== "fixed") {
                artistContainerLeft.style.position = "fixed";
            }
        }
    }

    // onMoveAboutArtist(nickName) {
    //     location.href = `/@${nickName}`;
    //     // location.href = `/artists/${this.state.user_id}/about`;
    // }

    // 작가 홈으로 이동
    goHome() {
        this.context.router.push("/artists");
        // browserHistory.push("/artists");
    }

    // 플럭스 이벤트 전파받는 함수
    dispatcher(obj) {
        if (obj.actionType === constant.DISPATCHER.HEADER_USER_UPDATE) {
            const userInfo = obj.userInfo;
            const prop = {};

            if (this.state.profileImage !== userInfo.profile_img) {
                if (userInfo.profile_img && userInfo.profile_img !== "") {
                    prop.profileImage = userInfo.profile_img;
                }
            }

            if (this.state.nickName !== userInfo.nick_name) {
                if (userInfo.nick_name && userInfo.nick_name !== "") {
                    prop.nickName = userInfo.nick_name;
                }
            }

            if (this.state.warning_title !== userInfo.warning_title) {
                prop.warning_title = userInfo.warning_title;
                prop.warning_content = userInfo.warning_content;
            }

            if (this.state.block_dt !== userInfo.block_dt) {
                prop.block_dt = userInfo.block_dt;
            }

            if (Object.keys(prop).length > 0) {
                this.setState(prop);
            }
        }
    }

    render() {
        const { warning_title, warning_content, block_dt, nickName } = this.state;
        let warning = null;

        if (block_dt) {
            warning = (
                <div className="alert-state">
                    <span>
                        <span>!</span>
                        계정블럭상태입니다.
                        <div className="alert-msg">
                            <div className="warning__popup" />
                            <span>
                                직거래를 유도하거나 사이트 운영방침에 어긋나는 행위 등으로 계정이 정지된 상태입니다. 예약 진행중인 건 외의 작가활동이 불가능합니다.
                            </span>
                        </div>
                    </span>
                </div>
            );
        } else if (warning_title) {
            warning = (
                <div className="alert-state">
                    <span>
                        <span>!</span>
                        {warning_title}
                        <div className="alert-msg">
                            <div className="warning__popup" />
                            <span>
                                {utils.linebreak(warning_content)}
                            </span>
                        </div>
                    </span>
                </div>
            );
        }

        return (
            <div className="artist-profile">
                <div
                    className="move-artist-about"
                    //onClick={() => this.onMoveAboutArtist(nickName)}
                >
                    <Profile image={{ src: this.state.profileImage }} size="large" />
                    <span className="artist-name">{this.state.nickName}</span>
                </div>
                {warning}
                <button className="artists-gohome" onClick={this.goHome}>
                    <Icon name="home" />
                </button>
            </div>
        );
    }
}

ArtistsProfile.contextTypes = {
    router: routerShape
};

export default ArtistsProfile;
