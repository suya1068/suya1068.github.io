import {
    PROPERTYS,
    SHOT_KIND_PROPERTY,
    DIRECTING_PROPERTY,
    SIZE_PROPERTY,
    MATERIAL_PROPERTY,
    PLACE_PROPERTY,
    UNIT_DATA,
    STEP_KEY,
    HAS_PROPERTY
} from "../const/base.const";
// import utils from "forsnap-utils";

let checkLastFlag = false;

/**
 * 총 예상견적을 계산합니다.
 * @param form
 * @param priceInfo
 * @returns {{hasAlphas: *, totalPrice: *}}
 */
const calculatePrice = (form, priceInfo) => {
    let totalPrice = "";
    let hasAlphas = false;
    const videoLength = form[PROPERTYS.VIDEO_LENGTH.CODE];

    if (form.shot_kind === "viral_video" && videoLength) {
        // 바이럴 영상일때 가격 세팅
        if (form.video_length) {
            totalPrice += priceInfo.viral_video_base_price + (videoLength < 4 ? (videoLength - 1) * priceInfo.viral_video_add_price : (videoLength - 2) * priceInfo.viral_video_add_price);
            totalPrice *= 1;
        }

        if (form.actor_casting === "need") {
            totalPrice += priceInfo.base_actor_casting_price + (videoLength < 4 ? (videoLength - 1) * priceInfo.add_actor_casting_price : (videoLength - 2) * priceInfo.add_actor_casting_price);
            totalPrice *= 1;
        }

        if (form.h_m_casting === "need") {
            totalPrice += priceInfo.base_h_m_casting_price + (videoLength < 4 ? (videoLength - 1) * priceInfo.add_h_m_casting_price : (videoLength - 2) * priceInfo.add_h_m_casting_price);
            totalPrice *= 1;
        }

        if (form.plan_conti === "need") {
            totalPrice += priceInfo.plan_conti;
            totalPrice *= 1;
        }
    } else if (form.shot_kind === "interview_video" && videoLength && form.interview_person) {
        // 인터뷰 영상일때 가격 세팅
        if (form.video_length) {
            totalPrice += priceInfo.interview_video_base_price + (videoLength < 4 ? (videoLength - 1) * priceInfo.interview_video_add_price : (videoLength - 2) * priceInfo.interview_video_add_price);
            totalPrice *= 1;
        }

        if (form.interview_person) {
            if (Number(form.interview_person) === 1) {
                totalPrice += 200000;
                totalPrice *= 1;
            } else {
                totalPrice += 200000 + ((form.interview_person - 1) * priceInfo.interview_person_price);
                totalPrice *= 1;
            }
        }
    }

    if (videoLength === "4") {
        hasAlphas = true;
    }

    return { hasAlphas, totalPrice };
};

/**
 * 단계별 결과 텍스트를 반환합니다.
 * @param key
 * @param form
 * @param priceInfo
 */
const exchangeResultText = (key, form, priceInfo) => {
    let resultText = "";
    if (key === STEP_KEY.FIRST && form[PROPERTYS.SHOT_KIND.CODE]) {
        resultText = form[PROPERTYS.SHOT_KIND.CODE] === "viral_video" ? "바이럴 영상" : "인터뷰 영상";
        const videoLength = form[PROPERTYS.VIDEO_LENGTH.CODE];
        const isViral = form[PROPERTYS.SHOT_KIND.CODE] === "viral_video";
        if (videoLength) {
            let text = "";
            switch (videoLength) {
                case "1": text = isViral ? "(140만원)" : "(70만원)"; break;
                case "2": text = isViral ? "(200만원)" : "(100만원)"; break;
                case "3": text = isViral ? "(260만원)" : "(130만원)"; break;
                case "4": text = isViral ? "(260+a만원)" : "(130+a만원)"; break;
                default: break;
            }

            resultText += ` ${text}`;
        }
    }

    if (key === STEP_KEY.SECOND && form[PROPERTYS.VIDEO_LENGTH.CODE]) {
        let text = "";
        switch (form[PROPERTYS.VIDEO_LENGTH.CODE]) {
            case "1": text = "1분미만"; break;
            case "2": text = "1분~3분"; break;
            case "3": text = "3분~5분"; break;
            case "4": text = "5분이상"; break;
            default: text = form[PROPERTYS.VIDEO_LENGTH.CODE]; break;
        }

        resultText = text;
    }

    if (key === STEP_KEY.THIRD) {
        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.VIRAL_VIDEO.CODE) {
            let text = "";
            switch (form[PROPERTYS.VIDEO_LENGTH.CODE]) {
                case "1": text = "(30만원)"; break;
                case "2": text = "(50만원)"; break;
                case "3": text = "(70만원)"; break;
                case "4": text = "(70만원+a)"; break;
                default: text = ""; break;
            }
            if (form[PROPERTYS.ACTOR_CASTING.CODE] === HAS_PROPERTY.NEED.CODE) {
                resultText += `배우섭외 필요 ${text} / `;
            } else {
                resultText += "배우섭외 불필요 / ";
            }

            if (form[PROPERTYS.H_M_CASTING.CODE] === HAS_PROPERTY.NEED.CODE) {
                resultText += `헤어메이크업 필요 ${text} / `;
            } else {
                resultText += "헤어메이크업 불필요 / ";
            }

            if (form[PROPERTYS.PLAN_CONTI.CODE] === HAS_PROPERTY.NEED.CODE) {
                resultText += "기획 및 콘티 필요 (50만원)";
            } else {
                resultText += "기획 및 콘티 불필요";
            }
        } else if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.INTERVIEW_VIDEO.CODE) {
            const personNumber = form[PROPERTYS.INTERVIEW_PERSON.CODE];
            const personPriceText = Number(personNumber) === 1 ? "(1명 20만원)" : "(1명 20만원, 추가 1인당 10만원)";
            resultText = `${personNumber} 명 ${personPriceText}`;
        }
    }

    return resultText;
};


