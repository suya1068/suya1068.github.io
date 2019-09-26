import "./ProductsDetailPage.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import API from "forsnap-api";
import utils from "forsnap-utils";
import redirect from "forsnap-redirect";
import auth from "forsnap-authentication";
import cookie from "forsnap-cookie";

import CONST from "shared/constant";
import PopModal from "shared/components/modal/PopModal";
import A from "shared/components/link/A";
// import UserCheck from "shared/helper/UserCheck";

import Input from "desktop/resources/components/form/Input";
import Buttons from "desktop/resources/components/button/Buttons";
import Icon from "desktop/resources/components/icon/Icon";
import PopDownContent from "desktop/resources/components/pop/popdown/PopDownContent";
import Profile from "desktop/resources/components/image/Profile";
import Heart from "desktop/resources/components/form/Heart";
import ImageSlider from "desktop/resources/components/image/ImageSlider";
import Qty from "desktop/resources/components/form/Qty";
import Checkbox from "desktop/resources/components/form/Checkbox";
import PopupProductPayment from "desktop/resources/components/pop/popup/PopupProductPayment";

import ProductPackageReview from "mobile/resources/views/products/package/components/ProductPackageReview";

import PortfolioList from "./components/PortfolioList";
import ProductsPackage from "./components/ProductsPackage";
import ProductsOptions from "./components/ProductsOptions";
import ProductsArtist from "./components/ProductsArtist";
import ProductsRecommend from "./components/ProductsRecommend";
import ArtistanotherProducts from "./components/ArtistanotherProducts";
import ProductsTop from "./components/ProductsTop";
import ProductsVideo from "./components/ProductsVideo";
import TabContainer from "./components/tab/TabContainer";
import ProductOldOption from "./components/option/ProductOldOption";

export default class ProductsDetailPage extends Component {
    constructor(props) {
        super(props);

        const search = location.search;

        this.state = {
            data: props.data,
            limit: 6,                   // 후기 보여줄 갯수
            offset: 0,                  // 후기 offset
            page: 1,
            reviewLimit: 3,
            reviewCount: 0,
            totalCnt: 0,
            detailHeight: 0,
            isProcess: false,
            enter: cookie.getCookies(CONST.USER.ENTER),
            category: props.data.category,
            search_param: search ? utils.query.parse(search) : {}
        };
        // this.UserCheck = new UserCheck();
        this.onShare = this.onShare.bind(this);
        this.onCopy = this.onCopy.bind(this);
        this.onLike = this.onLike.bind(this);
        this.onSelectPackage = this.onSelectPackage.bind(this);
        this.onSelectOption = this.onSelectOption.bind(this);
        this.onRemoveOption = this.onRemoveOption.bind(this);
        this.onChangePackageCount = this.onChangePackageCount.bind(this);
        this.onChangeCount = this.onChangeCount.bind(this);
        this.onReserve = this.onReserve.bind(this);
        this.onMoreContent = this.onMoreContent.bind(this);
        this.onMoreReview = this.onMoreReview.bind(this);

        this.setProgress = this.setProgress.bind(this);
        this.getTotalPrice = this.getTotalPrice.bind(this);

        this.isLogin = this.isLogin.bind(this);
        this.createForsnapUUID = this.createForsnapUUID.bind(this);
        this.checkUser = this.checkUser.bind(this);

        this.renderReview = this.renderReview.bind(this);

        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        const { limit, offset, data } = this.state;

        const totalCnt = data.review.total_cnt;
        const { portfolio, review, recomm_list, blog_list } = data;
        let reviewCount = 0;

        // page view count 를 위한 요청
        if (!cookie.getCookies(CONST.FORSNAP_UUID)) {
            data.view_cnt = `${Number(data.view_cnt) + 1}`;
            this.createForsnapUUID(data.product_no);
        }

        const portfolioData = {
            title: data.title,
            portfolio_cnt: data.portfolio_cnt,
            product_no: data.product_no,
            category: data.category,
            profile_img: data.profile_img,
            nick_name: data.nick_name,
            no: data.product_no,
            viewType: "portfolio"
        };

        const { extra_option, custom_option } = data;
        let packageList = data.package || [];
        let extraList = [];

        if (utils.isArray(extra_option)) {
            const list = extra_option.reduce((rs, ex) => {
                rs.push({
                    ...ex,
                    total_price: 0,
                    count: 0
                });

                return rs;
            }, []);

            extraList = extraList.concat(list);
        }

        if (utils.isArray(custom_option)) {
            const customList = custom_option.reduce((rs, c) => {
                if (c.price && c.price !== 0) {
                    rs.push({
                        ...c,
                        code: `custom-option-${c.custom_no}`,
                        total_price: 0,
                        count: 0
                    });
                }

                return rs;
            }, []);

            extraList = extraList.concat(customList);
        }

        if (utils.isArray(packageList)) {
            let index = 0;
            let price = null;
            packageList = packageList.reduce((rs, p, i) => {
                if (price === null || Number(p.price) < price) {
                    price = p.price;
                    index = i;
                }

                if (utils.isArray(extraList)) {
                    if (!extraList.find(o => (o.code === ""))) {
                        extraList.unshift({
                            title: "추가옵션을 선택해주세요",
                            code: ""
                        });
                    }
                }

                p.optionList = extraList.slice();
                p.count = 1;
                p.total_price = p.price;
                p.category = data.category;
                rs.push(p);
                return rs;
            }, []);

            if (packageList[index]) {
                packageList[index].selected = true;
            }
        } else if (utils.isArray(data.option)) {
            const options = data.option;
            let index = 0;
            let price = null;
            options.map((o, i) => {
                if (price === null || Number(o.price) < price) {
                    price = o.price;
                    index = i;
                }
                return null;
            });

            if (data.option[index]) {
                data.option[index].selected = true;
            }
        }

        if (data.review) {
            reviewCount = data.review.list.reduce((rs, rv) => {
                if (rv.user_type === "U") {
                    rs += 1;
                }

                return rs;
            }, 0);
        }

        this.setState({
            data,
            status,
            isLike: data.is_like === "Y",
            page: Math.floor(offset / limit) + 1,
            totalCnt,
            portfolioData,
            packageList,
            reviewCount,
            isPortfolio: utils.isArray(portfolio.list),
            isRecomm: utils.isArray(recomm_list.list),
            isBlog: utils.isArray(blog_list.list),
            isReview: utils.isArray(review.list)
        });
    }

