import React, { Component } from "react";
import classNames from "classnames";
import CountUp from "react-countup";
import utils from "forsnap-utils";

export default class VirtualEstimateTotalView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total_price: props.total_price,
            prev_total_price: props.prev_total_price,
            alphas: props.alphas,
            detailPage: props.detailPage,
            mainTest: props.mainTest || false,
            renewDetail: props.renewDetail,
            isAlphas: props.isAlphas,
            isMobile: utils.agent.isMobile()
        };
        this.onConsultSearchArtist = this.onConsultSearchArtist.bind(this);
        this.onConsultForsnap = this.onConsultForsnap.bind(this);
        this.gaEventFromTotalView = this.gaEventFromTotalView.bind(this);
    }

    /**
     * 작가 상담
     */
    onConsultSearchArtist() {
        this.props.onConsultSearchArtist(this.hasAlpha());
    }

    /**
     * 포스냅 직접상담
     */
    onConsultForsnap() {
        this.gaEventFromTotalView("상담먼저");
        this.props.onConsultForsnap();
    }

    /**
     * 예상견적 컴포넌트 ga이벤트
     * @param action
     */
    gaEventFromTotalView(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(action);
        }
    }

    /**
     * 알파 체크
     * @returns {boolean}
     */
    hasAlpha() {
        const { alphas, isAlphas } = this.props;
        let a = Object.keys(alphas).some(key => alphas[key]);
        if (isAlphas) {
            a = isAlphas;
        }
        return a;
    }

    gaEvent(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(action);
        }
    }

    render() {
        const { total_price, prev_total_price, detailPage, renewDetail, mainTest } = this.props;
        const { isMobile } = this.state;
        const renewDetailBtnText = isMobile ? "촬영정보를 입력해주세요." : "예상 견적 금액을 확인해보세요!";
        const renewDetailResultBtnText = isMobile ? "위의 견적으로 문의하기" : `${utils.format.price(total_price)}원으로 작가에게 문의하기`;
        return (
            <div className={detailPage ? "detailPage-totalView" : ""}>
                <div className="virtual-estimate__total" style={{ borderBottom: renewDetail && "none", marginBottom: renewDetail && 0, paddingTop: mainTest && 0 }}>
                    <p className="virtual-estimate__total__title">총 예상견적</p>
                    {!!total_price && !renewDetail && !mainTest &&
                    <div className="virtual-estimate__ext-info">
                        <span>포스냅이 스튜디오와 대량계약을 통해 할인된 가격을 제공합니다.</span>
                    </div>
                    }
                    <div className={classNames("virtual-estimate__total__price", { "renew": renewDetail && !isMobile })}>
                        {total_price ?
                            <div className="price-box" >
                                <div className="origin_price">{utils.format.price(Number(total_price * 1.3))}</div>
                                <div style={{ color: "#e02020" }}>
                                    <CountUp start={prev_total_price} end={total_price} separator="," duration={1} />
                                    {total_price ? this.hasAlpha() && <span style={{ marginLeft: 5, color: "#000" }}>+a</span> : ""}
                                </div>
                                {!renewDetail && <span className="won">원</span>}
                            </div> : ""
                        }
                        {renewDetail && <span className="won" style={{ color: "#000" }}>원</span>}
                    </div>
                </div>
                {detailPage && total_price
                    ?
                        <div className="search-text">
                            위 견적으로 촬영 가능한 작가 리스트를 검색할까요?
                        </div>
                    : ""
                }
                {detailPage &&
                <div className="virtual-estimate__consult-btn">
                    <button
                        className={classNames("consult-btn", "active_full")}
                        onClick={this.onConsultSearchArtist}
                    >
                        위의 견적으로 문의하기
                    </button>
                </div>
                }
                {renewDetail && !mainTest &&
                <div className="renew-detail__consult-btn">
                    <button
                        className={classNames("consult-btn", { "active_full": total_price })}
                        onClick={renewDetail && total_price ? this.onConsultSearchArtist : null}
                        style={{ fontSize: 14, fontWeight: "500" }}
                    >
                        {total_price ? renewDetailResultBtnText : renewDetailBtnText }
                    </button>
                </div>
                }
                {!renewDetail && mainTest &&
                <div className="renew-detail__consult-btn" style={{ height: 45 }}>
                    <button
                        className={classNames("consult-btn", { "active_full": total_price })}
                        onClick={mainTest && total_price ? this.onConsultSearchArtist : null}
                        style={{ fontSize: 14, fontWeight: "500" }}
                    >
                        {!total_price ? "촬영 정보를 선택해주세요." : "이 견적으로 촬영 가능한 작가 확인하기" }
                    </button>
                </div>
                }
            </div>
        );
    }
}

VirtualEstimateTotalView.defaultProps = {
    detailPage: false
};
