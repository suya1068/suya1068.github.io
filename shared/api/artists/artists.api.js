import utils from "shared/helper/utils";

class Artists {
    constructor(instance) {
        this.base = "/artist";
        this.instance = instance;
    }

    /**
     * 작가 정보
     * @param id - String (유저 아이디)
     */
    find(id) {
        return this.instance.get(`${this.base}/${id}`);
    }

    /**
     * 작가 정보 수정
     * @param id - String (유저 아이디)
     * @param obj - Object
     * @returns {*|axios.Promise}
     */
    saveArtist(id, obj) {
        return this.instance.put(`${this.base}/${id}`, utils.query.stringify(obj));
    }

    /**
     * 작가 등록
     * @param id - String (유저 아이디)
     * @param formData - (가입시 필요데이터 (email, nick_name, region, bank_name, bank_num, email_agree, profile_key, encData)
     */
    registerArtist(id, formData) {
        return this.instance.post(this.base, formData);
    }

    /**
     * 상품등록
     * @param id - String (유저 아이디)
     * @param obj - Object
     * @returns {*|axios.Promise|{Content-Type}}
     */
    registerProduct(id, obj) {
        const product = Object.assign({}, obj);
        product.option = JSON.stringify(product.option);
        return this.instance.post(`${this.base}/${id}/products`, utils.query.stringify(product));
    }

    /**
     * 상품수정
     * @param id - String (유저 아이디)
     * @param pNo - String (상품번호)
     * @param obj - Object
     * @returns {*|axios.Promise}
     */
    editProduct(id, pNo, obj) {
        const product = Object.assign({}, obj);
        product.option = JSON.stringify(product.option);
        return this.instance.put(`${this.base}/${id}/products/${pNo}`, utils.query.stringify(product));
    }

    /**
     * 작가 상품목록
     * @param id - String (유저 아이디)
     */
    listProduct(id) {
        return this.instance.get(`${this.base}/${id}/products`);
    }

    /**
     * 작가 상품정보 가져오기
     * @param id - String (유저 아이디)
     * @param pNo - String (상품번호)
     */
    getProductNo(id, pNo) {
        return this.instance.get(`${this.base}/${id}/products/${pNo}`);
    }

    /**
     * 작가 상품 포트폴리오 가져오기
     * @param id - String (유저 아이디)
     * @param pNo - String (상품번호)
     */
    getProductPortfolio(id, pNo) {
        return this.instance.get(`${this.base}/${id}/products/${pNo}/portfolios`);
    }

    /**
     * 작가 상품 노출여부 변경
     * @param id - String (유저 아이디)
     * @param pNo - String (상품번호)
     * @param display - String (노출여부 Y, N)
     * @returns {*|axios.Promise}
     */
    displayProduct(id, pNo, display) {
        return this.instance.put(`${this.base}/${id}/products/${pNo}/display`, utils.query.stringify({ display_yn: display }));
    }

    /**
     * 작가 상품 삭제
     * @param id - String (유저 아이디)
     * @param pNo - String (상품번호)
     * @returns {*|boolean|axios.Promise}
     */
    deleteProduct(id, pNo) {
        return this.instance.delete(`${this.base}/${id}/products/${pNo}`);
    }

    /**
     * 작가 상품 포트폴리오 삭제
     * @param id - String (유저 아이디)
     * @param pNo - String (상품번호)
     * @param pfNo - String (포트폴리오 번호)
     * @returns {*|boolean|axios.Promise}
     */
    deletePortfolio(id, pNo, pfNo) {
        return this.instance.delete(`${this.base}/${id}/products/${pNo}/portfolios/${pfNo}`);
    }

    /**
     * 작가 프로필 사진 업로드
     * @param id - String (유저 아이디)
     * @param obj - Object (profile_key)
     * @returns {*|axios.Promise}
     */
    uploadArtistPhoto(id, obj) {
        return this.instance.put(`${this.base}/${id}/photo`, utils.query.stringify(obj));
    }

