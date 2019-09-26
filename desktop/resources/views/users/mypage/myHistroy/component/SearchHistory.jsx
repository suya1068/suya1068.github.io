import "./searchHistory.scss";
import React, { Component, PropTypes } from "react";
// Global
import mewtime from "forsnap-mewtime";
import Auth from "forsnap-authentication";

// Component
import Buttons from "desktop/resources/components/button/Buttons";
import Input from "desktop/resources/components/form/Input";
import PopDownContent from "desktop/resources/components/pop/popdown/PopDownContent";
import SlimCalendar from "desktop/resources/components/calendar/SlimCalendar";

class SearchHistory extends Component {
    constructor() {
        super();
        const userid = Auth.getUser().id;

        const today = mewtime();
        const minDate = mewtime();
        const maxDate = mewtime();
        const endDate = today.format("YYYY-MM-DD");
        const startDate = today.subtract(1, mewtime.const.MONTH).format("YYYY-MM-DD");

        minDate.year(minDate.year() - 5);
        minDate.date(minDate.date() - 1);
        maxDate.date(maxDate.date() + 1);

        this.state = {
            userID: userid,
            list: [],
            isMore: true,
            commentList: [],
            endDate,
            startDate,
            sCalendar: {
                events: [],
                min: minDate.format("YYYY-MM-DD"),
                max: maxDate.format("YYYY-MM-DD"),
                date: startDate,
                isLegend: false
            },
            eCalendar: {
                events: [],
                min: minDate.format("YYYY-MM-DD"),
                max: maxDate.format("YYYY-MM-DD"),
                date: endDate,
                isLegend: false
            },
            isStart: false,
            isEnd: false,
            checkButton: "1m"
        };
        this.selectPeriod = this.selectPeriod.bind(this);
        this.searchList = this.searchList.bind(this);
    }

    componentWillMount() {
        // this.searchList();
    }

    componentDidMount() {
        this.searchList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.stepValue !== nextProps.stepValue) {
            this.setState({
                checkButton: "1m"
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
        const sCalendar = this.state.sCalendar;
        const eCalendar = this.state.eCalendar;

        if (key === "sCalendar") {
            sCalendar.date = selected.date.format("YYYY-MM-DD");
            props.startDate = sCalendar.date;
            props.isStart = false;
            eCalendar.min = date.subtract(1, mewtime.const.DATE).format("YYYY-MM-DD");
        } else {
            eCalendar.date = selected.date.format("YYYY-MM-DD");
            props.endDate = eCalendar.date;
            props.isEnd = false;
            sCalendar.max = date.add(1, mewtime.const.DATE).format("YYYY-MM-DD");
        }

        this.setState({
            ...props,
            sCalendar,
            eCalendar
        });
    }

    // 조회기간 선택
    selectPeriod(period, num, checkButton) {
        const today = mewtime();
        const minDate = mewtime();
        const maxDate = mewtime();
        const sCalendar = this.state.sCalendar;
        const eCalendar = this.state.eCalendar;
        const endDate = today.format("YYYY-MM-DD");
        const startDate = today.subtract(num, period).format("YYYY-MM-DD");

        minDate.year(minDate.year() - 5);
        minDate.date(minDate.date() - 1);
        maxDate.date(maxDate.date() + 1);

        sCalendar.date = startDate;
        sCalendar.min = minDate.format("YYYY-MM-DD");
        sCalendar.max = maxDate.format("YYYY-MM-DD");
        eCalendar.date = endDate;
        eCalendar.min = minDate.format("YYYY-MM-DD");
        eCalendar.max = maxDate.format("YYYY-MM-DD");

        this.setState({
            startDate,
            endDate,
            sCalendar,
            eCalendar,
            checkButton
        }, this.searchList);
    }

    // 검색
    searchList() {
        const startDate = this.state.startDate.replace(/-/gi, "");
        const endDate = this.state.endDate.replace(/-/gi, "");
        const limit = this.state.limit;

        if (typeof this.props.searchFunc === "function") {
            this.props.searchFunc(startDate, endDate/*, this.state.offset, limit*/);
        }
    }

    isActive(checkButton) {
        return (checkButton === this.state.checkButton);
    }

    render() {
        return (
            <div className="searchHistory-component">
                <div className="photograph-search">
                    <div className="search-tool">
                        <div className="search-month">
                            <span className="title">조회기간</span>
                            <Buttons buttonStyle={{ size: "small", width: "w52", theme: "bg-white", isActive: this.isActive("1w") }} inline={{ onClick: () => this.selectPeriod(mewtime.const.DATE, 7, "1w") }}>1주일</Buttons>
                            <Buttons buttonStyle={{ size: "small", width: "w52", theme: "bg-white", isActive: this.isActive("1m") }} inline={{ onClick: () => this.selectPeriod(mewtime.const.MONTH, 1, "1m") }}>1개월</Buttons>
                            <Buttons buttonStyle={{ size: "small", width: "w52", theme: "bg-white", isActive: this.isActive("3m") }} inline={{ onClick: () => this.selectPeriod(mewtime.const.MONTH, 3, "3m") }}>3개월</Buttons>
                            <Buttons buttonStyle={{ size: "small", width: "w52", theme: "bg-white", isActive: this.isActive("1y") }} inline={{ onClick: () => this.selectPeriod(mewtime.const.YEAR, 1, "1y") }}>1년</Buttons>
                        </div>
                        <div className="search-calendar">
                            <div className="start-calendar">
                                <Input inputStyle={{ size: "small", width: "w98", shape: "default" }} inline={{ readOnly: true, value: this.state.startDate }} />
                                <PopDownContent target={<Buttons buttonStyle={{ size: "small", theme: "bg-white", icon: "calendar_s" }} />} visible={this.state.isStart}>
                                    <div className="calendar-popup">
                                        <SlimCalendar {...this.state.sCalendar} onSelect={date => this.onSelect(date, "sCalendar")} />
                                    </div>
                                </PopDownContent >
                            </div>
                            <span className="swung-dash">~</span>
                            <div className="end-calendar">
                                <Input inputStyle={{ size: "small", width: "w98", shape: "default" }} inline={{ readOnly: true, value: this.state.endDate }} />
                                <PopDownContent target={<Buttons buttonStyle={{ size: "small", theme: "bg-white", icon: "calendar_s" }} />} visible={this.state.isEnd}>
                                    <div className="calendar-popup">
                                        <SlimCalendar {...this.state.eCalendar} onSelect={date => this.onSelect(date, "eCalendar")} />
                                    </div>
                                </PopDownContent>
                            </div>
                            <Buttons buttonStyle={{ size: "small", width: "w113", shape: "circle", theme: "default" }} inline={{ onClick: this.searchList }}>검색</Buttons>
                        </div>
                    </div>
                    <p className="search-caption">최근 5년간의 이력을 3개월 단위로 조회가 가능합니다.</p>
                </div>
            </div>
        );
    }
}

export default SearchHistory;
