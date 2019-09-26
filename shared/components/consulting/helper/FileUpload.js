import API from "forsnap-api";
import utils from "forsnap-utils";
import auth from "forsnap-authentication";

class FileUpload {
    constructor() {
        this.files = [];                // 업로드 파일 배열
        //this.is_upload = false;         // 업로드 시도 상태값
        this.upload_info = {};          // 업로드 정책
        this.order_no = null;           // 요청서 번호
        this.user = auth.getUser();     // 유저 로그인 / 비 로그인 체크
        //this.temp_user_id = "";         // 비 로그인 시 임시 유저아이디
    }

    init(no, obj) {
        this.setOrderNo(no);
        this.setUploadInfo(obj);
    }

    getTempUserId() {
        return this.temp_user_id;
    }

    setTempUserId(id) {
        this.temp_user_id = id;
    }

    setOrderNo(no) {
        this.order_no = no;
    }

    getOrderNo() {
        return this.order_no;
    }

    setUploadInfo() {
        this.findUploadPolicy();
    }

    getUploadInfo() {
        return this.upload_info;
    }

    setUploadPolicy(policy) {
        this.upload_info = policy;
    }

    findUploadPolicy() {
        return API.orders.findAdviceOrderPolicy().then(response => {
            const data = response.data;
            const temp_user_id = data.temp_user_id;
            const upload_info = data.upload_info;
            this.setUploadPolicy(upload_info);
            this.setTempUserId(temp_user_id);
        });
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
     * 파일을 업로드한다.
     * @param {File} file
     * @param key
     * @return {axios.Promise|Promise.<string>}
     */
    uploadS3(file, key) {
        const { upload_info } = this;
        //const key = this.createUploadKey(upload_info.key, file.name);
        const form = new FormData();
        form.append("key", key);
        form.append("acl", upload_info.acl);
        form.append("policy", upload_info.policy);
        form.append("X-Amz-Credential", upload_info["X-Amz-Credential"]);
        form.append("X-Amz-Algorithm", upload_info["X-Amz-Algorithm"]);
        form.append("X-Amz-Date", upload_info["X-Amz-Date"]);
        form.append("X-Amz-Signature", upload_info["X-Amz-Signature"]);
        form.append("file", file);

        return API.common.uploadS3(upload_info.action, form);
    }

    process(file) {
        return new Promise((resolve, reject) => {
            const upload_info = this.upload_info;
            const result = {
                status: false,
                message: ""
            };

            const isCheckExtForFlag = ex => {
                let message = "";
                if (!(/(jpg|jpeg|png|bmp|pdf|xls|xlsx|ppt|pptx|zip)$/i).test(ex)) {
                    message = "파일은 PFD, XLS, XLSX, PPT, PPTX, ZIP\n이미지는 JPG, JPEG, PNG, BMP 확장자만 가능합니다.";
                }

                return message;
            };

            let ext = "";

            if (!file) {
                result.message = "업로드할 파일이 없습니다";
            } else if (!upload_info) {
                result.message = "잘못된 업로드 정보입니다";
            } else {
                ext = utils.fileExtension(file.name);
                result.message = isCheckExtForFlag(ext);
                if (!result.message) {
                    result.file_name = file.name;
                    result.status = true;
                }
            }

            if (result.status) {
                result.status = false;

                result.uploadKey = this.createUploadKey(upload_info.key, file.name);
                this.uploadS3(file, result.uploadKey)
                    .then(res => {
                        result.status = true;
                        resolve(result);
                    }).catch(error => {
                        reject(error);
                    });
            } else {
                resolve(result);
            }
        });
    }
}

export default FileUpload;
