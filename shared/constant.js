import * as SNS from "./constant/sns.const";
import * as TICKET from "./constant/ticket.const";
import * as PACKAGE from "./constant/package.const";

const FORSNAP_UUID = "FORSNAP_UUID";

/**
 * 리다이렉트를 위한 로컬스토리지 키
 * @type {string}
 */
const FORSNAP_REDIRECT = "FORSNAP_REDIRECT";

/**
 * 유저 인증 및 보안을 위한 정보
 * @type {{ID: string, DATA: string, API_TOKEN: string, CSRF_TOKEN: string}}
 */
const USER = {
    ID: "FORSNAP_USER_ID",
    API_TOKEN: "FORSNAP_API_TOKEN",
    DATA: "FORSNAP_USER_DATA",
    USER_AUTO: "FORSNAP_USER_AUTO",
    CSRF_TOKEN: "FORSNAP_CSRF_TOKEN",
    ENTER: "ENTER",
    PHONE_CODE: "FORSNAP_PHONE_CODE"
};

const BANK = [
    { name: "경남은행", value: "039" },
    { name: "광주은행", value: "034" },
    { name: "국민은행", value: "004" },
    { name: "기업은행", value: "003" },
    { name: "농협", value: "011" },
    { name: "대구은행", value: "031" },
    { name: "부산은행", value: "032" },
    { name: "산업은행", value: "002" },
    { name: "상호저축은행", value: "050" },
    { name: "새마을금고", value: "045" },
    { name: "수협은행", value: "007" },
    { name: "신한은행", value: "088" },
    { name: "신협", value: "048" },
    { name: "씨티은행", value: "027" },
    { name: "우리은행", value: "020" },
    { name: "우체국", value: "071" },
    { name: "전북은행", value: "037" },
    { name: "제주은행", value: "035" },
    { name: "카카오뱅크", value: "090" },
    { name: "하나은행", value: "081" },
    { name: "SC제일", value: "023" }
    // { name: "도이치", value: "055" },
    // { name: "미쓰비시", value: "059" },
    // { name: "미즈호", value: "058" },
    // { name: "아메리카", value: "060" },
    // { name: "ABN암로", value: "056" },
    // { name: "HSBC", value: "054" },
    // { name: "JP모간", value: "057" }
];

const REFUND_BANK = [
    { name: "KB국민은행", value: "04" },
    { name: "SC제일은행", value: "23" },
    { name: "경남은행", value: "39" },
    { name: "광주은행", value: "34" },
    { name: "기업은행", value: "03" },
    { name: "농협", value: "11" },
    { name: "대구은행", value: "31" },
    { name: "부산은행", value: "32" },
    { name: "산업은행", value: "02" },
    { name: "새마을금고", value: "45" },
    { name: "수협", value: "07" },
    { name: "신한은행", value: "88" },
    { name: "신협", value: "48" },
    { name: "외한은행", value: "05" },
    { name: "우리은행", value: "20" },
    { name: "우체국", value: "71" },
    { name: "전북은행", value: "37" },
    { name: "축협", value: "16" },
    { name: "하나은행(서울은행)", value: "81" },
    { name: "한국씨티은행(한미은행)", value: "53" }
];

const AREA_CODE = [
    { name: "010", value: "010", region: "핸드폰번호" },
    { name: "02", value: "02", region: "서울특별시" },
    { name: "031", value: "031", region: "경기도" },
    { name: "032", value: "032", region: "인천광역시" },
    { name: "033", value: "033", region: "강원도" },
    { name: "041", value: "041", region: "충청남도" },
    { name: "042", value: "042", region: "대전광역시" },
    { name: "043", value: "043", region: "충청북도" },
    { name: "044", value: "044", region: "세종특별자치시" },
    { name: "051", value: "051", region: "부산광역시" },
    { name: "052", value: "052", region: "울산광역시" },
    { name: "053", value: "053", region: "대구광역시" },
    { name: "054", value: "054", region: "경상북도" },
    { name: "061", value: "061", region: "경상남도" },
    { name: "055", value: "055", region: "전라남도" },
    { name: "062", value: "062", region: "광주광역시" },
    { name: "063", value: "063", region: "전라북도" },
    { name: "064", value: "064", region: "제주특별자치시" },
    { name: "070", value: "070", region: "인터넷전화" },
    { name: "011", value: "011", region: "핸드폰번호" },
    { name: "016", value: "016", region: "핸드폰번호" },
    { name: "018", value: "018", region: "핸드폰번호" },
    { name: "019", value: "019", region: "핸드폰번호" }
];

