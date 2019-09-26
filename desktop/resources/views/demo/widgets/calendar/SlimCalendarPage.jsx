import React, { Component, PropTypes } from "react";
import SlimCalendar from "desktop/resources/components/calendar/SlimCalendar";

const config = {
    no: "27",
    events: [
        { no: "5", type: "INQUIRY", year: "2016", month: "12", day: "31" },
        { no: "6", type: "INQUIRY", year: "2017", month: "1", day: "12" },
        { no: "7", type: "IMPOSSIBLE", year: "2017", month: "1", day: "14" }
    ],
    size: "large",
    min: true,
    onSelect(data) {
        console.log("selected: ", data);
    }
};

class SlimCalendarPage extends Component {
    render() {
        return (
            <div className="demo-content">
                <SlimCalendar {...config} />
            </div>
        );
    }
}

export default SlimCalendarPage;
