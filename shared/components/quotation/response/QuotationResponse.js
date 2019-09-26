import redirect from "mobile/resources/management/redirect";
import utils from "forsnap-utils";
import API from "forsnap-api";
import PopModal from "shared/components/modal/PopModal";
import { CATEGORY_KEYS, STATUS } from "shared/constant/quotation.const";

export const STATE = {
    OFFER_NO: "offer_no",       // 견적서 번호
    PRODUCT_NO: "product_no",   // 포트폴리오용 상품 번호
    PORTFOLIO_NO: "portfolio_no", // 견적서용 포트폴리오 번호
    USER: {
        key: "user",            // 객체 키
        NAME: "name",           // 이름
        PHONE: "phone",         // 연락처
        EMAIL: "email"          // 이메일
    },
    OPTIONS: {
        key: "artist_options",         // 객체 키
        CATEGORY: "category",   // 촬영유형
        REGION: "region",       // 촬영지역
        DATE: "date",           // 촬영날짜
        TIME: "time",            // 촬영시간
        PERSON: "person_cnt",   // 촬영인원
        QUANTITY: "product_cnt", // 제품 수
        // SIZE: "product_size",   // 제품크기
        DIRECTION: "make_cnt",  // 연출사진 컷수
        OUTLINE: "path_cnt",    // 누끼사진 컷수
        PLACE: "place",         // 장소섭외
        STUDIO: "studio",       // 스튜디오 대여
        MODEL: "model",         // 전문모델
        BEAUTY: "beauty",       // 헤어/메이크업
        CLOTHES: "dress",       // 의상대여
        PRINT: "print",         // 인화(앨범)
        CONCEPT: "concept_cnt", // 컨셉 수
        INSIDE: "in_cnt",       // 내부컷수
        OUTSIDE: "out_cnt"      // 외부컷수
    },
    OPTION_PRICE: {
        key: "option",
        NAME: "option_name",
        PRICE: "option_price",
        COUNT: "count",
        TOTAL_PRICE: "total_price"
    },
    CONTENT: "content",         // 요청사항
    ATTACH: "attach_img",       // 첨부파일
    ATTACH_FILE: "attach",
    UPLOAD_INFO: "upload_info",
    ACCEPT_OPTIONS: "accept_options",
    STATUS: "status",
    DATE: "date",
    CATEGORY_CODES: "category_codes",
    USER_ID: "user_id",
    PREVIOUS_OFFER_CONTENT: "previous_offer_content"
};

const STATE_CONST = {
    [STATE.OPTIONS.PERSON]: {
        key: STATE.OPTIONS.PERSON,
        title: "촬영인원",
        subtitle: undefined,
        unit: "명"
    },
    [STATE.OPTIONS.QUANTITY]: {
        key: STATE.OPTIONS.QUANTITY,
        title: "제품 수",
        subtitle: undefined,
        unit: "개"
    },
    // [STATE.OPTIONS.SIZE]: {
    //     key: STATE.OPTIONS.SIZE,
    //     title: "제품크기",
    //     subtitle: undefined,
    //     unit: "CM"
    // },
    [STATE.OPTIONS.DIRECTION]: {
        key: STATE.OPTIONS.DIRECTION,
        title: "연출사진",
        subtitle: "컷수",
        unit: "장"
    },
    [STATE.OPTIONS.OUTLINE]: {
        key: STATE.OPTIONS.OUTLINE,
        title: "누끼사진",
        subtitle: "컷수",
        unit: "장"
    },
    [STATE.OPTIONS.PLACE]: {
        key: STATE.OPTIONS.PLACE,
        title: "장소섭외",
        subtitle: null
    },
    [STATE.OPTIONS.STUDIO]: {
        key: STATE.OPTIONS.STUDIO,
        title: "스튜디오 대여",
        subtitle: null
    },
    [STATE.OPTIONS.MODEL]: {
        key: STATE.OPTIONS.MODEL,
        title: "전문모델",
        subtitle: null
    },
    [STATE.OPTIONS.BEAUTY]: {
        key: STATE.OPTIONS.BEAUTY,
        title: "헤어/메이크업",
        subtitle: null
    },
    [STATE.OPTIONS.CLOTHES]: {
        key: STATE.OPTIONS.CLOTHES,
        title: "의상대여",
        subtitle: null
    },
    [STATE.OPTIONS.PRINT]: {
        key: STATE.OPTIONS.PRINT,
        title: "인화(앨범)",
        subtitle: null
    },
    [STATE.OPTIONS.CONCEPT]: {
        key: STATE.OPTIONS.CONCEPT,
        title: "컨셉 수",
        subtitle: undefined,
        unit: "개"
    },
    [STATE.OPTIONS.INSIDE]: {
        key: STATE.OPTIONS.INSIDE,
        title: "내부컷수",
        subtitle: undefined,
        unit: "개"
    },
    [STATE.OPTIONS.OUTSIDE]: {
        key: STATE.OPTIONS.OUTSIDE,
        title: "외부컷수",
        subtitle: undefined,
        unit: "개"
    }
};

