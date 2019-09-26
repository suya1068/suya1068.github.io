import "./wideScreen.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import utils from "forsnap-utils";
import { PERSONAL_DATA } from "shared/constant/banner.const";
import PopModal from "shared/components/modal/PopModal";
import PersonalConsulting from "shared/components/consulting/personal/ConsultContainer";
import auth from "forsnap-authentication";

export default class WideScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: PERSONAL_DATA,
            user: auth.getUser() || null
        };
    }

    onConsult(category) {
        const modal_name = "personal_consult";
        PopModal.createModal(modal_name, <PersonalConsulting category={category || ""} device_type="pc" access_type="banner" />, { className: modal_name });
        PopModal.show(modal_name);
    }

    /**
     *  버튼 클릭 ga이벤트
     */
    gaEvent(label) {
        const eCategory = "개인메인";
        const eAction = "개인";
        const eLabel = label;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    /**
     * 버튼 클릭 시 flag값에 따라 동작한다.
     * 1. artist_chat : 1:1 대화하기 팝업 띄움
     * 2. quotation: 견적요청 페이지 이동
     * 3. portfolio: 스냅촬영 카테고리 페이지로 이동
     * @param action - String
     * @param url - String
     */
    onButtonClick(action, url, category) {
        let cUrl = "";
        if (action === "quotation") {
            cUrl = url;
        } else if (action === "consult") {
            this.onConsult(category);
        } else if (action === "portfolio") {
            cUrl = "/products?category=SNAP";
        }

        this.gaEvent(this.setGaLabel(category));

        if (cUrl) {
            location.href = cUrl;
        }
    }

    /**
     * ga이벤트 라벨 문자열을 설정한다.
     * @param code
     * @returns {*}
     */
    setGaLabel(code) {
        switch (code) {
            case "WEDDING": return "웨딩-간편상담";
            case "SNAP": return "스냅-포폴선택";
            case "PROFILE": return "프로필-맞춤상담";
            case "BABY": return "베이비-촬영문의";
            default: return code;
        }
    }

    render() {
        const { data, user } = this.state;

        return (
            <div className="main-wide-screen">
                <div className="main-wide-screen-container">
                    <div className="main-wide-screen__wrap">
                        <div className="main-wide-screen__images">
                            <Img image={{ src: data.MAIN_IMG_P, type: "image" }} isCrop isImageCrop />
                        </div>
                        <div className="main-wide-screen__images-wrap">
                            <div className="container">
                                <div className="flex-box">
                                    <h4 className="main-wide-screen__title">{data.TITLE}</h4>
                                    <div className="main-wide-screen__wideButtons">
                                        {data.LIST.map((obj, idx) => {
                                            let action = obj.ACTION;
                                            let redirect_url = "/";
                                            let buttonTitle = obj.BUTTON_TITLE;
                                            if (action === "quotation") {
                                                if (user) {
                                                    redirect_url = obj.REDIRECT_URL;
                                                } else {
                                                    redirect_url = obj.REDIRECT_URL_GUEST;
                                                }
                                            }

                                            if (obj.CATEGORY === "SNAP") {
                                                buttonTitle = "포트폴리오 선택";
                                                action = "portfolio";
                                            }
                                            return (
                                                <div className="main-wide-screen__wideButton" key={`main-wide-screen__wideButton__${obj.CATEGORY}`}>
                                                    <div className="main-wide-screen__wideButton__bgImage">
                                                        <Img image={{ src: obj.MAIN_IMG_P, type: "image" }} />
                                                    </div>
                                                    <div className="main-wide-screen__wideButton__bgWrap">
                                                        <div>
                                                            <div className="test">
                                                                <h5 className="main-wide-screen__wideButton-title">{obj.TITLE}</h5>
                                                                <p className="main-wide-screen__wideButton-description">{utils.linebreak(obj.DESCRIBE)}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => this.onButtonClick(action, redirect_url, obj.CATEGORY)}
                                                                style={{ backgroundColor: obj.BUTTON_BG_COLOR }}
                                                                className="p-button p-button__round p-button__block"
                                                            >{buttonTitle}</button>
                                                        </div>
                                                        <p className="nick_name">{`by ${obj.ARTIST}`}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <p className="nick_name">{`by ${data.MAIN_ARTIST}`}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
