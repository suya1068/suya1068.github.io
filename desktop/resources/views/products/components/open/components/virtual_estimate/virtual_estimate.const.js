import * as VIRTUAL_ESTIMATE_PROPERTYS from "shared/constant/virtual_estimate_property.const";

const CATEGORY_KEYS = VIRTUAL_ESTIMATE_PROPERTYS.CATEGORY_KEYS;
const PROPERTYS = VIRTUAL_ESTIMATE_PROPERTYS.PROPERTYS;
const SHOT_KIND_PROPERTY = VIRTUAL_ESTIMATE_PROPERTYS.SHOT_KIND_PROPERTY;
const IMAGE_PATH = VIRTUAL_ESTIMATE_PROPERTYS.IMAGE_PATH;
const SIZE_PROPERTY = VIRTUAL_ESTIMATE_PROPERTYS.SIZE_PROPERTY;
const MATERIAL_PROPERTY = VIRTUAL_ESTIMATE_PROPERTYS.MATERIAL_PROPERTY;
const HAS_PROPERTY = VIRTUAL_ESTIMATE_PROPERTYS.HAS_PROPERTY;
const DIRECTING_PROPERTY = VIRTUAL_ESTIMATE_PROPERTYS.DIRECTING_PROPERTY;
const PROXY_DIRECTING_PROPERTY = VIRTUAL_ESTIMATE_PROPERTYS.PROXY_DIRECTING_PROPERTY;
const PLACE_PROPERTY = VIRTUAL_ESTIMATE_PROPERTYS.PLACE_PROPERTY;
const NUKKI_KIND_PROPERTY = VIRTUAL_ESTIMATE_PROPERTYS.NUKKI_KIND_PROPERTY;
const ADVICE_EXTRA_TEXT = VIRTUAL_ESTIMATE_PROPERTYS.ADVICE_EXTRA_TEXT;

const ADVICE_TYPE = VIRTUAL_ESTIMATE_PROPERTYS.ADVICE_TYPE;
const ADD_ARTIST_TYPE = VIRTUAL_ESTIMATE_PROPERTYS.ADD_ARTIST_TYPE;
const RECOMMEND_ACCESS_TYPE = VIRTUAL_ESTIMATE_PROPERTYS.RECOMMEND_ACCESS_TYPE;

