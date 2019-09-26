import "./PhotographCompletePage.scss";
import React, { Component, PropTypes } from "react";
import { routerShape } from "react-router";

import desk from "desktop/resources/management/desktop.api";
import utils from "shared/helper/utils";
import redirect from "forsnap-redirect";
import mewtime from "forsnap-mewtime";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Input from "shared/components/ui/input/Input";
import Img from "shared/components/image/Img";

import Icon from "desktop/resources/components/icon/Icon";
import PopDownContent from "desktop/resources/components/pop/popdown/PopDownContent";
import PopupReply from "desktop/resources/components/pop/popup/PopupReply";
import SlimCalendar from "desktop/resources/components/calendar/SlimCalendar";
import PopupReceipt from "desktop/resources/components/pop/popup/PopupReceipt";
import RequestJS from "shared/components/quotation/request/QuotationRequest";

import "desktop/resources/components/table/table.scss";

class PhotographCompletePage extends Component {
    constructor() {
        super();

        const today = mewtime();
        const minDate = mewtime();
        const maxDate = mewtime();
        const endDate = today.format("YYYY-MM-DD");
        const startDate = today.subtract(1, mewtime.const.MONTH).format("YYYY-MM-DD");

        minDate.year(minDate.year() - 5);
        minDate.date(minDate.date() - 1);
        maxDate.date(maxDate.date() + 1);

        this.state = {
            list: [],
            offset: 0,
            limit: 10,
            totalCount: 0,
            endDate,
            startDate,
            sCalendar: {
                events: [],
                min: minDate.format("YYYY-MM-DD"),
                max: maxDate.format("YYYY-MM-DD"),
                date: startDate,
                isLegend: false
            },
            eCalendar: {
                events: [],
                min: minDate.format("YYYY-MM-DD"),
                max: maxDate.format("YYYY-MM-DD"),
                date: endDate,
                isLegend: false
            },
            userType: "A",
            isStart: false,
            isEnd: false
            // enter: cookie.getCookies(CONSTANT.USER.ENTER)
        };

        this.onMoveChat = this.onMoveChat.bind(this);
        this.onMore = this.onMore.bind(this);
        this.onShowCalculateInfo = this.onShowCalculateInfo.bind(this);

        this.searchList = this.searchList.bind(this);
        // this.onClickRedirect = this.onClickRedirect.bind(this);
        this.apiReserveCompleteList = this.apiReserveCompleteList.bind(this);
    }

