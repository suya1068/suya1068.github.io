import "./chargeItem.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import mewtime from "forsnap-mewtime";
import utils from "forsnap-utils";

import { CATEGORY } from "shared/constant/product.const";

import ChargeExtend from "./ChargeExtend";

export default class ChargeItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            isShow: false,
            freeCategory: ["VIDEO_BIZ", "PROFILE_BIZ", "INTERIOR"],
            dateFormat: "YYYY-MM-DD"
        };
        this.onPayment = this.onPayment.bind(this);
        this.onShowExtendInfo = this.onShowExtendInfo.bind(this);
        this.renderExtend = this.renderExtend.bind(this);
    }

    componentWillMount() {
    }

    componentWillReceiveProps(np) {
        if (JSON.stringify(this.props.item) !== JSON.stringify(np.item)) {
            this.setState({
                isShow: false
            });
        }
    }

    noneItemRenderRow() {
        return (
            <div className="charge-item__row" style={{ borderBottom: "1px solid #e1e1e1" }}>
                <div className="charge-item__column column-2">
                    <p className="text-center">주문번호</p>
                </div>
                <div className="charge-item__column column-3">
                    <p className="text-center">상품명</p>
                </div>
                <div className="charge-item__column column-1">
                    <p className="text-center">상태</p>
                </div>
                <div className="charge-item__column column-1">
                    <p className="text-center">{}</p>
                </div>
                <div className="charge-item__column column-1">
                    <p className="text-center">신청일자</p>
                </div>
                <div className="charge-item__column column-1">
                    <p className="text-center">시작일자</p>
                </div>
                <div className="charge-item__column column-1">
                    <p className="text-center">종료일자</p>
                </div>
            </div>
        );
    }

    exchangeStatus(data) {
        const requestStatus = data.request_status;
        const paymentStatus = data.payment_status;

        const today = mewtime();

        const isBeforeEndDt = data.start_dt ? today.isBefore(mewtime(data.start_dt)) : null;
        const isAfterStartDt = data.end_dt ? today.isAfter(mewtime(data.end_dt)) : null;
        const payType = data.pay_type;

        let status = "";
        let color = "";

        if (data.del_dt) {
            status = "삭제";
            color = "#e02020";
        } else if (requestStatus === "READY" && !paymentStatus) {
            status = "승인대기중";
            color = "#0091ff";
        } else if (requestStatus === "COMPLETE" && paymentStatus !== "COMPLETE") {
            status = "승인완료";
            color = "#02c196";

            if (data.start_dt && data.end_dt && !isBeforeEndDt && !isAfterStartDt) {
                status = "노출중";
                color = "#f7b500";
            }

            // const testDate = mewtime()
            if (payType === "vbank") {
                if (data.vbank_date && today.isAfter(mewtime(data.vbank_date))) {
                    status = "만료";
                    color = "#e02020";
                }
            } else if (data.paid_limit_dt && today.isAfter(mewtime(data.paid_limit_dt))) {
                status = "만료";
                color = "#e02020";
            }
        } else if (requestStatus === "COMPLETE" && paymentStatus === "COMPLETE") {
            if (!isBeforeEndDt && !isAfterStartDt) {
                status = "노출중";
                color = "#f7b500";
            } else if (isAfterStartDt) {
                status = "만료";
                color = "#e02020";
            }
        } else if (requestStatus === "RETURN" || requestStatus === "CANCEL") {
            status = "비승인";
            color = "#e02020";
        } else if (requestStatus === "COMPLETE" && paymentStatus === "CANCEL") {
            status = "노출중";
            color = "#f7b500";
        } else if (requestStatus === "REQUEST") {
            status = "추가승인중";
            color = "#0056ff";
        } else {
            status = requestStatus;
        }

        return {
            status,
            color
        };
    }

    onShowExtendInfo(flag) {
        if (flag) {
            this.setState({ isShow: !this.state.isShow });
        }
    }

    renderExtend(item) {
        const data = this.props.item;
        const list = item ? item.extend_info : null;
        if (list && !utils.type.isEmpty(list)) {
            const params = {
                // start_dt: data.start_dt,
                end_dt: data.end_dt
                // paid_limit_dt: data.paid_limit_dt
            };
            return (
                <div className="extend-info-wrap">
                    {
                        list.map((obj, idx) => {
                            return (
                                <ChargeExtend data={obj} {...params} key={`extend__${idx}`} />
                            );
                        })
                    }
                </div>
            );
        }

        return null;
    }

    renderItemRow(obj) {
        const { freeCategory, isShow, dateFormat } = this.state;
        const today = mewtime();

        const isBeforeEndDt = today.isBefore(mewtime(obj.end_dt));
        const isAfterStartDt = today.isAfter(mewtime(obj.start_dt));
        const hasExtendInfo = !utils.type.isEmpty(obj.extend_info);

        // 입금기한
        // let vbankLimitDate = payTypeIsBank && obj.vbank_date;
        // if (payTypeIsBank && obj.end_dt) {
        //     const limitDay = obj.vbank_date ? mewtime(obj.vbank_date) : null;
        //     if (limitDay.isAfter(mewtime(obj.end_dt))) {
        //         vbankLimitDate = obj.end_dt;
        //     }
        // }

        const category = CATEGORY[obj.category];

        const status = this.exchangeStatus(obj);
        const product_list = obj.product_list || [];
        let isFree = false;
        for (let i = 0; i < product_list.length; i += 1) {
            const o = product_list[i];
            isFree = freeCategory.includes(o.category);

            if (!isFree) {
                break;
            }
        }

        return (
            <div className="charge-item__row" style={{ borderBottom: "1px solid #e1e1e1" }}>
                <div className="charge-item__column column-2">
                    <p
                        className="txt-buyno"
                        onClick={() => this.onShowExtendInfo(hasExtendInfo)}
                        style={{ cursor: hasExtendInfo ? "pointer" : "normal" }}
                    >
                        {obj.charge_buy_no}
                        {hasExtendInfo &&
                        <span className={classNames("extend-icon", { "show": isShow })}>
                            <i className="f__icon f__icon__dt" />
                        </span>
                        }
                    </p>
                </div>
                <div
                    className="charge-item__column column-3"
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: hasExtendInfo && "pointer" }}
                >
                    <div className="content-box">
                        {status.status === "노출중" ?
                            <p className="text-left txt-title" style={{ cursor: "pointer" }} onClick={() => this.props.onShowModify(obj)}>
                                <span>{category ? `[${category.name}] ` : ""}{obj.title}{Array.isArray(obj.product_list) && obj.product_list.length > 1 ? ` 외 ${obj.product_list.length - 1}개` : ""}</span>
                                <button className="_button _button__default">상품추가</button>
                            </p> :
                            <p className="text-left txt-title">
                                <span>{category ? `[${category.name}] ` : ""}{obj.title}{Array.isArray(obj.product_list) && obj.product_list.length > 1 ? ` 외 ${obj.product_list.length - 1}개` : ""}</span>
                            </p>
                        }
                        {obj.pay_type === "vbank" && obj.payment_status !== "COMPLETE" && obj.request_status !== "CANCEL" &&
                        <p className="charge-item__pay-info">- 입금기한 {mewtime(obj.vbank_date).format(dateFormat)} / {obj.vbank_name} {obj.vbank_num}</p>
                        }
                        {obj.paid_limit_dt && !obj.pay_type && obj.request_status !== "CANCEL" &&
                        <p className="charge-item__pay-info">- 결제기한 {mewtime(obj.paid_limit_dt).format(dateFormat)}</p>
                        }
                    </div>
                </div>
                <div className="charge-item__column column-1">
                    <p className="text-center"><span style={{ color: status.color }}>{status.status}</span></p>
                </div>
                <div className="charge-item__column column-1">
                    {!isFree &&
                    <div className="text-center">
                        {obj.request_status === "COMPLETE" && !obj.payment_status && today.isBefore(mewtime(obj.paid_limit_dt)) ?
                            <button className="_button payment-btn" onClick={() => this.onPayment("payment", obj)}>결제</button> : null
                        }
                        {obj.request_status === "COMPLETE" && obj.payment_status === "COMPLETE" && isBeforeEndDt && isAfterStartDt ?
                            <button className="_button payment-btn" onClick={() => this.onPayment("continue", obj)}>연장</button> : null
                        }
                    </div>
                    }
                </div>
                <div className="charge-item__column column-1">
                    <p className="text-center">{obj.reg_dt ? mewtime(obj.reg_dt).format(dateFormat) : obj.reg_dt}</p>
                </div>
                <div className="charge-item__column column-1">
                    <p className="text-center">{obj.start_dt ? mewtime(obj.start_dt).format(dateFormat) : "-"}</p>
                </div>
                <div className="charge-item__column column-1">
                    <p className="text-center">{obj.end_dt ? mewtime(obj.end_dt).format(dateFormat) : "-"}</p>
                </div>
            </div>
        );
    }

    onPayment(type, obj) {
        if (typeof this.props.onPayment === "function") {
            this.props.onPayment(type, obj);
        }
    }

    render() {
        const { item, index } = this.props;
        const { isShow } = this.state;
        return (
            <div className="charge-item">
                {item ?
                    this.renderItemRow(item, index) :
                    this.noneItemRenderRow()
                }
                <div className={classNames("charge-extend", { "show": isShow })}>
                    {this.renderExtend(item)}
                </div>
            </div>
        );
    }
}
