import React, { Component, PropTypes } from "react";

import auth from "forsnap-authentication";
import API from "forsnap-api";

import mewtime from "forsnap-mewtime";

import FullCalendar from "desktop/resources/components/fullcalendar/FullCalendar";
import PopModal from "shared/components/modal/PopModal";

class FullCalendarPage extends Component {

    // scheduleData - Object (startDate, endDate, data)
    onRegist(data) {
        // console.log(data);
        return true;
    }

    onModify(data) {
        // console.log(data);
        return true;
    }

    getEvent(startDt, endDt) {
        const user = auth.getUser();
        const reqeust = API.artists.artistCalendar(user.id, startDt, endDt);

        return reqeust.then(response => {
            // console.log(response);

            if (response.status === 200) {
                const data = response.data;
                return { list: data.list, startDt, endDt };
            }

            return null;
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    render() {
        const data = {
            date: mewtime(),
            day: 7,
            dayweek: 0,
            events: undefined,
            onRegist: this.onRegist,
            onModify: this.onModify,
            getEvent: this.getEvent
        };

        return (
            <div className="demo-content">
                <FullCalendar data={data} />
            </div>
        );
    }
}

export default FullCalendarPage;
