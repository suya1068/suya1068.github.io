import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";

import { PROCESS_BREADCRUMB_CODE, COMBINE_PROCESS_BREADCRUMB, PROCESS_BREADCRUMB } from "shared/constant/reservation.const";
import { PAYMENT_CODE } from "shared/constant/payment.const";
import RequestJS from "shared/components/quotation/request/QuotationRequest";
import Img from "shared/components/image/Img";

class ProgressList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true
        };
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    render() {
        const {
            data,
            onMoveChat,
            onShowReceipt,
            onShowConfirmReserve,
            onShowCancel,
            onShowReview,
            onShowPassOrigin,
            onModifyDate
        } = this.props;

        if (!utils.isArray(data) || !data.length) {
            return (
                <div className="progress__none">
                    <p className="title">진행 중인 내용이 없어요.</p>
                    <p className="description">과거 주문하신 내역은 서비스 이용내역에서 확인해 주시기 바랍니다.</p>
                </div>
            );
        }

        return (
            <div className="progress__list">
                {data.map(o => {
                    const breadcrumb = PROCESS_BREADCRUMB[o.status_type] || null;
                    const status = ["READY", "PAYMENT", "PREPARE"].indexOf(o.status_type) !== -1;
                    const alterInfo = o.date_alter_info || null;
                    let title = <a href={`/products/${o.product_no}`} target="_blank">{o.title}</a>;
                    let reserveDate = o.reserve_dt;
                    let afterDate = null;
                    let alter_status = false;
                    let alter_no = null;

                    if (alterInfo && Array.isArray(alterInfo) && alterInfo.length) {
                        const alter = alterInfo.reduce((r, a) => {
                            if (!r || r.no < a.no) {
                                return a;
                            }

                            return r;
                        });
                        afterDate = alter.after_date;
                        alter_status = alter.status === "REQUEST";
                        alter_no = alter.no;
                    }

                    switch (o.option_type) {
                        case "OFFER":
                        case "ORDER": {
                            const orderInfo = o.order_info || {};
                            reserveDate = "미정";
                            title = "촬영견적";

                            if (o.reserve_dt && o.reserve_dt !== "0000-00-00") {
                                reserveDate = o.reserve_dt;
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
                            title = <a role="button" onClick={() => {}}>맞춤결제</a>;
                            break;
                        }
                        default:
                            break;
                    }

                    return (
                        <div key={o.no} className="item">
                            <div className="item__row item__title">
                                <div className="artist_name">{o.nick_name}</div>
                                <div className="buy_no">{utils.format.formatByNo(o.buy_no)}</div>
                            </div>
                            <div className="item__row">
                                <div className="status">
                                    <button className="_button _button__fill__pink">{breadcrumb.artist_text || ""}</button>
                                    {[PROCESS_BREADCRUMB_CODE.RES_CUSTOM, PROCESS_BREADCRUMB_CODE.REQ_COMPLETE].indexOf(o.status_type) !== -1
                                    && utils.isDate(o.due_date) ?
                                        <span className="description">
                                            최종완료예정일 <span className="highlight">{o.due_date}</span>
                                        </span> : null
                                    }
                                </div>
                                {PROCESS_BREADCRUMB_CODE.COMPLETE === o.status_type && o.review_no ?
                                    <div className="options">
                                        <button className="_button _button__white" onClick={() => onShowReview(o)}>후기보기</button>
                                    </div> : null
                                }
                                {PROCESS_BREADCRUMB_CODE.PAYMENT === o.status_type ?
                                    <div className="options">
                                        <button className="_button _button__default reserve__cancel" onClick={() => onShowCancel(o)}>취소하기</button>
                                    </div> : null
                                }
                            </div>
                            <div className="item__row item__content">
                                <div className="profile">
                                    <Img image={{ src: o.thumb_img, content_width: 200, content_height: 200 }} />
                                </div>
                                <div className="info">
                                    <div className="title">{title}</div>
                                    <div className="date">
                                        <div>촬영일: {reserveDate}</div>
                                        {status && alter_status && utils.isDate(afterDate) ? <p>{`변경예정: ${afterDate}`}</p> : null}
                                        {status && !alter_status && mewtime().isSameOrBefore(mewtime(reserveDate)) ?
                                            <div>
                                                <button className="_button _button__white" onClick={() => onModifyDate(o.buy_no, reserveDate)}>날짜변경</button>
                                            </div> : null
                                        }
                                    </div>
                                </div>
                                <div className="options" style={{ textAlign: "right" }}>
                                    <div>
                                        <button className="_button _button__white" onClick={() => onMoveChat(o)}>대화방 바로가기</button>
                                    </div>
                                    {o.status_type === PROCESS_BREADCRUMB_CODE.SHOT ?
                                        <div>
                                            <button className="_button _button__white" onClick={() => onShowPassOrigin(o)}>외부 전달</button>
                                        </div> : null
                                    }
                                    {o.status_type === PROCESS_BREADCRUMB_CODE.PAYMENT ?
                                        <div>
                                            <button className="_button _button__white" onClick={() => onShowConfirmReserve(o)}>예약 확인</button>
                                        </div> : null
                                    }
                                    {o.status_type === "COMPLETE" && o.update_dt ?
                                        <p style={{ marginTop: 10, color: "#666", width: 100, fontSize: 10 }}>최종완료일 : {o.update_dt.substr(0, 10)}</p> : null
                                    }
                                </div>
                            </div>
                            <div className="item__row">
                                <div className="total_price">
                                    총 결제금액 <span>{utils.format.price(o.total_price)}원</span>
                                </div>
                                {o.status_type === PROCESS_BREADCRUMB_CODE.READY && o.pay_type === PAYMENT_CODE.BANK ?
                                    <div className="payment">
                                        <div className="description">만료일 <span className="highlight">{o.vbank_date}</span> 까지</div>
                                    </div> :
                                    <div className="options">
                                        <button className="_button _button__white" onClick={() => onShowReceipt(o)}>결제내역</button>
                                    </div>
                                }
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

ProgressList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    onMoveChat: PropTypes.func,
    onShowReceipt: PropTypes.func,
    onShowConfirmReserve: PropTypes.func,
    onShowCancel: PropTypes.func,
    onShowReview: PropTypes.func,
    onModifyDate: PropTypes.func
};

ProgressList.defaultProps = {
};

export default ProgressList;
