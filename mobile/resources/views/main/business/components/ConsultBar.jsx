import "./consultBar.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import regular from "shared/constant/regular.const";

import Input from "shared/components/ui/input/Input";
import DropDown from "shared/components/ui/dropdown/DropDown";
import CheckBox from "shared/components/ui/checkbox/CheckBox";

import cookie from "forsnap-cookie";
import * as EstimateSession from "mobile/resources/views/products/list/open/extraInfoSession";
import PopModal from "shared/components/modal/PopModal";
import PopPolicy from "../../pop/PopPolicy";

class ConsultBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            device_type: "mobile",
            access_type: props.access_type,
            category: props.category,
            page_type: "biz",
            //user_email: "",
            user_name: "",
            user_phone1: "",
            user_phone2: "",
            user_phone3: "",
            agree: false,
            checked: false,
            phone_list: [
                { name: "010", value: "010" },
                { name: "011", value: "011" },
                { name: "016", value: "016" },
                { name: "017", value: "017" },
                { name: "018", value: "018" },
                { name: "019", value: "019" }
            ]
        };

        this.onConsult = this.onConsult.bind(this);
    }

    componentWillMount() {
        this.state.user_phone1 = this.state.phone_list[0].value;
        const pre_phone = EstimateSession.getSessionEstimateData(EstimateSession.USER_PHONE);
        const pre_name = EstimateSession.getSessionEstimateData(EstimateSession.USER_NAME);
        //const pre_email = EstimateSession.getSessionEstimateData(EstimateSession.USER_EMAIL);

        let pre_phone1 = "";
        let pre_phone2 = "";
        let pre_phone3 = "";

        if (pre_phone) {
            pre_phone1 = pre_phone.substr(0, 3);
            pre_phone2 = (pre_phone.substr(3).length === 7 && pre_phone.substr(3, 3)) || (pre_phone.substr(3).length === 8 && pre_phone.substr(3, 4));
            pre_phone3 = (pre_phone2.length === 3 && pre_phone.substr(6)) || (pre_phone2.length === 4 && pre_phone.substr(7));
        }

        this.setState({
            user_phone1: pre_phone1 || this.state.phone_list[0].value,
            user_phone2: pre_phone2 || "",
            user_phone3: pre_phone3 || "",
            //user_email: pre_email || "",
            user_name: pre_name || ""
        });

        const session = sessionStorage;
        const params = {};

        if (session) {
            const referer = session.getItem("referer");
            const referer_keyword = session.getItem("referer_keyword");

            if (referer) {
                params.referer = referer;
            }

            if (referer_keyword) {
                params.referer_keyword = referer_keyword;
            }

            this.setState({ ...params });
        }
    }

    onConsult() {
        const { onConsult } = this.props;
        const {
            device_type,
            access_type,
            page_type,
            user_phone1,
            user_phone2,
            user_phone3,
            user_name,
            // user_email,
            agree,
            referer,
            referer_keyword
        } = this.state;
        let message = "";

        if (!user_name) {
            message = "이름을 입력해주세요.";
        } else if (!user_phone2 || user_phone2.length < 3 || !user_phone3 || user_phone3.length < 4) {
            message = "연락처를 확인해주세요";
            // } else if (user_email && !utils.isValidEmail(user_email)) {
        //     message = "이메일을 정확하게 입력해주세요.";
        } else if (!agree) {
            message = "개인정보 수집 및 이용에 동의해주셔야 신청 가능합니다.";
        }

        if (message) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: message
            });
        } else {
            const params = {
                device_type,
                access_type,
                user_name,
                page_type,
                user_phone: `${user_phone1}${user_phone2}${user_phone3}`,
                agent: cookie.getCookies("FORSNAP_UUID")
            };
            EstimateSession.setSessionEstimateData(EstimateSession.USER_PHONE, params.user_phone);

            if (user_name) {
                params.user_name = user_name;
                EstimateSession.setSessionEstimateData(EstimateSession.USER_NAME, params.user_name);
            }

            // if (user_email) {
            //     params.user_email = user_email;
            //     EstimateSession.setSessionEstimateData(EstimateSession.USER_EMAIL, params.user_email);
            // }

            if (referer) {
                params.referer = referer;
            }

            if (referer_keyword) {
                params.referer_keyword = referer_keyword;
            }

            if (typeof onConsult === "function") {
                onConsult(params);
            }
        }
    }

    onShowPolicy() {
        const modalName = "pop-policy";
        PopModal.createModal(modalName, <PopPolicy onClose={() => PopModal.close(modalName)} />, { className: modalName, modal_close: false });
        PopModal.show(modalName);
    }

    render() {
        const { phone_list, user_phone1, user_phone2, user_phone3, user_name, user_email, agree, checked } = this.state;

        return (
            <div className="main__consult__bar">
                <div className="content">
                    <div className="name">
                        <div className="name__form">
                            <Input
                                type="text"
                                name="user_name"
                                value={user_name}
                                placeholder="이름을 입력해주세요."
                                onChange={(e, n, v) => this.setState({ [n]: v })}
                            />
                        </div>
                    </div>
                    <div className="phone">
                        <div className="phone__form">
                            <DropDown
                                data={phone_list}
                                select={user_phone1}
                                onSelect={v => this.setState({ user_phone1: v })}
                            />
                            <span>-</span>
                            <Input
                                type="tel"
                                name="user_phone2"
                                value={user_phone2}
                                regular={regular.INPUT.NUMBER}
                                max="4"
                                onChange={(e, n, v) => this.setState({ [n]: v })}
                            />
                            <span>-</span>
                            <Input
                                type="tel"
                                name="user_phone3"
                                value={user_phone3}
                                regular={regular.INPUT.NUMBER}
                                max="4"
                                onChange={(e, n, v) => this.setState({ [n]: v })}
                            />
                        </div>
                    </div>
                    {/*<div className="email">*/}
                        {/*<div className="email__form">*/}
                            {/*<Input*/}
                                {/*type="email"*/}
                                {/*name="user_email"*/}
                                {/*value={user_email}*/}
                                {/*placeholder="이메일을 입력해주세요."*/}
                                {/*onChange={(e, n, v) => this.setState({ [n]: v })}*/}
                            {/*/>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                </div>
                <div className="agree">
                    <CheckBox checked={agree} onChange={b => this.setState({ agree: b })} />
                    <span className="agree__title" onClick={() => this.setState(state => ({ agree: !state.agree }))}>개인정보 수집 및 이용에 동의합니다.</span>
                    <button style={{ marginLeft: 5 }} onClick={this.onShowPolicy}>[자세히보기]</button>
                    {/*<div className={classNames("agree__info", { checked })}>*/}
                    {/*<div>*/}
                    {/*<p>포스냅은 고객의 요청에 정확하고 성실한 답변을 드리기 위해 필요한 최소한의 개인정보를 수집하고 있습니다.</p>*/}
                    {/*<p>개인정보 수집 이용목적: 고객지원 담당자 확인 및 문의내용 처리</p>*/}
                    {/*<p>수집하는 개인정보 항목: 이름, 전화번호</p>*/}
                    {/*<p>수집하는 개인정보 처리 및 보존기간: 1년 보관 후 파기</p>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                </div>
                <div className="buttons">
                    <button className="_button _button__fill__yellow" onClick={this.onConsult}>전문가에게 무료상담 받기</button>
                </div>
            </div>
        );
    }
}

ConsultBar.propTypes = {
    onConsult: PropTypes.func
};

export default ConsultBar;
