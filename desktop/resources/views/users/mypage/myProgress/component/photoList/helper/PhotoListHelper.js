export default class PhotoListHelper {
    constructor() {
        this.var_offset = 0;
        this.var_limit = 0;
        this.list = [];
    }
    /**
     * 사진 불러오기 가능상태를 저장한다.
     * @param isMore
     */
    setIsMore(isMore) {
        this.isMore = isMore;
    }
    /**
     * 사진 불러오기 가능상태를 불러온다.
     * @returns {*}
     */
    getIsMore() {
        return this.isMore;
    }
    /**
     * 사진 리스트를 가져온다.
     * @returns {*}
     */
    getList() {
        return this.list;
    }
    /**
     * 사진리스트를 저장한다.
     * @param list
     */
    setList(list) {
        this.list = list;
    }
    /**
     * 리스트의 offset 값을 설정한다.
     * @param offset
     */
    setVarOffset(offset) {
        this.var_offset = offset;
    }

    /**
     * 리스트의 offset 값을 불러온다.
     * @returns {*}
     */
    getVarOffset() {
        return this.var_offset;
    }
    /**
     * 리스트의 limit 값을 설정팅한다.
     * @param limit
     */
    setVarLimit(limit) {
        this.var_limit = limit;
    }
    /**
     * 리스트의 limit 값을 불러온다.
     * @returns {*}
     */
    getVarLimit() {
        return this.var_limit;
    }
    setCounts(counts) {
        this.counts = counts;
    }
    getCounts() {
        return this.counts;
    }
    /**
     * API 서버에서 사진목록을 불러온다.
     * @param buy_no
     * @param product_no
     * @param user_type
     * @abstract
     */
    getPhotoList(buy_no, product_no, user_type) {}

    /**
     * 사진 목록을 더 불러온다.
     * @param buy_no
     * @param product_no
     * @param user_type
     * @abstract
     */
    getMorePhotoList(buy_no, product_no, user_type) {}
}

/**
 * api 목록
 * 1. 원본사진 목록보기(get) - /reservation/{buy_no}/photos
 * 2. 보정사진 목록보기(get) - /reservation/${buy_no}/custom-photos
 * 3. 보정사진 선택(post) - /reservation/${buy_no}/custom-photos
 */
