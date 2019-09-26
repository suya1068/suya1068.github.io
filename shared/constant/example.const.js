const PATH = "/biz/excard";
const EX_CARD_CODE = {
    "EX_CARD-1": { code: "ex_card-1" },
    "EX_CARD-2": { code: "ex_card-2" },
    "EX_CARD-3": { code: "ex_card-3" }
    // "EX_CARD-4": { code: "ex_card-4" },
    // "EX_CARD-5": { code: "ex_card-5" }
};

export const EX_CARD = [
    {
        code: EX_CARD_CODE["EX_CARD-1"].code,
        title: "인테리어 & 직원프로필",
        category_code: "interior",
        category_name: "인테리어",
        src: "/biz/example/20181213/interior.jpg"
    },
    {
        code: EX_CARD_CODE["EX_CARD-2"].code,
        title: "모델 패션 촬영",
        category_code: "fashion",
        category_name: "패션",
        src: "/biz/example/20181213/fashion.jpg"
    },
    {
        code: EX_CARD_CODE["EX_CARD-3"].code,
        title: "협약식 스케치 영상",
        category_code: "video_biz",
        category_name: "기업영상",
        src: "/biz/example/20181213/video_biz.jpg"
    }
    // {
    //     code: EX_CARD_CODE["EX_CARD-4"].code,
    //     title: "APCCAL EXPO 2018 SEOUL 행사 촬영",
    //     category_code: "event",
    //     category_name: "행사",
    //     src: "/biz/example/event_card.jpg"
    // },
    // {
    //     code: EX_CARD_CODE["EX_CARD-5"].code,
    //     title: "2019 피스콘서트 추진 협약식 스케치 영상 촬영",
    //     category_code: "video_biz",
    //     category_name: "영상",
    //     src: "/biz/example/video_card.png"
    // }
];

