class Status {
    constructor(instance) {
        this.base = "/status";
        this.instance = instance;
    }

    /**
     * 소개페이지 카운트를 조회한다.
     * @returns {*}
     */
    getIntroduce() {
        return this.instance.get(`${this.base}/introduce`);
    }
}

export default Status;
