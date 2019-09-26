import "./PaymentProcessPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import API from "forsnap-api";
import utils from "forsnap-utils";
import tracking from "forsnap-tracking";
import redirect from "mobile/resources/management/redirect";
import mewtime from "forsnap-mewtime";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer, Footer } from "mobile/resources/containers/layout";
import Payment from "shared/components/payment/Payment";
import PopModal from "shared/components/modal/PopModal";
import Scrolltop from "mobile/resources/components/scroll/ScrollTop";

class PaymentProcessPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            result: utils.query.parse(document.location.href),
            method: Payment.getPayMethod(),
            loading: true,
            data: null,
            isProgress: false
        };

        this.setProgress = this.setProgress.bind(this);
    }

    componentWillMount() {
        const { result } = this.state;

        if (!result.merchant_uid) {
            redirect.error();
        } else if (utils.stringToBoolen(result.imp_success)) {
            this.setProgress(true);

            API.reservations.reservePayment(result.merchant_uid, { pay_uid: result.imp_uid })
                .then(response => {
                    this.setProgress(false);

                    if (response.status === 200) {
                        const data = response.data;
                        tracking.conversion();
                        // purchase 이벤트 : 구매완료하거나 결제 플로우가 완료되었을 경우
                        // window.fbq("track", "Purchase", { value: data.total_price, currency: "KRW" });
                        //utils.ad.fbqEvent("Purchase", { value: data.total_price, currency: "KRW" });

                        this.setState({
                            data,
                            loading: true
                        });
                    }
                })
                .catch(error => {
                    this.setProgress(false);
                    PopModal.alert(error.data, { callBack: () => {
                        // location.replace(`${__DESKTOP__}/users/progress`);
                    } });
                });
        } else if (result && result.error_msg) {
            let messages;
            try {
                messages = result.error_msg.replace(/[+]+/gi, " ").split(" | ")[1];
            } catch (error) {
                messages = "결제가 취소되었습니다";
            }

            PopModal.alert(messages, { callBack: () => {
                location.replace("/");
            } });
        } else {
            PopModal.alert("결제가 중단되었습니다.");
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

    render() {
        const { loading, result, data, method, offerNo, orderNo } = this.state;

        if (!loading || !data) {
            return null;
        }

        const isSuccess = !!result.imp_success;
        let messages;
        try {
            messages = result.error_msg.replace(/[+]+/gi, " ").split(" | ")[1];
        } catch (error) {
            messages = "결제가 취소되었습니다";
        }

        let methodContent = "";

        const objMethod = method.find(m => {
            return m.value === data.pay_type;
        });

        if (data.pay_type === "vbank") {
            methodContent = utils.linebreak(`${objMethod.name}\n입금계좌 : ${data.vbank_name}\n계좌번호 : ${data.vbank_num}\n입금기한 : ${data.vbank_date}`);
        } else {
            methodContent = objMethod.name;
        }

        return (
            <AppContainer>
                <div>
                    <HeaderContainer />
                    <LeftSidebarContainer />
                    <div className="products__payment process">
                        <div className="products__payment__header">
                            <div className="payment__header__left" />
                            <div className="payment__header__center">
                                {isSuccess ? "주문완료" : "결제실패"}
                            </div>
                            <div className="payment__header__right" />
                        </div>
                        <div className="products__payment__breadcrumb">
                            <div className="payment__breadcrumb__process">
                                {data.option_name}
                            </div>
                            <div className="payment__breadcrumb__bar">
                                &gt;
                            </div>
                            <div className="payment__breadcrumb__complete active">
                                주문완료
                            </div>
                        </div>
                        <div className="products__payment__content">
                            <div className="products__payment__status">
                                <h1 className="title">{`${data.option_name}가 ${isSuccess ? "완료" : "취소"} 되었습니다.`}</h1>
                                <div className="caption">주문번호 : {utils.format.formatByNo(result.merchant_uid)}</div>
                                {!isSuccess ?
                                    <div className="message">{messages}</div>
                                    : null
                                }
                            </div>
                            {isSuccess && data ?
                                <div className="products__payment__info">
                                    <h1 className="info__title">예약정보</h1>
                                    {data.option_name === "맞춤결제" ?
                                        <div className="info__text">
                                            <h4 className="title">촬영날짜</h4>
                                            <div className="text">
                                                <span>{mewtime(data.reserve_dt).format("YYYY년 MM월 DD일")}</span>
                                            </div>
                                        </div> : null
                                    }
                                    <div className="info__text">
                                        <h4 className="title">옵션</h4>
                                        <div className="text">
                                            <span>{data.title}</span>
                                        </div>
                                    </div>
                                    <div className="info__text">
                                        <h4 className="title">설명</h4>
                                        <div className="text">
                                            <span>{data.option_content}</span>
                                        </div>
                                    </div>
                                    <div className="info__text">
                                        <h4 className="title">결제방법</h4>
                                        <div className="text">
                                            <span>
                                                {methodContent}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="info__text">
                                        <h4 className="title">최종 결제금액</h4>
                                        <div className="text"><span className="price">{utils.format.price(data.total_price)}</span><span>원</span></div>
                                    </div>
                                </div>
                                : null
                            }
                            <div className="products__payment__button">
                                <a className="button button-block button__default" href="/">메인페이지가기</a>
                                {isSuccess && data ?
                                    <a className="button button-block button__theme__dark" href={`/users/progress/${data.pay_type === "vbank" ? "ready" : "payment"}`} target="_blank">예약확인하기</a>
                                    : <a className="button button-block button__default" href="/users/chat">대화하기</a>
                                }
                            </div>
                            <Footer>
                                <Scrolltop />
                            </Footer>
                        </div>
                    </div>
                    <OverlayContainer />
                </div>
            </AppContainer>
        );
    }
}

ReactDOM.render(<PaymentProcessPage />, document.getElementById("root"));
