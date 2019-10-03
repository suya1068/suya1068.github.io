import "./virtualEstimateResult.scss";
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
            exchangeResultText: props.exchangeResultText
        };
        this.setTotalPrice = this.setTotalPrice.bind(this);
    }

    componentDidMount() {
    }

    renderText() {
        const { form, data, priceInfo, exchangeResultText } = this.props;
        // console.log(">>>>>>>>>>>>>>>>>>>:", form);
        const rowArr = Object.keys(data);

        return rowArr.map(key => {
            const stepEntity = data[key];
            const resultText = exchangeResultText(key, form, priceInfo);

            // console.log("resultTest:", resultText);

            return (
                <div className="step-row" key={`step__row__${key}`}>
                    <p className={classNames("step-row__title", { "active": data[key].ACTIVE })}>{stepEntity.NAME}</p>
                    <p className={classNames("step-row__result", { "empty-text": !data[key].ACTIVE || !resultText })}>{data[key].ACTIVE && resultText ? resultText : stepEntity.RESULT_TEXT}</p>
                </div>
            );
        });
    }

    setTotalPrice() {
        const { totalPrice, hasAlphas } = this.props;
        const _price = utils.format.price(totalPrice);

        return hasAlphas ? `${_price}+a` : _price;
    }

    render() {
        const { totalPrice } = this.props;

        return (
            <div className="virtual-estimate__result">
                <p className="virtual-estimate__result__title">견적을 확인하세요.</p>
                <div className="virtual-estimate__result__content">
                    {this.renderText()}
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
                </div>
            </div>
        );
    }
}
