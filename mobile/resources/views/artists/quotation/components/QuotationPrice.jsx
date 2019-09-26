import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";

import ResponseJS, { STATE as RES_STATE } from "shared/components/quotation/response/QuotationResponse";
import REGULAR from "shared/constant/regular.const";
import Input from "shared/components/ui/input/Input";
import Accordion from "shared/components/ui/accordion/Accordion";

class QuotationPrice extends Component {
    constructor() {
        super();

        this.state = {
            [RES_STATE.OPTION_PRICE.key]: ResponseJS.getState(RES_STATE.OPTION_PRICE.key)
        };

        this.onAddOption = this.onAddOption.bind(this);
        this.onDeleteOption = this.onDeleteOption.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
        this.setState(ResponseJS.setOptionPriceState(-1, {
            key: 0,
            [RES_STATE.OPTION_PRICE.NAME]: "촬영비용",
            [RES_STATE.OPTION_PRICE.PRICE]: "",
            [RES_STATE.OPTION_PRICE.COUNT]: "",
            [RES_STATE.OPTION_PRICE.TOTAL_PRICE]: ""
        }));
    }

    componentDidMount() {
        window.scroll(0, 0);
    }

    onAddOption() {
        const options = this.state[RES_STATE.OPTION_PRICE.key];
        const item = options[options.length - 1];

        this.setState(ResponseJS.setOptionPriceState(-1, {
            key: item ? item.key + 1 : 0,
            [RES_STATE.OPTION_PRICE.NAME]: "",
            [RES_STATE.OPTION_PRICE.PRICE]: "",
            [RES_STATE.OPTION_PRICE.COUNT]: "",
            [RES_STATE.OPTION_PRICE.TOTAL_PRICE]: ""
        }));
    }

    onDeleteOption(index) {
        this.setState(ResponseJS.deleteOptionPriceState(index));
    }

    onChange(index, obj, name, value) {
        const option = {
            ...obj,
            [name]: value
        };

        const price = option[RES_STATE.OPTION_PRICE.PRICE];
        const count = option[RES_STATE.OPTION_PRICE.COUNT];

        option[RES_STATE.OPTION_PRICE.TOTAL_PRICE] = (price * count) || "";
        this.setState(ResponseJS.setOptionPriceState(index, option));
    }

    render() {
        const options = this.state[RES_STATE.OPTION_PRICE.key];
        let totalPrice = 0;

        return (
            <div className="quotation__options">
                <div className="content__column">
                    <div className="content__column__head">
                        <h1>견적비용을 입력해주세요.</h1>
                    </div>
                    <div className="quotation__price__content">
                        <div className="price__list">
                            <div className="title">
                                <span>견적정보입력</span>
                                <button
                                    className="_button _button__default"
                                    onClick={() => { if (this.refAccordion.onToggle()) this.refAccordion.refContent.scrollIntoView(); }}
                                >예시보기</button>
                            </div>
                            <div className="list">
                                <table>
                                    <colgroup>
                                        <col width="30%" />
                                        <col width="24%" />
                                        <col width="18%" />
                                        <col width="24%" />
                                        <col />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th>항목</th>
                                            <th>단가</th>
                                            <th>단위</th>
                                            <th>금액</th>
                                            <th />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {options.map((o, i) => {
                                            totalPrice += Number(o[RES_STATE.OPTION_PRICE.TOTAL_PRICE]);
                                            const required = o[RES_STATE.OPTION_PRICE.NAME] === "촬영비용";

                                            return (
                                                <tr key={`${i}_${o.key}`}>
                                                    <td>
                                                        <Input
                                                            className=""
                                                            regular={REGULAR.INPUT.CHARACTER1}
                                                            name={RES_STATE.OPTION_PRICE.NAME}
                                                            value={o[RES_STATE.OPTION_PRICE.NAME]}
                                                            max="20"
                                                            readOnly={required && i === 0}
                                                            disabled={required && i === 0}
                                                            onChange={(e, n, v) => this.onChange(i, o, n, v)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Input
                                                            className=""
                                                            type="text"
                                                            regular={REGULAR.INPUT.NUMBER_MINUS}
                                                            name={RES_STATE.OPTION_PRICE.PRICE}
                                                            value={o[RES_STATE.OPTION_PRICE.PRICE]}
                                                            max="16"
                                                            onChange={(e, n, v) => this.onChange(i, o, n, v)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Input
                                                            className=""
                                                            type="text"
                                                            regular={REGULAR.INPUT.NUMBER}
                                                            name={RES_STATE.OPTION_PRICE.COUNT}
                                                            value={o[RES_STATE.OPTION_PRICE.COUNT]}
                                                            max="5"
                                                            onChange={(e, n, v) => this.onChange(i, o, n, v)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Input
                                                            className=""
                                                            type="text"
                                                            regular={REGULAR.INPUT.NUMBER}
                                                            name={RES_STATE.OPTION_PRICE.TOTAL_PRICE}
                                                            value={o[RES_STATE.OPTION_PRICE.TOTAL_PRICE]}
                                                            max="20"
                                                            onChange={(e, n, v) => this.onChange(i, o, n, v)}
                                                        />
                                                    </td>
                                                    <td>{i > 0 ? <button className="_button _button__close" onClick={() => this.onDeleteOption(i)} /> : null}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td>총합</td>
                                            <td className="total__price" colSpan="4">{utils.format.price(totalPrice)}원</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        <div className="price__add">
                            <button className="_button _button__fill__yellow" onClick={this.onAddOption}>항목추가하기</button>
                        </div>
                        <Accordion ref={ref => (this.refAccordion = ref)}>
                            <div />
                            <div className="price__list">
                                <div className="title">
                                    <span>견적정보예시</span>
                                    <button className="_button _button__close" onClick={() => this.refAccordion.hide()} />
                                </div>
                                <div className="list">
                                    <table>
                                        <colgroup>
                                            <col width="30%" />
                                            <col width="25%" />
                                            <col width="20%" />
                                            <col width="25%" />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>항목</th>
                                                <th>단가</th>
                                                <th>단위</th>
                                                <th>금액</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>연출컷 촬영</td>
                                                <td>50,000원</td>
                                                <td>20</td>
                                                <td>1,000,000원</td>
                                            </tr>
                                            <tr>
                                                <td>누끼컷</td>
                                                <td>10,000원</td>
                                                <td>10</td>
                                                <td>100,000원</td>
                                            </tr>
                                            <tr>
                                                <td>출장비</td>
                                                <td>100,000원</td>
                                                <td>1</td>
                                                <td>100,000원</td>
                                            </tr>
                                            <tr>
                                                <td>부가세</td>
                                                <td>120,000원</td>
                                                <td>1</td>
                                                <td>120,000원</td>
                                            </tr>
                                            <tr>
                                                <td>선 예약 할인</td>
                                                <td>-120,000원</td>
                                                <td>1</td>
                                                <td>-120,000원</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td>총합</td>
                                                <td className="total__price" colSpan="3">1,200,000원</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </Accordion>
                    </div>
                </div>
            </div>
        );
    }
}
export default QuotationPrice;