    componentDidMount() {
        const { data } = this.state;
        //utils.ad.fbqEvent("ViewContent", { content_name: `${data.product_no} / ${data.title}` });
        this.checkUser();

        setTimeout(() => {
            if (this.refDetailContent) {
                let height = this.refDetailContent.offsetHeight;

                if (height > 300) {
                    height = 300;
                }

                this.setState({
                    detailHeight: height
                });
            }
        }, 400);
    }

    onMouseEnter(e) {
        e.stopPropagation();
        e.preventDefault();
        const target = e.currentTarget;
        target.classList.add("active");
    }

    onMouseLeave(e) {
        e.stopPropagation();
        e.preventDefault();
        const target = e.currentTarget;
        target.classList.remove("active");
    }

    onShare(type) {
        let sns;
        let params;

        switch (type) {
            case "naver": {
                sns = __SNS__.naver;
                params = {
                    url: location.href,
                    title: document.querySelector("meta[property='og:title']").getAttribute("content")
                };
                break;
            }
            case "facebook":
                sns = __SNS__.facebook;
                params = {
                    app_id: sns.client_id,
                    display: "popup",
                    href: location.href
                };
                break;
            default:
                break;
        }

        const options = "titlebar=1, resizable=1, scrollbars=yes, width=600, height=550";
        window.open(`${sns.share_uri}?${utils.query.stringify(params)}`, "sharePopup", options);
    }

    onCopy() {
        let state = true;
        try {
            window.getSelection().removeAllRanges();

            const text = document.getElementById("copyText");
            const range = document.createRange();
            range.selectNode(text);
            window.getSelection().addRange(range);

            document.execCommand("copy");

            window.getSelection().removeAllRanges();
        } catch (error) {
            state = false;
        }

        PopModal.alert(state ? "URL이 복사되었습니다." : "지원하지 않는 브라우저입니다.");
    }

