import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";
import redirect from "forsnap-redirect";

import constant from "shared/constant";
import PopModal from "shared/components/modal/PopModal";

import PopupReceipt from "desktop/resources/components/pop/popup/PopupReceipt";
import PopDownContent from "shared/components/popdown/PopDownContent";

class ListContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.redirectProduct = this.redirectProduct.bind(this);
        this.redirectOrder = this.redirectOrder.bind(this);

        this.popReceipt = this.popReceipt.bind(this);

        this.layoutProduct = this.layoutProduct.bind(this);
        this.layoutPayStatus = this.layoutPayStatus.bind(this);
        this.renderEmpty = this.renderEmpty.bind(this);
        this.renderLayout = this.renderLayout.bind(this);

        this.onAlertEnter = this.onAlertEnter.bind(this);
        this.onAlertLeave = this.onAlertLeave.bind(this);
        this.onInfo = this.onInfo.bind(this);
    }

    onShowMemo(memo) {
        const modalName = "calculate__memo";
        PopModal.createModal(
            modalName,
            <div className="artist__calculate__memo">
                <div className="artist__calculate__memo__header">
                    비고사항
                </div>
                <div className="artist__calculate__memo__body">
                    {memo}
                </div>
            </div>
        );
        PopModal.show(modalName);
    }

    /**
     * 상품상세로 이동
     * @param pNo
     */
    redirectProduct(pNo) {
        if (pNo) {
            redirect.productOne(pNo);
        }
    }

    /**
     * 요청서 상세로 이동
     * @param oNo
     */
    redirectOrder(oNo) {
        if (oNo) {
            location.href = `/artists/estimate/${oNo}`;
        }
    }

    /**
     * 상품 결제 영수증보기
     */
    popReceipt(obj) {
        const modalName = "popup-receipt";

        PopModal.createModal(modalName, <PopupReceipt data={obj} userType="A" />);
        PopModal.show(modalName);
    }

    layoutProduct(obj) {
        const content = [];
        const isAddition = ["TALK_CUSTOM", "TALK_EXTRA"].indexOf(obj.option_type) !== -1;

        if (!obj) {
            return null;
        }

        const prop = {
            key: `product-content-${obj.buy_no}`
        };

        if (obj.option_type === "ORDER") {
            const orderInfo = obj.order_info || {};
            let reserveDt = "미정";

            if (obj.reserve_dt && obj.reserve_dt !== "0000-00-00") {
                reserveDt = obj.reserve_dt;
            } else if (orderInfo) {
                if (utils.isDate(orderInfo.date)) {
                    reserveDt = mewtime.strToDate(orderInfo.date);
                } else {
                    reserveDt = orderInfo.date;
                }
            }

            prop.onClick = () => this.redirectOrder(orderInfo.no);

            content.push(
                <div key="product__info" className="product__info">
                    <div className="product__info__header">
                        <p>{obj.title || ""}</p>
                    </div>
                    <div className="product__info__body">
                        <p>옵션: {obj.option_name}</p>
                        <p>카테고리: {orderInfo ? orderInfo.category_name : ""}</p>
                        <p>촬영일: {reserveDt}</p>
                    </div>
                </div>
            );
        } else if (obj.option_type === "PACKAGE") {
            prop.onClick = () => this.redirectProduct(obj.product_no);
            content.push(
                <div key="product__info" className="product__info">
                    <div className="product__info__header">
                        <p>{obj.title || ""}</p>
                    </div>
                    <div className="product__info__body">
                        <p>패키지명: {obj.option_name}</p>
                        <p>촬영일: {obj.reserve_dt}</p>
                    </div>
                </div>
            );
        } else {
            prop.onClick = () => this.redirectProduct(obj.product_no);
            content.push(
                <div key="product__info" className="product__info">
                    <div className="product__info__header">
                        <p>{obj.title || ""}</p>
                    </div>
                    <div className="product__info__body">
                        <p>옵션: {obj.option_name}</p>
                        {isAddition ? null : <p>인원: {obj.person_cnt}</p>}
                        <p>촬영일: {obj.reserve_dt}</p>
                    </div>
                </div>
            );
        }

        return React.createElement("td", prop, content);
    }

    layoutPayStatus(data) {
        return (
            <div className="calculate__status">
                <div>
                    {utils.stringToBoolen(data.payment) ?
                        utils.linebreak(`지급완료\n${data.calculate_dt ? mewtime(data.calculate_dt).format("YYYY-MM-DD") : ""}`) : this.checkCalculateText(data)
                    }
                </div>
                {data.memo ?
                    <PopDownContent target={<div className="memo">비고사항</div>}>
                        <div className="memo__content">
                            {utils.linebreak(data.memo)}
                        </div>
                    </PopDownContent> : null
                }
            </div>
        );
    }

    checkCalculateText(data) {
        const status = data.status_type;
        const payment_status = data.payment_status_type;
        const date = data.calculate_schedule;

        // if (data.crew_calculate === "crew") {
        //     const d = mewtime(date);
        //     d.month(d.month() + 1).date(15);
        //     date = d.format("YYYY-MM-DD");
        // }

        return (
            status && (status === "COMPLETE" || status === "CANCEL") &&
            payment_status && (payment_status === "COMPLETE" || payment_status === "CANCEL") &&
            data.calculate_schedule ? utils.linebreak(`지급예정일\n${date}`) : "미지급"
        );
    }

    renderEmpty() {
        return (
            <div key="empty__list" className="empty__list">
                <h4 className="h4">최근 촬영작업 내역이 없어요.</h4>
                <p className="h5-caption empty-cpation">조회기간을 통해 날짜를 선택해주세요.</p>
            </div>
        );
    }

    renderLayout(data) {
        const { onShowCalculateModal } = this.props;
        return Object.keys(data).map(key => {
            const list = data[key];

            if (utils.isArray(list)) {
                return list.map(obj => {
                    const status = constant.PRODUCT_STATUS.SERVICE_TYPE.find(o => {
                        return o.value === obj.status_type;
                    });

                    const extraList = obj.extra_info;

                    return (
                        <tr>
                            <td>
                                <span>{utils.format.formatByNo2(obj.buy_no)}</span>
                                <div className="calculate__receipt">
                                    <button className="f__button f__button__small" onClick={() => this.popReceipt(obj)}>
                                        결제내역{utils.isArray(extraList) ? ` ${extraList.length}` : ""}
                                    </button>
                                </div>
                            </td>
                            <td>{utils.format.price(Number(obj.total_price))}</td>
                            <td>
                                {obj.crew_calculate === "crew" ?
                                    <div className="crew__calculate">
                                        일괄정산
                                        <button className="_button _button__white" onClick={() => onShowCalculateModal(obj)}>정산내역보기</button>
                                    </div>
                                    : utils.format.price(Number(obj.artist_price || 0) + Number(obj.proof_price || 0))
                                }
                            </td>
                            {this.layoutProduct(obj)}
                            <td>{status ? status.status_artist || "" : ""}</td>
                            <td>
                                {this.layoutPayStatus(obj)}
                            </td>
                        </tr>
                    );
                });
            }

            return null;
        });
    }

    onAlertEnter(e) {
        this.info_calc.classList.add("on");
    }

    onAlertLeave(e) {
        this.info_calc.classList.remove("on");
    }

    onInfo(e) {
        this.info.classList.toggle("on");
    }

    render() {
        const { data, total, total_price_sum, artist_price_sum, onFetch, is_calculate } = this.props;

        if (!utils.isArray(data.pay) && !utils.isArray(data.nopay)) {
            return this.renderEmpty();
        }

        return (
            <div className="artist__calculate__list">
                <div className="calculate__header">
                    <div className="title">정산내역 <span style={{ color: "#ffba00" }}>{total}</span></div>
                    <div className="content">
                        <p>완료촬영내역에 관한 지급은 등록하신 계좌번호로 일괄 정산됩니다.</p>
                        <p>첫 정산 시 다음의 서류를 acct@forsnap.com 으로 접수해주셔야 합니다.</p>
                        <p>
                            1. 사업자등록증 (사업자의 경우) 또는 신분증 사본 (개인의 경우)<br />
                            2. 통장사본 (계정설정에서 입력한 계좌)
                        </p>
                        <p>정산관련 문의는 <Link to="/artists/chat/help" style={{ color: "#000" }}>1:1 고객센터</Link>, 혹은 070)5088-3488 으로 연락주세요.</p>
                    </div>
                </div>
                <div className="calculate__body">
                    <table className="table">
                        <colgroup>
                            <col width="130px" />
                            <col width="140px" />
                            <col width="140px" />
                            <col />
                            <col width="130px" />
                            <col width="150px" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>주문번호</th>
                                <th>판매금액</th>
                                <th>지급액</th>
                                <th>상품정보</th>
                                <th>진행현황</th>
                                <th>
                                    지급현황
                                    <div
                                        className="alert"
                                        onMouseEnter={this.onAlertEnter}
                                        onMouseLeave={this.onAlertLeave}
                                    />
                                    <div className="info_calc" ref={node => (this.info_calc = node)}>
                                        지급일이 영업일이 아닌 경우,<br />다음 영업일에 지급됩니다.
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderLayout(data)}
                        </tbody>
                    </table>
                    {total > data.length ?
                        <div className="calculate__more">
                            <button className="f__button" onClick={() => onFetch(data.length)}>더보기</button>
                        </div> : null
                    }
                    <div className="calculate__total__price">
                        <div className="total__price">
                            <div className="title">총판매금액</div>
                            <div className="price">{utils.format.price(total_price_sum)}</div>
                        </div>
                        <div className="total__price artist__price">
                            <div className="title">
                                지급액 (지급예정액)<br />
                                {is_calculate < 1 &&
                                    <div
                                        className="info_alert"
                                        onClick={this.onInfo}
                                    >첫 정산 시 서류접수 안내</div>
                                }
                                <div className="info" ref={node => (this.info = node)}>
                                    첫 정산 시 다음의 서류를 <a href="mailto:acc@forsnap.com">acct@forsnap.com</a> 으로 접수해주셔야 합니다.<br />
                                    1. 사업자 등록증 (사업자의 경우) 또는 신분증 (개인의 경우)<br />
                                    2. 통장사본 (계정설정에서 입력한 계좌)<br />
                                    서류가 접수되지 않은 경우 정산일이 늦어질 수 있습니다.<br />
                                    정산관련 문의는 <a href="/artists/chat/help">1:1 고객센터</a>, 혹은 070)5088-3488 으로 연락주세요.
                                </div>
                            </div>
                            <div
                                className="price"
                                style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
                            >{utils.format.price(artist_price_sum)}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ListContainer.propTypes = {
    data: PropTypes.shape([PropTypes.node]),
    total: PropTypes.number,
    total_price_sum: PropTypes.number,
    artist_price_sum: PropTypes.number,
    onFetch: PropTypes.func.isRequired,
    onShowCalculateModal: PropTypes.func.isRequired
};

export default ListContainer;