export const EX_CARD_DATA = {
    [EX_CARD_CODE["EX_CARD-1"].code]: {
        type: "photo",
        head_bg: `${PATH}/interior/interior_head_bg.jpg`,
        category: "interior",
        category_name: "인테리어 촬영",
        title: "연세우리들치과\n인테리어 및 프로필 촬영",
        caption: {
            position: "top",
            desc: "영등포 시장 부근에 새로 오픈하는 치과병원인 연세우리들치과의 인테리어 촬영과 함께\n" +
            "원장님 및 직원들의 프로필 촬영을 진행하였습니다."
        },
        panel_data: [
            {
                type: "image",
                photo_position: "full",
                photo: {
                    src: `${PATH}/interior/interior_card_01.jpg`,
                    width: 910,
                    height: 520,
                    mark: "top-right"
                },
                text: {
                    type: "info",
                    title: "촬영 상담 내용",
                    content: [
                        { code: "data", name: "일정", desc: "", color: "#fff" },
                        { code: "place", name: "지역", desc: "서울시 영등포구", color: "#fff" },
                        { code: "use", name: "사용용도", desc: "홈페이지용", color: "#000" },
                        { code: "content", name: "내용", desc: "병원 인테리어 촬영 및 원장님과 스탭 프로필 촬영", color: "#000" },
                        { code: "req", name: "용도", desc: "인테리어 컷 15컷, 원장님 1컷, 직원단체 1컷씩 필요", color: "#000" }
                    ]
                }
            },
            {
                type: "image",
                photo_position: "mix",
                photo: {
                    src: `${PATH}/interior/interior_card_02.jpg`,
                    width: 550,
                    height: 350,
                    mark: "top-right"
                },
                sub_photo: {
                    src: `${PATH}/interior/interior_card_03.jpg`,
                    width: 400,
                    height: 345
                },
                text: {
                    type: "normal",
                    title: "이렇게 진행했어요",
                    content: [
                        {
                            no: "01",
                            desc: "새로 준비중인 병원 홈페이지에 사용할 사진촬영을 의뢰 주셨어요.\n" +
                            "인테리어 촬영은 기본 촬영이 30만원인데요,\n" +
                            "요청 주신 컷 수가 적어서 프로필 촬영을 서비스로 해드렸답니다."
                        }
                    ]
                }
            },
            {
                type: "image",
                photo_position: "right",
                photo: {
                    src: `${PATH}/interior/interior_card_04.jpg`,
                    width: 380,
                    height: 538,
                    mark: "top-right"
                },
                text: {
                    type: "list",
                    title: "인테리어\n" +
                    "촬영 체크포인트",
                    grid_dist: 20,
                    title_bar: "right",
                    content: [
                        {
                            no: "01",
                            desc: "인테리어 촬영은 출장 촬영이라서 최소 촬영 비용이 존재합니다.\n" +
                            "기본 비용에 포함되는 보정 컷수는 15장 입니다.\n" +
                            "추가 컷당 2만원씩 추가됩니다."
                        },
                        {
                            no: "02",
                            desc: "인테리어 촬영할 공간의 정보가 필요해요.\n" +
                            "분리된 공간의 종류와 크기 등을 휴대폰으로 촬영해서 보내주시면 " +
                            "큰 도움이 됩니다."
                        },
                        {
                            no: "03",
                            desc: "보통 인테리어 촬영 요청하시면서 관계자 프로필 촬영도 같이 요청주세요. " +
                            "프로필 촬영 하실 분이 몇명인지 몇 컷씩 필요하신지 정해주셔야 디테일한 견적을 드릴 수 있어요."
                        }
                    ]
                }
            },
            {
                type: "budget",
                photo_position: "",
                photo: "",
                text: {
                    type: "budget",
                    title: "진행예산",
                    content: [
                        {
                            no: "01",
                            desc: "인테리어 촬영 기본 15컷 - 300,000원",
                            result: false
                        },
                        {
                            no: "02",
                            desc: "프로필 촬영 보정컷당 25,000원 x 2컷 - 서비스",
                            result: false
                        },
                        {
                            no: "03",
                            desc: "총 예산 30만원, vat 별도",
                            result: true
                        }
                    ]
                }
            },
            {
                type: "image",
                photo_position: "left",
                photo: {
                    src: `${PATH}/interior/interior_card_05.jpg`,
                    width: 486,
                    height: 355,
                    mark: "top-right"
                },
                text: {
                    type: "normal",
                    title: "",
                    content: [
                        {
                            no: "01",
                            desc: "병원 인테리어 사진의 경우 신뢰감 및 편안함을 강조하는 컨셉으로 촬영을 진행합니다.\n" +
                            "병원뿐 아니라 대부분의 인테리어 촬영의 경우 고객이 해당 장소를 방문하기 전 홈페이지나 소개페이지 등에서 먼저 접하게 되기 때문에 좋은 " +
                            "이미지를 남기기 위한 사진이 필수적이라고 할 수 있습니다.\n\n" +
                            "단순한 공간의 촬영이 아닌 조화로운 공간표현을 통한 이미지 메이킹이 중요한 인테리어 촬영, 고객님의 " +
                            "촬영 목적에 맞는 컨셉 설정과 합리적인 견적을 포스냅에서 받아보세요!"
                        }
                    ]
                }
            }
        ]
    },
    [EX_CARD_CODE["EX_CARD-2"].code]: {
        type: "photo",
        head_bg: `${PATH}/fashion/fashion_head_bg.jpg`,
        category: "fashion",
        category_name: "패션 촬영",
        title: "실제 촬영 사례로 살펴보는\n패션 촬영",
        caption: {
            position: "bottom",
            desc: "포스냅에서는 촬영 목적에 맞춰 촬영방법을 제안하고 고객님의니즈에 맞춰 조율을 진행합니다.\n" +
            "컨셉부터 모델, 스튜디오섭외 등 촬영에 필요한 모든 단계의 상담과 견적을 받아보세요!"
        },
        panel_data: [
            {
                type: "image",
                photo_position: "left",
                photo: {
                    src: `${PATH}/fashion/fashion_card_01.jpg`,
                    width: 400,
                    height: 600,
                    mark: "bottom-right"
                },
                text: {
                    type: "chat",
                    title: "클라이언트의\n촬영 상담 요청 내용",
                    content: [
                        {
                            user: "client",
                            name: "클라이언트",
                            end: false,
                            desc: [
                                "남성 잠옷 약 20벌과 여성잠옷 약 20벌 촬영하고 이미지만 의뢰하면 비용이 얼마나 들까요?",
                                "모델과 헤어메이크업, 촬영 장소는 저희가 섭외해야 하는건가요?"
                            ]
                        },
                        {
                            user: "forsnap",
                            name: "포스냅",
                            end: false,
                            desc: [
                                "포스냅에서 촬영, 모델 섭외, 헤/메섭외, 장소 모두 제공해드립니다.",
                                "기본 포즈-착장당 5컷으로 촬영 진행 하시면 하루에 40벌 정도 진행이 가능하고, 호리존 스튜디오에서 작가님 데이페이로 진행이 가능하세요.",
                                "작가님 마다 데이페이가 다른데요, 추천해 드릴 작가님은 데이페이가 100 만원입니다\n" +
                                "(데이페이 : 하루 8~9시간 촬영하는 가격)"
                            ]
                        },
                        {
                            user: "",
                            name: "",
                            end: true,
                            desc: ["이후, 클라이언트께서 포스냅 사무실에 방문하여 제품 설명과 촬영 컨셉 등을 협의하고 촬영을 진행했습니다."]
                        }
                    ]
                }
            },
            {
                type: "image",
                photo_position: "right",
                photo: {
                    src: `${PATH}/fashion/fashion_card_02.jpg`,
                    width: 400,
                    height: 522,
                    mark: "top-right"
                },
                text: {
                    type: "list",
                    title: "이렇게 진행했어요",
                    grid_dist: 5,
                    title_bar: "bottom",
                    wrap: false,
                    content: [
                        {
                            no: "01",
                            desc: "제품 설명과 촬영 컨셉 협의를 위한 사전 미"
                        },
                        {
                            no: "02",
                            desc: "촬영 날짜와 시간 협의 및 견적 안내"
                        },
                        {
                            no: "03",
                            desc: "모델 섭외\n" +
                            "1차 선별 리스트 전달 -> 고객 선택 -> 모델 협의 -> 모델 촬영계약"
                        },
                        {
                            no: "04",
                            desc: "스텝 섭외 (헤어 메이크업 전문가가 필요한 촬영이였어요)"
                        },
                        {
                            no: "05",
                            desc: "촬영일에 스튜디오에 모여 촬영 시작"
                        },
                        {
                            no: "06",
                            desc: "촬영 후 약 일주일 후에 보정본 전달 완료"
                        }
                    ]
                }
            },
            {
                type: "image",
                photo_position: "full",
                photo: {
                    src: `${PATH}/fashion/fashion_card_03.jpg`,
                    width: 910,
                    height: 570,
                    mark: "top-right"
                },
                text: {
                    type: "list",
                    title: "모델 패션 촬영 체크포인트 5가지",
                    title_bar: "bottom",
                    gird_dist: 15,
                    wrap: true,
                    content: [
                        {
                            no: "01",
                            title: "촬영 컨셉 확정",
                            desc: "ex) 유니클로 느낌으로 촬영이 되면 좋겠어요."
                        },
                        {
                            no: "02",
                            title: "레퍼런스 공유",
                            desc: "고객이 생각하는 촬영 결과물과 유사한 사진들을 모아주세요."
                        },
                        {
                            no: "03",
                            title: "모델 섭외",
                            desc: "해외/국내 모델, 모델의 스타일을 대략적으로 설명해주세요, 포스냅이 무료로 섭외를 도와드립니다."
                        },
                        {
                            no: "04",
                            title: "스텝 필요여부 결정",
                            desc: "헤메, 의상 스타일리스트 등 촬영 스텝을 섭외해드립니다. 포스냅이 무료로 도와드립니다."
                        },
                        {
                            no: "05",
                            title: "촬영 일 확정",
                            desc: "고객과 스튜디오의 일정을 협의합니다."
                        }
                    ]
                }
            },
            {
                type: "budget",
                photo_position: "",
                photo: "",
                text: {
                    type: "budget",
                    title: "진행예산",
                    content: [
                        {
                            no: "01",
                            desc: "촬영/스튜디오 Full day 촬영 : 80 만원 (내부 디자이너가 보정을 하여, 원본만 전달 할인)",
                            result: false
                        },
                        {
                            no: "02",
                            desc: "모델/헤메 : 외국인 모델 Full day 섭외 100 만원, 헤어 메이크업 포스냅 제공 20만원",
                            result: false
                        },
                        {
                            no: "03",
                            desc: "총 예산 200 만원, vat 별도",
                            result: true
                        }
                    ]
                }
            }
        ]
    },
    [EX_CARD_CODE["EX_CARD-3"].code]: {
        type: "video",
        head_bg: `${PATH}/video/video_head_bg.jpg`,
        category: "video",
        category_name: "행사영상 제작",
        title: "미국 7six9 엔터테인먼트 회장\n환영리셉션 및 협약식 스케치 영상 제작",
        caption: null,
        panel_data: [
            {
                type: "image",
                photo_position: "full",
                photo: {
                    src: `${PATH}/video/video_card_01.jpg`,
                    width: 910,
                    height: 520,
                    mark: "top-right"
                },
                text: {
                    type: "info",
                    title: "촬영 상담 내용",
                    content: [
                        { code: "data", name: "일정", desc: "10월 31일 저녁 6시30분 부터", color: "#fff" },
                        { code: "place", name: "지역", desc: "코엑스", color: "#fff" },
                        { code: "time", name: "촬영 시간", desc: "1~2시간 예상", color: "#000" },
                        { code: "edit", name: "편집 영상", desc: "1분 내외", color: "#000" },
                        { code: "content", name: "내용", desc: "미국 7six9 엔터테인먼트 회장 환영리셉션 및\n협약식 스케치 영상 제작", color: "#000" },
                        { code: "req", name: "요청", desc: "바이럴용 영상을 만들고자 함", color: "#000" }
                    ]
                }
            },
            {
                type: "video",
                photo_position: "",
                title: "",
                video_id: "299596594",
                text: {
                    type: "",
                    title: ""
                }
            },
            {
                type: "image",
                photo_position: "left",
                photo: {
                    src: `${PATH}/video/video_card_02.jpg`,
                    width: 395,
                    height: 350,
                    mark: "top-right"
                },
                text: {
                    type: "inbox",
                    title: "이렇게 진행했어요",
                    caption: "",
                    content: [
                        {
                            no: "01",
                            end: false,
                            desc: "미국 엔터테이먼트사 회장님 환영 리셉션과 협약식을 영상으로 담는 행사 영상 제작을 의뢰 주셨어요.\n" +
                            "급하게 의뢰를 주셔서 간신히 작가님 일정을 잡았습니다. 촬영은 보통 일주일 전에 문의 주셔야 예약을 잡을 수가 있어요."
                        },
                        {
                            no: "02",
                            end: false,
                            desc: "촬영 후 편집까지 진행해주실 작가님을 섭외한 후 행사에 대한 전반적인 내용과 순서를 꼼꼼히 확인하고 전달하였습니다.\n" +
                            "특히 실내와 야간촬영이 있어 조명을 여러번 확인하였어요.\n" +
                            "또한 영상 사용 목적이 SNS 바이럴용이어서 용도에 맞는 편집 컨셉을 제안해드리고 컨펌 후 진행을 하였습니다."
                        },
                        {
                            no: "03",
                            end: true,
                            desc: "이러한 사전 조율과 확인을 통해 완성도 높은 결과물을 제공할 수 있었습니다."
                        }
                    ]
                }
            },
            {
                type: "text",
                photo_position: "",
                photo: null,
                text: [{
                    type: "list",
                    title: "영상 제작 요청\n체크 포인트",
                    title_bar: "bottom",
                    content: [
                        {
                            no: "01",
                            desc: "촬영 시간, 편집된 영상 시간"
                        },
                        {
                            no: "02",
                            desc: "모션 크래픽, CG등이 추가되는지 여부\nex) '나무가 자라나게 해주세요' 라는 한 마디 요청으로 견적은 수백만원이 왔다갔다 합니다."
                        }
                    ]
                }, {
                    type: "list",
                    title: "행사 영상\n제작 준비물",
                    title_bar: "bottom",
                    content: [
                        {
                            no: "01",
                            desc: "유튜브에서 고객이 생각하는 영상과 유사한 영상을 찾아서 링크를 전달해 주세요."
                        },
                        {
                            no: "02",
                            desc: "몇 대의 카메라로 촬영해야 할지, 어떤 기법을 사용해야 할지, 편집은 어떻게 해야 할지를 정할 수 있게 됩니다."
                        }
                    ]
                }]
            },
            {
                type: "budget",
                photo_position: "",
                photo: "",
                text: {
                    type: "budget",
                    title: "진행예산",
                    content: [
                        {
                            no: "01",
                            desc: "행사영상촬영 2시간 / 편집 10시간 포함",
                            result: false
                        },
                        {
                            no: "03",
                            desc: "70만원, vat 별도",
                            result: true
                        }
                    ]
                }
            },
            {
                type: "image",
                photo_position: "right",
                photo: {
                    src: `${PATH}/video/video_card_03.jpg`,
                    width: 470,
                    height: 272,
                    mark: "top-right"
                },
                text: {
                    type: "normal",
                    title: "",
                    content: [
                        {
                            no: "01",
                            desc: "영상은 촬영보다 편집에 훨씬 더 많은 시간이 필요합니다.\n" +
                            "1분 짜리 영상을 위해 8시간 넘게 편집을 하는 경우도 많이 있습니다. 또한 영상은 재촬영이 어렵기 때문에 촬영 전 많은 조율이 필요합니다.\n\n" +
                            "포스냅에서는 고객사의 니즈를 꼼꼼하게 파악하여 목적에 맞는 촬영을 제안해드립니다. 영상제작에 필요한 모든 분야의 견적과 전문상담을 받아보세요!"
                        }
                    ]
                }
            }
        ]
    }
};
