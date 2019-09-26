import "./ArtistsChatPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import API from "forsnap-api";
import utils from "forsnap-utils";
import redirect from "forsnap-redirect";
import constant from "shared/constant";
import auth from "forsnap-authentication";

import FTextarea from "shared/components/ui/input/FTextarea";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, Footer, OverlayContainer } from "mobile/resources/containers/layout";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import { TocList, MessageList } from "shared/components/chat/chat";
import PopModal from "shared/components/modal/PopModal";
import PlusItem from "shared/components/chat/components/PlusItem";
import PopDownContent from "shared/components/popdown/PopDownContent";
import Addition from "shared/components/chat/addition/Addition";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";
import ContactRes from "shared/components/chat/contact/ContactRes";

class ArtistsChatPage extends Component {
    constructor() {
        super();

        const query = utils.query.parse(document.location.href);

        this.state = {
            talk: undefined,
            IFToc: undefined,
            IFMessage: undefined,
            isProcess: false,
            test: undefined,
            msg: "",
            keyword: "",
            userType: "A",
            userId: query.user_id,
            productNo: query.product_no,
            offerNo: query.offer_no,
            isPlus: false,
            guest_type: ""
        };

        this.onSearch = this.onSearch.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onPlus = this.onPlus.bind(this);
        this.onChangeMessage = this.onChangeMessage.bind(this);

        this.getTocInterface = this.getTocInterface.bind(this);
        this.getMessageInterface = this.getMessageInterface.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.closeMessage = this.closeMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.orderDisplay = this.orderDisplay.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.customOrder = this.customOrder.bind(this);

        this.getIsGuestUser = this.getIsGuestUser.bind(this);
        // contact
        this.onContactRes = this.onContactRes.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
    }

    componentWillMount() {
        if (window.history) {
            window.history.replaceState(null, null, document.location.pathname);
        }
        // window.addEventListener("resize", this.onResize, false);
    }

