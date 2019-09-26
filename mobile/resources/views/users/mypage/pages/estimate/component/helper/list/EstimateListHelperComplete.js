import EstimateListHelper from "./EstimateLIstHelper";
import API from "forsnap-api";

class EstimateListHelperComplete extends EstimateListHelper {
    getEstimateList() {
        return API.orders.getCompleteOrders({ offset: this.offset, limit: this.LIMIT })
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

    getCompleteMsg() {
        return "다른 고객의 촬영요청 중 매칭완료되어 촬영이 진행된 건입니다.";
    }
}

export default EstimateListHelperComplete;
