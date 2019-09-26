const base = "/policy";

const navUrlData = [
    { baseUrl: base, restUrl: "/private", className: "nav-nonSelect", navTitle: "개인정보 취급방침" },
    { baseUrl: base, restUrl: "/term", className: "nav-nonSelect", navTitle: "이용약관" }
];

const policyClasses = {
    siteMainList: "site_main__list",
    contentBody: "content__body",
    panel: "panel",
    panelHeading: "panel__heading",
    panelBody: "panel__body",
    panelBodyList: "panel__body__list"
};

const textData = {
    privateData: {
        mainTitle: "포스냅 개인정보 취급방침",
        listData: {
            listTitle: [
                "수집하는 개인정보의 형식",
                "개인정보 수집 방법",
                "개인정보 수집 및 이용 목적",
                "개인정보의 공유 및 이용 목적",
                "이용자 및 법정대리인의 권리와 그 행사방법",
                "개인정보 자동 수집 장치의 설치 / 운영 및 거부에 관한 사항",
                "개인정보 보유 및 이용기간",
                "개인정보 파기절차 및 방법",
                "개인정보 관리책임자",
                "개인정보 취급방침의 개정 공고일자, 시행일자(7일차)"
            ],
            listText: [
                "포스냅 이용을 위해 개인정보의 수집이 필요합니다. 수집되는 개인정보는 다음과 같으며 사용자 동의후 수집됩니다.\n"
                + "계정 정보: 이름, 성별, 생년월일, 이메일, 전화번호, 지역, 프로필이미지\n"
                + "모바일 결제 정보: 성공한 결제 내역 정보\n"
                + "웹 결제 정보: 계약된 PG사에 전달된 결제 정보\n"
                + "로그 데이터: IP정보, 디바이스 또는 브라우저 정보, 조회된 도메인, 방문 웹페이지, 이용 통신사 구분, 이용 기록, 불량 이용 기록\n"
                + "SNS 연동 정보: SNS에서 제공하는 사용자의 계정 정보와 친구 관계 정보 등 연동되는 SNS에서 허용하는 모든 정보 (지원 SNS는 운영에 따라 변경 가능합니다.)"
            ]
        }
    }
};

export { navUrlData, policyClasses };