const PRODUCT = {
    SERVICE_TYPE: [
        { value: "ORIGIN", name: "원본데이터형", order: 1, caption: "촬영 원본만 전달하는 옵션입니다." },
        { value: "CUSTOM", name: "보정데이터형", order: 2, caption: "촬영 원본과 보정본을 전달하는 옵션입니다." },
        { value: "PRINT", name: "인화형", order: 3, caption: "촬영 원본, 보정본, 인화사진을 전달하는 옵션입니다." },
        { value: "DIRECT", name: "작가직접입력", order: 4, caption: "촬영 원본, 보정본, 인화사진등 옵션을 직접 정하실 수 있습니다." }
    ]
};

const BREADCRUMB = {
    RESERVE_TYPE: [
        { title: "예약완료", caption: "예약요청이 왔습니다. 확인해주세요.", name: "예약단계", status: "예약완료", value: "READY", icon: "calendar_l", count: 0 },
        { title: "입금완료", caption: "입금이 확인되었습니다. 확인해주세요.", name: "결제단계", status: "입금완료", value: "PAYMENT", icon: "creditcard", count: 0 },
        { title: "촬영준비중", caption: "촬영준비중을 고객에게 알려주세요.", name: "준비단계", status: "촬영준비중", value: "PREPARE", icon: "market", count: 0 },
        { title: "촬영완료", caption: "사진준비중을 고객에게 알려주세요.", name: "촬영단계", status: "촬영완료", value: "SHOT", icon: "camera", count: 0 },
        { title: "원본사진전달", caption: "촬영사진을 고객에게 전달해주세요.", name: "원본전달", status: "원본사진전달", value: "UPLOAD", icon: "heart_bag", count: 0 },
        { title: "보정사진요청", caption: "촬영사진을 고객에게 전달해주세요.", name: "보정전달", status: "보정사진전달", value: "CUSTOM", icon: "heart_hand", count: 0 },
        { title: "최종전달", caption: "고객님이 촬영완료 처리를 하였습니다.", name: "최종전달", status: "최종전달", value: "COMPLETE", icon: "receipt", count: 0 }
    ],
    SEND_TYPE: [
        { title: "예약완료", caption: "예약요청 진행중이에요. 조금만 기다려 주세요.", name: "예약단계", currProg: "예약완료", value: "READY", icon: "calendar_l", count: 0 },
        { title: "입금완료", caption: "작가님이 확인중입니다. 조금만 기다려 주세요.", name: "결제단계", currProg: "입금확인", value: "PAYMENT", icon: "creditcard", count: 0 },
        { title: "촬영준비중", caption: "작가님이 촬영 준비중 입니다. 좋은 촬영 되세요", name: "준비단계", currProg: "촬영준비중", value: "PREPARE", icon: "market", count: 0 },
        { title: "촬영완료", caption: "촬영이 완료되었습니다. 촬영한 사진을 전달할 예정이에요.", name: "촬영단계", currProg: "사진준비중", value: "SHOT", icon: "camera", count: 0 },
        { title: "사진전달", caption: "두근두근~원본사진이 도착했습니다.", name: "사진전달", currProg: "원본전달", value: "UPLOAD", icon: "heart_bag", count: 0 },
        { title: "보정전달", caption: "보정사진이 도착했어요. 아름다운 순간이 되셨기를 바래요.", name: "보정전달", currProg: "보정완료", value: "CUSTOM", icon: "heart_hand", count: 0 },
        { title: "최종전달", caption: "해당 정보는 현재 페이지에 7일간 유지되며 이후 서비스 이용내역에서 확인하실 수 있습니다.", name: "최종전달", currProg: "최종완료", value: "COMPLETE", icon: "receipt", count: 0 }
    ],
    M_SEND_TYPE: [
        { title: "예약완료", name: "예약 완료", value: "READY", count: 0 },
        { title: "입금완료", name: "입금 완료", value: "PAYMENT", count: 0 },
        { title: "촬영준비중", name: "촬영 준비중", value: "PREPARE", count: 0 },
        { title: "촬영완료", name: "촬영 완료", value: "SHOT", count: 0 },
        { title: "사진전달", name: "사진 전달", value: "UPLOAD", count: 0 },
        { title: "보정전달", name: "보정 전달", value: "CUSTOM", count: 0 },
        { title: "최종전달", name: "최종 전달", value: "COMPLETE", count: 0 }
    ]
};

