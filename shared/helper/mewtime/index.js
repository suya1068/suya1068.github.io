import MewTime from "./mewtime/mewtime";
import MEWTIME_CONST from "./constant/mewtime.const";
import { STRING_DAYS } from "./constant/format.const";

const VERSION = "0.0.1";

function mewtime(date) {
    return new MewTime(date);
}

mewtime.version = VERSION;
mewtime.const = MEWTIME_CONST;
mewtime.days = STRING_DAYS;

mewtime.isMewTime = instance => {
    return instance instanceof MewTime;
};

/**
 * YYYYMMDD 형식을 YYYY-MM-DD형식으로 변환
 * @param str
 */
mewtime.strToDate = str => {
    return `${str.substr(0, 4)}-${str.substr(4, 2)}-${str.substr(6, 2)}`;
};

mewtime.strToStr = str => {
    return `${str.substr(0, 4)}년${str.substr(4, 2)}월${str.substr(6, 2)}일`;
};

mewtime.strToDateTime = str => {
    return `${str.substr(0, 4)}-${str.substr(4, 2)}-${str.substr(6, 2)} ${str.substr(8, 2)}:${str.substr(10)}`;
};

/**
 * 32개의 십육진수(8-4-4-4-12)로 이루어진 유니크한 키를 반환한다.
 * @returns {string}
 */
mewtime.uuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, match => {
        const r = Math.random() * 16 | 0;
        const v = match === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export default mewtime;
