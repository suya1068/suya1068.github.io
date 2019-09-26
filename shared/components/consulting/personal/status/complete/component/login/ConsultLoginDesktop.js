import API from "forsnap-api";
import ConsultLogin from "./ConsultLogin";
import PopModal from "shared/components/modal/PopModal";
import authentication from "forsnap-authentication";
import FSN from "forsnap";

export default class ConsultLoginDesktop extends ConsultLogin {
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
                authentication.setUser(data.user_id, {
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
                const temp_user_id = localStorage.getItem("temp_user_id");
                const advice_order_no = localStorage.getItem("advice_order_no");
                if (temp_user_id) {
                    this.userAttach(advice_order_no, { temp_user_id, sns_type: clone.data.type });
                }
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

    userAttach(no, data) {
        const request = API.orders.updateAdviceOrdersAttachUser(no, data);
        request.then(response => {
            localStorage.removeItem("temp_user_id");
            localStorage.removeItem("advice_order_no");

            location.reload();
        }).catch(error => {
            PopModal.alert(error, { callBack: () => { location.reload(); } });
        });
    }

    /**
     * 데스크탑 로그인...기능
     */
    login(type) {
        // 기존 세션 제거를 위해 호출한다.
        authentication.removeUser();

        const social = FSN.sns.create(FSN.sns.constant[type], { context: this, success: this.success, fail: this.fail });

        if (social) {
            social.login();
        }
    }

    logout() {
        PopModal.closeProgress();
        authentication.removeUser();
    }
}
