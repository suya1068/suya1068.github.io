import "./ProductPackage.scss";
import "desktop/resources/scss/base/_icon.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import API from "forsnap-api";
import cookie from "forsnap-cookie";
import utils from "forsnap-utils";
import redirect from "forsnap-redirect";
import auth from "forsnap-authentication";

import constant from "shared/constant";
import Img from "shared/components/image/Img";
import PopDownContent from "shared/components/popdown/PopDownContent";
import PopModal from "shared/components/modal/PopModal";
import PlusItem from "shared/components/chat/components/PlusItem";
import UserCheck from "shared/helper/UserCheck";

import DropDown from "shared/components/ui/dropdown/DropDown";

import Qty from "desktop/resources/components/form/Qty";

import { Footer } from "mobile/resources/containers/layout";
import PopupSendChat from "mobile/resources/components/popup/PopupSendChat";
import PopupProductPayment from "mobile/resources/components/popup/PopupProductPayment";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

import ProductPackageReview from "./components/ProductPackageReview";
import PortfolioList from "./components/PortfolioList_BK";
import ProductsRecommend from "./components/ProductsRecommend";
import ArtistanotherProducts from "./components/ArtistanotherProducts";
import ProductsPayment from "./components/ProductsPayment";
import ProductArtist from "./components/ProductArtist";
import ProductsVideo from "./components/ProductsVideo";

class ProductPackage extends Component {
    constructor(props) {
        super(props);
        const search = location.search;

        this.state = {
            isProcess: false,
            data: props.data,
            reviewLimit: 3,
            reviewCount: 0,
            isQuick: false,
            activeTab: "",
            detailHeight: 0,
            enter: cookie.getCookies(constant.USER.ENTER),
            selectExtraOption: "",
            phone: "",
            search_param: search ? utils.query.parse(search) : {}
        };
        this.UserCheck = new UserCheck();
        this.onScroll = this.onScroll.bind(this);
        this.onCopy = this.onCopy.bind(this);
        this.onShare = this.onShare.bind(this);
        this.onLike = this.onLike.bind(this);
        this.onSelectPackage = this.onSelectPackage.bind(this);
        this.onSelectOption = this.onSelectOption.bind(this);
        this.onSelectExtra = this.onSelectExtra.bind(this);
        this.onRemoveExtra = this.onRemoveExtra.bind(this);
        this.onChangePackageCount = this.onChangePackageCount.bind(this);
        this.onChangeCount = this.onChangeCount.bind(this);
        this.onChat = this.onChat.bind(this);
        this.onTab = this.onTab.bind(this);
        this.onMoreContent = this.onMoreContent.bind(this);
        this.onMoreReview = this.onMoreReview.bind(this);
        this.onQuickMessage = this.onQuickMessage.bind(this);
        this.onReserve = this.onReserve.bind(this);

        this.setProgress = this.setProgress.bind(this);
        this.getTotalPrice = this.getTotalPrice.bind(this);

        // this.isUser = this.isUser.bind(this);
        this.createForsnapUUID = this.createForsnapUUID.bind(this);
        this.checkPhone = this.checkPhone.bind(this);
        // this.blogReview = this.blogReview.bind(this);
        // this.setReferrerData = this.setReferrerData.bind(this);
        this.gaEvent = this.gaEvent.bind(this);

        if (window.Kakao) {
            // 상용
            window.Kakao.init("0f3f2a76a0b596812e6cac5b79b6a9f8");

            // 개발
            // window.Kakao.init("2e50b5025b866909ce06c3fdd8dd9425");
        }
    }

