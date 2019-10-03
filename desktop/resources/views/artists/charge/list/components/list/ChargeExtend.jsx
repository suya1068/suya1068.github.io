import React, { Component, PropTypes } from "react";
import mewtime from "forsnap-mewtime";

export default class ChargeExtend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            dateFormat: "YYYY-MM-DD",
            end_dt: props.end_dt || ""
        };

        this.renderItemRow = this.renderItemRow.bind(this);
        this.exchangeStatus = this.exchangeStatus.bind(this);
    }

    componentWillMount() {
    }

    /**
     * 연장 신청 시 상태값 변경 로직
     * :: 연장시엔 승인대기중인 상태가 없다.
     * ::
     * @param data
     * @returns {*}
     */
    exchangeStatus(data) {
        const requestStatus = data.request_status;
        const paymentStatus = data.payment_status;

        const today = mewtime();
        const payType = data.pay_type;

        let status = "";
        let color = "";

        if (requestStatus === "COMPLETE" && paymentStatus !== "COMPLETE") {
            status = "승인완료";
            color = "#02c196";

            if (payType === "vbank") {
                if (data.vbank_date && today.isAfter(mewtime(data.vbank_date))) {
                    status = "만료";
                    color = "#e02020";
                }
            }
        } else if (requestStatus === "COMPLETE" && paymentStatus === "COMPLETE") {
            status = "노출중";
            color = "#f7b500";
        } else if (requestStatus === "RETURN" || requestStatus === "CANCEL") {
            status = "비승인";
            color = "#e02020";
        } else {
            status = requestStatus;
        }

        return <span style={{ color }}>{status}</span>;
    }

    renderItemRow(obj) {
        const { end_dt } = this.props;
        const { dateFormat } = this.state;

        const payTypeIsBank = obj.pay_type === "vbank";

        // 입금기한
        let vbankLimitDate = payTypeIsBank && obj.vbank_date;
        if (payTypeIsBank && end_dt) {
            const limitDay = obj.vbank_date ? mewtime(obj.vbank_date) : null;

            if (limitDay.isAfter(mewtime(end_dt))) {
                vbankLimitDate = end_dt;
            }
        }


        return (
            <div className="charge-item__row" style={{ borderBottom: "1px solid #e1e1e1", opacity: "0.8" }}>
                <div className="charge-item__column column-2">
                    <p className="text-center">{obj.charge_buy_no}</p>
                </div>
                <div
                    className="charge-item__column column-3"
                    style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}
                >
                    <p className="text-left">{obj.title}</p>
                    {obj.pay_type === "vbank" && obj.payment_status !== "COMPLETE" &&
                    <p className="charge-item__pay-info">- 입금기한 {mewtime(vbankLimitDate).format(dateFormat)} / {obj.vbank_name} {obj.vbank_num}</p>
                    }
                </div>
                <div className="charge-item__column column-1">
                    <p className="text-center">{this.exchangeStatus(obj)}</p>
                </div>
                <div className="charge-item__column column-1">
                    {}
                </div>
                <div className="charge-item__column column-1">
                    <p className="text-center">{obj.reg_dt ? mewtime(obj.reg_dt).format(dateFormat) : obj.reg_dt}</p>
                </div>
                <div className="charge-item__column column-2">
                    <p className="text-center">
                        {obj.week ? `연장기간 ${obj.week} 주` : "-"}
                    </p>
                </div>
            </div>
        );
    }

    render() {
        const { data } = this.props;
        return (
            this.renderItemRow(data)
        );
    }
}
