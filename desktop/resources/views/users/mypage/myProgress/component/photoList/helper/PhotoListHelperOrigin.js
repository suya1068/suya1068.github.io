import PhotoListHelper from "./PhotoListHelper";
import API from "forsnap-api";

/**
 * - buy_no: 구매번호
 * - product_no: 상품번호
 * - user_type: U
 * - offset: 오프셋
 * - limit: 리밋
 */
export default class PhotoListOrigin extends PhotoListHelper {
    constructor() {
        super();
        this.fix_offset = 0;
        this.fix_limit = 50;
        this.isMore = this.getIsMore();
    }

    getPhotoList(buy_no, product_no, user_type) {
        return API.reservations.reservePhotosOrigin(buy_no, product_no, user_type, this.fix_offset, this.getVarLimit())
            .then(response => {
                const data = response.data;
                this.setList(data.list);
                this.setIsMore(!(data.list.length < this.getVarLimit()));
                return data;
            }, error => Promise.reject(error)
        );
    }

    getMorePhotoList(buy_no, product_no, user_type) {
        return API.reservations.reservePhotosOrigin(buy_no, product_no, user_type, this.getVarOffset(), this.fix_limit)
            .then(response => {
                const data = response.data;
                this.setCounts({
                    origin_count: data.origin_count,
                    custom_count: data.custom_count
                });
                this.setVarLimit(this.getVarLimit() + data.list.length);
                this.setVarOffset(this.getVarOffset() + data.list.length);
                this.setList(this.getList().concat(data.list));
                this.setIsMore(!(data.list.length < this.fix_limit));
                return data;
            }, error => Promise.reject(error)
        );
    }
}
