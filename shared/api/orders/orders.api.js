import utils from "shared/helper/utils";

class Orders {
    constructor(instance) {
        this.base = "/orders";
        this.guest = "/guest-orders";
        this.advice = "/advice-orders";
        this.instance = instance;
    }

    /**
     * 촬영의뢰서 조회
     * @param orderNo - String (의뢰서번호)
     */
    find(orderNo) {
        return this.instance.get(`${this.base}/${orderNo}`);
    }

    /**
     * 촬영의뢰 등록
     * @param data - Object (name, phone, email)
     * @return {*|{Content-Type}|axios.Promise}
     */
    register(data) {
        return this.instance.post(this.base, utils.query.stringify(data));
    }

    updateBasic(orderNo, data) {
        return this.instance.put(`${this.base}/${orderNo}`, utils.query.stringify(data));
    }

    /**
     * 의뢰서 카테고리,지역,날짜수정
     * @param orderNo - String (의뢰서번호)
     * @param data - Object (category, region, date, time)
     * @return {*|axios.Promise}
     */
    category(orderNo, data) {
        return this.instance.put(`${this.base}/${orderNo}/category`, utils.query.stringify(data));
    }

    /**
     * 의뢰서 컷옵션 수정
     * @param orderNo - String (의뢰서번호)
     * @param data - Object (...options)
     * @return {*|axios.Promise}
     */
    quantity(orderNo, data) {
        return this.instance.put(`${this.base}/${orderNo}/quantity`, utils.query.stringify(data));
    }

    /**
     * 의뢰서 요청사항 수정
     * @param orderNo - String (의뢰서번호)
     * @param data - Object (content)
     * @return {*|axios.Promise}
     */
    content(orderNo, data) {
        return this.instance.put(`${this.base}/${orderNo}/content`, utils.query.stringify(data));
    }

    /**
     * 첨부파일 업로드
     * @param orderNo - String (의뢰서번호)
     * @param data - Object (key)
     * @return {*|{Content-Type}|axios.Promise}
     */
    attach(orderNo, data) {
        return this.instance.post(`${this.base}/${orderNo}/attach`, utils.query.stringify(data));
    }

    /**
     * 첨부파일 삭제
     * @param orderNo - String (의뢰서번호)
     * @param attachNo - String (첨부파일 번호)
     * @return {boolean|*|axios.Promise}
     */
    deleteAttach(orderNo, attachNo) {
        return this.instance.delete(`${this.base}/${orderNo}/attach/${attachNo}`);
    }

    /**
     * 첨부파일 업로드 (이미지 제외)
     * @param order_no
     * @param data - Object (key, file_name)
     * @returns {*|{"Content-Type"}}
     */
    attachFile(order_no, data) {
        return this.instance.post(`${this.base}/${order_no}/attach-file`, utils.query.stringify(data));
    }

    /**
     * 첨부파일 삭제
     * @param orderNo - String (의뢰서번호)
     * @param attachNo - String (첨부파일 번호)
     * @return {boolean|*|axios.Promise}
     */
    deleteAttachFile(order_no, attach_no) {
        return this.instance.delete(`${this.base}/${order_no}/attach-file/${attach_no}`);
    }

    /**
     * 촬영의뢰서 검수 요청
     * @param orderNo - String (의뢰서번호)
     * @return {*|axios.Promise}
     */
    request(orderNo) {
        return this.instance.put(`${this.base}/${orderNo}/request`);
    }

    /**
     * 유저 본인의 촬영의뢰서 리스트 조회
     * @param userId
     * @param params - limit : Integer, offset : Integer
     * @returns {*|axios.Promise}
     */
    getMyEstimateList(userId, params = {}) {
        return this.instance.get(`${this.base}/${userId}?${utils.query.stringify(params)}`);
    }

    /**
     * 댓글을 등록한다.
     * @param orderNo (촬영요청 번호)
     * @param data - object : String (댓글 내용)
     * @returns {*|axios.Promise}
     */
    regComment(orderNo, data) {
        return this.instance.post(`${this.base}/${orderNo}/comment`, utils.query.stringify(data));
    }

    /**
     * 댓글의 답글을 등록한다.
     * @param orderNo (촬영요청 번호)
     * @param data - object : String (댓글의 답글내용)
     *                      : Integer (댓글의 번호)
     * @returns {*|{Content-Type}|axios.Promise}
     */
    regReplyComment(orderNo, data) {
        return this.instance.post(`${this.base}/${orderNo}/reply`, utils.query.stringify(data));
    }

