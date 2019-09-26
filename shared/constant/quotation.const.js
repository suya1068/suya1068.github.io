export const COMI_PER = 0.2;

export const CATEGORY_KEYS = {
    PRODUCT: "PRODUCT",
    FOOD: "FOOD",
    AD: "AD",
    PROFILE: "PROFILE",
    EVENT: "EVENT",
    INTERIOR: "INTERIOR",
    WEDDING: "WEDDING",
    BABY: "BABY",
    SNAP: "SNAP",
    VIDEO: "VIDEO",
    VIDEO_BIZ: "VIDEO_BIZ",
    PROFILE_BIZ: "PROFILE_BIZ",
    FASHION: "FASHION"
};

export const CATEGORY_CAPTIONS = {
    PRODUCT: "홈페이지에서 사용할 가방 5개의 모델장착사진 및 누끼사진을 찍으려고합니다. 5개의 누끼사진 / 모델장착컷 5컷정도 / 모델과 헤어메이크업은 섭외한 상태입니다.",
    FOOD: "메뉴판 및 홈페이지에 사용할 사진촬영을 원합니다. 메뉴는 11가지이고 각 메뉴별 누끼컷 및 연출컷(제품당 2~3컷)을 찍고싶습니다.",
    AD: "서클콘텍트렌즈 / 모델착용사진(2컨셉) 8가지 * 4컷(상반신사진 촬영, 눈 확대컷은 상반신 사진을 활용)=32컷 / 흰배경에서 촬영 예정 / 웹+인쇄물 모두 사용 / 외국인모델섭외 및 헤어 메이크업 필요합니다.",
    PROFILE: "직원 프로필 사진으로 인원:10명 /1명당 2컷필요합니다. 병원에서 촬영예정이며 해어 메이크업은 개별 준비할 예정입니다.",
    EVENT: "8월 5일 오전 9시~ 오후3시 압구정동 회사 창립기념일 행사 촬영으로 약 30명정도 되며 행사시작전 포토존 촬영 및 행사 전반적인 촬영을 원합니다.",
    INTERIOR: "압구정동에 있는 회사입니다. 전경사진 1컷과 내부사진 (회의실, 휴게실 등) 10컷 정도면 될것 같습니다. 홈페이지와 인쇄물 모두 사용 예정입니다.",
    WEDDING: "8월 5일 11시 강남 본식촬영 요청입니다. 신부대기실에서부터 폐백까지 촬영 원하며 앨범과 액자제작까지 진행예정입니다.",
    BABY: "8월 5일 11시 강남 돌스냅 촬영 원합니다. 시작전 자연스러운 화보 촬영과 가족사진 포함되었으면 좋겠습니다. 앨범이랑 액자제작도 필요합니다.",
    SNAP: "친구의 결혼을 기념해 총 5명이 촬영을 하려고합니다. 헤어 메이크업 의상은 각자 준비할 예정이고 적당한 스튜디오 추천이 필요합니다.  촬영 후 탁상용 액자 제작도 하려고 합니다.",
    VIDEO: "음식점 오픈 이벤트로 추첨행사를 공신력 있게 온라인 sns채널에 라이브 중계형태로 내보내려고 합니다. 일정은 이번주 주말이며 추후 바이럴용으로 30초 정도 편집도 진행해주셨으면 합니다.",
    PROFILE_BIZ: "직원 프로필 사진으로 인원:10명 /1명당 2컷필요합니다. 병원에서 촬영예정이며 해어 메이크업은 개별 준비할 예정입니다.",
    FASHION: "홈페이지에서 사용할 가방 5개의 모델장착사진 및 누끼사진을 찍으려고합니다. 5개의 누끼사진 / 모델장착컷 5컷정도 / 모델과 헤어메이크업은 섭외한 상태입니다."
};

export const QUOTATION_STEP_HEADER = {
    CATEGORY: "촬영을 위한<br />기본정보를 입력하세요."
};

