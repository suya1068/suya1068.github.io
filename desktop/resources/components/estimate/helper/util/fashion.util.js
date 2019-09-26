import {
    PROPERTYS,
    SHOT_KIND_PROPERTY,
    DIRECTING_PROPERTY,
    SIZE_PROPERTY,
    MATERIAL_PROPERTY,
    NUKKI_KIND_PROPERTY,
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
    let resultFlag = true;

    const need = HAS_PROPERTY.NEED.CODE;

    const etcPriceCalc = () => {
        if (form[PROPERTYS.IS_RETOUCH_ADD.CODE] === HAS_PROPERTY.NEED.CODE) {
            if (form[PROPERTYS.RETOUCH_NUMBER.CODE]) {
                totalPrice += form[PROPERTYS.RETOUCH_NUMBER.CODE] * priceInfo.retouch_price;
                totalPrice *= 1;
            } else {
                resultFlag = false;
            }
        }

        if (form[PROPERTYS.IS_DETAIL_CUT.CODE] === HAS_PROPERTY.NEED.CODE) {
            if (form[PROPERTYS.DETAIL_NUMBER.CODE]) {
                totalPrice += form[PROPERTYS.DETAIL_NUMBER.CODE] * priceInfo.detail_cut_price;
                totalPrice *= 1;
            } else {
                resultFlag = false;
            }
        }
    };

    if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.NUKKI.CODE) {
        const nukki_type = form[PROPERTYS.NUKKI_KIND.CODE];
        let sub_price = "";
        if (nukki_type === NUKKI_KIND_PROPERTY.FLOOR_NUKKI.CODE) {
            sub_price = priceInfo.floor_nukki_price;
        }

        if (nukki_type === NUKKI_KIND_PROPERTY.MANNEQUIN_NUKKI.CODE) {
            sub_price = priceInfo.mannequin_nukki_price;
        }

        if (nukki_type === NUKKI_KIND_PROPERTY.GHOST_CUT.CODE) {
            sub_price = priceInfo.ghost_cut_price;
        }
        totalPrice = form[PROPERTYS.NEED_NUMBER.CODE] * sub_price;
        etcPriceCalc();
    }

    if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.MODEL_SHOT.CODE && form[PROPERTYS.MODEL_TIME.CODE]) {
        const modelTime = form[PROPERTYS.MODEL_TIME.CODE];
        let sub_price = "";
        let casting_price = 0;
        if (modelTime === "shot") {
            if (form[PROPERTYS.MODEL_CASTING.CODE] === need) {
                casting_price += priceInfo.casting_price_shot;
            }
            if (form[PROPERTYS.H_M_CASTING.CODE] === need) {
                casting_price += priceInfo.casting_price_shot;
            }

            sub_price = priceInfo.model_time_price_shot + casting_price;
        } else if (modelTime === "half") {
            if (form[PROPERTYS.MODEL_CASTING.CODE] === need) {
                casting_price += priceInfo.casting_price_half;
            }
            if (form[PROPERTYS.H_M_CASTING.CODE] === need) {
                casting_price += priceInfo.casting_price_half;
            }
            sub_price = priceInfo.model_time_price_half + casting_price;
        } else if (modelTime === "full") {
            if (form[PROPERTYS.MODEL_CASTING.CODE] === need) {
                casting_price += priceInfo.casting_price_full;
            }
            if (form[PROPERTYS.H_M_CASTING.CODE] === need) {
                casting_price += priceInfo.casting_price_full;
            }
            sub_price = priceInfo.model_time_price_full + casting_price;
        }

        totalPrice += sub_price;
        totalPrice *= 1;
        etcPriceCalc();
    }
    if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.CODE && form[PROPERTYS.MODEL_TIME.CODE] && form[PROPERTYS.NEED_NUMBER.CODE]) {
        const modelTime = form[PROPERTYS.MODEL_TIME.CODE];
        const nukki_type = form[PROPERTYS.NUKKI_KIND.CODE];
        let model_sub_price = "";
        let casting_price = 0;

        let nukki_sub_price = "";
        if (nukki_type === NUKKI_KIND_PROPERTY.FLOOR_NUKKI.CODE) {
            nukki_sub_price = priceInfo.floor_nukki_price;
        }

        if (nukki_type === NUKKI_KIND_PROPERTY.MANNEQUIN_NUKKI.CODE) {
            nukki_sub_price = priceInfo.mannequin_nukki_price;
        }

        if (nukki_type === NUKKI_KIND_PROPERTY.GHOST_CUT.CODE) {
            nukki_sub_price = priceInfo.ghost_cut_price;
        }
        totalPrice = form[PROPERTYS.NEED_NUMBER.CODE] * nukki_sub_price;
        totalPrice *= 1;

        if (modelTime === "shot") {
            if (form[PROPERTYS.MODEL_CASTING.CODE] === need) {
                casting_price += priceInfo.casting_price_shot;
            }
            if (form[PROPERTYS.H_M_CASTING.CODE] === need) {
                casting_price += priceInfo.casting_price_shot;
            }

            model_sub_price = priceInfo.model_time_price_shot + casting_price;
        } else if (modelTime === "half") {
            if (form[PROPERTYS.MODEL_CASTING.CODE] === need) {
                casting_price += priceInfo.casting_price_half;
            }
            if (form[PROPERTYS.H_M_CASTING.CODE] === need) {
                casting_price += priceInfo.casting_price_half;
            }
            model_sub_price = priceInfo.model_time_price_half + casting_price;
        } else if (modelTime === "full") {
            if (form[PROPERTYS.MODEL_CASTING.CODE] === need) {
                casting_price += priceInfo.casting_price_full;
            }
            if (form[PROPERTYS.H_M_CASTING.CODE] === need) {
                casting_price += priceInfo.casting_price_full;
            }
            model_sub_price = priceInfo.model_time_price_full + casting_price;
        }

        totalPrice += model_sub_price;
        totalPrice *= 1;

        etcPriceCalc();
    }

    if (!resultFlag) {
        totalPrice = "";
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
    const shotKindCode = PROPERTYS.SHOT_KIND.CODE;
    if (key === STEP_KEY.FIRST) {
        if (form[shotKindCode] === SHOT_KIND_PROPERTY.NUKKI.CODE && form[PROPERTYS.NEED_NUMBER.CODE]) {
            resultText = `누끼 ${form[PROPERTYS.NEED_NUMBER.CODE]} 컷`;
        } else if (form[shotKindCode] === SHOT_KIND_PROPERTY.MODEL_SHOT.CODE) {
            resultText = "모델 촬영";
            if (form[PROPERTYS.MODEL_TIME.CODE]) {
                let text = "";
                switch (form[PROPERTYS.MODEL_TIME.CODE]) {
                    case "shot": text = "2시간 (약 5~10착장 / 30만원)"; break;
                    case "half": text = "4시간 (약 15~20착장 / 50만원)"; break;
                    case "full": text = "8시간 (약 30~40착장 / 100만원)"; break;
                    default: break;
                }

                resultText += ` ${text}`;
            }
        } else if (form[shotKindCode] === SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.CODE) {
            if (form[PROPERTYS.NEED_NUMBER.CODE]) {
                resultText = `누끼 ${form[PROPERTYS.NEED_NUMBER.CODE]} 컷`;
            }

            resultText += " / 모델 촬영";

            if (form[PROPERTYS.MODEL_TIME.CODE]) {
                let text = "";
                switch (form[PROPERTYS.MODEL_TIME.CODE]) {
                    case "shot": text = "2시간 (약 5~10착장 / 30만원)"; break;
                    case "half": text = "4시간 (약 15~20착장 / 50만원)"; break;
                    case "full": text = "8시간 (약 30~40착장 / 100만원)"; break;
                    default: break;
                }

                resultText += ` ${text}`;
            }
        }
    }

    if (key === STEP_KEY.SECOND) {
        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.NUKKI.CODE) {
            if (form[PROPERTYS.NUKKI_KIND.CODE] === NUKKI_KIND_PROPERTY.FLOOR_NUKKI.CODE) {
                resultText = "바닥누끼 (컷당 1만원)";
            } else if (form[PROPERTYS.NUKKI_KIND.CODE] === NUKKI_KIND_PROPERTY.MANNEQUIN_NUKKI.CODE) {
                resultText = "마네킹누끼 (컷당 1만5천원)";
            } else if (form[PROPERTYS.NUKKI_KIND.CODE] === NUKKI_KIND_PROPERTY.GHOST_CUT.CODE) {
                resultText = "고스트컷 (컷당 2만원)";
            }
        } else if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.MODEL_SHOT.CODE) {
            let text = "";
            if (form[PROPERTYS.MODEL_TIME.CODE]) {
                switch (form[PROPERTYS.MODEL_TIME.CODE]) {
                    case "shot": text = "(25만원)"; break;
                    case "half": text = "(30만원)"; break;
                    case "full": text = "(50만원)"; break;
                    default:
                }
            }

            if (form[PROPERTYS.H_M_CASTING.CODE] === HAS_PROPERTY.NEEDLESS.CODE &&
                form[PROPERTYS.MODEL_CASTING.CODE] === HAS_PROPERTY.NEEDLESS.CODE) {
                resultText = "모델 섭외 불필요 / 헤어 메이크업 섭외 불필요";
            } else if (form[PROPERTYS.H_M_CASTING.CODE] === HAS_PROPERTY.NEED.CODE &&
                form[PROPERTYS.MODEL_CASTING.CODE] === HAS_PROPERTY.NEED.CODE) {
                if (text) {
                    resultText = `모델 섭외 필요 ${text} / 헤어 메이크업 섭외 필요 ${text}`;
                }
            } else if (form[PROPERTYS.H_M_CASTING.CODE] === HAS_PROPERTY.NEEDLESS.CODE &&
                form[PROPERTYS.MODEL_CASTING.CODE] === HAS_PROPERTY.NEED.CODE) {
                if (text) {
                    resultText = `모델 섭외 필요 ${text} / 헤어 메이크업 섭외 불필요`;
                }
            } else if (form[PROPERTYS.H_M_CASTING.CODE] === HAS_PROPERTY.NEED.CODE &&
                form[PROPERTYS.MODEL_CASTING.CODE] === HAS_PROPERTY.NEEDLESS.CODE) {
                if (text) {
                    resultText = `모델 섭외 불필요 / 헤어 메이크업 섭외 필요 ${text}`;
                }
            }
        } else if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.CODE) {
            if (form[PROPERTYS.NUKKI_KIND.CODE] === NUKKI_KIND_PROPERTY.FLOOR_NUKKI.CODE) {
                resultText = "바닥누끼 (컷당 1만원) / ";
            } else if (form[PROPERTYS.NUKKI_KIND.CODE] === NUKKI_KIND_PROPERTY.MANNEQUIN_NUKKI.CODE) {
                resultText = "마네킹누끼 (컷당 1만5천원) / ";
            } else if (form[PROPERTYS.NUKKI_KIND.CODE] === NUKKI_KIND_PROPERTY.GHOST_CUT.CODE) {
                resultText = "고스트컷 (컷당 2만원) / ";
            }

            let text = "";
            if (form[PROPERTYS.MODEL_TIME.CODE]) {
                switch (form[PROPERTYS.MODEL_TIME.CODE]) {
                    case "shot": text = "(25만원)"; break;
                    case "half": text = "(30만원)"; break;
                    case "full": text = "(50만원)"; break;
                    default:
                }
            }

            if (form[PROPERTYS.H_M_CASTING.CODE] === HAS_PROPERTY.NEEDLESS.CODE &&
                form[PROPERTYS.MODEL_CASTING.CODE] === HAS_PROPERTY.NEEDLESS.CODE) {
                resultText += "모델 섭외 불필요 / 헤어 메이크업 섭외 불필요";
            } else if (form[PROPERTYS.H_M_CASTING.CODE] === HAS_PROPERTY.NEED.CODE &&
                form[PROPERTYS.MODEL_CASTING.CODE] === HAS_PROPERTY.NEED.CODE) {
                if (text) {
                    resultText += `모델 섭외 필요 ${text} / 헤어 메이크업 섭외 필요 ${text}`;
                }
            } else if (form[PROPERTYS.H_M_CASTING.CODE] === HAS_PROPERTY.NEEDLESS.CODE &&
                form[PROPERTYS.MODEL_CASTING.CODE] === HAS_PROPERTY.NEED.CODE) {
                if (text) {
                    resultText += `모델 섭외 필요 ${text} / 헤어 메이크업 섭외 불필요`;
                }
            } else if (form[PROPERTYS.H_M_CASTING.CODE] === HAS_PROPERTY.NEED.CODE &&
                form[PROPERTYS.MODEL_CASTING.CODE] === HAS_PROPERTY.NEEDLESS.CODE) {
                if (text) {
                    resultText += `모델 섭외 불필요 / 헤어 메이크업 섭외 필요 ${text}`;
                }
            }
        }
    }

    if (key === STEP_KEY.THIRD) {
        const isDetail = form[PROPERTYS.IS_DETAIL_CUT.CODE] === HAS_PROPERTY.NEED.CODE && form[PROPERTYS.DETAIL_NUMBER.CODE];
        const isRetouch = form[PROPERTYS.IS_RETOUCH_ADD.CODE] === HAS_PROPERTY.NEED.CODE && form[PROPERTYS.RETOUCH_NUMBER.CODE];
        if (isDetail && !isRetouch) {
            resultText = `디테일컷 필요 ${form[PROPERTYS.DETAIL_NUMBER.CODE]} 컷 (컷당 4,000) / 리터치 추가 불필요`;
        } else if (!isDetail && isRetouch) {
            resultText = `디테일컷 불필요 / 리터치 추가 필요 ${form[PROPERTYS.RETOUCH_NUMBER.CODE]} 컷 (컷당 5,000)`;
        } else if (isDetail && isRetouch) {
            resultText = `디테일컷 필요 ${form[PROPERTYS.DETAIL_NUMBER.CODE]} 컷 (컷당 4,000) / 리터치 추가 필요 ${form[PROPERTYS.RETOUCH_NUMBER.CODE]} 컷 (컷당 5,000원)`;
        } else {
            resultText = "디테일컷 불필요 / 리터치 추가 불필요";
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
    let _code = code;
    const shotKindCode = PROPERTYS.SHOT_KIND.CODE;
    const need = HAS_PROPERTY.NEED.CODE;
    const needless = HAS_PROPERTY.NEEDLESS.CODE;

    if (code === SHOT_KIND_PROPERTY.NUKKI.CODE ||
        code === SHOT_KIND_PROPERTY.MODEL_SHOT.CODE) {
        _code = PROPERTYS.SHOT_KIND.CODE;
        value = code;
    }

    if (code === SHOT_KIND_PROPERTY.NUKKI.CODE) {
        if (form[PROPERTYS.SHOT_KIND.CODE] === code) {
            form[PROPERTYS.NEED_NUMBER.CODE] = "";
            form[PROPERTYS.NUKKI_KIND.CODE] = "";
        }
    }

    if (code === SHOT_KIND_PROPERTY.MODEL_SHOT.CODE) {
        form[PROPERTYS.H_M_CASTING.CODE] = HAS_PROPERTY.NEEDLESS.CODE;
        form[PROPERTYS.MODEL_CASTING.CODE] = HAS_PROPERTY.NEEDLESS.CODE;

        if (form[PROPERTYS.SHOT_KIND.CODE] === code) {
            form[PROPERTYS.MODEL_TIME.CODE] = "";
            form[PROPERTYS.MODEL_CASTING.CODE] = "";
            form[PROPERTYS.H_M_CASTING.CODE] = "";
        }
    }

    if (form[shotKindCode]) {
        if (form[shotKindCode] === SHOT_KIND_PROPERTY.NUKKI.CODE) {
            if (code === SHOT_KIND_PROPERTY.MODEL_SHOT.CODE) {
                value = SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.CODE;
            } else {
                value = "";
            }
        } else if (form[shotKindCode] === SHOT_KIND_PROPERTY.MODEL_SHOT.CODE) {
            if (code === SHOT_KIND_PROPERTY.NUKKI.CODE) {
                value = SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.CODE;
            } else {
                value = "";
            }
        } else if (form[shotKindCode] === SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.CODE) {
            if (code === SHOT_KIND_PROPERTY.NUKKI.CODE) {
                value = SHOT_KIND_PROPERTY.MODEL_SHOT.CODE;
                form[PROPERTYS.NUKKI_KIND.CODE] = "";
                form[PROPERTYS.NEED_NUMBER.CODE] = "";
            } else if (code === SHOT_KIND_PROPERTY.MODEL_SHOT.CODE) {
                value = SHOT_KIND_PROPERTY.NUKKI.CODE;
                form[PROPERTYS.MODEL_CASTING.CODE] = "";
                form[PROPERTYS.H_M_CASTING.CODE] = "";
                form[PROPERTYS.MODEL_TIME.CODE] = "";
            }
        }
    }

    if (code === PROPERTYS.MODEL_CASTING.CODE ||
        code === PROPERTYS.H_M_CASTING.CODE ||
        code === PROPERTYS.IS_DETAIL_CUT.CODE ||
        code === PROPERTYS.IS_RETOUCH_ADD.CODE) {
        value = isChecked ? needless : need;
    }

    form[_code] = value;

    return form;
};

const onRadio = (form, code) => {
    if (code === NUKKI_KIND_PROPERTY.FLOOR_NUKKI.CODE ||
        code === NUKKI_KIND_PROPERTY.MANNEQUIN_NUKKI.CODE ||
        code === NUKKI_KIND_PROPERTY.GHOST_CUT.CODE) {                      // 누끼종류
        form[PROPERTYS.NUKKI_KIND.CODE] = code;
    } else if (code === "shot" || code === "half" || code === "full") {     // 모델 촬영시간
        form[PROPERTYS.MODEL_TIME.CODE] = code;

        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.NUKKI.CODE) {
            form[PROPERTYS.SHOT_KIND.CODE] = SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.CODE;
        }
    }

    return form;
};

