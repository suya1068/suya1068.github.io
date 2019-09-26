import type from "./type";
import utils from "../utils";

const format = {
    /**
     * 3자리마다 ,와 결합한다.
     * @param {string|number} num
     * @returns {string}
     */
    price(num) {
        if (!type.isString(num) && !type.isInteger(num)) {
            throw new TypeError("The param is invalid.");
        }

        const reg = /(^[+-]?\d+)(\d{3})/;
        let price = `${num}`;

        while (reg.test(price)) {
            price = price.replace(reg, "$1,$2");
        }
        return price;
    },
    /**
     * 숫자가 아닌 문제 제거
     * @param num
     * @return {string or integer}
     */
    priceParse(num) {
        if (!type.isString(num) && !type.isInteger(num)) {
            throw new TypeError("The param is invalid.");
        }

        return num.replace(/[,\D]+/g, "");
    },
    /**
     * 상품 주문번호의 포맷을 변경한다.
     * @param {string|number}buyNo
     * @returns {string}
     */
    formatByNo(buyNo = "") {
        const year = buyNo.substr(0, 4);
        const month = buyNo.substr(4, 2);
        const day = buyNo.substr(6, 2);
        const no = buyNo.substring(8, buyNo.length);

        return `${year}-${month}-${day}-${no}`;
    },
    /**
     * 상품 주문번호의 포맷을 변경한다.
     * @param {string|number}buyNo
     * @returns {string}
     */
    formatByNo2(buyNo = "") {
        const date = buyNo.substr(0, 8);
        const no = buyNo.substring(8, buyNo.length);

        return `${date}-${no}`;
    },
    /**
     * 촬영옵션 내용을 변경한다.
     * @param {string} option
     * @returns {string}
     */
    convertOptionName(option) {
        let optionText = "";
        switch (option) {
            case "ORIGIN":
                optionText = "원본데이터형";
                break;
            case "CUSTOM":
                optionText = "보정데이터형";
                break;
            case "PRINT":
                optionText = "인화형";
                break;
            default:
        }
        return optionText;
    },
    /**
     * 상세보기 폰 번호 출력 양식을 변경한다.
     * @param phone
     * @returns {string}
     */
    convertPhoneNumber(phone) {
        const start = phone.substr(0, 3);
        const body = phone.substr(3, 2);
        // const end = phone.substr(7, phone.length);

        return `${start} ${body}** ****`;
    },
    /**
     * 촬영날짜의 출력 양식을 변경하낟.
     * @param reserveDate
     * @returns {string}
     */
    convertReserveDate(reserveDate) {
        const convert = reserveDate.split("-");
        return `${convert[0]}년 ${convert[1]}월 ${convert[2]}일`;
    },

    /**
     * 1000 이상의 숫자를 변경한다. (1000 -> 1.0k)
     * @param number {number} - 변경할 숫자
     * @param digits {number} - 자릿수
     * @returns {string}
     */
    metric_suffix(number, digits) {
        if (number < 0) return 0;
        if (number < 1e3) return number;

        let conver_number = number;

        if (!digits) digits = 2;

        const exp = Math.floor(Math.log(conver_number) / Math.log(1e3));
        conver_number = number / (1e3 ** exp);
        // conver_number = number / Math.pow(1e3, exp);

        const exp2 = Math.ceil(Math.log(conver_number) / Math.log(1e1));
        if (digits < exp2) digits = exp2;

        return +conver_number.toPrecision(digits) + "kMGTPE".charAt(exp - 1);
    },

    /**
     * 카테고리 코드를 카테고리 명을 변경한다.
     * @param category {string} - 카테고리 코드
     * @returns {string}
     */
    categoryCodeToName(category) {
        if (typeof category !== "string") {
            throw new Error("category type is not string");
        }

        let upperCaseCategory = "";

        if (category) {
            upperCaseCategory = category.toUpperCase();
        }
        switch (upperCaseCategory) {
            // 개인 카테고리
            case "WEDDING": return "웨딩";
            case "PROFILE": return "프로필";
            case "SNAP": return "스냅사진";
            case "BABY": return "베이비";
            case "VIDEO": return "개인영상";
            case "MODEL": return "모델";
            case "DRESS_RENT": return "의상대여";
            // 기업 카테고리
            case "INTERIOR": return "인테리어";
            case "BEAUTY": return "코스메틱";
            case "FOOD": return "음식";
            case "PRODUCT": return "제품";
            case "EVENT": return "행사";
            case "PROFILE_BIZ": return "기업프로필";
            case "FASHION": return "패션";
            case "VIDEO_BIZ": return "기업영상";
            // 사용 안하는 카테고리
            case "AD": return "광고";
            default: return upperCaseCategory;
        }
    },

    exchangeTime(second) {
        // if (typeof second !== "string" || typeof second !== "number") {
        //     throw new Error("category type is not string or number");
        // }

        let cs = `0:${utils.fillSpace(second, 2, "0")}`;

        if (second - 60 > 0) {
            const min = parseInt(second / 60, 10);
            const sec = second - (min * 60);

            cs = `${min}:${utils.fillSpace(sec, 2, "0")}`;
        }

        return cs;
    }
};

export default format;
