import MEWTIME_CONST from "../constant/mewtime.const";
import { REG_FORMAT_TOKEN, STRING_DAYS } from "../constant/format.const";
import { formatToken } from "../format/format";
import fillSpace from "../utils/fill-space";

const dayStamp = 1000 * 60 * 60 * 24;

class MewTime {
    constructor(date) {
        const FORMAT_BASE = "YYYY-MM-DD HH:mm:ss";

        if (date instanceof MewTime) {
            this._d = new Date(date._d);
            this._f = date._f;
            this._i = date._i;
        } else if ({}.toString.call(date) === "[object Object]") {
            this._d = new Date(`${date.year}-${fillSpace(date.month)}-${fillSpace(date.date)}`);
            this._f = FORMAT_BASE;
            this._i = date;
        } else {
            this._d = date ? new Date(this.strToTime(date)) : new Date();
            this._f = FORMAT_BASE;
            this._i = date;
        }
    }

    /**
     * 시간 표준에 따른 parse
     * @param date
     * @param format
     * @returns {number} - time stamp
     */
    strToTime(date, format = "YYYY-MM-DD HH:mm:ss") {
        let time = Date.parse(date);

        if (isNaN(time)) {
            const d = {};
            format.replace(REG_FORMAT_TOKEN, (f, i) => {
                const length = f.length;
                switch (f) {
                    case "YYYY": d.year = date.substr(i, length); break;
                    case "MM": d.month = date.substr(i, length); break;
                    case "DD": d.day = date.substr(i, length); break;
                    case "HH": d.hour = date.substr(i, length); break;
                    case "mm": d.minute = date.substr(i, length); break;
                    case "ss": d.second = date.substr(i, length); break;
                    default: return "";
                }

                return "";
            });

            time = Date.UTC(d.year, d.month - 1, d.day, d.hour - 9, d.minute, d.second);
        }

        return time;
    }
    /**
     * 시간을 다시 설정한다
     * @param date - String (YYYY-MM-DD HH:mm:ss)
     * @returns {MewTime}
     */
    setTime(date, format = "YYYY-MM-DD HH:mm:ss") {
        this._d.setTime(this.strToTime(date, format));
        return this;
    }

    /**
     * 시간을 밀리초로 가져오기
     */
    getTime() {
        return this._d.getTime();
    }