    /**
     * 하트를 등록 또는 취소한다.
     */
    onLike() {
        const { data, isLike } = this.state;
        const user = this.isLogin();

        if (data && user) {
            const process = b => {
                const params = [
                    user.id,
                    data.product_no
                ];

                if (!b) {
                    // window.fbq("track", "AddToWishlist");
                    //utils.ad.fbqEvent("AddToWishlist", { content_name: data.title, content_category: data.category });
                    PopModal.toast("하트 상품은 <br /> 마이페이지 > 내 하트 목록<br />에서 확인가능합니다.");
                    return API.users.like(...params);
                }
                PopModal.toast("하트를 취소하셨습니다.", 1000);
                return API.users.unlike(...params);
            };

            process(isLike).then(response => {
                data.like_cnt = response.data.like_cnt;
                this.setState({
                    isLike: !isLike,
                    data
                });
            }).catch(error => PopModal.alert(error.data));
        }
    }

    onSelectPackage(no) {
        const { packageList } = this.state;

        const result = packageList.reduce((resultPackage, p, i) => {
            const selected = i === no;
            p.selected = selected;

            // if (!selected) {
            //     p.optionList.reduce((resultOption, o) => {
            //         o.selected = false;
            //         o.count = 0;
            //         o.total_price = o.price;
            //         resultOption.push(o);
            //         return resultOption;
            //     }, []);
            // }

            resultPackage.push(p);
            return resultPackage;
        }, []);

        this.setState({
            packageList: result
        });
    }

    onSelectOption(code, checked = true) {
        const { packageList } = this.state;

        if (utils.isArray(packageList)) {
            const pkg = packageList.find(p => (p.selected));

            if (pkg && code) {
                const item = pkg.optionList.find(o => (o.code === code));

                if (item) {
                    if (checked && item.selected !== checked) {
                        item.count = 1;
                    } else if (!checked) {
                        item.count = 0;
                    }
                    item.total_price = item.count * item.price;
                    item.selected = checked;

                    this.setState({
                        packageList
                    });
                }
            }
        }
    }

    onRemoveOption(code) {
        const { packageList } = this.state;

        if (utils.isArray(packageList)) {
            const pkg = packageList.find(p => (p.selected));

            if (pkg) {
                const item = pkg.optionList.find(o => (o.code === code));

                if (item) {
                    item.selected = false;
                    item.count = 0;
                    item.total_price = 0;
                }

                this.setState({
                    packageList
                });
            }
        }
    }

    onChangePackageCount(num) {
        const { packageList } = this.state;

        if (utils.isArray(packageList)) {
            const pkg = packageList.find(p => (p.selected));

            if (pkg) {
                pkg.count = num;
                pkg.total_price = num > 0 ? pkg.price * num : 0;

                this.setState({
                    packageList
                });
            }
        }
    }

    onChangeCount(num, code) {
        const { packageList } = this.state;

        if (utils.isArray(packageList)) {
            const pkg = packageList.find(p => (p.selected));

            if (pkg) {
                const item = pkg.optionList.find(o => (o.code === code));

                if (item) {
                    if (!item.selected && num > 0) {
                        item.selected = true;
                    } else if (item.selected && num < 1) {
                        item.selected = false;
                    }

                    item.count = num;
                    item.total_price = num > 0 ? item.price * num : 0;
                }

                this.setState({
                    packageList
                });
            }
        }
    }

    onReserve(g_data) {
        const { data, packageList, name, phone, email } = this.state;
        const { product_no, calendar, title, nick_name } = data;
        const user = auth.getUser();

        this.gaEvent("예약&결제", `작가명: ${nick_name} / 상품번호: ${product_no} / 상품명: ${title}`);

        if (user) {
            const prop = {
                name,
                email,
                phone,
                title,
                calendar,
                product_no
            };

            prop.packageList = packageList;
            const totalPrice = this.getTotalPrice();
            const pkg = packageList.find(p => (p.selected));

            if (pkg && totalPrice < pkg.min_price) {
                PopModal.alert(`${utils.format.price(pkg.min_price)}원 이상 진행 가능한 상품입니다.`);
            } else {
                const modalName = "popup_payment";
                PopModal.createModal(modalName, <PopupProductPayment data={prop} gaData={g_data} />, {});
                PopModal.show(modalName);
            }
        } else {
            PopModal.alert("로그인후 이용해주세요", {
                callBack: () => {
                    redirect.login({ redirectURL: location.pathname });
                }
            });
        }
    }

