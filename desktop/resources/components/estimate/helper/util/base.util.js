import { STEP_KEY } from "../const/base.const";

/**
 * 현재스텝을 숫자로 변경한다.
 * @param currentStep
 * @returns {null}
 */
export function stepToNumber(currentStep) {
    let number = null;
    switch (currentStep) {
        case STEP_KEY.FIRST: number = 1; break;
        case STEP_KEY.SECOND: number = 2; break;
        case STEP_KEY.THIRD: number = 3; break;
        default:
    }

    return number;
}

/**
 * 숫자를 스텝 형태의 스트링을 변경한다.
 */
export function numberToStep(number) {
    let step = null;

    if (Number.isNaN(number)) {
        throw new Error("number is not number");
    }

    switch (Number(number)) {
        case 1: step = "FIRST"; break;
        case 2: step = "SECOND"; break;
        case 3: step = "THIRD"; break;
        default:
    }

    return step;
}
