import "./EstimateProcessPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import API from "forsnap-api";
import utils from "forsnap-utils";
import tracking from "forsnap-tracking";
import redirect from "mobile/resources/management/redirect";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer, Footer } from "mobile/resources/containers/layout";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import payment from "shared/components/payment/Payment";
import PopModal from "shared/components/modal/PopModal";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

class EstimateProcessPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            offerNo: document.getElementById("offer-no-data").content,
            orderNo: document.getElementById("order-no-data").content,
            result: utils.query.parse(document.location.href),
            method: payment.getPayMethod(),
            loading: true,
            data: null
        };
    }

    componentWillMount() {
        const { offerNo, orderNo, result } = this.state;

        if (!result.merchant_uid) {
            redirect.error();
        } else if (utils.stringToBoolen(result.imp_success)) {
            PopModal.progress();

            API.reservations.reserveToProductPay(result.merchant_uid, { pay_uid: result.imp_uid }).then(response => {
                PopModal.closeProgress();

                if (response.status === 200) {
                    const data = response.data;
                    tracking.conversion();
                    //window.fbq("track", "Purchase", { value: data.total_price, currency: "KRW" });

                    this.setState({
                        data,
                        loading: true
                    });
                }
            }).catch(error => {
                PopModal.closeProgress();
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
                if (orderNo && !isNaN(orderNo)) {
                    let url = "";
                    if (orderNo && !isNaN(orderNo)) {
                        url = `${orderNo}/offer/${offerNo}`;
                    } else {
                        url = `${orderNo}/offerlist`;
                    }

                    location.replace(`/users/estimate/${url}`);
                }
            } });
        } else {
            PopModal.alert("결제가 중단되었습니다.");
        }
    }

    componentDidMount() {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "결제완료" });
        }, 0);
    }

    render() {
        const { loading, result, data, method, orderNo } = this.state;

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

        if (data.pay_type === "vbank") {
            methodContent = utils.linebreak(`입금계좌 : ${data.vbank_name}\n계좌번호 : ${data.vbank_num}\n입금기한 : ${data.vbank_date}`);
        } else {
            const objMethod = method.find(m => {
                return m.value === data.pay_type;
            });

            if (objMethod) {
                methodContent = objMethod.name;
            }
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
                                결제하기
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
                                <h1 className="title">{`예약과 결제가 ${isSuccess ? "완료" : "취소"} 되었습니다.`}</h1>
                                <div className="caption">주문번호 : {utils.format.formatByNo(result.merchant_uid)}</div>
                                {!isSuccess ?
                                    <div className="message">{messages}</div>
                                    : null
                                }
                            </div>
                            {isSuccess && data ?
                                <div className="products__payment__info">
                                    <h1 className="info__title">예약정보</h1>
                                    <div className="info__text">
                                        <h4 className="title">옵션</h4>
                                        <div className="text">
                                            <span>{data.title}</span>
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
                                    : <a className="button button-block button__default" href={`/users/estimate/${orderNo}/offerlist`}>견적서리스트 보기</a>
                                }
                            </div>
                            <Footer>
                                <ScrollTop />
                            </Footer>
                        </div>
                    </div>
                    <OverlayContainer />
                </div>
            </AppContainer>
        );
    }
}

ReactDOM.render(<EstimateProcessPage />, document.getElementById("root"));
