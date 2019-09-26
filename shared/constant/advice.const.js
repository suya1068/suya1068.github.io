const VERSION = "20180621_1622";
const ADVICE_ORDER_CATEGORY_PATH = "/biz/category/20181025/";

const ADVICE_ORDER = {
    CATEGORY: [
        { code: "PRODUCT", artist: "오디니크", name: "제품", src: `${ADVICE_ORDER_CATEGORY_PATH}product.png?v=${VERSION}` },
        { code: "EVENT", artist: "오디니크", name: "행사", src: `${ADVICE_ORDER_CATEGORY_PATH}event.png?v=${VERSION}` },
        { code: "FOOD", artist: "박수진", name: "음식", src: `${ADVICE_ORDER_CATEGORY_PATH}food.png?v=${VERSION}` },
        { code: "FASHION", artist: "멜로우모먼트", name: "패션", src: `${ADVICE_ORDER_CATEGORY_PATH}fashion.png?v=${VERSION}` },
        { code: "INTERIOR", artist: "오디니크", name: "인테리어", src: `${ADVICE_ORDER_CATEGORY_PATH}interior.png?v=${VERSION}` },
        { code: "PROFILE_BIZ", artist: "오디니크", name: "기업프로필", src: `${ADVICE_ORDER_CATEGORY_PATH}b_profile.png?v=${VERSION}` },
        { code: "VIDEO_BIZ", artist: "킬클", name: "영상", src: `${ADVICE_ORDER_CATEGORY_PATH}video.png?v=${VERSION}` }
    ]
};

