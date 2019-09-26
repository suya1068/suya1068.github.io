const CATEGORY_KEYS = {
    KEY: "category",
    PRODUCT: "PRODUCT",
    FOOD: "FOOD",
    INTERIOR: "INTERIOR",
    PROFILE_BIZ: "PROFILE_BIZ",
    FASHION: "FASHION",
    BEAUTY: "BEAUTY",
    EVENT: "EVENT",
    VIDEO_BIZ: "VIDEO_BIZ"
};

const PROPERTYS = {
    TOTAL_TIME: { CODE: "total_time", NAME: "총 촬영시간" },
    SHOT_KIND: { CODE: "shot_kind", NAME: "촬영종류" },
    PERSON: { CODE: "person", NAME: "포토그래퍼 인원" },
    PHOTOZONE: { CODE: "photozone", NAME: "포토존 여부" },
    PLACE: { CODE: "place", NAME: "촬영지역" },
    LOCATION: { CODE: "location", NAME: "촬영장소" },
    MODEL_TIME: { CODE: "model_time", NAME: "모델 촬영 시간" },
    N_PLUS_M_SHOT: { CODE: "n_plus_m_shot", NAME: "누끼+모델", SUB_CODE: "model" },
    // 제품 소재
    MATERIAL: { CODE: "material", NAME: "제품 소재" },
    // 제품 사이즈
    SIZE: { CODE: "size", NAME: "제품 사이즈" },
    // 제품 개수
    NUMBER: { CODE: "number", NAME: "제품 개수" },
    // 단체 컷
    IS_ALL_CUT: { CODE: "is_all_cut", NAME: "단체 컷" },
    IS_NUKKI_ALL_CUT: { CODE: "is_nukki_all_cut", NAME: "누끼 단체컷" },
    IS_DIRECTING_ALL_CUT: { CODE: "is_directing_all_cut", NAME: "연출 단체컷" },
    //
    NUKKI_NEED_ALL_CUT: { CODE: "nukki_need_all_cut", NAME: "필요 누끼 단체 컷수" },
    DIRECTING_NEED_ALL_CUT: { CODE: "directing_need_all_cut", NAME: "필요 연출 단체 컷수" },
    // 제품 당 필요 누끼 컷수
    P_P_NUKKI_NUMBER: { CODE: "p_p_nukki_number", NAME: "제품 당 필요 누끼 컷수" },
    // 연출 종류
    DIRECTING_KIND: { CODE: "directing_kind", NAME: "연출 종류" },
    // 필요 연출 총 컷수
    DIRECTING_NUMBER: { CODE: "directing_number", NAME: "필요 연출 총 컷수" },
    // 연출촬영 제품 개수
    DIRECTING_PRODUCT_NUMBER: { CODE: "directing_product_number", NAME: "연출촬영 제품 개수" },
    PROXY_DIRECTING_KIND: { CODE: "proxy_directing_kind", NAME: "대행연출 종류" },
    // 촬영 대행 시간
    PROXY_TIME: { CODE: "proxy_time", NAME: "촬영 대행 시간" },
    // 필요 컷수
    NEED_NUMBER: { CODE: "need_number", NAME: "필요 컷수" },
    // 익스테리어
    IS_EXTERIOR: { CODE: "is_exterior", NAME: "익스테리어" },
    // 익스테리어 필요 컷수
    EXTERIOR_NUMBER: { CODE: "exterior_number", NAME: "익스테리어 필요 컷수" },
    // 내부 컷 합성
    INSIDE_CUT_COMPOSE: { CODE: "inside_cut_compose", NAME: "내부 컷 합성" },
    // 내부 합성 필요 컷수
    INSIDE_COMPOSE_NUMBER: { CODE: "inside_compose_number", NAME: "내부 합성 필요 컷수" },
    // 누끼 종류
    NUKKI_KIND: { CODE: "nukki_kind", NAME: "누끼 종류" },
    // 누끼 촬영 의상 수
    NUKKI_CLOTHES_NUMBER: { CODE: "nukki_clothes_number", NAME: "누끼 촬영 의상 수" },
    // 누끼촬영 제품 개수
    NUKKI_PRODUCT_NUMBER: { CODE: "nukki_product_number", NAME: "누끼촬영 제품 개수" },
    // 누끼 촬영 의상 당 필요 갯수
    N_CLOTHES_P_NUMBER: { CODE: "n_clothes_p_number", NAME: "의상 당 누끼 촬영 필요 컷수" },
    // 모델 촬영 의상 수
    MODEL_CLOTHES_NUMBER: { CODE: "model_clothes_number", NAME: "모델 촬영 의상 수" },
    // 리터치 추가
    IS_RETOUCH_ADD: { CODE: "is_retouch_add", NAME: "리터치 추가" },
    // 필요 리터치 컷수
    RETOUCH_NUMBER: { CODE: "retouch_number", NAME: "필요 리터치 컷 수" },
    // 모델 섭외
    MODEL_CASTING: { CODE: "model_casting", NAME: "모델 섭외" },
    // 헤어 메이크업 섭외
    H_M_CASTING: { CODE: "h_m_casting", NAME: "헤어 메이크업 섭외" },
    // 디테일 컷
    IS_DETAIL_CUT: { CODE: "is_detail_cut", NAME: "디테일 컷" },
    // 필요 디테일 컷수
    DETAIL_NUMBER: { CODE: "detail_number", NAME: "필요 디테일 컷 수" },
    // 누끼컷 추가
    IS_NUKKI_ADD: { CODE: "is_nukki_add", NAME: "누끼컷 추가" },
    // 촬영 인원
    PERSON_NUMBER: { CODE: "person_number", NAME: "촬영 인원" },
    // 단체 촬영
    IS_ALL_SHOT: { CODE: "is_all_shot", NAME: "단체 촬영" },
    // 단체 컷수
    ALL_CUT_NUMBER: { CODE: "all_cut_number", NAME: "단체 컷수" },
    // 영상 길이
    VIDEO_LENGTH: { CODE: "video_length", NAME: "영상 길이" },
    // 배우 섭외
    ACTOR_CASTING: { CODE: "actor_casting", NAME: "배우 섭외" },
    // 기획 및 콘티
    PLAN_CONTI: { CODE: "plan_conti", NAME: "플랜 및 콘티" },
    // 인터뷰 촬영 인원
    INTERVIEW_PERSON: { CODE: "interview_person", NAME: "인터뷰 촬영 인원" },
    // 단체사진 필요 컷수
    ALL_SHOT_NEED_NUMBER: { CODE: "all_shot_need_number", NAME: "단체사진 필요 컷수" },
    // 영상 편집
    VIDEO_DIRECTING: { CODE: "video_directing", NAME: "영상 편집" },
    // 편집 영상 시간
    VIDEO_DIRECTING_TIME: { CODE: "video_directing_time", NAME: "편집 영상 시간" },
    // 자막
    SUBSCRIBE: { CODE: "subscribe", NAME: "자막" },
    // 전체가격
    TOTAL_PRICE: { CODE: "total_price", NAME: "총가격" },
    /// test
    NOTE: { CODE: "note", NAME: "상품정보" },
    PROXY_NUMBER: { CODE: "proxy_number", NAME: "촬영대행 제품 수" },
    DIRECTING_PROXY: { CODE: "directing_proxy", NAME: "연출 대행" },
    DIRECTING_PROXY_NUMBER: { CODE: "directing_proxy_number", NAME: "연출대행 제품 수" }
};

