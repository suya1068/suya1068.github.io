const PERSONAL_IMG_BASE_URL = "/banner/20180417/per";
export const PERSONAL_DATA = {
    TITLE: "포스냅은 언제 어디서든 모든 촬영이 가능합니다.",
    IMG_BG_M: `${PERSONAL_IMG_BASE_URL}/per_bg_m.jpg`,
    IMG_BG_P: `${PERSONAL_IMG_BASE_URL}/per_bg_p.jpg`,
    OLD_IMG_BG_M: "/banner/20180405/banner_bg_m.jpg",
    OLD_IMG_BG_P: "/banner/20180405/banner_bg_p.jpg",
    MAIN_IMG_P: "/main/top_visual/top_visual_03.jpg",
    MAIN_IMG_M: "/mobile/main/top_visual/top_visual_08.jpg",
    CLOSE_BUTTON: "/banner/20180405/close_btn.png",
    ARTIST: "홍기완",
    MAIN_ARTIST: "이현호",
    LIST: [
        {
            TITLE: "웨딩촬영",
            DESCRIBE: "간편상담으로 일정부터\n 촬영까지 한번에 조율하세요.",
            CATEGORY: "WEDDING",
            BUTTON_TITLE: "간편상담하기",
            BUTTON_BG_COLOR: "#7d90bf",
            MAIN_IMG_M: "/banner/20180405/first_bg_m.jpg",
            MAIN_IMG_P: "/banner/20180405/first_bg_p.jpg",
            IMG_BG: `${PERSONAL_IMG_BASE_URL}/first_bg.jpg`,
            ACTION: "consult",
            ARTIST: "코코",
            LABEL: "웨딩-상담"
        },
        {
            TITLE: "스냅촬영",
            DESCRIBE: "원하는 포트폴리오 선택하여\n 작가님과 직접 소통하세요.",
            CATEGORY: "SNAP",
            BUTTON_TITLE: "디엠보내기",
            BUTTON_BG_COLOR: "#ffc142",
            MAIN_IMG_M: "/banner/20180612/second_bg_m.jpg",
            MAIN_IMG_P: "/banner/20180612/second_bg_p.jpg",
            IMG_BG: `${PERSONAL_IMG_BASE_URL}/second_bg.jpg`,
            ACTION: "artist_chat",
            ARTIST: "코코",
            LABEL: "스냅-대화"
        },
        {
            TITLE: "프로필촬영",
            DESCRIBE: "첫 촬영이라면\n 전문작가님께 맡겨보세요.",
            CATEGORY: "PROFILE",
            BUTTON_TITLE: "맞춤상담하기",
            BUTTON_BG_COLOR: "#b75ace",
            MAIN_IMG_M: "/banner/20180405/third_bg_m.jpg",
            MAIN_IMG_P: "/banner/20180405/third_bg_p.jpg",
            IMG_BG: `${PERSONAL_IMG_BASE_URL}/third_bg.jpg`,
            ACTION: "consult",
            REDIRECT_URL: "/users/quotation",
            REDIRECT_URL_GUEST: "/guest/quotation/",
            ARTIST: "프린세스메이커",
            LABEL: "프로필-견적"
        },
        {
            TITLE: "베이비촬영",
            CATEGORY: "BABY",
            DESCRIBE: "가성비가 좋은\n 베이비촬영을 알아보세요.",
            BUTTON_TITLE: "촬영문의하기",
            BUTTON_BG_COLOR: "#52c1a3",
            MAIN_IMG_M: "/banner/20180405/fourth_bg_m.jpg",
            MAIN_IMG_P: "/banner/20180405/fourth_bg_p.jpg",
            IMG_BG: `${PERSONAL_IMG_BASE_URL}/fourth_bg.jpg`,
            ACTION: "consult",
            ARTIST: "심보건",
            LABEL: "베이비-상담"
        }
    ]
};

