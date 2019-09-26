const pages_data = [
    { id: 0, name: "계정설정", icon: "m-icon-face", link: "/users/myaccount", has_mobile: true },
    { id: 1, name: "나의하트", icon: "m-icon-heart", link: "/users/like", has_mobile: true },
    { id: 2, name: "대화하기", icon: "m-icon-talk", link: "/users/chat", has_mobile: true },
    // { id: 2, name: "대화하기", icon: "m-icon-talk", link: "/users/chat", has_mobile: true },
    // { id: 3, name: "진행상황", icon: "m-icon-camera", link: "/users/progress", has_mobile: true },
    // { id: 3, name: "진행상황", icon: "m-icon-camera", link: `${__DESKTOP__}/users/progress`, has_mobile: false },
    { id: 4, name: "이용내역", icon: "m-icon-house", link: `${__DESKTOP__}/users/history/result`, has_mobile: false },
     //{ id: 5, name: "자주묻는질문", icon: "m-icon-speaker", link: `${__DESKTOP__}/cs/qna`, has_mobile: true },
    // { id: 5, name: "나의티켓", icon: "m-icon-ticket", link: "/users/ticket", has_mobile: true },
    { id: 6, name: "고객센터", icon: "m-icon-question", link: "/cs/qna", has_mobile: true },
    { id: 7, name: "나의후기", icon: "m-icon-comment", link: `${__DESKTOP__}/users/history/comment`, has_mobile: false }
];

export { pages_data };