/**
 * 체크 액션 시 폼 데이터 반환
 * @param form
 * @param code
 * @param isChecked
 * @returns {*}
 */
const onCheck = (form, code, isChecked) => {
    const need = HAS_PROPERTY.NEED.CODE;
    const needless = HAS_PROPERTY.NEEDLESS.CODE;
    let value = "";

    if (code === PROPERTYS.ACTOR_CASTING.CODE ||
        code === PROPERTYS.H_M_CASTING.CODE ||
        code === PROPERTYS.PLAN_CONTI.CODE) {
        value = isChecked ? needless : need;
    }

    form[code] = value;

    return form;
};

const onRadio = (form, code) => {
    if (code === SHOT_KIND_PROPERTY.VIRAL_VIDEO.CODE) {               // 촬영종류 바이럴 영상
        form[PROPERTYS.SHOT_KIND.CODE] = code;
        form[PROPERTYS.INTERVIEW_PERSON.CODE] = "";
        // 초기화
        form[PROPERTYS.ACTOR_CASTING.CODE] = HAS_PROPERTY.NEEDLESS.CODE;
        form[PROPERTYS.PLAN_CONTI.CODE] = HAS_PROPERTY.NEEDLESS.CODE;
        form[PROPERTYS.H_M_CASTING.CODE] = HAS_PROPERTY.NEEDLESS.CODE;
    } else if (code === SHOT_KIND_PROPERTY.INTERVIEW_VIDEO.CODE) {    // 촬영종류 인터뷰 영상
        form[PROPERTYS.SHOT_KIND.CODE] = code;
        // 초기화
        form[PROPERTYS.ACTOR_CASTING.CODE] = "";
        form[PROPERTYS.PLAN_CONTI.CODE] = "";
        form[PROPERTYS.H_M_CASTING.CODE] = "";
    } else {   // 영상 길이
        form[PROPERTYS.VIDEO_LENGTH.CODE] = code;
    }

    return form;
};

const onChange = (form, name, value) => {
    const _name = name;

    if (Number(value) === 0) {
        value = "";
    }

    form[_name] = value;

    return form;
};

const setStepProcess = (data, processData) => {
    const { totalStep, form, st, step } = processData;
    if (st === 1) {
        data[step].ACTIVE = form[PROPERTYS.SHOT_KIND.CODE] || false;
    } else if (st !== totalStep && st === 2) {
        data[step].ACTIVE = form[PROPERTYS.VIDEO_LENGTH.CODE] || false;
    } else if (st === totalStep) {
        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.INTERVIEW_VIDEO.CODE) {
            data[step].ACTIVE = form[PROPERTYS.INTERVIEW_PERSON.CODE] || false;
        } else if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.VIRAL_VIDEO.CODE) {
            data[step].ACTIVE = true; // 테스트중
        }
    }
};

const changeLastFlag = flag => {
    checkLastFlag = flag;
};

const getLastFlag = () => {
    return checkLastFlag;
};

const isLastFlag = () => {
    return true;
};

export default { calculatePrice, exchangeResultText, onRadio, setStepProcess, getLastFlag, changeLastFlag, onCheck, onChange, isLastFlag };
