import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import { CATEGORY_CODE, EXTRA_OPTION, STATE } from "shared/constant/package.const";
import ProductObject from "shared/components/products/edit/ProductObject";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import Dropdown from "desktop/resources/components/form/Dropdown";

class PackageOption extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isExcept: ProductObject.isExcept(),
            [STATE.OPTION.key]: ProductObject.getState(STATE.OPTION.key)
        };

        this.onChangePackageValue = this.onChangePackageValue.bind(this);
        this.onChangePackageElement = this.onChangePackageElement.bind(this);
        this.onChangePackagePrice = this.onChangePackagePrice.bind(this);
        this.onChangeExtraPrice = this.onChangeExtraPrice.bind(this);
        this.onChangeCustomElement = this.onChangeCustomElement.bind(this);
        this.onChangeCustomPrice = this.onChangeCustomPrice.bind(this);

        this.initPackage = this.initPackage.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.changePrice = this.changePrice.bind(this);
        this.addCustom = this.addCustom.bind(this);
        this.removeCustom = this.removeCustom.bind(this);
    }

    componentWillMount() {
        const timeList = [];
        for (let i = 30; i <= 230; i += 30) {
            timeList.push({
                name: `${i}분`,
                value: i
            });
        }

        timeList.push({
            name: "300분 이상",
            value: "MAX"
        });

        this.state.timeList = timeList;
    }

    onChangePackageValue(index, key, value) {
        this.setState(ProductObject.setOptionPackage(index, key, value));
    }

    onChangePackageElement(index, key, e) {
        const isChar = [STATE.OPTION.PACKAGE.TITLE].indexOf(key) !== -1;
        const origin = this.state[STATE.OPTION.key][STATE.OPTION.PACKAGE.key][index][key];
        const value = this.changeValue(e, isChar, origin ? origin.length : 0);

        if (value !== null) {
            this.setState(ProductObject.setOptionPackage(index, key, value));
        }
    }

    onChangePackagePrice(index, key, e) {
        const target = e.target;
        const value = this.changePrice(e);

        if (value !== null) {
            this.setState(ProductObject.setOptionPackage(index, key, value), () => {
                setTimeout(() => {
                    const length = target.value.length;
                    target.setSelectionRange(length, length);
                }, 0);
            });
        }
    }

    onChangeExtraPrice(key, e) {
        const target = e.target;
        const value = this.changePrice(e);

        if (value !== null) {
            this.setState(ProductObject.setOptionExtraPrice(key, value), () => {
                setTimeout(() => {
                    const length = target.value.length;
                    target.setSelectionRange(length, length);
                }, 0);
            });
        }
    }

    onChangeCustomElement(index, key, e) {
        const isChar = [STATE.OPTION.CUSTOM_OPTION.TITLE].indexOf(key) !== -1;
        const origin = this.state[STATE.OPTION.key][STATE.OPTION.CUSTOM_OPTION.key][index][key] || "";
        const value = this.changeValue(e, isChar, origin.length);

        if (value !== null) {
            this.setState(ProductObject.setOptionCustom(index, key, value));
        }
    }

    onChangeCustomPrice(index, key, e) {
        const target = e.target;
        const value = this.changePrice(e);

        if (value !== null) {
            this.setState(ProductObject.setOptionCustom(index, key, value), () => {
                setTimeout(() => {
                    const length = target.value.length;
                    target.setSelectionRange(length, length);
                }, 0);
            });
        }
    }

    initPackage(index) {
        const option = this.state[STATE.OPTION.key];
        const pkg = option[STATE.OPTION.PACKAGE.key].reduce((r, p, i) => {
            if (index !== i) r.push(p);
            return r;
        }, []);
        this.setState(ProductObject.setOptionState(STATE.OPTION.PACKAGE.key, ProductObject.initPackage(pkg)));
    }

    changeValue(e, isChar, length) {
        const target = e.target;
        const maxLength = target.maxLength;
        let value;

        if (isChar) {
            value = utils.replaceChar(target.value);
        } else {
            value = target.value;
        }

        if (maxLength && maxLength > -1 && value.length > maxLength && value.length > length) {
            return null;
        }

        return value;
    }

    changePrice(e) {
        const target = e.target;
        let value = target.value;

        const maxLength = target.maxLength;
        value = value.replace(/[,\D]+/g, "");

        if (maxLength && maxLength > -1 && value.length > maxLength) {
            return null;
        }

        return value && !isNaN(value) ? parseInt(value, 10) : "";
    }

    addCustom() {
        const option = this.state[STATE.OPTION.key];
        const length = option[STATE.OPTION.CUSTOM_OPTION.key].length;
        if (length < ProductObject.getState("customLimit")) {
            this.setState(ProductObject.setOptionCustom(length, STATE.OPTION.CUSTOM_OPTION.TITLE, ""));
        } else {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: `맞춤옵션은 ${length}개까지 등록이 가능합니다.`
            });
        }
    }

    removeCustom(index) {
        this.setState(ProductObject.delOptionCustom(index));
    }

    render() {
        const { timeList, isExcept } = this.state;
        const option = this.state[STATE.OPTION.key];
        const keyPkg = STATE.OPTION.PACKAGE;
        const keyEx = STATE.OPTION.EXTRA_OPTION;
        const keyCu = STATE.OPTION.CUSTOM_OPTION;
        const category = ProductObject.getCategory();

        const optionExtra = category.extra.reduce((r, ex) => {
            const exConst = EXTRA_OPTION.find(exo => exo.code === ex);
            const exData = option[keyEx.key].find(exd => exd.code === ex);
            if (!exConst || !exData) return r;

            r.push(
                <div key={`extra-option-${ex}`} className="package__row">
                    <div className="padding__default">
                        <div className="package__column">
                            <h2 className="text__header">
                                {exConst.title}
                            </h2>
                            <div className="text__content">
                                <input
                                    className="f__input f__input__round"
                                    type="text"
                                    placeholder={exConst.placeholder}
                                    maxLength="11"
                                    value={utils.format.price(exData.price)}
                                    onChange={e => this.onChangeExtraPrice(ex, e)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="hr margin__default" />
                    <div className="padding__default">
                        <div className="package__column padding__vertical">
                            <div className="caption__header">
                                {ex.title}
                            </div>
                            <div className="caption__content">
                                <span>
                                    {utils.linebreak(exConst.content)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            );

            return r;
        }, []);

        return (
            <div className="package__container">
                <div className="package__column">
                    {/*<div className="package__row auto__flex justify__end nth__margin__small__left">*/}
                    {/*<button className="f__button f__button__small" onClick={this.popCalculate}>예상정산금액</button>*/}
                    {/*</div>*/}
                    <div className="package__row nth__margin__small__left">
                        {utils.isArray(option[STATE.OPTION.PACKAGE.key]) ?
                            option[STATE.OPTION.PACKAGE.key].map((o, i) => {
                                const index = i + 1;
                                const optionContent = [
                                    <div key="package-title" className="package__column">
                                        <div className="text__header">
                                            패키지명<span>(5 ~ 10)</span>
                                            <div className="tool__tip">
                                                !
                                                <div className="tool__tip__content">
                                                    <span className="tool__tip__arrow" />
                                                    패키지는 최대 3개까지 등록가능합니다.
                                                </div>
                                            </div>
                                        </div>
                                        <div key="pkg-title-content" className="text__content">
                                            <input
                                                className="f__input f__input__round"
                                                type="text"
                                                maxLength="10"
                                                value={o[keyPkg.TITLE]}
                                                placeholder="패키지명을 입력해주세요."
                                                onChange={e => this.onChangePackageElement(i, keyPkg.TITLE, e)}
                                            />
                                            <div className="f__input__length text-right">
                                                {o[keyPkg.TITLE].length || 0} / 10
                                            </div>
                                        </div>
                                        <div className="hr transparent margin__vertical__half" />
                                    </div>,
                                    <div key="package-content" className="package__column">
                                        <div className="text__header">
                                            패키지설명
                                            <div className="tool__tip">
                                                !
                                                <div className="tool__tip__content">
                                                    <span className="tool__tip__arrow" />
                                                    패키지 금액에 제공가능한 서비스를 작성해주세요.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text__content">
                                            <textarea
                                                className="f__textarea textarea__round"
                                                placeholder="패키지 설명을 입력해주세요."
                                                maxLength="200"
                                                rows="10"
                                                value={o[keyPkg.CONTENT]}
                                                onChange={e => this.onChangePackageElement(i, keyPkg.CONTENT, e)}
                                            />
                                            <div className="f__textarea__length text-right">
                                                {o[keyPkg.CONTENT].length || 0} / 200
                                            </div>
                                        </div>
                                        <div className="hr transparent margin__vertical__half" />
                                    </div>
                                ];

                                category.package.reduce((r, p) => {
                                    switch (p.code) {
                                        case keyPkg.PRICE:
                                            r.push(
                                                <div key="package-price" className="package__column">
                                                    <div className="text__header">
                                                        {p.title}
                                                        {p.tooltip &&
                                                        <div className="tool__tip">
                                                            !
                                                            <div className="tool__tip__content">
                                                                <span className="tool__tip__arrow" />
                                                                {p.tooltip}
                                                            </div>
                                                        </div>
                                                        }
                                                    </div>
                                                    <div className="text__content">
                                                        <input
                                                            className="f__input f__input__round"
                                                            type="text"
                                                            placeholder={p.placeholder}
                                                            maxLength="11"
                                                            value={utils.format.price(o[p.code])}
                                                            onChange={e => this.onChangePackagePrice(i, p.code, e)}
                                                        />
                                                    </div>
                                                    <div className="hr transparent margin__vertical__half" />
                                                </div>
                                            );
                                            break;
                                        case keyPkg.MIN_PRICE:
                                            r.push(
                                                <div key="package-min-price" className="package__column">
                                                    <div className="text__header">
                                                        {p.title}
                                                        {p.tooltip &&
                                                        <div className="tool__tip">
                                                            !
                                                            <div className="tool__tip__content">
                                                                <span className="tool__tip__arrow" />
                                                                {p.tooltip}
                                                            </div>
                                                        </div>
                                                        }
                                                    </div>
                                                    <div className="text__content">
                                                        <input
                                                            className="f__input f__input__round"
                                                            type="text"
                                                            placeholder={p.placeholder}
                                                            maxLength="11"
                                                            value={utils.format.price(o[keyPkg.MIN_PRICE])}
                                                            onChange={e => this.onChangePackagePrice(i, keyPkg.MIN_PRICE, e)}
                                                        />
                                                    </div>
                                                    <div className="hr transparent margin__vertical__half" />
                                                </div>
                                            );
                                            break;
                                        case keyPkg.PHOTO_TIME: {
                                            let tList;

                                            if (o[keyPkg.PHOTO_TIME]) {
                                                tList = [].concat(timeList);
                                            } else {
                                                tList = [{ name: "선택해주세요", value: "" }].concat(timeList);
                                            }

                                            r.push(
                                                <div key="package-time" className="package__column">
                                                    <div className="text__header">
                                                        {p.title}
                                                        {p.tooltip &&
                                                        <div className="tool__tip">
                                                            !
                                                            <div className="tool__tip__content">
                                                                <span className="tool__tip__arrow" />
                                                                {p.tooltip}
                                                            </div>
                                                        </div>
                                                        }
                                                    </div>
                                                    <div className="text__content">
                                                        <Dropdown list={tList} select={o[keyPkg.PHOTO_TIME]} size="small" width="block" resultFunc={value => this.onChangePackageValue(i, keyPkg.PHOTO_TIME, value)} />
                                                    </div>
                                                    <div className="hr transparent margin__vertical__half" />
                                                </div>
                                            );
                                            break;
                                        }
                                        case keyPkg.PHOTO_CNT:
                                            r.push(
                                                <div key="package-photo" className="package__column">
                                                    <div className="text__header">
                                                        {p.title}
                                                        {p.tooltip &&
                                                        <div className="tool__tip">
                                                            !
                                                            <div className="tool__tip__content">
                                                                <span className="tool__tip__arrow" />
                                                                {p.tooltip}
                                                            </div>
                                                        </div>
                                                        }
                                                    </div>
                                                    <div className="text__content">
                                                        <input
                                                            className="f__input f__input__round"
                                                            type="text"
                                                            placeholder={p.placeholder}
                                                            maxLength="5"
                                                            value={utils.format.price(o[keyPkg.PHOTO_CNT])}
                                                            onChange={e => this.onChangePackagePrice(i, keyPkg.PHOTO_CNT, e)}
                                                        />
                                                    </div>
                                                    <div className="hr transparent margin__vertical__half" />
                                                </div>
                                            );
                                            break;
                                        case keyPkg.CUSTOM_CNT:
                                            r.push(
                                                <div key="package-custom" className="package__column">
                                                    <div className="text__header">
                                                        {p.title}
                                                        {p.tooltip &&
                                                        <div className="tool__tip">
                                                            !
                                                            <div className="tool__tip__content">
                                                                <span className="tool__tip__arrow" />
                                                                {p.tooltip}
                                                            </div>
                                                        </div>
                                                        }
                                                    </div>
                                                    <div className="text__content">
                                                        <input
                                                            className="f__input f__input__round"
                                                            type="text"
                                                            placeholder={p.placeholder}
                                                            maxLength="5"
                                                            value={utils.format.price(o[keyPkg.CUSTOM_CNT])}
                                                            onChange={e => this.onChangePackagePrice(i, keyPkg.CUSTOM_CNT, e)}
                                                        />
                                                    </div>
                                                    <div className="hr transparent margin__vertical__half" />
                                                </div>
                                            );
                                            break;
                                        case keyPkg.PERIOD:
                                            r.push(
                                                <div key="package-complete" className="package__column">
                                                    <div className="text__header">
                                                        {p.title}
                                                    </div>
                                                    <div className="text__content">
                                                        <input
                                                            className="f__input f__input__round"
                                                            type="text"
                                                            placeholder={p.placeholder}
                                                            maxLength={category.code === CATEGORY_CODE.DRESS_RENT ? "3" : "2"}
                                                            value={o[p.code]}
                                                            onChange={e => this.onChangePackagePrice(i, p.code, e)}
                                                        />
                                                    </div>
                                                    <div className="hr transparent margin__vertical__half" />
                                                </div>
                                            );
                                            break;
                                        case keyPkg.SIZE:
                                            r.push(
                                                <div key="package-size" className="package__column">
                                                    <div className="text__header">
                                                        {p.title}
                                                        {p.tooltip &&
                                                        <div className="tool__tip">
                                                            !
                                                            <div className="tool__tip__content">
                                                                <span className="tool__tip__arrow" />
                                                                {p.tooltip}
                                                            </div>
                                                        </div>
                                                        }
                                                    </div>
                                                    <div className="text__content">
                                                        <input
                                                            className="f__input f__input__round"
                                                            type="text"
                                                            placeholder={p.placeholder}
                                                            maxLength="10"
                                                            value={o[p.code]}
                                                            onChange={e => this.onChangePackageElement(i, p.code, e)}
                                                        />
                                                    </div>
                                                    <div className="hr transparent margin__vertical__half" />
                                                </div>
                                            );
                                            break;
                                        case keyPkg.RUNNING_TIME:
                                            r.push(
                                                <div key="package-size" className="package__column">
                                                    <div className="text__header">
                                                        {p.title}
                                                        {p.tooltip &&
                                                        <div className="tool__tip">
                                                            !
                                                            <div className="tool__tip__content">
                                                                <span className="tool__tip__arrow" />
                                                                {p.tooltip}
                                                            </div>
                                                        </div>
                                                        }
                                                    </div>
                                                    <div className="text__content">
                                                        <input
                                                            className="f__input f__input__round"
                                                            type="text"
                                                            placeholder={p.placeholder}
                                                            maxLength="4"
                                                            value={o[p.code]}
                                                            onChange={e => this.onChangePackagePrice(i, p.code, e)}
                                                        />
                                                    </div>
                                                    <div className="hr transparent margin__vertical__half" />
                                                </div>
                                            );
                                            break;
                                        default:
                                            break;
                                    }

                                    return r;
                                }, optionContent);

                                return (
                                    <div key={`package-option-${index}`} className="package__column">
                                        <h2 className="text__header upper">
                                            <span>패키지 {index}</span>
                                            <button className="f__button f__button__tiny" onClick={() => this.initPackage(i)}>초기화</button>
                                        </h2>
                                        <div className="text__content">
                                            <div className="package__border">
                                                <div className="package__column">
                                                    <div className="padding__default">
                                                        {optionContent}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : null
                        }
                    </div>
                </div>
                <div className="package__column">
                    <h2 className="text__header upper">
                        추가옵션 (선택사항)
                    </h2>
                    <div className="text__content">
                        <div className="package__border">
                            {utils.isArray(optionExtra) ?
                                <div>
                                    {optionExtra}
                                </div> : null
                            }
                            {utils.isArray(option[keyCu.key]) ?
                                <div className="padding__vertical">
                                    <div className="package__column">
                                        {option[keyCu.key].map((c, i) => {
                                            return [
                                                <div key={`package-option-custom-${c.key}-hr`} className="hr" />,
                                                <div key={`package-option-custom-${c.key}`} className="package__column padding__vertical">
                                                    <div className="package__row padding__vertical__half">
                                                        <div className="padding__horizontal">
                                                            <div className="package__column">
                                                                <h2 className="text__header">
                                                                    옵션명
                                                                </h2>
                                                                <div className="text__content">
                                                                    <input
                                                                        className="f__input f__input__round"
                                                                        type="text"
                                                                        maxLength="10"
                                                                        value={c[keyCu.TITLE]}
                                                                        placeholder="옵션명을 입력해주세요."
                                                                        onChange={e => this.onChangeCustomElement(i, keyCu.TITLE, e)}
                                                                    />
                                                                    <div className="f__input__length text-right">
                                                                        {c[keyCu.TITLE].length || 0} / 10
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="hr margin__default" />
                                                        <div className="padding__horizontal">
                                                            <div className="package__column padding__vertical">
                                                                <div className="caption__header">
                                                                    옵션
                                                                </div>
                                                                <div className="caption__content">
                                                                    <span>
                                                                        추가 옵션을 제공하는 경우 해당 옵션을 선택해 주세요.
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="package__row padding__vertical__half">
                                                        <div className="padding__horizontal">
                                                            <div className="package__column">
                                                                <h2 className="text__header">
                                                                    옵션설명
                                                                </h2>
                                                                <div className="text__content">
                                                                    <textarea
                                                                        className="f__textarea textarea__round"
                                                                        placeholder="맞춤옵션 설명을 입력해주세요."
                                                                        maxLength="100"
                                                                        rows="3"
                                                                        value={c[keyCu.CONTENT]}
                                                                        onChange={e => this.onChangeCustomElement(i, keyCu.CONTENT, e)}
                                                                    />
                                                                    <div className="f__textarea__length text-right">
                                                                        {c[keyCu.CONTENT].length || 0} / 100
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="hr margin__default" />
                                                        <div className="padding__horizontal">
                                                            <div className="package__column padding__vertical">
                                                                <div className="caption__header">
                                                                    옵션설명
                                                                </div>
                                                                <div className="caption__content">
                                                                    <span>
                                                                        옵션에 제공가능한 서비스를 작성해주세요.
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="package__row padding__vertical__half">
                                                        <div className="padding__horizontal">
                                                            <div className="package__column">
                                                                <h2 className="text__header">
                                                                    금액
                                                                </h2>
                                                                <div className="text__content">
                                                                    <input
                                                                        className="f__input f__input__round"
                                                                        type="text"
                                                                        placeholder="1단위당 추가 금액 (≥ 1,000)"
                                                                        maxLength="11"
                                                                        value={utils.format.price(c[keyCu.PRICE])}
                                                                        onChange={e => this.onChangeCustomPrice(i, keyCu.PRICE, e)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="hr margin__default" />
                                                        <div className="padding__horizontal">
                                                            <div className="package__column padding__vertical">
                                                                <div className="caption__header">
                                                                    옵션 금액
                                                                </div>
                                                                <div className="caption__content">
                                                                    <span>
                                                                        해당 옵션의 1단위당 추가 금액을 입력해주세요.
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="package__row padding__horizontal auto__flex justify__end">
                                                        <button className="f__button" onClick={() => this.removeCustom(i)}>삭제하기</button>
                                                    </div>
                                                </div>
                                            ];
                                        })}
                                    </div>
                                </div> : null
                            }
                            <div className="package__row padding__half">
                                <button className="f__button f__button__round" onClick={this.addCustom}>+ 맞춤옵션 추가하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PackageOption;
