import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import auth from "forsnap-authentication";
import API from "forsnap-api";
import mewtime from "forsnap-mewtime";

import siteDispatcher from "desktop/resources/components/siteDispatcher";
import constant from "shared/constant";

import Buttons from "desktop/resources/components/button/Buttons";
import SlimCalendar from "desktop/resources/components/calendar/SlimCalendar";
import PopModal from "shared/components/modal/PopModal";
import PopupSchedule from "desktop/resources/components/pop/popup/PopupSchedule";

class ArtistsRightMenu extends Component {
    constructor(props) {
        super(props);

        const today = mewtime();

        this.state = {
            calendarDate: today.format("YYYYMM"),
            calendar: {
                events: [],
                date: today.format("YYYY-MM-DD")
            },
            scheduleList: [],
            isVisible: false,
            schedulePT: 0,
            dispatcherId: ""
        };

        // API
        this.queryCalendarSchedules = this.queryCalendarSchedules.bind(this);

        // Setting
        this.setStateSchedules = this.setStateSchedules.bind(this);
        this.dispatcher = this.dispatcher.bind(this);

        // Interaction
        this.onSelect = this.onSelect.bind(this);
        this.onPrev = this.onPrev.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onModify = this.onModify.bind(this);

        this.popupSchedule = this.popupSchedule.bind(this);
        this.menuVisible = this.menuVisible.bind(this);
    }

    componentWillMount() {
        const dispatcherId = siteDispatcher.register(this.dispatcher);

        this.state.dispatcherId = dispatcherId;
    }

