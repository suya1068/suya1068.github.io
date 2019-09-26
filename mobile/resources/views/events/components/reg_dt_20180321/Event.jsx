import "./event.scss";
import React, { Component } from "react";
import Img from "shared/components/image/Img";
import EVENT_CONST from "./event.const";
import Recommend from "../recommend/Recommend";
import utils from "forsnap-utils";
import QuickMenu from "../quickMenu/QuickMenu";
import PopModal from "shared/components/modal/PopModal";

export default class Event extends Component {
    constructor() {
        super();
        this.state = {
        };
    }
    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    /**
     * 공유하기
     * @param type
     */
    onShare(type) {
        let sns;
        let params;
        // const { data } = this.state;
        const url = location.href;
        // const url = `${__DESKTOP__}/products/${data.product_no}`;

        switch (type) {
            case "naver": {
                sns = __SNS__.naver;
                params = {
                    url,
                    title: document.querySelector("meta[property='og:title']").getAttribute("content")
                };
                break;
            }
            case "kakao":
                // template_msg : Object
                // 링크 메시지 (Link JSON 참고용)
                // warning_msg : Object
                // 링크 메시지를 검증한 결과
                // argument_msg : Object
                // argument를 검증한 결과
                params = {
                    requestUrl: url,
                    // templateId: 4756
                    templateArgs: {
                        name: "포스냅",
                        url: "https://forsnap.com"
                    },
                    fail: messageObj => {
                        PopModal.alert("카카오링크 공유에 실패했습니다.");
                    }
                    // success: messageObj => {
                    //     console.log("KAKAO SUCCESS");
                    // }
                };
                break;
            case "facebook":
                sns = __SNS__.facebook;
                params = {
                    app_id: sns.client_id,
                    display: "popup",
                    href: url
                };
                break;
            default:
                break;
        }

        if (type === "kakao") {
            window.Kakao.Link.sendScrap(params);
        } else {
            window.open(`${sns.share_uri}?${utils.query.stringify(params)}`, "sharePopup");
        }
    }

    onApplyEvent(e) {
        e.preventDefault();
        const node = e.currentTarget;
        const eCategory = "페이백이벤트";
        const eAction = "";
        const eLabel = "신청하기";
        utils.ad.gaEvent(eCategory, eAction, eLabel);
        location.href = node.href;
    }

    render() {
        return (
            <section className="event-component">
                <h2 className="sr-only">이벤트 페이지</h2>
                <article className="event-top">
                    <h3 className="sr-only">페이백받으시개</h3>
                    <Img image={{ src: EVENT_CONST.IMG.TOP, type: "image" }} />
                </article>
                <article className="event-middle">
                    <h3 className="sr-only">페이백 신청하기</h3>
                    <Img image={{ src: EVENT_CONST.IMG.MIDDLE, type: "image" }} />
                    <a className="event-middle-button" role="button" href="https://goo.gl/forms/sMCr70QTCjRZFmM13" onClick={this.onApplyEvent}>
                        <Img image={{ src: EVENT_CONST.BUTTONS.APPLY, type: "image" }} />
                    </a>
                </article>
                <Recommend />
                <article className="event-bottom">
                    <h3 className="sr-only">이벤트 공유하기</h3>
                    <Img image={{ src: EVENT_CONST.IMG.BOTTOM, type: "image" }} />
                    <div className="event-bottom-buttons">
                        <div className="event-button button-facebook" onClick={() => this.onShare("facebook")}>
                            <Img image={{ src: EVENT_CONST.BUTTONS.FACEBOOK, type: "image" }} />
                        </div>
                        <div className="event-button button-naver" onClick={() => this.onShare("naver")}>
                            <Img image={{ src: EVENT_CONST.BUTTONS.NAVER, type: "image" }} />
                        </div>
                    </div>
                </article>
                <QuickMenu />
            </section>
        );
    }
}
