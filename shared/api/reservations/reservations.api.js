import utils from "shared/helper/utils";

class Reservations {
    constructor(instance) {
        this.base = "/reservations";
        this.instance = instance;
    }

    /**
     * 예약 - STEP 1
     * @param {object} data
     * @param {number} data.product_no - 상품번호
     * @param {number} data.date - 예약일
     * @param {string} data.option - 옵션 종류(ORIGIN, CUSTOM, PRINT)
     * @param {number} data.person - 촬영 인원수
     * @param {?object} [options= {}]
     * @return {axios.Promise|*}
     */
    reserveToProduct(data, options) {
        return this.instance.post(this.base, utils.query.stringify(data), Object.assign({}, options));
    }

    /**
     * 예약 - STEP 2
     * @param {object} data
     * @param {number} data.amount - 상품 가격
     * @param {string} data.name - 상품 이름
     * @param {string} data.merchant_uid - 가맹점에서 생성하는 고유번호
     * @param {object} data.custom_data
     * @param {string} data.custom_data.user_id - 유저 아이디
     * @returns {Promise}
     */
    reserveToProductIMP(data) {
        return new Promise((resolve, reject) => {
            IMP.request_pay(data, result => {
                if (result.success) {
                    resolve(result);
                } else {
                    reject(result);
                }
            });
        });
    }

    /**
     * 예약 - STEP 3
     * @param {number} no - 주문번호
     * @param {object} data
     * @param {number} data.product_no - 상품번호
     * @param {number} data.pay_uid - 결제완료 고유번호
     * @param {?object} [options= {}]
     * @return {axios.Promise|*}
     */
    reserveToProductPay(no, data, options) {
        return this.instance.put(`${this.base}/${no}/payment`, utils.query.stringify(data), Object.assign({}, options));
    }

    /**
     * 예약목록 조회
     * @param status - string (예약상태 READY, PAYMENT, PREPARE, SHOT, UPLOAD, CUSTOM, COMPLETE)
     * @param userType - string (U, A)
     * @param offset - int (가져올 데이터 시작 인덱스)
     * @param limit - int (가져올 데이터 갯수)
     */
    reserveList(status = "READY", userType = "U", offset = 0, limit = 10) {
        return this.instance.get(`${this.base}?status=${status}&user_type=${userType}&offset=${offset}&limit=${limit}`);
    }

    /**
     * @param params - Object
     * status - string (예약상태 READY, PAYMENT, PREPARE, SHOT, UPLOAD, CUSTOM, COMPLETE)
     * userType - string (U, A)
     * offset - int (가져올 데이터 시작 인덱스)
     * limit - int (가져올 데이터 갯수)
     */
    findReserveAll(params) {
        return this.instance.get(`${this.base}?${utils.query.stringify(params)}`);
    }

    /**
     * 예약 취소하기
     * @param buyNo - string (상품주문번호)
     * @param data - object (product_no, user_type, comment)
     * @param options - object
     */
    reserveCancel(buyNo, data, options) {
        return this.instance.put(`${this.base}/${buyNo}/cancel`, utils.query.stringify(data), Object.assign({}, options));
    }

    /**
     * 예약 상품 결제 완료
     * @param buyNo - string (상품주문번호)
     * @param data - object (product_no, pay_uid)
     * @param options - object
     */
    reservePayment(buyNo, data, options) {
        return this.instance.put(`${this.base}/${buyNo}/payment`, utils.query.stringify(data), Object.assign({}, options));
    }

    /**
     * 입금완료 상품 촬영 준비처리
     * @param buyNo - string (상품주문번호)
     * @param data - object (product_no)
     * @param options - object
     */
    reservePrepare(buyNo, data, options) {
        return this.instance.put(`${this.base}/${buyNo}/prepare`, utils.query.stringify(data), Object.assign({}, options));
    }

    /**
     * 원본 사진 목록 조회
     * @param buyNo - number (상품 주문번호)
     * @param productNo - number (상품 번호)
     * @param userType - string (유저타입 U - 유저 A - 작가)
     * @param offset - number (리스트 시작 인덱스)
     * @param limit - number (가져올 갯수)
     */
    reservePhotosOrigin(buyNo, productNo, userType, offset = 0, limit = 10) {
        return this.instance.get(`${this.base}/${buyNo}/photos?product_no=${productNo || ""}&user_type=${userType}&offset=${offset}&limit=${limit}`);
    }