    /**
     * 작가 상품 포트폴리오 사진 업로드
     * @param id - String (유저 아이디)
     * @param pNo - String (상품번호)
     * @param obj - Object (key)
     * @returns {*|axios.Promise|{Content-Type}}
     */
    uploadArtistPortfolio(id, pNo, obj) {
        return this.instance.post(`${this.base}/${id}/products/${pNo}/portfolios`, utils.query.stringify(obj));
    }

    /**
     * 작가 상품 썸네일 사진 업로드
     * @param id - String (유저 아이디)
     * @param pNo - String (상품번호)
     * @param obj - Object (thumb_img)
     * @returns {*|axios.Promise}
     */
    uploadArtistThumb(id, pNo, obj) {
        return this.instance.put(`${this.base}/${id}/products/${pNo}/thumb`, utils.query.stringify(obj));
    }

    /**
     * 작가 상품 커버 사진 업로드
     * @param id - String (유저 아이디)
     * @param pNo - String (상품번호)
     * @param obj - Object (cover_img)
     * @returns {*|axios.Promise}
     */
    uploadArtistCover(id, pNo, obj) {
        return this.instance.put(`${this.base}/${id}/products/${pNo}/main`, utils.query.stringify(obj));
    }

    /**
     * 알림 가져오기
     * @param id - String (유저 아이디)
     */
    notice(id) {
        return this.instance.get(`${this.base}/${id}/notice`);
    }

    /**
     * 작가 메인페이지 정보
     * @param id - String (유저 아이디)
     */
    artistDashboard(id) {
        return this.instance.get(`${this.base}/${id}/dashboard`);
    }

    /**
     * 작가등록 이메일 인증번호를 받는다.
     * @param id - String (유저 아이디)
     * @param email - String (email form)
     */
    artistEmailConfirm(id, email) {
        return this.instance.post(`${this.base}/${id}/email-code`, utils.query.stringify(email));
    }

    /**
     * 작가등록 or 수정 이메일 인증을 한다.
     * @param id - String (유저 아이디)
     * @param obj - Form (email - 이메일 주소, code - 인증번호, type - JOIN, UPDATE(작가 등록, 수정))
     */
    artistEmailConfirmCheck(id, obj) {
        return this.instance.put(`${this.base}/${id}/email-code`, utils.query.stringify(obj));
    }

    /**
     * 작가 닉네임 체크
     * @param id - String (유저 아이디)
     * @param nickName - String (작가명)
     */
    artistCheckNickname(id, nickName) {
        return this.instance.get(`${this.base}/${id}/nickname?${utils.query.stringify({ nick_name: nickName })}`);
    }

    /**
     * 작가 캘린더 조회
     * @param id - String (유저 아이디)
     * @param date - String (조회할 년월 또는 년월일)
     */
    artistCalendar(id, startDt, endDt) {
        return this.instance.get(`${this.base}/${id}/calendars?start_dt=${startDt}&end_dt=${endDt}`);
    }

    /**
     * 작가 일정 등록
     * @param id - String (유저 아이디)
     * @param data - Object (startDate, endDate, type, comment)
     */
    artistScheduleRegist(id, data) {
        return this.instance.post(`${this.base}/${id}/calendars`, utils.query.stringify(data));
    }

    /**
     * 작가 일정 수정
     * @param id - String (유저 아이디)
     * @param calendarNo - Number (일정 번호)
     * @param data - Object (startDate, endDate, type, comment)
     * @returns {*|axios.Promise}
     */
    artistScheduleModify(id, calendarNo, data) {
        return this.instance.put(`${this.base}/${id}/calendars/${calendarNo}`, utils.query.stringify(data));
    }

