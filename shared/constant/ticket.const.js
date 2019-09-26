// 티켓 구매상태 코드
export const CODE = {
    READY: "READY",
    PAYMENT: "PAYMENT",
    USE: "USE",
    EXPIRE: "EXPIRE",
    CANCEL: "CANCEL"
};

// 티켓 결제상태 코드
export const PAYMENT_STATUS_CODE = {
    [CODE.READY]: { code: CODE.READEY, name: "결제대기" },
    [CODE.PAYMENT]: { code: CODE.PAYMENT, name: "사용가능" },
    [CODE.USE]: { code: CODE.USE, name: "사용완료" },
    [CODE.EXPIRE]: { code: CODE.EXPIRE, name: "기한만료" },
    [CODE.CANCEL]: { code: CODE.PAYMENT, name: "결제취소" }
};

// 티켓 리스트 필터 코드
export const TICKET_LIST_FILTER_CODE = {
    PAYMENT: { code: "PAYMENT", name: "사용 가능한 티켓" },
    ALL: { code: "ALL", name: "전체 티켓" }
};

export const TITLE_MAIN = "새로운 경험, 화보가 됩니다.\n[인생사진관 입장권]";
export const TITLE_SUB = "인천 상설1호점, 일산 상설2호점";

const version = "20171103";

// 티켓 상품 하드코딩
export const TICKET_PRODUCT = {
    product_1: {
        sub_title: TITLE_SUB,
        main_title: TITLE_MAIN,
        profile_img: "/life/life_profile.jpg",
        nick_name: "인생사진관",
        main_cover: "/life/20180105/life_main_cover.jpg",
        main_thumb: "/life/life_main_thumb.jpg",
        detail_thumb: "/life/life_thumb_8.jpg",
        img_detail_pc: "/life/life_detail_pc.jpg",
        img_detail_mobile: "/life/life_detail_mobile.jpg",
        //////
        img_detail_paj: "/life/life_detail_paj.jpg?v=20171101",
        img_detail_d_icn: "/life/life_detail_d_icn.jpg",
        img_detail_m_icn: "/life/life_detail_m_icn.jpg",
        img_detail_d_lsn: "/life/life_detail_d_lsn.jpg",
        img_detail_m_lsn: "/life/life_detail_m_lsn.jpg"
    }
};

export const DETAIL_IMG = {
    ICN: {
        desktop_img: `/life/life_detail_d_icn.jpg?v=${version}`,
        mobile_img: `/life/life_detail_m_icn.jpg?v=${version}`
    },
    LSN: {
        desktop_img: `/life/life_detail_d_lsn.jpg?v=${version}`,
        mobile_img: `/life/life_detail_m_lsn.jpg?v=${version}`
    },
    PAJ: {
        desktop_img: `/life/life_detail_paj.jpg?v=${version}`,
        mobile_img: `/life/life_detail_paj.jpg?v=${version}`
    },
    JNJ: {
        desktop_img: `/life/20180105/life_detail_jnj.jpg?v=${version}`,
        mobile_img: `/life/20180105/life_detail_jnj.jpg?v=${version}`
    }
};

export const DETAIL_THUMB = {
    ICN: {
        detail_thumb: "/life/life_thumb_8.jpg"
    },
    LSN: {
        detail_thumb: "/life/20171115/life_thumb_lsn.jpg"
    },
    PAJ: {
        detail_thumb: "/life/20171115/life_thumb_paj.jpg"
    },
    JNJ: {
        detail_thumb: "/life/life_thumb_7.jpg"
    }
};

export const OPTIONS_REGION = [
    { title: "인천점 상설 1호점", region: "인천", code: "ICN" },
    { title: "일산점 상설 2호점", region: "일산", code: "LSN" }
];

export const OPTIONS_TYPES = {
    ICN: [
        { code: "11", title: "주중1인입장권(월~금)", origin: "18000", price: "18000" },
        { code: "12", title: "주말/공휴일1인입장권(토~일)", origin: "18000", price: "18000" },
        { code: "13", title: "2인입장권(주중,주말 모두사용)", origin: "36000", price: "36000" },
        { code: "14", title: "청소년가 (주중,주말 모두사용)", origin: "18000", price: "18000" }
    ],
    LSN: [
        { code: "21", title: "오픈기념 할인 1인 입장권", origin: "18000", price: "18000" },
        { code: "22", title: "주중1인입장권(월~금)", origin: "18000", price: "18000" },
        { code: "23", title: "주말/공휴일1인입장권(토~일)", origin: "18000", price: "18000" },
        { code: "24", title: "2인입장권(주중,주말 모두사용)", origin: "36000", price: "36000" },
        { code: "25", title: "청소년가 (주중,주말 모두사용)", origin: "18000", price: "18000" }
    ]
};

export const OPTIONS_INFO = [
    "오픈기념 할인 1인 입장권의 경우, 오픈특가로 이벤트 한시적 권종이며, 티켓 사용기간은 9/22(금) ~ 10/22일(일) 까지만 사용 가능한 권종입니다."
];

export const TICKET_CONTENT = [
    {
        title: "티켓 사용정보",
        content: "유효기간 : 2017년 1월 20일(금) ~ 3월 5일(일)\n운영시간 : 11 : 00~19 : 00 (입장마감 18 : 00)\n킨텍스 제2전시장 1층 C5 상설점 7B홀 앞\n휴무 : 매주 월요일 / 5월 1일, 5월 8일은 정상운영"
    },
    {
        title: "업체정보",
        content: "문의 : 1544-1657\n주차 : 자체\n주소 : 경기도 고양시 일산서구 킨텍스로 217 - 60"
    },
    {
        title: "상품문의",
        content: "상품문의는 Q&A로 문의해 주세요."
    },
    {
        title: "취소 환불규정",
        content: "본 상품은 구매 후 7일 이내에만 환불이 가능합니다."
    }
];

