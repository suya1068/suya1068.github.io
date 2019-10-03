export const TAB_KEYS = {
    PRICE: "price",
    REVIEW: "review",
    INFO: "info",
    CAREER: "career",
    PORTFOLIO: "portfolio",
    ARTIST_INFO: "artist_info",
    ARTIST_REVIEW: "artist_review"
};

export const BUSINESS_TAB_DATA = {
    [TAB_KEYS.ARTIST_INFO]: {
        title: "작가소개",
        type: TAB_KEYS.ARTIST_INFO,
        active: true
    },
    [TAB_KEYS.CAREER]: {
        title: "작가경력",
        type: TAB_KEYS.CAREER,
        active: false
    },
    [TAB_KEYS.REVIEW]: {
        title: "후기",
        type: TAB_KEYS.REVIEW,
        active: false
    },
    [TAB_KEYS.ARTIST_REVIEW]: {
        title: "촬영사례",
        type: TAB_KEYS.ARTIST_REVIEW,
        active: false
    }
};

export const TAB_DATA = {
    [TAB_KEYS.INFO]: {
        title: "상품설명",
        type: TAB_KEYS.INFO,
        active: true
    },
    [TAB_KEYS.PORTFOLIO]: {
        title: "포트폴리오",
        type: TAB_KEYS.PORTFOLIO,
        active: false
    },
    [TAB_KEYS.PRICE]: {
        title: "가격정보",
        type: TAB_KEYS.PRICE,
        active: false
    },
    [TAB_KEYS.REVIEW]: {
        title: "리뷰",
        type: TAB_KEYS.REVIEW,
        active: false
    }
};
