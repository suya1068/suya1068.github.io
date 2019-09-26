export const introduction = { name: "포스냅 소개", url: "/information/introduction", code: "introduction" };
export const strongPoint = { name: "작가로 활동하기", url: "/information/strong-point", code: "strong-point" };
export const serviceGuide = { name: "이용안내", url: "/information/service-guide", code: "service-guide" };
export const servicePolicy = { name: "서비스 정책", url: "/information/service-policy", code: "service-policy" };
// export const brandGuide = { name: "브랜드 소개", url: "/information/brand-guide" };
// export const registerArtist = { name: "작가 등록", url: "/users/registartist" };

export const main_navigation = [
    { id: "info_nav_01", ...introduction },
    { id: "info_nav_02", ...strongPoint },
    { id: "info_nav_03", ...serviceGuide },
    { id: "info_nav_04", ...servicePolicy }
];