const ADVICE_EXTRA_TEXT = {
    // ==== 촬영 종류 =======
    PHOTO_ONLY: { CODE: "photo_only", NAME: "사진만" },
    VIDEO_ONLY: { CODE: "video_only", NAME: "영상만" },
    VIDEO_TOGETHER: { CODE: "video_together", NAME: "사진+영상" },
    NUKKI_SHOT: { CODE: "nukki_shot", NAME: "누끼촬영", SUB_CODE: "nukki" },
    DIRECTING_SHOT: { CODE: "directing_shot", NAME: "연출촬영", SUB_CODE: "directing" },
    OUTSIDE_SHOT: { CODE: "outside_shot", NAME: "출장촬영" },
    N_PLUS_D_SHOT: { CODE: "n_plus_d_shot", NAME: "누끼+연출", SUB_CODE: "directing" },
    NUKKI: { CODE: "nukki", NAME: "누끼", SUB_CODE: "nukki" },
    MODEL_SHOT: { CODE: "model_shot", NAME: "모델촬영", SUB_CODE: "model" },
    N_PLUS_M_SHOT: { CODE: "n_plus_m_shot", NAME: "누끼+모델", SUB_CODE: "model" },
    // ==== 누끼 종류 ======
    FLOOR_NUKKI: { CODE: "floor_nukki", NAME: "바닥누끼" },
    MANNEQUIN_NUKKI: { CODE: "mannequin_nukki", NAME: "마네킹누끼" },
    GHOST_CUT: { CODE: "ghost_cut", NAME: "고스트컷" },
    // ==== 장소 ========
    SEOUL: { CODE: "seoul", NAME: "서울" },
    GYEONGGI: { CODE: "gyeonggi", NAME: "경기" },
    ETC: { CODE: "etc", NAME: "기타" },
    STUDIO: { CODE: "studio", NAME: "스튜디오" },
    OUTSIDE_S: { CODE: "outside_s", NAME: "출장(서울)" },
    OUTSIDE_E: { CODE: "outside_e", NAME: "출장(서울 외)" },
    // ==== 사이즈 ======
    SMALL: { CODE: "small", NAME: "소형" },
    LARGE: { CODE: "large", NAME: "대형" },
    // ==== 소재 =======
    GLOSS: { CODE: "gloss", NAME: "유광" },
    GLOSSLESS: { CODE: "glossless", NAME: "무광" },
    // ==== 필요 / 불필요 여부 =======
    NEED: { CODE: "need", NAME: "필요" },
    NEEDLESS: { CODE: "needless", NAME: "불필요" },
    // ==== 연출 종류 =======
    BASIC: { CODE: "basic", NAME: "기본연출" },
    CONCEPT: { CODE: "concept", NAME: "컨셉연출" },
    PROXY: { CODE: "proxy", NAME: "촬영대행" },
    COMPOSE: { CODE: "compose", NAME: "합성연출" },
    // ==== 포토그래퍼 인원 ======
    ONE_PERSON: { CODE: "one_person", NAME: "1인" },
    TWO_PERSON: { CODE: "two_person", NAME: "2인" },
    THREE_PERSON: { CODE: "three_person", NAME: "3인이상" },
    // ==== 포토존 여부 ======
    NOT_ZONE: { CODE: "not_zone", NAME: "포토존 없음" },
    HAS_ZONE: { CODE: "has_zone", NAME: "포토존 있음" },
    // ==== 영상 종류 ======
    VIRAL_VIDEO: { CODE: "viral_video", NAME: "바이럴영상촬영" },
    INTERVIEW_VIDEO: { CODE: "interview_video", NAME: "인터뷰영상촬영" },
    //
    EXTERIOR_NUMBER: { CODE: "exterior_number", NAME: "익스테리어 필요 컷수" },
    INSIDE_COMPOSE_NUMBER: { CODE: "inside_compose_number", NAME: "내부 합성 필요 컷수" },
    // ==== 촬영 대행 종류 =====
    SHOT_PROXY: { CODE: "shot_proxy", NAME: "촬영 대행" },
    DIRECTING_PROXY: { CODE: "directing_proxy", NAME: "연출 대행" },
    DIRECTING_SHOT_PROXY: { CODE: "directing_shot_proxy", NAME: "연출촬영 대행" }
};

