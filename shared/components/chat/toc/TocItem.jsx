import "../scss/toc_item.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import mewtime from "forsnap-mewtime";
import constant from "shared/constant";

import Icon from "desktop/resources/components/icon/Icon";
import Img from "shared/components/image/Img";

class TocItem extends Component {
    constructor() {
        super();

        this.state = {};

        this.onSelect = this.onSelect.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    onSelect() {
        const { data, IFToc } = this.props;

        if (IFToc && typeof IFToc.onSelect === "function") {
            IFToc.onSelect(data);
        }
    }

    onDelete(e) {
        const { data, IFToc } = this.props;

        e.stopPropagation();
        e.preventDefault();
        if (IFToc && typeof IFToc.onDelete === "function") {
            IFToc.onDelete(data);
        }
    }

    render() {
        const { data, active } = this.props;
        let profile;
        let name;
        let message;
        let notify;
        let talkDt;
        let unreadCnt = 0;

        if (data) {
            unreadCnt = data.unread_cnt;
            talkDt = data.talk_dt;
            // 네임 설정
            if (data.group_type !== "NOTIFY") {
                message = <p className="message">{data.title}</p>;
                name = <p className="name">{data.nick_name}</p>;
            } else {
                notify = <p className="notify">{data.title}</p>;
            }

            // 썸네일 설정
            if (data.group_type === "HELP") {
                const serviceType = constant.NOTIFY.SERVICE_TYPE.HELP;
                profile = <Icon name={serviceType.icon} />;
                message = <p className="message">{serviceType.title}</p>;
                name = <p className="name">{serviceType.name}</p>;
            } else if (data.group_type === "HELP_OFFER") {
                const serviceType = constant.NOTIFY.SERVICE_TYPE.HELP_OFFER;
                profile = <Icon name={serviceType.icon} />;
                message = <p className="message">{serviceType.title}</p>;
                name = <p className="name">{serviceType.name}</p>;
            } else {
                profile = <Img image={{ src: data.profile_img, content_width: 110, content_height: 110, default: constant.DEFAULT_IMAGES.PROFILE }} />;
            }
        }

        return (
            <div className={classNames("chat__toc__item", active ? "active" : "")} onClick={this.onSelect}>
                <div className="chat__toc__item__thumb">
                    <div className="profile">
                        {profile}
                    </div>
                    {unreadCnt > 0 ?
                        <span className="badge">{unreadCnt}</span>
                        : null
                    }
                </div>
                <div className="chat__toc__item__content">
                    {name}
                    {message}
                    {notify}
                </div>
                <div className="chat__toc__item__date">
                    <span className="date">{talkDt ? mewtime(talkDt).format("YYYY.MM.DD") : ""}</span>
                </div>
                {["HELP", "HELP_OFFER"].indexOf(data.group_type) === -1
                    ? <button className="chat__toc__item__delete" onClick={this.onDelete} /> : null
                }
            </div>
        );
    }
}

TocItem.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired,
    IFToc: PropTypes.shape([PropTypes.node]).isRequired,
    active: PropTypes.bool
};

export default TocItem;
