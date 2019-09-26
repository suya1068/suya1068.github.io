import "../scss/AdditionPrice.scss";
import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

// import PopModal from "shared/components/modal/PopModal";
// import PopupCalculatePrice from "shared/components/popup/PopupCalculatePrice";

class AdditionPrice extends Component {
    constructor() {
        super();

        this.state = {
            price: ""
        };

        this.onChangePrice = this.onChangePrice.bind(this);

        this.setPrice = this.setPrice.bind(this);
        // this.popCalculate = this.popCalculate.bind(this);
    }

    onChangePrice(e) {
        if (e && e.currentTarget) {
            const target = e.currentTarget;
            const value = target.value;
            const price = utils.format.priceParse(value);

            this.setState({
                price: this.setPrice(price && !isNaN(price) ? parseInt(price, 10) : "")
            });
        }
    }

    setPrice(price) {
        const { IF } = this.props.data;

        if (IF && typeof IF.setPrice === "function") {
            return IF.setPrice(price);
        }

        return "";
    }

    // popCalculate() {
    //     const modalName = "popup-calculate";
    //     PopModal.createModal(modalName, <PopupCalculatePrice price={this.state.price} />, { className: "popup__calculate__price", modal_close: false });
    //     PopModal.show(modalName);
    // }

    render() {
        const { price } = this.state;

        return (
            <div className="addition__price">
                <div className="addition__price__options">
                    <div className="option__item input__type1">
                        <div className="text">
                            촬영비용금액
                        </div>
                        <div className="price">
                            <input className="option__item__input pink" value={utils.format.price(price)} onChange={this.onChangePrice} />
                            <span className="won black">원</span>
                        </div>
                    </div>
                    {/*<div className="option__item">*/}
                    {/*<button className="f__button f__button__small" onClick={this.popCalculate}>예상정산금액</button>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }
}

export default AdditionPrice;