export const CONSULT_ACCESS_TYPE = {
    MAIN_ESTIMATE: { CODE: "main_estimate", NAME: "메인-견적요청" },
    MAIN_SAMPLE: { CODE: "main_sample", NAME: "메인-샘플신청" },
    MAIN: { CODE: "main", NAME: "메인-상담요청" },
    "MAIN_A.PFF": { CODE: "main_a.pff", NAME: "메인A-제품,음식,패션" },
    "MAIN_A.PI": { CODE: "main_a.pi", NAME: "메인A-프로필,인테리어" },
    "MAIN_A.EV": { CODE: "main_a.ev", NAME: "메인A-행상,영상" },
    "MAIN_B.PF": { CODE: "main_b.pf", NAME: "메인B-제품,음식,패션" },
    "MAIN_B.F": { CODE: "main_b.f", NAME: "메인B-패션" },
    "MAIN_B.BP": { CODE: "main_b.bp", NAME: "메인B-기업프로필" },
    "MAIN_B.I": { CODE: "main_b.i", NAME: "메인B-인테리어" },
    "MAIN_B.EV": { CODE: "main_b.ev", NAME: "메인B-행사,영상" },
    PRODUCT_DETAIL: { CODE: "product_detail", NAME: "상품상세-배너" },
    INFLOW: { CODE: "inflow", NAME: "쇼핑배너" },
    BANNER: { CODE: "banner", NAME: "메인배너" },
    PRICE: { CODE: "price", NAME: "가격정가제" },
    VIDEO_INFO: { CODE: "video_info", NAME: "비디오" },
    MOBILE_MENU: { CODE: "mobile_menu", NAME: "모바일_우측메뉴" },
    // 오픈견적 상품 리스트
    PL_ESTIMATE_E: { CODE: "pl_estimate_e", NAME: "리스트_견적_행사" },
    PL_ESTIMATE_P: { CODE: "pl_estimate_p", NAME: "리스트_견적_제품" },
    PL_ESTIMATE_I: { CODE: "pl_estimate_i", NAME: "리스트_견적_인테리어" },
    PL_ESTIMATE_B: { CODE: "pl_estimate_b", NAME: "리스트_견적_뷰티" },
    PL_ESTIMATE_F: { CODE: "pl_estimate_f", NAME: "리스트_견적_음식" },
    PL_ESTIMATE_PB: { CODE: "pl_estimate_pb", NAME: "리스트_견적_기업프로필" },
    PL_ESTIMATE_FS: { CODE: "pl_estimate_fs", NAME: "리스트_견적_패션" },
    PL_ESTIMATE_V: { CODE: "pl_estimate_v", NAME: "리스트_견적_기업영상" },
    // 오픈견적 상담먼저
    PL_FIRST_E: { CODE: "pl_first_e", NAME: "리스트_상담_행사" },
    PL_FIRST_P: { CODE: "pl_first_p", NAME: "리스트_상담_제품" },
    PL_FIRST_I: { CODE: "pl_first_i", NAME: "리스트_상담_인테리어" },
    PL_FIRST_B: { CODE: "pl_first_b", NAME: "리스트_상담_뷰티" },
    PL_FIRST_F: { CODE: "pl_first_f", NAME: "리스트_상담_음식" },
    PL_FIRST_PB: { CODE: "pl_first_pb", NAME: "리스트_상담_기업프로필" },
    PL_FIRST_FS: { CODE: "pl_first_fs", NAME: "리스트_상담_패션" },
    PL_FIRST_V: { CODE: "pl_first_v", NAME: "리스트_상담_기업영상" },
    // 오픈견적 촬영사례
    // EXAM_E_1: { CODE: "exam_e_1", NAME: "촬영사례_행사_1" },
    // EXAM_E_2: { CODE: "exam_e_2", NAME: "촬영사례_행사_2" },
    // EXAM_E_3: { CODE: "exam_e_3", NAME: "촬영사례_행사_3" },
    // EXAM_P_1: { CODE: "exam_e_1", NAME: "촬영사례_행사_1" },
    // EXAM_P_2: { CODE: "exam_e_2", NAME: "촬영사례_행사_2" },
    // EXAM_P_3: { CODE: "exam_e_3", NAME: "촬영사례_행사_3" },
    // EXAM_E_1: { CODE: "exam_e_1", NAME: "촬영사례_행사_1" },
    // EXAM_E_2: { CODE: "exam_e_2", NAME: "촬영사례_행사_2" },
    // EXAM_E_3: { CODE: "exam_e_3", NAME: "촬영사례_행사_3" },
    // EXAM_E_1: { CODE: "exam_e_1", NAME: "촬영사례_행사_1" },
    // EXAM_E_2: { CODE: "exam_e_2", NAME: "촬영사례_행사_2" },
    // EXAM_E_3: { CODE: "exam_e_3", NAME: "촬영사례_행사_3" },
    // EXAM_E_1: { CODE: "exam_e_1", NAME: "촬영사례_행사_1" },
    // EXAM_E_2: { CODE: "exam_e_2", NAME: "촬영사례_행사_2" },
    // EXAM_E_3: { CODE: "exam_e_3", NAME: "촬영사례_행사_3" },
    // EXAM_E_1: { CODE: "exam_e_1", NAME: "촬영사례_행사_1" },
    // EXAM_E_2: { CODE: "exam_e_2", NAME: "촬영사례_행사_2" },
    // EXAM_E_3: { CODE: "exam_e_3", NAME: "촬영사례_행사_3" },
    // EXAM_E_1: { CODE: "exam_e_1", NAME: "촬영사례_행사_1" },
    // EXAM_E_2: { CODE: "exam_e_2", NAME: "촬영사례_행사_2" },
    // EXAM_E_3: { CODE: "exam_e_3", NAME: "촬영사례_행사_3" },
    // 사용안함
    HEADER: { CODE: "header", NAME: "헤더" },
    FLOAT: { CODE: "float", NAME: "플로팅" },
    "CARD.VIDEO_BIZ": { CODE: "card.video_biz", NAME: "사례-기업영상" },
    "CARD.INTERIOR": { CODE: "card.interior", NAME: "사례-인테리어" },
    "CARD.FASHION": { CODE: "card.fashion", NAME: "사례-패션" },
    INFORMATION: { CODE: "information", NAME: "정보페이지" },
    MAIN_FREE: { CODE: "main_free", NAME: "메인-무료견적" }
};

export default ADVICE_ORDER;
