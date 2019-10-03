import * as VIRTUAL_ESTIMATE_PROPERTYS from "shared/constant/virtual_estimate_property.const";

export const PROPERTYS = VIRTUAL_ESTIMATE_PROPERTYS.PROPERTYS;
export const SHOT_KIND_PROPERTY = VIRTUAL_ESTIMATE_PROPERTYS.SHOT_KIND_PROPERTY;
export const SIZE_PROPERTY = VIRTUAL_ESTIMATE_PROPERTYS.SIZE_PROPERTY;
export const MATERIAL_PROPERTY = VIRTUAL_ESTIMATE_PROPERTYS.MATERIAL_PROPERTY;
export const DIRECTING_PROPERTY = VIRTUAL_ESTIMATE_PROPERTYS.DIRECTING_PROPERTY;
export const PROXY_DIRECTING_PROPERTY = VIRTUAL_ESTIMATE_PROPERTYS.PROXY_DIRECTING_PROPERTY;
export const PLACE_PROPERTY = VIRTUAL_ESTIMATE_PROPERTYS.PLACE_PROPERTY;
export const HAS_PROPERTY = VIRTUAL_ESTIMATE_PROPERTYS.HAS_PROPERTY;
export const NUKKI_KIND_PROPERTY = VIRTUAL_ESTIMATE_PROPERTYS.NUKKI_KIND_PROPERTY;

export const UNIT_DATA = {
    CUT: { CODE: "CUT", NAME: "컷" },
    COUNT: { CODE: "COUNT", NAME: "개" },
    CONCEPT: { CODE: "CONCEPT", NAME: "컨셉" },
    PERSON: { CODE: "PERSON", NAME: "명" },
    TIME: { CODE: "TIME", NAME: "시간" }
};

export const PRE_TEXT = {
    CUT: { CODE: "CUT", NAME: "필요컷 수" },
    COUNT: { CODE: "COUNT", NAME: "제품 수" },
    CONCEPT: { CODE: "CONCEPT", NAME: "컨셉 수" },
    TOTAL: { CODE: "TOTAL", NAME: "총" }
    // TIME: { CODE: "TIME", NAME: "시간" }
};

export const STEP_KEY = {
    FIRST: "FIRST",
    SECOND: "SECOND",
    THIRD: "THIRD"
};

const PAGE_KEY = {
    MAIN: "main",
    LIST: "list",
    DETAIL: "detail"
};

export const PAGE_TYPE_DATA = {
    [PAGE_KEY.MAIN]: {
        CODE: PAGE_KEY.MAIN,
        NAME: "메인",
        TITLE: "정직한 촬영비용,\n3초만에 확인해보세요!",
        BUTTON: {
            TEXT: "이 견적으로 촬영 가능한 작가 확인하기",
            TYPE: "full"
        },
        DIST: {
            BASE: 60,
            LAST: 200
        }
    },
    [PAGE_KEY.LIST]: {
        CODE: PAGE_KEY.LIST,
        NAME: "리스트",
        TITLE: "정직한 촬영비,\n포스냅 예상견적으로 확인해 보세요!",
        BUTTON: {
            TEXT: "이메일로 견적 발송",
            TYPE: "half"
        },
        DIST: {
            BASE: -40,
            LAST: 50
        }
    },
    [PAGE_KEY.DETAIL]: {
        CODE: PAGE_KEY.DETAIL,
        NAME: "상세",
        TITLE: "예상 견적을 확인해보세요.",
        BUTTON: {
            TEXT: "위의 견적으로 문의하기",
            TYPE: "full"
        },
        DIST: {
            BASE: -20,
            LAST: 40
        }
    }
};