    componentWillMount() {
        const { data, search_param } = this.state;
        const { portfolio } = data;
        const portfolioData = {
            no: data.product_no,
            title: data.title,
            total_cnt: data.total_cnt,
            nick_name: data.nick_name,
            profile_img: data.profile_img,
            product_no: data.product_no
        };
        const mainSlider = [];
        const { extra_option, custom_option } = data;
        let packageList = data.package || [];
        let extraList = [];
        let reviewCount = 0;
        const artistInfo = {
            nick_name: data.nick_name,
            is_crop: data.is_corp,
            profile_img: data.profile_img,
            artist_about: data.intro,
            product_count: data.artist_product_list ? (Number(data.artist_product_list.total_cnt) || 0) + 1 : 0,
            review_count: data.review ? data.review.total_cnt || 0 : 0,
            heart_count: data.like_cnt
        };

        window.addEventListener("scroll", this.onScroll, false);

        // page view count 를 위한 요청
        if (!cookie.getCookies(constant.FORSNAP_UUID)) {
            data.view_cnt = `${Number(data.view_cnt) + 1}`;
            this.createForsnapUUID(data.product_no);
        }

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
            const list = custom_option.reduce((rs, c) => {
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

            extraList = extraList.concat(list);
        }

        if (utils.isArray(packageList)) {
            let index = 0;
            let price = null;

            if (utils.isArray(extraList)) {
                if (!extraList.find(o => (o.code === ""))) {
                    extraList.unshift({
                        title: "추가옵션을 선택해주세요",
                        code: ""
                    });
                }
            }

            packageList = packageList.reduce((rs, p, i) => {
                if (price === null || Number(p.price) < price) {
                    price = p.price;
                    index = i;
                }

                p.optionList = extraList.slice();
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

        if (utils.isArray(portfolio.list)) {
            let count = 1;
            if (portfolio.list.length > 4) {
                count = 4;
            } else {
                count = portfolio.list.length;
            }

            for (let i = 0; i < count; i += 1) {
                mainSlider.push({ src: portfolio.list[i].portfolio_img, content_width: 375, content_height: 280 });
            }
        } else {
            mainSlider.push({ src: data.thumb_img });
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
            portfolioData,
            packageList,
            mainSlider,
            isLike: data.is_like === "Y",
            reviewCount,
            artistInfo
        });
    }

    componentDidMount() {
        // const { data } = this.state;
        // const { event } = this.props;
        this.checkPhone();

        // if (!event) {
        //     const target = document.querySelector(".event-contents-view");
        //     if (target) {
        //         target.parentNode.removeChild(target);
        //     }
        // }

        // setTimeout(() => {
        //     AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: data.title || "" });
        // }, 0);

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
        // this.setReferrerData();
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll, false);
    }

    /**
     * 유입경로 분석에 필요한 데이터를 저장한다.
     */
    // setReferrerData() {
    //     const referrer = document.referrer;
    //     if (referrer) {
    //         const data = utils.query.combineConsultToReferrer(referrer);
    //         const params = utils.query.setConsultParams({ ...data });
    //         this.setState({ ...params });
    //     }
    // }

    onScroll(e) {
        if (this.refTabContainer && this.refTab) {
            const rect = this.refTabContainer.getBoundingClientRect();

            if (rect && rect.y < 50 && this.refTab.style.position !== "fixed") {
                this.refTab.style.position = "fixed";
                this.refTab.style.borderBottom = "1px solid #e1e1e1";
            } else if (rect && rect.y > 49 && this.refTab.style.position !== "") {
                this.refTab.removeAttribute("style");
            }
        }
    }

    onCopy() {
        let state = true;
        try {
            window.getSelection().removeAllRanges();

            const text = this.shareLink;
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
     * 공유하기
     * @param type
     */
    onShare(type) {
        let sns;
        let params;
        const { data } = this.state;
        const url = `${__DESKTOP__}/products/${data.product_no}`;

        switch (type) {
            case "naver": {
                sns = __SNS__.naver;
                params = {
                    url,
                    title: document.querySelector("meta[property='og:title']").getAttribute("content")
                };
                break;
            }
            case "kakao":
                // template_msg : Object
                // 링크 메시지 (Link JSON 참고용)
                // warning_msg : Object
                // 링크 메시지를 검증한 결과
                // argument_msg : Object
                // argument를 검증한 결과
                params = {
                    requestUrl: url,
                    // templateId: 4756
                    templateArgs: {
                        name: "포스냅",
                        url: "https://forsnap.com"
                    },
                    fail: messageObj => {
                        PopModal.alert("카카오링크 공유에 실패했습니다.");
                    }
                    // success: messageObj => {
                    //     console.log("KAKAO SUCCESS");
                    // }
                };
                break;
            case "facebook":
                sns = __SNS__.facebook;
                params = {
                    app_id: sns.client_id,
                    display: "popup",
                    href: url
                };
                break;
            default:
                break;
        }

        if (type === "kakao") {
            window.Kakao.Link.sendScrap(params);
        } else {
            window.open(`${sns.share_uri}?${utils.query.stringify(params)}`, "sharePopup");
        }
    }

    /**
     * 하트를 등록 또는 취소한다.
     */
    onLike(e) {
        const user = this.isUser();
        if (user) {
            const { data, isLike } = this.state;
            let request = null;
            const params = [user.id, data.product_no];

            if (data.user_id === user.id) {
                PopModal.alert("본인 상품은 하트를 등록 할 수 없습니다.");
            } else if (!isLike) {
                request = API.users.like(...params);
            } else {
                request = API.users.unlike(...params);
            }

            if (request) {
                request.then(response => {
                    if (response.status === 200) {
                        if (!isLike) {
                            //window.fbq("track", "AddToWishlist");
                            PopModal.toast("하트 상품은 <br /> 마이페이지 > 내 하트 목록<br />에서 확인가능합니다.");
                        } else {
                            PopModal.toast("하트를 취소하셨습니다.", 1000);
                        }

                        this.setState({
                            isLike: !isLike
                        });
                    }
                }).catch(error => {
                    PopModal.alert(error.data);
                });
            }
        }
    }

    onSelectPackage(no) {
        const { packageList } = this.state;

        const result = packageList.reduce((resultPackage, p, i) => {
            const selected = i === no;
            p.selected = selected;

            resultPackage.push(p);
            return resultPackage;
        }, []);

        this.setState({
            packageList: result
        });
    }

    onSelectOption(no) {
        const { data } = this.state;

        if (utils.isArray(data.option)) {
            const result = data.option.reduce((rsOption, o, i) => {
                const selected = o.selected ? !o.selected : i === no;
                o.selected = selected;

                rsOption.push(o);
                return rsOption;
            }, []);

            data.option = result;
            this.setState({
                data
            });
        }
    }

    onSelectExtra(code) {
        const { packageList } = this.state;

        if (utils.isArray(packageList)) {
            const pkg = packageList.find(p => (p.selected));

            if (pkg && code) {
                const item = pkg.optionList.find(o => (o.code === code));

                if (item) {
                    if (!item.selected) {
                        item.count = 1;
                    }

                    item.total_price = item.count * item.price;
                    item.selected = true;
                }

                this.setState({
                    packageList,
                    selectExtraOption: code
                });
            }
        }
    }

    onRemoveExtra(code) {
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
                    }

                    if (Number(num) > 999) {
                        item.count = 999;
                    } else {
                        item.count = Number(num);
                    }

                    item.total_price = num > 0 ? item.price * num : 0;
                }

                this.setState({
                    packageList
                });
            }
        }
    }

