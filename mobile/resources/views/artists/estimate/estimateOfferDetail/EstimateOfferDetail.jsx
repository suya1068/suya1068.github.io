import "./estimateOfferDetail.scss";
import React, { Component, PropTypes } from "react";

import API from "forsnap-api";
import utils from "forsnap-utils";

import redirect from "mobile/resources/management/redirect";

import Modal, { MODAL_TYPE, MODAL_ALIGN } from "shared/components/modal/Modal";
import PopModal from "shared/components/modal/PopModal";

import DetailFooter from "../component/Footer/DetailFooter";

import PhotoViewerM from "mobile/resources/components/photoViewer/PhotoViewerM_swiper";

import EstimateDetail from "desktop/resources/views/estimate/outside/detail/EstimateDetail";

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

        this.onFullScreen = this.onFullScreen.bind(this);

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

    onFullScreen(portfolio, total_cnt, data, index) {
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            full: true,
            content: (
                <div className="estimate__portfolio__full">
                    <PhotoViewerM images={portfolio} total_cnt={total_cnt} type={data.photoType} data={data} activeIndex={index + 1} onClose={() => Modal.close()} />
                </div>
            )
        });
    }

    /**
     * 포트폴리오 더보기 기능
     */
    onMoreContainer() {
        const { order_no, offer_no, portfolio_no } = this.state;
        const params = {
            order_no,
            offer_no,
            portfolio_no
        };
        this.getPortfolioFromEstimate(params, "more");
    }

    /**
     * 견적서 데이터를 가져온다.
     * @param order_no
     * @param offer_no
     */
    getOfferData(order_no, offer_no) {
        const request = API.orders.getOfferDetail(order_no, offer_no);
        request.then(response => {
            const data = response.data;
            this.setState({
                offerData: data,
                order_no: data.order_no,
                offer_no: data.no,
                portfolio_no: data.portfolio_no,
                status: data.status,
                category: data.category,
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
            PopModal.alert(error.data, { callBack: () => redirect.main() });
        });
    }

    /**
     * 촬영요청서 정보를 가져온다.
     * @param order_no
     */
    getEstimateData(order_no) {
        const request = API.orders.find(order_no);
        request.then(response => {
            const data = response.data;
            this.setState({
                orderData: data,
                offer_status: data.offer_status,
                isBlock: data.session_info.block_dt,
                is_read: data.is_read,
                isLoading: true
            });
            PopModal.closeProgress();
        }).catch(error => {
            PopModal.alert(error.data, { callBack: () => redirect.back() });
            // PopModal.alert(alertMsg, { callBack: () => redirect.back() });
        });
    }

    /**
     * 상품상세 포트폴리오 정보를 가져온다.
     * @param pNo
     */
    getPortfolioFromProduct(pNo) {
        const request = API.products.selectPortfolio(pNo);
        request.then(response => {
            const data = response.data;
            const portfolio = data.portfolio;
            this.setState({
                portfolio: {
                    images: portfolio.list,
                    total_cnt: portfolio.total_cnt,
                    portfolio_cnt: portfolio.total_cnt,
                    data: {
                        profile_img: data.profile_img,
                        title: data.title,
                        nick_name: data.nick_name
                    },
                    portfolio_type: "product",
                    photoType: "thumb"
                }
            }, () => {
                this.getEstimateData(this.state.order_no);
            });
        }).catch(error => {
            PopModal.alert(error.data, { callBack: () => redirect.back() });
            // PopModal.alert(alertMsg, { callBack: () => redirect.back() });
        });
    }

    /**
     * 견적서용 포트폴리오 데이터를 가져온다.
     * @param params
     * @param flag
     */
    getPortfolioFromEstimate(params, flag = "") {
        const request = API.orders.getPortfolio(params);
        request.then(response => {
            const data = response.data;
            this.setState(state => {
                return {
                    portfolio: {
                        ...state.portfolio,
                        images: data.list,
                        total_cnt: data.total_cnt,
                        portfolio_cnt: data.total_cnt,
                        portfolio_type: "estimate",
                        photoType: "private"
                    }
                };
            }, () => {
                if (flag !== "more") {
                    this.getEstimateData(params.order_no);
                }
            });
        }).catch(error => {
            PopModal.alert(error.data, { callBack: () => redirect.back() });
        });
    }

    /**
     * 견적서 상세를 그린다.
     * @returns {*}
     */
    renderOffer() {
        const { offerData, orderData, portfolio, isLoading } = this.state;

        if (!isLoading) {
            return null;
        }

        const data = {
            option: offerData.option,
            content: offerData.content,
            portfolio: { list: portfolio.images, total_cnt: portfolio.total_cnt, photoType: portfolio.photoType, ...portfolio.data },
            attach_image: offerData.attach_img,
            attach_file: JSON.parse(offerData.attach)
        };

        const isMobile = utils.agent.isMobile();

        return (
            <EstimateDetail data={data} onFullScreen={isMobile ? this.onFullScreen : null} />
        );
    }

    render() {
        const { order_no, offer_no, status, category, offer_status, isBlock, is_read } = this.state;
        const data = { order_no, offer_no, status, category, offer_status, is_read };

        return (
            <div className="artists-estimate__offer-detail">
                <div className="artists-estimate__offer-detail-inner">
                    {this.renderOffer()}
                </div>
                {status !== "COMPLETE" && !isBlock ?
                    <DetailFooter {...data} /> : null
                }
            </div>
        );
    }
}