export const STATUS = {
    RETURN: { key: "RETURN", order: 0 },        // 검수반려
    BASIC: { key: "BASIC", order: 1 },          // 기본정보
    CATEGORY: { key: "CATEGORY", order: 2 },    // 카테고리
    QUANTITY: { key: "QUANTITY", order: 3 },    // 수량
    OPTION: { key: "OPTION", order: 4 },        // 가격
    CONTENT: { key: "CONTENT", order: 5 },      // 내용
    REQUEST: { key: "REQUEST", order: 6 },      // 검수요청
    PROGRESS: { key: "PROGRESS", order: 7 },    // 검수완료 견적받는중
    COMPLETE: { key: "COMPLETE", order: 8 }     // 완료
};

export const SUB_CATEGORY = {
    [CATEGORY_KEYS.PRODUCT]: [
        { title: "인쇄용", code: "print", value: "인쇄용" },
        { title: "홈페이지", code: "homepage", value: "홈페이지" },
        { title: "기타(직접입력)", code: "etc", value: "" }
    ],
    [CATEGORY_KEYS.FOOD]: [
        { title: "메뉴판", code: "menu", value: "메뉴판" },
        { title: "홈페이지", code: "homepage", value: "홈페이지" },
        { title: "현수막", code: "banner", value: "현수막" },
        { title: "기타(직접입력)", code: "etc", value: "" }
    ],
    [CATEGORY_KEYS.AD]: [
        { title: "인쇄용", code: "print", value: "인쇄용" },
        { title: "홈페이지", code: "homepage", value: "홈페이지" },
        { title: "SNS업로드용", code: "social", value: "SNS업로드용" },
        { title: "매체용", code: "media", value: "매체용" },
        { title: "기타(직접입력)", code: "etc", value: "" }
    ],
    [CATEGORY_KEYS.EVENT]: [
        { title: "인쇄용", code: "print", value: "인쇄용" },
        { title: "홈페이지", code: "homepage", value: "홈페이지" },
        { title: "기타(직접입력)", code: "etc", value: "" }
    ],
    [CATEGORY_KEYS.PROFILE]: [
        { title: "인쇄용", code: "print", value: "인쇄용" },
        { title: "홈페이지", code: "homepage", value: "홈페이지" },
        { title: "기타(직접입력)", code: "etc", value: "" }
    ],
    [CATEGORY_KEYS.INTERIOR]: [
        { title: "인쇄용", code: "print", value: "인쇄용" },
        { title: "홈페이지", code: "homepage", value: "홈페이지" },
        { title: "기타(직접입력)", code: "etc", value: "" }
    ]
};

export const RESERVE_SELECT_LIST = {
    DATE_LIST: [
        { title: "가능한 빨리", value: "1" },
        { title: "한 달 이내", value: "2" },
        { title: "이번달", value: "3" },
        { title: "이번주내", value: "4" }
    ],
    TIME_LIST: [
        { title: "오전", value: "1" },
        { title: "오후", value: "2" },
        { title: "반나절", value: "3" },
        { title: "종일", value: "4" },
        { title: "1시간", value: "5" },
        { title: "2시간", value: "6" }
    ]
};

export const ADDRESS_LIST = [
    { title: "상관없음" },
    { title: "서울", full: "서울특별시" },
    { title: "부산", full: "부산광역시" },
    { title: "대구", full: "대구광역시" },
    { title: "인천", full: "인천광역시" },
    { title: "광주", full: "광주광역시" },
    { title: "대전", full: "대전광역시" },
    { title: "울산", full: "울산광역시" },
    { title: "세종", full: "세종특별자치시" },
    { title: "강원", full: "강원도" },
    { title: "경기", full: "경기도" },
    { title: "경남", full: "경상남도" },
    { title: "경북", full: "경상북도" },
    { title: "전남", full: "전라남도" },
    { title: "전북", full: "전라북도" },
    { title: "제주", full: "제주특별자치도" },
    { title: "충남", full: "충청남도" },
    { title: "충북", full: "충청북도" },
    { title: "해외", full: "해외" }
];