    /**
     * 대화하기
     */
    onChat(gaFlag) {
        const { data, phone } = this.state;
        const user = this.UserCheck.isLogin();

        if (gaFlag) {
            this.gaEvent("1:1문의_플로팅", "", true);
        }

        if (user) {
            if (user.id === data.user_id) {
                PopModal.alert("자기 자신에게 메시지를 보낼수 없습니다.");
            } else {
                const modalName = "popup_send_chat";
                const options = {
                    className: modalName
                };
                if (!phone) {
                    options.callBack = () => this.checkPhone();
                }

                const params = {
                    no: data.product_no,
                    title: data.title,
                    user_id: data.user_id,
                    nick_name: data.nick_name,
                    profile_img: data.profile_img
                };

                PopModal.createModal(modalName, <PopupSendChat data={params} isPhone={!!phone} />, options);
                PopModal.show(modalName);
            }
        }
    }

    onTab(tab) {
        let y = null;
        switch (tab) {
            case "상세설명": {
                if (this.refDetail) {
                    const rect = this.refDetail.getBoundingClientRect();
                    y = rect.y;
                }
                break;
            }
            case "포트폴리오": {
                if (this.refPortfolio) {
                    const rect = this.refPortfolio.getBoundingClientRect();
                    y = rect.y;
                }
                break;
            }
            case "가격정보": {
                if (this.refOption) {
                    const rect = this.refOption.getBoundingClientRect();
                    y = rect.y;
                }
                break;
            }
            case "후기": {
                if (this.refReview) {
                    const rect = this.refReview.getBoundingClientRect();
                    y = rect.y;
                }
                break;
            }
            default:
                break;
        }

        if (y !== null) {
            setTimeout(() => {
                window.scrollBy(0, y - 100);
            }, 100);
        }
    }

    // gaEvent() {
    //     const { category } = this.state.data;
    //     const is_biz = utils.checkCategoryForEnter(category);
    //     const eCategory = is_biz ? "M_기업_상세" : "M_개인_상세";
    //     console.log(eCategory);
    //     utils.ad.gaEvent(eCategory, "설명 더보기", "");
    // }

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
        const is_biz = utils.checkCategoryForEnter(data.category);
        const { category, nick_name, product_no } = data;

        let label = eLabel;
        if (renew) {
            label = `${category}_${nick_name}_${product_no}`;
        }

        const eCategory = is_biz ? "M_기업_상세" : "M_개인_상세";

