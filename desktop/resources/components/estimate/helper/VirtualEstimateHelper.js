import * as estimateProp from "./const";
import estimateUtils from "./util";
import API from "forsnap-api";

export default class VirtualEstimateHelper {
    constructor(props) {
        this.category = props.category;
        this.instance = estimateProp[this.category];
        this.utils = this.combineUtils(estimateUtils, props.category);
    }

    combineUtils(utils, category) {
        return Object.assign({}, utils.BASE, utils[category]);
    }

    exchangeCategory(category) {
        this.category = category;
        this.instance = estimateProp[category];
        this.utils = this.combineUtils(estimateUtils, category);

        return this;
    }

    getStepProcess() {
        return this.instance.STEP_PROCESS;
    }

    getUtils() {
        return this.utils;
    }

    getVirtualInstance() {
        return this.instance;
    }

    getPriceInfo() {
        return this.instance.PRICE_INFO;
    }

    getTotalStep() {
        return this.instance.STEP_PROCESS.TOTAL_STEP;
    }
}
