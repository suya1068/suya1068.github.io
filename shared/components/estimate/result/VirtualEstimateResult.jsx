import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "forsnap-utils";

export default class VirtualEstimateResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: props.step,
            data: props.data,
            priceInfo: props.priceInfo,
            totalPrice: props.totalPrice,
            hasAlphas: props.hasAlphas,
            form: props.form,
            exchangeResultText: props.exchangeResultText,
            device_type: props.device_type,
            resultFlag: props.resultFlag,
            category: props.category
        };
        this.setTotalPrice = this.setTotalPrice.bind(this);
    }

    componentDidMount() {
    }

    renderText() {
        const { form, data, priceInfo, exchangeResultText, device_type, step, category } = this.props;
        const rowArr = Object.keys(data);

        return rowArr.map(key => {
            const stepEntity = data[key];
            const resultText = exchangeResultText(key, form, priceInfo, device_type) ? utils.linebreak(exchangeResultText(key, form, priceInfo, device_type)) : "";

            let renderFlag = false;

            if (device_type === "pc" || (device_type === "mobile" && (key === "FIRST" || data[key].ACTIVE))) {
                renderFlag = true;
            }

            if (device_type === "mobile") { // 마지막 스텝에서
                if (category === "PRODUCT" && step === "THIRD") {
                    renderFlag = true;
                } else if (category === "BEAUTY" && step === "SECOND") {
                    renderFlag = true;
                } else if (category === "FOOD" || category === "INTERIOR" || category === "PROFILE_BIZ") {
                    if ((step === "SECOND" || step === "THIRD") && step === key) {
                        renderFlag = true;
                    }
                }
            }

            return renderFlag && (
                <div className="step-row" key={`step__row__${key}`}>
                    <p className={classNames("step-row__title", { "active": data[key].ACTIVE })}>{stepEntity.NAME}</p>
                    <p className={classNames("step-row__result", { "empty-text": !data[key].ACTIVE || !resultText })}>{data[key].ACTIVE && resultText ? resultText : stepEntity.RESULT_TEXT}</p>
                </div>
            );
        });
    }


    /**
     * 총가격을 세팅한다.
     * @returns {string}
     */
    setTotalPrice() {
        const { totalPrice, hasAlphas } = this.props;
        const _price = utils.format.price(totalPrice);

        return hasAlphas ? `${_price}+a` : _price;
    }

    render() {
        const { totalPrice, device_type, step, category, data, resultFlag } = this.props;
        let text = "다음 스텝을 진행해주세요.";
        if ((category === "PRODUCT" && step === "THIRD") ||
            (category === "BEAUTY" && step === "SECOND")) {
            text = "선택하신 옵션의 견적을 확인해보세요.";
        }

        return (
            <div className="virtual-estimate__result">
                {resultFlag &&
                    <div className="forsnap-logo" style={{ width: 76, height: 22, margin: "0 auto 5px" }}>
                        <img alt="logo" src={`${__SERVER__.img}/common/f_logo_black.png`} style={{ width: "100%", height: "100%" }} />
                    </div>
                }
                <p className="virtual-estimate__result__title" style={{ fontSize: resultFlag && 17 }}>견적을 확인하세요.</p>
                <div className="virtual-estimate__result__content">
                    {this.renderText()}
                    {(device_type === "pc" || resultFlag) &&
                    <div className="step-row">
                        <p className={classNames("step-row__title", { "active": totalPrice })}>총 예상견적</p>
                        <div className={classNames("step-row__result", { "empty-text": true })}>
                            {totalPrice ?
                                <p className="price-text">
                                    <span className="pink_text">{this.setTotalPrice()}</span>
                                    <span className="normal_text">원</span>
                                </p> :
                                <p>
                                    모든 정보를 입력하면 예상견적을 보실 수 있습니다.
                                    <span className="gray-text">{"- 원"}</span>
                                </p>
                            }
                        </div>
                    </div>
                    }
                    {device_type === "mobile" && !resultFlag &&
                        <div className="step-context">
                            <p className="yellow-text">{data[step].ACTIVE === true ? text : ""}</p>
                        </div>
                    }
                    {device_type === "mobile" && resultFlag &&
                        <div className="virtual-estimate__button">
                            <button className="estimate-btn active" onClick={this.props.onInit}>다시 계산하기</button>
                            <button className={classNames("estimate-btn", "send-email", { "active": totalPrice })} onClick={this.props.onReceiveEmail}>이메일로 견적 발송</button>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

VirtualEstimateResult.propTypes = {
    resultFlag: PropTypes.bool
};

VirtualEstimateResult.defaultProps = {
    resultFlag: false
};
