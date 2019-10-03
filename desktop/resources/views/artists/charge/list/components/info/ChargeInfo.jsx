import "./chargeInfo.scss";
import React, { Component, PropTypes } from "react";

export default class ChargeInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="charge-artist__info">
                <div className="info-title">주의사항</div>
                <div className="info-check">신청 전 확인해주세요!</div>
                <div className="info-content">
                    <ul className="info-content__list">
                        <li className="info-content__list-unit">
                            <p>광고는 입금 즉시 노출되기 때문에 일시중지가 불가능합니다.</p>
                        </li>
                        <li className="info-content__list-unit">
                            <p>광고기간이 2주 이상 남은 경우에만 2주 단위로만 환불 가능합니다.</p>
                            {/*<p>일주일 이상 신청한 경우 해당주를 제외한 나머지 기간에 대한 환불만 가능합니다.</p>*/}
                        </li>
                        <li className="info-content__list-unit">
                            <p>4주이상 신청 시 추가되는 기간 (4주+2일,6주+4일,8주+7일)의 경우 환불되지 않으며, 환불신청 시 해당 기간을 뺀 나머지 기간에 대해서만 환불 가능합니다.</p>
                        </li>
                        <li className="info-content__list-unit">
                            <p>신청한 상품을 삭제하거나 비노출 상태로 변경하는 경우 광고영역에 노출되지 않으며 삭제 및 상태변경으로 인한 환불은 불가능합니다.</p>
                        </li>
                        <li className="info-content__list-unit">
                            <p>광고 구매 후 패널티가 부여되어 포스냅의 사용이 정지된 경우, 사이트 내 규정을 위반하여 패널티가 부과된 것이기 때문에 일시중지 및 환불이 불가합니다.</p>
                        </li>
                        <li className="info-content__list-unit">
                            <p>환불 및 기타 문의는 포스냅 고객센터를 통해 접수해주세요.</p>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
