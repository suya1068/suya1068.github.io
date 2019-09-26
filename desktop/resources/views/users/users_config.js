const base = "/users";

const navUrlData = [
    { baseUrl: base, restUrl: "/myaccount", className: "nav-nonSelect", navTitle: "계정설정" },
    { baseUrl: base, restUrl: "/like", className: "nav-nonSelect", navTitle: "내하트 목록" },
    { baseUrl: base, restUrl: "/chat", className: "nav-nonSelect", navTitle: "대화하기" },
    { baseUrl: base, restUrl: "/progress", className: "nav-nonSelect", navTitle: "진행상황" },
    { baseUrl: base, restUrl: "/history", className: "nav-nonSelect", navTitle: "서비스 이용내역" }
];

export default navUrlData;
