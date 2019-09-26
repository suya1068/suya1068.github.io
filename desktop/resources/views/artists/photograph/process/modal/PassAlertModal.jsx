import React, { Component, PropTpyes } from "react";

import Modal from "shared/components/modal/Modal";

class PassAlertModal extends Component {
    render() {
        return (
            <div className="pass__alert__modal">
                <div className="pass__title">
                    외부업로드 후 다음 과정을 거쳐 최종완료처리 됩니다.
                </div>
                <div className="pass__description">
                    최종완료 이후 정산진행되며, 정산일정은 작가페이지 &gt; 정산관리 에서 확인 가능합니다.
                </div>
                <div className="pass__content">
                    <div className="pass__item">
                        <div className="item__icon">
                            <img alt="icon" src={`${__SERVER__.img}/common/icon_pass_origin_01.png`} />
                        </div>
                        <div className="item__number">01</div>
                        <div className="item__title">외부업로드 진행</div>
                    </div>
                    <div className="pass__item">
                        <div className="item__icon">
                            <img alt="icon" src={`${__SERVER__.img}/common/icon_pass_origin_02.png`} />
                        </div>
                        <div className="item__number">02</div>
                        <div className="item__title">고객에게 SMS<br />혹은 알림톡 발송</div>
                    </div>
                    <div className="pass__item">
                        <div className="item__icon">
                            <img alt="icon" src={`${__SERVER__.img}/common/icon_pass_origin_03.png`} />
                        </div>
                        <div className="item__number">03</div>
                        <div className="item__title">고객이 확인완료<br />(1주일 경과 시 자동진행)</div>
                    </div>
                    <div className="pass__item">
                        <div className="item__icon">
                            <img alt="icon" src={`${__SERVER__.img}/common/icon_pass_origin_04.png`} />
                        </div>
                        <div className="item__number">04</div>
                        <div className="item__title">최종완료</div>
                    </div>
                </div>
                <div className="pass__buttons">
                    <button className="_button _button__default" onClick={() => Modal.close()} >확인</button>
                </div>
            </div>
        );
    }
}

export default PassAlertModal;
