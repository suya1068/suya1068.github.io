import React, { Component, PropTypes } from "react";

import mewtime from "forsnap-mewtime";

import { CALCULATE_SEARCH_DATE_TYPE } from "shared/constant/aritst.const";

import FInput from "shared/components/ui/input/FInput";
import PopDownContent from "shared/components/popdown/PopDownContent";

import Dropdown from "desktop/resources/components/form/Dropdown";
import Icon from "desktop/resources/components/icon/Icon";
import SlimCalendar from "desktop/resources/components/calendar/SlimCalendar";

class SearchContainer extends Component {
    constructor(props) {
        super(props);

        const today = mewtime();
        const minDate = mewtime();
        const maxDate = mewtime();
        const endDate = today.format("YYYY-MM-DD");
        const startDate = today.subtract(1, mewtime.const.MONTH).format("YYYY-MM-DD");

        minDate.year(minDate.year() - 5);
        minDate.date(minDate.date() - 1);
        maxDate.date(maxDate.date() + 1);

        this.state = {
            isMount: true,
            form: this.initParams(),
            params: this.initParams(),
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
            }
        };

        this.onSelectDate = this.onSelectDate.bind(this);
        this.onPeriod = this.onPeriod.bind(this);
        this.onChangeFormHandler = this.onChangeFormHandler.bind(this);
        this.onFetch = this.onFetch.bind(this);

        this.initParams = this.initParams.bind(this);
        this.createSearchParams = this.createSearchParams.bind(this);
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onSelectDate(data, type) {
        const date = data.date.clone();
        const { sCalendar, eCalendar, form } = this.state;
        const prop = {
            sCalendar,
            eCalendar,
            form
        };

        if (type === "sCalendar") {
            prop.sCalendar.date = data.date.format("YYYY-MM-DD");
            prop.eCalendar.min = date.subtract(1, mewtime.const.DATE).format("YYYY-MM-DD");
            prop.form.start_dt = data.date.format("YYYYMMDD");
        } else {
            prop.eCalendar.date = data.date.format("YYYY-MM-DD");
            prop.sCalendar.max = date.add(1, mewtime.const.DATE).format("YYYY-MM-DD");
            prop.form.end_dt = data.date.format("YYYYMMDD");
        }

        if (this.state.isMount) {
            this.setState(prop);
        }
    }

    onPeriod(period, num) {
        const endDate = mewtime();
        const startDate = endDate.clone().subtract(num, period);
        const minDate = mewtime();
        const maxDate = mewtime();
        const { sCalendar, eCalendar, form } = this.state;
        const prop = {
            sCalendar: Object.assign({}, sCalendar),
            eCalendar: Object.assign({}, eCalendar),
            form: Object.assign(form, { start_dt: startDate.format("YYYYMMDD"), end_dt: endDate.format("YYYYMMDD") })
        };

        minDate.year(minDate.year() - 5);
        minDate.date(minDate.date() - 1);
        maxDate.date(maxDate.date() + 1);

        prop.sCalendar.date = startDate.format("YYYY-MM-DD");
        prop.sCalendar.min = minDate.format("YYYY-MM-DD");
        prop.sCalendar.max = maxDate.format("YYYY-MM-DD");
        prop.eCalendar.date = endDate.format("YYYY-MM-DD");
        prop.eCalendar.min = minDate.format("YYYY-MM-DD");
        prop.eCalendar.max = maxDate.format("YYYY-MM-DD");

        if (this.state.isMount) {
            this.setState(prop);
        }
    }

    onChangeFormHandler(name, value) {
        const { form } = this.state;
        this.setState(Object.assign(form, { [name]: value }));
    }

    onFetch() {
        const { form } = this.state;
        this.state.params = {
            start_dt: form.start_dt,
            end_dt: form.end_dt,
            date_type: form.date_type
        };
        this.props.onFetch();
    }

    initParams() {
        const date = mewtime();
        return {
            start_dt: date.clone().subtract(1, mewtime.const.MONTH).format("YYYYMMDD"),
            end_dt: date.clone().format("YYYYMMDD"),
            date_type: CALCULATE_SEARCH_DATE_TYPE[0].value
        };
    }

    createSearchParams() {
        const { params } = this.state;

        return {
            start_dt: params.start_dt,
            end_dt: params.end_dt,
            date_type: params.date_type
        };
    }

    render() {
        const { form, sCalendar, eCalendar } = this.state;

        return (
            <div className="artist__calculate__search">
                <div className="search__container">
                    <span className="label">조회기간</span>
                    <div className="search__type">
                        <Dropdown list={CALCULATE_SEARCH_DATE_TYPE} select={form.date_type} size="small" resultFunc={value => this.onChangeFormHandler("date_type", value)} />
                    </div>
                    <div className="search__period">
                        <button className="f__button" onClick={() => this.onPeriod(mewtime.const.DATE, 7)}>1주일</button>
                        <button className="f__button" onClick={() => this.onPeriod(mewtime.const.MONTH, 1)}>1개월</button>
                        <button className="f__button" onClick={() => this.onPeriod(mewtime.const.MONTH, 3)}>3개월</button>
                        <button className="f__button" onClick={() => this.onPeriod(mewtime.const.YEAR, 1)}>1년</button>
                        <button className="f__button" onClick={() => this.onPeriod(mewtime.const.YEAR, 5)}>5년</button>
                    </div>
                    <div className="search__date">
                        <FInput
                            value={sCalendar.date}
                            inline={{ readOnly: true }}
                        />
                        <PopDownContent target={<button className="f__button"><Icon name="calendar_s" /></button>}>
                            <div className="calendar-popup">
                                <SlimCalendar {...sCalendar} onSelect={date => this.onSelectDate(date, "sCalendar")} />
                            </div>
                        </PopDownContent>
                        ~
                        <FInput
                            value={eCalendar.date}
                            inline={{ readOnly: true }}
                        />
                        <PopDownContent target={<button className="f__button"><Icon name="calendar_s" /></button>}>
                            <div className="calendar-popup">
                                <SlimCalendar {...eCalendar} onSelect={date => this.onSelectDate(date, "eCalendar")} />
                            </div>
                        </PopDownContent>
                    </div>
                    <button className="search__submit f__button f__button__circle f__button__theme__fill-black" onClick={this.onFetch}>검색</button>
                </div>
                <div className="search__caption">최근 5년간의 이력을 3개월 단위로 조회가 가능합니다.</div>
            </div>
        );
    }
}

SearchContainer.propTypes = {
    onFetch: PropTypes.func.isRequired
};

export default SearchContainer;
