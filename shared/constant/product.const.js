export const PRODUCT_SORT = {
    NEW: { name: "최신순", value: "new" },
    LIKE: { name: "인기순", value: "like" },
    RECOMM: { name: "랭킹순", value: "recomm" },
    HIGHPRICE: { name: "높은 가격순", value: "highprice" },
    LOWPRICE: { name: "낮은 가격순", value: "lowprice" },
    SCORE: { name: "평점순", value: "score" },
    COMMENT: { name: "후기순", value: "comment" }
};

export const PRODUCT_SORT_LIST = Object.keys(PRODUCT_SORT).reduce((r, k) => { r.push(PRODUCT_SORT[k]); return r; }, []);

export const NONE_LIST = [
    { src: "/products/none_list/wedding.jpg", title: "웨딩", content: "생에 가장 아름다운 날, 소중한 시간을 아름답게 담아드립니다." },
    { src: "/products/none_list/jeju.jpg", title: "제주", content: "여행중의 자연스러운 모습을 남겨드립니다." },
    { src: "/products/none_list/family.jpg", title: "가족사진", content: "부모님의 시간은 빠르게 흘러갑니다. 지금 촬영하세요." },
    { src: "/products/none_list/profile.jpg", title: "프로필", content: "나의 가장 아름다운 날을 간직하세요." },
    { src: "/products/none_list/nukki.jpg", title: "누끼", content: "흰 배경에서 촬영하여 제품이 돋보이도록 편집한 사진입니다." },
    { src: "/products/none_list/couple.jpg", title: "커플", content: "행복한날, 사랑하는 사람과의 모습을 촬영해보세요." },
    { src: "/products/none_list/production.jpg", title: "연출사진", content: "컨셉에 맞는 소품의 배치와 레이아웃을 구상하여 촬영합니다." }
];

export const PRODUCT_LIST_TOP_CATEGORY = {
    PRODUCT: {
        artist_name: "박수진",
        title: "제품촬영",
        description: "제품만 보내세요!\n상세페이지에 필요한 연출, 누끼\n알아서 촬영해드립니다.",
        distance: 20,
        button: "grapefruit",
        bars: [
            {
                title: "연출 대행",
                description: "어떻게 촬영해야 할지 1도 모르겠다면,\n포스냅에서 무료기본연출을 받아보세요."
            },
            {
                title: "상세 페이지",
                description: "번거로운 상세 페이지 제작의뢰,\n촬영에서 상세페이지 제작까지 포스냅에서 준비하겠습니다."
            }
        ]
    },
    FOOD: {
        artist_name: "유림",
        title: "음식촬영",
        description: "더 맛있어 보이도록\n촬영해 드립니다.\n촬영 견적을 받아보세요.",
        distance: 20,
        button: "mandarin",
        bars: [
            {
                title: "기본 연출 무료제공",
                description: "전문가의 손길이 필요한 맛있어 보이는 음식사진.\n포스냅에서 촬영하시면 기본연출이 무료로 제공됩니다."
            }
        ]
    },
    PROFILE_BIZ: {
        artist_name: "오디니크",
        title: "기업프로필촬영",
        description: "바로 사용할 수 있는 형태로\n편집 / 보정해드립니다.\n촬영 견적을 받아보세요.",
        distance: 20,
        button: "bluelemon",
        bars: [
            {
                title: "디자인대행",
                description: "사원증, CEO, 임직원 촬영 등 후보정과 디자인작업까지 필요한 기업프로필 촬영.\n포스냅에서는 촬영에서 인쇄가능한 결과물로 디자인까지 진행해드립니다."
            }
        ]
    },
    INTERIOR: {
        artist_name: "윤현희",
        title: "인테리어촬영",
        description: "더 넓고, 더 고급스러운 공간 표현,\n촬영 견적을 받아보세요.",
        button: "acaiberry",
        bars: [
            {
                title: "가성비 좋은 인테리어,익스테리어 촬영",
                description: "지금까지 받았던 견적은 모두 잊으세요.\n퀄리티 보장은 물론, 가격까지 착한 포스냅의 견적서면 충분합니다."
            },
            {
                title: "대표프로필촬영 무료",
                description: "홈페이지에 사용할 인테리어 촬영진행 시\n대표님 프로필 촬영은 포스냅이 무료로 진행 해드립니다."
            }
        ]
    },
    EVENT: {
        artist_name: "이세현",
        title: "행사촬영",
        description: "행사 현장의 분위기까지\n사진으로 전달합니다.\n촬영 견적을 받아보세요.",
        distance: 20,
        button: "grape",
        bars: [
            {
                title: "최적의 작가님을 추천해드립니다.",
                description: "행사 장소를 이미 촬영해보신 작가님,\n유사 행사 촬영 경험 작가님을 위주로 추천 해드립니다."
            },
            {
                title: "언제 어디서든 촬영이 가능합니다.",
                description: "전국 700명 이상의 작가님들로 구성된 포스냅에서는\n고객님이 원하는 장소에서 원하는 시간에 촬영이 가능합니다."
            }
        ]
    },
    FASHION: {
        artist_name: "멜로우모먼트",
        title: "패션촬영",
        description: "어디서든 돋보이는 패션 촬영.\n기획부터 섭외, 촬영, 편집까지\n한번에 견적 받아보세요.",
        distance: 20,
        button: "durian",
        bars: [
            {
                title: "소량촬영가능",
                description: "포스냅에서는\n단 한벌의 촬영도 가능합니다."
            },
            {
                title: "스텝섭외대행",
                description: "패션촬영에 꼭 필요한 모델, 헤메,스튜디오 섭외.\n포스냅에서는 알아서 다 준비해 드립니다."
            }
        ]
    },
    VIDEO_BIZ: {
        artist_name: "",
        title: "영상촬영",
        description: "영상 시나리오, 콘티를 제공합니다.\n사전 미팅을 신청해주세요.",
        button: "wasabi",
        bars: [
            {
                title: "고퀄리티, 저렴한 영상촬영",
                description: "고객님의 예산에 맞춘 가성비 좋은 견적서,\n포스냅에서 제공해드립니다."
            },
            {
                title: "무료콘티 제공",
                description: "포스냅에서 영상촬영 상담받고,\n1차기획과 콘티까지 무료로 받아보세요."
            }
        ]
    }
};

