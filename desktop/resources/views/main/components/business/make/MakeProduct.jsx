import "./makeProduct.scss";
import React, { Component, PropTypes } from "react";
import PopModal from "shared/components/modal/PopModal";
import PopupMakeProduct from "desktop/resources/components/pop/popup/make_product/PopupMakeProduct";

export default class MakeProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onPopUp() {
        const modal_name = "make_product";
        const content = (
            <PopupMakeProduct modal_name={modal_name} />
        );
        const modal_option = {
            modal_close: false,
            className: modal_name
        };

        PopModal.createModal(modal_name, content, modal_option);
        PopModal.show(modal_name);
    }

    render() {
        return (
            <section className="biz-make_product biz-panel__dist">
                <div className="container">
                    <div className="biz-make_product__content">
                        <div className="biz-make_product__title">
                            <p className="title">
                                <span className="color-sky">상세페이지 제작</span>
                                포스냅에서 한번에 진행하세요!
                            </p>
                            <span className="underline" />
                        </div>
                        <div className="biz-make_product__btn" onClick={this.onPopUp}>
                            <p>{"자세히보기 >"}</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
