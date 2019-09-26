const image = {
    resize(vw, vh, dw, dh, point) {
        let cAspect = 0;
        let iAspect = 0;
        const result = {};

        if (!dw) {
            dw = 1;
        }

        if (!dh) {
            dh = 1;
        }

        result.width = dw;
        result.height = dh;

        if (point) {
            cAspect = dh / dw;
            iAspect = vh / vw;
        } else {
            cAspect = dw / dh;
            iAspect = vw / vh;
        }

        if (iAspect === cAspect) {
            if (point) {
                result.width = dw;
                result.height = dw;
            } else {
                result.width = dh;
                result.height = dh;
            }
        } else if (point) {
            const h = (vh / vw) * dw;
            result.height = Math.round(h);
            result.float = h;
        } else {
            const w = (vw / vh) * dh;
            result.width = Math.round(w);
            result.float = w;
        }

        return result;
    },
    /**
     * 이미지 주소 만들기
     * @param width
     * @param height
     * @param type - String (origin, resize, thumb)
     * @param format
     * @param quality
     * @param channel - String (private, public = default)
     * @return {string}
     */
    make({ width, height, type, format, quality, channel }) {
        let result = `http://beta-forsnap.com:57900/${type || "resize"}-${width}x${height}`;

        if (format) {
            result += `-${format}${quality ? `-${quality}` : ""}`;
        }

        return `${result}/${channel || "public"}`;
    },
    /**
     *
     * @param host
     * @param type1 - String (signed, normal)
     * @param type2 - String (crop, resize)
     * @param width - String
     * @param height - String
     * @param src - String 'path or key'
     */
    make2({ host, type1, type2, width, height, src }) {
        if (src) {
            return `${host}/${type1}/${type2}/${width}x${height}${src.indexOf("/") === 0 ? src : `/${src}`}`;
        }

        return "";
    }
};

export default image;
