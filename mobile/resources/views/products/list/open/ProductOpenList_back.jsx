import "./product_list.scss";
import React, { Component, PropTypes } from "react";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import API from "forsnap-api";
import cookie from "forsnap-cookie";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import { Footer } from "mobile/resources/containers/layout";
import { PRODUCT_SORT, NONE_LIST } from "shared/constant/product.const";
import { OPEN_ESTIMATE_LIST_DATA } from "./product_list.const";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import PopModal from "shared/components/modal/PopModal";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";
import ConsultModal from "mobile/resources/components/modal/consult/ConsultModal";
import ProductListNavigator from "./navigator/ProductListNavigator";
import CategoryReview from "./review/CategoryReviews";
import VirtualEstimate from "./virtual_estimate/VirtualEstimate";
import PreRecommendArtist from "./preRecommendArtist/PreRecommendArtist";
import PopRecommendArtist from "./pop/PopRecommendArtist";
import {
    ADVICE_EXTRA_TEXT,
    PROPERTYS,
    ADVICE_TYPE,
    ADD_ARTIST_TYPE,
    RECOMMEND_ACCESS_TYPE
} from "./virtual_estimate/virtual_estimate.const";
import * as virtualEstimateHelper from "./virtual_estimate/virtualEstimateHelper";
import * as EstimateSession
    from "../open/extraInfoSession";
// // 추천작가 테스트로 사용안함
// import RecommendPortfolio from "./recom_portfolio/RecommendPortfolio";
// import PortfolioList from "./list/PortfolioList";
// import ShotExample from "./example/ShotExample";
// import PopExample from "./example/PopExample";
// import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";

