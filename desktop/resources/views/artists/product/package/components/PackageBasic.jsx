import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";

import { BIZ_CATEGORY, PERSONAL_CATEGORY } from "shared/constant/product.const";
import { STATE } from "shared/constant/package.const";
import ProductObject from "shared/components/products/edit/ProductObject";

import Checkbox from "desktop/resources/components/form/Checkbox";

class PackageBasic extends Component {
    constructor(props) {
        super(props);

        this.state = {
            [STATE.BASIC.key]: ProductObject.getState(STATE.BASIC.key),
            categoryList: ProductObject.getState(STATE.CATEGORY_CODES)
        };

        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onSelectCategory = this.onSelectCategory.bind(this);
    }

    onChangeTitle(e) {
        const target = e.currentTarget;
        const value = utils.replaceChar(target.value);

        this.setState(ProductObject.setBasicState(STATE.BASIC.TITLE, value));
    }

    onSelectCategory(code) {
        this.setState(ProductObject.setBasicState(STATE.BASIC.CATEGORY, code));
    }

    render() {
        const basic = this.state[STATE.BASIC.key];
        const productNo = ProductObject.getState(STATE.PRODUCT_NO);
        const { categoryList } = this.state;

        return (
            <div className="package__container">
                {!productNo ?
                    <div className="package__border">
                        <div className="padding__default">
                            <div className="package__column">
                                <div className="caption__header">서비스 이용 준수사항</div>
                                <div className="caption__content">
                                    <span>
                                        작가상품 등록 시 판매가격은 부가가치세 수수료 포함가격으로 입력하세요.<br />
                                        등록된 사진은 포스냅 SNS에 광고용으로 게시될 수 있습니다.<br />
                                        상품등록 시 스튜디오명, 연락처, 이메일 노출하여 직거래를 유도할 경우 서비스 이용에 즉각 제재를 받을 수 있습니다.<br />
                                        저작권으로 인한 분쟁이 발생할 경우 모든 민,형사상 책임을 게시자가 부담합니다.
                                    </span>
                                </div>
                                <div className="caption__content padding__vertical text-center">
                                    <Checkbox type="yellow_circle" checked={basic[STATE.BASIC.AGREE] === "Y"} resultFunc={b => this.setState(ProductObject.setBasicState(STATE.BASIC.AGREE, b ? "Y" : "N"))}>동의합니다.</Checkbox>
                                    <span>
                                        <a className="title sub" id="terms_of_obedience" href="/policy/term" rel="noopener noreferrer" target="_blank">(포스냅 서비스 이용약관 전문 보기)</a>
                                    </span>
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
                                    상품명
                                </h2>
                                <div className="text__content">
                                    <input className="f__input f__input__round" type="text" value={basic[STATE.BASIC.TITLE]} placeholder="인생사진 하나쯤은 있어야죠?" onChange={this.onChangeTitle} />
                                    <div className="f__input__length text-right">
                                        {basic[STATE.BASIC.TITLE].length || 0} / 25
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hr margin__default" />
                        <div className="padding__default">
                            <div className="package__column padding__vertical">
                                <div className="caption__header">
                                    상품명
                                </div>
                                <div className="caption__content">
                                    <span>
                                        최대 25자까지 입력가능합니다.<br />
                                        모바일에서 최적화 된 제목은 15자입니다.<br />
                                        한글, 영문, 숫자, 특수문자 ( ) , + -만 입력가능합니다.
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
                                <div className="package__column">
                                    <h2 className="text__header">카테고리</h2>
                                </div>
                                <div className="package__column">
                                    <div className="caption__header">기업</div>
                                    <div className="text__content">
                                        <div className="package__row button__list">
                                            {utils.isArray(categoryList) ?
                                                categoryList.map(c => {
                                                    if (BIZ_CATEGORY.find(o => o.toUpperCase() === c.code.toUpperCase())) {
                                                        const active = c.code === basic[STATE.BASIC.CATEGORY];
                                                        return (
                                                            <button
                                                                key={`category-code-${c.code}`}
                                                                className={classNames("f__button f__button__round f__button__theme__select__pink", { active })}
                                                                value={c.name}
                                                                onClick={() => this.onSelectCategory(c.code)}
                                                            >
                                                                <span>{c.name}</span>
                                                            </button>
                                                        );
                                                    }

                                                    return null;
                                                })
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="package__column">
                                    <div className="caption__header">개인</div>
                                    <div className="text__content">
                                        <div className="package__row button__list">
                                            {utils.isArray(categoryList) ?
                                                categoryList.map(c => {
                                                    if (PERSONAL_CATEGORY.find(o => o.toUpperCase() === c.code.toUpperCase())) {
                                                        const active = c.code === basic[STATE.BASIC.CATEGORY];
                                                        return (
                                                            <button
                                                                key={`category-code-${c.code}`}
                                                                className={classNames("f__button f__button__round f__button__theme__select__pink", { active })}
                                                                value={c.name}
                                                                onClick={() => this.onSelectCategory(c.code)}
                                                            >
                                                                <span>{c.name}</span>
                                                            </button>
                                                        );
                                                    }

                                                    return null;
                                                })
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hr margin__default" />
                        <div className="padding__default">
                            <div className="package__column padding__vertical">
                                <div className="caption__header">
                                    카테고리
                                </div>
                                <div className="caption__content">
                                    <span>
                                        정확한 카테고리를 선택해주시면 고객 매칭에 도움이 됩니다.<br />
                                        한 상품에 여러 카테고리의 상품을 등록할 경우 임의 삭제 될 수 있습니다.<br />
                                        잘못된 카테고리 선택 시 운영규정에 따라 임의 변경 될 수 있습니다.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

PackageBasic.propTypes = {
    data: PropTypes.shape([PropTypes.node])
};

export default PackageBasic;
