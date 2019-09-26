import "./header.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import auth from "forsnap-authentication";
import desktopAPI from "desktop/resources/management/desktop.api";
import utils from "shared/helper/utils";
import constant from "shared/constant";
import { CATEGORYS } from "shared/constant/main.const";
import cookie from "forsnap-cookie";

import Input from "shared/components/ui/input/Input";

import redirect from "desktop/resources/management/redirect";
import Icon from "desktop/resources/components/icon/Icon";
import PopDownContent from "desktop/resources/components/pop/popdown/PopDownContent";
import Badge from "desktop/resources/components/form/Badge";
import Profile from "desktop/resources/components/image/Profile";
import Buttons from "desktop/resources/components/button/Buttons";
import NotiftMenu from "desktop/resources/components/notify/NotifyMenu";
import siteDispatcher from "desktop/resources/components/siteDispatcher";

import PopModal from "shared/components/modal/PopModal";

import A from "shared/components/link/A";
import LogLocation from "shared/helper/logLocation/LogLocation";

const classTheme = {
    default: "forsnav-black"
};
/**
 * @param navTitle - 네비 로고 옆 타이틀
 * @param theme - 네비 테마
 * @param static - 네비 컬러 고정여부 (true, false)
 */
class Header extends Component {
    constructor(props) {
        super(props);
        this.logLocation = new LogLocation();

        this.state = {
            navTitle: props.navTitle,
            theme: props.theme,
            static: this.isStatic(props.static),
            isStatic: this.isStatic(props.static) ? false : 170,
            isScrollOver: false,
            isLogin: false,
            isSearch: false,
            isArtist: false,
            keyword: "",
            profileImage: "",
            noticeCount: 0,
            noticeData: [],
            dispatcherId: "",
            profileButton: [],
            isProcessNotice: true,
            categorys: this.sortCategory(CATEGORYS),
            url: location.href
        };
        this.scrollCheck = this.scrollCheck.bind(this);
        this.notifySearch = this.notifySearch.bind(this);
        this.searchResultFunc = this.searchResultFunc.bind(this);
        this.searchResultEnter = this.searchResultEnter.bind(this);
        this.moveToLoginPage = this.moveToLoginPage.bind(this);
        this.getNotice = this.getNotice.bind(this);
        this.dispatcher = this.dispatcher.bind(this);

        this.onLogout = this.onLogout.bind(this);
        this.changeProfileButton = this.changeProfileButton.bind(this);

        this.searchValue = this.searchValue.bind(this);
    }

    componentWillMount() {
        this.logLocation.init(document.referrer);
        const dispatcherId = siteDispatcher.register(this.dispatcher);
        this.state.dispatcherId = dispatcherId;
        // this.setReferrerData();
    }

    componentDidMount() {
        window.addEventListener("scroll", this.scrollCheck);
        setTimeout(this.scrollCheck, 10);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.url !== location.href) {
            if (!utils.type.isEmpty(this.logLocation.getSessionItemsForLogData(["uuid"]))) {
                this.logLocation.setLogParams({ url: location.href });
                const log_params = this.logLocation.getLogParams();

                if (Object.keys(log_params).length > 3) {
                    this.logLocation.setLogLocationData("move");
                }
                this.state.url = location.href;
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.scrollCheck);
        siteDispatcher.unregister(this.state.dispatcherId);
    }

    sortCategory(list) {
        const _sort = ["WEDDING", "BABY", "PROFILE", "SNAP", "PRODUCT", "BEAUTY", "FOOD", "FASHION", "PROFILE_BIZ", "INTERIOR", "EVENT", "VIDEO_BIZ"];
        return _sort.reduce((result, code) => {
            const _test = list.filter(obj => obj.code === code);
            result.push(_test[0]);
            return result;
        }, []);
    }

