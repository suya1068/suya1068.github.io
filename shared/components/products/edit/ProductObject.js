import API from "forsnap-api";
import utils from "forsnap-utils";

import Regular from "shared/constant/regular.const";
import { BIZ_CATEGORY } from "shared/constant/product.const";
import { CATEGORY_LIST, CATEGORY_CODE, EXTRA_OPTION, STATE } from "shared/constant/package.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

class ProductObject {
    constructor() {
        this.init();
    }

    init() {
        this._state = {
            [STATE.PRODUCT_NO]: null,
            [STATE.BASIC.key]: {
                [STATE.BASIC.TITLE]: "",
                [STATE.BASIC.CATEGORY]: "",
                [STATE.BASIC.AGREE]: "N"
            },
            [STATE.OPTION.key]: {
                [STATE.OPTION.PACKAGE.key]: this.initPackage(),
                [STATE.OPTION.EXTRA_OPTION.key]: this.initExtra(),
                [STATE.OPTION.CUSTOM_OPTION.key]: []
            },
            [STATE.DETAIL.key]: {
                [STATE.DETAIL.CONTENT]: "",
                [STATE.DETAIL.TAG]: "",
                [STATE.DETAIL.DESCRIPTION]: "",
                [STATE.DETAIL.REGION]: []
            },
            [STATE.PORTFOLIO]: [],
            [STATE.THUMBNAIL]: "",
            [STATE.UPLOAD_INFO]: {},
            exceptPackage: {
                PRODUCT: [
                    [STATE.OPTION.PACKAGE.TITLE],
                    [STATE.OPTION.PACKAGE.CONTENT],
                    [STATE.OPTION.PACKAGE.PRICE],
                    [STATE.OPTION.PACKAGE.MIN_PRICE],
                    [STATE.OPTION.PACKAGE.PHOTO_CNT],
                    [STATE.OPTION.PACKAGE.PERIOD]
                ],
                DEFAULT: [
                    [STATE.OPTION.PACKAGE.TITLE],
                    [STATE.OPTION.PACKAGE.CONTENT],
                    [STATE.OPTION.PACKAGE.PRICE],
                    [STATE.OPTION.PACKAGE.PHOTO_TIME],
                    [STATE.OPTION.PACKAGE.PHOTO_CNT],
                    [STATE.OPTION.PACKAGE.CUSTOM_CNT],
                    [STATE.OPTION.PACKAGE.PERIOD]
                ]
            },
            [STATE.MAIN_VIDEO]: "",
            [STATE.VIDEO_LIST]: [],
            customLimit: 30,
            isProcess: false
        };
    }

    initPackage(obj) {
        const data = obj;
        const result = [];

        for (let i = 0; i < 3; i += 1) {
            if (utils.isArray(data) && data[i]) {
                const item = data[i];
                result.push({
                    [STATE.OPTION.PACKAGE.TITLE]: item[STATE.OPTION.PACKAGE.TITLE] || "",
                    [STATE.OPTION.PACKAGE.CONTENT]: item[STATE.OPTION.PACKAGE.CONTENT] || "",
                    [STATE.OPTION.PACKAGE.PRICE]: item[STATE.OPTION.PACKAGE.PRICE] || "",
                    [STATE.OPTION.PACKAGE.MIN_PRICE]: item[STATE.OPTION.PACKAGE.MIN_PRICE] || "",
                    [STATE.OPTION.PACKAGE.PHOTO_TIME]: item[STATE.OPTION.PACKAGE.PHOTO_TIME] || "",
                    [STATE.OPTION.PACKAGE.PHOTO_CNT]: item[STATE.OPTION.PACKAGE.PHOTO_CNT] || "",
                    [STATE.OPTION.PACKAGE.CUSTOM_CNT]: item[STATE.OPTION.PACKAGE.CUSTOM_CNT] || "",
                    [STATE.OPTION.PACKAGE.PERIOD]: item[STATE.OPTION.PACKAGE.PERIOD] || "",
                    [STATE.OPTION.PACKAGE.SIZE]: item[STATE.OPTION.PACKAGE.SIZE] || "",
                    [STATE.OPTION.PACKAGE.RUNNING_TIME]: item[STATE.OPTION.PACKAGE.RUNNING_TIME] || ""
                });
            } else {
                result.push({
                    [STATE.OPTION.PACKAGE.TITLE]: "",
                    [STATE.OPTION.PACKAGE.CONTENT]: "",
                    [STATE.OPTION.PACKAGE.PRICE]: "",
                    [STATE.OPTION.PACKAGE.MIN_PRICE]: "",
                    [STATE.OPTION.PACKAGE.PHOTO_TIME]: "",
                    [STATE.OPTION.PACKAGE.PHOTO_CNT]: "",
                    [STATE.OPTION.PACKAGE.CUSTOM_CNT]: "",
                    [STATE.OPTION.PACKAGE.PERIOD]: "",
                    [STATE.OPTION.PACKAGE.SIZE]: "",
                    [STATE.OPTION.PACKAGE.RUNNING_TIME]: ""
                });
            }
        }

        return result;
    }

