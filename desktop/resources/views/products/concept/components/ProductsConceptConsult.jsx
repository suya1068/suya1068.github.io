import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import PopModal from "shared/components/modal/PopModal";
import regular from "shared/constant/regular.const";

import Input from "shared/components/ui/input/Input";
import DropDown from "shared/components/ui/dropdown/DropDown";
import CheckBox from "shared/components/ui/checkbox/CheckBox";
import PolicyModal from "../modal/PolicyModal";

import cookie from "forsnap-cookie";
import * as EstimateSession from "desktop/resources/views/products/components/open/components/extraInfoSession";

class ProductsConceptConsult extends Component {
    constructor(props) {
        super(props);

        this.state = {
            device_type: "pc",
            access_type: props.access_type,
            page_type: "biz",
            user_email: "",
            user_name: "",
            user_phone1: "",
            user_phone2: "",
            user_phone3: "",
            agree: false,
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
        this.onShowPolicy = this.onShowPolicy.bind(this);
    }

    componentWillMount() {
        const { phone_list } = this.state;
        this.state.user_phone1 = this.state.phone_list[0].value;

        const pre_phone = EstimateSession.getSessionEstimateData(EstimateSession.USER_PHONE);
        const pre_email = EstimateSession.getSessionEstimateData(EstimateSession.USER_EMAIL);
        const pre_name = EstimateSession.getSessionEstimateData(EstimateSession.USER_NAME);

        let pre_phone1 = "";
        let pre_phone2 = "";
        let pre_phone3 = "";

        if (pre_phone) {
            pre_phone1 = pre_phone.substr(0, 3);
            pre_phone2 = (pre_phone.substr(3).length === 7 && pre_phone.substr(3, 3)) || (pre_phone.substr(3).length === 8 && pre_phone.substr(3, 4));
            pre_phone3 = (pre_phone2.length === 3 && pre_phone.substr(6)) || (pre_phone2.length === 4 && pre_phone.substr(7));
        }
        const phoneIndex = phone_list.findIndex(obj => obj.value === pre_phone1);

        this.setState({
            user_phone1: (pre_phone1 && phoneIndex !== -1) ? pre_phone1 : this.state.phone_list[0].value,
            user_phone2: pre_phone2 || "",
            user_phone3: pre_phone3 || "",
            user_email: pre_email || "",
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
            user_email,
            user_name,
            agree,
            referer,
            referer_keyword
        } = this.state;
        let message = "";

        if (!user_name) {
            message = "이름을 입력해주세요.";
        } else if (!user_phone2 || user_phone2.length < 3 || !user_phone3 || user_phone3.length < 4) {
            message = "연락처를 확인해주세요.";
        } else if (user_email && !utils.isValidEmail(user_email)) {
            message = "이메일을 정확하게 입력해주세요.";
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
                page_type,
                user_phone: `${user_phone1}${user_phone2}${user_phone3}`
            };
            EstimateSession.setSessionEstimateData(EstimateSession.USER_PHONE, params.user_phone);

            const agent = cookie.getCookies("FORSNAP_UUID");

            if (user_email) {
                params.user_email = user_email;
                EstimateSession.setSessionEstimateData(EstimateSession.USER_EMAIL, params.user_email);
            }

            if (user_name) {
                params.user_name = user_name;
                EstimateSession.setSessionEstimateData(EstimateSession.USER_NAME, params.user_name);
            }

            if (referer) {
                params.referer = referer;
            }

            if (referer_keyword) {
                params.referer_keyword = referer_keyword;
            }

            if (agent) {
                params.agent = agent;
            }


            if (typeof onConsult === "function") {
                onConsult(params);
            }
        }
    }

    /**
     * 약관 보기
     */
    onShowPolicy() {
        const modalName = "pop-policy";
        PopModal.createModal(modalName, <PolicyModal onClose={() => PopModal.close(modalName)} />, { className: modalName, modal_close: false });
        PopModal.show(modalName);
    }

    render() {
        const { phone_list, user_phone1, user_phone2, user_phone3, user_name, agree } = this.state;

        return (
            <div className="concept__consult__container">
                <div className="title">촬영에 대해 궁금한점이 있다면, <br />포스냅 전문가와 먼저 상담받아보세요!</div>
                <div className="content">
                    <div className="name">
                        <div className="label required">이름</div>
                        <div className="name__form">
                            <Input
                                name="user_name"
                                value={user_name}
                                placeholder="이름을 입력해주세요."
                                onChange={(e, n, v) => this.setState({ [n]: v })}
                            />
                        </div>
                    </div>
                    <div className="phone">
                        <div className="label required">연락처</div>
                        <div className="phone__form">
                            <DropDown
                                data={phone_list}
                                select={user_phone1}
                                onSelect={v => this.setState({ user_phone1: v })}
                            />
                            <span>-</span>
                            <Input
                                name="user_phone2"
                                value={user_phone2}
                                regular={regular.INPUT.NUMBER}
                                max="4"
                                onChange={(e, n, v) => this.setState({ [n]: v })}
                            />
                            <span>-</span>
                            <Input
                                name="user_phone3"
                                value={user_phone3}
                                regular={regular.INPUT.NUMBER}
                                max="4"
                                onChange={(e, n, v) => this.setState({ [n]: v })}
                            />
                        </div>
                    </div>
                </div>
                <div className="agree">
                    <CheckBox checked={agree} onChange={b => this.setState({ agree: b })}>
                        <span style={{ color: "#666" }}>개인정보 수집 및 이용에 동의합니다.</span>
                    </CheckBox>
                    <button style={{ marginLeft: 5, color: "#666", cursor: "pointer" }} onClick={this.onShowPolicy}>[자세히보기]</button>
                </div>
                <div className="buttons">
                    <button className="_button _button__fill__yellow" onClick={this.onConsult}>전문가에게 무료상담 받기</button>
                </div>
            </div>
        );
    }
}

ProductsConceptConsult.propTypes = {
    access_type: PropTypes.string,
    onConsult: PropTypes.func
};

export default ProductsConceptConsult;
