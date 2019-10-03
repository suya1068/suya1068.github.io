import "./artists.scss";
import "babel-polyfill";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, IndexRoute, Link, routerShape } from "react-router";
import classNames from "classnames";

import auth from "forsnap-authentication";
import redirect from "desktop/resources/management/redirect";
import constant from "shared/constant";
import cookie from "forsnap-cookie";
import utils from "forsnap-utils";

import App from "desktop/resources/components/App";

import Header from "desktop/resources/components/layout/BACKUP/Header";
import Footer from "desktop/resources/components/layout/footer/Footer";
import Icon from "desktop/resources/components/icon/Icon";
import siteDispatcher from "desktop/resources/components/siteDispatcher";
import ScrollTop from "desktop/resources/components/scroll/ScrollTop";

import ArtistsMainPage from "./ArtistsMainPage";
import AccountPage from "./account/AccountPage";
import LicensePage from "./account/LicensePage";
import CareerPage from "./account/career/CareerPage";
// import AlarmPage from "./account/AlarmPage";
import PackagePage from "./product/package/PackagePage";
import ProductListPage from "./product/ProductListPage";
import ChatPage from "./chat/ChatPage";
import ArtistLeave from "./account/ArtistLeave";

import ChargeProduct from "./charge/list/ChargeProduct";
import ChargeQuestionPage from "./charge/question/ChargeQuestionPage";

import PhotographProcessPage from "./photograph/process/PhotographProcessPage";
import PhotographCompletePage from "./photograph/complete/PhotographCompletePage";

import SchedulePage from "./schedule/SchedulePage";

import ArtistsProfile from "./components/ArtistsProfile";
import ArtistsRightMenu from "./components/ArtistsRightMenu";

import QuotationResponse from "mobile/resources/views/artists/quotation/components/QuotationResponse";
import QuotationUser from "mobile/resources/views/artists/quotation/components/QuotationUser";
import QuotationOptions from "mobile/resources/views/artists/quotation/components/QuotationOptions";
import QuotationPrice from "mobile/resources/views/artists/quotation/components/QuotationPrice";
import QuotationContent from "mobile/resources/views/artists/quotation/components/QuotationContent";
import QuotationSubmit from "mobile/resources/views/artists/quotation/components/QuotationSubmit";
import QuotationComplete from "mobile/resources/views/artists/quotation/components/QuotationComplete";

import EstimateListContainer from "mobile/resources/views/artists/estimate/estimateList/EstimateListContainer";
import EstimateDetail from "mobile/resources/views/artists/estimate/estimateDetail/EstimateDetail";
import EstimateOfferDetail from "mobile/resources/views/artists/estimate/estimateOfferDetail/EstimateOfferDetail";
import EstimateContainer from "mobile/resources/views/artists/estimate/estimateContainer/EstimateContainer";
import EstimateAbout from "./estimateManager/estimateAbout/EstimateAbout";

import PortFolio from "./estimateManager/portfolio/PortFolio";
import PortfolioListContainer from "./estimateManager/portfolio/components/list/PortfolioListContainer";
import PortfolioRegistContainer from "./estimateManager/portfolio/components/regist/PortfolioRegistContainer";

import NoticePage from "./board/notice/NoticePage";

import ArtistCalculatePage from "./calculate/ArtistCalculatePage";

import ArtistReviewListPage from "./review/list/ArtistReviewListPage";
import ArtistReviewEditPage from "./review/edit/ArtistReviewEditPage";

