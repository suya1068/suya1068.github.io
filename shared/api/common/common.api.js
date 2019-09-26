class Common {
    constructor(instance) {
        this.base = "/";
        this.instance = instance;
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
}

export default Common;
