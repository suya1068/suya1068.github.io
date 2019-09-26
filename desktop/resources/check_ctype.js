const IS_HISTORY = !!window.history.pushState;
const __WEB__ = `.${location.hostname}`;
const FORSNAP_UUID = "FORSNAP_UUID";
const ENTER = "ENTER";
const PERSONAL_CUSTOMER = {
    INDI: "indi"
};

const get_cookie = function (name) {
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
};
const set_cookie = function (data, expiresDate) {
    let expires = expiresDate;
    if (!expiresDate) {
        const d = new Date();
        d.setDate(d.getDate() + 59);
        expires = d.toUTCString();
    }

    const options = `expires=${expires}; path=/; domain=${__WEB__};`; // http=true;
    // options = `${options} secure=true;`;

    Object.entries(data).forEach(([key, value]) => {
        document.cookie = `${key}=${encodeURIComponent(value)}; ${options}`;
    });
};

const remove_cookie = function (name) {
//            params.forEach(name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${__WEB__};`;
//            });
};

const query_parse = function (queryString) {
    const params = {};
    const regexp = /([^#?&=]+)=([^&]*)/g;
    let match = regexp.exec(queryString);

    while (match !== null) {
        params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
        match = regexp.exec(queryString);
    }

    return params;
};

const query_search_value = function (key) {
    const searchPath = location.search;
    if (searchPath) {
        const searchPathToObject = query_parse(searchPath);
        if (searchPathToObject[key]) {
            return searchPathToObject[key];
        }
    }
    return null;
};

const enter_vaildate = function (enter) {
    const keys = Object.keys(PERSONAL_CUSTOMER);
    const cType = keys.filter(chk => {
        return PERSONAL_CUSTOMER[chk] === enter;
    });

    return cType.length > 0;
};

const getUUID = function getUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, match => {
        const r = Math.random() * 16 | 0;
        const v = match === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

/**
 * 쿠키에 UUID가 존재하는지 판단한다.
 * 없으면 생성한다.
 */
const createForsnapUUID = function () {
    if (!get_cookie(FORSNAP_UUID)) {
        const uuid = getUUID().replace(/-/g, "");
        const d = new Date();
        d.setYear(d.getFullYear() + 1);

        set_cookie({ [FORSNAP_UUID]: uuid }, d.toUTCString());
    }
};

const oninit = function () {
    // const redirect_session = query_search_value("session");
    const newWindow = query_search_value("new");
    const enter_query = query_search_value("enter");
    const inflow_query = query_search_value("inflow");

    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 2);
    expireDate.toUTCString();
    // 포스냅 UUID가 없을 경우 생성
    createForsnapUUID();
    // 포스냅 기업 쿠키가 없을 경우 생성
    // createEnter();

    // 메인 페이지 에서만 쿠키 삭제 및 등록.
    if (enter_query && location.pathname === "/") {
        const keys = Object.keys(PERSONAL_CUSTOMER);
        const cType = keys.filter(chk => {
            return PERSONAL_CUSTOMER[chk] === enter_query;
        });

        if (enter_query === PERSONAL_CUSTOMER[cType]) {
            set_cookie({ [ENTER]: enter_query }, expireDate);
            sessionStorage.setItem(ENTER, enter_query);
        }
    }

    // 리스트 페이지에서 개인 고객 쿠키&세션 등록
    if (location.pathname.startsWith("/products") && enter_query) {
        if (enter_query === PERSONAL_CUSTOMER.INDI) {
            set_cookie({ [ENTER]: enter_query }, expireDate);
            sessionStorage.setItem(ENTER, enter_query);
        }
    }

    // 유입 경로에 따른 쿠키 등록 (적용 페이지 : 상품상세, 메인)
    if ((location.pathname.startsWith("/products/") || location.pathname.startsWith("/")) && inflow_query) {
        const inflow = inflow_query.split("-");
        if (inflow[1] && PERSONAL_CUSTOMER[inflow[1].toUpperCase()]) {
            set_cookie({ [ENTER]: inflow[1] }, expireDate);
            sessionStorage.setItem(ENTER, inflow[1]);
        }
    }

    if (newWindow) {
        if (sessionStorage && get_cookie(ENTER)) {
            sessionStorage.setItem(ENTER, get_cookie(ENTER));
        }
    }

    // // 작가페이지 진입 시 기업 쿠키 및 세션 삭제
    // if (aritstsPageReferrer) {
    //     sessionStorage.removeItem(ENTER);
    //     remove_cookie(ENTER);
    //     remove_cookie("isArtistPageReferrer");
    // }

    const enter = get_cookie(ENTER);
    const enter_session = sessionStorage.getItem(ENTER);
    let url = `${location.pathname}${location.search}`;

    if (enter && enter_session) {
        const extension = url.indexOf("?") === -1 ? "?" : "&";
        if (url.indexOf("enter=") === -1) {
            url = `${url}${extension}enter=${enter}`;
        }
    }

    const public_changePath = decodeURI(url);
    ga("send", "pageview", `${public_changePath}`);

    // gtag("config", "UA-108815098-1", {
    //     page_title: document.title || "",
    //     page_location: `${public_changePath}` || ""
    //     // page_path: ""
    // });
};

oninit();