const NOTIFY = {
    SERVICE_TYPE: {
        TALK: { icon: "", name: "", value: "TALK", title: "", reserve_type: "talk" },
        READY: { icon: "noti_schedule", name: "예약이 완료되었습니다.", value: "READY", title: "", reserve_type: "ready" }, //예약단계
        PAYMENT: { icon: "noti_receipt", name: "결제가 완료되었습니다.", value: "PAYMENT", title: "", reserve_type: "payment" }, //결제단계
        PREPARE: { icon: "noti_schedule", name: "작가님이 촬영 준비 중입니다.", value: "PREPARE", title: "", reserve_type: "prepare" }, //준비단계
        SHOOT: { icon: "noti_schedule", name: "작가님이 사진을 준비 중입니다.", value: "SHOOT", title: "", reserve_type: "shoot" }, //촬영단계
        SEND: { icon: "noti_picture", name: "사진이 도착했습니다.", value: "SEND", title: "", reserve_type: "upload" }, // 전달단계
        REQ_CUSTOM: { icon: "noti_picture", name: "보정사진 선택이 완료되었습니다.", value: "REQ_CUSTOM", title: "", reserve_type: "custom" }, // 보정 요청 단계
        RES_CUSTOM: { icon: "noti_picture", name: "보정사진이 도착했습니다.", value: "RES_CUSTOM", title: "", reserve_type: "custom" }, // 보정 응답 단계
        COMPLETE: { icon: "noti_receipt", name: "구매가 최종 완료 되었습니다.", title: "", value: "COMPLETE", reserve_type: "complete" }, // 최종완료
        CANCEL: { icon: "noti_receipt", name: "예약이 취소되었습니다.", value: "CANCEL", title: "", reserve_type: "ready" }, // 취소
        REVIEW: { icon: "noti_customer", name: "리뷰가 등록되었습니다.", value: "REVIEW", title: "", reserve_type: "complete" }, // 리뷰 등록
        ANSWER: { icon: "noti_customer", name: "고객센터", value: "ANSWER", title: "문의내용 답변완료", reserve_type: "talk" }, // 문의하기
        HELP: { icon: "noti_customer", name: "고객센터", value: "HELP", title: "포스냅 공지, 서비스 알림, 1:1문의상담", reserve_type: "talk" }, // 문의하기
        HELP_OFFER: { icon: "noti_customer", name: "견적문의", talk_name: "문의답변", value: "HELP_OFFER", title: "포스냅 1:1견적상담", reserve_type: "talk" }, // 문의하기
        BLOCK: { icon: "noti_customer", name: "상품이 관리자에 블럭 되었습니다.", value: "BLOCK", title: "상품이 관리자에 블럭 되었습니다.", reserve_type: "talk" }, // 상품 블럭
        BLOCK_CLEAR: { icon: "noti_customer", name: "상품이 관리자에 블럭 해제되었습니다.", value: "BLOCK_CLEAR", title: "상품이 관리자에 블럭 해제되었습니다.", reserve_type: "talk" }, // 상품 블럭 해제
        COLLABO: { icon: "noti_customer", name: "그룹대화", value: "COLLABO", title: "", reserve_type: "talk" }, // 콜라보
        OFFER: { icon: "noti_customer", name: "견적문의", value: "OFFER", title: "문의내용 답변완료", reserve_type: "talk" }, // 견적서
        OFFER_TALK: { icon: "noti_customer", name: "견적대화", value: "OFFER_TALK", title: "", reserve_type: "talk" }, // 견적서 대화
        REQ_COMPLETE: { icon: "noti_picture", name: "사진전달이 완료 되었습니다.", value: "REQ_COMPLETE", title: "", reserve_type: "upload" } // 견적서 대화
    },
    ARTISTS_MAIN: [
        { value: "READY", name: "예약", caption: "대기중인", key: "cancel_cnt", count: 0, link: "/artists/photograph/process" },
        { value: "SHOOTING", name: "촬영", caption: "진행중인", key: "shooting", count: 0, link: "/artists/photograph/process" },
        { value: "TALK", name: "메시지", caption: "미응답", key: "talk_cnt", count: 0, link: "/artists/chat" },
        { value: "PRODUCT", name: "상품", caption: "등록한", key: "product_cnt", count: 0, link: "/artists/product/list" }
    ],
    INFO_MAIN: [
        { CODE: "TALK_GROUP_CNT", NAME: "문의수", CAPTION: "누적", COUNT: 0, LINK: "/artists/chat" },
        { CODE: "RESERVE_PREPARE_CNT", NAME: "촬영건수", CAPTION: "누적", COUNT: 0, LINK: "/artists/calculate" },
        { CODE: "TOTAL_PRICE", NAME: "촬영금액", CAPTION: "누적", COUNT: 0, LINK: "/artists/calculate" }
    ],
    MESSAGE: {
        ARTIST: {
            TALK: { type1: "대화" },
            READY: { type1: "예약이 완료되었습니다." },
            PAYMENT: { type1: "결제가 완료되었습니다." },
            PREPARE: { type1: "촬영 준비중입니다." },
            SHOOT: { type1: "촬영일" },
            SEND: { type1: "사진을 전달했습니다." },
            REQ_CUSTOM: { type1: "보정요청" },
            RES_CUSTOM: { type1: "보정완료" },
            COMPLETE: { type1: "최종완료" },
            CANCEL: { type1: "예약취소" },
            REVIEW: { type1: "후기" },
            ANSWER: { type1: "답변" }
        },
        USER: {
            TALK: { type1: "유저대화" },
            READY: { type1: "예약이 완료되었습니다." },
            PAYMENT: { type1: "결제완료" },
            PREPARE: { type1: "촬영준비" },
            SHOOT: { type1: "촬영중" },
            SEND: { type1: "사진받음" },
            REQ_CUSTOM: { type1: "보정요청" },
            RES_CUSTOM: { type1: "보정받음" },
            COMPLETE: { type1: "최종완료" },
            CANCEL: { type1: "예약취소" },
            REVIEW: { type1: "후기" },
            ANSWER: { type1: "답변" }
        }
    }
};