export const PRODUCT_LIST_PORTFOLIO = {
    PRODUCT: [
        { src: "/products/portfolio/product/product_01.jpg", artist_name: "크리에이티브그룹", width: "198px", height: "198px", color: "#000" },
        { src: "/products/portfolio/product/product_02.jpg", artist_name: "심규보", width: "198px", height: "198px", color: "#000" },
        { src: "/products/portfolio/product/product_03.jpg", artist_name: "크리에이티브그룹", width: "198px", height: "198px", color: "#000" },
        { src: "/products/portfolio/product/product_04.jpg", artist_name: "박수진", width: "198px", height: "198px", color: "#000" },
        { src: "/products/portfolio/product/product_05.jpg", artist_name: "이원은", width: "198px", height: "198px", color: "#000" },
        { src: "/products/portfolio/product/product_06.jpg", artist_name: "유림", width: "198px", height: "198px", color: "#000" },
        { src: "/products/portfolio/product/product_07.jpg", artist_name: "유림", width: "198px", height: "198px", color: "#000" },
        { src: "/products/portfolio/product/product_08.jpg", artist_name: "유림", width: "198px", height: "198px", color: "#000" },
        { src: "/products/portfolio/product/product_09.jpg", artist_name: "miro", width: "198px", height: "198px", color: "#000" },
        { src: "/products/portfolio/product/product_10.jpg", artist_name: "박수진", width: "198px", height: "198px", color: "#000" }
    ],
    FOOD: [
        { src: "/products/portfolio/food/food_01.jpg", artist_name: "유림", width: "250px", height: "250px" },
        { src: "/products/portfolio/food/food_02.jpg", artist_name: "심보건", width: "250px", height: "250px" },
        { src: "/products/portfolio/food/food_03.jpg", artist_name: "최민정", width: "250px", height: "250px" },
        { src: "/products/portfolio/food/food_04.jpg", artist_name: "panphoto", width: "250px", height: "250px" },
        { src: "/products/portfolio/food/food_05.jpg", artist_name: "유림", width: "250px", height: "250px" },
        { src: "/products/portfolio/food/food_06.jpg", artist_name: "panphoto", width: "250px", height: "250px" },
        { src: "/products/portfolio/food/food_07.jpg", artist_name: "최민정", width: "250px", height: "250px" },
        { src: "/products/portfolio/food/food_08.jpg", artist_name: "박수진", width: "250px", height: "250px" }
    ],
    PROFILE_BIZ: [
        { src: "/products/portfolio/profile_biz/profile_biz_01.jpg", artist_name: "jooorish", width: "510px", height: "330px" },
        { src: "/products/portfolio/profile_biz/profile_biz_02.jpg", artist_name: "jooorish", width: "250px", height: "330px" },
        { src: "/products/portfolio/profile_biz/profile_biz_03.jpg", artist_name: "오디니크", width: "250px", height: "330px" },
        { src: "/products/portfolio/profile_biz/profile_biz_04.jpg", artist_name: "jooorish", width: "250px", height: "330px" },
        { src: "/products/portfolio/profile_biz/profile_biz_05.jpg", artist_name: "프린세스메이커", width: "250px", height: "330px" },
        { src: "/products/portfolio/profile_biz/profile_biz_06.jpg", artist_name: "임경빈", width: "510px", height: "330px" }
    ],
    INTERIOR: [
        { src: "/products/portfolio/interior/interior_01.jpg", artist_name: "이성우", width: "336px", height: "189px" },
        { src: "/products/portfolio/interior/interior_02.jpg", artist_name: "이원은", width: "336px", height: "189px" },
        { src: "/products/portfolio/interior/interior_03.jpg", artist_name: "박수진", width: "336px", height: "189px" },
        { src: "/products/portfolio/interior/interior_04.jpg", artist_name: "크리에이티브그룹", width: "336px", height: "189px" },
        { src: "/products/portfolio/interior/interior_05.jpg", artist_name: "이성우", width: "336px", height: "189px" },
        { src: "/products/portfolio/interior/interior_06.jpg", artist_name: "오디니크", width: "336px", height: "189px" }
    ],
    EVENT: [
        { src: "/products/portfolio/event/event_01.jpg", artist_name: "김대영", width: "336px", height: "189px" },
        { src: "/products/portfolio/event/event_02.jpg", artist_name: "원종인", width: "336px", height: "189px" },
        { src: "/products/portfolio/event/event_03.jpg", artist_name: "capa", width: "336px", height: "189px" },
        { src: "/products/portfolio/event/event_04.jpg", artist_name: "원종인", width: "336px", height: "189px" },
        { src: "/products/portfolio/event/event_05.jpg", artist_name: "박수진", width: "336px", height: "189px" },
        { src: "/products/portfolio/event/event_06.jpg", artist_name: "이선호", width: "336px", height: "189px" }
    ],
    FASHION: [
        { src: "/products/portfolio/fashion/fashion_01.jpg", artist_name: "beck", width: "198px", height: "198px", color: "#000" },
        { src: "/products/portfolio/fashion/fashion_02.jpg", artist_name: "김진우", width: "198px", height: "198px", color: "#000" },
        { src: "/products/portfolio/fashion/fashion_03.jpg", artist_name: "송현주", width: "198px", height: "198px" },
        { src: "/products/portfolio/fashion/fashion_04.jpg", artist_name: "멜로우모먼트", width: "198px", height: "198px", color: "#000" },
        { src: "/products/portfolio/fashion/fashion_05.jpg", artist_name: "이문창", width: "198px", height: "198px" },
        { src: "/products/portfolio/fashion/fashion_06.jpg", artist_name: "박수진", width: "198px", height: "198px", color: "#000" },
        { src: "/products/portfolio/fashion/fashion_07.jpg", artist_name: "오디니크", width: "198px", height: "198px", color: "#000" },
        { src: "/products/portfolio/fashion/fashion_08.jpg", artist_name: "joooorish", width: "198px", height: "198px" },
        { src: "/products/portfolio/fashion/fashion_09.jpg", artist_name: "박수진", width: "198px", height: "198px", color: "#000" },
        { src: "/products/portfolio/fashion/fashion_10.jpg", artist_name: "멜로우모먼트", width: "198px", height: "198px" }
    ],
    VIDEO_BIZ: [
        { src: "https://i.vimeocdn.com/video/729099453_336x189.jpg", artist_name: "킬클", width: "336px", height: "189px", video_url: "https://player.vimeo.com/video/292650435?title=0&color=ffffff&byline=0&portrait=0&autopause=1", color: "#000" },
        { src: "https://i.vimeocdn.com/video/771441364_336x189.jpg", artist_name: "킬클", width: "336px", height: "189px", video_url: "https://player.vimeo.com/video/327227883?title=0&color=ffffff&byline=0&portrait=0&autopause=1" },
        { src: "https://i.vimeocdn.com/video/739644372_336x189.jpg", artist_name: "김무건", width: "336px", height: "189px", video_url: "https://player.vimeo.com/video/301147044?title=0&color=ffffff&byline=0&portrait=0&autopause=1" },
        { src: "https://img.youtube.com/vi/GQ9TeUx4fPs/0.jpg", artist_name: "IL포토", width: "336px", height: "189px", video_url: "https://www.youtube.com/embed/GQ9TeUx4fPs?enablejsapi=1&modestbranding=1&rel=0" },
        { src: "https://i.vimeocdn.com/video/772294368_336x189.jpg", artist_name: "킬클", width: "336px", height: "189px", video_url: "https://player.vimeo.com/video/327896813?title=0&color=ffffff&byline=0&portrait=0&autopause=1" },
        { src: "https://img.youtube.com/vi/RzkGLkbA3Nk/0.jpg", artist_name: "정민희", width: "336px", height: "189px", video_url: "https://www.youtube.com/embed/RzkGLkbA3Nk?enablejsapi=1&modestbranding=1&rel=0", color: "#000" }
    ]
};

