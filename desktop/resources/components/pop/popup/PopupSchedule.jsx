import "../pop_common.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import auth from "forsnap-authentication";
import API from "forsnap-api";

import mewtime from "forsnap-mewtime";
import siteDispatcher from "desktop/resources/components/siteDispatcher";
import constant from "shared/constant";

import Input from "shared/components/ui/input/Input";

import CheckboxText from "desktop/resources/components/form/CheckboxText";
import Buttons from "desktop/resources/components/button/Buttons";
import PopModal from "shared/components/modal/PopModal";
import PopDownContent from "desktop/resources/components/pop/popdown/PopDownContent";
import SlimCalendar from "desktop/resources/components/calendar/SlimCalendar";
import DropDown from "desktop/resources/components/form/Dropdown";
import Checkbox from "desktop/resources/components/form/Checkbox";

/*
    status - IMPOSSIBLE, INQUIRY
 */

const hour = (() => {
    const h = [];
    const date = mewtime().startOf();

    for (let i = 1; i < 13; i += 1) {
        h.push({
            name: `오전 ${date.format("HH:mm")}`,
            value: date.format("HHmm")
        });
        date.hours(date.hours() + 1);
    }

    h.push({
        name: `오후 ${date.format("hh:mm")}`,
        value: date.format("HHmm")
    });

    for (let i = 1; i < 12; i += 1) {
        date.hours(date.hours() + 1);
        h.push({
            name: `오후 ${date.format("hh:mm")}`,
            value: date.format("HHmm")
        });
    }

    return h;
})();

class PopupSchedule extends Component {
    constructor(props) {
        super(props);

        let status = "";
        let reason = "";
        let title = "";
        let calendarNo;
        let startDate;
        let endDate;
        let startTime = "0000";
        let endTime = "0000";
        let isDay = true;

        const sDate = props.startDate ? mewtime(props.startDate) : mewtime();
        const eDate = props.endDate ? mewtime(props.endDate) : mewtime();

        startDate = sDate.format("YYYY-MM-DD");
        endDate = eDate.format("YYYY-MM-DD");
        startTime = sDate.format("HHmm");
        endTime = eDate.format("HHmm");

        if (props.data) {
            status = props.data.type;
            title = props.data.title ? props.data.title : "";
            reason = props.data.comment ? props.data.comment : "";
            calendarNo = props.data.calendar_no;
            isDay = endTime === "2359";
        }

        if (!startDate) {
            startDate = mewtime().format("YYYY-MM-DD");
        }

        if (!endDate) {
            endDate = startDate;
        }

        const today = mewtime(startDate).subtract(1, mewtime.const.DATE);
        const maxDate = mewtime(startDate).add(1, mewtime.const.YEAR);

        this.state = {
            startDate,
            startTime,
            endDate,
            endTime,
            sCalendar: {
                events: [],
                date: startDate,
                isLegend: false
            },
            eCalendar: {
                events: [],
                date: endDate,
                isLegend: false
            },
            status,
            reason,
            title,
            calendarNo,
            isDay,
            isStart: false,
            isEnd: false,
            isProcess: false
        };

        this.onCheckResult = this.onCheckResult.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onIsDay = this.onIsDay.bind(this);

        this.validation = this.validation.bind(this);
        this.calculContentLength = this.calculContentLength.bind(this);
    }

    componentWillMount() {
    }

    // 타입 선택 체크
    onCheckResult(checked, status) {
        const props = {};

        if (checked) {
            props.status = status;

            if (status === "IMPOSSIBLE") {
                props.isDay = true;
            }
        } else {
            props.status = "";
        }

        this.setState(props);
    }