const HELPSERVICEINFO = [
    { value: "MEMBER", caption: "회원안내" },
    { value: "CANCEL", caption: "취소/환불안내" },
    { value: "PAY", caption: "결제안내" },
    { value: "USE", caption: "사이트 이용안내" },
    { value: "PAPERS", caption: "거래증빙서류 안내" }
];

const DISPATCHER = {
    HEADER_USER_UPDATE: "HEADER_USER_UPDATE",
    CHAT_MESSAGES: "CHAT_MESSAGES",
    CHAT_MESSAGES_UPDATE: "CHAT_MESSAGES_UPDATE",
    ARTISTS_SCHEDULE_UPDATE: "ARTISTS_SCHEDULE_UPDATE",
    BUSINESS_CUSTOMER_UPDATE: "BUSINESS_CUSTOMER_UPDATE"
};

const PROGRESS = {
    COLOR_CAT: "/common/loading.gif?v=185630"
};

const DEFAULT_IMAGES = {
    PROFILE: "/common/default_profile_img.jpg",
    BACKGROUND: "/common/forsnap_bg_default.jpg",
    M_BACKGROUND: "/mobile/common/forsnap_bg_default.jpg"
};

const GENDER = {
    SERVICE_TYPE: [
        { value: "", name: "성별을 선택해 주세요." },
        { value: "W", name: "여성" },
        { value: "M", name: "남성" }
    ],
    GENDER_NAME: {
        "W": "여자",
        "M": "남자"
    }
};

