import "./notifymenu.scss";
import React, { Component, PropTypes, createElement } from "react";
import classNames from "classnames";

import auth from "forsnap-authentication";
import constant from "shared/constant";
import mewtime from "forsnap-mewtime";

import Profile from "desktop/resources/components/image/Profile";
import Icon from "desktop/resources/components/icon/Icon";
import Buttons from "desktop/resources/components/button/Buttons";

class NotifyMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifyTypes: constant.NOTIFY.SERVICE_TYPE
        };

        this.getLinkURL = this.getLinkURL.bind(this);
    }

    componentWillMount() {
    }

    /**
     * 노티 클릭시 타입에 따른 이동 링크 가져오기
     * @param data
     * @returns {string}
     */
    getLinkURL(data) {
        const { userType } = this.props;
        const notifyTypes = this.state.notifyTypes;
        let isArtists = userType === "A";
        const user = auth.getUser();

        if (user && user.data && user.data.is_artist) {
            // const match = location.pathname.match(/(^\/users$)|(^\/users\/.*$)|(^\/users?.*$)/g);
            // if (!match || (!!match && match.length === 0)) {
            isArtists = true;
            // }
        }

        switch (data.noti_type) {
            case notifyTypes.TALK.value:
                return `${(isArtists ? "/artists/chat" : "/users/chat")}/${data.talk_user_id}/${data.product_no}`;
            case notifyTypes.OFFER_TALK.value:
                return isArtists ? "/artists/chat" : "/users/chat";
            case notifyTypes.HELP.value:
            case notifyTypes.BLOCK.value:
            case notifyTypes.BLOCK_CLEAR.value:
                return `${(isArtists ? "/artists/chat" : "/users/chat")}/${notifyTypes.HELP.value.toLowerCase()}`;
            case notifyTypes.OFFER.value:
                return `${(isArtists ? "/artists/chat" : "/users/chat")}/help_${notifyTypes.OFFER.value.toLowerCase()}`;
            case notifyTypes.COLLABO.value:
                return `${(isArtists ? "/artists/chat" : "/users/chat")}/${notifyTypes.COLLABO.value.toLowerCase()}`;
            default: {
                const notify = notifyTypes[data.noti_type];
                let url = "";
                if (notify) {
                    url = `${(isArtists ? "/artists/photograph/process" : "/users/progress")}/${notifyTypes[data.noti_type].reserve_type}`;
                }

                return url;
            }
        }
    }

    render() {
        const props = {};
        const data = this.props.data;
        const notifyTypes = this.state.notifyTypes;
        const isProcess = this.props.isProcess;
        const ulChild = [];

        if (isProcess) {
            ulChild.push(
                <li key="notifymenu-progress" className="toc-item loading-progress">
                    <img alt="loading-progress" src={__SERVER__.img + constant.PROGRESS.COLOR_CAT} />
                </li>
            );
        } else if (data.length > 0) {
            ulChild.push(data.map(obj => {
                let profile = "";
                let name = "";
                let notify = "";
                let message = "";

                const linkURL = this.getLinkURL(obj);

                if ([notifyTypes.TALK.value, notifyTypes.OFFER_TALK.value].indexOf(obj.noti_type) !== -1) {
                    profile = <Profile image={{ src: obj.profile_img }} size="medium" />;
                    name = <p className="toc-name">{obj.name}</p>;
                    message = <p className="toc-message">{obj.title}</p>;
                } else {
                    const notiData = notifyTypes[obj.noti_type];
                    if (notiData !== undefined) {
                        if ([notifyTypes.TALK.value].indexOf(obj.noti_type) !== -1) {
                            profile = <Icon name={notiData.icon} />;
                            name = <p className="toc-name">{notiData.name}</p>;
                            message = <p className="toc-message">{notiData.title}</p>;
                        } else if ([notifyTypes.HELP.value, notifyTypes.OFFER.value].indexOf(obj.noti_type) !== -1) {
                            profile = <Icon name={notiData.icon} />;
                            name = <p className="toc-name">{notiData.name}</p>;
                            message = <p className="toc-message">{notiData.title}</p>;
                        } else if ([notifyTypes.COLLABO.value].indexOf(obj.noti_type) !== -1) {
                            profile = <Icon name={notiData.icon} />;
                            const keys = obj.key.split(":");
                            name = <p className="toc-name">{notiData.name}</p>;
                            message = <p className="toc-message">{keys[0] ? keys[0] : ""}</p>;
                        } else {
                            profile = <Icon name={notiData.icon} />;
                            notify = <p className="toc-notify">{notiData.name}</p>;
                        }
                    }
                }

                const content = (
                    <div className="toc-item-content">
                        <div className="toc-thumb">
                            {profile}
                        </div>
                        <div className={classNames("toc-content", notify !== "" ? "notify" : "")}>
                            {name}
                            {message}
                            {notify}
                        </div>
                        <p className="toc-date">{mewtime(obj.reg_dt).format("YYYY.MM.DD")}</p>
                    </div>
                );

                const createLink = createElement("a", { href: linkURL }, content);

                return (
                    <li className="toc-item" key={obj.no}>
                        {createLink}
                    </li>
                );
            }));
        } else {
            ulChild.push(
                <li key="notify-empty" className="toc-item">
                    <div className="toc-item-content">
                        <div className="toc-content notify">
                            <p className="toc-notify text-center">새로운 알림이 없습니다.</p>
                        </div>
                    </div>
                </li>
            );
        }

        const optionContent = <Buttons buttonStyle={{ width: "block" }}>대화하기로 이동</Buttons>;
        let optionHref = "/users/chat";
        const user = auth.getUser();
        if (user && user.data && user.data.is_artist) {
            const match = location.pathname.match(/(^\/users$)|(^\/users\/.*$)|(^\/users?.*$)/g);
            if (!match || (!!match && match.length === 0)) {
                optionHref = "/artists/chat";
            }
        }

        const optionMenu = createElement("a", { key: "notify-option-link", href: optionHref }, optionContent);

        props.key = "notify-list";
        props.className = "toc-list notify";

        const ul = createElement("ul", props, ulChild);

        return createElement("div", { className: "text-center" }, [ul, optionMenu]);
    }
}

NotifyMenu.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    isProcess: PropTypes.bool,
    userType: PropTypes.string.isRequired
};

NotifyMenu.defaultProps = {
    data: [],
    isProcess: false
};

export default NotifyMenu;
