import React, { Component, PropTypes } from "react";
import classnames from "classnames";

import utils from "forsnap-utils";
import desktopAPI from "desktop/resources/management/desktop.api";
import mewtime from "forsnap-mewtime";

import { FORMAT, SIZE } from "./constant/calendar.const";
import Week from "./components/Week";
import Day from "./components/Day";
import Icon from "../icon/Icon";
import "./slim_calendar.scss";


class SlimCalendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            entity: {
                events: props.events
            },
            selected: null,
            today: props.today ? new Date(props.today) : new Date(),
            date: props.date ? new Date(props.date) : new Date(),

            weeks: [],
            days: [],
            events: [],

            size: props.size,

            min: typeof props.min === "boolean" && props.min ? mewtime().format(FORMAT.SHOT) : props.min,
            max: typeof props.max === "boolean" && props.max ? mewtime().add(90).format(FORMAT.SHOT) : props.max,
            autoSelect: props.autoSelect
        };

        // Interaction
        this.onSelect = this.onSelect.bind(this);
        this.onEvent = this.onEvent.bind(this);
        this.onPrev = this.onPrev.bind(this);
        this.onNext = this.onNext.bind(this);

        // Generate Data
        this.composeDate = this.composeDate.bind(this);
        this.composeEvents = this.composeEvents.bind(this);
        this.combineDateAndEvents = this.combineDateAndEvents.bind(this);
        this.combineOptions = this.combineOptions.bind(this);

        // Check
        this.checkMinDate = this.checkMinDate.bind(this);
        this.checkMaxDate = this.checkMaxDate.bind(this);
        this.checkSelect = this.checkSelect.bind(this);
        this.isEnableReservation = this.isEnableReservation.bind(this);

        this.getDate = this.getDate.bind(this);
        this.getPrev = this.getPrev.bind(this);
        this.getNext = this.getNext.bind(this);
        // this.getEvents = this.getEvents.bind(this);
    }

    componentWillMount() {
        this.setState(this.combineOptions(this.combineDateAndEvents()));
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            entity: { ...this.state.entity, events: nextProps.events },
            date: nextProps.date === this.props.date ? this.state.date : new Date(nextProps.date),
            min: typeof nextProps.min === "boolean" && nextProps.min ? mewtime().format(FORMAT.SHOT) : nextProps.min,
            max: typeof nextProps.max === "boolean" && nextProps.max ? mewtime().add(90).format(FORMAT.SHOT) : nextProps.max
            //selected: nextProps.date === this.props.date ? null : this.state.selected
            //selected: nextProps.date === this.props.date ? this.state.selected : null
        }, () => {
            const data = this.combineOptions(this.combineDateAndEvents());
            this.setState({ ...data });
        });
    }

    /**
     * 날짜를 선택한다.
     * @param day
     */
    onSelect(day) {
        if (this.state.selected) {
            this.state.selected.select = false;
        }
        day.select = true;

        this.setState({ selected: day }, () => {
            if (this.props.onSelect) {
                this.props.onSelect(day);
            }
        });
    }

    onEvent() {
        if (this.props.onEvent) {
            this.props.onEvent();
        }
    }

    /**
     * 이전 달을 클릭한다.
     */
    onPrev(e) {
        e.preventDefault();

        this.setState({
            date: mewtime(this.state.date).subtract(1, mewtime.const.MONTH)._d
        }, () => {
            this.setState(this.combineOptions(this.combineDateAndEvents()));

            if (typeof this.props.onPrev === "function") {
                this.props.onPrev({
                    type: "month",
                    date: mewtime(this.state.date).format("YYYYMM")
                });
            }
        });
    }

    /**
     * 다음 달을 클릭한다.
     */
    onNext(e) {
        e.preventDefault();

        this.setState({
            date: mewtime(this.state.date).add(1, mewtime.const.MONTH)._d
        }, () => {
            this.setState(this.combineOptions(this.combineDateAndEvents()));

            if (typeof this.props.onNext === "function") {
                this.props.onNext({
                    type: "month",
                    date: mewtime(this.state.date).format("YYYYMM")
                });
            }
        });
    }

    /**
     * 현재 달에 필요한 정보를 가져온다.
     * @param {MewTime} date
     * @returns {{year, month: *, rows: number, startDayOfWeek: number, daysInMonth: number}}
     */
    getDate(date) {
        const startDayOfWeek = date.clone().startOf(mewtime.const.MONTH).day();
        const daysInMonth = date.daysInMonth();
        const rows = Math.ceil((startDayOfWeek + daysInMonth) / 7);

        return { year: date.year(), month: date.month() + 1, rows, startDayOfWeek, daysInMonth };
    }

    /**
     * 이전 달 정보를 가져온다.
     * @param {MewTime} date
     * @returns {{year, month: *, rows: number, startDayOfWeek: number, daysInMonth: number}}
     */
    getPrev(date) {
        return this.getDate(date.clone().subtract(1, mewtime.const.MONTH).endOf(mewtime.const.MONTH));
    }

    /**
     * 다음 달 정보를 가져온다.
     * @param {MewTime} date
     * @returns {{year, month: *, rows: number, startDayOfWeek: number, daysInMonth: number}}
     */
    getNext(date) {
        return this.getDate(date.clone().add(1, mewtime.const.MONTH).startOf(mewtime.const.MONTH));
    }

    /**
     * 캘린더 날짜를 구성한다.
     * @returns {Array}
     */
    composeDate() {
        const current = mewtime(this.state.date);
        const startMonth = current.clone().startOf(mewtime.const.MONTH);
        const startWeek = startMonth.clone().startOf(mewtime.const.WEEK);
        const endMonth = current.clone().endOf(mewtime.const.MONTH);
        const endWeek = endMonth.clone().endOf(mewtime.const.WEEK);

        const day = mewtime(startWeek);
        const days = [];
        while (day.isBetween(startWeek, endWeek, mewtime.const.DATE, "[]")) {
            days.push({
                date: day.clone(),
                events: [],
                visible: day.isBetween(startMonth, endMonth, mewtime.const.DATE, "[]"),
                disable: false,
                select: false
            });
            day.add(1, mewtime.const.DATE);
        }

        return days;
    }

    /**
     * 캘린더 이벤트 데이터를 구성한다.
     */
    composeEvents() {
        return this.state.entity.events.map(({ calendar_no, type, comment, start_dt, end_dt }) => {
            return {
                id: utils.getUUID(),
                calendar_no,
                type,
                comment,
                start: mewtime(`${start_dt.substring(0, 4)}-${start_dt.substring(4, 6)}-${start_dt.substring(6, 8)}`),
                end: mewtime(`${end_dt.substring(0, 4)}-${end_dt.substring(4, 6)}-${end_dt.substring(6, 8)}`)
            };
        });
    }

    combineDateAndEvents() {
        const days = this.composeDate();
        const weeks = utils.chunk(days, 7);
        const events = this.composeEvents();

        for (let row = 0, rowLeng = weeks.length; row < rowLeng; row += 1) {
            const weekList = weeks[row];

            for (let day = 0, dayLeng = weekList.length; day < dayLeng; day += 1) {
                const o = weekList[day];

                events.forEach(evt => {
                    if (o.date.isBetween(evt.start, evt.end, null, "[]")) {
                        o.disable = this.isEnableReservation(o, evt);
                        o.events.push(evt);
                    }
                });
            }
        }

        return { days, weeks, events };
    }

    /**
     * 캘린더를 위한 설정 정보를 생성한다.
     */
    combineOptions({ days, weeks, events }) {
        let selected = this.state.selected;

        for (let row = 0, rowLeng = weeks.length; row < rowLeng; row += 1) {
            const weekList = weeks[row];

            for (let day = 0, dayLeng = weekList.length; day < dayLeng; day += 1) {
                const o = weekList[day];

                o.disable = this.checkMinDate(o, this.state.min);
                o.disable = this.checkMaxDate(o, this.state.max);
                o.select = this.checkSelect(o, this.props.date);

                if (o.select) {
                    selected = o;
                }
            }
        }

        return { days, weeks, events, selected };
    }

    /**
     * min date가 있다면, min date 이후인지 판단한다.
     * @param day
     * @param min
     * @returns {*}
     */
    checkMinDate(day, min) {
        if (!day.disable && min) {
            return day.date.isSameOrBefore(min, mewtime.const.DATE);
        }

        return day.disable;
    }

    /**
     * max date가 있다면, max date 전인지 판단한다.
     * @param day
     * @param max
     * @returns {*}
     */
    checkMaxDate(day, max) {
        if (!day.disable && max) {
            return day.date.isSameOrAfter(max, mewtime.const.DATE);
        }

        return day.disable;
    }

    /**
     * 선택된 날짜 존재하는지, 선택 가능한 날짜인지 판단한다.
     * @param day
     * @param date
     * @returns {boolean}
     */
    checkSelect(day, date) {
        if (!day.disable) {
            if (this.state.selected) {
                return this.state.selected.date.isSame(day.date.format(FORMAT.SHOT), mewtime.const.DATE);
            }
            return this.state.autoSelect && day.date.isSame(date, mewtime.const.DATE);
        }

        return day.select;
    }

    /**
     * 예약 가능 여부를 판단한다.
     * @param evt
     * @returns {boolean}
     */
    isEnableReservation(day, evt) {
        return day.disable || evt.type === "IMPOSSIBLE";
    }

    render() {
        return (
            <div style={{ width: "100%" }} className={classnames("slim-calendar", { "slim-calendar-large": this.props.size === SIZE.LARGE })}>
                <div className="slim-calendar-container">
                    <div className="slim-calendar__toolbar">
                        <div className="slim-calendar__toolbar-container">
                            <span className="slim-calendar-title">{this.state.date.getFullYear()}년 {this.state.date.getMonth() + 1}월</span>
                            <a href="" className="slim-calendar-prev-btn" role="button" onClick={this.onPrev}>
                                { this.props.size === SIZE.base ? <Icon name="lt_s" /> : <Icon name="lt" /> }
                            </a>
                            <a href="" className="slim-calendar-next-btn" role="button" onClick={this.onNext}>
                                { this.props.size === SIZE.base ? <Icon name="gt_s" /> : <Icon name="gt" /> }
                            </a>
                        </div>
                    </div>
                    <div className="slim-calendar__view">
                        <div className="slim-calendar__view-container">
                            <table className="slim-calendar-skeleton">
                                <thead className="slim-calendar-skeleton__header">
                                    <tr>
                                        {
                                            ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(name => (
                                                <th key={name} className="slim-calendar-column"><span>{name}</span></th>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                <tbody className="slim-calendar-skeleton__body">
                                    {
                                        this.state.weeks.map((week, i) => (
                                            <Week
                                                key={`week-${utils.getUUID()}`}
                                                days={week}
                                                onSelect={this.onSelect}
                                            />
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {this.props.isLegend ?
                        <div className="slim-calendar__label">
                            <div className="slim-calendar__label-container">
                                <div>
                                    <span className="slim-calendar-label slim-calendar-label--has-event">문의필수</span>
                                    <span className="slim-calendar-label slim-calendar-label--disabled">촬영불가</span>
                                    <span className="slim-calendar-label slim-calendar-label--selected">선택</span>
                                </div>
                            </div>
                        </div>
                        : null}
                </div>
            </div>
        );
    }
}

SlimCalendar.propTypes = {
    // data
    events: PropTypes.arrayOf(PropTypes.shape({
        no: PropTypes.string,
        type: PropTypes.string,
        start_dt: PropTypes.string,
        end_dt: PropTypes.string
    })).isRequired,

    // layout
    // view: PropTypes.string,
    size: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            rowHeight: PropTypes.number
        })
    ]),

    // option
    today: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    autoSelect: PropTypes.bool,

    // hooks
    onSelect: PropTypes.func,
    onEvent: PropTypes.func,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    isLegend: PropTypes.bool
};

SlimCalendar.defaultProps = {
    size: SIZE.BASE,

    today: new Date(),
    date: new Date(),
    min: false,
    max: false,
    autoSelect: true,

    onSelect: null,
    onEvent: null,
    onPrev: null,
    onNext: null,
    isLegend: true
};

export default SlimCalendar;
