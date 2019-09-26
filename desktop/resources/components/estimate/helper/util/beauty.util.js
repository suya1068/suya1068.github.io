import {
    PROPERTYS,
    SHOT_KIND_PROPERTY,
    DIRECTING_PROPERTY,
    SIZE_PROPERTY,
    MATERIAL_PROPERTY,
    UNIT_DATA,
    STEP_KEY
} from "../const/base.const";

/**
 * 총 예상견적을 계산합니다.
 * @param form
 * @param priceInfo
 * @returns {{hasAlphas: *, totalPrice: *}}
 */
const calculatePrice = (form, priceInfo) => {
    let totalPrice = "";
    let hasAlphas = false;

    if (form[PROPERTYS.NUMBER.CODE]) {
        totalPrice += form[PROPERTYS.NUMBER.CODE] * priceInfo.nukki_price;
        totalPrice *= 1;
    }

    if (form[PROPERTYS.DIRECTING_NUMBER.CODE] &&
        ((form[PROPERTYS.DIRECTING_KIND.CODE] !== DIRECTING_PROPERTY.PROXY.CODE) &&
        (form[PROPERTYS.DIRECTING_KIND.CODE] !== DIRECTING_PROPERTY.DIRECTING_PROXY.CODE))) {
        totalPrice += form[PROPERTYS.DIRECTING_NUMBER.CODE] * priceInfo.directing_price;
        totalPrice *= 1;
    }

    if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE) {
        if (form[PROPERTYS.PROXY_NUMBER.CODE]) {
            totalPrice += form[PROPERTYS.PROXY_NUMBER.CODE] * priceInfo.proxy_price;
            totalPrice *= 1;

            if (form[PROPERTYS.PROXY_NUMBER.CODE] > 9) {
                hasAlphas = true;
            } else {
                hasAlphas = false;
            }
        } else {
            totalPrice = 0;
        }
    }

    if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.DIRECTING_PROXY.CODE) {
        if (form[PROPERTYS.DIRECTING_PROXY_NUMBER.CODE]) {
            totalPrice += form[PROPERTYS.DIRECTING_PROXY_NUMBER.CODE] * priceInfo.directing_proxy_price;
            totalPrice *= 1;

            if (form[PROPERTYS.DIRECTING_PROXY_NUMBER.CODE] > 9) {
                hasAlphas = true;
            } else {
                hasAlphas = false;
            }
        } else {
            totalPrice = 0;
        }
    }

    if ((form[PROPERTYS.PROXY_NUMBER.CODE] < 1 || !form[PROPERTYS.PROXY_NUMBER.CODE]) &&
        (form[PROPERTYS.DIRECTING_PROXY_NUMBER.CODE] < 1 || !form[PROPERTYS.DIRECTING_PROXY_NUMBER.CODE])) {
        hasAlphas = false;
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

    if (key === STEP_KEY.FIRST && (form[PROPERTYS.NUMBER.CODE] || form[PROPERTYS.DIRECTING_NUMBER.CODE])) {
        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE) {
            resultText = `누끼 ${form[PROPERTYS.NUMBER.CODE] || 0} 컷 (컷당 40,000원)`;
        } else if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE && form[PROPERTYS.DIRECTING_NUMBER.CODE]) {
            resultText = `연출 ${form[PROPERTYS.DIRECTING_NUMBER.CODE] || 0} 컷 (컷당 60,000원)`;
            if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE && form[PROPERTYS.PROXY_NUMBER.CODE]) {
                resultText = `촬영대행 ${form[PROPERTYS.PROXY_NUMBER.CODE]} 컨셉 (컨셉 당 10만원)`;
            }
            if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.DIRECTING_PROXY.CODE && form[PROPERTYS.DIRECTING_PROXY_NUMBER.CODE]) {
                resultText = `연출대행 ${form[PROPERTYS.DIRECTING_PROXY_NUMBER.CODE]} 컨셉 (컨셉 당 20만원)`;
            }
        } else if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE) {
            // form[PROPERTYS.NUMBER.CODE] &&
            // form[PROPERTYS.DIRECTING_NUMBER.CODE]) {
            resultText = `누끼 ${form[PROPERTYS.NUMBER.CODE] || 0} 컷 (컷당 40,000원) / 연출 ${form[PROPERTYS.DIRECTING_NUMBER.CODE] || 0} 컷 (컷당 60,000원)`;

            if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE && form[PROPERTYS.PROXY_NUMBER.CODE]) {
                resultText = `누끼 ${form[PROPERTYS.NUMBER.CODE] || 0} 컷 (컷당 40,000원) / 촬영대행 ${form[PROPERTYS.PROXY_NUMBER.CODE]} 컨셉 (컨셉 당 10만원)`;
            }
            if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.DIRECTING_PROXY.CODE && form[PROPERTYS.DIRECTING_PROXY_NUMBER.CODE]) {
                resultText = `누끼 ${form[PROPERTYS.NUMBER.CODE] || 0} 컷 (컷당 40,000원) / 연출대행 ${form[PROPERTYS.DIRECTING_PROXY_NUMBER.CODE]} 컨셉 (컨셉 당 20만원)`;
            }
        }
    }

    if (key === STEP_KEY.SECOND && !!form[PROPERTYS.NOTE.CODE]) {
        let text = `${form[PROPERTYS.NOTE.CODE]}`;
        if (form[shotKindCode] !== SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE) {
            if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.BASIC.CODE) {
                text += " / 기본연출";
            } else if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE) {
                text += " / 촬영대행";
            } else if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.DIRECTING_PROXY.CODE) {
                text += " / 연출대행";
            }
        }
        resultText = text;
    }

    return resultText || false;
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
    let _name = name;
    const numberCode = PROPERTYS.NUMBER.CODE;
    const nukkiShotCode = SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE;
    const directingShotCode = SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE;
    const nPlusdShotCode = SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE;
    const directingNumberCode = PROPERTYS.DIRECTING_NUMBER.CODE;
    const directingKindCode = PROPERTYS.DIRECTING_KIND.CODE;

    if (name === nukkiShotCode) {              // 누끼샷의 인풋네임을 number로 변경한다.
        _name = numberCode;
    } else if (name === directingShotCode) {   // 연출샷의 인풋네임을 directing_number로 변경한다.
        _name = directingNumberCode;
    }

    // 누끼샷과 연출샷 카운팅에 따라 샷종류를 변경한다.
    if (name === nukkiShotCode) {
        let shot_kind = nukkiShotCode;

        // 누끼컷 갯수가 있고 연출컷 갯수가 있으면
        if (Number(value) && form[directingNumberCode]) {
            shot_kind = nPlusdShotCode;
        } else if (!Number(value) && form[directingNumberCode]) {
            shot_kind = directingShotCode;
        } else if (!Number(value) && !form[directingNumberCode]) {
            shot_kind = "";
        }

        // 변경된 샷 종류를 폼데이터에 저장한다.
        form[PROPERTYS.SHOT_KIND.CODE] = shot_kind;
    } else if (name === directingShotCode) {
        const directingProxyNumberCode = PROPERTYS.DIRECTING_PROXY_NUMBER.CODE;
        let shot_kind = directingShotCode;
        if (Number(value) &&
            (form[directingKindCode] !== DIRECTING_PROPERTY.PROXY.CODE || form[directingKindCode] !== DIRECTING_PROPERTY.DIRECTING_PROXY.CODE)) {
            form[directingKindCode] = DIRECTING_PROPERTY.BASIC.CODE;
        }

        if (!Number(value)) {
            form[directingKindCode] = "";
            form[PROPERTYS.PROXY_NUMBER.CODE] = "";

            if (Object.hasOwnProperty.call(form, directingProxyNumberCode)) {
                form[directingProxyNumberCode] = "";
            }
        }
        if (Number(value) && form[numberCode]) {
            shot_kind = nPlusdShotCode;
        } else if (!Number(value) && form[numberCode]) {
            shot_kind = nukkiShotCode;
        } else if (!Number(value) && !form[numberCode]) {
            shot_kind = "";
            form[PROPERTYS.TOTAL_PRICE.CODE] = "";
        }
        form[PROPERTYS.SHOT_KIND.CODE] = shot_kind;
    }

    if (Number(value) === 0) {
        value = "";
    }

    form[_name] = value;

    return form;
};