    /**
     * 촬영요청서의 댓글리스트를 조회한다.
     * @param orderNo
     * @param param
     */
    getCommentList(orderNo, param = {}) {
        return this.instance.get(`${this.base}/${orderNo}/comments?${utils.query.stringify(param)}`);
    }

    /**
     * 견적서의 상세내용을 조회한다.
     * @param order_no
     * @param offer_no
     */
    getOfferDetail(order_no, offer_no) {
        return this.instance.get(`${this.base}/${order_no}/offers/${offer_no}`);
    }

    /**
     * 작가가 보는 촬영요청 리스트
     */
    getOrders(params = {}) {
        return this.instance.get(`${this.base}?${utils.query.stringify(params)}`);
    }

    /**
     * 견적서 리스트 조회
     * @param order_no - Number (촬영의뢰서 번호)
     * @param params
     * @returns {*|{Content-Type}|axios.Promise}
     */
    getOfferList(order_no, params = {}) {
        return this.instance.get(`${this.base}/${order_no}/offers?${utils.query.stringify(params)}`);
    }

    /**
     * 촬영요청서 노출 / 비노출 처리
     * @param order_no - Number (촬영의뢰서 번호)
     * @param display - String (노출 여부)
     * @returns {*|axios.Promise}
     */
    updateOrderDisplay(order_no, display) {
        return this.instance.put(`${this.base}/${order_no}/display`, utils.query.stringify(display));
    }

    /**
     * 완료된 촬영요청서 리스트를 조회
     * @param params
     */
    getCompleteOrders(params = {}) {
        return this.instance.get(`${this.base}/complete?${utils.query.stringify(params)}`);
    }

    /**
     * 견적서용 포트폴리오를 조회한다.
     * @param params - Object (order_no: 요청서 번호, offer_no: 견적서 번호, portfolio_no: 포트폴리오 번호)
     */
    getPortfolio(params = {}) {
        return this.instance.get(`${this.base}/${params.order_no}/offers/${params.offer_no}/portfolio/${params.portfolio_no}`);
    }

    /**
     * 게스트 촬영의뢰서 조회
     * @param orderNo - String (의뢰서번호)
     */
    guest_find(orderNo, data) {
        return this.instance.get(`${this.guest}/${orderNo}?${utils.query.stringify(data)}`);
    }

    /**
     * 비회원도 의뢰가능한 촬영 요청서 등록
     * @param data - object (category, region, date, time)
     * @return {*|{Content-Type}|axios.Promise}
     */
    guest_register(data) {
        return this.instance.post(this.guest, utils.query.stringify(data));
    }

    /**
     * 게스트 촬영 요청서 카테고리 수정
     * @param order_no - string (의뢰서 번호)
     * @param data - object (category, region, date, time)
     * @returns {*|axios.Promise}
     */
    quest_updateCategory(order_no, data, temp_id) {
        if (temp_id) {
            data.temp_user_id = temp_id;
        }
        return this.instance.put(`${this.guest}/${order_no}/category`, utils.query.stringify(data));
    }
    /**
     * 게스트 의뢰서 컷옵션 수정
     * @param order_no - String (의뢰서번호)
     * @param data - Object (...options)
     * @return {*|axios.Promise}
     */
    quest_quantity(order_no, data) {
        return this.instance.put(`${this.guest}/${order_no}/quantity`, utils.query.stringify(data));
    }
    /**
     * 게스트 의뢰서 요청사항 수정
     * @param order_no - String (의뢰서번호)
     * @param data - Object (content)
     * @return {*|axios.Promise}
     */
    guest_content(order_no, data) {
        return this.instance.put(`${this.guest}/${order_no}/content`, utils.query.stringify(data));
    }
    /**
     * 게스트 의뢰서를 유저 의뢰서로 전환
     * @param order_no - String (의뢰서번호)
     * @param data - Object (temp_user_id)
     * @return {*|axios.Promise}
     */
    guest_update_user(order_no, data) {
        return this.instance.put(`${this.guest}/${order_no}/user`, utils.query.stringify(data));
    }
    /**
     * 첨부파일 업로드
     * @param order_no - String (의뢰서번호)
     * @param data - Object (key)
     * @return {*|{Content-Type}|axios.Promise}
     */
    guest_attach(order_no, data) {
        return this.instance.post(`${this.guest}/${order_no}/attach`, utils.query.stringify(data));
    }
    /**
     * 첨부파일 삭제
     * @param orderNo - String (의뢰서번호)
     * @param attachNo - String (첨부파일 번호)
     * @return {boolean|*|axios.Promise}
     */
    quest_deleteAttach(orderNo, attachNo, data) {
        return this.instance.delete(`${this.guest}/${orderNo}/attach/${attachNo}?${utils.query.stringify(data)}`);
    }

