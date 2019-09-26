import "./header.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "shared/helper/utils";
import constant from "shared/constant";
import cookie from "forsnap-cookie";
import redirect from "forsnap-redirect";

import Input from "shared/components/ui/input/Input";

import Icon from "desktop/resources/components/icon/Icon";
import PopDownContent from "desktop/resources/components/pop/popdown/PopDownContent";
import Badge from "desktop/resources/components/form/Badge";
import Profile from "desktop/resources/components/image/Profile";
import Buttons from "desktop/resources/components/button/Buttons";
import NotiftMenu from "desktop/resources/components/notify/NotifyMenu";
import siteDispatcher from "desktop/resources/components/siteDispatcher";

import PopModal from "shared/components/modal/PopModal";
import A from "shared/components/link/A";
import HeaderHelper from "./helper/helper";
import SubHeader from "./SubHeader";

const CUSTOMER_TYPE = {
    ENTERPRISE: "enterprise",
    NORMAL: "normal"
};

/**
 * @param navTitle - 네비 로고 옆 타이틀
 * @param theme - 네비 테마
 * @param static - 네비 컬러 고정여부 (true, false)
 */
class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navTitle: props.navTitle,
            // isScrollOver: false,
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
            enter: cookie.getCookies(constant.USER.ENTER),
            enter_session: sessionStorage.getItem(constant.USER.ENTER)
        };
        this.helper = new HeaderHelper();
        this.notifySearch = this.notifySearch.bind(this);
        this.searchResultFunc = this.searchResultFunc.bind(this);
        this.searchResultEnter = this.searchResultEnter.bind(this);
        // this.moveToLoginPage = this.moveToLoginPage.bind(this);
        this.getNotice = this.getNotice.bind(this);
        this.dispatcher = this.dispatcher.bind(this);
        this.changeProfileButton = this.changeProfileButton.bind(this);

        this.searchValue = this.searchValue.bind(this);
        this.onMain = this.onMain.bind(this);
    }

    componentWillMount() {
        const dispatcherId = siteDispatcher.register(this.dispatcher);
        this.state.dispatcherId = dispatcherId;
        // this.setReferrerData();
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        siteDispatcher.unregister(this.state.dispatcherId);
    }

    /**
     * 유입경로 분석을 위한 데이터를 저장한다.
     */
    // setReferrerData() {
    //     const referrer = document.referrer;
    //     if (referrer) {
    //         const data = utils.query.combineConsultToReferrer(referrer);
    //         const params = utils.query.setConsultParams({ ...data });
    //         this.setState({ ...params });
    //     }
    // }

    // 알림 가져오기
    getNotice() {
        this.setState({
            isProcessNotice: true
        }, () => {
            const { isArtist, noticeData } = this.state;
            this.getNoticeData(isArtist, noticeData);
        });
    }

    /**
     * 알림 가쳐오기 처리
     */
    getNoticeData(isArtist, noticeData) {
        const getNoticeData = this.helper.getNoticeData(isArtist, noticeData);
        getNoticeData.then(response => {
            this.setState({ ...response });
        }).catch(error => {
            PopModal.alert(error);
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
        // const enter = cookie.getCookies(constant.USER.ENTER);
        // const enter_session = sessionStorage.getItem(constant.USER.ENTER);

        if (keyword) {
            this.setState({
                isSearch: false
            });
            utils.ad.gaEvent("공통", "키워드검색", keyword);

            // 페이스북 픽셀 search 전환코드
            //utils.ad.fbqEvent("Search", { search_string: keyword });

            const url = `keyword=${utils.search.params(keyword)}`;
            // if (enter && enter_session) {
            //     url = `keyword=${utils.search.params(keyword)}&biz=true`;
            // }

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

    changeCustomerType(type) {
        //초기화
        cookie.removeCookie(constant.USER.ENTER);

        if (type === CUSTOMER_TYPE.ENTERPRISE) {
            sessionStorage.removeItem(constant.USER.ENTER);
            location.href = "/";
        } else {
            sessionStorage.setItem(constant.USER.ENTER, "indi");
            location.href = "/?enter=indi";
        }
    }

    // 헤더 오른쪽 UI만들기 (검색, 알림, 프로필)
    notifyContent() {
        const { enter, enter_session } = this.state;
        let chat;
        let profile;

        if (this.state.isLogin) {
            chat = (
                <PopDownContent
                    key="header-notify-chat"
                    target={<Badge data={{ count: this.state.noticeCount }}><Icon name="chat-black" /></Badge>}
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
                        {this.changeProfileButton(this.state.isArtist).map((obj, i) => {
                            return (<Buttons inline={{ title: obj.title, onClick: obj.resultFunc }} key={obj.title}>{obj.title}</Buttons>);
                        })}
                    </div>
                </PopDownContent>
            );
        } else {
            profile = <Buttons buttonStyle={{ size: "small", shape: "circle", theme: "default" }} inline={{ onClick: this.helper.moveToLoginPage }}>로그인 / 회원가입</Buttons>;
        }

        return (
            <div className="forsnav-notify">
                {(enter && enter_session) &&
                    <form className="notify-search" onMouseUp={this.notifySearch} onSubmit={this.searchResultEnter}>
                        <Icon name="search-black" />
                        <Input
                            className={this.state.isSearch ? "" : "hide"}
                            value={this.state.keyword}
                            max="15"
                            onChange={this.searchResultFunc}
                            onBlur={() => this.searchVisible(false)}
                        />
                    </form>
                }
                {chat}
                {profile}
            </div>
        );
    }

    redirectArtistsPage() {
        cookie.removeCookie(constant.USER.ENTER);
        sessionStorage.removeItem(constant.USER.ENTER);
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

        profileBtn.push({ title: "로그아웃", resultFunc: () => this.helper.onLogout() });

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
            }

            if (Object.keys(props).length > 0) {
                this.setState(props);
            }
        }
    }

    onMain(e) {
        e.preventDefault();
        const { enter, enter_session } = this.state;
        const node = e.currentTarget;
        const url = node.href;
        location.href = enter && enter_session ? "/?new=true" : url;
    }

    render() {
        const { enter, enter_session, isLogin, isArtist } = this.state;
        const isEnter = enter && enter_session;
        // const category = isEnter ? constant.BUSINESS.CATEGORY : constant.MAIN.CATEGORY;
        const categoryList = this.helper.setCategoryList(isEnter);
        const f_logo = "/common/f_logo.png";
        return (
            <header id="site-main-nav" className={classNames("forsnav")}>
                <div className="forsnav-layout">
                    <div className="container">
                        <div className="forsnav-container">
                            <a className="forsnav-logo" role="button" href="/" onClick={this.onMain}>
                                <img src={`${__SERVER__.img}${f_logo}`} alt="forsnap_logo" />
                                <span className="sr-only">FORSNAP</span>
                            </a>
                            {!location.pathname.startsWith("/artists") ?
                                <div className="forsnav-customer-button">
                                    <span className={classNames({ "select_text": !isEnter })} onClick={() => this.changeCustomerType(CUSTOMER_TYPE.ENTERPRISE)}>기업</span>
                                    <span className={classNames({ "select_text": isEnter })} onClick={() => this.changeCustomerType(CUSTOMER_TYPE.NORMAL)}>개인</span>
                                </div> : null
                            }
                            <div className="forsnav-content-right">
                                {this.notifyContent()}
                            </div>
                        </div>
                    </div>
                </div>
                {!location.pathname.startsWith("/users/") && !location.pathname.startsWith("/policy/") ?
                    <SubHeader categoryList={categoryList} category={this.props.category} isArtist={isArtist} enter={isEnter} isLogin={isLogin} /> : null
                }
            </header>
        );
    }
}

Header.propTypes = {
    navTitle: PropTypes.string,
    userType: PropTypes.oneOf(["U", "A"])
};

Header.defaultProps = {
    navTitle: "",
    userType: "U"
};

export default Header;