    /**
     * 상품상세 ga이벤트
     * @param eAction
     * @param eLabel
     */
    gaEvent(eAction, eLabel = "", renew = false) {
        /**
         * 상품상세 컴포넌트에서 발생하는 ga이벤트
         * - 설명더보기
         * - 후기더보기
         * - 포트폴리오
         * - 작가정보보기
         * - 추천상품
         * - 작가의 다른상품
         * - 예약&결제
         * - 1:1문의
         * - 카카오톡
         */
        const { data, search_param } = this.state;

        let _label = eLabel;

        if (renew) {
            _label = `${data.category}_${data.nick_name}_${data.product_no}`;
        }

        if (!utils.type.isEmpty(search_param) && search_param.utm_source && search_param.utm_source === "fb_ad") {
            utils.ad.gaEvent("페이스북광고_개인", search_param.utm_content || "", eAction);
        }
        utils.ad.gaEvent("개인_상세", eAction, _label);
    }

    onMoreContent() {
        const { detailHeight } = this.state;

        if (this.refDetailContent) {
            let height = this.refDetailContent.offsetHeight;
            if (detailHeight > 300) {
                height = 300;
            } else {
                this.gaEvent("설명 더보기", "", true);
            }

            this.setState({
                detailHeight: height
            });
        }
    }

    onMoreReview() {
        if (!this.state.isProcess) {
            this.setProgress(true);
            this.gaEvent("후기더보기", "", true);
            const { data, reviewLimit } = this.state;
            let reviewCount = this.state.reviewCount;
            const review = data.review;
            API.products.queryComments(data.product_no, reviewLimit, reviewCount).then(response => {
                this.setProgress(false);
                if (response.status === 200) {
                    const rsData = response.data;

                    const merge = utils.mergeArrayTypeObject(review.list, rsData.list, ["review_no"]);
                    reviewCount += merge.newList.reduce((rs, rv) => {
                        if (rv.user_type === "U") {
                            rs += 1;
                        }
                        return rs;
                    }, 0);
                    review.list = merge.list;
                    review.total_cnt = rsData.total_cnt;

                    this.setState({
                        data,
                        reviewCount
                    });
                }
            }).catch(error => {
                this.setProgress(false);
                if (error && error.data) {
                    PopModal.alert(error.data);
                } else {
                    PopModal.alert("후기를 가져오지 못했습니다.\n잠시후 다시 시도해주세요.");
                }
            });
        }
    }

    /**
     * 백그라운드 프로그래스
     * @param b
     */
    setProgress(b) {
        this.state.isProcess = b;

        if (b) {
            PopModal.progress();
        } else {
            PopModal.closeProgress();
        }
    }

    getTotalPrice() {
        const { packageList } = this.state;
        let totalPrice = 0;

        if (utils.isArray(packageList)) {
            totalPrice = packageList.reduce((tot, p) => {
                if (p.selected) {
                    tot = Number(p.total_price) || 0;
                    if (utils.isArray(p.optionList)) {
                        p.optionList.reduce((rs, o) => {
                            if (!o.code) {
                                return rs;
                            }

                            tot += o.total_price;
                            return rs;
                        }, null);
                    }
                }

                return tot;
            }, 0);
        }

        return totalPrice;
    }

    isLogin() {
        const user = auth.getUser();

        if (user) {
            return user;
        }

        PopModal.alert("로그인 후 이용해주세요");
        return false;
    }