const VIRTUAL_ESTIMATE_DATA = {
    [CATEGORY_KEYS.PRODUCT]: {
        NAME: "제품",
        LIST: [
            [
                {
                    CODE: PROPERTYS.SHOT_KIND.CODE,
                    NAME: PROPERTYS.SHOT_KIND.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "누끼촬영",
                                DESC: "원하는 형태의 배경을 합성하거나 깔끔한 이미지를 위해 배경을 삭제하는 작업을 진행한 이미지",
                                IMG: `${IMAGE_PATH}/product/sample/product_01.jpg`,
                                IMG_2x: `${IMAGE_PATH}/product/sample/product_01_2x.jpg`,
                                ARTIST: "오디니크",
                                COLOR: "#999999"
                            },
                            {
                                NO: 2,
                                TITLE: "연출촬영",
                                DESC: "컨셉에 맞는 배경지, 소품 등을 이용하여 촬영",
                                IMG: `${IMAGE_PATH}/product/sample/product_02.jpg`,
                                IMG_2x: `${IMAGE_PATH}/product/sample/product_02_2x.jpg`,
                                ARTIST: "박수진",
                                COLOR: "#fff"
                            }
                        ]
                    },
                    DI: 3,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE,
                            NAME: SHOT_KIND_PROPERTY.NUKKI_SHOT.NAME,
                            SUB_CODE: SHOT_KIND_PROPERTY.NUKKI_SHOT.SUB_CODE,
                            DEFAULT: true
                        },
                        {
                            CODE: SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE,
                            NAME: SHOT_KIND_PROPERTY.DIRECTING_SHOT.NAME,
                            SUB_CODE: SHOT_KIND_PROPERTY.DIRECTING_SHOT.SUB_CODE,
                            DEFAULT: false
                        },
                        {
                            CODE: SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE,
                            NAME: SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.NAME,
                            SUB_CODE: SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.SUB_CODE,
                            DEFAULT: false
                        }
                    ]
                }
            ],
            [
                {
                    CODE: PROPERTYS.MATERIAL.CODE,
                    NAME: PROPERTYS.MATERIAL.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "유광제품",
                                DESC: "유광제품의 경우 빛의 강도나 각도를 조절하여 촬영이 진행되며, 추가 편집이 필요한 경우가 있습니다.",
                                IMG: `${IMAGE_PATH}/product/sample/product_03.jpg`,
                                IMG_2x: `${IMAGE_PATH}/product/sample/product_03_2x.jpg`,
                                ARTIST: "박수진",
                                COLOR: "#999999"
                            }
                        ]
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: MATERIAL_PROPERTY.GLOSSLESS.CODE,
                            NAME: MATERIAL_PROPERTY.GLOSSLESS.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: MATERIAL_PROPERTY.GLOSS.CODE,
                            NAME: MATERIAL_PROPERTY.GLOSS.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.SIZE.CODE,
                    NAME: PROPERTYS.SIZE.NAME,
                    DISABLED: false,
                    // CAPTION_POS: "right",
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "소형",
                                DESC: "주방기구, 소형가전, 소품 등 가로 세로의 길이가 50cm이내의 제품",
                                IMG: ""
                            },
                            {
                                NO: 2,
                                TITLE: "대형",
                                DESC: "대형가전 등 가로 혹은 세로의 길이가 50cm이상인 제품",
                                IMG: ""
                            }
                        ]
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: SIZE_PROPERTY.SMALL.CODE,
                            NAME: SIZE_PROPERTY.SMALL.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: SIZE_PROPERTY.LARGE.CODE,
                            NAME: SIZE_PROPERTY.LARGE.NAME,
                            DEFAULT: false
                        }
                    ]
                }
            ],
            [
                {
                    CODE: PROPERTYS.NUMBER.CODE,
                    NAME: PROPERTYS.NUMBER.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                },
                {
                    CODE: PROPERTYS.P_P_NUKKI_NUMBER.CODE,
                    NAME: PROPERTYS.P_P_NUKKI_NUMBER.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ],
            [
                {
                    CODE: PROPERTYS.DIRECTING_KIND.CODE,
                    NAME: PROPERTYS.DIRECTING_KIND.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "연출 난이도에 따라 견적이 변동될 수 있으며, 레퍼런스(예시이미지)를 \n" +
                                "준비해주시면 더욱 정확한 견적을 안내받으실 수 있습니다. ",
                                DESC: "",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: ""
                            },
                            {
                                NO: 2,
                                TITLE: "기본연출",
                                DESC: "깔끔한 배경지에 1~2개의 소품으로 컨셉에 맞는 연출 촬영",
                                IMG: `${IMAGE_PATH}/product/sample/product_05.jpg`,
                                IMG_2x: `${IMAGE_PATH}/product/sample/product_05_2x.jpg`,
                                ARTIST: "유림",
                                COLOR: "#fff"
                            },
                            // {
                            //     NO: 3,
                            //     TITLE: "컨셉연출",
                            //     DESC: "제품의 아이덴티티를 살려 다양한 배경 및 소품으로 연출을 진행",
                            //     IMG: `${IMAGE_PATH}/product/sample/product_06.jpg`,
                            //     IMG_2x: `${IMAGE_PATH}/product/sample/product_06_2x.jpg`,
                            //     ARTIST: "박수진",
                            //     COLOR: "#fff"
                            // },
                            {
                                NO: 4,
                                TITLE: "촬영대행",
                                DESC: "촬영 컨셉 갯수와 컷수가 명확하지 않은 경우에 촬영대행으로 진행할 수 있습니다. \n" +
                                "시간당 약1~2컨셉 촬영이 가능하며 연출 난이도에 따라 변동 될 수 있습니다.\n" +
                                "원본 전체를 제공하며 보정이 필요한 경우 견적이 달라질 수 있습니다.",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: ""
                            }
                        ]
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: DIRECTING_PROPERTY.BASIC.CODE,
                            NAME: DIRECTING_PROPERTY.BASIC.NAME,
                            DEFAULT: false
                        },
                        {
                            CODE: DIRECTING_PROPERTY.PROXY.CODE,
                            NAME: DIRECTING_PROPERTY.PROXY.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.DIRECTING_NUMBER.CODE,
                    NAME: PROPERTYS.DIRECTING_NUMBER.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ],
            [
                {
                    CODE: PROPERTYS.PROXY_DIRECTING_KIND.CODE,
                    NAME: PROPERTYS.PROXY_DIRECTING_KIND.NAME,
                    DISABLED: true,
                    // CAPTION_POS: "right",
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "촬영대행",
                                DESC: "촬영 컨셉 갯수와 컷수가 명확하지 않은 경우에 촬영대행으로 진행할 수 있습니다. 시간당 약1~2컨셉 촬영이 가능하며 연출 난이도에 따라 변동 될 수 있습니다. 원본 전체를 제공하며 보정이 필요한 경우 견적이 달라질 수 있습니다.",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: ""
                            },
                            {
                                NO: 2,
                                TITLE: "연출촬영대행",
                                DESC: "오프라인 미팅 진행, 제품 샘플 및 컨셉 전달 받아서 포스냅이 연출 소품 및 레퍼런스 전달, 고객 컨펌 후 촬영 진행, 고객 방문 필수 아님",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: ""
                            }
                        ]
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: PROXY_DIRECTING_PROPERTY.SHOT_PROXY.CODE,
                            NAME: PROXY_DIRECTING_PROPERTY.SHOT_PROXY.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: PROXY_DIRECTING_PROPERTY.DIRECTING_SHOT_PROXY.CODE,
                            NAME: PROXY_DIRECTING_PROPERTY.DIRECTING_SHOT_PROXY.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.PROXY_TIME.CODE,
                    NAME: PROPERTYS.PROXY_TIME.NAME,
                    DISABLED: true,
                    // CAPTION_POS: "right",
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ]
        ],
        PROPERTY: {
            [PROPERTYS.SHOT_KIND.CODE]: {
                CODE: PROPERTYS.SHOT_KIND.CODE,
                NAME: PROPERTYS.SHOT_KIND.NAME
            },
            [PROPERTYS.SIZE.CODE]: {
                CODE: PROPERTYS.SIZE.CODE,
                NAME: PROPERTYS.SIZE.NAME
            },
            [PROPERTYS.MATERIAL.CODE]: {
                CODE: PROPERTYS.MATERIAL.CODE,
                NAME: PROPERTYS.MATERIAL.NAME
            },
            [PROPERTYS.NUMBER.CODE]: {
                CODE: PROPERTYS.NUMBER.CODE,
                NAME: PROPERTYS.NUMBER.NAME
            },
            [PROPERTYS.P_P_NUKKI_NUMBER.CODE]: {
                CODE: PROPERTYS.P_P_NUKKI_NUMBER.CODE,
                NAME: PROPERTYS.P_P_NUKKI_NUMBER.NAME
            },
            [PROPERTYS.DIRECTING_KIND.CODE]: {
                CODE: PROPERTYS.DIRECTING_KIND.CODE,
                NAME: PROPERTYS.DIRECTING_KIND.NAME
            },
            [PROPERTYS.DIRECTING_NUMBER.CODE]: {
                CODE: PROPERTYS.DIRECTING_NUMBER.CODE,
                NAME: PROPERTYS.DIRECTING_NUMBER.NAME
            },
            [PROPERTYS.PROXY_TIME.CODE]: {
                CODE: PROPERTYS.PROXY_TIME.CODE,
                NAME: PROPERTYS.PROXY_TIME.NAME
            }
        }
    },
    [CATEGORY_KEYS.FOOD]: {
        NAME: "음식",
        LIST: [
            [
                {
                    CODE: PROPERTYS.SHOT_KIND.CODE,
                    NAME: PROPERTYS.SHOT_KIND.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "누끼촬영",
                                DESC: "메뉴판 제작에 사용되는 음식 누끼 촬영",
                                // DESC: "메뉴판 등에 사용하기 위하여 배경을 삭제하는 작업을 진행",
                                IMG: `${IMAGE_PATH}/food/sample/food_01.jpg`,
                                IMG_2x: `${IMAGE_PATH}/food/sample/food_01_2x.jpg`,
                                ARTIST: "유림",
                                COLOR: "#999999"
                            },
                            {
                                NO: 2,
                                TITLE: "연출촬영",
                                DESC: "조리 과정 없는 음식 연출 촬영으로 고객사 직접 연출 또는 푸드 스타일리스테 섭외필요 (포드스타일리스트 비용 별도) / 조리가 필요한 음식 " +
                                "연출 촬영의 경우 추가비용이 발생할 수 있습니다.",
                                // DESC: "푸드스타일링이 포함된 촬영으로 조리 및 소품이 포함됩니다.",
                                IMG: `${IMAGE_PATH}/food/sample/food_02.jpg`,
                                IMG_2x: `${IMAGE_PATH}/food/sample/food_02_2x.jpg`,
                                ARTIST: "박수진",
                                COLOR: "#fff"
                            }
                            // {
                            //     NO: 3,
                            //     TITLE: "누끼+연출",
                            //     DESC: "",
                            //     // DESC: "1개의 메뉴에 대한 연출 및 스타일링 촬영으로 메뉴 1개당 보정본 2컷을 제공합니다.",
                            //     IMG: "",
                            //     IMG_2x: "",
                            //     ARTIST: ""
                            // }
                        ]
                    },
                    DI: 3,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE,
                            NAME: SHOT_KIND_PROPERTY.NUKKI_SHOT.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE,
                            NAME: SHOT_KIND_PROPERTY.DIRECTING_SHOT.NAME,
                            DEFAULT: false
                        },
                        {
                            CODE: SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE,
                            NAME: SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.LOCATION.CODE,
                    NAME: PROPERTYS.LOCATION.NAME,
                    DISABLED: false,
                    CAPTION: "",
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: PLACE_PROPERTY.STUDIO.CODE,
                            NAME: PLACE_PROPERTY.STUDIO.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: PLACE_PROPERTY.OUTSIDE.CODE,
                            NAME: PLACE_PROPERTY.OUTSIDE.NAME,
                            DEFAULT: false
                        }
                    ]
                }
            ],
            [
                {
                    CODE: PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE,
                    NAME: PROPERTYS.NUKKI_PRODUCT_NUMBER.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                },
                {
                    CODE: PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE,
                    NAME: PROPERTYS.DIRECTING_PRODUCT_NUMBER.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ],
            [
                {
                    CODE: PROPERTYS.PLACE.CODE,
                    NAME: PROPERTYS.PLACE.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: PLACE_PROPERTY.SEOUL.CODE,
                            NAME: PLACE_PROPERTY.SEOUL.NAME,
                            DEFAULT: false
                        },
                        {
                            CODE: PLACE_PROPERTY.ETC.CODE,
                            NAME: PLACE_PROPERTY.ETC.NAME,
                            DEFAULT: false
                        }
                    ]
                }
            ]
        ],
        PROPERTY: {
            [PROPERTYS.SHOT_KIND.CODE]: {
                CODE: PROPERTYS.SHOT_KIND.CODE,
                NAME: PROPERTYS.SHOT_KIND.NAME
            },
            [PROPERTYS.NUMBER.CODE]: {
                CODE: PROPERTYS.NUMBER.CODE,
                NAME: PROPERTYS.NUMBER.NAME
            }
        }
    },
    [CATEGORY_KEYS.INTERIOR]: {
        NAME: "인테리어",
        LIST: [
            [
                {
                    CODE: PROPERTYS.NEED_NUMBER.CODE,
                    NAME: PROPERTYS.NEED_NUMBER.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                },
                {
                    CODE: PROPERTYS.PLACE.CODE,
                    NAME: PROPERTYS.PLACE.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 3,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: PLACE_PROPERTY.SEOUL.CODE,
                            NAME: PLACE_PROPERTY.SEOUL.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: PLACE_PROPERTY.GYEONGGI.CODE,
                            NAME: PLACE_PROPERTY.GYEONGGI.NAME,
                            DEFAULT: false
                        },
                        {
                            CODE: PLACE_PROPERTY.ETC.CODE,
                            NAME: PLACE_PROPERTY.ETC.NAME,
                            DEFAULT: false
                        }
                    ]
                }
            ],
            [
                {
                    CODE: PROPERTYS.IS_EXTERIOR.CODE,
                    NAME: PROPERTYS.IS_EXTERIOR.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "익스테리어",
                                DESC: "건물 외부, 전체 전경 촬영을 진행하며 배경 및 \n" +
                                "외부이미지의 합성이 진행됩니다.",
                                IMG: `${IMAGE_PATH}/interior/sample/interior_02.jpg`,
                                IMG_2x: `${IMAGE_PATH}/interior/sample/interior_02_2x.jpg`,
                                ARTIST: "오디니크",
                                COLOR: "#fff"
                            }
                        ]
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: HAS_PROPERTY.NEEDLESS.CODE,
                            NAME: HAS_PROPERTY.NEEDLESS.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: HAS_PROPERTY.NEED.CODE,
                            NAME: HAS_PROPERTY.NEED.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.EXTERIOR_NUMBER.CODE,
                    NAME: PROPERTYS.EXTERIOR_NUMBER.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ],
            [
                {
                    CODE: PROPERTYS.INSIDE_CUT_COMPOSE.CODE,
                    NAME: PROPERTYS.INSIDE_CUT_COMPOSE.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "내부컷 합성",
                                DESC: "오션뷰 등 창 밖 풍경을 강조해야하는 경우 촬영 후 \n" +
                                "합성을 진행합니다.",
                                IMG: `${IMAGE_PATH}/interior/sample/interior_01.jpg`,
                                IMG_2x: `${IMAGE_PATH}/interior/sample/interior_01_2x.jpg`,
                                ARTIST: "오디니크",
                                COLOR: "#fff"
                            }
                        ]
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: HAS_PROPERTY.NEEDLESS.CODE,
                            NAME: HAS_PROPERTY.NEEDLESS.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: HAS_PROPERTY.NEED.CODE,
                            NAME: HAS_PROPERTY.NEED.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE,
                    NAME: PROPERTYS.INSIDE_COMPOSE_NUMBER.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ]
        ],
        PROPERTY: {
            [PROPERTYS.NEED_NUMBER.CODE]: {
                CODE: PROPERTYS.NEED_NUMBER.CODE,
                NAME: PROPERTYS.NEED_NUMBER.NAME
            },
            [PROPERTYS.PLACE.CODE]: {
                CODE: PROPERTYS.PLACE.CODE,
                NAME: PROPERTYS.PLACE.NAME
            },
            [PROPERTYS.IS_EXTERIOR.CODE]: {
                CODE: PROPERTYS.IS_EXTERIOR.CODE,
                NAME: PROPERTYS.IS_EXTERIOR.NAME
            },
            [PROPERTYS.INSIDE_CUT_COMPOSE.CODE]: {
                CODE: PROPERTYS.INSIDE_CUT_COMPOSE.CODE,
                NAME: PROPERTYS.INSIDE_CUT_COMPOSE.NAME
            },
            [PROPERTYS.EXTERIOR_NUMBER.CODE]: {
                CODE: PROPERTYS.EXTERIOR_NUMBER.CODE,
                NAME: PROPERTYS.EXTERIOR_NUMBER.NAME
            },
            [PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE]: {
                CODE: PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE,
                NAME: PROPERTYS.INSIDE_COMPOSE_NUMBER.NAME
            }
        }
    },
    [CATEGORY_KEYS.PROFILE_BIZ]: {
        NAME: "기업프로필",
        LIST: [
            [
                {
                    CODE: PROPERTYS.PERSON_NUMBER.CODE,
                    NAME: PROPERTYS.PERSON_NUMBER.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                },
                {
                    CODE: PROPERTYS.PLACE.CODE,
                    NAME: PROPERTYS.PLACE.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 3,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: PLACE_PROPERTY.STUDIO.CODE,
                            NAME: PLACE_PROPERTY.STUDIO.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: PLACE_PROPERTY.OUTSIDE_S.CODE,
                            NAME: PLACE_PROPERTY.OUTSIDE_S.NAME,
                            DEFAULT: false
                        },
                        {
                            CODE: PLACE_PROPERTY.OUTSIDE_E.CODE,
                            NAME: PLACE_PROPERTY.OUTSIDE_E.NAME,
                            DEFAULT: false
                        }
                    ]
                }
            ],
            [
                {
                    CODE: PROPERTYS.IS_ALL_SHOT.CODE,
                    NAME: PROPERTYS.IS_ALL_SHOT.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: HAS_PROPERTY.NEEDLESS.CODE,
                            NAME: HAS_PROPERTY.NEEDLESS.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: HAS_PROPERTY.NEED.CODE,
                            NAME: HAS_PROPERTY.NEED.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE,
                    NAME: PROPERTYS.ALL_SHOT_NEED_NUMBER.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ]
        ],
        PROPERTY: {
            [PROPERTYS.PERSON_NUMBER.CODE]: {
                CODE: PROPERTYS.PERSON_NUMBER.CODE,
                NAME: PROPERTYS.PERSON_NUMBER.NAME
            },
            [PROPERTYS.IS_ALL_SHOT.CODE]: {
                CODE: PROPERTYS.IS_ALL_SHOT.CODE,
                NAME: PROPERTYS.IS_ALL_SHOT.NAME
            },
            [PROPERTYS.PLACE.CODE]: {
                CODE: PROPERTYS.PLACE.CODE,
                NAME: PROPERTYS.PLACE.NAME
            }
        }
    },
    [CATEGORY_KEYS.EVENT]: {
        NAME: "행사",
        LIST: [
            [
                {
                    CODE: PROPERTYS.SHOT_KIND.CODE,
                    NAME: PROPERTYS.SHOT_KIND.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: SHOT_KIND_PROPERTY.PHOTO_ONLY.CODE,
                            NAME: SHOT_KIND_PROPERTY.PHOTO_ONLY.NAME,
                            DEFAULT: true
                        },
                        // {
                        //     CODE: SHOT_KIND_PROPERTY.VIDEO_ONLY.CODE,
                        //     NAME: SHOT_KIND_PROPERTY.VIDEO_ONLY.NAME,
                        //     DEFAULT: false
                        // },
                        {
                            CODE: SHOT_KIND_PROPERTY.VIDEO_TOGETHER.CODE,
                            NAME: SHOT_KIND_PROPERTY.VIDEO_TOGETHER.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.TOTAL_TIME.CODE,
                    NAME: PROPERTYS.TOTAL_TIME.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ],
            [
                {
                    CODE: PROPERTYS.IS_ALL_SHOT.CODE,
                    NAME: PROPERTYS.IS_ALL_SHOT.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: HAS_PROPERTY.NEEDLESS.CODE,
                            NAME: HAS_PROPERTY.NEEDLESS.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: HAS_PROPERTY.NEED.CODE,
                            NAME: HAS_PROPERTY.NEED.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE,
                    NAME: PROPERTYS.ALL_SHOT_NEED_NUMBER.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ],
            [
                {
                    CODE: PROPERTYS.VIDEO_DIRECTING.CODE,
                    NAME: PROPERTYS.VIDEO_DIRECTING.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "영상 편집",
                                DESC: "프리미어(컷 편집), 에프터이펙트(인트로 모션)를 활용한 영상편집을 진행합니다.",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: "",
                                COLOR: ""
                            }
                        ]
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: HAS_PROPERTY.NEEDLESS.CODE,
                            NAME: HAS_PROPERTY.NEEDLESS.NAME,
                            DEFAULT: false
                        },
                        {
                            CODE: HAS_PROPERTY.NEED.CODE,
                            NAME: HAS_PROPERTY.NEED.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.VIDEO_DIRECTING_TIME.CODE,
                    NAME: PROPERTYS.VIDEO_DIRECTING_TIME.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ],
            [
                {
                    CODE: PROPERTYS.SUBSCRIBE.CODE,
                    NAME: PROPERTYS.SUBSCRIBE.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "자막",
                                DESC: "포토샵을 활용한 자막 디자인으로 상황설명자막이 삽입됩니다.",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: "",
                                COLOR: ""
                            }
                        ]
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: HAS_PROPERTY.NEEDLESS.CODE,
                            NAME: HAS_PROPERTY.NEEDLESS.NAME,
                            DEFAULT: false
                        },
                        {
                            CODE: HAS_PROPERTY.NEED.CODE,
                            NAME: HAS_PROPERTY.NEED.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.PLACE.CODE,
                    NAME: PROPERTYS.PLACE.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 3,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: PLACE_PROPERTY.SEOUL.CODE,
                            NAME: PLACE_PROPERTY.SEOUL.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: PLACE_PROPERTY.GYEONGGI.CODE,
                            NAME: PLACE_PROPERTY.GYEONGGI.NAME,
                            DEFAULT: false
                        },
                        {
                            CODE: PLACE_PROPERTY.ETC.CODE,
                            NAME: PLACE_PROPERTY.ETC.NAME,
                            DEFAULT: false
                        }
                    ]
                }
            ]
        ],
        PROPERTY: {
            [PROPERTYS.TOTAL_TIME.CODE]: {
                CODE: PROPERTYS.TOTAL_TIME.CODE,
                NAME: PROPERTYS.TOTAL_TIME.NAME
            },
            [PROPERTYS.SHOT_KIND.CODE]: {
                CODE: PROPERTYS.SHOT_KIND.CODE,
                NAME: PROPERTYS.SHOT_KIND.NAME
            },
            [PROPERTYS.PERSON.CODE]: {
                CODE: PROPERTYS.PERSON.CODE,
                NAME: PROPERTYS.PERSON.NAME
            },
            [PROPERTYS.PLACE.CODE]: {
                CODE: PROPERTYS.PLACE.CODE,
                NAME: PROPERTYS.PLACE.NAME
            },
            [PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]: {
                CODE: PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE,
                NAME: PROPERTYS.ALL_SHOT_NEED_NUMBER.NAME
            },
            [PROPERTYS.IS_ALL_SHOT.CODE]: {
                CODE: PROPERTYS.IS_ALL_SHOT.CODE,
                NAME: PROPERTYS.IS_ALL_SHOT.NAME
            },
            [PROPERTYS.VIDEO_DIRECTING.CODE]: {
                CODE: PROPERTYS.VIDEO_DIRECTING.CODE,
                NAME: PROPERTYS.VIDEO_DIRECTING.NAME
            },
            [PROPERTYS.SUBSCRIBE.CODE]: {
                CODE: PROPERTYS.SUBSCRIBE.CODE,
                NAME: PROPERTYS.SUBSCRIBE.NAME
            }
        }
    },
    [CATEGORY_KEYS.FASHION]: {
        NAME: "패션",
        LIST: [
            [
                {
                    CODE: PROPERTYS.SHOT_KIND.CODE,
                    NAME: PROPERTYS.SHOT_KIND.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "누끼촬영",
                                DESC: "상품 상세페이지 등에 사용하기위해 배경을 삭제하는 작업을 진행",
                                IMG: `${IMAGE_PATH}/fashion/sample/fashion_01.jpg`,
                                IMG_2x: `${IMAGE_PATH}/fashion/sample/fashion_01_2x.jpg`,
                                ARTIST: "오디니크",
                                COLOR: "#999999"
                            },
                            {
                                NO: 2,
                                TITLE: "모델촬영",
                                DESC: "컨셉에 맞춰 모델 섭외 후 촬영을 진행. 룩북, 화보촬영 등이 포함",
                                IMG: `${IMAGE_PATH}/fashion/sample/fashion_02.jpg`,
                                IMG_2x: `${IMAGE_PATH}/fashion/sample/fashion_02_2x.jpg`,
                                ARTIST: "joooorish",
                                COLOR: "#fff"
                            }
                        ]
                    },
                    DI: 3,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: SHOT_KIND_PROPERTY.NUKKI.CODE,
                            NAME: SHOT_KIND_PROPERTY.NUKKI.NAME,
                            SUB_CODE: SHOT_KIND_PROPERTY.NUKKI.SUB_CODE,
                            DEFAULT: true
                        },
                        {
                            CODE: SHOT_KIND_PROPERTY.MODEL_SHOT.CODE,
                            NAME: SHOT_KIND_PROPERTY.MODEL_SHOT.NAME,
                            SUB_CODE: SHOT_KIND_PROPERTY.MODEL_SHOT.SUB_CODE,
                            DEFAULT: false
                        },
                        {
                            CODE: SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.CODE,
                            NAME: SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.NAME,
                            SUB_CODE: SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.SUB_CODE,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.NUKKI_KIND.CODE,
                    NAME: PROPERTYS.NUKKI_KIND.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "바닥누끼",
                                DESC: "의상을 바닥에 두고 옷의 소재 및 컬러감이 잘 드러나도록 촬영",
                                IMG: `${IMAGE_PATH}/fashion/sample/fashion_04.jpg`,
                                IMG_2x: `${IMAGE_PATH}/fashion/sample/fashion_04_2x.jpg`,
                                ARTIST: "오디니크",
                                COLOR: "#999999"
                            },
                            {
                                NO: 2,
                                TITLE: "마네킹누끼",
                                DESC: "마네킹 혹은 옷걸이에 의상을 배치하고 촬영",
                                IMG: `${IMAGE_PATH}/fashion/sample/fashion_05.jpg`,
                                IMG_2x: `${IMAGE_PATH}/fashion/sample/fashion_05_2x.jpg`,
                                ARTIST: "멜로우모먼트",
                                COLOR: "#999999"
                            },
                            {
                                NO: 3,
                                TITLE: "고스트컷",
                                DESC: "전용 마네킹을 이용하여 투명 누끼 진행",
                                IMG: `${IMAGE_PATH}/fashion/sample/fashion_06.jpg`,
                                IMG_2x: `${IMAGE_PATH}/fashion/sample/fashion_06_2x.jpg`,
                                ARTIST: "박수진",
                                COLOR: "#999999"
                            }
                        ]
                    },
                    DI: 3,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: NUKKI_KIND_PROPERTY.FLOOR_NUKKI.CODE,
                            NAME: NUKKI_KIND_PROPERTY.FLOOR_NUKKI.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: NUKKI_KIND_PROPERTY.MANNEQUIN_NUKKI.CODE,
                            NAME: NUKKI_KIND_PROPERTY.MANNEQUIN_NUKKI.NAME,
                            DEFAULT: false
                        },
                        {
                            CODE: NUKKI_KIND_PROPERTY.GHOST_CUT.CODE,
                            NAME: NUKKI_KIND_PROPERTY.GHOST_CUT.NAME,
                            DEFAULT: false
                        }
                    ]
                }
            ],
            [
                {
                    CODE: PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE,
                    NAME: PROPERTYS.NUKKI_CLOTHES_NUMBER.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                },
                {
                    CODE: PROPERTYS.N_CLOTHES_P_NUMBER.CODE,
                    NAME: PROPERTYS.N_CLOTHES_P_NUMBER.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ],
            [
                {
                    CODE: PROPERTYS.MODEL_TIME.CODE,
                    NAME: PROPERTYS.MODEL_TIME.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ],
            [
                {
                    CODE: PROPERTYS.MODEL_CASTING.CODE,
                    NAME: PROPERTYS.MODEL_CASTING.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "모델섭외",
                                DESC: "국내성인모델/ 일반촬영 기준으로 견적이 책정되며, 해외모델/ 이미지의 해외 \n" +
                                "이용 등의 경우  견적이 추가될 수 있습니다.",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: ""
                            }
                        ]
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: HAS_PROPERTY.NEEDLESS.CODE,
                            NAME: HAS_PROPERTY.NEEDLESS.NAME,
                            DEFAULT: false
                        },
                        {
                            CODE: HAS_PROPERTY.NEED.CODE,
                            NAME: HAS_PROPERTY.NEED.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.H_M_CASTING.CODE,
                    NAME: PROPERTYS.H_M_CASTING.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "1인 1컨셉 메이크업+간단한 수정 메이크업 진행 시 최소 비용입니다. 메이크업 컨셉 난이도에 따라 견적은 변동될 수 있습니다.",
                                DESC: "",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: ""
                            }
                        ]
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: HAS_PROPERTY.NEEDLESS.CODE,
                            NAME: HAS_PROPERTY.NEEDLESS.NAME,
                            DEFAULT: false
                        },
                        {
                            CODE: HAS_PROPERTY.NEED.CODE,
                            NAME: HAS_PROPERTY.NEED.NAME,
                            DEFAULT: false
                        }
                    ]
                }
            ],
            [
                {
                    CODE: PROPERTYS.IS_RETOUCH_ADD.CODE,
                    NAME: PROPERTYS.IS_RETOUCH_ADD.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: HAS_PROPERTY.NEEDLESS.CODE,
                            NAME: HAS_PROPERTY.NEEDLESS.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: HAS_PROPERTY.NEED.CODE,
                            NAME: HAS_PROPERTY.NEED.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.RETOUCH_NUMBER.CODE,
                    NAME: PROPERTYS.RETOUCH_NUMBER.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ],
            [
                {
                    CODE: PROPERTYS.IS_DETAIL_CUT.CODE,
                    NAME: PROPERTYS.IS_DETAIL_CUT.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "디테일컷",
                                DESC: "전체적인 모습이 아닌 부분의 상세한 이미지를 촬영.\n" +
                                "쇼핑몰 상세페이지에 전체컷과 함께 삽입되는\n" +
                                "경우가 많습니다.",
                                IMG: `${IMAGE_PATH}/fashion/sample/fashion_03.jpg`,
                                IMG_2x: `${IMAGE_PATH}/fashion/sample/fashion_03_2x.jpg`,
                                ARTIST: "신승철",
                                COLOR: "#fff"
                            }
                        ]
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: HAS_PROPERTY.NEEDLESS.CODE,
                            NAME: HAS_PROPERTY.NEEDLESS.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: HAS_PROPERTY.NEED.CODE,
                            NAME: HAS_PROPERTY.NEED.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.DETAIL_NUMBER.CODE,
                    NAME: PROPERTYS.DETAIL_NUMBER.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ]
        ],
        PROPERTY: {
            [PROPERTYS.SHOT_KIND.CODE]: {
                CODE: PROPERTYS.SHOT_KIND.CODE,
                NAME: PROPERTYS.SHOT_KIND.NAME
            },
            [PROPERTYS.NUKKI_KIND.CODE]: {
                CODE: PROPERTYS.NUKKI_KIND.CODE,
                NAME: PROPERTYS.NUKKI_KIND.NAME
            },
            [PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE]: {
                CODE: PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE,
                NAME: PROPERTYS.NUKKI_CLOTHES_NUMBER.NAME
            },
            [PROPERTYS.N_CLOTHES_P_NUMBER.CODE]: {
                CODE: PROPERTYS.N_CLOTHES_P_NUMBER.CODE,
                NAME: PROPERTYS.N_CLOTHES_P_NUMBER.NAME
            },
            [PROPERTYS.MODEL_CLOTHES_NUMBER.CODE]: {
                CODE: PROPERTYS.MODEL_CLOTHES_NUMBER.CODE,
                NAME: PROPERTYS.MODEL_CLOTHES_NUMBER.NAME
            },
            [PROPERTYS.IS_RETOUCH_ADD.CODE]: {
                CODE: PROPERTYS.IS_RETOUCH_ADD.CODE,
                NAME: PROPERTYS.IS_RETOUCH_ADD.NAME
            },
            [PROPERTYS.MODEL_CASTING.CODE]: {
                CODE: PROPERTYS.MODEL_CASTING.CODE,
                NAME: PROPERTYS.MODEL_CASTING.NAME
            },
            [PROPERTYS.H_M_CASTING.CODE]: {
                CODE: PROPERTYS.H_M_CASTING.CODE,
                NAME: PROPERTYS.H_M_CASTING.NAME
            },
            [PROPERTYS.IS_DETAIL_CUT.CODE]: {
                CODE: PROPERTYS.IS_DETAIL_CUT.CODE,
                NAME: PROPERTYS.IS_DETAIL_CUT.NAME
            },
            [PROPERTYS.IS_NUKKI_ADD.CODE]: {
                CODE: PROPERTYS.IS_NUKKI_ADD.CODE,
                NAME: PROPERTYS.IS_NUKKI_ADD.NAME
            }
        }
    },
    [CATEGORY_KEYS.BEAUTY]: {
        NAME: "코스메틱",
        LIST: [
            [
                {
                    CODE: PROPERTYS.SHOT_KIND.CODE,
                    NAME: PROPERTYS.SHOT_KIND.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "누끼촬영",
                                DESC: "원하는 형태의 배경을 합성하거나 깔끔한 이미지를 위해 배경을 삭제하는 작업을 진행",
                                IMG: `${IMAGE_PATH}/beauty/sample/beauty_01.jpg`,
                                IMG_2x: `${IMAGE_PATH}/beauty/sample/beauty_01_2x.jpg`,
                                ARTIST: "신승철",
                                COLOR: "#999999"
                            },
                            {
                                NO: 2,
                                TITLE: "연출촬영",
                                DESC: "컨셉에 맞는 배경지, 소품 등을 이용하여 촬영",
                                IMG: `${IMAGE_PATH}/beauty/sample/beauty_02.jpg`,
                                IMG_2x: `${IMAGE_PATH}/beauty/sample/beauty_02_2x.jpg`,
                                ARTIST: "박수진",
                                COLOR: "#fff"
                            }
                        ]
                    },
                    DI: 3,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE,
                            NAME: SHOT_KIND_PROPERTY.NUKKI_SHOT.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE,
                            NAME: SHOT_KIND_PROPERTY.DIRECTING_SHOT.NAME,
                            DEFAULT: false
                        },
                        {
                            CODE: SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE,
                            NAME: SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.NAME,
                            DEFAULT: false
                        }
                    ]
                }
            ],
            [
                {
                    CODE: PROPERTYS.NUMBER.CODE,
                    NAME: PROPERTYS.NUMBER.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                },
                {
                    CODE: PROPERTYS.P_P_NUKKI_NUMBER.CODE,
                    NAME: PROPERTYS.P_P_NUKKI_NUMBER.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ],
            [
                {
                    CODE: PROPERTYS.DIRECTING_KIND.CODE,
                    NAME: PROPERTYS.DIRECTING_KIND.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "연출 난이도에 따라 견적이 변동될 수 있으며, 레퍼런스(예시이미지)를\n" +
                                "준비해주시면 더욱 정확한 견적을 안내받으실 수 있습니다.",
                                DESC: "",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: ""
                            },
                            {
                                NO: 2,
                                TITLE: "기본연출",
                                DESC: "깔끔한 배경지에 1~2개의 소품으로 컨셉에 맞는 연출 촬영",
                                IMG: `${IMAGE_PATH}/beauty/sample/beauty_05.jpg`,
                                IMG_2x: `${IMAGE_PATH}/beauty/sample/beauty_05_2x.jpg`,
                                ARTIST: "유림",
                                COLOR: "#fff"
                            }
                        ]
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: DIRECTING_PROPERTY.BASIC.CODE,
                            NAME: DIRECTING_PROPERTY.BASIC.NAME,
                            DEFAULT: false
                        },
                        {
                            CODE: DIRECTING_PROPERTY.PROXY.CODE,
                            NAME: DIRECTING_PROPERTY.PROXY.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.DIRECTING_NUMBER.CODE,
                    NAME: PROPERTYS.DIRECTING_NUMBER.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ],
            [
                {
                    CODE: PROPERTYS.PROXY_DIRECTING_KIND.CODE,
                    NAME: PROPERTYS.PROXY_DIRECTING_KIND.NAME,
                    DISABLED: true,
                    // CAPTION_POS: "right",
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "촬영대행",
                                DESC: "촬영 컨셉 갯수와 컷수가 명확하지 않은 경우에 촬영대행으로 진행할 수 있습니다. 시간당 약1~2컨셉 촬영이 가능하며 연출 난이도에 따라 변동 될 수 있습니다. 원본 전체를 제공하며 보정이 필요한 경우 견적이 달라질 수 있습니다.",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: ""
                            },
                            {
                                NO: 2,
                                TITLE: "연출촬영대행",
                                DESC: "오프라인 미팅 진행, 제품 샘플 및 컨셉 전달 받아서 포스냅이 연출 소품 및 레퍼런스 전달, 고객 컨펌 후 촬영 진행, 고객 방문 필수 아님",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: ""
                            }
                        ]
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: PROXY_DIRECTING_PROPERTY.SHOT_PROXY.CODE,
                            NAME: PROXY_DIRECTING_PROPERTY.SHOT_PROXY.NAME,
                            DEFAULT: false
                        },
                        {
                            CODE: PROXY_DIRECTING_PROPERTY.DIRECTING_SHOT_PROXY.CODE,
                            NAME: PROXY_DIRECTING_PROPERTY.DIRECTING_SHOT_PROXY.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.PROXY_TIME.CODE,
                    NAME: PROPERTYS.PROXY_TIME.NAME,
                    DISABLED: true,
                    // CAPTION_POS: "right",
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ]
        ],
        PROPERTY: {
            [PROPERTYS.SHOT_KIND.CODE]: {
                CODE: PROPERTYS.SHOT_KIND.CODE,
                NAME: PROPERTYS.SHOT_KIND.NAME
            },
            [PROPERTYS.NUMBER.CODE]: {
                CODE: PROPERTYS.NUMBER.CODE,
                NAME: PROPERTYS.NUMBER.NAME
            },
            [PROPERTYS.P_P_NUKKI_NUMBER.CODE]: {
                CODE: PROPERTYS.P_P_NUKKI_NUMBER.CODE,
                NAME: PROPERTYS.P_P_NUKKI_NUMBER.NAME
            },
            [PROPERTYS.DIRECTING_KIND.CODE]: {
                CODE: PROPERTYS.DIRECTING_KIND.CODE,
                NAME: PROPERTYS.DIRECTING_KIND.NAME
            },
            [PROPERTYS.DIRECTING_NUMBER.CODE]: {
                CODE: PROPERTYS.DIRECTING_NUMBER.CODE,
                NAME: PROPERTYS.DIRECTING_NUMBER.NAME
            }
        }
    },
    [CATEGORY_KEYS.VIDEO_BIZ]: {
        NAME: "기업영상",
        LIST: [
            [
                {
                    CODE: PROPERTYS.SHOT_KIND.CODE,
                    NAME: PROPERTYS.SHOT_KIND.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "바이럴영상촬영",
                                DESC: "인스타그램, 페이스북 등에 이용되는 영상입니다. 카메라 움직임 없이 놓고 촬영하며 연출 디렉팅도 함께 진행 합니다.",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: "",
                                COLOR: "#999999"
                            },
                            {
                                NO: 2,
                                TITLE: "인터뷰영상촬영",
                                DESC: "인물 촬영, 무선 마이크를 활용해서 전달감을 높이는 인터뷰 촬영으로 기본 2시간으로 촬영이 진행됩니다. 다양한 각도의 인터뷰 컷으로 진행해서 단조롭지 않은 인터뷰 영상을 제작합니다",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: "",
                                COLOR: "#fff"
                            }
                        ]
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: SHOT_KIND_PROPERTY.VIRAL_VIDEO.CODE,
                            NAME: SHOT_KIND_PROPERTY.VIRAL_VIDEO.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: SHOT_KIND_PROPERTY.INTERVIEW_VIDEO.CODE,
                            NAME: SHOT_KIND_PROPERTY.INTERVIEW_VIDEO.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.VIDEO_LENGTH.CODE,
                    NAME: PROPERTYS.VIDEO_LENGTH.NAME,
                    DISABLED: false,
                    // CAPTION_POS: "right",
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "",
                                DESC: "프리미어 (컷 편집), 에프터이펙트(모션그래픽)를 활용하여 영상을 편집합니다.",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: "",
                                COLOR: "#ff"
                            }
                        ]
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ],
            [
                {
                    CODE: PROPERTYS.ACTOR_CASTING.CODE,
                    NAME: PROPERTYS.ACTOR_CASTING.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "",
                                DESC: "배우 1명 기준으로 2인 이상 섭외 필요 시 추가 비용이 발생합니다.",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: "",
                                COLOR: "#ff"
                            },
                            {
                                NO: 2,
                                TITLE: "",
                                DESC: "국내 프리랜서 배우 기준으로 하며 국외 배우의 경우 추가 비용이 발생 합니다.",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: "",
                                COLOR: "#ff"
                            }
                        ]
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: HAS_PROPERTY.NEEDLESS.CODE,
                            NAME: HAS_PROPERTY.NEEDLESS.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: HAS_PROPERTY.NEED.CODE,
                            NAME: HAS_PROPERTY.NEED.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.H_M_CASTING.CODE,
                    NAME: PROPERTYS.H_M_CASTING.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: HAS_PROPERTY.NEEDLESS.CODE,
                            NAME: HAS_PROPERTY.NEEDLESS.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: HAS_PROPERTY.NEED.CODE,
                            NAME: HAS_PROPERTY.NEED.NAME,
                            DEFAULT: false
                        }
                    ]
                }
            ],
            [
                {
                    CODE: PROPERTYS.PLAN_CONTI.CODE,
                    NAME: PROPERTYS.PLAN_CONTI.NAME,
                    DISABLED: false,
                    CAPTION: {
                        HAS: true,
                        LIST: [
                            {
                                NO: 1,
                                TITLE: "",
                                DESC: "시놉시스(영상의 줄거리), 콘티를 작성 합니다. 제작 난이도에 따라서 단가가 달라질 수 있습니다.",
                                IMG: "",
                                IMG_2x: "",
                                ARTIST: ""
                            }
                        ]
                    },
                    DI: 2,
                    COLUMN: 3,
                    TYPE: "select",
                    PROP: [
                        {
                            CODE: HAS_PROPERTY.NEEDLESS.CODE,
                            NAME: HAS_PROPERTY.NEEDLESS.NAME,
                            DEFAULT: true
                        },
                        {
                            CODE: HAS_PROPERTY.NEED.CODE,
                            NAME: HAS_PROPERTY.NEED.NAME,
                            DEFAULT: false
                        }
                    ]
                },
                {
                    CODE: PROPERTYS.INTERVIEW_PERSON.CODE,
                    NAME: PROPERTYS.INTERVIEW_PERSON.NAME,
                    DISABLED: true,
                    CAPTION: {
                        HAS: false,
                        LIST: []
                    },
                    DI: 1,
                    COLUMN: 3,
                    TYPE: "dropdown"
                }
            ]
        ],
        PROPERTY: {
            [PROPERTYS.SHOT_KIND.CODE]: {
                CODE: PROPERTYS.SHOT_KIND.CODE,
                NAME: PROPERTYS.SHOT_KIND.NAME
            },
            [PROPERTYS.VIDEO_LENGTH.CODE]: {
                CODE: PROPERTYS.VIDEO_LENGTH.CODE,
                NAME: PROPERTYS.VIDEO_LENGTH.NAME
            },
            [PROPERTYS.ACTOR_CASTING.CODE]: {
                CODE: PROPERTYS.ACTOR_CASTING.CODE,
                NAME: PROPERTYS.ACTOR_CASTING.NAME
            },
            [PROPERTYS.H_M_CASTING.CODE]: {
                CODE: PROPERTYS.H_M_CASTING.CODE,
                NAME: PROPERTYS.H_M_CASTING.NAME
            },
            [PROPERTYS.PLAN_CONTI.CODE]: {
                CODE: PROPERTYS.PLAN_CONTI.CODE,
                NAME: PROPERTYS.PLAN_CONTI.NAME
            },
            [PROPERTYS.INTERVIEW_PERSON.CODE]: {
                CODE: PROPERTYS.INTERVIEW_PERSON.CODE,
                NAME: PROPERTYS.INTERVIEW_PERSON.NAME
            }
        }
    }
};

export {
    VIRTUAL_ESTIMATE_DATA,
    CATEGORY_KEYS,
    ADVICE_EXTRA_TEXT,
    PROPERTYS,
    HAS_PROPERTY,
    PLACE_PROPERTY,
    SHOT_KIND_PROPERTY,
    NUKKI_KIND_PROPERTY,
    PROXY_DIRECTING_PROPERTY,
    SIZE_PROPERTY,
    DIRECTING_PROPERTY,
    MATERIAL_PROPERTY,
    ADVICE_TYPE,
    ADD_ARTIST_TYPE,
    RECOMMEND_ACCESS_TYPE
};
