import type from "./type";

const SEARCH_REG = /\s+/;
const HASH_REG = /(#|,)/g;
const INVALID_HASH_TAG = ["사진", "작가", "스냅"];

const search = {
    parse(data) {
        if (!type.isString(data)) {
            return data;
        }

        return data.replace(HASH_REG, " ").split(SEARCH_REG).reduce((result, word) => {
            if (word) {
                result.push(word);
            }
            return result;
        }, []);
    },

    stringify(data, char = "#") {
        if (type.isString(data)) {
            return this.parse(data).reduce((result, tag) => {
                result = `${result}${char}${tag} `;
                return result;
            }, "").trim();
        } else if (type.isArray(data)) {
            return data.reduce((result, tag) => {
                result = `${result}${char}${tag} `;
                return result;
            }, "").trim();
        }

        return data;
    },

    params(data) {
        if (type.isString(data)) {
            return this.parse(data).join(",");
        } else if (type.isArray(data)) {
            return data.join(",");
        }

        return data;
    },

    isValid(data) {
        const check = list => {
            const result = {
                valid: true,
                invalidTags: []
            };

            INVALID_HASH_TAG.forEach(tag => {
                if (list.includes(tag)) {
                    result.valid = false;
                    result.invalidTags.push(tag);
                }
            });

            return result;
        };

        if (type.isString(data)) {
            const tags = this.parse(data);
            return check(tags);
        }

        return check(data);
    }
};

export default search;
