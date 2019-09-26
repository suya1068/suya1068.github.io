import "./consult.scss";
import React, { Component } from "react";
import ApplyConsulting from "shared/components/consulting/register/ApplyConsulting_dev";
import utils from "shared/helper/utils";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";

export default class Consult extends Component {
    constructor() {
        super();
        this.state = {};
    }

    componentWillMount() {
        const referrer = document.referrer;
        if (referrer) {
            const data = utils.query.combineConsultToReferrer(referrer);
            const params = utils.query.setConsultParams({ ...data });
            this.setState({ ...params });
        }
    }

    render() {
        const { referer, referer_keyword } = this.state;
        const ref_data = { referer, referer_keyword };
        return (
            <section className="biz-consult biz-page__hr biz-panel__dist">
                <div className="container">
                    <h3 className="biz-panel__title">촬영 상세 견적이 궁금하신가요?</h3>
                    <p className="biz-panel__descr">촬영에 대한 정보를 남겨 주시면, 담당자가 친절히 안내해 드리겠습니다.</p>
                    <ApplyConsulting accessType={CONSULT_ACCESS_TYPE.MAIN.CODE} {...ref_data} deviceType="pc" renew />
                </div>
            </section>
        );
    }
}