export const CATEGORY_CODE = {
    PRODUCT: "PRODUCT",
    BEAUTY: "BEAUTY",
    FASHION: "FASHION",
    FOOD: "FOOD",
    WEDDING: "WEDDING",
    BABY: "BABY",
    SNAP: "SNAP",
    PROFILE_BIZ: "PROFILE_BIZ",
    PROFILE: "PROFILE",
    INTERIOR: "INTERIOR",
    EVENT: "EVENT",
    DRESS_RENT: "DRESS_RENT",
    VIDEO_BIZ: "VIDEO_BIZ",
    VIDEO: "VIDEO"
};

export const CATEGORY = {
    [CATEGORY_CODE.PRODUCT]: { name: "제품" },
    [CATEGORY_CODE.BEAUTY]: { name: "코스메틱" },
    [CATEGORY_CODE.FASHION]: { name: "패션" },
    [CATEGORY_CODE.FOOD]: { name: "음식" },
    [CATEGORY_CODE.PROFILE_BIZ]: { name: "기업프로필" },
    [CATEGORY_CODE.INTERIOR]: { name: "인테리어" },
    [CATEGORY_CODE.EVENT]: { name: "행사" },
    [CATEGORY_CODE.VIDEO_BIZ]: { name: "기업영상" },
    [CATEGORY_CODE.WEDDING]: { name: "웨딩" },
    [CATEGORY_CODE.BABY]: { name: "베이비" },
    [CATEGORY_CODE.PROFILE]: { name: "개인프로필" },
    [CATEGORY_CODE.SNAP]: { name: "스냅" },
    [CATEGORY_CODE.DRESS_RENT]: { name: "의상대여" },
    [CATEGORY_CODE.VIDEO]: { name: "영상" }
};

