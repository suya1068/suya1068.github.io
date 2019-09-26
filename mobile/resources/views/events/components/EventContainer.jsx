import React, { Component, PropTypes } from "react";
import Event from "./reg_dt_20180321/Event";
import PopModal from "shared/components/modal/PopModal";

export default class EventContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            regDt: this.props.params.regDt || "20180322"
        };
    }

    componentWillMount() {
    }

    onViewEvent(regDt) {
        if (regDt) {
            switch (regDt) {
                case "20180322": return <Event />;
                default: PopModal.alert("해당 이벤트는 종료되었습니다.", { callBack: () => { location.href = "/"; } });
                // default: throw new Error(`The ${regDt} is not exists.`);
            }
        }

        return null;
    }

    render() {
        return (
            <div className="event-container">
                {this.onViewEvent(this.state.regDt)}
            </div>
        );
    }
}
