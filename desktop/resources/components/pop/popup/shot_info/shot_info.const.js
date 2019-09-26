export const SHOT_INFO = {
    TITLE: "촬영 견적 상담 시",
    TITLE_ICON: "shot_info_tip",
    DESC: "상담요청 시 하단의 내용을 참고하여 필요로 하는 촬영에 대해\n상세하게 말씀해주시면 더욱 정확한 견적을 받아보실 수 있습니다.",
    INFO_BASIC: [
        {
            NO: 1,
            TITLE: "어떤 이미지가 필요하신가요?",
            ICON: "transparent_image",
            DESC: "누끼컷, 연출컷, 합성컷, 모델컷 등 다양한 종류의 이미지가 있습니다.\n원하는 이미지의 종류가 어떤 것인지 확인하신다면, 조금 더 정확한 견적을 받아 보실 수 있습니다.",
            BACKGROUND_COLOR: "#9013fe"
        },
        {
            NO: 2,
            TITLE: "몇컷의 이미지가 필요하신가요?",
            ICON: "transparent_folder",
            DESC: "제품별로 각 이미지가 몇컷씩 필요한지에 따라 견적이 달라질 수 있습니다.",
            BACKGROUND_COLOR: "#4a90e2"
        },
        {
            NO: 3,
            TITLE: "어떤 컨셉으로 촬영을 원하시나요?",
            ICON: "transparent_shot",
            DESC: "고객님께서 원하시는 컨셉에 맞는 레퍼런스 자료를 전달해\n주시면 만족도 높은 결과물을 받아보실 수 있습니다.",
            BACKGROUND_COLOR: "#f5a623"
        }
    ],
    INFO_KIND: {
        TITLE: "촬영컷 종류는 어떻게 구분하나요?",
        LIST: [
            {
                NO: 1,
                TITLE: "기본누끼컷",
                DESC: "원하는 형태의 배경을 합성하거나 깔끔한 이미지를 위해\n배경을 삭제하는 작업을 진행한 이미지입니다.",
                IMAGES: [
                    {
                        NO: 1,
                        SRC: "/common/popup/shot_info/shot_kind/kind_01.png",
                        ARTIST: "오디니크",
                        ARTIST_COLOR: "#000"
                    },
                    {
                        NO: 2,
                        SRC: "/common/popup/shot_info/shot_kind/kind_02.png",
                        ARTIST: "신승철",
                        ARTIST_COLOR: "#000"
                    }
                ]
            },
            {
                NO: 2,
                TITLE: "누끼컷 - 유광제품 (반사제품)",
                DESC: "유광제품의 경우 빛의 강도나 각도를 조절하여 촬영이\n 진행되며, 추가 편집이 필요한 경우가 있습니다.",
                IMAGES: [
                    {
                        NO: 1,
                        SRC: "/common/popup/shot_info/shot_kind/kind_03.png",
                        ARTIST: "멜로우모먼트",
                        ARTIST_COLOR: "#000"
                    },
                    {
                        NO: 2,
                        SRC: "/common/popup/shot_info/shot_kind/kind_04.png",
                        ARTIST: "박수진",
                        ARTIST_COLOR: "#000"
                    }
                ]
            },
            {
                NO: 3,
                TITLE: "누끼컷 - 바닥컷",
                DESC: "제품을 바닥에 펼쳐 두고 촬영을 진행하는 것으로\n 촬영 이후 배경삭제 작업을 추가로 진행합니다.",
                IMAGES: [
                    {
                        NO: 1,
                        SRC: "/common/popup/shot_info/shot_kind/kind_05.png",
                        ARTIST: "오디니크",
                        ARTIST_COLOR: "#000"
                    },
                    {
                        NO: 2,
                        SRC: "/common/popup/shot_info/shot_kind/kind_06.png",
                        ARTIST: "이원은",
                        ARTIST_COLOR: "#000"
                    }
                ]
            },
            {
                NO: 4,
                TITLE: "누끼컷 -고스트컷",
                DESC: "촬영에서 사용하는 기법으로 투명 마네킹을 이용해\n 촬영 한 후 마네킹을 삭제하는 작업을 진행합니다.",
                IMAGES: [
                    {
                        NO: 1,
                        SRC: "/common/popup/shot_info/shot_kind/kind_07.png",
                        ARTIST: "박수진",
                        ARTIST_COLOR: "#000"
                    },
                    {
                        NO: 2,
                        SRC: "/common/popup/shot_info/shot_kind/kind_08.png",
                        ARTIST: "김병국",
                        ARTIST_COLOR: "#000"
                    }
                ]
            },
            {
                NO: 5,
                TITLE: "연출누끼컷",
                DESC: "제품 패키지와 함께 촬영, 화장품 제형을 보여주는 경우 등의\n연출이 추가되는 누끼 촬영입니다.",
                IMAGES: [
                    {
                        NO: 1,
                        SRC: "/common/popup/shot_info/shot_kind/kind_09.png",
                        ARTIST: "신승철",
                        ARTIST_COLOR: "#000"
                    },
                    {
                        NO: 2,
                        SRC: "/common/popup/shot_info/shot_kind/kind_10.png",
                        ARTIST: "유림",
                        ARTIST_COLOR: "#000"
                    }
                ]
            },
            {
                NO: 6,
                TITLE: "인물누끼컷",
                DESC: "모델이 시연하고 있거나 착장하고 있는 모습을\n촬영한 후 배경을 삭제하는 작업을 진행합니다.",
                IMAGES: [
                    {
                        NO: 1,
                        SRC: "/common/popup/shot_info/shot_kind/kind_11.png",
                        ARTIST: "오디니크",
                        ARTIST_COLOR: "#000"
                    },
                    {
                        NO: 2,
                        SRC: "/common/popup/shot_info/shot_kind/kind_12.png",
                        ARTIST: "오디니크",
                        ARTIST_COLOR: "#000"
                    }
                ]
            },
            {
                NO: 7,
                TITLE: "디테일컷",
                DESC: "제품의 전체적인 모습이 아닌 부분의 상세한 이미지를 촬영합니다.\n쇼핑몰 상세페이지에 전체컷과 함께 삽입되는 경우가 많습니다.",
                IMAGES: [
                    {
                        NO: 1,
                        SRC: "/common/popup/shot_info/shot_kind/kind_13.png",
                        ARTIST: "하소희",
                        ARTIST_COLOR: "#fff"
                    },
                    {
                        NO: 2,
                        SRC: "/common/popup/shot_info/shot_kind/kind_14.png",
                        ARTIST: "한준희",
                        ARTIST_COLOR: "#fff"
                    }
                ]
            },
            {
                NO: 8,
                TITLE: "기본연출컷",
                DESC: "깔끔한 배경지에 1 ~ 2개의 소품으로\n컨셉에 맞는 연출 촬영을 진행합니다.",
                IMAGES: [
                    {
                        NO: 1,
                        SRC: "/common/popup/shot_info/shot_kind/kind_15.png",
                        ARTIST: "멜로우모먼트",
                        ARTIST_COLOR: "#000"
                    },
                    {
                        NO: 2,
                        SRC: "/common/popup/shot_info/shot_kind/kind_16.png",
                        ARTIST: "박수진",
                        ARTIST_COLOR: "#000"
                    }
                ]
            },
            {
                NO: 9,
                TITLE: "컨셉연출컷",
                DESC: "제품의 아이덴티티를 살려 다양한 배경 및 소품으로\n연출을 진행합니다.",
                IMAGES: [
                    {
                        NO: 1,
                        SRC: "/common/popup/shot_info/shot_kind/kind_17.png",
                        ARTIST: "박수진",
                        ARTIST_COLOR: "#fff"
                    },
                    {
                        NO: 2,
                        SRC: "/common/popup/shot_info/shot_kind/kind_18.png",
                        ARTIST: "박수진",
                        ARTIST_COLOR: "#fff"
                    }
                ]
            },
            {
                NO: 10,
                TITLE: "연출단체컷",
                DESC: "여러개의 제품을 한 이미지에 담는 것으로\n제품에 맞는 연출이 추가됩니다.",
                IMAGES: [
                    {
                        NO: 1,
                        SRC: "/common/popup/shot_info/shot_kind/kind_19.png",
                        ARTIST: "크리에이티브그룹",
                        ARTIST_COLOR: "#fff"
                    },
                    {
                        NO: 2,
                        SRC: "/common/popup/shot_info/shot_kind/kind_20.png",
                        ARTIST: "유림",
                        ARTIST_COLOR: "#000"
                    }
                ]
            },
            {
                NO: 11,
                TITLE: "연출컷 - 자연광촬영",
                DESC: "자연광스튜디오에서 촬영하며 부드럽고\n자연스러운 촬영 및 연출이 가능합니다.",
                IMAGES: [
                    {
                        NO: 1,
                        SRC: "/common/popup/shot_info/shot_kind/kind_21.jpg",
                        ARTIST: "김진우",
                        ARTIST_COLOR: "#000"
                    },
                    {
                        NO: 2,
                        SRC: "/common/popup/shot_info/shot_kind/kind_22.png",
                        ARTIST: "멜로우모먼트",
                        ARTIST_COLOR: "#000"
                    }
                ]
            },
            {
                NO: 12,
                TITLE: "합성컷",
                DESC: "단순한 배경 합성외에 물이 후르는 등의 효과를\n 추가한 이미지로 여러 번의 작업을 거쳐서 완성됩니다.",
                IMAGES: [
                    {
                        NO: 1,
                        SRC: "/common/popup/shot_info/shot_kind/kind_23.png",
                        ARTIST: "박수진",
                        ARTIST_COLOR: "#000"
                    },
                    {
                        NO: 2,
                        SRC: "/common/popup/shot_info/shot_kind/kind_24.png",
                        ARTIST: "박수진",
                        ARTIST_COLOR: "#000"
                    }
                ]
            },
            {
                NO: 13,
                TITLE: "모델컷",
                DESC: "의류, 가방, 소품 등 모델이 동반된 이미지입니다.\n컨셉에 맞는 모델 섭외에서부터 헤어메이크업 등 많은 전문가와의 협업으로 진행됩니다.",
                IMAGES: [
                    {
                        NO: 1,
                        SRC: "/common/popup/shot_info/shot_kind/kind_25.png",
                        ARTIST: "joooorish",
                        ARTIST_COLOR: "#000"
                    },
                    {
                        NO: 2,
                        SRC: "/common/popup/shot_info/shot_kind/kind_26.png",
                        ARTIST: "BECK",
                        ARTIST_COLOR: "#000"
                    }
                ]
            }
        ]
    },
    ADD_THING: {
        TITLE: "추가 고려사항",
        DESC: "이미지의 종류뿐만 아니라 상품, 제품의 종류에 따라 견적이 달라지기도 합니다.\n소형인지 대형인지 어떤 제품이지에 따라 촬영의 난이도가 달라지며 비용이 변동될 수 있습니다."
    },
    HOW_CUT: {
        TITLE: "이미지 컷수는 어떻게 정하나요?",
        DESC: "이미지 사용 용도에 따라 필요로 하는 컷수가 달라질 수 있습니다.\n" +
        "쇼핑몰 등에서 사용하는 상세페이지의 경우 제품당 누끼 4~6컷 (전체 1~2, 상세 2~4), 연출 1~2컷, 단체컷 등이 필요합니다.\n" +
        "인테리어촬영의 경우 구역별(방 혹은 분리된 룸)1~2컷, 외관 (필요한 경우)컷 등이 필요합니다.\n" +
        "필요로하시는 이미지의 컷수를 이미지 종류별로 정리해 두신다면, 더욱 자세한 견적을 받아보실 수 있습니다.",
        IMAGES: [
            {
                NO: 1,
                SRC: "/common/popup/shot_info/how_shot/howshot_01.png",
                ARTIST: "오디니크",
                WIDTH: 294,
                HEIGHT: 196
            },
            {
                NO: 2,
                SRC: "/common/popup/shot_info/how_shot/howshot_02.png",
                ARTIST: "오디니크",
                WIDTH: 169,
                HEIGHT: 196
            },
            {
                NO: 3,
                SRC: "/common/popup/shot_info/how_shot/howshot_03.png",
                ARTIST: "오디니크",
                WIDTH: 169,
                HEIGHT: 196
            },
            {
                NO: 4,
                SRC: "/common/popup/shot_info/how_shot/howshot_04.png",
                ARTIST: "오디니크",
                WIDTH: 169,
                HEIGHT: 196
            }
        ]
    },
    HOW_CONCEPT: {
        TITLE: "컨셉은 어떻게 전달해야 하나요?",
        DESC: "고객님께서 원하는 컨셉이 명확할수록 만족도가 높은 결과물을 받아보실 수 있습니다.\n" +
        "\"광고 같은 느낌이었으면 좋겠어요\", \"환한 이미지였으면 좋겠어요\" 와 같은 주관적 해석이 가능한 컨셉보다\n" +
        "\"이런이미지처럼 촬영하고 싶어요.\" 와 같이 최대한 비슷한 참고자료 (레퍼런스)를 제공해주시는 것이 좋습니다.\n" +
        "레퍼런스 없이 이미지에 대한 설명만으로도 촬영이 가능하나 결과물에 만족도를 높이기 위해서는 필수라고 할 수 있습니다."
    },
    HOW_REFERENCE: {
        TITLE: "레퍼런스를 어떻게 구해야하는지 모르겠어요.",
        TITLE_BACKGROUND_COLOR: "#f9a925",
        DESC: "아래와 같이 포털사이트에서 검색하여 원하는 이미지를 저장하여 전달해주시면 됩니다.",
        IMAGE: {
            NO: 1,
            SRC: "/common/popup/shot_info/how_reference.png"
        }
    }
};