    /**
     * 작가 일정 삭제
     * @param id - String (유저 아이디)
     * @param calendarNo - Number (일정 번호)
     * @returns {boolean|*|axios.Promise}
     */
    artistScheduleDelete(id, calendarNo) {
        return this.instance.delete(`${this.base}/${id}/calendars/${calendarNo}`);
    }

    /**
     * 정산 리스트
     * @param id - String (유저 아이디)
     * @param startDt - String (yyyymmdd or yyyymm or yyyy)
     * @param endDt - String (yyyymmdd or yyyymm or yyyy)
     * @param offset - Number
     * @param limit - Number
     */
    artistCalculates(id, startDt, endDt, offset = 0, limit = 10) {
        return this.instance.get(`${this.base}/${id}/calculates?start_dt=${startDt}&end_dt=${endDt}&offset=${offset}&limit=${limit}`);
    }

    fetchCalculateList(id, query) {
        return this.instance.get(`${this.base}/${id}/calculates?${utils.query.stringify(query)}`);
    }

    /**
     * 작가 사업자 정보 조회
     * @param id - String (유저 아이디)
     */
    artistCorp(id) {
        return this.instance.get(`${this.base}/${id}/corp-info`);
    }

    /**
     * 작가 사업자 정보 저장
     * @param id - String (유저 아이디)
     * @param data - Object (corp_ceo_name, corp_name, corp_num)
     * @return {*|axios.Promise}
     */
    artistSaveCorp(id, data) {
        return this.instance.put(`${this.base}/${id}/corp-info`, utils.query.stringify(data));
    }

    /**
     * 요청서 등록 알림 조회
     * @param id - String (유저 아이디)
     */
    artistAlarm(id) {
        return this.instance.get(`${this.base}/${id}/category-alarm`);
    }

    /**
     * 요청서 등록 알림 수정
     * @param id - String (유저 아이디)
     * @param data - Object (category)
     * @return {axios.Promise|*}
     */
    artistSaveAlarm(id, data) {
        return this.instance.put(`${this.base}/${id}/category-alarm`, utils.query.stringify(data));
    }

    /**
     * 등록된 작가 후기 페이지 주소 불러오기
     * @param id
     */
    getReviewList(id) {
        return this.instance.get(`${this.base}/${id}/outside-reviews`);
    }

    /**
     * 작가 후기 페이지 주소 등록
     * @param id
     * @param data
     * @returns {*|{Content-Type}|axios.Promise}
     */
    updateReviewList(id, data) {
        return this.instance.post(`${this.base}/${id}/outside-reviews`, utils.query.stringify(data));
    }

    /**
     * 작가 후기 페이지 주소 삭제
     * @param id
     * @param no
     * @returns {boolean|*|axios.Promise}
     */
    deleteReviewList(id, no) {
        return this.instance.delete(`${this.base}/${id}/outside-reviews/${no}`);
    }

    /**
     * 작가소개 정보 불러오기 (작가페이지에서)
     * @param id - String (작가본인 아이디)
     */
    getAritstsIntro(id) {
        return this.instance.get(`${this.base}/${id}/intro`);
    }

    /**
     * 작가소개 정보 등록하기
     * - 작가소개 글과 작가 경력사항 리스트를 한번에 받아서 등록한다.
     * @param id - String (작가본인 아이디)
     * @param data - Object (intro - 작가소개 글, career - 작가경력 사항 리스트)
     * @returns {*|axios.Promise}
     */
    updateAritstsIntro(id, data) {
        const combineData = {};
        combineData.intro = data.intro;
        combineData.career = JSON.stringify(data.career);
        return this.instance.put(`${this.base}/${id}/intro`, utils.query.stringify(combineData));
    }

    /**
     * 유저가 보는 작가 소개 페이지 조회
     * @param id - String (작가의 아이디)
     * @param data
     */
    getArtistsIntroPublic(id, data) {
        return this.instance.get(`${this.base}/${id}/intro-public?${utils.query.stringify(data)}`);
    }

