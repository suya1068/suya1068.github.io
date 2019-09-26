import "./myProgress.scss";
import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import update from "immutability-helper";
import Breadcrumb from "desktop/resources/components/breadcrumb/Breadcrumb";

// global constant
import constant from "shared/constant";

// global utils
import mewtime from "forsnap-mewtime";
import API from "forsnap-api";
import utils from "forsnap-utils";
import redirect from "forsnap-redirect";

// common component
import PopModal from "shared/components/modal/PopModal";
import Input from "desktop/resources/components/form/Input";
import Icon from "desktop/resources/components/icon/Icon";
import Profile from "desktop/resources/components/image/Profile";
import Buttons from "desktop/resources/components/button/Buttons";
import Dropdown from "desktop/resources/components/form/Dropdown";

// page components
import StatusUpload_backup_20180530 from "./component/StatusUpload_backup_20180530";
import StatusCustom_backup_20180530 from "./component/StatusCustom_backup_20180530";
import StatusComplete from "./component/StatusComplete";
import PopupReceipt from "desktop/resources/components/pop/popup/PopupReceipt";

import "desktop/resources/components/table/table.scss";

//이미지 서버 경로
const imagePath = __SERVER__.img;
//예약현황이 없을때 로딩할 이미지 경로
const noneReserve = `${imagePath}/common/none_visual.png`;
import RequestJS from "shared/components/quotation/request/QuotationRequest";
// import A from "shared/components/link/A";

