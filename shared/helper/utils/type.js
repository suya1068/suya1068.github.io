const toString = {}.toString;

const type = {
    /**
     * Object 타입인지 판단한다.
     * @name type.isObject
     * @param {*} value
     * @returns {boolean}
     */
    isObject(value) {
        return toString.call(value) === "[object Object]";
    },
    /**
     * Array 타입인지 판단한다.
     * @name type.isArray
     * @param {*} value
     * @returns {boolean}
     */
    isArray(value) {
        return Array.isArray(value);
    },
    /**
     * String 타입인지 판단한다.
     * @name type.isString
     * @param value
     * @returns {boolean}
     */
    isString(value) {
        return typeof value === "string";
    },
    /**
     * 정수 인지 판단한다.
     * @param value
     * @returns {string}
     */
    isInteger(value) {
        return typeof Number.isInteger(value);
    },
    /**
     * Date 타입인지 판단한다.
     * @name type.isDate
     * @param {*} value
     * @returns {boolean}
     */
    isDate(value) {
        return value instanceof Date;
    },
    isEmpty(value) {
        let flag = false;
        if (value === "" ||
            value == null ||
            value === undefined ||
            (value !== null && typeof value === "object" && !Object.keys(value).length)
        ) {
            flag = true;
        }

        return flag;
    }
};

export default type;
