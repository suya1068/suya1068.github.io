import "mobile/resources/scss/utils/_m-icon.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import API from "forsnap-api";
import utils from "forsnap-utils";
import auth from "forsnap-authentication";
import cookie from "forsnap-cookie";

import A from "shared/components/link/A";
import constant from "shared/constant";
import { PRODUCT_SORT, NONE_LIST, BIZ_CATEGORY, CATEGORY_CODE } from "shared/constant/product.const";

import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Footer from "desktop/resources/components/layout/footer/Footer";
import ScrollTop from "desktop/resources/components/scroll/ScrollTop";

import SearchContainer from "shared/components/search/SearchContainer";

import PopModal from "shared/components/modal/PopModal";
// import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import RecommendList from "shared/components/category/RecommendList";
import Img from "shared/components/image/Img";
// import SimpleConsult from "shared/components/consulting/renew/SimpleConsult";
// import PersonalConsult from "shared/components/consulting/personal/ConsultContainer";

import ConsultModal from "desktop/resources/components/modal/consult/ConsultModal";

import Icon from "desktop/resources/components/icon/Icon";
import Heart from "desktop/resources/components/form/Heart";

import ProductItem from "./ProductItem";
import ProductsListTop from "./ProductsListTop";
import ProductsListPortfolio from "./ProductsListPortfolio";

import ConsultBar from "./ConsultBar";

class ProductsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            title: "",
            products: {
                list: [],
                total_cnt: 0,
                category_tag: []
            },
            category: this.composeCategory(props.category),
            params: this.composeParams(props.params),
            sortList: [PRODUCT_SORT.RECOMM, PRODUCT_SORT.NEW, PRODUCT_SORT.LOWPRICE],
            isLoading: true,
            product_list_cnt: props.data.list.length || 0,
            limit: 6,
            floating: true,
            user: auth.getUser()
        };

        // Interaction
        this.onLoad = this.onLoad.bind(this);
        this.onMoreProducts = this.onMoreProducts.bind(this);
        this.onSort = this.onSort.bind(this);
        this.onHeart = this.onHeart.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onRecommend = this.onRecommend.bind(this);
        this.onKeyword = this.onKeyword.bind(this);
        this.onConsult = this.onConsult.bind(this);

        // API
        this.queryProducts = this.queryProducts.bind(this);
        // this.queryLikeList = this.queryLikeList.bind(this);

        // Data
        this.combineProducts = this.combineProducts.bind(this);
        this.composeCategory = this.composeCategory.bind(this);
        this.composeParams = this.composeParams.bind(this);
        this.composeSearchCount = this.composeSearchCount.bind(this);
        this.createParams = this.createParams.bind(this);
        this.setCommaSplit = this.setCommaSplit.bind(this);

        this.replaceUrl = this.replaceUrl.bind(this);

        this.drawProducts = this.drawProducts.bind(this);
        this.drawNoneContent = this.drawNoneContent.bind(this);
        this.drawNoneList = this.drawNoneList.bind(this);
        // this.setPropertyToProduct = this.setPropertyToProduct.bind(this);
        this.setStateData = this.setStateData.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        this.setState({
            products: this.combineProducts(this.props.data)
        });
    }

    componentDidMount() {
        // this.improvedGaForListView(this.state.products.list);
        window.addEventListener("scroll", this.onScroll);
        this.replaceUrl(this.createParams(this.state.params));
    }

    componentWillUnmount() {
        this.state.isMount = false;
        window.removeEventListener("scroll", this.onScroll);
    }

    gaEvent(eAction, eLabel = "") {
        const { params } = this.state;

        const is_biz = utils.checkCategoryForEnter(params.category);
        const eCategory = is_biz ? "기업_리스트" : "개인_리스트";

        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }
    /**
     * 향상된 ga 이벤트 For 상품리스트 & 상품더보기
     * @param list
     * @param startIndex
     */
    improvedGaForListView(list, startIndex = 0) {
        window.dataLayer.splice(0, window.dataLayer.length);
        const test = list.reduce((result, obj, idx) => {
            const data = {
                "name": obj.title,
                "id": obj.product_no,
                "price": obj.price,
                "brand": `${obj.artist_id}-${obj.nick_name}`,
                "category": obj.category || "",
                "list": obj.category || this.state.params.keyword || this.state.params.tag,
                "position": startIndex + idx + 1
            };
            result.push(data);
            return result;
        }, []);

        window.dataLayer.push({
            "event": "product_list",
            "ecommerce": {
                "actionField": { "step": "product_list" },
                "currencyCode": "KOR",
                "impressions": test
            }
        });
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

    /**
     * 페이지가 로드되었을 때 scroll 위치를 이동시킨다.
     */
    onLoad() {
        if (history.state) {
            if (this.state.params.page > 1) {
                document.body.scrollTop = history.state.scrollTop;
            }
        }
    }

    onScroll(e) {
        const { products, params, limit, floating } = this.state;
        //현재문서의 높이
        const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        //현재 스크롤탑의 값
        const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

        //현재 화면 높이 값
        const clientHeight = (document.documentElement.clientHeight);

        if (clientHeight + scrollTop >= (scrollHeight - 260) && products.total_cnt > params.page * limit) {
            this.setLoadingFlag();
        }

        // 상담신청바
        const footer = document.getElementById("site-footer");
        if (footer) {
            const rect2 = footer.getBoundingClientRect();
            const bottom2 = document.body.clientHeight - rect2.top;

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

    onSearch(form) {
        this.state.products = {
            list: [],
            total_cnt: 0,
            category_tag: []
        };
        this.queryProducts(form)
            .then(data => {
                this.setStateData(
                    () => data,
                    () => window.scrollTo(0, 0)
                );
            });
    }

    /**
     * 더 많은 상품을 화면에 보여준다.
     */
    onMoreProducts() {
        const { params, product_list_cnt, limit } = this.state;
        const query = Object.assign(params, { page: params.page + 1, offset: params.page * limit });
        this.queryProducts(query).then(data => {
            // this.improvedGaForListView(data.products.list, product_list_cnt);
            this.setStateData(() => ({
                ...data,
                isLoading: true,
                product_list_cnt: product_list_cnt + data.products.list.length
            }));
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    /**
     * 상품을 다시 조회하여 정렬한다.
     * @param {{name: string, value: string}} sort
     * @param category
     */
    onSort(sort, category) {
        const { params, limit } = this.state;
        this.gaEvent("정렬방법", `${category}_${sort.name}`);
        const query = Object.assign(params, { offset: 0, limit: params.page * limit, sort: sort.value });

        this.state.products = {
            list: [],
            total_cnt: 0,
            category_tag: []
        };
        this.queryProducts(query).then(data => {
            this.setStateData(() => data);
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    /**
     * 상품 상세 페이지로 이동한다.
     * @param {string} href
     */
    onMoveProductDetail(href) {
        utils.history.replace(location.href, { path: location.href, scrollTop: document.body.scrollTop });
        location.href = href;
    }

    onHeart(e) {
        e.preventDefault();
    }

    setCommaSplit(tags = "") {
        return tags.split(",").reduce((result, tag) => `${result} #${tag}`, "");
    }

    replaceUrl(params) {
        const search = Object.assign({}, params);

        if (window.history) {
            delete search.limit;
            delete search.offset;
            delete search.user_id;

            if (search.keyword) {
                delete search.category;
            }

            window.history.replaceState(null, "", `/products?${utils.query.stringify(search)}`);
        }
    }

    setLoadingFlag() {
        if (this.state.isLoading) {
            this.setState({
                isLoading: false
            }, () => {
                if (!this.state.isLoading) {
                    this.onMoreProducts();
                }
            });
        }
    }

    /**
     * 데이터 병합
     * @param data
     * @return {{list: *, total_cnt: *, category_tag: *}}
     */
    combineProducts(data) {
        const { products } = this.state;
        const { list, total_cnt, category_tag, search_count } = data;
        const merge = utils.mergeArrayTypeObject(products ? products.list : [], list);
        return {
            list: merge.list,
            total_cnt: Number(total_cnt) || 0,
            category_tag: category_tag ? utils.search.parse(category_tag) : [],
            search_count: this.composeSearchCount(search_count)
        };
    }

    composeCategory(data) {
        if (data && Array.isArray(data)) {
            return data.reduce((r, o) => {
                if (["AD", "VIDEO", "DRESS_RENT"].indexOf(o.code) === -1) {
                    r.push(o);
                }

                return r;
            }, []);
        }

        return [];
    }

    /**
     * param 데이터를 생성한다.
     * @param params - Object
     * @returns {{limit: *, offset: *, sort: *, tag: *}}
     */
    composeParams(params = {}) {
        return {
            keyword: params.keyword || "",
            tag: params.tag || "",
            category: params.category || "",
            region: params.region || "",
            min_price: Number(params.min_price) || "",
            max_price: Number(params.max_price) || "",
            is_corp: params.is_corp === "Y" ? "Y" : "",
            reserve_date: utils.isDate(params.reserve_date) ? params.reserve_date : "",
            enter: params.enter === "Y" ? "Y" : "N",
            sort: params.sort || PRODUCT_SORT.RECOMM.value,
            page: Number(params.page) || 1,
            new: params.new || ""
        };
    }

    composeSearchCount(data) {
        if (data && data instanceof Object) {
            const { category } = this.state;
            return Object.keys(data).reduce((r, k) => {
                const count = isNaN(Number(data[k])) ? 0 : Number(data[k]);
                if (count) {
                    const item = category.find(c => c.code === k);
                    if (item) {
                        r.push({
                            name: item.name,
                            value: item.code,
                            count
                        });
                    }
                }

                return r;
            }, [{ name: "전체", value: "", count: data.TOTAL }]);
        }

        return [];
    }

    createParams(params) {
        return Object.keys(params).reduce((r, k) => {
            if (params[k]) {
                r[k] = params[k];
            }
            return r;
        }, {});
    }

    /**
     * 상품리스트를 화면에 렌더링한다.
     * @returns {Array}
     */
    drawProducts() {
        const { products, params, limit } = this.state;
        const result = [];
        const max = params.page * limit;
        const enter_cookie = cookie.getCookies("ENTER");
        const enter_session = sessionStorage && sessionStorage.getItem("ENTER");

        const is_enter = !enter_cookie && !enter_session;

        if (is_enter) {
            for (let i = 0; i < products.list.length; i += 1) {
                const item = products.list[i];
                if (i < max) {
                    result.push(
                        this.renderProductForEnter(item)
                    );
                }
            }
        } else {
            for (let i = 0; i < products.list.length; i += 1) {
                const item = products.list[i];
                if (i < max) {
                    result.push(
                        this.drawProductFormBar(item)
                    );
                }
            }
        }

        return result;
    }

    drawNoneContent() {
        const { params } = this.state;
        const enter = cookie.getCookies(constant.USER.ENTER);
        const enter_session = sessionStorage.getItem(constant.USER.ENTER);
        const gaEvent = () => {
            utils.ad.gaEvent("기업_리스트", "검색결과없음", `keyword=${params.keyword}`);
        };
        return (
            <div className="product__none">
                <div className="none__icon">
                    !
                </div>
                <div className="none__content">
                    <div className="none__text">
                        <div className="title">{params.keyword ? `"${params.keyword}" ` : ""}검색결과가 없어요.</div>
                        {enter && enter_session ? null : <div className="sub">견적상담을 통해 원하시는 촬영에 꼭 맞는 상품을 안내받으실 수 있어요.</div>}
                    </div>
                    {enter && enter_session ? null
                        : <div className="none__button">
                            <button onClick={() => this.onConsult("PRODUCT_LIST", gaEvent)}>견적상담</button>
                        </div>
                    }
                </div>
            </div>
        );
    }

    drawNoneList() {
        return (
            <div className="product__none__list">
                <div className="container">
                    <div className="none__list__panel">
                        <div className="title">인기검색어</div>
                        <div className="content">
                            <div className="recommend__keyword__list">
                                {NONE_LIST.map((obj, i) => {
                                    return (
                                        <div key={`none_item_${i}`} className="keyword__item" onClick={() => this.onKeyword(obj.title)}>
                                            <div className="recommend__img">
                                                <img src={`${__SERVER__.img}${obj.src}`} alt="none_item" />
                                            </div>
                                            <div className="recommend__content">
                                                <p className="title">{obj.title}</p>
                                                <p className="content">{obj.content}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * 상품리스트의 개별 상품출력 모양 (basic)
     */
    drawProductFormBasic(item, i) {
        return (
            <ProductItem no={i + 1} data={item} tag="div" size={{ width: 1, height: 1 }} key={`products__item__${item.product_no}`} onClick={this.onMoveProductDetail}>
                <div className="direction__row">
                    <a className="item__info__profile" href={`/@${item.nick_name}`}>
                        {/*<a className="item__info__profile" href={`/artists/${item.artist_id}/about`}>*/}
                        <Img image={{ src: item.profile_img, content_width: 110, content_height: 110, default: "/common/default_profile_img.jpg" }} isContentResize />
                    </a>
                    <div className="direction__column">
                        <div className="item__info__title">{item.title}</div>
                        <div className="direction__row center">
                            {item.is_corp === "Y" ? <span className="item__badge__corp">계산서</span> : null}<a className="item__info__name" href={`/@${item.nick_name}`}>by {item.nick_name}</a>
                            <div className="item__info__price">{utils.format.price(item.price)}<span className="won">원</span></div>
                        </div>
                    </div>
                </div>
            </ProductItem>
        );
    }

    renderProductForEnter(item) {
        const is_enter_category = utils.checkCategoryForEnter(item.category);
        const url = is_enter_category ? `/portfolio/${item.product_no}` : `/products/${item.product_no}?new=true`;

        return (
            <div className="portfolio_item" key={`product_list__${item.product_no}`}>
                <a href={url} target="_blank" onClick={e => this.onMoveProductDetailPage(e, item)}>
                    <div className="portfolio_item__thumb">
                        <Img image={{ src: item.thumb_img, content_width: 504, content_height: 504 }} />
                    </div>
                    <div className="portfolio_item__info">
                        <div className="portfolio_item__info-title">{item.title}</div>
                        <div className="portfolio_item__info-artist">by {item.nick_name}</div>
                    </div>
                </a>
            </div>
        );
    }

    /**
     * 상품리스트이 개별 상품출력 모양 (bar)
     * @param item
     */
    drawProductFormBar(item) {
        const isLikeActive = item.is_like === "Y";

        return (
            <div className="product_display_bars_container" key={`product_display_bars__${item.product_no}`}>
                <div className="product_display_bars_info-area">
                    <A className="product_display_bars_info-area-left" href={`/products/${item.product_no}`} target="_blank" onClick={e => this.onMoveProductDetailPage(e, item)}>
                        <div className="product_display_bars_info-area-left__thumb">
                            <Img image={{ src: item.thumb_img, content_width: 504, content_height: 504 }} isContentResize />
                            <div className="product_display_bars_info-area-left__thumb_more">
                                <Icon name="more_product" />
                            </div>
                        </div>
                        <div className="product_display_bars_info-area-left__info">
                            <p className="product_display_bars_info-area-left__info-title title-style">{item.title}</p>
                            <p className="product_display_bars_info-area-left__info-price title-style">{utils.format.price(item.price)}원</p>
                            <p className="product_display_bars_info-area-left__info-col description-style">{item.is_corp === "Y" ? "세금계산서 발행가능" : ""}</p>
                            {item.rating_avg ?
                                <div className="product_display_bars_info-area-left__info-heart">
                                    <Heart count={item.rating_avg} disabled="disabled" />
                                    <p className="product_display_bars_info-area-left__info-heart-review description-style">( 후기 {item.review_cnt}개 )</p>
                                </div> : null
                            }
                        </div>
                    </A>
                    <div className="product_display_bars_info-area-right">
                        <p className="product_display_bars_info-area-right-nick_name description-style">{item.nick_name}</p>
                        <div className="product_display_bars_info-area-right-profile">
                            <a className="profile_img_box" href={`/@${item.nick_name}`}>
                                <Img image={{ src: item.profile_img, content_width: 110, content_height: 110, default: "/common/default_profile_img.jpg" }} isContentResize />
                            </a>
                            <div className="select-like-box" onClick={() => this.onLike(item)}>
                                <Icon name={isLikeActive ? "heart-pink-surface" : "heart-black-surface"} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="product_display_bars_tags-area">
                    <p className="product_display_bars_tags-area-tags description-style">{item.tags}</p>
                </div>
            </div>
        );
    }

    onMoveProductDetailPage(event, data) {
        // event.preventDefault();
        this.gaEvent_product_select(data.product_no, data.title);
        // this.improvedGaForDetailProductClick(data);
        // const node = event.currentTarget;
        // location.href = node.href;
    }

    /**
     * 향상된 ga이벤트
     * @param data
     */
    improvedGaForDetailProductClick(data) {
        window.dataLayer.splice(0, window.dataLayer.length);
        window.dataLayer.push({
            "event": "product_click",
            "ecommerce": {
                "click": {
                    "actionField": { "step": "product_click", "list": data.category || "" },      // Optional list property.
                    "products": [{
                        "name": data.title,                      // Name or ID is required.
                        "id": data.product_no,
                        "price": data.price || 0,
                        "brand": `${data.artist_id}-${data.nick_name}`,
                        "category": data.category || "",
                        "position": this.props.no
                    }]
                }
            }
        });
    }

    gaEvent_product_select(no, title) {
        utils.ad.gaEvent("개인_리스트", "상품선택", `상품번호: ${no} / 상품명: ${title}`);
    }

    onLike(item) {
        const { products } = this.state;
        const user = auth.getUser();

        if (!user) {
            PopModal.alert("로그인 후 이용해주세요.");
        } else {
            const is_like = item.is_like;
            const process = b => {
                const params = [
                    user.id,
                    item.product_no
                ];

                if (b === "N") {
                    //console.log("product_list:", item);
                    //utils.ad.fbqEvent("AddToWishlist", { content_name: item.title, content_category: item.category });

                    PopModal.toast("하트 상품은 <br /> 마이페이지 > 내 하트 목록<br />에서 확인가능합니다.");
                    return API.users.like(...params);
                }
                PopModal.toast("하트를 취소하셨습니다.", 1000);
                return API.users.unlike(...params);
            };

            process(is_like).then(response => {
                products.list.filter(obj => {
                    if (obj.product_no === item.product_no) {
                        obj.is_like = obj.is_like === "Y" ? "N" : "Y";
                    }
                    return null;
                });
                this.setState({ products });
            }).catch(error => PopModal.alert(error.data));
        }
    }

    /**
     * API서버에게 상품 데이터를 요청한다.
     * @param params
     * @returns {axios.Promise}
     */
    queryProducts(params) {
        const user = auth.getUser();
        const query = this.createParams(Object.assign(params, { user_id: user ? user.id : "" }));
        return API.products.queryProducts(this.createParams(query))
            .then(response => {
                const data = response.data;
                this.replaceUrl(query);

                return {
                    products: this.combineProducts(data),
                    params: this.composeParams(query)
                };
            })
            .catch(error => {
                PopModal.alert(error.data);
            });
    }

    onRecommend(tag) {
        const { params } = this.state;
        const query = Object.assign(params, {
            offset: 0,
            keyword: "",
            tag
        });
        this.state.products = {
            list: [],
            total_cnt: 0,
            category_tag: []
        };
        this.queryProducts(query).then(data => {
            this.setStateData(() => data);
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    onKeyword(keyword) {
        const { params } = this.state;
        this.onSearch({ keyword, enter: params.enter, sort: params.sort });
    }

    /**
     * 상담신청하기 모달창을 엽니다.
     */
    onConsult(access_type, callback) {
        // const modal_name = "personal_consult";
        // const options = {
        //     className: "personal_consult"
        // };
        // const consult_component = <PersonalConsult device_type="pc" access_type="product_list" />;
        // PopModal.createModal(modal_name, consult_component, options);
        // PopModal.show(modal_name);

        // const modal_name = "simple__consult";
        //
        // Modal.show({
        //     type: MODAL_TYPE.CUSTOM,
        //     content: <SimpleConsult modal_name={modal_name} access_type="product_list" device_type="pc" onClose={() => Modal.close(modal_name)} />,
        //     name: modal_name
        // });

        const modal_name = "simple__consult";
        // PopModal.createModal(
        //     modal_name,
        //     <SimpleConsult
        //         modal_name={modal_name}
        //         access_type={access_type}
        //         device_type="pc"
        //         onClose={() => PopModal.close(modal_name)}
        //         onSubmit={callback}
        //     />,
        //     { className: modal_name, modal_close: false });

        PopModal.createModal(modal_name,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({
                        access_type,
                        device_type: "pc",
                        page_type: "biz"
                    }, data);

                    // 기존 상담요청 onSubmit함수 (기존에도 상담 요청전에 호출함)
                    callback();

                    // 상담요청 api
                    API.orders.insertAdviceOrders(params)
                        .then(response => {
                            // utils.ad.fbqEvent("InitiateCheckout");
                            utils.ad.wcsEvent("4");
                            utils.ad.gtag_report_conversion(location.href);
                            utils.ad.gaEvent("기업고객", "상담전환");
                            utils.ad.gaEventOrigin("기업고객", "상담전환");
                            PopModal.alert("상담신청해 주셔서 감사합니다.\n곧 연락 드리겠습니다.", { callBack: () => PopModal.close(modal_name) });
                        })
                        .catch(error => {
                            if (error && error.date) {
                                PopModal.alert(error.data);
                            }
                        });
                }}
                onClose={() => PopModal.close(modal_name)}
            />,
            { modal_close: false }
        );

        PopModal.show(modal_name);
    }

    setStateData(update, callBack) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callBack);
        }
    }

    render() {
        const { products, params, sortList, floating } = this.state;
        const { total_cnt, category_tag, search_count } = products;
        const enter = cookie.getCookies(constant.USER.ENTER);
        const enter_session = sessionStorage.getItem(constant.USER.ENTER);
        const isCategory = !params.keyword && params.category;
        const isBiz = BIZ_CATEGORY.indexOf(params.category.toUpperCase()) !== -1;
        let title = "전체";

        if (params.category) {
            const item = constant.PRODUCTS_CATEGORY.find(c => c.code === params.category);
            if (item) {
                title = item.name;
            }
        }

        return (
            <div className="products-page">
                <HeaderContainer />
                <main id="site-main" style={{ backgroundColor: "#fafafa" }} onLoad={this.onLoad}>
                    {isBiz && isCategory ? <ProductsListTop category={params.category} onConsult={this.onConsult} /> : null}
                    {isBiz && isCategory ? <ProductsListPortfolio category={params.category} /> : null}
                    <div className="container">
                        {/*<h1 className="sr-only">{`${title} 촬영`}</h1>*/}
                        {/*{title && total_cnt ? <div className="products__breadcrumb"><h1 className="title">{title} 촬영</h1></div> : null}*/}
                        {/*
                            <div className="product_list_gnb">
                                <a href="/">
                                    <span onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} className={classNames("gnb_home")}>포스냅 홈</span>
                                </a>
                                <span className="gt">&gt;</span>
                                <span className="gnb_category">{`${title} ( ${utils.format.price(total_cnt)}개 )`}</span>
                            </div>
                        */}
                        {params.keyword ?
                            <div className={classNames("product__search__content", { none__search: !total_cnt })}>
                                <SearchContainer
                                    params={params}
                                    auto={{
                                        category: true
                                    }}
                                    option={!!total_cnt}
                                    search_count={search_count}
                                    onFetch={this.onSearch}
                                />
                            </div> : null
                        }
                        {Array.isArray(category_tag) && category_tag.length && !params.keyword ?
                            <div className="products-page__resultBar">
                                <RecommendList data={{ list: category_tag, tag: params.tag, categoryCode: params.category ? params.category : "" }} onResult={this.onRecommend} gaEvent={this.gaEvent} />
                            </div> : null
                        }
                        <div className="products-page__list">
                            {total_cnt ?
                                <div className="products__list__header">
                                    <div className="list__buttons">
                                        <div className="sort__buttons">
                                            {enter && enter_session && sortList.map(s => {
                                                const isSort = params.sort === s.value;

                                                return (
                                                    <button
                                                        key={`list-buttons-sort-${s.value}`}
                                                        className={classNames("list__buttons__sort", { "active": isSort })}
                                                        onClick={() => this.onSort(s, params.category)}
                                                    >
                                                        <i className={classNames("m-icon", { "m-icon-check-pink": isSort, "m-icon-check": !isSort })} />{s.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {isBiz && isCategory && params.category.toUpperCase() !== CATEGORY_CODE.VIDEO_BIZ ?
                                            <a
                                                className="_button _button__default button__portfolio__category"
                                                href={`/portfolio/category/${params.category.toLowerCase()}`}
                                                onClick={() => utils.ad.gaEvent("기업_리스트", "추천포트폴리오 보기", title)}
                                            >추천포트폴리오 보기</a>
                                            : null
                                        }
                                    </div>
                                </div> : null
                            }
                            <div className="product-container">
                                {!total_cnt ? this.drawNoneContent() : this.drawProducts()}
                            </div>
                        </div>
                    </div>
                    {!total_cnt ? this.drawNoneList() : null}
                    {enter && enter_session ? null : <ConsultBar fixed={floating} category={params.category} keyword={params.keyword} />}
                </main>
                <Footer>
                    <ScrollTop device="PC" is_artist={this.state.user && this.state.user.data.is_artist} />
                </Footer>
            </div>
        );
    }
}

ProductsList.propTypes = {
    // seo: PropTypes.shape({
    //     title: PropTypes.string.isRequired
    // }).isRequired,
    data: PropTypes.shape({
        list: PropTypes.array.isRequired,
        total_cnt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    }),
    params: PropTypes.shape({
        tag: PropTypes.string,
        sort: PropTypes.string.isRequired,
        limit: PropTypes.number.isRequired,
        offset: PropTypes.number.isRequired,
        page: PropTypes.number.isRequired
    }).isRequired,
    category: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        code: PropTypes.string,
        display_order: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }))
};

export default ProductsList;
