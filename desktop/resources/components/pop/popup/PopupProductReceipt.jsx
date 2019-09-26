import "../scss/PopupProductReceipt.scss";
import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";

import RequestJS from "shared/components/quotation/request/QuotationRequest";

class PopupProductReceipt extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentWillMount() {
        // const { data } = this.props;
        //
        // if (data.option_type === "ORDER") {
        //     const orderInfo = data.order_info;
        //     let reserveDt;
        //     if (data.reserve_dt && data.reserve_dt !== "0000-00-00") {
        //         reserveDt = data.reserve_dt;
        //     } else if (orderInfo) {
        //         if (RequestJS.isDate(orderInfo.date)) {
        //             reserveDt = mewtime.strToDate(orderInfo.date);
        //         } else if (RequestJS.isDateOption(orderInfo.date)) {
        //             reserveDt = orderInfo.date;
        //         } else {
        //             reserveDt = "미정";
        //         }
        //     }
        // } else if (data.option_type === "TALK_CUSTOM") {
        //     //
        // } else if (data.option_type === "TALK_EXTRA") {
        //     //
        // } else {
        //     //
        // }
    }

    layoutPurchase(type) {
        return (
            <div className="padding__half">
                <div className="layer__row">
                    <div className="text__header">구매내용</div>
                </div>
                <div className="layer__row padding__vertical__half">
                    <div className="text__header align__start" />
                    <div className="layer__column">
                        <div className="layer__row align__center">
                            <div className="caption__header">옵션명</div>
                            <div className="caption__content"><span>값</span></div>
                        </div>
                        <div className="hr" />
                        <div className="layer__row align__center">
                            <div className="caption__header">원본 이미지 컷 수</div>
                            <div className="caption__content"><span>값</span></div>
                        </div>
                        <div className="hr" />
                        <div className="layer__row align__center">
                            <div className="caption__header">보정 컷 수</div>
                            <div className="caption__content"><span>값</span></div>
                        </div>
                        <div className="hr" />
                        <div className="layer__row align__center">
                            <div className="caption__header">인화 컷 수</div>
                            <div className="caption__content"><span>값</span></div>
                        </div>
                        <div className="hr" />
                        <div className="layer__row align__center">
                            <div className="caption__header">촬영인원</div>
                            <div className="caption__content"><span>값</span></div>
                        </div>
                    </div>
                </div>
                <div className="layer__row padding__vertical__half">
                    <div className="text__header align__start" />
                    <div className="layer__column">
                        <div className="layer__row align__center">
                            <div className="caption__header">패키지명</div>
                            <div className="caption__content"><span>값</span></div>
                        </div>
                        <div className="hr" />
                        <div className="layer__row align__center">
                            <div className="caption__header">촬영시간</div>
                            <div className="caption__content"><span>값</span></div>
                        </div>
                        <div className="hr" />
                        <div className="layer__row align__center">
                            <div className="caption__header">원본 이미지 컷 수</div>
                            <div className="caption__content"><span>값</span></div>
                        </div>
                        <div className="hr" />
                        <div className="layer__row align__center">
                            <div className="caption__header">보정 이미지 컷 수</div>
                            <div className="caption__content"><span>값</span></div>
                        </div>
                        <div className="hr" />
                        <div className="layer__row align__center">
                            <div className="caption__header">최종사진 전달 기간</div>
                            <div className="caption__content"><span>값</span></div>
                        </div>
                        <div className="hr" />
                        <div className="layer__row align__center">
                            <div className="caption__header">금액</div>
                            <div className="caption__content"><span>값</span></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="popup__product__receipt">
                <div className="layer">
                    <div className="layer__container">
                        <div className="layer__column">
                            <div className="text__header upper">
                                상품명 또는 상품구매명
                            </div>
                            <div className="text__content">
                                <div className="layer__row auto__flex nth__margin__left">
                                    <div className="caption__content"><span>예약번호</span></div>
                                    <div className="text__content"><span>123123123123123123</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="layer__border">
                            <div className="layer__column">
                                <div className="layer__row padding__half">
                                    <div className="text__header">예약일</div>
                                    <div className="text__content"><span>2018년 1월 23일</span></div>
                                </div>
                                <div className="hr" />
                                <div className="layer__row padding__half">
                                    <div className="text__header">촬영일</div>
                                    <div className="text__content"><span>2018년 1월 23일</span></div>
                                </div>
                                <div className="hr" />
                                <div className="layer__row padding__half">
                                    <div className="text__header">예약자명</div>
                                    <div className="text__content"><span>예약자예약자예약자예약자</span></div>
                                </div>
                                <div className="hr" />
                                <div className="layer__row padding__half">
                                    <div className="text__header">작가명</div>
                                    <div className="text__content"><span>작가작가작가작가작2작가작가작가1가작가</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="layer__border">
                            <div className="layer__column">
                                {this.layoutPurchase()}
                            </div>
                        </div>
                        <div className="layer__border">
                            <div className="layer__column">
                                <div className="layer__row padding__half">
                                    <div className="text__header">결제방식</div>
                                    <div className="text__content"><span>값</span></div>
                                </div>
                                <div className="hr" />
                                <div className="layer__row padding__half">
                                    <div className="text__header">촬영일</div>
                                    <div className="text__content"><span>2018년 1월 23일</span></div>
                                </div>
                                <div className="hr" />
                                <div className="layer__row padding__half">
                                    <div className="text__header">예약자명</div>
                                    <div className="text__content"><span>예약자예약자예약자예약자</span></div>
                                </div>
                                <div className="hr" />
                                <div className="layer__row padding__half">
                                    <div className="text__header">작가명</div>
                                    <div className="text__content"><span>작가작가작가작가작2작가작가작가1가작가</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

PopupProductReceipt.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired
};

export default PopupProductReceipt;
