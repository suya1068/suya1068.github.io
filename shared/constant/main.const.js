const version = "20181127_1317";
const CATEGORY_BASE_URL_P = "/main/category/20180608/";
const CATEGORY_BASE_URL_M = "/mobile/main/category/20180608/";
const PERSONAL_REVIEW_IMG = "/main/review/personal/20180919/";
const BIZ_REVIEW_IMG = "/main/review/biz/";

export const PERSONAL_CATEGORY = [
    { code: "WEDDING", name: "웨딩촬영", tag: ["웨딩스냅", "본식", "셀프웨딩"], bg: `main/top_visual/category/wedding.jpg?v=${version}`, artist_name: "김승수" },
    { code: "BABY", name: "베이비", tag: ["홈스냅", "돌잔치", "성장앨범"], bg: `main/top_visual/category/baby.jpg?v=${version}`, artist_name: "심보건" },
    { code: "PROFILE", name: "개인프로필", tag: ["컨셉", "이력서", "오디션"], bg: `main/top_visual/category/profile.jpg?v=${version}`, artist_name: "이현호" },
    { code: "SNAP", name: "스냅", tag: ["개인화보", "커플", "우정", "가족사진"], bg: `main/top_visual/category/snap.jpg?v=${version}`, artist_name: "프린세스메이커" },
    { code: "VIDEO", name: "개인영상", tag: ["웨딩본식", "식전영상", "돌영상"], bg: `main/top_visual/category/video.jpg?v=${version}`, artist_name: "" }
];

export const CATEGORYS = [
    { code: "WEDDING", name: "웨딩" },
    { code: "BABY", name: "베이비" },
    { code: "PROFILE", name: "개인프로필" },
    { code: "SNAP", name: "스냅" },
    // { code: "VIDEO", name: "개인영상" },
    // 이 밑으로 기업 카테고리
    { code: "PROFILE_BIZ", name: "기업프로필" },
    { code: "EVENT", name: "행사" },
    { code: "INTERIOR", name: "인테리어" },
    { code: "BEAUTY", name: "코스메틱" },
    { code: "FOOD", name: "음식" },
    { code: "PRODUCT", name: "제품" },
    { code: "FASHION", name: "패션" },
    { code: "VIDEO_BIZ", name: "기업영상" },
    { code: "DRESS_RENT", name: "의상대여" }
];

