// TODO: 추후 쿠키 공유 및 보안 체크 필요

export default {
    /**
     * 쿠기정보를 설정한다.
     * @param {object} data
     * @param {object} expiresDate
     */
    setCookie(data, expiresDate) {
        let expires = expiresDate;

        if (!expiresDate) {
            const d = new Date();
            d.setDate(d.getDate() + 59);
            expires = d.toUTCString();
        }

        let options = `expires=${expires}; path=/; domain=${__WEB__};`; // http=true;
        if (__STATUS__ === "live") {
            options = `${options} secure=true;`;
        }

        Object.entries(data).forEach(([key, value]) => {
            document.cookie = `${key}=${encodeURIComponent(value)}; ${options}`;
        });
    },

    /**
     * 모든 쿠키를 가져온다.
     * @param {string} [name = ""]
     * @returns {object|string|null}
     */
    getCookies(name = "") {
        const decodedCookie = document.cookie;
        const cookie = decodedCookie.split(";");
        const map = {};

        for (let i = 0, leng = cookie.length; i < leng; i += 1) {
            const data = cookie[i].trim();
            const idx = data.indexOf("=");
            const key = data.substring(0, idx);

            map[key] = decodeURIComponent(data.substring(idx + 1).trim());
        }

        return name ? (map[name] || null) : map;
    },

    /**
     * 쿠기정보를 제거한다.
     * @param {...string} params
     */
    removeCookie(...params) {
        params.forEach(name => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${__WEB__};`;
        });
    }
};