class QuotationResponse {
    constructor() {
        this.init();
    }

    init() {
        this._state = {
            [STATE.OFFER_NO]: null,
            [STATE.PRODUCT_NO]: null,
            [STATE.PORTFOLIO_NO]: null,
            [STATE.USER.key]: {
                [STATE.USER.NAME]: "",
                [STATE.USER.PHONE]: "",
                [STATE.USER.EMAIL]: ""
            },
            [STATE.OPTIONS.key]: {
                [STATE.OPTIONS.REGION]: null,
                [STATE.OPTIONS.DATE]: null,
                [STATE.OPTIONS.TIME]: null,
                [STATE.OPTIONS.PERSON]: null,
                [STATE.OPTIONS.QUANTITY]: null,
                // [STATE.OPTIONS.SIZE]: null,
                [STATE.OPTIONS.DIRECTION]: null,
                [STATE.OPTIONS.OUTLINE]: null,
                [STATE.OPTIONS.PLACE]: null,
                [STATE.OPTIONS.STUDIO]: null,
                [STATE.OPTIONS.MODEL]: null,
                [STATE.OPTIONS.BEAUTY]: null,
                [STATE.OPTIONS.CLOTHES]: null,
                [STATE.OPTIONS.PRINT]: null,
                [STATE.OPTIONS.CONCEPT]: null,
                [STATE.OPTIONS.INSIDE]: null,
                [STATE.OPTIONS.OUTSIDE]: null
            },
            [STATE.OPTION_PRICE.key]: [],
            [STATE.CONTENT]: "",
            [STATE.ATTACH]: [],
            [STATE.ATTACH_FILE]: [],
            [STATE.UPLOAD_INFO]: {},
            [STATE.ACCEPT_OPTIONS]: {
                [CATEGORY_KEYS.PRODUCT]: [
                    STATE_CONST[STATE.OPTIONS.QUANTITY],
                    // STATE_CONST[STATE.OPTIONS.SIZE],
                    STATE_CONST[STATE.OPTIONS.DIRECTION],
                    STATE_CONST[STATE.OPTIONS.OUTLINE]
                ],
                [CATEGORY_KEYS.FOOD]: [
                    STATE_CONST[STATE.OPTIONS.QUANTITY],
                    // STATE_CONST[STATE.OPTIONS.SIZE],
                    STATE_CONST[STATE.OPTIONS.DIRECTION],
                    STATE_CONST[STATE.OPTIONS.OUTLINE]
                ],
                [CATEGORY_KEYS.AD]: [
                    STATE_CONST[STATE.OPTIONS.CONCEPT],
                    STATE_CONST[STATE.OPTIONS.PLACE],
                    STATE_CONST[STATE.OPTIONS.MODEL],
                    STATE_CONST[STATE.OPTIONS.BEAUTY],
                    STATE_CONST[STATE.OPTIONS.CLOTHES]
                ],
                [CATEGORY_KEYS.PROFILE]: [
                    STATE_CONST[STATE.OPTIONS.PERSON],
                    STATE_CONST[STATE.OPTIONS.STUDIO],
                    STATE_CONST[STATE.OPTIONS.BEAUTY],
                    STATE_CONST[STATE.OPTIONS.CLOTHES]
                ],
                [CATEGORY_KEYS.EVENT]: [
                    STATE_CONST[STATE.OPTIONS.PERSON]
                ],
                [CATEGORY_KEYS.INTERIOR]: [
                    STATE_CONST[STATE.OPTIONS.INSIDE],
                    STATE_CONST[STATE.OPTIONS.OUTSIDE]
                ],
                [CATEGORY_KEYS.WEDDING]: [
                    STATE_CONST[STATE.OPTIONS.CONCEPT],
                    STATE_CONST[STATE.OPTIONS.STUDIO],
                    STATE_CONST[STATE.OPTIONS.BEAUTY],
                    STATE_CONST[STATE.OPTIONS.CLOTHES],
                    STATE_CONST[STATE.OPTIONS.PRINT]
                ],
                [CATEGORY_KEYS.BABY]: [
                    STATE_CONST[STATE.OPTIONS.PERSON],
                    STATE_CONST[STATE.OPTIONS.CONCEPT],
                    STATE_CONST[STATE.OPTIONS.STUDIO],
                    STATE_CONST[STATE.OPTIONS.BEAUTY],
                    STATE_CONST[STATE.OPTIONS.CLOTHES],
                    STATE_CONST[STATE.OPTIONS.PRINT]
                ],
                [CATEGORY_KEYS.SNAP]: [
                    STATE_CONST[STATE.OPTIONS.PERSON],
                    STATE_CONST[STATE.OPTIONS.BEAUTY],
                    STATE_CONST[STATE.OPTIONS.CLOTHES],
                    STATE_CONST[STATE.OPTIONS.PRINT]
                ],
                [CATEGORY_KEYS.VIDEO]: [],
                [CATEGORY_KEYS.VIDEO_BIZ]: [],
                [CATEGORY_KEYS.PROFILE_BIZ]: [
                    STATE_CONST[STATE.OPTIONS.PERSON],
                    STATE_CONST[STATE.OPTIONS.STUDIO],
                    STATE_CONST[STATE.OPTIONS.BEAUTY],
                    STATE_CONST[STATE.OPTIONS.CLOTHES]
                ],
                [CATEGORY_KEYS.FASHION]: [
                    STATE_CONST[STATE.OPTIONS.QUANTITY],
                    STATE_CONST[STATE.OPTIONS.DIRECTION],
                    STATE_CONST[STATE.OPTIONS.OUTLINE]
                ]
            },
            [STATE.STATUS]: "",
            [STATE.DATE]: "",
            [STATE.CATEGORY_CODES]: [],
            isProcess: false
        };
    }