const ARTIST_LAYOUT = {
    CONTAINER_LEFT_WIDTH: 250,
    CONTAINER_RIGHT_WIDTH: 328,
    CONTAINER_CENTER_WIDTH: 958
};

const PAY_METHOD = {
    "card": { name: "신용카드", value: "card" },
    "trans": { name: "계좌이체", value: "trans" },
    "vbank": { name: "무통장 입금", value: "vbank" }
};

const PRODUCT_STATUS = {
    SERVICE_TYPE: [
        { value: "READY", status_artist: "예약완료" },
        { value: "PAYMENT", status_artist: "입금완료" },
        { value: "PREPARE", status_artist: "촬영준비중" },
        { value: "SHOT", status_artist: "촬영완료" },
        { value: "UPLOAD", status_artist: "원본사진전달" },
        { value: "CUSTOM", status_artist: "보정사진전달" },
        { value: "COMPLETE", status_artist: "최종전달" },
        { value: "REQ_COMPLETE", status_artist: "최종완료예정" },
        { value: "CANCEL", status_artist: "예약취소" },
        { value: "RESERVE", status_artist: "예약완료" },
        { value: "SEND", status_artist: "원본사진전달" },
        { value: "REQ_CUSTOM", status_artist: "보정사진요청" },
        { value: "RES_CUSTOM", status_artist: "보정사진전달" },
        { value: "REVIEW", status_artist: "후기등록" },
        { value: "ANSWER", status_artist: "문의" }
    ]
};

const FORSNAP_TEXT = {
    TERMS_OF_OBEDIENCE: {
        title: "서비스 이용 준수사항",
        content: "작가상품 등록 시 판매가격은 부가가치세 수수료 포함가격으로 입력하세요.\n등록된 사진은 포스냅 SNS에 광고용으로 게시될 수 있습니다.\n상품등록 시 스튜디오명, 연락처, 이메일 노출하여 직거래를 유도할 경우 서비스 이용에 즉각 제재를 받을 수 있습니다."
    }
};

const EXCEPT = {
    SESSION_INFO_MATCH: [
        "/talks/[\\w]+/help",
        "/snssync"
    ]
};

const TEXT = {
    DIRECT_PREVENT: "개인의 연락처를 공개하지 마세요. 촬영이 확정되면 공개됩니다.",
    DIRECT_PREVENT_MOBILE: "개인의 연락처를 공개하지 마세요. 촬영이 확정되면 공개됩니다.",
    DIRECT_PREVENT_ARTIST: "스튜디오명, 연락처, 사이트주소, 외부아이디(카카오톡,인스타그램 등) 등을 노출하거나 직거래를 유도하는경우 서비스 이용에 즉각 제재를 받을 수 있습니다.",
    DIRECT_PREVENT_ARTIST_MOBILE: "연락처를 노출하여 직거래를 유도할 경우 서비스 이용에 즉각 제재를 받을 수 있습니다."
};

