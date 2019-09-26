import "./landing_phase.scss";
import React from "react";
import Img from "shared/components/image/Img";

const LandingPhase = props => {
    const onChangeStep = () => {
        if (typeof props.onChangeStep === "function") {
            props.onChangeStep(2);
        }
    };

    return (
        <div className="landing_phase">
            <div className="landing_phase__heading">
                <img src={`${__SERVER__.img}/common/counsel/logo_white.png`} alt="forsnap_counsel_logo" />
                <p>왜 포스냅에서 상담신청을 해야할까요?</p>
            </div>
            <div className="landing_phase__body">
                <div className="landing_phase__body-row">
                    <div className="landing_phase__body-row__heading">
                        <p className="title">착한중계</p>
                        <p className="description">포스냅은 수수료가 없어서<br />착한중계가 가능합니다.</p>
                    </div>
                    <div className="landing_phase__body-row__body">
                        <img src={`${__SERVER__.img}/common/counsel/intro/intro_icon01.png`} alt="forsnap_counsel_intro_icon01" />
                    </div>
                </div>
                <div className="landing_phase__body-row">
                    <div className="landing_phase__body-row__heading">
                        <p className="title">투명한 견적</p>
                        <p className="description">전문가가 투명하지 않은<br />견적은 걸러줍니다.</p>
                    </div>
                    <div className="landing_phase__body-row__body">
                        <img src={`${__SERVER__.img}/common/counsel/intro/intro_icon02.png`} alt="forsnap_counsel_intro_icon02" />
                    </div>
                </div>
            </div>
            {/*<Img image={{ src: "/common/counsel/counsel_first_bg.png", type: "image" }} />*/}
            <button
                className="button button__rect landing_phase-button"
                style={{ width: "50%", color: "#fff", backgroundColor: "#000", border: "1px solid #000" }}
                onClick={onChangeStep}
            ><h3>상담신청 진행하기</h3></button>
        </div>
    );
};

export default LandingPhase;
