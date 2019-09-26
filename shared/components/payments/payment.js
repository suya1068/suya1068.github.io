import api from "forsnap-api";
import utils from "forsnap-utils";
import auth from "forsnap-authentication";
import mewtime from "forsnap-mewtime";

function onError(e) {
    console.log("payment error : ", e);
    return e;
}

/**
 * 일반 상품 결제준비
 * @param params - Object (product_no, date, option_no, person, [phone, email])
 * @return {*}
 */
export function readyProduct(params) {
    return api.reservations.reserveToProduct(params)
        .then(response => {
            console.log(response);
            return response.data;
        })
        .catch(onError);
}

/**
 * 패키지 상품 결제준비
 * @param params - Object (product_no, date, package_no, [package_count, extra_option, custom_option, phone, email])
 * @return {Promise}
 */
export function readyPackage(params) {
    return api.reservations.reserveToPackage(params)
        .then(response => {
            console.log(response);
            return response.data;
        })
        .catch(onError);
}

/**
 * 맞춤, 추가 결제준비
 * @param params - Object (talk_no, [phone, email])
 * @return {Promise}
 */
export function readyExtra(params) {
    return api.reservations.reserveTalk(params)
        .then(response => {
            console.log(response);
            return response.data;
        })
        .catch(onError);
}

/**
 * 맞춤, 추가 결제준비
 * @param params - Object (offer_no, date)
 * @return {Promise}
 */
export function readyOffer(params) {
    return api.reservations.reserveToEstimate(params)
        .then(response => {
            console.log(response);
            return response.data;
        })
        .catch(onError);
}

/**
 * 입금기한 날짜
 * @param date
 * @return {Promise}
 */
export function bankDueDate(date = 3) {
    return `${mewtime().add(date, mewtime.const.DATE).format("YYYYMMDD")}2359`;
}