export const PERSONAL_MAIN = {
    CATEGORY: [
        { pre: true, artist: "코코", code: "WEDDING", m_icon: "category_wedding", name: "웨딩", tags: "웨딩스냅 / 본식 / 셀프웨딩", src_p: `${CATEGORY_BASE_URL_P}wedding.jpg?v=${version}`, src_m: `${CATEGORY_BASE_URL_M}wedding.jpg?v=${version}` },
        { pre: false, artist: "심보건", code: "BABY", m_icon: "category_baby", name: "베이비", tags: "홈스냅 / 돌잔치 / 성장앨범", src_p: `${CATEGORY_BASE_URL_P}baby.jpg?v=${version}`, src_m: `${CATEGORY_BASE_URL_M}baby.jpg?v=${version}` },
        { pre: false, artist: "joooorish", code: "PROFILE", m_icon: "category_profile", name: "개인프로필", tags: "컨셉 / 이력서 / 오디션", src_p: `${CATEGORY_BASE_URL_P}p_profile.jpg?v=${version}`, src_m: `${CATEGORY_BASE_URL_M}p_profile.jpg?v=${version}` },
        { pre: false, artist: "프린세스메이커", code: "SNAP", m_icon: "category_snap", name: "스냅", tags: "개인화보 / 커플 / 우정스냅", src_p: `${CATEGORY_BASE_URL_P}snap.jpg?v=${version}`, src_m: `${CATEGORY_BASE_URL_M}snap.jpg?v=${version}` },
        { pre: false, artist: "", code: "DRESS_RENT", m_icon: "category_dress_rent", name: "의상대여", tags: "", src_p: "", src_m: "" },
        { pre: false, artist: "", code: "VIDEO", m_icon: "category_video", name: "개인영상", tags: "웨딩본식 / 식전영상 / 돌영상", src_p: `${CATEGORY_BASE_URL_P}video.jpg?v=${version}`, src_m: `${CATEGORY_BASE_URL_M}video.jpg?v=${version}` },
        // 이 밑으로 기업 카테고리
        // { pre: false, artist: "TM실장", code: "PROFILE_BIZ", m_icon: "category_profile_biz", name: "기업프로필", tags: "임직원 / 사원프로필 / CEO", src_p: `${CATEGORY_BASE_URL_P}b_profile.jpg?v=${version}`, src_m: `${CATEGORY_BASE_URL_M}b_profile.jpg?v=${version}` },
        // { pre: false, artist: "이세현", code: "EVENT", m_icon: "category_event", name: "행사", tags: "세미나 / 연회장 / 공연", src_p: `${CATEGORY_BASE_URL_P}event.jpg?v=${version}`, src_m: `${CATEGORY_BASE_URL_M}event.jpg?v=${version}` },
        // { pre: false, artist: "이수강", code: "INTERIOR", m_icon: "category_interior", name: "인테리어", tags: "팬션 / 매장 / 건물", src_p: `${CATEGORY_BASE_URL_P}interior.jpg?v=${version}`, src_m: `${CATEGORY_BASE_URL_M}interior.jpg?v=${version}` },
        // { pre: false, code: "AD", name: "광고", tags: "관공서 / 뷰티 / 패션", src_p: `/main/category/20180608/advertising.jpg?v=${version}` },
        // { pre: false, artist: "panphoto", code: "FOOD", m_icon: "category_food", name: "음식", tags: "메뉴판 / 식품 / 레스토랑", src_p: `${CATEGORY_BASE_URL_P}food.jpg?v=${version}`, src_m: `${CATEGORY_BASE_URL_M}food.jpg?v=${version}` },
        // { pre: false, artist: "BECK", code: "PRODUCT", m_icon: "category_product", name: "제품", tags: "연출사진 / 광고 / 쇼핑몰\n룩북 / 패션", src_p: `${CATEGORY_BASE_URL_P}product.jpg?v=${version}`, src_m: `${CATEGORY_BASE_URL_M}product.jpg?v=${version}` },
        // { pre: false, artist: "joooorish", code: "FASHION", m_icon: "category_fashion", name: "패션", tags: "쇼핑몰촬영 / 룩북촬영 / 화보촬영", src_p: `${CATEGORY_BASE_URL_P}fasion.jpg?v=${version}`, src_m: `${CATEGORY_BASE_URL_M}fasion.jpg?v=${version}` },
        // { pre: false, artist: "", code: "VIDEO_BIZ", m_icon: "category_ad", name: "기업영상", tags: "광고PR / 행사이벤트 / 기타", src_p: `${CATEGORY_BASE_URL_P}video.jpg?v=${version}`, src_m: `${CATEGORY_BASE_URL_M}video.jpg?v=${version}` },
        // { pre: false, artist: "", code: "DRESS_RENT", m_icon: "category_dress_rent", name: "의상대여", tags: "", src_p: "", src_m: "" }
    ],
    WIDE_SCREEN: {
        TITLE: "포스냅은 언제 어디서든 모든 촬영이 가능합니다.",
        LIST: [
            { KEY: "WEDDING", name: "웨딩촬영", TAGS: "웨딩스냅,본식,셀프웨딩" },
            { KEY: "BABY", name: "베이비", TAGS: "홈스냅,돌잔치,성장앨범" },
            { KEY: "PROFILE", name: "개인프로필", TAGS: "컨셉,이력서,오디션" },
            { KEY: "SNAP", name: "스냅", TAGS: "개인화보,커플,우정,가족사진" }
        ]
    },
    REVIEW: [
        {
            pno: "/@프린세스메이커",
            thumb: `${PERSONAL_REVIEW_IMG}review_01.jpg`,
            label: "작가소개페이지_프린세스메이커",
            title: "",
            nick_name: "프린세스메이커",
            description: "개인매장 오픈겸 매장 배경으로\n" +
            "남자친구랑 같이 촬영을 했는데요\n" +
            "작가님이 잘 리드해줘서 너무 자연스러웠고\n" +
            "멋있고 이쁘게 사진이 나와서 너무 만족한답니다!\n" +
            "나중에 또 작가님이랑 야경배경으로 촬영하고 싶어요\n" +
            "최고최고ㅎㅎ",
            user_name: "윤하"
        },
        {
            pno: "/@김정훈",
            thumb: `${PERSONAL_REVIEW_IMG}review_02.jpg`,
            label: "작가소개페이지_김정훈",
            title: "",
            nick_name: "김정훈",
            description: "일반 여행으로는 갈수 없는 지역까지 이동해서\n" +
            "멋지고 이쁜 배경과 추억 남겨주셔서 감사합니다.\n" +
            "좋은 추억 남기고 갑니다~",
            user_name: "주니"
        },
        {
            pno: "/products/623",
            thumb: `${PERSONAL_REVIEW_IMG}review_03.jpg`,
            label: "SNAP_김석주_623",
            title: "",
            nick_name: "김석주",
            description: "여러분 제발 갓코그래퍼 하세요~~ 진짜 당장 예약하세요 ㅡㅡㅋ\n" +
            "사진 처음 찍는데도 너무너무 잘 이끌어주셔서 예쁜 사진 너무 많이 생겼어요 ㅠㅠ\n" +
            "특히 포즈알못인 저랑 제 친구들 알려주신다고 손수 포즈같은거 잡아주시고,\n" +
            "작가님 성격도 너무너무 재밌고 좋으셔서 촬영 내내 웃음이 끊이질 않았습니당ㅎㅎ\n" +
            "사진만 건진게 아니라 친구들이랑 좋은 추억 하나 더 만들어가는 시간이었습니다^_^\n" +
            "친구들이랑 집에 와서도 그날 하루를 얘기하고 또 얘기했어요~\n" +
            "진짜 할일이니 하시는게 아니라 저희 맘에드는 사진 하나라도 더 잘 찍어주시려고 하시는 모습에 감동받아서 울뻔했어요...\n" +
            "포즈 제안도 잘해주시고, 긴장하는 저희 긴장 풀어주는것도 프로급이십니다 ㅋㅋ 어떻게 이장소에서 이런사진이?\n" +
            "할 정도로 실력도 좋으시구요. 원본사진 받으면 인상 찌푸리지 말라고 말씀 하셨는데 그러긴 커녕 예쁜게 너무 많아서\n" +
            "고르기 힘들었어요 정말루~!~! 실물 이상의 원본 말이 됩니까? 보정은 뭐 말할것두 없구요~~!~!\n" +
            "실력에 유머에 친절함까지 삼박자 다같추신 분입니다. 무조건 저는 다음 사진도 코코작가님입니다ㅎㅎ\n" +
            "정말 후회 없으실거에요!!! 찍고나시면 이 돈 정말 아깝지 않구나 생각하실 겁니다^3^\n" +
            "고민되시는 분들 작가님 인스터도 한번씩 구경해보세요!\n" +
            "최선 다해주신 작가님 정말 너무 감사드립니닿ㅎ조만간 꼭 또뵈어요~",
            user_name: "코코"
        },
        {
            pno: "/@김나희",
            thumb: `${PERSONAL_REVIEW_IMG}review_04.jpg`,
            label: "작가소개페이지_김나희",
            title: "",
            nick_name: "김나희",
            description: "결혼 9주년 기념으로 제주도 여행중에 작가님 만나서 스냅 촬영 할수 있어서 너무 감사드려요~♡♡♡\n" +
            "애가 셋이라 진짜 정신 하나도 없었는데 하나하나 세심하게 배려해주시고 챙겨 주셔서 작가님께 너무 감사드립니다.\n" +
            "사진 한컷한컷 버릴께 없이 너무 아름답고 이쁘게 나왔어오!!",
            user_name: "차선영"
        },
        {
            pno: "/products/967",
            thumb: `${PERSONAL_REVIEW_IMG}review_05.jpg`,
            label: "PROFILE_김진우_967",
            title: "",
            nick_name: "김진우",
            description: "작가님이 최선을 다해 찍어주셔서 좋았습니다.",
            user_name: "이지민"
        },
        {
            pno: "/products/803",
            thumb: `${PERSONAL_REVIEW_IMG}review_06.jpg`,
            label: "SNAP_프린세스메이커_803",
            title: "",
            nick_name: "프린세스메이커",
            description: "수줍음 많고 여러모로 미흡한 커플이었는데 곁에서 진심으로 응원해주시고\n" +
            "격려해주시는 작가님 덕분에 행복한 촬영이 될 수 있었습니다. \n" +
            "촬영 분위기, 연출 능력, 친절, 무료 서비스, 퀄리티, 보정 만족도, 소통, 소품 대여 등 모두 매우 만족합니다.\n" +
            "특히 유료드레스가 이뻐서 한 벌 대여했는데, 이쁘게 찍으라고 추가로 한 벌을 더 빌려주셨네요^^\n" +
            "보정도 정말 신경써서 해주시구요. \n" +
            "커플 사진 또는 여자친구를 공주로 만들어주고 싶은 분들께 적극 추천합니다!",
            user_name: "Daniel박민규"
        },
        {
            pno: "/@쿠잉",
            thumb: `${PERSONAL_REVIEW_IMG}review_07.jpg`,
            label: "작가소개페이지_쿠잉",
            title: "",
            nick_name: "쿠잉",
            description: "처음부터 끝까지 너무 친절하게 해주셔서 감사합니다!\n" +
            "3월초에 촬영을 잡아서 나무와 풀이 다 죽어있었는데 알록달록한 배경이 많은\n" +
            "용마랜드로 추천해주셔서 너무 맘에 들게 나왔습니다.\n" +
            "촬영중에 친절하게 재밌게 해주셔서 어색한 저희도 금방 풀려서 편하게 했고요.\n" +
            "저희가 원하는샷 그리고 작가님의 추천샷 섞어가면서 했습니다.\n" +
            "배경도 다양하게 한 7-8개 정도 했었던거 같습니다 (옷 두벌).",
            user_name: "배수정"
        },
        {
            pno: "/products/1161",
            thumb: `${PERSONAL_REVIEW_IMG}review_08.jpg`,
            label: "SNAP_김나희_1161",
            title: "",
            nick_name: "김나희",
            description: "갑자기 비가 오고 날이 추웠는데 작가님 정말 친절하시고\n" +
            "사진도 예쁘게 잘 찍어주셨습니다!!\n" +
            "사진도 만족스러워요~",
            user_name: "이선아"
        },
        {
            pno: "/products/623",
            thumb: `${PERSONAL_REVIEW_IMG}review_09.jpg`,
            label: "SNAP_코코_623",
            title: "",
            nick_name: "코코",
            description: "프로필 사진을 찍겠다고 마음먹은 뒤 여러 작가님들의 포트폴리오를 보며 많은 고민을 했었습니다.\n" +
            "오래 고민하고 선택한 곳인데 결과적으로 마음에 쏙 드는 사진을 얻게 되었어요\n" +
            "상담, 촬영, 보정 등 처음부터 끝까지 친절하고 재미있게 진행해 주십니다ㅎㅎ \n" +
            "사실 사진 찍을 때 어색하다는 얘기를 자주 듣는 편이라 걱정했는데 작가님께서 자세부터 표정까지\n" +
            "엄청 섬세하게 알려주셔서 예쁜 사진을 얻었어요!!\n" +
            "뻣뻣한 저를 위해 몸소 보여주시는 다양한 포즈들이 감명 깊었습니당ㅋㅋㅋㅋ\n" +
            "저도 몰랐던 제 분위기를 사진에 담아 주는 분이세요.\n" +
            "한 장 한 장 신경 써서 찍으셔서 그런지 원본도 충분히 멋져요:) 보정본도 짱짱!!\n" +
            "추운 겨울날에 따뜻한 추억 남겨주셔서 다시 한 번 감사해요~ 내년에도 꼭 함께 촬영해요~!!",
            user_name: "최혜영"
        }
    ],
    ESTIMATE_DESCRIPTION: {
        TITLE: "언제 어디서나 쉽고 빠른 무료 견적을 요청해보세요.",
        CAPTION: "간단한 질문에 대한 대답을 선택해주시면, 해당 분야 전문 작가님들이 촬영에 대한 의견과 자세한 견적서를 발송합니다.\n" +
        "작가님과의 협의를 통해 의견을 조율하여 나만의 다양하고 개성있는 촬영을 만들어나갈 수 있습니다."
    },
    ESTIMATE_STEP: [
        { no: 1, title: "무료견적 요청서 작성", description: "촬영에 대해 간단한 질문으로 3분이면 작성 끝!", icon: "document", src: "" },
        { no: 2, title: "작가님들의 견적서 접수", description: "보통 하루가 지나기 전에 5개의 견적서가 도착합니다.", icon: "document_check", src: "" },
        { no: 3, title: "견적서 선택 및 촬영", description: "작가님과 대화를 하며 최고의 촬영을 진행해 보세요.", icon: "person_check", src: "" },
        { no: 4, title: "무료견적요청", description: "언제 어디서나 쉽고 빠른 무료 견적을 요청해 보세요.", src: "" }
    ]
};


