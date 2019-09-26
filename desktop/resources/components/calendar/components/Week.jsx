import React, { Component, PropTypes } from "react";
import { FORMAT } from "../constant/calendar.const";
import Day from "./Day";


class Week extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return this.props.children
            ? (
                <tr>{this.props.children}</tr>
            )
            : (
                <tr>
                    {
                        this.props.days.map(day => (
                            <Day key={day.date.format(FORMAT.SHOT)} day={day} onSelect={this.props.onSelect} />
                        ))
                    }
                </tr>
            );
    }
}

Week.propTypes = {
    days: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.object,
        events: PropTypes.array.isRequired,
        visible: PropTypes.bool.isRequired,
        disable: PropTypes.bool.isRequired,
        select: PropTypes.bool.isRequired
    })).isRequired,
    children: PropTypes.node,

    onSelect: PropTypes.func.isRequired
};

Week.defaultProps = {
    children: null
};

export default Week;
