class ConsultLogin {
    /**
     * 소셜 데이터를 저장한다.
     * @param data
     */
    setCloneData(data) {
        this.clone_data = data;
    }

    /**
     * 소셜 데이터를 반환한다.
     * @returns {*}
     */
    getCloneData() {
        return this.clone_data;
    }

    /**
     * 로그인 성공
     * @abstract
     */
    success(data) {}

    /**
     * 로그인 실패
     * @abstract
     */
    fail() {}

    /**
     * api 서버에서 로그인을 요청한다.
     * @param data clone data
     * @abstract
     */
    getLogin(data) {}

    /**
     * 로그인
     * @param type
     * @abstract
     */
    login(type) {}

    /**
     * 로그아웃
     * @abstract
     */
    logout() {}

    createCSRFToken() {}
}

export default ConsultLogin;