    /**
     * 처리상태 변경
     * @param b
     */
    setProcess(b) {
        if (b) {
            this._state.isProcess = true;
            PopModal.progress();
        } else {
            this._state.isProcess = false;
            PopModal.closeProgress();
        }
    }

    /**
     * 현재 처리상태
     * @return {boolean}
     */
    getProcess() {
        return this._state.isProcess;
    }

    setState(key, value) {
        this._state[key] = value;
        return { [key]: this._state[key] };
    }

    /**
     * User데이터 업데이트 (작가 기본정보)
     * @param key - String (STATE.USER 키값)
     * @param value
     * @return {{}}
     */
    setUserState(key, value) {
        this._state[STATE.USER.key][key] = value;
        return { [STATE.USER.key]: this._state[STATE.USER.key] };
    }

    /**
     * Options데이터 업데이트 (옵션의 가능여부)
     * @param key - String (STATE.Options 키값)
     * @param value
     * @return {{}}
     */
    setOptionState(key, value) {
        this._state[STATE.OPTIONS.key][key] = value;
        return { [STATE.OPTIONS.key]: this._state[STATE.OPTIONS.key] };
    }

    /**
     * OptionPrice데이터 업데이트 (옵션별 가격정보)
     * @param index - Number (옵션 인덱스, -1은 옵션추가)
     * @param data - Object
     * @return {{}}
     */
    setOptionPriceState(index, data) {
        const optionPrice = this._state[STATE.OPTION_PRICE.key];

        if (index === -1) {
            const find = optionPrice.findIndex(obj => {
                const opn = obj[STATE.OPTION_PRICE.NAME];
                return opn !== "" && opn === data[STATE.OPTION_PRICE.NAME];
            });

            if (find === -1) {
                optionPrice.push(data);
            }
        } else if (optionPrice.length > index) {
            optionPrice[index] = data;
        }

        const required = optionPrice.findIndex(o => {
            return o[STATE.OPTION_PRICE.NAME] === "촬영비용";
        });

        if (required === -1) {
            optionPrice.unshift({
                key: 0,
                [STATE.OPTION_PRICE.NAME]: "촬영비용",
                [STATE.OPTION_PRICE.PRICE]: "",
                [STATE.OPTION_PRICE.COUNT]: "",
                [STATE.OPTION_PRICE.TOTAL_PRICE]: ""
            });
        } else if (required !== 0) {
            optionPrice.unshift(optionPrice.splice(required, 1));
        }

        return { [STATE.OPTION_PRICE.key]: this._state[STATE.OPTION_PRICE.key] };
    }