        if (!utils.type.isEmpty(search_param) && search_param.utm_source && search_param.utm_source === "fb_ad") {
            utils.ad.gaEvent(`M_페이스북광고_${is_biz ? "기업" : "개인"}`, search_param.utm_content || "", eAction);
        }
        utils.ad.gaEvent(eCategory, eAction, label);
    }

    onMoreContent() {
        const { detailHeight } = this.state;

        if (this.refDetailContent) {
            if (detailHeight > 300) {
                this.onTab("상세설명");
                setTimeout(() => {
                    this.setState({
                        detailHeight: 300
                    });
                }, 100);
            } else {
                this.gaEvent("설명 더보기");
                this.setState({
                    detailHeight: this.refDetailContent.offsetHeight
                });
            }
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
     * 원클릭 간편문의
     * @param type
     */
    onQuickMessage(type) {
        const { data, isProcess, isQuick, phone } = this.state;
        let message = "";
        let title = "";
        const user = this.UserCheck.isLogin();

        if (user) {
            const { user_id, product_no } = data;

            switch (type) {
                case "date":
                    title = "일정문의";
                    message = "일정문의합니다.";
                    break;
                case "photo":
                    title = "촬영문의";
                    message = "촬영문의합니다.";
                    break;
                case "option":
                    title = "옵션문의";
                    message = "옵션문의합니다.";
                    break;
                default:
                    break;
            }

            if (!isProcess && message && user_id && product_no) {
                this.setProgress(true);

                if (!phone) {
                    if (user.id === data.user_id) {
                        PopModal.alert("자기 자신에게 메시지를 보낼수 없습니다.");
                    } else {
                        const modalName = "popup_send_chat";
                        const options = {
                            className: modalName,
                            callBack: () => {
                                this.setProgress(false);
                                this.checkPhone().then(response => {
                                    this.setState({
                                        isQuick: true
                                    });
                                });
                            }
                        };

                        const params = {
                            no: data.product_no,
                            title: data.title,
                            user_id: data.user_id,
                            msg: message
                        };

                        PopModal.createModal(modalName, <PopupSendChat data={params} isPhone={!!phone} />, options);
                        PopModal.show(modalName);
                    }
                } else if (!isQuick) {
                    PopModal.confirm(`${title} 메시지를 보내시겠습니까?`, () => {
                        API.talks.send(user_id, product_no, "U", "PRODUCT_BOT", message).then(response => {
                            this.setProgress(false);
                            if (response.status === 200) {
                                PopModal.close();
                                //utils.ad.wcsEvent("5");
                                PopModal.confirm(
                                    "문의가 등록되었습니다.\n답변이 완료되면 sms로 알려드려요!\n지금 메시지를 확인하시겠습니까?",
                                    () => {
                                        document.location.href = `/users/chat?user_id=${user_id}&product_no=${product_no}`;
                                    }
                                );
                                this.setState({
                                    isQuick: true
                                });
                            }
                        }).catch(error => {
                            this.setProgress(false);
                            if (error.status === 412) {
                                PopModal.alert(error.data);
                            } else if (error.status === 400) { // 작가가 자기자신의 상품에 대화하기를 하였을 경우 에러
                                PopModal.alert(error.data);
                            }
                        });
                    }, () => this.setProgress(false));
                } else {
                    this.setProgress(false);
                    PopModal.alert("이미 문의를 하셨습니다\n답변을 기다려주세요");
                }
            }
        }
    }

    onReserve(gaData) {
        const { data, packageList, name, phone, email } = this.state;
        const { product_no, calendar, title, nick_name, option } = data;
        const user = auth.getUser();

        this.gaEvent("예약&결제", `작가명: ${nick_name} / 상품번호: ${product_no} / 상품명: ${title}`);

        if (user) {
            const params = {
                name,
                email,
                phone,
                title,
                calendar,
                product_no,
                nick_name
            };

            const modalName = "popup_payment";

            if (utils.isArray(packageList)) {
                const totalPrice = this.getTotalPrice();
                const pkg = packageList.find(p => (p.selected));

                if (pkg && totalPrice < pkg.min_price) {
                    PopModal.alert(`${utils.format.price(pkg.min_price)}원 이상 진행 가능한 상품입니다.`);
                } else {
                    params.packageList = packageList;
                    PopModal.createModal(modalName, <PopupProductPayment data={params} gaData={gaData} />, { className: "modal-fullscreen", modal_close: false });
                }
            } else {
                params.options = option;
                PopModal.createModal(modalName, <ProductsPayment data={params} gaData={gaData} />, { className: "modal-fullscreen", modal_close: false });
            }
            PopModal.show(modalName);
        } else {
            PopModal.alert("로그인후 이용해주세요", {
                callBack: () => {
                    redirect.login({ redirectURL: location.pathname });
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

    /**
     * 로그인 확인
     * @return Object - 유저정보
     */
    isUser(isAlert = true) {
        const user = auth.getUser();

        if (!user) {
            if (isAlert) {
                PopModal.alert("로그인 후 이용해주세요");
            }

            return false;
        }

        return user;
    }

    /**
     * 쿠키에 UUID가 존재하는지 판단한다.
     * UUID가 없을 경우, UUID를 생성하고, 상품 상세 정보를 요청한다.
     * @param productNo
     */
    createForsnapUUID(productNo) {
        if (!cookie.getCookies(constant.FORSNAP_UUID)) {
            const uuid = utils.getUUID().replace(/-/g, "");
            const d = new Date();
            d.setYear(d.getFullYear() + 1);

            cookie.setCookie({ [constant.FORSNAP_UUID]: uuid }, d.toUTCString());

            API.products.queryProductInfo(productNo, { uuid });
        }
    }

    /**
     * 유저 핸드폰, 이메일 존재여부 체크
     * @param isProgress - bool (프로그래스 표시 여부)
     * @return {Promise.<T>}
     */
    checkPhone() {
        return new Promise((resolve, reject) => {
            const user = this.isUser(false);
            if (user) {
                API.users.find(user.id).then(response => {
                    if (response.status === 200) {
                        const data = response.data;
                        this.setState({
                            name: data.name || "",
                            phone: data.phone || "",
                            email: data.email || ""
                        }, () => {
                            resolve({
                                status: true,
                                phone: data.phone || "",
                                email: data.email || ""
                            });
                        });
                    } else {
                        resolve({ status: false });
                    }
                }).catch(error => {
                    resolve({ status: false, error });
                });
            } else {
                resolve({ status: false });
            }
        });
    }

    render() {
        const {
            data,
            packageList,
            portfolioData,
            detailHeight,
            mainSlider,
            isLike,
            reviewCount,
            selectExtraOption,
            artistInfo,
            enter,
            search_param
        } = this.state;
        const {
            category,
            category_name,
            product_no,
            title,
            portfolio,
            portfolio_video,
            main_img,
            review_cnt,
            content,
            like_cnt,
            view_cnt,
            tag,
            option,
            nick_name,
            review,
            artist_product_list,
            recomm_list,
            rating_avg,
            rating_kind,
            rating_price,
            rating_qual,
            rating_service,
            rating_talk,
            rating_trust
        } = data;
        let totalPrice = null;
        const isVideo = ["VIDEO", "VIDEO_BIZ"].indexOf(category) !== -1;

        const gaData = {
            label: "결제전환"
        };

        if (!utils.type.isEmpty(search_param) && search_param.utm_source && search_param.utm_source === "fb_ad") {
            sessionStorage.setItem("facebook_ad_content", search_param.utm_content);
        }

        if (sessionStorage && sessionStorage.getItem("referer")) {
            if (sessionStorage.getItem("referer") === "facebook_ad" && sessionStorage.getItem("facebook_ad_content")) {
                gaData.referer = sessionStorage.getItem("referer");
                gaData.action = sessionStorage.getItem("facebook_ad_content");
                gaData.category = "M_페이스북광고_개인";
            }

            if (sessionStorage.getItem("referer") === "naver_shopping") {
                gaData.referer = sessionStorage.getItem("referer");
                gaData.action = data.product_no;
                gaData.category = "네이버쇼핑_개인";
            }
        }


        return (
            <div className="product__package">
                <div className="layout__body">
                    <div className="layout__body__main">
                        <div className="layer">
                            <div className="layer__header">
                                <div className="layer__column">
                                    <div className="products__detail__info">
                                        <div className="title">
                                            <h1>{title}</h1>
                                            <p>
                                                <a href="/">포스냅 홈</a><span>&gt;</span><a href={`/products?category=${category}`}>{category_name}</a>
                                            </p>
                                        </div>
                                        <div className="heart">
                                            <button className={isLike ? "active" : ""} onClick={this.onLike}>
                                                <i className={classNames("m-icon", isLike ? "m-icon-heart-white" : "m-icon-heart-blank")} />
                                            </button>
                                        </div>
                                        <div className="share">
                                            <PopDownContent target={<icon className="m-icon m-icon-share-small" />} align="left">
                                                <div className="products__detail__share">
                                                    <div className="share__social">
                                                        <div>
                                                            <button onClick={() => this.onShare("naver")}>
                                                                <icon className="m-icon m-icon-naver" />
                                                                네이버
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <button onClick={() => this.onShare("kakao")}>
                                                                <icon className="m-icon m-icon-kakao" />
                                                                카카오
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <button onClick={() => this.onShare("facebook")}>
                                                                <icon className="m-icon m-icon-facebook" />
                                                                페이스북
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="share__copy">
                                                        <div className="share__copy__url">
                                                            <input className="input" value={location.href} readOnly ref={ref => (this.shareLink = ref)} />
                                                        </div>
                                                        <button className="share__copy__button" onClick={this.onCopy}>
                                                            URL복사
                                                        </button>
                                                    </div>
                                                </div>
                                            </PopDownContent>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="layer__body">
                                <div className="layer__container">
                                    <div className="layer__border products__detail__portfolio" ref={ref => (this.refPortfolio = ref)}>
                                        {isVideo ?
                                            <ProductsVideo data={portfolio_video.list} main_img={main_img} /> : null
                                        }
                                        {utils.isArray(portfolio.list) ?
                                            <PortfolioList data={{ ...portfolioData }} list={portfolio.list} category={category} gaEvent={this.gaEvent} /> : null
                                        }
                                    </div>
                                    <div className="layer__border product__tabs__container" ref={ref => (this.refTabContainer = ref)}>
                                        <div className="layer__row auto__flex justify__around product__tabs" ref={ref => (this.refTab = ref)}>
                                            <div className="layer__row">
                                                <button className="f__button f__button__theme__underline__yellow" value="포트폴리오" onTouchEnd={() => this.onTab("포트폴리오")}>포트폴리오</button>
                                            </div>
                                            <div className="layer__row">
                                                <button className="f__button f__button__theme__underline__yellow" value="상세설명" onTouchEnd={() => this.onTab("상세설명")}>상세설명</button>
                                            </div>
                                            <div className="layer__row">
                                                <button className="f__button f__button__theme__underline__yellow" value="가격정보" onTouchEnd={() => this.onTab("가격정보")}>가격정보</button>
                                            </div>
                                            {review && utils.isArray(review.list) ?
                                                <div className="layer__row">
                                                    <button className="f__button f__button__theme__underline__yellow" value="후기" onTouchEnd={() => this.onTab("후기")}>후기</button>
                                                </div> : null
                                            }
                                        </div>
                                    </div>
                                    <div className="layer__border products__detail__information" ref={ref => (this.refDetail = ref)}>
                                        <div className="layer__column padding__default">
                                            <h3 className="text__header">상세 설명</h3>
                                            <div style={{ overflow: "hidden", height: `${detailHeight}px`, transition: "height 0.6s" }}>
                                                <div className="layer__column" ref={ref => (this.refDetailContent = ref)}>
                                                    <div className="caption__content">
                                                        <span>{content ? utils.linebreak(content) : ""}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {detailHeight >= 300 ?
                                                <div className="caption__content">
                                                    <button className="f__button f__button__small" onClick={this.onMoreContent} style={{ margin: "0 0 0 auto" }}>{detailHeight === 300 ? "설명 더보기" : "설명 접기"}</button>
                                                </div> : null
                                            }
                                        </div>
                                        {!utils.checkCategoryForEnter(category) &&
                                        <div className="layer__column padding__default">
                                            <h3 className="text__header">예약 확인</h3>
                                            <div className="caption__content">
                                                <span>세부사항 관련 조율은 1:1문의로 문의해주세요.</span>
                                            </div>
                                        </div>
                                        }
                                        <div className="layer__column padding__default">
                                            <h3 className="text__header">태그</h3>
                                            <div className="text__content">
                                                <div className="layer__row auto__flex products__tags">
                                                    {tag.map((t, i) => (
                                                        <a key={`tag-${i}`} href={`/products?tag=${t}`}>{t}</a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {utils.isArray(packageList) ?
                                        <div className="layer__column" ref={ref => (this.refOption = ref)}>
                                            {packageList.map((p, i) => {
                                                const isExcept = ["PRODUCT", "FOOD", "FASHION"].indexOf(p.category) !== -1;
                                                if (p.selected) {
                                                    totalPrice = Number(p.total_price) || 0;
                                                }

                                                const price_msg = utils.format.price(p.price);

                                                return (
                                                    <div key={`products-options-${i}`} className={classNames("products__options__item", { show: p.selected })}>
                                                        <div className="option__title" onClick={() => this.onSelectPackage(i)}>
                                                            <div className={classNames("icon__circle", { active: p.selected })}>
                                                                <span className={classNames("m-icon", p.selected ? "m-icon-check-white" : "m-icon-check")} />
                                                            </div>
                                                            <span className="title">{p.title}</span>
                                                            <span className="price">
                                                                {p.category !== "MODEL" ?
                                                                    `${price_msg}원` :
                                                                    `최소진행금액 ${price_msg}원 ~`
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="option__detail">
                                                            {p.category !== "DRESS_RENT" && p.category !== "MODEL" ?
                                                                <div className="option__info">
                                                                    {p.photo_cnt ?
                                                                        <div className="info__item">
                                                                            <div className="title">최소컷수</div>
                                                                            <div className="content">{utils.format.price(p.photo_cnt)} 장</div>
                                                                        </div> : null
                                                                    }
                                                                    {p.custom_cnt ?
                                                                        <div className="info__item">
                                                                            <div className="title">보정</div>
                                                                            <div className="content">{p.custom_cnt > 0 ? `${utils.format.price(p.custom_cnt)} 장` : "없음"}</div>
                                                                        </div> : null
                                                                    }
                                                                    {p.photo_time ?
                                                                        <div className="info__item">
                                                                            <div className="title">촬영시간</div>
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
                                                                    <div className="info__item">
                                                                        <div className="title">{p.category === "DRESS_RENT" ? "대여기간" : "작업일"}</div>
                                                                        <div className="content">{p.complete_period} 일</div>
                                                                    </div>
                                                                </div> : null
                                                            }
                                                            <div className="option__content">
                                                                {utils.linebreak(p.content || "")}
                                                            </div>
                                                            {isExcept ?
                                                                <div className="option__info">
                                                                    <div className="qty">
                                                                        <Qty count={p.count || 1} min={1} max={9999} resultFunc={num => this.onChangePackageCount(num)} />
                                                                    </div>
                                                                </div> : null
                                                            }
                                                        </div>
                                                        {utils.isArray(p.optionList) ?
                                                            <div className="option__content">
                                                                <DropDown
                                                                    data={p.optionList}
                                                                    select={selectExtraOption}
                                                                    name="title"
                                                                    value="code"
                                                                    onSelect={this.onSelectExtra}
                                                                />
                                                                {p.optionList.find(o => o.selected) || isExcept ?
                                                                    <div className="option__select">
                                                                        {isExcept ?
                                                                            <div key={`option-select-${p.package_no}`} className="option__select__item default">
                                                                                <div>
                                                                                    <div className="title">
                                                                                        {p.title}
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="qty">
                                                                                        <Qty count={p.count || 1} min={1} max={9999} resultFunc={num => this.onChangePackageCount(num)} />
                                                                                    </div>
                                                                                    <div className="price">
                                                                                        <span><span className="won">₩</span>{utils.format.price(p.price)}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div> : null
                                                                        }
                                                                        {p.optionList.map(o => {
                                                                            if (!o.selected) {
                                                                                return null;
                                                                            }

                                                                            totalPrice += o.total_price;

                                                                            return (
                                                                                <div key={`option-select-${o.code}`} className="option__select__item">
                                                                                    <div>
                                                                                        <div className="title">
                                                                                            {o.title}
                                                                                        </div>
                                                                                        <div className="remove">
                                                                                            <button className="f__button__close" onClick={() => this.onRemoveExtra(o.code)} />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <div className="qty">
                                                                                            <input
                                                                                                type="number"
                                                                                                className="f__input"
                                                                                                value={o.count}
                                                                                                onChange={e => this.onChangeCount(e.target.value, o.code)}
                                                                                                onBlur={() => { if (o.count < 1) this.onChangeCount(1, o.code); }}
                                                                                            />
                                                                                            <button onClick={() => this.onChangeCount(o.count < 999 ? o.count + 1 : 999, o.code)}><i className="m-icon m-icon-triangle-up" /></button>
                                                                                            <button onClick={() => this.onChangeCount(o.count < 2 ? 1 : o.count - 1, o.code)}><i className="m-icon m-icon-triangle-down" /></button>
                                                                                        </div>
                                                                                        <div className="price">
                                                                                            <span><span className="won">₩</span>{utils.format.price(o.price)}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div> : null
                                                                }
                                                            </div> : null
                                                        }
                                                    </div>
                                                );
                                            })}
                                        </div> : null
                                    }
                                    {!utils.isArray(packageList) && utils.isArray(option) ?
                                        option.map((o, i) => {
                                            return (
                                                <div key={`products-options-${i}`} className="layer__row" ref={ref => { if (i === 0) this.refOption = ref; }}>
                                                    <div className={classNames("products__options__item", { show: o.selected })}>
                                                        <div className="option__title" onClick={() => this.onSelectOption(i)}>
                                                            <span className="title">{o.option_name}</span>
                                                            <span className="price"><span className="won">₩</span>{utils.format.price(o.price)}</span>
                                                            <span className="arrow"><icon className="f__icon__dt" /></span>
                                                        </div>
                                                        <div className="option__detail">
                                                            <div className="option__info">
                                                                <div className="info__item">
                                                                    <div className="title"><icon className="f__icon__opt_origin" />촬영</div>
                                                                    <div className="content">{utils.format.price(o.min_cut_cnt)} ~ {utils.format.price(o.max_cut_cnt)} 장</div>
                                                                </div>
                                                                <div className="info__item">
                                                                    <div className="title"><icon className="f__icon__opt_custom" />보정</div>
                                                                    <div className="content">{Number(o.custom_cnt) ? `${utils.format.price(o.custom_cnt)} 장` : "없음"}</div>
                                                                </div>
                                                                <div className="info__item">
                                                                    <div className="title"><icon className="f__icon__opt_print" />인화</div>
                                                                    <div className="content">{Number(o.custom_cnt) ? `${utils.format.price(o.print_cnt)} 장` : "없음"}</div>
                                                                </div>
                                                            </div>
                                                            <div className="option__content">
                                                                {utils.linebreak(o.option_content || "")}
                                                            </div>
                                                            <div className="option__info">
                                                                <div className="info__basic">
                                                                    <div className="title">촬영인원</div>
                                                                    <div className="content">{utils.format.price(o.basic_person)} ~ {utils.format.price(o.max_person)} 명</div>
                                                                </div>
                                                                <div className="info__basic">
                                                                    <div className="title">인원추가</div>
                                                                    <div className="content">₩ {utils.format.price(o.add_price)}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }, []) : null
                                    }
                                    {review && utils.isArray(review.list) ?
                                        <div className="layer__border transparent">
                                            <div className="layer__container" ref={ref => (this.refReview = ref)}>
                                                <div className="layer__border">
                                                    <ProductPackageReview data={{ ...review, rating_avg, rating_kind, rating_price, rating_qual, rating_service, rating_talk, rating_trust, product_no }} isHeader />
                                                </div>
                                                {reviewCount < review.total_cnt ?
                                                    <div className="layer__row">
                                                        <button className="f__button" onClick={this.onMoreReview}>후기 더보기</button>
                                                    </div> : null
                                                }
                                            </div>
                                        </div> : null
                                    }
                                    <div className="layer__border">
                                        <ProductArtist data={artistInfo} category={category} onChat={this.onChat} gaEvent={this.gaEvent} />
                                        <ArtistanotherProducts list={artist_product_list ? artist_product_list.list || [] : []} category={category} nick_name={nick_name} gaEvent={this.gaEvent} />
                                    </div>
                                </div>
                            </div>
                            <div className="layer__footer">
                                <div className="product__package__footer">
                                    <div className="layer__row">
                                        <div className="product__buttons">
                                            <button className="_button _button__yellow__over" onClick={() => this.onReserve(gaData)}>
                                                {totalPrice === null ? "예약&결제하기" : `₩ ${utils.format.price(totalPrice)} 예약&결제하기`}
                                            </button>
                                            {!utils.checkCategoryForEnter(category) &&
                                                <button className="_button _button__fill__yellow" onClick={() => this.onChat(true)}>1:1문의</button>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="layer__column">
                                    {/*<ArtistAnotherProductContainer product_no={data.product_no} enter={this.state.enter} />*/}
                                    {/*{this.blogReview(data.nick_name)}*/}
                                    <ProductsRecommend recommList={recomm_list ? recomm_list.list || [] : []} gaEvent={this.gaEvent} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="forsnap__legal">
                    {/*<div className="forsnap__legal-outer">*/}
                    {/*    <p>주식회사 포스냅은 통신판매중개자로서 통신판매 당사자가 아니며, 판매자가 등록한 상품정보 및 거래에 대한 의무와 책임은 각 판매자에게 있습니다.</p>*/}
                    {/*</div>*/}
                </div>
                <div className="layout__footer">
                    <Footer>
                        <ScrollTop category={category} product_no={product_no} />
                    </Footer>
                </div>
            </div>
        );
    }
}

ProductPackage.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired
};

// <div className="request-chat round" onClick={this.onChat}>
//     <div className="new-badge" />
//     <p className="button-text">1:1문의</p>
// </div>


export default ProductPackage;
