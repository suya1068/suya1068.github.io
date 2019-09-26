import "./detailFooter.scss";
import React, { Component, PropTypes } from "react";
import API from "forsnap-api";
import utils from "forsnap-utils";
import { routerShape } from "react-router";
import PopModal from "shared/components/modal/PopModal";

export default class DetailFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: props.status,
            p_params: this.combinePreviousParams(location.search)
        };
        this.onRedirectList = this.onRedirectList.bind(this);
        this.regOfferQuotation = this.regOfferQuotation.bind(this);
        this.modOfferQuotation = this.modOfferQuotation.bind(this);
    }

    onRedirectList() {
        const { p_params } = this.state;

        let base_url = "/artists/estimate/list";
        if (p_params) {
            base_url += `?tab=${p_params.p_tab}&page=${p_params.p_page}`;
        }
        if (this.context.router) {
            this.context.router.push(base_url);
        } else {
            location.href = base_url;
        }
    }

    combinePreviousParams(obj) {
        if (obj) {
            const parse_search = utils.query.parse(obj);
            const { p_tab, p_page } = parse_search;

            return { p_tab, p_page };
        }

        return null;
    }


    getButtonTextFromOffer(status) {
        switch (status) {
            case "BASIC": return "세부사항 작성중";
            // case "QUANTITY": return "견적정보 작성중";
            case "OPTION": return "촬영 설명 작성중";
            case "CONTENT": return "입력정보 확인중";
            case "REQUEST": case "PROGRESS": case "COMPLETE":
                return "견적서 수정하기";
                // case "REQUEST": return "검수요청중";
            case "CATEGORY": return "촬영유형 작성중";
            default: return status;
        }
    }

    checkOrderProduct(order_no) {
        const request = API.offers.products(order_no);
        const category = utils.format.categoryCodeToName(this.props.category);
        // const isMobile = this.state.isMobile;
        request.then(response => {
            const list = response.data.list;
            if (list.length === 0) {
                const modal_name = "offer_portfolio_alert";
                const content = (
                    <div>
                        <p className="offer_empty_category-text">{utils.linebreak(`견적서를 작성하기 위해서는\n ${category} 카테고리의 포트폴리오가 필요합니다.\n상품을 등록하시거나 견적서 포트폴리오를 등록해주세요.`)}</p>
                        <div className="offer_empty_category-button">
                            <button className="alert-button-offer" onClick={() => { location.href = "/artists/product/edit"; }}>상품등록</button>
                            <button className="alert-button-offer" onClick={() => { location.href = "/artists/product/portfolio/regist"; }}>견적서포트폴리오등록</button>
                        </div>
                    </div>
                );
                PopModal.createModal(modal_name, content);
                PopModal.show(modal_name);
            } else {
                this.regOfferQuotation(order_no);
            }
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    regOfferQuotation(order_no) {
        const url = `/artists/quotation/${order_no}`;
        if (this.context.router) {
            this.context.router.push(url);
        } else {
            location.href = url;
        }
    }

    modOfferQuotation(order_no) {
        const url = `/artists/quotation/${order_no}`;
        if (this.context.router) {
            this.context.router.push(url);
        } else {
            location.href = url;
        }
    }

    render() {
        const { order_no, offer_no, status, offer_status, isBlock } = this.props;
        const { p_params } = this.state;
        let linkFunc = () => this.checkOrderProduct(order_no);
        let btnTheme = "button__theme__yellow";
        let btnText = "견적서 작성하기";
        if (offer_no) {
            linkFunc = () => this.modOfferQuotation(order_no);
            btnTheme = "pink_btn";
            btnText = this.getButtonTextFromOffer(offer_status);
            // btnText = "견적서 수정하기";
        }

        if (status === "COMPLETE") {
            linkFunc = null;
            btnTheme = "disabled";
            btnText = "마감된 촬영요청서 입니다.";
        }

        return (
            <div
                className="artists__estimate-detail-footer"
            >
                {!isBlock &&
                    <button
                        onClick={linkFunc}
                        className={`button button-block button-block button__rect ${btnTheme}`}
                    >
                        {btnText}
                    </button>
                }
                <button
                    onClick={this.onRedirectList}
                    className="button button-block button__rect button__default"
                >
                    {p_params && p_params.p_tab === "complete" ? "내가 적성한 견적서 " : "요청서 "}리스트
                </button>
            </div>
        );
    }
}

DetailFooter.contextTypes = {
    router: routerShape
};

DetailFooter.propTypes = {
    order_no: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    offer_no: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
