import "./chargePeriod.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "forsnap-utils";

export default class ChargePeriod extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weekButtonCount: 4,
            week: props.week || 2,
            priceUnit: 110000,
            addDate: null,
            onlyPeriod: props.onlyPeriod || false
        };
        this.onSelectWeek = this.onSelectWeek.bind(this);
        this.checkSelectWeek = this.checkSelectWeek.bind(this);
        this.getPaymentWeek = this.getPaymentWeek.bind(this);
        this.getTotalPrice = this.getTotalPrice.bind(this);
    }

    componentWillReceiveProps(np) {
        if (!this.props.onlyPeriod) {
            this.setState({
                week: 2,
                addDate: null
            });
        }
    }

    /**
     * 결제할 주 선택
     * @param week
     */
    onSelectWeek(week, flag) {
        let addDate = null;

        switch (week) {
            case 4: addDate = 2; break;
            case 6: addDate = 4; break;
            case 8: addDate = 7; break;
            default: addDate = null;
        }

        if (!flag) {
            this.setState({
                week,
                addDate
            }, () => {
                if (typeof this.props.onChangePeriod === "function") {
                    this.props.onChangePeriod(week, addDate);
                }
            });
        }
    }

    /**
     * 주 버튼 선택 체크
     * @param week
     * @returns {boolean}
     */
    checkSelectWeek(week) {
        return this.state.week === week;
    }

    /**
     * 서비스 추가 일자 가져오기
     * @returns {null}
     */
    getAddDate() {
        return this.state.addDate;
    }

    /**
     * 결제할 주 수를 조회
     * @returns {*|boolean|number}
     */
    getPaymentWeek() {
        return this.state.week;
    }

    /**
     * 결제 가격 조회
     * @returns {number}
     */
    getTotalPrice() {
        const { week, priceUnit } = this.state;
        return priceUnit * week;
    }

    render() {
        const { onlyPeriod, isFree } = this.props;
        const { weekButtonCount, week, priceUnit } = this.state;
        return (
            <div className="charge-artist__row charge-artist__period">
                <div className="charge-artist__column">
                    {!onlyPeriod &&
                    <p className="column__title txt_period">광고기간</p>
                    }
                    <div className="column__content">
                        <div className="week-period-box">
                            {Array.from(new Array(weekButtonCount)).map((obj, idx) => {
                                const _week = (idx + 1) * 2;
                                let addDate = 0;
                                const weekCheck = (idx + 1) * 2;
                                const isFreeSelectFlag = weekCheck > 2;

                                switch (_week) {
                                    case 4: addDate = 2; break;
                                    case 6: addDate = 4; break;
                                    case 8: addDate = 7; break;
                                    default: addDate = 0;
                                }

                                return (
                                    <div
                                        className={classNames("week", { "disabled": isFree && isFreeSelectFlag }, { "select": this.checkSelectWeek(weekCheck) })}
                                        key={`week__${1 + idx}`}
                                        onClick={() => this.onSelectWeek(weekCheck, isFree && isFreeSelectFlag)}
                                    >
                                        {`${weekCheck}주`}
                                        {!!addDate && !isFree &&
                                            <span className="add-date" style={{ color: "#e02020", paddingLeft: 5 }}>+ {addDate}일</span>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {!onlyPeriod && !isFree &&
                    <div className="column__caption">
                        <span className="column__caption__upper-title">
                            {`${week}주 ${utils.format.price(week * priceUnit)}원`} <span className="txt_vat">(VAT포함)</span>
                        </span>
                    </div>
                    }
                </div>
            </div>
        );
    }
}