    initExtra(data) {
        const keyEx = STATE.OPTION.EXTRA_OPTION;
        const keys = Object.keys(keyEx);

        return keys.reduce((rs, key) => {
            if (key === "key") {
                return rs;
            }

            const obj = keyEx[key];
            const prop = {
                ...obj
            };

            if (utils.isArray(data)) {
                const find = data.find(d => (d.code === obj.code));

                if (find) {
                    prop.price = find.price;
                }
            }

            rs.push(prop);

            return rs;
        }, []);
    }

    initProduct() {
        //
    }

    /**
     * 처리상태 변경
     * @param b
     */
    setProcess(b) {
        if (b) {
            this._state.isProcess = true;
            Modal.show({
                type: MODAL_TYPE.PROGRESS
            });
        } else {
            this._state.isProcess = false;
            Modal.close(MODAL_TYPE.PROGRESS);
        }
    }

    /**
     * 현재 처리상태
     * @return {boolean}
     */
    getProcess() {
        return this._state.isProcess;
    }

    /**
     * 데이터 가져오기
     * @param key
     * @return {*}
     */
    getState(key = null) {
        if (key) {
            try {
                return this._state[key];
            } catch (e) {
                return null;
            }
        }

        return this._state;
    }

    setState(key, value) {
        this._state[key] = value;
        return { [key]: this._state[key] };
    }

    getCategoryCode() {
        const basic = this.getState(STATE.BASIC.key);

        if (basic) {
            return basic[STATE.BASIC.CATEGORY] || null;
        }

        return null;
    }

    getCategory() {
        const code = this.getCategoryCode();
        if (code) {
            const categoryList = this._state[STATE.CATEGORY_CODES];
            return Object.assign(CATEGORY_LIST.find(c => c.code === code) || { package: [], extra: [] }, categoryList ? categoryList[code] || {} : {});
        }

        return null;
    }

    isBiz() {
        const code = this.getCategoryCode();
        if (code) {
            return !!BIZ_CATEGORY.find(o => o === code);
        }

        return null;
    }

    /**
     * 제품, 푸드 카테고리 여부
     * @return {boolean}
     */
    isExcept() {
        const category = this.getCategory();

        if (category) {
            return category.except || false;
        }

        return false;
    }

    isVideo() {
        const category = this.getCategoryCode();
        return category && ["VIDEO", "VIDEO_BIZ"].indexOf(category) !== -1;
    }

    /**
     * 스냅, 프로필 카테고리 여부
     * @return {boolean}
     */
    getCategoryMinPrice() {
        const category = this.getCategory();

        if (category) {
            return ["SNAP", "PROFILE", "BABY", "DRESS_RENT"].indexOf(category) !== -1;
        }

        return false;
    }

