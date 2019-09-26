import {
    PROPERTYS,
    SHOT_KIND_PROPERTY,
    DIRECTING_PROPERTY,
    SIZE_PROPERTY,
    MATERIAL_PROPERTY,
    UNIT_DATA,
    PRE_TEXT,
    PLACE_PROPERTY
} from "./base.const";

const STEP_PROCESS = {
    STEP: {
        FIRST: {
            ACTIVE: false,
            CODE: "Step01",
            NAME: "촬영선택",
            TITLE: "필요한 촬영을 선택해주세요.",
            CAPTION: "",
            RESULT_TEXT: "Step01 에서 정보를 입력해주세요.",
            PROP: [
                {
                    CODE: SHOT_KIND_PROPERTY.VIRAL_VIDEO.CODE,
                    NAME: "바이럴 영상",
                    CAPTION: "SNS등에 이용되는 영상으로 카메라\n움직임 없이 촬영진행",
                    IMAGE: "/estimate/renew/video_biz/image_01_2x.jpg",
                    NUMBER: false,
                    TEXT: false,
                    TYPE: "radio"
                    // UNIT: { ...UNIT_DATA.CUT, PRE: PRE_TEXT.CUT },
                    // PLACEHOLDER: "ex. 3"
                },
                {
                    CODE: SHOT_KIND_PROPERTY.INTERVIEW_VIDEO.CODE,
                    NAME: "인터뷰 영상",
                    CAPTION: "무선 마이크를 촬영하여 다양한\n각도의 인터뷰 컷으로 촬영 진행",
                    IMAGE: "/estimate/renew/video_biz/image_02_2x.jpg",
                    NUMBER: false,
                    TEXT: false,
                    TYPE: "radio"
                }
            ]
        },
        SECOND: {
            ACTIVE: false,
            CODE: "Step02",
            NAME: "시간선택",
            TITLE: "촬영 정보를 선택해 주세요.",
            CAPTION: "",
            RESULT_TEXT: "Step02 에서 정보를 입력해주세요.",
            PROP: [
                {
                    CODE: PROPERTYS.VIDEO_LENGTH.CODE,
                    NAME: "",
                    CAPTION: "제작 하려는 영상의 길이를 선택해주세요.",
                    IMAGE: "",
                    NUMBER: false,
                    TEXT: false,
                    WIDTH: 600,
                    DEPTH: 2,
                    TYPE: "inline-radio",
                    PROP: [
                        {
                            CODE: "1",
                            NAME: "1분미만",
                            CAPTION: "",
                            IMAGE: "",
                            NUMBER: false,
                            TEXT: false,
                            TYPE: "radio"
                        },
                        {
                            CODE: "2",
                            NAME: "1분~3분",
                            CAPTION: "",
                            IMAGE: "",
                            NUMBER: false,
                            TEXT: false,
                            TYPE: "radio"
                        },
                        {
                            CODE: "3",
                            NAME: "3분~5분",
                            CAPTION: "",
                            IMAGE: "",
                            NUMBER: false,
                            TEXT: false,
                            TYPE: "radio"
                        },
                        {
                            CODE: "4",
                            NAME: "5분이상",
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
            TITLE: "추가정보를 선택해주세요.",
            CAPTION: "추가 촬영이 필요한 경우 선택해주세요.(중복가능)",
            RESULT_TEXT: "Step03 에서 추가정보를 입력해주세요.",
            TEST: false,
            PROP: [
                {
                    CODE: PROPERTYS.INTERVIEW_PERSON.CODE,
                    NAME: "인터뷰 촬영인원을 입력해주세요.",
                    CAPTION: "",
                    IMAGE: "",
                    NUMBER: true,
                    TEXT: false,
                    TYPE: "input",
                    UNIT: { ...UNIT_DATA.PERSON, PRE: PRE_TEXT.TOTAL },
                    DEPTH: 1,
                    PLACEHOLDER: "ex. 3"
                },
                {
                    CODE: PROPERTYS.ACTOR_CASTING.CODE,
                    NAME: "배우섭외",
                    CAPTION: "배우 2인 이상 섭외 혹은\n국외배우 필요 시 추가비용 발생",
                    IMAGE: "/estimate/renew/video_biz/image_03_2x.jpg",
                    NUMBER: false,
                    TEXT: false,
                    DEPTH: 1,
                    TYPE: "select"
                },
                {
                    CODE: PROPERTYS.H_M_CASTING.CODE,
                    NAME: "헤어 메이크업 섭외",
                    CAPTION: "",
                    IMAGE: "/estimate/renew/video_biz/image_04_2x.jpg",
                    NUMBER: false,
                    TEXT: false,
                    TYPE: "select",
                    // UNIT: { ...UNIT_DATA.COUNT, PRE: PRE_TEXT.COUNT },
                    DEPTH: 1
                    // PLACEHOLDER: "ex. 3"
                },
                {
                    CODE: PROPERTYS.PLAN_CONTI.CODE,
                    NAME: "플랜 및 콘티작업",
                    CAPTION: "제작 난이도에 따라 추가비용 발생",
                    IMAGE: "/estimate/renew/video_biz/image_05_2x.jpg",
                    NUMBER: false,
                    TEXT: false,
                    TYPE: "select",
                    // UNIT: { ...UNIT_DATA.COUNT, PRE: PRE_TEXT.COUNT },
                    DEPTH: 1
                    // PLACEHOLDER: "ex. 3"
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
        [PROPERTYS.VIDEO_LENGTH.CODE]: {
            CODE: PROPERTYS.VIDEO_LENGTH.CODE,
            NAME: PROPERTYS.VIDEO_LENGTH.NAME,
            VALUE: ""
        },
        [PROPERTYS.INTERVIEW_PERSON.CODE]: {
            CODE: PROPERTYS.INTERVIEW_PERSON.CODE,
            NAME: PROPERTYS.INTERVIEW_PERSON.NAME,
            VALUE: ""
        },
        [PROPERTYS.ACTOR_CASTING.CODE]: {
            CODE: PROPERTYS.ACTOR_CASTING.CODE,
            NAME: PROPERTYS.ACTOR_CASTING.NAME,
            VALUE: ""
        },
        [PROPERTYS.H_M_CASTING.CODE]: {
            CODE: PROPERTYS.H_M_CASTING.CODE,
            NAME: PROPERTYS.H_M_CASTING.NAME,
            VALUE: ""
        },
        [PROPERTYS.PLAN_CONTI.CODE]: {
            CODE: PROPERTYS.PLAN_CONTI.CODE,
            NAME: PROPERTYS.PLAN_CONTI.NAME,
            VALUE: ""
        }
    }
};

const PRICE_INFO = {
    // 영상 길이
    video_length: 0,
    // 인터뷰 인원
    interview_person: 0,
    // 바이럴 영상 단가
    viral_video_base_price: 1400000,
    viral_video_add_price: 600000,
    // 인터뷰 영상 단가
    interview_video_base_price: 700000,
    interview_video_add_price: 300000,
    // 배우 섭외
    actor_casting: 300000,
    base_actor_casting_price: 300000,
    add_actor_casting_price: 200000,
    // 헤메 섭외
    h_m_casting: 300000,
    base_h_m_casting_price: 300000,
    add_h_m_casting_price: 200000,
    // 기획 및 콘티
    plan_conti: 500000,
    // 인터뷰 인원당 단가
    interview_person_price: 100000
};

export default { STEP_PROCESS, PRICE_INFO };
