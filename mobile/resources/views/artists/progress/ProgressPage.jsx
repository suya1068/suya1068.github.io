import "./ProgressPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, routerShape } from "react-router";

import api from "forsnap-api";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";

import { PROCESS_BREADCRUMB_CODE, COMBINE_PROCESS_BREADCRUMB } from "shared/constant/reservation.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, Footer, OverlayContainer } from "mobile/resources/containers/layout";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";
import PopupReceipt from "mobile/resources/components/popup/PopupReceipt";
import PopupReceiptConfirm from "mobile/resources/components/popup/PopupReceiptConfirm";

import ProgressBreadcrumb from "./components/ProgressBreadcrumb";
import ProgressList from "./components/ProgressList";
import ModifyDate from "./components/ModifyDate";
import RefundModal from "./components/RefundModal";
import ReviewModal from "./components/ReviewModal";
import PassOriginModal from "./components/PassOriginModal";
import PassAlertModal from "./components/PassAlertModal";

class ProgressPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            isProcess: false,
            user_type: "A",
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
        this.onShowConfirmReserve = this.onShowConfirmReserve.bind(this);
        this.onShowCancel = this.onShowCancel.bind(this);
        this.onShowReview = this.onShowReview.bind(this);
        this.onShowPassOrigin = this.onShowPassOrigin.bind(this);
        this.onMoveChat = this.onMoveChat.bind(this);
        this.onModifyDate = this.onModifyDate.bind(this);
        this.onReserveCancel = this.onReserveCancel.bind(this);
        this.onReply = this.onReply.bind(this);

        this.findStatus = this.findStatus.bind(this);
        this.fetch = this.fetch.bind(this);
        this.modifyDate = this.modifyDate.bind(this);
        this.setStateData = this.setStateData.bind(this);
        this.setProcess = this.setProcess.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "작가 진행상황" });
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
        const { user_type, status } = this.state;
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: <PopupReceipt data={obj} userType={user_type} />,
            onClose: () => {
                this.onFetch(0, this.state.list.length);
            }
        });
    }

    onShowConfirmReserve(data) {
        const modalName = "receipt_confirm";
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            name: modalName,
            content: (
                <PopupReceiptConfirm
                    modalName={modalName}
                    data={data}
                    callBack={(buyNo, productNo, date) => this.confirmReserve(buyNo, productNo, date)}
                />
            )
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
                    review_no={data.review_no}
                    onReply={this.onReply}
                />
            )
        });
    }

    onShowPassOrigin(data) {
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: (
                <PassOriginModal
                    pass_msg={"고객에게 사진전달이 완료된 경우에만 진행해주세요.\n보정본 전달 상품의 경우 보정본 전달까지 완료된 경우에만 진행 가능합니다."}
                    check_msg={"사진전달을 완료하였습니다."}
                    error_msg={"사진전달 완료를 체크해주세요."}
                    confirm={() => {
                        const form = {};

                        if (data.product_no) {
                            form.product_no = data.product_no;
                        }

                        if (!this.state.isProcess) {
                            this.setProcess();

                            api.reservations.updatePassOrigin(data.buy_no, form)
                                .then(response => {
                                    this.setProcess(false);
                                    Modal.show({
                                        type: MODAL_TYPE.CUSTOM,
                                        content: <PassAlertModal />
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
                    }}
                />
            )
        });
    }

    onMoveChat(data) {
        let url;
        if (data.reserve_type === "PRODUCT") {
            url = `/artists/chat?user_id=${data.user_id}&product_no=${data.product_no}`;
        } else if (data.reserve_type === "OFFER") {
            url = `/artists/chat?user_id=${data.user_id}&offer_no=${data.offer_no}`;
        }

        if (url) {
            window.location.href = url;
        }
    }

    onModifyDate(buy_no, date) {
        const today = mewtime();
        const reserve = mewtime(date);
        reserve.subtract(6).endOf();
        if (today.isBefore(reserve)) {
            const modalName = "pop_modify_date_modal";
            Modal.show({
                type: MODAL_TYPE.CUSTOM,
                name: modalName,
                content: <ModifyDate modalName={modalName} buy_no={buy_no} date={date} onConfirm={this.modifyDate} />
            });
        } else {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak("촬영일 변경은 촬영일 기준 6일 이전까지 가능합니다.\n해당 촬영건의 촬영일을 변경하시려면 고객센터로 문의해주세요.")
            });
        }
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

    onReply(buy_no, review_no, comment) {
        let message = "";

        if (!comment.replace(/\s/g, "")) {
            message = "댓글을 적어주세요.";
        } else if (comment.length < 10) {
            message = "댓글은 최소 10자 이상 입력해주세요.";
        } else if (comment.length > 1000) {
            message = "댓글은 1000자 이하로 입력가능합니다.";
        }

        if (message) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: message
            });
        } else if (!this.state.isProcess) {
            this.setProcess();

            api.reservations.reserveCommentReplay(buy_no, review_no, { comment })
                .then(response => {
                    // console.log(response);
                    this.setProcess(false);

                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: "댓글이 등록되었습니다."
                    });
                }).catch(error => {
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

    modifyDate(buy_no, date) {
        if (!this.state.isProcess) {
            this.setProcess();

            api.reservations.modifyDate(buy_no, { reserve_dt: date })
                .then(response => {
                    this.setProcess(false);
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: "촬영일 변경을 요청했습니다.",
                        onSubmit: () => {
                            Modal.close();
                            this.onFetch(0, this.state.list.length);
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

    confirmReserve(buyNo, productNo, date) {
        if (buyNo !== undefined && productNo !== undefined) {
            const params = {
                product_no: productNo
            };

            if (date) {
                params.date = date;
            }

            if (!this.state.isProcess) {
                this.setProcess();

                api.reservations.reservePrepare(buyNo, params)
                    .then(response => {
                        this.setProcess(false);
                        const data = response.data;
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: "예약을 승인하셨습니다."
                        });
                        this.onFetch(0, this.state.list.length);
                    }).catch(error => {
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
            <div className="artists__progress__page">
                <div className="progress__top__container">
                    <div className="title">진행상황</div>
                    <ProgressBreadcrumb status={status} breadcrumb={breadcrumb} onClick={this.onChangeStatus} />
                </div>
                <div className="progress__list__container">
                    <ProgressList
                        data={list}
                        onMoveChat={this.onMoveChat}
                        onShowReceipt={this.onShowReceipt}
                        onShowConfirmReserve={this.onShowConfirmReserve}
                        onShowCancel={this.onShowCancel}
                        onShowReview={this.onShowReview}
                        onShowPassOrigin={this.onShowPassOrigin}
                        onModifyDate={this.onModifyDate}
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
    <AppContainer roles={["artist"]}>
        <HeaderContainer />
        <LeftSidebarContainer />
        <div className="site-main">
            <Router history={browserHistory} >
                <Route path="/artists/progress(/:status)" component={ProgressPage} />
            </Router>
            <Footer>
                <ScrollTop />
            </Footer>
            <OverlayContainer />
        </div>
    </AppContainer>,
    document.getElementById("root")
);
