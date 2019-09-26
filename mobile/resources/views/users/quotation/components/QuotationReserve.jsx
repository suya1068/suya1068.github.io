import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";
import { ADDRESS_LIST } from "shared/constant/quotation.const";
import RequestJS, { STATE, CONST } from "shared/components/quotation/request/QuotationRequest";
import DropDown from "mobile/resources/components/dropdown/DropDown";
import SlimCalendar from "desktop/resources/components/calendar/SlimCalendar";

class QuotationReserve extends Component {
    constructor() {
        super();

        const reserve = RequestJS.getState(STATE.RESERVE.key);
        const categoryList = RequestJS.getState(STATE.CATEGORY_CODES);
        const d = mewtime();

        if (utils.isArray(categoryList)) {
            if (!reserve[STATE.RESERVE.CATEGORY]) {
                const index = categoryList.findIndex(c => {
                    return c.code === "";
                });

                if (index === -1) {
                    categoryList.unshift({
                        code: "",
                        display_order: "0",
                        name: "카테고리를 선택해주세요",
                        tag: null
                    });
                }

                RequestJS.setReserveState(STATE.RESERVE.CATEGORY, categoryList[0].code);
            }
        }

        if (reserve[STATE.RESERVE.REGION]) {
            const region = RequestJS.isRegion(reserve[STATE.RESERVE.REGION]);

            if (region) {
                RequestJS.setReserveState(STATE.RESERVE.REGION, region.title);
            }
        }

        if (!reserve[STATE.RESERVE.REGION] || !RequestJS.isRegion(reserve[STATE.RESERVE.REGION])) {
            RequestJS.setReserveState(STATE.RESERVE.REGION, ADDRESS_LIST[0].title);
        }

        const reserveDate = RequestJS.getReserveDate();
        const reserveTime = RequestJS.getReserveTimes();

        this.state = {
            [STATE.RESERVE.key]: reserve,
            addressList: ADDRESS_LIST.slice(),
            categoryList,
            calendar: {
                events: [],
                min: d.clone().subtract(1).format("YYYY-MM-DD"),
                // max: d.clone().add(3, mewtime.const.MONTH).format("YYYY-MM-DD"),
                date: reserveDate,
                autoSelect: true,
                isLegend: false
            },
            startHourList: [],
            endHourList: [],
            minuteList: [
                { name: "00분", value: "00" },
                { name: "30분", value: "30" }
            ],
            startHour: reserveTime.sh,
            startMinute: reserveTime.sm,
            endHour: reserveTime.eh,
            endMinute: reserveTime.em,
            prevDate: reserveDate,
            dateOption: CONST.dateOption,
            timeOption: CONST.timeOption
        };

        this.onCategory = this.onCategory.bind(this);
        this.onRegion = this.onRegion.bind(this);
        this.onSelectDate = this.onSelectDate.bind(this);
        this.onCheckUndefined = this.onCheckUndefined.bind(this);
        this.onChangeTime = this.onChangeTime.bind(this);
        this.onChangeTab = this.onChangeTab.bind(this);
        this.onSelectOption = this.onSelectOption.bind(this);

        this.makeTime = this.makeTime.bind(this);
    }

    componentWillMount() {
        const { prevDate } = this.state;

        this.state.startHourList = this.makeTime();
        this.state.endHourList = this.makeTime();

        if (prevDate) {
            this.state.calendar.autoSelect = true;
        }
    }

    componentDidMount() {
        window.scroll(0, 0);
    }

    /**
     * 카테고리 선택
     * @param value
     */
    onCategory(value) {
        this.setState(RequestJS.setReserveState(STATE.RESERVE.CATEGORY, value));
    }

    /**
     * 촬영장소
     */
    onRegion(value) {
        // const target = e.target;
        // const value = target.value;
        // const maxLength = target.maxLength;
        //
        // if (maxLength && maxLength > -1 && value.length > maxLength) {
        //     return;
        // }

        this.setState(RequestJS.setReserveState(STATE.RESERVE.REGION, value));
    }

    /**
     * 촬영날짜
     * @param obj
     */
    onSelectDate(obj) {
        const { startHourList, calendar } = this.state;
        const date = obj.date.clone().hours(23);
        const strDate = date.format("YYYYMMDD");

        const props = RequestJS.setReserveState(STATE.RESERVE.DATE, strDate);
        calendar.date = date.format("YYYY-MM-DD");
        props.prevDate = strDate;
        props.calendar = calendar;

        // const toDay = mewtime();
        // const isToday = date.isSame(toDay, mewtime.const.DATE);
        //
        // if (startHourList.length < 24 || isToday) {
        //     if (isToday && toDay.isAfter(date, mewtime.const.HOUR)) {
        //         calendar.min = toDay.format("YYYY-MM-DD");
        //         calendar.date = toDay.clone().add(1, mewtime.const.DATE).format("YYYY-MM-DD");
        //         props.calendar = calendar;
        //
        //         this.setState(props);
        //     } else if (!isToday || (isToday && !toDay.isSame(date, mewtime.const.HOUR))) {
        //         props.startHourList = this.makeTime();
        //
        //         this.setState({
        //             startHour: props.startHourList[0].value
        //         }, () => {
        //             this.setState(props);
        //         });
        //     }
        // } else {
        //     this.setState(props);
        // }

        this.setState(props);
    }

