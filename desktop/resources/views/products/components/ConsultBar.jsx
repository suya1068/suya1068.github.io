import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import api from "forsnap-api";
import utils from "forsnap-utils";
import cookie from "forsnap-cookie";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Input from "shared/components/ui/input/Input";
import ScrollTop from "shared/components/scroll/scroll_top/ScrollTop";

class ConsultBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            agree: false,
            form: {
                user_phone1: "",
                user_phone2: "",
                user_phone3: "",
                user_email: ""
            },
            is_artist: props.is_artist
        };

        this.onChangeForm = this.onChangeForm.bind(this);
        this.onAgree = this.onAgree.bind(this);
        this.onConsult = this.onConsult.bind(this);
    }

    onChangeForm(name, value) {
        this.setState(state => {
            return {
                form: Object.assign({}, state.form, { [name]: value })
            };
        });
    }

    onAgree() {
        this.setState(state => {
            return {
                agree: !state.agree
            };
        });
    }

    onConsult() {
        const { category, keyword } = this.props;
        const { form, agree } = this.state;
        let message = "";

        if (
            !form.user_phone1 || form.user_phone1.length < 2 ||
            !form.user_phone2 || form.user_phone2.length < 3 ||
            !form.user_phone3 || form.user_phone3.length < 3
        ) {
            message = "연락처를 정확하게 입력해주세요.";
        } else if (form.user_email && !utils.isValidEmail(form.user_email)) {
            message = "이메일을 정확하게 입력해주세요.";
        } else if (!agree) {
            message = "개인정보 수집 및 이용동의에 동의해주셔야\n상담신청이 가능합니다.";
        }

        if (message) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(message)
            });
        } else {
            const params = {
                user_phone: `${form.user_phone1}${form.user_phone2}${form.user_phone3}`,
                user_email: form.user_email,
                access_type: category ? `PLF_${category}` : "PLF_NONE",
                device_type: "pc",
                page_type: "biz",
                agent: cookie.getCookies("FORSNAP_UUID")
            };

            const session = sessionStorage;

            if (session) {
                const referer = session.getItem("referer");
                const referer_keyword = session.getItem("referer_keyword");

                if (referer) {
                    params.referer = referer;
                }

                if (referer_keyword) {
                    params.referer_keyword = referer_keyword;
                }
            }

            api.orders.insertAdviceOrders(params)
                .then(response => {
                    utils.ad.wcsEvent("4");
                    utils.ad.gtag_report_conversion(location.href);
                    utils.ad.gaEvent("기업고객", "상담전환");
                    utils.ad.gaEventOrigin("기업고객", "상담전환");
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak("상담신청해 주셔서 감사합니다.\n곧 연락 드리겠습니다.")
                    });
                    this.setState({
                        agree: false,
                        form: {
                            user_phone1: "",
                            user_phone2: "",
                            user_phone3: "",
                            user_email: ""
                        }
                    });
                })
                .catch(error => {
                    if (error && error.data) {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: error.data
                        });
                    }
                });
        }
    }

    render() {
        const { fixed } = this.props;
        const { agree, form } = this.state;

        return (
            <div className={classNames("portfolio__category__consult", { fixed })}>
                <div className="consult__container">
                    <div className="consult__content consult__title">
                        <div className="consult__row">
                            <h2 className="title">빠른견적신청</h2>
                        </div>
                    </div>
                    <div className="consult__content">
                        <div className="consult__row phone">
                            <span>연락처</span>
                            <Input
                                type="text"
                                name="user_phone1"
                                value={form.user_phone1}
                                max="3"
                                onChange={(e, n, v) => this.onChangeForm(n, v)}
                            />
                            <span className="dash">-</span>
                            <Input
                                type="text"
                                name="user_phone2"
                                value={form.user_phone2}
                                max="4"
                                onChange={(e, n, v) => this.onChangeForm(n, v)}
                            />
                            <span className="dash">-</span>
                            <Input
                                type="text"
                                name="user_phone3"
                                value={form.user_phone3}
                                max="4"
                                onChange={(e, n, v) => this.onChangeForm(n, v)}
                            />
                        </div>
                    </div>
                    <div className="consult__content">
                        <div className="consult__row email">
                            <span>이메일</span>
                            <Input
                                type="text"
                                name="user_email"
                                value={form.user_email}
                                max="50"
                                onChange={(e, n, v) => this.onChangeForm(n, v)}
                            />
                        </div>
                    </div>
                    <div className="consult__content consult__agree">
                        <div className="agree__button" onClick={this.onAgree}>
                            <a className="agree__link" href="/policy/private" target="_blank">[ 개인정보 수집 및 이용 ]</a>
                            <div className={classNames("agree__button__icon", { active: agree })}>
                                <div className="icon__overlay">
                                    <div className="circle" />
                                </div>
                            </div>
                            <div className="agree__button__content">동의하기</div>
                        </div>
                    </div>
                    <div className="consult__content consult__buttons">
                        <button
                            className="_button _button__fill__yellow"
                            onClick={this.onConsult}
                        >
                            견적신청하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

ConsultBar.propTypes = {
    fixed: PropTypes.bool,
    category: PropTypes.string.isRequired,
    keyword: PropTypes.string,
    is_artist: PropTypes.bool
};

export default ConsultBar;
