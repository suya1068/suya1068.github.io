import utils from "shared/helper/utils";

class Offers {
    constructor(instance) {
        this.base = "/offers";
        this.instance = instance;
    }

    /**
     * 견적서 상세 조회
     * @param offerNo - Number (견적서 번호)
     */
    find(offerNo) {
        return this.instance.get(`${this.base}/${offerNo}`);
    }

    /**
     * 견적서 기본정보 등록
     * @param data - Object (order_no, product_no)
     * @return {*|{Content-Type}|axios.Promise}
     */
    regist(data) {
        return this.instance.post(this.base, utils.query.stringify(data));
    }

    /**
     * 견적서 컷옵션 수
     * @param offerNo
     * @param data
     * @return {*|axios.Promise}
     */
    quantity(offerNo, data) {
        return this.instance.put(`${this.base}/${offerNo}/quantity`, utils.query.stringify(data));
    }

    /**
     * 견적서 옵션명, 가격
     * @param offerNo - Number (견적서 번호)
     * @param data - Object (옵션명, 가격이 데이터가 들어있는 배열)
     * @return {*|axios.Promise}
     */
    option(offerNo, data) {
        return this.instance.put(`${this.base}/${offerNo}/option`, utils.query.stringify(data));
    }

    /**
     * 첨부파일 업로드
     * @param offerNo - String (견적서 번호)
     * @param data - Object (key)
     * @return {*|{Content-Type}|axios.Promise}
     */
    attach(offerNo, data) {
        return this.instance.post(`${this.base}/${offerNo}/attach`, utils.query.stringify(data));
    }

    /**
     * 첨부파일 삭제
     * @param offerNo - String (견적서 번호)
     * @param attachNo - String (첨부파일 번호)
     * @return {boolean|*|axios.Promise}
     */
    deleteAttach(offerNo, attachNo) {
        return this.instance.delete(`${this.base}/${offerNo}/attach/${attachNo}`);
    }

    /**
     * 첨부파일 업로드 - 파일만
     * @param offer_no
     * @param data
     * @returns {*|{"Content-Type"}}
     */
    attachFile(offer_no, data) {
        return this.instance.post(`${this.base}/${offer_no}/attach-file`, utils.query.stringify(data));
    }

    /**
     * 첨부파일 삭제 - 파일만
     * @param offer_no
     * @param attach_no
     * @returns {*}
     */
    deleteAttachFile(offer_no, attach_no) {
        return this.instance.delete(`${this.base}/${offer_no}/attach-file/${attach_no}`);
    }

    /**
     * 견적서 상세 수정
     * @param offerNo - String (견적서 번호)
     * @param data - Object (content)
     * @return {*|axios.Promise}
     */
    content(offerNo, data) {
        return this.instance.put(`${this.base}/${offerNo}/content`, utils.query.stringify(data));
    }

    /**
     * 견적서 제출
     * @param offerNo - String (견적서 번호)
     * @param offerNo
     */
    submit(offerNo) {
        return this.instance.put(`${this.base}/${offerNo}/submit`);
    }

    /**
     * 카테고리 상품 리스트 조회
     * @param orderNo - Number (요청서 번호)
     */
    products(orderNo) {
        return this.instance.get(`${this.base}/${orderNo}/products`);
    }

    /**
     * 견적서 포트폴리오 변경
     * @param offerNo - Number (견적서 번호)
     * @param data - Object (product_no)
     */
    modifyProducts(offerNo, data) {
        return this.instance.put(`${this.base}/${offerNo}/products`, utils.query.stringify(data));
    }

    /**
     * 견적서 리뷰 등록
     * @param offerNo - Number (견적서 번호)
     * @param data - Object (buy_no, coment, kind, quality, service, price, talk, trust, photo_no)
     * @return {*|{Content-Type}|axios.Promise}
     */
    comments(offerNo, data) {
        return this.instance.post(`${this.base}/${offerNo}/comments`, utils.query.stringify(data));
    }

    /**
     *
     * @param id
     */
    getSelfOfferContent(id) {
        return this.instance.get(`${this.base}/${id}/self`);
    }

