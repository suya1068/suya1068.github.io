import "./package/scss/products_payment.scss";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import API from "forsnap-api";
import utils from "forsnap-utils";
import redirect from "forsnap-redirect";
import tracking from "forsnap-tracking";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer } from "mobile/resources/containers/layout";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import ProductsProcess from "./process/ProductsProcess";
import PopModal from "shared/components/modal/PopModal";

class ProductsProcessPage extends Component {
    constructor() {
        super();

        this.state = {
            productNo: document.getElementById("product-data").content,
            result: utils.query.parse(document.location.href),
            data: undefined,
            loading: false
        };

        this.apiReserveToProductPay = this.apiReserveToProductPay.bind(this);
    }

    componentWillMount() {
        const { productNo, result } = this.state;

        if (!result.merchant_uid) {
            redirect.error();
        } else if (utils.stringToBoolen(result.imp_success)) {
            PopModal.progress();
            this.apiReserveToProductPay(result.merchant_uid, this.state.productNo, result.imp_uid).then(response => {
                PopModal.closeProgress();
                if (response.status === 200) {
                    const data = response.data;
                    tracking.conversion();
                    //window.fbq("track", "Purchase", { value: data.total_price, currency: "KRW" });
                    // this.wcsEvent(data.total_price);
                    //utils.ad.wcsEvent("1", data.total_price);
                    // this.improvedGaForPurchase(response.data);
                    this.setState({
                        data,
                        loading: true
                    });
                }
            }).catch(error => {
                PopModal.closeProgress();
                PopModal.alert(error.data, { callBack: () => {
                    location.replace("/users/progress");
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
                if (productNo && !isNaN(productNo)) {
                    location.replace(`/products/${productNo}`);
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

    /**
     * 향상된 ga 이벤트 For 결제완료
     * @param data
     */
    improvedGaForPurchase(data) {
        window.dataLayer.splice(0, window.dataLayer.length);
        //상품 결제 완료시
        window.dataLayer.push({
            "event": "payment",
            "ecommerce": {
                "purchase": {
                    "actionField": {
                        "id": data.buy_no,
                        "affiliation": "Online Store",
                        "revenue": data.total_price,
                        "tax": "",
                        "shipping": "0",
                        "step": "payment"
                    },
                    "products": [{
                        "name": data.title,
                        "id": data.product_no,
                        "price": data.total_price,
                        "brand": `${data.artist_id}-${data.nick_name || ""}`,
                        "category": data.category || ""
                    }]
                }
            }
        });
        // console.log("결제완료", window.dataLayer);
    }

    apiReserveToProductPay(no, product_no, pay_uid) {
        return API.reservations.reserveToProductPay(no, { product_no, pay_uid });
    }

    // wcsEvent(price) {
    //     if (wcs && wcs.cnv && wcs_do) {
    //         const _nasa = {};
    //         _nasa["cnv"] = wcs.cnv("1", `${price}`);
    //         wcs_do(_nasa);
    //     }
    // }

    render() {
        const { loading, data, result, productNo } = this.state;

        if (!loading) {
            return null;
        }

        return (
            <AppContainer>
                <div className="site-main">
                    <HeaderContainer />
                    <LeftSidebarContainer />
                    <ProductsProcess product_no={productNo} result={result} data={data} />
                    <OverlayContainer />
                </div>
            </AppContainer>
        );
    }
}

ReactDOM.render(
    <ProductsProcessPage />,
    document.getElementById("root")
);
