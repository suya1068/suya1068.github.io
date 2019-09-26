import utils from "forsnap-utils";

class UploadController {
    constructor() {
        this.init();
    }

    /**
     * 초기화
     */
    init() {
        this._max = 5;
        this._count = 0;
        this._upload = [];
        this._xhrStack = [];
    }

    /**
     * 스레드 처리
     * @private
     */
    _process(b = false) {
        if (b) {
            this._count += 1;

            if (!this._isNextThread()) {
                this._decreaseThread();
                return;
            }
        }

        if (this.isNext()) {
            const obj = this._upload.splice(0, 1);
            if (obj && obj.length > 0) {
                const item = obj[0];
                this._loading(item);
            } else {
                this._process();
            }
        } else {
            this._decreaseThread();
        }
    }

    /**
     * 스레드 처리 결과
     * @param data
     * @private
     */
    _result(result) {
        this._deleteXHRStack(result.uid, false);

        if (typeof result.data.onLoad === "function") {
            result.data.onLoad(result);
        }

        this._process();
    }

    /**
     * XMLHttpRequest 삭제
     * @param uid - 삭제할 아이디
     * @param isAbort - 처리 중지 여부
     * @private
     */
    _deleteXHRStack(uid, isAbort = true) {
        const index = this._xhrStack.findIndex(xhr => {
            return xhr.uid === uid;
        });

        if (index !== -1) {
            const obj = this._xhrStack.splice(index, 1);
            if (isAbort && obj) {
                obj[0].xhr.abort();
                obj[0].xhr = null;
            }
        }
    }

    /**
     * 동작할수 있는 스레드가 있는지 체크
     * @returns {boolean}
     * @private
     */
    _isNextThread() {
        return this._count <= this._max;
    }

    /**
     * 스레드 카운트 감소
     * @private
     */
    _decreaseThread() {
        if (this._count > 0) {
            this._count -= 1;
        } else {
            this._count = 0;
        }
    }

    /**
     * 업로드 처리
     * @param item - Object
     * @returns {Promise}
     * @private
     */
    _loading(item) {
        if (item.file && item.uploadInfo) {
            new Promise((resolve, reject) => {
                const uploadInfo = item.uploadInfo;
                const result = {
                    status: false,
                    data: item,
                    count: 0
                };

                if (uploadInfo) {
                    const form = new FormData();
                    result.uploadKey = `${uploadInfo.key}${utils.uniqId()}.${utils.fileExtension(item.file.name)}`;
                    form.append("key", result.uploadKey);
                    form.append("acl", uploadInfo.acl);
                    form.append("policy", uploadInfo.policy);
                    form.append("X-Amz-Credential", uploadInfo["X-Amz-Credential"]);
                    form.append("X-Amz-Algorithm", uploadInfo["X-Amz-Algorithm"]);
                    form.append("X-Amz-Date", uploadInfo["X-Amz-Date"]);
                    form.append("X-Amz-Signature", uploadInfo["X-Amz-Signature"]);
                    form.append("file", item.file);

                    const xhr = new XMLHttpRequest();
                    xhr.open("POST", uploadInfo.action, true);
                    xhr.addEventListener("readystatechange", e => {
                        if (xhr.readyState === 4) {
                            result.code = xhr.status;
                            if ([200, 204].indexOf(xhr.status) !== -1) {
                                result.status = true;
                            }
                        }
                    });
                    xhr.addEventListener("loadstart", e => {
                        if (typeof item.onLoadStart === "function") {
                            item.onLoadStart(e);
                        }
                    });
                    xhr.upload.addEventListener("progress", e => {
                        if (typeof item.onProgress === "function") {
                            item.onProgress(e);
                        }
                    });
                    xhr.addEventListener("progress", e => {
                        if (typeof item.onProgress === "function") {
                            item.onProgress(e);
                        }
                    });
                    xhr.addEventListener("abort", e => {
                        resolve(result);
                    });
                    xhr.addEventListener("loadend", e => {
                        if ([206, 404, 0, ""].indexOf(result.code) === -1 && result.count < 3 && (!result.status || result.code === 202)) {
                            const index = this._xhrStack.findIndex(obj => {
                                return obj.uid === result.uid;
                            });

                            if (index !== -1) {
                                setTimeout(() => {
                                    result.count += 1;
                                    xhr.open("POST", uploadInfo.action, true);
                                    xhr.send(form);
                                }, 1000);
                            } else {
                                xhr.abort();
                            }
                        } else {
                            resolve(result);
                        }
                    });
                    xhr.addEventListener("timeout", e => {
                        result.code = "timeout";
                    });

                    xhr.send(form);

                    this._xhrStack.push({ uid: item.uid, xhr });
                } else {
                    reject(result);
                }
            }).then(response => {
                this._result(response);
            }).catch(error => {
                this._result(error);
            });
        } else {
            this._process();
        }
    }

    /**
     * 최대 스레드 셋팅
     * @param max
     */
    setMaxThread(max) {
        this._max = max;
    }

    /**
     * 다음 업로드 체크
     * @returns {boolean}
     */
    isNext() {
        return Array.isArray(this._upload) && this._upload.length > 0;
    }

    params(obj) {
        const uid = utils.getUUID();
        return {
            uid,
            ...obj
        };
    }

    /**
     * 업로드할 파일 배열에 추가
     * @param obj - Object (src, onLoad, onProgress, onError ...)
     * @returns {*}
     */
    addItem(obj, isUnshift) {
        const data = this.params(obj);

        if (isUnshift) {
            this._upload.unshift(data);
        } else {
            this._upload.push(data);
        }

        this._process(true);

        return data.uid;
    }

    /**
     * 바로 업로드 대기열에 추가
     * @param obj - Object (src, onLoad, onProgress, onError ...)
     * @return {*}
     */
    addPending(obj) {
        const data = this.params(obj);
        this._loading(data);

        return data.uid;
    }

    /**
     * 배열에 추가된 업로드파일 삭제
     * @param uid
     */
    deleteItem(uid) {
        const index = this._upload.findIndex(u => { return u.uid === uid; });
        if (index !== -1) {
            this._upload.splice(index, 1);
        } else {
            this._deleteXHRStack(uid);
        }
    }

    getList() {
    }

    getCount() {
        return this._upload.length;
    }
}

export default new UploadController();