    /**
     * OptionPrice데이터 삭제
     * @param index - Number (삭제할 옵션 인덱스)
     * @return {{}}
     */
    deleteOptionPriceState(index) {
        const optionPrice = this._state[STATE.OPTION_PRICE.key];
        optionPrice.splice(index, 1);
        return { [STATE.OPTION_PRICE.key]: this._state[STATE.OPTION_PRICE.key] };
    }

    /**
     * Object형태의 데이터에서 필요한 데이터만 추출
     * @param data
     */
    setAllState(data) {
        if (data) {
            const keys = Object.keys(STATE);
            for (let i = 0; i < keys.length; i += 1) {
                const key = keys[i];

                if (key === "OPTION_PRICE") {
                    const opKey = STATE[key];
                    const optionPriceData = data[opKey.key] || [];
                    const optionPrice = optionPriceData.reduce((r, o, index) => {
                        const op = {
                            key: index,
                            [opKey.NAME]: o[opKey.NAME] || "",
                            [opKey.PRICE]: Number(o[opKey.PRICE]) || 0,
                            [opKey.COUNT]: Number(o[opKey.COUNT]) || 1
                        };
                        op[opKey.TOTAL_PRICE] = Number(o[opKey.TOTAL_PRICE]) || (op[opKey.PRICE] * op[opKey.COUNT]);
                        r.push(op);
                        return r;
                    }, []);

                    const required = optionPrice.findIndex(o => {
                        return o[STATE.OPTION_PRICE.NAME] === "촬영비용";
                    });

                    if (required === -1) {
                        optionPrice.unshift({
                            key: 0,
                            [STATE.OPTION_PRICE.NAME]: "촬영비용",
                            [STATE.OPTION_PRICE.PRICE]: "",
                            [STATE.OPTION_PRICE.COUNT]: "",
                            [STATE.OPTION_PRICE.TOTAL_PRICE]: ""
                        });
                    } else if (required !== 0) {
                        optionPrice.unshift(optionPrice.splice(required, 1));
                    }

                    this._state[opKey.key] = optionPrice;
                } else if (typeof STATE[key] === "object") {
                    const objKey = Object.keys(STATE[key]);
                    const values = this._state[STATE[key].key];

                    for (let j = 0; j < objKey.length; j += 1) {
                        const key2 = objKey[j];
                        if (key2 !== "key") {
                            const key2Value = STATE[key][key2];
                            const value = data[key2Value];

                            if (value || value === "") {
                                values[key2Value] = value;
                            }
                        }
                    }

                    this._state[STATE[key].key] = values;
                } else {
                    try {
                        const keyValue = STATE[key];
                        const value = data[keyValue];
                        if (value) {
                            this._state[keyValue] = value;
                        }
                    } catch (e) {
                        //
                    }
                }
            }
        }
    }

    /**
     * 데이터 가져오기
     * @param key
     * @return {*}
     */
    getState(key = null) {
        if (key) {
            return this._state[key];
        }

        return this._state;
    }

    /**
     * 스넵, 프로필 카테고리 여부
     * @return {boolean}
     */
    isExceptPrice() {
        const options = this.getState(STATE.OPTIONS.key);

        return [
            CATEGORY_KEYS.SNAP,
            CATEGORY_KEYS.PROFILE].indexOf(options[STATE.OPTIONS.CATEGORY]) !== -1;
    }

    /**
     * API 견적서 상세 조회
     * @param offerNo - String (견적서 번호)
     * @return promis or null
     */
    apiFindOffer(offerNo) {
        if (!this.getProcess()) {
            this.setProcess(true);

            return API.offers.find(offerNo).then(response => {
                this.setProcess(false);

                if (response.status === 200) {
                    const data = response.data;

                    this._state[STATE.OFFER_NO] = data.no;
                    if (data[STATE.UPLOAD_INFO]) {
                        this._state[STATE.UPLOAD_INFO] = data[STATE.UPLOAD_INFO];
                    }

                    this.setAllState(data);
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                PopModal.alert("견적서를 가져오지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                    key: "quotation-order-error",
                    callBack: () => redirect.back()
                });
            });
        }

        return null;
    }

