import EstimateListHelper from "./EstimateLIstHelper";
import API from "forsnap-api";

class EstimateListHelperProgress extends EstimateListHelper {
    constructor(user_id) {
        super();
        this.user_id = user_id;
    }
    getEstimateList() {
        return API.orders.getMyEstimateList(this.user_id, { offset: this.offset, limit: this.LIMIT })
            .then(
                response => {
                    const data = response.data;
                    this.setList(data.list);
                    this.setTotalCount(data.total_cnt);
                    this.setMaxPage(Math.ceil(data.total_cnt / this.LIMIT));

                    return response;
                }, error => Promise.reject(error)
            );
    }
}

export default EstimateListHelperProgress;