    /**
     * 유저가 보는 작가 소개 페이지 조회 - 신규
     * @param option - Object (user_id = 작가 아이디 || nick_name = 작가 닉네임)
     */
    getArtistsIntroPublicNew(option) {
        return this.instance.get(`${this.base}/intro-public?${utils.query.stringify(option)}`);
    }

    /**
     * 상품 생성정보 가져오기
     * @param id - String (유저 아이디)
     * @param productNo - String (상품 번호)
     */
    getProductInfo(id, productNo) {
        return this.instance.get(`${this.base}/${id}/products/${productNo}/info`);
    }

    /**
     * 상품(패키지) 기본정보 등록
     * @param id - String (유저 아이디)
     * @param data - Object (title, category)
     * @return {*|{Content-Type}|axios.Promise}
     */
    registerBasic(id, data) {
        return this.instance.post(`${this.base}/${id}/products/basic`, utils.query.stringify(data));
    }

    /**
     * 상품(패키지) 기본정보 수정
     * @param id - String (유저 아이디)
     * @param productNo - String (상품 번호)
     * @param data - Object (title, category)
     * @return {*|axios.Promise}
     */
    updateBasic(id, product_no, data) {
        return this.instance.put(`${this.base}/${id}/products/${product_no}/basic`, utils.query.stringify(data));
    }

    /**
     * 상품(패키지) 옵션정보 수정
     * @param id - String (유저 아이디)
     * @param productNo - String (상품 번호)
     * @param data - Object (package, extra_option, custom_option) stringify변환 필요
     * @return {*|axios.Promise}
     */
    updateOption(id, product_no, data) {
        return this.instance.put(`${this.base}/${id}/products/${product_no}/option`, utils.query.stringify(data));
    }

    /**
     * 상품(패키지) 상세정보 수정
     * @param id - String (유저 아이디)
     * @param productNo - String (상품 번호)
     * @param data - Object (title, category)
     * @return {*|axios.Promise}
     */
    updateDetail(id, product_no, data) {
        return this.instance.put(`${this.base}/${id}/products/${product_no}/detail`, utils.query.stringify(data));
    }

    /**
     * 포트폴리오 순서 정렬
     * @param id - String (유저 아이디)
     * @param productNo - String (상품 번호)
     * @param data - Object (photo_list)
     * @return {axios.Promise|*}
     */
    updateDisplayOrder(id, product_no, data) {
        return this.instance.put(`${this.base}/${id}/products/${product_no}/portfolios`, utils.query.stringify(data));
    }

    updatePortfolioVideo(id, product_no, data) {
        return this.instance.put(`${this.base}/${id}/products/${product_no}/video-portfolios`, utils.query.stringify(data));
    }

    /**
     * 크루스튜디오 등록
     * @param id - String (유저 아이디)
     * @param data - Object (agree)
     * @return {axios.Promise|*}
     */
    updateAgreeCrew(id, data) {
        return this.instance.post(`${this.base}/${id}/crew`, utils.query.stringify(data));
    }

    /**
     * 리뷰에 답글 등록
     * @param id - String (유저 아이디)
     * @param reviewNo - Number (리뷰 번호)
     * @param data - Object (reply)
     * @return {axios.Promise|*}
     */
    writeReview(id, reviewNo, data) {
        return this.instance.post(`${this.base}/${id}/reviews/${reviewNo}/reply`, utils.query.stringify(data));
    }

    /**
     * 작가명 수정 요청
     * @param id
     * @param data
     * @return {axios.Promise|*}
     */
    createNickname(id, data) {
        return this.instance.post(`${this.base}/${id}/nickname`, utils.query.stringify(data));
    }

    /**
     * 일괄 정산 조회
     * @param id
     * @param buy_no
     * @return {*|{Content-Type}}
     */
    fetchCrewCalculate(id, buy_no) {
        return this.instance.get(`${this.base}/${id}/calculates/${buy_no}`);
    }

