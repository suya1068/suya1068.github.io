const IS_HISTORY = !!window.history.pushState;

export default {
    /**
     * history.pushState
     * @param url
     * @param data
     */
    push(url, data = null) {
        if (IS_HISTORY) {
            history.pushState(data, null, url);
        }
    },

    /**
     * history.replaceState
     * @param url
     * @param data
     */
    replace(url, data = null) {
        if (IS_HISTORY) {
            history.replaceState(data, null, url);
        }
    }
};
