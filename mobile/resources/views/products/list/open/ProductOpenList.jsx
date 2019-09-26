import "./product_list.scss";
import React, { Component, PropTypes } from "react";
/** 유틸 */
import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import API from "forsnap-api";
import cookie from "forsnap-cookie";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import PopModal from "shared/components/modal/PopModal";
import * as virtualEstimateHelper from "./virtual_estimate/virtualEstimateHelper";
import * as EstimateSession
    from "../open/extraInfoSession";
import kakao from "shared/components/kakao/kakao_link";
/** 레이아웃 */
import { Footer } from "mobile/resources/containers/layout";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";
import ConsultModal from "mobile/resources/components/modal/consult/ConsultModal";
import PreRecommendArtist from "./preRecommendArtist/PreRecommendArtist";
import ConsultBar from "mobile/resources/views/main/business/components/ConsultBar";
// import ExampleReview from "./example_review/ExampleReview";
// import AfterInquireArtist from "./recommend/after/AfterInquireArtist";
import VirtualEstimate from "./virtual_estimate/VirtualEstimate";
import PopArtistReview from "./pop/review/PopArtistReview";
import ChargeArtist from "./charge/ChargeArtist";
import VirtualEstimateSteps from "shared/components/estimate/VirtualEstimateContainer";
/** 데이터 */
import { PRODUCT_SORT, NONE_LIST, CATEGORY_CODE } from "shared/constant/product.const";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import {
    ADVICE_EXTRA_TEXT,
    PROPERTYS,
    ADVICE_TYPE,
    ADD_ARTIST_TYPE,
    RECOMMEND_ACCESS_TYPE
} from "./virtual_estimate/virtual_estimate.const";