    /**
     * 현재 객체를 복사하여 새로운 인스턴스를 반환한다.
     * @returns {MewTime}
     */
    clone() {
        return new MewTime(this);
    }
    /**
     * 디폴트 포멧으로 값을 반환한다.
     * @returns {string}
     */
    toString() {
        return this.format("YYYY-MM-DD HH:mm:ss");
    }
    /**
     * 값을 반환한다.
     */
    valueOf() {
        return this._d.valueOf();
    }
    /**
     * 연도를 get/set 한다.
     * @param {string|number} y
     * @returns {number}
     */
    year(y) {
        if (typeof y === "number" || typeof y === "string") {
            this._d.setFullYear(y);
            return this;
        }
        return this._d.getFullYear();
    }
    /**
     * 월을 get/set 한다.
     * @param {string|number} m
     * @returns {number}
     */
    month(m) {
        if (typeof m === "number" || typeof m === "string") {
            this._d.setMonth(m);
            return this;
        }
        return this._d.getMonth();
    }
    /**
     * 날짜를 get/set 한다.
     * @param {string|number} d
     * @returns {number}
     */
    date(d) {
        if (typeof d === "number" || typeof d === "string") {
            this._d.setDate(d);
            return this;
        }
        return this._d.getDate();
    }
    /**
     * 요일을 가져온다.
     * @returns {number}
     */
    day(isStr = false) {
        if (isStr) {
            return STRING_DAYS[this._d.getDay()];
        }
        return this._d.getDay();
    }
    /**
     * 시간을 get/set 한다.
     * @param {string|number} h
     * @returns {number}
     */
    hours(h) {
        if (typeof h === "number" || typeof h === "string") {
            this._d.setHours(h);
            return this;
        }
        return this._d.getHours();
    }
    /**
     * 분을 get/set 한다.
     * @param {string|number} m
     * @returns {number}
     */
    minutes(m) {
        if (typeof m === "number" || typeof m === "string") {
            this._d.setMinutes(m);
            return this;
        }
        return this._d.getMinutes();
    }
    /**
     * 초를 get/set 한다.
     * @param {string|number} s
     * @returns {number}
     */
    seconds(s) {
        if (typeof s === "number" || typeof s === "string") {
            this._d.setSeconds(s);
            return this;
        }
        return this._d.getSeconds();
    }
    // week(){
    //     const clone = this.clone().endOf().date(this.date() + 4 - (this.day() || 7));
    //     return Math.ceil((((clone._d - new Date(this.year(), 0, 1)) / 8.64e7) + 1) / 7);
    // }
    /**
     * 현재 날짜를 포멧팅하여 반환한다.
     * @param {?string} out - format
     * @returns {string}
     */
    format(out) {
        return (typeof out === "string" ? out : this._f)
            .replace(REG_FORMAT_TOKEN, text => {
                return formatToken[text].apply(this);
            });
    }
    /**
     * 윤년인지 판단한다.
     * @returns {boolean}
     */
    isLeapYear() {
        const y = this.year();
        return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    }
    /**
     * 마지막 월의 마지막 날짜를 구한다.
     * @returns {number}
     */
    daysInMonth() {
        return new Date(this.year(), this.month() + 1, 0).getDate();
    }
    /**
     * 현재 날짜를 기준으로 이후의 날짜를 구한다.
     * @param {string|number} num
     * @param {string} [type = "D"]
     * @returns {MewTime}
     */
    add(num, type = MEWTIME_CONST.DATE) {
        if (!(typeof num === "number" || typeof num === "string")) {
            throw new TypeError("The param is invalid.");
        }

        switch (type) {
            case MEWTIME_CONST.YEAR: {
                this.year(this.year() + num);
                break;
            }
            case MEWTIME_CONST.MONTH: {
                const daysInMonth = this.clone().startOf(type).month(this.month() + 1).daysInMonth();
                if (daysInMonth < this.date()) {
                    this.date(daysInMonth);
                }

                this.month(this.month() + num);
                break;
            }
            case MEWTIME_CONST.DATE: {
                this.date(this.date() + num);
                break;
            }
            case MEWTIME_CONST.HOUR: {
                this.hours(this.hours() + num);
                break;
            }
            case MEWTIME_CONST.MINUTE: {
                this.minutes(this.minutes() + num);
                break;
            }
            case MEWTIME_CONST.SECOND: {
                this.seconds(this.seconds() + num);
                break;
            }
            default: break;
        }

        return this;
    }
    /**
     * 현재 날짜를 기준으로 이전의 날짜를 구한다.
     * @param {string|number} num
     * @param {string} [type = "D"]
     * @returns {MewTime}
     */
    subtract(num, type = MEWTIME_CONST.DATE) {
        if (!(typeof num === "number" || typeof num === "string")) {
            throw new TypeError("The param is invalid.");
        }

        switch (type) {
            case MEWTIME_CONST.YEAR: {
                this.year(this.year() - num);
                break;
            }
            case MEWTIME_CONST.MONTH: {
                const daysInMonth = this.clone().startOf(type).month(this.month() - 1).daysInMonth();
                if (daysInMonth < this.date()) {
                    this.date(daysInMonth);
                }

                this.month(this.month() - num);
                break;
            }
            case MEWTIME_CONST.DATE: {
                this.date(this.date() - num);
                break;
            }
            case MEWTIME_CONST.HOUR: {
                this.hours(this.hours() - num);
                break;
            }
            case MEWTIME_CONST.MINUTE: {
                this.minutes(this.minutes() - num);
                break;
            }
            case MEWTIME_CONST.SECOND: {
                this.seconds(this.seconds() - num);
                break;
            }
            default: break;
        }

        return this;
    }
    /**
     * 시작 날짜를 타입에 맞게 설정한다.
     * @param {string} [type = date]
     * @returns {MewTime}
     */
    startOf(type = MEWTIME_CONST.DATE) {
        if (typeof type !== "string") {
            throw new TypeError("The type is invalid.");
        }

        switch (type) {
            case MEWTIME_CONST.DATE: {
                this.hours(0).minutes(0).seconds(0);
                break;
            }
            case MEWTIME_CONST.WEEK: {
                const day = this.day();
                this.date(this.date() - day).hours(0).minutes(0).seconds(0);
                break;
            }
            case MEWTIME_CONST.MONTH: {
                this.date(1).hours(0).minutes(0).seconds(0);
                break;
            }
            case MEWTIME_CONST.YEAR: {
                this.month(0).date(1).hours(0).minutes(0).seconds(0);
                break;
            }
            default: break;
        }

        return this;
    }
    /**
     * 마지막 날짜를 타입에 맞게 설정한다.
     * @param {string} [type = date]
     * @returns {MewTime}
     */
    endOf(type = MEWTIME_CONST.DATE) {
        if (typeof type !== "string") {
            throw new TypeError("The type is invalid.");
        }

        switch (type) {
            case MEWTIME_CONST.DATE: {
                this.hours(23).minutes(59).seconds(59);
                break;
            }
            case MEWTIME_CONST.WEEK: {
                const day = 6 - this.day();
                this.date(this.date() + day).hours(23).minutes(59).seconds(59);
                break;
            }
            case MEWTIME_CONST.MONTH: {
                this.date(this.daysInMonth()).hours(23).minutes(59).seconds(59);
                break;
            }
            case MEWTIME_CONST.YEAR: {
                this.month(11).date(this.daysInMonth()).hours(23).minutes(59).seconds(59);
                break;
            }
            default: break;
        }

        return this;
    }
    /**
     * 입력받은 날짜와 같은지 판단한다.
     * @param {string|MewTime} input
     * @param {string|null} type
     * @returns {boolean}
     */
    isSame(input, type = null) {
        if (!input) {
            throw new Error("The input must be require.");
        }

        const i = input instanceof MewTime ? input : new MewTime(input);
        const value = i.valueOf();

        if (typeof type !== "string") {
            return this.valueOf() === value;
        }

        return this.clone().startOf(type).valueOf() <= value && value <= this.clone().endOf(type).valueOf();
    }
    /**
     * 입력받은 날짜보다 이전 날짜인지 판단한다.
     * @param {string|MewTime} input
     * @param {?string} type
     * @returns {boolean}
     */
    isBefore(input, type) {
        const i = input instanceof MewTime ? input : new MewTime(input);
        const value = i.valueOf();

        if (typeof type !== "string") {
            return this.valueOf() < value;
        }

        return this.clone().endOf(type).valueOf() < value;
    }
    /**
     * 입력받은 날짜보다 이후 날짜인지 판단한다.
     * @param {string|MewTime} input
     * @param {string|null} type
     * @returns {boolean}
     */
    isAfter(input, type = null) {
        const i = input instanceof MewTime ? input : new MewTime(input);
        const value = i.valueOf();

        if (typeof type !== "string") {
            return this.valueOf() > value;
        }

        return this.clone().startOf(type).valueOf() > value;
    }
    /**
     * 입력받은 날짜와 같은지 또는 입력받은 날짜보다 이전인지 판단한다.
     * @param {string|MewTime} input
     * @param {?string} type
     * @returns {boolean}
     */
    isSameOrBefore(input, type) {
        return this.isSame(input, type) || this.isBefore(input, type);
    }
    /**
     * 입력받은 날짜와 같은지 또는 입력받은 날짜보다 이후인지 판단한다.
     * @param {string|MewTime} input
     * @param {?string} type
     * @returns {boolean}
     */
    isSameOrAfter(input, type) {
        return this.isSame(input, type) || this.isAfter(input, type);
    }
    /**
     * 입력 받은 날짜 사이에 포함되는지 판단한다.
     * @param {string|MewTime} from - 시작날짜
     * @param {string|MewTime} to - 종료날짜
     * @param {?type} type
     * @param {?string} [inclusivity = "()"] - 포함 관계('()'는 제외하고, '[]'는 포함한다.)
     * @returns {boolean}
     */
    isBetween(from, to, type = MEWTIME_CONST.DATE, inclusivity = "()") {
        if (typeof inclusivity !== "string") {
            throw new TypeError("The inclusivity param is invalid.");
        }

        const compare = type || MEWTIME_CONST.DATE;
        const fromType = inclusivity[0];
        const toType = inclusivity[1];

        const fromBoolean = fromType === "(" ? this.isAfter(from, compare) : this.isSameOrAfter(from, compare);
        const toBoolean = toType === ")" ? this.isBefore(to, compare) : this.isSameOrBefore(to, compare);

        return fromBoolean && toBoolean;
    }

    /**
     * 기준일로 부터 입력받은 날짜까지 일 수를 계산한다
     * @param date
     */
    numberOfDays(date) {
        const b = this.isSameOrBefore(date, MEWTIME_CONST.DATE);
        const i = date instanceof MewTime ? date : new MewTime(date);
        const value = i.valueOf();
        const tValue = this.valueOf();

        return (tValue - value) / dayStamp;
    }
}

export default MewTime;
