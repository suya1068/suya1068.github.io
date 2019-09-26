import "./centerInfoPanel.scss";
import React, { Component } from "react";
import Buttons from "desktop/resources/components/button/Buttons";
import Auth from "forsnap-authentication";
import redirect from "forsnap-redirect";
import utils from "forsnap-utils";

const CenterInfoPanel = () => {
    // const wcsEvent = () => {
    //     if (wcs && wcs.cnv && wcs_do) {
    //         const _nasa = {};
    //         _nasa["cnv"] = wcs.cnv("5", "1");
    //         wcs_do(_nasa);
    //     }
    // };

    const redirectChat = () => {
        const user = Auth.getUser();
        if (user) {
            // wcsEvent();
            //utils.ad.wcsEvent("5");
            if (!user.data.is_artist) {
                redirect.chatUserHelp();
            } else {
                redirect.chatArtistHelp();
            }
        } else {
            redirect.login();
        }
    };

    return (
        <div className="centerInfoPanel">
            <div className="panel">
                <div className="left-tri" />
                <div className="cs">
                    <div className="cs-row">
                        <div className="cs-title">
                            <p>1:1문의</p>
                        </div>
                        <div className="cs-content">
                            <p className="text flex" >
                                <span style={{ paddingRight: "10px" }}>고객센터 1:1 문의</span>
                                <Buttons
                                    inline={{ onClick: () => redirectChat() }}
                                    buttonStyle={{ size: "tiny", width: "w68", shape: "circle", theme: "default" }}
                                >
                                    바로가기</Buttons>
                            </p>
                            <p className="text">평일 10:00 ~ 17:00 | 주말, 공휴일 휴무</p>
                        </div>
                    </div>
                    {/*<div className="cs-row">*/}
                    {/*<div className="cs-title">*/}
                    {/*<p className="title">계좌번호</p>*/}
                    {/*</div>*/}
                    {/*<div className="cs-content">*/}
                    {/*<p style={{ marginTop: "5px", letterSpacing: "0.2px" }}>기업은행 001-614197-04-011<span style={{ marginLeft: "15px" }}>(주)포스냅</span></p>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                </div>
            </div>
            <div className="panel">
                <div className="left-tri" />
                <div className="co-op">
                    <p className="title">고객센터</p>
                    <div className="co-op_row">
                        <p className="row-title">이용문의</p>
                        <p className="row-content phoneNumber">070)4060-4406</p>
                    </div>
                    <div className="co-op_row">
                        <p className="row-title">계산서 및 정산문의</p>
                        <p className="row-content phoneNumber">070)5088-3488</p>
                    </div>
                    <div className="co-op_row">
                        <p className="row-title">메일</p>
                        <p className="row-content email"><a href="mailto:help@forsnap.com">help@forsnap.com</a></p>
                    </div>
                    {/*<p className="text">이용문의<span className="phoneNumber">070)4060-4406</span></p>*/}
                    {/*<p className="text">계산서 및 정산문의<span className="phoneNumber">070)5088-3488</span></p>*/}
                    {/*<p className="text">*/}
                    {/*메일<span className="email"><a href="mailto:help@forsnap.com">help@forsnap.com</a></span>*/}
                    {/*</p>*/}
                </div>
            </div>
        </div>
    );
};

export default CenterInfoPanel;
