export const PROGRESS_CODES = {
    READY: { code: "READY", title: "예약완료", name: "예약 완료" },
    PAYMENT: { code: "PAYMENT", title: "입금완료", name: "입금 완료" },
    PREPARE: { code: "PREPARE", title: "촬영준비중", name: "촬영 준비중" },
    SHOT: { code: "SHOT", title: "촬영완료", name: "촬영 완료" },
    UPLOAD: { code: "UPLOAD", title: "사진전달", name: "사진 전달" },
    CUSTOM: { code: "CUSTOM", title: "보정전달", name: "보정 전달" },
    COMPLETE: { code: "COMPLETE", title: "최종전달", name: "최종 전달" }
};

export const OPTION_TYPE = {
    ORDER: { code: "ORDER" },               // 촬영요청
    TALK_CUSTOM: { code: "TALK_CUSTOM" },   // 대화하기 - 맞춤결제
    TALK_EXTRA: { code: "TALK_EXTRA" },     // 대화하기 - 추가결제
    PACKAGE: { code: "PACKAGE" },           // 상품결제 - 패키지상품
    ORIGIN: { code: "ORIGIN" },             // 상품결제 - 기존상품(원본)
    CUSTOM: { code: "CUSTOM" },             // 상품결제 - 기존상품(보정)
    PRINT: { code: "PRINT" },               // 상품결제 - 기존상품(인화)
    DIRECT: { code: "DIRECT" }              // 상품결제 - 기존상품(커스텀)
};

export const RESERVE_TYPE = {
    OFFER: { code: "OFFER" },               // 견적서 예약
    PRODUCT: { code: "PRODUCT" }            // 상품 예약
};
