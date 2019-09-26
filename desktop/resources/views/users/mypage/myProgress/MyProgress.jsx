import "./myProgress.scss";
import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import update from "immutability-helper";

// global constant
import constant from "shared/constant";

// global utils
import mewtime from "forsnap-mewtime";
import API from "forsnap-api";
import utils from "forsnap-utils";
import redirect from "forsnap-redirect";
import auth from "forsnap-authentication";

import { PROCESS_BREADCRUMB_CODE, PROCESS_BREADCRUMB, COMBINE_PROCESS_BREADCRUMB } from "shared/constant/reservation.const";

// common component
import PopModal from "shared/components/modal/PopModal";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Img from "shared/components/image/Img";

import Input from "desktop/resources/components/form/Input";
import Icon from "desktop/resources/components/icon/Icon";
import Profile from "desktop/resources/components/image/Profile";
import Buttons from "desktop/resources/components/button/Buttons";
import Dropdown from "desktop/resources/components/form/Dropdown";

// page components
import StatusUpload from "./component/StatusUpload";
import StatusCustom from "./component/StatusCustom";
import StatusComplete from "./component/StatusComplete";
import PopupReceipt from "desktop/resources/components/pop/popup/PopupReceipt";

//이미지 서버 경로
const imagePath = __SERVER__.img;
//예약현황이 없을때 로딩할 이미지 경로
const noneReserve = `${imagePath}/common/none_visual.png`;
import RequestJS from "shared/components/quotation/request/QuotationRequest";
// import A from "shared/components/link/A";

import ModifyDateModal from "./component/ModifyDateModal";
import StatusBreadcrumb from "./component/StatusBreadcrumb";

class MyProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumb: {},
            status: this.findStatus(props.params ? props.params.status : null),
            lists: [],
            list: [],
            data: {
                offset: 0,
                isMore: true,
                list: []
            },
            limit: 10,
            userType: "U",
            customCount: 0,
            productNo: "",
            offerNo: "",
            buyNo: "",
            optionType: "",
            isPhotoView: false,      // 사진확인 버튼 눌렀을 때 동작
            isComplete: false,
            msg: "",                 // 취소 메시지 입력
            fullSliderData: {},
            // banks: constant.BANK,
            banks: constant.REFUND_BANK,
            vbank_user_name: "",
            vbank_num: "",
            vbank_code: "",
            // vbank_code: "",
            enter: props.enter
        };

        this.onFetch = this.onFetch.bind(this);
        this.onModifyDate = this.onModifyDate.bind(this);
        this.onPassOriginComplete = this.onPassOriginComplete.bind(this);
        this.onMoveChat = this.onMoveChat.bind(this);
        this.apiReserveList = this.apiReserveList.bind(this);
        this.reloadList = this.reloadList.bind(this);
        this.moveStatus = this.moveStatus.bind(this);
        this.reserveCancel = this.reserveCancel.bind(this);
        this.photoCheckByUpload = this.photoCheckByUpload.bind(this);
        this.photoCheckByCustom = this.photoCheckByCustom.bind(this);
        this.createTable = this.createTable.bind(this);
        this.createPhotoView = this.createPhotoView.bind(this);
        this.composeComment = this.composeComment.bind(this);
        this.setMsgValue = this.setMsgValue.bind(this);
        this.popReceipt = this.popReceipt.bind(this);

        this.setMsgVbankName = this.setMsgVbankName.bind(this);
        this.setMsgVbankAccount = this.setMsgVbankAccount.bind(this);
        // this.setVbankName = this.setVbankName.bind(this);
        this.setVbankCode = this.setVbankCode.bind(this);
        this.findStatus = this.findStatus.bind(this);
    }

    componentWillMount() {
        const bankList = this.state.banks;

        if (bankList) {
            bankList.unshift({ name: "은행명을 선택해주세요.", value: "" });
        }

        this.setState({
            bankList
        });
    }

    componentDidMount() {
        this.onFetch(0);
    }

    componentWillReceiveProps(nextProps) {
        // if (np.params.status && np.params.status.toLowerCase() !== this.state.status.toLowerCase()) {
        //     this.onChangeStatus(np.params.status);
        // }
    }

    onFetch(offset, limit) {
        const { status } = this.state;
        this.apiReserveList(COMBINE_PROCESS_BREADCRUMB[status].status.join(","), offset, limit);
    }

    onModifyDate(e, buy_no, date_alter_no) {
        e.stopPropagation();
        e.preventDefault();

        const modalName = "pop_modify_date_confirm";
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            name: modalName,
            content: <ModifyDateModal onConfirm={() => this.modifyDate(buy_no, date_alter_no)} onCancel={() => Modal.close(modalName)} />
        });
    }

    onPassOriginComplete(data) {
        PopModal.confirm(
            "사진을 전달받았다면 최종완료를 해주세요.",
            () => {
                const form = {};

                if (data.product_no) {
                    form.product_no = data.product_no;
                }

                API.reservations.photoBuyComplete(data.buy_no, form)
                    .then(response => {
                        PopModal.alert("촬영이 완료되었습니다.");
                        this.reloadList();
                    });
            }
        );
    }

    onMoveChat(data) {
        const router = this.context.router;
        let url = null;

        if (data.reserve_type === "PRODUCT") {
            url = `/users/chat/${data.artist_id}/${data.product_no}`;
        } else if (data.reserve_type === "OFFER") {
            url = `/users/chat/${data.artist_id}/offer/${data.offer_no}`;
        }

        if (url) {
            if (router) {
                router.push(url);
            } else {
                window.location.href = url;
            }
        }
    }

    /**
     * 취소사유 입력
     * @param e
     * @param value
     */
    setMsgValue(e, value) {
        this.setState({
            msg: value
        });
    }

    setMsgVbankName(e, value) {
        this.setState({ vbank_user_name: value });
    }

    setMsgVbankAccount(e, value) {
        this.setState({ vbank_num: value });
    }

    setVbankCode(list, value) {
        const bankIndex = list.findIndex(obj => {
            return obj.value === value;
        });

        this.setState({
            vbank_code: list[bankIndex].value
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

    modifyDate(buy_no, date_alter_no) {
        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });
        API.reservations.confirmModifyDate(buy_no, date_alter_no)
            .then(response => {
                Modal.close(MODAL_TYPE.PROGRESS);
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "촬영일이 변경되었습니다.",
                    onSubmit: () => {
                        this.reloadList();
                        Modal.close();
                    }
                });
            })
            .catch(error => {
                Modal.close(MODAL_TYPE.PROGRESS);
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak(error.data)
                    });
                }
            });
    }

    // setVbankName(list, value) {
    //     const bankIndex = list.findIndex(obj => {
    //         return obj.value === value;
    //     });
    //
    //     this.setState({
    //         vbank_name: list[bankIndex].name
    //     });
    // }

    /**
     * 환급에 대한 데이터를 생성
     * @param isReady
     * @param isPayment
     * @param isPrepare
     * @param reserve_dt
     * @param price
     * @returns {{refund_able: boolean, refund_msg: string}}
     */

    getRefundData({ isReady, isPayment, isPrepare, reserve_dt, price }) {
        let refund_able = true;
        let refund_cost = 0;
        // let refund_date = "30일전";
        // let refund_ratio = "100%";

        let refund_msg = "";

        if (!isReady) {
            if (isPayment && !isPrepare) {
                refund_msg = (
                    <p className="refund-info-message">{`${utils.format.price(price)}원이 환불됩니다.`}</p>
                );
            } else if (!isPayment && isPrepare) {
                const toDay = new Date();
                const dateObj = new Date(reserve_dt[0], Number(reserve_dt[1]) - 1, reserve_dt[2]);
                const betweenDay = parseInt(-(toDay.getTime() - dateObj.getTime()) / 1000 / 60 / 60 / 24, 10) + 1;

                if (betweenDay > 30) {
                    refund_cost = price;
                } else if (betweenDay > 14) {
                    refund_cost = price * 0.5;
                    // refund_date = "14일전";
                    // refund_ratio = "50%";
                } else if (betweenDay > 7) {
                    refund_cost = price * 0.2;
                    // refund_date = "7일전";
                    // refund_ratio = "20%";
                } else {
                    refund_able = false;
                }

                refund_msg = (
                    <p className="refund-info-message">{utils.linebreak(`${utils.format.price(refund_cost)}원이 환불됩니다.`)}</p>
                    // <p className="refund-info-message">{utils.linebreak(`예약 ${refund_date}이전 결제취소로 ${refund_ratio} 금액 ${utils.format.price(refund_cost)}이 환불됩니다.\n취소하시겠습니까?`)}</p>
                );
            }
        }

        const returnData = {
            refund_able,
            refund_msg
        };

        return returnData;
    }

    // API 예약목록 가져오기
    apiReserveList(status, offset, limit) {
        const { userType } = this.state;

        API.reservations.reserveList(status, userType, offset, limit || this.state.limit)
            .then(response => {
                const data = response.data;

                this.setState(({ list }) => {
                    const prop = {
                        breadcrumb: data.count_list
                    };

                    if (limit) {
                        prop.list = data.list;
                    } else {
                        const merge = utils.mergeArrayTypeObject(list, data.list, ["no"], ["no"], true);
                        prop.list = merge.list;
                    }

                    return prop;
                });
            }).catch(error => {
                PopModal.alert(error.data);
            });
    }

    /**
     * 진행상황 탭 변경
     */
    changeStatus(value) {
        const { status, isPhotoView, isComplete } = this.state;
        if (value.toUpperCase() !== status.toUpperCase() || isPhotoView || isComplete) {
            this.setState(() => {
                return {
                    list: [],
                    status: value.toUpperCase(),
                    isPhotoView: false,
                    isComplete: false,
                    upload_status: ""
                };
            }, () => {
                this.onFetch(0);
            });
        }
    }

    /**
     * 현재 리스트 갱신
     */
    reloadList() {
        this.setState({
            isPhotoView: false,
            isComplete: false
        }, () => {
            const { list } = this.state;
            this.onFetch(0, list.length);
        });
    }

    /**
     * 취소하기 버튼 구현
     * 이슈사항 -> 취소이유가 대화하기 방에 안 적힘
     * @param item
     */
    reserveCancel(item) {
        const isReady = item.status_type === "READY";
        const isPayment = item.status_type === "PAYMENT";
        const isPrepare = item.status_type === "PREPARE";
        const price = item.total_price;
        const reserve_dt = item.reserve_dt.split("-");
        const isVbank = item.pay_type === "vbank";
        let content;

        const cancel_data = {
            buy_no: item.buy_no,
            product_no: item.product_no,
            user_type: "U"
        };

        const refund_params = { isReady, isPayment, isPrepare, price, reserve_dt };
        const refundData = this.getRefundData({ ...refund_params });

        if (!isVbank || (isVbank && isReady)) {
            content = this.cancelContentBasic(isReady, refundData.refund_msg, cancel_data);
        } else {
            content = this.cancelContentVbank(isReady, refundData.refund_msg, cancel_data);
        }

        if (refundData.refund_able) {
            PopModal.createModal("reserveCancel", content);
            PopModal.show("reserveCancel");
        } else {
            PopModal.alert("촬영일 기준 7일 이내 결제취소는 불가능합니다.\n작가님과 협의해주세요.");
        }
    }

    cancelContentBasic(isReady, msg, data) {
        return (
            <div className="reserve-cancel">
                <p className="h6 cancel-msg"><strong>취소하시는 이유</strong>를 입력해주세요.</p>
                {!isReady ? msg : null}
                <Input inputStyle={{ width: "w412" }} inline={{ placeholder: "취소이유를 입력해주세요.", onChange: this.setMsgValue }} />
                <div className="cancel-btn">
                    <Buttons buttonStyle={{ width: "w412", shape: "circle", theme: "default" }} inline={{ onClick: () => this.cancelBtn(data) }} >확인</Buttons>
                </div>
            </div>
        );
    }

    cancelContentVbank(isReady, msg, data) {
        const { bankList, vbank_code } = this.state;
        return (
            <div className="reserve-cancel-vbank">
                <p className="h6 cancel-msg"><strong>취소하시는 이유</strong>를 입력해주세요.</p>
                {!isReady ? msg : null}
                <Input inputStyle={{ width: "block" }} inline={{ placeholder: "취소이유를 입력해주세요.", onChange: this.setMsgValue }} />
                <Dropdown list={bankList} select={vbank_code} width="block" resultFunc={value => this.setVbankCode(bankList, value)} />
                <div className="vbank-account">
                    <Input inputStyle={{ width: "w175", shape: "default" }} inline={{ placeholder: "예금주", maxLength: 10, type: "text", onChange: this.setMsgVbankName }} />
                    <Input inputStyle={{ width: "w276", shape: "default" }} type="number" inline={{ placeholder: "계좌번호", maxLength: 20, onChange: this.setMsgVbankAccount }} />
                    <p className="vbank-account-alert"><span className="exclamation">!</span> 입금자와 동일명의의 계좌만 가능합니다.</p>
                </div>
                <div className="cancel-btn">
                    <Buttons buttonStyle={{ width: "block", shape: "circle", theme: "default" }} inline={{ onClick: () => this.cancelBtn(data, "vbnak") }} >확인</Buttons>
                </div>
                <div className="info-prepare">
                    <p className="title">포스냅에서 알려드립니다.</p>
                    <p className="description">무통장 입금 취소시 환불 계좌 정보 (예금주, 은행, 계좌번호) 추가 입력해야 합니다.<br />
                        입금자와 동일명의의 계좌만 가능합니다.
                    </p>
                </div>
            </div>
        );
    }

    /**
     * PopUp 취소 버튼
     * @param item
     */
    cancelBtn(item, type = "") {
        const { vbank_user_name, vbank_num, vbank_code } = this.state;
        const itemData = {
            product_no: item.product_no || "",
            user_type: item.user_type,
            comment: this.state.msg,
            vbank_code: vbank_code || "",
            vbank_num: vbank_num || "",
            vbank_user_name: vbank_user_name || ""
        };

        if (this.cancelVaildation(itemData, type)) {
            const request = API.reservations.reserveCancel(item.buy_no, itemData);
            request.then(response => {
                if (response.status === 200) {
                    PopModal.toast("취소되셨어요<br />좋은 서비스가 되도록 노력하겠습니다.");
                    this.reloadList();
                    PopModal.close("reserveCancel");
                }
            }).catch(error => {
                const filer = /^<[\w\W=":]>*.*<\/[\w\W]>$/gm;
                if (error && error.data && !filer.test(error.data)) {
                    PopModal.alert(error.data);
                } else {
                    PopModal.alert("취소중 에러가 발생했습니다\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.");
                }
            });
        }
    }

    cancelVaildation(data, type) {
        let flag = false;
        let msg;
        if (!data.comment) {
            msg = "취소이유를 알려주세요.";
        } else if (type !== "") {
            if (!data.vbank_code) {
            // if (!data.vbank_code) {
                msg = "환불받을 은행을 선택해 주세요.";
            } else if (!data.vbank_user_name) {
                msg = "예금주 명을 입력해주세요.\n 입금자와 동일명의의 계좌만 가능합니다.";
            } else if (!data.vbank_num) {
                msg = "계좌번호를 입력해주세요.";
            } else {
                flag = true;
            }
        } else {
            flag = true;
        }

        if (!flag) {
            PopModal.alert(msg);
        }

        return flag;
    }

    /**
     * 원본사진 목록 페이지
     * @param obj
     */
    photoCheckByUpload(obj) {
        const buy_no = obj.buy_no;
        const product_no = obj.product_no;
        const offer_no = obj.offer_no;
        const reserve_type = obj.reserve_type;
        const option_type = obj.option_type;
        const due_date = obj.due_date || "";
        const customCount = obj.custom_cnt || "";
        const fullSliderData = {
            title: obj.title,
            profile_img: obj.profile_img,
            nick_name: obj.nick_name
        };

        this.setState({
            isPhotoView: true,
            buyNo: buy_no,
            productNo: product_no,
            optionType: option_type,
            offerNo: offer_no,
            reserveType: reserve_type,
            due_date,
            customCount,
            fullSliderData,
            upload_status: "UPLOAD"
        });
    }

    /**
     * 보정사진 목록 페이지
     * @param obj
     */
    photoCheckByCustom(obj) {
        const buy_no = obj.buy_no;
        const product_no = obj.product_no;
        const offer_no = obj.offer_no;
        const reserve_type = obj.reserve_type;
        const option_type = obj.option_type;
        const due_date = obj.due_date || "";
        const fullSliderData = {
            title: obj.title,
            profile_img: obj.profile_img,
            nick_name: obj.nick_name
        };

        this.setState({
            isPhotoView: true,
            buyNo: buy_no,
            productNo: product_no,
            optionType: option_type,
            offerNo: offer_no,
            reserveType: reserve_type,
            due_date,
            fullSliderData,
            upload_status: "CUSTOM"
        });
    }

    /**
     * 완료하기버튼 클릭 시 콜백
     * breadcrumb 상태이동
     * @param count
     * @param status
     */
    moveStatus(count, status) {
        this.changeStatus(this.findStatus(status));

        this.setState({
            isPhotoView: false,
            isComplete: true,
            customCount: count
        }, () => {
            if (status !== "COMPLETE") {
                this.reloadList();
            }
        });
    }

    /**
     * 원본사진 보기, 보정사진 보기 페이지 이동
     * @returns {Array}
     */
    createPhotoView() {
        const { upload_status, buyNo, productNo, fullSliderData, due_date } = this.state;
        const data = {
            buy_no: buyNo,
            product_no: productNo,
            due_date,
            fullSliderData
        };
        // const status = this.state.stepData.value;
        // const buyNo = this.state.buyNo;
        // const productNo = this.state.productNo;
        // const fullSliderData = this.state.fullSliderData;
        // const due_date = this.state.due_date;
        //
        // const data = {
        //     buyNo,
        //     productNo,
        //     due_date,
        //     fullSliderData
        // };
        // const optionType = this.state.optionType;
        const content = [];

        if (upload_status === "UPLOAD") {
            content.push(<StatusUpload {...data} completeFunc={c => { this.moveStatus(c, "COMPLETE"); }} closeFunc={() => { this.moveStatus(0, "CUSTOM"); }} key="uploadPage" />);
        } else if (upload_status === "CUSTOM") {
            content.push(<StatusCustom {...data} completeFunc={c => { this.moveStatus(c, "COMPLETE"); }} key="customPage" />);
        }

        return content;
    }

    /**
     * 완료하기 후 동작
     * 원본이나 보정사진이후 완료버튼 눌렀을 시 후기등록화면으로 바로 이동
     * 후기미등록시 최종전달 탭에서 후기작성하기 버튼으로 이동
     */
    createComplete() {
        const buyNo = this.state.buyNo;
        const productNo = this.state.productNo;
        const offerNo = this.state.offerNo;
        const customCount = this.state.customCount;
        const reserveType = this.state.reserveType;
        return <StatusComplete reserveType={reserveType} buyNo={buyNo} productNo={productNo} offerNo={offerNo} customCount={customCount} closeFunc={() => { this.reloadList(); }} key="completePage" />;
    }

    /**
     * 후기 데이터 조합
     * @param obj
     */
    composeComment(obj) {
        const buy_no = obj.buy_no;
        const product_no = obj.product_no;
        const offer_no = obj.offer_no;
        const reserve_type = obj.reserve_type;
        const custom_cnt = obj.custom_cnt;
        this.setState({
            isPhotoView: false,
            isComplete: true,
            optionType: obj.option_type,
            reserveType: reserve_type,
            buyNo: buy_no,
            productNo: product_no,
            offerNo: offer_no,
            customCount: custom_cnt
        }, () => {
            this.createComplete();
        });
    }

    /**
     * 결제내역 팝업
     * @param obj
     */
    popReceipt(obj) {
        const modalName = "popup-receipt";

        // const status = (this.state.stepData && this.state.stepData.value) || "PAYMENT";
        const status = obj.state_type || "PAYMENT";

        PopModal.createModal(modalName, <PopupReceipt data={obj} status={status} />, { callBack: () => this.reloadList() });
        PopModal.show(modalName);
    }

    popPgReceipt(url) {
        const windowClone = window;
        windowClone.name = "forsnap";
        windowClone.open(url, "_blank", "top=200, left=200, width=420, height=550");
    }

    redirectProduct(obj, order_no = "") {
        const { enter } = this.props;
        const enter_session = sessionStorage.getItem(constant.USER.ENTER);
        let url = `/products/${obj.product_no}`;
        const category = obj.category || obj.order_info.category;
        let targetWindow = window;
        const user = auth.getUser();

        if (order_no !== "") {      // 견적상품이면 url 변경
            if (obj.order_info && obj.order_info.user_id !== user.id) {
                url = `/users/estimate/${order_no}/offer/${obj.offer_no}`;
            } else {
                url = `/users/estimate/${order_no}/content`;
            }
        }

        if (typeof enter === "string" && enter === "indi" && enter_session) {
            if (order_no !== "") {
                browserHistory.push(url);
                return;
            }
            if (obj.product_no) {
                redirect.productOne(obj.product_no);
                return;
            }
        }

        if (!utils.checkCategoryForEnter(category)) {
            targetWindow = window.open();
            targetWindow.opener = null;
            targetWindow.location.href = `${url}?new=true`;
        } else {
            targetWindow.location.href = `${url}?biz=true`;
        }
    }

    /**
     * 기본 테이블 생성
     * @returns {Array}
     */
    createTable() {
        const { status, list, breadcrumb } = this.state;
        const content = [];
        const process = COMBINE_PROCESS_BREADCRUMB[status];
        const find = this.findStatus(status);
        const total = COMBINE_PROCESS_BREADCRUMB[find].status.reduce((r, o) => {
            return r + Number(breadcrumb[o]);
        }, 0);

        if (utils.isArray(list)) {
            content.push(
                <div key="progressInfo">
                    <div className="process__title">
                        <div className="title" data-count={total}>{process.name}</div>
                    </div>
                    <div className="process__list">
                        <table className="_table">
                            <colgroup>
                                <col width="140" />
                                <col width="160" />
                                <col width="140" />
                                <col />
                                <col width="170" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>주문번호</th>
                                    <th>총결제금액</th>
                                    <th>작가명</th>
                                    <th>상품정보</th>
                                    <th>진행현황</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((item, idx) => {
                                    const buyNo = item.buy_no;
                                    const totalPrice = item.total_price;
                                    const isAddition = ["TALK_CUSTOM", "TALK_EXTRA"].indexOf(item.option_type) !== -1;
                                    const alterInfo = item.date_alter_info || null;
                                    const isStatus = ["READY", "PAYMENT", "PREPARE"].indexOf(item.status_type) !== -1;
                                    let title = <a href={`/products/${item.product_no}`} target="_blank">{item.title}</a>;
                                    let reserveDate = item.reserve_dt;
                                    let afterDate = null;
                                    let alter_status = false;
                                    let alter_no = null;

                                    if (alterInfo && Array.isArray(alterInfo) && alterInfo.length) {
                                        const alter = alterInfo.reduce((r, o) => {
                                            if (!r || r.no < o.no) {
                                                return o;
                                            }

                                            return r;
                                        });
                                        afterDate = alter.after_date;
                                        alter_status = alter.status === "REQUEST";
                                        alter_no = alter.no;
                                    }

                                    const contentAccount = [];
                                    if (status === "READY") {
                                        contentAccount.push(
                                            <div key="progressAccountText">
                                                <div className="dots"><Icon name="small_dots" /></div>
                                                <div className="bank_name">{item.vbank_name}</div>
                                                <div className="bank_num">{item.vbank_num}</div>
                                                <div className="due_date">만료일 <span>{item.vbank_date}</span> 까지</div>
                                            </div>
                                        );
                                    } else {
                                        contentAccount.push(
                                            null
                                        );
                                    }

                                    switch (item.option_type) {
                                        case "OFFER":
                                        case "ORDER": {
                                            const orderInfo = item.order_info || {};
                                            reserveDate = "미정";
                                            title = "촬영견적";

                                            if (item.reserve_dt && item.reserve_dt !== "0000-00-00") {
                                                reserveDate = item.reserve_dt;
                                            } else if (orderInfo) {
                                                if (utils.isDate(orderInfo.date)) {
                                                    reserveDate = mewtime.strToDate(orderInfo.date);
                                                } else if (RequestJS.isDateOption(orderInfo.date)) {
                                                    reserveDate = orderInfo.date;
                                                }
                                            }
                                            break;
                                        }
                                        case "TALK_CUSTOM": {
                                            title = <a role="button" onClick={() => this.onMoveChat(item)}>맞춤결제</a>;
                                            break;
                                        }
                                        default:
                                            break;
                                    }


                                    return (
                                        <tr key={buyNo}>
                                            <td className="no">
                                                {utils.format.formatByNo(buyNo)}
                                                {item.status_type !== PROCESS_BREADCRUMB_CODE.READY ? [
                                                    <button key={`receipt_${buyNo}`} className="_button _button__white" onClick={() => this.popReceipt(item)}>결제내역</button>,
                                                    item.pg_receipt && <button key={`pg_receipt_${buyNo}`} className="_button _button__white" onClick={() => this.popPgReceipt(item.pg_receipt)}>결제영수증 확인</button>]
                                                    : null
                                                }
                                            </td>
                                            <td className="price">
                                                <div className="pay-price">{`${utils.format.price(totalPrice)}원`}</div>
                                                {item.pay_type === "vbank" ? contentAccount : null}
                                            </td>
                                            <td>{item.nick_name}</td>
                                            <td>
                                                <div className="process__product__info">
                                                    <div className="info__profile">
                                                        <Img image={{ src: item.thumb_img, content_width: 504, content_height: 504 }} />
                                                    </div>
                                                    <div className="info__content">
                                                        <div className="title">{title}</div>
                                                        <div className="description">
                                                            <p className="date">
                                                                촬영일 : {reserveDate}
                                                            </p>
                                                            {status && alter_status && utils.isDate(afterDate) ?
                                                                <p className="date">
                                                                    변경예정 {afterDate}
                                                                    <button className="_button _button__white" onClick={e => this.onModifyDate(e, item.buy_no, alter_no)}>예약변경</button>
                                                                </p> : null
                                                            }
                                                        </div>
                                                        <div className="buttons dashed">
                                                            <button className="_button _button__white" onClick={() => this.onMoveChat(item)}>대화방 바로가기</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="status">
                                                {this.renderStatus(item)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {list && list.length < total ?
                            <div className="list__more">
                                <button className="_button _button__default" onClick={() => this.onFetch(list.length)}>더보기</button>
                            </div> : null
                        }
                    </div>
                </div>
            );
        } else {
            content.push(
                <div className="reserveNull" key="noneReserve">
                    <div className="reserveNull__text">
                        <p className="h3 null-title">진행 중인 내용이 없어요.</p>
                        <p className="h6">과거 주문하신 내역은 서비스 이용내역에서 확인해 주시기 바랍니다.</p>
                    </div>
                    <div className="reserveNull__image">
                        <img src={noneReserve} alt="none reserve" />
                    </div>
                </div>
            );
        }

        return content;
    }

    renderStatus(item) {
        const breadcrumb = PROCESS_BREADCRUMB[item.status_type] || null;
        const content = [];

        if (breadcrumb) {
            content.push(breadcrumb.user_text);
        }

        switch (item.status_type) {
            case PROCESS_BREADCRUMB_CODE.READY:
            case PROCESS_BREADCRUMB_CODE.PAYMENT:
            case PROCESS_BREADCRUMB_CODE.PREPARE:
                content.push(
                    <div key={PROCESS_BREADCRUMB_CODE.PREPARE}>
                        <button className="_button _button__white reserve__cancel" onClick={() => this.reserveCancel(item)}>취소하기</button>
                    </div>
                );
                break;
            case PROCESS_BREADCRUMB_CODE.SHOT:
                break;
            case PROCESS_BREADCRUMB_CODE.UPLOAD:
            case PROCESS_BREADCRUMB_CODE.CUSTOM:
                content.push(
                    <div key={PROCESS_BREADCRUMB_CODE.UPLOAD}>
                        <button className="_button _button__white" onClick={() => this.photoCheckByUpload(item)}>확인하기</button>
                    </div>
                );
                break;
            case PROCESS_BREADCRUMB_CODE.REQ_CUSTOM:
                break;
            case PROCESS_BREADCRUMB_CODE.RES_CUSTOM:
                content.push(
                    <div key={PROCESS_BREADCRUMB_CODE.UPLOAD}>
                        <button className="_button _button__white" onClick={() => this.photoCheckByCustom(item)}>확인하기</button>
                        {utils.isDate(item.due_date) ? [
                                <div key="dots" className="dots"><Icon name="small_dots" /></div>,
                                <div key="due_date" className="due_date">최종완료예정일 <span>{item.due_date}</span></div>]
                            : null
                        }
                    </div>
                );
                break;
            case PROCESS_BREADCRUMB_CODE.REQ_COMPLETE:
                content.push(
                    <div key={PROCESS_BREADCRUMB_CODE.REQ_COMPLETE}>
                        <button className="_button _button__white" onClick={() => this.onPassOriginComplete(item)}>완료하기</button>
                        {utils.isDate(item.due_date) ? [
                            <div key="dots" className="dots"><Icon name="small_dots" /></div>,
                            <div key="due_date" className="due_date">최종완료예정일 <span>{item.due_date}</span></div>]
                            : null
                        }
                    </div>
                );
                break;
            case PROCESS_BREADCRUMB_CODE.COMPLETE:
                content.push(
                    <div key={PROCESS_BREADCRUMB_CODE.COMPLETE}>
                        {!item.review_no ?
                            <button className="_button _button__white" onClick={() => this.composeComment(item)}>후기작성하기</button> : null
                        }
                    </div>
                );
                break;
            default:
                break;
        }

        return (
            <div key={`status_${item.no}`} className="status">
                {content}
            </div>
        );
    }

    render() {
        const { breadcrumb, status, isPhotoView, isComplete } = this.state;
        const content = [];

        if (!isPhotoView && !isComplete) {
            content.push(this.createTable());
        } else if (isPhotoView && !isComplete) {
            content.push(this.createPhotoView());
        } else if (!isPhotoView && isComplete) {
            content.push(this.createComplete());
        }

        return (
            <div className="progress-page" key="resultContainer">
                <div className="progress-breadcrumb">
                    <StatusBreadcrumb status={status} breadcrumb={breadcrumb} onClick={value => this.changeStatus(value)} />
                </div>
                {content}
            </div>
        );
    }
}

export default MyProgress;
