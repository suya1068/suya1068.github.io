import React from "react";

const ENTER_CATEGORY = ["PRODUCT", "FOOD", "BEAUTY", "PROFILE_BIZ", "FASHION", "INTERIOR", "EVENT", "VIDEO_BIZ"];
const ENTERS = ["naver", "header", "information", "ddn", "instagram", "facebook"];

/**
 * 32개의 십육진수(8-4-4-4-12)로 이루어진 유니크한 키를 반환한다.
 * @returns {string}
 */
export function getUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, match => {
        const r = Math.random() * 16 | 0;
        const v = match === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * 이미지 업로드에 필요한 랜덤한 key 생성
 * 16진수 12자리
 * @returns {string}
 */
export function uniqId() {
    return "xxxxxxxxxxxx".replace(/[xy]/g, match => {
        const r = Math.random() * 16 | 0;
        const v = match === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}


export function uniqString(limit) {
    return Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, limit);
}

/**
 * 파일의 .을 제외한 확장자만 추출해낸다.
 * @param fileName
 * @returns {string|*}
 */
export function fileExtension(fileName) {
    const index = fileName.lastIndexOf(".");
    if (index !== -1) {
        return fileName.substr(index + 1);
    }

    return null;
}

/**
 * 빈공간을 채운다.
 * @param {string} word - 문자열
 * @param {number} [num = 2] - 문자열 길이
 * @param {string} [char = 0] - 공간을 채울 문자
 * @param {string} [direction = front] - 문자를 채울 위치(front, back)
 * @returns {string} 채워진 문자열
 */
export function fillSpace(word = "", num = 2, char = "0", direction = "front") {
    word += "";
    while (word.length < num) {
        if (direction === "front") {
            word = `${char}${word}`;
        } else {
            word = `${word}${char}`;
        }
    }

    return word;
}

/**
 * \n 문자열을 <br />로 변환하여, react component를 생성한다.
 * @param {string} [value = ""]
 * @returns {Array}
 */
export function linebreak(value = "") {
    if (typeof value !== "string") {
        throw new TypeError("The param is incorrect type.");
    }

    const regex = /(<br \/>|<br\/>|\n|\\n)/g;

    return value.split(regex).map((line, i) => {
        const b = line.match(regex);
        return b ? React.createElement("br", { key: i }) : line;
    });
}

/**
 * normalize 데이터를 생성한다.
 * @param {Array} data
 * @param {string} id
 * @param {?function} callback
 * @returns {{entity:object, ids:Array}}
 */
export function normalize(data, id, callback = null) {
    const initial = { entity: {}, ids: [] };
    return data.reduce((result, item) => {
        const custom = typeof callback === "function" ? callback(item) : item;

        result.entity[custom[id]] = custom;
        result.ids.push(custom[id]);
        return result;
    }, initial);
}

/**
 * 배열에 유니크 데이터만 반환한다.
 * @param {Array} array
 * @returns {Array}
 */
export function uniq(array) {
    if (!array || array.length === 0) {
        return [];
    }

    const result = [];
    const length = array.length;
    const seen = result;
    let index = 0;

    while (index < length) {
        const value = array[index];
        if (!seen.includes(value)) {
            if (seen !== result) {
                seen.push(value);
            }

            result.push(value);
        }

        index += 1;
    }

    return result;
}

/**
 * 데이트 포멧
 */
// export function dateFormat(foramt, date) {
//     if (!this.valueOf()) return " ";
//
//     const weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
//     const d = date;
//
//     const result = foramt.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, $1 => {
//         switch ($1) {
//             case "yyyy": return d.getFullYear();
//             case "yy": return fillSpace((d.getFullYear() % 1000));
//             case "MM": return fillSpace((d.getMonth() + 1));
//             case "dd": return fillSpace(d.getDate());
//             case "E": return weekName[d.getDay()];
//             case "HH": return fillSpace(d.getHours());
//             case "hh": return fillSpace(((d.getHours() % 12) ? d.getHours() : 12));
//             case "mm": return fillSpace(d.getMinutes());
//             case "ss": return fillSpace(d.getSeconds());
//             case "a/p": return d.getHours() < 12 ? "오전" : "오후";
//             default: return $1;
//         }
//     });
//
//     return result;
// }

/**
 * Array[ Object ] 병합 정렬
 * @param current - array (기준이 되는 배열)
 * @param target - array (병합될 배열)
 * @param keys - array (병합될때 중복검사할 키값)
 * @param sortKeys - array (병합후 정렬할 키값)
 * @param desc - boolean (정렬방식 기본 asc)
 *
 * @return object - (list 병합된 데이터, count 병합된 갯수)
 */
export function mergeArrayTypeObject(current, target, keys = [], sortKeys = [], desc = false) {
    const keyLength = keys.length;
    const sortLength = sortKeys.length;
    let copyCurrent = current.slice();
    const copyTarget = target.slice();
    const currentLength = current.length;

    if (keyLength > 0) {
        for (let i = 0; i < currentLength; i += 1) {
            const obj = copyCurrent[i];
            const diff1 = keys.reduce((rs, key) => {
                const objData = obj[key];
                if (objData) {
                    rs += objData.toString();
                }

                return rs;
            }, "");

            if (copyTarget.length === 0) {
                break;
            }

            for (let j = 0; j < copyTarget.length; j += 1) {
                const obj2 = copyTarget[j];
                if (obj2) {
                    const diff2 = keys.reduce((rs, key) => {
                        const objData = obj2[key];
                        if (objData) {
                            rs += objData.toString();
                        }

                        return rs;
                    }, "");

                    if (diff1 === diff2) {
                        copyCurrent[i] = obj2;
                        copyTarget.splice(j, 1);
                        break;
                    }
                }
            }
        }
    }

    copyCurrent = copyCurrent.concat(copyTarget);

    if (sortLength > 0) {
        copyCurrent.sort((a, b) => {
            let sort = 0;

            for (let i = 0; i < sortLength; i += 1) {
                const key = sortKeys[i];
                const dataA = isNaN(a[key]) ? a[key] : parseInt(a[key], 10);
                const dataB = isNaN(b[key]) ? b[key] : parseInt(b[key], 10);

                if (dataA > dataB) {
                    sort = desc ? -1 : 1;
                } else if (dataA < dataB) {
                    sort = desc ? 1 : -1;
                }

                if (sort !== 0) {
                    break;
                }
            }

            return sort;
        });
    }

    return { list: copyCurrent, newList: copyTarget, count: copyTarget.length };
}

/**
 * 1차원배열 정렬
 * @param array
 * @param desc - boolean (true - 내림차순, false - 오름차순)
 * @returns {*}
 */
export function arraySort(array, desc = false) {
    array.sort((a, b) => {
        let sort = 0;

        if (a > b) {
            sort = desc ? -1 : 1;
        } else if (a < b) {
            sort = desc ? 1 : -1;
        }

        return sort;
    });
    return array;
}

/**
 * arraybuffer를 base64로 인코드
 * @param arrayBuffer
 * @returns {Promise}
 */
export function arrayBufferToBase64(arrayBuffer) {
    return new Promise((resolve, reject) => {
        let base64 = "";
        const encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

        const bytes = new Uint8Array(arrayBuffer);
        const byteLength = bytes.byteLength;
        const byteRemainder = byteLength % 3;
        const mainLength = byteLength - byteRemainder;

        let a;
        let b;
        let c;
        let d;
        let chunksData;

        // Main loop deals with bytes in chunks of 3
        for (let i = 0; i < mainLength; i += 3) {
            // Combine the three bytes into a single integer
            chunksData = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

            // Use bitmasks to extract 6-bit segments from the triplet
            a = (chunksData & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
            b = (chunksData & 258048) >> 12; // 258048   = (2^6 - 1) << 12
            c = (chunksData & 4032) >> 6; // 4032     = (2^6 - 1) << 6
            d = chunksData & 63; // 63       = 2^6 - 1

            // Convert the raw binary segments to the appropriate ASCII encoding
            base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
        }

        // Deal with the remaining bytes and padding
        if (byteRemainder === 1) {
            chunksData = bytes[mainLength];

            a = (chunksData & 252) >> 2; // 252 = (2^6 - 1) << 2

            // Set the 4 least significant bits to zero
            b = (chunksData & 3) << 4; // 3   = 2^2 - 1

            base64 += `${encodings[a]}${encodings[b]}==`;
        } else if (byteRemainder === 2) {
            chunksData = (bytes[mainLength] << 8) | bytes[mainLength + 1];

            a = (chunksData & 64512) >> 10; // 64512 = (2^6 - 1) << 10
            b = (chunksData & 1008) >> 4; // 1008  = (2^6 - 1) << 4

            // Set the 2 least significant bits to zero
            c = (chunksData & 15) << 2; // 15    = 2^4 - 1

            base64 += `${encodings[a]}${encodings[b]}${encodings[c]}=`;
        }

        resolve(base64);
    });
}

/**
 * 이메일체크
 */
export function isValidEmail(email) {
    // const filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const filter = /[0-9a-zA-Z][0-9a-zA-Z\-._]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}/;
    return filter.test(email);
}

/**
 * 도메인을 체크한다.
 * @param domain
 * @returns {boolean}
 */
export function isValidDomain(domain) {
    const filter = /(((http|https|ftp):\/\/)?)[\da-zA-Z-ㄱ-힣][\da-zA-Z-ㄱ-힣.]+(\.co.kr|\.com|\.net)(:[0-9]+)?(\/\S*)?/g;
    return /(http|https)/.test(domain) || filter.test(domain);
}

/**
 * 한글, 영문, 숫자, 공백, (),+- 이외의 문자를 제거
 * @param str
 * @returns {*|string|XML|void}
 */
export function replaceChar(str) {
    if (str && typeof str === "string") {
        return str.replace(/[^\s\da-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ(),+-]+/gi, "");
    }

    return str;
}

/**
 * array를 size로 분리하여 이중배열을 반환한다.
 * @param {Array} array
 * @param {number} [size = 1]
 * @returns {Array}
 */
export function chunk(array, size = 1) {
    if (!Array.isArray(array) || !Number.isInteger(size) || size < 1) {
        return [];
    }

    const leng = array ? array.length / size : 0;
    const result = [];
    let idx = 0;

    while (idx < leng) {
        result[idx] = array.slice(idx * size, (idx + 1) * size);
        idx += 1;
    }

    return result;
}

export function stringToBoolen(value) {
    if (typeof value === "boolean") {
        return value;
    } else if (typeof value === "number") {
        return value > 0;
    } else if (typeof value === "string") {
        switch (value.toLowerCase().trim()) {
            case "1": case "true": return true;
            case "0": case "false": return false;
            default: return false;
        }
    }

    return false;
}

export function keydownNumber(e) {
    const code = event.keyCode;

    if (code > 47 && code < 58) {
        return;
    }

    if (event.ctrlKey || event.altKey) {
        return;
    }

    event.preventDefault();
}

/**
 * 영역 리사이즈
 * 사이즈를 받아서 디폴트 높이 200px 기준으로 리사이즈
 * @param vw - Number (원본 넓이)
 * @param vh - Number (원본 높이)
 * @param dw - Number (변경할 비율 넓이)
 * @param dh - Number (변경할 비율 높이)
 * @param point - bool (비율 기준점, true - width, false - height, 기본 false)
 * @returns {{width: *, height: *}}
 */
export function resize(vw, vh, dw, dh, point) {
    let cAspect = 0;
    let iAspect = 0;
    const result = {};

    if (!dw) {
        dw = 1;
    }

    if (!dh) {
        dh = 1;
    }

    result.width = dw;
    result.height = dh;

    if (point) {
        cAspect = dh / dw;
        iAspect = vh / vw;
    } else {
        cAspect = dw / dh;
        iAspect = vw / vh;
    }

    if (iAspect === cAspect) {
        if (point) {
            result.width = dw;
            result.height = dw;
        } else {
            result.width = dh;
            result.height = dh;
        }
    } else if (point) {
        const h = (vh / vw) * dw;
        result.height = Math.round(h);
        result.float = h;
    } else {
        const w = (vw / vh) * dh;
        result.width = Math.round(w);
        result.float = w;
    }

    return result;
}

export function loadIMP(callBack) {
    new Promise((resolve, reject) => {
        if (!window.jQuery || (window.jQuery && window.jQuery().jquery !== "2.2.4")) {
            const jqueryScript = document.createElement("script");
            jqueryScript.onload = () => {
                resolve(true);
            };
            jqueryScript.onerror = () => {
                reject(false);
            };
            jqueryScript.src = "https://code.jquery.com/jquery-2.2.4.js";
            jqueryScript.setAttribute("integrity", "sha256-iT6Q9iMJYuQiMWNd9lDyBUStIq/8PuOW33aOqmvFpqI=");
            jqueryScript.setAttribute("crossorigin", "anonymous");
            document.body.appendChild(jqueryScript);
        } else {
            resolve(true);
        }
    }).then(() => {
        new Promise((resolve, reject) => {
            if (!window.IMP) {
                const impScript = document.createElement("script");
                impScript.onload = () => {
                    resolve();
                };
                impScript.onerror = () => {
                    reject();
                };
                impScript.src = "https://service.iamport.kr/js/iamport.payment-1.1.2.js";
                document.body.appendChild(impScript);
            } else {
                resolve();
            }
        }).then(() => {
            if (typeof callBack === "function") {
                callBack(true);
            }
        }).catch(() => {
            if (typeof callBack === "function") {
                callBack(false);
            }
        });
    });
}

export function getBrowser() {
    if (navigator && navigator.userAgent) {
        const props = {};
        const agent = navigator.userAgent.toLowerCase();

        let match = agent.match(/(edge[0-9./]+)/i);
        if (match) {
            props.browser = "edge";
            props.version = match[0].split("/")[1];
            return props;
        }

        match = agent.match(/msie [0-9./]+|trident[0-9./]+/i);
        if (match) {
            props.browser = "ie";

            if (match.length > 1) {
                props.version = match[0].split(" ")[1];
            } else {
                const v = match[0].split("/")[1];
                if (v === 7.0) {
                    props.version = "11.0";
                } else {
                    props.version = "other version";
                }
            }

            return props;
        }

        match = agent.match(/naver\((higgs|inapp)[\w\W]+\)/i);
        if (match) {
            props.browser = "naver(higgs)";
            props.version = "none";
            return props;
        }

        match = agent.match(/(whale[0-9./]+)/i);
        if (match) {
            props.browser = "whale";
            props.version = match[0].split("/")[1];
            return props;
        }

        match = agent.match(/(chrome[0-9./]+)/i);
        if (match) {
            props.browser = "chrome";
            props.version = match[0].split("/")[1];
            return props;
        }

        match = agent.match(/(safari[0-9./]+)/i);
        if (match) {
            props.browser = "safari";
            props.version = match[0].split("/")[1];
            return props;
        }

        match = agent.match(/(firefox[0-9./]+)/i);
        if (match) {
            props.browser = "firefox";
            props.version = match[0].split("/")[1];
            return props;
        }

        match = agent.match(/(opera[0-9./]+)/i);
        if (match) {
            props.browser = "opera";
            props.version = match[0].split("/")[1];
            return props;
        }

        props.browser = "other";
        props.version = "none";
        return props;
    }

    return null;
}

/**
 * 정산금액 계산
 // * vat - 부가세,
 // * exVatPrice - 부가세 제외한 금액
 // * comi - 포스냅 수수료
 // * vatComi - 포스냅 수수료 부가세
 // * exComiPrice - 수수료 제외 금액
 // * tax - 세금
 // * vatTax - 세금의 부가세
 // * taxPrice - 세금 총합
 *
 * @param price - Number
 */
export function calculatePrice(price) {
    // const exVatPrice = price / 1.1;
    // const comi = exVatPrice * comiPer;
    // const vatComi = comi * 0.1;
    // const exComiPrice = exVatPrice - comi;
    // const tax = Math.floor((exComiPrice * 0.03) / 10) * 10;
    // const vatTax = Math.floor((tax * 0.1) / 10) * 10;

    // return {
    //     vat: price - exVatPrice,
    //     exVatPrice,
    //     comi,
    //     vatComi,
    //     exComiPrice,
    //     tax,
    //     vatTax,
    //     taxPrice: tax + vatTax
    // };

    let totalPrice = price;
    const basic = [
        {
            standard: 1000000,
            max: "",
            per: 0.05,
            check: false
        },
        {
            standard: 500000,
            max: 1000000,
            per: 0.1,
            check: false
        },
        {
            standard: 0,
            max: 500000,
            per: 0.2,
            check: false
        }
    ];

    const result = [];

    for (let i = 0; i < basic.length; i += 1) {
        const obj = basic[i];
        let comi = 0;
        let exPrice = 0;

        if (totalPrice > obj.standard) {
            const p = totalPrice - obj.standard;
            totalPrice -= p;

            obj.check = true;
            comi = p * obj.per;
            exPrice = p - comi;
        }

        result.push(Object.assign({
            comi,
            price: Math.round(exPrice / 10) * 10
        }, obj));
    }

    return result;
}

export function errorFilter(error) {
    const filter = /^<[\w\W=":]>*.*<\/[\w\W]>$/gm;
    return error && error.data && !filter.test(error.data);
}

export function isArray(a) {
    return a && Array.isArray(a) && a.length;
}

/**
 * 카테고리가 기업용 카테고리인지 체크한다.
 * @param category
 * @returns {boolean}
 */
export function checkCategoryForEnter(category) {
    const upperStringToCategory = category.toUpperCase();
    const checkCategory = ENTER_CATEGORY.indexOf(upperStringToCategory);
    return checkCategory !== -1;        // enter 카테고리와 일치하면 false를 반환
}

export function checkCookieEnter(enter) {
    return ENTERS.findIndex(en => enter === en) !== -1;
}

export function isDate(date) {
    if (!(typeof date === "string") && !(typeof date === "number")) {
        return false;
    }

    return date && !!date.match(/^([^0][0-9]{1,3}|[0]+[1-9]{1,3})[/.-]?(0[1-9]|1[0-9])[/.-]?([0][1-9]|[1-3][0-9])$/);
}
