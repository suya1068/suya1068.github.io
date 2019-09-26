import {
    PROPERTYS,
    SHOT_KIND_PROPERTY,
    DIRECTING_PROPERTY,
    SIZE_PROPERTY,
    MATERIAL_PROPERTY,
    PROXY_DIRECTING_PROPERTY,
    PLACE_PROPERTY,
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
            CAPTION: "",
            RESULT_TEXT: "Step01 에서 정보를 입력해주세요.",
            PROP: [
                {
                    CODE: SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE,
                    NAME: "누끼촬영",
                    CAPTION: "메뉴판 등에 사용되는\n배경없는 이미지",
                    IMAGE: "/estimate/renew/food/image_01_2x.jpg",
                    NUMBER: true,
                    TEXT: false,
                    TYPE: "input",
                    DEPTH: 1,
                    UNIT: { ...UNIT_DATA.CUT, PRE: PRE_TEXT.CUT },
                    PLACEHOLDER: "ex. 3"
                },
                {
                    CODE: SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE,
                    NAME: "연출촬영",
                    CAPTION: "컨셉에 맞는 배경지,\n소품 등을 이용하여 촬영",
                    IMAGE: "/estimate/renew/food/image_02_2x.jpg",
                    NUMBER: true,
                    TEXT: false,
                    TYPE: "input",
                    DEPTH: 1,
                    UNIT: { ...UNIT_DATA.CUT, PRE: PRE_TEXT.CUT },
                    PLACEHOLDER: "ex. 3"
                }
            ]
        },
        SECOND: {
            ACTIVE: false,
            CODE: "Step02",
            NAME: "촬영장소",
            TITLE: "촬영 장소를 선택해주세요.",
            CAPTION: "",
            RESULT_TEXT: "Step02 에서 정보를 입력해주세요.",
            PROP: [
                {
                    CODE: PLACE_PROPERTY.STUDIO.CODE,
                    NAME: "스튜디오 내방",
                    CAPTION: "작가님의 스튜디오로\n내방하여 촬영 진행",
                    IMAGE: "/estimate/renew/food/image_03_2x.jpg",
                    NUMBER: false,
                    TEXT: false,
                    DEPTH: 1,
                    TYPE: "radio"
                },
                {
                    CODE: PLACE_PROPERTY.OUTSIDE.CODE,
                    NAME: "출장",
                    CAPTION: "고객님께서 원하는 장소에서\n촬영 진행",
                    IMAGE: "/estimate/renew/food/image_04_2x.jpg",
                    NUMBER: false,
                    TEXT: false,
                    DEPTH: 1,
                    TYPE: "radio"
                }
            ]
        },
        THIRD: {
            ACTIVE: false,
            CODE: "Step03",
            NAME: "추가정보",
            TITLE: "추가정보를 입력해주세요.",
            CAPTION: "",
            RESULT_TEXT: "Step03 에서 추가정보를 입력해주세요.",
            PROP: [
                {
                    CODE: PROPERTYS.NOTE.CODE,
                    NAME: "촬영하시려는\n음식이 무엇인가요?",
                    CAPTION: "",
                    IMAGE: "",
                    NUMBER: false,
                    TEXT: true,
                    TYPE: "input",
                    DEPTH: 1,
                    UNIT: "FREE",
                    PLACEHOLDER: "ex.  햄버거, 케익, 한식 등"
                },
                {
                    CODE: PROPERTYS.PLACE.CODE,
                    NAME: "촬영 지역을\n선택해주세요.",
                    CAPTION: "",
                    IMAGE: "",
                    NUMBER: false,
                    TEXT: false,
                    TYPE: "inline-radio",
                    DEPTH: 2,
                    PROP: [
                        {
                            CODE: PLACE_PROPERTY.SEOUL.CODE,
                            NAME: "서울",
                            TYPE: "radio"
                        },
                        {
                            CODE: PLACE_PROPERTY.ETC.CODE,
                            NAME: "기타",
                            TYPE: "radio"
                        }
                    ]
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
        // 촬영장소
        [PROPERTYS.LOCATION.CODE]: {
            CODE: PROPERTYS.LOCATION.CODE,
            NAME: PROPERTYS.LOCATION.NAME,
            VALUE: ""
            // VALUE: PLACE_PROPERTY.STUDIO.CODE
        },
        // 촬영지역
        [PROPERTYS.PLACE.CODE]: {
            CODE: PROPERTYS.PLACE.CODE,
            NAME: PROPERTYS.PLACE.NAME,
            VALUE: ""
            // VALUE: PLACE_PROPERTY.SEOUL.CODE
        }
    }
};

const PRICE_INFO = {
    [PROPERTYS.NUMBER.CODE]: 0,
    [PROPERTYS.DIRECTING_NUMBER.CODE]: 0,
    // 누끼 단가
    nukki_price: 20000,
    // 연출 단가
    directing_price_studio: 60000,
    directing_price_outside: 50000,
    // 출장 + 가격
    outside_add_price: 100000
};

export default { STEP_PROCESS, PRICE_INFO };