class Artists extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            route: window.location.hash.substr(1),
            menuLeft: {
                account: {
                    title: "계정관리",
                    key: "account",
                    href: "",
                    sub: {
                        basic: {
                            title: "계정설정",
                            key: "basic",
                            href: "/artists/account/basic",
                            active: ""
                        },
                        career: {
                            title: "작가소개",
                            key: "career",
                            href: "/artists/account/career",
                            active: "",
                            new: false
                        },
                        license: {
                            title: "사업자 인증",
                            key: "license",
                            href: "/artists/account/license",
                            active: ""
                        }
                        // alarm: {
                        //     title: "알림설정",
                        //     key: "alarm",
                        //     href: "/artists/account/alarm",
                        //     active: ""
                        // }
                        // review: {
                        //     title: "후기등록",
                        //     key: "review",
                        //     href: "/artists/account/review",
                        //     active: ""
                        // }
                    },
                    active: ""
                },
                product: {
                    title: "상품관리",
                    key: "product",
                    href: "",
                    sub: {
                        edit: {
                            title: "상품등록",
                            key: "edit",
                            href: "/artists/product/edit",
                            active: ""
                        },
                        list: {
                            title: "상품목록",
                            key: "list",
                            href: "/artists/product/list",
                            active: ""
                        },
                        portfolio: {
                            title: "비노출 포트폴리오",
                            href: "/artists/product/portfolio",
                            active: "",
                            new: false
                        }
                    },
                    new: true
                },
                charge: {
                    title: "광고관리",
                    key: "charge",
                    href: "",
                    sub: {
                        list: {
                            title: "광고등록",
                            key: "list",
                            href: "/artists/charge/list",
                            active: ""
                        },
                        question: {
                            title: "문의접수",
                            key: "question",
                            href: "/artists/charge/question",
                            active: ""
                        }
                    }
                },
                chat: {
                    title: "대화하기",
                    key: "chat",
                    href: "/artists/chat",
                    sub: ""
                },
                // estimate: {
                //     title: "견적관리",
                //     key: "estimate",
                //     href: "",
                //     sub: {
                //         about: {
                //             title: "촬영요청 이용안내",
                //             href: "/artists/estimate/about",
                //             active: ""
                //         },
                //         list: {
                //             title: "촬영요청리스트",
                //             href: "/artists/estimate/list",
                //             active: ""
                //         }
                //     }
                // },
                photograph: {
                    title: "촬영관리",
                    key: "photograph",
                    href: "",
                    sub: {
                        process: {
                            title: "진행중인 촬영",
                            href: "/artists/photograph/process",
                            active: ""
                        },
                        complete: {
                            title: "완료된 촬영",
                            href: "/artists/photograph/complete",
                            active: ""
                        },
                        review: {
                            title: "촬영사례등록",
                            href: "/artists/photograph/review",
                            active: ""
                        }
                    }
                },
                schedule: { title: "일정관리", href: "/artists/schedule", sub: "" },
                calculate: {
                    title: "정산관리",
                    key: "calculate",
                    href: "/artists/calculate",
                    sub: ""
                },
                board_notice: {
                    title: "공지사항",
                    key: "board_notice",
                    href: "/artists/board/notice",
                    sub: "",
                    new: true
                }
            },
            depth1: "",
            depth2: "",
            isRight: false,
            dispatcherId: "",
            orderCount: 0,
            crew_agree_dt: null,
            crew_set_dt: null
        };

        this.leftMenuMouseUp = this.leftMenuMouseUp.bind(this);
        this.onScreenChange = this.onScreenChange.bind(this);
        this.changeLeftMenu = this.changeLeftMenu.bind(this);
        this.dispatcher = this.dispatcher.bind(this);
    }

    componentWillMount() {
        const user = auth.getUser();
        if (!user) {
            redirect.login({ redirectURL: `${location.pathname}${location.search}${location.hash}` });
        } else if (!user.data.is_artist) {
            redirect.registArtist();
        } else {
            this.state.loading = true;
        }

        // const enter = cookie.getCookies(constant.USER.ENTER);
        // const enter_session = sessionStorage.getItem(constant.USER.ENTER);

        // console.log(enter, enter_session);
        this.removeEnter();

        // if (enter || enter_session) {
        //     this.removeEnter();
        //     // cookie.setCookie({ isArtistPageReferrer: true });
        // }

        this.setLocationLeftMenu();
        window.addEventListener("resize", this.onScreenChange);
        this.state.dispatcherId = siteDispatcher.register(this.dispatcher);
    }

    componentDidMount() {
        setTimeout(this.onScreenChange, 10);
        if (!this.props.children) {
            browserHistory.replace("/artists");
            this.context.router.push("/artists");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.children) {
            browserHistory.replace("/artists");
            this.context.router.push("/artists");
        } else {
            this.setLocationLeftMenu();
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onScreenChange);
        siteDispatcher.unregister(this.state.dispatcherId);
    }

    removeEnter() {
        cookie.removeCookie(constant.USER.ENTER);
        sessionStorage.removeItem(constant.USER.ENTER);
    }

    onScreenChange() {
        const width = window.innerWidth;
        const layout = constant.ARTIST_LAYOUT;
        const minWidth = layout.CONTAINER_LEFT_WIDTH + layout.CONTAINER_CENTER_WIDTH + layout.CONTAINER_RIGHT_WIDTH;
        const isRight = this.state.isRight;

        if (width < minWidth && isRight) {
            this.setState({
                isRight: false
            });
        } else if (width > minWidth && !isRight) {
            this.setState({
                isRight: true
            });
        }
    }

    // 왼쪽메뉴 셀렉트 (현재 주소를 분석해서 선택함)
    setLocationLeftMenu() {
        const base = "/artists";
        const router = this.context.router;
        const pathname = router.location.pathname;
        const startIndex = pathname.indexOf(base) + (base.length + 1);
        const routerPath = pathname.substring(startIndex, pathname.length);
        const location = routerPath.split("/");
        this.changeLeftMenu(...location);
    }

    /**
     * 왼쪽메뉴 클릭이벤트
     * @param e
     */
    leftMenuMouseUp(e) {
        const current = e.currentTarget;
        let target = e.target;

        if (target.className === "icon-dt_a") {
            target = target.parentNode.parentNode;
        } else if (target.tagName === "SPAN") {
            target = target.parentNode;
        }

        const depth1 = current.querySelectorAll(".menu-list > li");
        const nodeList = Array.prototype.slice.call(depth1);
        const index = nodeList.indexOf(target.parentElement);
        const key = target.getAttribute("data-key");

        if (index !== -1) {
            this.changeLeftMenu(key);
        } else {
            this.changeLeftMenu(this.state.depth1, key);
        }
    }

    // 왼쪽 메뉴 생성
    createLeftMenu() {
        const { orderCount, menuLeft } = this.state;

        return (
            Object.keys(menuLeft).map((key, i) => {
                const menu = menuLeft[key];
                let subMenu = "";
                let icon = "";
                let badge = null;
                let newBadge = null;

                // 새로운 메뉴 업데이트시 적용할 벳지
                if (menu.new && menu.new === true) {
                    newBadge = <sup className="new-badge">N</sup>;
                }


                // 서브메뉴 생성
                if (menu.sub !== "") {
                    icon = <Icon name="dt_a" active={menu.active} />;
                    subMenu = Object.keys(menu.sub).map((skey, si) => {
                        const sub = menu.sub[skey];
                        let subNewBadge = null;
                        if (menu.sub[skey].new) {
                            subNewBadge = <sup className="new-badge">N</sup>;
                        }

                        return (
                            <li key={si} className={sub.active}><Link to={menu.href + sub.href} data-key={skey} onClick={() => ga("send", "pageview")}><span>{sub.title}{subNewBadge}</span></Link></li>
                        );
                    });
                }

                // if (key === "estimate" && orderCount && orderCount > 0) {
                //     badge = <span className="count">{orderCount}</span>;
                // }

                // a 태크 href에 따른 속성 설정
                let aTag;

                if (menu.href !== "") {
                    aTag = (
                        <Link
                            to={menu.href}
                            data-key={key}
                            onClick={() => {
                                ga("send", "pageview");
                                if (key === menuLeft.board_notice.key) {
                                    utils.ad.gaEvent("작가페이지", "작가-공지사항");
                                }
                            }}
                        ><span>{menu.title}{newBadge}</span>{badge}{icon}</Link>
                    );
                } else {
                    aTag = <a role="button" data-key={key}><span>{menu.title}{newBadge}</span>{badge}{icon}</a>;
                }


                // 전체 조합
                return (
                    <li key={i} className={menu.active}>
                        {aTag}
                        {subMenu !== "" ? <ul className="artist-menu-sub">{subMenu}</ul> : "" }
                    </li>
                );
            })
        );
    }

    // 왼쪽매뉴 선택상태 처리
    changeLeftMenu(depth1 = "", depth2 = "") {
        const menu = this.state.menuLeft;
        const oldDepth1 = this.state.depth1;
        const oldDepth2 = this.state.depth2;
        let isSub = false;

        if (oldDepth1 && oldDepth1 !== "") {
            const object = menu[oldDepth1];

            if (object !== null && object !== undefined) {
                isSub = object.sub !== "";
                menu[oldDepth1].active = "";
            }
        }

        if (oldDepth1 && oldDepth2 && isSub) {
            if (menu[oldDepth1] && menu[oldDepth1].sub && menu[oldDepth1].sub[oldDepth2]) {
                menu[oldDepth1].sub[oldDepth2].active = "";
            }
        }

        if (depth1) {
            const object = menu[depth1];

            if (object !== null && object !== undefined) {
                isSub = object.sub !== "";
                menu[depth1].active = "active";
            }
        }

        if (depth2 && isSub) {
            if (menu[depth1] && menu[depth1].sub && menu[depth1].sub[depth2]) {
                const sub = menu[depth1].sub;
                sub[depth2].active = "active";
            }
        }

        // 탈퇴하기 페이지 왼쪽메뉴 선택상태 강제처리
        const leavePagePath = "/artists/account/leave";
        const activeButton = menu["account"].sub["basic"];

        if (location.pathname === leavePagePath) {
            activeButton.active = "active";
        } else if (location.pathname !== "/artists/account/basic" && location.pathname !== leavePagePath && activeButton.active) {
            activeButton.active = "";
        }

        this.setState({
            menuLeft: menu,
            depth1,
            depth2
        });
    }

    // 플럭스 이벤트 전파받는 함수
    dispatcher(obj) {
        if (obj.actionType === constant.DISPATCHER.HEADER_USER_UPDATE) {
            const userInfo = obj.userInfo;
            const prop = {};

            if (this.state.orderCount !== userInfo.order_count) {
                prop.orderCount = userInfo.order_count;
            }

            // if (userInfo.crew_agree_dt !== undefined && this.state.crew_agree_dt !== userInfo.crew_agree_dt) {
            //     prop.crew_agree_dt = userInfo.crew_agree_dt;
            // }

            // if (userInfo.crew_set_dt !== undefined && this.state.crew_set_dt !== userInfo.crew_set_dt) {
            //     prop.crew_set_dt = userInfo.crew_set_dt;
            //
            //     if (prop.crew_set_dt) {
            //         const find = Object.keys(this.state.menuLeft).find(key => (key === "studio"));
            //         if (!find) {
            //             prop.menuLeft = this.state.menuLeft;
            //             prop.menuLeft.studio = {
            //                 title: "크루스튜디오",
            //                 href: "/artists/studio",
            //                 sub: ""
            //             };
            //         }
            //     }
            // }

            if (Object.keys(prop).length > 0) {
                this.setState(prop);
            }
        }
    }

    render() {
        const { isRight, loading, enter, enter_session } = this.state;

        if (!loading) {
            return null;
        }

        // const childWithProp = React.Children.map(this.props.children, child => {
        //     return React.cloneElement(child, { enter, enter_session });
        // });

        return (
            <div className={classNames("artists", "artists-page", isRight ? "" : "hide-right")}>
                <Header static="true" userType="A" />
                <div className="artist-container-left">
                    <div className="artist-content-left">
                        <ArtistsProfile />
                        <div className="artist-menu-left">
                            <ul className="menu-list" onClick={this.leftMenuMouseUp}>
                                {this.createLeftMenu()}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="artist-container-right">
                    <ArtistsRightMenu isShow={isRight} />
                </div>
                <div className="artist-container-center">
                    <div className="center-container">
                        {this.props.children}
                        {/*{childWithProp}*/}
                    </div>
                </div>
                <Footer>
                    <ScrollTop />
                </Footer>
            </div>
        );
    }
}

