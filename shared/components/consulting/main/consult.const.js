const CONSULT_KEYS = {
    CATEGORY: "category",
    USER_NAME: "user_name",
    USER_PHONE: "user_phone",
    USER_EMAIL: "user_email",
    CONTENT: "content",
    COUNSEL_TYPE: "counsel_type",
    COUNSEL_TIME: "counsel_time",
    URL: "url",
    ATTACH_INFO: "attach_info"
};

export const CONSULT_ROW_TEMPLATE = [
    // { VIEW_NO: "1", KEY: "category", NAME: "카테고리", REQUIRED: true },
    // { VIEW_NO: "2", KEY: "content", NAME: "내용", REQUIRED: true },
    // { VIEW_NO: "3", KEY: "url", NAME: "참고사이트", REQUIRED: false },
    // { VIEW_NO: "4", KEY: "attach_info", NAME: "첨부파일", REQUIRED: false },
    { VIEW_NO: "5", KEY: "user_name", NAME: "이름", REQUIRED: true },
    { VIEW_NO: "6", KEY: "user_phone", NAME: "연락처", REQUIRED: true },
    { VIEW_NO: "7", KEY: "user_email", NAME: "이메일", REQUIRED: false },
    { VIEW_NO: "8", KEY: "counsel_time", NAME: "상담가능시간", REQUIRED: true }
];

export const CONSULT_INPUT_TYPE_PLACEHOLDER = {

};

export const CONSULT_MIC_ITEMS = {
    [CONSULT_KEYS.COUNSEL_TIME]: { CHECK: false, TEXT: "SMS로 상담받을래요!" }
};