const onChange = (form, name, value) => {
    let _name = name;

    if (name === SHOT_KIND_PROPERTY.NUKKI.CODE) {
        _name = PROPERTYS.NEED_NUMBER.CODE;
    }

    if (Number(value) === 0) {
        value = "";
    }

    form[_name] = value;

    return form;
};

const setStepProcess = (data, processData) => {
    const { totalStep, form, st, step } = processData;
    const shotKindCode = PROPERTYS.SHOT_KIND.CODE;
    if (st === 1) {
        let firstFlag = false;
        if (form[shotKindCode] === SHOT_KIND_PROPERTY.NUKKI.CODE) {
            firstFlag = form[PROPERTYS.NEED_NUMBER.CODE] || false;
        } else if (form[shotKindCode] === SHOT_KIND_PROPERTY.MODEL_SHOT.CODE && form[PROPERTYS.MODEL_TIME.CODE]) {
            firstFlag = true;
        } else if (form[shotKindCode] === SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.CODE && form[PROPERTYS.NEED_NUMBER.CODE] && form[PROPERTYS.MODEL_TIME.CODE]) {
            firstFlag = true;
        }
        data[step].ACTIVE = firstFlag;
    } else if (st !== totalStep && st === 2) {
        let secondFlag = false;
        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.NUKKI.CODE) {
            secondFlag = !!form[PROPERTYS.NUKKI_KIND.CODE];
        } else if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.MODEL_SHOT.CODE) {
            secondFlag = true;
        } else if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.CODE) {
            secondFlag = !!form[PROPERTYS.NUKKI_KIND.CODE];
        }

        data[step].ACTIVE = secondFlag;
    } else if (st === totalStep) {
        const need = HAS_PROPERTY.NEED.CODE;
        const needless = HAS_PROPERTY.NEEDLESS.CODE;
        let lastFlag = false;
        if (form[PROPERTYS.IS_DETAIL_CUT.CODE] === need && form[PROPERTYS.IS_RETOUCH_ADD.CODE] === need) {
            lastFlag = form[PROPERTYS.DETAIL_NUMBER.CODE] && form[PROPERTYS.RETOUCH_NUMBER.CODE];
        } else if (form[PROPERTYS.IS_DETAIL_CUT.CODE] === needless && form[PROPERTYS.IS_RETOUCH_ADD.CODE] === need) {
            lastFlag = form[PROPERTYS.RETOUCH_NUMBER.CODE];
        } else if (form[PROPERTYS.IS_DETAIL_CUT.CODE] === need && form[PROPERTYS.IS_RETOUCH_ADD.CODE] === needless) {
            lastFlag = form[PROPERTYS.DETAIL_NUMBER.CODE];
        } else if (form[PROPERTYS.IS_DETAIL_CUT.CODE] === needless && form[PROPERTYS.IS_RETOUCH_ADD.CODE] === needless) {
            lastFlag = true;
        }

        data[step].ACTIVE = lastFlag;
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
