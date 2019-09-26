import "./orderHistory.scss";
import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
// Global
import utils from "forsnap-utils";
import API from "forsnap-api";
import Auth from "forsnap-authentication";
import redirect from "forsnap-redirect";
import constant from "shared/constant";
import mewtime from "forsnap-mewtime";

import Img from "shared/components/image/Img";

// Component
import PopModal from "shared/components/modal/PopModal";
import PopupReceipt from "desktop/resources/components/pop/popup/PopupReceipt";
import StatusComplete from "desktop/resources/views/users/mypage/myProgress/component/StatusComplete";
// import PhotoView from "./PhotoView";
import PhotoView from "./PhotoView_original";
import RequestJS from "shared/components/quotation/request/QuotationRequest";

class OrderHistory extends Component {
    constructor(props) {
        super(props);
        const userid = Auth.getUser().id;

        const today = mewtime();
        const endDate = today.format("YYYYMMDD");
        const startDate = today.subtract(1, mewtime.const.MONTH).format("YYYYMMDD");

        this.state = {
            userID: userid,
            list: [],
            isMore: true,
            offset: 0,
            limit: 10,
            totalCount: 0,
            userType: "U",
            ////////////////////////
            searchProp: {
                startDate,
                endDate
            },
            isLoading: false,
            isMount: !this._calledComponentWillUnmount,
            enter: props.enter
        };

        this.onMoveChat = this.onMoveChat.bind(this);
        this.onMoreList = this.onMoreList.bind(this);
        this.changeStatusType = this.changeStatusType.bind(this);
        this.popPhotosView = this.popPhotosView.bind(this);
        this.popReceipt = this.popReceipt.bind(this);
        this.resetSearchState = this.resetSearchState.bind(this);
        this.popPgReceipt = this.popPgReceipt.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const searchProp = this.state.searchProp;
        // const startDate = searchProp.startDate.replace(/-/gi, "");
        // const endDate = searchProp.endDate.replace(/-/gi, "");
        // console.log(startDate, endDate);
        // this.apiReserveCompleteList(startDate, endDate, this.state.offset, this.state.limit);
        this.apiReserveCompleteList(searchProp.startDate, searchProp.endDate, this.state.offset, this.state.limit);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.searchProp) !== JSON.stringify(nextProps.searchProp)) {
            this.resetSearchState();
            this.setState({
                searchProp: nextProps.searchProp
            }, () => {
                const searchProp = this.state.searchProp;
                this.apiReserveCompleteList(searchProp.startDate, searchProp.endDate, this.state.offset, this.state.limit);
            });
        }
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

    // 정산목록 더보기
    onMoreList() {
        const searchProp = this.state.searchProp;
        const offset = this.state.offset;
        const limit = this.state.limit;

        this.apiReserveCompleteList(searchProp.startDate, searchProp.endDate, offset, limit);
    }

    resetSearchState() {
        this.setState({
            offset: 0,
            limit: 10
        });
    }

    popPgReceipt(url) {
        const windowClone = window;
        windowClone.name = "forsnap";
        windowClone.open(url, "_blank", "top=200, left=200, width=420, height=550");
    }

    /**
     * 완료된 목록 가져오기
     * @param startDt - String (yyyymmdd or yyyymm or yyyy)
     * @param endDt - String (yyyymmdd or yyyymm or yyyy)
     * @param offset - Number
     * @param limit - Number
     */
    apiReserveCompleteList(startDt, endDt, offset, limit) {
        const userType = this.state.userType;

        const request = API.reservations.reserveCompleteList(startDt, endDt, userType, offset, limit);
        request.then(response => {
            if (response.status === 200) {
                const data = response.data;
                let dataList = data.list || [];
                let length = dataList.length;

                if (offset > 0) {
                    const list = utils.mergeArrayTypeObject(this.state.list, dataList, ["buy_no"], ["buy_no"], true);
                    dataList = list.list;
                    length = list.count;
                }

                this.setState({
                    list: dataList,
                    offset: offset + length,
                    totalCount: data.total_cnt,
                    isLoading: true
                });
            }
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    /**
     * 현재 리스트 갱신
     */
    reloadList(modalName) {
        PopModal.close(modalName);
        const searchProp = this.state.searchProp;
        const offset = 0;
        const limit = this.state.limit;
        this.apiReserveCompleteList(searchProp.startDate, searchProp.endDate, offset, limit);
    }

    popReceipt(obj) {
        const modalName = "popup-receipt";
        const searchProp = this.state.searchProp;
        // let status = obj.status_type;
        //
        // if (status.startsWith("REQ_") || status.startsWith("RES_")) {
        //     status = status.substr(4);
        // }

        PopModal.createModal(modalName, <PopupReceipt data={obj} type="COMPLETE" searchDate={searchProp} />, { callBack: () => this.apiReserveCompleteList(searchProp.startDate, searchProp.endDate, 0, this.state.limit) });
        PopModal.show(modalName);
    }

    /**
     * 구매완료한 건에 대하여
     * @param obj
     */
    popPhotosView(obj) {
        const buyNo = obj.buy_no;
        const productNo = obj.product_no;
        const customCount = obj.custom_cnt;
        const modalName = "view_photos";
        const sliderData = {
            title: obj.title,
            nick_name: obj.nick_name,
            profile_img: obj.profile_img
        };

        PopModal.createModal(modalName, <PhotoView buyNo={buyNo} productNo={productNo} data={sliderData} customCount={customCount} closeFunc={() => { PopModal.close(modalName); }} />);
        PopModal.show(modalName);
    }

    popRegReview(obj) {
        const modalName = "reg_review";
        const reviewRegData = {
            buyNo: obj.buy_no,
            productNo: obj.product_no,
            customCount: obj.custom_cnt,
            reserveType: obj.reserve_type,
            offerNo: obj.offer_no
        };

        PopModal.createModal(modalName, <StatusComplete {...reviewRegData} closeFunc={() => this.reloadList(modalName)} />, { className: "pop_reg_review" });
        PopModal.show(modalName);
    }

    /**
     *  테이블의 진행현황 컬럼의 내용을 변경
     */
    changeStatusType(type, status) {
        // status : READY, PAYMENT, PREPARE, SHOT, UPLOAD, CUSTOM, REQ_CUSTOM, COMPLETE
        let changeStatus = "";
        switch (type) {
            case "status":
                if (status === "READY") {
                    changeStatus = "예약완료";
                } else if (status === "PAYMENT") {
                    changeStatus = "입금완료";
                } else if (status === "PREPARE") {
                    changeStatus = "촬영준비중";
                } else if (status === "SHOT") {
                    changeStatus = "촬영완료";
                } else if (status === "UPLOAD") {
                    changeStatus = "사진완료";
                } else if (status === "CUSTOM") {
                    changeStatus = "보정사진완료";
                } else if (status === "REQ_CUSTOM") {
                    changeStatus = "보정준비중";
                } else if (status === "RES_CUSTOM") {
                    changeStatus = "보정완료";
                } else if (status === "COMPLETE") {
                    changeStatus = "최종전달";
                } else if (status === "CANCEL") {
                    changeStatus = "예약취소";
                }
                break;
            case "option":
                if (status === "ORIGIN") {
                    changeStatus = "원본데이터형";
                } else if (status === "CUSTOM") {
                    changeStatus = "보정데이터형";
                } else if (status === "PRINT") {
                    changeStatus = "인화형";
                }
                break;
            default:
        }
        return changeStatus;
    }

    redirectProduct(obj, order_no = "") {
        const { enter } = this.props;
        let url = `/products/${obj.product_no}`;
        const category = obj.category || obj.order_info.category;
        let targetWindow = window;
        const enter_session = sessionStorage.getItem(constant.USER.ENTER);

        if (order_no) {
            url = `/users/estimate/${order_no}/content`;
        }

        if (typeof enter === "string" && enter === "indi" && enter_session) {
            if (order_no !== "") {
                browserHistory.push(`users/estimate/${order_no}/content`);
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

    buttonPhotoView(obj) {
        if (obj.status_type === "COMPLETE" && !Number(obj.photo_cnt)) {
            return "(외부전달)";
        } else if (obj.status_type === "COMPLETE") {
            return <button className="_button _button__white" onClick={() => this.popPhotosView(obj)}>사진보기</button>;
        }

        return null;
    }

    render() {
        const { list, totalCount, stepValue, isLoading } = this.state;
        const content = [];

        if (!isLoading) {
            return false;
        }

        if (utils.type.isArray(list) && list.length > 0) {
            // step : 구매내역 or 나의 후기
            content.push(
                <div key="photograph-title" className="photograph-title">
                    <h3 className="h4-sub" data-count={totalCount}>구매 내역</h3>
                    <p className="h5-caption text-normal">지난 촬영내역과 사진을 확인하실 수 있습니다.</p>
                </div>
            );

            content.push(
                <div key="photograph__list" className="photograph__list">
                    <div className="process__list">
                        <table className="_table">
                            <colgroup>
                                <col width="140" />
                                <col width="140" />
                                <col width="140" />
                                <col />
                                <col width="140" />
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
                                    let title = <a href={`/products/${item.product_no}`} target="_blank">{item.title}</a>;
                                    let reserveDate = item.reserve_dt;

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
                                                <button className="_button _button__white" onClick={() => this.popReceipt(item)}>결제내역</button>
                                                <button className="_button _button__white" onClick={() => this.popPgReceipt(item.pg_receipt)}>결제영수증 확인</button>
                                            </td>
                                            <td className="price">
                                                <div className="pay-price">{`${utils.format.price(totalPrice)}원`}</div>
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
                                                        </div>
                                                        <div className="buttons dashed">
                                                            <button className="_button _button__white" onClick={() => this.onMoveChat(item)}>대화방 바로가기</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="status">
                                                <p>{this.changeStatusType("status", item.status_type)}</p>
                                                {this.buttonPhotoView(item)}
                                                {
                                                    item.status_type === "COMPLETE" && item.review_no === null
                                                        ? <button className="_button _button__white" onClick={() => this.popRegReview(item)}>후기작성</button>
                                                        : ""
                                                }
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {list && list.length < totalCount ?
                            <div className="list__more">
                                <button className="_button _button__default" onClick={this.onMoreList}>더보기</button>
                            </div> : null
                        }
                    </div>
                </div>
            );
        } else {
            const noneText = "최근 이용내역이 없어요.";
            content.push(
                <div key="empty-list" className="empty-list">
                    <h4 className="h4 text-bold">{noneText}</h4>
                    <p className="h5-caption empty-cpation">조회기간을 통해 날짜를 선택해주세요.</p>
                </div>
            );
        }
        return (
            <div className="orderHistory-page">
                {content}
            </div>
        );
    }
}

export default OrderHistory;
