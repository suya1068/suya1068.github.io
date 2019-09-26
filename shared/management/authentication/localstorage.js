import constant from "shared/constant";

export default {
    /**
     * 유저 정보를 가져온다.
     * @returns {*}
     */
    getUser() {
        const id = localStorage.getItem(constant.USER.ID);
        if (id) {
            const apiToken = decodeURIComponent(localStorage.getItem(constant.USER.API_TOKEN));
            const data = JSON.parse(localStorage.getItem(constant.USER.DATA));

            return { id, apiToken, data };
        }

        return null;
    },

    /**
     * 유저 정보를 설정한다.
     * @param id
     * @param data
     */
    setUser(id, data) {
        localStorage.setItem(constant.USER.ID, id);
        localStorage.setItem(constant.USER.API_TOKEN, encodeURIComponent(data.apiToken));
        localStorage.setItem(constant.USER.DATA, JSON.stringify(Object.assign({ id }, data)));
    },

    /**
     * 유저 정보를 업데이트한다.
     * @param id
     * @param data
     */
    updateUser(id, data) {
        const localData = JSON.parse(localStorage.getItem(constant.USER.DATA));
        // localStorage.setItem(constant.USER.DATA, JSON.stringify(Object.assign({ id }, update(localData, { $merge: data }))));
        localStorage.setItem(constant.USER.DATA, JSON.stringify({ id, ...localData, ...data }));
    },

    /**
     * 유저 정보를 제거한다.
     */
    removeUser() {
        localStorage.removeItem(constant.USER.ID);
        localStorage.removeItem(constant.USER.API_TOKEN);
        localStorage.removeItem(constant.USER.DATA);
    }
};
