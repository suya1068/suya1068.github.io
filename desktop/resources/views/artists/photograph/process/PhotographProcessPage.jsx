import "./PhotographProcessPage.scss";
import React, { Component, PropTypes } from "react";
import { routerShape } from "react-router";

import api from "forsnap-api";
import utils from "forsnap-utils";

import { PROCESS_BREADCRUMB_CODE, COMBINE_PROCESS_BREADCRUMB } from "shared/constant/reservation.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import PopupReceipt from "desktop/resources/components/pop/popup/PopupReceipt";
import PopupReceiptConfirm from "desktop/resources/components/pop/popup/PopupReceiptConfirm";
import UploadPhotos from "desktop/resources/components/pop/popup/UploadPhotos";
import UploadCustom from "desktop/resources/components/pop/popup/UploadCustom";
import PopupReply from "desktop/resources/components/pop/popup/PopupReply";

import PassOriginModal from "./modal/PassOriginModal";
import PassAlertModal from "./modal/PassAlertModal";
import ProcessBreadcrumb from "./components/ProcessBreadcrumb";
import ProcessList from "./components/ProcessList";
import PopupScheduleCancel from "../../components/PopupScheduleCancel";

class PhotographProcessPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            userType: "A",
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

        this.onFetch = this.onFetch.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onShowReceipt = this.onShowReceipt.bind(this);
        this.onShowPassOrigin = this.onShowPassOrigin.bind(this);
        this.onShowPassComplete = this.onShowPassComplete.bind(this);
        this.onShowReservation = this.onShowReservation.bind(this);
        this.onShowReservationCancel = this.onShowReservationCancel.bind(this);
        this.onShowUploadPhotos = this.onShowUploadPhotos.bind(this);
        this.onShowCustomPhotos = this.onShowCustomPhotos.bind(this);
        this.onShowReply = this.onShowReply.bind(this);
        this.onMoveChat = this.onMoveChat.bind(this);

        this.findStatus = this.findStatus.bind(this);
        this.fetch = this.fetch.bind(this);
        this.apiReservePrepare = this.apiReservePrepare.bind(this);
        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.onFetch(0);
    }

    componentWillReceiveProps(np) {
        if (np.params.status && np.params.status.toLowerCase() !== this.state.status.toLowerCase()) {
            this.onChangeStatus(np.params.status);
        }
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onFetch(offset, limit) {
        const { status } = this.state;
        this.fetch(COMBINE_PROCESS_BREADCRUMB[status].status.join(","), offset, limit);
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

    /**
     * 상품 결제 영수증보기
     */
    onShowReceipt(obj) {
        Modal.show({
            type: MODAL_TYPE.ALERT,
            content: <PopupReceipt data={obj} userType="A" />,
            onSubmit: () => {
                const { list } = this.state;
                this.onFetch(0, list.length);
            }
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

                        api.reservations.updatePassOrigin(data.buy_no, form)
                            .then(response => {
                                Modal.show({
                                    type: MODAL_TYPE.CUSTOM,
                                    content: <PassAlertModal />
                                });
                                this.onFetch(0, this.state.list.length);
                            });
                    }}
                />
            )
        });
    }

    onShowPassComplete(data) {
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: (
                <PassOriginModal
                    pass_msg={"촬영이 완료된 경우에만 진행해주세요.\n진행완료 접수 후 고객님이 최종완료처리하거나 일주일이 지나면 자동완료처리 됩니다."}
                    check_msg={"진행이 완료 되었습니다."}
                    error_msg={"진행완료 체크해주세요."}
                    confirm={v => {
                        const form = {};

                        if (data.product_no) {
                            form.product_no = data.product_no;
                        }

                        api.reservations.updatePassOrigin(data.buy_no, form)
                            .then(response => {
                                const { list } = this.state;
                                Modal.show({
                                    type: MODAL_TYPE.CUSTOM,
                                    content: <PassAlertModal />
                                });
                                this.onFetch(0, list.length);
                            });
                    }}
                />
            )
        });
    }

    onShowReservation(obj) {
        if (obj !== undefined) {
            const modalName = "receipt_confirm";
            Modal.show({
                type: MODAL_TYPE.CUSTOM,
                name: modalName,
                content: (
                    <PopupReceiptConfirm
                        modalName={modalName}
                        data={obj}
                        callBack={(buyNo, productNo, date) => this.apiReservePrepare(buyNo, productNo, date)}
                    />
                )
            });
        }
    }

    onShowReservationCancel(obj) {
        const modalName = "payment_cancel";

        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            close: true,
            content: (
                <PopupScheduleCancel
                    modalName={modalName}
                    data={{ userType: "A", buyNo: obj.buy_no, productNo: obj.product_no, baseData: obj }}
                    onCallBack={() => {
                        const { list } = this.state;
                        this.onFetch(0, list.length);
                    }}
                />
            )
        });
    }

    // 촬영 사진 업로드
    onShowUploadPhotos(obj) {
        const modalName = "upload_photos";
        const userType = this.state.userType;

        const data = {
            buyNo: obj.buy_no,
            productNo: obj.product_no,
            min_cut_cnt: obj.min_cut_cnt,
            max_cut_cnt: obj.max_cut_cnt,
            onClose: () => {
                const { list } = this.state;
                Modal.close(modalName);
                this.onFetch(0, list.length);
            }
        };

        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            name: modalName,
            close: true,
            content: (
                <UploadPhotos data={data} userType={userType} />
            )
        });
    }

    // 촬영 사진 보정 업로드
    onShowCustomPhotos(obj) {
        const userType = this.state.userType;
        const modalName = "upload_photos";

        const data = {
            buyNo: obj.buy_no,
            productNo: obj.product_no,
            custom_cnt: obj.custom_cnt,
            onClose: () => {
                const { list } = this.state;
                Modal.close(modalName);
                this.onFetch(0, list.length);
            }
        };

        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            name: modalName,
            content: (
                <UploadCustom data={data} userType={userType} />
            )
        });
    }

    onShowReply(obj) {
        const buyNo = obj.buy_no;
        const productNo = obj.product_no;
        const reviewNo = obj.review_no;

        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            close: true,
            content: (
                <PopupReply buyNo={buyNo} productNo={productNo} reviewNo={reviewNo} userType="A" />
            )
        });
    }

    onShowCalculateInfo() {
        Modal.show({
            type: MODAL_TYPE.ALERT,
            content: utils.linebreak(`
                첫 정산 시 다음의 서류를 acct@forsnap.com 으로 접수해주셔야 합니다.\n
                1. 사업자 등록증 (사업자의 경우) 또는 신분증 (개인의 경우)
                2. 통장사본 (계정설정에서 입력한 계좌)\n
                서류가 접수되지 않은 경우 정산일이 늦어질 수 있습니다.
                정산관련 문의는 1:1 고객센터, 혹은 070)5088-3488 으로 연락주세요.`)
        });
    }

    onMoveChat(data) {
        const router = this.context.router;
        let url = null;

        if (data.reserve_type === "PRODUCT") {
            url = `/artists/chat/${data.user_id}/${data.product_no}`;
        } else if (data.reserve_type === "OFFER") {
            url = `/artists/chat/${data.user_id}/offer/${data.offer_no}`;
        }

        if (url) {
            if (router) {
                router.push(url);
            } else {
                window.location.href = url;
            }
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
        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });

        api.reservations.reserveList(status, "A", offset, limit || this.state.limit)
            .then(response => {
                Modal.close(MODAL_TYPE.PROGRESS);
                const data = response.data;

                this.setStateData(({ list }) => {
                    const prop = {
                        breadcrumb: data.count_list,
                        is_calculate: data.is_calculate || 0,
                        isMore: true
                    };

                    if (offset === 0 || limit) {
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
                Modal.close(MODAL_TYPE.PROGRESS);
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

    apiReservePrepare(buyNo, productNo, date) {
        if (buyNo !== undefined && productNo !== undefined) {
            const params = {
                product_no: productNo
            };

            if (date) {
                params.date = date;
            }

            const request = api.reservations.reservePrepare(buyNo, params);
            request.then(response => {
                const data = response.data;
                const { list } = this.state;
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "예약을 승인하셨습니다."
                });
                this.onFetch(0, list.length);
            }).catch(error => {
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

    render() {
        const { status, list, breadcrumb, is_calculate, isMore } = this.state;
        const process = COMBINE_PROCESS_BREADCRUMB[status];
        const find = this.findStatus(status);
        const total = COMBINE_PROCESS_BREADCRUMB[find].status.reduce((r, o) => {
            return r + Number(breadcrumb[o]);
        }, 0);

        return (
            <div className="photograph__process__page">
                <ProcessBreadcrumb status={status} breadcrumb={breadcrumb} onClick={this.onChangeStatus} />
                {utils.isArray(list) && list.length ?
                    <div>
                        <div className="process__title">
                            <div className="title" data-count={total}>{process.name}</div>
                        </div>
                        <ProcessList
                            data={list}
                            total={total}
                            is_calculate={is_calculate}
                            isMore={isMore}
                            onFetch={this.onFetch}
                            onShowReceipt={this.onShowReceipt}
                            onShowPassOrigin={this.onShowPassOrigin}
                            onShowPassComplete={this.onShowPassComplete}
                            onShowReservation={this.onShowReservation}
                            onShowReservationCancel={this.onShowReservationCancel}
                            onShowUploadPhotos={this.onShowUploadPhotos}
                            onShowCustomPhotos={this.onShowCustomPhotos}
                            onShowReply={this.onShowReply}
                            onShowCalculateInfo={this.onShowCalculateInfo}
                            onMoveChat={this.onMoveChat}
                        />
                        {status === PROCESS_BREADCRUMB_CODE.PREPARE ?
                            <div className="upload__alert">
                                <h4 className="upload__alert__title">업로드 시 확인해주세요!</h4>
                                <p className="upload__alert__text">
                                    업로드가 불가능 한 경우 이메일, 웹하드 등을 이용하여 전달하신 후 진행현황의 외부업로드 기능을 이용해주세요.<br />
                                    외부노출에 민감한 사진의 경우 외부 전달 방법을 통해 전달해주세요.
                                </p>
                            </div> : null
                        }
                    </div> :
                    <div className="process__list">
                        <div className="empty__list">
                            <h4 className="h4">진행 중인 내용이 없어요.</h4>
                            <p className="h5-caption empty__caption">작가님의 예약페이지를 홍보하세요.</p>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

PhotographProcessPage.contextTypes = {
    router: routerShape
};

PhotographProcessPage.propTypes = {
};

export default PhotographProcessPage;
