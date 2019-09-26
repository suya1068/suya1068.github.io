import "./full_calendar.scss";
import React, { Component, PropTypes, createElement } from "react";
import update from "immutability-helper";
import classNames from "classnames";

import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";
import siteDispatcher from "desktop/resources/components/siteDispatcher";
import constant from "shared/constant";

import Buttons from "desktop/resources/components/button/Buttons";
import PopModal from "shared/components/modal/PopModal";
import PopupSchedule from "desktop/resources/components/pop/popup/PopupSchedule";

const objectKeys = {
    start_dt: "start_dt",
    end_dt: "end_dt",
    title: "title",
    comment: "comment",
    uid: "calendar_no",
    type: "type",
    location: "",
    description: ""
};

const mouseEventType = {
    INFO: "INFO",
    REGIST_START: "REGIST_START",
    REGIST_END: "REGIST_END",
    DRAG: "DRAG",
    SELECT: "SELECT"
};

class FullCalendar extends Component {
    constructor(props) {
        super(props);

        let data = props.data;

        if (!data) {
            data = {};
        }

        this.state = {
            basic: {
                date: data.date ? data.date : mewtime(),
                day: data.day ? data.day : 7,
                dayweek: data.dayweek ? data.dayweek : 0
            },
            events: {},
            eventsList: {},
            schedule: {},
            scheduleList: {},
            keys: data.keys ? data.keys : objectKeys,
            currentDate: data.date ? data.date.clone().startOf(mewtime.const.MONTH) : mewtime().startOf(mewtime.const.MONTH),
            days: 0,
            week: 0,
            dayweek: 0,
            styleContainer: {},
            calendarUID: "",
            isLoading: true,
            onRegist: data.onRegist ? data.onRegist : undefined,
            onModify: data.onModify ? data.onModify : undefined,
            getEvent: data.getEvent ? data.getEvent : undefined,
            dispatcherId: "",
            isDrag: false,
            pos: {},
            mouseEvent: {}
        };

        this.onTraceMousePosition = this.onTraceMousePosition.bind(this);

        this.dispatcher = this.dispatcher.bind(this);

        // 캘린더 초기화
        this.calculLayoutData = this.calculLayoutData.bind(this);
        this.calculLayout = this.calculLayout.bind(this);
        this.calculEventData = this.calculEventData.bind(this);

        // 이벤트
        this.onNext = this.onNext.bind(this);
        this.onPrev = this.onPrev.bind(this);
        this.onToday = this.onToday.bind(this);
        this.onRegist = this.onRegist.bind(this);
        this.onModify = this.onModify.bind(this);

        // 캘린더 마우스 이벤트
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);

        this.getEvent = this.getEvent.bind(this);

        this.setMouseEvent = this.setMouseEvent.bind(this);
        this.setRegist = this.setRegist.bind(this);

        // 그리기
        this.createCalendarLayout = this.createCalendarLayout.bind(this);
        this.createEventLayout = this.createEventLayout.bind(this);

