import API from "forsnap-api";

export function columnDefaultListRender(target, code) {
    target.reduce((re, ob) => {
        ob.DEFAULT = code === ob.CODE || false;
        re.push(ob);
        return re;
    }, []);
}

// export function changeProp(props, target, flag, child = "DISABLED") {
//     if (props.indexOf(target.CODE) > -1) {
//         target[child] = flag;
//     }
// }
//
// export function targetReduce(func, target) {
//     target.PROP.reduce((re, ob) => {
//         func(ob);
//         re.push(ob);
//         return re;
//     }, []);
// }

export function changeProp(props, target, flag, child = "DISABLED") {
    if (props.indexOf(target.CODE) > -1) {
        target[child] = flag;
    }
}

export function targetReduce(func, target) {
    target.PROP.reduce((re, ob) => {
        func(ob);
        re.push(ob);
        return re;
    }, []);
}

/**
 * 작가상담 1단계 api
 * @param params
 * @returns {*|{"Content-Type"}}
 */
export function apiInsertArtistOrder(params) {
    return API.orders.insertArtistOrder(params);
}

/**
 * 작가상담 2단계 api
 * @param params
 * @param no
 * @returns {IDBRequest|Promise<void>}
 */
export function apiPutArtistOrder(no, params) {
    return API.orders.fetchArtistOrder(no, params);
}

/**
 * 견적산출 api
 * @param params
 * @returns {*|{"Content-Type"}}
 */
export function apiInsertOrderEstimate(params) {
    return API.orders.insertOrderEstimate(params);
}

/**
 * 추천작가 호출 api
 * @param params
 * @returns {*}
 */
export function apiGetRecommentArtists(params) {
    return API.orders.findRecommendArtist(params);
}

/**
 * 유료작가 카테고리별 조회
 * @param params
 * @returns {*}
 */
export function apiGetChargeArtistProduct(params) {
    return API.products.findChargeArtist(params);
}

/**
 * 후기 호출 api
 * @param params
 * @returns {*}
 */
export function apiGetCategoryReviews(params) {
    return API.products.findCategoryReviews(params);
}

/**
 * 포스냅에 상담신청
 * @param params
 * @returns {*}
 */
export function apiInsertAdviceOrders(params) {
    return API.orders.insertAdviceOrders(params);
}

/**
 * 견적 정보 조회
 * @param no
 * @returns {*}
 */
export function apiGetEstimate(no) {
    return API.orders.fetchEstimate(no);
}

