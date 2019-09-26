import React, { Component, PropTypes, createElement } from "react";
import classNames from "classnames";
import FileSaver from "file-saver";

import api from "forsnap-api";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";
import constant from "shared/constant";
import regular from "shared/constant/regular.const";

import SImg from "shared/components/image/Img";
import Img from "desktop/resources/components/image/Img";
import Icon from "desktop/resources/components/icon/Icon";

import AdditionItem from "../components/AdditionItem";
import PopModal from "shared/components/modal/PopModal";

const systemIcon = {
    MSG: "megaphone",
    PAYMENT: "price",
    OFFER_SUBMIT: "megaphone"
};

class MessageLines extends Component {
    constructor() {
        super();

        this.state = {
        };

        this.onDownload = this.onDownload.bind(this);
        this.onContactReg = this.onContactReg.bind(this);

        this.renderMessages = this.renderMessages.bind(this);
    }

    componentWillMount() {
    }

    onDownload(message_no, file_name) {
        const options = {
            responseType: "arraybuffer"
        };
        api.talks.downloadAttach(message_no, options)
            .then(response => {
                const blob = new Blob([response.data], { type: "application/pdf" });

                if (navigator.msSaveBlob) {
                    navigator.msSaveBlob(blob, file_name);
                } else {
                    FileSaver.saveAs(blob, file_name);
                    // const url = URL.createObjectURL(response.data);
                    // const a = document.createElement("a");
                    // a.href = url;
                    // a.download = file_name;
                    // a.click();
                    // URL.revokeObjectURL(url);
                }
            })
            .catch(error => {
                PopModal.alert(error.data || error);
            });
    }

    onContactReg() {
        if (typeof this.props.onContactReg === "function") {
            this.props.onContactReg();
        }
    }

    onShowImage(e, path) {
        e.preventDefault();
        const modalName = "chat__message__pop";
        PopModal.createModal(modalName, (
            <div className="chat_pop__show-modal" onLoad={this.onLoad}>
                <button className="_button _button__close white" onClick={() => PopModal.close(modalName)} />
                <div className="chat_pop__image">
                    <div className="thumb__img">
                        <img
                            src={`${__SERVER__.thumb}/signed/resize/1400x1000/${path}`}
                            role="presentation"
                        />
                    </div>
                </div>
            </div>
        ), { className: modalName, modal_close: false });
        PopModal.show(modalName);
    }

