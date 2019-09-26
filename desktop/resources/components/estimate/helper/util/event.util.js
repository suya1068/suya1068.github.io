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
    const totalTimeCode = PROPERTYS.TOTAL_TIME.CODE;

    if (form[totalTimeCode]) {
        switch (Number(form[totalTimeCode])) {
            case 2: totalPrice += priceInfo.price_2h; totalPrice *= 1; break;
            case 3: totalPrice += priceInfo.price_3h; totalPrice *= 1; break;
            case 4: totalPrice += priceInfo.price_4h; totalPrice *= 1; break;
            case 5: totalPrice += priceInfo.price_5h; totalPrice *= 1; break;
            case 6: totalPrice += priceInfo.price_6h; totalPrice *= 1; break;
            case 7: totalPrice += priceInfo.price_7h; totalPrice *= 1; break;
            case 8: totalPrice += priceInfo.price_8h; totalPrice *= 1; break;
            case 9: totalPrice += priceInfo.price_9h; totalPrice *= 1; break;
            case 10: totalPrice += priceInfo.price_10h; totalPrice *= 1; break;
            default: {
                break;
            }
        }

        if (form[totalTimeCode] > 10) {
            totalPrice += priceInfo.price_10h + ((form[totalTimeCode] - 10) * priceInfo.price_add_hour);
            totalPrice *= 1;
        }

        // totalPrice += form[totalTimeCode] * priceInfo.cut_p_price;
        // totalPrice *= 1;
    }

    if (form[PROPERTYS.PLACE.CODE]) {
        if (form[PROPERTYS.PLACE.CODE] === PLACE_PROPERTY.GYEONGGI.CODE) {
            totalPrice += priceInfo.place_price;
            totalPrice *= 1;
        } else if (form[PROPERTYS.PLACE.CODE] === PLACE_PROPERTY.ETC.CODE) {
            totalPrice += priceInfo.place_price;
            totalPrice *= 1;
            hasAlphas = true;
        }
    }

    const isAllShot = form[PROPERTYS.IS_ALL_SHOT.CODE] === HAS_PROPERTY.NEED.CODE;
    const isVideoDirecting = form[PROPERTYS.VIDEO_DIRECTING.CODE] === HAS_PROPERTY.NEED.CODE;

    if (isAllShot && !isVideoDirecting) {
        if (form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]) {
            totalPrice += form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE] * priceInfo.all_shot_price;
            totalPrice *= 1;
        } else {
            totalPrice = 0;
        }
    } else if (!isAllShot && !isVideoDirecting) {
        //
    } else if (isAllShot && isVideoDirecting) {
        if (form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]) {
            totalPrice += (form[totalTimeCode] * priceInfo.video_price) + (form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE] * priceInfo.all_shot_price);
            totalPrice *= 1;
        } else {
            totalPrice = 0;
        }
    } else if (!isAllShot && isVideoDirecting) {
        totalPrice += form[totalTimeCode] * priceInfo.video_price;
        totalPrice *= 1;
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
    if (key === STEP_KEY.FIRST && form[PROPERTYS.TOTAL_TIME.CODE]) {
        let text = "";
        switch (Number(form[PROPERTYS.TOTAL_TIME.CODE])) {
            case 2: text = "(20만원)"; break;
            case 3: text = "(29만원)"; break;
            case 4: text = "(37만원)"; break;
            case 5: text = "(44만원)"; break;
            case 6: text = "(50만원)"; break;
            case 7: text = "(55만원)"; break;
            case 8: text = "(60만원)"; break;
            case 9: text = "(65만원)"; break;
            case 10: text = "(70만원)"; break;
            default: {
                break;
            }
        }
        resultText = `${form[PROPERTYS.TOTAL_TIME.CODE]} 시간 ${text}`;

        if (form[PROPERTYS.TOTAL_TIME.CODE] > 10) {
            resultText = `${form[PROPERTYS.TOTAL_TIME.CODE]} 시간 (10시간 70만원, 추가 시간당 10만원)`;
        }
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
        const isAllShot = form[PROPERTYS.IS_ALL_SHOT.CODE] === HAS_PROPERTY.NEED.CODE && form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE];
        const isVideoDirecting = form[PROPERTYS.VIDEO_DIRECTING.CODE] === HAS_PROPERTY.NEED.CODE;
        if (isAllShot && !isVideoDirecting) {
            resultText = `영상 편집 불필요 / 단체 촬영 필요 ${form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]} 컷 (컷당 50,000)`;
        } else if (!isAllShot && !isVideoDirecting) {
            resultText = "영상 편집 불필요 / 단체 촬영 불필요";
        } else if (isAllShot && isVideoDirecting) {
            resultText = `영상 편집 필요 ${form[PROPERTYS.TOTAL_TIME.CODE]} 시간 (시간당 10만원) / 단체 촬영 필요 ${form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]} 컷 (컷당 50,000)`;
        } else if (!isAllShot && isVideoDirecting) {
            resultText = `영상 편집 필요 ${form[PROPERTYS.TOTAL_TIME.CODE]} 시간 (시간당 10만원) / 단체 촬영 불필요`;
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

    if (code === PROPERTYS.IS_ALL_SHOT.CODE) {
        value = isChecked ? needless : need;
    }

    if (code === PROPERTYS.VIDEO_DIRECTING.CODE) {
        value = isChecked ? needless : need;
    }

    if (code === PROPERTYS.IS_ALL_SHOT.CODE && isChecked) {
        form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE] = "";
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
        data[step].ACTIVE = form[PROPERTYS.TOTAL_TIME.CODE] || false;
    } else if (st !== totalStep && st === 2) {
        data[step].ACTIVE = form[PROPERTYS.PLACE.CODE] || false;
    } else if (st === totalStep) {
        data[step].ACTIVE = true;
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