    componentDidMount() {
        this.searchList();
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

    onMoveProduct(data) {
        this.move(data.product_no ? `/products/${data.product_no}` : null);
    }

    onMoveEstimate(data) {
        this.move(data.no ? `/artists/estimate/${data.no}` : null);
    }

    onMore() {
        const { startDate, endDate, offset, limit } = this.state;
        this.apiReserveCompleteList(startDate.replace(/-/gi, ""), endDate.replace(/-/gi, ""), offset, limit);
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

    // onClickRedirect(obj, type) {
    //     const { enter } = this.state;
    //     let url = `/products/${obj.product_no}`;
    //     let targetWindow = window;
    //     const category = obj.category || "";
    //
    //     if (type === "order") {      // 견적상품이면 url 변경
    //         url = `/artists/estimate/${obj.no}`;
    //     }
    //
    //     if (typeof enter === "string" && (enter === "naver" || enter === "header")) {           // 쿠키가 있느냐
    //         if (!utils.checkCategoryForEnter(category)) {           // 기업용 카테고리가 아니면
    //             sessionStorage.removeItem(CONSTANT.USER.ENTER);     // 세션 공유가 되는것을 막기 위해 삭제 후
    //             targetWindow = window.open();
    //             targetWindow.opener = null;
    //             sessionStorage.setItem(CONSTANT.USER.ENTER, enter);         // 다시 세션 추가
    //             // targetWindow.location.href = url;
    //             // } else {
    //             //     // browserHistory.push(url);
    //             //     targetWindow.location.href = url;
    //         }
    //         targetWindow.location.href = url;
    //     } else if (!enter) {
    //         if (type === "product") {
    //             redirect.productOne(obj.product_no);
    //         } else {
    //             location.href = `/artists/estimate/${obj.no}`;
    //         }
    //     }
    //     // const { enter } = this.state;
    //     // let targetWindow = window;
    //     // const targetCategory = category || "";
    //     //
    //     // if (enter && !utils.checkCategoryForEnter(targetCategory)) {
    //     //     sessionStorage.removeItem(CONSTANT.USER.ENTER);     // 세션 공유가 되는것을 막기 위해 삭제 후
    //     //     targetWindow.opener = null;
    //     //     targetWindow = targetWindow.open(url, "_blank", "", false);
    //     //     // targetWindow.location.href = url;
    //     // }
    //     // sessionStorage.setItem(CONSTANT.USER.ENTER, enter);     // 다시 세션에 추가
    //     // targetWindow.location.href = url;
    // }
    /**
     * 캘린더 날짜를 선택를 한다.
     * @param selected
     */
    onSelect(selected, key) {
        const props = {};
        const date = selected.date.clone();
        const sCalendar = this.state.sCalendar;
        const eCalendar = this.state.eCalendar;

        if (key === "sCalendar") {
            sCalendar.date = selected.date.format("YYYY-MM-DD");
            props.startDate = sCalendar.date;
            props.isStart = false;
            eCalendar.min = date.subtract(1, mewtime.const.DATE).format("YYYY-MM-DD");
        } else {
            eCalendar.date = selected.date.format("YYYY-MM-DD");
            props.endDate = eCalendar.date;
            props.isEnd = false;
            sCalendar.max = date.add(1, mewtime.const.DATE).format("YYYY-MM-DD");
        }

        this.setState({
            ...props,
            sCalendar,
            eCalendar
        });
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
        const request = desk.reservations.reserveCompleteList(startDt, endDt, userType, offset, limit);
        request.then(response => {
            const data = response.data;
            let dataList = data.list || [];
            let length = dataList.length;

            if (offset > 0) {
                const list = utils.mergeArrayTypeObject(this.state.list, dataList, ["buy_no"], ["buy_no"], true);
                dataList = list.list || [];
                length = list.count;
            }

            this.setState({
                list: dataList,
                offset: offset + length,
                totalCount: data.total_cnt,
                is_calculate: data.is_calculate || 0
            });
        }).catch(error => {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(error.data)
            });
        });
    }

    // 조회기간 선택
    selectPeriod(period, num) {
        const today = mewtime();
        const minDate = mewtime();
        const maxDate = mewtime();
        const sCalendar = this.state.sCalendar;
        const eCalendar = this.state.eCalendar;
        const endDate = today.format("YYYY-MM-DD");
        const startDate = today.subtract(num, period).format("YYYY-MM-DD");

        minDate.year(minDate.year() - 5);
        minDate.date(minDate.date() - 1);
        maxDate.date(maxDate.date() + 1);

        sCalendar.date = startDate;
        sCalendar.min = minDate.format("YYYY-MM-DD");
        sCalendar.max = maxDate.format("YYYY-MM-DD");
        eCalendar.date = endDate;
        eCalendar.min = minDate.format("YYYY-MM-DD");
        eCalendar.max = maxDate.format("YYYY-MM-DD");

        this.setState({
            startDate,
            endDate,
            sCalendar,
            eCalendar
        }, this.searchList);
    }

    // 검색
    searchList() {
        const startDate = this.state.startDate.replace(/-/gi, "");
        const endDate = this.state.endDate.replace(/-/gi, "");
        const limit = this.state.limit;

        this.state.offset = 0;
        this.apiReserveCompleteList(startDate, endDate, this.state.offset, limit);
    }