class ProductOpenList_back extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            category: this.composeCategory(props.category),
            params: this.composeParams(props.params),
            reviews: [],
            // 추천작가 기능을 위한 state 추가 20190525
            recommendArtists: [],   // 해당 카테고리 전체 추천작가 리스트
            fetchArtists: [],       // sub_code가 포함된 추천작가 리스트
            estimate_no: null,
            form: null,
            agent: cookie.getCookies("FORSNAP_UUID"),
            totalPrice: "",
            hasAlphas: false,
            recommendParams: {},
            order_no: null,
            device_type: "mobile",
            failConsultMsg: "상담신청 등록 중에 오류가 발생했습니다.\n문제 지속시 고객센터에 문의해 주세요."
            // products: {
            //     list: [],
            //     total_cnt: 0,
            //     category_tag: []
            // },
            // isLoading: true,
            // product_list_cnt: props.data.list.length || 0,
            // limit: 6
        };

        // API
        // this.queryProducts = this.queryProducts.bind(this);
        this.fetchRecommendArtist = this.fetchRecommendArtist.bind(this);
        this.fetchCategoryReviews = this.fetchCategoryReviews.bind(this);

        // Data
        this.composeCategory = this.composeCategory.bind(this);
        this.composeParams = this.composeParams.bind(this);

        // Interaction
        this.onConsultModal = this.onConsultModal.bind(this);
        this.onMoveProductDetail = this.onMoveProductDetail.bind(this);
        this.replaceUrl = this.replaceUrl.bind(this);
        this.setStateData = this.setStateData.bind(this);

        // recommend Artist ===========================
        // interaction
        this.onConsultForsnap = this.onConsultForsnap.bind(this);
        this.onConsultEstimate = this.onConsultEstimate.bind(this);
        this.onConsultToArtist = this.onConsultToArtist.bind(this);
        this.onConsultSearchArtist = this.onConsultSearchArtist.bind(this);
        // APIs
        this.callAPIConsultArtistInsert = this.callAPIConsultArtistInsert.bind(this);
        this.callAPIInsertOrderEstimate = this.callAPIInsertOrderEstimate.bind(this);
        this.callAPIConsultAdviceOrders = this.callAPIConsultAdviceOrders.bind(this);
        // this.callAPIFindRecommendArtist = this.callAPIFindRecommendArtist.bind(this);
        this.fetchChargeArtist = this.fetchChargeArtist.bind(this);

        // External Event
        this.externalEventBox = this.externalEventBox.bind(this);
        this.gaEvent = this.gaEvent.bind(this);

        // Etc
        this.selectArtistSendEstimate = this.selectArtistSendEstimate.bind(this);
        this.selectArtistSendList = this.selectArtistSendList.bind(this);
        this.switchConsultType = this.switchConsultType.bind(this);

        // recommend Artist ./end ===========================

        // // trash functions
        // this.onLoad = this.onLoad.bind(this);
        // this.onShowExample = this.onShowExample.bind(this);
        // this.onMoreProducts = this.onMoreProducts.bind(this);
        // this.onSort = this.onSort.bind(this);
        // this.onRecommend = this.onRecommend.bind(this);
        // this.onHeart = this.onHeart.bind(this);
        // this.onLike = this.onLike.bind(this);
        // this.onScroll = this.onScroll.bind(this);
        // this.onMoveDetailProductPage = this.onMoveDetailProductPage.bind(this);
        // this.combineProducts = this.combineProducts.bind(this);
        // this.onSearch = this.onSearch.bind(this);
        // this.onKeyword = this.onKeyword.bind(this);
        // this.composeSearchCount = this.composeSearchCount.bind(this);
    }

    componentWillMount() {
        const category = this.state.params.category;
        const list_data = OPEN_ESTIMATE_LIST_DATA[category];
        this.setState({
            // products: this.combineProducts(this.props.data),
            example: list_data.EXAMPLE,
            recommend_portfolio: list_data.RECOMMEND_PORTFOLIO,
            currentCategory: category
        }, () => {
            this.fetchCategoryReviews();
            this.fetchRecommendArtist(category);
            // this.fetchChargeArtist(category)
            //     .then(response => {
            //         const data = response.data;
            //         this.setStateData(() => {
            //             return {
            //                 recommendArtists: data.list
            //             }
            //         });
            //     })
        });
        // window.addEventListener("scroll", this.onScroll, false);
    }

    componentDidMount() {
        setTimeout(() => {
            const { title, params } = this.state;
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: title || params.keyword });
            AppDispatcher.dispatch({ type: CONST.GLOBAL_SEARCH_TAG_UPDATE, payload: params.keyword });
        }, 0);
        this.replaceUrl(this.createParams(this.state.params));
    }

    componentWillUnmount() {
        this.state.isMount = false;
        // window.removeEventListener("scroll", this.onScroll);
    }

    setStateData(update, callBack) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callBack);
        }
    }

    /**
     * 추천작가 리스트를 가져온다.
     * @param category
     */
    fetchRecommendArtist(category) {
        virtualEstimateHelper.apiGetRecommentArtists({ category })
            .then(response => {
                delete response.session_info;
                const data = response.data;
                this.setState({
                    recommendArtists: data.list
                });
            })
            .catch(error => {
                PopModal.closeProgress();
                PopModal.alert(error.data);
            });
    }

    /**
     * 카테고리 리뷰를 가져온다.
     * 전체 기업 카테고리
     */
    fetchCategoryReviews() {
        const { params } = this.state;
        const category = params.category;
        const biz_category_all = ["PRODUCT", "FOOD", "BEAUTY", "PROFILE_BIZ", "FASHION", "INTERIOR", "EVENT", "VIDEO_BIZ"];

        if (category) {
            virtualEstimateHelper.apiGetCategoryReviews({ category: biz_category_all.join(",") })
                .then(response => {
                    if (response.status === 200) {
                        const list = response.data.list;

                        this.setState({
                            reviews: list
                        });
                    }
                })
                .catch(error => {
                    PopModal.alert(error.data);
                });
        }
    }

    /**
     * 상품 상세 페이지로 이동한다.
     * @param {string} href
     */
    onMoveProductDetail(href) {
        utils.history.replace(location.href, { path: location.href, scrollTop: document.body.scrollTop });
        location.href = href;
    }

    /**
     * 카테고리를 조합한다.
     * @param data
     * @returns {*}
     */
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

    /**
     * 상품조회 파라미터를 만든다.
     * @param params
     * @returns {{}}
     */
    createParams(params) {
        return Object.keys(params).reduce((r, k) => {
            if (params[k]) {
                r[k] = params[k];
            }
            return r;
        }, {});
    }

    /**
     * 상담신청하기 모달창을 엽니다.
     * @param parameter - object
     * @param type - boolean
     * @param adviceType - string (["artist", "forsnap"])
     * @param list - array (recommendArtists)
     */
    onConsultModal(parameter, type, adviceType, list) {
        const { totalPrice } = this.state;
        const modal_name = "simple__consult";
        // 파라미터 조합
        const p = this.combineConsultParameter(parameter);

        if (!totalPrice) {
            if (!utils.type.isEmpty(p.extra_info)) delete p.extra_info;
            if (!utils.type.isEmpty(p.extra_text)) delete p.extra_text;
        }

        PopModal.createModal(modal_name,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({
                        ...p
                    }, data);

                    // 상담요청 api (작가상담, 포스냅 상담 구분)
                    this.switchConsultType(adviceType, params, list);
                    this.setState({
                        user_name: params.user_name,
                        user_phone: params.user_phone
                    });
                }}
                isTypeRecommendArtist={type}
                onClose={() => PopModal.close(modal_name)}
            />,
            { modal_close: false }
        );

        PopModal.show(modal_name);
    }

    /**
     * 상담신청용 파라미터를 조합합니다.
     * @param params
     * @returns {*}
     */
    combineConsultParameter(params) {
        const { agent, form, estimate_no, currentCategory } = this.state;
        params.agent = agent;
        params.category = currentCategory;

        if (estimate_no) {
            params.estimate_no = estimate_no;
        }

        if (agent) {
            params.agent = agent;
        }

        return params;
    }

    /**
     * 타입에 따라 연관된 상담신청 api를 호출합니다.
     * @param type
     * @param params
     * @param list
     */
    switchConsultType(type, params, list) {
        PopModal.progress();
        const modalName = "simple__consult";
        if (type === ADVICE_TYPE.ARTIST.CODE) {
            // 작가상담신청 api 호출
            // access_type = list
            params.access_type = RECOMMEND_ACCESS_TYPE.LIST.CODE;
            params.device_type = this.state.device_type;
            this.callAPIConsultArtistInsert(params, list, modalName);
        }

        // 모바일에선 안쓰일거 같음
        if (type === ADVICE_TYPE.FORSNAP.CODE) {
            // 포스냅 상담신청 api 호출
            this.callAPIConsultAdviceOrders(params, modalName);
        }
    }

    /**
     * 추천작가 조회 api 호출
     * @param params
     */
    // callAPIFindRecommendArtist(params) {
    //     API.orders.findRecommendArtist(params);
    // }

    /**
     * 추천작가 팝업
     * @param params
     * @param list
     * @param type - String: (func type)
     */
    onShowPopRecommendArtist(params, list, type) {
        const { totalPrice } = this.state;
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            name: "another_artist",
            opacity: "0.7",
            content: (
                <PopRecommendArtist
                    no={params.no}
                    totalPrice={totalPrice}
                    list={list}
                    title={params.title}
                    desc={params.desc}
                    onClose={() => Modal.close()}
                    selectArtistSendConsult={nos => this.switchSendArtist(nos, list, type)}
                />
            )
        });
    }

    switchSendArtist(nos, list, type) {
        if (nos.length > 0) {
            switch (type) {
                case ADD_ARTIST_TYPE.LIST.CODE:
                    this.selectArtistSendList(nos, list);
                    break;
                case ADD_ARTIST_TYPE.ESTIMATE.CODE:
                    this.selectArtistSendEstimate(nos, list);
                    break;
                default: break;
            }
        } else {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "작가를 선택해주세요."
            });
        }
    }

    /**
     * 견적확인에서 작가직접 추가 상담신청
     * @param nos
     * @param list
     */
    selectArtistSendEstimate(nos, list) {
        const { recommendParams, order_no, failConsultMsg, device_type, estimate_no } = this.state;

        if (nos.length > 0) {
            const modal_name = "simple__consult";
            Modal.close("another_artist");

            PopModal.createModal(
                modal_name,
                <ConsultModal
                    onConsult={data => {
                        Modal.show({ type: MODAL_TYPE.PROGRESS });
                        const params = Object.assign({}, data, {
                            ...recommendParams
                        });
                        // this.onSubmit();
                        this.setState({
                            user_name: params.user_name,
                            user_phone: params.user_phone
                        });

                        const promise = [];
                        nos.map((obj, idx) => {
                            const item = list.filter(artist => artist.no === obj)[0];
                            if (idx === 0) {
                                const _params = Object.assign({}, params);
                                const hasProperty = key => {
                                    return Object.prototype.hasOwnProperty.call(_params, key);
                                };
                                if (hasProperty("extra_info")) {
                                    delete _params.extra_info;
                                }
                                if (hasProperty("access_type")) {
                                    delete _params.access_type;
                                }
                                if (hasProperty("user_id")) {
                                    delete _params.user_id;
                                }
                                if (hasProperty("category")) {
                                    delete _params.category;
                                }
                                if (hasProperty("agent")) {
                                    delete _params.agent;
                                }
                                promise.push(
                                    virtualEstimateHelper.apiPutArtistOrder(order_no, Object.assign(_params, { artist_id: item.user_id, product_no: item.product_no, estimate_no }))
                                        .then(() => {
                                            this.externalEventBox();
                                        })
                                );
                            } else {
                                promise.push(
                                    virtualEstimateHelper.apiInsertArtistOrder(Object.assign(params,
                                        {
                                            artist_id: item.user_id,
                                            product_no: item.product_no,
                                            access_type: RECOMMEND_ACCESS_TYPE.ESTIMATE_ADD.CODE,
                                            device_type
                                        }))
                                        .then(() => {
                                            this.externalEventBox();
                                        })
                                );
                            }
                            return null;
                        });

                        this.iterateAPIs(promise, () => PopModal.close(modal_name));
                    }}
                    isTypeRecommendArtist
                    onClose={() => PopModal.close(modal_name)}
                />,
                {
                    modal_close: false
                }
            );

            PopModal.show(modal_name);
        } else {
            Modal.close(MODAL_TYPE.PROGRESS);
            Modal.close("another_artist");
        }
    }

    /**
     * 리스트에서 작가직접 추가 상담신청
     * @param nos - array: 선택한 추천작가 리스트 번호
     * @param list - array: 전체 추천작가 리스트
     */
    selectArtistSendList(nos, list) {
        const { user_phone, user_name, agent, currentCategory, totalPrice, recommendParams, failConsultMsg, device_type } = this.state;
        const baseParams = { user_phone, user_name, ...recommendParams };
        const user = auth.getUser();
        if (!totalPrice) {
            baseParams.extra_info = null;
            baseParams.extra_text = null;
        }
        if (user) {
            baseParams.user_id = user.id;
        }
        if (nos.length > 0) {
            Modal.show({ type: MODAL_TYPE.PROGRESS });
            const promise = [];

            nos.map(obj => {
                const item = list.filter(artist => artist.no === obj)[0];
                promise.push(
                    virtualEstimateHelper.apiInsertArtistOrder(Object.assign(baseParams,
                        {
                            category: currentCategory,
                            agent,
                            artist_id: item.user_id,
                            product_no: item.product_no,
                            access_type: RECOMMEND_ACCESS_TYPE.LIST_ADD.CODE,
                            device_type
                        }))
                    .then(() => {
                        this.externalEventBox();
                    })
                    .catch(e => {
                        Modal.close(MODAL_TYPE.PROGRESS);
                        PopModal.alert(failConsultMsg);
                    })
                );
                return null;
            });

            // 프로미스 반복
            this.iterateAPIs(promise);
        } else {
            Modal.close(MODAL_TYPE.PROGRESS);
            Modal.close("another_artist");
        }
    }

    /**
     * 작가상담 마지막 페이즈를 그립니다.
     * @returns {*}
     */
    renderLastPhase() {
        return (
            <div className="pop-recommend-artist__last_phase">
                <div style={{ color: "#fff" }}>
                    <p style={{ fontSize: 21, fontWeight: "bold", marginBottom: 10 }}>연락요청이 완료되었습니다.</p>
                    <p style={{ fontSize: 16 }}>입력해주신 정보로 작가님께서<br />연락드릴 예정입니다.</p>
                </div>
            </div>
        );
    }

    /**
     * api반복 호출한다.
     * @param list
     * @param close
     */
    iterateAPIs(list, close = null) {
        Promise.all(list).then(response => {
            if (close) {
                close();
            }
            Modal.close(MODAL_TYPE.PROGRESS);
            Modal.close("another_artist");
            PopModal.createModal("last_phase",
                this.renderLastPhase(),
                { className: "last_phase", modal_close: false }
            );
            PopModal.show("last_phase");
            setTimeout(() => {
                PopModal.close("last_phase");
            }, 2000);
        }).catch(error => {
            Modal.close(MODAL_TYPE.PROGRESS);
            PopModal.alert("촬영요청 중 오류가 발생하였습니다.\n문제가 지속될 시 고객센터에 문의해 주세요.");
        });
    }

    /**
     * 작가 직접 상담신청 1단계 api 호출
     * @param params
     * @param list
     * @param modalName
     */
    callAPIConsultArtistInsert(params, list = null, modalName = "simple__consult") {
        const { totalPrice, no } = this.state;
        virtualEstimateHelper.apiInsertArtistOrder(params).then(response => {
            PopModal.closeProgress();
            const data = response.data;
            this.setState({
                order_no: data.advice_no
            }, () => {
                PopModal.close(modalName);

                let title = "전달이 완료되었습니다.";
                let desc = "다른작가님에게도 촬영안내를 받아보세요.";
                let _no = no;
                // let no = no;

                if (totalPrice) {
                    title = <span>견적가 <span style={{ color: "#f7b500" }}>{utils.format.price(totalPrice)}원</span>에<br />촬영할 작가님을 선택하세요.</span>;
                    desc = "복수의 작가님을 선택가능합니다.";
                    _no = 0;
                }

                const p = {
                    title,
                    desc,
                    no: _no
                };

                this.onShowPopRecommendArtist(p, list, ADD_ARTIST_TYPE.LIST.CODE);
            });
            // resolve(data);
        }).catch(error => {
            PopModal.closeProgress();
            PopModal.alert(error.data || "작가문의 등록 중 오류가 발생했습니다.\n문제가 지속될 시 고객센터에 문의해 주세요.");
        });
    }

    /**
     * 외부 이벤트 박스
     */
    externalEventBox() {
        this.onSubmit();
        utils.ad.wcsEvent("4");
        utils.ad.gtag_report_conversion(location.href);
        utils.ad.gaEvent("기업고객", "상담전환");
        utils.ad.gaEventOrigin("기업고객", "상담전환");
    }

    /**
     * 포스냅 상담신청 api 호출
     * @param params
     * @param modalName
     * @constructor
     */
    callAPIConsultAdviceOrders(params, modalName) {
        virtualEstimateHelper.apiInsertAdviceOrders(params)
            .then(response => {
                PopModal.closeProgress();
                this.externalEventBox();
                PopModal.alert("상담신청해 주셔서 감사합니다.\n곧 연락 드리겠습니다.", { callBack: () => PopModal.close(modalName) });
            })
            .catch(error => {
                PopModal.closeProgress();
                if (error && error.date) {
                    PopModal.alert(error.data);
                }
            });
    }

    fetchChargeArtist(category, ignore_artist_id) {
        const params = {
            category
        };

        // if (ignore_artist_id) {
        //     params.ignore_artist_id = ignore_artist_id;
        // }

        return API.products.findChargeArtist(params);
    }

    /**
     * 수정예정
     */
    onSubmit() {
        const session = sessionStorage;
        if (session) {
            const referer = session.getItem("referer");
            if (referer && referer === "facebook_ad") utils.ad.gaEvent("M_페이스북광고_기업", session.getItem("facebook_ad_content"), "상담전환");
            if (referer && referer === "naver_power") utils.ad.gaEvent("M_네이버광고_기업", session.getItem("naver_ad_content"), "상담전환");
        }
    }

    /**
     * ga이벤트를 등록한다.
     * @param action
     */
    gaEvent(action) {
        const { currentCategory } = this.state;
        // const category = this.props.params.category;
        utils.ad.gaEvent("M_기업_리스트", action, utils.format.categoryCodeToName(currentCategory));
    }

    /**
     * 주소를 치환한다..
     * @param params
     */
    replaceUrl(params) {
        if (window.history) {
            delete params.limit;
            delete params.offset;
            delete params.user_id;
            window.history.replaceState(null, "", `/products?${utils.query.stringify(params)}`);
        }
    }

    /**
     * 모달창을 닫는다.
     * @param name
     */
    onClose(name) {
        PopModal.close(name);
    }

    /**
     * 산출된 견적을 등록한다.
     * @param form
     * @param params
     * @returns {*}
     */
    onConsultEstimate({ form, agent, category, hasAlphas, totalPrice }) {
        const { device_type } = this.state;
        // form 데이터를 복사한다.
        const _form = Object.assign({}, form);

        // 복사한 객체에 sub_code가 존재하는지 체크
        if (Object.prototype.hasOwnProperty.call(_form, "sub_code")) {
            // sub_code를 제거한다.
            delete _form.sub_code;
        }

        if (totalPrice) {
            _form.total_price = hasAlphas ? `${totalPrice}+a` : totalPrice;
        }

        // 견적산출 파라미터 설정
        const params = {
            extra_info: JSON.stringify({ ..._form }),
            agent,
            category,
            device_type
        };

        if (totalPrice) {
            // total_price 값이 존재하면 견적산출 api를 호출한다.
            this.callAPIInsertOrderEstimate(params, { form: _form, totalPrice, hasAlphas, agent });
        }

        // 견적정보를 state에 저장한다.
        this.setState({
            form,
            agent,
            // category,
            totalPrice,
            hasAlphas
        });
    }

    /**
     * 포스냅에 상담을 신청한다. (?데탑이랑 다르게 버튼이 하나밖에 없다...)
     * @param access_type
     */
    onConsultForsnap(access_type) {
        const { estimate_no, form, currentCategory, device_type, totalPrice, hasAlphas } = this.state;
        const _form = Object.assign({}, form);

        // 복사한 객체에 sub_code가 존재하는지 체크
        if (Object.prototype.hasOwnProperty.call(_form, "sub_code")) {
            // sub_code를 제거한다.
            delete _form.sub_code;
        }

        if (totalPrice) {
            _form.total_price = hasAlphas ? `${totalPrice}+a` : totalPrice;
        }

        const params = {
            access_type,
            device_type,
            page_type: "biz",
            category: currentCategory
        };

        if (estimate_no) {
            params.estimate_no = estimate_no;
        }

        if (_form) {
            params.extra_info = JSON.stringify({ ..._form });
        }

        // 포스냅으로 상담신청 모달창을 띄운다.
        this.onConsultModal(params, false, ADVICE_TYPE.FORSNAP.CODE);
    }

    /**
     * 추천작가용 파라미터를 생성합니다.
     * @param form
     * @param total_price
     * @param hasAlphas
     * @param agent
     * @returns {{agent: *, category: string, extra_info: string, extra_text: string}}
     */
    createRecommendArtistParams({ form, total_price, hasAlphas, agent }) {
        const category = this.state.currentCategory.toUpperCase();
        const user = auth.getUser();

        // 코드에서 한글로 치환
        const exchangeCodeToText = this.exchangeCodeToText(form);

        const params = {
            agent,
            category,
            extra_info: JSON.stringify(form),
            extra_text: JSON.stringify(exchangeCodeToText)
        };

        // 유저가 로그인했다면 아이디를 넘겨준다.
        if (user) {
            params.user_id = user.id;
        }

        return { ...params };
    }

    /**
     * extra_info 데이터를 한글로 치환합니다.
     * @param formonConsultForsnap
     * @returns {{}}
     */
    exchangeCodeToText(form) {
        return Object.keys(form).reduce((result, key) => {
            const keyUpperCase = key.toUpperCase();
            const formKeyUpperCase = typeof form[key] === "string" ? form[key].toUpperCase() : form[key];
            let value = Object.prototype.hasOwnProperty.call(ADVICE_EXTRA_TEXT, formKeyUpperCase) ? ADVICE_EXTRA_TEXT[formKeyUpperCase].NAME : form[key];

            // key가 video_length 이면 텍스트를 치환한다.
            if (key === PROPERTYS.VIDEO_LENGTH.CODE) {
                switch (value) {
                    case "1": value = "1분미만"; break;
                    case "2": value = "1분~3분"; break;
                    case "3": value = "3분~5분"; break;
                    case "4+a": value = "5분이상"; break;
                    default: value = form[key]; break;
                }
            }

            return Object.assign(result, { [PROPERTYS[keyUpperCase].NAME]: value });
        }, {});
    }

    /**
     * 견적산출 api를 호출합니다.
     * @param params
     * @param form
     * @param totalPrice
     * @param hasAlphas
     * @param agent
     */
    callAPIInsertOrderEstimate(params, { form, totalPrice, hasAlphas, agent }) {
        virtualEstimateHelper.apiInsertOrderEstimate(params)
            .then(response => {
                const data = response.data;
                // 작가상담용 객체 키, 밸류 값을 치환합니다. (extra_text)
                const recommendParams = this.createRecommendArtistParams({ form, totalPrice, hasAlphas, agent });
                recommendParams.estimate_no = response.data.estimate_no;
                EstimateSession.setSessionEstimateData(EstimateSession.EXTRA_INFO_KEY, recommendParams);

                this.setState({
                    estimate_no: data.estimate_no,
                    recommendParams
                });
            })
            .catch(error => {
                PopModal.alert(error.data ? error.data : "견적을 산출하는데 오류가 발생했습니다.\n문제가 지속될 경우 고객센터에 문의해 주세요.");
            });
    }

    /**
     * 작가에게 직접상담신청을 한다.
     */
    onConsultToArtist(data) {
        const { agent, currentCategory, totalPrice, recommendParams, recommendArtists } = this.state;
        const user = auth.getUser();
        const params = {
            agent,
            category: currentCategory,
            artist_id: data.user_id,
            product_no: data.product_no
        };

        if (user) {
            params.user_id = user.id;
        }

        if (totalPrice) {
            params.extra_info = recommendParams.extra_info;
            params.extra_text = recommendParams.extra_text;
        }

        // 선택한 작가 제외 리스트
        const _recommendArtists = recommendArtists.filter(item => item.no !== data.no);

        // 작가에게 직접 상담신청 모달창을 띄운다.
        this.onConsultModal(params, true, ADVICE_TYPE.ARTIST.CODE, _recommendArtists);
    }

    /**
     * 작가검색
     */
    onConsultSearchArtist() {
        const { totalPrice, currentCategory, form, recommendParams, failConsultMsg, device_type } = this.state;
        if (!totalPrice) {
            PopModal.alert("총 예상 견적을 먼저 확인해주세요.");
        } else {
            PopModal.progress();
            utils.ad.gaEvent("M_기업_리스트", "추천작가확인", currentCategory);
            // this.fetchChargeArtist(currentCategory)
            virtualEstimateHelper.apiGetRecommentArtists({ category: currentCategory, type: form.sub_code || "" })
                .then(response => {
                    const data = response.data;
                    this.setState({
                        fetchArtists: data.list
                    }, () => {
                        // 1단계 api 호출
                        recommendParams.access_type = RECOMMEND_ACCESS_TYPE.ESTIMATE.CODE;
                        recommendParams.device_type = device_type;
                        virtualEstimateHelper.apiInsertArtistOrder(recommendParams)
                            .then(res => {
                                PopModal.closeProgress();
                                const d = res.data;
                                this.setState({
                                    order_no: d.advice_no
                                }, () => {
                                    const p = {
                                        title: <span>견적가 <span style={{ color: "#f7b500" }}>{utils.format.price(totalPrice)}원</span>에<br />촬영할 작가님을 선택하세요.</span>,
                                        desc: "복수의 작가님을 선택가능합니다.",
                                        no: 0
                                    };

                                    this.onShowPopRecommendArtist(p, this.state.fetchArtists, ADD_ARTIST_TYPE.ESTIMATE.CODE);
                                });
                            })
                            .catch(error => {
                                PopModal.closeProgress();
                                PopModal.alert(error.data || failConsultMsg);
                            });
                    });
                }).catch(error => {
                    PopModal.closeProgress();
                    PopModal.alert(error.data);
                });
        }
    }

    // ============== trash functions ===================//

    // composeSearchCount(data) {
    //     if (data && data instanceof Object) {
    //         const { category } = this.state;
    //         return Object.keys(data).reduce((r, k) => {
    //             const count = isNaN(Number(data[k])) ? 0 : Number(data[k]);
    //             if (count) {
    //                 const item = category.find(c => c.code === k);
    //                 if (item) {
    //                     r.push({
    //                         name: item.name,
    //                         value: item.code,
    //                         count
    //                     });
    //                 }
    //             }
    //
    //             return r;
    //         }, [{ name: "전체", value: "", count: data.TOTAL }]);
    //     }
    //
    //     return [];
    // }

    /**
     * 상품을 검색한다.(오픈견적에선 사용안함)
     * @param form
     */
    // onSearch(form) {
    //     this.state.products = {
    //         list: [],
    //         total_cnt: 0,
    //         category_tag: []
    //     };
    //     this.queryProducts(form)
    //         .then(data => {
    //             this.setStateData(
    //                 () => data,
    //                 () => window.scrollTo(0, 0)
    //             );
    //         });
    // }

    /**
     * 검색어 입력를 입력한다.
     * @param keyword
     */
    // onKeyword(keyword) {
    //     const { params } = this.state;
    //     this.onSearch({ keyword, enter: params.enter, sort: params.sort });
    // }

    // onScroll(e) {
    //     // products.total > params.page * params.limit
    //     const { products, params, limit } = this.state;
    //     //현재문서의 높이
    //     const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    //     //현재 스크롤탑의 값
    //     const scrollTop = typeof window.scrollY === "undefined" ? window.pageYOffset : window.scrollY;
    //     // const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    //     //현재 화면 높이 값
    //     const clientHeight = (document.documentElement.clientHeight);
    //
    //     if (clientHeight + scrollTop >= (scrollHeight - 290) && products.total_cnt > params.page * limit) {
    //         this.setLoadingFlag();
    //     }
    // }

    /**
     * 페이지가 로드되었을 때 scroll 위치를 이동시킨다.
     */
    // onLoad() {
    // if (history.state) {
    //     if (this.state.params.page > 1) {
    //         document.body.scrollTop = history.state.scrollTop;
    //     }
    // }
    // }
    // onShowExample(data) {
    //     this.gaEvent("촬영사례");
    //     const isVideo = data.width || null;
    //
    //     // const modal_name = "pop_example";
    //     const modal_name = isVideo ? "pop_example example_video" : "pop_example";
    //     const content =
    //         <PopExample data={data} category={this.props.params.category} gaEvent={this.gaEvent} onClose={() => this.onClose(modal_name)} onConsult={this.onConsult} />;
    //
    //     PopModal.createModal(modal_name, content, { modal_close: false, className: modal_name });
    //     PopModal.show(modal_name);
    // }

    // onRecommend(tag) {
    //     const { params } = this.state;
    //     const query = Object.assign(params, {
    //         offset: 0,
    //         keyword: "",
    //         tag
    //     });
    //
    //     this.state.products = {
    //         list: [],
    //         total_cnt: 0,
    //         category_tag: []
    //     };
    //     this.queryProducts(query).then(data => {
    //         this.setStateData(() => data);
    //     }).catch(error => {
    //         PopModal.alert(error.data);
    //     });
    // }

    /**
     * 더 많은 상품을 화면에 보여준다.
     */
    // onMoreProducts() {
    //     const { params, product_list_cnt, limit } = this.state;
    //     const query = Object.assign(params, { page: params.page + 1, offset: params.page * limit });
    //     this.queryProducts(query).then(data => {
    //         this.setStateData(() => {
    //             return {
    //                 ...data,
    //                 isLoading: true,
    //                 product_list_cnt: product_list_cnt + data.products.list.length
    //             };
    //         });
    //     }).catch(error => {
    //         PopModal.alert(error.data);
    //     });
    // }

    // setLoadingFlag() {
    //     if (this.state.isLoading) {
    //         this.setState({
    //             isLoading: false
    //         }, () => {
    //             if (!this.state.isLoading) {
    //                 this.onMoreProducts();
    //             }
    //         });
    //     }
    // }

    /**
     * API서버에게 상품 데이터를 요청한다.
     * @param params
     * @returns {axios.Promise}
     */
    // queryProducts(params) {
    //     const user = auth.getUser();
    //     const query = this.createParams(Object.assign(params, { user_id: user ? user.id : "" }));
    //     return API.products.queryProducts(query)
    //         .then(response => {
    //             const data = response.data;
    //             this.replaceUrl(query);
    //
    //             AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: query.keyword });
    //
    //             return {
    //                 products: this.combineProducts(data),
    //                 params: this.composeParams(query),
    //                 search_count: data.search_count
    //             };
    //         })
    //         .catch(error => {
    //             PopModal.alert(error.data);
    //         });
    // }

    /**
     * 데이터 병합
     * @param data
     * @return {{list: *, total_cnt: *, category_tag: *}}
     */
    // combineProducts(data) {
    //     const { products } = this.state;
    //     const { list, total_cnt, category_tag, search_count } = data;
    //     const merge = utils.mergeArrayTypeObject(products ? products.list : [], list);
    //     return {
    //         list: merge.list,
    //         total_cnt: Number(total_cnt) || 0,
    //         category_tag: category_tag ? utils.search.parse(category_tag) : [],
    //         search_count: this.composeSearchCount(search_count)
    //
    //     };
    // }

    render() {
        const { params, reviews, recommendArtists } = this.state;
        // const { params, isReviewLoaded, isRecommendLoaded, reviews, recommendArtists, recommend_portfolio } = this.state;
        // const { products, example } = this.state;
        const category = params.category;

        // if (!isRecommendLoaded) {
        //     return false;
        // }

        return (
            <div className="products-page product_list_mo">
                <ProductListNavigator />
                <main className="products__list__page">
                    <PreRecommendArtist
                        list={recommendArtists}
                        onConsult={this.onConsultToArtist}
                    />
                    <VirtualEstimate
                        onConsultForsnap={this.onConsultForsnap}
                        gaEvent={this.gaEvent}
                        onConsultSearchArtist={this.onConsultSearchArtist}
                        onConsultEstimate={this.onConsultEstimate}
                        category={category}
                    />
                    {/*<ShotExample category={category} data={example} onShowExample={this.onShowExample} gaEvent={this.gaEvent} />*/}
                    <CategoryReview list={reviews} />
                    {/*<RecommendPortfolio data={recommend_portfolio} category={category} />*/}
                    {/*<PortfolioList products={products} params={params} gaEvent={this.gaEvent} onRecommend={this.onRecommend} />*/}
                </main>
                <Footer>
                    <ScrollTop category={params.category}>
                        <div className="float__icon">
                            <a href="tel:07040604406">
                                <img role="presentation" alt="tel" src={`${__SERVER__.img}/mobile/icon/yellow_tel.png`} style={{ width: "100%", height: "100%" }} />
                            </a>
                        </div>
                    </ScrollTop>
                </Footer>
            </div>
        );
    }
}

ProductOpenList_back.propTypes = {
    // data: PropTypes.shape({
    //     list: PropTypes.array.isRequired,
    //     total_cnt: PropTypes.string.isRequired
    // }),
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

export default ProductOpenList_back;
