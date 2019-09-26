import "../scss/quotation_response.scss";
import React, { Component, PropTypes, createElement } from "react";
import { routerShape, browserHistory } from "react-router";
import classNames from "classnames";
import API from "forsnap-api";
import redirect from "mobile/resources/management/redirect";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import { Footer } from "mobile/resources/containers/layout";
import ResponseJS, { STATE as RES_STATE } from "shared/components/quotation/response/QuotationResponse";
import RequestJS, { STATE as REQ_STATE } from "shared/components/quotation/request/QuotationRequest";
import PopModal from "shared/components/modal/PopModal";
import { STATUS } from "shared/constant/quotation.const";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

class QuotationResponse extends Component {
    constructor(props) {
        super(props);

        this.state = {
            path: "",
            loading: false,
            isMount: !this._calledComponentWillUnmount
        };

        this.onPrev = this.onPrev.bind(this);
        this.onNext = this.onNext.bind(this);

        this.setPath = this.setPath.bind(this);
    }

    componentWillMount() {
        const { order_no } = this.props.routeParams;
        const user = auth.getUser();

        if (!user) {
            PopModal.alert("로그인후 이용해주세요", {
                callBack: () => {
                    redirect.login({ redirectURL: location.pathname });
                }
            });
        } else if (isNaN(order_no)) {
            PopModal.alert("잘못된 접근입니다", {
                callBack: () => {
                    redirect.back();
                }
            });
        } else {
            const path = this.setPath(this.props.routes);
            const promise = [];

            if (path === "*") {
                return;
            }

            ResponseJS.init();
            RequestJS.init();

            promise.push(API.products.categorys());
            const request = RequestJS.apiFindQuotation(order_no);

            if (request) {
                promise.push(request);
            }

            Promise.all(promise).then(response => {
                const categoryList = response[0];
                const quotation = response[1];
                let prop = {
                    loading: true
                };

                if (categoryList) {
                    if (categoryList.status === 200) {
                        const data = categoryList.data;

                        prop = Object.assign(prop, ResponseJS.setState(RES_STATE.CATEGORY_CODES, data.category));
                    }
                }

                if (quotation) {
                    if (quotation.status === 200) {
                        const data = quotation.data;
                        const offerNo = data.offer_no || null;

                        RequestJS.setAllState(data);
                        const reserve = RequestJS.getState(REQ_STATE.RESERVE.key);
                        const category = reserve[REQ_STATE.RESERVE.CATEGORY];
                        ResponseJS.setOptionState(RES_STATE.OPTIONS.CATEGORY, category.toUpperCase());

                        if (offerNo) {
                            ResponseJS.setOptionState(RES_STATE.OPTIONS.CATEGORY, data[REQ_STATE.RESERVE.CATEGORY]);
                            const findOffer = ResponseJS.apiFindOffer(offerNo);
                            if (findOffer) {
                                findOffer.then(res => {
                                    if (res.status === 200) {
                                        const resData = res.data;

                                        const progress = ResponseJS.checkProgress();
                                        const statusPath = Object.keys(STATUS).find(s => {
                                            return s.toLowerCase() === path;
                                        });

                                        if (path && statusPath && STATUS[statusPath].order <= progress.status.order) {
                                            prop.path = path;
                                        } else {
                                            browserHistory.replace(`/artists/quotation/${order_no}/${progress.path}`);
                                        }

                                        this.setState(prop);
                                    }
                                });
                            } else {
                                PopModal.alert("견적서를 가져오지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                                    key: "quotation-offer-error",
                                    callBack: () => {
                                        redirect.back();
                                    }
                                });
                            }
                        } else {
                            this.setState(prop, () => {
                                browserHistory.replace(`/artists/quotation/${order_no}/basic`);
                            });
                        }
                    }
                }
            });
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            path: this.setPath(nextProps.routes)
        });
    }

    onPrev() {
        const orderNo = RequestJS.getState(REQ_STATE.ORDER_NO);

        switch (this.state.path) {
            case "option":
                this.context.router.push(`/artists/quotation/${orderNo}/basic`);
                break;
            case "content":
                this.context.router.push(`/artists/quotation/${orderNo}/option`);
                break;
            case "submit":
                this.context.router.push(`/artists/quotation/${orderNo}/content`);
                break;
            default:
                break;
        }
    }

    onNext() {
        const orderNo = RequestJS.getState(REQ_STATE.ORDER_NO);
        const offerNo = ResponseJS.getState(RES_STATE.OFFER_NO);

        switch (this.state.path) {
            case "basic": {
                const request = ResponseJS.apiRegist(orderNo);
                if (request) {
                    request.then(response => {
                        this.context.router.push(`/artists/quotation/${orderNo}/option`);
                    });
                }
                break;
            }
            case "option":
                if (offerNo) {
                    const request = ResponseJS.apiOption();
                    if (request) {
                        request.then(response => {
                            this.context.router.push(`/artists/quotation/${orderNo}/content`);
                        });
                    }
                } else {
                    PopModal.alert("잘못된 접근입니다", {
                        callBack: () => {
                            location.href = "/";
                        }
                    });
                }
                break;
            case "content":
                if (offerNo) {
                    const request = ResponseJS.apiContent();
                    if (request) {
                        request.then(response => {
                            this.context.router.push(`/artists/quotation/${orderNo}/submit`);
                        });
                    }
                } else {
                    PopModal.alert("잘못된 접근입니다", {
                        callBack: () => {
                            location.href = "/";
                        }
                    });
                }
                break;
            case "submit":
                if (offerNo) {
                    const request = ResponseJS.apiSubmit();
                    if (request) {
                        request.then(response => {
                            this.context.router.push(`/artists/quotation/${orderNo}/complete`);
                        });
                    }
                } else {
                    PopModal.alert("잘못된 접근입니다", {
                        callBack: () => {
                            location.href = "/";
                        }
                    });
                }
                break;
            default:
                break;
        }
    }

    setPath(routes) {
        let path = "";

        if (routes) {
            const r = routes[2];
            if (r) {
                if (r.component && r.path) {
                    path = r.path;
                }
            }
        }

        return path;
    }

    render() {
        const { path, loading } = this.state;

        if (!path || !loading) {
            return null;
        }

        return (
            <div className="quotation__request" style={{ paddingTop: utils.agent.isMobile() && "0" }} key={`request__${path}`}>
                <div className="quotation__request__body">
                    <div className="quotation__request__process">
                        <div className={classNames("process__bar", `bar__${path}`)}>
                            <div className="bar__dot" />
                            <div className="bar__dot" />
                            <div className="bar__dot" />
                            <div className="bar__dot" />
                            {/*<div className="bar__dot" />*/}
                            <div className="bar__overlay" />
                        </div>
                    </div>
                    {this.props.children}
                    {path === "complete"
                        ? null :
                        <div className="quotation__request__buttons">
                            {path !== "basic" ?
                                <button className="button__prev" onClick={this.onPrev}>이전</button>
                                : null
                            }
                            <button className="button__next" onClick={this.onNext}>{path === "submit" ? "제출하기" : "다음"}</button>
                        </div>}
                    {utils.agent.isMobile() ? <Footer><ScrollTop /></Footer> : null}
                </div>
            </div>
        );
    }
}

QuotationResponse.contextTypes = {
    router: routerShape
};

QuotationResponse.propTypes = {
    children: PropTypes.node,
    routeParams: PropTypes.shape([PropTypes.node]),
    routes: PropTypes.arrayOf(PropTypes.shape([PropTypes.node]))
};

export default QuotationResponse;
