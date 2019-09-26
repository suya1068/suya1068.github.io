import {
    HAS_PROPERTY,
    PLACE_PROPERTY,
    PROPERTYS,
    UNIT_DATA,
    NUKKI_KIND_PROPERTY,
    SHOT_KIND_PROPERTY,
    PRE_TEXT
} from "./base.const";

const STEP_PROCESS = {
    STEP: {
        FIRST: {
            ACTIVE: false,
            CODE: "Step01",
            NAME: "촬영컷수",
            TITLE: "촬영 컷수 및 시간을 입력해 주세요.",
            CAPTION: "필요한 촬영의 컷수만 입력. 3개의 제품을 각 2컷씩 찍는 경우 총 6컷 입력",
            IMAGE_PATH: "/estimate/renew/fashion",
            RESULT_TEXT: "Step01 에서 정보를 입력해주세요.",
            PROP: [
                {
                    CODE: SHOT_KIND_PROPERTY.NUKKI.CODE,
                    NAME: "누끼촬영",
                    CAPTION: "배경을 삭제하는 작업을\n진행하는 이미지",
                    IMAGE_WEB: "/image_01_2x.jpg",
                    IMAGE_MOBILE: "/m_image_01_2x.jpg",
                    IMAGE: true,
                    NUMBER: true,
                    TEXT: false,
                    TYPE: "select",
                    PLACEHOLDER: "ex. 3",
                    UNIT: { ...UNIT_DATA.CUT, PRE: PRE_TEXT.CUT }
                },
                {
                    CODE: SHOT_KIND_PROPERTY.MODEL_SHOT.CODE,
                    NAME: "모델촬영",
                    CAPTION: "원본+톤보정본 전체 제공으로\n개별컷 리터칭은 추가금액 발생.",
                    IMAGE_WEB: "/image_02_2x.jpg",
                    IMAGE_MOBILE: "/m_image_02_2x.jpg",
                    IMAGE: true,
                    NUMBER: false,
                    TEXT: false,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: "shot",
                            NAME: "2시간",
                            CAPTION: "",
                            IMAGE: "",
                            NUMBER: false,
                            TEXT: false,
                            TYPE: "radio"
                        },
                        {
                            CODE: "half",
                            NAME: "4시간",
                            CAPTION: "",
                            IMAGE: "",
                            NUMBER: false,
                            TEXT: false,
                            TYPE: "radio"
                        },
                        {
                            CODE: "full",
                            NAME: "8시간",
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
        SECOND: {
            ACTIVE: false,
            CODE: "Step02",
            NAME: "촬영정보",
            TITLE: "촬영 정보를 선택해 주세요.",
            CAPTION_PRI: "섭외가 필요한 경우 선택해주세요. (중복가능)",
            CAPTION_SUB: "누끼 종류를 선택해주세요.",
            IMAGE_PATH: "/estimate/renew/fashion",
            RESULT_TEXT: "Step02 에서 정보를 입력해주세요.",
            PROP: [
                {
                    CODE: NUKKI_KIND_PROPERTY.FLOOR_NUKKI.CODE,
                    NAME: "바닥누끼",
                    GROUP: 2,
                    CAPTION: "의상을 바닥에 두고 옷의\n소재 및 컬러감이 잘 드러나도록 촬영",
                    IMAGE_WEB: "/image_05_2x.jpg",
                    IMAGE_MOBILE: "/m_image_05_2x.jpg",
                    IMAGE: true,
                    NUMBER: false,
                    TEXT: false,
                    DEPTH: 1,
                    TYPE: "radio"
                },
                {
                    CODE: NUKKI_KIND_PROPERTY.MANNEQUIN_NUKKI.CODE,
                    NAME: "마네킹누끼",
                    GROUP: 2,
                    CAPTION: "마네킹 혹은 옷걸이에 의상을\n배치하고 촬영",
                    IMAGE_WEB: "/image_06_2x.jpg",
                    IMAGE_MOBILE: "/m_image_06_2x.jpg",
                    IMAGE: true,
                    NUMBER: false,
                    TEXT: false,
                    DEPTH: 1,
                    TYPE: "radio"
                },
                {
                    CODE: NUKKI_KIND_PROPERTY.GHOST_CUT.CODE,
                    NAME: "고스트컷",
                    GROUP: 2,
                    CAPTION: "전용 마네킹을 이용하여\n투명 누끼 진행",
                    IMAGE_WEB: "/image_07_2x.jpg",
                    IMAGE_MOBILE: "/m_image_07_2x.jpg",
                    IMAGE: true,
                    NUMBER: false,
                    TEXT: false,
                    DEPTH: 1,
                    TYPE: "radio"
                },
                {
                    CODE: PROPERTYS.MODEL_CASTING.CODE,
                    NAME: "모델섭외",
                    GROUP: 1,
                    CAPTION: "국내성인모델/일반촬영\n기준으로 견적책정",
                    IMAGE_WEB: "/image_03_2x.jpg",
                    IMAGE_MOBILE: "/m_image_03_2x.jpg",
                    IMAGE: true,
                    NUMBER: false,
                    TEXT: false,
                    DEPTH: 1,
                    TYPE: "select"
                },
                {
                    CODE: PROPERTYS.H_M_CASTING.CODE,
                    NAME: "헤어 메이크업 섭외",
                    GROUP: 1,
                    CAPTION: "1인 1컨셉 메이크업 간단한 수정\n 메이크업 진행 비용으로 견적 변동 가능",
                    IMAGE_WEB: "/image_04_2x.jpg",
                    IMAGE_MOBILE: "/m_image_04_2x.jpg",
                    IMAGE: true,
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
            NAME: "추가정보",
            TITLE: "추가정보를 선택해주세요.",
            CAPTION: "추가컷이 필요한 경우만 선택해주세요. (중복가능)",
            IMAGE_PATH: "/estimate/renew/fashion",
            RESULT_TEXT: "Step03 에서 추가정보를 입력해주세요.",
            PROP: [
                {
                    CODE: PROPERTYS.IS_DETAIL_CUT.CODE,
                    NAME: "디테일컷 필요",
                    CAPTION: "전체컷이 아닌 부분의\n상세 이미지 촬영",
                    IMAGE_WEB: "/image_08_2x.jpg",
                    IMAGE_MOBILE: "/m_image_08_2x.jpg",
                    IMAGE: true,
                    NUMBER: true,
                    TEXT: false,
                    DEPTH: 1,
                    PLACEHOLDER: "ex. 3",
                    TYPE: "select",
                    UNIT: { ...UNIT_DATA.CUT, PRE: PRE_TEXT.CUT }
                },
                {
                    CODE: PROPERTYS.IS_RETOUCH_ADD.CODE,
                    NAME: "리터치 추가 필요",
                    CAPTION: "기본제공 리터치 외의\n추가 리터치가 필요한 경우",
                    IMAGE_WEB: "/image_09_2x.jpg",
                    IMAGE_MOBILE: "/m_image_09_2x.jpg",
                    IMAGE: true,
                    NUMBER: true,
                    TEXT: false,
                    PLACEHOLDER: "ex. 3",
                    DEPTH: 1,
                    TYPE: "select",
                    UNIT: { ...UNIT_DATA.CUT, PRE: PRE_TEXT.CUT }
                }
            ]
        }
    },
    TOTAL_STEP: 3,
    VIRTUAL_PROP: {
        [PROPERTYS.SHOT_KIND.CODE]: {
            CODE: PROPERTYS.SHOT_KIND.CODE,
            NAME: PROPERTYS.SHOT_KIND.NAME,
            VALUE: ""
        },
        [PROPERTYS.NUKKI_KIND.CODE]: {
            CODE: PROPERTYS.NUKKI_KIND.CODE,
            NAME: PROPERTYS.NUKKI_KIND.NAME,
            VALUE: ""
        },
        [PROPERTYS.NEED_NUMBER.CODE]: {
            CODE: PROPERTYS.NEED_NUMBER.CODE,
            NAME: PROPERTYS.NEED_NUMBER.NAME,
            VALUE: ""
        },
        [PROPERTYS.RETOUCH_NUMBER.CODE]: {
            CODE: PROPERTYS.RETOUCH_NUMBER.CODE,
            NAME: PROPERTYS.RETOUCH_NUMBER.NAME,
            VALUE: ""
        },
        [PROPERTYS.DETAIL_NUMBER.CODE]: {
            CODE: PROPERTYS.DETAIL_NUMBER.CODE,
            NAME: PROPERTYS.DETAIL_NUMBER.NAME,
            VALUE: ""
        },
        [PROPERTYS.MODEL_CASTING.CODE]: {
            CODE: PROPERTYS.MODEL_CASTING.CODE,
            NAME: PROPERTYS.MODEL_CASTING.NAME,
            VALUE: ""
        },
        [PROPERTYS.MODEL_TIME.CODE]: {
            CODE: PROPERTYS.MODEL_TIME.CODE,
            NAME: PROPERTYS.MODEL_TIME.NAME,
            VALUE: ""
        },
        [PROPERTYS.H_M_CASTING.CODE]: {
            CODE: PROPERTYS.H_M_CASTING.CODE,
            NAME: PROPERTYS.H_M_CASTING.NAME,
            VALUE: ""
        },
        [PROPERTYS.IS_DETAIL_CUT.CODE]: {
            CODE: PROPERTYS.IS_DETAIL_CUT.CODE,
            NAME: PROPERTYS.IS_DETAIL_CUT.NAME,
            VALUE: HAS_PROPERTY.NEEDLESS.CODE
        },
        [PROPERTYS.IS_RETOUCH_ADD.CODE]: {
            CODE: PROPERTYS.IS_RETOUCH_ADD.CODE,
            NAME: PROPERTYS.IS_RETOUCH_ADD.NAME,
            VALUE: HAS_PROPERTY.NEEDLESS.CODE
        }
    }
};

const PRICE_INFO = {
    // 필요 컷수
    [PROPERTYS.NEED_NUMBER.CODE]: 0,
    // 모델 촬영 시간
    [PROPERTYS.MODEL_TIME.CODE]: 0,
    // 리터치 갯수
    [PROPERTYS.RETOUCH_NUMBER.CODE]: 0,
    // 디테일컷 갯수
    [PROPERTYS.DETAIL_NUMBER.CODE]: 0,
    // 개수 끝 ===
    // 단가 ===
    // 바닥누끼 단가
    floor_nukki_price: 10000,
    // 마네킹 누끼 단가
    mannequin_nukki_price: 15000,
    // 고스트컷 단가
    ghost_cut_price: 20000,
    // 모델촬영시간 숏데이(2시간)
    model_time_price_shot: 300000,
    // 모델촬영시간 하프데이(4시간)
    model_time_price_half: 500000,
    // 모델촬영시간 풀데이(8시간)
    model_time_price_full: 1000000,
    // 리터치 단가
    retouch_price: 5000,
    // 모델 및 헤메 섭외 단가 (모델 촬영 시간에 따라 다름)
    casting_price_shot: 250000,
    casting_price_half: 300000,
    casting_price_full: 500000,
    // 디테일 컷 단가
    detail_cut_price: 4000
};

export default { STEP_PROCESS, PRICE_INFO };
