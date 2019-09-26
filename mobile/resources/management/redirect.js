import utils from "shared/helper/utils";

//const DOMAIN = __DOMAIN__;
const DOMAIN = "";

function move(url, replace = false) {
    if (replace) {
        location.replace(url);
    } else {
        location.href = url;
    }
}

export default {
    back() {
        const h = history || window.history;
        // h.back();
        if (h && h.back) {
            h.back();
        } else {
            window.close();
        }
        // if (h && !h.back()) {
        //     console.log("entry");
        //     window.close();
        // }
    },
    /**
     * 메인 페이지로 이동한다.
     * @param {?(object|string)} [param = ""]
     * @param {boolean} [replace = false]
     */
    main(param = "", replace = false) {
        const url = param ? `${utils.query.stringify(param)}` : "/";
        move(url, replace);
    },

    /**
     * 로그인 페이지로 이동한다.
     * @param {?(object|string)} [param = ""]
     * @param {boolean} [replace = false]
     */
    login(param = "", replace = false) {
        const base = `${DOMAIN}/login`;
        const url = param ? `${base}?${utils.query.stringify(param)}` : base;
        move(url, replace);
    },

    /**
     * 검색한 태그로 상품페이지로 이동한다.
     * @param {string} [param = ""]
     * @param {boolean} [replace = false]
     */
    productList(param = "", replace) {
        const url = `${DOMAIN}/products`;
        move(`${url}?${param}`, replace);
    },

    /**
     * 상태에 따라 유저 진행 현황 페이지로 이동한다.
     * @param {string} type
     * @param {boolean} replace
     */
    myProgressType(type, replace = false) {
        const base = `${DOMAIN}/users/progress`;
        const url = type ? `${base}/${type.toLowerCase()}` : base;
        move(url, replace);
    },

    /**
     * 상태에 따라 아티스트 진행 현황 페이지로 이동한다.
     * @param {string} type
     * @param {boolean} replace
     */
    photographerProgressType(type, replace = false) {
        const base = `${DOMAIN}/artists/photograph/process`;
        const url = type ? `${base}/${type.toLowerCase()}` : base;
        move(url, replace);
    },

    /**
     * 작가 페이지로 이동한다. (PC)
     * @param target
     */
    redirectArtistPage(target = window) {
        const url = `http://${__WEB__}/artists`;
        target.location.href = url;
    },

    /**
     * 포스냅 소개 페이지로 이동한다. (PC)
     * @param target
     */
    about(target = window) {
        const url = `http://${__WEB__}/information/introduction`;
        target.location.href = url;
    },

    /**
     * 에러 페이지로 이동한다.
     */
    error() {
        location.href = `${DOMAIN}/50x.html`;
    },

    /**
     * 40X 에러 페이지로 이동한다.
     */
    error40x() {
        location.href = `${DOMAIN}/40x.html`;
    },

    /**
     * 해당 채팅방으로 이동한다.
     * @param params - user_id, product_no
     */
    redirectChat(params) {
        const url = `${DOMAIN}/users/chat?${utils.query.stringify(params)}`;
        move(url);
    },

    /**
     * 상품 상세 페이지로 이동한다.
     * @param {string} pNo
     */
    redirectProduct(pNo) {
        const url = `${DOMAIN}/products/${pNo}`;
        move(url);
    }
};