        // 팝업
        this.schedulePopup = this.schedulePopup.bind(this);
    }

    componentWillMount() {
        const dispatcherId = siteDispatcher.register(this.dispatcher);
        this.state.dispatcherId = dispatcherId;

        this.calculLayoutData();
        this.state.calendarUID = utils.getUUID();

        window.addEventListener("resize", this.calculLayout);
        window.addEventListener("mousemove", this.onTraceMousePosition, false);
    }

    componentDidMount() {
        const dataEvents = this.props.data.events;

        setTimeout(this.calculLayout, 10);

        if (dataEvents) {
            this.calculEventData(dataEvents, true);
        } else {
            const rs = this.getEvent();
            if (rs) {
                rs.request.then(data => {
                    if (rs.prevDate === data.startDt && rs.nextDate === data.endDt) {
                        if (data) {
                            this.calculEventData(data.list, true);
                        }
                    }
                }).catch(error => {
                    PopModal.alert(error.data);
                });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentWillUpdate() {
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.calculLayout);
        window.removeEventListener("mousemove", this.onTraceMousePosition, false);
    }

    onTraceMousePosition(e) {
        if (e && e instanceof MouseEvent && e.clientX && e.clientY) {
            this.state.posX = e.clientX;
            this.state.posY = e.clientY;
        }
    }

    /**
     * 일정 등록
     * @param startDate - String (YYYY-MM-DD)
     * @param endDate - String (YYYY-MM-DD)
     */
    onRegist(startDate, endDate = undefined) {
        const obj = {
            startDate,
            endDate: (endDate !== undefined ? endDate : startDate)
        };

        let b = true;
        if (typeof this.state.onRegist === "function") {
            b = this.state.onRegist(obj);
        }

        if (b) {
            this.schedulePopup(obj);
        }
    }

    /**
     * 일정 수정
     * @param obj - Object (startDate, endDate, data)
     */
    onModify(obj) {
        let b = true;
        if (typeof this.state.onModify === "function") {
            b = this.state.onModify({ data: obj });
        }

        if (b) {
            const keys = this.state.keys;

            const data = {
                startDate: mewtime.strToDateTime(obj[keys.start_dt]),
                endDate: mewtime.strToDateTime(obj[keys.end_dt]),
                data: obj
            };

            const startDate = mewtime(data.startDate);
            const endDate = mewtime(data.endDate);
            const isDay = endDate.format("HHmm") === "2359";
            const format = isDay ? "YYYY년 MM월 DD일" : "YYYY년 MM월 DD일 a/p hh시";

            const content = (
                <div className="full__calendar__schedule__info">
                    <div className="schedule__info__head">
                        <div className={classNames("schedule__info__head__title", obj[keys.type].toLowerCase())}>
                            <span>{obj[keys.title]}</span>
                        </div>
                        <div className="schedule__info__head__buttons">
                            {!obj.reserve_no ?
                                <Buttons buttonStyle={{ size: "small", theme: "bg-white" }} inline={{ onClick: () => { PopModal.close("", () => this.schedulePopup(data)); } }}>수정하기</Buttons>
                                : null
                            }
                        </div>
                    </div>
                    <div className="schedule__info__body">
                        <div className="info__body__line">
                            <span>일시</span>
                            <p>{startDate.format(format)} ~ {endDate.format(format)} {isDay ? "[종일]" : ""}</p>
                        </div>
                        {obj[keys.comment] && obj[keys.comment] !== "" ?
                            <div className="info__body__line">
                                <span>설명</span>
                                <p>{utils.linebreak(obj[keys.comment])}</p>
                            </div>
                            : null
                        }
                    </div>
                </div>
            );

            PopModal.pop(content, this.state.posX, this.state.posY);
        }
    }

    // 다음 달
    onNext() {
        const currentDate = this.state.currentDate;
        currentDate.add(1, mewtime.const.MONTH);

        this.calculLayoutData(true, () => {
            const rs = this.getEvent();
            if (rs) {
                rs.request.then(data => {
                    if (rs.prevDate === data.startDt && rs.nextDate === data.endDt) {
                        if (data) {
                            this.calculEventData(data.list, true);
                        }
                    }
                }).catch(error => {
                    PopModal.alert(error.data);
                });
            }
        });
    }

    // 이전 달
    onPrev() {
        const currentDate = this.state.currentDate;
        currentDate.subtract(1, mewtime.const.MONTH);

        this.calculLayoutData(true, () => {
            const rs = this.getEvent();
            if (rs) {
                rs.request.then(data => {
                    if (rs.prevDate === data.startDt && rs.nextDate === data.endDt) {
                        if (data) {
                            this.calculEventData(data.list, true);
                        }
                    }
                }).catch(error => {
                    PopModal.alert(error.data);
                });
            }
        });
    }

    // 현재 달
    onToday() {
        const basic = this.state.basic;
        const isMonth = basic.date.isSame(this.state.currentDate, mewtime.const.MONTH);
        if (!isMonth) {
            this.state.currentDate = basic.date.clone().startOf(mewtime.const.MONTH);
            this.calculLayoutData(true, () => {
                const rs = this.getEvent();
                if (rs) {
                    rs.request.then(data => {
                        if (rs.prevDate === data.startDt && rs.nextDate === data.endDt) {
                            if (data) {
                                this.calculEventData(data.list, true);
                            }
                        }
                    }).catch(error => {
                        PopModal.alert(error.data);
                    });
                }
            });
        }
    }

    /**
     * 달력 안에서 마우스 다운 이벤트
     * @param e
     */
    onMouseDown(e) {
        this.state.isDrag = true;
        this.state.pos = { x: e.pageX, y: e.pageY };
    }

    /**
     * 달력 안에서 마우스 업 이벤트
     * @param e
     */
    onMouseUp(e) {
        if (this.state.isDrag) {
            this.state.isDrag = false;

            const mouseEvent = this.state.mouseEvent;
            this.state.mouseEvent = null;

            if (mouseEvent) {
                switch (mouseEvent.type) {
                    case mouseEventType.INFO:
                        this.onModify(mouseEvent.data);
                        break;
                    case mouseEventType.REGIST_START:
                    case mouseEventType.REGIST_END:
                        this.onRegist(mouseEvent.data.startDate, mouseEvent.data.endDate);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    /**
     * 달력 안에서 마우스 이동 이벤트
     * @param e
     */
    onMouseMove(e) {
        const pos = this.state.pos;
        const x = e.pageX;
        const y = e.pageY;
        const mouseEvent = this.state.mouseEvent;

        if (mouseEvent) {
            switch (mouseEvent.type) {
                case mouseEventType.INFO:
                    if (Math.abs(pos.x - x) > 10 || Math.abs(pos.y - y) > 10) {
                        this.state.mouseEvent.type = mouseEventType.DRAG;
                    }
                    break;
                case mouseEventType.REGIST_START:
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 이벤트 가져오기
     * @param date - String (YYYYMM 또는 YYYYMMDD)
     * @return promise
     */
    getEvent() {
        const prevDate = this.state.prevDate.format("YYYYMMDD");
        const nextDate = this.state.nextDate.format("YYYYMMDD");

        if (typeof this.state.getEvent === "function") {
            return {
                request: this.state.getEvent(prevDate, nextDate),
                prevDate,
                nextDate
            };
        }

        return null;
    }

    /**
     * 마우스 이벤트 데이터 설정
     * @param data - Object
     */
    setMouseEvent(data, type) {
        const mouseEvent = this.state.mouseEvent;

        if (type === mouseEventType.REGIST_END) {
            if (mouseEvent && mouseEvent.type === mouseEventType.REGIST_START) {
                data.startDate = mouseEvent.data.startDate;
            } else {
                this.state.mouseEvent = null;
                return;
            }
        }

        this.state.mouseEvent = { data, type };
    }

    setRegist(date, type) {
        const d = {};
        if (type === mouseEventType.REGIST_START) {
            d.startDate = date;
        } else if (type === mouseEventType.REGIST_END) {
            d.endDate = date;
        } else {
            return;
        }

        this.setMouseEvent(d, type);
    }

    // 달력 레이아웃 초기화
    calculLayout() {
        const month = this.state.month;
        const calendar = document.getElementById(this.state.calendarUID);
        const ch = calendar.offsetHeight;
        const tool = calendar.querySelector(".full__calendar__tool");
        const th = tool.offsetHeight;
        const week = this.state.week;
        const cth = ch - th;
        const styleContainer = {
            height: cth
        };

        const dwh = 30;
        const mh = cth - dwh;
        const wh = mh / week;
        const whp = wh / (mh / 100);

        const calculData = month.reduce((wr, objWeek, i) => {
            if (i !== (month.length - 1)) {
                objWeek.style = {
                    top: `${whp * i}%`,
                    height: `${whp}%`
                };
            } else {
                objWeek.style = {
                    top: `${whp * i}%`,
                    bottom: 0
                };
            }

            return wr;
        }, []);

        this.setState({
            styleContainer,
            month: update(this.state.month, { $merge: calculData })
        });
    }

    // 달력 레이아웃 데이터 초기화
    calculLayoutData(isUpdate = false, callBack = undefined) {
        const basic = this.state.basic;
        const props = {};
        const basicDay = basic.day;
        const currentDate = this.state.currentDate;
        const dayweek = currentDate.day();
        const days = currentDate.daysInMonth();
        const week = Math.ceil((days + dayweek) / basicDay);
        const totalDays = week * basicDay;
        const toDate = currentDate.clone().startOf();
        const prevDate = currentDate.clone().subtract(1, mewtime.const.MONTH);
        const nextDate = currentDate.clone().add(1, mewtime.const.MONTH);
        const prevEnd = prevDate.daysInMonth();
        const prevStart = prevEnd - (dayweek - 1);
        const nextEnd = totalDays - (days + dayweek);
        const data = [];
        const contentDayweek = [];

        if (dayweek > 0) {
            for (let i = prevStart; i <= prevEnd; i += 1) {
                data.push({ date: prevDate.date(i).format("YYYY-MM-DD") });
            }
        }

        for (let i = 1; i < days + 1; i += 1) {
            data.push({ date: toDate.date(i).format("YYYY-MM-DD") });
        }

        if (nextEnd > 0) {
            for (let i = 1; i < nextEnd + 1; i += 1) {
                data.push({ date: nextDate.date(i).format("YYYY-MM-DD") });
            }
        }

        const month = [];

        for (let w = 0; w < week; w += 1) {
            const position = w * basicDay;
            month.push({ days: [], box: [], day: [] });
            for (let d = 0; d < basicDay; d += 1) {
                const day = data[position + d];
                month[w].days.push(day);

                toDate.setTime(day.date);

                const isToday = basic.date.isSame(toDate, mewtime.const.DATE);
                const isHoliyday = toDate.day() === 0;
                const isMonth = currentDate.isSame(toDate, mewtime.const.MONTH);

                if (d === 0) {
                    month[w].startDate = toDate.clone().startOf();
                } else if (d === (basicDay - 1)) {
                    month[w].endDate = toDate.clone().endOf();
                }

                month[w].box.push(
                    <td
                        key={`box-${w}-${d}`}
                        className={classNames("fc__bg", isToday ? "fc__td" : "")}
                        onMouseDown={() => this.setRegist(day.date, mouseEventType.REGIST_START)}
                        onMouseUp={() => this.setRegist(day.date, mouseEventType.REGIST_END)}
                    >
                        &nbsp;
                    </td>
                );
                month[w].day.push(
                    <td
                        key={`day_${w}-${d}`}
                        className={classNames("fc__dt", isMonth ? "" : "fc__ex", isMonth && isHoliyday ? "fc__hd" : "")}
                        onMouseDown={() => this.setRegist(day.date, mouseEventType.REGIST_START)}
                        onMouseUp={() => this.setRegist(day.date, mouseEventType.REGIST_END)}
                    >
                        {toDate.date()}
                    </td>
                );
            }
        }

        for (let i = basic.dayweek; i < (basic.dayweek + basic.day); i += 1) {
            const we = i % 7;
            contentDayweek.push(createElement("td", { key: `dayweek_${we}` }, mewtime.days[we]));
        }

        prevDate.date(prevStart);

        props.currentDate = currentDate;
        props.days = days;
        props.week = week;
        props.dayweek = dayweek;
        props.contentDayweek = contentDayweek;
        props.totalDays = totalDays;
        props.prevDate = prevDate;
        props.nextDate = nextDate;
        props.prevStart = prevStart;
        props.prevEnd = prevEnd;
        props.nextEnd = nextEnd;
        props.month = month;

        if (isUpdate) {
            this.setState(props, () => {
                this.calculLayout();
                if (typeof callBack === "function") {
                    callBack();
                }
            });
        } else {
            this.state = Object.assign(this.state, props);
        }
    }

    /**
     * 이벤트 데이터 정렬
     * @param event - Array
     */
    calculEventData(event, isUpdate = false) {
        if (event) {
            const month = this.state.month;
            const keys = this.state.keys;
            const length = event.length;
            const schedule = {};
            const events = {};
            const startTime = mewtime();
            const endTime = mewtime();

            event.sort((a, b) => {
                let sort = 0;

                const asd = mewtime.strToDateTime(a[keys.start_dt]);
                const aed = mewtime.strToDateTime(a[keys.end_dt]);
                const bsd = mewtime.strToDateTime(b[keys.start_dt]);
                const bed = mewtime.strToDateTime(b[keys.end_dt]);

                startTime.setTime(asd);
                endTime.setTime(aed);

                if (startTime.isSame(bsd, mewtime.const.DATE)) {
                    if (endTime.isAfter(bed)) {
                        sort = -1;
                    } else if (endTime.isBefore(bed)) {
                        sort = 1;
                    }
                } else if (startTime.isAfter(bsd)) {
                    sort = 1;
                } else if (startTime.isBefore(bsd)) {
                    sort = -1;
                }

                return sort;
            });

            for (let i = 0; i < length; i += 1) {
                const obj = event[i];
                schedule[obj[keys.uid]] = obj;

                const startDt = obj[keys.start_dt];
                const endDt = obj[keys.end_dt];
                const startDate = mewtime.strToDate(startDt);
                let endDate = "";

                if (startDt === endDt) {
                    endDate = startDate;
                } else {
                    endDate = mewtime.strToDate(endDt);
                }

                startTime.setTime(startDate);
                endTime.setTime(endDate);

                let position = 0;
                while (endTime.isSameOrAfter(startTime, mewtime.const.DATE)) {
                    const keyDate = startTime.format("YYYY-MM-DD");

                    if (!events[keyDate]) {
                        events[keyDate] = { list: [] };
                    }

                    if (startTime.isSame(startDate, mewtime.const.DATE)) {
                        position = events[keyDate].list.findIndex(evt => {
                            return !evt;
                        });

                        if (position === -1) {
                            position = events[keyDate].list.length;
                        }
                    }

                    const index = events[keyDate].list.findIndex(evt => {
                        if (evt) {
                            return evt.calendarNo === obj[keys.uid];
                        }
                        return false;
                    });

                    const evt = { calendarNo: obj[keys.uid], start_dt: startDate.substr(0, 10), day: (Math.abs(endTime.numberOfDays(startTime))) + 1 };

                    if (index !== -1) {
                        events[keyDate].list[index] = evt;
                    } else {
                        events[keyDate].list[position] = evt;
                    }

                    startTime.add(1, mewtime.const.DATE);
                }
            }

            for (let wi = 0; wi < month.length; wi += 1) {
                const week = month[wi];
                const days = week.days;
                let eventRow = 0;

                for (let di = 0; di < days.length; di += 1) {
                    const date = days[di].date;

                    if (events[date]) {
                        const row = events[date].list.length;
                        if (row > eventRow) {
                            eventRow = row;
                        }
                    }
                }

                week.eventRows = eventRow;
            }

            this.createEventLayout(month, events, schedule);

            if (isUpdate) {
                this.setState({
                    month: update(this.state.month, { $merge: month }),
                    schedule: update(this.state.schedule, { $merge: schedule }),
                    events: update(this.state.events, { $merge: events })
                });
            } else {
                this.state = update(this.state, { schedule: { $merge: schedule }, events: { $merge: events } });
            }
        }
    }

    /**
     * 기본 스케쥴 팝업
     * @param scheduleData - Object
     */
    schedulePopup(scheduleData) {
        if (scheduleData.data && scheduleData.data.reserve_no) {
            PopModal.toast("예약된 일정은 임의로 변경할 수 없습니다.");
        } else {
            const modalName = "popup_schedule";
            PopModal.createModal(modalName, <PopupSchedule {...scheduleData} />);
            PopModal.show(modalName);
        }
    }

    /**
     * 이벤트 그리기
     * @param month - Object (달력 데이터)
     * @param events - Object (이벤트 분할 데이터)
     * @param schedule - Object (이벤트 데이터)
     */
    createEventLayout(month, events, schedule) {
        const basic = this.state.basic;
        const keys = this.state.keys;
        const startTime = mewtime();
        const endTime = mewtime();

        month.map((week, wi) => {
            const eventRows = week.eventRows;
            week.events = week.days.reduce((rsEvents, day, di) => {
                const evts = events[day.date];

                if (evts) {
                    const listLength = evts.list.length;
                    for (let i = 0; i < listLength; i += 1) {
                        if (!rsEvents[i]) {
                            rsEvents[i] = [];
                        }

                        const objEvent = evts.list[i];
                        if (objEvent) {
                            const calendarNo = objEvent.calendarNo;
                            const scheduleData = schedule[calendarNo];
                            const startDate = week.startDate;
                            const endDate = week.endDate;
                            const isSame = day.date === objEvent.start_dt;
                            const isBefore = startDate.isSame(day.date, mewtime.const.DATE) && startDate.isAfter(objEvent.start_dt);
                            startTime.setTime(mewtime.strToDateTime(scheduleData.start_dt));
                            endTime.setTime(mewtime.strToDateTime(scheduleData.end_dt));
                            const time = startTime.format("a/p hh:mm");
                            const isDay = endTime.format("HHmm") === "2359";
                            const isMore = endDate.isBefore(endTime);
                            const isEnd = basic.date.isAfter(endDate);

                            if (isSame || isBefore) {
                                let colSpan = objEvent.day;
                                const maxCols = basic.day - di;
                                const isMax = colSpan > maxCols;

                                if (isMax) {
                                    colSpan = maxCols;
                                }

                                rsEvents[i].push(
                                    <td key={`calendar-${wi}-no-${calendarNo}`} colSpan={colSpan} className="fc__evt" onMouseDown={() => this.setMouseEvent(scheduleData, mouseEventType.INFO)}>
                                        <div className="fc__evt__ct">
                                            <div className={classNames("fc__ct", scheduleData[keys.type].toLowerCase(), isMax ? "fc__i" : "", isMore ? "fc__m" : "", isEnd ? "fc__end" : "")}>
                                                <div className="fc__t">
                                                    <span>{isDay ? "" : time} {scheduleData[keys.title]}&nbsp;</span>
                                                </div>
                                                <div className="fc__p" />
                                            </div>
                                        </div>
                                    </td>
                                );
                            } else {
                                rsEvents[i].push(null);
                            }
                        } else {
                            rsEvents[i].push(
                                <td
                                    key={`calendar-empty-${wi}-${di}`}
                                    className="fc__non"
                                    onMouseDown={() => this.setRegist(day.date, mouseEventType.REGIST_START)}
                                    onMouseUp={() => this.setRegist(day.date, mouseEventType.REGIST_END)}
                                >&nbsp;</td>)
                            ;
                        }
                    }

                    const row = eventRows - listLength;
                    if (row !== 0) {
                        if (!rsEvents[listLength]) {
                            rsEvents[listLength] = [];
                        }
                        rsEvents[listLength].push(
                            <td
                                key={`calendar-empty-${wi}-${di}`}
                                rowSpan={row}
                                className="fc__non"
                                onMouseDown={() => this.setRegist(day.date, mouseEventType.REGIST_START)}
                                onMouseUp={() => this.setRegist(day.date, mouseEventType.REGIST_END)}
                            >&nbsp;</td>
                        );
                    }
                } else {
                    rsEvents[0].push(
                        <td
                            key={`calendar-empty-${wi}-${di}`}
                            rowSpan={eventRows}
                            className="fc__non"
                            onMouseDown={() => this.setRegist(day.date, mouseEventType.REGIST_START)}
                            onMouseUp={() => this.setRegist(day.date, mouseEventType.REGIST_END)}
                        >&nbsp;</td>
                    );
                }

                return rsEvents;
            }, [[]]);

            return null;
        });
    }

    /**
     * 달력 그리기
     * @returns {XML}
     */
    createCalendarLayout() {
        const month = this.state.month;

        return month.map((week, wi) => {
            return (
                <div key={`full__calendar__week_${wi}`} className="full__calendar__week" style={week.style}>
                    <table className="full__calendar__box">
                        <tbody>
                            <tr key={`box-week-${wi}`}>
                                {week.box}
                            </tr>
                        </tbody>
                    </table>
                    <table className="full__calendar__event">
                        <tbody>
                            <tr key="week-day">
                                {week.day}
                            </tr>
                            {week.events ?
                                week.events.map((evt, ei) => {
                                    return (
                                        <tr key={`week-event-${wi}-${ei}`}>{evt}</tr>
                                    );
                                })
                                : null
                            }
                        </tbody>
                    </table>
                </div>
            );
        });
    }

    // 플럭스 이벤트 전파받는 함수
    dispatcher(obj) {
        if (obj.actionType === constant.DISPATCHER.ARTISTS_SCHEDULE_UPDATE) {
            const rs = this.getEvent();
            if (rs) {
                rs.request.then(data => {
                    if (rs.prevDate === data.startDt && rs.nextDate === data.endDt) {
                        if (data) {
                            this.calculEventData(data.list, true);
                        }
                    }
                }).catch(error => {
                    PopModal.alert(error.data);
                });
            }
        }
    }

    render() {
        const currentDate = this.state.currentDate;
        const contentDayweek = this.state.contentDayweek;
        const styleContainer = this.state.styleContainer;

        return (
            <div className="full__calendar" id={this.state.calendarUID}>
                <div className="full__calendar__tool">
                    <span className="full__calendar_current_date">{currentDate.format("YYYY. MM")}</span>
                    <Buttons buttonStyle={{ size: "small", theme: "bg-white", icon: "lt_s" }} inline={{ onClick: this.onPrev }} />
                    <Buttons buttonStyle={{ size: "small", theme: "bg-white", icon: "gt_s" }} inline={{ onClick: this.onNext }} />
                    <Buttons buttonStyle={{ size: "small", theme: "bg-white" }} inline={{ onClick: this.onToday }}>오늘</Buttons>
                </div>
                <div className="full__calendar__container" style={styleContainer}>
                    <div className="full__calendar__month">
                        <table className="full__calendar__dayweek">
                            <thead>
                                <tr>
                                    {contentDayweek}
                                </tr>
                            </thead>
                        </table>
                        <div className="full__calendar__weeks" onMouseDown={this.onMouseDown} /*onMouseUp={this.onMouseUp}*/ onClick={this.onMouseUp} onMouseMove={this.onMouseMove}>
                            {this.createCalendarLayout()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * @type data: {
 *      date: mewtime - 현재 날짜,
 *      day: String or Number - 한줄에 표기일수,
 *      dayweek: String or Number - 주의 시작 요일,
 *      onRegist: Function ({data}) - 날짜 선택시 등록 콜백,
 *      onModify: Function ({data}) - 날짜 선택시 이벤트 수정 콜백,
 *      getEvent: promise Function (String date) - 이벤트리스트를 전달해주는 콜백
 * }
 */
FullCalendar.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired
};

export default FullCalendar;
