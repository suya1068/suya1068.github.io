import utils from "shared/helper/utils";

class Products {
    constructor(instance) {
        this.base = "/products";
        this.instance = instance;
    }

    /**
     * 상품을 검색한다.
     * @param params
     * @param params.tag
     * @param params.sort
     * @param params.limit
     * @param params.offset
     */
    queryProducts(params) {
        return this.instance.get(`${this.base}?${utils.query.stringify(params)}`);
    }

    /**
     * 상품 상세 정보를 조회한다.
     * @param id
     * @param params
     */
    queryProductInfo(id, params) {
        return this.instance.get(`${this.base}/${id}?${utils.query.stringify(params)}`);
    }

    /**
     * 상품의 후기를 더 본다(기본 5개씩)
     * @param {string|number} no - 상품번호
     * @param {string|number} limit - 검색 범위
     * @param {string|number} offset - 검색 범위
     */
    queryComments(no, limit, offset) {
        return this.instance.get(`${this.base}/${no}/comments?limit=${limit}&offset=${offset}`);
    }
    // queryComments(no, params) {
    //     return this.instance.get(`${this.base}/${no}/comments?${utils.query.stringify(params)}`);
    // }

    /**
     * 상품 캘린더를 조회한다.
     * @param {string|number} no - 상품번호
     * @param {{year: number, month: number}} params - 조회할 연도 조회할 월
     */
    queryCalendar(no, params) {
        return this.instance.get(`${this.base}/${no}/calendar?${utils.query.stringify(params)}`);
    }

    /**
     * 리뷰를 등록한다.
     * @param productNo - String or Number (상품번호)
     * @param data - object (buy_no, comment, kind, quality, service, price, talk, trust, photo_no)
     */
    productRegistComment(productNo, data) {
        const params = { ...data };
        // delete params.product_no;
        return this.instance.post(`${this.base}/${productNo}/comments`, utils.query.stringify(params));
    }

    selectProductOptions(productNo) {
        return this.instance.get(`${this.base}/${productNo}/options`);
    }

    selectMainProduct() {
        return this.instance.get("/main/products");
    }

    /**
     * 상품 카테고리 목록 조회
     */
    categorys() {
        return this.instance.get("/categorys");
    }

    /**
     * 해당 상품의 포트폴리오 데이터를 조회
     * @param product_no
     */
    selectPortfolio(product_no) {
        return this.instance.get(`${this.base}/${product_no}/portfolio`);
    }

    /**
     * 메인 페이지 상품 조회 (신규)
     */
    findMainProducts(type) {
        return this.instance.get(`${this.base}/main?type=${type}`);
    }

    /**
     * 추천상품리스트 조회
     * @param params
     */
    findAllRecommends(params) {
        return this.instance.get(`${this.base}/recommends?${utils.query.stringify(params)}`);
    }

    /**
     * 메인 포트폴리오 목록 조회
     * @param data
     */
    selectMainPortfolio(data) {
        return this.instance.get(`${this.base}/main-portfolio?${utils.query.stringify(data)}`);
    }

    /**
     * 카테고리 별 리뷰 조회
     * @param category
     * @returns {*}
     */
    findCategoryReviews(category) {
        return this.instance.get(`${this.base}/category-reviews?${utils.query.stringify(category)}`);
    }

    /**
     * 유료작가 상품리스트
     * @param data - Object (category, ignore_artist_id)
     */
    findChargeArtist(data) {
        return this.instance.get(`${this.base}/charge-artist-product?${utils.query.stringify(data)}`);
    }

    /**
     * 작가 후기 메인
     */
    findMainArtistReview() {
        return this.instance.get(`${this.base}/artist-reviews-main`);
    }

    /**
     * 카테고리별 작가 후기
     * @param data
     */
    findArtistReview(data) {
        return this.instance.get(`${this.base}/artist-reviews-category?${utils.query.stringify(data)}`);
    }

    /**
     * 작가 직접 후기 조회
     * @param id
     * @returns {*}
     */
    findArtistSelfReview(id) {
        return this.instance.get(`${this.base}/${id}/artist-reviews`);
    }

    /**
     * 컨셉 이미지 조회
     * @param {Object} data - (category, depth1, depth2)
     * @returns {*}
     */
    findConceptImages(data) {
        return this.instance.get(`${this.base}/concept-img?${utils.query.stringify(data)}`);
    }

    /**
     * 컨셉 항목 조회
     * @param {Object} data - (category)
     * @returns {*}
     */
    findConceptInfo(data) {
        return this.instance.get(`${this.base}/concept-info?${utils.query.stringify(data)}`);
    }
}

export default Products;
