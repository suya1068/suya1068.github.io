import "./OutsideConsultPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import api from "forsnap-api";
import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import App from "desktop/resources/components/App";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Footer from "desktop/resources/components/layout/footer/Footer";

import OutsidePassword from "./components/OutsidePassword";
import ConsultDetail from "./detail/ConsultDetail";

class OutsideConsultPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            limit: false,
            consult_url: "",
            consult: null,
            loading: false,
            isMobile: utils.agent.isMobile()
        };

        this.onPassword = this.onPassword.bind(this);

        this.fetchTimeLimit = this.fetchTimeLimit.bind(this);
        this.fetchConsult = this.fetchConsult.bind(this);

        this.gaEvent = this.gaEvent.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
        const consult_url = document.getElementById("consult_url");

        if (consult_url) {
            this.state.consult_url = consult_url.getAttribute("content");
        }
    }

    componentDidMount() {
        const { consult_url, isMobile } = this.state;

        if (consult_url) {
            Modal.show({
                type: MODAL_TYPE.PROGRESS
            });

            this.fetchTimeLimit(consult_url)
                .then(data => {
                    this.setStateData(() => {
                        const loading = !!data;

                        if (loading) {
                            this.gaEvent({
                                category: `상담신청_외부전달_${isMobile ? "MO" : "PC"}`,
                                action: "상담신청_외무전달_접근",
                                label: `url=${consult_url}`
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
        const { consult_url, isMobile } = this.state;

        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });

        let consult = null;

        new Promise((resolve, reject) => {
            this.fetchConsult(password)
                .then(data => {
                    if (data) {
                        this.gaEvent({
                            category: `상담신청_외부전달_${isMobile ? "MO" : "PC"}`,
                            action: "상담신청_외부전달_확인",
                            label: `url=${consult_url}`
                        });

                        consult = {
                            advice_order_no: data.advice_order_no,
                            attach: data.attach || [],
                            category: data.category,
                            counsel_time: data.counsel_time,
                            user_email: data.user_email,
                            user_id: data.user_id,
                            user_name: data.user_name,
                            user_phone: data.user_phone,
                            upload_info: data.upload_info
                        };

                        resolve(consult);
                    } else {
                        reject();
                    }
                })
                .catch(error => {
                    if (error && error.data) {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: error.data
                        });
                    }
                    reject();
                });
        }).then(data => {
            this.setStateData(() => {
                return {
                    consult: data
                };
            }, () => {
                Modal.close(MODAL_TYPE.PROGRESS);
            });
        }).catch(error => {
            Modal.close(MODAL_TYPE.PROGRESS);
            if (error && error.data) {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: error.data
                });
            }
        });
    }

    fetchTimeLimit(url) {
        return api.orders.fetchOutsideConsultTimeLimit(url)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: error.data
                    });
                }
            });
    }

    fetchConsult(password) {
        const { consult_url } = this.state;
        return api.orders.fetchOutsideConsult(consult_url, { password })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: error.data
                    });
                }
            });
    }

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

    renderDetail(consult) {
        return (
            <div className="outside__consult__content">
                <div className="consult__logo">
                    <img alt="consult_logo" src={`${__SERVER__.img}/common/f_logo_yellow.png`} width="180" />
                    <p className="consult__logo__title">포스냅에 상담신청해주신 내용입니다.</p>
                </div>
                <div className="consult__content">
                    <ConsultDetail data={consult} />
                </div>
            </div>
        );
    }

    render() {
        const { consult } = this.state;
        return (
            <div id="site-main">
                <div className="outside__consult__page">
                    {consult ? this.renderDetail(consult) : this.renderPassword()}
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App>
        <HeaderContainer />
        <OutsideConsultPage />
        <Footer />
    </App>,
    document.getElementById("root")
);
