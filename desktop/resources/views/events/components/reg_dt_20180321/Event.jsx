import "./event.scss";
import React, { Component } from "react";
import Img from "shared/components/image/Img";
import EVENT_CONST from "./event.const";
import Recommend from "../recommend/Recommend";
import utils from "forsnap-utils";
import QuickMenu from "../quickMenu/QuickMenu";

export default class Event extends Component {
    constructor() {
        super();
        this.state = {
            winHeight: window.innerHeight || 0
        };
    }
    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    onShare(type) {
        let sns;
        let params;

        switch (type) {
            case "naver": {
                sns = __SNS__.naver;
                params = {
                    url: location.href,
                    title: document.querySelector("meta[property='og:title']").getAttribute("content")
                };
                break;
            }
            case "facebook":
                sns = __SNS__.facebook;
                params = {
                    app_id: sns.client_id,
                    display: "popup",
                    href: location.href
                };
                break;
            default:
                break;
        }

        const options = "titlebar=1, resizable=1, scrollbars=yes, width=600, height=550";
        window.open(`${sns.share_uri}?${utils.query.stringify(params)}`, "sharePopup", options);
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
                    <div className="container">
                        <Img image={{ src: EVENT_CONST.IMG.TOP, type: "image" }} />
                    </div>
                </article>
                <article className="event-middle">
                    <h3 className="sr-only">페이백 신청하기</h3>
                    <div className="container">
                        <Img image={{ src: EVENT_CONST.IMG.MIDDLE, type: "image" }} />
                        <a className="event-middle-button" role="button" href="https://goo.gl/forms/sMCr70QTCjRZFmM13" onClick={this.onApplyEvent}>
                            <Img image={{ src: EVENT_CONST.BUTTONS.APPLY, type: "image" }} />
                        </a>
                    </div>
                </article>
                <Recommend />
                <article className="event-bottom">
                    <h3 className="sr-only">이벤트 공유하기</h3>
                    <div className="container">
                        <Img image={{ src: EVENT_CONST.IMG.BOTTOM, type: "image" }} />
                        <div className="event-bottom-buttons">
                            <div className="event-button button-facebook" onClick={() => this.onShare("facebook")}>
                                <Img image={{ src: EVENT_CONST.BUTTONS.FACEBOOK, type: "image" }} />
                            </div>
                            <div className="event-button button-naver" onClick={() => this.onShare("naver")}>
                                <Img image={{ src: EVENT_CONST.BUTTONS.NAVER, type: "image" }} />
                            </div>
                        </div>
                    </div>
                </article>
                <div className="container">
                    <div className="quickMenu-wrapper">
                        <QuickMenu />
                    </div>
                </div>
            </section>
        );
    }
}