    setBasicState(key, value) {
        this._state[STATE.BASIC.key][key] = value;

        if (key === STATE.BASIC.CATEGORY) {
            const isExcept = this.isExcept();
            const option = this._state[STATE.OPTION.key];
            const packageList = option[STATE.OPTION.PACKAGE.key];
            const keyPkg = STATE.OPTION.PACKAGE;
            const pkg = packageList.reduce((pRs, p) => {
                if (isExcept) {
                    p[keyPkg.PHOTO_TIME] = "";
                    p[keyPkg.CUSTOM_CNT] = "";
                } else {
                    p[keyPkg.MIN_PRICE] = "";
                }
                pRs.push(p);
                return pRs;
            }, []);

            this.setOptionState(STATE.OPTION.PACKAGE.key, pkg);
            this.setOptionState(STATE.OPTION.EXTRA_OPTION.key, this.initExtra());
            if (value === CATEGORY_CODE.DRESS_RENT) {
                this.setDetailState(STATE.DETAIL.REGION, []);
            }
        }

        return { [STATE.BASIC.key]: this._state[STATE.BASIC.key] };
    }

    setOptionState(key, value) {
        this._state[STATE.OPTION.key][key] = value;
        return { [STATE.OPTION.key]: this._state[STATE.OPTION.key] };
    }

    setOptionPackage(index, key, value) {
        const option = this._state[STATE.OPTION.key];
        option[STATE.OPTION.PACKAGE.key][index][key] = value;
        return { [STATE.OPTION.key]: option };
    }

    setOptionExtraPrice(key, value) {
        const option = this._state[STATE.OPTION.key];
        const extraOption = option[STATE.OPTION.EXTRA_OPTION.key];
        const ex = extraOption.find(o => (o.code === key));
        if (ex) {
            ex.price = value;
        }
        return { [STATE.OPTION.key]: option };
    }

    setOptionCustom(index, key, value) {
        const option = this._state[STATE.OPTION.key];

        if (!Array.isArray(option[STATE.OPTION.CUSTOM_OPTION.key])) {
            option[STATE.OPTION.CUSTOM_OPTION.key] = [];
        }

        if (!option[STATE.OPTION.CUSTOM_OPTION.key][index]) {
            if (option[STATE.OPTION.CUSTOM_OPTION.key].length < this._state.customLimit) {
                option[STATE.OPTION.CUSTOM_OPTION.key][index] = {
                    key: Date.now(),
                    [STATE.OPTION.CUSTOM_OPTION.TITLE]: "",
                    [STATE.OPTION.CUSTOM_OPTION.CONTENT]: "",
                    [STATE.OPTION.CUSTOM_OPTION.PRICE]: ""
                };
            } else {
                return { [STATE.OPTION.key]: option };
            }
        }

        option[STATE.OPTION.CUSTOM_OPTION.key][index][key] = value;
        return { [STATE.OPTION.key]: option };
    }

    setDetailState(key, value) {
        this._state[STATE.DETAIL.key][key] = value;
        return { [STATE.DETAIL.key]: this._state[STATE.DETAIL.key] };
    }

    delOptionCustom(index) {
        const option = this._state[STATE.OPTION.key];
        option[STATE.OPTION.CUSTOM_OPTION.key].splice(index, 1);

        return { [STATE.OPTION.key]: option };
    }

    apiRegisterProduct(id) {
        if (!this.getProcess()) {
            this.setProcess(true);
            const valid = this.isValidateBasic();
            if (!valid.status) {
                this.setProcess(false);
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: valid.message
                });
                return null;
            }