// const VIRCUAL_PROPERTY = {
//     TOTAL_TIME: { CODE: "total_time", NAME: "총 촬영시간" },
//     SHOT_KIND: { CODE: "shot_kind", NAME: "촬영종류" },
//     PERSON: { CODE: "person", NAME: "포토그래퍼 인원" },
//     PHOTOZONE: { CODE: "photozon", NAME: "포토존 여부" },
//     PLACE: { CODE: "place", NAME: "촬영지역" }
// };

const SHOT_KIND_PROPERTY = {
    PHOTO_ONLY: { CODE: "photo_only", NAME: "사진만" },
    VIDEO_ONLY: { CODE: "video_only", NAME: "영상만" },
    VIDEO_TOGETHER: { CODE: "video_together", NAME: "사진+영상" },
    NUKKI_SHOT: { CODE: "nukki_shot", NAME: "누끼촬영", SUB_CODE: "nukki" },
    DIRECTING_SHOT: { CODE: "directing_shot", NAME: "연출촬영", SUB_CODE: "directing" },
    OUTSIDE_SHOT: { CODE: "outside_shot", NAME: "출장촬영" },
    N_PLUS_D_SHOT: { CODE: "n_plus_d_shot", NAME: "누끼+연출", SUB_CODE: "directing" },
    NUKKI: { CODE: "nukki", NAME: "누끼", SUB_CODE: "nukki" },
    MODEL_SHOT: { CODE: "model_shot", NAME: "모델촬영", SUB_CODE: "model" },
    N_PLUS_M_SHOT: { CODE: "n_plus_m_shot", NAME: "누끼+모델", SUB_CODE: "model" },
    VIRAL_VIDEO: { CODE: "viral_video", NAME: "바이럴영상촬영" },
    INTERVIEW_VIDEO: { CODE: "interview_video", NAME: "인터뷰영상촬영" }
};