    componentDidMount() {
        // setTimeout(this.onResize, 350);

        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "작가대화하기" });
        }, 0);
    }

    componentWillUnmount() {
        // window.removeEventListener("resize", this.onResize, false);
    }

    /**
     * 대화목록 선택 CallBack
     * @param data
     */
    onSelect(data) {
        this.state.IFMessage.initData(data);
        this.setState({
            talk: data,
            test: data,
            msg: "",
            isPlus: false
        }, () => {
            if (data) {
                document.getElementsByTagName("html")[0].style.overflow = "hidden";
            } else {
                document.getElementsByTagName("html")[0].style.overflow = "auto";
            }
        });
    }

    /**
     * 대화목록 업데이트
     * @param data - Object
     */
    onUpdate(data) {
        this.setState({
            talk: data.talk,
            phone_send_block_dt: data.phone_send_block_dt
        }, () => {
            if (this.state.IFMessage) {
                this.state.IFMessage.readMessage(data);
            }
        });
    }

    /**
     * 대화목록 검색
     * @param e
     */
    onSearch(e) {
        const current = e.currentTarget;
        const keyword = current.value;

        this.setState({
            keyword
        }, () => {
            this.state.IFToc.onSearch(keyword);
        });
    }

    onResize() {
        const innerHeight = window.innerHeight;

        if (this.layout) {
            this.layout.style.height = `${innerHeight - 50}px`;
        }
    }

    onFocus() {
        const { IFMessage } = this.state;
        if (IFMessage) {
            const r = IFMessage.scrollCheck(false, false);
            setTimeout(() => {
                if (r.isScroll) {
                    const rs = IFMessage.scrollCheck(false, false);
                    IFMessage.moveScroll(rs.bottom);
                }
            }, 600);
        }

        this.setState({
            isPlus: false
        });
    }

    /**
     * 대화하기 기능 더보기
     */
    onPlus() {
        this.setState({
            isPlus: !this.state.isPlus
        });
    }

    onChangeMessage(e) {
        this.state.msg = e.currentTarget.value;
    }

    /**
     * 대화목록 컴포넌트 인터페이스
     * @param func
     */
    getTocInterface(func) {
        this.state.IFToc = func;
    }

    /**
     * 메세지 리스트 컴포넌트 인터페이스
     * @param func
     */
    getMessageInterface(func) {
        this.state.IFMessage = func;
    }

    gaEvent(obj, text) {
        const eCategory = "견적대화";
        const eAction = text;
        const eLabel = `요청서번호: ${obj.order_no} / 견적서번호: ${obj.offer_no}`;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
        // ga("Event.send", "event", {
        //     eventCategory: "견적대화",
        //     eventAction: `모바일 - ${text}`,
        //     eventLabel: `요청서번호: ${obj.order_no} / 견적서번호: ${obj.offer_no}`
        // });
    }

    closeMessage() {
        this.state.IFToc.deselectToc();
        this.state.IFMessage.initData();
        redirect.back();
    }

    sendMessage() {
        const { talk, isProcess, msg } = this.state;

        if (msg.replace(/\s/g, "") === "") {
            PopModal.toast("메세지를 입력해주세요.");
        } if (talk && !isProcess) {
            this.state.isProcess = true;
            this.state.IFMessage.sendMessage(msg).then(response => {
                this.state.isProcess = false;
                if (response.result) {
                    this.setState({
                        msg: "",
                        isPlus: false
                    });
                }
            }).catch(({ result, error }) => {
                this.state.isProcess = false;
                if (!(error instanceof Error)) {
                    PopModal.alert(error.data, { key: "chat_message_send" });
                } else {
                    PopModal.alert("네트워크 에러가 발생했습니다.\n잠시후 다시 시도해주세요.", { key: "message_send_error" });
                }
            });
        } else if (isProcess) {
            PopModal.toast("메세지를 보내는 중입니다.");
        }
    }

    orderDisplay(orderNo) {
        API.orders.updateOrderDisplay(orderNo, { display: "Y" }).then(response => {
            if (response.status === 200) {
                const { talk } = this.state;
                talk.order_display = "Y";

                PopModal.toast("요청서가 노출되었습니다.");
                this.setState({
                    talk
                });
            }
        }).catch(error => {
            if (error && error.data) {
                PopModal.alert(error.data);
            }
        });
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

        PopModal.createModal(modalName, <Addition modalName={modalName} data={data} />, { className: "modal-fullscreen", modal_close: false });
        PopModal.show(modalName);
    }

    getIsGuestUser() {
        this.setState({ guest_type: this.toc_list.getUserType() });
    }

    onContactRes(step) {
        const { talk, phone_send_block_dt } = this.state;
        const user = auth.getUser();
        if (user) {
            if (user.data && user.data.block_dt && step !== "PROGRESS") {
                PopModal.alert("작가님 사정에 의해 연락처 공유가 중지된 상태입니다.");
            } else if (phone_send_block_dt && step !== "PROGRESS") {
                PopModal.alert("진행상황 미등록, 부적절한 사유 등록 등의 이유로\n연락처 전달이 불가합니다.");
            } else {
                const title = step === "START" ? "연락처 전달" : "진행 상황";
                const group_key = `${talk.user_id}:${user.id}:${talk.product_no}`;
                // const group_key = `${talk.user_id}:${user.id}:${talk.product_no}${talk.group_type === "OFFER" ? ":offer" : ""}`
                const modal_name = "contact_res mobile";
                const content = <ContactRes title={title} device="mobile" receiveMessage={this.receiveMessage} group_key={group_key} reason={talk.reason ? talk.reason : ""} cur_step={step} onClose={() => PopModal.close(modal_name)} />;
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
        const { talk, msg, keyword, userType, userId, productNo, offerNo, isPlus, guest_type, test } = this.state;
        let talkTitle = "대화하기";
        const optionButtons = [];
        let rightButtons;
        const is_guest = guest_type === "guest";

        if (talk) {
            if (["HELP", "HELP_OFFER"].indexOf(talk.group_type) !== -1) {
                const seriveType = constant.NOTIFY.SERVICE_TYPE[talk.group_type];
                talkTitle = seriveType.name;
            } else {
                talkTitle = talk.title;
            }

            // 이미지 업로드 버튼
            optionButtons.push(
                <PlusItem key="option-button-image" text="파일업로드" bg_color="transparent" onClick={() => this.upload.click()}><icon className="m-icon m-icon-clip" /></PlusItem>
            );

            if (talk.group_type === "OFFER") {
                const buttons = [];

                if (talk.order_display === "Y") {
                    optionButtons.push(
                        <PlusItem
                            key="option-button-order"
                            text="요청서보기"
                            bg_color="transparent"
                            onClick={() => this.gaEvent(talk, "작가 - 요청서보기")}
                            onLink={`/artists/estimate/${talk.order_no}`}
                        >
                            <icon className="m-icon m-icon-list1" />
                        </PlusItem>
                    );
                    optionButtons.push(
                        <PlusItem
                            key="option-button-offer"
                            text="견적서보기"
                            bg_color="transparent"
                            onClick={() => this.gaEvent(talk, "작가 - 견적서보기")}
                            onLink={`/artists/estimate/${talk.order_no}/offer/${talk.offer_no}`}
                        >
                            <icon className="m-icon m-icon-list2" />
                        </PlusItem>
                    );
                } else if (talk.order_display === "N") {
                    rightButtons = (
                        <PopDownContent key="message-option-more" target={<button><icon className="m-icon m-icon-color-bars" /></button>} align="left">
                            <div className="option__more__buttons">
                                <span key="option-button-display" className="button button__rect button__theme__muted">요청서가 비노출중입니다</span>
                            </div>
                        </PopDownContent>
                    );
                }
            }

            if (talk.group_type !== "HELP") {
                optionButtons.push(
                    <PlusItem key="option-button-custom" text="맞춤&추가결제" bg_color="#transparent" onClick={this.customOrder}><icon className="m-icon m-icon-payment-custom" /></PlusItem>
                );
            }

            if (talk.group_type !== "HELP" && talk.group_type !== "OFFER") {
                if (test && test.send_progress_status && !test.send_progress_status) {
                    optionButtons.push(
                        <PlusItem key="contact-button-res" text="연락처 전달" bg_color="#transparent" onClick={() => this.onContactRes("START")}><icon className="m-icon m-icon-contact_res" /></PlusItem>
                    );
                }

                if (test && test.send_progress_status && test.send_progress_status !== "COMPLETE") {
                    optionButtons.push(
                        <PlusItem key="contact-button-progress" text="진행상황 등록" bg_color="#transparent" onClick={() => this.onContactRes("PROGRESS")}><icon className="m-icon m-icon-contact_progress" /></PlusItem>
                    );
                }
            }
        }

        return (
            <div className="mypage__chat" ref={ref => (this.layout = ref)}>
                <div className="mypage__chat__toc">
                    <div className="mypage__chat__toc__header">
                        <input type="text" className="f__input f__input__round" value={keyword} maxLength="25" placeholder="검색 내용을 입력해주세요" onChange={this.onSearch} />
                    </div>
                    <div className="mypage__chat__toc__body">
                        <div className="mypage__chat__toc__list">
                            <TocList
                                ref={instance => { this.toc_list = instance; }}
                                getIsGuestUser={this.getIsGuestUser}
                                userType={userType}
                                userId={userId}
                                productNo={productNo}
                                offerNo={offerNo}
                                interface={this.getTocInterface}
                                onSelect={this.onSelect}
                                onUpdate={this.onUpdate}
                            />
                        </div>
                        <Footer>
                            <ScrollTop />
                        </Footer>
                    </div>
                </div>
                <div className={classNames("mypage__chat__message", talk ? "show" : "")}>
                    <div className="site-sub-header">
                        <div className="site-sub-header-left" onClick={this.closeMessage}>
                            <icon className="m-icon m-icon-black-lt_b" />
                        </div>
                        {/*<div className="site-sub-header-center">*/}
                        {/*<span>{talkTitle}</span>*/}
                        {/*</div>*/}
                        <div
                            className="site-sub-header-center"
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}
                        >
                            <span
                                style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    wordWrap: "normal",
                                    textOverflow: "ellipsis",
                                    textAlign: "center",
                                    width: "100%"
                                }}
                            >{talkTitle}</span>
                            {talk && talk.group_type === "PRODUCT" &&
                            <span
                                style={{
                                    fontSize: 12,
                                    marginTop: 3
                                }}
                            >
                                <a href={`/products/${talk.product_no}`} target="_blank" style={{ color: "cornflowerblue", textDecoration: "underline" }}>상품바로가기</a>
                            </span>
                            }
                        </div>
                        <div className={classNames("site-sub-header-right", { order_disabled: talk && talk.order_display === "N" })}>
                            {rightButtons}
                        </div>
                    </div>
                    <MessageList
                        userType={userType}
                        interface={this.getMessageInterface}
                        onContactReg={() => this.onContactRes("PROGRESS")}
                        ref={instance => (this.messageList = instance)}
                    />
                    <input className="chat__upload__photo" type="file" multiple="multiple" accept="image/jpeg, image/png, image/bmp, application/pdf" onChange={this.uploadImage} ref={ref => (this.upload = ref)} />
                    <div className="mypage__chat__message__send">
                        <div className="message__input__box">
                            <div className={classNames("send__options", { show: isPlus }, { "disabled": is_guest })}>
                                <button className="button button__rect" disabled={is_guest && "disabled"} onClick={this.onPlus}>+</button>
                            </div>
                            <div className={classNames("message__input", { "disabled": is_guest })}>
                                <FTextarea
                                    value={msg}
                                    onChange={(e, value) => (this.state.msg = value)}
                                    inline={{
                                        disabled: is_guest && "disabled",
                                        className: classNames("textarea", { "disabled": is_guest }),
                                        rows: 2,
                                        placeholder: is_guest ? "비회원 결제 건으로 1:1대화가 불가능합니다." : constant.TEXT.DIRECT_PREVENT_ARTIST_MOBILE,
                                        onFocus: this.onFocus,
                                        ref: ref => (this.refMessageInput = ref)
                                    }}
                                />
                            </div>
                        </div>
                        <button className={classNames("send__button active", { "disabled": is_guest })} disabled={is_guest && "disabled"} onClick={this.sendMessage}>전송</button>
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
            </div>
        );
    }
}

ReactDOM.render(
    <AppContainer roles={["customer"]}>
        <div className="site-main">
            <LeftSidebarContainer />
            <HeaderContainer />
            <ArtistsChatPage />
            <OverlayContainer />
        </div>
    </AppContainer>,
    document.getElementById("root")
);