    /**
     * 날짜&시간 미정 체크
     * @param key - String (날짜 키 또는 시간 키)
     * @param b - bool (true - 체크, false - 해제)
     */
    onCheckUndefined(key, b) {
        const { prevDate, startHour, startMinute, endHour, endMinute } = this.state;
        let falseValue = null;
        let trueValue = null;

        switch (key) {
            case STATE.RESERVE.DATE:
                trueValue = "NA";
                falseValue = prevDate;
                break;
            case STATE.RESERVE.TIME:
                trueValue = "NA";
                falseValue = `${startHour}${startMinute}|${endHour}${endMinute}`;
                break;
            default:
                break;
        }

        const props = RequestJS.setReserveState(key, b ? trueValue : falseValue);

        this.setState(props);
    }

    /**
     *
     */
    onChangeTime(type, value) {
        const props = {};

        switch (type) {
            case "start_hour":
                props.startHour = value;
                break;
            case "start_minute":
                props.startMinute = value;
                break;
            case "end_hour":
                props.endHour = value;
                break;
            case "end_minute":
                props.endMinute = value;
                break;
            default:
                break;
        }

        this.setState(props, () => {
            const { startHour, startMinute, endHour, endMinute } = this.state;
            this.setState(RequestJS.setReserveState(STATE.RESERVE.TIME, `${startHour}${startMinute}|${endHour}${endMinute}`));
        });
    }

    onChangeTab(key, b) {
        let value = "";
        const { calendar } = this.state;
        const reserve = this.state[STATE.RESERVE.key];
        const prop = {};

        if (b) {
            if (key === STATE.RESERVE.DATE) {
                const date = reserve[STATE.RESERVE.DATE];
                if (RequestJS.isDate(date)) {
                    return;
                }

                const isCalendar = calendar.date;

                value = isCalendar ? calendar.date.replace(/-/g, "") : mewtime().format("YYYYMMDD");
                if (!isCalendar) {
                    calendar.date = mewtime.strToDate(value);
                    prop.calendar = calendar;
                }
            } else if (key === STATE.RESERVE.TIME) {
                value = "0000|0000";
                prop.startHour = "00";
                prop.startMinute = "00";
                prop.endHour = "00";
                prop.endMinute = "00";
            }
        }

        this.setState(Object.assign(prop, RequestJS.setReserveState(key, value)));
    }

    onSelectOption(key, value) {
        this.setState(RequestJS.setReserveState(key, value));
    }

    /**
     * 예약시간 생성
     * @return {Array}
     */
    makeTime() {
        const reserve = this.state[STATE.RESERVE.key];
        const hour = [];
        // const today = mewtime();
        // const date = reserve[STATE.RESERVE.DATE];
        // const isSame = date ? today.isSame(mewtime.strToDate(date), mewtime.const.DATE) : false;
        // const start = isSame ? today.format("HH") : 0;

        for (let i = 0; i < 24; i += 1) {
            const h = utils.fillSpace(i);
            hour.push({ name: `${h}시`, value: h });
        }

        return hour;
    }

