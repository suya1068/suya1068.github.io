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

    if (form[PROPERTYS.NEED_NUMBER.CODE]) {
        totalPrice += form[PROPERTYS.NEED_NUMBER.CODE] * priceInfo.cut_p_price;
        totalPrice *= 1;
    }

    if (form[PROPERTYS.PLACE.CODE]) {
        if (form[PROPERTYS.PLACE.CODE] === PLACE_PROPERTY.GYEONGGI.CODE) {
            totalPrice += priceInfo.place_price;
            totalPrice *= 1;
        } else if (form[PROPERTYS.PLACE.CODE] === PLACE_PROPERTY.ETC.CODE) {
            totalPrice += priceInfo.place_price;
            totalPrice *= 1;
            hasAlphas = true;
        } else if (form[PROPERTYS.PLACE.CODE] === PLACE_PROPERTY.SEOUL.CODE) {
            hasAlphas = true;
        }
    }

    const isExterior = form[PROPERTYS.IS_EXTERIOR.CODE] === HAS_PROPERTY.NEED.CODE;
    const isComposeCut = form[PROPERTYS.INSIDE_CUT_COMPOSE.CODE] === HAS_PROPERTY.NEED.CODE;

    if (isExterior && !isComposeCut) {
        totalPrice += form[PROPERTYS.EXTERIOR_NUMBER.CODE] && form[PROPERTYS.EXTERIOR_NUMBER.CODE] * priceInfo.exterior_price;
        totalPrice *= 1;
        if (form[PROPERTYS.EXTERIOR_NUMBER.CODE] > 10) {
            hasAlphas = true;
        }
    } else if (isExterior && isComposeCut) {
        totalPrice += form[PROPERTYS.EXTERIOR_NUMBER.CODE] && (form[PROPERTYS.EXTERIOR_NUMBER.CODE] * priceInfo.exterior_price);
        totalPrice *= 1;
        totalPrice += form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE] && (form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE] * priceInfo.compose_p_cut);
        totalPrice *= 1;
        if (form[PROPERTYS.EXTERIOR_NUMBER.CODE] > 10) {
            hasAlphas = true;
        }
    } else if (!isExterior && isComposeCut) {
        totalPrice += form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE] && form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE] * priceInfo.compose_p_cut;
        totalPrice *= 1;
    } else if (isExterior && !isComposeCut) {
        //
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
    if (key === STEP_KEY.FIRST && form[PROPERTYS.NEED_NUMBER.CODE]) {
        resultText = `${form[PROPERTYS.NEED_NUMBER.CODE]} 컷 (컷당 20,000원)`;
    }

    if (key === STEP_KEY.SECOND) {
        if (form[PROPERTYS.PLACE.CODE] === PLACE_PROPERTY.SEOUL.CODE) {
            resultText = "서울";
        } else if (form[PROPERTYS.PLACE.CODE] === PLACE_PROPERTY.GYEONGGI.CODE) {
            resultText = "경기 / 추가비용(50,000원)";
        } else if (form[PROPERTYS.PLACE.CODE] === PLACE_PROPERTY.ETC.CODE) {
            resultText = "기타 / 추가비용(50,000원 + a)";
        }
    }

    if (key === STEP_KEY.THIRD) {
        const isExterior = form[PROPERTYS.IS_EXTERIOR.CODE] === HAS_PROPERTY.NEED.CODE && form[PROPERTYS.EXTERIOR_NUMBER.CODE];
        const isComposeCut = form[PROPERTYS.INSIDE_CUT_COMPOSE.CODE] === HAS_PROPERTY.NEED.CODE && form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE];
        if (isExterior && !isComposeCut) {
            resultText = `익스테리어 필요 ${form[PROPERTYS.EXTERIOR_NUMBER.CODE]} 컷 (컷당 50,000) / 내부 컷 합성 불필요`;
        } else if (!isExterior && isComposeCut) {
            resultText = `익스테리어 불필요 / 내부 컷 합성 필요 ${form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE]} 컷 (컷당 40,000)`;
        } else if (isExterior && isComposeCut) {
            resultText = `익스테리어 필요 ${form[PROPERTYS.EXTERIOR_NUMBER.CODE]} 컷 (컷당 50,000) / 내부 컷 합성 필요 ${form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE]} 컷 (컷당 40,000원)`;
        } else {
            resultText = "익스테리어 불필요 / 내부 컷 합성 불필요";
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

    if (code === PROPERTYS.IS_EXTERIOR.CODE) {
        value = isChecked ? needless : need;
    }

    if (code === PROPERTYS.INSIDE_CUT_COMPOSE.CODE) {
        value = isChecked ? needless : need;
    }

    if (code === PROPERTYS.IS_EXTERIOR.CODE && isChecked) {
        form[PROPERTYS.EXTERIOR_NUMBER.CODE] = "";
    } else if (code === PROPERTYS.INSIDE_CUT_COMPOSE.CODE && isChecked) {
        form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE] = "";
    }

    form[code] = value;

    return form;
};

const onRadio = (form, code) => {
    if (code === PLACE_PROPERTY.SEOUL.CODE) {               // 촬영지역 서울
        form[PROPERTYS.PLACE.CODE] = code;
    } else if (code === PLACE_PROPERTY.GYEONGGI.CODE) {     // 촬영지역 경기
        form[PROPERTYS.PLACE.CODE] = code;
    } else if (code === PLACE_PROPERTY.ETC.CODE) {          // 촬영지역 그 외
        form[PROPERTYS.PLACE.CODE] = code;
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
        data[step].ACTIVE = form[PROPERTYS.NEED_NUMBER.CODE] || false;
    } else if (st !== totalStep && st === 2) {
        data[step].ACTIVE = form[PROPERTYS.PLACE.CODE] || false;
    } else if (st === totalStep) {
        const isExterior = form[PROPERTYS.IS_EXTERIOR.CODE] === HAS_PROPERTY.NEED.CODE;
        const isComposeCut = form[PROPERTYS.INSIDE_CUT_COMPOSE.CODE] === HAS_PROPERTY.NEED.CODE;

        if (isExterior && !isComposeCut) {
            data[step].ACTIVE = form[PROPERTYS.EXTERIOR_NUMBER.CODE] || false;
        } else if (isExterior && isComposeCut) {
            data[step].ACTIVE = (form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE] && form[PROPERTYS.EXTERIOR_NUMBER.CODE]) || false;
        } else if (!isExterior && isComposeCut) {
            data[step].ACTIVE = form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE] || false;
        } else if (!isExterior && !isComposeCut) {
            data[step].ACTIVE = (!form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE] && !form[PROPERTYS.EXTERIOR_NUMBER.CODE]) || false;
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
