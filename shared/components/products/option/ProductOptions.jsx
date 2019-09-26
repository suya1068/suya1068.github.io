import "./product_options.scss";
import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import Accordion from "shared/components/ui/accordion/Accordion";

class ProductOptions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true
        };

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    setStateData(update, callBack) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callBack);
        }
    }

    /**
     * 최종금액 계산
     * @param price - Number (가격)
     * @param add_price - Number (추가가격)
     * @param person - Number (인원)
     * @param basic_person - Number (기본인원)
     * @return {number}
     */
    totalPriceOption(price, add_price, person, basic_person) {
        return Number(price) + (Number(person) > Number(basic_person) ? add_price * (person - basic_person) : 0);
    }

    render() {
        const { data, onSelect } = this.props;

        if (Array.isArray(data) && data.length) {
            return (
                <div className="product__options">
                    {data.map((o, i) => {
                        return (
                            <Accordion key={`option_no_${i}`} selected={o.selected} onSelect={selected => onSelect(selected ? o.option_no : null)} ref={ref => (this.refAccordion[o.option_no] = ref)}>
                                <div className="option__title">
                                    <div className="title">{o.option_name}</div>
                                    <div className="price">{utils.format.price(o.price)}</div>
                                </div>
                                <div>
                                    <div className="option__content">
                                        <div>
                                            <div className="service__info">
                                                <div className="service__row"><div className="title">촬영</div><div className="content">{utils.format.price(o.photo_cnt)}</div></div>
                                                <div className="service__row"><div className="title">보정</div><div className="content">{utils.format.price(o.custom_cnt)}</div></div>
                                                <div className="service__row"><div className="title">인화</div><div className="content">{utils.format.price(o.print_cnt)}</div></div>
                                                <div className="service__row"><div className="title">촬영인</div><div className="content">{utils.format.price(o.basic_person)}~{utils.format.price(o.max_person)}</div></div>
                                            </div>
                                            <div className="service__content">
                                                {o.content}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        );
                    })}
                </div>
            );
        }

        return null;
    }
}

ProductOptions.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    onSelect: PropTypes.func.isRequired
};

export default ProductOptions;
