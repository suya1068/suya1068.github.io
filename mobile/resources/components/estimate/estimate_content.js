const STATE = {
    OPTIONS: {
        key: "options",         // 객체 키
        PERSON: "person_cnt",   // 촬영인원
        QUANTITY: "product_cnt", // 제품 수
        // SIZE: "product_size",   // 제품크기
        DIRECTION: "make_cnt",  // 연출사진 컷수
        OUTLINE: "path_cnt",    // 누끼사진 컷수
        PLACE: "place",         // 장소섭외
        STUDIO: "studio",       // 스튜디오 대여
        MODEL: "model",         // 전문모델
        BEAUTY: "beauty",       // 헤어/메이크업
        CLOTHES: "dress",       // 의상대여
        PRINT: "print",         // 인화(앨범)
        CONCEPT: "concept_cnt", // 컨셉 수
        INSIDE: "in_cnt",       // 내부컷수
        OUTSIDE: "out_cnt"      // 외부컷수
    }
};

const CATEGORY_KEYS = {
    PRODUCT: "PRODUCT",
    FOOD: "FOOD",
    AD: "AD",
    PROFILE: "PROFILE",
    EVENT: "EVENT",
    INTERIOR: "INTERIOR",
    WEDDING: "WEDDING",
    BABY: "BABY",
    SNAP: "SNAP"
};
// const CATEGORY_KEYS = {
//     PRODUCT: "product",
//     FOOD: "food",
//     AD: "ad",
//     PROFILE: "profile",
//     EVENT: "event",
//     INTERIOR: "interior",
//     WEDDING: "wedding",
//     BABY: "baby",
//     SNAP: "snap"
// };

const STATE_CONST = {
    [STATE.OPTIONS.QUANTITY]: {
        key: STATE.OPTIONS.QUANTITY,
        title: "제품 수",
        subtitle: undefined
    },
    [STATE.OPTIONS.PERSON]: {
        key: STATE.OPTIONS.PERSON,
        title: "촬영인원",
        subtitle: undefined
    },
    // [STATE.OPTIONS.SIZE]: {
    //     key: STATE.OPTIONS.SIZE,
    //     title: "제품크기",
    //     subtitle: undefined
    // },
    [STATE.OPTIONS.DIRECTION]: {
        key: STATE.OPTIONS.DIRECTION,
        title: "연출사진",
        subtitle: "컷수"
    },
    [STATE.OPTIONS.OUTLINE]: {
        key: STATE.OPTIONS.OUTLINE,
        title: "누끼사진",
        subtitle: "컷수"
    },
    [STATE.OPTIONS.PLACE]: {
        key: STATE.OPTIONS.PLACE,
        title: "장소섭외",
        subtitle: null
    },
    [STATE.OPTIONS.STUDIO]: {
        key: STATE.OPTIONS.STUDIO,
        title: "스튜디오 대여",
        subtitle: null
    },
    [STATE.OPTIONS.MODEL]: {
        key: STATE.OPTIONS.MODEL,
        title: "전문모델",
        subtitle: null
    },
    [STATE.OPTIONS.BEAUTY]: {
        key: STATE.OPTIONS.BEAUTY,
        title: "헤어/메이크업",
        subtitle: null
    },
    [STATE.OPTIONS.CLOTHES]: {
        key: STATE.OPTIONS.CLOTHES,
        title: "의상대여",
        subtitle: null
    },
    [STATE.OPTIONS.PRINT]: {
        key: STATE.OPTIONS.PRINT,
        title: "인화(앨범)",
        subtitle: null
    },
    [STATE.OPTIONS.CONCEPT]: {
        key: STATE.OPTIONS.CONCEPT,
        title: "컨셉 수",
        subtitle: undefined
    },
    [STATE.OPTIONS.INSIDE]: {
        key: STATE.OPTIONS.INSIDE,
        title: "내부컷수",
        subtitle: undefined
    },
    [STATE.OPTIONS.OUTSIDE]: {
        key: STATE.OPTIONS.OUTSIDE,
        title: "외부컷수",
        subtitle: undefined
    }
};

export const CATEGORY_VALUE = {
    [CATEGORY_KEYS.PRODUCT]: [
        STATE_CONST[STATE.OPTIONS.QUANTITY],
        // STATE_CONST[STATE.OPTIONS.SIZE],
        STATE_CONST[STATE.OPTIONS.DIRECTION],
        STATE_CONST[STATE.OPTIONS.OUTLINE]
    ],
    [CATEGORY_KEYS.FOOD]: [
        STATE_CONST[STATE.OPTIONS.QUANTITY],
        // STATE_CONST[STATE.OPTIONS.SIZE],
        STATE_CONST[STATE.OPTIONS.DIRECTION],
        STATE_CONST[STATE.OPTIONS.OUTLINE]
    ],
    [CATEGORY_KEYS.AD]: [
        STATE_CONST[STATE.OPTIONS.CONCEPT],
        STATE_CONST[STATE.OPTIONS.PLACE],
        STATE_CONST[STATE.OPTIONS.MODEL],
        STATE_CONST[STATE.OPTIONS.BEAUTY],
        STATE_CONST[STATE.OPTIONS.CLOTHES]
    ],
    [CATEGORY_KEYS.PROFILE]: [
        STATE_CONST[STATE.OPTIONS.PERSON],
        STATE_CONST[STATE.OPTIONS.STUDIO],
        STATE_CONST[STATE.OPTIONS.BEAUTY],
        STATE_CONST[STATE.OPTIONS.CLOTHES]
    ],
    [CATEGORY_KEYS.EVENT]: [
        STATE_CONST[STATE.OPTIONS.PERSON]
    ],
    [CATEGORY_KEYS.INTERIOR]: [
        STATE_CONST[STATE.OPTIONS.INSIDE],
        STATE_CONST[STATE.OPTIONS.OUTSIDE]
    ],
    [CATEGORY_KEYS.WEDDING]: [
        STATE_CONST[STATE.OPTIONS.CONCEPT],
        STATE_CONST[STATE.OPTIONS.STUDIO],
        STATE_CONST[STATE.OPTIONS.BEAUTY],
        STATE_CONST[STATE.OPTIONS.CLOTHES],
        STATE_CONST[STATE.OPTIONS.PRINT]
    ],
    [CATEGORY_KEYS.BABY]: [
        STATE_CONST[STATE.OPTIONS.PERSON],
        STATE_CONST[STATE.OPTIONS.CONCEPT],
        STATE_CONST[STATE.OPTIONS.STUDIO],
        STATE_CONST[STATE.OPTIONS.BEAUTY],
        STATE_CONST[STATE.OPTIONS.CLOTHES],
        STATE_CONST[STATE.OPTIONS.PRINT]
    ],
    [CATEGORY_KEYS.SNAP]: [
        STATE_CONST[STATE.OPTIONS.PERSON],
        // STATE_CONST[STATE.OPTIONS.STUDIO],
        STATE_CONST[STATE.OPTIONS.BEAUTY],
        STATE_CONST[STATE.OPTIONS.CLOTHES],
        STATE_CONST[STATE.OPTIONS.PRINT]
    ]
};