class MyProgress_backup_20180530 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumb: [],
            stepData: {},
            lists: [],
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
            banks: constant.BANK,
            vbank_user_name: "",
            vbank_num: "",
            vbank_name: "",
            enter: props.enter
        };
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

        this.apiFirstReserveList = this.apiFirstReserveList.bind(this);

        this.setMsgVbankName = this.setMsgVbankName.bind(this);
        this.setMsgVbankAccount = this.setMsgVbankAccount.bind(this);
        this.setVbankName = this.setVbankName.bind(this);
    }

    componentWillMount() {
        const bankList = this.state.banks;
        const params = this.props.params;
        const keys = [];
        const breadcrumb = constant.BREADCRUMB.SEND_TYPE.reduce((result, obj) => {
            obj.callBack = data => this.changeStatus(data);
            result.push(obj);
            keys.push(obj.value);
            return result;
        }, []);

        this.state.breadcrumb = breadcrumb;

        if (bankList) {
            bankList.unshift({ name: "은행명을 선택해주세요.", value: "" });
        }

        this.setState({
            bankList
        });

        if (params.status && keys.indexOf(params.status.toUpperCase()) !== -1) {
            this.state.stepData = breadcrumb.find(obj => { return obj.value === params.status.toUpperCase(); });
        } else {
            this.state.stepData = breadcrumb[0];
        }
    }

    componentDidMount() {
        if (this.props.params.status) {
            this.apiReserveList(this.state.data.offset, this.state.limit);
        } else {
            this.apiFirstReserveList();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.status && nextProps.params.status !== this.state.stepData.value.toLowerCase()) {
            this.changeStatus(this.state.breadcrumb.find(obj => { return obj.value.toLowerCase() === nextProps.params.status.toLowerCase(); }));
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

    setVbankName(list, value) {
        const bankIndex = list.findIndex(obj => {
            return obj.value === value;
        });
        this.setState({
            vbank_name: list[bankIndex].name
        });
    }

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

    apiFirstReserveList() {
        const stepData = this.state.stepData;
        const userType = this.state.userType;

        const request = API.reservations.reserveList(stepData.value, userType, 0, 10);
        request.then(response => {
            const data = response.data;
            const countList = data.count_list;
            let breadcrumb = this.state.breadcrumb;

            breadcrumb = breadcrumb.reduce((result, obj) => {
                const count = countList[obj.value];

                if (typeof count !== "undefined" && count > 0) {
                    obj.count = count;
                } else {
                    obj.count = 0;
                }

                result.push(obj);

                return result;
            }, []);

            this.setState({
                breadcrumb
            }, () => {
                if (this.props.params.status === undefined) {
                    const after = breadcrumb.reduce((result, obj) => {
                        if (obj.count !== 0) {
                            result.push(obj);
                        }
                        return result;
                    }, []);
                    if (after.length > 0) {
                        this.state.stepData = after[0];
                        this.apiReserveList(this.state.data.offset, this.state.limit);
                    }
                }
            });
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    // API 예약목록 가져오기
    apiReserveList(offset, limit) {
        const lists = this.state.lists;
        const currentData = this.state.data;
        const stepData = this.state.stepData;
        const userType = this.state.userType;

        const request = API.reservations.reserveList(stepData.value, userType, offset, limit);
        request.then(response => {
            const data = response.data;
            const countList = data.count_list;
            const dataList = data.list || [];
            let breadcrumb = this.state.breadcrumb;

            breadcrumb = breadcrumb.reduce((result, obj) => {
                const count = countList[obj.value];

                if (typeof count !== "undefined" && count > 0) {
                    obj.count = count;
                } else {
                    obj.count = 0;
                }

                result.push(obj);

                return result;
            }, []);

            currentData.isMore = (this.state.limit === limit && dataList.length >= limit);

            if (limit !== this.state.limit) {
                currentData.list = dataList;
            } else {
                const mergeObj = utils.mergeArrayTypeObject(currentData.list, dataList, ["buy_no"], ["buy_no"], true);
                currentData.list = mergeObj.list;
                currentData.offset += mergeObj.count;
            }

            lists[stepData.value] = currentData;

            this.setState({
                breadcrumb,
                data: currentData,
                lists
            });
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    /**
     * breadcrumb 상태변경 시 콜백
     * @param obj
     */
    changeStatus(obj) {
        const stepData = obj;

        if (this.state.stepData === undefined || stepData.value !== this.state.stepData.value) {
            const lists = this.state.lists;
            let currentData = this.state.data;

            if (lists[stepData.value] !== undefined) {
                currentData = lists[stepData.value];
            } else {
                currentData = { offset: 0, list: [], isMore: true };
            }

            const length = currentData.list.length;

            this.setState({
                stepData,
                data: currentData,
                isPhotoView: false,
                isComplete: false
            }, () => {
                this.apiReserveList(0, length > 0 ? length : this.state.limit);
            });
        }
    }

    /**
     * 현재 리스트 갱신
     */
    reloadList() {
        const data = this.state.data;
        const offset = 0;
        const limit = data.list.length;

        this.setState({
            data: update(data, { offset: { $set: 0 }, list: { $set: [] } }),
            isPhotoView: false,
            isComplete: false
        }, () => {
            this.apiReserveList(offset, limit);
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
        const { bankList, vbank_name } = this.state;
        return (
            <div className="reserve-cancel-vbank">
                <p className="h6 cancel-msg"><strong>취소하시는 이유</strong>를 입력해주세요.</p>
                {!isReady ? msg : null}
                <Input inputStyle={{ width: "block" }} inline={{ placeholder: "취소이유를 입력해주세요.", onChange: this.setMsgValue }} />
                <Dropdown list={bankList} select={vbank_name} width="block" resultFunc={value => this.setVbankName(bankList, value)} />
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
        const { vbank_user_name, vbank_num, vbank_name } = this.state;
        const itemData = {
            product_no: item.product_no || "",
            user_type: item.user_type,
            comment: this.state.msg,
            vbank_name: vbank_name || "",
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
            if (!data.vbank_name) {
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
            fullSliderData
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
            fullSliderData
        });
    }

    /**
     * 완료하기버튼 클릭 시 콜백
     * breadcrumb 상태이동
     * @param count
     * @param status
     */
    moveStatus(count, status) {
        const breadcrumb = this.state.breadcrumb;

        const data = breadcrumb.find(obj => {
            return obj.value === status;
        });

        this.changeStatus(data);

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
        const status = this.state.stepData.value;
        const buyNo = this.state.buyNo;
        const productNo = this.state.productNo;
        const fullSliderData = this.state.fullSliderData;
        const due_date = this.state.due_date;

        const data = {
            buyNo,
            productNo,
            due_date,
            fullSliderData
        };
        // const optionType = this.state.optionType;
        const content = [];

        if (status === "UPLOAD") {
            content.push(<StatusUpload_backup_20180530 {...data} completeFunc={customCount => { this.moveStatus(customCount, "COMPLETE"); }} closeFunc={() => { this.moveStatus(0, "CUSTOM"); }} key="uploadPage" />);
        } else if (status === "CUSTOM") {
            content.push(<StatusCustom_backup_20180530 {...data} completeFunc={customCount => { this.moveStatus(customCount, "COMPLETE"); }} key="customPage" />);
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

        PopModal.createModal(modalName, <PopupReceipt data={obj} />, { callBack: () => this.reloadList() });
        PopModal.show(modalName);
    }

    redirectProduct(obj, order_no = "") {
        const { enter } = this.props;
        const enter_session = sessionStorage.getItem(constant.USER.ENTER);
        let url = `/products/${obj.product_no}`;
        const category = obj.category || obj.order_info.category;
        let targetWindow = window;

        if (order_no !== "") {      // 견적상품이면 url 변경
            url = `/users/estimate/${order_no}/content`;
        }

        if (typeof enter === "string" && (enter === "naver" || enter === "header") && enter_session) {           // 쿠키가 있느냐
            if (!utils.checkCategoryForEnter(category)) {           // 기업용 카테고리가 아니면
                targetWindow = window.open();
                targetWindow.opener = null;
                targetWindow.location.href = `${url}?new=true`;
            } else {
                targetWindow.location.href = `${url}?biz=true`;
            }
        } else {
            if (order_no !== "") {
                browserHistory.push(url);
                return;
            }
            if (obj.product_no) {
                redirect.productOne(obj.product_no);
            }
        }
    }

    convertTime(time) {
        if (!time || time === "") {
            return "미정";
        }
        const timeUnit = time.split("|");
        const convert = times => {
            const temp = times.reduce((result, unit) => {
                const hour = unit.substr(0, 2);
                const min = unit.substr(2, 2);
                result.push(`${hour}시${min}분`);
                return result;
            }, []);
            return temp.join("~");
        };
        return convert(timeUnit);
    }

    /**
     * 기본 테이블 생성
     * @param stepData
     * @returns {Array}
     */
    createTable() {
        const { stepData, data } = this.state;
        const list = data.list;
        const content = [];

        // if (list.length < 1) {
        //     return null;
        // }

        // if (stepData.count && stepData.count !== 0) {
        if (utils.isArray(list)) {
            content.push(
                <div key="progressInfo">
                    <div className="progress-title">
                        <h3 className="h4-sub" data-count={stepData.count}>{stepData.title}</h3>
                        <p className="h5-caption text-normal">{stepData.caption}</p>
                    </div>
                    <div className="progress-list">
                        <table className="table text-center">
                            <colgroup>
                                <col width="18.5%" />
                                <col width="15.5%" />
                                <col width="49.5%" />
                                <col width="16.5%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>주문번호</th>
                                    <th>총결제금액</th>
                                    <th>상품정보</th>
                                    <th>진행현황</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.list.map((item, idx) => {
                                        const buyNo = item.buy_no;
                                        const totalPrice = item.total_price;
                                        const productInfo = {
                                            nickName: item.nick_name,
                                            title: item.title,
                                            profileImg: item.profile_img,
                                            option: item.option_type,
                                            personCnt: item.person_cnt,
                                            statusType: item.status_type
                                        };
                                        const isAddition = ["TALK_CUSTOM", "TALK_EXTRA"].indexOf(item.option_type) !== -1;
                                        const extraList = item.extra_info;

                                        const dueDate = (<p style={{ paddingTop: "10px" }} key={`dueDate_${idx}`}>{`최종완료 ${item.due_date}`}</p>);
                                        let btnStatus = "";
                                        switch (stepData.value) {
                                            case "READY": case "PAYMENT": case "PREPARE":
                                                btnStatus = <Buttons buttonStyle={{ size: "tiny", width: "w113", shape: "circle", theme: "default" }} inline={{ onClick: () => this.reserveCancel(item) }} >취소하기</Buttons>;
                                                break;
                                            case "UPLOAD":
                                                btnStatus = <Buttons buttonStyle={{ size: "small", width: "w113", shape: "circle", theme: "default" }} inline={{ onClick: () => this.photoCheckByUpload(item) }} >확인하기</Buttons>;
                                                break;
                                            case "CUSTOM":
                                                btnStatus = <Buttons buttonStyle={{ size: "small", width: "w113", shape: "circle", theme: "default" }} inline={{ onClick: () => this.photoCheckByCustom(item) }} >확인하기</Buttons>;
                                                if (productInfo.statusType === "REQ_CUSTOM") {
                                                    btnStatus = "";
                                                    stepData.currProg = "보정준비중";
                                                } else if (productInfo.statusType === "RES_CUSTOM") {
                                                    stepData.currProg = "보정완료";
                                                }
                                                break;
                                            case "COMPLETE":
                                                if (item.review_no === null) {
                                                    btnStatus = <Buttons buttonStyle={{ size: "small", width: "w113", shape: "circle", theme: "default" }} inline={{ onClick: () => this.composeComment(item) }} >후기작성하기</Buttons>;
                                                }
                                                break;
                                            default:
                                        }

                                        const contentAccount = [];
                                        if (stepData.value === "READY" || stepData.value === "PAYMENT") {
                                            contentAccount.push(
                                                <div className="pay-account" key="progressAccountText">
                                                    <div>{item.vbank_name}</div>
                                                    <div><Icon name="small_dots" /></div>
                                                    <div>{item.vbank_num}</div>
                                                    <div className="pay-account--date" style={{ marginTop: "10px" }}>만료일</div>
                                                    <div className="pay-account--date">{item.vbank_date} 까지</div>
                                                </div>
                                            );
                                        } else {
                                            contentAccount.push(
                                                null
                                            );
                                        }

                                        let productContent = (
                                            <div className="simple-content">
                                                <p className="simple-content__name">[{productInfo.nickName}]{productInfo.title}</p>
                                                <p className="simple-content__option">옵션 : {item.option_name}</p>
                                                {isAddition ? null : <p className="simple-content__person">인원 : {productInfo.personCnt}</p>}
                                                <p className="simple-content__person">촬영일 : {item.reserve_dt}</p>
                                            </div>
                                        );

                                        if (item.option_type === "ORDER" && item.order_info) {
                                            const orderInfo = item.order_info;
                                            let date = "미정";

                                            if (RequestJS.isDate(orderInfo.date)) {
                                                date = mewtime.strToDate(orderInfo.date);
                                            } else if (RequestJS.isDateOption(orderInfo.date)) {
                                                date = orderInfo.date;
                                            }

                                            productContent = (
                                                <div className="simple-content">
                                                    <p className="simple-content__name">[{item.nick_name}]{item.title}</p>
                                                    <p className="simple-content__option">옵션 : {item.option_name}</p>
                                                    <p className="simple-content__person">카테고리 : {orderInfo ? orderInfo.category_name || "" : ""}</p>
                                                    <p className="simple-content__person">촬영일: {date}</p>
                                                </div>
                                            );
                                        } else if (item.option_type === "PACKAGE") {
                                            productContent = (
                                                <div className="simple-content">
                                                    <p className="simple-content__name">[{item.nick_name}]{item.title}</p>
                                                    <p className="simple-content__option">패키지명 : {item.option_name}</p>
                                                    <p className="simple-content__person">촬영일: {item.reserve_dt}</p>
                                                </div>
                                            );
                                        }


                                        return (
                                            <tr key={buyNo}>
                                                <td className="td-buyNo">
                                                    {utils.format.formatByNo(buyNo)}
                                                    <div className="receipt">
                                                        <Buttons buttonStyle={{ size: "small", width: "w113", shape: "circle", theme: "default" }} inline={{ onClick: () => this.popReceipt(item) }}>
                                                            결제 내역{utils.isArray(extraList) ? ` ${extraList.length}` : ""}
                                                        </Buttons>
                                                    </div>
                                                </td>
                                                <td className="td-price">
                                                    <div className="pay-method">{constant.PAY_METHOD[item.pay_type].name}</div>
                                                    <div className="pay-price">{`${utils.format.price(totalPrice)}원`}</div>
                                                    {item.pay_type === "vbank" ? contentAccount : null}
                                                </td>
                                                <td className="td-product" style={{ cursor: "pointer" }} onClick={() => this.redirectProduct(item, item.order_info ? item.order_info.no : "")}>
                                                    {/*<a href={`${__DESKTOP__}/products/${item.product_no}`} role="button" rel="noopener">*/}
                                                    <div className="product-info">
                                                        <div className="simple-thumb">
                                                            <Profile image={{ src: productInfo.profileImg }} />
                                                        </div>
                                                        {productContent}
                                                    </div>
                                                    {/*</a>*/}
                                                </td>
                                                <td className="td-progress-state">
                                                    <p>{stepData.currProg}</p>
                                                    {btnStatus}
                                                    {(item.status_type === "RES_CUSTOM" && "UPLOAD") || (item.status_type === "UPLOAD" && parseInt(item.custom_cnt, 10) === 0) ? [dueDate] : null}
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                        <div className="photograph-button-group">
                            <Buttons buttonStyle={{ width: "block", shape: "round", theme: "bg-white" }} inline={{ className: data.isMore ? "" : "hide", onClick: () => this.apiReserveList(data.offset, this.state.limit) }} >더보기</Buttons>
                        </div>
                    </div>
                </div>
            );
        } else {
            content.push(
                <div className="reserveNull" key="noneReserve">
                    <div className="reserveNull__text">
                        <p className="h3 text-bold null-title">진행 중인 내용이 없어요.</p>
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

    render() {
        const { stepData, isPhotoView, isComplete } = this.state;
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
                    <Breadcrumb data={this.state.breadcrumb} isCount value={stepData.value} />
                </div>
                {content}
            </div>
        );
    }
}

export default MyProgress_backup_20180530;