const ESTIMATE_ABOUT = {
    HEADER: {
        title: "촬영요청이란?",
        description: "고객이 요청한 촬영에 대해 작가님의 견적서를 받아 촬영으로 연결해드리는 시스템입니다."
    },
    STEP: {
        title: "촬영요청 진행단계",
        description: "포스냅으로 접수된 상담 건 중 고객님께 더욱 잘 맞는 작가님을 안내해드리기 위해 촬영 내용을 정리하여 촬영요청으로 등록하고 있습니다.",
        step: [
            { no: "01", text: "고객상담", src: "/estimate/est_img_01.png" },
            { no: "02", text: "포스냅이 촬영요청 등록", src: "/estimate/est_img_02.png" },
            { no: "03", text: "작가님의 견적서 작성", src: "/estimate/est_img_03.png?v=20181011" },
            { no: "04", text: "고객이 견적서 선택 및 예약", src: "/estimate/est_img_04.png?v=20181011" }
        ]
    },
    TIP: {
        title: "견적서 작성 전 꼭 읽어주세요.",
        tip: [
            {
                no: 1,
                title: "상품 혹은 포트폴리오 등록 필수",
                // text: "\t촬영요청에 대한 견적서를 작성하기 위해서는 촬영요청과 같은 촬영의 판매중인 상품이 필요합니다.\n" +
                // "\t해당 카테고리의 상품 등록이 어려운 경우(포트폴리오를 외부로 노출할 수 없는 경우 등)\n" +
                // "\t비노출 포트폴리오로 견적서 작성 가능합니다. (작가페이지 > 상품관리 > 비노출 포트폴리오)",
                text: [
                    "촬영요청에 대한 견적서를 작성하기 위해서는 촬영요청과 같은 촬영의 판매중인 상품이 필요합니다.",
                    "해당 카테고리의 상품 등록이 어려운 경우(포트폴리오를 외부로 노출할 수 없는 경우 등)",
                    "비노출 포트폴리오로 견적서 작성 가능합니다. (작가페이지 > 상품관리 > 비노출 포트폴리오)"
                ],
                strong: false
            },
            {
                no: 2,
                title: "알림설정",
                // text: "\t원하는 카테고리의 촬영요청이 등록되면 알림톡으로 안내해드려요.\n" +
                // "\t작가페이지 > 계정관리 > 알림설정 에서 알림 수신 선택이 가능합니다.",
                text: [
                    "원하는 카테고리의 촬영요청이 등록되면 알림톡으로 안내해드려요.",
                    "작가페이지 > 계정관리 > 알림설정 에서 알림 수신 선택이 가능합니다."
                ],
                strong: false
            },
            {
                no: 3,
                title: "상세한 견적서 작성",
                // text: "\t촬영요청 내용에 적합하지 않은 견적내용과 포트폴리오는 반려될 수 있습니다.\n" +
                // "\t특히 견적금액 작성 시 상세견적없이 총 촬영비용만 작성되어 있는 경우 고객님께 전달되지 않습니다.",
                text: [
                    "촬영요청 내용에 적합하지 않은 견적내용과 포트폴리오는 반려될 수 있습니다.",
                    "특히 견적금액 작성 시 상세견적없이 총 촬영비용만 작성되어 있는 경우 고객님께 전달되지 않습니다."
                ],
                strong: true
            }
        ]
    }
};