export const TICKET_ADD_INST = {
    common: [
        // { key: "01", title: "*티켓구매", text: "1인당 구매가능수량 : 제한없음\n유효기간 : 2017년 12월 31일" },
        { key: 2, title: "*티켓사용안내", text: "-포스냅 사이트 로그인 후 마이페이지 내의 나의티켓 에서 티켓확인 및 사용 가능\n-티켓 캡쳐 혹은 이미지로 입장 불가" },
        { key: 3, title: "*환불규정", text: "1. 구매일포함 7일간 환불 가능합니다.\n(마이페이지>서비스이용내역>티켓구매내역에서 환불가능합니다.)\n2. 사용하신 티켓은 환불이 불가능합니다.\n3. 티켓의 일부만 환불을 원하시는 경우 전체티켓취소 후 재 결제 해주세요." },
        { key: 4, title: "*무료입장", text: "주민등록상 5세 미만 아기는 증빙서류 지참시 무료입장 가능\n(증빙서류 필수지참)" },
        { key: 5, title: "*입장안내", text: "-사진 및 비디오 촬영 가능\n-양도불가\n-행사장 내 음식물 반입 금지\n-애완동물 출입불가" }
    ],
    ICN: [
        { key: 1, title: "*티켓구매", text: "1인당 구매가능수량 : 제한없음\n유효기간 : 2017년 12월 21일 18시" },
        { key: 6, title: "*휴관안내", text: "-매주 월요일 휴관" },
        { key: 7, title: "*전시일정", text: "[인천점]\n장소 : 인천 송도 NC큐브 커넬워크 봄동 102 3,4층 인생사진관\n(인천광역시 연수구 아트센터대로 87)\n문의 : 032-834-1657\n단체문의 : 1577-1033" },
        { key: 8, title: "*주차안내", text: "-인천점 : 관람객에 한해 무료이용" }
    ],
    LSN: [
        { key: 1, title: "*티켓구매", text: "1인당 구매가능수량 : 제한없음\n유효기간 : 2017년 12월 21일 18시" },
        { key: 6, title: "*휴관안내", text: "-매주 월요일 휴관" },
        { key: 7, title: "*전시일정", text: "[일산점]\n장소 : 원마운트 7층 인생사진관 경기 고양시 일산서구 한류월드로 300\n문의 : 070-8822-1657\n단체문의 : 1577-1033\n운영시간 : 오전 11시 ~ 오후 7시 (입장마감 오후 6시까지)" },
        { key: 8, title: "*주차안내", text: "-일산점 : 관람객에 한해 3시간 이용" }
    ],
    PAJ: [
        { key: 1, title: "*티켓구매", text: "1인당 구매가능수량 : 제한없음\n유효기간 : 2017년 12월 21일 18시" },
        { key: 6, title: "*휴관안내", text: "-매주 월요일 휴관" },
        { key: 7, title: "*전시일정", text: "[파주점]\n장소 : 경기 파주시 회동길 160 (주)풀린키 3층 인생사진관\n대관문의 : 1544-1657\n운영시간 : 오전 11시 ~ 오후 7시 (입장마감 오후 6시)\n운영일자: 금 ~ 일만 운영\n휴무: 매주 월요일 휴관/화~목(스튜디오 대관시 이용가능)\n일반관람객 대상은 금~일만 운영합니다." },
        { key: 8, title: "*주차안내", text: "-파주점 : 관람객에 한해 무료이용" }
    ],
    JNJ: [
        { key: 1, title: "*티켓구매", text: "1인당 구매가능수량 : 제한없음\n유효기간 : 2018년 2월 18일" },
        { key: 6, title: "*휴관안내", text: "-매주 월요일 휴관\n설연휴 운영시간 변경 안내\n2월 15(목), 16(금) 정상영업\n2월 17일(토), 18일(일) 주말에만 13:00 ~ 21:00" },
        { key: 7, title: "*전시일정", text: "[전주점]\n장소 : 전주 NC웨이브 A관 4F\n운영시간 : 11:00 ~ 19:00" }
    ]
};

export const TICKET_LIST = [
    // { title: "인천점 상설 1호점", is_corp: "N", region: "인천", code: "ICN", profile_img: "/life/life_profile.jpg", thumb_img: "/life/life_list_icn.jpg", nick_name: "인생사진관" },
    // { title: "일산점 상설 2호점", is_corp: "N", region: "일산", code: "LSN", profile_img: "/life/life_profile.jpg", thumb_img: "/life/life_list_lsn.jpg", nick_name: "인생사진관" },
    // { title: "파주점 상설 3호점", is_corp: "N", region: "파주", code: "PAJ", profile_img: "/life/life_profile.jpg", thumb_img: "/life/life_list_paj.jpg", nick_name: "인생사진관" },
    { title: "전주점 상설 4호점", is_corp: "N", region: "전주", code: "JNJ", profile_img: "/life/life_profile.jpg", thumb_img: "/life/20180105/life_list_jnj.jpg", nick_name: "인생사진관" }
];


// export default {
//     TITLE_MAIN,
//     TITLE_SUB,
//     OPTIONS_REGION,
//     OPTIONS_TYPES,
//     OPTIONS_INFO,
//     TICKET_CONTENT
// };
