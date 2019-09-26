import "./PortfolioCategoryPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import api from "forsnap-api";
import utils from "forsnap-utils";
import auth from "forsnap-authentication";

import { PORTFOLIO_CATEGORY } from "shared/constant/portfolio.const";

import App from "desktop/resources/components/App";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Footer from "desktop/resources/components/layout/footer/Footer";
import ScrollTop from "desktop/resources/components/scroll/ScrollTop";

import PortfolioCategoryConsult from "./components/PortfolioCategoryConsult";
import PortfolioCategoryFullScreen from "./components/PortfolioCategoryFullScreen";
import PopModal from "shared/components/modal/PopModal";

class PortfolioCategoryPage extends Component {
    constructor() {
        super();

        this.state = {
            isMount: true,
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
        this.onShow = this.onShow.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
        const parse = utils.query.parse(location.search);
        this.state.no = Number(parse.no || null);
    }

    componentDidMount() {
        const { no, limit } = this.state;
        let category = document.getElementById("portfolio_category");
        let category_name = document.getElementById("portfolio_category_name");
        if (category && category_name) {
            category = category.getAttribute("content").toLowerCase();
            category_name = category_name.getAttribute("content");

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
                        // console.log(">>>>", pl);
                        const fileName = o.portfolio_img.replace(`/main_portfolio/${category}/`, "");
                        let item = pl.find(obj => {
                            return obj.path === fileName;
                        });

                        if (!item) {
                            item = {};
                        }

                        if (o.portfolio_img.indexOf("박현신") === -1) {
                            r.push(Object.assign({}, {
                                no: o.portfolio_no,
                                portfolio_img: o.portfolio_img,
                                width: w,
                                height: h,
                                resize_width: resize.width,
                                resize_height: resize.height,
                                full_width: resizeFull.width,
                                full_height: resizeFull.height,
                                left: item.left,
                                top: item.top,
                                artist_name: o.nick_name,
                                file_name: fileName
                            }));
                        }

                        // const start = o.portfolio_img.lastIndexOf("-");
                        // const end = o.portfolio_img.lastIndexOf(".");
                        // const artist_name = o.portfolio_img.substring(start + 1, end);

                        return r;
                    }, []);

                    this.setStateData(() => {
                        return {
                            category,
                            category_name,
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
        const { portfolio, list, limit, floating } = this.state;
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

        const footer = document.getElementById("site-footer");

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

    onShow(index) {
        const { portfolio, category_name } = this.state;
        const length = portfolio.length;
        const mod = length % 5 || 5;
        const consult = document.getElementsByClassName("portfolio__category__consult")[0];

        if (index < length && index > ((length - 1) - mod) && consult) {
            consult.scrollIntoView(false);
        }

        const item = portfolio[index];

        if (item) {
            utils.ad.gaEvent("기업_리스트", "추천포폴", `${category_name} | ${item.file_name}`);
        }

        const modal_name = "full_category";
        const content = (
            <PortfolioCategoryFullScreen
                list={portfolio}
                index={index}
                category_name={category_name}
                onClose={() => PopModal.close(modal_name)}
            />);

        PopModal.createModal(modal_name, content, { modal_close: false, className: modal_name, full_category: true });
        PopModal.show(modal_name, "MULTIPLE", true);
    }

    // onHide() {
    //     this.setStateData(() => {
    //         return {
    //             full: false
    //         };
    //     }, () => {
    //         document.querySelector("html").style.overflow = "auto";
    //     });
    // }

    setStateData(update, callback) {
        this.setState(state => {
            return update(state);
        }, callback);
    }

    render() {
        const { category, category_name, list, loading, floating, index } = this.state;

        if (!loading) {
            return null;
        }

        return (
            <App>
                <HeaderContainer />
                <div id="site-main">
                    <div className="portfolio__category">
                        <div className="portfolio__category__container">
                            <div className="portfolio__breadcrumb">
                                <a href="/">포스냅 홈</a>
                                <span>&gt;</span>
                                <span className="active">{category_name}포트폴리오</span>
                            </div>
                            <div className="portfolio__category__list" ref={ref => (this.refList = ref)}>
                                {list.map((o, i) => {
                                    const prop = {
                                        left: o.left,
                                        top: o.top
                                    };

                                    if (o.width > o.height) {
                                        prop.height = "100%";
                                    } else {
                                        prop.width = "100%";
                                    }

                                    return (
                                        <div key={`portfolio_${i}`} className={classNames({ active: index === i })} onClick={() => this.onShow(i)}>
                                            <img
                                                alt="portfolio"
                                                src={`${__SERVER__.thumb}/normal/resize/${o.resize_width}x${o.resize_height}${o.portfolio_img}`}
                                                style={prop}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <PortfolioCategoryConsult fixed={floating} category={category} category_name={category_name} />
                    </div>
                </div>
                <Footer>
                    <ScrollTop device="PC" is_artist={this.state.user && this.state.user.data.is_artist}>
                        <a className="float__button" href={`/products?category=${category}`}>
                            <div className="float__icon">
                                <img alt="3초견적" src={`${__SERVER__.img}/common/icon_floating_consult.png`} role="presentation" />
                            </div>
                            <div className="float__text">3초견적</div>
                        </a>
                    </ScrollTop>
                </Footer>
            </App>
        );
    }
}

ReactDOM.render(
    <PortfolioCategoryPage />,
    document.getElementById("root")
);
