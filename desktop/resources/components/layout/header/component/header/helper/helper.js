import utils from "forsnap-utils";
import API from "forsnap-api";
import auth from "forsnap-authentication";
import PopModal from "shared/components/modal/PopModal";
import redirect from "desktop/resources/management/redirect";
import { PERSONAL_MAIN, BUSINESS_MAIN } from "shared/constant/main.const";

export default class HeaderHelper {
    /**
     * 로그아웃한다.
     */
    onLogout() {
        API.auth.logout().then(response => {
            auth.removeUser();
            location.reload();
        }).catch(error => {
            PopModal.alert(error.data);
        });
    }

    /**
     * 알림 가쳐오기 처리
     */
    getNoticeData(is_artist, noticeData) {
        return new Promise((resolve, reject) => {
            const user = auth.getUser();
            let request = null;

            if (is_artist) {
                request = API.artists.notice(user.id);
            } else {
                request = API.users.notice(user.id);
            }

            if (request !== null) {
                request.then(response => {
                    const data = response.data;

                    const mergeObj = utils.mergeArrayTypeObject(noticeData, data.list, ["no"], ["no"], true);
                    const current = mergeObj.list;

                    resolve({
                        noticeData: current,
                        isProcessNotice: false
                    });
                }).catch(error => {
                    reject(error.data);
                });
            }
        });
    }

    /**
     * 로그인 페이지로 이동한다.
     */
    moveToLoginPage() {
        const url = `${location.pathname}${location.search}${location.hash}`;

        if (location.pathname === "/login") {
            location.reload();
        } else if (url !== "/") {
            redirect.login({ redirectURL: url });
        } else {
            redirect.login();
        }
    }

    /**
     * 기업 / 개인 용 카테고리를 설정한다.
     * @param enter
     * @returns {Array}
     */
    setCategoryList(enter) {
        const baseCategory = enter ? PERSONAL_MAIN.CATEGORY : BUSINESS_MAIN.CATEGORY;
        let list = baseCategory;
        if (enter) {
            list = this.personalCategoryFilter(baseCategory);
        }
        return list;
    }

    /**
     * 개인 카테고리 중 노출할 카테고리를 설정한다.
     * @param category
     */
    personalCategoryFilter(category) {
        return category.filter(obj => {
            if (!utils.checkCategoryForEnter(obj.code)) {
                return true;
            }
            return false;
        });
    }
}