    /**
     * 일정 저장
     */
    onSave() {
        if (!this.state.isProcess) {
            this.state.isProcess = true;

            if (this.validation()) {
                const calendarNo = this.state.calendarNo;

                PopModal.confirm(`일정을 ${calendarNo ? "수정" : "등록"}하시겠습니까?`, () => {
                    const startDate = this.state.startDate;
                    const startTime = this.state.startTime;
                    const endDate = this.state.endDate;
                    const endTime = this.state.endTime;
                    const status = this.state.status;
                    const reason = this.state.reason;
                    const title = this.state.title;
                    const isDay = this.state.isDay;

                    const data = {
                        start_date: startDate.replace(/-/g, "") + (isDay ? "0000" : startTime),
                        end_date: endDate.replace(/-/g, "") + (isDay ? "2359" : endTime),
                        type: status,
                        title,
                        comment: reason
                    };

                    let request;

                    if (calendarNo) {
                        data.calendar_no = calendarNo;
                        request = API.artists.artistScheduleModify(auth.getUser().id, calendarNo, data);
                    } else {
                        request = API.artists.artistScheduleRegist(auth.getUser().id, data);
                    }

                    request.then(response => {
                        if (response.status === 200) {
                            PopModal.toast(`일정이 ${calendarNo ? "수정" : "등록"}되었습니다.`, () => {
                                this.state.isProcess = false;
                                siteDispatcher.dispatch({
                                    actionType: constant.DISPATCHER.ARTISTS_SCHEDULE_UPDATE
                                });
                                PopModal.close();
                            });
                        }
                    }).catch(error => {
                        this.state.isProcess = false;
                        PopModal.alert(error.data);
                    });
                }, () => {
                    this.state.isProcess = false;
                });
            }
        }
    }

    /**
     * 일정 삭제
     */
    onDelete() {
        if (!this.state.isProcess) {
            this.state.isProcess = true;

            PopModal.confirm("일정을 삭제하시겠습니까?", () => {
                const calendarNo = this.state.calendarNo;
                const request = API.artists.artistScheduleDelete(auth.getUser().id, calendarNo);
                request.then(response => {
                    if (response.status === 200) {
                        PopModal.toast("일정이 삭제되었습니다.", () => {
                            this.state.isProcess = false;
                            siteDispatcher.dispatch({
                                actionType: constant.DISPATCHER.ARTISTS_SCHEDULE_UPDATE
                            });
                            PopModal.close();
                        });
                    }
                }).catch(error => {
                    this.state.isProcess = false;
                    PopModal.alert(error.data);
                });
            }, () => {
                this.state.isProcess = false;
            });
        }
    }

    /**
     * 캘린더 날짜를 선택를 한다.
     * @param selected
     */
    onSelect(selected, key) {
        const props = {};
        const date = selected.date.clone();
        // const sCalendar = this.state.sCalendar;
        // const eCalendar = this.state.eCalendar;

        if (key === "sCalendar") {
        //     sCalendar.date = selected.date.format("YYYY-MM-DD");
            props.startDate = date.format("YYYY-MM-DD");
            props.isStart = false;
        //     eCalendar.min = date.subtract(1, mewtime.const.DATE).format("YYYY-MM-DD");
        } else {
        //     eCalendar.date = selected.date.format("YYYY-MM-DD");
            props.endDate = date.format("YYYY-MM-DD");
            props.isEnd = false;
            // sCalendar.max = date.add(1, mewtime.const.DATE).format("YYYY-MM-DD");
        }

        this.setState({
            ...props
            // sCalendar,
            // eCalendar
        });
    }

    onIsDay(checked) {
        this.setState({
            isDay: this.state.status === "IMPOSSIBLE" ? true : checked
        });
    }

    /**
     * 일정 상세 업데이트
     * @param e
     */
    calculContentLength(e, key) {
        const current = e.currentTarget;
        const value = e.target.value;
        const maxLength = current.getAttribute("maxLength");

        if (value.length < maxLength + 1) {
            this.setState({
                reason: value
            });
        }
    }

    /**
     * 데이터 검사
     * @returns {boolean}
     */
    validation() {
        let message = "";
        const status = this.state.status;
        // const reason = this.state.reason;
        const title = this.state.title;
        const startDate = Date.parse(this.state.startDate);
        const endDate = Date.parse(this.state.endDate);
        const startTime = this.state.startTime;
        const endTime = this.state.endTime;
        const isDay = this.state.isDay;

        if (status === "") {
            message = "스케줄 타입을 선택해주세요.";
        } else if (title === "") {
            message = "스케줄명을 입력해주세요.";
        } else if (startDate > endDate) {
            message = "스케줄 시작일이 종료일보다 이후입니다.";
        } else if (!isDay && startDate === endDate && startTime >= endTime) {
            message = "스케줄 시작시간이 종료시간보다 같거나 이후입니다.";
        } else {
            return true;
        }

        this.state.isProcess = false;
        PopModal.alert(message);
        return false;
    }

