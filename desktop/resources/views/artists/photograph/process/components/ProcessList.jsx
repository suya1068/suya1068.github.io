import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import { PROCESS_BREADCRUMB_CODE, PROCESS_BREADCRUMB } from "shared/constant/reservation.const";
import { PAYMENT_CODE } from "shared/constant/payment.const";

import Icon from "desktop/resources/components/icon/Icon";

import ProcessProductInfo from "./ProcessProductInfo";

class ProcessList extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.setStateData = this.setStateData.bind(this);

        this.renderStatus = this.renderStatus.bind(this);
    }

    componentDidMount() {
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    renderStatus(o) {
        const { is_calculate, onShowReservation, onShowReservationCancel, onShowReply, onShowCalculateInfo } = this.props;
        const breadcrumb = PROCESS_BREADCRUMB[o.status_type] || null;
        const content = [];

        if (breadcrumb) {
            content.push(breadcrumb.artist_text);
        }

        switch (o.status_type) {
            case PROCESS_BREADCRUMB_CODE.READY:
                break;
            case PROCESS_BREADCRUMB_CODE.PAYMENT: {
                content.push(
                    <div key={PROCESS_BREADCRUMB_CODE.PAYMENT}>
                        <div>
                            <button className="_button _button__white" onClick={() => onShowReservation(o)}>예약 확인</button>
                        </div>
                        <div>
                            <button className="_button _button__white reserve__cancel" onClick={() => onShowReservationCancel(o)}>취소하기</button>
                        </div>
                    </div>
                );
                break;
            }
            case PROCESS_BREADCRUMB_CODE.PREPARE:
                break;
            case PROCESS_BREADCRUMB_CODE.SHOT:
                break;
            case PROCESS_BREADCRUMB_CODE.UPLOAD:
                break;
            case PROCESS_BREADCRUMB_CODE.CUSTOM:
                break;
            case PROCESS_BREADCRUMB_CODE.REQ_CUSTOM:
                break;
            case PROCESS_BREADCRUMB_CODE.RES_CUSTOM:
            case PROCESS_BREADCRUMB_CODE.REQ_COMPLETE:
                if (utils.isDate(o.due_date)) {
                    content.push(
                        <div key={PROCESS_BREADCRUMB_CODE.REQ_COMPLETE}>
                            <div className="dots"><Icon name="small_dots" /></div>
                            <div className="due_date">최종완료예정일 <span>{o.due_date}</span></div>
                        </div>
                    );
                }
                break;
            case PROCESS_BREADCRUMB_CODE.COMPLETE:
                content.push(
                    <div key={PROCESS_BREADCRUMB_CODE.COMPLETE}>
                        <div className="dots"><Icon name="small_dots" /></div>
                        <div className="due_date">정산예정일 <span>{o.calculate_schedule}</span></div>
                        {o.review_no ?
                            <button className="_button _button__white" onClick={() => onShowReply(o)}>후기보기</button> : null
                        }
                        {!Number(is_calculate) ?
                            <button className="_button _button__white" onClick={onShowCalculateInfo}>정산 서류 및 접수방법</button> : null
                        }
                    </div>
                );
                break;
            default:
                break;
        }

        return (
            <div key={`status_${o.no}`} className="status">
                {content}
            </div>
        );
    }

    render() {
        const {
            data,
            total,
            isMore,
            onFetch,
            onShowReceipt,
            onShowPassOrigin,
            onShowUploadPhotos,
            onShowCustomPhotos,
            onMoveChat
        } = this.props;

        return (
            <div className="process__list">
                <table className="_table">
                    <colgroup>
                        <col width="120" />
                        <col width="150" />
                        <col width="140" />
                        <col />
                        <col width="170" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>주문번호</th>
                            <th>총 결제금액</th>
                            <th>주문자</th>
                            <th>상품정보</th>
                            <th>진행현황</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(o => {
                            const extraList = o.extra_info;
                            return (
                                <tr key={o.no}>
                                    <td className="no">
                                        {utils.format.formatByNo(o.buy_no)}
                                        {o.status_type !== PROCESS_BREADCRUMB_CODE.READY ?
                                            <button className="_button _button__white" onClick={() => onShowReceipt(o)}>
                                                결제내역{utils.isArray(extraList) && extraList.length ? ` ${extraList.length}` : ""}
                                            </button>
                                            : null
                                        }
                                    </td>
                                    {o.pay_type !== PAYMENT_CODE.BANK ?
                                        <td className="price">{utils.format.price(o.total_price)}</td> :
                                        <td className="price">
                                            {utils.format.price(o.total_price)}
                                            {o.status_type === PROCESS_BREADCRUMB_CODE.READY && o.vbank_date ?
                                                <div>
                                                    <div className="dots"><Icon name="small_dots" /></div>
                                                    <div className="due_date">만료일 <span>{o.vbank_date}</span> 까지</div>
                                                </div> : null
                                            }
                                        </td>
                                    }
                                    <td>{o.user_name}</td>
                                    <td>
                                        <ProcessProductInfo
                                            data={o}
                                            onReload={() => onFetch(0, data.length)}
                                            onShowPassOrigin={onShowPassOrigin}
                                            onShowUploadPhotos={onShowUploadPhotos}
                                            onShowCustomPhotos={onShowCustomPhotos}
                                            onMoveChat={onMoveChat}
                                        />
                                    </td>
                                    <td className="status">
                                        {this.renderStatus(o)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {utils.isArray(data) && data.length < total && isMore ?
                    <div className="list__more">
                        <button className="_button _button__default" onClick={() => onFetch(data.length)}>더보기</button>
                    </div> : null
                }
            </div>
        );
    }
}

ProcessList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_calculate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isMore: PropTypes.bool,
    onFetch: PropTypes.func,
    onShowReceipt: PropTypes.func.isRequired,
    onShowPassOrigin: PropTypes.func.isRequired,
    onShowPassComplete: PropTypes.func.isRequired,
    onShowReservation: PropTypes.func.isRequired,
    onShowReservationCancel: PropTypes.func.isRequired,
    onShowUploadPhotos: PropTypes.func.isRequired,
    onShowCustomPhotos: PropTypes.func.isRequired,
    onShowReply: PropTypes.func.isRequired,
    onShowCalculateInfo: PropTypes.func.isRequired,
    onMoveChat: PropTypes.func.isRequired
};

ProcessList.defaultProps = {
    data: []
};

export default ProcessList;
