// import "./full_calendar.scss";
// import React, { Component, PropTypes, createElement } from "react";
// import update from "immutability-helper";
// import classNames from "classnames";
//
// import utils from "forsnap-utils";
// import mewtime from "forsnap-mewtime";
//
// import Buttons from "desktop/resources/components/button/Buttons";
// import PopModal from "desktop/resources/components/pop/modal/PopModal";
// import PopupSchedule from "desktop/resources/components/pop/popup/PopupSchedule";
//
// const objectKeys = {
//     start_dt: "start_dt",
//     end_dt: "end_dt",
//     title: "title",
//     comment: "comment",
//     uid: "calendar_no",
//     type: "type",
//     location: "",
//     description: ""
// };
//
// class FullCalendar extends Component {
//     constructor(props) {
//         super(props);
//
//         let data = props.data;
//
//         if (!data) {
//             data = {};
//         }
//
//         this.state = {
//             basic: {
//                 date: data.date ? data.date : mewtime(),
//                 day: data.day ? data.day : 7,
//                 dayweek: data.dayweek ? data.dayweek : 0
//             },
//             months: {},
//             events: {},
//             schedule: {},
//             keys: data.keys ? data.keys : objectKeys,
//             currentDate: data.date ? data.date.clone().startOf(mewtime.const.MONTH) : mewtime().startOf(mewtime.const.MONTH),
//             monthDays: 0,
//             monthWeeks: 0,
//             dayweek: 0,
//             styleContainer: {},
//             calendarUID: "",
//             onRegist: data.onRegist ? data.onRegist : undefined,
//             onModify: data.onModify ? data.onModify : undefined,
//             getEvent: data.getEvent ? data.getEvent : undefined
//         };
//
//         // 캘린더 초기화
//         this.calculLayoutData = this.calculLayoutData.bind(this);
//         this.calculLayout = this.calculLayout.bind(this);
//         this.calculEventData = this.calculEventData.bind(this);
//
//         // 이벤트
//         this.onNext = this.onNext.bind(this);
//         this.onPrev = this.onPrev.bind(this);
//         this.onToday = this.onToday.bind(this);
//         this.onRegist = this.onRegist.bind(this);
//         this.onModify = this.onModify.bind(this);
//
//         this.getEvent = this.getEvent.bind(this);
//         this.getLayoutMonth = this.getLayoutMonth.bind(this);
//
//         // 그리기
//         this.createCalendarLayout = this.createCalendarLayout.bind(this);
//         this.createEventLayout = this.createEventLayout.bind(this);
//
//         // 팝업
//         this.schedulePopup = this.schedulePopup.bind(this);
//     }
//
//     componentWillMount() {
//         this.calculLayoutData();
//         this.state.calendarUID = utils.getUUID();
//
//         window.addEventListener("resize", this.calculLayout);
//     }
//
//     componentDidMount() {
//         const dataEvents = this.props.data.events;
//
//         setTimeout(this.calculLayout, 0);
//
//         // if (dataEvents) {
//         //     this.calculEventData(dataEvents, true);
//         // } else {
//         //     const reqeust = this.getEvent();
//         //     reqeust.then(data => {
//         //         if (data) {
//         //             this.calculEventData(data.list, true);
//         //         }
//         //     }).catch(error => {
//         //         PopModal.alert(error.data);
//         //     });
//         // }
//     }
//
//     componentWillReceiveProps(nextProps) {
//     }
//
//     shouldComponentUpdate(nextProps, nextState) {
//         return true;
//     }
//
//     componentWillUpdate() {
//     }
//
//     componentDidUpdate() {
//     }
//
//     componentWillUnmount() {
//         window.removeEventListener("resize", this.calculLayout);
//     }
//
//     /**
//      * 일정 등록
//      * @param startDate - String (YYYY-MM-DD)
//      * @param endDate - String (YYYY-MM-DD)
//      */
//     onRegist(startDate, endDate = undefined) {
//         const obj = {
//             startDate,
//             endDate: (endDate !== undefined ? endDate : startDate)
//         };
//
//         let b = true;
//         if (typeof this.state.onRegist === "function") {
//             b = this.state.onRegist(obj);
//         }
//
//         if (b) {
//             this.schedulePopup(obj);
//         }
//     }
//
//     /**
//      * 일정 수정
//      * @param obj - Object (startDate, endDate, data)
//      */
//     onModify(e, obj) {
//         let b = true;
//         if (typeof this.state.onModify === "function") {
//             b = this.state.onModify({ data: obj });
//         }
//
//         if (b) {
//             const keys = this.state.keys;
//
//             const data = {
//                 startDate: mewtime.strToDateTime(obj[keys.start_dt]),
//                 endDate: mewtime.strToDateTime(obj[keys.end_dt]),
//                 data: obj
//             };
//
//             const startDate = mewtime(data.startDate);
//             const endDate = mewtime(data.endDate);
//
//             const content = (
//                 <div className="full__calendar__schedule__info">
//                     <div className="schedule__info__head">
//                         <div className={classNames("schedule__info__head__title", obj[keys.type].toLowerCase())}>
//                             <span>{obj[keys.title]}</span>
//                         </div>
//                         <div className="schedule__info__head__buttons">
//                             <Buttons buttonStyle={{ size: "small", theme: "bg-white" }} inline={{ onClick: () => { PopModal.close("", () => this.schedulePopup(data)); } }}>수정하기</Buttons>
//                             <Buttons buttonStyle={{ size: "small", icon: "close_s" }} inline={{ className: "modal-close", onMouseUp: () => PopModal.close() }} />
//                         </div>
//                     </div>
//                     <div className="schedule__info__body">
//                         <div className="info__body__line">
//                             <span>일시</span>
//                             <p>{startDate.format("YYYY년 MM월 DD일")} ~ {endDate.format("YYYY년 MM월 DD일")}</p>
//                         </div>
//                         {obj[keys.comment] && obj[keys.comment] !== "" ?
//                             <div className="info__body__line">
//                                 <span>설명</span>
//                                 <p>{obj[keys.comment]}</p>
//                             </div>
//                             : null
//                         }
//                     </div>
//                 </div>
//             );
//
//             PopModal.pop(content);
//         }
//     }
//
//     // 다음 달
//     onNext() {
//         const currentDate = this.state.currentDate;
//         currentDate.add(1, mewtime.const.MONTH);
//
//         this.calculLayoutData(true, () => {
//             const request = this.getEvent();
//             if (request) {
//                 request.then(data => {
//                     if (data) {
//                         this.calculEventData(data.list, true);
//                     }
//                 }).catch(error => {
//                     PopModal.alert(error.data);
//                 });
//             }
//         });
//     }
//
//     // 이전 달
//     onPrev() {
//         const currentDate = this.state.currentDate;
//         currentDate.subtract(1, mewtime.const.MONTH);
//
//         this.calculLayoutData(true, () => {
//             const request = this.getEvent();
//             request.then(data => {
//                 if (data) {
//                     this.calculEventData(data.list, true);
//                 }
//             }).catch(error => {
//                 PopModal.alert(error.data);
//             });
//         });
//     }
//
//     // 현재 달
//     onToday() {
//         const basic = this.state.basic;
//         this.state.currentDate = basic.date.clone().startOf(mewtime.const.MONTH);
//         this.calculLayoutData(true, () => {
//             const request = this.getEvent();
//             request.then(data => {
//                 if (data) {
//                     this.calculEventData(data.list, true);
//                 }
//             }).catch(error => {
//                 PopModal.alert(error.data);
//             });
//         });
//     }
//
//     /**
//      * 이벤트 가져오기
//      * @param date - String (YYYYMM 또는 YYYYMMDD)
//      * @return promise
//      */
//     getEvent() {
//         const prevDate = this.state.prevDate;
//         const nextDate = this.state.nextDate;
//         const currentDate = this.state.currentDate;
//
//         if (typeof this.state.getEvent === "function") {
//             return this.state.getEvent(prevDate.format("YYYYMMDD"), nextDate.format("YYYYMMDD"), currentDate.format("YYYYMM"));
//         }
//
//         return null;
//     }
//
//     /**
//      * 해당 달 레이아웃 가져오기
//      * @param key - String (YYYY-MM)
//      */
//     getLayoutMonth(key) {
//         if (!key || key === "") {
//             key = this.state.currentDate.format("YYYY-MM");
//         }
//
//         return this.state.months[key];
//     }
//
//     /**
//      * 기본 스케쥴 팝업
//      * @param scheduleData - Object (startDate, endDate, data)
//      */
//     schedulePopup(scheduleData) {
//         const modalName = "popup_schedule";
//         PopModal.createModal(modalName, <PopupSchedule {...scheduleData} />, { callBack: () => {
//             const reqeust = this.getEvent();
//             reqeust.then(data => {
//                 if (data) {
//                     this.calculEventData(data.list, true);
//                 }
//             }).catch(error => {
//                 PopModal.alert(error.data);
//             });
//         } });
//         PopModal.show(modalName);
//     }
//
//     // 달력 레이아웃 초기화
//     calculLayout() {
//         const month = this.state.month;
//         const calendar = document.getElementById(this.state.calendarUID);
//         const ch = calendar.offsetHeight;
//         const tool = calendar.querySelector(".full__calendar__tool");
//         const th = tool.offsetHeight;
//         const week = this.state.week;
//         const cth = ch - th;
//         const styleContainer = {
//             height: cth
//         };
//
//         const dwh = 30;
//         const mh = cth - dwh;
//         const wh = mh / week;
//         const whp = wh / (mh / 100);
//
//         const calculData = month.reduce((wr, objWeek, i) => {
//             if (i !== (month.length - 1)) {
//                 objWeek.style = {
//                     top: `${whp * i}%`,
//                     height: `${whp}%`
//                 };
//             } else {
//                 objWeek.style = {
//                     top: `${whp * i}%`,
//                     bottom: 0
//                 };
//             }
//
//             return wr;
//         }, []);
//
//         this.setState({
//             styleContainer,
//             month: update(this.state.month, { $merge: calculData })
//         });
//     }
//
//     // 달력 레이아웃 데이터 초기화
//     calculLayoutData(isUpdate = false, callBack = undefined) {
//         const basic = this.state.basic;
//         const months = this.state.months;
//         const props = {};
//         const basicDay = basic.day;
//         const currentDate = this.state.currentDate;
//         const dayweek = currentDate.day();
//         const monthDays = currentDate.daysInMonth();
//         const monthWeeks = Math.ceil((monthDays + dayweek) / basicDay);
//         const totalDays = monthWeeks * basicDay;
//         const toDate = currentDate.clone().startOf();
//         const prevDate = currentDate.clone().subtract(1, mewtime.const.MONTH);
//         const nextDate = currentDate.clone().add(1, mewtime.const.MONTH);
//         const prevEnd = prevDate.daysInMonth();
//         const prevStart = prevEnd - (dayweek - 1);
//         const nextEnd = totalDays - (monthDays + dayweek);
//         const days = [];
//         const contentDayweek = [];
//
//         if (dayweek > 0) {
//             for (let i = prevStart; i <= prevEnd; i += 1) {
//                 days.push(prevDate.date(i).format("YYYY-MM-DD"));
//             }
//         }
//
//         for (let i = 1; i < monthDays + 1; i += 1) {
//             days.push(toDate.date(i).format("YYYY-MM-DD"));
//         }
//
//         if (nextEnd > 0) {
//             for (let i = 1; i < nextEnd + 1; i += 1) {
//                 days.push(nextDate.date(i).format("YYYY-MM-DD"));
//             }
//         }
//
//         const data = [];
//
//         for (let w = 0; w < monthWeeks; w += 1) {
//             const position = w * basicDay;
//             const weeks = { days: {} };
//             for (let d = 0; d < basicDay; d += 1) {
//                 const date = days[position + d];
//                 weeks.days.date = date;
//
//                 toDate.setTime(date);
//
//                 weeks.days.isToday = basic.date.isSame(toDate, mewtime.const.DATE);
//                 weeks.days.isHoliyday = toDate.day() === 0;
//                 weeks.days.isMonth = currentDate.isSame(toDate, mewtime.const.MONTH);
//
//                 if (d === 0) {
//                     weeks.startDate = toDate.clone();
//                 } else if (d === (basicDay - 1)) {
//                     weeks.endDate = toDate.clone();
//                 }
//
//                 // month[w].box.push(<td key={`box-${w}-${d}`} className={classNames("fc__bg", isToday ? "fc__td" : "")} onMouseUp={() => this.onRegist(day.date)}>&nbsp;</td>);
//                 // month[w].day.push(<td key={`day_${w}-${d}`} className={classNames("fc__dt", isMonth ? "" : "fc__ex", isMonth && isHoliyday ? "fc__hd" : "")} onMouseUp={() => this.onRegist(day.date)}>{toDate.date()}</td>);
//             }
//
//             data.push(weeks);
//         }
//
//         months[currentDate.format("YYYY-MM")] = data;
//
//         for (let i = basic.dayweek; i < (basic.dayweek + basic.day); i += 1) {
//             const we = i % 7;
//             contentDayweek.push(createElement("td", { key: `dayweek_${we}` }, mewtime.days[we]));
//         }
//
//         prevDate.date(prevStart);
//
//         props.currentDate = currentDate;
//         props.monthDays = monthDays;
//         props.monthWeeks = monthWeeks;
//         props.dayweek = dayweek;
//         props.contentDayweek = contentDayweek;
//         props.totalDays = totalDays;
//         props.prevDate = prevDate;
//         props.nextDate = nextDate;
//         props.prevStart = prevStart;
//         props.prevEnd = prevEnd;
//         props.nextEnd = nextEnd;
//         props.months = months;
//
//         if (isUpdate) {
//             this.setState(props, () => {
//                 this.calculLayout();
//                 if (typeof callBack === "function") {
//                     callBack();
//                 }
//             });
//         } else {
//             this.state = Object.assign(this.state, props);
//         }
//     }
//
//     /**
//      * 이벤트 데이터 정렬
//      * @param event - Array
//      */
//     calculEventData(event, isUpdate = false) {
//         if (event) {
//             const month = this.state.month;
//             const keys = this.state.keys;
//             const length = event.length;
//             const schedule = {};
//             const events = {};
//             let startTime;
//             let endTime;
//
//             for (let i = 0; i < length; i += 1) {
//                 const obj = event[i];
//                 schedule[obj[keys.uid]] = obj;
//
//                 const startDt = obj[keys.start_dt];
//                 const endDt = obj[keys.end_dt];
//                 const startDate = mewtime.strToDate(startDt);
//                 let endDate = "";
//
//                 if (startDt === endDt) {
//                     endDate = startDate;
//                 } else {
//                     endDate = mewtime.strToDate(endDt);
//                 }
//
//                 if (!startTime || !endTime) {
//                     startTime = mewtime(startDate);
//                     endTime = mewtime(endDate);
//                 } else {
//                     startTime.setTime(startDate);
//                     endTime.setTime(endDate);
//                 }
//
//                 let position = 0;
//                 while (endTime.isSameOrAfter(startTime, mewtime.const.DATE)) {
//                     const keyDate = startTime.format("YYYY-MM-DD");
//
//                     if (!events[keyDate]) {
//                         events[keyDate] = { list: [] };
//                     }
//
//                     if (startTime.isSame(startDate)) {
//                         position = events[keyDate].list.findIndex(evt => {
//                             return !evt;
//                         });
//
//                         if (position === -1) {
//                             position = events[keyDate].list.length;
//                         }
//                     }
//
//                     const index = events[keyDate].list.findIndex(evt => {
//                         if (evt) {
//                             return evt.calendarNo === obj[keys.uid];
//                         }
//                         return false;
//                     });
//
//                     const evt = { calendarNo: obj[keys.uid], start_dt: startDate.substr(0, 10), day: (endTime.numberOfDays(startTime)) + 1 };
//
//                     if (index !== -1) {
//                         events[keyDate].list[index] = evt;
//                     } else {
//                         events[keyDate].list[position] = evt;
//                     }
//
//                     startTime.add(1, mewtime.const.DATE);
//                 }
//             }
//
//             for (let wi = 0; wi < month.length; wi += 1) {
//                 const week = month[wi];
//                 const days = week.days;
//                 let eventRow = 0;
//
//                 for (let di = 0; di < days.length; di += 1) {
//                     const date = days[di].date;
//
//                     if (events[date]) {
//                         const row = events[date].list.length;
//                         if (row > eventRow) {
//                             eventRow = row;
//                         }
//                     }
//                 }
//
//                 week.eventRows = eventRow;
//             }
//
//             this.createEventLayout(month, events, schedule);
//
//             if (isUpdate) {
//                 this.setState({
//                     month: update(this.state.month, { $merge: month }),
//                     schedule: update(this.state.schedule, { $merge: schedule }),
//                     events: update(this.state.events, { $merge: events })
//                 });
//             } else {
//                 this.state = update(this.state, { schedule: { $merge: schedule }, events: { $merge: events } });
//             }
//         }
//     }
//
//     /**
//      * 이벤트 그리기
//      * @param month - Object (달력 데이터)
//      * @param events - Object (이벤트 분할 데이터)
//      * @param schedule - Object (이벤트 데이터)
//      */
//     createEventLayout(month, events, schedule) {
//         const basic = this.state.basic;
//         const keys = this.state.keys;
//
//         month.map((week, wi) => {
//             const eventRows = week.eventRows;
//             week.events = week.days.reduce((rsEvents, day, di) => {
//                 const evts = events[day.date];
//
//                 if (evts) {
//                     const listLength = evts.list.length;
//                     for (let i = 0; i < listLength; i += 1) {
//                         if (!rsEvents[i]) {
//                             rsEvents[i] = [];
//                         }
//
//                         const objEvent = evts.list[i];
//                         if (objEvent) {
//                             const calendarNo = objEvent.calendarNo;
//                             const scheduleData = schedule[calendarNo];
//                             const startDate = week.startDate;
//                             const isSame = day.date === objEvent.start_dt || startDate.isSame(day.date);
//                             const isBefore = startDate.isSame(day.date) && startDate.isAfter(objEvent.start_dt);
//
//                             if (isSame || isBefore) {
//                                 let colSpan = objEvent.day;
//                                 const maxCols = basic.day - di;
//                                 const isMax = colSpan > maxCols;
//
//                                 if (isMax) {
//                                     colSpan = maxCols;
//                                 }
//
//                                 rsEvents[i].push(
//                                     <td key={`calendar-${wi}-no-${calendarNo}`} colSpan={colSpan} className="fc__evt" onMouseUp={e => this.onModify(e, scheduleData)}>
//                                         <div className="fc__evt__ct">
//                                             <div className={classNames("fc__ct", scheduleData[keys.type].toLowerCase(), isMax ? "fc__i" : "")}>
//                                                 <div className="fc__t">
//                                                     <span>{scheduleData[keys.title]}&nbsp;</span>
//                                                 </div>
//                                                 <div className="fc__p" />
//                                             </div>
//                                         </div>
//                                     </td>
//                                 );
//                             } else {
//                                 rsEvents[i].push(null);
//                             }
//                         } else {
//                             rsEvents[i].push(<td key={`calendar-empty-${wi}-${di}`} className="fc__non" onMouseUp={() => this.onRegist(day.date)}>&nbsp;</td>);
//                         }
//                     }
//
//                     const row = eventRows - listLength;
//                     if (row !== 0) {
//                         if (!rsEvents[listLength]) {
//                             rsEvents[listLength] = [];
//                         }
//                         rsEvents[listLength].push(<td key={`calendar-empty-${wi}-${di}`} rowSpan={row} className="fc__non" onMouseUp={() => this.onRegist(day.date)}>&nbsp;</td>);
//                     }
//                 } else {
//                     rsEvents[0].push(<td key={`calendar-empty-${wi}-${di}`} rowSpan={eventRows} className="fc__non" onMouseUp={() => this.onRegist(day.date)}>&nbsp;</td>);
//                 }
//
//                 return rsEvents;
//             }, [[]]);
//
//             return null;
//         });
//     }
//
//     /**
//      * 달력 그리기
//      * @returns {XML}
//      */
//     createCalendarLayout() {
//         const month = this.getLayoutMonth(this.state.currentDate.format("YYYY-MM"));
//
//         // const isSame = day.date.isSame(this.strToDate(scheduleData[keys.start_dt]), mewtime.const.DATE);
//
//         return month.weeks.map((week, wi) => {
//             return (
//                 <div key={`full__calendar__week_${wi}`} className="full__calendar__week" style={week.style}>
//                     <table className="full__calendar__box">
//                         <tbody>
//                         <tr key={`box-week-${wi}`}>
//                             {week.box}
//                         </tr>
//                         </tbody>
//                     </table>
//                     <table className="full__calendar__event">
//                         <tbody>
//                         <tr key="week-day">
//                             {week.day}
//                         </tr>
//                         {week.events ?
//                             week.events.map((evt, ei) => {
//                                 return (
//                                     <tr key={`week-event-${wi}-${ei}`}>{evt}</tr>
//                                 );
//                             })
//                             : null
//                         }
//                         </tbody>
//                     </table>
//                 </div>
//             );
//         });
//     }
//
//     render() {
//         const currentDate = this.state.currentDate;
//         const contentDayweek = this.state.contentDayweek;
//         const styleContainer = this.state.styleContainer;
//
//         return (
//             <div className="full__calendar" id={this.state.calendarUID}>
//                 <div className="full__calendar__tool">
//                     <span className="full__calendar_current_date">{currentDate.format("YYYY. MM")}</span>
//                     <Buttons buttonStyle={{ size: "small", theme: "bg-white", icon: "lt_s" }} inline={{ onClick: this.onPrev }} />
//                     <Buttons buttonStyle={{ size: "small", theme: "bg-white", icon: "gt_s" }} inline={{ onClick: this.onNext }} />
//                     <Buttons buttonStyle={{ size: "small", theme: "bg-white" }} inline={{ onClick: this.onToday }}>오늘</Buttons>
//                 </div>
//                 <div className="full__calendar__container" style={styleContainer}>
//                     <div className="full__calendar__month">
//                         <table className="full__calendar__dayweek">
//                             <thead>
//                             <tr>
//                                 {contentDayweek}
//                             </tr>
//                             </thead>
//                         </table>
//                         <div className="full__calendar__weeks">
//                             {this.createCalendarLayout()}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }
//
// /**
//  * @type data: {
//  *      date: mewtime - 현재 날짜,
//  *      day: String or Number - 한줄에 표기일수,
//  *      dayweek: String or Number - 주의 시작 요일,
//  *      onRegist: Function ({data}) - 날짜 선택시 등록 콜백,
//  *      onModify: Function ({data}) - 날짜 선택시 이벤트 수정 콜백,
//  *      getEvent: promise Function (String date) - 이벤트리스트를 전달해주는 콜백
//  * }
//  */
// FullCalendar.propTypes = {
//     data: PropTypes.shape([PropTypes.node]).isRequired
// };
//
// export default FullCalendar;
