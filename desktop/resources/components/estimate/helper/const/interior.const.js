import {
    HAS_PROPERTY,
    PLACE_PROPERTY,
    PROPERTYS,
    UNIT_DATA,
    PRE_TEXT
} from "./base.const";

const STEP_PROCESS = {
    STEP: {
        FIRST: {
            ACTIVE: false,
            CODE: "Step01",
            NAME: "촬영컷수",
            TITLE: "이미지 사용처에 따라 필요한 총 컷수를 입력해주세요.",
            CAPTION: "",
            RESULT_TEXT: "Step01 에서 정보를 입력해주세요.",
            PROP: [
                {
                    CODE: PROPERTYS.NEED_NUMBER.CODE,
                    NAME: "이미지 컷수",
                    CAPTION: "구역 당 3컷 씩 2구역을\n촬영하는 경우 총 6컷 입력",
                    IMAGE: "/estimate/renew/interior/image_01_2x.jpg",
                    NUMBER: true,
                    TEXT: false,
                    TYPE: "input",
                    PLACEHOLDER: "ex. 3",
                    UNIT: { ...UNIT_DATA.CUT, PRE: PRE_TEXT.TOTAL }
                }
            ]
        },
        SECOND: {
            ACTIVE: false,
            CODE: "Step02",
            NAME: "촬영장소",
            TITLE: "촬영 지역을 선택해 주세요.",
            CAPTION: "",
            RESULT_TEXT: "Step02 에서 정보를 입력해주세요.",
            PROP: [
                {
                    CODE: PROPERTYS.PLACE.CODE,
                    NAME: "",
                    CAPTION: "촬영 지역을 선택해주세요.",
                    IMAGE: "",
                    NUMBER: false,
                    TEXT: false,
                    WIDTH: 600,
                    DEPTH: 2,
                    TYPE: "inline-radio",
                    PROP: [
                        {
                            CODE: PLACE_PROPERTY.SEOUL.CODE,
                            NAME: PLACE_PROPERTY.SEOUL.NAME,
                            CAPTION: "",
                            IMAGE: "",
                            NUMBER: false,
                            TEXT: false,
                            TYPE: "radio"
                        },
                        {
                            CODE: PLACE_PROPERTY.GYEONGGI.CODE,
                            NAME: PLACE_PROPERTY.GYEONGGI.NAME,
                            CAPTION: "",
                            IMAGE: "",
                            NUMBER: false,
                            TEXT: false,
                            TYPE: "radio"
                        },
                        {
                            CODE: PLACE_PROPERTY.ETC.CODE,
                            NAME: PLACE_PROPERTY.ETC.NAME,
                            CAPTION: "",
                            IMAGE: "",
                            NUMBER: false,
                            TEXT: false,
                            TYPE: "radio"
                        }
                    ]
                }
            ]
        },
        THIRD: {
            ACTIVE: false,
            CODE: "Step03",
            NAME: "추가정보",
            TITLE: "추가정보를 입력해주세요.",
            CAPTION: "추가컷이 필요한 경우만 선택해주세요. (중복가능)",
            RESULT_TEXT: "Step03 에서 추가정보를 입력해주세요.",
            PROP: [
                {
                    CODE: PROPERTYS.IS_EXTERIOR.CODE,
                    NAME: PROPERTYS.IS_EXTERIOR.NAME,
                    CAPTION: "건물 외부, 전체 전경 촬영을 진행하여\n배경 및 외부 이미지의 합성을 진행",
                    IMAGE: "/estimate/renew/interior/image_02_2x.jpg",
                    NUMBER: true,
                    TEXT: false,
                    DEPTH: 1,
                    PLACEHOLDER: "ex. 3",
                    TYPE: "select",
                    UNIT: { ...UNIT_DATA.CUT, PRE: PRE_TEXT.TOTAL }
                },
                {
                    CODE: PROPERTYS.INSIDE_CUT_COMPOSE.CODE,
                    NAME: PROPERTYS.INSIDE_CUT_COMPOSE.NAME,
                    CAPTION: "오션뷰 등 창 밖 풍경을\n강조해야하는 경우 촬영 후 합성 진행",
                    IMAGE: "/estimate/renew/interior/image_03_2x.jpg",
                    NUMBER: true,
                    TEXT: false,
                    PLACEHOLDER: "ex. 3",
                    DEPTH: 1,
                    TYPE: "select",
                    UNIT: { ...UNIT_DATA.CUT, PRE: PRE_TEXT.TOTAL }
                }
            ]
        }
    },
    TOTAL_STEP: 3,
    VIRTUAL_PROP: {
        [PROPERTYS.NEED_NUMBER.CODE]: {
            CODE: PROPERTYS.NEED_NUMBER.CODE,
            NAME: PROPERTYS.NEED_NUMBER.NAME,
            VALUE: ""
        },
        [PROPERTYS.EXTERIOR_NUMBER.CODE]: {
            CODE: PROPERTYS.EXTERIOR_NUMBER.CODE,
            NAME: PROPERTYS.EXTERIOR_NUMBER.NAME,
            VALUE: ""
        },
        [PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE]: {
            CODE: PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE,
            NAME: PROPERTYS.INSIDE_COMPOSE_NUMBER.NAME,
            VALUE: ""
        },
        [PROPERTYS.IS_EXTERIOR.CODE]: {
            CODE: PROPERTYS.IS_EXTERIOR.CODE,
            NAME: PROPERTYS.IS_EXTERIOR.NAME,
            VALUE: HAS_PROPERTY.NEEDLESS.CODE
        },
        [PROPERTYS.INSIDE_CUT_COMPOSE.CODE]: {
            CODE: PROPERTYS.INSIDE_CUT_COMPOSE.CODE,
            NAME: PROPERTYS.INSIDE_CUT_COMPOSE.NAME,
            VALUE: HAS_PROPERTY.NEEDLESS.CODE
        },
        [PROPERTYS.PLACE.CODE]: {
            CODE: PROPERTYS.PLACE.CODE,
            NAME: PROPERTYS.PLACE.NAME,
            VALUE: ""
        }
    }
};

const PRICE_INFO = {
    [PROPERTYS.NEED_NUMBER.CODE]: 0,
    [PROPERTYS.EXTERIOR_NUMBER.CODE]: 0,
    [PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE]: 0,
    // 컷당 단가
    cut_p_price: 20000,
    // 지역 단가
    place_price: 50000,
    // 익스테리어 단가
    exterior_price: 50000,
    // 내부컷 합성 단가
    compose_p_cut: 40000
};

export default { STEP_PROCESS, PRICE_INFO };
