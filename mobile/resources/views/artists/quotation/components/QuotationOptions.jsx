import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import mewtime from "forsnap-mewtime";
import ResponseJS, { STATE as RES_STATE } from "shared/components/quotation/response/QuotationResponse";
import RequestJS, { STATE as REQ_STATE } from "shared/components/quotation/request/QuotationRequest";

class QuotationOptions extends Component {
    constructor() {
        super();

        const reserveTime = RequestJS.getReserveTimes();

        this.state = {
            [REQ_STATE.RESERVE.key]: RequestJS.getState(REQ_STATE.RESERVE.key),
            [REQ_STATE.OPTIONS.key]: RequestJS.getState(REQ_STATE.OPTIONS.key),
            [RES_STATE.OPTIONS.key]: ResponseJS.getState(RES_STATE.OPTIONS.key),
            reserveTime
        };
    }

    componentWillMount() {
        const reserve = this.state[REQ_STATE.RESERVE.key];
        const categoryList = ResponseJS.getState(RES_STATE.CATEGORY_CODES);

        if (categoryList) {
            const category = categoryList.find(obj => {
                const value = reserve[REQ_STATE.RESERVE.CATEGORY];
                if (value) {
                    return obj.code === value.toUpperCase();
                }

                return false;
            });

            if (category) {
                this.state.category = category;
            }
        }
    }

    componentDidMount() {
        window.scroll(0, 0);
    }

    onChangeValue(key, value) {
        this.setState(ResponseJS.setOptionState(key, value));
    }

    render() {
        const { category, reserveTime } = this.state;

        if (!category) {
            return null;
        }

        const uReserve = this.state[REQ_STATE.RESERVE.key];
        const aOptions = this.state[RES_STATE.OPTIONS.key];
        const region = aOptions[RES_STATE.OPTIONS.REGION];
        const date = aOptions[RES_STATE.OPTIONS.DATE];
        const time = aOptions[RES_STATE.OPTIONS.TIME];
        let uDate = "미정";
        let uTime = "미정";

        if (RequestJS.isDate(uReserve[REQ_STATE.RESERVE.DATE])) {
            uDate = mewtime.strToStr(uReserve[REQ_STATE.RESERVE.DATE]);
        } else if (RequestJS.isDateOption(uReserve[REQ_STATE.RESERVE.DATE])) {
            uDate = uReserve[REQ_STATE.RESERVE.DATE];
        }

        if (RequestJS.isTime(uReserve[REQ_STATE.RESERVE.TIME])) {
            uTime = `${reserveTime.sh}시 ~ ${reserveTime.eh}시`;
        } else if (RequestJS.isTimeOption(uReserve[REQ_STATE.RESERVE.TIME])) {
            uTime = uReserve[REQ_STATE.RESERVE.TIME];
        }

        return (
            <div className="quotation__quantity">
                <div className="content__column">
                    <div className="content__column__head">
                        <h1>세부사항의 가능여부를 체크해주세요.</h1>
                    </div>
                    <div className="content__column__body">
                        <div className={classNames("column__box", "inline__box")}>
                            <div className="column__row">
                                <div className="row__title">
                                    <p className="content__caption">촬영 지역</p>
                                    {uReserve[REQ_STATE.RESERVE.REGION]}
                                </div>
                                <div className="row__content direction__row">
                                    <button className={classNames("button", "need", region === "Y" ? "active" : "")} onClick={() => this.onChangeValue(RES_STATE.OPTIONS.REGION, "Y")}>가능</button>
                                    <button className={classNames("button", region === "NA" ? "active" : "")} onClick={() => this.onChangeValue(RES_STATE.OPTIONS.REGION, "NA")}>협의</button>
                                    <button className={classNames("button", region === "N" ? "active" : "")} onClick={() => this.onChangeValue(RES_STATE.OPTIONS.REGION, "N")}>불가</button>
                                </div>
                            </div>
                        </div>
                        <div className={classNames("column__box", "inline__box")}>
                            <div className="column__row">
                                <div className="row__title">
                                    <p className="content__caption">촬영 날짜</p>
                                    {uDate}
                                </div>
                                <div className="row__content direction__row">
                                    <button className={classNames("button", "need", date === "Y" ? "active" : "")} onClick={() => this.onChangeValue(RES_STATE.OPTIONS.DATE, "Y")}>가능</button>
                                    <button className={classNames("button", date === "NA" ? "active" : "")} onClick={() => this.onChangeValue(RES_STATE.OPTIONS.DATE, "NA")}>협의</button>
                                    <button className={classNames("button", date === "N" ? "active" : "")} onClick={() => this.onChangeValue(RES_STATE.OPTIONS.DATE, "N")}>불가</button>
                                </div>
                            </div>
                        </div>
                        <div className={classNames("column__box", "inline__box")}>
                            <div className="column__row">
                                <div className="row__title">
                                    <p className="content__caption">촬영 시간</p>
                                    {uTime}
                                </div>
                                <div className="row__content direction__row">
                                    <button className={classNames("button", "need", time === "Y" ? "active" : "")} onClick={() => this.onChangeValue(RES_STATE.OPTIONS.TIME, "Y")}>가능</button>
                                    <button className={classNames("button", time === "NA" ? "active" : "")} onClick={() => this.onChangeValue(RES_STATE.OPTIONS.TIME, "NA")}>협의</button>
                                    <button className={classNames("button", time === "N" ? "active" : "")} onClick={() => this.onChangeValue(RES_STATE.OPTIONS.TIME, "N")}>불가</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default QuotationOptions;
