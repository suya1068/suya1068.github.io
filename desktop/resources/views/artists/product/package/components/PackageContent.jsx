import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";

import { ADDRESS_LIST } from "shared/constant/quotation.const";
import { STATE, CATEGORY_CODE } from "shared/constant/package.const";
import ProductObject from "shared/components/products/edit/ProductObject";

class PackageContent extends Component {
    constructor(props) {
        super(props);

        const addressList = ADDRESS_LIST.slice();
        addressList.splice(0, 1);

        this.state = {
            [STATE.DETAIL.key]: ProductObject.getState(STATE.DETAIL.key),
            addressList
        };

        this.onChangeElement = this.onChangeElement.bind(this);
        this.onSelectRegion = this.onSelectRegion.bind(this);

        this.changeValue = this.changeValue.bind(this);
    }

    onChangeElement(key, e) {
        const value = this.changeValue(e);

        if (value !== null) {
            this.setState(ProductObject.setDetailState(key, value));
        }
    }

    onSelectRegion(value) {
        const detail = this.state[STATE.DETAIL.key];
        const region = detail[STATE.DETAIL.REGION];
        const index = region.findIndex(r => (r === value));

        if (index !== -1) {
            region.splice(index, 1);
        } else {
            region.push(value);
        }

        this.setState(ProductObject.setDetailState(STATE.DETAIL.REGION, region));
    }

    changeValue(e, isChar) {
        const target = e.target;
        const maxLength = target.maxLength;
        let value;

        if (isChar) {
            value = utils.replaceChar(target.value);
        } else {
            value = target.value;
        }

        if (maxLength && maxLength > -1 && value.length > maxLength) {
            return null;
        }

        return value;
    }

    render() {
        const { addressList } = this.state;
        const detail = this.state[STATE.DETAIL.key];
        const code = ProductObject.getCategoryCode();
        const isBiz = ProductObject.isBiz();

        return (
            <div className="package__container">
                {!isBiz ?
                    <div className="package__border">
                        <div className="package__row">
                            <div className="padding__default">
                                <div className="package__column">
                                    <h2 className="text__header">
                                        상세 설명
                                    </h2>
                                    <div className="text__content">
                                        <textarea
                                            className="f__textarea textarea__round"
                                            placeholder="상품 설명을 입력해 주세요."
                                            maxLength="5000"
                                            rows="20"
                                            value={detail[STATE.DETAIL.CONTENT]}
                                            onChange={e => this.onChangeElement(STATE.DETAIL.CONTENT, e)}
                                        />
                                        <div className="f__textarea__length text-right">
                                            {detail[STATE.DETAIL.CONTENT].length || 0} / 5000
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="hr margin__default" />
                            <div className="padding__default">
                                <div className="package__column padding__vertical">
                                    <div className="caption__header">
                                        안내사항
                                    </div>
                                    <div className="caption__content">
                                        <span>
                                            상품에 대한 설명과 제공되는 옵션에 대해 명확하게 작성해주세요.<br />
                                            전화번호, 카카오톡 아이디, 인스타그램, 스튜디오명 등 외부연락처 노출 시 임의 삭제되며, 서비스이용에 제한을 받으실 수 있습니다.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : null
                }
                <div className="package__border">
                    <div className="package__row">
                        <div className="padding__default">
                            <div className="package__column">
                                <h2 className="text__header">
                                    태그
                                </h2>
                                <div className="text__content">
                                    <input
                                        className="f__input f__input__round"
                                        type="text"
                                        value={detail[STATE.DETAIL.TAG]}
                                        maxLength="100"
                                        placeholder="셀프웨딩, 제주도, 쇼핑몰, 프로필촬영"
                                        onChange={e => this.onChangeElement(STATE.DETAIL.TAG, e)}
                                    />
                                    <div className="f__input__length text-right">
                                        {utils.search.parse(detail[STATE.DETAIL.TAG]).length} / 10
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hr margin__default" />
                        <div className="padding__default">
                            <div className="package__column padding__vertical">
                                <div className="caption__header">
                                    태그
                                </div>
                                <div className="caption__content">
                                    <span>
                                        태그는 검색키워드로 사용되며 3개~10개까지 등록 가능합니다.<br />
                                        상품과 적합한 키워드를 등록할수록 고객 선택 확률이 높아집니다.<br />
                                        입력시 태그입력은 ,로 구분됩니다.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="package__border">
                    <div className="package__row">
                        <div className="padding__default">
                            <div className="package__column">
                                <h2 className="text__header">
                                    검색엔진 노출문구
                                </h2>
                                <div className="text__content">
                                    <input
                                        className="f__input f__input__round"
                                        type="text"
                                        maxLength="45"
                                        value={detail[STATE.DETAIL.DESCRIPTION]}
                                        placeholder="한 문장으로 작가님의 상품을 설명해주세요."
                                        onChange={e => this.onChangeElement(STATE.DETAIL.DESCRIPTION, e)}
                                    />
                                    <div className="f__input__length text-right">
                                        {detail[STATE.DETAIL.DESCRIPTION].length || 0} / 45
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hr margin__default" />
                        <div className="padding__default">
                            <div className="package__column padding__vertical">
                                <div className="caption__header">
                                    안내사항
                                </div>
                                <div className="caption__content">
                                    <span>
                                        온라인 마케팅 시 상품을 노출시키고,<br />
                                        고객의 유입률을 높이는데 사용됩니다.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {!isBiz && code !== CATEGORY_CODE.DRESS_RENT ?
                    <div className="package__border">
                        <div className="package__row">
                            <div className="padding__default">
                                <div className="package__column">
                                    <h2 className="text__header">
                                        출장가능 지역
                                    </h2>
                                    <div className="text__content">
                                        <div className="package__row button__list">
                                            {utils.isArray(addressList) ?
                                                addressList.map(a => {
                                                    const active = detail[STATE.DETAIL.REGION].find(r => (r === a.title));
                                                    return (
                                                        <button
                                                            key={`category-code-${a.title}`}
                                                            className={classNames("f__button f__button__round f__button__theme__select__pink", { active })}
                                                            value={a.title}
                                                            onClick={() => this.onSelectRegion(a.title)}
                                                        >
                                                            <span>{a.title}</span>
                                                        </button>
                                                    );
                                                })
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="hr margin__default" />
                            <div className="padding__default">
                                <div className="package__column padding__vertical">
                                    <div className="caption__header">
                                        출장가능 지역
                                    </div>
                                    <div className="caption__content">
                                        <span>
                                            출장 가능한 지역을 모두 선택해주세요.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : null
                }
            </div>
        );
    }
}

export default PackageContent;