    /**
     * 크루스튜디오 요청서 리스트
     */
    findCrew(offset, limit = 10) {
        return this.instance.get(`crew-orders?offset=${offset}&limit=${limit}`);
    }

    /**
     * 크루스튜디오 요청서 상세
     * @param crewOrderNo
     */
    findCrewByNo(crewOrderNo) {
        return this.instance.get(`crew-orders/${crewOrderNo}`);
    }

    /**
     * 크루스튜디오 요청서 댓글 더보기
     * @param crewOrderNo
     * @param offset
     * @param limit
     */
    findCrewCommentsByNo(crewOrderNo, offset, limit = 10) {
        return this.instance.get(`crew-orders/${crewOrderNo}/comments?offset=${offset}&limit=${limit}`);
    }

    /**
     * 크루스튜디오 요청서 댓글 등록
     * @param crewOrderNo - Number (요청서 번호)
     * @param data - Object (comment)
     * @return {*|{Content-Type}|axios.Promise}
     */
    insertCrewComment(crewOrderNo, data) {
        return this.instance.post(`crew-orders/${crewOrderNo}/comments`, utils.query.stringify(data));
    }

    /**
     * 상담신청
     * @param data - Object (category, user_name, user_phone, content)
     */
    insertAdviceOrders(data) {
        return this.instance.post(`${this.advice}`, utils.query.stringify(data));
    }

    /**
     * 상담신청
     * @param no
     * @param data
     * @returns {IDBRequest | Promise<void>}
     */
    updateAdviceOrdersAttachUser(no, data) {
        return this.instance.put(`${this.advice}/${no}/user`, utils.query.stringify(data));
    }

    /**
     * 단계별 상담신청 1 - 카테고리 등록
     * @param data - Object (category, device_type, access_type, page_type, product_no, referer, referer_keyword)
     * @returns {*|{"Content-Type"}}
     */
    insertAdviceOrdersCategory(data) {
        return this.instance.post(`${this.advice}/category`, utils.query.stringify(data));
    }

    /**
     * 단계별 상담신청 1-1 - 카테고리 수정
     * @param no - Number (advice_order_no)
     * @param data - Object (category, temp_user_id)
     * @returns {IDBRequest | Promise<void>}
     */
    updateAdviceOrdersCategory(no, data) {
        return this.instance.put(`${this.advice}/${no}/category`, utils.query.stringify(data));
    }

    /**
     * 단계별 상담신청 2 - 유저 정보 수정
     * @param no - Number (advice_order_no)
     * @param data - Object (user_name, user_phone, counsel_time, temp_user_id)
     * @returns {IDBRequest | Promise<void>}
     */
    updateAdviceOrdersInfo(no, data) {
        return this.instance.put(`${this.advice}/${no}/info`, utils.query.stringify(data));
    }

    /**
     * 단계별 상담신청 3 - 상담내용 등록
     * @param no - Number (advice_orders_no)
     * @param data - Object (content, temp_user_id)
     * @returns {IDBRequest | Promise<void>}
     */
    updateAdviceOrdersContent(no, data) {
        return this.instance.put(`${this.advice}/${no}/content`, utils.query.stringify(data));
    }

    /**
     * 상담신청 내용 조회
     * @param no - Number (advice_orders_no)
     * @param id - String (temp_user_id)
     * @returns {*}
     */
    findAdviceOrders(no, id = "") {
        let id_str = "";
        if (id) {
            id_str = `?temp_user_id=${id}`;
        }
        return this.instance.get(`${this.advice}/${no}${id_str}`);
    }

    /**
     * 상담신청 파일첨부
     * @param order_no
     * @param data
     * @returns {*|{"Content-Type"}}
     */
    updateAdviceOrderAttachFile(order_no, data) {
        return this.instance.post(`${this.base}/${order_no}/attach-file`, utils.query.stringify(data));
    }

    /**
     * 상담신청 파일첨부 삭제
     * @param order_no
     * @param attach_no
     * @returns {*}
     */
    deleteAdviceOrderAttachfile(order_no, attach_no) {
        return this.instance.delete(`${this.base}/${order_no}/attach-file/${attach_no}`);
    }

    /**
     * 업로드 정책을 가져온다.
     * @returns {*}
     */
    findAdviceOrderPolicy() {
        return this.instance.get(`${this.advice}/policy`);
    }