const onRadio = (form, code) => {
    if (code === DIRECTING_PROPERTY.BASIC.CODE) {
        if (form[PROPERTYS.PROXY_NUMBER.CODE] && form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE) {
            form[PROPERTYS.PROXY_NUMBER.CODE] = "";
        }

        if (form[PROPERTYS.DIRECTING_PROXY_NUMBER.CODE] && form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.DIRECTING_PROXY.CODE) {
            form[PROPERTYS.DIRECTING_PROXY_NUMBER.CODE] = "";
        }

        form[PROPERTYS.DIRECTING_KIND.CODE] = code;
    } else if (code === DIRECTING_PROPERTY.PROXY.CODE) {
        if (form[PROPERTYS.DIRECTING_PROXY_NUMBER.CODE] && form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.DIRECTING_PROXY.CODE) {
            form[PROPERTYS.DIRECTING_PROXY_NUMBER.CODE] = "";
        }
        form[PROPERTYS.DIRECTING_KIND.CODE] = code;
    } else if (code === DIRECTING_PROPERTY.DIRECTING_PROXY.CODE) {
        if (form[PROPERTYS.PROXY_NUMBER.CODE] && form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE) {
            form[PROPERTYS.PROXY_NUMBER.CODE] = "";
        }
        form[PROPERTYS.DIRECTING_KIND.CODE] = code;
    }

    return form;
};

const setStepProcess = (data, processData) => {
    const { totalStep, form, st, step } = processData;
    if (st === 1) {
        const prop = data[step].PROP;
        let name = PROPERTYS.NUMBER.CODE;
        const test = prop.some(p => {
            if (p.CODE === SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE) {
                name = PROPERTYS.DIRECTING_NUMBER.CODE;
            }
            return form[name];
        });

        if (test) {
            data[step].ACTIVE = true;
        } else {
            data[step].ACTIVE = false;
        }
    } else if (st !== totalStep && st === 2) {
        data[step].ACTIVE = true;
    } else if (st === totalStep) {
        data[step].ACTIVE = false;
        if ((form[PROPERTYS.SHOT_KIND.CODE] !== SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE &&
            form[PROPERTYS.DIRECTING_KIND.CODE] && form[PROPERTYS.NOTE.CODE]) ||
            (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE && form[PROPERTYS.NOTE.CODE])) {
            data[step].ACTIVE = true;
        }
    }
};

const isLastFlag = () => {
    return false;
};

export default { calculatePrice, exchangeResultText, onRadio, setStepProcess, onCheck, onChange, isLastFlag };