const NUKKI_KIND_PROPERTY = {
    FLOOR_NUKKI: { CODE: "floor_nukki", NAME: "바닥누끼" },
    MANNEQUIN_NUKKI: { CODE: "mannequin_nukki", NAME: "마네킹누끼" },
    GHOST_CUT: { CODE: "ghost_cut", NAME: "고스트컷" }
};

const PLACE_PROPERTY = {
    SEOUL: { CODE: "seoul", NAME: "서울" },
    GYEONGGI: { CODE: "gyeonggi", NAME: "경기" },
    ETC: { CODE: "etc", NAME: "기타" },
    STUDIO: { CODE: "studio", NAME: "스튜디오내방" },
    OUTSIDE: { CODE: "outside", NAME: "출장" },
    OUTSIDE_S: { CODE: "outside_s", NAME: "출장(서울)" },
    OUTSIDE_E: { CODE: "outside_e", NAME: "출장(서울 외)" },
};

const SIZE_PROPERTY = {
    SMALL: { CODE: "small", NAME: "소형" },
    LARGE: { CODE: "large", NAME: "대형" }
};

const MATERIAL_PROPERTY = {
    GLOSS: { CODE: "gloss", NAME: "유광" },
    GLOSSLESS: { CODE: "glossless", NAME: "무광" }
};

const HAS_PROPERTY = {
    NEED: { CODE: "need", NAME: "필요" },
    NEEDLESS: { CODE: "needless", NAME: "불필요" }
};

const DIRECTING_PROPERTY = {
    BASIC: { CODE: "basic", NAME: "기본연출" },
    CONCEPT: { CODE: "concept", NAME: "컨셉연출" },
    PROXY: { CODE: "proxy", NAME: "대행연출" },
    DIRECTING_PROXY: { CODE: "directing_proxy", NAME: "연출대행" },
    COMPOSE: { CODE: "compose", NAME: "합성연출" }
};

const PERSON_PROPERTY = {
    ONE_PERSON: { CODE: "one_person", NAME: "1인" },
    TWO_PERSON: { CODE: "two_person", NAME: "2인" },
    THREE_PERSON: { CODE: "three_person", NAME: "3인이상" }
};

const PHOTOZONE_PROPERTY = {
    NOT_ZONE: { CODE: "not_zone", NAME: "포토존 없음" },
    HAS_ZONE: { CODE: "has_zone", NAME: "포토존 있음" }
};

const PROXY_DIRECTING_PROPERTY = {
    SHOT_PROXY: { CODE: "shot_proxy", NAME: "촬영 대행" },
    DIRECTING_PROXY: { CODE: "directing_proxy", NAME: "연출대행" },
    DIRECTING_SHOT_PROXY: { CODE: "directing_shot_proxy", NAME: "연출촬영 대행" }
};

const ADVICE_TYPE = {
    FORSNAP: { CODE: "forsnap", NAME: "포스냅 상담신청" },
    ARTIST: { CODE: "artist", NAME: "작가직접 상담신청" }
};

const ADD_ARTIST_TYPE = {
    LIST: { CODE: "list", NAME: "리스트" },
    ESTIMATE: { CODE: "estimate", NAME: "견적" }
};

const RECOMMEND_ACCESS_TYPE = {
    LIST: { CODE: "list", NAME: "리스트" },
    LIST_ADD: { CODE: "list_add", NAME: "리스트_추가" },
    ESTIMATE: { CODE: "estimate", NAME: "견적" },
    ESTIMATE_ADD: { CODE: "estimate_add", NAME: "견적_추가" },
    DETAIL: { CODE: "detail", NAME: "상세" },
    DETAIL_ADD: { CODE: "detail_add", NAME: "상세_추가" }
};

const IMAGE_PATH = "/products/list";

export {
    CATEGORY_KEYS,
    PROPERTYS,
    ADVICE_EXTRA_TEXT,
    SHOT_KIND_PROPERTY,
    NUKKI_KIND_PROPERTY,
    PLACE_PROPERTY,
    SIZE_PROPERTY,
    MATERIAL_PROPERTY,
    HAS_PROPERTY,
    DIRECTING_PROPERTY,
    PERSON_PROPERTY,
    PHOTOZONE_PROPERTY,
    PROXY_DIRECTING_PROPERTY,
    IMAGE_PATH,
    ADVICE_TYPE,
    ADD_ARTIST_TYPE,
    RECOMMEND_ACCESS_TYPE
};
