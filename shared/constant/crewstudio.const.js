export const STATUS_TYPE = {
    READY: { code: "READY", name: "진행중" },                       // 대기중
    ARTIST_ACTION: { code: "ARTIST_ACTION", name: "진행중" },    // 작가대응중
    PAYMENT: { code: "PAYMENT", name: "완료" },                 // 결제완료
    CANCEL: { code: "READY", name: "완료" },                    // 촬영취소
    DIFF_ARTIST: { code: "READY", name: "완료" }             // 다른작가연결
};
