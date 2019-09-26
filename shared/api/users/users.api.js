import utils from "shared/helper/utils";
import axios from "axios";

class Users {
    constructor(instance) {
        this.base = "/users";
        this.instance = instance;
    }

    /**
     * 유저 정보를 가져온다.
     * @param {string} id
     * @returns {axios.Promise}
     */
    find(id) {
        return this.instance.get(`${this.base}/${id}`);
    }

    /**
     * 상품 하트를 등록한다.
     * @param {string|number} id
     * @param {string|number} productNo
     * @param {?object} options
     * @returns {*|axios.Promise}
     */
    like(id, productNo, options) {
        return this.instance.post(`${this.base}/${id}/likes/${productNo}`, "", Object.assign({}, options));
    }

    /**
     * 상품 하트를 취소한다.
     * @param {string|number} id
     * @param {string|number} productNo
     * @param {?object} options
     * @returns {*|axios.Promise}
     */
    unlike(id, productNo, options) {
        return this.instance.delete(`${this.base}/${id}/likes/${productNo}`, Object.assign({}, options));
    }

    /**
     * 상품 하트의 모든 정보를 조회한다.
     * @param {string|number} id
     * @param offset - Number
     * @param limit - Number
     * @returns {*|axios.Promise}
     */
    likeList(id, offset, limit) {
        return this.instance.get(`${this.base}/${id}/likes?offset=${offset}&limit=${limit}`);
    }

    /**
     * 알림 가져오기
     * @param id - String (유저 아이디)
     */
    notice(id) {
        return this.instance.get(`${this.base}/${id}/notice`);
    }

    /**
     * 유저 정보를 저장한다(수정)
     * @param id - String (유저아이디)
     * @param obj - formData (name, gender, birth, phone, region, email_agree)
     * @returns {*|axios.Promise}
     */
    updateUserData(id, obj) {
        return this.instance.put(`${this.base}/${id}`, utils.query.stringify(obj));
    }

    /**
     * 유저정보수정 이메일 인증번호를 받는다.
     * @param id - String (유저 아이디)
     * @param email - String (email form)
     */
    userEmailConfirm(id, email) {
        return this.instance.post(`${this.base}/${id}/email-code`, utils.query.stringify(email));
    }

    /**
     * 유저정보수정 이메일 인증을 한다.
     * @param id - String (유저 아이디)
     * @param obj - Form (email - 이메일 주소, code - 인증번호)
     */
    userEmailConfirmCheck(id, obj) {
        return this.instance.put(`${this.base}/${id}/email-code`, utils.query.stringify(obj));
    }

    /**
     * 유저 프로파일사진 등록
     * @param id
     * @param obj
     * @returns {axios.Promise|*}
     */
    uploadUserPhoto(id, obj) {
        return this.instance.put(`${this.base}/${id}/photo`, utils.query.stringify(obj));
    }
    /**
     * 유저 프로파일사진 등록 - 테스트
     * @param id
     * @param obj
     * @returns {axios.Promise|*}
     */
    uploadUserPhoto3(id, key) {
        return this.instance.put(`${this.base}/${id}/photos3`, key);
    }

    /**
     * 유저 후기 리스트
     * @param id - String (유저 아이디)
     * @param offset - Integer
     * @param limit - Integer
     * @param startDt - String (yyyymmdd or yyyymm or yyyy)
     * @param endDt - String (yyyymmdd or yyyymm or yyyy)
     */
    getCommentList(id, startDt, endDt, offset, limit) {
        return this.instance.get(`${this.base}/${id}/review?limit=${limit}&offset=${offset}&start_dt=${startDt}&end_dt=${endDt}`);
    }

    apiS3UploadImage(action, obj) {
        // const api = axios.create({
        //     baseURL: "",
        //     timeout: 0
        // });
        //
        // return api.post(action, obj);
        return this.instance.post(action, obj);
    }

    /**
     * 유저 폰번호 수정
     * @param id - String (유저 아아디
     * @param obj - Object(phone)
     */
    modifyPhone(id, obj) {
        return this.instance.put(`${this.base}/${id}/phone`, utils.query.stringify(obj));
    }

    /**
     * 리뷰 등록시 작가정보와 업로드 정책을 조회한다.
     * @param {string} userId - 유저 아이디
     * @param {string} nickName - 작가명
     * @returns {axios.Promise}
     */
    fetchPhotographerAndUploadPolicy(userId, nickName) {
        return this.instance.get(`${this.base}/${userId}/direct-review?nick_name=${encodeURIComponent(nickName)}`);
    }

    /**
     * 촬영후기를 등록한다.
     * @param {string} userId
     * @param {object} form
     * @param {string} form.artist_id
     * @param {string} form.comment
     * @param {string} form.kind
     * @param {string} form.quality
     * @param {string} form.service
     * @param {string} form.price
     * @param {string} form.talk
     * @param {string} form.trust
     * @param {?string} form.key - s3에 전달한 key 값
     * @returns {*|axios.Promise}
     */
    createPhotographComment(userId, form) {
        return this.instance.post(`${this.base}/${userId}/direct-review`, utils.query.stringify(form));
    }

    /**
     * 리뷰 등록시 작가정보와 업로드 정책을 조회한다.
     * @param {string} nickName - 작가명
     * @returns {axios.Promise}
     */
    fetchPhotographerAndGuestUploadPolicy(nickName) {
        return this.instance.get(`${this.base}/guest-review?nick_name=${encodeURIComponent(nickName)}`);
    }

    /**
     * 촬영후기를 등록한다.
     * @param {object} form
     * @param {string} form.temp_user_id
     * @param {string} form.name
     * @param {string} form.artist_id
     * @param {string} form.comment
     * @param {string} form.kind
     * @param {string} form.quality
     * @param {string} form.service
     * @param {string} form.price
     * @param {string} form.talk
     * @param {string} form.trust
     * @param {?string} form.key - s3에 전달한 key 값
     * @returns {*|axios.Promise}
     */
    createGuestPhotographComment(form) {
        return this.instance.post(`${this.base}/guest-review`, utils.query.stringify(form));
    }

    restClear(user_id, params) {
        return this.instance.put(`${this.base}/${user_id}/rest`, utils.query.stringify(params));
    }

    /**
     * 전화번호 인증코드 발송
     * @param data - Object (phone)
     * @return {Promise}
     */
    phoneCode(user_id, data) {
        return this.instance.post(`${this.base}/${user_id}/phone-code`, utils.query.stringify(data));
    }

    /**
     * 전화번호 인증코드 확인
     * @param data - Object (phone, code)
     * @return {Promise}
     */
    confirmPhoneCode(user_id, data) {
        return this.instance.put(`${this.base}/${user_id}/phone-code`, utils.query.stringify(data));
    }

    /**
     * 비밀번호 변경
     * @param user_id - String
     * @param data - Object (password, new_password)
     * @return {*}
     */
    updatePassword(user_id, data) {
        return this.instance.put(`${this.base}/${user_id}/password`, utils.query.stringify(data));
    }
}

export default Users;
