import "./ConsultModal.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";

import regular from "shared/constant/regular.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import Input from "shared/components/ui/input/Input";
import DropDown from "shared/components/ui/dropdown/DropDown";
import CheckBox from "shared/components/ui/checkbox/CheckBox";
import cookie from "forsnap-cookie";
import * as EstimateSession from "mobile/resources/views/products/list/open/extraInfoSession";

class ConsultModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_phone1: "",
            user_phone2: "",
            user_phone3: "",
            user_email: "",
            user_name: "",
            agree: false,
            checked: false,
            phone_list: [
                { name: "010", value: "010" },
                { name: "011", value: "011" },
                { name: "016", value: "016" },
                { name: "017", value: "017" },
                { name: "018", value: "018" },
                { name: "019", value: "019" }
            ],
            isTypeRecommendArtist: props.isTypeRecommendArtist,
            nickName: props.nickName || "",
            requestAbleCount: props.requestAbleCount || 0
        };

        this.onConsult = this.onConsult.bind(this);
    }

    componentWillMount() {
        const session = sessionStorage;

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

        this.setState({
            user_name: pre_name || "",
            user_phone1: pre_phone1 || this.state.phone_list[0].value,
            user_phone2: pre_phone2 || "",
            user_phone3: pre_phone3 || "",
            user_email: pre_email || ""
        });

        if (session) {
            const referer = session.getItem("referer");
            const referer_keyword = session.getItem("referer_keyword");

            if (referer) {
                this.state.referer = referer;
            }

            if (referer_keyword) {
                this.state.referer_keyword = referer_keyword;
            }
        }
    }

    onConsult() {
        const { onConsult, onClose, isTypeRecommendArtist } = this.props;
        const {
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

        if (isTypeRecommendArtist && !user_name) {
            message = "이름을 입력해주세요.";
        } else if (!user_phone2 || user_phone2.length < 3 || !user_phone3 || user_phone3.length < 4) {
            message = "연락처를 확인해주세요";
        } else if (!isTypeRecommendArtist && user_email && !utils.isValidEmail(user_email)) {
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
                user_phone: `${user_phone1}${user_phone2}${user_phone3}`
            };
            EstimateSession.setSessionEstimateData(EstimateSession.USER_PHONE, params.user_phone);

            if (isTypeRecommendArtist && user_name) {
                params.user_name = user_name;
                EstimateSession.setSessionEstimateData(EstimateSession.USER_NAME, params.user_name);
            }

            if (referer) {
                params.referer = referer;
            }

            if (referer_keyword) {
                params.referer_keyword = referer_keyword;
            }

            if (!isTypeRecommendArtist && user_email) {
                params.user_email = user_email;
                EstimateSession.setSessionEstimateData(EstimateSession.USER_EMAIL, params.user_email);
            }

            const agent = cookie.getCookies("FORSNAP_UUID");
            if (agent) {
                params.agent = agent;
            }

            onConsult(params);
        }
    }

    render() {
        const { onClose, isTypeRecommendArtist, nickName, requestAbleCount } = this.props;
        const { user_phone1, user_phone2, user_phone3, user_name, user_email, agree, phone_list, checked } = this.state;
        const title = isTypeRecommendArtist ? "작가님께 연락처와 견적내용이 바로 전달됩니다." : "입력해주신 내용을 바탕으로 포스냅에서 연락드립니다.";
        const btnText = isTypeRecommendArtist ? "작가에게 문의하기" : "상세견적 신청하기";

        return (
            <div className="consult__modal">
                <div className="consult__logo">
                    <img alt="logo" src={`${__SERVER__.img}/common/f_logo_black.png`} />
                    <button className="_button _button__close black__lighten" onClick={onClose} />
                </div>
                <div className="consult__title">
                    {title}
                    {isTypeRecommendArtist &&
                    <div style={{ marginTop: 5 }}>
                        <p className="consult__title__add-artist-info">
                            현재 {requestAbleCount}명의 작가에게 신청가능합니다.
                        </p>
                        <p className="consult__title__add-artist-info">
                            최대 3명의 작가님들께<br />견적 및 상담을 받아보실 수 있습니다.
                        </p>
                    </div>
                    }
                </div>
                <div className="consult__content">
                    {isTypeRecommendArtist &&
                    <div className="consult__name">
                        <div className="content">
                            <Input
                                type="text"
                                name="user_name"
                                value={user_name}
                                placeholder="이름을 입력하세요."
                                max="10"
                                onChange={(e, n, v) => this.setState({ [n]: v })}
                            />
                        </div>
                    </div>
                    }
                    <div className="consult__phone">
                        <div className="content">
                            <DropDown
                                data={phone_list}
                                select={user_phone1}
                                onSelect={v => this.setState({ user_phone1: v })}
                            />
                            <Input
                                type="tel"
                                name="user_phone2"
                                value={user_phone2}
                                regular={regular.INPUT.NUMBER}
                                max="4"
                                onChange={(e, n, v) => this.setState({ [n]: v })}
                            />
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
                    {!isTypeRecommendArtist &&
                    <div className="consult__email">
                        <div className="content">
                            <Input
                                type="email"
                                name="user_email"
                                value={user_email}
                                placeholder="이메일을 입력해주세요."
                                onChange={(e, n, v) => this.setState({ [n]: v })}
                            />
                        </div>
                    </div>
                    }
                </div>
                {isTypeRecommendArtist ?
                    <div className="consult__artist__agree">
                        <p>고객님께서 선택하신 항목을 바탕으로 한 예상 견적이며,<br />세부사항 상담 시 견적금액이 변경될 수 있습니다.</p>
                    </div> :
                    <div className="consult__agree">
                        <CheckBox checked={agree} onChange={b => this.setState({ agree: b })} />
                        <span className="agree__title" onClick={() => this.setState(state => ({ checked: !state.checked }))}>개인정보 수집 및 이용에 동의합니다.</span>
                        <div className={classNames("agree__info", { checked })}>
                            <p>포스냅은 고객의 요청에 정확하고 성실한 답변을 드리기 위해 필요한 최소한의 개인정보를 수집하고 있습니다.</p>
                            <p>개인정보 수집 이용목적: 고객지원 담당자 확인 및 문의내용 처리</p>
                            <p>수집하는 개인정보 항목: 이름, 전화번호</p>
                            <p>수집하는 개인정보 처리 및 보존기간: 1년 보관 후 파기</p>
                        </div>
                    </div>
                }
                {isTypeRecommendArtist &&
                <div className="consult__agree__fa">
                    <CheckBox checked={agree} onChange={b => this.setState({ agree: b })} />
                    <span className="consult__agree__fa__title" onClick={() => this.setState(state => ({ agree: !state.agree }))}>개인정보 수집 및 제 3자 제공동의</span>
                    <button style={{ marginLeft: 5, fontSize: 12 }} onClick={() => this.setState(state => ({ checked: !state.checked }))}>[자세히보기]</button>
                </div>
                }
                {isTypeRecommendArtist &&
                <div className={classNames("consult__agree__fa__policy", "agree__info", { checked })}>
                    <div className="policy__info-box">
                        <p className="box-title">개인 정보 수집 및 이용</p>
                        <p className="box-desc">포스냅은 고객의 요청에 정확하고 성실한 답변을 드리기 위해 필요한 최소한의 개인정보를 수집하고 있습니다.</p>
                        <div className="policy__agree__content">
                            <p>목적 : 촬영 문의내용 처리</p>
                            <p>정보 : 이름, 전화번호</p>
                            <p>보유 및 이용기간 : 1년 보관 후 파기</p>
                        </div>
                    </div>
                    <div className="policy__info-box">
                        <p className="box-title">개인정보 제3자 제공</p>
                        <div className="policy__agree__content">
                            <p>제공받는자 : {nickName}</p>
                            <p>목적 : 작가와 고객간의 원활한 문의 진행</p>
                            <p>정보 : 이름, 전화번호</p>
                            <p>보유 및 이용기간 : 1년 보관 후 파기</p>
                        </div>
                    </div>
                </div>
                }
                <div className="consult__button">
                    <button className="_button _button__fill__yellow1" onClick={this.onConsult}>{btnText}</button>
                </div>
            </div>
        );
    }
}

ConsultModal.propTypes = {
    onConsult: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    isTypeRecommendArtist: PropTypes.bool
};

ConsultModal.defaultProps = {
    isTypeRecommendArtist: false
};

export default ConsultModal;
