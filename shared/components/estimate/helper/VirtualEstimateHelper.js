import * as estimateProp from "./const";
import estimateUtils from "./util";
import API from "forsnap-api";

export default class VirtualEstimateHelper {
    constructor(props) {
        this.category = props.category;
        this.instance = estimateProp[this.category];
        this.utils = this.combineUtils(estimateUtils, props.category);
    }

    combineUtils(utils, category) {
        return Object.assign({}, utils.BASE, utils[category]);
    }

    getStepProcess() {
        return this.instance.STEP_PROCESS;
    }

    getUtils() {
        return this.utils;
    }

    getVirtualInstance() {
        return this.instance;
    }

    getPriceInfo() {
        return this.instance.PRICE_INFO;
    }

    getTotalStep() {
        return this.instance.STEP_PROCESS.TOTAL_STEP;
    }

    /**
     * 작가상담 1단계 api
     * @param params
     * @returns {*|{"Content-Type"}}
     */
    apiInsertArtistOrder(params) {
        return API.orders.insertArtistOrder(params);
    }

    /**
     * 작가상담 2단계 api
     * @param params
     * @param no
     * @returns {IDBRequest|Promise<void>}
     */
    apiPutArtistOrder(no, params) {
        return API.orders.fetchArtistOrder(no, params);
    }

    /**
     * 견적산출 api
     * @param params
     * @returns {*|{"Content-Type"}}
     */
    apiInsertOrderEstimate(params) {
        return API.orders.insertOrderEstimate(params);
    }

    /**
     * 추천작가 호출 api
     * @param params
     * @returns {*}
     */
    apiGetRecommentArtists(params) {
        return API.orders.findRecommendArtist(params);
    }

    /**
     * 유료작가 카테고리별 조회
     * @param params
     * @returns {*}
     */
    apiGetChargeArtistProduct(params) {
        return API.products.findChargeArtist(params);
    }

    /**
     * 후기 호출 api
     * @param params
     * @returns {*}
     */
    apiGetCategoryReviews(params) {
        return API.products.findCategoryReviews(params);
    }

    /**
     * 포스냅에 상담신청
     * @param params
     * @returns {*}
     */
    apiInsertAdviceOrders(params) {
        return API.orders.insertAdviceOrders(params);
    }

    /**
     * 견적 이메일 전송
     * @param no
     * @param params
     * @returns {*|{"Content-Type"}}
     */
    apiInsertSendEmail(no, params) {
        return API.orders.insertSendEmail(no, params);
    }

    /**
     * 견적 정보 조회
     * @param no
     * @returns {*}
     */
    apiGetEstimate(no) {
        return API.orders.fetchEstimate(no);
    }
}
