import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import ResponseJS, { STATE as RES_STATE } from "shared/components/quotation/response/QuotationResponse";
import RequestJS, { STATE as REQ_STATE } from "shared/components/quotation/request/QuotationRequest";

import EstimateDetail from "desktop/resources/views/estimate/outside/detail/EstimateDetail";

class QuotationSubmit extends Component {
    constructor() {
        super();

        const reserveTime = RequestJS.getReserveTimes();

        this.state = {
            [REQ_STATE.ORDER_NO]: RequestJS.getState(REQ_STATE.ORDER_NO),
            [RES_STATE.OFFER_NO]: ResponseJS.getState(RES_STATE.OFFER_NO),
            [REQ_STATE.RESERVE.key]: RequestJS.getState(REQ_STATE.RESERVE.key),
            // [REQ_STATE.OPTIONS.key]: RequestJS.getState(REQ_STATE.OPTIONS.key),
            // [RES_STATE.OPTIONS.key]: ResponseJS.getState(RES_STATE.OPTIONS.key),
            [RES_STATE.OPTION_PRICE.key]: ResponseJS.getState(RES_STATE.OPTION_PRICE.key),
            [RES_STATE.CONTENT]: ResponseJS.getState(RES_STATE.CONTENT),
            [RES_STATE.ATTACH]: ResponseJS.getState(RES_STATE.ATTACH),
            [RES_STATE.ATTACH_FILE]: ResponseJS.getState(RES_STATE.ATTACH_FILE),
            reserveTime
        };

        this.sliderResize = this.sliderResize.bind(this);
        // this.convertValue = this.convertValue.bind(this);
        // this.convertArtistValue = this.convertArtistValue.bind(this);
    }

    componentWillMount() {
        const reserve = this.state[REQ_STATE.RESERVE.key];
        const categoryList = ResponseJS.getState(RES_STATE.CATEGORY_CODES);

        if (categoryList) {
            const category = categoryList.find(obj => {
                const value = reserve[REQ_STATE.RESERVE.CATEGORY];
                if (value) {
                    return obj.code === value.toUpperCase();
                }

                return false;
            });

            if (category) {
                this.state.category = category;
                //this.state[REQ_STATE.ACCEPT_OPTIONS] = RequestJS.getState(REQ_STATE.ACCEPT_OPTIONS)[category.code];
            }
        }

        window.addEventListener("resize", this.sliderResize);
    }

    componentDidMount() {
        this.sliderResize();
        window.scroll(0, 0);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.sliderResize);
    }

    sliderResize() {
        const slider = this.slider;

        if (slider) {
            const quotation = this.quotation;
            const rs = utils.resize(4, 3, quotation.offsetWidth, 0, true);

            slider.style.width = `${rs.width}px`;
            slider.style.height = `${rs.height}px`;
        }
    }


    render() {
        const { category } = this.state;

        if (!category) {
            return null;
        }

        const optionPrice = this.state[RES_STATE.OPTION_PRICE.key];
        const attach = this.state[RES_STATE.ATTACH];
        const attach_file = this.state[RES_STATE.ATTACH_FILE];
        const content = this.state[RES_STATE.CONTENT];

        return (
            <div className="quotation__submit" ref={ref => (this.quotation = ref)}>
                <div className="content__column">
                    <div className="content__column__head">
                        <h1>입력한 정보를 확인해주세요.</h1>
                    </div>
                    <div>
                        <EstimateDetail data={{ option: optionPrice, content, attach_image: attach, attach_file }} />
                    </div>
                </div>
            </div>
        );
    }
}

export default QuotationSubmit;
