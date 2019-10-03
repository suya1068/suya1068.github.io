import "./product_list.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import cookie from "forsnap-cookie";
import PopModal from "shared/components/modal/PopModal";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import auth from "forsnap-authentication";
// layout
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";
import Footer from "desktop/resources/components/layout/footer/Footer";
import ScrollTop from "desktop/resources/components/scroll/ScrollTop";
// import PreRecommendArtist from "./components/preRecommendArtist/PreRecommendArtist";
import ConsultBar from "desktop/resources/views/main/business/components/ConsultBar";
import VirtualEstimate from "./components/virtual_estimate/VirtualEstimate";
import ConsultModal from "desktop/resources/components/modal/consult/ConsultModal";
import AnotherRecommendArtist from "./components/pop/AnotherRecommendArtist";
import PopArtistReview from "./components/pop/review/PopArtistReview";
import ChargeArtist from "./components/charge/ChargeArtist";
import FreeArtist from "./components/free/FreeArtist";
import PopReceiveEmail from "./components/pop/email/PopReceiveEmail";
import VirtualEstimateSteps from "desktop/resources/components/estimate/VirtualEstimateContainer";
import {
    ADVICE_EXTRA_TEXT,
    PROPERTYS,
    ADVICE_TYPE,
    ADD_ARTIST_TYPE,
    RECOMMEND_ACCESS_TYPE
} from "./components/virtual_estimate/virtual_estimate.const";
import { CATEGORY_CODE } from "shared/constant/product.const";
import * as EstimateSession from "./components/extraInfoSession";
import AfterInquireArtist from "./components/recommend/after/AfterInquireArtist";
import * as virtualEstimateHelper from "../open/components/virtual_estimate/virtualEstimateHelper";

// import ExampleReview from "./components/example_review/ExampleReview";

import ConceptBanner from "desktop/resources/components/banner/concept/ConceptBanner";

export default class ProductList extends Component {
    constructor(props) {
        super(props);
        const search = location.search;
        this.state = {
            isMount: true,
            title: "",
            category: this.composeCategory(props.category),
            params: this.composeParams(props.params),
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
            device_type: "pc",
            failConsultMsg: "상담신청 등록 중에 오류가 발생했습니다.\n문제 지속시 고객센터에 문의해 주세요.",
            //
            products: {
                list: [],
                total_cnt: 0,
                category_tag: []
            },
            product_list_cnt: props.data.list.length || 0,
            //
            receiveEstimate: null,
            artist_list: [],
            search: search ? utils.query.parse(search) : "",
            access_type: "list"
        };

        // API
        // this.fetchRecommendArtist = this.fetchRecommendArtist.bind(this);

        // Data
        this.composeCategory = this.composeCategory.bind(this);
        this.composeParams = this.composeParams.bind(this);
        this.combineProducts = this.combineProducts.bind(this);

        // Interaction
        this.onConsultModal = this.onConsultModal.bind(this);
        // this.onMoveProductDetail = this.onMoveProductDetail.bind(this);
        this.replaceUrl = this.replaceUrl.bind(this);
        this.setStateData = this.setStateData.bind(this);
        this.onLoad = this.onLoad.bind(this);

        // recommend Artist ===========================
        // interaction
        this.onConsult = this.onConsult.bind(this);
        this.onConsultOur = this.onConsultOur.bind(this);
        this.onConsultEstimate = this.onConsultEstimate.bind(this);
        this.onConsultToArtist = this.onConsultToArtist.bind(this);
        this.onConsultSearchArtist = this.onConsultSearchArtist.bind(this);
        this.onPopArtistReview = this.onPopArtistReview.bind(this);

        // APIs
        this.callAPIConsultArtistInsert = this.callAPIConsultArtistInsert.bind(this);
        this.callAPIInsertOrderEstimate = this.callAPIInsertOrderEstimate.bind(this);
        this.callAPIConsultAdviceOrders = this.callAPIConsultAdviceOrders.bind(this);
        // this.callAPIFindRecommendArtist = this.callAPIFindRecommendArtist.bind(this);

        // External Event
        this.externalEventBox = this.externalEventBox.bind(this);
        this.gaEvent = this.gaEvent.bind(this);

        // Etc
        this.selectArtistSendEstimate = this.selectArtistSendEstimate.bind(this);
        this.selectArtistSendList = this.selectArtistSendList.bind(this);
        this.switchConsultType = this.switchConsultType.bind(this);
        this.selectArtistSendConsult = this.selectArtistSendConsult.bind(this);
        // this.onPopArtistReview = this.onPopArtistReview.bind(this);
        // ?
        this.createParams = this.createParams.bind(this);
        this.onChangeShotKind = this.onChangeShotKind.bind(this);
        this.onReceiveEmail = this.onReceiveEmail.bind(this);
        this.receiveEmail = this.receiveEmail.bind(this);
        this.checkState = this.checkState.bind(this);

        // this.checkFetch = this.checkFetch.bind(this);

        this.testPosition = this.testPosition.bind(this);
        this.testFetch = this.testFetch.bind(this);
        this.receiveTotalPrice = this.receiveTotalPrice.bind(this);
    }