    /**
     * 유료 광고 상품 리스트 조회
     * @param id
     * @param params
     * @returns {*}
     */
    getChargeProduct(id, params) {
        return this.instance.get(`${this.base}/${id}/charge-product-request?${utils.query.stringify(params)}`);
    }

    /**
     * 유료 광고 상품 등록 요청
     * @param id
     * @param params
     * @returns {*|{"Content-Type"}}
     */
    insertChargeProduct(id, params) {
        return this.instance.post(`${this.base}/${id}/charge-product-request`, utils.query.stringify(params));
    }

    /**
     * 유료 상품 결제 완료
     * @param id
     * @param no
     * @param params
     * @returns {IDBRequest | Promise<void>}
     */
    fetchChargeProductPayment(id, no, params) {
        return this.instance.put(`${this.base}/${id}/charge-product-request/${no}/payment`, utils.query.stringify(params));
    }

    /**
     * 유료상품 연장 요청
     * @param id
     * @param charge_buy_no
     * @param params
     * @returns {IDBRequest | Promise<void>}
     */
    updateChargeProductExtend(id, charge_buy_no, params) {
        return this.instance.put(`${this.base}/${id}/charge-product-request/${charge_buy_no}/extend`, utils.query.stringify(params));
    }

    /**
     * 리뷰 리스트 조회
     * @param id
     * @param params
     */
    fetchAllSelfReview(id, params) {
        return this.instance.get(`${this.base}/${id}/self-reviews?${utils.query.stringify(params)}`);
    }

    /**
     * 작가 본인작성 리뷰 상세
     * @param id
     * @param self_review_no
     */
    fetchSelfReview(id, self_review_no) {
        return this.instance.get(`${this.base}/${id}/self-reviews/${self_review_no}`);
    }

    /**
     * 작가 리뷰 등록
     * @param id
     * @return {*|{Content-Type}}
     */
    insertSelfReview(id, params) {
        return this.instance.post(`${this.base}/${id}/self-reviews`, utils.query.stringify(params));
    }

    /**
     * 작가 리뷰 수정
     * @param self_review_no
     * @return {*}
     */
    updateSelfReview(id, self_review_no, params) {
        return this.instance.put(`${this.base}/${id}/self-reviews/${self_review_no}`, utils.query.stringify(params));
    }

    /**
     * 승인요청
     * @param id
     * @param self_review_no
     * @return {*}
     */
    updateRequestSelfReview(id, self_review_no) {
        return this.instance.put(`${this.base}/${id}/self-reviews/${self_review_no}/request-status`);
    }

    /**
     * 리뷰 삭제
     * @param id
     * @param self_review_no
     * @return {boolean}
     */
    deleteSelfReview(id, self_review_no) {
        return this.instance.delete(`${this.base}/${id}/self-reviews/${self_review_no}`);
    }

    /**
     * 작가리뷰 이미지 등록
     * @param id
     * @param params
     * @return {*|{Content-Type}}
     */
    insertSelfReviewImage(id, params) {
        return this.instance.post(`${this.base}/${id}/self-reviews/upload-img`, utils.query.stringify(params));
    }

    /**
     * 유료광고 상품추가
     * @param artist_id
     * @param charge_buy_no
     * @param data
     * @returns {*|axios.Promise|void}
     */
    insertChargeAddProduct(artist_id, charge_buy_no, data) {
        return this.instance.post(`${this.base}/${artist_id}/charge-product-request/${charge_buy_no}/product`, utils.query.stringify(data));
    }

    /**
     * 유료광고 상품삭제
     * @param artist_id
     * @param charge_buy_no
     * @param charge_product_no
     * @returns {*}
     */
    deleteChargeAddProduct(artist_id, charge_buy_no, charge_product_no) {
        return this.instance.delete(`${this.base}/${artist_id}/charge-product-request/${charge_buy_no}/product/${charge_product_no}`);
    }
}

export default Artists;
