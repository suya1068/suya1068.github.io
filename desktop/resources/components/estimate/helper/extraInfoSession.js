import utils from "forsnap-utils";

// 견적정보 세션 키
export const EXTRA_INFO_KEY = "extraInfo";
export const USER_NAME = "estimateUserName";
export const USER_PHONE = "estimateUserPhone";
export const USER_EMAIL = "estimateUserEmail";

/**
 * 세션이 존재하는지 체크한다.
 * @returns {boolean}
 */
function hasCheckSession() {
    return !!sessionStorage;
}

/**
 * 견적정보를 세션에 저장한다.
 * @param params
 */
export function setSessionEstimateData(key, params) {
    if (hasCheckSession() && !utils.type.isEmpty(params)) {
        const p = key === EXTRA_INFO_KEY ? JSON.stringify(params) : params;
        sessionStorage.setItem(key, p);
    }
}

/**
 * 견적정보를 세션에서 꺼낸다.
 * @returns {*}
 */
export function getSessionEstimateData(key) {
    let data = null;
    if (hasCheckSession() && sessionStorage.getItem(key)) {
        data = sessionStorage.getItem(key);
        data = (data && key === EXTRA_INFO_KEY) ? JSON.parse(data) : data;
    }

    return data;
}

/**
 * 세션에 저장한 정보를 추가한다.
 * *** 견적 정보만 저장된다.
 * @param addParam
 */
export function addSessionEstimateData(addParam) {
    if (hasCheckSession()) {
        const bData = getSessionEstimateData(EXTRA_INFO_KEY) ? JSON.parse(getSessionEstimateData(EXTRA_INFO_KEY)) : null;
        const aData = bData && Object.assign(bData, { ...addParam });

        sessionStorage.setItem(EXTRA_INFO_KEY, aData);
    }
}
