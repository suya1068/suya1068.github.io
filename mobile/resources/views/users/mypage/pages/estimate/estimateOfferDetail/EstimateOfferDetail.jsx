import "./estimateOfferDetail.scss";
import React, { Component, PropTypes } from "react";
import PopModal from "shared/components/modal/PopModal";
import API from "forsnap-api";
import redirect from "mobile/resources/management/redirect";
import Offer from "mobile/resources/components/estimate/offer/detail/Detail";
import OfferDetailFooter from "./component/OfferDetailFooter";

const alertMsg = "찾을 수 없는 요청입니다.";

export default class EstimateOfferDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isMount: !this._calledComponentWillUnmount,
            offerData: {},
            orderData: {},
            portfolio: {}
        };
        this.getOfferData = this.getOfferData.bind(this);
        this.getEstimateData = this.getEstimateData.bind(this);
        this.getPortfolioFromProduct = this.getPortfolioFromProduct.bind(this);
        this.getPortfolioFromEstimate = this.getPortfolioFromEstimate.bind(this);
    }

    componentWillMount() {
        const params = this.props.params;
        this.setState({ ...params });
    }

    componentDidMount() {
        const { order_no, offer_no } = this.state;
        this.getOfferData(order_no, offer_no);
    }

    onMoreContainer() {
        const { order_no, offer_no, portfolio_no } = this.state;
        const params = {
            order_no,
            offer_no,
            portfolio_no
        };
        this.getPortfolioFromEstimate(params, "more");
    }

    getOfferData(order_no, offer_no) {
        const request = API.orders.getOfferDetail(order_no, offer_no);
        request.then(response => {
            const data = response.data;
            this.setState({
                offerData: data,
                read_dt: data.read_dt,
                portfolio_no: data.portfolio_no,
                product_no: data.product_no,
                portfolio: {
                    data: {
                        profile_img: data.profile_img,
                        title: data.title,
                        nick_name: data.nick_name
                    }
                }
            }, () => {
                const isProductNoNull = data.product_no === null;
                if (isProductNoNull) {
                    const portfolio_no = data.portfolio_no || "";
                    const params = {
                        order_no,
                        offer_no,
                        portfolio_no
                    };
                    this.getPortfolioFromEstimate(params);
                } else {
                    this.getPortfolioFromProduct(data.product_no);
                }
            });
        }).catch(error => {
            PopModal.alert(error.data, { callBack: () => redirect.back() });
            // PopModal.alert(alertMsg, { callBack: () => redirect.back() });
        });
    }

    getEstimateData(order_no) {
        const request = API.orders.find(order_no);
        request.then(response => {
            const data = response.data;
            // if (response.status === 200) {
            //     if (data.phone && data.email) {
            //         this.setState({
            //             orderData: data,
            //             isLoading: true
            //         });
            //     } else {
            //         PopModal.alert("본인의 촬영의뢰가 아닙니다.", { callBack: () => redirect.back() });
            //     }
            // }

            this.setState({
                orderData: data,
                isLoading: true
            });
        }).catch(error => {
            PopModal.alert(error.data || alertMsg, { callBack: () => redirect.back() });
        });
    }

    getPortfolioFromProduct(pNo) {
        const request = API.products.selectPortfolio(pNo);
        request.then(response => {
            const data = response.data;
            const portfolio = data.portfolio;
            this.setState({
                portfolio: {
                    images: portfolio.list,
                    total_cnt: portfolio.total_cnt,
                    data: {
                        profile_img: data.profile_img,
                        title: data.title,
                        nick_name: data.nick_name
                    },
                    portfolio_type: "product"
                }
            }, () => {
                this.getEstimateData(this.state.order_no);
            });
        }).catch(error => {
            PopModal.alert(error.data || alertMsg, { callBack: () => redirect.back() });
        });
    }

    getPortfolioFromEstimate(params, flag = "") {
        const request = API.orders.getPortfolio(params);
        request.then(response => {
            const data = response.data;
            this.setState({
                portfolio: {
                    images: data.list,
                    total_cnt: data.total_cnt,
                    portfolio_type: "estimate"
                }
            }, () => {
                if (flag !== "more") {
                    this.getEstimateData(params.order_no);
                }
            });
        }).catch(error => {
            PopModal.alert(error.data || alertMsg, { callBack: () => redirect.back() });
        });
    }

    renderOffer() {
        const { offerData, orderData, portfolio, read_dt, isLoading } = this.state;
        if (!isLoading) {
            return false;
        }

        return (
            <div>
                <Offer offerData={offerData} orderData={orderData} portfolio={portfolio} read_dt={read_dt} onMoreContainer={() => this.onMoreContainer()} userType="U" />
                {orderData.status !== "COMPLETE" && offerData.status !== "COMPLETE" && !orderData.stop_dt ?
                    <OfferDetailFooter data={{ ...offerData }} /> : null
                }
            </div>
        );
    }

    render() {
        return (
            <div className="users-estimate__offer-detail">
                {this.renderOffer()}
            </div>
        );
    }
}
