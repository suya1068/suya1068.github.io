export const OPEN_KEYS = {
    VIRTUAL_ESTIMATE: "virtual_estimate",
    SHOT_EXAMPLE: "shot_example",
    CATEGORY_REVIEW: "category_review",
    RECOMMEND_PORTFOLIO: "recommend_portfolio",
    PORTFOLIO_LIST: "portfolio_list",
    PRE_RECOMMNED_ARTIST: "pre_recommend_artist"
};

export const OPEN_DATA = {
    [OPEN_KEYS.PRE_RECOMMNED_ARTIST]: {
        title: "추천작가",
        type: OPEN_KEYS.PRE_RECOMMNED_ARTIST,
        active: true
    },
    [OPEN_KEYS.VIRTUAL_ESTIMATE]: {
        title: "3초 견적",
        type: OPEN_KEYS.VIRTUAL_ESTIMATE,
        active: false
    },
    // [OPEN_KEYS.SHOT_EXAMPLE]: {
    //     title: "촬영 사례",
    //     type: OPEN_KEYS.SHOT_EXAMPLE,
    //     active: false
    // },
    [OPEN_KEYS.CATEGORY_REVIEW]: {
        title: "촬영 후기",
        type: OPEN_KEYS.CATEGORY_REVIEW,
        active: false
    }
    // [OPEN_KEYS.RECOMMEND_PORTFOLIO]: {
    //     title: "포스냅추천",
    //     type: OPEN_KEYS.RECOMMEND_PORTFOLIO,
    //     active: false
    // },
    // [OPEN_KEYS.PORTFOLIO_LIST]: {
    //     title: "포트폴리오",
    //     type: OPEN_KEYS.PORTFOLIO_LIST,
    //     active: false
    // }
};
