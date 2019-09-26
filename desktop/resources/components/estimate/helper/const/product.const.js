import {
    PROPERTYS,
    SHOT_KIND_PROPERTY,
    DIRECTING_PROPERTY,
    SIZE_PROPERTY,
    MATERIAL_PROPERTY,
    UNIT_DATA,
    PRE_TEXT
} from "./base.const";

const STEP_PROCESS = {
    STEP: {
        FIRST: {
            ACTIVE: false,
            CODE: "Step01",
            NAME: "촬영컷수",
            TITLE: "촬영 컷 수를 입력해 주세요.",
            CAPTION: "필요한 촬영의 컷수만 입력. 3개의 제품을 각 2컷씩 찍는 경우 총 6컷 입력",
            RESULT_TEXT: "Step01 에서 정보를 입력해주세요.",
            PROP: [
                {
                    CODE: SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE,
                    NAME: "누끼촬영",
                    CAPTION: "배경을 삭제하는 작업을\n진행하는 이미지",
                    IMAGE: "/estimate/renew/product/image_01_2x.jpg",
                    NUMBER: true,
                    TEXT: false,
                    TYPE: "input",
                    UNIT: { ...UNIT_DATA.CUT, PRE: PRE_TEXT.CUT },
                    DEPTH: 1,
                    PLACEHOLDER: "ex. 3"
                },
                {
                    CODE: SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE,
                    NAME: "연출촬영",
                    CAPTION: "컨셉에 맞는 배경지,\n소품 등을 이용하여 촬영",
                    IMAGE: "/estimate/renew/product/image_02_2x.jpg",
                    NUMBER: true,
                    TEXT: false,
                    TYPE: "input",
                    UNIT: { ...UNIT_DATA.CUT, PRE: PRE_TEXT.CUT },
                    DEPTH: 1,
                    PLACEHOLDER: "ex. 3"
                }
            ]
        },
        SECOND: {
            ACTIVE: false,
            CODE: "Step02",
            NAME: "제품종류",
            TITLE: "제품 정보를 선택해 주세요.",
            CAPTION: "촬영하고자 하는 제품에 해당하는 경우만 선택 (중복가능)",
            RESULT_TEXT: "Step02 에서 정보를 입력해주세요.",
            PROP: [
                {
                    CODE: PROPERTYS.MATERIAL.CODE,
                    NAME: "유광제품",
                    CAPTION: "빛의 강도나 각도를 조절하여\n촬영이 필요한 유광제품",
                    IMAGE: "/estimate/renew/product/image_03_2x.jpg",
                    NUMBER: false,
                    TEXT: false,
                    DEPTH: 1,
                    TYPE: "select"
                },
                {
                    CODE: PROPERTYS.SIZE.CODE,
                    NAME: "대형제품",
                    CAPTION: "대형가전 등 가로 혹은 세로의\n길이가 50cm 이상인 제품",
                    IMAGE: "/estimate/renew/product/image_04_2x.jpg",
                    NUMBER: false,
                    TEXT: false,
                    DEPTH: 1,
                    TYPE: "select"
                }
            ]
        },
        THIRD: {
            ACTIVE: false,
            CODE: "Step03",
            NAME: "촬영제품",
            TITLE: "추가정보를 입력해주세요.",
            CAPTION: "연출방법을 선택해주세요.",
            RESULT_TEXT: "Step03 에서 추가정보를 입력해주세요.",
            PROP: [
                {
                    CODE: PROPERTYS.NOTE.CODE,
                    NAME: "촬영하시려는\n제품이 무엇인가요?",
                    CAPTION: "",
                    IMAGE: "",
                    NUMBER: false,
                    TEXT: true,
                    TYPE: "input",
                    UNIT: "FREE",
                    DEPTH: 1,
                    PLACEHOLDER: "ex. 우산,핸드폰,가방..."
                },
                {
                    CODE: DIRECTING_PROPERTY.BASIC.CODE,
                    NAME: "기본연출",
                    CAPTION: "깔끔한 배경지에 1~2개\n소품으로 연출",
                    IMAGE: "/estimate/renew/product/image_05_2x.jpg",
                    NUMBER: false,
                    TEXT: false,
                    DEPTH: 1,
                    TYPE: "radio"
                },
                {
                    CODE: DIRECTING_PROPERTY.PROXY.CODE,
                    NAME: "촬영대행",
                    CAPTION: "컨셉갯수와 컷수가 명확하지 않은 경우\n시간당 1~2컨셉 촬영 후 원본 제공",
                    IMAGE: "/estimate/renew/product/image_06_2x.jpg",
                    NUMBER: true,
                    TEXT: false,
                    TYPE: "radio",
                    UNIT: { ...UNIT_DATA.COUNT, PRE: PRE_TEXT.COUNT },
                    DEPTH: 1,
                    PLACEHOLDER: "ex. 3"
                }
            ]
        }
    },
    TOTAL_STEP: 3,
    VIRTUAL_PROP: {
        // 촬영 종류 - nukki_shot, directing_shot
        [PROPERTYS.SHOT_KIND.CODE]: {
            CODE: PROPERTYS.SHOT_KIND.CODE,
            NAME: PROPERTYS.SHOT_KIND.NAME,
            VALUE: ""
        },
        // 사이즈
        [PROPERTYS.SIZE.CODE]: {
            CODE: PROPERTYS.SIZE.CODE,
            NAME: PROPERTYS.SIZE.NAME,
            VALUE: SIZE_PROPERTY.SMALL.CODE
        },
        // 소재
        [PROPERTYS.MATERIAL.CODE]: {
            CODE: PROPERTYS.MATERIAL.CODE,
            NAME: PROPERTYS.MATERIAL.NAME,
            VALUE: MATERIAL_PROPERTY.GLOSSLESS.CODE
        },
        // 제품수 - 누끼 제품 수
        [PROPERTYS.NUMBER.CODE]: {
            CODE: PROPERTYS.NUMBER.CODE,
            NAME: PROPERTYS.NUMBER.NAME,
            VALUE: ""
        },
        // 연출 종류 - basic, proxy
        [PROPERTYS.DIRECTING_KIND.CODE]: {
            CODE: PROPERTYS.DIRECTING_KIND.CODE,
            NAME: PROPERTYS.DIRECTING_KIND.NAME,
            VALUE: ""
        },
        // 필요 연출 총 컷수
        [PROPERTYS.DIRECTING_NUMBER.CODE]: {
            CODE: PROPERTYS.DIRECTING_NUMBER.CODE,
            NAME: PROPERTYS.DIRECTING_NUMBER.NAME,
            VALUE: ""
        },
        // 상품정보
        [PROPERTYS.NOTE.CODE]: {
            CODE: PROPERTYS.NOTE.CODE,
            NAME: PROPERTYS.NOTE.NAME,
            VALUE: ""
        },
        // 촬영대행 제품 수
        [PROPERTYS.PROXY_NUMBER.CODE]: {
            CODE: PROPERTYS.PROXY_NUMBER.CODE,
            NAME: PROPERTYS.PROXY_NUMBER.NAME,
            VALUE: ""
        }
    }
};

const PRICE_INFO = {
    [PROPERTYS.NUMBER.CODE]: 0,
    [PROPERTYS.DIRECTING_NUMBER.CODE]: 0,
    [PROPERTYS.PROXY_NUMBER.CODE]: 0,
    nukki_price_1: 15000, // 소형, 무광
    nukki_price_2: 30000, // 소형, 유광
    nukki_price_3: 30000, // 대형, 무광
    nukki_price_4: 40000, // 대형, 유광
    directing_price: 40000,
    proxy_price: 100000
};

export default { STEP_PROCESS, PRICE_INFO };
