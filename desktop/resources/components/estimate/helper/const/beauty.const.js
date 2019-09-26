import {
    PROPERTYS,
    SHOT_KIND_PROPERTY,
    DIRECTING_PROPERTY,
    SIZE_PROPERTY,
    MATERIAL_PROPERTY,
    PROXY_DIRECTING_PROPERTY,
    UNIT_DATA,
    PRE_TEXT
} from "./base.const";

const STEP_PROCESS = {
    STEP: {
        FIRST: {
            ACTIVE: false,
            CODE: "Step 01",
            NAME: "필요컷 수",
            TITLE: "촬영 컷 수를 입력해 주세요.",
            CAPTION: "필요한 촬영의 컷수만 입력. 3개의 제품을 각 2컷씩 찍는 경우 총 6컷 입력",
            RESULT_TEXT: "Step01 에서 정보를 입력해주세요.",
            PROP: [
                {
                    CODE: SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE,
                    NAME: "누끼촬영",
                    CAPTION: "배경을 삭제하는 작업을\n진행하는 이미지",
                    IMAGE: "/estimate/renew/beauty/image_01_2x.jpg",
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
                    IMAGE: "/estimate/renew/beauty/image_02_2x.jpg",
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
            CODE: "Step 02",
            NAME: "촬영제품",
            TITLE: "추가정보를 입력해주세요.",
            CAPTION: "연출방법을 선택해주세요.",
            RESULT_TEXT: "Step02 에서 추가정보를 입력해주세요.",
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
                    PLACEHOLDER: "ex. 마스크팩, 세안제 등"
                },
                {
                    CODE: DIRECTING_PROPERTY.BASIC.CODE,
                    NAME: "기본연출",
                    CAPTION: "깔끔한 배경지에 1~2개\n소품으로 연출",
                    IMAGE: "/estimate/renew/beauty/image_02_2x.jpg",
                    NUMBER: false,
                    TEXT: false,
                    DEPTH: 1,
                    TYPE: "radio"
                },
                {
                    CODE: DIRECTING_PROPERTY.PROXY.CODE,
                    NAME: "촬영대행",
                    CAPTION: "컨셉갯수와 컷수가 명확하지 않은 경우\n시간당 1~2컨셉 촬영 후 원본 제공",
                    IMAGE: "/estimate/renew/beauty/image_03_2x.jpg",
                    NUMBER: true,
                    TEXT: false,
                    TYPE: "radio",
                    UNIT: { ...UNIT_DATA.CONCEPT, PRE: PRE_TEXT.CONCEPT },
                    DEPTH: 1,
                    PLACEHOLDER: "ex. 3"
                },
                {
                    CODE: DIRECTING_PROPERTY.DIRECTING_PROXY.CODE,
                    NAME: "연출대행",
                    CAPTION: "제품 샘플 및 컨셉 전달 받아 연출 소품 및\n레퍼런스 전달, 고객 컨펌 후 촬영",
                    IMAGE: "/estimate/renew/beauty/image_04_2x.jpg",
                    NUMBER: true,
                    TEXT: false,
                    TYPE: "radio",
                    UNIT: { ...UNIT_DATA.CONCEPT, PRE: PRE_TEXT.CONCEPT },
                    DEPTH: 1,
                    PLACEHOLDER: "ex. 3"
                }
            ]
        }
    },
    TOTAL_STEP: 2,
    VIRTUAL_PROP: {
        // 촬영 종류 - nukki_shot, directing_shot
        [PROPERTYS.SHOT_KIND.CODE]: {
            CODE: PROPERTYS.SHOT_KIND.CODE,
            NAME: PROPERTYS.SHOT_KIND.NAME,
            VALUE: ""
        },
        // 연출 종류 - basic, proxy, directing_proxy
        [PROPERTYS.DIRECTING_KIND.CODE]: {
            CODE: PROPERTYS.DIRECTING_KIND.CODE,
            NAME: PROPERTYS.DIRECTING_KIND.NAME,
            VALUE: ""
        },
        // 상품정보
        [PROPERTYS.NOTE.CODE]: {
            CODE: PROPERTYS.NOTE.CODE,
            NAME: PROPERTYS.NOTE.NAME,
            VALUE: ""
        },
        // 제품수 - 누끼 제품 수
        [PROPERTYS.NUMBER.CODE]: {
            CODE: PROPERTYS.NUMBER.CODE,
            NAME: PROPERTYS.NUMBER.NAME,
            VALUE: ""
        },
        // 필요 연출 총 컷수
        [PROPERTYS.DIRECTING_NUMBER.CODE]: {
            CODE: PROPERTYS.DIRECTING_NUMBER.CODE,
            NAME: PROPERTYS.DIRECTING_NUMBER.NAME,
            VALUE: ""
        },
        // 촬영대행 제품 수
        [PROPERTYS.PROXY_NUMBER.CODE]: {
            CODE: PROPERTYS.PROXY_NUMBER.CODE,
            NAME: PROPERTYS.PROXY_NUMBER.NAME,
            VALUE: ""
        },
        // 연출대행 제품 수
        [PROPERTYS.DIRECTING_PROXY_NUMBER.CODE]: {
            CODE: PROPERTYS.DIRECTING_PROXY_NUMBER.CODE,
            NAME: PROPERTYS.DIRECTING_PROXY_NUMBER.NAME,
            VALUE: ""
        }
    }
};

const PRICE_INFO = {
    [PROPERTYS.NUMBER.CODE]: 0,
    [PROPERTYS.DIRECTING_NUMBER.CODE]: 0,
    [PROPERTYS.PROXY_NUMBER.CODE]: 0,
    [PROPERTYS.DIRECTING_PROXY_NUMBER.CODE]: 0,
    nukki_price: 40000,
    directing_price: 60000,
    proxy_price: 100000,
    directing_proxy_price: 200000
};

export default { STEP_PROCESS, PRICE_INFO };