export const BUSINESS_CATEGORY = [
    { code: "PRODUCT", name: "제품" },
    { code: "BEAUTY", name: "코스메틱" },
    { code: "FASHION", name: "패션" },
    { code: "FOOD", name: "음식" },
    { code: "PROFILE_BIZ", name: "기업프로필" },
    { code: "INTERIOR", name: "인테리어" },
    { code: "EVENT", name: "행사" },
    { code: "VIDEO_BIZ", name: "기업영상" }
];

const BIZ_CATEGORY_BASE_URL_P = "/biz/category/20180608/";
const BIZ_CATEGORY_BASE_URL_M = "/mobile/main/biz/category/20180608/";
const BIZ_CATEGORY_RENEW = "/biz/category/20181120";
const BIZ_INFOR = "/biz/information";
const RENEW_BIZ_REVIEW_IMG = "/main/review/biz/20181120/";

export const BUSINESS_MAIN = {
    SECOND_CONSULT_DATA: {
        TITLE: "투명하고 합리적인 촬영 견적",
        DESC: "3초만에 확인해보세요"
    },
    SECOND_CONSULT_DATA_2: {
        TITLE: "",
        DESC: "포트폴리오 먼저 빠르게 확인해보세요!"
    },
    ESTIMATE_PF: [
        { no: 1, src: "/biz/estimate/20190208/estimate_pf_2x_01.png", artist: "최민정", color: "#fff" },
        { no: 2, src: "/biz/estimate/20190208/estimate_pf_2x_02.png", artist: "panphoto", color: "#fff" },
        { no: 3, src: "/biz/estimate/20190208/estimate_pf_2x_03.png", artist: "유림", color: "#fff" },
        { no: 4, src: "/biz/estimate/20190208/estimate_pf_2x_04.png", artist: "박수진", color: "#fff" },
        { no: 5, src: "/biz/estimate/20190208/estimate_pf_2x_05.png", artist: "panphoto", color: "#fff" },
        { no: 6, src: "/biz/estimate/20190208/estimate_pf_2x_06.png", artist: "최민정", color: "#fff" },
        { no: 7, src: "/biz/estimate/20190208/estimate_pf_2x_07.png", artist: "최민정", color: "#000" },
        { no: 8, src: "/biz/estimate/20190208/estimate_pf_2x_08.png", artist: "최민정", color: "#fff" },
        { no: 9, src: "/biz/estimate/20190208/estimate_pf_2x_09.png", artist: "크리에이티브그룹", color: "#000" },
        { no: 10, src: "/biz/estimate/20190208/estimate_pf_2x_10.png", artist: "박수진", color: "#000" }
    ],
    RENEW_CATEGORY: [
        { code: "PRODUCT", artist: "유림", name: "제품", tags: "광고,쇼핑몰,연출사진,누끼,뷰티용품", src: `${BIZ_CATEGORY_RENEW}/product.png` },
        { code: "FOOD", artist: "이호철", name: "음식", tags: "메뉴판,식품,레스토랑,누끼,카페,한식", src: `${BIZ_CATEGORY_RENEW}/food.png` },
        { code: "PROFILE_BIZ", artist: "joooorish", name: "기업프로필", tags: "임직원,사원프로필,CEO", src: `${BIZ_CATEGORY_RENEW}/profile_biz.png` },
        { code: "INTERIOR", artist: "박수진", name: "인테리어", tags: "패션,매장,건물,홍보,실내촬영", src: `${BIZ_CATEGORY_RENEW}/interior.png` },
        { code: "EVENT", artist: "이세현", name: "행사", tags: "세미나,연회장,공연,기업연수,콘서트,파티", src: `${BIZ_CATEGORY_RENEW}/event.png` },
        { code: "FASHION", artist: "BECK", name: "패션", tags: "룩북,쇼핑몰촬영,화보촬영,의류촬영,카달로그", src: `${BIZ_CATEGORY_RENEW}/fashion.png` },
        { code: "VIDEO_BIZ", artist: "", name: "기업영상", tags: "바이럴,SNS,행사촬영,제품소개", src: `${BIZ_CATEGORY_RENEW}/video.png` }
    ],
    CATEGORY: [
        {
            display_order: "4",
            code: "PRODUCT",
            artist: "박수진",
            m_icon: "category_product",
            name: "제품",
            tags: "연출사진 / 광고 / 쇼핑몰 / 룩북 / 패션",
            src_p: `${BIZ_CATEGORY_BASE_URL_P}product.jpg?v=${version}`,
            src_m: `${BIZ_CATEGORY_BASE_URL_M}product.jpg?v=${version}`
        },
        {
            display_order: "3",
            code: "BEAUTY",
            artist: "박수진",
            m_icon: "category_profile",
            name: "코스메틱",
            tags: "화장품 / 코스메틱 / 바이럴",
            src_p: `${BIZ_CATEGORY_BASE_URL_P}beauty.jpg?v=${version}`,
            src_m: `${BIZ_CATEGORY_BASE_URL_M}beauty.png?v=${version}`
        },
        {
            display_order: "1",
            code: "FASHION",
            artist: "joooorish",
            m_icon: "category_fashion",
            name: "패션",
            tags: "쇼핑몰촬영 / 룩북촬영 / 화보촬영",
            src_p: `${BIZ_CATEGORY_BASE_URL_P}fasion.jpg?v=${version}`,
            src_m: `${BIZ_CATEGORY_BASE_URL_M}fasion.jpg?v=${version}`
        },
        {
            display_order: "2",
            code: "FOOD",
            artist: "panphoto",
            m_icon: "category_food",
            name: "음식",
            tags: "메뉴판 / 식품 / 레스토랑",
            src_p: `${BIZ_CATEGORY_BASE_URL_P}food.jpg?v=${version}`,
            src_m: `${BIZ_CATEGORY_BASE_URL_M}food.jpg?v=${version}`
        },
        {
            display_order: "5",
            code: "PROFILE_BIZ",
            artist: "TM실장",
            m_icon: "category_profile_biz",
            name: "기업프로필",
            tags: "임직원 / 사원프로필 / CEO",
            src_p: `${BIZ_CATEGORY_BASE_URL_P}b_profile.jpg?v=${version}`,
            src_m: `${BIZ_CATEGORY_BASE_URL_M}b_profile.jpg?v=${version}`
        },
        {
            display_order: "6",
            code: "INTERIOR",
            artist: "이수강",
            m_icon: "category_interior",
            name: "인테리어",
            tags: "팬션 / 매장 / 건물",
            src_p: `${BIZ_CATEGORY_BASE_URL_P}interior.jpg?v=${version}`,
            src_m: `${BIZ_CATEGORY_BASE_URL_M}interior.jpg?v=${version}`
        },
        {
            display_order: "7",
            code: "EVENT",
            artist: "이세현",
            m_icon: "category_event",
            name: "행사",
            tags: "세미나 / 연회장 / 공연",
            src_p: `${BIZ_CATEGORY_BASE_URL_P}event.jpg?v=${version}`,
            src_m: `${BIZ_CATEGORY_BASE_URL_M}event.jpg?v=${version}`
        },
        // { code: "MODEL", artist: "joooorish", m_icon: "outline-people", name: "모델", tags: "태그1 / 태그2 / 태그3", src_p: `${BIZ_CATEGORY_BASE_URL_P}fasion.jpg?v=${version}`, src_m: `${BIZ_CATEGORY_BASE_URL_M}fasion.jpg?v=${version}` },
        // { code: "DRESS_RENT", artist: "joooorish", m_icon: "category_dress_rent", name: "의상대여", tags: "태그1 / 태그2 / 태그3", src_p: `${BIZ_CATEGORY_BASE_URL_P}fasion.jpg?v=${version}`, src_m: `${BIZ_CATEGORY_BASE_URL_M}fasion.jpg?v=${version}` },
        {
            display_order: "8",
            code: "VIDEO_BIZ",
            artist: "",
            m_icon: "category_video-biz",
            name: "기업영상",
            tags: "SNS / 광고 / 홍보영상",
            src_p: `${BIZ_CATEGORY_BASE_URL_P}video_biz.png?v=${version}`,
            src_m: `${BIZ_CATEGORY_BASE_URL_M}video_biz.png?v=${version}`
        }
    ],
    VIDEO: [
        { src: "https://player.vimeo.com/video/146861451", video_id: "146861451", title: "차이나탄 홍보 영상 풀버전" },
        { src: "https://player.vimeo.com/video/133738605", video_id: "133738605", title: "이슬포차 아이유 행사 스케치 영상" },
        { src: "https://player.vimeo.com/video/224261094", video_id: "224261094", title: "크리에이터 Cinema ver." }
    ],
    EXAMPLES: [
        { order: "1", title: "청바지", src: "/biz/example/jean_card.png", artist: "테스터" },
        { order: "2", title: "인테리어", src: "/biz/example/jean_card.png", artist: "테스터" },
        { order: "3", title: "CEO 프로필", src: "/biz/example/jean_card.png", artist: "테스터" },
        { order: "4", title: "화장품 컨셉", src: "/biz/example/jean_card.png", artist: "테스터" },
        { order: "5", title: "나이키 브랜드 프로모션 야외", src: "/biz/example/jean_card.png", artist: "테스터" }
    ],
    RESULT_IMAGES: [
        { order: "1", title: "", src: "/biz/result/result_01.png", artist: "테스터" },
        { order: "2", title: "", src: "/biz/result/20190107/result_02.jpg", artist: "테스터" },
        { order: "3", title: "", src: "/biz/result/20190107/result_03.jpg", artist: "테스터" }
    ],
    RENEW_REVIEW: [
        {
            artist: "박수진",
            no: 1,
            title: "고품격 고퀄리티, 제품촬영 전문가",
            desc: "수년간 다진 전문성으로 언제나 여러분에게 최고의 결과물을 제공해드릴 것을 약속드리며\n수년간 쌓인 노하우로 여러분을 빛나게 해드릴 것입니다.",
            images: [
                { src: "/biz/review/review1/img-562_1.jpg", pno: "562" },
                { src: "/biz/review/review1/img-917_1.jpg", pno: "917" },
                { src: "/biz/review/review1/img-657.jpg", pno: "657" },
                { src: "/biz/review/review1/img-562_2.jpg", pno: "562" },
                { src: "/biz/review/review1/img-917_2.jpg", pno: "917" }
            ],
            reviews: [
                {
                    content: "너무 감사하구요, 실력이 있으신건 확실해요!! 고맙습니다.",
                    customer: "구대*",
                    score: 5
                },
                {
                    content: "시간 맞춰 세팅된 스튜디오에서 덕분에 편안하게 촬영했습니다.\n요구사항이 많은데도 묵묵히 웃으면서 촬영해주신 작가님께 다시한번 감사드립니다.",
                    customer: "김지*",
                    score: 5
                },
                {
                    content: "촬영품질과 친절도가 아주 좋았습니다. 감사합니다.",
                    customer: "김현*",
                    score: 5
                }
            ]
        },
        {
            artist: "김종구",
            no: 2,
            title: "합리적인 가격과 확실한 퀄리티를 제공하는 건출촬영 전문가",
            desc: "모든 클라이언트의 입장에서 한번 더 생각하고 이해하며\n기업의 이미지에 가치를 더하고자 '순간'을 '완변한 가치'의 영원으로 담아내고자 합니다.",
            images: [
                { src: "/biz/review/review2/img-408_1.jpg", pno: "408" },
                { src: "/biz/review/review2/img-408_2.jpg", pno: "408" },
                { src: "/biz/review/review2/img-408_3.jpg", pno: "408" },
                { src: "/biz/review/review2/img-408_4.jpg", pno: "408" },
                { src: "/biz/review/review2/img-408_5.jpg", pno: "408" }
            ],
            reviews: [
                {
                    content: "처음 작가님을 섭오하여 한 직업에 이런 불만 하나 없이 진행가능한 것에 굉장한 행운이라고 생각합니다.!" +
                    "김종구 작가님 너무 친절하고 성심성의껏 촬영해주셨고 무엇보다 촬영시간이 길어짐에도 힘든내색 없이 최선을 다하여" +
                    "촬영해주시며 촬영 이후에도 보정작업시 원하는 작품이 나올때까지 끝까지 노력해주시는 모습에 아직 본인의 일에 열정과 최선을" +
                    "가지는 분이 남아잇구나 싶었습니다!! 다음에 촬영이 있어도 잘 부탁드리겠습니다^^!!",
                    customer: "함재*",
                    score: 5
                },
                {
                    content: "저의 유학원의 컨셉인 비티지 한 느낌을 잘 살려주셨습니다.\n" +
                    "작가님께 다시한번 감사드립니다. 추후에 다른 작업이 있다면 다시 의뢰 하겠습니다.^^ 감사합니다.!^^",
                    customer: "공덕*",
                    score: 5
                },
                {
                    content: "작가분의 친절에 큰 만족 느꼈습니다.\n" +
                    "추후에도 김종구 작가분에게 의뢰할 의향이 생깁니다. 감사합니다. ~",
                    customer: "홍석*",
                    score: 5
                }
            ]
        },
        {
            artist: "김진우",
            no: 3,
            title: "쇼핑몰 촬영의 베테랑",
            desc: "고객의 니즈를 꼼꼼하게 파악하여 최적의 결과물을 제공합니다.\n많은 커뮤니케이션으로 원하는 촬영을 이끌어 냅니다.",
            images: [
                { src: "/biz/review/review3/img-1168_1.jpg", pno: "1168" },
                { src: "/biz/review/review3/img-1168_2.jpg", pno: "1168" },
                { src: "/biz/review/review3/img-1168_3.jpg", pno: "1168" },
                { src: "/biz/review/review3/img-1168_4.jpg", pno: "1168" },
                { src: "/biz/review/review3/img-1168_5.png", pno: "1168" }
            ],
            reviews: [
                {
                    content: "작가님 아주 젊으신데, 젠틀하시고 좋았어요~ 감사했습니다.\n" +
                    "사진보정도 재차 요청한 2차보정도 친절히 해주셨어요.",
                    customer: "김민*",
                    score: 5
                },
                {
                    content: "이 작가님 진짜 숨은 프로이자 실력자입니다. " +
                    "저희는 의류 전문 기업체라 사진이 정말 중요한데 저희 회사의 컨셉을 상당히 이해를 해 주셔서 사진이 정말 잘 나왔습니다. " +
                    "자연스러우면서 감성사진~ 그리고 포맥스 조명을 전혀 사용하시지 않고 자연 채광으로만 컷을 잡아내시는데 정말 대단하다고 밖에 말씀드릴수 없네요~ " +
                    "인공 조명보다 자연 채광이 참 좋은데 자연 채광을 잘 쓰시는 작가님이시고 적재적소에 소품 과하지 않게 배치도 상당히 잘 해주십니다. " +
                    "쇼핑몰 사진 촬영 하실거라면 정말 김 작가님 베테랑이라 말씀드릴 수 잇겠네요~ 다음에도 같이 또 사진작업 하려 합니다. " +
                    "그리고 이 비용에 이런 작가님 만나뵙기 정말 힘든 거 사실입니다. " +
                    "하루 일당 100만원 작가분도 같이 작업했지만 그 작가님께는 죄송하지만 김 작가님이 실력이 더 좋습니다.\n" +
                    "다음에도 꼭 같이 작업 해주세요~",
                    customer: "변태*",
                    score: 5
                }
            ]
        },
        {
            artist: "joooorish",
            no: 4,
            title: "인물의 개성과 장점을 최대로 끌어올리는 프로필촬영 전문가",
            desc: "대학과 대학원에서 사진을 전공한 전문가로\n감각적인 연출과 자연스러운 분위기 속에서 원하는 컨셉의 촬영을 진행합니다.",
            images: [
                { src: "/biz/review/review4/img-930_1.jpg", pno: "930" },
                { src: "/biz/review/review4/img-1282_1.jpg", pno: "1282" },
                { src: "/biz/review/review4/img-1281.jpg", pno: "1281" },
                { src: "/biz/review/review4/img-930_2.jpg", pno: "930" },
                { src: "/biz/review/review4/img-1282_2.png", pno: "1282" }
            ],
            reviews: [
                {
                    content: "일단 작가님 너무 고생하셨습니다.\n" +
                    "단체 컨셉사진같은 경우는 의도했던 머리속에 그린그림 이상으로 잘나오주어서 너무 행복합니다.\n" +
                    "요약하는 부분이있는데 너무 다 만점을드려서 신뢰 안가는 점수같지만 사람만들어주셔서 감사합니다..\n" +
                    "저희팀이 앞으로 더 좋은음악을 하는데 있어 저희를 소개할 간판같은 사진을 너무 잘 해주셔서\n" +
                    "정말 너무 만족스럽습ㄴ다.\n" +
                    "저희가 잘되어서 재작업할날을 고대하겠습니다. 고생하셨습니다. 감사합니다.~!",
                    customer: "임찬*",
                    score: 5
                },
                {
                    content: "선거용 사진이라는 무거운 주제에, 어색하진 않을까 걱정했지만 시종일관 상냥하고 친절하셔서 편안한 분위기로 촬영했습니다.\n" +
                    "감각적인 연출과 자연스러운 분위기를 이끌어내주시는 작가님이라 생각됩니다.\n" +
                    "특히 인물에 맞는 색감과 조도에 있어서 작가정신으로 세심한 신경을 기울이시더라구요.\n" +
                    "만족스러운 촬영이었습니다.^^",
                    customer: "김진*",
                    score: 5
                }
            ]
        }
    ],
    INFORMATION: [
        [
            { src: `${BIZ_INFOR}/edit.png`, name: "편집", standard: false, pos: 2 },
            { src: `${BIZ_INFOR}/model.png`, name: "모델", standard: false, pos: 1 },
            { src: `${BIZ_INFOR}/shot.png`, name: "촬영", standard: true, pos: 0 }
        ],
        [
            { src: `${BIZ_INFOR}/place.png`, name: "장소", standard: false, pos: 1 },
            { src: `${BIZ_INFOR}/makeup.png`, name: "헤어메이크업", standard: true, pos: 0 },
            { src: `${BIZ_INFOR}/style.png`, name: "스타일리스트", standard: false, pos: -1 }
        ]
    ],
    INFORMATION_V2: [
        { CODE: "model", NAME: "모델", ICON: "mint_model" },
        { CODE: "camera", NAME: "촬영", ICON: "mint_camera" },
        { CODE: "makeup", NAME: "헤어 메이크업", ICON: "mint_makeup" },
        { CODE: "edit", NAME: "편집", ICON: "mint_edit" },
        { CODE: "stylist", NAME: "스타일리스트", ICON: "mint_stylist" },
        { CODE: "place", NAME: "장소", ICON: "mint_place" }
    ],
    WIDESCREEN: [
    ],
    REVIEW: [
        {
            pno: "/portfolio/564",
            thumb: `${BIZ_REVIEW_IMG}review_01.jpg`,
            title: "매출과 직결되는 감각있는 상품사진",
            nick_name: "by 박수진",
            description: "너무 감사하구요. 실력이 있으신건 확실해요!!\n" +
            "고맙습니다!",
            user_name: "구대현"
        },
        {
            pno: "/@joooorish",
            thumb: `${BIZ_REVIEW_IMG}review_02.jpg`,
            title: "견적상품 - 기업프로필",
            nick_name: "by joooorish",
            description: "선거용 사진이라는 무거운 주제에, 어색하진 않을까 걱정했지만\n" +
            "시종일관 상냥하고 친절하셔서 편안한 분위기로 촬영했습니다. \n" +
            "감각적인 연출과 자연스러운 분위기를 이끌어내주시는 작가님이라 생각됩니다. \n" +
            "특히 인물에 맞는 색감과 조도에 있어서 작가정신으로 세심한 신경을 기울이시더라구요." +
            "만족스러운 촬영이었습니다.^^",
            user_name: "김진영"
        },
        {
            pno: "/portfolio/798",
            thumb: `${BIZ_REVIEW_IMG}review_03.jpg`,
            title: "더 모스트 프린세스",
            nick_name: "by 프린세스메이커",
            description: "원본 사진도 보정안해도 될 정도로 잘찍어주셨는데 보정사진도 너무너무 예쁘게 해주셨어요~~\n" +
            "보정할데도 많았을텐데 완전 만족합니다!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n" +
            "연주당일엔 정신이 없는데 연주날전부터 세심하게 이것저것 미리 물어봐주셔서 \n" +
            "촬영걱정없이 연주에만 전념할수 있었습니다. \n" +
            "당일날 날도 춥고 리허설 시간도 딜레이 되고 정신없는 와중에도 신경쓰지말라고 \n" +
            "괜찮다고 하시면서 마지막까지 친절하게 촬영해주셨습니다. \n" +
            "추운 날 너무너무 고생하셨고 예쁘게 찍어주셔서 정말 감사드립니다^^\n",
            user_name: "김인화"
        }
        // {
        //     pno: "",
        //     thumb: "/biz/review/review_04.jpg",
        //     title: "",
        //     nick_name: "유림",
        //     description: "근처 지인분 소개로 촬영요청을 했습니다.\n" +
        //     "개인적으로 촬영을 했었는데 생각보다 별로여서\n" +
        //     "믿고 맡겨 봤는데 생각보다 사진이 너무 잘나와서 정말 너무 감사합니다.\n" +
        //     "먼곳에 날씨도 추운날 오셔서 촬영하기도 힘드실텐데\n 방이 깨끗하게 나올수 있게 정리하고 셋팅도 도와주시며\n" +
        //     "촬영을 하는 모습이 인상 깊었습니다.\n 주변 지인들에게 저도 꼭 소개 해드리겠습니다 거듭 감사합니다.",
        //     user_name: ""
        // },
        // {
        //     pno: "",
        //     thumb: "/biz/review/review_05.jpg",
        //     title: "",
        //     nick_name: "verajstudio",
        //     description: "새로 센터를 오픈하여 사진을 찍게 되었습니다.\n 1시간 가량 넉넉히 찍어주셨어요.\n" +
        //     "들어오는 빛에 따라 색감이 많이 달랐는데 일정하게 보정해주셨어요.\n 감사합니다",
        //     user_name: ""
        // }
    ],
    ALLIANCE: {
        DESCRIBE: "많은 기업들이\n포스냅 크루스튜디오와 함께하고 있습니다.",
        IMG_BASE_URL: "/biz/customers/20181219",
        OLD_IMG_BASE_URL: "/biz/customers",
        SIZE: {
            WIDTH: 97,
            HEIGHT: 48
        },
        VERSION_QUERY: "20180302_1719",
        LIST: [
            { NO: "1", DISPLAY_ORDER: "", NAME: "bcbg", NAME_K: "비씨비지", IMG_SRC: "/bcbg.jpg" },
            { NO: "2", NAME: "fastcampus", NAME_K: "패스트캠퍼스", IMG_SRC: "/fastcampus.jpg" },
            { NO: "3", NAME: "gap", NAME_K: "갭", IMG_SRC: "/gap.jpg" },
            { NO: "4", NAME: "innisfree", NAME_K: "이니스프리", IMG_SRC: "/innisfree.jpg" },
            { NO: "5", NAME: "laneige", NAME_K: "라네즈", IMG_SRC: "/laneige.jpg" },
            { NO: "6", NAME: "mcdonald", NAME_K: "맥도날드", IMG_SRC: "/mcdonald.jpg" },
            { NO: "7", NAME: "newbalance", NAME_K: "뉴발란스", IMG_SRC: "/newbalance.jpg" },
            { NO: "8", NAME: "nikon", NAME_K: "니콘", IMG_SRC: "/nikon.jpg" },
            { NO: "9", NAME: "olive", NAME_K: "올리브", IMG_SRC: "/olive.jpg" },
            { NO: "10", NAME: "oribs", NAME_K: "오르비스", IMG_SRC: "/orbis.jpg" },
            { NO: "11", NAME: "toms", NAME_K: "탐스", IMG_SRC: "/toms.jpg" },
            { NO: "12", NAME: "tonymoly", NAME_K: "토니모리", IMG_SRC: "/tonymoly.jpg" },
            { NO: "13", NAME: "topten", NAME_K: "탑텐", IMG_SRC: "/topten.jpg" },
            { NO: "14", NAME: "xtm", NAME_K: "엑스티엠", IMG_SRC: "/xtm.jpg" }
        ]
    },
    ESTIMATE_DESCRIPTION: {
        TITLE: "무료견적 요청하기",
        CAPTION: "광고사진촬영, CF, 바이럴 영상제작 등 전문촬영의 무료 견적을 요청해보세요."
    },
    ESTIMATE_STEP: [
        { no: 1, title: "무료견적 요청서 작성", description: "원하는 스튜디오를 찾을때까지 견적을 받아보실 수 있습니다.", icon: "enter_document", src: "" },
        { no: 2, title: "전문 스튜디오의 견적제공", description: "각 분야 전문 맞춤 스튜디오에서 견적을 제공합니다.", icon: "enter_studio", src: "" },
        { no: 3, title: "견적 선택 및 촬영", description: "분야별 전문가가 진행하는 최고의 촬영을 진행해 보세요.", icon: "enter_person_check", src: "" },
        { no: 4, title: "3분 작성완료", description: "간단한 질문에 대한 대답을 선택해 주시면 전문 스튜디오에서 무료 견적 상담 가능합니다.", src: "" }
    ],
    PROCESS_ACTION: {
        BACKGROUND_IMG: "biz/process/process_bg.jpg",
        PHOTO: [
            { STEP: "1", TITLE: "클라이언트 및 포토그래퍼 사전미팅", DESCRIBE: "(온라인or오프라인)", START: true, END: false, ARROW: true },
            { STEP: "2", TITLE: "컨셉회의 및 클라이언트 컨셉 컨펌", DESCRIBE: "", START: false, END: false, ARROW: true },
            { STEP: "3", TITLE: "촬영지 셀렉 제반사항 준비 및 스케쥴 픽스", DESCRIBE: "", START: false, END: false, ARROW: false },
            { STEP: "4", TITLE: "촬영 및 컨펌", DESCRIBE: "(클라이언트 참여가능)", START: false, END: false, ARROW: true },
            { STEP: "5", TITLE: "기본리터칭 또는 전문리터칭", DESCRIBE: "", START: false, END: false, ARROW: true },
            { STEP: "6", TITLE: "완료 본 전달 후 컨펌", DESCRIBE: "", START: false, END: true, ARROW: false }
        ],
        VIDEO: [
            { STEP: "1", TITLE: "클라이언트 및 영상팀 사전미팅", DESCRIBE: "(온라인or오프라인)", START: true, END: false, ARROW: true },
            { STEP: "2", TITLE: "컨셉회의 및 클라이언트 컨셉 컨펌", DESCRIBE: "", START: false, END: false, ARROW: true },
            { STEP: "3", TITLE: "시나리오, 스토리보드 제작 및 컨펌", DESCRIBE: "", START: false, END: false, ARROW: false },
            { STEP: "4", TITLE: "제반사항 준비 및 스케쥴 픽스", DESCRIBE: "(클라이언트 참여가능)", START: false, END: false, ARROW: true },
            { STEP: "5", TITLE: "촬영진행 및 가편집 진행", DESCRIBE: "", START: false, END: false, ARROW: true },
            { STEP: "6", TITLE: "피드백 및 수정", DESCRIBE: "", START: false, END: false, ARROW: true },
            { STEP: "7", TITLE: "최종 편집 후 완성본 납품", DESCRIBE: "", START: false, END: true, ARROW: false }
        ]
    },
    SECOND_CONSULT: {
        PRODUCT: { artist_name: "박수진", name: "제품", tag: ["광고", "쇼핑몰", "연출사진", "누끼", "모델", "제품", "주얼리"] },
        BEAUTY: { artist_name: "miro", name: "코스메틱", tag: ["뷰티용품", "화장품", "화장품누끼", "화장품연출"] },
        FASHION: { artist_name: "멜로우모먼트", name: "패션", tag: ["룩북", "쇼핑몰", "화보", "의류", "카달로그"] },
        FOOD: { artist_name: "최민정", name: "음식", tag: ["메뉴판", "식품", "레스토랑", "누끼", "카페", "한식", "디저트"] },
        PROFILE_BIZ: { artist_name: "오디니크", name: "프로필", tag: ["임직원", "사원프로필", "ceo"] },
        INTERIOR: { artist_name: "윤현희", name: "인테리어", tag: ["팬션", "매장", "건물", "홍보", "실내", "인테리어"] },
        EVENT: { artist_name: "박수진", name: "행사", tag: ["세미나", "연회장", "공연", "기업연수", "콘서트", "파티"] },
        VIDEO_BIZ: { artist_name: "킬클", name: "영상", tag: ["SNS", "광고", "홍보영상", "바이럴"] }
        /* 백업용
        PRODUCT: { artist_name: "최민정", name: "제품", tag: ["광고", "쇼핑몰", "연출사진", "누끼", "모델", "제품", "주얼리"] },
        BEAUTY: { artist_name: "miro", name: "뷰티", tag: ["뷰티용품", "화장품", "화장품누끼", "화장품연출"] },
        FASHION: { artist_name: "멜로우모먼트", name: "패션", tag: ["룩북", "쇼핑몰", "화보", "의류", "카달로그"] },
        FOOD: { artist_name: "최민정", name: "음식", tag: ["메뉴판", "식품", "레스토랑", "누끼", "카페", "한식", "디저트"] },
        PROFILE_BIZ: { artist_name: "오디니크", name: "프로필", tag: ["임직원", "사원프로필", "ceo"] },
        INTERIOR: { artist_name: "윤현희", name: "인테리어", tag: ["팬션", "매장", "건물", "홍보", "실내", "인테리어"] },
        EVENT: { artist_name: "박수진", name: "행사", tag: ["세미나", "연회장", "공연", "기업연수", "콘서트", "파티"] },
        VIDEO_BIZ: { artist_name: "킬클", name: "영상", tag: ["SNS", "광고", "홍보영상", "바이럴"] }
         */
    },
    RECOMMEND_PORTFOLIO: {
        PRODUCT: { name: "제품" },
        BEAUTY: { name: "코스메틱" },
        FOOD: { name: "음식" },
        FASHION: { name: "패션" },
        INTERIOR: { name: "인테리어" },
        PROFILE_BIZ: { name: "프로필" },
        EVENT: { name: "행사" }
    },
    MAIN_REVIEW: [
        {
            comment: `오디니크 작가님께서 저희 딜럭스 봄바 제품 촬영에 임해주셨는데요,\n
까다로운 요구들에도 불구하고 최선을 다해 의견 수렴해주셨을 뿐만 아니라\n
필요할때는 좋은 의견을 제안해 주셔서 즐겁고 원활하게 촬영 진행할 수 있었습니다.\n
뿐만 아니라 약속한 기간 안에 요청드린 사항들을  빠짐없이\n
보정하여 A cut들을 보내주심으로 스케쥴에 아무런 지장 없이 제품을\n
출시 할 수 있을 듯 싶습니다.\n
처음부터 끝까지 큰 도움 주심에 다시 한번 감사드리며\n
다음 촬영때에도 연락드릴테니 잘 부탁드리겠습니다^^`,
            name: "이정★",
            rating_avg: "5",
            review_img: [
                "/review/dc/59/dc5c05078714b455c120faabc53b.jpg",
                "/review/dc/59/dc5c05078714b455c120fab2c275.jpg",
                "/review/dc/59/dc5c05078714b455c120fab94e6e.jpg",
                "/review/dc/59/dc5c05078714b455c120fac1491d.jpg",
                "/review/dc/59/dc5c05078714b455c120fac88975.jpg"
            ],
            review_no: "895"
        },
        {
            comment: "적극적인 자세로 결과물의 품질을 높이려는 작업마인드에 감사드립니다. 또 작업을 부탁드릴 계획입니다. 전체적으로 만족합니다.",
            name: "황대★",
            rating_avg: "4.7",
            review_img: [
                "/review/5d/f5/5d5b711b431f5945b7fd3df59fca.png"
            ],
            review_no: "586"
        },
        {
            comment: "작가분의 친절에 큰 만족 느꼈습니다.\n추후에도 김종구 작가분에게 의뢰할 의향이 생깁니다.\n\n감사합니다 ~",
            name: "홍석★",
            rating_avg: "5",
            review_img: [
                "/product/a1/408/review5aef1af282a5f.jpg",
                "/product/a1/408/review5aef1af39eab3.jpg",
                "/product/a1/408/review5aef1af4d6a17.jpg",
                "/product/a1/408/review5aef1af62322c.jpg",
                "/product/a1/408/review5aef1af760e65.jpg",
                "/product/a1/408/review5aef1af8948b5.jpg",
                "/product/a1/408/review5aef1af99f65b.jpg",
                "/product/a1/408/review5aef1afa9ef9b.jpg"
            ],
            review_no: "200"
        },
        {
            comment: `화장품 연출컷 촬영했는데요, 작가님 되게 친절하시고 생각했던대로 예쁘게 나왔어요
포트폴리오가 다 예뻐서, 잘 나올줄 알았습니다!ㅎㅎ
디테일하게 말씀을 못드렸는데도 예쁜 소품 센스있게 배치해서 촬영해주셨고
친절하게 설명해주시고 소통 원활하게 진행되었어요! + 목소리도 굉장히 기분좋아지는 밝은목소리세요!
ㅎ_ㅎ
만족스러워요! 다음에 또 촬영하게 되면 작가님께 다시 맡기고싶습니다  감사합니다.  :)`,
            name: "김주★",
            rating_avg: "5",
            review_img: [],
            review_no: "1050"
        },
        {
            comment: "우선 작가님께서 너무 친절하시고 소품 또한 직접 고민하시면서 스타일해주셔서 너무 좋았습니다. 작업물 결과도 너무 만족합니다.",
            name: "노동★",
            rating_avg: "5",
            review_img: [],
            review_no: "1020"
        },
        {
            comment: "사내 종무식 행사내내 친절하시면서도 묵묵히 사진 촬영하시는 모습이 정말 감사했습니다! 사진도 받아봤을 때 직원 모두가 만족할 정도로 분위기있게 나온 것 같습니다. 다음 행사에도 기회가 된다면 작가님과 함께 하고 싶네요. 감사합니다.",
            name: "이예★",
            rating_avg: "5",
            review_img: [],
            review_no: "950"
        },
        {
            comment: `최고의 작가님!
프로필에서 진정성과 열정을 느껴서 이세현 작가님을 컨택하게 되었습니다.
전직원 250명중 220명이 모이는 행사에 미국 본사 Global 임원들 약 12분이 참석하는 송년행사라서  더욱 신경을 썼는데...\n
결론적으로는 프로페셔널 하시고 열정이 넘치시면서도 뛰어나신 작가님을 만나게 되었네요.
송년행사 끝나고 사장님과 Global임원들을 모시고 간 2차에서 가장 많이 들었던 말씀이 사진작가님을 대체 어디서 섭외한거냐였습니다.\n
각국의 많은 행사를 다니시지만 그렇게 함께 즐거워하시고 열정적으로 촬영해주시는 분은 처음봤다고 하시네요.
작가님 덕분에 행사가 더 즐거워졌고 저도 칭찬을 많이 받았습니다.\n
사진을 전달받았을때는 더 놀랐어요 ^^
조명이 어두워서 여러가지로 촬영하기에 좋은 조건이  아니었지만 저희 직원들을 영화같이 찍어주셨더라구요 ㅠㅠ
사진 한컷 한컷에 저희 직원 및 회사를 향한 애정의 시선이 느껴져서 더욱 감동이었답니다...
직원들이 너무 좋아하네요...ㅠㅠ 역시 전문가의 손길 ㅠㅠ\n
작가님 항상 건강하시고 자주뵙기를 소망합니다. 파일을 올릴 수 없는 것이 너무 아쉽네요....`,
            name: "우정★",
            rating_avg: "5",
            review_img: [],
            review_no: "920"
        },
        {
            comment: `간단한 제품촬영이었지만 까다로운 제품들은 촬영 전에 먼저 샘플 촬영을 진행해보고 싶으시다고 말씀해주셔서 촬영 당일 좀 더 편하게 촬영을 진행할 수 있었습니다.\n
제품 특성을 잘 살려주셔서 별다른 수정 없이도 좋은 사진을 건질 수 있었던 것 같아요!\n
가격도 알아본 곳 중 가장 저렴하게 진행되었고 예약부터 촬영이나 수정날짜등이 물흐르듯 잘 이루어져서 매우 만족스럽습니다^^`,
            name: "박은★",
            rating_avg: "5",
            review_img: [],
            review_no: "907"
        },
        {
            comment: `처음 쇼핑몰 피팅 촬영을 하시는분!!? 아니면 새로운 쇼핑몰 피팅 촬영 하시는분 여기서 꼭 하세요! ^^
쇼핑몰 피팅 촬영을 찾아보다가, 우연히 프린세스 메이커 작가님의 사진과 프로필 내용을 보고 여러 조율 끝에 사진 촬영을 완료 했습니다. ^^ ! 촬영 결제전에 저희쪽의 스케줄이 계속 변경되어 바쁘셧을텐데도 불구하고, 친절하게 끝까지 잘 안내해주셔서 일사천리로 모든 일을 마무리하고 촬영 예약을 완료할수 있엇어요 ^^!! 그리고 사전에 스튜디오 위치와 자세한 사항들을 잘 안내해주셧고, 당일에도 연락을 주시는 섬세함에 감동했습니다 ^^.
본 촬영에 들어갔을때에는 작가님께서 섭외해주신 여성모델분께서도 전문가답게 촬영을 리드해주셔서 처음으로 스튜디오에서 쇼핑몰 피팅 촬영을 했음에도 불구하고 시간이 지연되지 않고 모든 과정이 순조롭게 잘 진행되었습니다. (이래도 되나 싶을정도로?) 스튜디오에서 촬영뿐만아니라 저희업체에 대해서도 많이 신경써주시고 챙겨주셔서 너무 감사했습니다.
촬영 내내 즐거운 분위기에 마치고서도 힘들지 않고 기분이 좋았어요 ^^ ~ 이번에 스튜디오 작가님에게 모델섭외와 메이크업 섭외까지 요청드렸는데, 너무나도 실력있으신 분들이 와주셔서 기대이상이었습니다!! 또한, 다음날 바로 받은 사진결과물도 너무 만족스러워요! ^^ 다음에 기회가 된다면 작가님과 다시한번 작업해보고싶네요 감사합니다 ^^`,
            name: "S★",
            rating_avg: "5",
            review_img: [],
            review_no: "987"
        }
    ]
};
