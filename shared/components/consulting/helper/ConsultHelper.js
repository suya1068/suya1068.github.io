import API from "forsnap-api";

export default class ConsultHelper {
    /**
     * 카테고리 등록 API
     * @param data - Object(
     * @returns {*|{"Content-Type"}}
     */
    setAdviceOrdersCategory(data) {
        return API.orders.insertAdviceOrdersCategory(data);
    }

    /**
     * 카테고리 수정 API
     * @param no
     * @param data
     * @returns {IDBRequest|Promise<void>}
     */
    fetchAdviceOrdersCategory(no, data) {
        return API.orders.updateAdviceOrdersCategory(no, data);
    }

    /**
     * 기본정보 수정 API
     * @param no
     * @param data
     * @returns {IDBRequest|Promise<void>}
     */
    fetchAdviceOrderInfo(no, data) {
        return API.orders.updateAdviceOrdersInfo(no, data);
    }

    /**
     * 콘텐츠 수정 API
     * @param no
     * @param data
     * @returns {IDBRequest|Promise<void>}
     */
    fetchAdviceOrderContent(no, data) {
        return API.orders.updateAdviceOrdersContent(no, data);
    }

    /**
     * 개선된 콘텐츠 수정 API
     * @param no
     * @param data
     * @returns {IDBRequest|Promise<void>}
     */
    updateAdviceOrderContentTrans(no, data) {
        return API.orders.updateAdviceOrdersContentTrans(no, data);
    }

    /**
     * 개선된 정보 수정 API
     * @param no
     * @param data
     * @returns {IDBRequest|Promise<void>}
     */
    updateAdviceOrderInfoTrans(no, data) {
        return API.orders.updateAdviceOrdersInfoTrans(no, data);
    }

    /**
     * 요청서 불러오기 API
     * @param no
     * @param id
     * @returns {*}
     */
    getAdviceOrder(no, id = "") {
        return API.orders.findAdviceOrders(no, id);
    }

    /**
     * 업로드 파일 삭제
     * @param no
     * @param idx
     * @param param
     * @returns {*}
     */
    deleteAttachFile(no, idx, param) {
        return API.orders.deleteAdviceOrdersAttachFile(no, idx, param);
    }

    /**
     * 촬영 상담 카카오 신청
     * @param no
     * @param params
     * @returns {IDBRequest|Promise<void>}
     */
    fetchAdviceOrderInfoForKaKao(no, params) {
        return API.orders.fetchAdviceOrderInfoForKaKao(no, params);
    }
}
