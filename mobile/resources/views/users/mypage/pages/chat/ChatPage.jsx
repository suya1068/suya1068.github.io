import "./ChatPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import auth from "forsnap-authentication";
import API from "forsnap-api";
import utils from "forsnap-utils";
import redirect from "forsnap-redirect";
import constant from "shared/constant";

import FTextarea from "shared/components/ui/input/FTextarea";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, Footer, OverlayContainer } from "mobile/resources/containers/layout";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import { TocList, MessageList } from "shared/components/chat/chat";
import PopModal from "shared/components/modal/PopModal";
import PlusItem from "shared/components/chat/components/PlusItem";
import PopDownContent from "shared/components/popdown/PopDownContent";
import Payment from "shared/components/payment/Payment";
import AdditionPaymentMobile from "shared/components/chat/components/AdditionPaymentMobile";
import PopupProductPayment from "mobile/resources/components/popup/PopupProductPayment";
import PopupPayment from "mobile/resources/components/popup/PopupPayment";
import ProductsPayment from "mobile/resources/views/products/package/components/ProductsPayment";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

class ChatPage extends Component {
    constructor() {
        super();

        const query = utils.query.parse(document.location.href);

        this.state = {
            talk: undefined,
            IFToc: undefined,
            IFMessage: undefined,
            isProgress: false,
            msg: "",
            keyword: "",
            userType: "U",
            userId: query.user_id,
            productNo: query.product_no,
            offerNo: query.offer_no,
            isPlus: false
        };

        this.onSearch = this.onSearch.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onPlus = this.onPlus.bind(this);
        this.onPayment = this.onPayment.bind(this);

        this.getMessageInterface = this.getMessageInterface.bind(this);
        this.getTocInterface = this.getTocInterface.bind(this);
        this.setProgress = this.setProgress.bind(this);

        this.closeMessage = this.closeMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.paymentOffer = this.paymentOffer.bind(this);
        this.paymentProduct = this.paymentProduct.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    componentWillMount() {
        if (window.history) {
            window.history.replaceState(null, null, document.location.pathname);
        }
        window.addEventListener("scroll", this.onScroll, false);
        // window.addEventListener("resize", this.onResize, false);
    }

    componentDidMount() {
        // setTimeout(this.onResize, 350);
        Payment.loadIMP();

        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "대화하기" });
        }, 0);

        const beltBanner = document.getElementById("belt_banner");
        const browserNotice = document.getElementById("browser_notice");
        if (beltBanner || browserNotice) {
            const chatToc = document.getElementsByClassName("mypage__chat__toc");
            const chatTocHeader = document.getElementsByClassName("mypage__chat__toc__header");
            chatToc[0].style.paddingTop = 0;
            chatTocHeader[0].style.position = "relative";
            chatTocHeader[0].style.top = 0;
        }
    }

    componentWillUnmount() {
        // window.removeEventListener("resize", this.onResize, false);
        window.removeEventListener("scroll", this.onScroll, false);
    }

    /**
     * 대화목록 선택 CallBack
     * @param data
     */
    onSelect(data) {
        this.state.IFMessage.initData(data);
        this.setState({
            talk: data,
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

    onScroll(e) {
        const beltBanner = document.getElementById("belt_banner");
        const browserNotice = document.getElementById("browser_notice");
        let beltBannerHeight = 0;
        let browserNoticeHeight = 0;
        if (beltBanner) {
            beltBannerHeight = 50;
        }
        if (browserNotice) {
            browserNoticeHeight = 70;
        }
        const scrollTop = typeof window.scrollY === "undefined" ? window.pageYOffset : window.scrollY;
        if (beltBanner || browserNotice) {
            const chatToc = document.getElementsByClassName("mypage__chat__toc")[0];
            const chatTocHeader = document.getElementsByClassName("mypage__chat__toc__header")[0];
            if (scrollTop && scrollTop > (beltBannerHeight + browserNoticeHeight) && chatTocHeader.style.position !== "fixed") {
                chatTocHeader.style.position = "fixed";
                chatToc.style.paddingTop = "50px";
                chatTocHeader.style.top = "50px";
            } else if (scrollTop && scrollTop < (beltBannerHeight + browserNoticeHeight) && chatTocHeader.style.position === "fixed") {
                chatTocHeader.style.position = "relative";
                chatTocHeader.style.top = 0;
                chatToc.style.paddingTop = 0;
            }
            if (scrollTop === 0) {
                chatTocHeader.style.position = "relative";
                chatTocHeader.style.top = 0;
                chatToc.style.paddingTop = 0;
            }
        } else if (!beltBanner && !browserNotice) {
            const chatToc = document.getElementsByClassName("mypage__chat__toc")[0];
            const chatTocHeader = document.getElementsByClassName("mypage__chat__toc__header")[0];

            if (chatTocHeader.style.position !== "fixed") {
                chatTocHeader.style.position = "fixed";
                chatToc.style.paddingTop = "50px";
                chatTocHeader.style.top = "50px";
            }
        }
    }


    /**
     * 대화목록 업데이트
     * @param data - Object
     */
    onUpdate(data) {
        this.setState({
            talk: data.talk
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

    /**
     * 리사이즈시 대화영역 다시 구하기
     */
    onResize() {
        const innerHeight = window.innerHeight;

        if (this.layout) {
            this.layout.style.height = `${innerHeight - 50}px`;
        }
    }

    /**
     * 메세지 입력 포커스시
     */
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

            utils.ad.gaEvent(`${text}결제`, `모바일 - ${text}결제하기`, `작가: ${talk.artist_id} | 유저: ${user.id} | 대화타입: ${talk.group_type}`);

            Payment.loadIMP(result => {
                this.setProgress(false);

                if (result) {
                    IMP.init(__IMP__);
                    const modalName = "addition_payment";
                    PopModal.createModal(modalName, <AdditionPaymentMobile data={obj} />, { className: "modal-fullscreen", modal_close: false });
                    PopModal.show(modalName);
                } else {
                    PopModal.alert("결제모듈을 가져오지 못했습니다.\n잠시 후 다시 시도해주세요.\n지속적인 오류시 고객센터로 문의해주세요.");
                }
            });
        }
    }

    /**
     * 대화목록 컴포넌트 인터페이스
     * @param func
     */
    getTocInterface(func) {
        this.state.IFToc = func;
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
     * 메세지 리스트 컴포넌트 인터페이스
     * @param func
     */
    getMessageInterface(func) {
        this.state.IFMessage = func;
    }

    /**
     * 대화방 닫기
     */
    closeMessage() {
        this.state.IFToc.deselectToc();
        this.state.IFMessage.initData();
        redirect.back();
    }

    /**
     * 메시지 전송
     */
    sendMessage() {
        const { talk, msg } = this.state;

        if (msg.replace(/\s/g, "") === "") {
            PopModal.toast("메세지를 입력해주세요.");
        } else if (talk && msg && !this.state.isProgress) {
            this.setProgress(true);
            this.state.IFMessage.sendMessage(msg).then(response => {
                this.setProgress(false);
                if (response.result) {
                    this.setState({
                        msg: "",
                        isPlus: false
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
     * 견적서 결제하기
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
                        <PopupPayment data={{ offer_no: talk.offer_no, order_no: talk.order_no, option: data.option, price: data.price, redirect_url: `${__DOMAIN__}/users/estimate/${talk.order_no}/offer/${talk.offer_no}/process` }} />,
                        { className: "modal-fullscreen", modal_close: false }
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

            utils.ad.gaEvent("대화하기", "모바일 - 상품 결제하기", `작가: ${talk.artist_id} | 유저: ${user.id} | 상품번호: ${talk.product_no}`);

            promise.push(API.users.find(user.id));
            promise.push(API.products.queryProductInfo(talk.product_no, {}));

            Promise.all(promise).then(response => {
                const u = response[0];
                const p = response[1];

                if (u && u.status === 200 && p && p.status === 200) {
                    const ud = u.data;
                    const pd = p.data;

                    const params = {
                        name: ud.name || "",
                        email: ud.email || "",
                        phone: ud.phone || "",
                        title: pd.title,
                        nick_name: pd.nick_name,
                        calendar: pd.calendar,
                        product_no: pd.product_no
                    };
                    const modalName = "mobile-products-payment";

                    if (utils.isArray(pd.package)) {
                        const { extra_option, custom_option } = pd;
                        let packageList = pd.package || [];
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

                        if (utils.isArray(packageList)) {
                            packageList = packageList.reduce((rs, pkg, i) => {
                                if (i === 0) {
                                    pkg.selected = true;
                                }

                                pkg.optionList = options.slice();
                                pkg.total_price = p.price;
                                rs.push(pkg);
                                return rs;
                            }, []);
                        }

                        params.packageList = packageList;
                        PopModal.createModal(modalName, <PopupProductPayment data={params} />, { className: "modal-fullscreen", modal_close: false });
                    } else {
                        params.options = pd.option;
                        PopModal.createModal(modalName, <ProductsPayment data={params} />, { className: "modal-fullscreen", modal_close: false });
                    }

                    PopModal.show(modalName);
                } else if (utils.errorFilter(p)) {
                    PopModal.alert(p.data, { key: "popup-payment-error" });
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

    gaEvent(obj, text) {
        const eCategory = "견적대화";
        const eAction = text;
        const eLabel = `요청서번호: ${obj.order_no} / 견적서번호: ${obj.offer_no}`;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    render() {
        const { talk, msg, keyword, userType, userId, productNo, offerNo, isPlus } = this.state;
        let talkTitle = "대화하기";
        const optionButtons = [];
        let rightButtons;

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
                if (talk.order_display === "Y") {
                    optionButtons.push(
                        <PlusItem
                            key="option-button-order"
                            text="요청서보기"
                            bg_color="transparent"
                            onClick={() => this.gaEvent(talk, "유저 - 요청서보기")}
                            onLink={`/users/estimate/${talk.order_no}/content`}
                        >
                            <icon className="m-icon m-icon-list1" />
                        </PlusItem>
                    );
                    optionButtons.push(
                        <PlusItem
                            key="option-button-offer"
                            text="견적서보기"
                            bg_color="transparent"
                            onClick={() => this.gaEvent(talk, "유저 - 견적서보기")}
                            onLink={`/users/estimate/${talk.order_no}/offer/${talk.offer_no}`}
                        >
                            <icon className="m-icon m-icon-list2" />
                        </PlusItem>
                    );

                    if (talk.is_pay === "N") {
                        rightButtons = (
                            <button key="option-button-pay" className="f__button f__button__round f__button__small f__button__theme__yellow" onClick={this.paymentOffer}>결제하기</button>
                        );
                    }
                }
            } else if (talk.group_type === "PRODUCT") {
                rightButtons = (
                    <button key="option-button-pay" className="f__button f__button__round f__button__small f__button__theme__yellow" onClick={this.paymentProduct}>결제하기</button>
                );
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
                            <TocList userType={userType} userId={userId} productNo={productNo} offerNo={offerNo} interface={this.getTocInterface} onSelect={this.onSelect} onUpdate={this.onUpdate} />
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
                        <div className={classNames("site-sub-header-right", { order_disabled: talk && talk.group_type === "OFFER" && talk.order_display === "N" })}>
                            {rightButtons}
                        </div>
                    </div>
                    <MessageList userType={userType} interface={this.getMessageInterface} onPayment={this.onPayment} />
                    <input className="chat__upload__photo" type="file" multiple="multiple" accept="image/jpeg, image/png, image/bmp, application/pdf" onChange={this.uploadImage} ref={ref => (this.upload = ref)} />
                    <div className="mypage__chat__message__send">
                        <div className="message__input__box">
                            <div className={classNames("send__options", { show: isPlus })}>
                                <button className="button button__rect" onClick={this.onPlus}>+</button>
                            </div>
                            <div className="message__input">
                                <FTextarea
                                    value={msg}
                                    onChange={(e, value) => (this.state.msg = value)}
                                    inline={{
                                        className: "textarea",
                                        rows: 2,
                                        placeholder: constant.TEXT.DIRECT_PREVENT_MOBILE,
                                        onFocus: this.onFocus,
                                        ref: ref => (this.refMessageInput = ref)
                                    }}
                                />
                            </div>
                        </div>
                        <button className={"send__button active"} onClick={this.sendMessage}>전송</button>
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
        <HeaderContainer />
        <div className="site-main">
            <LeftSidebarContainer />
            <ChatPage />
            <OverlayContainer />
        </div>
    </AppContainer>,
    document.getElementById("root")
);