            const basic = this.getState(STATE.BASIC.key);
            return API.artists.registerBasic(id, basic).then(response => {
                this.setProcess(false);
                if (response.status === 200) {
                    const data = response.data;

                    this.setState(STATE.PRODUCT_NO, data[STATE.PRODUCT_NO]);
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        name: "product-register-error",
                        content: utils.linebreak(error.data)
                    });
                } else {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        name: "product-register-error",
                        content: "상품을 생성하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요."
                    });
                }
            });
        }

        return null;
    }

    apiBasic(id) {
        if (!this.getProcess()) {
            this.setProcess(true);
            const valid = this.isValidateBasic();
            if (!valid.status) {
                this.setProcess(false);
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: valid.message
                });
                return null;
            }

            const basic = this.getState(STATE.BASIC.key);
            const productNo = this.getState(STATE.PRODUCT_NO);
            return API.artists.updateBasic(id, productNo, basic).then(response => {
                this.setProcess(false);
                return response;
            }).catch(error => {
                this.setProcess(false);
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        name: "product-basic-error",
                        content: utils.linebreak(error.data)
                    });
                } else {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        name: "product-basic-error",
                        content: "상품의 기본정보를 저장하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요."
                    });
                }
            });
        }

        return null;
    }

    apiOption(id) {
        if (!this.getProcess()) {
            this.setProcess(true);
            const valid = this.isValidateOption();
            if (!valid.status) {
                this.setProcess(false);
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: valid.message
                });
                return null;
            }

            const option = this.getState(STATE.OPTION.key);
            const productNo = this.getState(STATE.PRODUCT_NO);
            const params = Object.assign({}, option);
            params[STATE.OPTION.PACKAGE.key] = JSON.stringify(option[STATE.OPTION.PACKAGE.key]);
            params[STATE.OPTION.EXTRA_OPTION.key] = JSON.stringify(option[STATE.OPTION.EXTRA_OPTION.key]);
            params[STATE.OPTION.CUSTOM_OPTION.key] = JSON.stringify(option[STATE.OPTION.CUSTOM_OPTION.key]);

            return API.artists.updateOption(id, productNo, params).then(response => {
                this.setProcess(false);
                return response;
            }).catch(error => {
                this.setProcess(false);
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        name: "product-option-error",
                        content: utils.linebreak(error.data)
                    });
                } else {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        name: "product-option-error",
                        content: "상품의 옵션정보를 저장하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요."
                    });
                }
            });
        }

        return null;
    }

    apiDetail(id) {
        if (!this.getProcess()) {
            this.setProcess(true);
            const valid = this.isValidateContent();
            if (!valid.status) {
                this.setProcess(false);
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: valid.message
                });
                return null;
            }

            const detail = this.getState(STATE.DETAIL.key);
            const productNo = this.getState(STATE.PRODUCT_NO);
            const params = Object.assign({}, detail);

            params[STATE.DETAIL.TAG] = utils.search.params(detail[STATE.DETAIL.TAG]);
            params[STATE.DETAIL.REGION] = detail[STATE.DETAIL.REGION].join(",");

            return API.artists.updateDetail(id, productNo, params).then(response => {
                this.setProcess(false);
                return response;
            }).catch(error => {
                this.setProcess(false);
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        name: "product-detail-error",
                        content: utils.linebreak(error.data)
                    });
                } else {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        name: "product-detail-error",
                        content: "상품의 상세정보를 저장하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요."
                    });
                }
            });
        }

        return null;
    }

    isUndefined(value) {
        return typeof value === "undefined";
    }

    isValidateBasic() {
        const result = {
            status: false,
            message: ""
        };

        const basic = this.getState(STATE.BASIC.key);
        const title = basic[STATE.BASIC.TITLE];
        const category = basic[STATE.BASIC.CATEGORY];
        const agree = basic[STATE.BASIC.AGREE];
        const productNo = this.getState(STATE.PRODUCT_NO);

        if (title.replace(/\s/g, "") === "") {
            result.message = "상품명을 입력해주세요.";
        } else if (title.length > 25) {
            result.message = "상품명은 25자 이하로 입력 가능합니다.";
        } else if (!category) {
            result.message = "카테고리를 선택해주세요.";
        } else if (!productNo && agree !== "Y") {
            result.message = "서비스 이용약관동의가 필요합니다.";
        } else {
            result.status = true;
        }

        return result;
    }

    isValidateOption() {
        const result = {
            status: false,
            message: ""
        };

        const { exceptPackage } = this._state;
        const option = this.getState(STATE.OPTION.key);
        const opPkg = option[STATE.OPTION.PACKAGE.key];
        const opEx = option[STATE.OPTION.EXTRA_OPTION.key];
        const opCu = option[STATE.OPTION.CUSTOM_OPTION.key];
        const isExcept = this.isExcept();
        const category = this.getCategory();

        const pkg = opPkg.reduce((pkgRs, obj, i) => {
            const item = category.package.reduce((rs, o) => {
                rs.data[o.code] = obj[o.code];
                if (!rs.status && (i === 0 || rs.data[o.code])) {
                    rs.status = true;
                }

                return rs;
            }, { status: false, data: { index: i + 1 } });

            if (item.status) {
                pkgRs.push(item.data);
            }

            return pkgRs;
        }, []);

        const pkgResult = this.isValidatePackage(pkg);
        const exResult = this.isValidateExtra(opEx);
        const cuResult = this.isValidateCustom(opCu);

        if (!pkgResult.status) {
            result.message = pkgResult.message;
        } else if (!exResult.status) {
            result.message = exResult.message;
        } else if (!cuResult.status) {
            result.message = cuResult.message;
        } else {
            result.status = true;
        }

        return result;
    }

    isValidatePackage(obj) {
        const result = {
            status: false,
            message: ""
        };

        const keyPkg = STATE.OPTION.PACKAGE;
        const category = this.getCategory();
        const isExcept = this.isExcept();

        if (utils.isArray(obj)) {
            for (let i = 0; i < obj.length; i += 1) {
                const pkg = obj[i];
                const keys = Object.keys(pkg);

                for (let j = 0; j < keys.length; j += 1) {
                    const key = keys[j];
                    const value = pkg[key];

                    switch (key) {
                        case keyPkg.TITLE: {
                            if (value.replace(/\s/g, "") === "") {
                                result.message = `[패키지${pkg.index}] 패키지명을 입력해주세요.`;
                            } else if (value.length < 5 || value.length > 10) {
                                result.message = `[패키지${pkg.index}] 패키지명은 최소 5자 ~ 10자 사이로 입력 가능합니다.`;
                            }
                            break;
                        }
                        case keyPkg.CONTENT: {
                            if (value.replace(/\s/g, "") === "") {
                                result.message = `[패키지${pkg.index}] 패키지설명을 입력해주세요.`;
                            } else if (utils.isValidEmail(value)) {
                                result.message = `[패키지${pkg.index}] 패키지설명에는 이메일 주소를 입력할 수 없습니다.`;
                            } else if (utils.isValidDomain(value)) {
                                result.message = `[패키지${pkg.index}] 패키지설명에는 홈페이지 주소를 입력할 수 없습니다.`;
                            } else if (value.length < 30 || value.length > 200) {
                                result.message = `[패키지${pkg.index}] 패키지설명은 최소 30자 ~ 200자 사이로 입력 가능합니다.`;
                            }
                            break;
                        }
                        case keyPkg.PRICE: {
                            if (isExcept) {
                                if (value === "") {
                                    result.message = `[패키지${pkg.index}] 상품당 금액을 입력해주세요.`;
                                } else if (Number(value) < Number(category.cnt_price)) {
                                    result.message = `[패키지${pkg.index}] 상품당 금액은 포스냅 정책에 따라 ${utils.format.price(category.cnt_price)}원 이상만 설정이 가능합니다.`;
                                }
                            } else if (this.isVideo()) {
                                if (!value) {
                                    result.message = `[패키지${pkg.index}] 최소 진행 금액을 입력해주세요.`;
                                } else if (Number(value) < Number(category.min_price)) {
                                    result.message = `[패키지${pkg.index}] 최소 진행 금액은 포스냅 정책에 따라 ${utils.format.price(category.min_price)}원 이상만 설정이 가능합니다.`;
                                }
                            } else if (!value) {
                                result.message = `[패키지${pkg.index}] 패키지금액을 입력해주세요.`;
                            } else if (Number(value) < Number(category.min_price)) {
                                result.message = `[패키지${pkg.index}] 패키지금액은 포스냅 정책에 따라 ${utils.format.price(category.min_price)}원 이상만 설정이 가능합니다.`;
                            }
                            break;
                        }
                        case keyPkg.RUNNING_TIME: {
                            if (!value) {
                                result.message = `[패키지${pkg.index}] 러닝타임을 입력해주세요.`;
                            }
                            break;
                        }
                        case keyPkg.MIN_PRICE: {
                            if (!value) {
                                result.message = `[패키지${pkg.index}] 최소 진행 금액을 입력해주세요.`;
                            } else if (Number(value) < Number(category.min_price)) {
                                result.message = `[패키지${pkg.index}] 최소 진행 금액은 포스냅 정책에 따라 ${utils.format.price(category.min_price)}원 이상만 설정이 가능합니다.`;
                            }
                            break;
                        }
                        case keyPkg.PHOTO_TIME: {
                            if (!value) {
                                result.message = `[패키지${pkg.index}] 촬영시간을 선택해주세요.`;
                            }
                            break;
                        }
                        case keyPkg.PHOTO_CNT: {
                            if (!value) {
                                result.message = `[패키지${pkg.index}] 이미지 장수를 입력해주세요.`;
                            } else if (Number(value) < 1 || Number(value) > 9999) {
                                result.message = `[패키지${pkg.index}] 이미지 장수는 1 ~ 9,999장 사이로 입력 가능합니다.`;
                            }
                            break;
                        }
                        case keyPkg.CUSTOM_CNT: {
                            if (!value) {
                                result.message = `[패키지${pkg.index}] 보정 이미지 장수를 입력해주세요`;
                            } else if (Number(value) < 0 || Number(value) > 9999) {
                                result.message = `[패키지${pkg.index}] 보정 이미지 장수는 0 ~ 9,999장 사이로 입력 가능합니다`;
                            }
                            break;
                        }
                        case keyPkg.PERIOD: {
                            let caption = "";
                            if (category.code === CATEGORY_CODE.DRESS_RENT) {
                                caption = "의상 대여";
                            } else if (this.isVideo()) {
                                caption = "작업";
                            } else {
                                caption = "최종사진 전달";
                            }

                            if (!value) {
                                result.message = `[패키지${pkg.index}] ${caption} 기간을 입력해주세요.`;
                            } else if (Number(value) < 1 || Number(value) > 60) {
                                result.message = `[패키지${pkg.index}] ${caption} 기간은 1 ~ 60일 사이로 입력 가능합니다.`;
                            }
                            break;
                        }
                        case keyPkg.SIZE: {
                            if (!value) {
                                result.message = `[패키지${pkg.index}] 의상의 사이즈를 입력해주세요.`;
                            }
                            break;
                        }
                        default:
                            break;
                    }

                    if (result.message) {
                        return result;
                    }
                }
            }
        }

        result.status = true;
        return result;
    }

    isValidateExtra(obj) {
        const result = {
            status: false,
            message: ""
        };

        const category = this.getCategory();

        if (utils.isArray(obj)) {
            for (let i = 0; i < obj.length; i += 1) {
                const ex = obj[i];
                if (!category.extra.find(e => e === ex.code)) {
                    ex.price = "";
                }

                if (ex.price === 0 || (ex.price && ex.price < 1000)) {
                    result.message = `${ex.title}금액은 포스냅 정책에 따라 1,000원 이상만 설정이 가능합니다.`;
                }

                if (result.message) {
                    return result;
                }
            }
        }

        result.status = true;
        return result;
    }

    isValidateCustom(obj) {
        const result = {
            status: false,
            message: ""
        };

        const keyCu = STATE.OPTION.CUSTOM_OPTION;

        if (utils.isArray(obj)) {
            for (let i = 0; i < obj.length; i += 1) {
                const cu = obj[i];
                const title = cu[keyCu.TITLE];

                if (cu[keyCu.TITLE].replace(/\s/g, "") === "") {
                    result.message = "옵션명을 입력해주세요.";
                } else if (cu[keyCu.TITLE].length < 5 || cu[keyCu.TITLE].length > 10) {
                    result.message = "옵션명은 최소 5자 ~ 10자 사이로 입력 가능합니다.";
                } else if (cu[keyCu.CONTENT].replace(/\s/g, "") === "") {
                    result.message = `[${title}] 옵션설명을 입력해주세요.`;
                } else if (utils.isValidEmail(cu[keyCu.CONTENT])) {
                    result.message = `[${title}] 옵션설명에는 이메일 주소를 입력할 수 없습니다.`;
                } else if (utils.isValidDomain(cu[keyCu.CONTENT])) {
                    result.message = `[${title}] 옵션설명에는 홈페이지 주소를 입력할 수 없습니다.`;
                } else if (cu[keyCu.CONTENT].length > 100) {
                    result.message = `[${title}] 옵션설명은 최소 30자 ~ 100자 사이로 입력 가능합니다.`;
                } else if (cu[keyCu.PRICE] === "") {
                    result.message = `[${title}] 옵션금액을 입력해주세요.`;
                } else if (cu[keyCu.PRICE] < 1000) {
                    result.message = `[${title}] 옵션금액은 포스냅 정책에 따라 1,000원 이상만 설정이 가능합니다.`;
                }

                if (result.message) {
                    return result;
                }
            }
        }

        result.status = true;
        return result;
    }

    isValidateContent() {
        const result = {
            status: false,
            message: ""
        };

        const detail = this.getState(STATE.DETAIL.key);
        const category = this.getCategory();
        const tag = utils.search.parse(detail[STATE.DETAIL.TAG]);
        const tagLength = tag.join("").length;
        const isBiz = this.isBiz();

        if (!isBiz && detail[STATE.DETAIL.CONTENT].replace(/\s/g, "") === "") {
            result.message = "상세설명을 입력해주세요.";
        } else if (!isBiz && (detail[STATE.DETAIL.CONTENT].length < 100 || detail[STATE.DETAIL.CONTENT].length > 5000)) {
            result.message = "상세설명은 최소 100자 ~ 5000자 사이로 입력 가능합니다.";
        } else if (!isBiz && utils.isValidEmail(detail[STATE.DETAIL.CONTENT])) {
            result.message = "상세설명에는 이메일 주소를 입력할 수 없습니다.";
        } else if (!isBiz && utils.isValidDomain(detail[STATE.DETAIL.CONTENT])) {
            result.message = "상세설명에는 홈페이지 주소를 입력할 수 없습니다.";
        } else if (tagLength > 100) {
            result.message = "태그는 100자 이하만 입력 가능합니다.";
        } else if (!tag || tag.length < 3 || tag.length > 10) {
            result.message = "태그는 최소 3 ~ 10개 사이로 입력 가능합니다.";
        } else if (detail[STATE.DETAIL.DESCRIPTION].replace(/\s/g, "") === "") {
            result.message = "검색엔진 노출문구를 입력해주세요.";
        } else if (detail[STATE.DETAIL.DESCRIPTION].length < 10 || detail[STATE.DETAIL.DESCRIPTION].length > 45) {
            result.message = "검색엔진 노출문구는 최소 10자 ~ 45 사이로 입력 가능합니다.";
        } else if (utils.isValidEmail(detail[STATE.DETAIL.DESCRIPTION])) {
            result.message = "검색엔진 노출문구에는 이메일 주소를 입력할 수 없습니다.";
        } else if (utils.isValidDomain(detail[STATE.DETAIL.DESCRIPTION])) {
            result.message = "검색엔진 노출문구에는 홈페이지 주소를 입력할 수 없습니다.";
        } else if (!isBiz && category.code !== CATEGORY_CODE.DRESS_RENT && !utils.isArray(detail[STATE.DETAIL.REGION])) {
            result.message = "촬영가능 지역을 선택해주세요.";
        } else {
            result.status = true;
        }

        return result;
    }

    isValidatePortfolio() {
        const result = {
            status: false,
            message: ""
        };

        const portfolio = this.getState(STATE.PORTFOLIO);
        const thumbImg = this.getState(STATE.THUMBNAIL);

        if (!this.isVideo() && (!utils.isArray(portfolio) || portfolio.length < 10)) {
            result.message = "이미지는 최소 10장 이상 등록해주세요.";
        } else if (!thumbImg) {
            result.message = "썸네일 이미지를 등록해주세요.";
        } else {
            result.portfolio = portfolio.reduce((rs, p, i) => {
                if (Number(p.display_order) !== (i + 1)) {
                    result.isUpdate = true;
                }

                rs.push({
                    portfolio_no: p.portfolio_no,
                    display_order: i + 1,
                    portfolio_img: p.portfolio_img,
                    width: p.width,
                    height: p.height
                });
                return rs;
            }, []);
            result.status = true;
        }

        return result;
    }

    isValidateVideo() {
        const result = {
            status: false,
            message: ""
        };

        const portfolio = this.getState(STATE.PORTFOLIO);
        const thumbImg = this.getState(STATE.THUMBNAIL);
        const main_video = this.getState(STATE.MAIN_VIDEO);
        const video_list = this.getState(STATE.VIDEO_LIST);

        if (main_video.replace(/\s/g, "") === "") {
            result.message = "메인 영상 주소를 입력해주세요.";
        } else if (!Regular.VIDEO_URL.test(main_video)) {
            result.message = "메인 영상은\nYoutube, vimeo 동영상 주소만 가능합니다.";
        } else if (!utils.isArray(video_list)) {
            result.message = "포트폴리오 영상 주소를 입력해주세요.";
        } else if (!thumbImg) {
            result.message = "썸네일 이미지를 등록해주세요.";
        } else {
            if (utils.isArray(portfolio)) {
                result.portfolio = portfolio.reduce((rs, p, i) => {
                    if (Number(p.display_order) !== (i + 1)) {
                        result.updatePortfolio = true;
                    }

                    rs.push({
                        portfolio_no: p.portfolio_no,
                        display_order: i + 1,
                        portfolio_img: p.portfolio_img,
                        width: p.width,
                        height: p.height
                    });
                    return rs;
                }, []);
            }

            let index = 1;
            result.main_video = main_video;
            result.status = true;
            result.video_list = video_list.reduce((r, o, i) => {
                if (Number(o.display_order) !== (index)) {
                    result.updateVideo = true;
                }

                if (o.portfolio_video.replace(/\s/, "")) {
                    if (!Regular.VIDEO_URL.test(o.portfolio_video)) {
                        result.message = "포트폴리오 영상은\nYoutube, vimeo 동영상 주소만 가능합니다.";
                        result.status = false;
                    }
                    r.push({
                        display_order: index + 1,
                        portfolio_video: o.portfolio_video
                    });
                    index += 1;
                }

                return r;
            }, []);

            if (result.video_list.length < 3) {
                result.status = false;
                result.message = "포트폴리오 영상은 최소 3개 이상 입력해주세요.";
            }
        }

        return result;
    }

    /**
     * 진행현황 체크
     */
    checkProgress() {
        const props = {};

        const category = this.getCategory();

        if (!this.isValidateBasic().status) {
            props.path = "basic";
        } else if (!this.isValidateOption().status && !this.isBiz()) {
            props.path = "option";
        } else if (!this.isValidateContent().status) {
            props.path = "detail";
        } else {
            props.path = "portfolio";
        }

        return props;
    }
}

export default new ProductObject();