    /**
     * 견적서용 포트폴리오의 기본정보를 등록한다.
     * @param id - String (작가 본인의 아이디)
     * @param data - Object (title, category)
     * @returns {*|{Content-Type}}
     */
    registEstimatePortfolioBasicInfo(id, data) {
        return this.instance.post(`${this.base}/${id}/portfolio`, utils.query.stringify(data));
    }

    /**
     * 견적서용 포트폴리오의 기본정보를 수정한다.
     * @param id - String (작가 본인의 아이디)
     * @param no - Number (포트폴리오의 번호)
     * @param data - Object (title, category)
     * @returns {*}
     */
    updateEstimatePortfolioBasicInfo(id, no, data) {
        return this.instance.put(`${this.base}/${id}/portfolio/${no}`, utils.query.stringify(data));
    }

    /**
     * 견적서용 포트폴리오의 목록을 조회한다.
     * @param id - String (작가 본인의 아이디)
     */
    getEstimatePortfolioList(id) {
        return this.instance.get(`${this.base}/${id}/portfolio`);
    }

    /**
     * 견적서용 포트폴리오 사진을 등록한다.
     * @param id - String (작가 본인의 아이디)
     * @param no - Number (포트폴리오의 번호)
     * @param data - String (사진의 번호 ex: 1,2,3...)
     * @returns {*|{Content-Type}}
     */
    registEstimatePortfolio(id, no, data) {
        return this.instance.post(`${this.base}/${id}/portfolio/${no}/photos`, utils.query.stringify(data));
    }

    /**
     * 견적서용 포트폴리오의 상세정보를 조회한다.
     * @param id - String (작가 본인의 아이디)
     * @param no - Number (포트폴리오의 번호)
     */
    getEstimatePortfolioDetail(id, no) {
        return this.instance.get(`${this.base}/${id}/portfolio/${no}`);
    }

    /**
     * 견적서용 포트폴리오를 삭제한다.
     * @param id - String (작가 본인의 아이디)
     * @param no - Number (포트폴리오의 번호)
     * @returns {boolean|*}
     */
    deleteEstimatePortfolio(id, no) {
        return this.instance.delete(`${this.base}/${id}/portfolio/${no}`);
    }

    /**
     * 견적서용 포트폴리오의 사진을 삭제한다.
     * @param id - String (작가 본인의 아이디)
     * @param no - Number (포트폴리오의 번호)
     * @param data - String (사진의 번호 ex: 1,2,3...)
     * @returns {boolean|*}
     */
    deleteEstimatePortfolioPhotos(id, no, data) {
        return this.instance.delete(`${this.base}/${id}/portfolio/${no}/photos?photo_no=${data}`);
    }

    /**
     * 외부전달 견적서 유효기간 체크
     * @param url
     * @param type
     * @returns {*}
     */
    getOutsideTimeLimit(url, type = "offer") {
        return this.instance.get(`${this.base}/outside/${url}/time-limit?outside_type=${type}`);
    }

    /**
     * 외부전달 견적서 조회
     * @param url
     * @param param
     * @returns {*|{"Content-Type"}}
     */
    fetchOutsideInfo(url, param) {
        return this.instance.post(`${this.base}/outside/${url}`, utils.query.stringify(param));
    }

    /**
     * 외부전달용 포트폴리오 조회
     * @param url
     * @param no
     * @param param
     * @returns {*}
     */
    getOutsidePortfolio(url, no, param) {
        return this.instance.post(`${this.base}/outside/${url}/portfolio/${no}`, utils.query.stringify(param));
    }

    /**
     * 본인이 작성한 견적서 리스트 조회
     * @param params
     * @returns {*}
     */
    getOffers(params) {
        return this.instance.get(`${this.base}?${utils.query.stringify(params)}`);
    }

    /**
     * 비노출 포트폴리오 사진 순서 변경
     * @param user_id
     * @param portfolio_no
     * @param photo_list
     * @returns {IDBRequest | Promise<void>}
     */
    updateDisplayOrder(user_id, portfolio_no, photo_list) {
        return this.instance.put(`${this.base}/${user_id}/portfolio/${portfolio_no}/display-order`, utils.query.stringify(photo_list));
    }

    updatePortfolioVideo(user_id, portfolio_no, data) {
        return this.instance.put(`${this.base}/${user_id}/portfolio/${portfolio_no}/video-portfolios`, utils.query.stringify(data));
    }
}

export default Offers;
