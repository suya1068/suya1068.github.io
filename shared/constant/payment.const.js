export const PAYMENT_CODE = {
    CARD: "card",
    TRANS: "trans",
    BANK: "vbank"
};

export const PAYMENT_METHOD = [
    { name: "신용카드", value: PAYMENT_CODE.CARD },
    { name: "계좌이체", value: PAYMENT_CODE.TRANS },
    { name: "무통장 입금", value: PAYMENT_CODE.BANK }
];

export const PAYMENT_TYPE = {
    PRODUCT: "PRODUCT",
    OFFER: "OFFER",
    EXTRA: "EXTRA",
    CUSTOM: "CUSTOM"
};