    /**
     * 일반 메세지 그리기
     * @return Array - (리엑트 엘리먼트 배열)
     */
    renderMessages() {
        const { messages, userType, groupType } = this.props;
        return messages.map((obj, i) => {
            const {
                content,
                message_no,
                message_type,
                answer_type,
                nick_name,
                artist_name,
                category_name,
                offer_no,
                order_no,
                phone,
                email,
                file_name,
                file_path,
                width,
                height
            } = obj;
            const props = {
                key: `message-line-${message_no}`,
                className: "message__line"
            };

            const children = [];

            if (message_type && message_type === "OFFER") {
                children.push(
                    <div className="link__question" key={`message-content-${message_no}`}>
                        <div className="link__question__title text-center">
                            <strong>견적문의</strong>
                        </div>
                        <div className="link__question__content">
                            <strong>{nick_name}</strong> 작가님의 <strong>{category_name}</strong> 카테고리 견적서에 대한 문의가 접수되었습니다!
                        </div>
                        <div className="link__question__content">
                            <span><strong>문의내용</strong></span>
                            <div>
                                {utils.linebreak(content)}
                            </div>
                        </div>
                        <div className="link__question__content">
                            {answer_type === "전화답변" ? "전화하기로" : "대화하기로"} {utils.linebreak("답변해드릴께요!\n조금만 기다려주세요.")}
                        </div>
                        <div className="link__question__button">
                            <button className="link__button block" onClick={() => (location.href = `/${userType === "A" ? "artists" : "users"}/estimate/${order_no}/offer/${offer_no}`)}>견적서 보기</button>
                        </div>
                    </div>
                );
            } else if (message_type && message_type === "ATTACH") {
                const ext = utils.fileExtension(file_name);
                switch (ext) {
                    case "jpg":
                    case "jpeg":
                    case "png":
                    case "bmp":
                        children.push(
                            <div className="attach__image" key={`message-image-${file_path}`} onClick={e => this.onShowImage(e, file_path, width, height)}>
                                <div className="attach__image__wrap" />
                                <Img image={{ src: `/${file_path}`, type: "private", content_width: 640, content_height: 640 }} isCrop={false} isContentResize={false} isScreenChange={false} />
                            </div>
                        );
                        break;
                    default:
                        children.push(
                            <div className="attach__file" key={`message-image-${file_path}`} onClick={() => this.onDownload(message_no, file_name)}>
                                <Icon name="clip" active="active" />
                                <div>{file_name}</div>
                            </div>
                        );
                        break;
                }
            } else if (message_type && message_type === "TEMP_UPLOAD") {
                children.push(
                    <div className="text" key={`message-content-${message_no}`}>
                        <div className="temp_upload">
                            <div className="progress">
                                <img alt="loading-progress" src={`${__SERVER__.img}${constant.PROGRESS.COLOR_CAT}`} />
                            </div>
                            <div className="progress__text">
                                {utils.linebreak(content)}
                            </div>
                        </div>
                    </div>
                );
            } else if (groupType.toLowerCase() === "help") {
                const regBr = /(<br \/>|<br\/>|\n|\\n)/g;
                const regEmail = new RegExp(regular.EMAIL, "gi");
                const regDomain = new RegExp(regular.DOMAIN, "gi");
                const text = content.split(regBr).map((line, idx1) => {
                    const b = line.match(regBr);
                    if (b) {
                        return React.createElement("br", { key: idx1 });
                    }

                    const m = line.match(regDomain);
                    if (m) {
                        let start = 0;
                        const msg = m.reduce((r, o, idx2) => {
                            if (o.match(regEmail)) {
                                const pos = line.indexOf(o, start === 0 ? start : start + 1) + o.length;
                                r.push(line.substring(start, pos));
                                start = pos;
                            } else {
                                let pos = line.indexOf(o, start === 0 ? start : start + 1);
                                r.push(line.substring(start, pos));
                                start = pos;
                                pos += o.length;
                                const str = line.substring(start, pos);
                                const http = str.startsWith("http");
                                r.push(createElement("a", { key: idx2, href: http ? str : `//${str}`, target: "_blank" }, str));
                                start = pos;
                            }
                            return r;
                        }, []);

                        if (line.length > start) {
                            msg.push(line.substring(start, line.length));
                        }

                        return msg;
                    }

                    return line;
                });

                children.push(
                    <div className="text" key={`message-content-${message_no}`}>
                        <span>{text}</span>
                    </div>
                );
            } else {
                children.push(
                    <div className="text" key={`message-content-${message_no}`}>
                        {utils.linebreak(content)}
                    </div>
                );
            }

            children.push(
                <div className="message__line__options" key={`message-options-${message_no}`}>
                    {obj.unreadCount ?
                        <div className="unread">
                            {obj.unreadCount}
                        </div>
                        : null
                    }
                    {messages.length - 1 === i ?
                        <div className="date">
                            {mewtime(obj.reg_dt).format("YYYY.MM.DD")}
                        </div>
                        : null
                    }
                </div>
            );

            return createElement("div", props, children);
        });
    }

    popPGReceipt(url) {
        const is_mobile = utils.agent.isMobile();
        const windowClone = window;
        const options = !is_mobile && "top=200, left=200, width=420, height=550";
        windowClone.name = "forsnap";
        windowClone.open(url, "_blank", options);
    }

