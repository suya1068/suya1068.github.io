import {
    PROPERTYS,
    SHOT_KIND_PROPERTY,
    DIRECTING_PROPERTY,
    HAS_PROPERTY,
    PLACE_PROPERTY,
    UNIT_DATA,
    PRE_TEXT
} from "./base.const";

const STEP_PROCESS = {
    STEP: {
        FIRST: {
            ACTIVE: false,
            CODE: "Step01",
            NAME: "인원입력",
            TITLE: "촬영 인원을 입력해주세요.",
            CAPTION: "",
            RESULT_TEXT: "Step01 에서 정보를 입력해주세요.",
            PROP: [
                {
                    CODE: PROPERTYS.PERSON_NUMBER.CODE,
                    NAME: "인원입력",
                    CAPTION: "촬영하려는 총 인원을\n입력해주세요.",
                    IMAGE: "/estimate/renew/profile_biz/image_01_2x.jpg",
                    PLACEHOLDER: "ex. 3",
                    NUMBER: true,
                    TEXT: false,
                    TYPE: "input",
                    UNIT: { ...UNIT_DATA.PERSON, PRE: PRE_TEXT.TOTAL }
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
                    IMAGE: "",
                    NUMBER: false,
                    TEXT: false,
                    TYPE: "radio"
                },
                {
                    CODE: PLACE_PROPERTY.OUTSIDE_S.CODE,
                    NAME: PLACE_PROPERTY.OUTSIDE_S.NAME,
                    CAPTION: "고객님께서 원하는\n장소에서 촬영 진행",
                    IMAGE: "",
                    NUMBER: false,
                    TEXT: false,
                    TYPE: "radio"
                },
                {
                    CODE: PLACE_PROPERTY.OUTSIDE_E.CODE,
                    NAME: PLACE_PROPERTY.OUTSIDE_E.NAME,
                    CAPTION: "서울 외의 지역에서\n촬영 하는 경우 선택",
                    IMAGE: "",
                    NUMBER: false,
                    TEXT: false,
                    TYPE: "radio"
                }
            ]
        },
        THIRD: {
            ACTIVE: false,
            CODE: "Step03",
            NAME: "추가정보",
            TITLE: "추가정보를 입력해 주세요.",
            CAPTION: "",
            RESULT_TEXT: "Step03 에서 추가정보를 입력해주세요.",
            PROP: [
                {
                    CODE: PROPERTYS.IS_ALL_SHOT.CODE,
                    NAME: "단체사진이 필요하신가요?",
                    CAPTION: "",
                    IMAGE: "",
                    NUMBER: false,
                    TEXT: true,
                    TYPE: "inline-radio",
                    DEPTH: 2,
                    PROP: [
                        {
                            CODE: HAS_PROPERTY.NEED.CODE,
                            NAME: "네. 필요합니다.",
                            TYPE: "radio",
                            UNIT: { ...UNIT_DATA.CUT, PRE: PRE_TEXT.TOTAL },
                            PLACEHOLDER: "ex. 3"
                        },
                        {
                            CODE: HAS_PROPERTY.NEEDLESS.CODE,
                            NAME: "아니오. 필요하지 않습니다.",
                            TYPE: "radio"
                        }
                    ]
                }
            ]
        }
    },
    TOTAL_STEP: 3,
    VIRTUAL_PROP: {
        // 촬영 인원
        [PROPERTYS.PERSON_NUMBER.CODE]: {
            CODE: PROPERTYS.PERSON_NUMBER.CODE,
            NAME: PROPERTYS.PERSON_NUMBER.NAME,
            VALUE: ""
        },
        [PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]: {
            CODE: PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE,
            NAME: PROPERTYS.ALL_SHOT_NEED_NUMBER.NAME,
            VALUE: ""
        },
        [PROPERTYS.LOCATION.CODE]: {
            CODE: PROPERTYS.LOCATION.CODE,
            NAME: PROPERTYS.LOCATION.NAME,
            VALUE: ""
        },
        [PROPERTYS.IS_ALL_SHOT.CODE]: {
            CODE: PROPERTYS.IS_ALL_SHOT.CODE,
            NAME: PROPERTYS.IS_ALL_SHOT.NAME,
            VALUE: ""
        }
    }
};

const PRICE_INFO = {
    [PROPERTYS.PERSON_NUMBER.CODE]: 0,
    [PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]: 0,
    // 컷당 단가_1
    person_p_price_1: 30000,
    // 컷당 단가_2
    person_p_price_2: 25000,
    // 기본 단가
    base_price: 300000,
    // 지역 단가
    place_price: 100000,
    // 단체 단가
    all_shot_price: 50000
};

export default { STEP_PROCESS, PRICE_INFO };
