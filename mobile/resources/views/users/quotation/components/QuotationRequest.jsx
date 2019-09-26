import "../scss/quotation_request.scss";
import React, { Component, PropTypes, createElement } from "react";
import { routerShape, browserHistory } from "react-router";
import classNames from "classnames";
import API from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import cookie from "forsnap-cookie";
import CONSTANT from "shared/constant";
import redirect from "mobile/resources/management/redirect";
import { STATUS } from "shared/constant/quotation.const";
import { Footer } from "mobile/resources/containers/layout";
import RequestJS, { STATE } from "shared/components/quotation/request/QuotationRequest";
import PopModal from "shared/components/modal/PopModal";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

class QuotationRequest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            path: "",
            loading: false
        };

        this.onPrev = this.onPrev.bind(this);
        this.onNext = this.onNext.bind(this);

        this.setPath = this.setPath.bind(this);
        this.replaceUrl = this.replaceUrl.bind(this);
        this.routerPush = this.routerPush.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const { order_no } = this.props.routeParams;
        const user = auth.getUser();

        if (user) {
            const path = this.setPath(this.props.routes);
            const promise = [];

            if (path === "*") {
                return;
            }

            RequestJS.init();

            promise.push(API.products.categorys());

            if (!isNaN(order_no)) {
                const request = RequestJS.apiFindQuotation(order_no);
                if (request) {
                    promise.push(request);
                }
            } else {
                if (order_no === "video") {
                    RequestJS.setReserveState(STATE.RESERVE.CATEGORY, "VIDEO");
                }

                browserHistory.replace(this.replaceUrl("/users/quotation/basic"));
            }

            Promise.all(promise).then(response => {
                const category = response[0];
                const quotation = response[1];
                let prop = {
                    loading: true
                };
                const enter = cookie.getCookies(CONSTANT.USER.ENTER);
                const enter_session = sessionStorage.getItem(CONSTANT.USER.ENTER);
                const combineCategoryList = obj => {
                    if (obj.tag) {
                        const a = obj.tag.split(/[ ]*,[ ]*/);
                        const tag = [];
                        if (utils.isArray(a)) {
                            for (let i = 0; i < 3; i += 1) {
                                const item = a[i];

                                if (!item) {
                                    break;
                                }

                                tag.push(item);
                            }
                        }
                        obj.sub_caption = tag.join(" / ");
                    }

                    return obj;
                };
                if (category) {
                    if (category.status === 200) {
                        const data = category.data;
                        let categoryList = [];
                        if (utils.isArray(data.category)) {
                            categoryList = data.category.reduce((result, obj) => {
                                if (enter && enter_session && utils.checkCategoryForEnter(obj.code)) {
                                    result.push(combineCategoryList(obj));
                                } else if ((!enter || !enter_session) && obj.code !== "AD" & obj.code !== "DRESS_RENT") {
                                    result.push(combineCategoryList(obj));
                                }
                                // if (obj.code !== "AD") {
                                //     const a = obj.tag.split(/[ ]*,[ ]*/);
                                //     const tag = [];
                                //     if (utils.isArray(a)) {
                                //         for (let i = 0; i < 3; i += 1) {
                                //             const item = a[i];
                                //
                                //             if (!item) {
                                //                 break;
                                //             }
                                //
                                //             tag.push(item);
                                //         }
                                //     }
                                //
                                //     obj.sub_caption = tag.join(" / ");
                                //     result.push(obj);
                                // }

                                return result;
                            }, []);
                        }

                        prop = Object.assign(prop, RequestJS.setState(STATE.CATEGORY_CODES, categoryList));
                    }
                }

                if (quotation) {
                    if (quotation.status === 200) {
                        const data = quotation.data;
                        const progress = RequestJS.checkProgress();
                        const offer = data[STATE.OFFER];

                        if (offer && offer.list && Array.isArray(offer.list) && offer.list.length > 0) {
                            PopModal.alert("견적서를 받은 후에는\n요청서를 수정할 수 없습니다.", {
                                callBack: () => {
                                    redirect.back();
                                }
                            });
                            return;
                        }

                        if (typeof data.phone === "undefined" && typeof data.email === "undefined") {
                            PopModal.alert("잘못된 요청서 번호입니다.", {
                                callBack: () => {
                                    redirect.back();
                                }
                            });
                            return;
                        }

                        const statusPath = Object.keys(STATUS).find(s => {
                            return s.toLowerCase() === path;
                        });

                        if (path && statusPath && STATUS[statusPath].order <= progress.status.order) {
                            const reserve = RequestJS.getState(STATE.RESERVE.key);
                            if (path === STATUS.QUANTITY.key.toLowerCase() && reserve[STATE.RESERVE.CATEGORY] === "VIDEO") {
                                browserHistory.replace(this.replaceUrl(`/users/quotation/${order_no}/content`));
                                prop.path = "content";
                            } else {
                                prop.path = path;
                            }
                        } else {
                            browserHistory.replace(this.replaceUrl(`/users/quotation/${order_no}/${progress.path}`));
                        }
                    }
                }

                this.setState(prop);
            });
        } else {
            PopModal.alert("로그인후 이용해주세요", {
                callBack: () => {
                    redirect.login({ redirectURL: location.pathname });
                }
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            path: this.setPath(nextProps.routes)
        });
    }

    onPrev() {
        const orderNo = RequestJS.getState(STATE.ORDER_NO);
        let url = "";

        switch (this.state.path) {
            case "basic":
                break;
            case "category":
                url = `/users/quotation/${orderNo}/basic`;
                break;
            // case "quantity":
            //     url = `/users/quotation/${orderNo}/category`;
            //     break;
            case "content": {
                const reserve = RequestJS.getState(STATE.RESERVE.key);
                if (reserve[STATE.RESERVE.CATEGORY] === "VIDEO") {
                    url = `/users/quotation/${orderNo}/category`;
                } else {
                    url = `/users/quotation/${orderNo}/category`;
                }
                break;
            }
            case "inspect":
                url = `/users/quotation/${orderNo}/content`;
                break;
            default:
                break;
        }

        if (url) {
            this.routerPush(url);
        }
    }

    onNext() {
        const orderNo = RequestJS.getState(STATE.ORDER_NO);

        switch (this.state.path) {
            case "basic":
                if (orderNo) {
                    const request = RequestJS.apiUpdateBasic(orderNo);
                    if (request) {
                        request.then(response => {
                            if (response.status === 200) {
                                this.routerPush(`/users/quotation/${orderNo}/category`);
                            }
                        });
                    }
                } else {
                    const request = RequestJS.apiRegistQuotation();
                    if (request) {
                        request.then(response => {
                            if (response.status === 200) {
                                const no = RequestJS.getState(STATE.ORDER_NO);
                                if (no) {
                                    this.routerPush(`/users/quotation/${no}/category`);
                                }
                            }
                        });
                    }
                }
                break;
            case "category":
                if (orderNo) {
                    const request = RequestJS.apiReserve();
                    if (request) {
                        request.then(response => {
                            if (response.status === 200) {
                                const reserve = RequestJS.getState(STATE.RESERVE.key);
                                if (reserve[STATE.RESERVE.CATEGORY] === "VIDEO") {
                                    this.routerPush(`/users/quotation/${orderNo}/content`);
                                } else {
                                    this.routerPush(`/users/quotation/${orderNo}/content`);
                                    // this.routerPush(`/users/quotation/${orderNo}/quantity`);
                                }
                            }
                        });
                    }
                } else {
                    PopModal.alert("잘못된 접근입니다", {
                        callBack: () => {
                            location.href = this.replaceUrl("/users/quotation");
                        }
                    });
                }
                break;
            // case "quantity":
            //     if (orderNo) {
            //         const request = RequestJS.apiQuantity();
            //         if (request) {
            //             request.then(response => {
            //                 if (response.status === 200) {
            //                     this.routerPush(`/users/quotation/${orderNo}/content`);
            //                 }
            //             });
            //         }
            //     } else {
            //         PopModal.alert("잘못된 접근입니다", {
            //             callBack: () => {
            //                 location.href = this.replaceUrl("/users/quotation");
            //             }
            //         });
            //     }
            //     break;
            case "content":
                if (orderNo) {
                    const request = RequestJS.apiContent();
                    if (request) {
                        request.then(response => {
                            if (response.status === 200) {
                                this.routerPush(`/users/quotation/${orderNo}/inspect`);
                            }
                        });
                    }
                } else {
                    PopModal.alert("잘못된 접근입니다", {
                        callBack: () => {
                            location.href = this.replaceUrl("/users/quotation");
                        }
                    });
                }
                break;
            case "inspect":
                if (orderNo) {
                    const request = RequestJS.apiRequest();
                    if (request) {
                        request.then(response => {
                            if (response.status === 200) {
                                this.routerPush(`/users/quotation/${orderNo}/complete`);
                            }
                        });
                    }
                } else {
                    PopModal.alert("잘못된 접근입니다", {
                        callBack: () => {
                            location.href = this.replaceUrl("/users/quotation");
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

    replaceUrl(url) {
        const currentUrl = document.location;
        const targetUrl = document.createElement("a");
        targetUrl.href = url;
        let result = targetUrl.pathname;

        if (result.substr(0, 1) !== "/") {
            result = `/${result}`;
        }

        if (currentUrl.search) {
            const search = currentUrl.search;
            const parseQuery = search.substr(1, search.length).split("&");
            const params = parseQuery.reduce((rs, q) => {
                const arr = q.split("=");
                if (utils.isArray(arr)) {
                    rs[arr[0]] = arr[1];
                }
                return rs;
            }, {});

            if (params && params.new) {
                result += "?new=true";
            }
        }

        return result;
    }

    routerPush(url) {
        this.context.router.push(this.replaceUrl(url));
    }

    render() {
        const { path, loading } = this.state;

        if (!path || !loading) {
            return null;
        }

        return (
            <div className="quotation__request" key={`request__${path}`}>
                <div className="quotation__request__body">
                    <div className="quotation__request__process">
                        <div className={classNames("process__bar", `bar__${path}`)}>
                            <div className="bar__dot" />
                            <div className="bar__dot" />
                            <div className="bar__dot" />
                            {/*<div className="bar__dot" />*/}
                            <div className="bar__dot" />
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
                            <button className="button__next" onClick={this.onNext}>{path === "inspect" ? "요청하기" : "다음"}</button>
                        </div>}
                    {utils.agent.isMobile()
                        ?
                            <Footer>
                                <ScrollTop />
                            </Footer>
                        : null
                    }
                </div>
            </div>
        );
    }
}

QuotationRequest.contextTypes = {
    router: routerShape
};

QuotationRequest.propTypes = {
    children: PropTypes.node,
    routeParams: PropTypes.shape([PropTypes.node]),
    routes: PropTypes.arrayOf(PropTypes.shape([PropTypes.node]))
};

export default QuotationRequest;
