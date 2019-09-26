import "./info.scss";
import React from "react";

const Info = () => {
    return (
        <div className="cs-info">
            <div className="cs-info__heading">
                <h3 className="cs-info__heading-p">문의하기</h3>
            </div>
            <div className="cs-info__content">
                <div className="cs-info__content-row">
                    <div className="cs-info__content-row-box">
                        <p className="cs-info__content-row-title">고객센터 1:1 문의</p>
                        <p className="cs-info__content-row-desc">평일 10:00 ~ 17:00 주말, 공휴일 휴무</p>
                    </div>
                    <div>
                        <a className="button button__default" href="/users/chat?user_id=help">바로가기</a>
                    </div>
                </div>
                {/*<div className="cs-info__content-row">*/}
                {/*<div className="cs-info__content-row-box">*/}
                {/*<p className="cs-info__content-row-title">계좌번호</p>*/}
                {/*<p className="cs-info__content-row-desc">기업은행 001-614197-04-011 (주)포스냅</p>*/}
                {/*</div>*/}
                {/*</div>*/}
                <div className="cs-info__content-row">
                    <div className="cs-info__content-row-box">
                        <p className="cs-info__content-row-title">070)4060-4406</p>
                        <p className="cs-info__content-row-desc">이용문의</p>
                    </div>
                </div>
                <div className="cs-info__content-row">
                    <div className="cs-info__content-row-box">
                        <p className="cs-info__content-row-title">070)5088-3488</p>
                        <p className="cs-info__content-row-desc">계산서 및 정산문의</p>
                    </div>
                </div>
                <div className="cs-info__content-row">
                    <div className="cs-info__content-row-box">
                        <p className="cs-info__content-row-title">help@forsnap.com</p>
                        <p className="cs-info__content-row-desc">메일문의</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Info;