    /**
     * 견적서 기본정보 등록
     * @param orderNo - Number (요청서 번호)
     * @return {*}
     */
    apiRegist(orderNo) {
        if (!this.getProcess()) {
            this.setProcess(true);

            const valid = this.isValidateUser();

            if (!valid.status) {
                this.setProcess(false);
                PopModal.alert(valid.message);
                return null;
            }

            const offerNo = this._state[STATE.OFFER_NO];
            const productNo = this._state[STATE.PRODUCT_NO];
            const portfolioNo = this._state[STATE.PORTFOLIO_NO];

            let test;
            if (portfolioNo) {
                test = {
                    portfolio_no: portfolioNo
                };
            } else {
                test = {
                    product_no: productNo
                };
            }

            if (offerNo) {
                return API.offers.modifyProducts(offerNo, { ...test }).then(response => {
                    this.setProcess(false);

                    if (response.status === 200) {
                        const data = response.data;
                        this._state[STATE.STATUS] = data[STATE.STATUS];

                        if (data[STATE.UPLOAD_INFO]) {
                            this._state[STATE.UPLOAD_INFO] = data[STATE.UPLOAD_INFO];
                        }
                    }

                    return response;
                }).catch(error => {
                    this.setProcess(false);
                    PopModal.alert("변경사항을 저장하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                        key: "quotation-regist-error",
                        callBack: () => redirect.back()
                    });
                });
            }

            return API.offers.regist({ order_no: orderNo, ...test }).then(response => {
                this.setProcess(false);
                if (response.status === 200) {
                    const data = response.data;
                    this._state[STATE.OFFER_NO] = data.offer_no;
                    this._state[STATE.STATUS] = data[STATE.STATUS];
                    if (data[STATE.UPLOAD_INFO]) {
                        this._state[STATE.UPLOAD_INFO] = data[STATE.UPLOAD_INFO];
                    }
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                const message = error && error.data ? error.data : "견적서를 생성하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.";
                PopModal.alert(message, {
                    key: "quotation-regist-error",
                    callBack: () => redirect.back()
                });

                return error;
            });
        }

        return null;
    }

    /**
     * API 견적서 컷옵션 수정
     * @return promis or null
     */
    apiQuantity() {
        if (!this.getProcess()) {
            this.setProcess(true);

            const valid = this.isValidateOptions();

            if (!valid.status) {
                this.setProcess(false);
                PopModal.alert(valid.message);
                return null;
            }

            const offerNo = this._state[STATE.OFFER_NO];
            return API.offers.quantity(offerNo, valid.data).then(response => {
                this.setProcess(false);

                if (response.status === 200) {
                    const data = response.data;
                    this._state[STATE.STATUS] = data[STATE.STATUS];
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                PopModal.alert("옵션정보를 저장하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                    key: "quotation-quantity-error",
                    callBack: () => redirect.back()
                });
            });
        }

        return null;
    }

    /**
     * API 견적서 옵션명, 가격
     * @return {*}
     */
    apiOption() {
        if (!this.getProcess()) {
            this.setProcess(true);

            const valid = this.isValidatePrice();

            if (!valid.status) {
                this.setProcess(false);
                PopModal.alert(valid.message);
                return null;
            }

            const offerNo = this._state[STATE.OFFER_NO];
            const opKey = STATE.OPTION_PRICE;
            return API.offers.option(offerNo, { [opKey.key]: JSON.stringify(valid.data) }).then(response => {
                this.setProcess(false);

                const data = response.data;
                if (data[opKey.key]) {
                    this._state[opKey.key] = data[opKey.key].reduce((r, o, index) => {
                        r.push({
                            key: index,
                            [opKey.NAME]: o[opKey.NAME] || "",
                            [opKey.PRICE]: Number(o[opKey.PRICE]) || "",
                            [opKey.COUNT]: Number(o[opKey.COUNT]) || "",
                            [opKey.TOTAL_PRICE]: Number(o[opKey.TOTAL_PRICE]) || ""
                        });
                        return r;
                    }, []);
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                PopModal.alert("가격정보를 저장하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                    key: "quotation-order-error"
                });
            });
        }

        return null;
    }

    /**
     * API 견적서 상세 수정
     * @return {*}
     */
    apiContent() {
        if (!this.getProcess()) {
            this.setProcess(true);

            const content = this._state[STATE.CONTENT];
            const valid = this.isValidateContent();

            if (!valid.status) {
                this.setProcess(false);
                PopModal.alert(valid.message);
                return null;
            }

            const offerNo = this._state[STATE.OFFER_NO];
            return API.offers.content(offerNo, { content }).then(response => {
                this.setProcess(false);

                if (response.status === 200) {
                    const data = response.data;
                    this._state[STATE.STATUS] = data[STATE.STATUS];
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                PopModal.alert("상세정보를 저장하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                    key: "quotation-content-error"
                });
            });
        }

        return null;
    }

