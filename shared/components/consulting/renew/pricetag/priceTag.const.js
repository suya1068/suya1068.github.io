export const BASE_IMAGE_PATH = "/common/counsel/biz/pricetag/";
export const PRICE_TAG_FOR_CATEGORY = {
    PRODUCT: {
        code: "product",
        name: "제품",
        warn: "추가 보정 및 합성이 필요한 경우 견적이 달라질 수 있으며, 대량 촬영의 경우 별도 문의",
        tag: [
            [
                {
                    no: 1,
                    name: "기본 누끼",
                    price: "8000",
                    desc: "원하는 형태의 배경을 합성하거나 깔끔한 이미지를 위해 배경을 삭제하는 작업을 진행한 이미지",
                    sample_img: "product_01.png",
                    artist: "박수진",
                    color: "#000"
                },
                {
                    no: 2,
                    name: "대형 누끼",
                    price: "12000",
                    desc: "반사가 없는 대형 제품 전체를 촬영",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ],
            [
                {
                    no: 3,
                    name: "반사 누끼",
                    price: "15000",
                    desc: "반사가 있는 재질 (유리, 스테인레스, 가죽, 금속) 의 제품 (화장품, 향수, 주얼리) 전체를 촬영",
                    sample_img: "product_02.png",
                    artist: "멜로우모먼트",
                    color: "#000"
                },
                {
                    no: 4,
                    name: "연출 누끼",
                    price: "20000",
                    desc: "제품 패키지와 함께 촬영, 화장품 제형을 보여주는 경우, 인물의 신체 일부가 함께 나오는 등의 추가 연출 누끼 촬영",
                    sample_img: "product_03.png",
                    artist: "신승철",
                    color: "#000"
                }
            ],
            [
                {
                    no: 5,
                    name: "인물 누끼",
                    price: "25000",
                    desc: "인물의 얼굴, 반신, 전신 등이 제품이 함께 나오는 경우",
                    sample_img: "product_04.png",
                    artist: "오디니크",
                    color: "#000"
                },
                {
                    no: 6,
                    name: "합성 누끼",
                    price: "30000",
                    desc: "LED, 전구 등 불빛이 함께 표현되는 제품을 촬영하는 경우 (합성 작업 진행)",
                    sample_img: "",
                    artist: "",
                    color: "#"
                }
            ],
            [
                {
                    no: 7,
                    name: "그룹 누끼",
                    price: "30000",
                    desc: "무반사 재질 제품 한정으로 복수의 제품을 한 컷에 촬영하는 경우",
                    sample_img: "",
                    artist: "",
                    color: ""
                },
                {
                    no: 8,
                    name: "패션 소품 제품 당 누끼",
                    price: "30000",
                    desc: "패션 소품 제품당 8컷 누끼 촬영",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ],
            [
                {
                    no: 9,
                    name: "의류 제품당 누끼",
                    price: "40000",
                    desc: "의류 제품당 8컷 누끼 촬영",
                    sample_img: "",
                    artist: "",
                    color: ""
                },
                {
                    no: 10,
                    name: "디테일 컷",
                    price: "5000",
                    desc: "제품의 특정 부분 (재질 클로즈업, 양음각 클로즈업, 의류의 경우 팔, 넥 라인 등) 촬영",
                    sample_img: "product_05.png",
                    artist: "하소희",
                    color: "#fff"
                }
            ],
            [
                {
                    no: 11,
                    name: "기본 연출컷 (1컷)",
                    price: "40000",
                    desc: "배경지 +1~2개의 소품을 활용한 단품 촬영",
                    sample_img: "product_06.png",
                    artist: "박수진",
                    color: "#000"
                },
                {
                    no: 12,
                    name: "기본 연출 그룹컷 (1컷)",
                    price: "40000",
                    desc: "배경지+1~2개의 소품을 활용한 제품 4~5개 그룹 촬영",
                    sample_img: "product_07.png",
                    artist: "크리에이티브그룹",
                    color: "#fff"
                }
            ],
            [
                {
                    no: 13,
                    name: "컨셉 연출컷 (1컨셉)",
                    price: "100000",
                    desc: "특별한 합성작업이 필요하지 않은 제품 연출 촬영 (스튜디오, 자연광 동일)\n클라이언트가 요구하는 컨셉 당 컷수가 명확하지 않은 경우 촬영한 원본 이미지 일괄 제공 (촬영 시간 약 1시간)",
                    sample_img: "product_08.png",
                    artist: "박수진",
                    color: "#fff"
                },
                {
                    no: 14,
                    name: "제품 촬영 대행 (1시간)",
                    price: "100000",
                    desc: "소품 클라이언트 준비, 촬영 컨셉갯수와 컷수 모두 명확하지 않은 경우",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ]
        ]
    },
    FOOD: {
        code: "food",
        name: "음식",
        warn: "스튜디오 촬영 기준이며 출장촬영 시 출장비 별도 발생, 대량 촐영의 경우 별도 문의",
        tag: [
            [
                {
                    no: 1,
                    name: "스튜디오 연출 촬영",
                    price: "80000",
                    desc: "작가가 직접 스타일링까지 진행 (스타일링비용, 재료비 포함)",
                    sample_img: "",
                    artist: "",
                    color: ""
                },
                {
                    no: 2,
                    name: "누끼촬영",
                    price: "20000",
                    desc: "메뉴판 제작에 사용되는 음식 누끼 촬영",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ],
            [
                {
                    no: 3,
                    name: "매장출장 연출 촬영",
                    price: "40000",
                    desc: "1개 메뉴에 대한 연출 및 스타일링 촬영 (보정본 2컷 제공), 스타일링 정도에 따라 견적 변동",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ]
        ]
    },
    EVENT: {
        code: "event",
        name: "행사",
        warn: "",
        tag: [
            [
                {
                    no: 1,
                    name: "2시간",
                    price: "200000",
                    desc: "북 콘서트, 클럽 공연 등 규모가 작은 행사 (원본 전체 기본 톤보정 후 제공, 세부 보정 없음)",
                    sample_img: "",
                    artist: "",
                    color: ""
                },
                {
                    no: 2,
                    name: "4시간",
                    price: "350000",
                    desc: "기업 신년회&송년회 등 (원본 전체 기본 톤보정 후 제공, 세부 보정 없음)",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ],
            [
                {
                    no: 3,
                    name: "8시간",
                    price: "600000",
                    desc: "페스티벌, 문화행사, 광고 촬영 등 원데이 행사 (원본 전체 기본 톤보정 후 제공, 세부 보정 없음)",
                    sample_img: "",
                    artist: "",
                    color: ""
                },
                {
                    no: 4,
                    name: "시간 초과 (1시간당)",
                    price: "100000",
                    desc: "",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ],
            [
                {
                    no: 5,
                    name: "포토그래퍼 추가 (1인)",
                    price: "단가x1.5",
                    desc: "",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ]
        ]
    },
    INTERIOR: {
        code: "interior",
        name: "인테리어",
        warn: "",
        tag: [
            [
                {
                    no: 1,
                    name: "인테리어 기본 (15컷)",
                    price: "350000",
                    desc: "단층 매장의 경우 매장 외부 컷 1~2컷 포함 (원본 제공+고객 셀렉 이미지 보정)",
                    sample_img: "",
                    artist: "",
                    color: ""
                },
                {
                    no: 2,
                    name: "복층 익스테리어 (1컷)",
                    price: "50000",
                    desc: "복층, 빌딩 건물의 외부, 전체 전경 촬영 (원본 전체 제공, 합성 작업 진행)",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ],
            [
                {
                    no: 3,
                    name: "야경 간판컷 (1컷)",
                    price: "30000",
                    desc: "단층 매장 외부의 야간 간판 (네온사인) 촬영의 경우",
                    sample_img: "",
                    artist: "",
                    color: ""
                },
                {
                    no: 4,
                    name: "보정컷 추가 (1컷)",
                    price: "20000",
                    desc: "인테리어 컷",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ],
            [
                {
                    no: 5,
                    name: "포토그래퍼 추가 (1인)",
                    price: "단가x1.5",
                    desc: "",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ]
        ]
    },
    PROFILE_BIZ: {
        code: "profile_biz",
        name: "기업프로필",
        warn: "출장 촬영의 경우 메인 포토그래퍼 및 어시스턴트 2인 출장비용 별도 발생, 대규모 촬영의 경우 별도 문의",
        tag: [
            [
                {
                    no: 1,
                    name: "기업 프로필 기본 (10명)",
                    price: "300000",
                    desc: "인원당 보정본 1컷 제공, 촬영 전 배경 조율 필요",
                    sample_img: "",
                    artist: "",
                    color: ""
                },
                {
                    no: 2,
                    name: "단체 프로필 (1컷)",
                    price: "50000",
                    desc: "보정본 1컷 제공, 20인 기준 (20인 이상 시 5인당 10,000원 보정가격 추가)",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ],
            [
                {
                    no: 3,
                    name: "인원 추가 (1명)",
                    price: "25000",
                    desc: "보정컷 1컷 제공",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ]
        ]
    },
    FASHION: {
        code: "fashion",
        name: "패션",
        warn: "소량, 대량 촬영의 경우 별도 문의",
        tag: [
            [
                {
                    no: 1,
                    name: "숏데이 기본 촬영 (2시간)",
                    price: "300000",
                    desc: "컨셉 및 포즈가 협의된 경우 약 5~10착장 촬영 가능, 원본+톤보정본 전체 재공",
                    sample_img: "",
                    artist: "",
                    color: ""
                },
                {
                    no: 2,
                    name: "하프데이 기본 촬영 (4시간)",
                    price: "500000",
                    desc: "컨셉 및 포즈가 협의된 경우 약 15~20착장 촬영 가능, 원본+톤보정본 전체 제공",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ],
            [
                {
                    no: 3,
                    name: "풀데이 기본 촬영 (8시간)",
                    price: "1000000",
                    desc: "컨셉 및 포즈가 협의된 경우 약 30~40착장 촬영 가능, 원본+톤보정본 전체 제공",
                    sample_img: "",
                    artist: "",
                    color: ""
                },
                {
                    no: 4,
                    name: "하프데이 컨셉 촬영 (4시간)",
                    price: "800000",
                    desc: "컨셉 제안, 모델, 헤&메, 스타일리스트 섭외 진행, 약 15~20착장 촬영 가능, 원본+톤보정본 전체 제공",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ],
            [
                {
                    no: 5,
                    name: "풀데이 컨셉 촬영 (8시간)",
                    price: "1500000",
                    desc: "컨셉 제안, 모델, 헤&메, 스타일리스트 섭외 진행, 약 30~40착장 촬영 가능, 원본+톤보정본 전체 제공",
                    sample_img: "fashion_01.png",
                    artist: "joooorish",
                    color: "#000"
                },
                {
                    no: 6,
                    name: "원본 촬영",
                    price: "단가x0.8",
                    desc: "원본만 전체 제공",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ],
            [
                {
                    no: 7,
                    name: "리터치",
                    price: "3000",
                    desc: "고객 셀렉 컷 한 컷당 피부 보정, 몸매 보정, 라인 교정",
                    sample_img: "",
                    artist: "",
                    color: ""
                },
                {
                    no: 8,
                    name: "리터치+누끼",
                    price: "5000",
                    desc: "고객 셀렉 컷 한 컷당 피부 보정, 몸매 보정, 라인 교정+누끼 작업",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ]
        ]
    },
    VIDEO_BIZ: {
        code: "video_biz",
        name: "영상",
        warn: "영상의 길이, 난이도에 따라 견적이 달라질 수 있으며, 기획이 필요한 촬영의 경우 콘티 무료제공",
        tag: [
            [
                {
                    no: 1,
                    name: "SNS용 영상촬영 및 편집",
                    price: "1600000",
                    desc: "1분이내의 영상으로 기획, 배우, 헤어메이크업, 촬영, 편집 등이 포함",
                    sample_img: "",
                    artist: "",
                    color: ""
                },
                {
                    no: 2,
                    name: "행사 스케치 촬영 및 편집",
                    price: "800000",
                    desc: "행사 진행의 분위기와 현장감을 촬영, 기본 2시간으로 촬영으로 편집 및 자막 삽입 포함",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ],
            [
                {
                    no: 3,
                    name: "인터뷰 촬영 및 편집",
                    price: "700000",
                    desc: "인물 촬영, 무선 마이크를 활용해서 전달감을 높이는 인터뷰 영상 촬영, 기본 2시간으로 촬영으로 편집 및 자막 삽입 포함",
                    sample_img: "",
                    artist: "",
                    color: ""
                },
                {
                    no: 4,
                    name: "제품 영상 촬영 편집",
                    price: "800000",
                    desc: "제품을 스튜디오 가운데에 비치해놓고 다양한 컷으로 연출하여 제품 촬영 진행, 편집 및 자막 삽입, 스튜디오 비용이 포함",
                    sample_img: "",
                    artist: "",
                    color: ""
                }
            ]
        ]
    }
};
