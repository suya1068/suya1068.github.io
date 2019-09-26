import React, { Component } from "react";
import ApplyConsulting from "shared/components/consulting/register/ApplyConsulting";
import utils from "shared/helper/utils";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";

export default class Consult extends Component {
    constructor() {
        super();
        this.state = {};
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        const referrer = document.referrer;
        if (referrer) {
            const data = utils.query.combineConsultToReferrer(referrer);
            const params = utils.query.setConsultParams({ ...data });
            this.setState({ ...params });
        }
    }

    componentDidMount() {
    }

    gaEvent(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(action);
        }
    }

    render() {
        const { referer, referer_keyword } = this.state;
        const ref_data = { referer, referer_keyword };
        return (
            <div className="biz-consult-component">
                <ApplyConsulting gaEvent={this.gaEvent} accessType={CONSULT_ACCESS_TYPE.MAIN.CODE} {...ref_data} deviceType="mobile" />
            </div>
        );
    }
}