    /**
     * 쿠키에 UUID가 존재하는지 판단한다.
     * UUID가 없을 경우, UUID를 생성하고, 상품 상세 정보를 요청한다.
     * @param productNo
     */
    createForsnapUUID(productNo) {
        if (!cookie.getCookies(CONST.FORSNAP_UUID)) {
            const uuid = utils.getUUID().replace(/-/g, "");
            const d = new Date();
            d.setYear(d.getFullYear() + 1);

            cookie.setCookie({ [CONST.FORSNAP_UUID]: uuid }, d.toUTCString());

            API.products.queryProductInfo(productNo, { uuid });
        }
    }

    /**
     * 유저 정보 체크
     */
    checkUser() {
        const user = auth.getUser();

        if (user) {
            API.users.find(user.id).then(response => {
                if (response.status === 200) {
                    const data = response.data;
                    this.setState({
                        name: data.name || "",
                        email: data.email || "",
                        phone: data.phone || ""
                    });
                }
            });
        }
    }

    /**
     * 후기 렌더
     */
    renderReview(review) {
        const { list } = review;

        const content = (
            list.map((obj, idx) => {
                const { user_type, profile_img, rating_avg, reg_dt, review_img, comment, name } = obj;
                let review_photos;
                let reviewImg;
                let userContent;

                if (review_img) {
                    reviewImg = review_img.reduce((result, src) => {
                        if (src) {
                            result.push({ src });
                            // result.push({ src, content_width: 680, content_height: 345 });
                        }
                        return result;
                    }, []);

                    if (reviewImg.length > 0) {
                        review_photos = (
                            <div className="imageSlide">
                                <ImageSlider data={{ images: reviewImg, crop: false, imageCrop: false, imageResize: true, arrow: { posX: 0 }, nav: { position: "bottom" } }} />
                            </div>
                        );
                    }
                }

                if (user_type === "U") {
                    userContent = (
                        <div className="review-user row">
                            <div className="profile pull-left columns col-2">
                                <Profile image={{ src: `${profile_img}` }} />
                            </div>
                            <div className="content columns col-7">
                                <div className="top">
                                    <p>{name}</p>
                                </div>
                                <div className="text"><p>{utils.linebreak(comment)}</p></div>
                                <div className="day">{reg_dt}</div>
                            </div>
                            <div className="heart pull-right">
                                <Heart count={rating_avg} disabled="disabled" />
                            </div>
                        </div>
                    );
                } else {
                    userContent = (
                        <div className="review-artists row" key={`artistComm__${obj.review_no}`}>
                            <div className="profile pull-left columns col-2" />
                            <div className="content columns col-8">
                                <div className="artistsComment">
                                    <p className="name">{`${name} 님의 댓글`}</p>
                                    <p className="comment">{utils.linebreak(comment)}</p>
                                    <p className="regDate">{reg_dt}</p>
                                </div>
                            </div>
                        </div>
                    );
                }

                const nextObj = list[idx + 1];
                let isComment = false;
                if (nextObj) {
                    if (nextObj.user_type === "A") {
                        isComment = true;
                    }
                }

                return (
                    <div className={classNames("review-panel", { "comment": isComment })} key={`product_review__${obj.review_no}`}>
                        {review_photos}
                        <div className="panel_unit">
                            {userContent}
                        </div>
                    </div>
                );
            })
        );

        return content;
    }
    render() {
        const {
            data,
            status,
            isLike,
            name,
            email,
            phone,
            packageList,
            portfolioData,
            isPortfolio,
            isRecomm,
            isBlog,
            isReview,
            detailHeight,
            reviewCount,
            enter,
            search_param
            // referer_keyword,
            // referer
        } = this.state;

        const { category, portfolio, portfolio_video, main_img, review, recomm_list, blog_list, tag } = data;
        const isVideo = ["VIDEO", "VIDEO_BIZ"].indexOf(category) !== -1;
        let totalPrice = null;
        let portfolioCnt = Number(portfolio ? portfolio.total_cnt : 0);

        if (isVideo && portfolio_video) {
            portfolioCnt += Number(portfolio_video.total_cnt);
        }

        const gaData = {
            label: "결제전환"
        };

        if (!utils.type.isEmpty(search_param)) {
            if (search_param.utm_source && search_param.utm_source === "fb_ad") sessionStorage.setItem("facebook_ad_content", search_param.utm_content);
            // if (search_param.inflow && search_param.inflow === "naver-indi" && search_param.NaPm) );
        }

        if (sessionStorage && sessionStorage.getItem("referer")) {
            if (sessionStorage.getItem("referer") === "facebook_ad" && sessionStorage.getItem("facebook_ad_content")) {
                gaData.referer = sessionStorage.getItem("referer");
                gaData.action = sessionStorage.getItem("facebook_ad_content");
                gaData.category = "페이스북광고_개인";
            }

            if (sessionStorage.getItem("referer") === "naver_shopping") {
                gaData.referer = sessionStorage.getItem("referer");
                gaData.action = data.product_no;
                // gaData.action = sessionStorage.getItem("naver_ad_content") || data.product_no;
                gaData.category = "네이버쇼핑_개인";
            }
        }

        return (
            <div className="products__detail">
                <h1 className="sr-only">{`${data.nick_name} - ${data.title}`}</h1>
                <div className="layout__header">
                    <div className="container product_gnb">
                        <a href="/">
                            <span onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} className={classNames("gnb_home")}>포스냅 홈</span>
                        </a>
                        <span className="gt">&gt;</span>
                        <A href={`/products?category=${data.category}`}>
                            <span onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} className="gnb_home">{data.category_name}</span>
                        </A>
                        <span className="gt">&gt;</span>
                        <span className="gnb_category">{data.title}</span>
                    </div>
                </div>
                <div className="layout__body" style={{ paddingTop: data.category ? 0 : null }}>
                    <div className="layout__body__main">
                        <ProductsTop category={category} portfolio={portfolio} main_img={main_img} />
                        <div className="products__detail__title">
                            <div className="content">
                                <h1 className="content__header">{data.title}</h1>
                            </div>
                            <div className="more__button">
                                <PopDownContent target={<button className="share__button"><Icon name="share" /></button>} align="left">
                                    <div className="share__social">
                                        <button type="button" className="share__brand" onClick={() => this.onShare("naver")}>
                                            <div className="share-brand__icon"><Icon name={"naver"} /></div>
                                            <div className="share-brand__text">네이버</div>
                                        </button>
                                        <button type="button" className="share__brand" onClick={() => this.onShare("facebook")}>
                                            <div className="share-brand__icon"><Icon name={"facebook_c"} /></div>
                                            <div className="share-brand__text">페이스북</div>
                                        </button>
                                    </div>
                                    <div className="share__social__copy">
                                        <Input inputStyle={{ size: "small", width: "block" }} inline={{ id: "copyText", value: location.href }} disabled="disabled" />
                                        <Buttons buttonStyle={{ size: "small", shape: "circle", theme: "bg-lightgray" }} inline={{ onClick: this.onCopy }}>복사</Buttons>
                                    </div>
                                </PopDownContent>
                                <button className="heart__button" onClick={this.onLike}>
                                    <Icon name="pink_heart" active={isLike ? "active" : ""} />
                                </button>
                            </div>
                        </div>
                        {data.artist_product_list && utils.isArray(data.artist_product_list.list) ?
                            <div className="products__detail__content">
                                <ArtistanotherProducts list={data.artist_product_list.list} category={category} nick_name={data.nick_name} gaEvent={this.gaEvent} />
                            </div> : null
                        }
                        <div className="products__detail__content__extend-tab">
                            <div className="extend-tab__wrap">
                                <TabContainer />
                                <div className="tab-clone" />
                                <div className="products__detail__content" id="test">
                                    <div className="content-wrap" id="info">
                                        <h2 className="content__header">상품 설명</h2>
                                        <div className="content">
                                            <div style={{ overflow: "hidden", height: `${detailHeight}px`, transition: "height 0.6s" }}>
                                                <div ref={ref => (this.refDetailContent = ref)}>
                                                    {utils.linebreak((data && data.content) || "")}
                                                </div>
                                            </div>
                                            {detailHeight >= 300 ?
                                                <button className="f__button" onClick={this.onMoreContent} style={{ margin: "0 0 0 auto" }}>{detailHeight === 300 ? "설명 더보기" : "설명 접기"}</button> : null
                                            }
                                        </div>
                                        {!utils.checkCategoryForEnter(category) &&
                                        <div className="content-inline">
                                            <h2 className="content__header">예약 확인</h2>
                                            <div className="content">세부사항 관련 조율은 1:1문의로 문의해주세요.</div>
                                        </div>
                                        }
                                        <div className="content-inline">
                                            <h2 className="content__header">태그</h2>
                                            <div className="content products__tags">
                                                {
                                                    tag.map((t, i) => (
                                                        <A key={`tag-${i}`} className="_button" style={{ borderRadius: 5, padding: 10, marginRight: 10 }} value={`#${t}`} role="button" href={`/products?tag=${t}`}>#{t}</A>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content-wrap" id="portfolio">
                                        <h2 className="content__header">포트폴리오 <span className="count">{portfolioCnt}</span></h2>
                                        {isVideo ?
                                            <div className="content"><ProductsVideo data={portfolio_video.list} total_cnt={portfolio_video.total_cnt} /></div> : null
                                        }
                                        {portfolio && utils.isArray(portfolio.list) ?
                                            <div className="content"><PortfolioList list={portfolio.list} data={portfolioData} category={data.category} gaEvent={this.gaEvent} /></div> : null
                                        }
                                    </div>
                                    <div className="content-wrap" id="price">
                                        {packageList.length > 0 && packageList.map((p, i) => {
                                            const isExcept = ["PRODUCT", "FOOD", "FASHION"].indexOf(p.category) !== -1;
                                            if (p.selected) {
                                                totalPrice = Number(p.total_price) || 0;
                                            }

                                            return [
                                                <div key={`products-options-${i}`} className={classNames("products__options__item", { show: p.selected })}>
                                                    <div className="option__title" onClick={() => this.onSelectPackage(i)}>
                                                        <span className="title">{p.title}</span>
                                                        <span className="price">
                                                            {p.category === "MODEL" && <span style={{ marginRight: 5 }}>최소진행금액</span>}
                                                            <span className="won">₩</span>{utils.format.price(p.price)}
                                                        </span>
                                                        <span className="arrow"><Icon name="dt" /></span>
                                                    </div>
                                                    <div className="option__detail">
                                                        {p.category !== "DRESS_RENT" && p.category !== "MODEL" ?
                                                            <div className="option__info">
                                                                {p.photo_cnt ?
                                                                    <div className="info__item">
                                                                        <div className="title"><icon className="f__icon__opt_print" />이미지</div>
                                                                        <div className="content">{utils.format.price(p.photo_cnt)} 장</div>
                                                                    </div> : null
                                                                }
                                                                {p.custom_cnt ?
                                                                    <div className="info__item">
                                                                        <div className="title"><icon className="f__icon__opt_custom" />보정</div>
                                                                        <div className="content">{p.custom_cnt > 0 ? `${utils.format.price(p.custom_cnt)} 장` : "없음"}</div>
                                                                    </div> : null
                                                                }
                                                                {p.photo_time ?
                                                                    <div className="info__item">
                                                                        <div className="title"><icon className="f__icon__opt_origin" />촬영시간</div>
                                                                        <div className="content">{p.photo_time === "MAX" ? "300분 이상" : `${p.photo_time || "-"} 분`}</div>
                                                                    </div> : null
                                                                }
                                                                {p.min_price || p.min_price === 0 ?
                                                                    <div key="package-min-price" className="info__item">
                                                                        <div className="title">최소진행금액</div>
                                                                        <div className="content">{`${utils.format.price(p.min_price)}원` || "없음"}</div>
                                                                    </div> : null
                                                                }
                                                                {p.running_time ?
                                                                    <div key="package-min-price" className="info__item">
                                                                        <div className="title">러닝타임</div>
                                                                        <div className="content">{`${p.running_time || "-"} 분`}</div>
                                                                    </div> : null
                                                                }
                                                            </div> : null
                                                        }
                                                        <div className="option__content">
                                                            {utils.linebreak(p.content || "")}
                                                        </div>
                                                        {p.category !== "MODEL" &&
                                                        <div className="option__info">
                                                            <div className="info__basic">
                                                                <div className="title"><icon className="f__icon__calendar_s" />{p.category === "DRESS_RENT" ? "대여기간" : "작업일"}</div>
                                                                <div className="content" style={{ margin: "0 0 0 10px" }}>{p.complete_period} 일</div>
                                                                {isExcept ?
                                                                    <div className="qty">
                                                                        <Qty count={p.count || 1} min={1} max={9999} resultFunc={num => this.onChangePackageCount(num)} />
                                                                    </div> : null
                                                                }
                                                            </div>
                                                        </div>
                                                        }
                                                    </div>
                                                </div>,
                                                p.selected ? [
                                                    utils.isArray(p.optionList) ?
                                                        <div key={`products-options-list-${i}`} className="products__options__checkbox">
                                                            {p.optionList.map(o => {
                                                                if (!o.code) {
                                                                    return null;
                                                                }

                                                                const exItem = CONST.PACKAGE.EXTRA_OPTION.find(constEx => {
                                                                    return constEx.code === o.code;
                                                                });
                                                                const content = exItem ? exItem.user_tooltip || "" : o.content;

                                                                totalPrice += o.total_price;
                                                                return (
                                                                    <div key={`option-select-${o.code}`} className="products__options__checkbox__item">
                                                                        <div>
                                                                            <div className="title">
                                                                                <Checkbox checked={o.selected} type="yellow_small" resultFunc={value => this.onSelectOption(o.code, value)}>{o.title}</Checkbox>
                                                                                {content ?
                                                                                    <div className="tool__tip">
                                                                                        ?
                                                                                        <div className="tool__tip__content">
                                                                                            <span className="tool__tip__arrow" />
                                                                                            {utils.linebreak(content)}
                                                                                        </div>
                                                                                    </div> : null
                                                                                }
                                                                            </div>
                                                                            <div className="price">
                                                                                <span><span className="won">₩</span>{utils.format.price(o.price)}</span>
                                                                            </div>
                                                                            <div className="qty">
                                                                                <Qty count={o.count || 0} min={0} max={9999} resultFunc={num => this.onChangeCount(num, o.code)} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div> : null,
                                                    <button className="_button _button__block _button__fill__yellow" onClick={() => this.onReserve(gaData)}>₩ {utils.format.price(totalPrice)} 예약&결제하기</button>
                                                ] : null
                                            ];
                                        })}
                                        {packageList.length < 1 && data.option.length > 0 &&
                                            <ProductOldOption data={{ ...data, name, email, phone }} gaEvent={this.gaEvent} gaData={gaData} />
                                        }
                                    </div>
                                    <div className="content-wrap" id="review">
                                        {isReview ?
                                            <div className="products__detail__review">
                                                <div>
                                                    <div className="review__container">
                                                        <div className="layer">
                                                            <div className="layer__container">
                                                                <ProductPackageReview data={{ ...review, rating_avg: data.rating_avg, product_no: data.product_no }} isHeader />
                                                            </div>
                                                        </div>
                                                        {reviewCount < review.total_cnt ? <button className="f__button" onClick={this.onMoreReview} style={{ width: "100%" }}>후기 더보기</button> : null}
                                                    </div>
                                                </div>
                                            </div> : null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="layout__body__side__right">
                        <div className="products__sidebar">
                            {utils.isArray(packageList) ?
                                <ProductsPackage
                                    packageList={packageList}
                                    data={data}
                                    onSelectPackage={this.onSelectPackage}
                                    onSelectOption={this.onSelectOption}
                                    onRemoveOption={this.onRemoveOption}
                                    onChangePackageCount={this.onChangePackageCount}
                                    onChangeCount={this.onChangeCount}
                                    onReserve={() => this.onReserve(gaData)}
                                /> : <ProductsOptions data={{ ...data, name, email, phone }} gaEvent={this.gaEvent} gaData={gaData} />
                            }
                            <ProductsArtist data={{ ...data, phone, IFSideBar: { checkUser: this.checkUser }, category }} gaEvent={this.gaEvent} />
                        </div>
                    </div>
                </div>
                <div className="layout__footer">
                    <ProductsRecommend list={recomm_list.list} gaEvent={this.gaEvent} />
                </div>
            </div>
        );
    }
}
