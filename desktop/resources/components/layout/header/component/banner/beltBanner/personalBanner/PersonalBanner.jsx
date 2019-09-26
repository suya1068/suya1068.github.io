import "./personalBanner.scss";
import React, { Component } from "react";
import Img from "shared/components/image/Img";
import utils from "forsnap-utils";
import PopModal from "shared/components/modal/PopModal";
import ProductsQuestion from "desktop/resources/views/products/detail/components/ProductsQuestion";
import UserCheck from "shared/helper/UserCheck";

export default class PersonalBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productData: {},
            name: "",
            email: "",
            phone: "",
            is_load: false
        };
        this.UserCheck = new UserCheck();
        this.onClose = this.onClose.bind(this);
        this.onChat = this.onChat.bind(this);
        this.onCheckUser = this.onCheckUser.bind(this);
        this.checkUser = this.checkUser.bind(this);
        this.gaEvent_inflow_display = this.gaEvent_inflow_display.bind(this);
    }

    componentWillMount() {
        this.setProductData();
    }

    componentDidMount() {
        // this.onCheckUser();
        this.gaEvent_inflow_display();
    }

    /**
     * 유저정보를 불러온다.
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
        if (responseData) {
            const getAtt = responseData.getAttribute("content");
            this.state.productData = JSON.parse(getAtt).data;
        }
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
     * 배너 창을 닫는다.
     * @param e
     */
    onClose(e) {
        if (typeof this.props.onClose === "function") {
            this.props.onClose();
        }
    }

    /**
     * 대화하기
     */
    onChat() {
        const { phone, is_load, productData } = this.state;
        const user = this.UserCheck.isLogin();
        this.gaEvent_inflow_click(productData);

        if (user) {
            const { user_id, product_no, nick_name, profile_img } = this.state.productData;
            let data = {};

            if (!is_load) {
                const checkUser = this.UserCheck.checkUser();
                checkUser.then(response => {
                    if (response.status === 200) {
                        data = response.data;
                        this.setState({
                            name: data.name || "",
                            email: data.email || "",
                            phone: data.phone || "",
                            is_load: true
                        }, () => {
                            if (user.id === user_id) {
                                PopModal.alert("자기 자신에게 메시지를 보낼 수 없습니다.");
                            } else {
                                const modalName = "popup-products-question";
                                PopModal.createModal(modalName, <ProductsQuestion data={{ user_id, product_no, phone: data.phone, nick_name, profile_img }} />, { callBack: phone ? null : () => this.onCheckUser() });
                                PopModal.show(modalName);
                            }
                        });
                    }
                });
            }

            if (is_load) {
                if (user.id === user_id) {
                    PopModal.alert("자기 자신에게 메시지를 보낼 수 없습니다.");
                } else {
                    const modalName = "popup-products-question";
                    PopModal.createModal(modalName, <ProductsQuestion data={{ user_id, product_no, phone, nick_name, profile_img }} />, { callBack: phone ? null : () => this.onCheckUser() });
                    PopModal.show(modalName);
                }
            }
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

    render() {
        return (
            <div className="personal-banner-component">
                <div className="personal-banner">
                    <div className="personal-banner__bgImage">
                        <Img image={{ src: "/banner/personal/img-banner-bg.jpg", type: "image" }} />
                    </div>
                    <div className="personal-banner__inner-content">
                        <div className="container">
                            <div className="flex-box">
                                <h4 className="personal-banner__title">
                                    <span>포스냅은 언제 어디서든</span><br />
                                    모든 촬영이 가능합니다.
                                </h4>
                                <button className="p-button chat-button" onClick={this.onChat}>작가님과 1:1대화</button>
                                <div className="personal-banner__info-box">
                                    <p className="nick_name">by 유현재</p>
                                    <div className="personal-banner__info-box-item">
                                        <div className="icon-side">
                                            <i className="_icon__join__tt" />
                                        </div>
                                        <div className="text-side">
                                            <p className="text-side__title">편리한 회원가입</p>
                                            <p className="text-side__desc">카카오톡, 네이버, 페이스북 계정으로 모든 서비스 이용이 가능합니다.</p>
                                        </div>
                                    </div>
                                    <div className="personal-banner__info-box-item">
                                        <div className="icon-side">
                                            <i className="_icon__lock__tt" />
                                        </div>
                                        <div className="text-side">
                                            <p className="text-side__title">안전한 거래 시스템</p>
                                            <p className="text-side__desc">사진이 최종 전달될때까지 촬영대금을 포스냅에서 안전하게 보관합니다.</p>
                                        </div>
                                    </div>
                                    <div className="personal-banner__info-box-item">
                                        <div className="icon-side">
                                            <i className="_icon__talk__tt" />
                                        </div>
                                        <div className="text-side">
                                            <p className="text-side__title">작가님과 1:1대화</p>
                                            <p className="text-side__desc">촬영과 관련된 궁금한점을 작가님께 직접 문의해보세요.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="close-button" onClick={this.onClose}>
                                    <Img image={{ src: "/banner/20180322/close_btn.png", type: "image" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
