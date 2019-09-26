import React, { Component } from "react";
import classNames from "classnames";
import utils from "forsnap-utils";
import CountUp from "react-countup";

export default class VirtualEstimateTotalView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total_price: props.total_price,
            prev_total_price: props.prev_total_price,
            alphas: props.alphas,
            detailPage: props.detailPage,
            mainTest: props.mainTest,
            isAlphas: props.isAlphas
        };
        this.onConsultSearchArtist = this.onConsultSearchArtist.bind(this);
        this.onConsultForsnap = this.onConsultForsnap.bind(this);
        this.gaEventFromTotalView = this.gaEventFromTotalView.bind(this);
    }

    /**
     * 작가 상담
     */
    onConsultSearchArtist() {
        const { onConsultSearchArtist } = this.props;
        if (typeof onConsultSearchArtist === "function") {
            onConsultSearchArtist(this.hasAlpha());
        }
    }

    /**
     * 포스냅 직접상담
     */
    onConsultForsnap() {
        const { onConsultForsnap } = this.props;
        this.gaEventFromTotalView("상담먼저");

        if (typeof onConsultForsnap === "function") {
            onConsultForsnap(this.hasAlpha());
        }
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

    render() {
        const { total_price, prev_total_price, detailPage, mainTest } = this.props;

        return (
            <div style={{ marginTop: 50 }}>
                <div className="virtual-estimate__total">
                    <div className="virtual-estimate__ext-info" style={{ textAlign: "right", top: "-15px" }}>
                        {!!total_price && !mainTest &&
                        <p>대량계약을 통해 할인된 가격을 제공합니다.</p>
                        }
                    </div>
                    <p className="virtual-estimate__total__title">총 예상견적</p>
                    <div className="virtual-estimate__total__price">
                        {total_price
                            ?
                                <div className="price-box" >
                                    <div className="origin_price">{utils.format.price(Number(total_price * 1.3))}</div>
                                    <div style={{ color: "#ef0320" }}>
                                        <CountUp start={prev_total_price} end={total_price} separator="," duration={1} />
                                    </div>
                                </div>
                            : ""
                        }
                        {total_price ? this.hasAlpha() && <span style={{ marginLeft: 5 }}>+a</span> : ""}
                        <span className="won">원</span>
                    </div>
                </div>
                {detailPage && !mainTest && total_price &&
                <div className="virtual-estimate__search__text">
                    <p>위 견적으로 촬영가능한 작가리스트를 검색할까요?</p>
                </div>
                }
                {detailPage && !mainTest &&
                    <div className={classNames("virtual-estimate__consult-btn", { "active": total_price }, { "detail-page": detailPage })}>
                        <button className={classNames("consult-btn", "active_full", "detailPage")} style={{ width: 300 }} onClick={this.onConsultSearchArtist}>
                            위 견적으로 문의하기
                        </button>
                    </div>
                }
                {!detailPage && mainTest &&
                    <div className={classNames("virtual-estimate__consult-btn", "main-test")}>
                        <button className={classNames("consult-btn", "main-test", { "active_full": total_price })} style={{ width: 360 }} onClick={total_price ? this.onConsultSearchArtist : null}>
                            {total_price ? "이 견적으로 촬영 가능한 작가 확인하기" : "촬영 정보를 선택해주세요"}
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
