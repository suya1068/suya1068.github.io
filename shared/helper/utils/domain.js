const CONST = {
    DOMAIN_PATTERN: "(" +
        "(" +
            "((http|https):\\/\\/)?" +
            "[\\wㄱ-힣.-]+" +
            "(kr|co.kr|com|net|ly|at)(:[\\d]+)?" +
            "(\\/\\S*)?" +
        ")|" +
        "(http|https)|" +
        "(" +
            "((http|https):\\/\\/)?" +
            "(1|2)?\\d?\\d([.](1|2)?\\d?\\d){3}" +
            "(:[\\d]+)?" +
            "(\\/\\S*)?" +
        ")" +
    ")"
};

export default {
    /**
     * 유효한 도메인인지 판단한다.
     * @param {string} domain
     * @returns {boolean}
     */
    isValid(domain) {
        if (typeof domain !== "string") {
            return false;
        }

        const pattern = new RegExp(CONST.DOMAIN_PATTERN, "gi");
        return pattern.test(domain);
    },

    /**
     * 텍스트에서 유효한 도메인을 검색한다.
     * @param {string} text
     * @returns {*|Array|{index: number, input: string}|boolean}
     */
    match(text) {
        if (typeof text !== "string") {
            return [];
        }

        const pattern = new RegExp(CONST.DOMAIN_PATTERN, "gi");
        return text.match(pattern) || [];
    },

    /**
     * 입력받은 텍스트에 유효한 도메인이 있는지 판단한다.
     * @param {string} text
     * @param {?function} callback
     * @returns {*}
     */
    includes(text, callback) {
        if (typeof text !== "string") {
            return [];
        }

        const pattern = new RegExp(CONST.DOMAIN_PATTERN, "gi");
        const list = text.match(pattern) || [];

        if (list.length === 0) {
            return false;
        }

        if (typeof callback === "function") {
            return list.some(domain => callback(domain));
        }

        return true;
    },

    /**
     * 입력받은 텍스트에 포스냅 도메인을 제외한 유효한 도메인이 있는지 판단한다.
     * @param {string} text
     * @returns {*}
     */
    includesExceptForsnap(text) {
        if (typeof text !== "string") {
            return [];
        }

        const pattern = new RegExp(CONST.DOMAIN_PATTERN, "gi");
        const list = text.match(pattern) || [];

        if (list.length === 0) {
            return false;
        }

        return list.some(domain => !/https:\/\/(m.)?forsnap.com(\/\S*)?/g.test(domain));
    }
};
