import utils from "shared/helper/utils";

// const DOMAIN = __DOMAIN__;
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
        if (h && !h.back()) {
            window.close();
        }
    },
    /**
     * 메인 페이지로 이동한다.
     * @param {?(object|string)} [param = ""]
     * @param {?object} [target = window]
     */
    main(param = "", target = window) {
        target.location.href = param ? `${utils.query.stringify(param)}` : "/";
    },
    /**
     * 로그인 페이지로 이동한다.
     * @param {?(object|string)} [param = ""]
     * @param {?object} [target = window]
     */
    login(param = "", target = window) {
        const url = `${DOMAIN}/login`;
        target.location.href = param ? `${url}?${utils.query.stringify(param)}` : url;
    },
    /**
     * 에러 페이지로 이동한다.
     * @param {?object} [target = window]
     */
    error(target = window) {
        target.location.href = `${DOMAIN}/50x.html`;
    },
    /**
     * 40X 에러 페이지로 이동한다.
     */
    error40x(target = window) {
        target.location.href = `${DOMAIN}/40x.html`;
    },
    /**
     * 검색한 태그로 상품페이지로 이동한다.
     * @param {?object} [target = window]
     */
    productList(param = "", target = window) {
        const url = `${DOMAIN}/products`;
        target.location.href = `${url}?${param}`;
    },
    /**
     * 본인의 mypage로 이동한다(계정설정)
     * @param {?object} [target = window]
     */
    myAccount(target = window) {
        const url = `${DOMAIN}/users/myaccount`;
        target.location.href = url;
    },
    /**
     * 유저 진행상황으로 이동한다.
     * @param target
     * @param {boolean} [replace = false]
     */
    myProgress(replace = false, target = window) {
        const url = `${DOMAIN}/users/progress`;

        if (replace) {
            location.replace(url);
        } else {
            target.location.href = url;
        }
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
     * 채팅창으로 이동한다.
     * @param target
     */
    myChat(target = window) {
        const url = `${DOMAIN}/users/chat`;
        target.location.href = url;
    },
    /**
     * 사용자의 고객1:1 문의 채팅창으로 이동한다.
     * @param target
     */
    chatUserHelp(target = window) {
        const url = `${DOMAIN}/users/chat/help`;
        target.location.href = url;
    },
    /**
     * 사용자의 고객1:1 문의 채팅창으로 이동한다.
     * @param target
     */
    chatArtistHelp(target = window) {
        const url = `${DOMAIN}/artists/chat/help`;
        target.location.href = url;
    },
    /**
     * 작가등록 페이지로 이동한다.
     * @param target
     */
    registArtist(target = window) {
        const url = `${DOMAIN}/users/registartist`;
        target.location.href = url;
    },
    /**
     * 작가 페이지로 이동한다.
     * @param target
     */
    redirectArtistPage(target = window) {
        const url = `${DOMAIN}/artists`;
        target.location.href = url;
    },
    /**
     * 작가 계정설정 페이지로 이동한다.
     * @param target
     */
    redirectArtistAccount(target = window) {
        const url = `${DOMAIN}/artists/account`;
        target.location.href = url;
    },


    /**
     * 상품 상세 페이지로 이동한다.
     * @param {string} pNo
     * @param {boolean} [replace = false]
     * @param target
     */
    productOne(pNo, replace = false, target = window) {
        const url = `${__DOMAIN__}/products/${pNo}`;

        if (replace) {
            location.replace(url);
        } else {
            target.location.href = url;
        }
    }
};