    /**
     * 개선된 상담신청 내용
     * @param no - Number (요청서 번호)
     * @param params - Object
     *                  : temp_user_id - String(임시 회원 id)
     *                  : attach_info - Array(첨부파일 정보)
     *                  : extra_info - Object(추가 질문 정보)
     *                  : content - String(내용)
     *                  : url - String(참고사이트 주소)
     * @returns {IDBRequest | Promise<void>}
     */
    updateAdviceOrdersContentTrans(no, params) {
        return this.instance.put(`${this.advice}/${no}/content-trans`, utils.query.stringify(params));
    }

    /**
     * 개선된 상담신청 정보
     * @param no - Number (요청서 번호)
     * @param params - Object
     *                  : user_name - String(유저명), required
     *                  : user_phone - String(유저연락처), required
     *                  : temp_user_id - String(임시 회원 id)
     *                  : counsel_time - String(상담가능시간), required
     *                  : counsel_type - String(상담방법)
     * @returns {IDBRequest | Promise<void>}
     */
    updateAdviceOrdersInfoTrans(no, params) {
        return this.instance.put(`${this.advice}/${no}/info-trans`, utils.query.stringify(params));
    }

    /**
     * 상담요청서 파일첨부 삭제
     * @param no
     * @param idx
     * @returns {*}
     */
    deleteAdviceOrdersAttachFile(no, idx, param) {
        return this.instance.delete(`${this.advice}/${no}/attach-file/${idx}?${utils.query.stringify(param)}`);
    }

    /**
     * 크루스튜디오 전화번호 확인
     * @param crew_order_no
     * @return {*}
     */
    updatePhoneConfirm(crew_order_no) {
        return this.instance.put(`/crew-orders/${crew_order_no}/phone-confirm`);
    }

    /**
     * 촬영 상담 카카오 신청 정보 수정
     * @param advice_order_no
     * @param params
     * @returns {IDBRequest | Promise<void>}
     */
    fetchAdviceOrderInfoForKaKao(advice_order_no, params) {
        return this.instance.put(`${this.advice}/${advice_order_no}/info-kakao`, utils.query.stringify(params));
    }

    /**
     * 상담요청 첨부팡리수정 기간 조회
     * @param url - String
     */
    fetchOutsideConsultTimeLimit(url) {
        // return this.instance.get(`${this.advice}/outside/${url}/time-limit`);
        return this.instance.get(`/advice-order/outside/${url}/time-limit`);
    }

    /**
     * 상담요청 첨부파일 추가 정보 조회
     * @param url - String
     * @param data - Object (password)
     * @return {*|{Content-Type}}
     */
    fetchOutsideConsult(url, data) {
        // return this.instance.post(`${this.advice}/outside/${url}`, utils.query.stringify(data));
        return this.instance.post(`/advice-order/outside/${url}`, utils.query.stringify(data));
    }

    attachConsult(advice_order_no, data) {
        return this.instance.put(`${this.advice}/${advice_order_no}/attach-file`, utils.query.stringify(data));
    }

    /**
     * 견적산출 등록
     * @param data
     * @returns {*|{"Content-Type"}}
     */
    insertOrderEstimate(data) {
        return this.instance.post(`${this.advice}/estimate`, utils.query.stringify(data));
    }

    /**
     * 추천작가리스트 조회
     * @param params
     * @returns {*}
     */
    findRecommendArtist(params) {
        return this.instance.get(`${this.advice}/recommend-artist?${utils.query.stringify(params)}`);
    }

    /**
     * 추천작가 확인 or 작가에게 문의
     * @param params
     * @returns {*|{"Content-Type"}}
     */
    insertArtistOrder(params) {
        return this.instance.post(`${this.advice}/artist-order`, utils.query.stringify(params));
    }

    /**
     * 작가에게 문의
     * @param order_no
     * @param params
     * @returns {IDBRequest | Promise<void>}
     */
    fetchArtistOrder(order_no, params) {
        return this.instance.put(`${this.advice}/artist-order/${order_no}`, utils.query.stringify(params));
    }

    /**
     * 견적산출 이메일 전송
     * @param no
     * @param params
     * @returns {*|{"Content-Type"}}
     */
    insertSendEmail(no, params) {
        return this.instance.post(`${this.advice}/estimate/${no}/send-email`, utils.query.stringify(params));
    }

    /**
     * 견적산출 상세 조회
     * @param no
     * @returns {*}
     */
    fetchEstimate(no) {
        return this.instance.get(`${this.advice}/estimate/${no}`);
    }
}

export default Orders;
