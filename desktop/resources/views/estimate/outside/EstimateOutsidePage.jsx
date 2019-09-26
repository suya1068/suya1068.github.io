import "./EstimateOutsidePage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import api from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";

import Modal, { MODAL_TYPE, MODAL_ALIGN } from "shared/components/modal/Modal";

// import PaymentOffer from "shared/components/payment/PaymentOffer";

import App from "desktop/resources/components/App";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Footer from "desktop/resources/components/layout/footer/Footer";

import OutsidePassword from "./components/OutsidePassword";
import OutsideModal from "./components/OutsideModal";
import EstimateDetail from "./detail/EstimateDetail";

class EstimateOutsidePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            limit: false,
            estimate_url: "",
            estimate: null,
            loading: false,
            download_image: null,
            print_image: null,
            isMobile: utils.agent.isMobile()
        };

        this.print = null;

        this.onPassword = this.onPassword.bind(this);
        // this.onPayment = this.onPayment.bind(this);
        this.onShowActionModal = this.onShowActionModal.bind(this);

        this.fetchTimeLimit = this.fetchTimeLimit.bind(this);
        this.fetchEstimate = this.fetchEstimate.bind(this);
        this.fetchPortfolio = this.fetchPortfolio.bind(this);
        this.fetchProductPortfolio = this.fetchProductPortfolio.bind(this);
        // this.fetchPaymentOffer = this.fetchPaymentOffer.bind(this);

        this.gaEvent = this.gaEvent.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
        const estimate_url = document.getElementById("estimate_url");

        if (estimate_url) {
            this.state.estimate_url = estimate_url.getAttribute("content");
        }
    }

    componentDidMount() {
        const { estimate_url, isMobile } = this.state;

        if (estimate_url) {
            Modal.show({
                type: MODAL_TYPE.PROGRESS
            });

            this.fetchTimeLimit(estimate_url)
                .then(data => {
                    this.setStateData(() => {
                        const loading = !!data;

                        if (loading) {
                            this.gaEvent({
                                category: `외부견적서_${isMobile ? "MO" : "PC"}`,
                                action: "외부견적서 접근",
                                label: `url=${estimate_url}`
                            });
                        }

                        return {
                            loading
                        };
                    }, () => {
                        Modal.close(MODAL_TYPE.PROGRESS);
                    });
                });
        }
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onPassword(password) {
        const { estimate_url, isMobile } = this.state;

        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });

        let estimate = null;

        new Promise((resolve, reject) => {
            this.fetchEstimate(password)
                .then(data => {
                    if (data) {
                        this.gaEvent({
                            category: `외부견적서_${isMobile ? "MO" : "PC"}`,
                            action: "외부견적서 확인",
                            label: `url=${estimate_url}`
                        });

                        const option = data.offer_info.option.reduce((r, o) => {
                            const op = Object.assign({}, o, {
                                count: o.count || 1
                            });
                            op.total_price = o.total_price || (Number(o.option_price) * Number(op.count));
                            r.push(op);
                            return r;
                        }, []);

                        estimate = {
                            order_no: data.order_info.no || "",
                            offer_no: data.offer_info.no || "",
                            option,
                            content: data.offer_info.content,
                            attach_image: data.offer_info.attach_img,
                            attach_file: JSON.parse(data.offer_info.attach),
                            product_no: data.offer_info.product_no,
                            portfolio_no: data.offer_info.portfolio_no
                        };

                        if (estimate.portfolio_no) {
                            this.fetchPortfolio(estimate.portfolio_no, password)
                                .then(portfolio => {
                                    estimate.portfolio = {
                                        ...portfolio,
                                        title: "포트폴리오",
                                        profile_img: data.offer_info.profile_img,
                                        nick_name: data.offer_info.nick_name,
                                        no: estimate.portfolio_no,
                                        viewType: "portfolio",
                                        photoType: "private",
                                        portfolio_cnt: portfolio.total_cnt
                                    };
                                    resolve(estimate);
                                });
                        } else if (estimate.product_no) {
                            this.fetchProductPortfolio(estimate.product_no)
                                .then(portfolio => {
                                    estimate.portfolio = {
                                        ...portfolio.portfolio,
                                        title: portfolio.title,
                                        profile_img: portfolio.profile_img,
                                        nick_name: portfolio.nick_name,
                                        no: estimate.product_no,
                                        viewType: "portfolio",
                                        photoType: "thumb",
                                        portfolio_cnt: portfolio.portfolio.total_cnt
                                    };
                                    estimate.portfolio_video = portfolio.portfolio_video;
                                    resolve(estimate);
                                });
                        } else {
                            resolve(estimate);
                        }
                    } else {
                        reject();
                    }
                });
        }).then(data => {
            this.setStateData(() => {
                return {
                    estimate: data
                };
            }, () => {
                Modal.close(MODAL_TYPE.PROGRESS);
            });
        }).catch(error => {
            Modal.close(MODAL_TYPE.PROGRESS);
        });
    }

    // onPayment() {
    //     const { estimate, estimate_url } = this.state;
    //     const user = auth.getUser();
    //
    //     if (!user) {
    //         Modal.show({
    //             type: MODAL_TYPE.ALERT,
    //             content: "로그인 후 이용해주세요.",
    //             onSubmit: () => {
    //                 location.href = `/login?redirectURL=${encodeURIComponent(location.pathname)}`;
    //             }
    //         });
    //     } else {
    //         const data = {
    //             offer_no: estimate.offer_no,
    //             order_no: estimate.order_no,
    //             option: estimate.option,
    //             price: estimate.option.reduce((r, o) => (r + (Number(o.total_price) || 0)), 0),
    //             redirect_url: `${__DOMAIN__}/users/estimate/${estimate.order_no}/offer/${estimate.offer_no}/process`
    //         };
    //
    //         Modal.show({
    //             type: MODAL_TYPE.CUSTOM,
    //             content: <PaymentOffer data={data} />,
    //             close: true
    //         });
    //     }
    // }

    onShowActionModal() {
        const { estimate, estimate_url } = this.state;

        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            width: "750px",
            content: <OutsideModal estimate={estimate} />
        });
    }

    fetchTimeLimit(url) {
        return api.offers.getOutsideTimeLimit(url)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: error.data
                });
            });
    }

    fetchEstimate(password) {
        const { estimate_url } = this.state;
        return api.offers.fetchOutsideInfo(estimate_url, { password })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: error.data
                });
            });
    }

    fetchPortfolio(portfolio_no, password) {
        const { estimate_url } = this.state;
        return api.offers.getOutsidePortfolio(estimate_url, portfolio_no, { password })
            .then(response => {
                delete response.data.session_info;
                return response.data;
            })
            .catch(error => {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: error.data
                });
            });
    }

    fetchProductPortfolio(product_no) {
        return api.products.selectPortfolio(product_no)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: error.data
                });
            });
    }

    // fetchPaymentOffer(order_no, offer_no) {
    //     return api.orders.getOfferDetail(order_no, offer_no)
    //         .then(response => {
    //             return response.data;
    //         })
    //         .catch(error => {
    //             Modal.show({
    //                 type: MODAL_TYPE.ALERT,
    //                 content: error.data
    //             });
    //         });
    // }

    gaEvent({ category, action, label }) {
        utils.ad.gaEvent(category, action, label);
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    renderPassword() {
        return <OutsidePassword limit={this.state.loading} onPassword={this.onPassword} />;
    }

    renderDetail(estimate) {
        const { estimate_url } = this.state;
        const user = auth.getUser();

        return (
            <div className="estimate__outside__content">
                <div className="top__buttons">
                    <button className="_button _button__default" onClick={this.onShowActionModal}>
                        <img alt="icon_printer" src={`${__SERVER__.img}/estimate/icon/icon_printer.png`} width="18" /> <span>견적서 이미지 다운로드 및 인쇄</span>
                    </button>
                </div>
                <div className="estimate__logo">
                    <img alt="estimate_logo" src={`${__SERVER__.img}/estimate/logo_estimate.png`} width="180" />
                </div>
                <div className="estimate__content">
                    <EstimateDetail data={estimate} />
                </div>
                <div className="estimate__information">
                    <div className="estimate__buttons" />
                    <div className="estimate__payment__info">
                        <div className="title">결제안내</div>
                        <div className="content">
                            <div className="content__login">
                                <p>로그인 후 신용카드, 계좌이체, 무통장입금으로 결제 가능합니다.<br />회원가입은 네이버, 페이스북, 카카오톡으로 1초만에 가능합니다.</p>
                                {user ? null : <a href={`/login?redirectURL=${encodeURIComponent(location.pathname)}`}><button className="_button _button__fill__yellow">로그인 / 회원가입</button></a> }
                            </div>
                            <div className="content__customer">
                                <p>견적서 및 결제관련 문의는 070-4060-4406 혹은<br />포스냅 고객센터로 가능합니다.</p>
                                <a href="/cs/qna"><button className="_button _button__default">고객센터 바로가기</button></a>
                            </div>
                        </div>
                        <div className="description">
                            <strong>본 견적서의 견적번호는 {estimate.order_no}-{estimate.offer_no} 입니다.</strong><br />
                            포스냅 서비스는 작가님과 고객님 모두 중개수수료가 0%이니, 수수료에 대한 걱정 없이 포스냅을 통한 예약을 진행해주세요.<br />
                            포스냅을 통하여 예약하시면 최종 이미지를 전달 받으실 때까지 안전하게 대금이 보관됩니다.<br />
                            견적서상 내용은 예약 확정 시 변동될 수 있습니다.<br />
                            포스냅은 중개업체로 세금계산서는 실제 서비스를 제공한 작가님이 발행합니다.<br />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { estimate } = this.state;
        return (
            <div id="site-main">
                <div className="estimate__outside__page">
                    {estimate ? this.renderDetail(estimate) : this.renderPassword()}
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App>
        <HeaderContainer />
        <EstimateOutsidePage />
        <Footer />
    </App>,
    document.getElementById("root")
);
