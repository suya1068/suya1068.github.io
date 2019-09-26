import "./PortfolioCategoryPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import api from "forsnap-api";
import utils from "forsnap-utils";
import auth from "forsnap-authentication";

import { PORTFOLIO_CATEGORY } from "shared/constant/portfolio.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer, Footer } from "mobile/resources/containers/layout";
import ConsultModal from "mobile/resources/components/modal/consult/ConsultModal";

import PortfolioItem from "./components/PortfolioItem";
import PhotoViewModal from "./components/PhotoViewModal";

class PortfolioCategoryPage extends Component {
    constructor() {
        super();

        this.state = {
            isMount: true,
            category: "",
            category_name: "",
            portfolio: [],
            list: [],
            index: 0,
            no: null,
            limit: 30,
            loading: false,
            floating: true,
            full: false,
            user: auth.getUser()
        };

        this.onMore = this.onMore.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onConsult = this.onConsult.bind(this);
        this.onShow = this.onShow.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
        const parse = utils.query.parse(location.search);
        this.state.no = Number(parse.no || null);

        const category = document.getElementById("portfolio_category");
        const category_name = document.getElementById("portfolio_category_name");
        if (category && category_name) {
            this.state.category = category.getAttribute("content");
            this.state.category_name = category_name.getAttribute("content");

            setTimeout(() => {
                AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: this.state.category_name });
            }, 0);
        }
    }

    componentDidMount() {
        let category = this.state.category;

        if (category) {
            category = category.toLowerCase();
            api.products.selectMainPortfolio({ category })
                .then(response => {
                    const { list, total_cnt } = response.data;

                    const portfolio = list.reduce((r, o) => {
                        const w = Number(o.width);
                        const h = Number(o.height);
                        const a = w < h;

                        const resize = utils.resize(w, h, 320, 320, a);
                        const resizeFull = utils.resize(w, h, 960, 960, !a);

                        const pl = PORTFOLIO_CATEGORY[category.toUpperCase()] || [];
                        const fileName = o.portfolio_img.replace(`/main_portfolio/${category}/`, "");
                        let item = pl.find(obj => {
                            return obj.path === fileName;
                        });

                        if (!item) {
                            item = {};
                        }

                        // const start = o.portfolio_img.lastIndexOf("-");
                        // const end = o.portfolio_img.lastIndexOf(".");
                        // const artist_name = o.portfolio_img.substring(start + 1, end);

                        const style = {
                            left: item.left,
                            top: item.top
                        };

                        if (w > h) {
                            style.height = "100%";
                        } else {
                            style.width = "100%";
                        }

                        if (o.portfolio_img.indexOf("박현신") === -1) {
                            r.push(Object.assign({}, {
                                no: o.portfolio_no,
                                portfolio_img: o.portfolio_img,
                                width: w,
                                height: h,
                                // resize_width: resize.width,
                                // resize_height: resize.height,
                                full_width: resizeFull.width,
                                full_height: resizeFull.height,
                                left: item.left,
                                top: item.top,
                                artist_name: o.nick_name,
                                file_name: fileName,
                                src: `${__SERVER__.thumb}/normal/resize/${resize.width}x${resize.height}${o.portfolio_img}`,
                                style
                            }));
                        }

                        return r;
                    }, []);

                    this.setStateData(() => {
                        return {
                            portfolio,
                            loading: true
                        };
                    }, () => {
                        const moreList = this.onMore();
                        this.setStateData(state => {
                            return {
                                list: state.list.concat(moreList)
                            };
                        }, () => {
                            window.addEventListener("scroll", this.onScroll);
                        });

                        // let max = limit;
                        // let index = 0;
                        //
                        // if (no) {
                        //     index = portfolio.findIndex(o => {
                        //         return Number(o.no) === Number(no);
                        //     });
                        //
                        //     if (index > limit) {
                        //         max = index + (15 - (index % 5));
                        //     }
                        // }
                        //
                        // const moreList = this.onMore(max);
                        // this.setStateData(state => {
                        //     return {
                        //         index,
                        //         list: state.list.concat(moreList)
                        //     };
                        // }, () => {
                        //     const target = document.getElementsByClassName("portfolio__category__list")[0];
                        //     if (target && target.children[index]) {
                        //         setTimeout(() => {
                        //             window.scrollTo(0, target.children[index].offsetTop - 180);
                        //         }, 1000);
                        //     }
                        //     window.addEventListener("scroll", this.onScroll);
                        // });
                    });
                });
        }
    }

    componentWillUnmount() {
        this.state.isMount = false;
        window.removeEventListener("scroll", this.onScroll);
    }

    onMore(max) {
        const { portfolio, list, limit } = this.state;
        const length = list.length;
        const images = [];

        for (let i = length; i < (length + (max || limit)); i += 1) {
            if (i >= portfolio.length) {
                break;
            }

            images.push(portfolio[i]);
        }

        return images;
    }

    onScroll(e) {
        const { portfolio, list, floating } = this.state;
        const screenHeight = window.screen.height;

        if (this.refList) {
            const rect = this.refList.getBoundingClientRect();
            const bottom = (rect.top + rect.height) - screenHeight;

            if (bottom < 198 && portfolio.length > list.length) {
                const moreList = this.onMore();
                this.setStateData(state => {
                    return {
                        list: state.list.concat(moreList)
                    };
                });
            }
        }

        const footer = document.getElementsByClassName("site-footer")[0];

        if (footer) {
            const rect2 = footer.getBoundingClientRect();
            const bottom2 = screenHeight - rect2.top;

            if (floating && bottom2 > -1) {
                this.setStateData(() => {
                    return {
                        floating: false
                    };
                });
            } else if (!floating && bottom2 < 0) {
                this.setStateData(() => {
                    return {
                        floating: true
                    };
                });
            }
        }
    }

    /**
     * 상담신청 페이지로 이동한다.
     */
    onConsult() {
        const { category } = this.state;

        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: (
                <ConsultModal
                    onConsult={data => {
                        const params = Object.assign({
                            access_type: `PF_${category}`,
                            device_type: "mobile",
                            page_type: "biz"
                        }, data);

                        // 상담요청 api
                        api.orders.insertAdviceOrders(params)
                            .then(response => {
                                // utils.ad.fbqEvent("InitiateCheckout");
                                utils.ad.wcsEvent("4");
                                utils.ad.gtag_report_conversion(location.href);
                                utils.ad.gaEvent("기업고객", "상담전환");
                                utils.ad.gaEventOrigin("기업고객", "상담전환");
                                Modal.show({
                                    type: MODAL_TYPE.ALERT,
                                    content: utils.linebreak("상담신청해 주셔서 감사합니다.\n곧 연락 드리겠습니다."),
                                    onSubmit: () => Modal.close()
                                });
                            })
                            .catch(error => {
                                if (error && error.date) {
                                    Modal.show({
                                        type: MODAL_TYPE.ALERT,
                                        content: utils.linebreak(error.data),
                                        onSubmit: () => Modal.close()
                                    });
                                }
                            });
                    }}
                    onClose={() => Modal.close()}
                />
            )
        });
    }

    onShow(index) {
        const { list } = this.state;

        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            full: true,
            content: <PhotoViewModal data={list} index={index} onClose={() => Modal.close()} />
        });
    }

    setStateData(update, callback) {
        this.setState(state => {
            return update(state);
        }, callback);
    }

    render() {
        const { list, loading, floating, index, category } = this.state;

        if (!loading) {
            return null;
        }

        return (
            <AppContainer>
                <div className="site-main">
                    <HeaderContainer category={category} />
                    <LeftSidebarContainer />
                    <div className="portfolio__category">
                        <div className="portfolio__category__container">
                            <div className="portfolio__category__list" ref={ref => (this.refList = ref)}>
                                {list.map((o, i) => {
                                    return (
                                        <div
                                            key={`portfolio_${i}`}
                                            className={classNames("portfolio__item", { active: index === i })}
                                            onClick={() => this.onShow(i)}
                                        >
                                            <PortfolioItem src={o.src} style={o.style} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className={classNames("portfolio__category__buttons", { fixed: floating })}>
                            <button onClick={this.onConsult}>상담먼저</button>
                            <a href={`/products?category=${category}`}><button>3초 견적</button></a>
                        </div>
                    </div>
                    <OverlayContainer />
                    <Footer />
                </div>
            </AppContainer>
        );
    }
}

ReactDOM.render(
    <PortfolioCategoryPage />,
    document.getElementById("root")
);
