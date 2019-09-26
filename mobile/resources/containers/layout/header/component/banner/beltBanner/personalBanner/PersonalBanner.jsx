import "./personalBanner.scss";
import React, { Component } from "react";
import Img from "shared/components/image/Img";
import utils from "forsnap-utils";
import PopModal from "shared/components/modal/PopModal";
import PopupSendChat from "mobile/resources/components/popup/PopupSendChat";
import UserCheck from "shared/helper/UserCheck";

export default class PersonalBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productData: {},
            height: "476px"
        };
        this.UserCheck = new UserCheck();
        this.onClose = this.onClose.bind(this);
        this.onChat = this.onChat.bind(this);
        this.gaEvent_inflow_display = this.gaEvent_inflow_display.bind(this);
        this.onOrient = this.onOrient.bind(this);
    }

    componentWillMount() {
        this.setProductData();
        window.addEventListener("orientationchange", this.onOrient);
    }

    componentDidMount() {
        this.onCheckUser();
        this.gaEvent_inflow_display();
        if (!window.matchMedia("(orientation: portrait)").matches) {
            this.banner.height = "auto";
            this.state.height = "auto";
        }
    }

    componentWillUnmount() {
        window.removeEventListener("orientationchange", this.onOrient);
    }

    onOrient(e) {
        const current_orient = e.currentTarget.matchMedia("(orientation: portrait)").matches;

        let height = "";

        if (current_orient) {
            height = "auto";
        } else {
            height = "476px";
        }

        this.setState({ height });
    }

    /**
     * 배너 창을 닫는다.
     * @param e
     */
    onClose(e) {
        if (typeof this.props.onClose === "function") {
            this.props.onClose();
        }
    }

    /**
     * 유저 정보를 가져온다.
     */
    onCheckUser() {
        const checkUser = this.UserCheck.checkUser();
        let data = {};
        if (checkUser) {
            checkUser.then(response => {
                if (response.status === 200) {
                    data = response.data;
                    this.checkUser(data);
                }
            });
        } else {
            this.checkUser(data);
        }
    }

    /**
     * 상품정보를 저장한다.
     */
    setProductData() {
        const responseData = document.getElementById("product-data");
        let data = {};
        if (responseData) {
            const getAtt = responseData.getAttribute("content");
            data = JSON.parse(getAtt).data;
            this.state.productData = data;
        }
    }

    /**
     * 유저 정보 체크
     */
    checkUser(data) {
        this.setState({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || ""
        });
    }

    /**
     * N쇼핑 유입 노출 시 gaEvent
     */
    gaEvent_inflow_display() {
        const { productData } = this.state;
        const eCategory = "N쇼핑배너";
        const eAction = "개인노출 | 배너";
        const eLabel = `${productData.category_name || ""} - ${productData.product_no}`;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    /**
     * N쇼핑 배너 버튼 클릭 시 gaEvent
     * @param data
     */
    gaEvent_inflow_click(data) {
        const eCategory = "N쇼핑배너";
        const eAction = "개인클릭 | 1:1대화";
        const eLabel = `${data.category_name || ""} - ${data.product_no}`;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    /**
     * 대화하기
     */
    onChat() {
        const { phone, productData } = this.state;
        const user = this.UserCheck.isLogin();
        this.gaEvent_inflow_click(productData);

        if (user) {
            if (user.id === productData.user_id) {
                PopModal.alert("자기 자신에게 메시지를 보낼수 없습니다.");
            } else {
                const modalName = "popup_send_chat";
                const options = {
                    className: modalName,
                    callBack: () => {
                        this.onCheckUser();
                    }
                };

                const params = {
                    no: productData.product_no,
                    title: productData.title,
                    user_id: productData.user_id,
                    profile_img: productData.profile_img,
                    nick_name: productData.nick_name
                };

                PopModal.createModal(modalName, <PopupSendChat data={params} isPhone={!!phone} />, options);
                PopModal.show(modalName);
            }
        }
    }

    render() {
        const { height } = this.state;
        return (
            <div className="personal-banner-component">
                <div className="personal-banner">
                    <div className="personal-banner__bgImage" style={{ height }} ref={node => { this.banner = node; }}>
                        {/*<Img image={{ src: "/banner/personal/img-banner-bg_m.jpg", type: "image" }} isCrop />*/}
                        <img src={`${__SERVER__.img}/banner/personal/img-banner-bg_m.jpg`} role="presentation" alt="쇼핑배너배경" />
                    </div>
                    <div className="personal-banner__inner-content">
                        <div className="flex-box">
                            <div className="personal-banner__title-box">
                                <h4 className="personal-banner__title">
                                    <span>촬영과 관련된 궁금한점을</span><br />
                                    작가님께 직접 문의해보세요.
                                </h4>
                                <button className="p-button p-button__round chat-button" onClick={this.onChat}>작가님과 1:1대화</button>
                            </div>
                            <div className="personal-banner__info-box">
                                <p className="nick_name">by 유현재</p>
                                <div className="personal-banner__info-box-item">
                                    <div className="icon-side">
                                        <i className="m-icon m-icon__join__tt" />
                                    </div>
                                    <div className="text-side">
                                        <p className="text-side__title">1초 회원가입</p>
                                        <p className="text-side__desc">카카오톡, 네이버, 페이스북 계정으로 편리한 가입</p>
                                    </div>
                                </div>
                                <div className="personal-banner__info-box-item">
                                    <div className="icon-side">
                                        <i className="m-icon m-icon__lock__tt" />
                                    </div>
                                    <div className="text-side">
                                        <p className="text-side__title">안전한 거래 시스템</p>
                                        <p className="text-side__desc">촬영대금은 최종완료까지 포스냅이 보관</p>
                                    </div>
                                </div>
                            </div>
                            <div className="close-button" onClick={this.onClose}>
                                <Img image={{ src: "/banner/btn-close.png", type: "image" }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
