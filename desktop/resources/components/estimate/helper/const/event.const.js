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
            NAME: "촬영필요시간",
            TITLE: "촬영이 필요한 시간을 입력해 주세요.",
            CAPTION: "",
            RESULT_TEXT: "Step01 에서 정보를 입력해주세요.",
            PROP: [
                {
                    CODE: PROPERTYS.TOTAL_TIME.CODE,
                    NAME: "촬영시간",
                    CAPTION: "행사 전 후 포토타임 등이 있는 경우\n해당 시간을 모두 포함하여 입력",
                    IMAGE: "/estimate/renew/event/image_01_2x.jpg",
                    NUMBER: true,
                    TEXT: false,
                    TYPE: "input",
                    PLACEHOLDER: "ex. 3",
                    UNIT: { ...UNIT_DATA.TIME, PRE: PRE_TEXT.TOTAL }
                }
            ]
        },
        SECOND: {
            ACTIVE: false,
            CODE: "Step02",
            NAME: "촬영지역",
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
            CAPTION: "추가촬영이 필요한 경우만 선택해주세요. (중복가능)",
            RESULT_TEXT: "Step03 에서 추가정보를 입력해주세요.",
            PROP: [
                {
                    CODE: PROPERTYS.VIDEO_DIRECTING.CODE,
                    NAME: PROPERTYS.VIDEO_DIRECTING.NAME,
                    CAPTION: "영상촬영 후 편집과 자막이 필요한 경우\n추가비용이 발생할 수 있습니다.",
                    IMAGE: "/estimate/renew/event/image_02_2x.jpg",
                    NUMBER: false,
                    TEXT: false,
                    DEPTH: 1,
                    TYPE: "select"
                },
                {
                    CODE: PROPERTYS.IS_ALL_SHOT.CODE,
                    NAME: PROPERTYS.IS_ALL_SHOT.NAME,
                    CAPTION: "단체촬영이 필요한 경우\n선택해 주세요.",
                    IMAGE: "/estimate/renew/event/image_03_2x.jpg",
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
        // 촬영 지역
        [PROPERTYS.PLACE.CODE]: {
            CODE: PROPERTYS.PLACE.CODE,
            NAME: PROPERTYS.PLACE.NAME,
            VALUE: ""
        },
        // 촬영 시간
        [PROPERTYS.TOTAL_TIME.CODE]: {
            CODE: PROPERTYS.TOTAL_TIME.CODE,
            NAME: PROPERTYS.TOTAL_TIME.NAME,
            VALUE: ""
        },
        // 단체 사진 필요여부
        [PROPERTYS.IS_ALL_SHOT.CODE]: {
            CODE: PROPERTYS.IS_ALL_SHOT.CODE,
            NAME: PROPERTYS.IS_ALL_SHOT.NAME,
            VALUE: HAS_PROPERTY.NEEDLESS.CODE
        },
        // 단체 사진 컷수
        [PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]: {
            CODE: PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE,
            NAME: PROPERTYS.ALL_SHOT_NEED_NUMBER.NAME,
            VALUE: ""
        },
        // 영상 편집 필요여부
        [PROPERTYS.VIDEO_DIRECTING.CODE]: {
            CODE: PROPERTYS.VIDEO_DIRECTING.CODE,
            NAME: PROPERTYS.VIDEO_DIRECTING.NAME,
            VALUE: HAS_PROPERTY.NEEDLESS.CODE
        }
    }
};

const PRICE_INFO = {
    // 총 촬영시간
    [PROPERTYS.TOTAL_TIME.CODE]: 0,
    // 단체사진 필요 컷수
    [PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]: 0,
    // 사진 견적
    price_2h: 200000,
    price_3h: 290000,
    price_4h: 370000,
    price_5h: 440000,
    price_6h: 500000,
    price_7h: 550000,
    price_8h: 600000,
    price_9h: 650000,
    price_10h: 700000,
    // 시간 추가당 비용
    price_add_hour: 100000,
    // 영상만 추가 단가
    video_price: 100000,
    // 단체사진 컷당 단가 5만원
    all_shot_price: 50000,
    // 촬영지역 단가 5만원
    place_price: 50000
};

export default { STEP_PROCESS, PRICE_INFO };
