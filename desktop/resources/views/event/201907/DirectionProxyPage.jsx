import "./DirectionProxyPage.scss";
import React, { Component } from "react";

import api from "forsnap-api";
import utils from "forsnap-utils";
import cookie from "forsnap-cookie";

import Img from "shared/components/image/Img";
import Input from "shared/components/ui/input/Input";
import CheckBox from "shared/components/ui/checkbox/CheckBox";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

class DirectionProxyPage extends Component {
    constructor() {
        super();

        this.state = {
            send: false,
            form: {
                name: "",
                tel1: "",
                tel2: "",
                tel3: "",
                agree: false
            },
            search: {}
        };

        this.onChangeForm = this.onChangeForm.bind(this);
        this.onConsult = this.onConsult.bind(this);
        this.onMoveScroll = this.onMoveScroll.bind(this);

        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        const search = location.search;
        this.state.search = utils.query.parse(search);
    }

    componentDidMount() {
    }

    onChangeForm(name, value) {
        this.setState(state => {
            return {
                form: Object.assign({}, state.form, { [name]: value })
            };
        });
    }

    onConsult() {
        const { send, form, search } = this.state;
        let message = "";

        if (form.name && !form.name.replace(/\s/g, "")) {
            message = "이름을 입력해주세요.";
        } else if (!form.tel1 || !form.tel2 || !form.tel3) {
            message = "연락처를 입력해주세요.";
        } else if (!form.agree) {
            message = "개인정보 수집 및 이용에 동의해주세요.";
        } else if (send) {
            message = "이미 상담신청을 하셨습니다.";
        }

        if (message) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: message
            });
        } else {
            const params = {
                user_name: form.name,
                user_phone: `${form.tel1}${form.tel2}${form.tel3}`,
                device_type: "desktop",
                access_type: "event_201907",
                page_type: "biz",
                referer: search ? search.utm_campaign || "" : "",
                agent: cookie.getCookies("FORSNAP_UUID")
            };
            api.orders.insertAdviceOrders(params)
                .then(response => {
                    Modal.close(MODAL_TYPE.PROGRESS);

                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak("상담신청해 주셔서 감사합니다.\n곧 연락 드리겠습니다.")
                    });
                    this.state.send = true;
                })
                .catch(error => {
                    Modal.close(MODAL_TYPE.PROGRESS);
                    if (error && error.data) {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: utils.linebreak(error.data)
                        });
                    }
                });
        }
    }

    onMoveScroll(e) {
        const section = document.getElementById("event__section__05");
        const rect = section.getBoundingClientRect();
        window.scrollTo(0, window.pageYOffset + (rect.top - 110));
    }

    gaEvent() {
        utils.ad.gaEvent("광고", "이벤트_제품대행연출", "포스냅 둘러보기");
    }

    render() {
        const { form } = this.state;
        const host = __SERVER__.img;

        return (
            <div className="event__direction__proxy__page">
                <div className="event__section__01">
                    <div className="bg01">
                        <Img image={{ src: "/event/201907/event_bg_01.jpg", type: "image" }} />
                    </div>
                    <div className="content__01">
                        <div className="section__main">
                            <div className="logo"><img alt="logo" src={`${host}/event/201907/event_logo_01.png`} /></div>
                            <div className="txt01"><img alt="txt01" src={`${host}/event/201907/event_txt_01.png`} /></div>
                            <div className="txt02"><span>제품 촬영 때문에 고민하지마세요!</span></div>
                        </div>
                    </div>
                </div>
                <div className="event__section__02">
                    <div className="section__main">
                        <div className="title"><p>포스냅<br />제품 연출 대행 무료 이벤트</p></div>
                        <div className="txt01">바쁜 고객님을 대신해서<br />포스냅이 <strong>제품 촬영에 대한 고민을 대신</strong>해드립니다.</div>
                        <div className="content__01">
                            <img alt="bg02" src={`${host}/event/201907/event_bg_02.png`} />
                            <div className="content__text">
                                <div className="txt01"><span>매</span><span>달</span> 상담건수만</div>
                                <img className="img__txt02" alt="txt02" src={`${host}/event/201907/event_txt_02.png`} />
                            </div>
                        </div>
                        <div className="txt02">고민마시고 상담부터 받아보세요!</div>
                    </div>
                </div>
                <div className="event__section__03">
                    <div className="section__main">
                        <div className="content__01">
                            <div className="txt01">
                                <p>이벤트<br />참여 기간</p>
                            </div>
                            <div className="txt02">참여기간을 알려드립니다!</div>
                        </div>
                        <div className="content__02">
                            <div className="txt03"><img alt="txt02" src={`${host}/event/201907/event_txt_03.png`} /></div>
                            <div className="txt04">포스냅 전속 제품 촬영 작가님이<br />연출 대행을 무료로 진행해드립니다. </div>
                            <button className="btn01" onClick={this.onMoveScroll}>지금 신청하셔서 무료 상담 받아보세요!</button>
                        </div>
                    </div>
                </div>
                <div className="event__section__04">
                    <div className="section__main">
                        <div className="content__01">
                            <div className="txt01">
                                <p>이벤트<br />참여 방법</p>
                            </div>
                            <div className="txt02">참여기간을 알려드립니다!</div>
                        </div>
                        <div className="content__02">
                            <div className="step">
                                <div className="step__icon">
                                    <span>01</span>
                                    <div>
                                        <img alt="icon01" src={`${host}/event/201907/event_icon_01.png`} />
                                    </div>
                                </div>
                                <div className="step__txt">
                                    아래 포스냅 전문가와<br />
                                    상담해보기에<br />
                                    이름과 번호를 남긴다.
                                </div>
                            </div>
                            <div className="hr" />
                            <div className="step">
                                <div className="step__icon">
                                    <span>02</span>
                                    <div>
                                        <img alt="icon02" src={`${host}/event/201907/event_icon_02.png`} />
                                    </div>
                                </div>
                                <div className="step__txt">
                                    상담사에게 전화가 오면<br />
                                    연출대행 무료 광고보고<br />
                                    연락드렸다고 말한다.
                                </div>
                            </div>
                            <div className="hr" />
                            <div className="step">
                                <div className="step__icon">
                                    <span>03</span>
                                    <div>
                                        <img alt="icon03" src={`${host}/event/201907/event_icon_03.png`} />
                                    </div>
                                </div>
                                <div className="step__txt">
                                    원하는 내용을 바탕으로<br />
                                    상담사와<br />
                                    통화를 진행한다.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="event__section__05" id="event__section__05">
                    <div className="section__main">
                        <div className="title">촬영에 대해 궁금한 점이 있다면,<br />포스냅 전문가와 먼저 상담받아보세요!</div>
                        <div className="consult">
                            <div className="consult__name">
                                <span>이름</span>
                                <Input
                                    name="name"
                                    value={form.name}
                                    placeholder="이름을 입력해주세요."
                                    onChange={(e, n, v) => this.onChangeForm(n, v)}
                                />
                            </div>
                            <div className="consult__contact">
                                <span>연락처</span>
                                <div>
                                    <Input
                                        type="tel"
                                        name="tel1"
                                        value={form.tel1}
                                        max="4"
                                        placeholder="010"
                                        onChange={(e, n, v) => this.onChangeForm(n, v)}
                                    />
                                    <Input
                                        type="tel"
                                        name="tel2"
                                        value={form.tel2}
                                        max="4"
                                        onChange={(e, n, v) => this.onChangeForm(n, v)}
                                    />
                                    <Input
                                        type="tel"
                                        name="tel3"
                                        value={form.tel3}
                                        max="4"
                                        onChange={(e, n, v) => this.onChangeForm(n, v)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="agree">
                            <CheckBox checked={form.agree} onChange={value => this.onChangeForm("agree", value)}>
                                개인정보 수집 및 이용에 동의합니다. <a href="/policy/private" target="_blank">[ 자세히 보기 ]</a>
                            </CheckBox>
                        </div>
                        <button className="btn01" onClick={this.onConsult}>전문가에게 무료상담 받기</button>
                        <a href="/" onClick={this.gaEvent}><button className="btn02">포스냅 둘러보기</button></a>
                    </div>
                </div>
                <div className="event__section__06">
                    <div className="section__main">
                        <div className="content__01">
                            <div className="title">
                                <p>꼭 읽어보세요!</p>
                            </div>
                            <div className="txt01">
                                <p>해당 이벤트는 촬영 일정상 조기 마감될 수 있습니다.</p>
                                <p>연출대행은 3개의 컨셉까지 무료로 진행 가능합니다.</p>
                                <p>연출대행 시 소품비는 별도 청구됩니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DirectionProxyPage;
