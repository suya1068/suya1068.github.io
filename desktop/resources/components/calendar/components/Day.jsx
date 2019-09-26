import React, { Component, PropTypes } from "react";
import classnames from "classnames";

import { FORMAT } from "../constant/calendar.const";


const DAY_CLASSNAME = {
    disabled: "slim-calendar-column--disabled",
    selected: "slim-calendar-column--selected",
    hasEvent: "slim-calendar-column--has-event"
};

class Day extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dayClassName: this.getDayClassName(props)
        };

        this.onSelect = this.onSelect.bind(this);

        this.getDayClassName = this.getDayClassName.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            dayClassName: this.getDayClassName(props)
        });
    }

    onSelect(e, data) {
        e.preventDefault();
        if (!data.disable) {
            this.props.onSelect(data);
        }
    }

    getDayClassName(props) {
        return {
            "slim-calendar-column": true,
            [DAY_CLASSNAME.disabled]: props.day.disable,
            [DAY_CLASSNAME.selected]: props.day.select,
            [DAY_CLASSNAME.hasEvent]: props.day.events.length > 0
        };
    }

    render() {
        const day = this.props.day;

        return (
            <td key={day.date.format(FORMAT.SHOT)} className={classnames(this.state.dayClassName)} data-date={day.date.format(FORMAT.SHOT)}>
                <a
                    href=""
                    style={{ display: day.visible ? "" : "none" }}
                    onClick={event => this.onSelect(event, day)}
                >{day.date.date()}</a>
            </td>
        );
    }
}

Day.propTypes = {
    day: PropTypes.shape({
        date: PropTypes.object,
        events: PropTypes.array.isRequired,
        visible: PropTypes.bool.isRequired,
        disable: PropTypes.bool.isRequired,
        select: PropTypes.bool.isRequired
    }),

    onSelect: PropTypes.func.isRequired
};

export default Day;
