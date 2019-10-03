import React, { Component, PropTypes } from "react";
import ChargeItem from "./ChargeItem";
import classNames from "classnames";

export default class ChargeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            show: false
        };
        this.onPayment = this.onPayment.bind(this);
        this.onShowInfo = this.onShowInfo.bind(this);
        this.onHideInfo = this.onHideInfo.bind(this);
    }

    componentWillMount() {
    }

    onPayment(type, obj) {
        if (typeof this.props.onPayment === "function") {
            this.props.onPayment(type, obj);
        }
    }

    onShowInfo() {
        this.setState({ show: true });
    }

    onHideInfo() {
        this.setState({ show: false });
    }

    render() {
        const { list } = this.props;
        const { show } = this.state;

        return (
            <div className="charge-artist__list__content">
                <div className="content-head">
                    <p className="content-title">광고신청현황</p>
                    <div className="charge-info-box">
                        <button className="_button content-info-box" onMouseEnter={this.onShowInfo} onMouseLeave={this.onHideInfo}>진행상태가 궁금하신가요?</button>
                        <div className={classNames("pop-info-box", { "show": show })}>
                            <div className="arrow-top" />
                            <p className="pop-info-box__title">진행상태가 궁금하신가요?</p>
                            <div className="pop-info-box__content">
                                <div className="pop-info-box__row">
                                    <p className="row-title color-dodger-blue">승인대기중</p>
                                    <p className="row-desc">광고 신청 후 포스냅에서 검수중인 상태로 카테고리에 맞는
                                        포트폴리오등록 등을 기반으로 승인여부가 결정됩니다. </p>
                                </div>
                                <div className="pop-info-box__row">
                                    <p className="row-title color-dodger-blue2">추가요청중</p>
                                    <p className="row-desc">광고 신청 후 포스냅에서 검수중인 상태로 카테고리에 맞는
                                        포트폴리오등록 등을 기반으로 승인여부가 결정됩니다. </p>
                                </div>
                                <div className="pop-info-box__row">
                                    <p className="row-title color-strong-cyan">승인완료</p>
                                    <p className="row-desc">신청한 광고가 승인되어 결제 진행 가능한 상태입니다.
                                        결제를 진행하시면 바로 광고영역에 등록됩니다.</p>
                                </div>
                                <div className="pop-info-box__row">
                                    <p className="row-title color-mandarin">노출중</p>
                                    <p className="row-desc">광고영역에 등록되어 노출중인 상태입니다.
                                    </p>
                                </div>
                                <div className="pop-info-box__row">
                                    <p className="row-title color-vivid-red">비승인</p>
                                    <p className="row-desc">포트폴리오 미흡 등의 사유로 반려된 상태입니다.
                                        포트폴리오를 다시 정비하신 후 광고를 재신청하실 수 있습니다. </p>
                                </div>
                                <div className="pop-info-box__row">
                                    <p className="row-title color-vivid-red">만료</p>
                                    <p className="row-desc">광고기간이 만료되었거나 상품에 대한 판매가
                                        중지된 상태로 광고영역에 노출되지 않습니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-list-box">
                    <ChargeItem item={null} />
                    {list.map((obj, idx) => {
                        return (
                            <ChargeItem
                                item={obj}
                                onPayment={this.onPayment}
                                onShowModify={this.props.onShowModify}
                                key={`charge_item__${idx}`}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}
