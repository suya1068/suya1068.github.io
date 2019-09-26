const PATH = "/biz/make_product/detail/";
export const MAKE_PRODUCT = {
    HONEST: {
        CODE: "HONEST",
        TITLE: "포스냅 상세페이지는 정직합니다.",
        CONTENT: [
            {
                NO: 1,
                TITLE: "High Quality",
                DESC: "마스크툴, 매직봉을 사용하지 않고 패스를 사용해 작업합니다.",
                ICON: `${PATH}/highquality.png`
            },
            {
                NO: 2,
                TITLE: "24Hours",
                DESC: "24시간 작업으로 대량 주문도 빠른 속도로 작업해 드립니다.",
                ICON: `${PATH}/24hours.png`
            },
            {
                NO: 1,
                TITLE: "Low Price",
                DESC: "타사대비 20% 이상 저렴한 비용으로 이용가능합니다.",
                ICON: `${PATH}/low_price.png`
            }
        ]
    },
    INFO: {
        CODE: "INFO",
        TITLE: "상세페이지 제작 안내",
        CONTENT: [
            {
                NO: 1,
                TITLE: "",
                LIST: [
                    { TEXT: "초급" },
                    { TEXT: "중급" },
                    { TEXT: "고급" }
                ]
            },
            {
                NO: 2,
                TITLE: "이미지 수량",
                LIST: [
                    { TEXT: "10장 미만" },
                    { TEXT: "20장 미만" },
                    { TEXT: "30장 미만" }
                ]
            },
            {
                NO: 3,
                TITLE: "텍스트 수정 및 변경",
                LIST: [
                    { TEXT: "불가" },
                    { TEXT: "가능" },
                    { TEXT: "가능" }
                ]
            },
            {
                NO: 4,
                TITLE: "수정횟수",
                LIST: [
                    { TEXT: "1회" },
                    { TEXT: "2회" },
                    { TEXT: "3회" }
                ]
            }
        ]
    },
    PROCESS: {
        CODE: "PROCESS",
        TITLE: "상세페이지 제작 과정",
        ARROW: "",
        CONTENT: [
            {
                NO: 1,
                CODE: "TEXT",
                TITLE: "작업요청"
            },
            {
                NO: 2,
                CODE: "TEXT",
                TITLE: "파일 공유 및 확인"
            },
            {
                NO: 3,
                CODE: "TEXT",
                TITLE: "작업"
            },
            {
                NO: 4,
                CODE: "TEXT",
                TITLE: "완성파일 전달"
            }
        ]
    },
    WARN: {
        CODE: "WARN",
        TITLE: "유의사항",
        CONTENT: [
            {
                NO: 1,
                TEXT: "PSD 샘플 제시를 기반으로 작업합니다. (사용 폰트, 이미지 등 모든 양식을 공유해 주셔야 합니다.)"
            },
            {
                NO: 2,
                TEXT: "추가금 없이 원본 PSD파일을 제공합니다."
            },
            {
                NO: 3,
                TEXT: "결제 후 24시간 내 납품 가능합니다.(일요일 휴무)"
            },
            {
                NO: 4,
                TEXT: "템플릿 제공 조건으로 기본 디자인 양식을 가지고 계시지 않는 경우 제공되는 템플릿 중 선택하실 수 있습니다."
            },
            {
                NO: 5,
                TEXT: "전체 작업 난이도가 높은 경우 추가금액이 발생할 수 있습니다."
            }
        ]
    }
};