    render() {
        const {
            calendar, categoryList, startHourList,
            endHourList, minuteList, startHour,
            startMinute, endHour, endMinute,
            dateOption, timeOption, addressList
        } = this.state;
        const reserve = this.state[STATE.RESERVE.key];
        const date = reserve[STATE.RESERVE.DATE];
        const time = reserve[STATE.RESERVE.TIME];
        let isDate = null;
        let isTime = null;

        if (RequestJS.isDate(date)) {
            isDate = true;
        } else if (RequestJS.isDateOption(date) || date === "") {
            isDate = false;
        }

        if (RequestJS.isTime(time)) {
            isTime = true;
        } else if (RequestJS.isTimeOption(time) || time === "") {
            isTime = false;
        }

        return (
            <div className="quotation__category">
                <div className="content__column">
                    <div className="content__column__head">
                        <h1>어떤 유형의 촬영인가요?</h1>
                    </div>
                    <div className="content__column__body">
                        <div className="column__box text-center">
                            <DropDown list={categoryList} select={reserve[STATE.RESERVE.CATEGORY]} keys={{ value: "code", caption: "sub_caption" }} resultFunc={value => this.onCategory(value)} size="small" />
                        </div>
                    </div>
                    <div className="content__column__head">
                        <h1>촬영날짜를 알려주세요.</h1>
                    </div>
                    <div className="content__column__body">
                        <div className="column__box direction__row">
                            <button className={classNames("button button__rect", { button__theme__muted2: isDate && isDate !== null })} onClick={() => this.onChangeTab(STATE.RESERVE.DATE, true)}>
                                <span>특정날짜</span><icon className={isDate && isDate !== null ? "m-icon-check-yellow" : "m-icon-check"} />
                            </button>
                            <div className="column__column hr" />
                            <button className={classNames("button button__rect", { button__theme__muted2: !isDate && isDate !== null })} onClick={() => this.onChangeTab(STATE.RESERVE.DATE, false)}>
                                <span>협의가능</span><icon className={!isDate && isDate !== null ? "m-icon-check-yellow" : "m-icon-check"} />
                            </button>
                        </div>
                        {isDate && isDate !== null ?
                            <div className="column__box">
                                <div className="column__row">
                                    <div className="row__content">
                                        <SlimCalendar {...calendar} onSelect={obj => this.onSelectDate(obj)} />
                                    </div>
                                </div>
                            </div> : null
                        }
                        {!isDate && isDate !== null ?
                            <div className="quotation__reserve__option">
                                {utils.isArray(dateOption) ?
                                    dateOption.map((d, i) => {
                                        const isSelect = date === d;

                                        return (
                                            <button key={`date-option-${i}`} className={classNames("button__check", { active: isSelect })} onClick={() => this.onSelectOption(STATE.RESERVE.DATE, d)}>
                                                <div className="icon__circle">
                                                    <span className={classNames("m-icon", isSelect ? "m-icon-check-white" : "m-icon-check")} />
                                                </div>
                                                <span>{d}</span>
                                            </button>
                                        );
                                    }) : null
                                }
                            </div> : null
                        }
                    </div>
                    <div className="content__column__head">
                        <h1>촬영시간을 알려주세요.</h1>
                    </div>
                    <div className="content__column__body">
                        <div className="column__box direction__row">
                            <button className={classNames("button button__rect", { button__theme__muted2: isTime && isTime !== null })} onClick={() => this.onChangeTab(STATE.RESERVE.TIME, true)}>
                                <span>특정시간</span><icon className={isTime && isTime !== null ? "m-icon-check-yellow" : "m-icon-check"} />
                            </button>
                            <div className="column__column hr" />
                            <button className={classNames("button button__rect", { button__theme__muted2: !isTime && isTime !== null })} onClick={() => this.onChangeTab(STATE.RESERVE.TIME, false)}>
                                <span>협의가능</span><icon className={!isTime && isTime !== null ? "m-icon-check-yellow" : "m-icon-check"} />
                            </button>
                        </div>
                        {isTime && isTime !== null ?
                            <div className="column__column direction__row">
                                <div className="column__box dropdown__up">
                                    <DropDown list={startHourList} select={startHour} resultFunc={value => this.onChangeTime("start_hour", value)} size="small" />
                                </div>
                                <div className="column__row direction__row align-center justify-center">~</div>
                                <div className="column__box dropdown__up">
                                    <DropDown list={endHourList} select={endHour} resultFunc={value => this.onChangeTime("end_hour", value)} size="small" />
                                </div>
                            </div> : null
                        }
                        {!isTime && isTime !== null ?
                            <div className="quotation__reserve__option">
                                {utils.isArray(timeOption) ?
                                    timeOption.map((t, i) => {
                                        const isSelect = time === t;

                                        return (
                                            <button key={`date-option-${i}`} className={classNames("button__check", { active: isSelect })} onClick={() => this.onSelectOption(STATE.RESERVE.TIME, t)}>
                                                <div className="icon__circle">
                                                    <span className={classNames("m-icon", isSelect ? "m-icon-check-white" : "m-icon-check")} />
                                                </div>
                                                <span>{t}</span>
                                            </button>
                                        );
                                    }) : null
                                }
                            </div> : null
                        }
                    </div>
                    <div className="content__column__head">
                        <h1>촬영지역을 선택해주세요.</h1>
                    </div>
                    <div className="content__column__body">
                        <div className="column__box dropdown__up text-center">
                            <DropDown list={addressList} select={reserve[STATE.RESERVE.REGION]} keys={{ name: "title", value: "title" }} resultFunc={value => this.onRegion(value)} size="small" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default QuotationReserve;