    render() {
        const render = [];
        const { artist_nick_name, messages, userId, groupType, desc, userType, onPayment, onCustomPaymentCancel } = this.props;
        const message = messages[0];
        const {
            content,
            message_no,
            message_type,
            user_id,
            profile_img,
            nick_name,
            artist_name,
            category_name,
            product_no,
            offer_no,
            order_no,
            user_phone,
            user_email,
            artist_phone,
            artist_email,
            reg_dt,
            price,
            reserve_type,
            reserve_date,
            buy_no,
            status,
            pg_receipt
        } = message;
        let linesType = "";

        if (message_type === "OFFER_SUBMIT") {
            const icon = systemIcon[message_type] || systemIcon.MSG;
            linesType = "notify__lines";

            render.push(
                <div className="notify__icon" key={`messages-notify-icon-${message_no}`}>
                    <Icon name={icon} />
                </div>
            );

            render.push(
                <div className="notify__line" key={`messages-notify-${message_no}`}>
                    <div className="notify__content">
                        <div className="addition__item">
                            <div className="addition__item__content">
                                {`${category_name || ""}촬영의 견적서가 등록되었습니다.`}
                            </div>
                            <div className="addition__item__title text__content">
                                <p>
                                    <span className="title">▶&nbsp;작가명&nbsp;:&nbsp;</span><span className="content">{nick_name}</span>
                                </p>
                                <p>
                                    <span className="title">▶&nbsp;견적금액&nbsp;:&nbsp;</span><span className="content">{utils.format.price(price)}원</span>
                                </p>
                                <p>
                                    <span className="title">▶&nbsp;상세내용&nbsp;:&nbsp;</span><span className="content">{utils.linebreak(content)}</span>
                                </p>
                            </div>
                            <div className="addition__item__buttons">
                                <button className="link__button block" onClick={() => (location.href = `/${userType === "A" ? "artists" : "users"}/estimate/${order_no}/offer/${offer_no}`)}>
                                    견적서 및 포트폴리오 보러가기
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="notify__date">
                        {mewtime(reg_dt).format("YYYY.MM.DD A/P hh:mm") }
                    </div>
                </div>
            );
        } else if (message_type === "OFFER_PAY" || message_type === "PRODUCT_PAY") {
            const icon = systemIcon[message_type] || systemIcon.MSG;
            linesType = "notify__lines";

            render.push(
                <div className="notify__icon" key={`messages-notify-icon-${message_no}`}>
                    <Icon name={icon} />
                </div>
            );

            render.push(
                <div className="notify__line" key={`messages-notify-${message_no}`}>
                    <div className="link__question" key={`message-content-${message_no}`}>
                        <div className="link__question__title text-center">
                            <strong>예약완료</strong>
                        </div>
                        <div className="link__question__content">
                            <strong>{artist_name}</strong>작가님과 <strong>{category_name}</strong> 촬영예약이 완료되었습니다.
                        </div>
                        <div className="link__question__content">
                            작가님 연락처입니다.
                            <div>
                                <span><strong>연락처 : </strong>{artist_phone}</span>
                            </div>
                            <div>
                                <span><strong>이메일 : </strong>{artist_email}</span>
                            </div>
                        </div>
                        <div className="link__question__content">
                            고객님 연락처입니다.
                            <div>
                                <span><strong>연락처 : </strong>{user_phone}</span>
                            </div>
                            <div>
                                <span><strong>이메일 : </strong>{user_email}</span>
                            </div>
                        </div>
                        <div className="link__question__content">
                            좋은 촬영되세요!
                        </div>
                        {
                            pg_receipt && userType === "U" &&
                            <div className="link__question__button">
                                <button className="link__button block" onClick={() => this.popPGReceipt(pg_receipt)}>결제영수증 확인</button>
                            </div>
                        }
                        {message_type === "OFFER_PAY" ?
                            <div className="link__question__button">
                                <button className="link__button block" onClick={() => (location.href = `/${userType === "A" ? "artists" : "users"}/estimate/${order_no}/offer/${offer_no}`)}>견적서 보기</button>
                            </div>
                            : null
                        }
                    </div>
                    <div className="notify__date">
                        {mewtime(reg_dt).format("YYYY.MM.DD A/P hh:mm") }
                    </div>
                </div>
            );
        } else if (message_type === "LINK") {
            const icon = systemIcon[message_type] || systemIcon.MSG;
            linesType = "notify__lines";

            const obj = JSON.parse(content) || {};

            render.push(
                <div className="notify__icon" key={`messages-notify-icon-${message_no}`}>
                    <Icon name={icon} />
                </div>
            );

            render.push(
                <div className="notify__line" key={`messages-notify-${message_no}`}>
                    <div className="link__question" key={`message-content-${message_no}`}>
                        <div className="link__question__title text-center">
                            <strong>{obj.title || ""}</strong>
                        </div>
                        <div className="link__question__content">
                            {obj.content ? utils.linebreak(obj.content) : ""}
                        </div>
                        {obj.button && Array.isArray(obj.button) && obj.button.length > 0 ?
                            <div className="link__question__button">
                                {obj.button.map(b => {
                                    return (
                                        <a key={`link-button-${b.name}`} className="link__button text-center" href={b.link} target={b.target || "_self"}>{b.name}</a>
                                    );
                                })}
                            </div>
                            : null
                        }
                    </div>
                    <div className="notify__date">
                        {mewtime(reg_dt).format("YYYY.MM.DD A/P hh:mm") }
                    </div>
                </div>
            );
        } else if (message_type === "RESERVE_CUSTOM") {
            const icon = systemIcon.PAYMENT;
            linesType = "notify__lines";
            const isCancel = status ? status.toUpperCase() === "CANCEL" : false;

            render.push(
                <div className="notify__icon" key={`messages-notify-icon-${message_no}`}>
                    <Icon name={icon} />
                </div>
            );

            if (userType === "U") {
                render.push(
                    <div className="notify__line" key={`messages-notify-${message_no}`}>
                        <div className="notify__title">
                            맞춤결제가 요청되었습니다.
                        </div>
                        <div className="notify__content">
                            <AdditionItem data={{ content, message_type, price, message_no, product_no, reserve_type, reserve_date, buy_no, status }} onPayment={onPayment} />
                        </div>
                        <div className="notify__date">
                            {mewtime(reg_dt).format("YYYY.MM.DD A/P hh:mm") }
                        </div>
                    </div>
                );
            } else {
                render.push(
                    <div className="notify__line" key={`messages-notify-${message_no}`}>
                        <div className="notify__title">
                            {isCancel ? "맞춤결제가 취소됐습니다." : "맞춤결제를 요청했습니다."}
                        </div>
                        <div className="notify__content">
                            <div className="addition__item">
                                <div className="addition__item__content">
                                    {utils.linebreak(content)}
                                </div>
                                <div className="addition__item__title">
                                    <span className="title">맞춤결제금액</span>
                                    <span className="price">{utils.format.price(price)}원</span>
                                </div>
                                {!isCancel ?
                                    <div className="addition__item__buttons">
                                        <button className="payment" onClick={() => onCustomPaymentCancel(message_no)}>
                                            <span>취소하기</span>
                                        </button>
                                    </div> : null
                                }
                            </div>
                        </div>
                        <div className="notify__date">
                            {mewtime(reg_dt).format("YYYY.MM.DD A/P hh:mm") }
                        </div>
                    </div>
                );
            }
        } else if (message_type === "RESERVE_EXTRA") {
            const icon = systemIcon.PAYMENT;
            linesType = "notify__lines";

            render.push(
                <div className="notify__icon" key={`messages-notify-icon-${message_no}`}>
                    <Icon name={icon} />
                </div>
            );

            if (userType === "U") {
                render.push(
                    <div className="notify__line" key={`messages-notify-${message_no}`}>
                        <div className="notify__title">
                            추가결제가 요청되었습니다.
                        </div>
                        <div className="notify__content">
                            <AdditionItem data={{ content, message_type, price, message_no, product_no, reserve_type, reserve_date, buy_no }} onPayment={onPayment} />
                        </div>
                        <div className="notify__date">
                            {mewtime(reg_dt).format("YYYY.MM.DD A/P hh:mm") }
                        </div>
                    </div>
                );
            } else {
                render.push(
                    <div className="notify__line" key={`messages-notify-${message_no}`}>
                        <div className="notify__title">
                            추가결제를 요청했습니다.
                        </div>
                        <div className="notify__content caption">
                            {utils.linebreak(content)}
                        </div>
                        <div className="notify__content caption">
                            <span><strong>결제금액</strong>{utils.format.price(price)}원</span>
                        </div>
                        <div className="notify__date">
                            {mewtime(reg_dt).format("YYYY.MM.DD A/P hh:mm") }
                        </div>
                    </div>
                );
            }
        } else if (message_type === "PHONE_SEND") {
            const icon = systemIcon.MSG;
            linesType = "notify__lines";
            // const isCancel = status ? status.toUpperCase() === "CANCEL" : false;

            render.push(
                <div className="notify__icon" key={`messages-notify-icon-${message_no}`}>
                    <Icon name={icon} />
                </div>
            );

            if (userType === "U") {
                const is_block = !artist_phone;
                render.push(
                    <div className="notify__line" key={`messages-notify-${message_no}`}>
                        <div className="link__question" key={`message-content-${message_no}`}>
                            <div className="link__question__title text-center">
                                <strong>작가님 연락처 전달</strong>
                            </div>
                            {is_block ?
                                <div className="link__question__content">
                                    작가님 사정에 의해 연락처 공유가 중지된 상태입니다.
                                </div> :
                                <div>
                                    <div className="link__question__content">
                                        {artist_nick_name} 작가님과의 촬영협의를 위한 연락처 입니다.
                                    </div>
                                    <div className="link__question__content">
                                        작가님 연락처 : {artist_phone}
                                    </div>
                                    <div className="link__question__content" style={{ wordBreak: "keep-all" }}>
                                        {utils.linebreak("포스냅을 통하여 예약하시면 최종 이미지를 전달 받으실 때까지 안전하게 대금을 보관하실 수 있으며," +
                                            " 협의된 내용을 작가님과의 대화방을 통해 남겨놓으시면 촬영 시 더욱 만족스러운 결과물을 받아 보실 수 있습니다.\n\n" +
                                            "포스냅 서비스는 작가님과 고객님 모두 중개수수료가 0%이니, 수수료에 대한 걱정 없이 포스냅을 통한 예약을 진행해 주세요.")}
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="notify__date">
                            {mewtime(reg_dt).format("YYYY.MM.DD A/P hh:mm") }
                        </div>
                    </div>
                );
            } else {
                const progress_status = this.props.messages && this.props.messages[0] && this.props.messages[0].progress_status;
                render.push(
                    <div className="notify__line" key={`messages-notify-${message_no}`}>
                        <div className="link__question" key={`message-content-${message_no}`}>
                            <div className="link__question__title text-center">
                                <strong>연락처 전달 완료</strong>
                            </div>
                            <div className="link__question__content" style={{ wordBreak: "keep-all" }}>
                                {utils.linebreak(`고객님에게 연락처가 전달되었습니다.\n${mewtime(reg_dt).add(3).format("YYYY년MM월DD일")}까지 진행상황을 등록해주세요.`)}
                            </div>
                            {progress_status !== "COMPLETE" &&
                                <div className="link__question__button">
                                    <button
                                        className="link__button block"
                                        onClick={this.onContactReg}
                                    >진행상황 등록</button>
                                </div>
                            }
                        </div>
                        <div className="notify__date">
                            {mewtime(reg_dt).format("YYYY.MM.DD A/P hh:mm") }
                        </div>
                    </div>
                );
            }
        } else if (user_id === "SYSTEM" || message_type === "PAYMENT") {
            const icon = systemIcon[message_type] || systemIcon.MSG;
            linesType = "notify__lines";

            render.push(
                <div className="notify__icon" key={`messages-notify-icon-${message_no}`}>
                    <Icon name={icon} />
                </div>
            );

            render.push(
                <div className="notify__line" key={`messages-notify-${message_no}`}>
                    <div className="notify__title">
                        {utils.linebreak(content)}
                    </div>
                    <div className="notify__date">
                        {mewtime(reg_dt).format("YYYY.MM.DD A/P hh:mm")}
                    </div>
                </div>
            );
        } else {
            let name;
            let profile;

            if (user_id === userId) {
                linesType = "my__lines";
            } else {
                if (groupType.toLowerCase() === "help") {
                    const serviceType = constant.NOTIFY.SERVICE_TYPE.HELP;
                    name = serviceType.name;
                    profile = <Icon name={serviceType.icon} />;
                } else if (groupType.toLowerCase() === "help_offer") {
                    const serviceType = constant.NOTIFY.SERVICE_TYPE.HELP_OFFER;
                    name = serviceType.talk_name;
                    profile = <Icon name={serviceType.icon} />;
                } else {
                    name = nick_name;
                    profile = <SImg image={{ src: profile_img, content_width: 110, content_height: 110, default: constant.DEFAULT_IMAGES.PROFILE }} />;
                }

                render.push(
                    <div className="message__lines__thumb" key={`messages-thumb-${message_no}`}>
                        <div className="thumb">
                            {profile}
                        </div>
                    </div>
                );
            }

            render.push(
                <div className={classNames("message__lines")} key={`message-lines-${message_no}`}>
                    {name ? <div>{name}</div> : null}
                    {this.renderMessages()}
                </div>
            );
        }

        return (
            <div className={classNames("chat__message__lines", linesType, desc ? "desc" : "asc")}>
                {render}
            </div>
        );
    }
}

MessageLines.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    userId: PropTypes.string.isRequired,
    groupType: PropTypes.string.isRequired,
    desc: PropTypes.bool.isRequired,
    userType: PropTypes.oneOf(["U", "A"]).isRequired,
    onPayment: PropTypes.func,
    onCustomPaymentCancel: PropTypes.func
};

export default MessageLines;
