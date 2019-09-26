import API from "forsnap-api";

class ProgressHelper {
    constructor(props) {
        this.buy_no = props.buy_no;
        this.product_no = props.product_no;
        this.type = props.type;
        this.file_count = 1;
        this.array_able_download = [];
        this.download_url = "";
    }

    /**
     * 주문번호를 가져온다.
     * @returns {string|*|number|buy_no|{$set}}
     */
    getBuyNo() {
        return this.buy_no;
    }

    /**
     * 상품번호를 가져온다.
     * @returns {String|*}
     */
    getProductNo() {
        return this.product_no;
    }

    /**
     * 예약 타입을 가져온다. (origin || custom)
     * @returns {String|*}
     */
    getType() {
        return this.type;
    }

    /**
     * 다운로드 가능 갯수를 저장한다.
     * @param count
     */
    setDownFileCount(count) {
        this.file_count = count;
    }

    /**
     * 다운로드 가능 갯수를 가져온다.
     * @returns {number|*}
     */
    getDownFileCount() {
        return this.file_count;
    }

    /**
     * 다운로드 가능 여부 배열을 저장한다.
     * - 초기값 false
     * @param array
     */
    setArrAbleDownload(array) {
        this.array_able_download = array;
    }

    /**
     * 다운로드 가능 여부 배열을 가져온다.
     * @returns {Array|*}
     */
    getArrAbleDownload() {
        return this.array_able_download;
    }

    /**
     * 다운로드 url 을 저장한다.
     * @param url
     */
    setDownloadUrl(url) {
        this.download_url = url;
    }

    /**
     * 다운로드 url 을 가져온다.
     * @returns {string|*}
     */
    getDownloadUrl() {
        return this.download_url;
    }

    /**
     * 분할다운로드
     */
    getDownloadPhotos(idx, reserve_type) {
        const { buy_no, product_no, type } = this;
        return API.reservations.getDownloadKey(buy_no, product_no, reserve_type, idx)
            .then(response => {
                const downLoadKey = response.data.download_key;
                const encodeDownLoadKey = encodeURIComponent(downLoadKey);
                const url = `${__SERVER__.api}/reservations/${buy_no}/photos/download/${encodeDownLoadKey}/${idx}`;
                this.setDownloadUrl(url);

                return response;
            }, error => Promise.reject(error)
        );
    }

    /**
     * 사진보정을 요청한다.
     * @param numbers
     * @returns {PromiseLike<string> | Promise<string> | *}
     */
    fetchCustomPhotos(numbers) {
        const { buy_no, product_no } = this;
        return API.reservations.reservePhotosSelect(buy_no, product_no, numbers)
            .then(response => {
                return Promise.resolve("사진보정 요청이 완료되었습니다.");
            }, error => Promise.reject(error)
        );
    }

    /**
     * 구매완료를 요청한다.
     * @returns {PromiseLike<{custom_count: (*|number|string|custom_cnt|{$set})}> | Promise<{custom_count: (*|number|string|custom_cnt|{$set})}> | *}
     */
    fetchComplete() {
        const { buy_no, product_no } = this;
        return API.reservations.photoBuyComplete(buy_no, { product_no })
            .then(response => {
                const custom_count = response.data.custom_cnt;
                return { custom_count };
            }, error => Promise.reject(error)
        );
    }

    /**
     * 전체다운로드 버튼 클릭
     */
    getAllPhotosDownload(reserve_type = "origin") {
        const { buy_no, product_no } = this;
        return API.reservations.getDownloadKey(buy_no, product_no, reserve_type)
            .then(response => {
                const data = response.data;
                this.setDownFileCount(data.file_count);
                const set_arr = new Array(data.file_count);
                for (let i = 0; i < data.file_count; i += 1) {
                    set_arr[i] = false;
                }
                this.setArrAbleDownload(set_arr);
                return data;
            }, error => Promise.reject(error)
        );
    }
}

export default ProgressHelper;