    /**
     * API 견적서 제출
     * @return {*}
     */
    apiSubmit() {
        if (!this.getProcess()) {
            this.setProcess(true);

            const validUser = this.isValidateUser();
            const validOptions = this.isValidateOptions();
            const validPrice = this.isValidatePrice();
            const validContent = this.isValidateContent();

            let validMessage;

            if (!validUser.status) {
                validMessage = validUser.message;
            } else if (!validOptions.status) {
                validMessage = validOptions.message;
            } else if (!validPrice.status) {
                validMessage = validPrice.message;
            } else if (!validContent.status) {
                validMessage = validContent.message;
            }

            if (validMessage) {
                this.setProcess(false);
                PopModal.alert(validMessage);
                return null;
            }

            const offerNo = this._state[STATE.OFFER_NO];
            return API.offers.submit(offerNo).then(response => {
                this.setProcess(false);

                if (response.status === 200) {
                    const data = response.data;
                    this._state[STATE.STATUS] = data[STATE.STATUS];
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                PopModal.alert("견적서를 등록하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                    key: "quotation-order-error"
                });
            });
        }

        return null;
    }

    /**
     * 진행현황 체크
     */
    checkProgress() {
        const props = {};

        switch (this._state[STATE.STATUS]) {
            case STATUS.BASIC.key:
                props.status = STATUS.BASIC;
                props.path = "option";
                break;
            // case STATUS.QUANTITY.key:
            //     props.status = STATUS.QUANTITY;
            //     props.path = "option";
            //     break;
            case STATUS.OPTION.key:
                props.status = STATUS.OPTION;
                props.path = "content";
                break;
            case STATUS.CONTENT.key:
                props.status = STATUS.CONTENT;
                props.path = "submit";
                break;
            case STATUS.REQUEST.key:
                props.status = STATUS.REQUEST;
                props.path = "basic";
                break;
            case STATUS.COMPLETE.key:
                props.status = STATUS.COMPLETE;
                props.path = "basic";
                break;
            case STATUS.PROGRESS.key:
            case STATUS.RETURN.key:
            default:
                props.status = STATUS.COMPLETE;
                props.path = "complete";
                break;
        }

        // if (!this.isValidateUser().status) {
        //     props.path = "basic";
        // } else if (!this.isValidateOptions().status) {
        //     props.path = "quantity";
        // } else if (!this.isValidatePrice().status) {
        //     props.path = "option";
        // } else if (!this.isValidateContent().status) {
        //     props.path = "content";
        // } else if ([
        //     STATUS.REQUEST.key,
        //     STATUS.PROGRESS.key,
        //     STATUS.COMPLETE.key,
        //     STATUS.RETURN.key].indexOf(this._state[STATE.STATUS]) === -1
        // ) {
        //     props.path = "submit";
        // } else {
        //     props.path = "complete";
        // }

        return props;
    }

