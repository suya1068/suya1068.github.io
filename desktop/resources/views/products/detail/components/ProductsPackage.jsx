import "../scss/products_options.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";

import DropDown from "shared/components/ui/dropdown/DropDown";

// import Buttons from "desktop/resources/components/button/Buttons";
import Icon from "desktop/resources/components/icon/Icon";
import Qty from "desktop/resources/components/form/Qty";

class ProductsPackage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            packageList: props.packageList,
            data: props.data,
            selectValue: ""
        };

        this.onSelectOption = this.onSelectOption.bind(this);
    }

    componentWillMount() {
    }

    onSelectOption(value) {
        const { onSelectOption } = this.props;

        this.setState({
            selectValue: value
        }, () => {
            if (typeof onSelectOption === "function") {
                onSelectOption(value);
            }
        });
    }

    layoutSelectOptions(optionList) {
        return null;
    }

    render() {
        const { onSelectPackage, onRemoveOption, onChangePackageCount, onChangeCount, onReserve } = this.props;
        const { packageList, selectValue } = this.state;
        let totalPrice = 0;

        if (utils.isArray(packageList)) {
            return (
                <div className="products__options">
                    {packageList.map((p, i) => {
                        const isExcept = ["PRODUCT", "FOOD", "FASHION"].indexOf(p.category) !== -1;
                        if (p.selected) {
                            totalPrice = Number(p.total_price) || 0;
                        }

                        return (
                            <div key={`products-options-${i}`} className={classNames("products__options__item", { "model": p.category === "MODEL" }, { show: p.selected })}>
                                {p.category === "MODEL" ?
                                    <div className="option__title" onClick={() => onSelectPackage(i)}>
                                        <div className="title_box">
                                            <span className="title">{p.title}</span>
                                            <span className="price">
                                                최소진행금액
                                                <span className="won">₩</span>
                                                {utils.format.price(p.price)} ~
                                            </span>
                                        </div>
                                        <span className="arrow"><Icon name="dt" /></span>
                                    </div> :
                                    <div className="option__title" onClick={() => onSelectPackage(i)}>
                                        <span className="title">{p.title}</span>
                                        <span className="price"><span className="won">₩</span>{utils.format.price(p.price)}</span>
                                        <span className="arrow"><Icon name="dt" /></span>
                                    </div>
                                }
                                <div className="option__detail">
                                    {p.category !== "DRESS_RENT" && p.category !== "MODEL" ?
                                        <div className="option__info">
                                            {p.photo_cnt ?
                                                <div className="info__item">
                                                    <div className="title"><icon className="f__icon__opt_print" />이미지</div>
                                                    <div className="content">{utils.format.price(p.photo_cnt)} 장</div>
                                                </div> : null
                                            }
                                            {p.custom_cnt ?
                                                <div className="info__item">
                                                    <div className="title"><icon className="f__icon__opt_custom" />보정</div>
                                                    <div className="content">{p.custom_cnt > 0 ? `${utils.format.price(p.custom_cnt)} 장` : "없음"}</div>
                                                </div> : null
                                            }
                                            {p.photo_time ?
                                                <div className="info__item">
                                                    <div className="title"><icon className="f__icon__opt_origin" />촬영시간</div>
                                                    <div className="content">{p.photo_time === "MAX" ? "300분 이상" : `${p.photo_time || "-"} 분`}</div>
                                                </div> : null
                                            }
                                            {p.min_price || p.min_price === 0 ?
                                                <div key="package-min-price" className="info__item">
                                                    <div className="title">최소진행금액</div>
                                                    <div className="content">{`${utils.format.price(p.min_price)}원` || "없음"}</div>
                                                </div> : null
                                            }
                                            {p.running_time ?
                                                <div key="package-min-price" className="info__item">
                                                    <div className="title">러닝타임</div>
                                                    <div className="content">{`${p.running_time || "-"} 분`}</div>
                                                </div> : null
                                            }
                                        </div> : null
                                    }
                                    <div className="option__content">
                                        {utils.linebreak(p.content || "")}
                                    </div>
                                    {p.category !== "MODEL" &&
                                        <div className="option__info">
                                            <div className="info__basic">
                                                <div className="title"><icon className="f__icon__calendar_s" />{p.category === "DRESS_RENT" ? "대여기간" : "작업일"}</div>
                                                <div className="content">{p.complete_period} 일</div>
                                                {isExcept ?
                                                    <div className="qty">
                                                        <Qty count={p.count || 1} min={1} max={9999} resultFunc={num => onChangePackageCount(num)} />
                                                    </div> : null
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                                {utils.isArray(p.optionList) ?
                                    <div className="option__detail">
                                        <div className="option__list">
                                            <DropDown
                                                data={p.optionList}
                                                select={selectValue}
                                                name="title"
                                                value="code"
                                                onSelect={this.onSelectOption}
                                            />
                                            {p.optionList.find(o => o.selected) || isExcept ?
                                                <div className="option__select">
                                                    {isExcept ?
                                                        <div key={`option-select-${p.package_no}`} className="option__select__item default">
                                                            <div>
                                                                <div className="title">
                                                                    {p.title}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="qty">
                                                                    <Qty count={p.count || 1} min={1} max={9999} resultFunc={num => onChangePackageCount(num)} />
                                                                </div>
                                                                <div className="price">
                                                                    <span><span className="won">₩</span>{utils.format.price(p.price)}</span>
                                                                </div>
                                                            </div>
                                                        </div> : null
                                                    }
                                                    {p.optionList.map(o => {
                                                        if (!o.selected) {
                                                            return null;
                                                        }

                                                        totalPrice += o.total_price;

                                                        return (
                                                            <div key={`option-select-${o.code}`} className="option__select__item">
                                                                <div>
                                                                    <div className="title">
                                                                        {o.title}
                                                                    </div>
                                                                    <div className="remove">
                                                                        <button className="f__button__close" onClick={() => onRemoveOption(o.code)} />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="qty">
                                                                        <Qty count={o.count || 1} min={1} max={9999} resultFunc={num => onChangeCount(num, o.code)} />
                                                                    </div>
                                                                    <div className="price">
                                                                        <span><span className="won">₩</span>{utils.format.price(o.price)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div> : null
                                            }
                                        </div>
                                    </div> : null
                                }
                                <div className="option__payment">
                                    <button className="_button _button__block _button__yellow__over" onClick={() => onReserve(p)}>₩ {utils.format.price(totalPrice)} 예약&결제하기</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return null;
    }
}

ProductsPackage.propTypes = {
    packageList: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    onSelectPackage: PropTypes.func.isRequired,
    onSelectOption: PropTypes.func.isRequired,
    onRemoveOption: PropTypes.func.isRequired,
    onChangePackageCount: PropTypes.func.isRequired,
    onChangeCount: PropTypes.func.isRequired,
    onReserve: PropTypes.func.isRequired
};

export default ProductsPackage;