    /**
     * 보정된 사진 목록 불러오기
     * @param buyNo - String (구매번호)
     * @param productNo - String or Number (상품번호)
     * @param userType - String (유저타입 U - 유저, A - 작가)
     * @param offset number(리스트 시작 인덱스)
     * @param limit number(리스트 갯수)
     */
    reservePhotosCustom(buyNo, productNo, userType, offset = 0, limit = 10) {
        return this.instance.get(`${this.base}/${buyNo}/custom-photos?product_no=${productNo || ""}&user_type=${userType}&offset=${offset}&limit=${limit}`);
    }

    /**
     * 원본사진에서 보정요청할 사진선택
     * @param buyNo - String (구매번호)
     * @param productNo - String (상품번호)
     * @param photosNo - String (요청사진들의 번호)
     */
    reservePhotosSelect(buyNo, productNo, photosNo) {
        const data = {
            product_no: productNo || "",
            photo_no: photosNo
        };
        return this.instance.post(`${this.base}/${buyNo}/custom-photos`, utils.query.stringify(data));
    }

    /**
     * 이미지 S3 직접 업로드
     * @param action - String
     * @param obj - Object
     * @returns {axios.Promise|*|{Content-Type}}
     */
    uploadS3(action, obj) {
        return this.instance.post(action, obj);
    }

    /**
     * 원본사진 업로드
     * @param buyNo - number (상품 주문번호)
     * @param data - object (product_no, file_name, key)
     */
    reserveUploadOrigin(buyNo, data) {
        if (!data.product_no) {
            data.product_no = "";
        }
        return this.instance.post(`${this.base}/${buyNo}/photos`, utils.query.stringify(data));
    }

    /**
     * 보정된사진 업로드
     * @param buyNo - String (구매번호)
     * @param data - object (product_no, file_name, key)
     * @returns {*|axios.Promise}
     */
    reserveUploadCustom(buyNo, data) {
        if (!data.product_no) {
            data.product_no = "";
        }
        return this.instance.put(`${this.base}/${buyNo}/custom-photos`, utils.query.stringify(data));
    }

    /**
     * 원본사진 불러오기
     * @param buyNo - String (구매번호)
     * @param photoNo - String or Number (사진번호)
     * @param productNo - String or Number (상품번호)
     * @param userType - String (유저타입 U - 유저, A - 작가)
     * @param options - Object (Header 정보, 생략가능)
     */
    reservePhotoViewOrigin(buyNo, photoNo, productNo, userType, photoType, options) {
        return this.instance.get(`${this.base}/${buyNo}/photos/${photoNo}?product_no=${productNo || ""}&user_type=${userType}&photo_type=${photoType}`, options);
    }

    /**
     * 원본사진 삭제
     * @param buyNo - String (구매번호)
     * @param photoNo - String or Number (사진번호)
     * @param productNo - String or Number (상품번호)
     * @returns {*|boolean|axios.Promise}
     */
    reserveDeletePhotoOrigin(buyNo, photoNo, productNo) {
        return this.instance.delete(`${this.base}/${buyNo}/photos?&photo_no=${photoNo}&product_no=${productNo || ""}`);
    }

    /**
     * 원본사진 업로드 완료처리
     * @param buyNo - String (구매번호)
     * @param data - Object (product_no)
     * @returns {*|axios.Promise}
     */
    reserveCompletePhotoOrigin(buyNo, data) {
        if (!data.product_no) {
            data.product_no = "";
        }
        return this.instance.put(`${this.base}/${buyNo}/upload`, utils.query.stringify(data));
    }

    /**
     * 보정사진 업로드 완료처리
     * @param buyNo - String (구매번호)
     * @param data - Object (product_no)
     * @returns {*|axios.Promise}
     */
    reserveCompletePhotoCustom(buyNo, data) {
        if (!data.product_no) {
            data.product_no = "";
        }
        return this.instance.put(`${this.base}/${buyNo}/custom`, utils.query.stringify(data));
    }

    /**
     * 상품 후기 상세조회
     * @param buyNo
     */
    reserveComment(buyNo, userType = "U") {
        return this.instance.get(`${this.base}/${buyNo}/comments?user_type=${userType}`);
    }

    /**
     * 등록된 리뷰에 답글 등록
     * @param buyNo - String or Number (구매번호)
     * @param commentNo - String or Number (코멘트번호)
     * @param data - Object (comment)
     * @returns {*|axios.Promise|{Object}}
     */
    reserveCommentReplay(buyNo, commentNo, data) {
        return this.instance.post(`${this.base}/${buyNo}/comments/${commentNo}/reply`, utils.query.stringify(data));
    }

    /**
     * 상품 구매 완료
     * @param buyNo - String (구매번호)
     * @param productNo - String (상품번호)
     * @returns {axios.Promise|*}
     */
    photoBuyComplete(buyNo, data) {
        if (!data.product_no) {
            data.product_no = "";
        }

        return this.instance.put(`${this.base}/${buyNo}/complete`, utils.query.stringify(data));
    }

