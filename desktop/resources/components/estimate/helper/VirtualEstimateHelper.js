import * as estimateProp from "./const";
import * as estimateUtils from "./util";
import API from "forsnap-api";

export default class VirtualEstimateHelper {
    constructor(props) {
        this.category = props.category;
        this.instance = estimateProp[this.category];
        this.utils = estimateUtils[this.category];
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
