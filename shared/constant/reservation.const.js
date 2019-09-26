export const PROCESS_BREADCRUMB_CODE = {
    READY: "READY",
    PAYMENT: "PAYMENT",
    PREPARE: "PREPARE",
    SHOT: "SHOT",
    UPLOAD: "UPLOAD",
    CUSTOM: "CUSTOM",
    RES_CUSTOM: "RES_CUSTOM",
    REQ_CUSTOM: "REQ_CUSTOM",
    REQ_COMPLETE: "REQ_COMPLETE",
    COMPLETE: "COMPLETE"
};

export const PROCESS_BREADCRUMB = {
    [PROCESS_BREADCRUMB_CODE.READY]: { artist_text: "결제예정", user_text: "결제예정" },
    [PROCESS_BREADCRUMB_CODE.PAYMENT]: { artist_text: "결제완료", user_text: "결제완료" },
    [PROCESS_BREADCRUMB_CODE.PREPARE]: { artist_text: "촬영준비", user_text: "촬영준비" },
    [PROCESS_BREADCRUMB_CODE.SHOT]: { artist_text: "촬영", user_text: "업로드 대기" },
    [PROCESS_BREADCRUMB_CODE.UPLOAD]: { artist_text: "전달완료", user_text: "전달완료" },
    [PROCESS_BREADCRUMB_CODE.CUSTOM]: { artist_text: "전달완료", user_text: "전달완료" },
    [PROCESS_BREADCRUMB_CODE.REQ_CUSTOM]: { artist_text: "보정요청", user_text: "보정요청" },
    [PROCESS_BREADCRUMB_CODE.RES_CUSTOM]: { artist_text: "전달완료", user_text: "전달완료" },
    [PROCESS_BREADCRUMB_CODE.REQ_COMPLETE]: { artist_text: "최종완료", user_text: "최종완료" },
    [PROCESS_BREADCRUMB_CODE.COMPLETE]: { artist_text: "최종완료", user_text: "최종완료" }
};

export const COMBINE_PROCESS_BREADCRUMB = {
    [PROCESS_BREADCRUMB_CODE.READY]: { name: "예약", user_description: "", icon: "calendar_l", status: [PROCESS_BREADCRUMB_CODE.READY, PROCESS_BREADCRUMB_CODE.PAYMENT] },
    [PROCESS_BREADCRUMB_CODE.PREPARE]: { name: "진행중", user_description: "", icon: "camera", status: [PROCESS_BREADCRUMB_CODE.PREPARE, PROCESS_BREADCRUMB_CODE.SHOT] },
    [PROCESS_BREADCRUMB_CODE.UPLOAD]: { name: "전달", user_description: "", icon: "heart_bag", status: [PROCESS_BREADCRUMB_CODE.UPLOAD, PROCESS_BREADCRUMB_CODE.CUSTOM] },
    [PROCESS_BREADCRUMB_CODE.COMPLETE]: { name: "완료", user_description: "", icon: "receipt", status: [PROCESS_BREADCRUMB_CODE.COMPLETE] }
};