    /**
     * 로그아웃한다.
     */
    onLogout() {
        desktopAPI.auth.logout().then(response => {
            auth.removeUser();
            location.reload();
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    // 헤더 스크롤시 테마 설정
    getScrollTheme() {
        let theme = "";

        if (this.state.static || this.state.isScrollOver) {
            theme = classTheme[this.state.theme];
        }

        return theme;
    }

    // 알림 가져오기
    getNotice() {
        this.setState({
            isProcessNotice: true
        }, () => {
            this.getNoticeData();
        });
    }

    /**
     * 알림 가쳐오기 처리
     */
    getNoticeData() {
        const user = auth.getUser();
        let request = null;

        if (this.state.isArtist) {
            // const match = location.pathname.match(/(^\/users$)|(^\/users\/.*$)|(^\/users?.*$)/g);
            // if (!match || (!!match && match.length === 0)) {
            request = desktopAPI.artists.notice(user.id);
            // } else {
            //     request = desktopAPI.users.notice(user.id);
            // }
        } else {
            request = desktopAPI.users.notice(user.id);
        }

        if (request !== null) {
            request.then(response => {
                const data = response.data;

                const mergeObj = utils.mergeArrayTypeObject(this.state.noticeData, data.list, ["no"], ["no"], true);
                const current = mergeObj.list;

                this.setState({
                    noticeData: current,
                    isProcessNotice: false
                });
            }).catch(error => {
                PopModal.alert(error.data);
            });
        }
    }

    isStatic(data) {
        return data === "true";
    }

    // 스크롤 체크후 헤더 변경
    scrollCheck() {
        const scrollY = typeof window.scrollY === "undefined" ? window.pageYOffset : window.scrollY;

        const nav = document.getElementById("site-main-nav");
        let navHeight = nav.offsetHeight || 70;

        // 사진 길이에 따라(테스트로 길이 170으로 고정) bg=black되는 시점 변경
        if (this.state.isStatic) {
            navHeight = this.state.isStatic;
        }

        if (scrollY > navHeight && !this.state.isScrollOver) {
            this.scrollOverUpdate(true);
        } else if (scrollY < navHeight && this.state.isScrollOver) {
            this.scrollOverUpdate(false);
        }
    }

    // 스크롤 체크후 반응여부 변경
    scrollOverUpdate(b) {
        this.setState({
            isScrollOver: b
        });
    }

    // 헤더 해시태그 검색
    notifySearch(e) {
        const current = e.currentTarget;
        const target = e.target;
        const tagName = target.tagName;

        if (tagName === "ICON") {
            this.searchVisible(true);

            current.querySelector("input").focus();
        }
    }

    // 검색창 보이기/숨기기
    searchVisible(b) {
        this.setState({
            isSearch: b
        });
    }

    /**
     *  입력된 값으로 상품페이지로 이동한다.
     */
    searchValue() {
        const keyword = this.state.keyword;

        if (keyword !== "") {
            this.setState({
                isSearch: false
            });
            const eCategory = "상품검색";
            const eAction = "keyword";
            const eLabel = keyword;
            utils.ad.gaEvent(eCategory, eAction, eLabel);

            const url = `keyword=${keyword}`;

            redirect.productList(url);
        }
    }

    // 검색창 검색하기
    searchResultFunc(e, n, v) {
        this.setState({
            keyword: v
        });
    }

    // 검색창 엔터키
    searchResultEnter(e, value) {
        e.preventDefault();
        this.searchValue();
    }

    /**
     * 로그인 페이지로 이동한다.
     */
    moveToLoginPage() {
        const url = `${location.pathname}${location.search}${location.hash}`;

        if (location.pathname === "/login") {
            location.reload();
        } else if (url !== "/") {
            redirect.login({ redirectURL: url });
        } else {
            redirect.login();
        }
    }

    // 헤더 오른쪽 UI만들기 (검색, 알림, 프로필)
    notifyContent() {
        let chat;
        let profile;

        if (this.state.isLogin) {
            chat = (
                <PopDownContent
                    key="header-notify-chat"
                    target={<Badge data={{ count: this.state.noticeCount }}><Icon name="chat" /></Badge>}
                    align="left"
                    posy={23}
                    visibleFunc={this.getNotice}
                >
                    <NotiftMenu data={this.state.noticeData} userType={this.props.userType} isProcess={this.state.isProcessNotice} />
                </PopDownContent>
            );
            profile = (
                <PopDownContent
                    key="header-notify-profile"
                    target={<Profile image={{ src: this.state.profileImage, content_width: 110, content_height: 110 }} size="small" />}
                    align="left"
                    posy={13}
                >
                    <div className="buttons-content">
                        {this.state.profileButton.map((obj, i) => {
                            return (<Buttons inline={{ title: obj.title, onClick: obj.resultFunc }} key={i}>{obj.title}</Buttons>);
                        })}
                    </div>
                </PopDownContent>
            );
        } else {
            profile = <Buttons buttonStyle={{ size: "small", shape: "circle", theme: "reverse" }} inline={{ onClick: this.moveToLoginPage }}>로그인</Buttons>;
        }

        return (
            <div className="forsnav-notify">
                <form className="notify-search" onMouseUp={this.notifySearch} onSubmit={this.searchResultEnter}>
                    <Icon name="search" />
                    <Input
                        className={this.state.isSearch ? "" : "hide"}
                        value={this.state.keyword}
                        max="15"
                        onChange={this.searchResultFunc}
                        onBlur={() => this.searchVisible(false)}
                    />
                </form>
                {chat}
                {profile}
            </div>
        );
    }

    redirectArtistsPage() {
        redirect.redirectArtistPage();
    }

    /**
     * 로그인시 profile버튼을 변경한다.
     * @param isArtist
     */
    changeProfileButton(isArtist) {
        const profileBtn = [];
        profileBtn.push({ title: "마이페이지", resultFunc: () => redirect.myProgress() });
        // profileBtn.push({ title: "마이페이지", resultFunc: isArtist && this.props.userType === "A" ? () => redirect.redirectArtistAccount() : () => redirect.myProgress() });
        if (isArtist) {
            profileBtn.push({ title: "작가페이지", resultFunc: this.redirectArtistsPage });
        }

        profileBtn.push({ title: "로그아웃", resultFunc: () => this.onLogout() });

        return profileBtn;
    }

    // 헤더 글로벌 함수전파 받기
    dispatcher(obj) {
        if (obj.actionType === constant.DISPATCHER.HEADER_USER_UPDATE) {
            const userInfo = obj.userInfo;
            const props = {};

            if (this.state.isLogin !== userInfo.is_login) {
                props.isLogin = userInfo.is_login;
            }

            if (this.state.profileImage !== userInfo.profile_img) {
                if (userInfo.profile_img && userInfo.profile_img !== "") {
                    props.profileImage = userInfo.profile_img;
                }
            }

            if (this.state.noticeCount !== userInfo.notice_count) {
                props.noticeCount = userInfo.notice_count;
            }

            if (this.state.isArtist !== userInfo.is_artist) {
                props.isArtist = userInfo.is_artist;
                props.profileButton = this.changeProfileButton(userInfo.is_artist);
            }

            if (Object.keys(props).length > 0) {
                this.setState(props);
            }
        }
    }

    render() {
        const { categorys } = this.state;
        const f_logo = "/common/f_logo_s.png";
        return (
            <header id="site-main-nav" className={classNames("forsnav", this.getScrollTheme())}>
                <div className="forsnav-layout">
                    <div className="forsnav-bg" />
                    <div className="forsnav-container">
                        <h1 className="forsnav-logo">
                            <a href="/">
                                <img src={`${__SERVER__.img}${this.props.userType === "A" ? "/artist/fa_logo_s.png" : f_logo}`} alt="forsnap_logo" />
                                <span className="sr-only">FORSNAP</span>
                            </a>
                        </h1>
                        <div className="forsnav-content-left" style={{ paddingLeft: location.pathname.startsWith("/artists") ? 50 : "" }}>
                            {categorys.map((obj, idx) => {
                                const isEnterCategory = utils.checkCategoryForEnter(obj.code);
                                const url = isEnterCategory ? `/products?category=${obj.code}` : `/products?category=${obj.code}&enter=indi`;
                                return (
                                    <div className="gnb-item" key={`header-gnb__${idx}`}>
                                        <A href={url}>{obj.name}촬영</A>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="forsnav-content-right">
                            {this.notifyContent()}
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

Header.propTypes = {
    navTitle: PropTypes.string,
    theme: PropTypes.oneOf(Object.keys(classTheme)),
    static: PropTypes.oneOf(["true", "false"]),
    userType: PropTypes.oneOf(["U", "A"])
};

Header.defaultProps = {
    navTitle: "",
    theme: "default",
    static: "false",
    userType: "U"
};

export default Header;
