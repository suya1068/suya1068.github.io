import "../scss/AdditionDate.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import mewtime from "forsnap-mewtime";

import SlimCalendar from "desktop/resources/components/calendar/SlimCalendar";

class AdditionDate extends Component {
    constructor(props) {
        super(props);

        const d = mewtime();
        const min = d.clone().subtract(1).format("YYYY-MM-DD");
        const max = d.clone().add(3, mewtime.const.MONTH).format("YYYY-MM-DD");

        this.state = {
            calendar: {
                events: [],
                min,
                max,
                date: d.format("YYYY-MM-DD")
            },
            min,
            max
        };

        this.onSelect = this.onSelect.bind(this);
        this.setDate = this.setDate.bind(this);
    }

    componentDidMount() {
        const { calendar } = this.state;
        this.setDate(calendar.date);
    }

    componentWillReceiveProps(nextProps, nextState) {
        const data = this.props.data;
        const nData = nextProps.data;

        if (data && nData && data.tab !== nData.tab) {
            const { calendar, min, max, date } = this.state;

            if (nData.tab === "CUSTOM") {
                calendar.max = max;
                this.setDate(date);
            } else {
                calendar.max = min;
            }

            this.state.calendar = calendar;
        }
    }

    onSelect(obj) {
        if (obj && obj.date) {
            this.setDate(obj.date.format("YYYY-MM-DD"));
        }
    }

    setDate(date) {
        const { IF } = this.props.data;

        if (IF && typeof IF.setDate === "function") {
            this.setState({
                date: IF.setDate(date)
            });
        }
    }

    render() {
        const { calendar } = this.state;
        const { data } = this.props;

        const isDisabled = data.tab === "EXTRA" ? "disabled" : "";

        return (
            <div className="addition__date">
                <div className={classNames("addition__date__calendar", { disabled: isDisabled })}>
                    <SlimCalendar {...calendar} onSelect={this.onSelect} />
                </div>
            </div>
        );
    }
}

AdditionDate.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired
};

export default AdditionDate;