    /**
     * 상품상세로 이동
     * @param pNo
     */
    redirectProduct(obj) {
        if (obj.product_no) {
            // this.onClickRedirect(obj, "product");
            redirect.productOne(obj.product_no);
        }
    }

    /**
     * 요청서 상세로 이동
     * @param oNo
     */
    redirectOrder(obj) {
        if (obj.no) {
            // this.onClickRedirect(obj, "order");
            location.href = `/artists/estimate/${obj.no}`;
        }
    }


    // 후기보기 팝업
    popReply(obj) {
        const buyNo = obj.buy_no;
        const productNo = obj.product_no;
        const reviewNo = obj.review_no;

        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            close: true,
            content: <PopupReply buyNo={buyNo} productNo={productNo} reviewNo={reviewNo} userType="A" />
        });
    }

    /**
     * 상품 결제 영수증보기
     */
    popReceipt(obj) {
        Modal.show({
            type: MODAL_TYPE.ALERT,
            content: <PopupReceipt data={obj} userType="A" />
        });
    }

    render() {
        const list = this.state.list;
        const totalCount = this.state.totalCount;
        const content = [];

        if (utils.isArray(list) && list.length) {
            content.push(
                <div key="photograph-title" className="photograph-title">
                    <h3 className="h4-sub" data-count={totalCount}>완료된 촬영</h3>
                    <p className="h5-caption text-normal">지난 촬영내역과 사진을 확인하실 수 있습니다.</p>
                </div>
            );

            content.push(
                <div key="complete__list" className="complete__list">
                    <table className="_table">
                        <colgroup>
                            <col width="120" />
                            <col width="160" />
                            <col width="140" />
                            <col />
                            <col width="170" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>주문번호</th>
                                <th>총결제금액</th>
                                <th>주문자</th>
                                <th>상품정보</th>
                                <th>진행현황</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map(obj => {
                                const extraList = obj.extra_info;
                                let title = <a href={`/products/${obj.product_no}`} target="_blank">{obj.title}</a>;
                                let reserveDate = obj.reserve_dt;

                                switch (obj.option_type) {
                                    case "OFFER": {
                                        title = "촬영견적";
                                        const orderInfo = obj.order_info || {};
                                        reserveDate = "미정";

                                        if (obj.reserve_dt && obj.reserve_dt !== "0000-00-00") {
                                            reserveDate = obj.reserve_dt;
                                        } else if (orderInfo) {
                                            if (utils.isDate(orderInfo.date)) {
                                                reserveDate = mewtime.strToDate(orderInfo.date);
                                            } else if (RequestJS.isDateOption(orderInfo.date)) {
                                                reserveDate = orderInfo.date;
                                            }
                                        }
                                        break;
                                    }
                                    case "ORDER": {
                                        if (obj.order_info && obj.order_info.no) {
                                            title = <a href={`/artists/estimate/${obj.order_info.no}`}>촬영견적</a>;
                                        } else {
                                            title = "촬영견적";
                                        }
                                        const orderInfo = obj.order_info || {};
                                        reserveDate = "미정";

                                        if (obj.reserve_dt && obj.reserve_dt !== "0000-00-00") {
                                            reserveDate = obj.reserve_dt;
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
                                        title = <a role="button" onClick={() => this.onMoveChat(obj)}>맞춤결제</a>;
                                        break;
                                    }
                                    default:
                                        break;
                                }

                                return (
                                    <tr key={obj.buy_no}>
                                        <td className="no">
                                            {utils.format.formatByNo(obj.buy_no)}
                                            <button className="_button _button__default" onClick={() => this.popReceipt(obj)}>
                                                결제내역{utils.isArray(extraList) && extraList.length ? ` ${extraList.length}` : ""}
                                            </button>
                                        </td>
                                        <td>{utils.format.price(obj.total_price)}</td>
                                        <td>{obj.user_name}</td>
                                        <td>
                                            <div className="process__product__info">
                                                <div className="info__profile">
                                                    <Img image={{ src: obj.thumb_img, content_width: 504, content_height: 504 }} />
                                                </div>
                                                <div className="info__content">
                                                    <div className="title">{title}</div>
                                                    <div className="description">
                                                        <p className="date">
                                                            촬영일 : {reserveDate}
                                                        </p>
                                                    </div>
                                                    <div className="buttons dashed">
                                                        <button className="_button _button__white" onClick={() => this.onMoveChat(obj)}>대화방 바로가기</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="status">
                                            <p>최종완료</p>
                                            {obj.review_no ?
                                                <button className="_button _button__default" onClick={() => this.popReply(obj)}>리뷰보기</button> : null
                                            }
                                            {obj.update_dt ?
                                                <p style={{ marginTop: 10, color: "#666", fontSize: 12 }}>최종완료일 : {obj.update_dt.substr(0, 10)}</p> : null
                                            }
                                            {!Number(obj.is_calculate) ?
                                                <button style={{ marginTop: obj.update_dt ? 10 : "" }} className="_button _button__white" onClick={this.onShowCalculateInfo}>정산 서류 및 접수방법</button> : null
                                            }
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {list.length < totalCount ?
                        <div className="list__more">
                            <button className="_button _button__default" onClick={this.onMore}>더보기</button>
                        </div> : null
                    }
                </div>
            );
        } else {
            content.push(
                <div key="empty__list" className="empty__list">
                    <h4 className="h4">최근 촬영작업 내역이 없어요.</h4>
                    <p className="h5-caption empty__caption">조회기간을 통해 날짜를 선택해주세요.</p>
                </div>
            );
        }

        return (
            <div className="photograph__complete__page">
                <div className="photograph__search">
                    <div className="search-tool">
                        <div className="search-month">
                            <span className="title">조회기간</span>
                            <button className="_button _button__default" onClick={() => this.selectPeriod(mewtime.const.DATE, 7)}>1주일</button>
                            <button className="_button _button__default" onClick={() => this.selectPeriod(mewtime.const.MONTH, 1)}>1개월</button>
                            <button className="_button _button__default" onClick={() => this.selectPeriod(mewtime.const.MONTH, 3)}>3개월</button>
                            <button className="_button _button__default" onClick={() => this.selectPeriod(mewtime.const.YEAR, 1)}>1년</button>
                            <button className="_button _button__default" onClick={() => this.selectPeriod(mewtime.const.YEAR, 5)}>5년</button>
                        </div>
                        <div className="search-calendar">
                            <div className="start-calendar">
                                <Input value={this.state.startDate} readOnly />
                                <PopDownContent target={<button className="_button _button__default"><Icon name="calendar_s" /></button>} visible={this.state.isStart}>
                                    <div className="calendar-popup">
                                        <SlimCalendar {...this.state.sCalendar} onSelect={date => this.onSelect(date, "sCalendar")} />
                                    </div>
                                </PopDownContent >
                            </div>
                            <span className="swung-dash">~</span>
                            <div className="end-calendar">
                                <Input value={this.state.endDate} readOnly />
                                <PopDownContent target={<button className="_button _button__default"><Icon name="calendar_s" /></button>} visible={this.state.isEnd}>
                                    <div className="calendar-popup">
                                        <SlimCalendar {...this.state.eCalendar} onSelect={date => this.onSelect(date, "eCalendar")} />
                                    </div>
                                </PopDownContent>
                            </div>
                            <button className="_button _button__default" onClick={this.searchList}>검색</button>
                        </div>
                    </div>
                    <p className="search-caption">최근 5년간의 이력을 3개월 단위로 조회가 가능합니다.</p>
                </div>
                {content}
            </div>
        );
    }
}

PhotographCompletePage.contextTypes = {
    router: routerShape
};

export default PhotographCompletePage;