class ProductOpenList extends Component {
    constructor(props) {
        super(props);
        const search = location.search;

        this.state = {
            isMount: true,
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
            device_type: "mobile",
            failConsultMsg: "상담신청 등록 중에 오류가 발생했습니다.\n문제 지속시 고객센터에 문의해 주세요.",
            //time_flag: props.time_flag
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

        // Interaction
        this.onConsultModal = this.onConsultModal.bind(this);
        // this.onMoveProductDetail = this.onMoveProductDetail.bind(this);
        this.replaceUrl = this.replaceUrl.bind(this);
        this.setStateData = this.setStateData.bind(this);

        // recommend Artist ===========================
        // interaction
        this.onConsult = this.onConsult.bind(this);
        this.onConsultOur = this.onConsultOur.bind(this);
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
        this.onPopArtistReview = this.onPopArtistReview.bind(this);
        this.onSendKaKaoEstimate = this.onSendKaKaoEstimate.bind(this);
        this.checkState = this.checkState.bind(this);
        this.receiveGaEvent = this.receiveGaEvent.bind(this);
        this.checkFetch = this.checkFetch.bind(this);
        // recommend Artist ./end ===========================
        this.testPosition = this.testPosition.bind(this);
        this.testFetch = this.testFetch.bind(this);
        this.receiveTotalPrice = this.receiveTotalPrice.bind(this);
    }

    componentWillMount() {
        kakao.init();
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
                            receiveEstimate: data.extra_info
                        });
                    }
                });
        }

        // if (mcl === "1") {
        //     this.testPosition();
        // }

        this.setState({
            currentCategory: category,
            mcl: mcl === "1" || false
        });
    }

    componentDidMount() {
        const category = this.state.params.category;
        setTimeout(() => {
            const { title, params } = this.state;
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "테스트" });
            AppDispatcher.dispatch({ type: CONST.GLOBAL_SEARCH_TAG_UPDATE, payload: params.keyword });
        }, 0);
        this.replaceUrl(this.createParams(this.state.params));
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

    testPosition() {
        const scrollTarget = document.querySelector(".charge-artist");
        const targetRect = scrollTarget.getBoundingClientRect();
        const goalScroll = targetRect.top - 60;
        window.scrollTo(0, Number(goalScroll));
    }

    scrollPosition(flag = true) {
        const scrollTarget = document.querySelector(".virtual-estimate");
        const targetRect = scrollTarget.getBoundingClientRect();
        const goalScroll = targetRect.top - 60;
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

    setStateData(update, callBack) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callBack);
        }
    }

    apiGetRecommendArtist(params) {
        return virtualEstimateHelper.apiGetChargeArtistProduct(params);
    }


    /**
     * 상품 상세 페이지로 이동한다.
     * @param {string} href
     */
    // onMoveProductDetail(href) {
    //     utils.history.replace(location.href, { path: location.href, scrollTop: document.body.scrollTop });
    //     location.href = href;
    // }

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
     * 견적확인에서 작가직접 추가 상담신청
     * @param nos
     // * @param list
     */
    selectArtistSendEstimate(nos) {
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
                        nos.map((item, idx) => {
                            // const item = list.filter(artist => artist.no === obj.no)[0];
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
                                            this.gaEvent("견적_문의하기", item);
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
                                            this.gaEvent("견적_문의하기", item);
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
     * 작가상담 마지막 페이즈를 그립니다.
     * @returns {*}
     */
    renderLastPhase() {
        return (
            <div className="pop-recommend-artist__last_phase">
                <div style={{ color: "#fff", textAlign: "center" }}>
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
                this.externalEventBox();
                // PopModal.alert("연락요청이 완료되었습니다.\n입력해주신 정보로 작가님께서\n연락드릴 예정입니다.", { callBack: () => PopModal.close(modalName) });
                Modal.show({
                    type: MODAL_TYPE.CUSTOM,
                    content: this.renderLastPhase()
                });

                setTimeout(() => {
                    Modal.close();
                }, 2000);
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
     * @param obj
     */
    gaEvent(action, obj = null) {
        const { currentCategory } = this.state;
        let label = currentCategory;
        if (!utils.type.isEmpty(obj)) {
            label = `${currentCategory}_${obj.nick_name}_${obj.product_no}`;
        }
        // const category = this.props.params.category;
        utils.ad.gaEvent("M_기업_리스트", action, label);
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
                PopModal.closeProgress();
                const data = response.data;
                // 작가상담용 객체 키, 밸류 값을 치환합니다. (extra_text)
                const recommendParams = this.createRecommendArtistParams({ form, totalPrice, hasAlphas, agent });
                recommendParams.estimate_no = response.data.estimate_no;
                EstimateSession.setSessionEstimateData(EstimateSession.EXTRA_INFO_KEY, recommendParams);

                this.setState({
                    estimate_no: data.estimate_no,
                    recommendParams,
                    receiveEstimate: null
                // }, () => {
                //     this.onConsultSearchArtist();
                });
            })
            .catch(error => {
                PopModal.closeProgress();
                PopModal.alert(error.data ? error.data : "견적을 산출하는데 오류가 발생했습니다.\n문제가 지속될 경우 고객센터에 문의해 주세요.");
            });
    }

    /**
     * 작가에게 직접상담신청을 한다.
     */
    onConsultToArtist(data) {
        this.gaEvent("추천작가_작가문의", { product_no: data.product_no, nick_name: data.nick_name });
        const { agent, currentCategory, totalPrice, recommendParams, recommendArtists, access_type } = this.state;
        const user = auth.getUser();
        const params = {
            agent,
            category: currentCategory,
            artist_id: data.user_id,
            product_no: data.product_no,
            access_type
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
        this.onConsultModal(params, true, ADVICE_TYPE.ARTIST.CODE);
        // this.onConsultModal(params, true, ADVICE_TYPE.ARTIST.CODE, _recommendArtists);
    }

    /**
     * 작가검색
     */
    onConsultSearchArtist() {
        const { totalPrice, currentCategory, form, recommendParams, failConsultMsg, device_type } = this.state;

        virtualEstimateHelper.apiGetChargeArtistProduct({ category: currentCategory, limit: 100, offset: 0 })
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

    /**
     * 작가리뷰 팝업
     * @param list
     * @param nick
     */
    onPopArtistReview(list, nick, no) {
        const modalName = "pop-review";
        this.gaEvent("추천작가_촬영후기보기", { nick_name: nick, product_no: no });
        PopModal.createModal(modalName,
            <PopArtistReview
                list={list}
                nickName={nick}
                onClose={() => PopModal.close(modalName)}
            />
            , { modal_close: false, className: modalName });
        PopModal.show(modalName);
    }

    onConsult(data) {
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

        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });

        virtualEstimateHelper.apiInsertAdviceOrders(params)
            .then(response => {
                Modal.close(MODAL_TYPE.PROGRESS);
                // this.gaEvent("하단상담신청");
                this.externalEventBox();
                utils.ad.gaEvent("M_기업_리스트", "포스냅 상담신청", currentCategory);
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: utils.linebreak("상담신청해 주셔서 감사합니다.\n곧 연락 드리겠습니다.")
                });
            })
            .catch(error => {
                Modal.close(MODAL_TYPE.PROGRESS);
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak(error.data)
                    });
                }
            });
    }

    onSendKaKaoEstimate() {
        const { currentCategory, totalPrice, estimate_no, receiveEstimate } = this.state;
        if (totalPrice && !receiveEstimate) {
            kakao.sendOpenEstimate(currentCategory, utils.format.categoryCodeToName(currentCategory), totalPrice, estimate_no, this.receiveGaEvent, null);
        } else if (!totalPrice && receiveEstimate) {
            PopModal.alert("견적을 다시 계산 후 이용해주세요.");
        } else if (!totalPrice && !receiveEstimate) {
            PopModal.alert("견적 계산 후 이용해주세요.");
        } else {
            PopModal.alert("견적 계산 후 이용해주세요.");
        }
    }

    receiveGaEvent() {
        const { currentCategory } = this.state;
        utils.ad.gaEvent("M_기업_리스트", "카카오톡공유", currentCategory);
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
    receiveTotalPrice(price) {
        this.setState({ totalPrice: price });
    }

    render() {
        const { params, receiveEstimate, artist_list, totalPrice, hasAlphas } = this.state;
        const category = params.category;

        return (
            <div className="products-page product_list_mo">
                <main className="products__list__page">
                    <PreRecommendArtist
                        //list={recommendArtists}
                        category={category}
                        // onConsult={this.onConsultToArtist}
                        onPopArtistReview={this.onPopArtistReview}
                        getReceiveList={this.apiGetRecommendArtist}
                        checkState={this.checkState}
                    />
                    <section className="consult__bar product__dist product__hr">
                        <div className="list__row__title">촬영에 대해 궁금한점이 있다면,<br />포스냅 전문가와 먼저 상담받아보세요!</div>
                        <ConsultBar
                            onConsult={this.onConsult}
                            access_type="list_consult"
                        />
                    </section>
                    {!["PRODUCT", "BEAUTY", "FOOD", "PROFILE_BIZ", "INTERIOR", "EVENT", "FASHION", "VIDEO_BIZ"].includes(category) ?
                        <VirtualEstimate
                            gaEvent={this.gaEvent}
                            receiveEstimate={receiveEstimate}
                            //onConsultSearchArtist={this.onConsultSearchArtist}
                            onConsultEstimate={this.onConsultEstimate}
                            onSendKaKaoEstimate={this.onSendKaKaoEstimate}
                            category={category}
                            receiveTotalPrice={this.receiveTotalPrice}
                        /> :
                        <VirtualEstimateSteps
                            category={category}
                            access_type="list"
                            device_type="mobile"
                            receiveTotalPrice={this.receiveTotalPrice}
                        />
                    }
                    <ChargeArtist
                        isAlpha={hasAlphas}
                        category={category}
                        totalPrice={totalPrice}
                        getReceiveList={this.apiGetRecommendArtist}
                        checkFetch={this.testFetch}
                    />
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

ProductOpenList.propTypes = {
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

export default ProductOpenList;