    /**
     * s3 업로드
     * @param file - File
     * @param is_image - Bool
     * @return {Promise}
     */
    uploadS3(file, is_image = true) {
        return new Promise((resolve, reject) => {
            const uploadInfo = this._state[STATE.UPLOAD_INFO];
            const result = {
                status: false,
                message: ""
            };

            const isCheckExtForFlag = (flag, ex) => {
                let message = "";
                if (flag && !(/(jpg|jpeg|png|bmp)$/i).test(ex)) {
                    message = "파일 업로드는\nJPG, JPEG, PNG, BMP 확장자만 가능합니다";
                }

                if (!flag && !(/(pdf|xls|xlsx|ppt|pptx|zip)$/i).test(ex)) {
                    message = "파일 업로드는\nJPG, JPEG, PNG, BMP 확장자만 가능합니다";
                }

                return message;
            };

            let ext = "";

            if (!file) {
                result.message = "업로드할 파일이 없습니다";
            } else if (!uploadInfo) {
                result.message = "잘못된 업로드 정보입니다";
            } else {
                ext = utils.fileExtension(file.name);
                result.message = isCheckExtForFlag(is_image, ext);
                if (!result.message) {
                    if (!is_image) {
                        result.file_name = file.name;
                    }
                    result.status = true;
                }
            }

            if (result.status) {
                result.status = false;

                const form = new FormData();
                result.uploadKey = `${uploadInfo.key}${utils.uniqId()}.${ext}`;

                form.append("key", result.uploadKey);
                form.append("acl", uploadInfo.acl);
                form.append("policy", uploadInfo.policy);
                form.append("X-Amz-Credential", uploadInfo["X-Amz-Credential"]);
                form.append("X-Amz-Algorithm", uploadInfo["X-Amz-Algorithm"]);
                form.append("X-Amz-Date", uploadInfo["X-Amz-Date"]);
                form.append("X-Amz-Signature", uploadInfo["X-Amz-Signature"]);
                form.append("file", file);

                API.common.uploadS3(uploadInfo.action, form).then(res => {
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

    /**
     * 첨부 삭제
     * @param offerNo - 견적서 번호
     * @param no - 첨부파일 번호
     * @return { null or promise}
     */
    deleteAttach(offerNo, no) {
        if (!this.getProcess()) {
            this.setProcess(true);
            return new Promise((resolv, reject) => {
                PopModal.confirm("첨부파일을 삭제하시겠습니까?", () => {
                    API.offers.deleteAttach(offerNo, no).then(response => {
                        this.setProcess(false);
                        resolv(response);
                    }).catch(error => {
                        this.setProcess(false);
                        reject(error);
                    });
                }, () => {
                    this.setProcess(false);
                    resolv();
                });
            });
        }

        return null;
    }

    previousContentLoad(id) {
        if (!this.getProcess()) {
            this.setProcess(true);
            return new Promise((resolve, reject) => {
                API.offers.getSelfOfferContent(id).then(response => {
                    this.setProcess(false);
                    resolve(response);
                }).catch(error => {
                    this.setProcess(false);
                    reject(error);
                });
            });
        }

        return null;
    }

    /**
     * 촬영비용 기본가격 찾기
     * @return Object
     */
    findPrimaryPrice() {
        const optionPrice = this._state[STATE.OPTION_PRICE.key];
        return optionPrice.find(obj => {
            return obj[STATE.OPTION_PRICE.NAME] === "촬영비용";
        });
    }

    /**
     * 견적요청자 데이터 검증
     * @return {{status: boolean, message: string}}
     */
    isValidateUser() {
        const result = {
            status: false,
            message: ""
        };

        // const user = this._state[STATE.USER.key];
        // const name = user[STATE.USER.NAME];
        // const phone = user[STATE.USER.PHONE];
        // const email = user[STATE.USER.EMAIL];
        const productNo = this._state[STATE.PRODUCT_NO];
        const portfolioNo = this._state[STATE.PORTFOLIO_NO];

        // if (name.replace(/\s/g, "") === "") {
        //     result.message = "예약자를 입력해주세요";
        // } else if (name.length > 15) {
        //     result.message = "예약자는 15자 이하로 입력 가능합니다";
        // } else if (phone.replace(/([^0-9]+)/g, "") === "") {
        //     result.message = "연락처를 입력해주세요";
        // } else if (phone.length < 10 || phone.length > 11) {
        //     result.message = "연락처는 `-`없이 10 ~ 11자 사이로 입력해주세요";
        // } else if (email.length > 1 && !utils.isValidEmail(email)) {
        //     result.message = "이메일을 정확하게 입력해주세요";
        // } else
        if ((!productNo && !portfolioNo) ||
            isNaN(productNo) ||
            isNaN(portfolioNo)
            || (productNo && (productNo * 1) < 1)
            || (portfolioNo && (portfolioNo * 1) < 1)) {
            result.message = "포트폴리오를 선택해주세요";
        } else {
            result.status = true;
        }

        return result;
    }

    /**
     * 견적서 컷옵션 데이터 검증
     * @return {{status: boolean, message: string}}
     */
    isValidateOptions() {
        const result = {
            status: false,
            message: "",
            data: {}
        };

        const options = this._state[STATE.OPTIONS.key];
        const categoryValue = options[STATE.OPTIONS.CATEGORY];
        let accept;

        if (categoryValue) {
            accept = this._state[STATE.ACCEPT_OPTIONS][categoryValue.toUpperCase()];
        }

        if (accept) {
            // result.data[STATE.OPTIONS.REGION] = options[STATE.OPTIONS.REGION];
            // result.data[STATE.OPTIONS.DATE] = options[STATE.OPTIONS.DATE];
            // result.data[STATE.OPTIONS.TIME] = options[STATE.OPTIONS.TIME];

            // if (!options[STATE.OPTIONS.REGION]) {
            //     result.message = "촬영지역의 가능여부를 선택해주세요";
            // } else if (!options[STATE.OPTIONS.DATE]) {
            //     result.message = "촬영날짜의 가능여부를 선택해주세요";
            // } else if (!options[STATE.OPTIONS.TIME]) {
            //     result.message = "촬영시간의 가능여부를 선택해주세요";
            // } else {
            //     for (let i = 0; i < accept.length; i += 1) {
            //         const obj = accept[i];
            //         const key = obj.key;
            //         const value = options[key];
            //         result.data[key] = value;
            //
            //         if (!value && value !== "") {
            //             result.message = `${obj.title}을(를) 선택해주세요`;
            //             break;
            //         }
            //     }
            // }

            if (result.message === "") {
                result.status = true;
            }
        } else {
            result.message = "잘못된 카테고리입니다";
        }

        return result;
    }

    /**
     * 견적서 컷옵션 데이터 검증
     * @return {{status: boolean, message: string}}
     */
    isValidatePrice() {
        const result = {
            status: false,
            message: "",
            data: []
        };

        const opKey = STATE.OPTION_PRICE;
        const optionPrice = this._state[opKey.key];
        // const isExceptPrice = this.isExceptPrice();

        const required = optionPrice.find(o => o[opKey.NAME] === "촬영비용");
        const rPrice = required[opKey.PRICE];
        const rCount = required[opKey.COUNT];

        if (!required) {
            result.message = "촬영비용 항목은 필수입니다.";
        } else if (rPrice === "" || isNaN(Number(rPrice))) {
            result.message = "촬영비용 단가를 입력해주세요.";
        } else if (rCount === "" || isNaN(Number(rCount))) {
            result.message = "촬영비용 단위를 입력해주세요.";
        } else if (rPrice * rCount < 1) {
            result.message = "촬영비용 금액은 0원 이상만 가능합니다.";
        } else {
            let totalPrice = 0;
            for (let i = 0; i < optionPrice.length; i += 1) {
                const option = optionPrice[i];

                if (option[opKey.NAME]
                    || option[opKey.PRICE]
                    || option[opKey.COUNT]
                ) {
                    if (option[opKey.NAME].replace(/\s/g, "") === "") {
                        result.message = "옵션 제목을 입력해주세요.";
                        break;
                    } else {
                        const price = option[opKey.PRICE];
                        const count = option[opKey.COUNT];

                        if (price === "") {
                            result.message = `${option[opKey.NAME]} 옵션의 단가를 입력해주세요.`;
                            break;
                        } else if (count === "") {
                            result.message = `${option[opKey.NAME]} 옵션의 단위를 입력해주세요.`;
                            break;
                        }

                        totalPrice += Number(price) * Number(count);
                        result.data.push({
                            [opKey.NAME]: option[opKey.NAME] || "",
                            [opKey.PRICE]: option[opKey.PRICE] || 0,
                            [opKey.COUNT]: option[opKey.COUNT] || 0,
                            [opKey.TOTAL_PRICE]: Number(option[opKey.TOTAL_PRICE]) || 0
                        });
                    }
                }
            }

            if (!result.message && totalPrice < 5000) {
            // if (isExceptPrice && totalPrice < 25000) {
                result.message = "총 촬영비용은 포스냅 정책에 따라 5,000원 이상만 등록이 가능합니다.";
            }
            // else if (!isExceptPrice && totalPrice < 100000) {
            //     result.message = "총 촬영비용은 포스냅 정책에 따라 10만 원 이상만 등록이 가능합니다.";
            // }
        }

        if (result.message === "") {
            result.status = true;
        }

        return result;
    }

    /**
     * 첨부 삭제
     * @param offer_no - 의뢰서 번호
     * @param no - 첨부파일 번호
     * @return { null or promise}
     */
    deleteAttachFile(offer_no, no) {
        if (!this.getProcess()) {
            this.setProcess(true);
            return new Promise((resolv, reject) => {
                PopModal.confirm("첨부파일을 삭제하시겠습니까?", () => {
                    API.offers.deleteAttachFile(offer_no, no).then(response => {
                        this.setProcess(false);
                        resolv(response);
                    }).catch(error => {
                        this.setProcess(false);
                        reject(error);
                    });
                }, () => {
                    this.setProcess(false);
                    resolv();
                });
            });
        }

        return null;
    }

    /**
     * 견적서 상세 데이터 검증
     * @return {{status: boolean, message: string}}
     */
    isValidateContent() {
        const result = {
            status: false,
            message: ""
        };

        const content = this._state[STATE.CONTENT];

        if (content.replace(/\s/g, "") === "") {
            result.message = "작가님의 촬영컨셉 특징을 설명해주세요";
        } else if (content.length > 1000) {
            result.message = "촬영컨셉 및 특징은\n1000자 이하로 입력 가능합니다";
        } else if (utils.isValidDomain(content)) {
            result.message = "촬영관련 요청사항에는\n홈페이지 주소를 입력할 수 없습니다.";
        } else {
            result.status = true;
        }

        return result;
    }
}

export default new QuotationResponse();
