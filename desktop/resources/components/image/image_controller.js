import utils from "forsnap-utils";

class ImageController {
    constructor() {
        this.init();
    }

    /**
     * 초기화
     */
    init() {
        this._max = 5;
        this._count = 0;
        this._images = [];
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
            const obj = this._images.splice(0, 1);

            if (obj && obj.length > 0) {
                const image = obj[0];
                if (image.src) {
                    this._loading(image);
                } else {
                    this._process();
                }
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

        if (typeof result.onLoad === "function") {
            result.onLoad(result);
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
     * 이미지 로딩 처리
     * @param image
     * @returns {Promise}
     * @private
     */
    _loading(image) {
        return new Promise((resolve, reject) => {
            const result = {
                ...image,
                status: false
            };

            // let img = new Image();
            //
            // img.onload = function () {
            //     result.status = true;
            //     resolve(result);
            //     img = null;
            // };
            // img.onerror = function () {
            //     resolve(result);
            //     img = null;
            // };
            //
            // img.src = image.src;

            let timeoutId = 0;
            const xhr = new XMLHttpRequest();
            xhr.open("GET", result.src, true);
            xhr.onreadystatechange = e => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                if (xhr.readyState === 4) {
                    result.code = xhr.status;
                    if (xhr.status === 200) {
                        result.status = true;
                    }
                } else {
                    timeoutId = setTimeout(() => {
                        result.code = "timeout";
                        xhr.abort();
                    }, 10000);
                }
            };
            xhr.onloadstart = e => {
                // if (typeof image.onLoadStart === "function") {
                //     image.onLoadStart(e);
                // }
            };
            xhr.onprogress = e => {
                // if (typeof image.onProgress === "function") {
                //     image.onProgress(e);
                // }
            };
            xhr.onabort = e => {
                resolve(result);
            };
            xhr.onloadend = e => {
                if ([206, 404, 0, ""].indexOf(result.code) === -1 && result.count < 30 && (!result.status || result.code === 202)) {
                    const index = this._xhrStack.findIndex(obj => {
                        return obj.uid === result.uid;
                    });

                    if (index !== -1) {
                        setTimeout(() => {
                            result.count += 1;
                            result.retrySrc = `${result.src}?v=${result.count}`;
                            xhr.open("GET", result.retrySrc, true);
                            xhr.send();
                        }, 1000);
                    } else {
                        xhr.abort();
                    }
                } else {
                    resolve(result);
                }
            };
            xhr.ontimeout = e => {
                result.code = "timeout";
            };
            xhr.send();

            this._xhrStack.push({ uid: result.uid, xhr });
        }).then(response => {
            this._result(response);
        }).catch(error => {
            this._result(error);
        });
    }

    /**
     * 최대 스레드 셋팅
     * @param max
     */
    setMaxThread(max) {
        this._max = max;
    }

    /**
     * 다음 로딩할 이미지 체크
     * @returns {boolean}
     */
    isNext() {
        return Array.isArray(this._images) && this._images.length > 0;
    }

    /**
     * 로딩할 이미지 배열에 추가
     * @param obj - Object (src, onLoad, onProgress, onError ...)
     * @returns {*}
     */
    addImage(obj) {
        const uid = utils.getUUID();
        this._images.push({
            uid,
            count: 0,
            ...obj
        });

        this._process(true);

        return uid;
    }

    /**
     * 배열에 추가된 이미지 삭제
     * @param uid
     */
    deleteImage(uid) {
        // const index = this._images.findIndex(img => { return img.uid === uid; });
        // if (index !== -1) {
        //     this._images.splice(index, 1);
        // }
        const index = this._images.findIndex(img => { return img.uid === uid; });
        if (index !== -1) {
            this._images.splice(index, 1);
        } else {
            this._deleteXHRStack(uid);
        }
    }
}

export default new ImageController();
