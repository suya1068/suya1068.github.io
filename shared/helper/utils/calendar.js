import { fillSpace } from "./base";
import type from "./type";


const calendar = {
    /**
     * 윤년인지 판단한다.
     * @param {number} year
     * @returns {boolean}
     */
    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    },
    /**
     * 월별 마지막 일수를 가져온다.
     * @param {number} year
     * @param {number} month
     * @returns {number}
     */
    getLastDays(year, month) {
        if (typeof year !== "number" || typeof month !== "number") {
            throw new TypeError("The params must be number type.");
        }
        return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
    },
    /**
     * 날짜 데이터를 오브젝트로 파싱한다.
     * @param {string|date|object} date
     * @returns {{year: number, month: number, days: number}}
     */
    parseDate(date) {
        let year;
        let month;
        let days;

        if (type.isDate(date)) {
            year = date.getFullYear();
            month = date.getMonth() + 1;
            days = date.getDate();
        } else if (type.isString(date)) {
            const str = date.replace(/\/-:/g, "");
            year = str.substring(0, 4);
            month = str.substring(4, 6);
            days = str.substring(6, 8);
        } else if (type.isObject(date)) {
            year = date.year;
            month = date.month;
            days = date.days;
        } else {
            throw new Error("The date param is invalid.");
        }

        return { year, month, days, value: [year, fillSpace(month), fillSpace(days)].join("-") };
    },
    /**
     * 날짜 정보를 가져온다.
     * @param {date|string|object} date
     * @returns {{value: string, year: number, month: number, days: number, lastDays: (*|number), dayOfWeek: number, startDayOfWeek: number, rows: number}}
     */
    getDate(date = new Date()) {
        let d = date;

        if (type.isObject(date) || type.isString(date)) {
            const parse = this.parseDate(date);
            d = new Date(parse.year, parse.month - 1, parse.days);
        }

        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const days = d.getDate();
        const lastDays = calendar.getLastDays(year, month);
        const dayOfWeek = d.getDay();

        d.setDate(1);
        const startDayOfWeek = d.getDay();
        const rows = Math.ceil((startDayOfWeek + lastDays) / 7);

        return { value: [year, fillSpace(month), fillSpace(days)].join("-"), year, month, days, lastDays, dayOfWeek, startDayOfWeek, rows };
    }
};

export default calendar;
