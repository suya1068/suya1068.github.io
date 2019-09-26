import "../../scss/products_options.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";
import redirect from "forsnap-redirect";
import auth from "forsnap-authentication";

import PopModal from "shared/components/modal/PopModal";

import Icon from "desktop/resources/components/icon/Icon";
import PopupPayment from "desktop/resources/components/pop/popup/PopupPayment";
import Qty from "desktop/resources/components/form/Qty";

class ProductOldOption extends Component {
    constructor(props) {
        super(props);

        this.state = {
            option: props.data.option,
            gaData: props.gaData
        };

        this.onSelectOption = this.onSelectOption.bind(this);
        this.onChangePerson = this.onChangePerson.bind(this);
        this.onReserve = this.onReserve.bind(this);

        this.calculPrice = this.calculPrice.bind(this);
        this.isLogin = this.isLogin.bind(this);
    }

    componentWillMount() {
        const { option } = this.state;

        if (utils.isArray(option)) {
            let optionNo = 0;
            let price = null;
            for (let i = 0; i < option.length; i += 1) {
                const op = option[i];
                if (price === null || op.price < price) {
                    price = op.price;
                    optionNo = op.option_no;
                }
                op.person = op.basic_person * 1;
                op.total_price = this.calculPrice(op.price, op.add_price * 1, op.person, op.basic_person * 1);
            }

            this.onSelectOption(optionNo);
        }
    }

    onSelectOption(optionNo) {
        const { option } = this.state;

        const rs = option.reduce((result, o) => {
            o.selected_option = o.selected_option ? !o.selected_option : o.option_no === optionNo;

            result.push(o);
            return result;
        }, []);

        this.setState({
            option: rs
        });
    }

    onChangePerson(num) {
        const { option } = this.state;

        const op = option.find(o => {
            return o.selected_option;
        });

        if (op) {
            const { price, add_price, basic_person, max_person, person } = op;

            op.person = num;
            op.total_price = this.calculPrice(price, add_price * 1, op.person, basic_person * 1);

            this.setState({
                option
            });
        }
    }

    onReserve(o) {
        const { option, gaData } = this.state;
        const { product_no, calendar, title, name, phone, email, category, nick_name } = this.props.data;
        const user = auth.getUser();

        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("예약&결제", `작가명: ${nick_name} / 상품번호: ${product_no} / 상품명: ${title}`);
        }

        if (user) {
            const prop = {
                name,
                email,
                phone,
                options: option,
                option: o.option_no,
                person: o.person,
                title,
                calendar,
                product_no,
                category,
                nick_name
            };

            const modalName = "popup_payment";
            PopModal.createModal(modalName, <PopupPayment data={prop} gaData={gaData} />, {});
            PopModal.show(modalName);
        } else {
            PopModal.alert("로그인후 이용해주세요", {
                callBack: () => {
                    redirect.login({ redirectURL: location.pathname });
                }
            });
        }
    }

    /**
     * 최종금액 계산
     * @param price - Number (가격)
     * @param addPrice - Number (추가가격)
     * @param person - Number (인원)
     * @param basicPerson - Number (기본인원)
     * @return {number}
     */
    calculPrice(price, addPrice, person, basicPerson) {
        return (price * 1) + (person > basicPerson ? addPrice * (person - basicPerson) : 0);
    }

    /**
     * 로그인 체크
     * @return {*}
     */
    isLogin() {
        const user = auth.getUser();

        if (user) {
            return user;
        }

        PopModal.alert("로그인 후 이용해주세요");
        return false;
    }

    render() {
        const { option } = this.state;

        if (utils.isArray(option)) {
            return (
                <div className="products__options">
                    {option.map(o => {
                        return [
                            <div key={`products-options-${o.option_no}`} className={classNames("products__options__item", { show: o.selected_option })}>
                                <div className="option__title" onClick={() => this.onSelectOption(o.option_no)}>
                                    <span className="title">{o.option_name}</span>
                                    <span className="price"><span className="won">₩</span>{utils.format.price(o.price)}</span>
                                    <span className="arrow"><Icon name="dt" /></span>
                                </div>
                                <div className="option__detail">
                                    <div className="option__info">
                                        {o.max_cut_cnt ?
                                            <div className="info__item">
                                                <div className="title"><icon className="f__icon__opt_origin" />촬영</div>
                                                <div className="content">{`${utils.format.price(o.min_cut_cnt)} ~ ${utils.format.price(o.max_cut_cnt)} 컷`}</div>
                                            </div> : null
                                        }
                                        {o.custom_cnt ?
                                            <div className="info__item">
                                                <div className="title"><icon className="f__icon__opt_custom" />보정</div>
                                                <div className="content">{o.custom_cnt > 0 ? `${utils.format.price(o.custom_cnt)} 컷` : "없음"}</div>
                                            </div> : null
                                        }
                                        {o.print_cnt ?
                                            <div className="info__item">
                                                <div className="title"><icon className="f__icon__opt_print" />인화</div>
                                                <div className="content">{o.print_cnt > 0 ? `${o.print_cnt || "-"} 컷` : "없음"}</div>
                                            </div> : null
                                        }
                                    </div>
                                    <div className="option__content">
                                        {utils.linebreak(o.option_content || "")}
                                    </div>
                                    <div className="option__info">
                                        <div className="info__basic">
                                            <div className="title"><span className="title" style={{ marginRight: 10 }}>촬영인원</span> <Icon name="opt_direct" /></div>
                                            <div className="info__basic__content">{o.basic_person} ~ {o.max_person}</div>
                                            <div className="qty">
                                                <Qty count={o.person || 1} min={o.basic_person * 1} max={o.max_person * 1} resultFunc={num => this.onChangePerson(num)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>,
                            o.selected_option ? [
                                <button className="_button _button__block _button__fill__yellow" onClick={() => this.onReserve(o)}>₩ {utils.format.price(o.total_price)} 예약&결제하기</button>
                            ] : null
                        ];
                    })}
                </div>
            );
        }

        return null;
    }
}

// data - product_no, option, events, title, name, email, phone
ProductOldOption.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired
};

export default ProductOldOption;