const BIZ_IMG_BASE_URL = "/banner/20180417/biz";
export const BIZ_DATA = {
    TITLE_01: "상담부터 견적과 촬영까지",
    TITLE_02: "포스냅에 맡기세요!",
    IMG_BG_P: `${BIZ_IMG_BASE_URL}/biz_bg_p.jpg`,
    IMG_BG_M: `${BIZ_IMG_BASE_URL}/biz_bg_m.jpg`,
    OLD_IMG_BG_M: "/banner/20180322/banner_bg_m.jpg",
    OLD_IMG_BG_P: "/banner/20180322/banner_bg_p.jpg",
    MAIN_IMG_P: "/biz/top_visual/top_visual_05.jpg",
    MAIN_IMG_M: "/mobile/main/top_visual/top_visual_09.jpg",
    CLOSE_BUTTON: "/banner/20180322/close_btn.png",
    ARROW_BUTTON: "/banner/20180322/arrow_btn.png",
    ARTIST: "강민수",
    MAIN_ARTIST: "이수강",
    MAIN: [
        {
            NO: "1",
            TITLE: "제품",
            CATEGORY: "PRODUCT",
            DESCRIBE: "필요한 샷이 있어요.\n촬영 견적을 받고 싶어요.",
            BUTTON_TITLE: "견적신청하기",
            IMG_BG_P: "/banner/20180322/first_bg_p.jpg",
            IMG_BG_M: "/banner/20180322/first_bg_m.jpg",
            REDIRECT_URL: "/users/quotation",
            REDIRECT_URL_GUEST: "/guest/quotation/",
            BUTTON_BG_COLOR: "#52c1a3",
            ARTIST: "김동국",
            LABEL: "제품-견적"
        },
        {
            NO: "2",
            TITLE: "음식",
            CATEGORY: "FOOD",
            DESCRIBE: "촬영이 처음이에요.\n어떻게 진행해야 할지 도와주세요.",
            BUTTON_TITLE: "간단상담하기",
            IMG_BG_P: "/banner/20180322/second_bg_p.jpg",
            IMG_BG_M: "/banner/20180322/second_bg_m.jpg",
            BUTTON_BG_COLOR: "#607cc5",
            ARTIST: "TM실장",
            LABEL: "음식-상담"
        },
        {
            NO: "3",
            TITLE: "의류,기업",
            CATEGORY: "ETC",
            DESCRIBE: "지속적인 촬영이 필요해요.\n상담이 필요해요.",
            BUTTON_TITLE: "맞춤촬영 상담하기",
            IMG_BG_P: "/banner/20180322/third_bg_p.jpg",
            IMG_BG_M: "/banner/20180322/third_bg_m.jpg",
            BUTTON_BG_COLOR: "#b8ae8e",
            ARTIST: "멜로우모먼트",
            LABEL: "의류-맞춤"
        }
    ],
    PRODUCT: [
        {
            NO: "1",
            TITLE: "제품촬영",
            CATEGORY: "PRODUCT",
            DESCRIBE: "필요한 샷이 있어요.\n촬영 견적을 받고 싶어요.",
            BUTTON_TITLE: "맞춤상담 받아보기",
            IMG_BG: `${BIZ_IMG_BASE_URL}/first_bg.jpg`,
            ACTION: "consult",
            REDIRECT_URL: "/users/quotation",
            REDIRECT_URL_GUEST: "/guest/quotation/",
            BUTTON_BG_COLOR: "#52c1a3",
            ARTIST: "DGK",
            LABEL: "제품-견적"
        },
        {
            NO: "2",
            TITLE: "음식촬영",
            CATEGORY: "FOOD",
            DESCRIBE: "촬영이 처음이에요.\n어떻게 진행해야 할지 도와주세요.",
            BUTTON_TITLE: "간단상담 받아보기",
            IMG_BG: `${BIZ_IMG_BASE_URL}/second_bg.jpg`,
            ACTION: "consult",
            BUTTON_BG_COLOR: "#607cc5",
            ARTIST: "TM실장",
            LABEL: "음식-상담"
        },
        {
            NO: "3",
            TITLE: "의류,기업촬영",
            CATEGORY: "FASHION",
            DESCRIBE: "지속적인 촬영이 필요해요.\n상담이 필요해요.",
            BUTTON_TITLE: "촬영견적 알아보기",
            IMG_BG: `${BIZ_IMG_BASE_URL}/third_bg.jpg`,
            ACTION: "consult",
            BUTTON_BG_COLOR: "#b8ae8e",
            ARTIST: "멜로우모먼트",
            LABEL: "패션-상담"
        },
        {
            NO: "4",
            TITLE: "의류,기업촬영",
            CATEGORY: "PROFILE_BIZ",
            DESCRIBE: "지속적인 촬영이 필요해요.\n상담이 필요해요.",
            BUTTON_TITLE: "촬영견적 알아보기",
            IMG_BG: `${BIZ_IMG_BASE_URL}/third_bg.jpg`,
            ACTION: "consult",
            BUTTON_BG_COLOR: "#b8ae8e",
            ARTIST: "멜로우모먼트",
            LABEL: "기업프로필-상담"
        },
        {
            NO: "5",
            TITLE: "인테리어촬영",
            CATEGORY: "INTERIOR",
            DESCRIBE: "필요한 샷이 있어요.\n촬영 견적을 받고 싶어요.",
            BUTTON_TITLE: "맞춤상담 받아보기",
            IMG_BG: `${BIZ_IMG_BASE_URL}/fourth_bg.jpg`,
            ACTION: "quotation",
            BUTTON_BG_COLOR: "#4aa9e4",
            REDIRECT_URL: "/users/quotation",
            REDIRECT_URL_GUEST: "/guest/quotation/",
            ARTIST: "빈센트",
            LABEL: "인테리어-맞춤"
        },
        {
            NO: "6",
            TITLE: "행사촬영",
            CATEGORY: "EVENT",
            DESCRIBE: "필요한 샷이 있어요.\n어떻게 진행해야 할지 도와주세요.",
            BUTTON_TITLE: "간단상담 받아보기",
            IMG_BG: `${BIZ_IMG_BASE_URL}/fifth_bg.jpg`,
            ACTION: "consult",
            BUTTON_BG_COLOR: "#ffba00",
            ARTIST: "이세현",
            LABEL: "행사-상담"
        }
    ]
};

