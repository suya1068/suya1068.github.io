import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import API from "forsnap-api";
import utils from "forsnap-utils";
import auth from "forsnap-authentication";
import constant from "shared/constant";


import PlusItem from "shared/components/chat/components/PlusItem";
import MessageList from "shared/components/chat/message/MessageList";
import PopModal from "shared/components/modal/PopModal";
import Addition from "shared/components/chat/addition/Addition";
import AdditionPayment from "shared/components/chat/components/AdditionPayment";
import Payment from "shared/components/payment/Payment";
import FTextarea from "shared/components/ui/input/FTextarea";

import MPopupPayment from "mobile/resources/components/popup/PopupPayment";
import PPopupPayment from "desktop/resources/components/pop/popup/PopupPayment";
import PopupProductPayment from "desktop/resources/components/pop/popup/PopupProductPayment";

import ContactRes from "shared/components/chat/contact/ContactRes";

import Profile from "../../image/Profile";
import Icon from "../../icon/Icon";
import Buttons from "../../button/Buttons";

class ChatMessageContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            talk: props.talk,
            user_type: props.user_type,
            guest_type: props.guest_type,
            phone_send_block_dt: props.phone_send_block_dt || "",
            msg: "",
            isPlus: false,
            isProgress: false,
            test: props.talk
        };

        this.onPlus = this.onPlus.bind(this);
        this.onPayment = this.onPayment.bind(this);
        this.setProgress = this.setProgress.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.paymentOffer = this.paymentOffer.bind(this);
        this.paymentProduct = this.paymentProduct.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.customOrder = this.customOrder.bind(this);
        this.getMessageInterface = this.getMessageInterface.bind(this);
        // contact
        this.onContactRes = this.onContactRes.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.talk) !== JSON.stringify(this.props.talk)) {
            const prop = {
                talk: nextProps.talk,
                test: nextProps.talk,
                isPlus: false
            };

            this.setState(prop);
        }
    }

    /**
     * 대화하기 기능 더보기
     */
    onPlus() {
        const { IFMessage } = this.state;
        if (IFMessage) {
            const scroll = IFMessage.scrollCheck();
            this.setState({
                isPlus: !this.state.isPlus
            }, () => {
                setTimeout(() => {
                    if (scroll.isScroll) {
                        const scroll2 = IFMessage.scrollCheck();
                        IFMessage.moveScroll(scroll2.bottom);
                    }
                }, 600);
            });
        }
    }

    /**
     * 대화하기 결제
     */
    onPayment(obj) {
        const user = auth.getUser();
        const { talk } = this.state;

        if (!this.state.isProgress && user) {
            this.setProgress(true);
            const text = obj.message_type === "RESERVE_CUSTOM" ? "맞춤" : "추가";

            utils.ad.gaEvent(`${text}결제`, `데스크탑 - ${text}결제하기`, `작가: ${talk.artist_id} | 유저: ${user.id} | 대화타입: ${talk.group_type}`);

            Payment.loadIMP(result => {
                this.setProgress(false);

                if (result) {
                    IMP.init(__IMP__);
                    const modalName = "addition_payment";
                    PopModal.createModal(modalName, <AdditionPayment data={obj} />);
                    PopModal.show(modalName);
                } else {
                    PopModal.alert("결제모듈을 가져오지 못했습니다.\n잠시 후 다시 시도해주세요.\n지속적인 오류시 고객센터로 문의해주세요.");
                }
            });
        }
    }

    setProgress(b) {
        this.state.isProgress = b;

        if (b) {
            PopModal.progress();
        } else {
            PopModal.closeProgress();
        }
    }

    /**
     * 메세지 보내기
     */
    sendMessage() {
        const { talk, msg } = this.state;

        if (talk && !this.state.isProgress) {
            this.setProgress(true);
            this.state.IFMessage.sendMessage(msg).then(response => {
                this.setProgress(false);
                if (response.result) {
                    this.setState({
                        msg: ""
                    }, () => {
                        this.refMessageInput.focus();
                    });
                }
            }).catch(({ result, error }) => {
                this.setProgress(false);
                if (!(error instanceof Error)) {
                    PopModal.alert(error.data, { key: "chat_message_send" });
                } else {
                    PopModal.alert("네트워크 에러가 발생했습니다.\n잠시후 다시 시도해주세요.", { key: "message_send_error" });
                }
            });
        } else if (this.state.isProgress) {
            PopModal.toast("메세지를 보내는 중입니다.");
        }
    }

    /**
     * 견적서 결제
     */
    paymentOffer() {
        const { talk } = this.state;
        this.gaEvent(talk, "견적서 결제하기");

        if (talk) {
            API.orders.getOfferDetail(talk.order_no, talk.offer_no).then(response => {
                if (response.status === 200) {
                    const data = response.data;
                    const modalName = "popup-payment";
                    PopModal.createModal(
                        modalName,
                        <MPopupPayment data={{ offer_no: talk.offer_no, order_no: talk.order_no, option: data.option, price: data.price, redirect_url: `${__DOMAIN__}/users/estimate/${talk.order_no}/offer/${talk.offer_no}/process` }} />,
                        { modal_close: false }
                    );
                    PopModal.show(modalName);
                }
            });
        }
    }

    /**
     * 상품 결제하기
     */
    paymentProduct() {
        const { talk } = this.state;
        const user = auth.getUser();

        if (talk && user) {
            const promise = [];

            utils.ad.gaEvent("대화하기", "데스크탑 - 상품 결제하기", `작가: ${talk.artist_id} | 유저: ${user.id} | 상품번호: ${talk.product_no}`);

            promise.push(API.users.find(user.id));
            promise.push(API.products.queryProductInfo(talk.product_no, {}));

            Promise.all(promise).then(response => {
                const uRs = response[0];
                const pRs = response[1];

                if (uRs && uRs.status === 200 && pRs && pRs.status === 200) {
                    const params = {};
                    const ud = uRs.data;
                    const pd = pRs.data;

                    params.name = ud.name || "";
                    params.email = ud.email || "";
                    params.phone = ud.phone || "";
                    params.title = pd.title;
                    params.nick_name = pd.nick_name;
                    params.events = pd.calendar;
                    params.product_no = pd.product_no;
                    params.category = pd.category;

                    const packageList = pd.package || [];

                    const modalName = "popup_payment";
                    if (utils.isArray(packageList)) {
                        const { extra_option, custom_option } = pd;
                        let options = [];

                        if (utils.isArray(extra_option)) {
                            const extraList = extra_option.reduce((rs, ex) => {
                                rs.push({
                                    ...ex,
                                    total_price: 0,
                                    count: 0
                                });

                                return rs;
                            }, []);

                            options = options.concat(extraList);
                        }

                        if (utils.isArray(custom_option)) {
                            const customList = custom_option.reduce((rs, c) => {
                                if (c.price && c.price !== 0) {
                                    rs.push({
                                        ...c,
                                        code: `custom-option-${c.custom_no}`,
                                        total_price: 0,
                                        count: 0
                                    });
                                }

                                return rs;
                            }, []);

                            options = options.concat(customList);
                        }

                        params.packageList = packageList.reduce((rs, p, i) => {
                            if (i === 0) {
                                p.selected = true;
                            }

                            p.optionList = options.slice();
                            p.total_price = p.price;
                            rs.push(p);
                            return rs;
                        }, []);

                        PopModal.createModal(modalName, <PopupProductPayment data={params} />);
                    } else {
                        params.options = pd.option;
                        PopModal.createModal(modalName, <PPopupPayment data={params} />);
                    }
                    PopModal.show(modalName);
                } else if (utils.errorFilter(pRs)) {
                    PopModal.alert(pRs.data, { key: "popup-payment-error" });
                } else {
                    PopModal.alert("결제 준비중 에러가 발생했습니다\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", { key: "popup-payment-error" });
                }
            }).catch(error => {
                if (utils.errorFilter(error)) {
                    PopModal.alert(error.data, { key: "popup-payment-error" });
                } else {
                    PopModal.alert("결제 준비중 에러가 발생했습니다\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", { key: "popup-payment-error" });
                }
            });
        }
    }

    uploadImage(e) {
        const { IFMessage } = this.state;
        const current = e.currentTarget;
        const files = current.files;

        if (IFMessage) {
            this.setState({
                isPlus: false
            }, () => {
                if (files) {
                    IFMessage.addFileList(files);
                }
                current.value = "";
            });
        }
    }

    customOrder() {
        const { talk } = this.state;
        const modalName = "custom_order";
        const data = {
            category: talk.category || "",
            reserve_list: talk.reserve_list,
            receive_id: talk.user_id,
            key: talk.product_no,
            group_type: talk.group_type
        };

        PopModal.createModal(modalName, <Addition modalName={modalName} data={data} />, { className: "", modal_close: false });
        PopModal.show(modalName);
    }

    getMessageInterface(func) {
        this.state.IFMessage = func;
        this.props.getMessageInterface(func);
    }

    gaEvent(obj, text) {
        const eCategory = "견적대화";
        const eAction = text;
        const eLabel = `요청서번호: ${obj.order_no} / 견적서번호: ${obj.offer_no}`;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    onContactRes(step) {
        const { talk } = this.state;
        const { phone_send_block_dt } = this.props;
        const user = auth.getUser();
        if (user) {
            if (user.data && user.data.block_dt && step !== "PROGRESS") {
                PopModal.alert("작가님 사정에 의해 연락처 공유가 중지된 상태입니다.");
            } else if (phone_send_block_dt && step !== "PROGRESS") {
                PopModal.alert("진행상황 미등록, 부적절한 사유 등록 등의 이유로 연락처 전달이 불가합니다.");
            } else {
                const title = step === "START" ? "연락처 전달" : "진행 상황";
                const group_key = `${talk.user_id}:${user.id}:${talk.product_no}`;
                // const group_key = `${talk.user_id}:${user.id}:${talk.product_no}${talk.group_type === "OFFER" ? ":offer" : ""}`
                const modal_name = "contact_res pc";
                const content = <ContactRes title={title} device="pc" receiveMessage={this.receiveMessage} group_key={group_key} reason={talk.reason ? talk.reason : ""} cur_step={step} onClose={() => PopModal.close(modal_name)} />;
                PopModal.createModal(modal_name, content, { className: modal_name, modal_close: false });
                PopModal.show(modal_name);
            }
        }
    }

    receiveMessage(item) {
        const { test } = this.state;
        test.send_progress_status = item.progress_status && item.progress_status;
        test.reason = item.reason;
        this.setState({ test }, () => {
            this.messageList.getMessages(0, 30);
        });
    }

    render() {
        const { talk, guest_type } = this.props;

        if (!talk) {
            return null;
        }

        const { user_type, isPlus, msg, test } = this.state;
        const user = auth.getUser();
        let profile;
        let name;
        let title;
        const optionButtons = [];
        const rightButtons = [];
        const is_guest = guest_type === "guest";

        // 대화방이 선택되어있을때
        if (talk) {
            // 대화방 타입에 따른 헤더 정보
            if (["HELP", "HELP_OFFER"].indexOf(talk.group_type) !== -1) {
                const seriveType = constant.NOTIFY.SERVICE_TYPE[talk.group_type];
                profile = <Icon name={seriveType.icon} />;
                name = seriveType.name;
                title = seriveType.title;
            } else {
                profile = <Profile image={{ src: talk.profile_img, content_width: 110, content_height: 110 }} size="medium" />;
                name = talk.nick_name;
                title = talk.title;
            }

            // 이미지 업로드 버튼
            optionButtons.push(
                <PlusItem key="option-button-image" text="파일업로드" bg_color="transparent" onClick={() => this.upload.click()}><Icon name="file_clip" /></PlusItem>
            );

            // 견적대화일때 추가 버튼
            if (talk.group_type === "OFFER") {
                if (user_type === "U" && talk.is_pay === "N") {
                    rightButtons.push(<Buttons key="option-button-pay" buttonStyle={{ size: "small", shape: "rect", theme: "yellow" }} inline={{ onClick: this.paymentOffer }}>결제하기</Buttons>);
                }
            } else if (talk.group_type === "PRODUCT") {
                if (user_type === "U") {
                    rightButtons.push(<Buttons key="option-button-pay" buttonStyle={{ size: "small", shape: "rect", theme: "yellow" }} inline={{ onClick: this.paymentProduct }}>결제하기</Buttons>);
                }
            }

            if (user_type === "A" && talk.group_type !== "HELP") {
                optionButtons.push(
                    <PlusItem key="option-button-custom" text="맞춤&추가결제" bg_color="#transparent" onClick={this.customOrder}><Icon name="payment_custom" /></PlusItem>
                );
            }

            if (user_type === "A" && talk.group_type !== "HELP" && talk.group_type !== "OFFER") {
                if (test && test.send_progress_status && !test.send_progress_status) {
                    optionButtons.push(
                        <PlusItem key="contact-button-res" text="연락처 전달" bg_color="#transparent" onClick={() => this.onContactRes("START")}><Icon name="contact_res" /></PlusItem>
                    );
                }

                if (test && test.send_progress_status && test.send_progress_status !== "COMPLETE") {
                    optionButtons.push(
                        <PlusItem key="contact-button-progress" text="진행상황 등록" bg_color="#transparent" onClick={() => this.onContactRes("PROGRESS")}><Icon name="contact_progress" /></PlusItem>
                    );
                }
            }
        }

        let placeholder = user_type === "U" ? constant.TEXT.DIRECT_PREVENT : constant.TEXT.DIRECT_PREVENT_ARTIST;

        if (is_guest && user_type === "A") {
            placeholder = "비회원 결제 건으로 1:1대화가 불가능합니다.";
        }

        return (
            <div>
                <div className="chat__page__message__header">
                    <div className="message__header__profile">
                        {profile}
                    </div>
                    <div className="message__header__info">
                        <div className="name">{name}</div>
                        <div className="title">{title}</div>
                        {talk.group_type === "PRODUCT" &&
                        <div style={{ fontSize: 14 }}>
                            <a role="button" style={{ color: "cornflowerblue", textDecoration: "underline" }} href={`/products/${talk.product_no}`} target="_blank">상품바로가기</a>
                        </div>
                        }
                    </div>
                    <div className="message__header__option">
                        <div key="option-more-buttons" className="option__more__buttons">
                            {rightButtons}
                        </div>
                    </div>
                </div>
                <MessageList
                    userType={user_type}
                    interface={this.getMessageInterface}
                    onPayment={this.onPayment}
                    onContactReg={() => this.onContactRes("PROGRESS")}
                    ref={instance => (this.messageList = instance)}
                />
                <input className="chat__upload__photo" type="file" multiple="multiple" accept="image/jpeg, image/png, image/bmp, application/pdf" onChange={this.uploadImage} ref={ref => (this.upload = ref)} />
                <div className="chat__page__message__box">
                    <div className="message__box__send">
                        <div className={classNames("send__options", { show: isPlus }, { "disabled": is_guest })}>
                            <button className="btn" disabled={is_guest && "disabled"} onClick={this.onPlus}>+</button>
                        </div>
                        <FTextarea
                            value={msg}
                            onChange={(e, value) => (this.state.msg = value)}
                            inline={{
                                disabled: is_guest && "disabled",
                                className: is_guest && "disabled",
                                rows: 3,
                                placeholder,
                                onFocus: () => { if (this.state.isPlus) this.setState({ isPlus: false }); },
                                ref: ref => (this.refMessageInput = ref)
                            }}
                        />
                        <div className={classNames("send__button", { "disabled": is_guest })}>
                            <button className="btn" disabled={is_guest && "disabled"} onClick={this.sendMessage}>보내기</button>
                        </div>
                    </div>
                    <div className="message__box__profile">
                        <Profile image={{ src: user.data.profile_img, content_width: 110, content_height: 110 }} size="medium" />
                    </div>
                </div>
                {optionButtons && Array.isArray(optionButtons) && optionButtons.length > 0 ?
                    <div className={classNames("chat__page__message__options", { show: isPlus })}>
                        <div className="options__group">
                            <div>
                                {optionButtons}
                            </div>
                        </div>
                    </div> : null
                }
            </div>
        );
    }
}

/*

 http://api.beta-forsnap.com/talks/undefined/messages

 receive_id: undefined
 key: undefined
 user_type: U
 group_type: HELP
 s3_key: s3_upload/20180608/20180608_talk_2a58cba4ff5c2ed_8ade9d3165a7.jpg
 file_name: DSC01705.jpg

 */

ChatMessageContainer.propTypes = {
    talk: PropTypes.shape([PropTypes.node]),
    user_type: PropTypes.string.isRequired,
    getMessageInterface: PropTypes.func.isRequired
};

export default ChatMessageContainer;