const PRODUCTS_CATEGORY = [
    // {
    //     name: "광고",
    //     code: "AD",
    //     display_order: "3",
    //     tag: "스냅,베이비,웨딩",
    //     img: "/main/best_product/20170621/m_best_03.jpg"
    // },
    {
        name: "웨딩",
        code: "WEDDING",
        display_order: "1",
        tag: "돌,잔치,아기",
        img: "/main/best_product/20170621/m_best_07.jpg"
    },
    {
        name: "베이비",
        code: "BABY",
        display_order: "2",
        tag: "프로필,개인화보,컨셉",
        img: "/main/best_product/20170425/m_best_08.jpg"
    },
    {
        name: "스냅",
        code: "SNAP",
        display_order: "3",
        tag: "프로필,콜라쥬,아트작업",
        img: "/main/best_product/20170621/m_best_09.jpg"
    },
    {
        name: "개인프로필",
        code: "PROFILE",
        display_order: "4",
        tag: "상품,광고,음식",
        img: "/main/best_product/20170516/m_best_04.jpg"
    },
    {
        name: "행사",
        code: "EVENT",
        display_order: "5",
        tag: "행사,아기",
        img: "/main/best_product/20170621/m_best_05.jpg"
    },
    {
        name: "인테리어",
        code: "INTERIOR",
        display_order: "6",
        tag: "가족사진,기념사진,가족",
        img: "/main/best_product/20170621/m_best_06.jpg"
    },
    {
        name: "음식",
        code: "FOOD",
        display_order: "7",
        tag: "프로필,행사,인테리어",
        img: "/main/best_product/20170425/m_best_02.jpg"
    },
    {
        name: "제품",
        code: "PRODUCT",
        display_order: "8",
        tag: "상품,음식,광고",
        img: "/main/best_product/20170621/m_best_01.jpg"
    },
    {
        name: "영상",
        code: "VIDEO",
        display_order: "9",
        tag: "SNS,광고,홍보영상",
        img: "/main/best_product/20170621/m_best_01.jpg"
    },
    {
        name: "기업프로필",
        code: "PROFILE_BIZ",
        display_order: "11",
        tag: "임직원 / 사원프로필 / CEO",
        img: "/biz/category/profile_biz.jpg"
    },
    {
        name: "패션",
        code: "FASHION",
        display_order: "10",
        tag: "쇼핑몰촬영 / 룩북촬영 / 화보촬영",
        img: "/main/category/20180608/fasion.jpg"
    },
    {
        name: "의상대여",
        code: "DRESS_RENT",
        display_order: "13",
        tag: "드레스대여",
        img: "/main/category/20180608/fasion.jpg"
    },
    {
        name: "기업영상",
        code: "VIDEO_BIZ",
        display_order: "14",
        tag: "",
        img: ""
    }
];

// 유입 사이트 목록
export const INFLOW_REFERER = {
    NAVER_POWER: { code: "NAVER_POWER", name: "네이버 파워링크" },
    NAVER_SEARCH: { code: "NAVER_SEARCH", name: "네이버 검색" },
    NAVER_SHOPPING: { code: "NAVER_SHOPPING", name: "네이버 쇼핑" },
    NAVER_BLOG: { code: "NAVER_BLOG", name: "네이버 블로그" },
    NAVER_FORSNAP_BLOG: { code: "NAVER_FORSNAP_BLOG", name: "포스냅 블로그" },
    DAUM_SEARCH: { code: "DAUM_SEARCH", name: "다음 검색" },
    DAUM_SHOPPING: { code: "DAUM_SHOPPING", name: "다음 쇼핑" },
    FACEBOOK: { code: "FACEBOOK", name: "페이스북" },
    FACEBOOK_AD: { code: "FACEBOOK_AD", name: "페이스북 광고" },
    GOOGLE_AD: { code: "GOOGLE_AD", name: "구글 광고" }
};

export const BIZ_CUSTOMER = {
    NAVER: "naver",
    FACEBOOK: "facebook",
    INSTAGRAM: "instagram",
    DDN: "ddn",
    HEADER: "header",
    INFORMATION: "information"
};

export const PERSONAL_CUSTOMER = {
    INDI: "INDI"
};

export default {
    SNS,
    TICKET,
    FORSNAP_UUID,
    FORSNAP_REDIRECT,
    USER,
    PRODUCT,
    DISPATCHER,
    NOTIFY,
    BREADCRUMB,
    PROGRESS,
    GENDER,
    ARTIST_LAYOUT,
    PAY_METHOD,
    PRODUCT_STATUS,
    EXCEPT,
    FORSNAP_TEXT,
    BANK,
    DEFAULT_IMAGES,
    TEXT,
    ESTIMATE_ABOUT,
    PRODUCTS_CATEGORY,
    REFUND_BANK,
    PACKAGE,
    AREA_CODE,
    INFLOW_REFERER,
    BIZ_CUSTOMER,
    PERSONAL_CUSTOMER
};
