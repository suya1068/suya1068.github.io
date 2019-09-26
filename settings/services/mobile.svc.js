const { MANIFEST } = require("../constant");
const { path } = require("../utils");

module.exports = () => {
    const VIEW_PATH = path.mobile("resources/views");

    return {
        entry: [
            {
                name: "common",
                files: [path.mobile("resources/common")]
            },
            {
                name: "check_ctype",
                files: [path.mobile("resources/check_ctype")]
            },
            {
                name: "main/main",
                files: [`${VIEW_PATH}/main/MainPage`]
            },
            {
                name: "users/login/login",
                files: [`${VIEW_PATH}/users/login/LoginPage`]
            },
            {
                name: "users/login/login_process",
                files: [`${VIEW_PATH}/users/login/LoginProcessPage`]
            },
            {
                name: "users/join",
                files: [`${VIEW_PATH}/users/join/JoinPage`]
            },
            {
                name: "users/forget",
                files: [`${VIEW_PATH}/users/forget/ForgetPage`]
            },
            {
                name: "users/login/rest/rest",
                files: [`${VIEW_PATH}/users/login/rest/RestAccount`]
            },
            {
                name: "products/products-list",
                files: [`${VIEW_PATH}/products/ProductListContainer`]
            },
            {
                name: "products/products-detail",
                files: [`${VIEW_PATH}/products/ProductsDetailPage`]
            },
            {
                name: "products/portfolio",
                files: [`${VIEW_PATH}/products/portfolio/PortfolioPage`]
            },
            {
                name: "products/products-process",
                files: [`${VIEW_PATH}/products/ProductsProcessPage`]
            },
            {
                name: "portfolio/category",
                files: [`${VIEW_PATH}/portfolio/category/PortfolioCategoryPage`]
            },
            {
                name: "users/mypage/mypage",
                files: [`${VIEW_PATH}/users/mypage/MyPage`]
            },
            {
                name: "users/mypage/pages/account/account",
                files: [`${VIEW_PATH}/users/mypage/pages/account/Account`]
            },
            {
                name: "users/mypage/pages/leave/users_leave",
                files: [`${VIEW_PATH}/users/mypage/pages/leave/UsersLeave`]
            },
            {
                name: "users/mypage/pages/chat/chat",
                files: [`${VIEW_PATH}/users/mypage/pages/chat/ChatPage`]
            },
            {
                name: "users/mypage/pages/like/like",
                files: [`${VIEW_PATH}/users/mypage/pages/like/LikeContainer`]
            },
            // {
            //     name: "users/quotation/quotation_request",
            //     files: [`${VIEW_PATH}/users/quotation/QuotationRequestPage`]
            // },
            {
                name: "artists/chat/artists-chat",
                files: [`${VIEW_PATH}/artists/chat/ArtistsChatPage`]
            },
            // {
            //     name: "artists/quotation/artists-quotation",
            //     files: [`${VIEW_PATH}/artists/quotation/QuotationResponsePage`]
            // },
            {
                name: "artists/estimate/estimate",
                files: [`${VIEW_PATH}/artists/estimate/Estimate`]
            },
            {
                name: "artists/about/artist_about",
                files: [`${VIEW_PATH}/artists/about/AboutContainer`]
            },
            {
                name: "artists/account/leave/artist_leave",
                files: [`${VIEW_PATH}/artists/account/leave/ArtistLeave`]
            },
            {
                name: "artist/progress",
                files: [`${VIEW_PATH}/artists/progress/ProgressPage`]
            },
            {
                name: "users/progress",
                files: [`${VIEW_PATH}/users/progress/ProgressPage`]
            },
            {
                name: "users/reservation/photo",
                files: [`${VIEW_PATH}/users/reservation/photo/ReservationPhotoPage`]
            },
            // {
            //     name: "users/mypage/pages/history/history",
            //     files: [`${VIEW_PATH}/uzsers/mypage/pages/history/History`]
            // },
            {
                name: "users/mypage/pages/estimate/estimate",
                files: [`${VIEW_PATH}/users/mypage/pages/estimate/EstimatePage`]
            },
            {
                name: "users/mypage/pages/estimate/estimate_process",
                files: [`${VIEW_PATH}/users/mypage/pages/estimate/EstimateProcessPage`]
            },
            {
                name: "users/mypage/pages/ticket/ticket",
                files: [`${VIEW_PATH}/users/mypage/pages/ticket/TicketPage`]
            },
            {
                name: "users/payment/process",
                files: [`${VIEW_PATH}/users/payment/process/PaymentProcessPage`]
            },
            {
                name: "intro/intro-estimate",
                files: [`${VIEW_PATH}/intro/IntroEstimate`]
            },
            // {
            //     name: "ticket/main",
            //     files: [`${VIEW_PATH}/ticket/TicketPage_BK`]
            // },
            // {
            //     name: "ticket/process",
            //     files: [`${VIEW_PATH}/ticket/TicketProcessPage`]
            // },
            {
                name: "information/information",
                files: [`${VIEW_PATH}/information/InformationPage`]
            },
            {
                name: "photograph-comment/register",
                files: [`${VIEW_PATH}/photograph-comment/register/PhotographCommentRegister`]
            },
            // {
            //     name: "guest/quotation/guest_quotation",
            //     files: [`${VIEW_PATH}/guest/quotation/GuestQuotation`]
            // },
            // {
            //     name: "consult/consult",
            //     files: [`${VIEW_PATH}/consult/Consult`]
            // },
            // {
            //     name: "consult/personal/personal_consult",
            //     files: [`${VIEW_PATH}/consult/personal/PersonalConsult`]
            // },
            /**
             * 랜딩페이지
             */
            {
                name: "landing",
                files: [`${VIEW_PATH}/landing/LandingPage`]
            },
            {
                name: "event",
                files: [`${VIEW_PATH}/event/EventPage`]
            },
            {
                name: "policy/private",
                files: [`${VIEW_PATH}/policy/Private`]
            },
            {
                name: "policy/term",
                files: [`${VIEW_PATH}/policy/Term`]
            },
            {
                name: "cs/customer-center",
                files: [`${VIEW_PATH}/cs/CustomerCenter`]
            },
            {
                name: "outside/components/portfolio/outside_portfolio",
                files: [`${VIEW_PATH}/outside/components/portfolio/OutsidePortfolioContainer`]
            }
            // {
            //    name: "test/test",
            //    files: [`${VIEW_PATH}/test/TestPage`]
            // }
        ],
        output: {
            path: path.mobile(`public/${MANIFEST.dist_path}`),
            publicPath: MANIFEST.dist_path
        },
        commonChunks: { names: ["common", "manifest"] },
        //externals: [
        //    { alias: "React", path: "react" },
        //    { alias: "ReactDOM", path: "react-dom" },
        //    { alias: "ReactRouter", path: "react-router" }
        //],
        alias: [
            { name: "forsnap", path: path.shared("forsnap.js") },
            { name: "forsnap-utils", path: path.shared("helper/utils.js") },
            { name: "forsnap-mewtime", path: path.shared("helper/mewtime.js") },
            { name: "forsnap-authentication", path: path.shared("management/authentication.js") },
            { name: "forsnap-cookie", path: path.shared("management/cookie.js") },
            { name: "forsnap-tracking", path: path.shared("tracking") },
            { name: "forsnap-api", path: path.mobile("resources/management/mobile.api.js") },
            { name: "forsnap-redirect", path: path.mobile("resources/management/redirect.js") }
        ],
        expose: [
            { name: "FSN", path: path.shared("forsnap.js") }
        ]
    };
};