Artists.contextTypes = {
    router: routerShape
};

Artists.propTypes = {
    children: PropTypes.node
};

Artists.defaultProps = {
    children: null
};

ReactDOM.render(
    <App roles={["artist"]} userType="A">
        <Router history={browserHistory} >
            <Route path="/artists" component={Artists}>
                <IndexRoute component={ArtistsMainPage} />
                <Route path="account/basic" component={AccountPage} />
                <Route path="account/license" component={LicensePage} />
                <Route path="account/career" component={CareerPage} />
                {/*<Route path="account/alarm" component={AlarmPage} />*/}
                <Route path="account/leave" component={ArtistLeave} />
                <Route path="product/edit" component={PackagePage} />
                <Route path="product/list" component={ProductListPage} />
                <Route path="product/portfolio" component={PortFolio} >
                    <IndexRoute component={PortfolioListContainer} />
                    <Route path="list" component={PortfolioListContainer} />
                    <Route path="regist(/:portfolio_no)" component={PortfolioRegistContainer} />
                    <Route path="*" component={() => location.replace("/artists")} />
                </Route>
                <Route path="chat(/:user_id(/offer/:offer_no)(/:product_no))" component={ChatPage} />
                <Route path="photograph/process(/:status)" component={PhotographProcessPage} />
                <Route path="photograph/complete" component={PhotographCompletePage} />
                <Route path="photograph/review" component={ArtistReviewListPage} />
                <Route path="photograph/review/edit(/:self_review_no)" component={ArtistReviewEditPage} />
                <Route path="calculate" component={ArtistCalculatePage} />
                <Route path="schedule" component={SchedulePage} />
                <Route path="estimate/about" component={EstimateAbout} />
                <Route path="estimate" component={EstimateContainer}>
                    <IndexRoute component={EstimateListContainer} />
                    <Route path="list" component={EstimateListContainer} />
                    <Route path="(:order_no)" component={EstimateDetail} />
                    <Route path="(:order_no)/offer(/:offer_no)" component={EstimateOfferDetail} />
                    <Route path="*" component={() => location.replace("/artists")} />
                </Route>
                <Route path="quotation/:order_no" component={QuotationResponse}>
                    <IndexRoute component={QuotationUser} />
                    <Route path="basic" component={QuotationUser} />
                    <Route path="option" component={QuotationPrice} />
                    <Route path="content" component={QuotationContent} />
                    <Route path="submit" component={QuotationSubmit} />
                    <Route path="complete" component={QuotationComplete} />
                    <Route path="*" component={() => location.replace("/artists")} />
                </Route>
                <Route path="board/notice(/:no)" component={NoticePage} />
                <Route path="charge/list" component={ChargeProduct} />
                <Route path="charge/question" component={ChargeQuestionPage} />
                {/*<Route path="studio(/:no)" component={StudioPage} />*/}
                <Route path="*" component={null} />
            </Route>
        </Router>
    </App>,
    document.getElementById("root")
);
