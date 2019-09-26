import {
    PROPERTYS,
    SHOT_KIND_PROPERTY,
    DIRECTING_PROPERTY,
    SIZE_PROPERTY,
    MATERIAL_PROPERTY,
    PLACE_PROPERTY,
    UNIT_DATA,
    STEP_KEY, HAS_PROPERTY
} from "../const/base.const";
import utils from "forsnap-utils";

/**
 * 총 예상견적을 계산합니다.
 * @param form
 * @param priceInfo
 * @returns {{hasAlphas: *, totalPrice: *}}
 */
const calculatePrice = (form, priceInfo) => {
    let totalPrice = "";
    let hasAlphas = false;

    if (form[PROPERTYS.PERSON_NUMBER.CODE]) {
        if (form[PROPERTYS.PERSON_NUMBER.CODE] < 11) {
            totalPrice += form[PROPERTYS.PERSON_NUMBER.CODE] * priceInfo.person_p_price_1;
            totalPrice *= 1;
        }

        if (form[PROPERTYS.PERSON_NUMBER.CODE] > 10) {
            totalPrice += (10 * priceInfo.person_p_price_1) + ((form[PROPERTYS.PERSON_NUMBER.CODE] - 10) * priceInfo.person_p_price_2);
            totalPrice *= 1;
        }
    }

    if (form[PROPERTYS.IS_ALL_SHOT.CODE] === HAS_PROPERTY.NEED.CODE && form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]) {
        totalPrice += form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE] * priceInfo.all_shot_price;
        totalPrice *= 1;
    }

    if (form[PROPERTYS.LOCATION.CODE] === PLACE_PROPERTY.STUDIO.CODE) {
        // totalPrice += form[PROPERTYS.PERSON_NUMBER.CODE] * priceInfo.person_p_price;
        // totalPrice *= 1;
    } else if (form[PROPERTYS.LOCATION.CODE] === PLACE_PROPERTY.OUTSIDE_S.CODE) {
        totalPrice += priceInfo.place_price;
        totalPrice *= 1;
    } else if (form[PROPERTYS.LOCATION.CODE] === PLACE_PROPERTY.OUTSIDE_E.CODE) {
        totalPrice += priceInfo.place_price;
        totalPrice *= 1;
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
    if (key === STEP_KEY.FIRST && form[PROPERTYS.PERSON_NUMBER.CODE]) {
        if (form[PROPERTYS.PERSON_NUMBER.CODE] < 11) {
            resultText = `${form[PROPERTYS.PERSON_NUMBER.CODE]} 명 (명당 30,000원)`;
        }

        if (form[PROPERTYS.PERSON_NUMBER.CODE] > 10) {
            resultText = `${form[PROPERTYS.PERSON_NUMBER.CODE]} 명 (10명까지 30,000원 추가 인당 25,000원)`;
        }
    }

    if (key === STEP_KEY.SECOND) {
        if (form[PROPERTYS.LOCATION.CODE] === PLACE_PROPERTY.STUDIO.CODE) {
            resultText = "스튜디오 내방";
        } else if (form[PROPERTYS.LOCATION.CODE] === PLACE_PROPERTY.OUTSIDE_S.CODE) {
            resultText = "출장(서울) / 출장비(10만원)";
        } else if (form[PROPERTYS.LOCATION.CODE] === PLACE_PROPERTY.OUTSIDE_E.CODE) {
            resultText = "출장(서울 외) / 출장비(10만원 + a)";
        }
    }

    if (key === STEP_KEY.THIRD) {
        if (form[PROPERTYS.IS_ALL_SHOT.CODE] === HAS_PROPERTY.NEED.CODE && form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]) {
            resultText = `단체사진 필요. 총 ${form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]}컷 (컷당 5만원)`;
        } else if (form[PROPERTYS.IS_ALL_SHOT.CODE] === HAS_PROPERTY.NEEDLESS.CODE) {
            resultText = "단체사진 불필요";
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
    let value = "";

    if (code === PROPERTYS.SIZE.CODE) {
        value = isChecked ? SIZE_PROPERTY.SMALL.CODE : SIZE_PROPERTY.LARGE.CODE;
    }

    if (code === PROPERTYS.MATERIAL.CODE) {
        value = isChecked ? MATERIAL_PROPERTY.GLOSSLESS.CODE : MATERIAL_PROPERTY.GLOSS.CODE;
    }

    form[code] = value;

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

const onRadio = (form, code) => {
    if (code === PLACE_PROPERTY.STUDIO.CODE) {              // 스튜디오 내방
        form[PROPERTYS.LOCATION.CODE] = code;
    } else if (code === PLACE_PROPERTY.OUTSIDE_S.CODE) {    // 출장 (서울)
        form[PROPERTYS.LOCATION.CODE] = code;
    } else if (code === PLACE_PROPERTY.OUTSIDE_E.CODE) {    // 출장(서울 외)
        form[PROPERTYS.LOCATION.CODE] = code;
    } else if (code === HAS_PROPERTY.NEEDLESS.CODE) {
        form[PROPERTYS.IS_ALL_SHOT.CODE] = code;
        form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE] = "";
    } else if (code === HAS_PROPERTY.NEED.CODE) {
        form[PROPERTYS.IS_ALL_SHOT.CODE] = code;
        form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE] = "";
    }

    return form;
};

const setStepProcess = (data, processData) => {
    const { totalStep, form, st, step } = processData;
    if (st === 1) {
        if (form[PROPERTYS.PERSON_NUMBER.CODE]) {
            data[step].ACTIVE = true;
        }
    } else if (st !== totalStep && st === 2) {
        if (form[PROPERTYS.LOCATION.CODE]) {
            data[step].ACTIVE = true;
        }
    } else if (st === totalStep) {
        if (form[PROPERTYS.IS_ALL_SHOT.CODE] === HAS_PROPERTY.NEED.CODE && form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]) {
            data[step].ACTIVE = true;
        } else if (form[PROPERTYS.IS_ALL_SHOT.CODE] === HAS_PROPERTY.NEEDLESS.CODE) {
            data[step].ACTIVE = true;
        } else {
            data[step].ACTIVE = false;
        }
    }
};

const isLastFlag = () => {
    return false;
};

export default { calculatePrice, exchangeResultText, onRadio, setStepProcess, onCheck, onChange, isLastFlag };
