import "./popChargePayment.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import ChargePayment from "../payment/ChargePayment";
import ChargePeriod from "../period/ChargePeriod";

export default class PopChargePayment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            week: props.week || 2,
            data: props.data,
            type: props.type,
            addDate: null
        };
        this.onChangePeriod = this.onChangePeriod.bind(this);
    }

    componentWillMount() {
        const { week, type } = this.props;
        this.setState({
            week: type === "continue" ? 2 : week
        });
    }

    payment(type, data) {
        const { addDate } = this.state;
        if (typeof this.props.payment === "function") {
            const params = {
                payMethod: this.ChargePayment.getPaymentMethod(),
                price: data.price,
                charge_buy_no: data.charge_buy_no,
                title: data.title
            };

            if (addDate) {
                params.add_period = addDate;
            }

            if (type === "continue") {
                params.week = this.state.week;
            }

            this.props.payment(type, { ...params });
        }
    }

    onChangePeriod(week, addDate) {
        this.setState({
            week,
            addDate
        });
    }

    render() {
        const { onClose, data, type } = this.props;
        const { week, addDate } = this.state;

        return (
            <div className="pop-charge-payment">
                <div className="forsnap__logo">
                    <img alt="logo" src={`${__SERVER__.img}/common/f_logo_black.png`} />
                    <button className="_button _button__close black__lighten" onClick={onClose} />
                </div>
                <div className="pop-charge-payment__head">
                    <p className="head-title">광고상품 {type === "payment" ? "결제" : "연장"}</p>
                </div>
                <div className="pop-charge-payment__content">
                    <p className="content-title">
                        <span className="yellow-text">[상품명]</span>
                        {data.title}
                    </p>
                    {type === "continue" &&
                    <div className="pop-charge-payment__period">
                        <ChargePeriod
                            ref={instance => (this.ChargePeriod = instance)}
                            onChangePeriod={this.onChangePeriod}
                            onlyPeriod
                        />
                    </div>
                    }
                    <div className="content-price">
                        <p className="total-price">
                            <span>{week}주</span>
                            {data.add_period && type === "payment" &&
                            <span style={{ margin: "0 3px" }}>{`(+ ${data.add_period}일)`}</span>
                            }
                            {type === "continue" && addDate &&
                            <span style={{ margin: "0 3px" }}>{`(+ ${addDate}일)`}</span>
                            }
                            <span>{utils.format.price(week * 110000)} 원</span>
                        </p>
                    </div>
                    <div className="content-paymethod">
                        <ChargePayment ref={instance => (this.ChargePayment = instance)} />
                    </div>
                </div>
                <div className="pop__button">
                    <button className="_button _button__fill__yellow1" onClick={() => this.payment(type, data)}>결제하기</button>
                </div>
                <div className="pop-charge-payment__info">
                    <p className="info-title">주의사항</p>
                    <p className="info-desc">결제 전 확인해주세요!</p>
                    <ul className="info-list">
                        <li className="info-item">광고는 입금 즉시 노출되기 때문에 일시중지가 불가능합니다.</li>
                        {/*<li className="info-item">일주일 이상 신청한 경우 해당주를 제외한 나머지 기간에 대한 환불만 가능합니다.</li>*/}
                        <li className="info-item">광고기간이 2주 이상 남은 경우에만 2주 단위로만 환불 가능합니다.</li>
                        <li className="info-item">4주이상 신청 시 추가되는 기간 (4주+2일,6주+4일,8주+7일)의 경우 환불되지 않으며,
                            환불신청 시 해당 기간을 뺀 나머지 기간에 대해서만 환불 가능합니다.</li>
                        <li className="info-item">신청한 상품을 삭제하거나 비노출 상태로 변경하는 경우 광고영역에 노출되지 않으며
                            삭제 및 상태변경으로 인한 환불은 불가능합니다.</li>
                        <li className="info-item">광고 구매 후 패널티가 부여되어 포스냅의 사용이 정지된 경우, 사이트 내 규정을 위반하여
                            패널티가 부과된 것이기 때문에 일시중지 및 환불이 불가합니다.</li>
                        <li className="info-item">환불 및 기타 문의는 포스냅 고객센터를 통해 접수해주세요.</li>
                    </ul>
                </div>
            </div>
        );
    }
}
