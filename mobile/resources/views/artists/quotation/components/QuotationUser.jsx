import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import API from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import ResponseJS, { STATE as RES_STATE } from "shared/components/quotation/response/QuotationResponse";
import RequestJs, { STATE as REQ_STATE } from "shared/components/quotation/request/QuotationRequest";
import PopModal from "shared/components/modal/PopModal";

class QuotationUser extends Component {
    constructor() {
        super();

        this.state = {
            [RES_STATE.USER.key]: ResponseJS.getState(RES_STATE.USER.key),
            [RES_STATE.PRODUCT_NO]: ResponseJS.getState(RES_STATE.PRODUCT_NO),
            [RES_STATE.PORTFOLIO_NO]: ResponseJS.getState(RES_STATE.PORTFOLIO_NO),
            portfolio: []
        };

        this.onChangeValue = this.onChangeValue.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.selectPortfolio = this.selectPortfolio.bind(this);
    }

    componentDidMount() {
        const user = this.state[RES_STATE.USER.key];
        const authUser = auth.getUser();

        if (authUser) {
            const promise = [];
            let props = {};

            promise.push(API.offers.products(RequestJs.getState(REQ_STATE.ORDER_NO)));

            if (user.name === "") {
                promise.push(API.artists.find(authUser.id));
            }

            Promise.all(promise).then(response => {
                const products = response[0];
                const find = response[1];

                if (find) {
                    if (find.status === 200) {
                        const data = find.data;

                        ResponseJS.setUserState(RES_STATE.USER.NAME, data.name);
                        ResponseJS.setUserState(RES_STATE.USER.PHONE, data.phone);
                        props = Object.assign(props, ResponseJS.setUserState(RES_STATE.USER.EMAIL, data.email));
                    }
                }

                if (products) {
                    if (products.status === 200) {
                        const data = products.data;
                        props.portfolio = data.list;
                    }
                }

                if (!props.portfolio || (Array.isArray(props.portfolio) && props.portfolio.length < 1)) {
                    if (utils.agent.isMobile()) {
                        PopModal.alert(
                            "견적서를 작성하기 위해서는 해당 카테고리에 판매중인 상품 또는 포트폴리오가 필요합니다.\n상품등록은 PC에서 로그인 후 작가페이지 > 상품관리 > 상품등록에서 가능합니다.",
                            {
                                key: "quotation-portfolio-error"
                            }
                        );
                    } else {
                        PopModal.confirm(
                            "견적서를 작성하기 위해서는 해당 카테고리에 판매중인 상품 또는 포트폴리오가 필요합니다.\n상품등록은 PC에서 로그인 후 작가페이지 > 상품관리 > 상품등록에서 가능합니다.",
                            () => {
                                location.href = "/artists/product/edit";
                            },
                            () => {
                                location.href = "/artists/product/portfolio/regist";
                            },
                            "center",
                            {
                                key: "quotation-portfolio-error",
                                titleOk: "상품 등록하기",
                                titleCancel: "포트폴리오 등록하기"
                            }
                        );
                    }

                    props = {
                        ...props,
                        ...ResponseJS.setState(RES_STATE.PORTFOLIO_NO, "")
                    };
                }

                this.setState(props);
            });
        }

        window.scroll(0, 0);
    }

    onChangeValue(e, key) {
        const target = e.target;
        const value = target.value;
        const maxLength = target.maxLength;

        if (maxLength && maxLength > -1 && value.length > maxLength) {
            return;
        }

        this.setState(ResponseJS.setUserState(key, value));
    }

    onFocus(e) {
        // if (utils.agent.isMobile()) {
        //     const target = e.target;
        //     setTimeout(() => {
        //         target.scrollIntoView();
        //         setTimeout(() => {
        //             window.scrollTo(0, 0);
        //         }, 0);
        //     }, 500);
        // }
    }

    /**
     * 포트폴리오 선택
     * @param productNo - Number (상품 번호)
     */
    selectPortfolio(portfolioType, portfolioNo) {
        switch (portfolioType) {
            case "PRODUCT_NO": this.setState(ResponseJS.setState(RES_STATE["PORTFOLIO_NO"], "")); break;
            case "PORTFOLIO_NO": this.setState(ResponseJS.setState(RES_STATE["PRODUCT_NO"], "")); break;
            default:
        }
        this.setState(ResponseJS.setState(RES_STATE[portfolioType], portfolioNo));
    }

    render() {
        const { portfolio } = this.state;
        const user = this.state[RES_STATE.USER.key];
        const productNo = this.state[RES_STATE.PRODUCT_NO];
        const portfolioNo = this.state[RES_STATE.PORTFOLIO_NO];

        return (
            <div className="quotation__basic">
                <div className="content__column">
                    <div className="content__column__head">
                        <h1>기본정보를 입력해주세요.</h1>
                    </div>
                    <div className="content__column__body">
                        <div className="column__box">
                            <div className="column__row">
                                <div className="row__title">
                                    <span>이름</span>
                                </div>
                                <div className="row__content">
                                    <input
                                        className="input disabled"
                                        type="text"
                                        value={user[RES_STATE.USER.NAME]}
                                        onFocus={this.onFocus}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="column__row">
                                <div className="row__title">
                                    <span>연락처</span>
                                </div>
                                <div className="row__content">
                                    <input
                                        className="input disabled"
                                        type="tel"
                                        value={user[RES_STATE.USER.PHONE]}
                                        onFocus={this.onFocus}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="column__row">
                                <div className="row__title">
                                    <span>이메일</span>
                                </div>
                                <div className="row__content">
                                    <input
                                        className="input disabled"
                                        type="email"
                                        value={user[RES_STATE.USER.EMAIL]}
                                        onFocus={this.onFocus}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="column__row">
                            <div className="row__content direction__row justify-center">
                                <span className="exclamation">!</span><span className="caption">입력하신 정보로 SMS와 이메일이 발송됩니다. 정확한 정보인지 확인해주세요.</span>
                            </div>
                        </div>
                        <div className="column__box overflow__hidden portfolio__box">
                            <div className="column__header">
                                <div className="row__title text-center">
                                    포트폴리오 선택하기
                                </div>
                            </div>
                            {!portfolio || (Array.isArray(portfolio) && portfolio.length < 1)
                                ? null
                                : portfolio.map(product => {
                                    const isProductNo = Object.prototype.hasOwnProperty.call(product, "product_no");
                                    const isActive = product.product_no === productNo || product.portfolio_no === portfolioNo;
                                    const pNo = isProductNo ? product.product_no : product.portfolio_no;
                                    const isPortfolioType = isProductNo ? "PRODUCT_NO" : "PORTFOLIO_NO";
                                    return [
                                        <div className="column__row hr" />,
                                        <div className="column__row">
                                            <button className="row__content" onClick={() => this.selectPortfolio(isPortfolioType, pNo)}>
                                                <span className={classNames("check__icon", isActive ? "active" : "")}><icon className={classNames("m-icon", isActive ? "m-icon-check-white" : "m-icon-check")} /></span>{product.title}
                                            </button>
                                        </div>
                                    ];
                                })
                            }
                        </div>
                        <div className="column__row">
                            <div className="row__content direction__row justify-center">
                                <span className="exclamation">!</span><span className="caption">해당상품의 포트폴리오만 견적서에 첨부됩니다.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default QuotationUser;
