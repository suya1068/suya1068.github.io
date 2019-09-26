import utils from "forsnap-utils";
import api from "forsnap-api";

class PhotographComment {
    /**
     * 유저 아이디를 가져온다.
     * @return {string}
     */
    getUserId() {
        return this.user_id;
    }

    /**
     * 유저 아이디를 저장한다.
     * @return {string}
     */
    setUserId(user_id) {
        this.user_id = user_id;
    }

    /**
     * 업로드 정책을 가져온다.
     * @return {null|*}
     */
    getUploadPolicy() {
        return this.upload;
    }

    /**
     * 업로드 정책을 저장한다.
     */
    setUploadPolicy(policy) {
        this.upload = policy;
    }

    /**
     * 작가 정보를 가져온다.
     * @return {*|null}
     */
    getPhotographer() {
        return this.photographer;
    }

    /**
     * 작가 정보를 저장한다.
     * @param photographer
     */
    setPhotographer(photographer) {
        this.photographer = photographer;
    }

    /**
     * 업로드 키를 생성한다.
     * @param {string} key
     * @param {string} filename
     * @return {string}
     */
    createUploadKey(key, filename) {
        return `${key}${utils.uniqId()}.${utils.fileExtension(filename)}`;
    }

    /**
     * API 서버에서 업로드 정책과 작가 정보를 요청한다.
     * @param artist_nick_name 작가명
     * @abstract
     */
    getUploadPolicyAndPhotographer(artist_nick_name) {}

    /**
     * API 서버에게 사진후기 등록을 요청한다.
     * @abstract
     */
    registerPhotographReview() {}

    /**
     * 파일을 업로드한다.
     * @param {File} file
     * @return {axios.Promise|Promise.<string>}
     */
    uploadS3(file) {
        const upload = this.upload;
        const key = this.createUploadKey(upload.key, file.name);
        const form = new FormData();
        form.append("key", key);
        form.append("acl", upload.acl);
        form.append("policy", upload.policy);
        form.append("X-Amz-Credential", upload["X-Amz-Credential"]);
        form.append("X-Amz-Algorithm", upload["X-Amz-Algorithm"]);
        form.append("X-Amz-Date", upload["X-Amz-Date"]);
        form.append("X-Amz-Signature", upload["X-Amz-Signature"]);
        form.append("file", file);

        return api.common.uploadS3(upload.action, form).then(response => key);
    }
}

export default PhotographComment;
