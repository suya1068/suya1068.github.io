import "./ProgressPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, routerShape } from "react-router";

import api from "forsnap-api";
import utils from "forsnap-utils";

import { PROCESS_BREADCRUMB_CODE, COMBINE_PROCESS_BREADCRUMB } from "shared/constant/reservation.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, Footer, OverlayContainer } from "mobile/resources/containers/layout";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";
import PopupReceipt from "mobile/resources/components/popup/PopupReceipt";

import ProgressBreadcrumb from "./components/ProgressBreadcrumb";
import ProgressList from "./components/ProgressList";
import ModifyDateModal from "./components/ModifyDateModal";
import RefundModal from "./components/RefundModal";
import ReviewModal from "./components/ReviewModal";

class ProgressPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            isProcess: false,
            user_type: "U",
            status: this.findStatus(props.params ? props.params.status : null),
            breadcrumb: {
                READY: 0,
                PAYMENT: 0,
                PREPARE: 0,
                SHOT: 0,
                UPLOAD: 0,
                CUSTOM: 0,
                COMPLETE: 0
            },
            list: [],
            limit: 10,
            isMore: true
        };

        this.onScroll = this.onScroll.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onFetch = this.onFetch.bind(this);
        this.onShowReceipt = this.onShowReceipt.bind(this);
        this.onShowCancel = this.onShowCancel.bind(this);
        this.onShowReview = this.onShowReview.bind(this);
        this.onMoveChat = this.onMoveChat.bind(this);
        this.onModifyDate = this.onModifyDate.bind(this);
        this.onReserveCancel = this.onReserveCancel.bind(this);
        this.onDownload = this.onDownload.bind(this);
        this.onComplete = this.onComplete.bind(this);

        this.findStatus = this.findStatus.bind(this);
        this.fetch = this.fetch.bind(this);
        this.modifyDate = this.modifyDate.bind(this);
        this.confirmReview = this.confirmReview.bind(this);
        this.setStateData = this.setStateData.bind(this);
        this.setProcess = this.setProcess.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "마이페이지" });
        }, 0);

        this.onFetch(0);
        window.addEventListener("scroll", this.onScroll);
    }

    componentWillUnmount() {
        this.state.isMount = false;
        window.removeEventListener("scroll", this.onScroll);
    }

    onScroll(e) {
        const { list, limit, isProcess, status, breadcrumb, isMore } = this.state;

        //현재문서의 높이
        const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        //현재 스크롤탑의 값
        const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        //현재 화면 높이 값
        const clientHeight = (document.documentElement.clientHeight);

        const footer = document.getElementsByClassName("site-footer")[0];
        let footerHeight = 312;

        if (footer) {
            footerHeight = footer.offsetHeight;
        }

        if ((clientHeight + scrollTop) > scrollHeight - (footerHeight + 260) && isMore) {
            const total = COMBINE_PROCESS_BREADCRUMB[status].status.reduce((r, o) => {
                return r + Number(breadcrumb ? breadcrumb[o] || 0 : 0);
            }, 0);

            if (list.length < total && !isProcess) {
                this.onFetch(list.length, limit);
            }
        }
    }

    onChangeStatus(value) {
        const { status } = this.state;
        if (value.toUpperCase() !== status.toUpperCase()) {
            this.setStateData(() => {
                return {
                    status: value.toUpperCase()
                };
            }, () => {
                this.onFetch(0);
            });
        }
    }

    onFetch(offset, limit) {
        const { status } = this.state;
        this.fetch(COMBINE_PROCESS_BREADCRUMB[status].status.join(","), offset, limit);
    }

    /**
     * 상품 결제 영수증보기
     */
    onShowReceipt(obj) {
        const { user_type } = this.state;
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: <PopupReceipt data={obj} userType={user_type} status={obj.state_type || "PAYMENT"} />,
            onClose: () => {
                this.onFetch(0, this.state.list.length);
            }
        });
    }

    /**
     * 취소하기 버튼 구현
     */
    onShowCancel(data) {
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: <RefundModal data={data} onReserveCancel={this.onReserveCancel} />,
            onClose: () => {
                this.onFetch(0, this.state.list.length);
            }
        });
    }

    onShowReview(data) {
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            width: "100%",
            content: (
                <ReviewModal
                    buy_no={data.buy_no}
                    product_no={data.product_no}
                    onClose={() => Modal.close()}
                    onConfirm={this.confirmReview}
                />
            )
        });
    }

    onMoveChat(data) {
        let url;
        if (data.reserve_type === "PRODUCT") {
            url = `/users/chat?user_id=${data.artist_id}&product_no=${data.product_no}`;
        } else if (data.reserve_type === "OFFER") {
            url = `/users/chat?user_id=${data.artist_id}&offer_no=${data.offer_no}`;
        }

        if (url) {
            window.location.href = url;
        }
    }

    onModifyDate(buy_no, date_alter_no) {
        const modalName = "pop_modify_date_confirm";
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            name: modalName,
            content: <ModifyDateModal onConfirm={() => this.modifyDate(buy_no, date_alter_no)} onCancel={() => Modal.close(modalName)} />
        });
    }

    onReserveCancel(buy_no, data) {
        if (!this.state.isProcess) {
            this.setProcess();
            api.reservations.reserveCancel(buy_no, Object.assign({ user_type: this.state.user_type }, data))
                .then(response => {
                    this.setProcess(false);
                    Modal.close();
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak("취소되셨어요\n좋은 서비스가 되도록 노력하겠습니다.")
                    });
                    this.onFetch(0, this.state.list.length);
                })
                .catch(error => {
                    this.setProcess(false);
                    if (error && error.data) {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: utils.linebreak(error.data)
                        });
                    }
                });
        }
    }

    onDownload() {
        Modal.show({
            type: MODAL_TYPE.ALERT,
            content: "이미지 다운로드는 PC에서만 가능합니다."
        });
    }

    onComplete(data) {
        Modal.show({
            type: MODAL_TYPE.CONFIRM,
            content: "최종완료 하시겠습니까?",
            onSubmit: () => {
                const params = {};
                if (data.product_no) {
                    params.product_no = data.product_no;
                }

                if (!this.state.isProcess) {
                    this.setProcess();
                    api.reservations.photoBuyComplete(data.buy_no, params)
                        .then(response => {
                            this.setProcess(false);
                            Modal.show({
                                type: MODAL_TYPE.ALERT,
                                content: utils.linebreak("완료되었습니다.\n'서비스 이용내역'에서 다시 확인할 수 있어요.")
                            });
                            this.onFetch(0, this.state.list.length);
                        })
                        .catch(error => {
                            this.setProcess(false);
                            if (error && error.data) {
                                Modal.show({
                                    type: MODAL_TYPE.ALERT,
                                    content: error.data
                                });
                            }
                        });
                }
            }
        });
    }

    findStatus(status) {
        if (status) {
            return Object.keys(COMBINE_PROCESS_BREADCRUMB).reduce((r, key) => {
                const o = COMBINE_PROCESS_BREADCRUMB[key];
                const find = o.status.find(code => code.toLowerCase() === status.toLowerCase());
                if (find) {
                    return key;
                }

                return r;
            }, PROCESS_BREADCRUMB_CODE.READY);
        }

        return PROCESS_BREADCRUMB_CODE.READY;
    }

    fetch(status, offset, limit) {
        if (!this.state.isProcess) {
            this.setProcess();

            api.reservations.reserveList(status, this.state.user_type, offset, limit || this.state.limit)
                .then(response => {
                    this.setProcess(false);
                    const data = response.data;

                    this.setStateData(({ list }) => {
                        const prop = {
                            breadcrumb: data.count_list,
                            is_calculate: data.is_calculate || 0,
                            isMore: true
                        };

                        if (offset === 0) {
                            prop.list = data.list;
                        } else {
                            const merge = utils.mergeArrayTypeObject(list, data.list, ["no"], ["no"], true);
                            prop.list = merge.list;
                        }

                        if (data.list.length < (limit || this.state.limit)) {
                            prop.isMore = false;
                        }

                        return prop;
                    });
                })
                .catch(error => {
                    this.setProcess(false);
                    if (error && error.data) {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: utils.linebreak(error.data)
                        });
                    } else {
                        console.error(error);
                    }
                });
        }
    }

    modifyDate(buy_no, date_alter_no) {
        if (!this.state.isProcess) {
            this.setProcess();

            api.reservations.confirmModifyDate(buy_no, date_alter_no)
                .then(response => {
                    this.setProcess(false);
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: "촬영일이 변경되었습니다.",
                        onSubmit: () => {
                            this.onFetch(0, this.state.list.length);
                            Modal.close();
                        }
                    });
                })
                .catch(error => {
                    this.setProcess(false);
                    if (error && error.data) {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: utils.linebreak(error.data)
                        });
                    }
                });
        }
    }

    confirmReview(product_no, data) {
        if (!this.state.isProcess) {
            this.setProcess();

            api.products.productRegistComment(product_no, data)
                .then(response => {
                    this.setProcess(false);
                    Modal.close();
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak("후기가 등록되었습니다.\n감사합니다.")
                    });
                    this.onFetch(0, this.state.list.length);
                })
                .catch(error => {
                    this.setProcess(false);
                    if (error && error.data) {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: utils.linebreak(error.data)
                        });
                    }
                });
        }
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    setProcess(b = true) {
        if (this.state.isMount) {
            if (b) {
                this.state.isProcess = true;
                Modal.show({
                    type: MODAL_TYPE.PROGRESS
                });
            } else {
                this.state.isProcess = false;
                Modal.close(MODAL_TYPE.PROGRESS);
            }
        }
    }

    render() {
        const { status, breadcrumb, list } = this.state;

        return (
            <div className="user__progress__page">
                <div className="progress__top__container">
                    <div className="title">진행상황</div>
                    <ProgressBreadcrumb status={status} breadcrumb={breadcrumb} onClick={this.onChangeStatus} />
                </div>
                <div className="progress__list__container">
                    <ProgressList
                        data={list}
                        onMoveChat={this.onMoveChat}
                        onShowReceipt={this.onShowReceipt}
                        onShowCancel={this.onShowCancel}
                        onShowReview={this.onShowReview}
                        onModifyDate={this.onModifyDate}
                        onDownload={this.onDownload}
                        onComplete={this.onComplete}
                    />
                </div>
            </div>
        );
    }
}

ProgressPage.contextTypes = {
    router: routerShape
};

ReactDOM.render(
    <AppContainer roles={["customer"]}>
        <HeaderContainer />
        <LeftSidebarContainer />
        <div className="site-main">
            <Router history={browserHistory} >
                <Route path="/users/progress(/:status)" component={ProgressPage} />
            </Router>
            <Footer>
                <ScrollTop />
            </Footer>
            <OverlayContainer />
        </div>
    </AppContainer>,
    document.getElementById("root")
);
