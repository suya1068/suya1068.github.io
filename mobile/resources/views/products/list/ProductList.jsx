import "./products_list.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import API from "forsnap-api";

import { Footer } from "mobile/resources/containers/layout";

import { PRODUCT_SORT, NONE_LIST } from "shared/constant/product.const";
import * as CONST from "mobile/resources/stores/constants";

import SearchContainer from "shared/components/search/SearchContainer";

// import PersonalConsult from "shared/components/consulting/personal/ConsultContainer";

import AppDispatcher from "mobile/resources/AppDispatcher";
import PopModal from "shared/components/modal/PopModal";
import RecommendList from "shared/components/category/RecommendList";
import ProductListItem from "./components/ProductListItem";
import ProductListItemBar from "./components/ProductListItemBar";
// import Img from "shared/components/image/Img";
// import DropDown from "mobile/resources/components/dropdown/DropDown";
import DropDown from "shared/components/ui/dropdown/DropDown";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";
import ConsultModal from "mobile/resources/components/modal/consult/ConsultModal";

class ProductList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            title: "",
            currentCategory: props.params.category,
            products: {
                list: [],
                total_cnt: 0,
                category_tag: []
            },
            category: this.composeCategory(props.category),
            params: this.composeParams(props.params),
            sortList: [PRODUCT_SORT.RECOMM, PRODUCT_SORT.NEW, PRODUCT_SORT.LOWPRICE],
            listLoadFlag: false,
            isLoading: true,
            product_list_cnt: props.data.list.length || 0,
            limit: 6
        };

        // API
        this.queryProducts = this.queryProducts.bind(this);

        // Data
        this.combineProducts = this.combineProducts.bind(this);
        this.composeCategory = this.composeCategory.bind(this);
        this.composeParams = this.composeParams.bind(this);
        this.composeSearchCount = this.composeSearchCount.bind(this);
        this.setCommaSplit = this.setCommaSplit.bind(this);

        // Interaction
        this.onLoad = this.onLoad.bind(this);
        this.onScroll = this.onScroll.bind(this);
        // this.onMoveDetailProductPage = this.onMoveDetailProductPage.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onKeyword = this.onKeyword.bind(this);
        this.onMoreProducts = this.onMoreProducts.bind(this);
        this.onSort = this.onSort.bind(this);
        this.onRecommend = this.onRecommend.bind(this);
        // this.onHeart = this.onHeart.bind(this);
        this.onConsult = this.onConsult.bind(this);

        this.drawProducts = this.drawProducts.bind(this);
        this.drawNoneContent = this.drawNoneContent.bind(this);
        this.drawNoneList = this.drawNoneList.bind(this);
        this.onMoveProductDetail = this.onMoveProductDetail.bind(this);
        this.onLike = this.onLike.bind(this);

        this.replaceUrl = this.replaceUrl.bind(this);
        this.setStateData = this.setStateData.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        this.setState({
            products: this.combineProducts(this.props.data)
        });
        window.addEventListener("scroll", this.onScroll, false);
    }

    componentDidMount() {
        // this.improvedGaForListView(this.state.products.list);
        setTimeout(() => {
            const { title, params } = this.state;
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: title || params.keyword });
            AppDispatcher.dispatch({ type: CONST.GLOBAL_SEARCH_TAG_UPDATE, payload: params.keyword });
        }, 0);
        this.replaceUrl(this.createParams(this.state.params));
    }

    componentWillUnmount() {
        this.state.isMount = false;
        window.removeEventListener("scroll", this.onScroll);
    }

    onScroll(e) {
        // products.total > params.page * params.limit
        const { products, params, limit } = this.state;
        //현재문서의 높이
        const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        //현재 스크롤탑의 값
        const scrollTop = typeof window.scrollY === "undefined" ? window.pageYOffset : window.scrollY;
        // const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        //현재 화면 높이 값
        const clientHeight = (document.documentElement.clientHeight);

        if (clientHeight + scrollTop >= (scrollHeight - 290) && products.total_cnt > params.page * limit) {
            this.setLoadingFlag();
        }
    }

    /**
     * 페이지가 로드되었을 때 scroll 위치를 이동시킨다.
     */
    onLoad() {
        // if (history.state) {
        //     if (this.state.params.page > 1) {
        //         document.body.scrollTop = history.state.scrollTop;
        //     }
        // }
    }

    /**
     * 상품을 다시 조회하여 정렬한다.
     * @param {{name: string, value: string}} sort
     */
    onSort(value) {
        const { params, limit, sortList, currentCategory } = this.state;
        const sort = sortList.find(s => s.value === value);
        this.gaEvent("정렬방법", `${currentCategory}_${sort.name}`);
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

    onKeyword(keyword) {
        const { params } = this.state;
        this.onSearch({ keyword, enter: params.enter, sort: params.sort });
    }

    /**
     * 더 많은 상품을 화면에 보여준다.
     */
    onMoreProducts() {
        const { params, product_list_cnt, limit } = this.state;
        const query = Object.assign(params, { page: params.page + 1, offset: params.page * limit });
        this.queryProducts(query).then(data => {
            // this.improvedGaForListView(data.products.list, product_list_cnt);
            this.setStateData(() => {
                return {
                    ...data,
                    isLoading: true,
                    product_list_cnt: product_list_cnt + data.products.list.length
                };
            });
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    // /**
    //  * 상품 상세 페이지로 이동한다.
    //  * @param {string} href
    //  */
    // onMoveProductDetail(href) {
    //     utils.history.replace(location.href, { path: location.href, scrollTop: document.body.scrollTop });
    //     location.href = href;
    // }

    setCommaSplit(tags = "") {
        return tags.split(",").reduce((result, tag) => `${result} #${tag}`, "");
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
     * API서버에게 상품 데이터를 요청한다.
     * @param params
     * @returns {axios.Promise}
     */
    queryProducts(params) {
        const user = auth.getUser();
        const query = this.createParams(Object.assign(params, { user_id: user ? user.id : "" }));
        return API.products.queryProducts(query)
            .then(response => {
                const data = response.data;
                this.replaceUrl(query);

                AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: query.keyword });

                return {
                    products: this.combineProducts(data),
                    params: this.composeParams(query),
                    search_count: data.search_count
                };
            })
            .catch(error => {
                PopModal.alert(error.data);
            });
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

    /**
     * 상담신청하기 모달창을 엽니다.
     */
    onConsult() {
        // const modal_name = "personal_consult";
        // const options = {
        //     className: "personal_consult"
        // };
        //
        // const consult_component = <PersonalConsult category={params.category} device_type="mobile" access_type="product_list" />;
        // PopModal.createModal(modal_name, consult_component, options);
        // PopModal.show(modal_name);
        // const modal_name = "simple__consult";
        //
        // Modal.show({
        //     type: MODAL_TYPE.CUSTOM,
        //     content: <SimpleConsult modal_name={modal_name} category={params.category} access_type="product_list" device_type="mobile" onClose={() => Modal.close(modal_name)} />,
        //     name: modal_name
        // });
        const modal_name = "simple__consult";
        // PopModal.createModal(modal_name,
        //     <SimpleConsult modal_name={modal_name} access_type="product_list" device_type="mobile" onClose={() => PopModal.close(modal_name)} />,
        //     { className: modal_name, modal_close: false });
        PopModal.createModal(modal_name,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({
                        access_type: "product_list",
                        device_type: "mobile",
                        page_type: "biz"
                    }, data);

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

    gaEvent(eAction, eLabel = "") {
        const { params } = this.state;

        const is_biz = utils.checkCategoryForEnter(params.category);
        const eCategory = is_biz ? "M_기업_리스트" : "M_개인_리스트";

        utils.ad.gaEvent("M_개인_리스트", eAction, eLabel);
    }
    /**
     * 상품리스트를 화면에 렌더링한다.
     * @returns {*}
     */
    drawProducts() {
        return this.drawProductFormBar(this.state.products);
        // return this.drawProductFormBasic(products);
    }

    /**
     * 상품리스트의 개별 상품출력 모양 (basic)
     */
    drawProductFormBasic(products) {
        return (
            <div>
                <ul style={{ paddingBottom: 15 }}>
                    {products.list.map((obj, i) => {
                        return <ProductListItem no={i + 1} key={`product-list-${obj.product_no}`} data={obj} defWidth="375" defHeight="250" onClick={this.onMoveProductDetail} />;
                    })}
                </ul>
            </div>
        );
    }

    drawProductFormBar(products) {
        return (
            <div>
                <ul style={{ paddingBottom: 15 }}>
                    {products.list.map((obj, i) => {
                        return <ProductListItemBar no={i + 1} key={`product-list-${obj.product_no}`} data={obj} onLike={this.onLike} defWidth="200" defHeight="200" onClick={this.onMoveProductDetail} />;
                    })}
                </ul>
            </div>
        );
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
                    //window.fbq("track", "AddToWishlist");
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

    replaceUrl(params) {
        if (window.history) {
            delete params.limit;
            delete params.offset;
            delete params.user_id;
            window.history.replaceState(null, "", `/products?${utils.query.stringify(params)}`);
        }
    }

    setStateData(update, callBack) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callBack);
        }
    }

    drawNoneContent() {
        const { params } = this.state;
        return (
            <div className="product__none">
                <div className="none__icon">
                    !
                </div>
                <div className="none__content">
                    <div className="none__text">
                        <div className="title">{params.keyword ? `"${params.keyword}" ` : ""}검색결과가 없어요.</div>
                        <div className="sub">상담요청을 통해 원하시는 촬영에 꼭 맞는 상품을 안내받으실 수 있어요.</div>
                    </div>
                    <div className="none__button">
                        <button onClick={this.onConsult}>상담요청</button>
                    </div>
                </div>
            </div>
        );
    }

    drawNoneList() {
        return (
            <div className="product__none__list">
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
        );
    }

    render() {
        const { products, params, sortList } = this.state;
        const { total_cnt, category_tag, search_count } = products;
        // const tags = this.setCommaSplit(params.tag);

        return (
            <div className="products-page">
                <main className="products__list__page" onLoad={this.onLoad}>
                    <article>
                        {/*<section className="products__list__top">
                         <div className="products__list__cover">
                         <Img image={{ src: "/awesome/awe_top_img.jpg", type: "image" }} />
                         </div>
                         <div className="products__list__cover__text">
                         <div className="text__middle">
                         <h1>{title || tags}</h1>
                         <span>{subtitle}</span>
                         </div>
                         <div className="text__bottom">
                         <span>총 {utils.format.price(products.total)}개의 상품</span>
                         </div>
                         </div>
                         </section>*/}
                        <section className="products__list__middle">
                            {params.keyword ?
                                <div className={classNames("product__search__content", { none__search: !total_cnt })}>
                                    <SearchContainer
                                        params={params}
                                        auto={{
                                            category: true
                                        }}
                                        search_count={search_count}
                                        option={!!total_cnt}
                                        onFetch={this.onSearch}
                                    />
                                </div> : null
                            }
                            {Array.isArray(category_tag) && category_tag.length && !params.keyword ?
                                <div className="products-page__resultBar">
                                    <RecommendList data={{ list: category_tag, tag: params.tag, categoryCode: params.category ? params.category : "" }} onResult={this.onRecommend} gaEvent={this.gaEvent} />
                                </div> : null
                            }
                            {total_cnt ?
                                <div className="products__list__sort">
                                    <DropDown
                                        data={sortList}
                                        select={params.sort}
                                        onSelect={value => this.onSort(value)}
                                    />
                                </div> : null
                            }
                            <div className="products__list">
                                {!total_cnt ? this.drawNoneContent() : this.drawProducts()}
                                {!total_cnt ? this.drawNoneList() : null}
                            </div>
                        </section>
                        {/*<section className="products__list__bottom">*/}
                        {/*<div className={classNames("products__list__more", products.total > params.page * params.limit ? "" : "none")}>*/}
                        {/*<a className="button button-block button__default" role="button" onClick={this.onMoreProducts}>촬영 더보기</a>*/}
                        {/*</div>*/}
                        {/*</section>*/}
                    </article>
                </main>
                <Footer>
                    <ScrollTop category={params.category} />
                </Footer>
            </div>
        );
    }
}

ProductList.propTypes = {
    data: PropTypes.shape({
        list: PropTypes.array.isRequired,
        total_cnt: PropTypes.string.isRequired
    }),
    params: PropTypes.shape({
        tag: PropTypes.string,
        sort: PropTypes.string.isRequired,
        limit: PropTypes.number.isRequired,
        offset: PropTypes.number.isRequired,
        page: PropTypes.number.isRequired,
        enter: PropTypes.enter
    }).isRequired,
    category: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        code: PropTypes.string,
        display_order: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }))
};

export default ProductList;
