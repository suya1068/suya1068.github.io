import API from "forsnap-api";
import JoinManager from "./JoinManager";
import PopModal from "shared/components/modal/PopModal";
import auth from "forsnap-authentication";
import FSN from "forsnap";

export default class DesktopJoin extends JoinManager {
    constructor() {
        super();
        this.temp = "";
    }

    success(result) {
        const clone = {
            data: { ...result.data },
            status: result.status,
            statusText: result.statusText
        };

        PopModal.progress();

        API.auth.login(clone.data)
            .then(response => {
                const data = response.data;
                auth.setUser(data.user_id, {
                    id: data.user_id,
                    artistNo: data.artist_no,
                    apiToken: data.api_token,
                    sns: clone.data.type,
                    email: data.email,
                    name: data.name,
                    profile_img: data.profile_img
                });

                return data;
            })
            .then(data => {
                PopModal.closeProgress();
                // const temp_user_id = localStorage.getItem("temp_user_id");
                // const advice_order_no = localStorage.getItem("advice_order_no");
                // if (temp_user_id) {
                //     this.userAttach(advice_order_no, { temp_user_id, sns_type: clone.data.type });
                // }
            })
            .catch(response => {
                PopModal.closeProgress();
                this.fail(response);
            });
    }

    fail(result) {
        PopModal.alert(result.data ? result.data : "에러가 발생했습니다.\n고객센터로 문의해주세요", { callBack: () => {
            location.reload();
        } });
    }

    /**
     * 데스크탑 로그인...기능
     */
    login(type) {
        // 기존 세션 제거를 위해 호출한다.
        auth.removeUser();

        const social = FSN.sns.create(FSN.sns.constant[type], { context: this, success: this.success, fail: this.fail });

        if (social) {
            social.login();
        }
    }

    logout() {
        PopModal.closeProgress();
        auth.removeUser();
    }
}