    render() {
        const status = this.state.status;
        const title = this.state.title;
        const reason = this.state.reason;
        const calendarNo = this.state.calendarNo;
        const isDay = this.state.isDay;
        const startDate = this.state.startDate;
        const endDate = this.state.endDate;
        const startTime = this.state.startTime;
        const endTime = this.state.endTime;

        const buttons = [<Buttons key="schedule-save" buttonStyle={{ shape: "circle", theme: "default" }} inline={{ onClick: this.onSave }}>저장하기</Buttons>];
        if (calendarNo) {
            buttons.push(<Buttons key="schedule-delete" buttonStyle={{ shape: "circle", theme: "default" }} inline={{ onClick: this.onDelete }}>삭제하기</Buttons>);
        }

        return (
            <div className={classNames("pop-schedule", calendarNo ? "schedule-modify" : "")}>
                <div className="pop-schedule-container">
                    <div className="schedule-left-contents">
                        <h4><strong>타입</strong>을 선택해주세요.</h4>
                        <div className="pop-schedule-type">
                            <CheckboxText checked={status === "INQUIRY"} resultFunc={checked => this.onCheckResult(checked, "INQUIRY")}>촬영예약</CheckboxText>
                            <CheckboxText checked={status === "IMPOSSIBLE"} resultFunc={checked => this.onCheckResult(checked, "IMPOSSIBLE")}>촬영불가</CheckboxText>
                        </div>
                        <h4>
                            <strong>기간</strong>을 선택해주세요.
                            {status !== "IMPOSSIBLE" ?
                                <Checkbox type="yellow_circle" checked={isDay} resultFunc={value => this.onIsDay(value)}>종일</Checkbox>
                                : null
                            }
                        </h4>
                        <div className="search-calendar">
                            <div className="start-calendar">
                                <Input value={startDate} readOnly />
                                <PopDownContent target={<Buttons buttonStyle={{ size: "small", theme: "bg-white", icon: "calendar_s" }} />} visible={this.state.isStart}>
                                    <div className="calendar-popup">
                                        <SlimCalendar {...this.state.sCalendar} onSelect={date => this.onSelect(date, "sCalendar")} />
                                    </div>
                                </PopDownContent>
                                {!isDay ?
                                    <DropDown list={hour} select={startTime} size="small" width="w98" icon="triangle_dt" resultFunc={value => this.setState({ startTime: value })} />
                                    : null
                                }
                            </div>
                            <span className="swung-dash">~</span>
                            <div className="end-calendar">
                                <Input value={endDate} readOnly />
                                <PopDownContent target={<Buttons buttonStyle={{ size: "small", theme: "bg-white", icon: "calendar_s" }} />} visible={this.state.isEnd}>
                                    <div className="calendar-popup">
                                        <SlimCalendar {...this.state.eCalendar} onSelect={date => this.onSelect(date, "eCalendar")} />
                                    </div>
                                </PopDownContent>
                                {!isDay ?
                                    <DropDown list={hour} select={endTime} size="small" width="w98" icon="triangle_dt" resultFunc={value => this.setState({ endTime: value })} />
                                    : null
                                }
                            </div>
                        </div>
                        <h4><strong>제목</strong>을 입력해주세요.</h4>
                        <div>
                            <Input value={title} name="title" max="25" onChange={(e, n, v) => this.setState({ [n]: v })} />
                        </div>
                    </div>
                    <div className="schedule-right-contents">
                        <h4><strong>설명</strong>을 입력해주세요.</h4>
                        <div className="pop-schedule-description">
                            <textarea defaultValue={reason} placeholder="일정에 필요한 설명을 남기세요." maxLength="250" onChange={this.calculContentLength} />
                        </div>
                    </div>
                </div>
                <div className="pop-schedule-buttons">
                    {buttons}
                </div>
            </div>
        );
    }
}

PopupSchedule.propTypes = {
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string,
    data: PropTypes.shape([PropTypes.node])
};

PopupSchedule.defaultProps = {
    endDate: undefined,
    data: undefined
};

export default PopupSchedule;