    /**
     * 완료된 촬영 리스트
     * @param startDt - String (yyyymmdd or yyyymm or yyyy)
     * @param endDt - String (yyyymmdd or yyyymm or yyyy)
     * @param userType - String
     * @param offset - Number
     * @param limit - Number
     * @returns {*|axios.Promise}
     */
    reserveCompleteList(startDt, endDt, userType, offset = 0, limit = 10) {
        return this.instance.get(`${this.base}/complete?user_type=${userType}&start_dt=${startDt}&end_dt=${endDt}&offset=${offset}&limit=${limit}`);
    }

    fetchAllCompleteList(params) {
        return this.instance.get(`${this.base}/complete?${utils.query.stringify(params)}`);
    }

    /**
     * 사진 전체 다운로드 키
     * @param buyNo - String (구매번호)
     * @param productNo - String (상품번호)
     * @param status - String (origin || custom)
     */
    getDownloadKey(buyNo, productNo, status) {
        return this.instance.get(`${this.base}/${buyNo}/photos/download-url?product_no=${productNo || ""}&status=${status}`);
    }

    /**
     * 추가결제 가능한 주문번호 목록 조회
     * @param userId - String ( 유저(고객) 아이디 )
     */
    reserveFindBuyNo(userId) {
        return this.instance.get(`${this.base}/${userId}`);
    }

    /**
     * 예약 상품 추가 결제 등록
     * @param buy_no - String (구매번호)
     * @param data - Object (product_no, title, price)
     * @returns {*|{Content-Type}|axios.Promise}
     */
    reservePaymentOption(buy_no, data) {
        if (!data.product_no) {
            data.product_no = "";
        }
        return this.instance.post(`${this.base}/${buy_no}/options`, utils.query.stringify(data));
    }

    /**
     * 예약 상품 추가 결제 완료
     * @param buy_no - Number (구매번호)
     * @param option_no - Number (옵션번호)
     * @param data - Object (product_no, pay_uid)
     * @returns {*|axios.Promise}
     */
    reserveCompletePaymentOption(buy_no, option_no, data) {
        if (!data.product_no) {
            data.product_no = "";
        }
        return this.instance.put(`${this.base}/${buy_no}/options/${option_no}/payment`, utils.query.stringify(data));
    }

    /**
     * 견적서 예약하기 요청
     * @param data - Object (offer_no)
     * @return {*|{Content-Type}|axios.Promise}
     */
    reserveToEstimate(data) {
        return this.instance.post(`${this.base}-offer`, utils.query.stringify(data));
    }

    /**
     * 견적서 예약하기 완료
     * @param buy_no - String (주문번호)
     * @param data - Object (pay_uid - 필수, product_no - 선택)
     * @return {*|axios.Promise}
     */
    reserveToEstimateComplete(buy_no, data) {
        return this.instance.put(`${this.base}/${buy_no}/payment`, utils.query.stringify(data));
    }

    /**
     * 대화 추가결제 요청
     * @param data - Object (talk_no *대화번호, phone, email)
     * @return {*|{Content-Type}|axios.Promise}
     */
    reserveTalk(data) {
        return this.instance.post(`${this.base}-talk`, utils.query.stringify(data));
    }

    /**
     * 패키지 상품 예약 요청
     * @param data - Object (*date, *package_no, extra_no(n,..), custom_no(n,..), phone, email
     * @param options
     * @return {*|{Content-Type}|axios.Promise}
     */
    reserveToPackage(data, options) {
        return this.instance.post(`${this.base}-package`, utils.query.stringify(data), Object.assign({}, options));
    }

    /**
     * 작가 직접 사진전달 후 완료처리
     * @param buy_no
     * @param data
     * @return {*}
     */
    updatePassOrigin(buy_no, data) {
        return this.instance.put(`${this.base}/${buy_no}/req-complete`, utils.query.stringify(data));
    }

    /**
     * 예약날짜 변경 요청
     * @param buy_no - String
     * @param data - Object (reserve_dt)
     * @return {*|{Content-Type}}
     */
    modifyDate(buy_no, data) {
        return this.instance.post(`${this.base}/${buy_no}/reserve-dt`, utils.query.stringify(data));
    }

    /**
     * 촬영일 변경 승인
     * @param buy_no - String
     * @param date_alter_no - String
     * @return {*}
     */
    confirmModifyDate(buy_no, date_alter_no) {
        return this.instance.put(`${this.base}/${buy_no}/reserve-dt/${date_alter_no}`);
    }
}

export default Reservations;
