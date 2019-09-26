import cookie from "forsnap-cookie";
import mewtime from "forsnap-mewtime";

export default class ChargeCount {
    constructor() {
        this.count = 0;
        this.expiresDate = "";
        this.currentDate = mewtime().toString();
        // Charge Request Count
        this.KEY = "_crc";
        this.EXPIRE_KEY = "_crc_expire";
        this.MAX_COUNT = 3;
    }

    /**
     * 유료상담 카운트를 초기화합니다.
     */
    init() {
        this.checkExpireDate();
        const chargeRequestCount = cookie.getCookies(this.KEY);
        const expiresDate = this.getCRCExpires();

        if (chargeRequestCount && chargeRequestCount > 0) {
            this.count = chargeRequestCount;
        }

        this.expiresDate = expiresDate;
    }

    /**
     * 만료시간을 체크해서 만료시간이 지났으면 쿠키를 제거합니다.
     */
    checkExpireDate() {
        const expiresDate = this.getCRCExpires();
        const currentDate = this.currentDate;

        if (mewtime(currentDate).isAfter(mewtime(expiresDate))) {
            this.delCRC();
        }
    }

    /**
     * 유료작가 상담신청 갯수를 가져옵니다.
     * @returns {*|Object|string}
     */
    getCRC() {
        return this.count;
    }

    /**
     * 유료작가 상담신청 갯수를 저장한다.
     */
    setCRC() {
        const chargeRequestCount = this.count;
        const expiresDate = this.expiresDate;
        const currentDate = this.currentDate;

        if (!expiresDate) {
            cookie.setCookie({ [this.EXPIRE_KEY]: mewtime(this.setDate()).toString() }, this.setDate());
        // } else {
            // currentDate = mewtime(this.expiresDate).toString();
            // cookie.setCookie({ [this.EXPIRE_KEY]: currentDate });
        }

        if (chargeRequestCount < this.MAX_COUNT) {
            this.count = Number(chargeRequestCount) + 1;
            cookie.setCookie({ [this.KEY]: this.count }, this.setDate());
        }
    }

    /**
     * 최대 상담신청 갯수를 가져옵니다
     * @returns {number}
     */
    getMaxCount() {
        return this.MAX_COUNT;
    }

    /**
     * 만료시간을 계산해서 넘겨줍니다.
     * @returns {string}
     */
    setDate() {
        const d = new Date();

        // d.setMinutes(d.getMinutes() + 5);
        d.setDate(d.getDate() + 7);

        return d.toUTCString();
    }

    /**
     * 유료작가 상담신청 갯수와 만료시간을 제거한다.
     */
    delCRC() {
        cookie.removeCookie(this.KEY, this.EXPIRE_KEY);
    }

    /**
     * 만료시간을 가져옵니다.
     * @returns {*|Object|string}
     */
    getCRCExpires() {
        return cookie.getCookies(this.EXPIRE_KEY);
    }
}
