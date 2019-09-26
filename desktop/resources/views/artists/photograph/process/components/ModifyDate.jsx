import React, { Component, PropTypes } from "react";

import mewtime from "forsnap-mewtime";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import SlimCalendar from "desktop/resources/components/calendar/SlimCalendar";

import ModifyDateConfirm from "./ModifyDateConfirm";

class ModifyDate extends Component {
    constructor(props) {
        super(props);

        const d = mewtime();
        const date = props.date || d.format("YYYY-MM-DD");
        const events = [];

        if (props.date) {
            const reserveDate = mewtime(date).format("YYYYMMDD");
            events.push({
                no: "0",
                type: "IMPOSSIBLE",
                start_dt: reserveDate,
                end_dt: reserveDate
            });
        }

        this.state = {
            calendar: {
                events,
                min: d.clone().subtract(1).format("YYYY-MM-DD"),
                max: d.clone().add(1, mewtime.const.YEAR).format("YYYY-MM-DD"),
                date: d.format("YYYY-MM-DD"),
                isLegend: false
            },
            date: d.format("YYYY-MM-DD")
        };

        this.onSelect = this.onSelect.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onSelect(data) {
        this.setState({
            date: data.date.format("YYYY-MM-DD")
        });
    }

    onConfirm() {
        const { buy_no } = this.props;
        const { date } = this.state;
        const modalName = "pop_modify_date_confirm";
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            name: modalName,
            content: <ModifyDateConfirm onConfirm={() => this.props.onConfirm(buy_no, date)} onCancel={() => Modal.close(modalName)} />
        });
    }

    onCancel() {
        Modal.close(this.props.modalName);
    }

    render() {
        const { calendar } = this.state;

        return (
            <div className="artist__progress__modify__date">
                <div className="modify__date__calendar">
                    <SlimCalendar {...calendar} onSelect={this.onSelect} />
                </div>
                <div className="modify__date__buttons">
                    <button className="_button _button__white" onClick={this.onConfirm}>확인</button>
                    <button className="_button _button__black" onClick={this.onCancel}>취소</button>
                </div>
            </div>
        );
    }
}

ModifyDate.propTypes = {
    modalName: PropTypes.string.isRequired,
    buy_no: PropTypes.string,
    date: PropTypes.string,
    onConfirm: PropTypes.func.isRequired
};

export default ModifyDate;