export const CATEGORY_LIST = Object.keys(CATEGORY).map(o => Object.assign({ code: o }, CATEGORY[o]));

export const BIZ_CATEGORY = [
    CATEGORY_CODE.PRODUCT,
    CATEGORY_CODE.BEAUTY,
    CATEGORY_CODE.FASHION,
    CATEGORY_CODE.FOOD,
    CATEGORY_CODE.PROFILE_BIZ,
    CATEGORY_CODE.INTERIOR,
    CATEGORY_CODE.EVENT,
    CATEGORY_CODE.VIDEO_BIZ
    // CATEGORY_CODE.MODEL
];

export const PERSONAL_CATEGORY = [
    CATEGORY_CODE.WEDDING,
    CATEGORY_CODE.BABY,
    CATEGORY_CODE.PROFILE,
    CATEGORY_CODE.SNAP,
    CATEGORY_CODE.DRESS_RENT,
    CATEGORY_CODE.VIDEO
];

export const CONCEPT_LIST = {
    [CATEGORY_CODE.BEAUTY]: {
        title: "코스메틱 촬영",
        description: "포스냅 작가님들의 포트폴리오 중 선택하신 컨셉과 일치하는 이미지를 확인하실 수 있습니다.",
        text_depth2: {
            "제형": "제형을 강조한 컨셉",
            "패키지": "여러제품이 어우러지게 연출한 컨셉",
            "단품": "단품을 강조한 컨셉",
            "곡선": "곡선의 부드러움을 살린 컨셉",
            "대각선": "대각선 구도가 두드러지는 컨셉",
            "사각형": "사각형을 이용하여 제품을 강조하는 컨셉",
            "패턴": "규칙적인 구도로 패턴 느낌을 살리는 컨셉",
            "소품": "소품을 활용하여 제품을 표현하는 컨셉",
            "그림자": "그림자를 이용하여 제품을 연출한 컨셉",
            "대비": "질감, 색감 등의 대비를 이용한 컨셉",
            "내추럴": "자연광을 활용하여 내추럴한 느낌을 살리는 컨셉",
            "합성": "촬영 후 합성을 통하여 제품을 강조하는 컨셉"
        },
        recommend: {
            lipstick: { title: "립스틱 촬영 추천컨셉", depth2: ["제형", "패턴", "그림자"] },
            lotion: { title: "로션 촬영 추천컨셉", depth2: ["패키지", "대각선", "내추럴"] },
            maskpack: { title: "마스크팩 촬영 추천컨셉", depth2: ["단품", "사격형", "소품"] }
        }
    }
};
