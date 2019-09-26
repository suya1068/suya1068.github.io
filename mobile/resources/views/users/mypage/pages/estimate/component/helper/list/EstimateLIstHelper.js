class EstimateLIstHelper {
    constructor() {
        this.tab = "progress";
        this.LIMIT = 6;
        this.offset = 0;
    }

    /**
     * 요청리스트를 구성할 탭명을 저장한다.
     * @param tab
     */
    setPageTab(tab) {
        this.tab = tab;
    }

    /**
     * 요청리스트를 구성할 탭명을 가져온다.
     * @returns {string|*}
     */
    getPageTab() {
        return this.tab;
    }

    /**
     * 리스트의 페이지를 저장한다.
     * @param page
     */
    setPage(page) {
        this.page = page;
    }

    /**
     * 리스트의 페이지를 가져온다.
     * @returns {*}
     */
    getPage() {
        return this.page;
    }

    /**
     * offset 을 저장한다.
     * @param offset
     */
    setOffset(offset) {
        this.offset = offset;
    }

    /**
     * offset 을 가져온다.
     * @returns {*}
     */
    getOffset() {
        return this.offset;
    }

    /**
     * 리스트를 저장한다.
     * @param list
     */
    setList(list) {
        this.list = list;
    }

    /**
     * 리스트를 가져온다.
     * @returns {*}
     */
    getList() {
        return this.list;
    }

    /**
     * 전체 리스트의 갯수를 저장한다.
     * @param count
     */
    setTotalCount(count) {
        this.total_count = count;
    }

    /**
     * 전체 리스트의 갯수를 가져온다.
     * @returns {*}
     */
    getTotalCount() {
        return this.total_count;
    }

    /**
     * 최대 페이지 수를 저장한다.
     * @param max_page
     */
    setMaxPage(max_page) {
        this.max_page = max_page;
    }

    /**
     * 최대 페이지 수를 가져온다.
     * @returns {*}
     */
    getMaxPage() {
        return this.max_page;
    }

    /**
     * API 서버에서 촬영요청리스트를 가져온다.
     * @abstract
     */
    getEstimateList(user_id = null) {}
}

export default EstimateLIstHelper;
