import "./screenBottom.scss";
import utils from "forsnap-utils";
import React, { Component } from "react";

const ScreenBottom = props => {
    const gaEvent = label => {
        const eCategory = "메인 상단 배너";
        const eAction = "배너";
        const eLabel = `${label}`;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
        if (typeof props.gaEvent === "function") {
            props.gaEvent(label);
        }
    };
    const onMovePage = e => {
        e.preventDefault();
        const node = e.currentTarget;
        const href = node.href;
        gaEvent("가격정가제");
        location.href = href;
    };

    return (
        <article className="biz-wide-screen bottom">
            <h3 className="sr-only">포스냅의 믿음</h3>
            <div className="bottom-tabs">
                <div className="bottom-tab">
                    <div className="bottom-tab__text-container">
                        <p className="bottom-tab__heading">포스냅에서 촬영요청하면 과다한 비용지출을 막을 수 있어요.</p>
                        <p className="bottom-tab__title">투명한 가격정책</p>
                        <p className="bottom-tab__description">포스냅에서는 표준 단가로<br /> 견적을 준비합니다.</p>
                    </div>
                    <a className="button-base bottom-tab__button" href="/information/price" role="button" onClick={onMovePage}>가격정가제 확인하러 가기</a>
                </div>
                <div className="bottom-tab">
                    <div className="bottom-tab__text-container">
                        <p className="bottom-tab__heading">광고 문구 뿐인 견적서가 아니예요.</p>
                        <p className="bottom-tab__title">분야별 전문가가<br /> 상세견적서 제공</p>
                        <p className="bottom-tab__description">{utils.linebreak("각분야 최고의 스튜디오들과\n'크루'협약을 맺고 진행합니다.")}</p>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ScreenBottom;