    componentWillMount() {
        const category = this.state.params.category;

        // 견적 번호를 파라미터로 가지고 있을 시 견적 정보를 조회한다.
        const estimate_no = utils.query.parse(location.search) && utils.query.parse(location.search).estimate_no;
        const mcl = (utils.query.parse(location.search) && utils.query.parse(location.search).mcl) || false;
        if (estimate_no) {
            virtualEstimateHelper.apiGetEstimate(estimate_no)
                .then(response => {
                    const data = response.data;

                    // 저장된 카테고리와 리스트의 카테고리가 같은 때에만 데이터를 저장한다.
                    if (data.category === category) {
                        this.setState({
                            receiveEstimate: data.extra_info,
                            totalPrice: data.extra_info.total_price,
                            estimate_no
                        });
                    }
                });
        }

        this.setState({
            products: this.combineProducts(this.props.data),
            currentCategory: category,
            mcl: mcl === "1" || false
        });
    }

    componentDidMount() {
        const { params } = this.state;
        this.replaceUrl(this.createParams(this.state.params));
        const category = params.category;
        this.apiGetRecommendArtist({ category, offset: 0 })
            .then(response => {
                const data = response.data;

                this.setState({
                    artist_list: data.list
                });
            });
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    scrollPosition(flag = true) {
        const scrollTarget = document.querySelector(".virtual-estimate__container");
        const targetRect = scrollTarget.getBoundingClientRect();
        const goalScroll = targetRect.top - 120;
        // console.log("glalScroll", targetRect, goalScroll);
        if (flag) {
            const speed = 400;
            const firstStep = typeof window.scrollY === "undefined" ? window.pageYOffset : window.scrollY;
            const scrollStep = firstStep + (speed / 10);
            const scrollInterval = setInterval(() => {
                if ((typeof window.scrollY === "undefined" ? window.pageYOffset : window.scrollY) < goalScroll) {
                    window.scrollBy(Number(goalScroll), scrollStep);
                } else {
                    clearInterval(scrollInterval);
                }
            }, 15);
        } else {
            window.scrollTo(0, Number(goalScroll));
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
            category_tag: category_tag ? utils.search.parse(category_tag) : []
        };
    }

    /**
     * 추천작가 리스트를 가져온다.
     * @param category
     */
    // fetchRecommendArtist(category) {
    //     virtualEstimateHelper.apiGetChargeArtistProduct({ category })
    //         .then(response => {
    //             delete response.session_info;
    //             const data = response.data;
    //             this.setState({
    //                 recommendArtists: data.list
    //             });
    //         })
    //         .catch(error => {
    //             PopModal.closeProgress();
    //             PopModal.alert(error.data);
    //         });
    // }

    apiGetRecommendArtist(params) {
        return virtualEstimateHelper.apiGetChargeArtistProduct(params);
    }

    /**
     * 작가에게 직접상담신청을 한다.
     */
    onConsultToArtist(data) {
        // this.gaEvent("추천작가_작가문의", { product_no: data.product_no, nick_name: data.nick_name });
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
     * 팝업 닫기
     * @param name
     */
    onClose(name) {
        PopModal.close(name);
    }

    /**
     * 작가리뷰 팝업
     */
    onPopArtistReview(data) {
        const modalName = "pop-review";
        this.gaEvent("추천작가_촬영후기보기", { nick_name: data.nick_name, product_no: data.product_no });
        PopModal.createModal(modalName,
            <PopArtistReview
                list={data.review.list}
                nickName={data.nick_name}
                onClose={() => PopModal.close(modalName)}
            />
            , { modal_close: false, className: modalName });
        PopModal.show(modalName);
    }

    setStateData(update, callBack) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callBack);
        }
    }

    /**
     * url 변경
     * @param params
     */
    replaceUrl(params) {
        if (window.history) {
            delete params.limit;
            delete params.offset;
            window.history.replaceState(null, "", `/products?${utils.query.stringify(params)}`);
        }
    }

    /**
     * 파라미터 생성
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
            page: Number(params.page) || 1,
            new: params.new || "",
            sort: "recomm"
        };
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

    /**
     * 상담신청하기 모달창을 엽니다.
     * @param parameter - object
     * @param type - boolean
     * @param adviceType - string (["artist", "forsnap"])
     * @param list - array (recommendArtists)
     */
    onConsultModal(parameter, type, adviceType, list = null) {
        const modal_name = "simple__consult";
        // 파라미터 조합
        const p = this.combineConsultParameter(parameter);
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
                isTypeRecommendArtist
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
     * 견적확인에서 작가직접 추가 상담신청
     * @param nos
     // * @param list
     */
    selectArtistSendEstimate(nos) {
        const {
            recommendParams,
            device_type,
            recommendArtists,
            agent,
            currentCategory,
            totalPrice
        } = this.state;
        const user = auth.getUser();

        const p = {
            agent,
            category: currentCategory
        };

        if (user) {
            p.user_id = user.id;
        }

        if (totalPrice) {
            p.extra_info = recommendParams.extra_info;
            p.extra_text = recommendParams.extra_text;
        }

        if (nos.length > 0) {
            const modal_name = "simple__consult";
            Modal.close("another_artist");

            PopModal.createModal(
                modal_name,
                <ConsultModal
                    onConsult={data => {
                        Modal.show({ type: MODAL_TYPE.PROGRESS });
                        const params = Object.assign(p, data, {
                            ...recommendParams
                        });

                        // if (!totalPrice) {
                        //     delete params.extra_info;
                        //     delete params.extra_text;
                        // }

                        this.setState({
                            user_name: params.user_name,
                            user_phone: params.user_phone
                        });

                        const promise = [];
                        nos.map((no, idx) => {
                            const item = recommendArtists.filter(obj => obj.no === no)[0];
                            promise.push(
                                virtualEstimateHelper.apiInsertArtistOrder(Object.assign(params,
                                    {
                                        artist_id: item.user_id,
                                        product_no: item.product_no,
                                        access_type: RECOMMEND_ACCESS_TYPE.LIST.CODE,
                                        device_type
                                    }))
                                    .then(() => {
                                        this.gaEvent("견적_문의하기", item);
                                        this.externalEventBox();
                                    })
                            );
                            return null;

                            // if (idx === 0) {
                            //     const _params = Object.assign({}, params);
                            //     const hasProperty = key => {
                            //         return Object.prototype.hasOwnProperty.call(_params, key);
                            //     };
                            //     if (hasProperty("extra_info")) {
                            //         delete _params.extra_info;
                            //     }
                            //     if (hasProperty("access_type")) {
                            //         delete _params.access_type;
                            //     }
                            //     if (hasProperty("user_id")) {
                            //         delete _params.user_id;
                            //     }
                            //     if (hasProperty("category")) {
                            //         delete _params.category;
                            //     }
                            //     if (hasProperty("agent")) {
                            //         delete _params.agent;
                            //     }
                            //     promise.push(
                            //         virtualEstimateHelper.apiPutArtistOrder(order_no, Object.assign(_params, { artist_id: item.user_id, product_no: item.product_no, estimate_no }))
                            //             .then(() => {
                            //                 this.gaEvent("견적_문의하기", item);
                            //                 this.externalEventBox();
                            //             })
                            //     );
                            // } else {
                            //     promise.push(
                            //         virtualEstimateHelper.apiInsertArtistOrder(Object.assign(params,
                            //             {
                            //                 artist_id: item.user_id,
                            //                 product_no: item.product_no,
                            //                 access_type: RECOMMEND_ACCESS_TYPE.ESTIMATE_ADD.CODE,
                            //                 device_type
                            //             }))
                            //             .then(() => {
                            //                 this.gaEvent("견적_문의하기", item);
                            //                 this.externalEventBox();
                            //             })
                            //     );
                            // }
                            // return null;
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
        // if (!totalPrice) {
        //     baseParams.extra_info = null;
        //     baseParams.extra_text = null;
        // }
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
                        .catch(() => {
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
                this.externalEventBox();
                // Modal.show({
                //     type: MODAL_TYPE.CUSTOM,
                //     content: this.renderLastPhase()
                // });

                this.onShowRecommendArtist(params, list);
            });
        }).catch(error => {
            PopModal.closeProgress();
            PopModal.alert(error.data || "작가문의 등록 중 오류가 발생했습니다.\n문제가 지속될 시 고객센터에 문의해 주세요.");
        });
    }

    onShowRecommendArtist(params, list) {
        const { no } = this.state;
        const pa = {
            title: "전달이 완료되었습니다.",
            desc: "다른작가님에게도 촬영안내를 받아보세요.",
            no
        };
        this.showPopAnotherRecommendArtist(pa, list, this.selectArtistSendConsult);
    }

    /**
     * 추천작가 선택
     * @param selects
     * @param recommList
     */
    selectArtistSendConsult(selects, recommList) {
        const { user_phone, user_name, form, totalPrice, hasAlphas, agent, device_type, estimate_no } = this.state; // product_no, artist_id
        const recommendArtistParams = this.createRecommendArtistParams({ form, total_price: totalPrice, hasAlphas, agent }); // agent, extra_info, extra_text, category, user_id
        const baseParams = {
            user_phone, user_name, ...recommendArtistParams, device_type
        };

        if (estimate_no) {
            baseParams.estimate_no = estimate_no;
        }

        // if (!totalPrice) {
        //     baseParams.extra_info = null;
        //     baseParams.extra_text = null;
        // }

        if (selects.length > 0) {
            Modal.show({ type: MODAL_TYPE.PROGRESS });
            // PopModal.progress();
            const promise = [];

            selects.map(obj => {
                const item = recommList.filter(artist => artist.no === obj)[0];
                promise.push(
                    virtualEstimateHelper.apiInsertArtistOrder(Object.assign(baseParams, { artist_id: item.user_id, product_no: item.product_no, access_type: "list_add" }))
                        .then(() => {
                            this.externalEventBox();
                        })
                );
                return null;
            });

            Promise.all(promise).then(response => {
                // PopModal.closeProgress();
                Modal.close(MODAL_TYPE.PROGRESS);
                Modal.close("another_artist");

                PopModal.createModal("last_phase",
                    this.renderLastPhase(),
                    { className: "last_phase", modal_close: false }
                );
                PopModal.show("last_phase");

                setTimeout(() => {
                    Modal.close(MODAL_TYPE.PROGRESS);
                    PopModal.close("last_phase");
                }, 2000);
            }).catch(error => {
                Modal.close(MODAL_TYPE.PROGRESS);

                PopModal.alert("촬영요청 중 오류가 발생하였습니다.\n문제가 지속될 시 고객센터에 문의해 주세요.");
            });
        } else {
            Modal.close(MODAL_TYPE.PROGRESS);
            Modal.close("another_artist");
        }
    }

    showPopAnotherRecommendArtist(params, list, func) {
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            name: "another_artist",
            full: true,
            opacity: "0.7",
            content: (
                <AnotherRecommendArtist
                    no={params.no}
                    total_price={this.state.totalPrice}
                    list={list}
                    title={params.title}
                    desc={params.desc}
                    selectArtistSendConsult={selectArtist => func(selectArtist, list)}
                />
            )
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

    /**
     * ga이벤트를 등록한다.
     * @param action
     * @param obj
     */
    gaEvent(action, obj = null) {
        const { currentCategory } = this.state;
        let label = currentCategory;
        if (!utils.type.isEmpty(obj)) {
            label = `${currentCategory}_${obj.nick_name}_${obj.product_no}`;
        }
        // const category = this.props.params.category;
        utils.ad.gaEvent("기업_리스트", action, label);
    }

    /**
     * 산출된 견적을 등록한다.
     * @param form
     * @param params
     * @returns {*}
     */
    onConsultEstimate({ form, agent, category, hasAlphas, totalPrice }) {
        const { device_type, access_type } = this.state;
        let { fetchArtists } = this.state;
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
            device_type,
            access_type
        };

        if (totalPrice) {
            // total_price 값이 존재하면 견적산출 api를 호출한다.
            this.callAPIInsertOrderEstimate(params, { form: _form, totalPrice, hasAlphas, agent });
        } else {
            fetchArtists = [];
        }

        // 견적정보를 state에 저장한다.
        this.setState({
            form,
            agent,
            // category,
            totalPrice,
            hasAlphas,
            fetchArtists
        });
    }

    /**
     * 포스냅에 상담을 신청한다. (?데탑이랑 다르게 버튼이 하나밖에 없다...)
     * @param access_type
     */
    onConsultOur(access_type) {
        const { estimate_no, form, currentCategory, device_type } = this.state;
        const params = {
            access_type,
            device_type,
            page_type: "biz",
            category: currentCategory
        };

        if (estimate_no) {
            params.estimate_no = estimate_no;
        }

        if (form) {
            params.extra_info = JSON.stringify({ ...form });
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

        if (Object.hasOwnProperty.call(form, "sub_code")) {
            delete form.sub_code;
        }

        if (total_price) {
            form.total_price = hasAlphas ? `${total_price}+a` : total_price;
        }

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
     * @param form
     * @returns {{}}
     */
    exchangeCodeToText(form) {
        return Object.keys(form).reduce((result, key) => {
            const keyUpperCase = key.toUpperCase();
            const formKeyUpperCase = typeof form[key] === "string" ? form[key].toUpperCase() : form[key];
            let value = Object.prototype.hasOwnProperty.call(ADVICE_EXTRA_TEXT, formKeyUpperCase) ? ADVICE_EXTRA_TEXT[formKeyUpperCase].NAME : form[key];

            if (value) {
                // key가 video_length 이면 텍스트를 치환한다.
                if (key === PROPERTYS.VIDEO_LENGTH.CODE) {
                    switch (value) {
                        case "1": value = "1분미만"; break;
                        case "2": value = "1분~3분"; break;
                        case "3": value = "3분~5분"; break;
                        case "4+a": value = "5분이상"; break;
                        default: value = form[key]; break;
                    }
                } else if (key === PROPERTYS.DIRECTING_NUMBER.CODE ||
                    key === PROPERTYS.EXTERIOR_NUMBER.CODE ||
                    key === PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE ||
                    key === PROPERTYS.DIRECTING_NEED_ALL_CUT.CODE ||
                    key === PROPERTYS.NUKKI_NEED_ALL_CUT.CODE ||
                    key === PROPERTYS.NEED_NUMBER.CODE ||
                    key === PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE ||
                    key === PROPERTYS.DETAIL_NUMBER.CODE ||
                    key === PROPERTYS.RETOUCH_NUMBER.CODE ||
                    key === PROPERTYS.N_CLOTHES_P_NUMBER.CODE ||
                    key === PROPERTYS.P_P_NUKKI_NUMBER.CODE ||
                    key === PROPERTYS.ALL_CUT_NUMBER.CODE) {
                    value += "컷";
                } else if (key === PROPERTYS.PERSON_NUMBER.CODE ||
                    key === PROPERTYS.INTERVIEW_PERSON.CODE) {
                    value += "명";
                } else if (key === PROPERTYS.TOTAL_TIME.CODE ||
                    key === PROPERTYS.PROXY_TIME.CODE ||
                    key === PROPERTYS.VIDEO_DIRECTING_TIME.CODE) {
                    value += "시간";
                } else if (key === PROPERTYS.NUMBER.CODE ||
                    key === PROPERTYS.MODEL_CLOTHES_NUMBER.CODE ||
                    key === PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE ||
                    key === PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE ||
                    key === PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE) {
                    value += "개";
                } else if (key === PROPERTYS.MODEL_TIME.CODE) {
                    switch (value) {
                        case "shot": value = "숏데이(2시간)"; break;
                        case "half": value = "하프데이(4시간)"; break;
                        case "full": value = "풀데이(8시간)"; break;
                        default: value = form[key]; break;
                    }
                }
            }

            return Object.assign(result, { [PROPERTYS[keyUpperCase].NAME]: value });
        }, {});
    }


    onSubmit() {
        const session = sessionStorage;
        if (session) {
            const referer = session.getItem("referer");
            const mobile = utils.agent.isMobile();
            if (referer && referer === "facebook_ad") utils.ad.gaEvent(`${mobile ? "M_" : ""}페이스북광고_기업`, session.getItem("facebook_ad_content"), "상담전환");
            if (referer && referer === "naver_power") utils.ad.gaEvent(`${mobile ? "M_" : ""}네이버광고_기업`, session.getItem("naver_ad_content"), "상담전환");
        }
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
        PopModal.progress();
        virtualEstimateHelper.apiInsertOrderEstimate(params)
            .then(response => {
                const data = response.data;
                // 작가상담용 객체 키, 밸류 값을 치환합니다. (extra_text)
                const recommendParams = this.createRecommendArtistParams({ form, total_price: totalPrice, hasAlphas, agent });
                recommendParams.estimate_no = response.data.estimate_no;
                EstimateSession.setSessionEstimateData(EstimateSession.EXTRA_INFO_KEY, recommendParams);

                this.setState({
                    estimate_no: data.estimate_no,
                    recommendParams,
                    receiveEstimate: null
                }, () => {
                    PopModal.closeProgress();
                    // if (this.state.fetchArtists.length < 1) {
                    //     this.onConsultSearchArtist();
                    // } else {
                    //     PopModal.closeProgress();
                    // }
                });
            })
            .catch(error => {
                PopModal.closeProgress();
                PopModal.alert(error.data ? error.data : "견적을 산출하는데 오류가 발생했습니다.\n문제가 지속될 경우 고객센터에 문의해 주세요.");
            });
    }

    /**
     * 작가상담 마지막 페이즈를 그립니다.
     * @returns {*}
     */
    renderLastPhase() {
        return (
            <div>
                <div className="container">
                    <div style={{ color: "#fff", textAlign: "center" }}>
                        <p style={{ fontSize: 28, marginBottom: 10 }}>연락요청이 완료되었습니다.</p>
                        <p style={{ fontSize: 18 }}>입력해주신 정보로 작가님께서 연락드릴 예정입니다.</p>
                    </div>
                </div>
            </div>
        );
    }

    onChangeShotKind() {
        this.setState({ isShowRecomArtist: false });
    }

    /**
     * 작가검색
     */
    onConsultSearchArtist() {
        const { currentCategory, form, recommendParams, failConsultMsg, device_type } = this.state;
        virtualEstimateHelper.apiGetChargeArtistProduct({ category: currentCategory })
            .then(response => {
                const data = response.data;
                PopModal.closeProgress();
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

    onConsult(data) {
        PopModal.progress();

        const { estimate_no, form, currentCategory, totalPrice, hasAlphas } = this.state;
        const params = Object.assign({}, data);
        let _form = Object.assign({}, form);

        if (totalPrice) {
            _form.total_price = hasAlphas ? `${totalPrice}+a` : totalPrice;
            params.estimate_no = estimate_no;
        } else {
            _form = {};
            //params.estimate_no = "";
        }

        if (!utils.type.isEmpty(_form)) {
            params.extra_info = JSON.stringify({ ..._form });
        }

        if (currentCategory) {
            params.category = currentCategory;
        }


        virtualEstimateHelper.apiInsertAdviceOrders(params)
            .then(response => {
                PopModal.closeProgress();
                this.externalEventBox();
                PopModal.alert("상담신청해 주셔서 감사합니다.\n곧 연락 드리겠습니다.");
            })
            .catch(error => {
                PopModal.closeProgress();
                if (error && error.data) {
                    PopModal.alert(error.data);
                }
            });
    }

    /**
     * 이메일을 전달한다.
     */
    onReceiveEmail() {
        const { totalPrice, receiveEstimate } = this.state;
        PopModal.progress();

        if (totalPrice && !receiveEstimate) {
            PopModal.closeProgress();
            const modal_name = "pop-receive-email";
            // 파라미터 조합
            PopModal.createModal(modal_name,
                <PopReceiveEmail
                    onConsult={this.receiveEmail}
                    onClose={() => PopModal.close(modal_name)}
                />,
                { modal_close: false }
            );

            PopModal.show(modal_name);
        } else if (!totalPrice && receiveEstimate) {
            PopModal.closeProgress();
            PopModal.alert("견적을 다시 계산 후 이용해주세요.");
        } else if (!totalPrice && !receiveEstimate) {
            PopModal.closeProgress();
            PopModal.alert("견적 계산 후 이용해주세요.");
        } else {
            PopModal.closeProgress();
            PopModal.alert("견적 계산 후 이용해주세요.");
        }
    }

    /**
     * 이메일 전달
     */
    receiveEmail(params) {
        const { estimate_no, recommendParams, totalPrice, currentCategory, hasAlphas } = this.state;

        const extraText = recommendParams.extra_text;
        let combineParams;

        if (extraText) {
            const parseInfo = JSON.parse(extraText);
            const changeArrInfo = Object.entries(parseInfo);

            combineParams = changeArrInfo.reduce((result, obj) => {
                if (obj[1] && obj[0] !== "총가격") {
                    result.push({ key: obj[0], value: obj[1] });
                }
                return result;
            }, []);
        }

        params.extra_info = JSON.stringify({
            estimate: combineParams,
            estimateNo: estimate_no,
            category: currentCategory,
            salePrice: hasAlphas ? `${utils.format.price(totalPrice)} + a ` : utils.format.price(totalPrice),
            price: utils.format.price(Number(totalPrice) * 1.3)
        });

        virtualEstimateHelper.apiInsertSendEmail(estimate_no, params)
            .then(response => {
                utils.ad.gaEvent("기업_리스트", "이메일발송", currentCategory);
                PopModal.closeProgress();
                this.sendEmailLastPhase(params.email);
            })
            .catch(error => {
                PopModal.closeProgress();
                PopModal.alert(error.data);
            });
    }

    /**
     * 이메일 전달 마지막 단계
     */
    sendEmailLastPhase(email) {
        PopModal.close("pop-receive-email");
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: (
                <div>
                    <div className="container">
                        <div style={{ color: "#fff", textAlign: "center" }}>
                            <p style={{ fontSize: 28, marginBottom: 10 }}>{email}</p>
                            <p style={{ fontSize: 18 }}>입력해주신 이메일로 견적발송이 완료되었습니다.</p>
                        </div>
                    </div>
                </div>
            )
        });

        setTimeout(() => {
            Modal.close();
        }, 2000);
    }

    /**
     * 추천작가가 조회가 완료되었을때 호출
     */
    checkState(state) {
        const { receiveEstimate } = this.state;

        // 추전작가가 조회가 완료되었고 견적정보 데이터가 있을때 스크롤 포지션을 움직인다.
        if (state && receiveEstimate) {
            this.scrollPosition();
        }
    }

    /**
     * 포스냅 촬영사례 로딩 후
     */
    checkFetch() {
        const { artist_list, search, params } = this.state;
        if (artist_list && Array.isArray(artist_list) && artist_list.length && params.category === CATEGORY_CODE.PRODUCT) {
            this.setState({ isLoadingCheck: true }, () => {
                if (search && search.landing && search.landing === "1") {
                    this.scrollPosition(false);
                }
            });
        }
    }

    testFetch() {
        if (this.state.mcl) {
            this.testPosition();
        }
    }

    testPosition() {
        const scrollTarget = document.querySelector(".charge-artist");
        const targetRect = scrollTarget.getBoundingClientRect();
        const goalScroll = targetRect.top - 110;
        window.scrollTo(0, Number(goalScroll));
    }

    receiveTotalPrice(price) {
        this.setState({ totalPrice: price });
    }

    render() {
        const { params, products, receiveEstimate, artist_list, totalPrice, hasAlphas, estimate_no } = this.state;
        const category = params.category;

        return (
            <div className="product_list product_list__open-estimate products-page">
                <HeaderContainer />
                <main id="site-main" onLoad={this.onLoad}>
                    <h1 className="sr-only">상품리스트</h1>
                    <AfterInquireArtist
                        //list={recommendArtists}
                        category={category}
                        onConsultArtist={this.onConsultToArtist}
                        getReceiveList={this.apiGetRecommendArtist}
                        checkState={this.checkState}
                    />
                    {category !== CATEGORY_CODE.VIDEO_BIZ ?
                        <ConceptBanner
                            category={category}
                            gaEvent={(code, name) => {
                                if (name) {
                                    utils.ad.gaEvent("기업_컨셉", `${name}_리스트`, name);
                                    utils.ad.gaEvent("기업_리스트", "컨셉배너", name);
                                }
                            }}
                        /> : null
                    }
                    {/*<PreRecommendArtist*/}
                    {/*list={recommendArtists}*/}
                    {/*total_price={totalPrice}*/}
                    {/*category={category}*/}
                    {/*onShowReview={this.onPopArtistReview}*/}
                    {/*onConsult={this.onConsultToArtist}*/}
                    {/*/>*/}
                    <section className="product__dist product__hr consult__bar">
                        <div className="container">
                            <ConsultBar onConsult={this.onConsult} access_type="list_consult" />
                        </div>
                    </section>
                    {/*{artist_list && Array.isArray(artist_list) && artist_list.length ?*/}
                    {/*<ExampleReview category={category} page_type="list" artist_list={artist_list} checkFetch={this.checkFetch} test={category === "PRODUCT" || false} /> : null*/}
                    {/*}*/}
                    {!["PRODUCT", "BEAUTY", "FOOD", "PROFILE_BIZ", "INTERIOR", "EVENT", "VIDEO_BIZ", "FASHION"].includes(category) ?
                        <VirtualEstimate
                            gaEvent={this.gaEvent}
                            receiveEstimate={receiveEstimate}
                            //onConsultSearchArtist={this.onConsultSearchArtist}
                            onConsultEstimate={this.onConsultEstimate}
                            category={category}
                            onChangeShotKind={this.onChangeShotKind}
                            onReceiveEmail={this.onReceiveEmail}
                            receiveTotalPrice={this.receiveTotalPrice}
                        /> :
                        <VirtualEstimateSteps
                            category={category}
                            access_type="list"
                            device_type="pc"
                            // estimate_no={estimate_no}
                            // receiveEstimate={receiveEstimate}
                            receiveTotalPrice={this.receiveTotalPrice}
                        />
                    }
                    <ChargeArtist
                        //list={recommendArtists}
                        isAlpha={hasAlphas}
                        totalPrice={totalPrice}
                        category={category}
                        getReceiveList={this.apiGetRecommendArtist}
                        checkFetch={this.testFetch}
                    />
                    <FreeArtist
                        data={products}
                        category={category}
                    />
                </main>
                <Footer>
                    <ScrollTop category={category} />
                </Footer>
            </div>
        );
    }
}
