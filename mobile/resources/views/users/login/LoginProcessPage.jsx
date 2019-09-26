import React from "react";
import CONST from "shared/constant";
import { GLOBAL_SESSION_SAVE } from "mobile/resources/stores/constants";
import API from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import redirect from "forsnap-redirect";
import PopModal from "shared/components/modal/PopModal";
import AppDispatcher from "mobile/resources/AppDispatcher";

const type = document.getElementById("sns-type").content;
const params = utils.query.parseSNSURI(type, location.href);
const movePageURL = localStorage.getItem(CONST.FORSNAP_REDIRECT);

/**
 * 로컬스토리지에서 리다이렉트 URL을 제거한다.
 */
function removeRedirectLocalStorage() {
    if (localStorage) {
        localStorage.removeItem(CONST.FORSNAP_REDIRECT);
    }
}

// function wcsEvent() {
//     if (wcs && wcs.cnv && wcs_do) {
//         const _nasa = {};
//         _nasa["cnv"] = wcs.cnv("2", "1");
//         wcs_do(_nasa);
//     }
// }

// function gaEvent(label) {
//     const eCategory = `게스트 촬영요청서${label}`;
//     const eAction = "";
//     const eLabel = "";
//     utils.ad.gaEvent(eCategory, eAction, eLabel);
// }

function userAttach(no, data, url) {
    const request = API.orders.updateAdviceOrdersAttachUser(no, data);
    request.then(response => {
        let redirect_url = "/";
        if (localStorage) {
            if (localStorage.getItem("temp_user_id")) {
                localStorage.removeItem("temp_user_id");
            }

            if (localStorage.getItem("advice_order_no")) {
                localStorage.removeItem("advice_order_no");
            }
            redirect_url = localStorage.getItem("redirect_url");
            if (redirect_url) {
                localStorage.removeItem("redirect_url");
            }
        }
        location.href = redirect_url;
    }).catch(error => {
        PopModal.alert(error, { callBack: () => { location.reload(); } });
    });
}

// CSRF TOKEN이 유효할 경우에만 로그인을 처리한다.
if (localStorage.getItem(CONST.USER.CSRF_TOKEN) === params.state) {
    const movePageQueryParams = utils.query.parse(movePageURL) || {};
    const redirectUrl = `${__DOMAIN__}/${__SNS__[type].redirect_uri}`;
    const form = {
        type,
        redirect_url: redirectUrl,
        code: params.code
    };

    if (movePageQueryParams.message) {
        // 소셜 연동
        form.user_id = auth.getUser().id;

        API.auth.addSnsSync(form)
            .then(() => {
                removeRedirectLocalStorage();
                location.replace(movePageURL);
            })
            .catch(error => {
                removeRedirectLocalStorage();

                PopModal.alert(error.data ? error.data : "소셜연동 처리중 에러가 발생했습니다.\n고객센터로 문의해주세요", {
                    callBack: () => location.replace(movePageURL)
                });
            });
    } else {
        // 소셜 로그인
        API.auth.login(form)
            .then(response => {
                AppDispatcher.dispatch({ type: GLOBAL_SESSION_SAVE, payload: response.data });
                // const guestReferrer = document.referrer;
                // if (guestReferrer && (guestReferrer.indexOf("guest") !== -1 && guestReferrer.indexOf("content") !== -1)) {
                //     gaEvent("로그인");
                // }
                return response.data;
            })
            .then(data => {
                //utils.ad.wcsEvent("2");
                removeRedirectLocalStorage();
                if (data.rest_dt) {
                    let url = "/login?rest=true";
                    if (movePageURL) {
                        url += `&redirectURL=${movePageURL}`;
                    }
                    location.href = url;
                } else if (localStorage) {
                    const temp_user_id = localStorage.getItem("temp_user_id");
                    const advice_order_no = localStorage.getItem("advice_order_no");

                    if (temp_user_id) {
                        userAttach(advice_order_no, { temp_user_id, sns_type: type }, movePageURL);
                    } else {
                        redirect.main(movePageURL, true);
                    }
                } else {
                    redirect.main(movePageURL, true);
                }

                // if (localStorage) {
                //     const temp_user_id = localStorage.getItem("temp_user_id");
                //     const advice_order_no = localStorage.getItem("advice_order_no");
                //
                //     if (temp_user_id) {
                //         userAttach(advice_order_no, { temp_user_id, sns_type: type }, movePageURL);
                //     } else {
                //         redirect.main(movePageURL, true);
                //     }
                // } else {
                //     redirect.main(movePageURL, true);
                // }
            })
            .catch(error => {
                removeRedirectLocalStorage();
                if (error.data === "탈퇴한 계정입니다.") {
                    alert(error.data);
                    location.href = "/";
                    return;
                }
                PopModal.alert(error.data ? error.data : "로그인 처리중 에러가 발생했습니다.\n고객센터로 문의해주세요", {
                    callBack: () => redirect.login({ redirectURL: movePageURL }, true)
                });
            });
    }
} else {
    PopModal.alert("에러가 발생했습니다.\n고객센터로 문의해주세요", {
        callBack: () => {
            removeRedirectLocalStorage();
            redirect.login({ redirectURL: movePageURL }, true);
        }
    });
}

export default function Login() {
    return (
        <div style={{ width: "100%", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
            <img
                alt="loading-progress"
                src={__SERVER__.img + CONST.PROGRESS.COLOR_CAT}
                style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: "100%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
            />
        </div>
    );
}
