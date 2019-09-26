import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import RequestJS, { STATE } from "shared/components/quotation/request/QuotationRequest";

class QuotationOptions extends Component {
    constructor() {
        super();

        const reserve = RequestJS.getState(STATE.RESERVE.key);
        let category;
        const categoryList = RequestJS.getState(STATE.CATEGORY_CODES);

        if (categoryList && Array.isArray(categoryList) && categoryList.length > 0) {
            category = categoryList.find(obj => {
                const value = reserve[STATE.RESERVE.CATEGORY];
                if (value) {
                    return obj.code === value.toUpperCase();
                }

                return false;
            });
        }

        this.state = {
            category,
            [STATE.OPTIONS.key]: RequestJS.getState(STATE.OPTIONS.key)
        };

        this.onChangeQty = this.onChangeQty.bind(this);
        this.onQty = this.onQty.bind(this);
        this.onSwitch = this.onSwitch.bind(this);
        this.onFocus = this.onFocus.bind(this);

        this.makeQtyOption = this.makeQtyOption.bind(this);
        this.makeSwitchOption = this.makeSwitchOption.bind(this);
    }

    componentWillMount() {
        const { category } = this.state;

        if (category) {
            this.state[STATE.ACCEPT_OPTIONS] = RequestJS.getState(STATE.ACCEPT_OPTIONS)[category.code];
        }
    }

    componentDidMount() {
        window.scroll(0, 0);
    }

    /**
     * 컷수 직접 입력
     * @param key
     * @param value
     */
    onChangeQty(key, value) {
        let number = value.replace(/,/g, "").replace(/\D/g, "") * 1;

        if (number > 9999) {
            number = 9999;
        } else if (number < 1) {
            number = "NA";
        }

        this.setState(RequestJS.setOptionState(key, number));
    }

    /**
     * 컷수 버튼 입력
     * @param b
     * @param key
     * @param value
     */
    onQty(b, key, value = 0) {
        let qty = value;

        if (b) {
            if (isNaN(value)) {
                qty = 1;
            } else if (value < 9999) {
                qty += 1;
            } else {
                qty = 9999;
            }
        } else if (value > 1) {
            qty -= 1;
        } else {
            qty = "NA";
        }

        this.setState(RequestJS.setOptionState(key, qty));
    }

    /**
     * 필요해요/괜찮아요 변경
     * @param b
     * @param key
     */
    onSwitch(b, key, sub) {
        let value;
        if (b) {
            if (sub) {
                value = "NA";
            } else {
                value = "Y";
            }
        } else {
            value = "N";
        }

        this.setState(RequestJS.setOptionState(key, value));
    }

    onFocus(e, key) {
        // const target = e.target;
        // setTimeout(() => {
        //     target.scrollIntoView();
        //     setTimeout(() => {
        //         window.scrollTo(0, 0);
        //     }, 0);
        // }, 500);
    }

    makeQtyOption(title, data, key) {
        const isUndefined = data === null || data === "NA";

        return (
            <div key={`quotation-options-${key}`} className={classNames("column__box inline__box option__switch")}>
                <div className="column__row">
                    <div className="row__title">
                        <span>{title}</span>
                    </div>
                    <div className="row__content direction__row">
                        <div className="quotation__qty">
                            <button className="qty__button" onClick={() => this.onQty(false, key, data)}><span>-</span></button>
                            <div className="qty__text">
                                <input
                                    type={isUndefined ? "text" : "tel"}
                                    value={isUndefined ? "미정" : data}
                                    onFocus={e => this.onFocus(e, key)}
                                    onChange={e => this.onChangeQty(key, e.target.value)}
                                />
                            </div>
                            <button className="qty__button" onClick={() => this.onQty(true, key, data)}><span>+</span></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    makeSwitchOption(title, subtitle, data, key) {
        const isNeed = data !== null && (data > 0 || data === "NA" || data === "Y");
        const isUndefined = data === "NA";
        const value = data === null ? "" : data;

        return (
            <div key={`quotation-options-${key}`} className={classNames("column__box inline__box option__switch", isNeed ? "option__show" : "")}>
                <div className="column__row">
                    <div className="row__title">
                        <span>{title}</span>
                    </div>
                    <div className="row__content direction__row">
                        <button className={classNames("button", "need", isNeed ? "active" : "")} onClick={() => { if (!isNeed) { this.onSwitch(true, key, subtitle); } }}>필요해요</button>
                        <button className={classNames("button", data === "N" ? "active" : "")} onClick={() => { this.onSwitch(false, key, subtitle); }}>필요없어요</button>
                    </div>
                </div>
                {subtitle ?
                    <div className="column__row hr" />
                    : null}
                {subtitle ?
                    <div className="column__row">
                        <div className="row__title">
                            <span>{subtitle}</span>
                        </div>
                        <div className="row__content direction__row">
                            <div className="quotation__qty">
                                <button className="qty__button" onClick={() => this.onQty(false, key, data)}><span>-</span></button>
                                <div className="qty__text">
                                    <input
                                        type={isUndefined ? "text" : "tel"}
                                        value={isUndefined ? "미정" : value}
                                        onFocus={e => this.onFocus(e, key)}
                                        onChange={e => this.onChangeQty(key, e.target.value)}
                                    />
                                </div>
                                <button className="qty__button" onClick={() => this.onQty(true, key, data)}><span>+</span></button>
                            </div>
                        </div>
                    </div>
                    : null}
            </div>
        );
    }

    render() {
        const { category } = this.state;
        const acceptOptions = this.state[STATE.ACCEPT_OPTIONS];
        const options = this.state[STATE.OPTIONS.key];

        if (!category) {
            return null;
        }

        return (
            <div className="quotation__quantity">
                <div className="content__column">
                    <div className="content__column__head">
                        <h1>{category ? category.name || "" : ""} 촬영의 세부사항을 선택해주세요.</h1>
                    </div>
                    <div className="content__column__body">
                        {acceptOptions ?
                            acceptOptions.map(op => {
                                const key = op.key;
                                if (op.subtitle !== undefined) {
                                    return this.makeSwitchOption(op.title, op.subtitle, options[key], key);
                                }

                                return this.makeQtyOption(op.title, options[key], key);
                            }) : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default QuotationOptions;
