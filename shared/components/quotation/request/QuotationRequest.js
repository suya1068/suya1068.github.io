import redirect from "mobile/resources/management/redirect";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";
import auth from "forsnap-authentication";
import API from "forsnap-api";
import PopModal from "shared/components/modal/PopModal";
import { CATEGORY_KEYS, STATUS, ADDRESS_LIST } from "shared/constant/quotation.const";

export const STATE = {
    ORDER_NO: "order_no",       // 의뢰서 번호
    USER: {
        key: "user",            // 객체 키
        NAME: "name",           // 이름
        PHONE: "phone",         // 연락처
        EMAIL: "email"          // 이메일
    },
    PHONE: {
        key: "phone",
        START: "start",
        CENTER: "center",
        END: "end"
    },
    RESERVE: {
        key: "reserve",         // 객체 키
        CATEGORY: "category",   // 촬영유향
        REGION: "region",       // 촬영지역
        DATE: "date",           // 촬영날짜
        TIME: "time"            // 촬영시간
    },
    OPTIONS: {
        key: "options",         // 객체 키
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
    CONTENT: "content",         // 요청사항
    //BUDGET: "budget",           // 예산
    //COUNSEL: "counsel",           // 전화상담 여부
    //MEETING: "meeting",           // 미팅 여부
    ATTACH: "attach_img",       // 첨부파일-이미지
    ATTACH_FILE: "attach",
    UPLOAD_INFO: "upload_info",
    ACCEPT_OPTIONS: "accept_options",
    STATUS: "status",
    DATE: "date",
    CATEGORY_CODES: "category_codes",
    OFFER: "offer",
    USER_ID: "user_id",
    AGREE: "agree",
    //guest estimate
    TEMP_USER_ID: "temp_user_id"
    //COUNSEL_TIME: "counsel_time"
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

export const CONST = {
    dateOption: ["가능한 빨리", "한 달 이내", "이번 달", "이번 주 내"],
    timeOption: ["오전", "오후", "반나절", "종일", "1시간", "2시간"],
    counselTimeOption: ["가능한빨리", "1~2시간이내", "직접입력"]
};

class QuotationRequest {
    constructor() {
        this.init();
    }

    init() {
        this._state = {
            [STATE.ORDER_NO]: null,
            [STATE.TEMP_USER_ID]: sessionStorage.getItem(STATE.TEMP_USER_ID) || null,
            [STATE.USER.key]: {
                [STATE.USER.NAME]: "",
                [STATE.USER.PHONE]: "",
                [STATE.USER.EMAIL]: ""
            },
            [STATE.PHONE.key]: {
                [STATE.PHONE.START]: "010",
                [STATE.PHONE.CENTER]: "",
                [STATE.PHONE.END]: ""
            },
            [STATE.RESERVE.key]: {
                [STATE.RESERVE.CATEGORY]: "",
                [STATE.RESERVE.REGION]: "",
                [STATE.RESERVE.DATE]: null,
                [STATE.RESERVE.TIME]: null
            },
            [STATE.OPTIONS.key]: {
                [STATE.OPTIONS.PERSON]: "NA",
                [STATE.OPTIONS.QUANTITY]: "NA",
                // [STATE.OPTIONS.SIZE]: "NA",
                [STATE.OPTIONS.DIRECTION]: null,
                [STATE.OPTIONS.OUTLINE]: null,
                [STATE.OPTIONS.PLACE]: null,
                [STATE.OPTIONS.STUDIO]: null,
                [STATE.OPTIONS.MODEL]: null,
                [STATE.OPTIONS.BEAUTY]: null,
                [STATE.OPTIONS.CLOTHES]: null,
                [STATE.OPTIONS.PRINT]: null,
                [STATE.OPTIONS.CONCEPT]: "NA",
                [STATE.OPTIONS.INSIDE]: "NA",
                [STATE.OPTIONS.OUTSIDE]: "NA"
            },
            [STATE.CONTENT]: "",
            //[STATE.BUDGET]: "",
            //[STATE.COUNSEL]: "",
            //[STATE.MEETING]: "",
            //[STATE.COUNSEL_TIME]: "",
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
                    // STATE_CONST[STATE.OPTIONS.QUANTITY],
                    {
                        key: STATE.OPTIONS.QUANTITY,
                        title: "음식 수",
                        subtitle: undefined,
                        unit: "개"
                    },
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
            [STATE.AGREE]: false,
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
     * User데이터 업데이트
     * @param key - String (STATE.USER 키값)
     * @param value
     * @return {*}
     */
    setUserState(key, value) {
        this._state[STATE.USER.key][key] = value;
        return { [STATE.USER.key]: this._state[STATE.USER.key] };
    }

    /**
     * Reserve데이터 업데이트
     * @param key - String (STATE.RESERVE 키값)
     * @param value
     * @return {*}
     */
    setReserveState(key, value) {
        this._state[STATE.RESERVE.key][key] = value;
        return { [STATE.RESERVE.key]: this._state[STATE.RESERVE.key] };
    }

    /**
     * Options데이터 업데이트
     * @param key - String (STATE.Options 키값)
     * @param value
     * @return {*}
     */
    setOptionState(key, value) {
        this._state[STATE.OPTIONS.key][key] = value;
        return { [STATE.OPTIONS.key]: this._state[STATE.OPTIONS.key] };
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
                if (typeof STATE[key] === "object") {
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
     * 예외 카테고리 여부
     * @return {boolean}
     */
    isExcept() {
        const reserve = this.getState(STATE.RESERVE.key);
        return [
            CATEGORY_KEYS.PRODUCT,
            CATEGORY_KEYS.FOOD,
            CATEGORY_KEYS.INTERIOR,
            CATEGORY_KEYS.VIDEO,
            CATEGORY_KEYS.PROFILE,
            CATEGORY_KEYS.PROFILE_BIZ,
            CATEGORY_KEYS.FASHION].indexOf(reserve[STATE.RESERVE.CATEGORY]) !== -1;
    }

    /**
     * 스냅, 프로필 카테고리 여부
     * @return {boolean}
     */
    isExceptPrice() {
        const reserve = this.getState(STATE.RESERVE.key);
        return [
            CATEGORY_KEYS.SNAP,
            CATEGORY_KEYS.PROFILE].indexOf(reserve[STATE.RESERVE.CATEGORY]) !== -1;
    }

    /**
     * API 쵤영의뢰서 조회
     * @param orderNo
     * @return promis or null
     */
    apiFindQuotation(orderNo) {
        if (!this.getProcess()) {
            this.setProcess(true);

            return API.orders.find(orderNo).then(response => {
                this.setProcess(false);

                if (response.status === 200) {
                    // console.log(response);
                    const data = response.data;
                    this._state[STATE.ORDER_NO] = orderNo;
                    this._state[STATE.UPLOAD_INFO] = data[STATE.UPLOAD_INFO];
                    this._state[STATE.STATUS] = data[STATE.STATUS];

                    if (data[STATE.OPTIONS.PERSON] === null) {
                        data[STATE.OPTIONS.PERSON] = "NA";
                    }

                    if (data[STATE.OPTIONS.QUANTITY] === null) {
                        data[STATE.OPTIONS.QUANTITY] = "NA";
                    }

                    // if (data[STATE.OPTIONS.SIZE] === null) {
                    //     data[STATE.OPTIONS.SIZE] = "NA";
                    // }

                    if (data[STATE.OPTIONS.CONCEPT] === null) {
                        data[STATE.OPTIONS.CONCEPT] = "NA";
                    }

                    if (data[STATE.OPTIONS.INSIDE] === null) {
                        data[STATE.OPTIONS.INSIDE] = "NA";
                    }

                    if (data[STATE.OPTIONS.OUTSIDE] === null) {
                        data[STATE.OPTIONS.OUTSIDE] = "NA";
                    }

                    if (data[STATE.CONTENT] === null) {
                        data[STATE.CONTENT] = "";
                    }

                    // if (data[STATE.BUDGET] === null) {
                    //     data[STATE.BUDGET] = "";
                    // }
                    //
                    // if (data[STATE.COUNSEL] === null) {
                    //     data[STATE.COUNSEL] = "";
                    // }
                    //
                    // if (data[STATE.MEETING] === null) {
                    //     data[STATE.MEETING] = "";
                    // }
                    //
                    // if (data[STATE.COUNSEL_TIME] === null) {
                    //     data[STATE.COUNSEL_TIME] = "";
                    // }

                    data[STATE.AGREE] = !!data[STATE.STATUS];

                    this.setAllState(data);

                    if (data[STATE.PHONE.key]) {
                        const phone = data[STATE.PHONE.key];
                        const p = this._state[STATE.PHONE.key];
                        let start = "";
                        let center = "";
                        let end = "";
                        if (phone.length > 9) {
                            start = phone.slice(0, 3);
                            const temp = phone.slice(3);
                            if (temp.length === 7) {
                                center = temp.slice(0, 3);
                                end = temp.slice(3);
                            } else if (temp.length === 8) {
                                center = temp.slice(0, 4);
                                end = temp.slice(4);
                            }
                        }

                        p[STATE.PHONE.START] = start;
                        p[STATE.PHONE.CENTER] = center;
                        p[STATE.PHONE.END] = end;

                        this.setState([STATE.PHONE.key], p);
                    }
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                if (error && error.status === 400) {
                    PopModal.alert(error.data, {
                        key: "quotation-order-error",
                        callBack: () => redirect.back()
                    });
                } else {
                    PopModal.alert("요청서를 가져오지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                        key: "quotation-order-error",
                        callBack: () => redirect.back()
                    });
                }
            });
        }

        return null;
    }

    /**
     * API 촬영의뢰서 등록
     * @return promise or null
     */
    apiRegistQuotation() {
        if (!this.getProcess()) {
            this.setProcess(true);
            const valid = this.isValidateUser();
            if (!valid.status) {
                this.setProcess(false);
                PopModal.alert(valid.message);
                return null;
            }

            const user = this._state[STATE.USER.key];
            return API.orders.register(user).then(response => {
                this.setProcess(false);

                if (response.status === 200) {
                    // console.log(response);
                    const data = response.data;
                    this._state[STATE.ORDER_NO] = data[STATE.ORDER_NO];
                    this._state[STATE.STATUS] = data[STATE.STATUS];

                    if (data[STATE.UPLOAD_INFO]) {
                        this._state[STATE.UPLOAD_INFO] = data[STATE.UPLOAD_INFO];
                    }
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                PopModal.alert("요청서를 생성하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                    key: "quotation-regist-error",
                    callBack: () => redirect.back()
                });
            });
        }

        return null;
    }

    /**
     * API 촬영의뢰서 유저정보 수정
     * @param orderNo - Number (요청서 번호)
     * @return promise or null
     */
    apiUpdateBasic(orderNo) {
        if (!this.getProcess()) {
            this.setProcess(true);

            const valid = this.isValidateUser();
            if (!valid.status) {
                this.setProcess(false);
                PopModal.alert(valid.message);
                return null;
            }

            const user = this._state[STATE.USER.key];

            const stepPhone = this._state[STATE.PHONE.key];
            const p = `${stepPhone.start}${stepPhone.center}${stepPhone.end}`;

            return API.orders.updateBasic(orderNo, user).then(response => {
                this.setProcess(false);

                if (response.status === 200) {
                    // console.log(response);
                    const data = response.data;
                    this._state[STATE.STATUS] = data[STATE.STATUS];
                    if (data[STATE.UPLOAD_INFO]) {
                        this._state[STATE.UPLOAD_INFO] = data[STATE.UPLOAD_INFO];
                    }
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                PopModal.alert("기본정보를 저장하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                    key: "quotation-update-basic-error",
                    callBack: () => redirect.back()
                });
            });
        }

        return null;
    }

    /**
     * API 의뢰서 카테고리,지역,날짜수정
     * @return {*}
     */
    apiReserve() {
        if (!this.getProcess()) {
            this.setProcess(true);
            const valid = this.isValidateReserve();
            if (!valid.status) {
                this.setProcess(false);
                PopModal.alert(valid.message);
                return null;
            }

            const reserve = this._state[STATE.RESERVE.key];
            const orderNo = this._state[STATE.ORDER_NO];
            return API.orders.category(orderNo, reserve).then(response => {
                this.setProcess(false);

                if (response.status === 200) {
                    // console.log(response);
                    const data = response.data;
                    this._state[STATE.STATUS] = data[STATE.STATUS];
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                PopModal.alert("요청정보를 저장하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                    key: "quotation-reserve-error",
                    callBack: () => redirect.back()
                });
            });
        }

        return null;
    }

    // /**
    //  * API 의뢰서 세부사항
    //  * @return {*}
    //  */
    // apiQuantity() {
    //     if (!this.getProcess()) {
    //         this.setProcess(true);
    //         const valid = this.isValidateOptions();
    //         if (!valid.status) {
    //             this.setProcess(false);
    //             PopModal.alert(valid.message);
    //             return null;
    //         }
    //
    //         const orderNo = this._state[STATE.ORDER_NO];
    //         return API.orders.quantity(orderNo, valid.data).then(response => {
    //             this.setProcess(false);
    //
    //             if (response.status === 200) {
    //                 // console.log(response);
    //                 const data = response.data;
    //
    //                 this._state[STATE.STATUS] = data[STATE.STATUS];
    //             }
    //
    //             return response;
    //         }).catch(error => {
    //             this.setProcess(false);
    //             PopModal.alert("세부사항을 저장하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
    //                 key: "quotation-quantity-error",
    //                 callBack: () => redirect.back()
    //             });
    //         });
    //     }
    //
    //     return null;
    // }

    /**
     * API 의뢰서 요청사항
     * @return {*}
     */
    apiContent() {
        if (!this.getProcess()) {
            this.setProcess(true);

            const content = this._state[STATE.CONTENT];
            // const budget = this._state[STATE.BUDGET];
            // const counsel = this._state[STATE.COUNSEL];
            // const meeting = this._state[STATE.MEETING];
            // const counsel_time = this._state[STATE.COUNSEL_TIME];
            const valid = this.isValidateContent();

            if (!valid.status) {
                this.setProcess(false);
                PopModal.alert(valid.message);
                return null;
            }

            const orderNo = this._state[STATE.ORDER_NO];
            return API.orders.content(orderNo, { content }).then(response => {
            // return API.orders.content(orderNo, { content, budget, counsel, meeting, counsel_time }).then(response => {
                this.setProcess(false);

                if (response.status === 200) {
                    // console.log(response);
                    const data = response.data;
                    this._state[STATE.STATUS] = data[STATE.STATUS];
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                PopModal.alert("요청사항을 저장하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                    key: "quotation-content-error",
                    callBack: () => redirect.back()
                });
            });
        }

        return null;
    }

    /**
     * API 촬영의뢰서 견적 요청
     * @return {*}
     */
    apiRequest() {
        if (!this.getProcess()) {
            this.setProcess(true);

            const validUser = this.isValidateUser();
            const validReserve = this.isValidateReserve();
            // const validOptions = this.isValidateOptions();
            const validContent = this.isValidateContent();
            // const reserve = this._state[STATE.RESERVE.key];

            let validMessage;
            if (!validUser.status) {
                validMessage = validUser.message;
            } else if (!validReserve.status) {
                validMessage = validReserve.message;
            // } else if (reserve[STATE.RESERVE.CATEGORY] !== "VIDEO" && !validOptions.status) {
            //     validMessage = validOptions.message;
            } else if (!validContent.status) {
                validMessage = validContent.message;
            }

            if (validMessage) {
                this.setProcess(false);
                PopModal.alert(validMessage);
                return null;
            }

            const orderNo = this._state[STATE.ORDER_NO];
            return API.orders.request(orderNo).then(response => {
                this.setProcess(false);

                if (response.status === 200) {
                    const data = response.data;
                    this._state[STATE.STATUS] = data[STATE.STATUS];
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                PopModal.alert("요청서를 등록하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                    key: "quotation-inspect-error",
                    callBack: () => redirect.back()
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

        // switch (this._state[STATE.STATUS]) {
        //     case STATUS.BASIC.key:
        //         props.status = STATUS.BASIC;
        //         props.path = "category";
        //         break;
        //     case STATUS.CATEGORY.key:
        //         props.status = STATUS.CATEGORY;
        //         props.path = "quantity";
        //         break;
        //     case STATUS.QUANTITY.key:
        //         props.status = STATUS.QUANTITY;
        //         props.path = "content";
        //         break;
        //     case STATUS.CONTENT.key:
        //         props.status = STATUS.CONTENT;
        //         props.path = "inspect";
        //         break;
        //     case STATUS.REQUEST.key:
        //         props.status = STATUS.REQUEST;
        //         props.path = "basic";
        //         break;
        //     case STATUS.PROGRESS.key:
        //     case STATUS.COMPLETE.key:
        //     case STATUS.RETURN.key:
        //     default:
        //         props.status = STATUS.COMPLETE;
        //         props.path = "complete";
        //         break;
        // }

        const reserve = this._state[STATE.RESERVE.key];
        if (location.pathname.startsWith("/guest")) {
            if ([STATUS.PROGRESS.key,
                STATUS.COMPLETE.key, STATUS.REQUEST.key].indexOf(this._state[STATE.STATUS]) !== -1) {
                props.status = STATUS.COMPLETE;
                props.path = "complete";
            } else if (!this.isValidateReserve().status) {
                props.status = STATUS.BASIC;
                props.path = "inspect";
            // } else if (reserve[STATE.RESERVE.CATEGORY] !== "VIDEO" && !this.isValidateOptions().status) {
            //     props.status = STATUS.CATEGORY;
            //     props.path = "quantity";
            } else if (!this.isValidateContent().status) {
                props.status = STATUS.QUANTITY;
                props.path = "content";
            } else if (this._state[STATE.STATUS] === STATUS.CONTENT.key) {
                props.status = STATUS.CONTENT;
                // props.path = "content";
                props.path = "inspect";
            } else if (this._state[STATE.STATUS] === STATUS.QUANTITY.key && !auth.getUser()) {
                props.status = STATUS.CONTENT;
                props.path = "content";
            } else if (this.isValidateUser().status) {
                props.status = STATUS.REQUEST;
                props.path = "inspect";
            } else if (!this.isValidateUser().status) {
                props.status = STATUS.BASIC;
                props.path = "basic";
            } else if (this._state[STATE.STATUS] === STATUS.REQUEST.key) {
                props.status = STATUS.REQUEST;
                props.path = "category";
            } else {
                props.status = STATUS.RETURN;
                props.path = "category";
            }
        }

        if (location.pathname.startsWith("/users")) {
            if ([STATUS.PROGRESS.key,
                STATUS.COMPLETE.key].indexOf(this._state[STATE.STATUS]) !== -1) {
                props.status = STATUS.COMPLETE;
                props.path = "complete";
            } else if (!this.isValidateUser().status) {
                props.status = STATUS.BASIC;
                props.path = "basic";
            } else if (!this.isValidateReserve().status) {
                props.status = STATUS.BASIC;
                props.path = "category";
            // } else if (reserve[STATE.RESERVE.CATEGORY] !== "VIDEO" && !this.isValidateOptions().status) {
            //     props.status = STATUS.CATEGORY;
            //     props.path = "quantity";
            } else if (!this.isValidateContent().status) {
                props.status = STATUS.QUANTITY;
                props.path = "content";
            } else if (this._state[STATE.STATUS] === STATUS.CONTENT.key) {
                props.status = STATUS.CONTENT;
                props.path = "inspect";
            } else if (this._state[STATE.STATUS] === STATUS.REQUEST.key) {
                props.status = STATUS.REQUEST;
                props.path = "basic";
            } else {
                props.status = STATUS.RETURN;
                props.path = "basic";
            }
        }

        return props;
    }

    /**
     * 촬영시간 가져오기
     * @return {{sh: string, sm: string, eh: string, em: string}}
     */
    getReserveTimes() {
        const reserve = this.getState(STATE.RESERVE.key);
        const time = reserve[STATE.RESERVE.TIME];

        const props = {
            sh: "00",
            sm: "00",
            eh: "00",
            em: "00"
        };

        try {
            if (time && time !== "0000|0000" && !!time.match(/^[0-9]{4}|[0-9]{4}$/)) {
                const t = time.split("|");
                props.sh = t[0].substr(0, 2);
                props.sm = t[0].substr(2, 2);
                props.eh = t[1].substr(0, 2);
                props.em = t[1].substr(2, 2);
            }
        } catch (e) {
            props.sh = "00";
            props.sm = "00";
            props.eh = "00";
            props.em = "00";
        }

        return props;
    }

    /**
     * 촬영날짜 가져오기
     * @return String or Null
     */
    getReserveDate() {
        const reserve = this._state[STATE.RESERVE.key];
        const date = reserve[STATE.RESERVE.DATE];
        return date && date !== "0000-00-00" && !!date.match(/^[0-9]{4}[0-9]{2}[0-9]{2}$/) ? mewtime.strToDate(date) : null;
    }

    /**
     * s3 업로드
     * @param file - File
     * @param is_image - Bool (이미지 첨부 or 파일 첨부)
     * @return {Promise}
     */
    uploadS3(file, is_image = true) {
        return new Promise((resolv, reject) => {
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
                    resolv(result);
                }).catch(error => {
                    reject(error);
                });
            } else {
                resolv(result);
            }
        });
    }

    /**
     * 첨부 삭제
     * @param orderNo - 의뢰서 번호
     * @param no - 첨부파일 번호
     * @return { null or promise}
     */
    deleteAttach(orderNo, no) {
        if (!this.getProcess()) {
            this.setProcess(true);
            return new Promise((resolv, reject) => {
                PopModal.confirm("첨부파일을 삭제하시겠습니까?", () => {
                    API.orders.deleteAttach(orderNo, no).then(response => {
                        this.setProcess(false);
                        resolv(response);
                    }).catch(error => {
                        this.setProcess(false);
                        reject(error);
                    });
                }, () => {
                    this.setProcess(false);
                    reject();
                });
            });
        }

        return null;
    }

    /**
     * 첨부 삭제
     * @param orderNo - 의뢰서 번호
     * @param no - 첨부파일 번호
     * @return { null or promise}
     */
    deleteAttachFile(orderNo, no) {
        if (!this.getProcess()) {
            this.setProcess(true);
            return new Promise((resolv, reject) => {
                PopModal.confirm("첨부파일을 삭제하시겠습니까?", () => {
                    API.orders.deleteAttachFile(orderNo, no).then(response => {
                        this.setProcess(false);
                        resolv(response);
                    }).catch(error => {
                        this.setProcess(false);
                        reject(error);
                    });
                }, () => {
                    this.setProcess(false);
                    reject();
                });
            });
        }

        return null;
    }

    isDate(date) {
        return date && (date !== "0000-00-00" || date !== "00000000") && !!date.match(/^[0-9]{4}[0-9]{2}[0-9]{2}$/);
    }

    isDateOption(date) {
        return CONST.dateOption.find(o => (o === date));
    }

    isTime(time) {
        return time && !!time.match(/^[0-9]{4}|[0-9]{4}$/);
    }

    isTimeOption(time) {
        return CONST.timeOption.find(o => (o === time));
    }

    isRegion(region) {
        return ADDRESS_LIST.find(a => (a.title === region || a.full === region));
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

        const user = this._state[STATE.USER.key];
        const name = user[STATE.USER.NAME];
        const phone = user[STATE.USER.PHONE];
        const email = user[STATE.USER.EMAIL];
        const agree = this._state[STATE.AGREE];
        const splitPhoneNumber = this._state[STATE.PHONE.key];
        const p = `${splitPhoneNumber.start}${splitPhoneNumber.center}${splitPhoneNumber.end}`;

        if (name.replace(/\s/g, "") === "") {
            result.message = "이름을 입력해주세요";
        } else if (name.length > 15) {
            result.message = "이름은 15자 이하로 입력 가능합니다";
        } else if (!phone || phone.replace(/([^0-9]+)/g, "") === "") {
            result.message = "연락처를 입력해주세요";
        } else if (p.length < 10) {
            result.message = "연락처는 10 ~ 11자 사이로 입력해주세요";
        } else if (phone.length < 10 || phone.length > 11) {
            result.message = "연락처는 10 ~ 11자 사이로 입력해주세요";
        } else if (!email || (email && !utils.isValidEmail(email))) {
            result.message = "이메일을 정확하게 입력해주세요";
        } else if (!agree) {
            result.message = "입력하신 정보 활용 동의하기에 체크해주세요";
        } else {
            result.status = true;
        }

        return result;
    }

    /**
     * 견적 유형 및 날짜 데이터 검증
     * @return {{status: boolean, message: string}}
     */
    isValidateReserve() {
        const result = {
            status: false,
            message: ""
        };

        const reserve = this._state[STATE.RESERVE.key];

        if (!reserve[STATE.RESERVE.CATEGORY]) {
            result.message = "카테고리를 선택해주세요";
        } else if (!reserve[STATE.RESERVE.REGION] || !this.isRegion(reserve[STATE.RESERVE.REGION])) {
            result.message = "촬영지역을 선택해주세요";
        } else if (!reserve[STATE.RESERVE.DATE]
            || (this.isDate(reserve[STATE.RESERVE.DATE]) && mewtime().isAfter(mewtime.strToDate(reserve[STATE.RESERVE.DATE]), mewtime.const.DATE))
            || (!this.isDate(reserve[STATE.RESERVE.DATE]) && !this.isDateOption(reserve[STATE.RESERVE.DATE]))) {
            result.message = "촬영날짜를 선택해주세요";
        } else if (!reserve[STATE.RESERVE.TIME] || reserve[STATE.RESERVE.TIME] === "0000|0000" || (!this.isTime(reserve[STATE.RESERVE.TIME]) && !this.isTimeOption(reserve[STATE.RESERVE.TIME]))) {
            result.message = "촬영시간을 선택해주세요";
        } else {
            result.status = true;
        }

        return result;
    }

    // /**
    //  * 견적 옵션 데이터 검증
    //  * @return {{status: boolean, message: string, data: object}}
    //  */
    // isValidateOptions() {
    //     const result = {
    //         status: false,
    //         message: "",
    //         data: {}
    //     };
    //
    //     const reserve = this._state[STATE.RESERVE.key];
    //     const options = this._state[STATE.OPTIONS.key];
    //     const categoryValue = reserve[STATE.RESERVE.CATEGORY];
    //     let accept;
    //
    //     if (categoryValue) {
    //         accept = this._state[STATE.ACCEPT_OPTIONS][categoryValue.toUpperCase()];
    //     }
    //
    //     if (accept) {
    //         for (let i = 0; i < accept.length; i += 1) {
    //             const obj = accept[i];
    //             const key = obj.key;
    //             const value = options[key];
    //             result.data[key] = value;
    //
    //             if ([
    //                 STATE.OPTIONS.PERSON,
    //                 STATE.OPTIONS.QUANTITY,
    //                 // STATE.OPTIONS.SIZE,
    //                 STATE.OPTIONS.DIRECTION,
    //                 STATE.OPTIONS.OUTLINE,
    //                 STATE.OPTIONS.CONCEPT,
    //                 STATE.OPTIONS.INSIDE,
    //                 STATE.OPTIONS.OUTSIDE].indexOf(key) !== -1
    //             ) {
    //                 if (value === null) {
    //                     result.message = `${obj.title}을(를) 선택해주세요`;
    //                     break;
    //                 } else if (isNaN(value) && value.replace(/\s/g, "") === "") {
    //                     result.message = `${obj.title}을(를) 선택해주세요`;
    //                     break;
    //                 } else if (value > 9999 || value < 0) {
    //                     result.message = `${obj.title}은(는) 0(미정) ~ 9999까지 가능합니다`;
    //                     break;
    //                 }
    //             } else if ([STATE.OPTIONS.PLACE,
    //                 STATE.OPTIONS.STUDIO,
    //                 STATE.OPTIONS.MODEL,
    //                 STATE.OPTIONS.BEAUTY,
    //                 STATE.OPTIONS.CLOTHES,
    //                 STATE.OPTIONS.PRINT].indexOf(key) !== -1
    //             ) {
    //                 if (value === null) {
    //                     result.message = `${obj.title}을(를) 선택해주세요`;
    //                     break;
    //                 } else if (isNaN(value) && value.replace(/\s/g, "") === "") {
    //                     result.message = `${obj.title}을(를) 선택해주세요`;
    //                     break;
    //                 }
    //             }
    //         }
    //
    //         if (result.message === "") {
    //             result.status = true;
    //         }
    //     } else {
    //         result.message = "잘못된 카테고리입니다";
    //     }
    //
    //     return result;
    // }

    /**
     * 견적 요청사항 데이터 검증
     * @return {{status: boolean, message: string}}
     */
    isValidateContent() {
        const result = {
            status: false,
            message: ""
        };

        // const reserve = this._state[STATE.RESERVE.key];
        const content = this._state[STATE.CONTENT];
        // const budget = this._state[STATE.BUDGET];
        // const counsel = this._state[STATE.COUNSEL];
        // const meeting = this._state[STATE.MEETING];
        // const counselTime = this._state[STATE.COUNSEL_TIME];
        // const category = reserve[STATE.RESERVE.CATEGORY];
        const isBelong = false; // ["PRODUCT", "FOOD", "INTERIOR"].indexOf(category) !== -1;
        const isExceptPrice = this.isExceptPrice();

        if (content.replace(/\s/g, "") === "") {
            result.message = "촬영관련 요청사항을 입력해주세요";
        } else if (content.length > 1000) {
            result.message = "촬영관련 요청사항은\n1000자 이하로 입력 가능합니다";
        // } else if (!budget) {
        //     result.message = "촬영 최대예산을 입력해주세요";
        // } else if (isExceptPrice && budget < 25000) {
        //     result.message = "촬영 최대예산은 포스냅 정책상 최소 25,000원입니다";
        // } else if (!isExceptPrice && budget < 100000) {
        //     result.message = "촬영 최대예산은 포스냅 정책상 최소 10만 원입니다";
        // } else if (isBelong && !counsel) {
        //     result.message = "전화상품 여부를 선택해주세요";
        // } else if (isBelong && !meeting) {
        //     result.message = "미팅상담 여부를 선택해주세요";
        // } else if (!counselTime) {
        //     result.message = "상담가능 시간을 선택해주세요.";
        } else {
            result.status = true;
        }

        // else if (utils.isValidDomain(content)) {
        //     result.message = "촬영관련 요청사항에는\n홈페이지 주소를 입력할 수 없습니다";
        // }

        return result;
    }
    ///////////////////////// ====> 게스트 촬영진행건에 대한 apis
    /**
     * API 게스트 촬영의뢰서 등록
     * @return promise or null
     */
    apiRegistQuotation_guest() {
        if (!this.getProcess()) {
            this.setProcess(true);
            const valid = this.isValidateReserve();     // 예약체크
            if (!valid.status) {
                this.setProcess(false);
                PopModal.alert(valid.message);
                return null;
            }

            const reserve = this._state[STATE.RESERVE.key];
            return API.orders.guest_register(reserve).then(response => {
                this.setProcess(false);
                if (response.status === 200) {
                    // console.log(response);
                    const data = response.data;
                    this._state[STATE.ORDER_NO] = data[STATE.ORDER_NO];
                    this._state[STATE.STATUS] = data[STATE.STATUS];
                    sessionStorage.setItem(STATE.TEMP_USER_ID, data[STATE.TEMP_USER_ID]);
                    this._state[STATE.TEMP_USER_ID] = data[STATE.TEMP_USER_ID];

                    if (data[STATE.UPLOAD_INFO]) {
                        this._state[STATE.UPLOAD_INFO] = data[STATE.UPLOAD_INFO];
                    }
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                PopModal.alert("요청서를 생성하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                    key: "quotation-regist-error",
                    callBack: () => redirect.back()
                });
            });
        }
        return null;
    }
    /**
     * API 촬영의뢰서 유저정보 수정
     * @param orderNo - Number (요청서 번호)
     * @return promise or null
     */
    apiUpdateCategory_guest(orderNo) {
        if (!this.getProcess()) {
            this.setProcess(true);

            const valid = this.isValidateReserve();     // 예약체크
            if (!valid.status) {
                this.setProcess(false);
                PopModal.alert(valid.message);
                return null;
            }

            const reserve = this._state[STATE.RESERVE.key];
            const temp_user_id = this._state[STATE.TEMP_USER_ID];

            return API.orders.quest_updateCategory(orderNo, reserve, temp_user_id).then(response => {
                this.setProcess(false);

                if (response.status === 200) {
                    // console.log(response);
                    const data = response.data;
                    this._state[STATE.STATUS] = data[STATE.STATUS];
                    // this._state[STATE.TEMP_USER_ID] = data[STATE.TEMP_USER_ID];

                    if (this._state[STATE.TEMP_USER_ID] === undefined || this._state[STATE.TEMP_USER_ID] === null) {
                        this._state[STATE.TEMP_USER_ID] = data[STATE.USER_ID];
                    }

                    if (data[STATE.UPLOAD_INFO]) {
                        this._state[STATE.UPLOAD_INFO] = data[STATE.UPLOAD_INFO];
                    }
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                PopModal.alert("기본정보를 저장하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                    key: "quotation-update-basic-error",
                    callBack: () => redirect.back()
                });
            });
        }

        return null;
    }
    // /**
    //  * API 의뢰서 세부사항
    //  * @return {*}
    //  */
    // apiQuantity_guest() {
    //     if (!this.getProcess()) {
    //         this.setProcess(true);
    //         const valid = this.isValidateOptions();
    //         if (!valid.status) {
    //             this.setProcess(false);
    //             PopModal.alert(valid.message);
    //             return null;
    //         }
    //
    //         const orderNo = this._state[STATE.ORDER_NO];
    //         const temp_user_id = this._state[STATE.TEMP_USER_ID];
    //         if (temp_user_id) {
    //             valid.data.temp_user_id = temp_user_id;
    //         }
    //         return API.orders.quest_quantity(orderNo, valid.data).then(response => {
    //             this.setProcess(false);
    //
    //             if (response.status === 200) {
    //                 const data = response.data;
    //                 this._state[STATE.STATUS] = data[STATE.STATUS];
    //             }
    //
    //             return response;
    //         }).catch(error => {
    //             this.setProcess(false);
    //             PopModal.alert("세부사항을 저장하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
    //                 key: "quotation-quantity-error",
    //                 callBack: () => redirect.back()
    //             });
    //         });
    //     }
    //
    //     return null;
    // }
    apiUpdateUser() {
        if (!this.getProcess()) {
            const orderNo = this._state[STATE.ORDER_NO];
            const temp_user_id = this._state[STATE.TEMP_USER_ID];
            return API.orders.guest_update_user(orderNo, { temp_user_id }).then(response => {
                this.setProcess(false);

                if (response.status === 200) {
                    const data = response.data;
                    this._state[STATE.STATUS] = data[STATE.STATUS];
                }
                return response;
            }).catch(error => {
                this.setProcess(false);
                PopModal.alert("유저 정보를 업데이트 하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                    key: "quotation-quantity-error",
                    callBack: () => redirect.back()
                });
            });
        }

        return null;
    }
    /**
     * API 의뢰서 요청사항
     * @return {*}
     */
    apiContent_guest() {
        if (!this.getProcess()) {
            this.setProcess(true);

            const content = this._state[STATE.CONTENT];
            // const budget = this._state[STATE.BUDGET];
            // const counsel = this._state[STATE.COUNSEL];
            // const meeting = this._state[STATE.MEETING];
            // const counsel_time = this._state[STATE.COUNSEL_TIME];

            const valid = this.isValidateContent();

            if (!valid.status) {
                this.setProcess(false);
                PopModal.alert(valid.message);
                return null;
            }

            const orderNo = this._state[STATE.ORDER_NO];
            const temp_user_id = this._state[STATE.TEMP_USER_ID] || "";

            return API.orders.guest_content(orderNo, { content, temp_user_id }).then(response => {
            // return API.orders.guest_content(orderNo, { content, budget, counsel, meeting, temp_user_id, counsel_time }).then(response => {
                this.setProcess(false);

                if (response.status === 200) {
                    const data = response.data;
                    this._state[STATE.STATUS] = data[STATE.STATUS];
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                PopModal.alert("요청사항을 저장하지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                    key: "quotation-content-error",
                    callBack: () => redirect.back()
                });
            });
        }

        return null;
    }

    /**
     * API 쵤영의뢰서 조회
     * @param orderNo
     * @return promis or null
     */
    apiFindQuotation_guest(orderNo) {
        if (!this.getProcess()) {
            this.setProcess(true);
            const temp_user_id = this._state[STATE.TEMP_USER_ID];
            return API.orders.guest_find(orderNo, { temp_user_id }).then(response => {
                this.setProcess(false);

                if (response.status === 200) {
                    // console.log(response);
                    const data = response.data;
                    this._state[STATE.ORDER_NO] = orderNo;
                    this._state[STATE.UPLOAD_INFO] = data[STATE.UPLOAD_INFO];
                    this._state[STATE.STATUS] = data[STATE.STATUS];


                    if (data[STATE.OPTIONS.PERSON] === null) {
                        data[STATE.OPTIONS.PERSON] = "NA";
                    }

                    if (data[STATE.OPTIONS.QUANTITY] === null) {
                        data[STATE.OPTIONS.QUANTITY] = "NA";
                    }

                    // if (data[STATE.OPTIONS.SIZE] === null) {
                    //     data[STATE.OPTIONS.SIZE] = "NA";
                    // }

                    if (data[STATE.OPTIONS.CONCEPT] === null) {
                        data[STATE.OPTIONS.CONCEPT] = "NA";
                    }

                    if (data[STATE.OPTIONS.INSIDE] === null) {
                        data[STATE.OPTIONS.INSIDE] = "NA";
                    }

                    if (data[STATE.OPTIONS.OUTSIDE] === null) {
                        data[STATE.OPTIONS.OUTSIDE] = "NA";
                    }

                    if (data[STATE.CONTENT] === null) {
                        data[STATE.CONTENT] = "";
                    }

                    // if (data[STATE.BUDGET] === null) {
                    //     data[STATE.BUDGET] = "";
                    // }
                    //
                    // if (data[STATE.COUNSEL] === null) {
                    //     data[STATE.COUNSEL] = "";
                    // }
                    //
                    // if (data[STATE.MEETING] === null) {
                    //     data[STATE.MEETING] = "";
                    // }
                    //
                    // if (data[STATE.COUNSEL_TIME] === null) {
                    //     data[STATE.COUNSEL_TIME] = "";
                    // }

                    data[STATE.AGREE] = !!data[STATE.STATUS];

                    this.setAllState(data);
                }

                return response;
            }).catch(error => {
                this.setProcess(false);
                if (error && error.status === 400) {
                    PopModal.alert(error.data, {
                        key: "quotation-order-error",
                        callBack: () => redirect.back()
                    });
                } else {
                    PopModal.alert("요청서를 가져오지 못했습니다.\n잠시후 다시 시도해 주세요.\n계속해서 오류 발생시 고객센터로 문의해주세요.", {
                        key: "quotation-order-error",
                        callBack: () => redirect.back()
                    });
                }
            });
        }

        return null;
    }

    /**
     * 게스트 요청서 첨부 삭제
     * @param orderNo - 의뢰서 번호
     * @param no - 첨부파일 번호
     * @return { null or promise}
     */
    guest_deleteAttach(orderNo, no) {
        if (!this.getProcess()) {
            this.setProcess(true);
            return new Promise((resolv, reject) => {
                PopModal.confirm("첨부파일을 삭제하시겠습니까?", () => {
                    const temp_user_id = this._state[STATE.TEMP_USER_ID];
                    API.orders.quest_deleteAttach(orderNo, no, { temp_user_id }).then(response => {
                        this.setProcess(false);
                        resolv(response);
                    }).catch(error => {
                        this.setProcess(false);
                        reject(error);
                    });
                }, () => {
                    this.setProcess(false);
                    reject();
                });
            });
        }

        return null;
    }
}

export default new QuotationRequest();
