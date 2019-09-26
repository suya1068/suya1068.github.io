import "./screenTop.scss";
import React, { Component } from "react";
import Img from "shared/components/image/Img";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import { BIZ_DATA } from "shared/constant/banner.const";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";

class ScreenTop extends Component {
    constructor() {
        super();
        this.state = {
            user: auth.getUser() || ""
        };
        this.onResize = this.onResize.bind(this);
        this.onConsult = this.onConsult.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        window.addEventListener("resize", this.onResize);
    }

    componentDidMount() {
        this.onResize();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    onResize() {
        const rs = utils.resize(3, 4, window.innerWidth, 0, true);
        this.setState({
            width: rs.width,
            height: rs.height
        });
    }

    /**
     * ga이벤트
     */
    gaEvent(label) {
        const eCategory = "기업메인";
        const eAction = "기업";
        const eLabel = label;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("상단배너");
        }
    }

    /**
     * 상담신청 페이지로 이동한다.
     */
    onConsult() {
        if (typeof this.props.onConsult === "function") {
            this.props.onConsult(CONSULT_ACCESS_TYPE.BANNER.CODE);
        }
    }

    /**
     * 버튼 클릭
     * @param label
     * @param category
     */
    onMovePage(label, category) {
        this.gaEvent(label);
        this.onConsult(category);
    }

    /**
     * 버튼 타이틀을 변경한다.
     * @param code
     * @returns {*}
     */
    setButtonTitle(code) {
        switch (code) {
            case "PRODUCT": return "맞춤상담 받아보기";
            case "FOOD": return "간단상담 받아보기";
            case "ETC": return "촬영견적 알아보기";
            default: return code;
        }
    }

    render() {
        const { width, height } = this.state;
        return (
            <article className="biz-wide-screen top">
                <h3 className="sr-only">상담요청하기</h3>
                <div className="top-image-header" style={{ width, height }}>
                    <div className="top-image-header__image-container">
                        <div className="image-wrapper" />
                        <Img image={{ src: BIZ_DATA.MAIN_IMG_M, type: "image" }} isScreenChange />
                    </div>
                    <div className="top-image__content">
                        <div className="top-image__content-text">
                            <p className="top-image__content-text__center text">
                                상담부터 견적과 촬영까지<br />포스냅에 맡기세요!
                            </p>
                        </div>
                        <div className="personal-banner-wideButtons">
                            {BIZ_DATA.MAIN.map((obj, idx) => {
                                // const action = obj.ACTION;
                                // let redirect_url = "/";
                                const buttonTitle = this.setButtonTitle(obj.CATEGORY);
                                //
                                // if (action === "quotation") {
                                //     if (user) {
                                //         redirect_url = obj.REDIRECT_URL;
                                //     } else {
                                //         redirect_url = obj.REDIRECT_URL_GUEST;
                                //     }
                                // }
                                return (
                                    <div className="personal-banner-wideButton" key={`personal-banner-wideButton__${obj.CATEGORY}`}>
                                        <div className="personal-banner-wideButton__bgImage">
                                            <Img image={{ src: obj.IMG_BG_M, type: "image" }} isImageResize isScreenChange />
                                        </div>
                                        <div className="personal-banner-wideButton__bgWrap">
                                            <div>
                                                <div className="test">
                                                    <h5 className="personal-banner-wideButton-title">{obj.TITLE}촬영</h5>
                                                    <p className="personal-banner-wideButton-description">{utils.linebreak(obj.DESCRIBE)}</p>
                                                </div>
                                                <div className="wideButton-button">
                                                    <button
                                                        onClick={() => this.onMovePage(obj.TITLE, obj.CATEGORY)}
                                                        style={{ backgroundColor: obj.BUTTON_BG_COLOR }}
                                                        className="p-button p-button__round p-button__block"
                                                    >{buttonTitle}</button>
                                                </div>
                                                <p className="nick_name">{`by ${obj.ARTIST}`}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <p className="nick_name">{`by ${BIZ_DATA.MAIN_ARTIST}`}</p>
                </div>
            </article>
        );
    }
}

export default ScreenTop;