    componentDidMount() {
        const calendarDate = this.state.calendarDate;
        const request = this.queryCalendarSchedules(calendarDate);
        if (request) {
            request.then(response => {
                if (response.status === 200) {
                    // console.log(response);
                    const data = response.data;
                    this.setStateSchedules(data.list, this.state.calendarDate === calendarDate);
                }
            }).catch(error => {
                PopModal.alert(error.data);
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isShow) {
            this.state.isVisible = false;
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const schedule = document.getElementsByClassName("artist-schedule")[0];

        if (schedule) {
            nextState.schedulePT = schedule.offsetHeight;
        }
    }

    componentWillUnmount() {
        siteDispatcher.unregister(this.state.dispatcherId);
    }

    /**
     * 캘린더 날짜를 선택를 한다.
     * @param selected
     */
    onSelect(selected) {
        // console.log("selected: ", selected);
        const date = selected.date.format("YYYY-MM-DD");
        this.popupSchedule({ startDate: date, endDate: date });
    }

    /**
     * 캘린더 이전 달을 선택한다.
     * @param payload
     */
    onPrev(payload) {
        this.state.calendarDate = payload.date;
        const request = this.queryCalendarSchedules(payload.date);
        if (request) {
            request.then(response => {
                if (response.status === 200) {
                    const data = response.data;
                    this.setStateSchedules(data.list, this.state.calendarDate === payload.date);
                }
            }).catch(error => {
                PopModal.alert(error.data);
            });
        }
    }

    /**
     * 캘린더 다음달을 선택한다.
     * @param payload
     */
    onNext(payload) {
        this.state.calendarDate = payload.date;
        const request = this.queryCalendarSchedules(payload.date);
        if (request) {
            request.then(response => {
                if (response.status === 200) {
                    const data = response.data;
                    this.setStateSchedules(data.list, this.state.calendarDate === payload.date);
                }
            }).catch(error => {
                PopModal.alert(error.data);
            });
        }
    }

    /**
     * 일정 수정
     * @param data - Object (일정 데이터)
     */
    onModify(data) {
        if (!data.reserve_no) {
            this.popupSchedule({ startDate: mewtime.strToDateTime(data.start_dt), endDate: mewtime.strToDateTime(data.end_dt), data });
        } else {
            PopModal.toast("예약된 일정은 임의로 변경할 수 없습니다.");
        }
    }

    /**
     * state에 스케쥴을 설정한다.
     * @param events
     */
    setStateSchedules(events, isMonth) {
        if (isMonth) {
            this.setState({
                scheduleList: events,
                calendar: { ...this.state.calendar, events }
            }, () => {
                const list = document.getElementsByClassName("artist-schedule-list")[0];

                if (list) {
                    list.scrollTop = 0;
                }
            });
        }
    }

    /**
     * 아티스트 캘린더 스케쥴을 조회한다.
     * @param date
     * @returns {*}
     */
    queryCalendarSchedules(date) {
        const user = auth.getUser();
        const year = date.substr(0, 4);
        const month = date.substr(4, 2);
        const dt = mewtime(`${year}-${month}`);
        const FORMAT_DATE = "YYYYMMDD";

        if (user) {
            return API.artists.artistCalendar(user.id, dt.clone().startOf().format(FORMAT_DATE), dt.clone().endOf(mewtime.const.MONTH).format(FORMAT_DATE));
        }

        PopModal.alert("로그인 후 이용해주세요.");
        return null;
    }

    /**
     * 일정등록 팝업 생성
     * @param scheduleData - Object (startDate, endDate, data)
     */
    popupSchedule(scheduleData) {
        const modalName = "popup_schedule";
        const calendarDate = this.state.calendarDate;
        PopModal.createModal(modalName, <PopupSchedule {...scheduleData} />, { callBack: () => {
            const request = this.queryCalendarSchedules(calendarDate);
            if (request) {
                request.then(response => {
                    if (response.status === 200) {
                        // console.log(response);
                        this.setStateSchedules(response.data.list, this.state.calendarDate === calendarDate);
                    }
                }).catch(error => {
                    PopModal.alert(error.data);
                });
            }
        } });
        PopModal.show(modalName);
    }

    // 메뉴 보이기 상태 조절
    menuVisible() {
        const isVisible = this.state.isVisible;

        this.setState({
            isVisible: !isVisible
        });
    }

    // 플럭스 이벤트 전파받는 함수
    dispatcher(obj) {
        if (obj.actionType === constant.DISPATCHER.ARTISTS_SCHEDULE_UPDATE) {
            const request = this.queryCalendarSchedules(this.state.calendarDate);
            if (request) {
                request.then(response => {
                    if (response.status === 200) {
                        // console.log(response);
                        this.setStateSchedules(response.data.list, true);
                    }
                }).catch(error => {
                    PopModal.alert(error.data);
                });
            }
        }
    }

    render() {
        const scheduleList = this.state.scheduleList;
        const today = mewtime();
        const isShow = this.props.isShow;
        let isVisible = this.state.isVisible;
        const date = mewtime(`${this.state.calendarDate.substr(0, 4)}-${this.state.calendarDate.substr(4, 2)}`);
        const startDate = mewtime();
        const endDate = mewtime();

        if (isShow) {
            isVisible = true;
        }

        return (
            <div className={classNames("artist-content-right", isVisible ? "show" : "")} style={{ paddingTop: this.state.schedulePT }}>
                {isShow ? null
                    : <div className="artist-content-right-open">
                        <Buttons buttonStyle={{ width: "block", icon: isVisible ? "gt_s" : "lt_s" }} inline={{ onClick: this.menuVisible }} />
                    </div>
                }
                <div className="artist-schedule">
                    <div className="artist-calendar">
                        <SlimCalendar
                            {...this.state.calendar}
                            onSelect={this.onSelect}
                            onPrev={this.onPrev}
                            onNext={this.onNext}
                        />
                    </div>
                    <div className="artist-calendar-date">
                        <p className="today">TODAY {`${today.day(true)}요일`}</p>
                        <p className="date">{today.format("YYYY년 MM월 DD일")}</p>
                    </div>
                </div>
                <ul className="artist-schedule-list">
                    {scheduleList.map(obj => {
                        startDate.setTime(mewtime.strToDate(obj.start_dt));
                        endDate.setTime(mewtime.strToDate(obj.end_dt));
                        const isBetween = date.isBetween(startDate, endDate, mewtime.const.MONTH, "[]");
                        const txtStart = <p>{startDate.format("MM.DD")}</p>;
                        let txtEnd;
                        let txtSwung;

                        if (!startDate.isSame(endDate)) {
                            txtEnd = <p>{endDate.format("MM.DD")}</p>;
                            txtSwung = <p className="swung">~</p>;
                        }

                        if (isBetween) {
                            return (
                                <li key={obj.calendar_no} className={`day-${obj.reserve_no ? "reserve" : obj.type.toLowerCase()}`} onMouseDown={() => this.onModify(obj)}>
                                    <div className="schedule-date">
                                        {txtStart}{txtSwung}{txtEnd}
                                    </div>
                                    <div className="schedule-title">
                                        <span>{obj.title}</span>
                                    </div>
                                </li>
                            );
                        }

                        return null;
                    })}
                </ul>
            </div>
        );
    }
}

ArtistsRightMenu.propTypes = {
    isShow: PropTypes.bool
};

ArtistsRightMenu.defaultProps = {
    isShow: undefined
};

export default ArtistsRightMenu;
