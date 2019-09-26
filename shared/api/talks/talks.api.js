import utils from "shared/helper/utils";

class Talks {
    constructor(instance) {
        this.base = "/talks";
        this.instance = instance;
    }

    /**
     * 대화 목록 조회
     * @param userType - String (A - 작가, U - 유저)
     * @param offset - Number (조회 시작 인덱스)
     * @param limit - Number (가져올 갯수)
     */
    findToc(user_type, offset, limit) {
        return this.instance.get(`${this.base}?user_type=${user_type}&offset=${offset}&limit=${limit}`);
    }

    /**
     * 대화 내용 조회
     * @param receive_id - String (상대 유저아이디)
     * @param key - String (대화방 키값 - 상품번호, 견적서번호)
     * @param user_type - String (A - 작가, U - 유저)
     * @param group_type - String (대화방 그룹타입)
     * @param offset - Number (조회 시작 인덱스)
     * @param limit - Number (가져올 갯수)
     */
    findMessage(receive_id, key, user_type, group_type, offset, limit) {
        return this.instance.get(`${this.base}/${receive_id}/messages?key=${key}&user_type=${user_type}&group_type=${group_type}&limit=${limit}&offset=${offset}`);
    }

    /**
     * 고객센터 대화 내용 조회
     * @param id - String (유저아이디)
     */
    findMessageHelp(id, offset, limit) {
        return this.instance.get(`${this.base}/${id}/help?limit=${limit}&offset=${offset}`);
    }

    /**
     * 메세지 보내기
     * @param receive_id - String (받는 유저아이디)
     * @param data - Object (
     *          key - String (대화방 키값 - 상품번호, 견적서번호)
     *          user_type - String (A - 작가, U - 유저)
     *          group_type - String (대화방 그룹타입)
     *          content - String (메시지)
     *
     *          s3_key - String (파일전송시, 업로드 키)
     *          file_name - String (파일전송시, 파일명)
     *        )
     * @returns {axios.Promise|*|{Content-Type}}
     */
    insertMessage(receive_id, data) {
        return this.instance.post(`${this.base}/${receive_id}/messages`, utils.query.stringify(data));
    }

    /**
     * 고객센터 대화 내용 조회
     * @param id - String (유저아이디)
     */
    insertMessageHelp(id, offset, limit) {
        return this.instance.get(`${this.base}/${id}/help?limit=${limit}&offset=${offset}`);
    }

    /////////////////////////////////////////////////////////////////////////////
    /**
     * 대화 내용 조회
     * @param receiveId - String (상대 유저아이디)
     * @param key - String (대화방 키값 - 상품번호)
     * @param userType - String (A - 작가, U - 유저)
     * @param groupType - String (대화방 그룹타입)
     * @param offset - Number (조회 시작 인덱스)
     * @param limit - Number (가져올 갯수)
     */
    messages(receiveId, key, userType, groupType, offset = 0, limit = 20) {
        return this.instance.get(`${this.base}/${receiveId}/messages?key=${key}&user_type=${userType}&group_type=${groupType}&limit=${limit}&offset=${offset}`);
    }

    /**
     * 메세지 보내기
     * @param receiveId - String (받는 유저아이디)
     * @param key - String (대화방 키값 - 상품번호)
     * @param userType - String (A - 작가, U - 유저)
     * @param groupType - String (대화방 그룹타입)
     * @param content - String (메시지)
     * @returns {axios.Promise|*|{Content-Type}}
     */
    send(receiveId, key, userType, groupType, content, s3Key, fileName) {
        const obj = {
            receive_id: receiveId,
            key,
            user_type: userType,
            group_type: groupType
        };

        if (content) {
            obj.content = content;
        }

        if (s3Key) {
            obj.s3_key = s3Key;
        }

        if (fileName) {
            obj.file_name = fileName;
        }

        return this.instance.post(`${this.base}/${receiveId}/messages`, utils.query.stringify(obj));
    }

    /**
     * 대화 목록 조회
     * @param userType - String (A - 작가, U - 유저)
     * @param offset - Number (조회 시작 인덱스)
     * @param limit - Number (가져올 갯수)
     */
    list(userType, offset = 0, limit = 12) {
        // const obj = { user_id: id, user_type: userType, offset, limit };
        return this.instance.get(`${this.base}?user_type=${userType}&offset=${offset}&limit=${limit}`);
    }

    /**
     * 고객센터 대화 내용 조회
     * @param id - String (유저아이디)
     */
    help(id, offset = 0, limit = 20) {
        return this.instance.get(`${this.base}/${id}/help?limit=${limit}&offset=${offset}`);
    }

    /**
     * 대화에서 문의하기 보내기
     * @param id - String (유저아이디)
     * @param obj - Object (content)
     * @returns {axios.Promise|*|{Content-Type}}
     */
    question(id, obj) {
        return this.instance.post(`${this.base}/${id}/help`, utils.query.stringify(obj));
    }

    insertTalkOfferInfo(id, obj) {
        return this.instance.post(`${this.base}/${id}/offer-info`, utils.query.stringify(obj));
    }

    /**
     * 견적문의 대화내용
     * @param id - String (아아디)
     */
    offer(id) {
        return this.instance.get(`${this.base}/${id}/offer`);
    }

    /**
     * 견적문의 채팅 메세지 전송
     * @param id - String (아아디)
     * @param obj - Object (content)
     * @return {axios.Promise|*|{Content-Type}}
     */
    sendOffer(id, obj) {
        return this.instance.post(`${this.base}/${id}/offer`, utils.query.stringify(obj));
    }

    uploadInfo(id) {
        return this.instance.get(`${this.base}/${id}/upload-info`);
    }

    /**
     * 결제 메시지 보내기
     * @param receiveId - String (받는 유저아이디)
     * @param data - Object (key *대화방 키값, group_type *대화방 그룹타입, reserve_type *예약종류, price *금액, content *내용, date 예약일, buy_no 추가결제 주문번호)
     * @return {*|{Content-Type}|axios.Promise}
     */
    reservation(receiveId, data) {
        return this.instance.post(`${this.base}/${receiveId}/reservation-messages`, utils.query.stringify(data));
    }

    /**
     * 대화방 삭제
     * @param groupNo - String (대화방 그룹 번호)
     */
    deleteTalk(groupNo) {
        return this.instance.delete(`${this.base}?group_no=${groupNo}`);
    }

    /**
     * 맞춤결제 대화 취소
     * @param talk_no
     * @param data
     * @return {*}
     */
    updateCustomPaymentCancel(talk_no, data) {
        return this.instance.put(`${this.base}/${talk_no}/custom-payment-cancel`, utils.query.stringify(data));
    }

    /**
     * 작가 연락처 전달 요청
     * @param params (group_key : 대화방 키값, reason: 전달 사유)
     * @returns {*}
     */
    createPhoneSend(params) {
        return this.instance.post(`${this.base}/phone-send`, utils.query.stringify(params));
    }

    /**
     * 작가 연락처 진행상황 등록
     * @param params (group_key : 대화방 키값, progress_content: 진행내용)
     * @returns {*}
     */
    updatePhoneSend(params) {
        return this.instance.put(`${this.base}/phone-send`, utils.query.stringify(params));
    }

    downloadAttach(message_no, options) {
        return this.instance.get(`${this.base}/${message_no}/attach`, options);
    }
}

export default Talks;
