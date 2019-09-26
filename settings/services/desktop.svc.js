const { MANIFEST } = require("../constant");
const { path } = require("../utils");

module.exports = () => {
    const VIEW_PATH = path.desktop("resources/views");

    return {
        demo: [
            {
                name: "demo/demo",
                files: [`${VIEW_PATH}/demo/Demo`]
            }
        ],
        entry: [
            {
                name: "common",
                files: [path.desktop("resources/common")]
            },
            {
                name: "check_ctype",
                files: [path.desktop("resources/check_ctype")]
            },
            {
                name: "main/main",
                files: [`${VIEW_PATH}/main/MainPage`]
            },
            // {   // test co - main page
            //     name: "main/main_test",
            //     files: [`${VIEW_PATH}/main/test/MainPage`]
            // },
            {
                name: "artists/artist",
                files: [`${VIEW_PATH}/artists/Artists`]
            },
            {
                name: "artists/about/artist_about",
                files: [`${VIEW_PATH}/artists/about/AboutContainer`]
            },
            {
                name: "cs/customer-center",
                files: [`${VIEW_PATH}/cs/CustomerCenter`]
            },
            {
                name: "policy/policy",
                files: [`${VIEW_PATH}/policy/Policy`]
            },
            {
                name: "information/information",
                files: [`${VIEW_PATH}/information/Information`]
            },
            {
                name: "products/products-list",
                files: [`${VIEW_PATH}/products/ProductsListPage`]
            },
            {
                name: "products/product-detail",
                files: [`${VIEW_PATH}/products/detail/ProductsDetailContainer`]
            },
            {
                name: "products/product-process",
                files: [`${VIEW_PATH}/products/ProductProcessPage`]
            },
            {
                name: "products/portfolio",
                files: [`${VIEW_PATH}/products/portfolio/PortfolioPage`]
            },
            {
                name: "products/concept",
                files: [`${VIEW_PATH}/products/concept/ProductsConceptPage`]
            },
            {
                name: "portfolio/category",
                files: [`${VIEW_PATH}/portfolio/category/PortfolioCategoryPage`]
            },
            {
                name: "users/user",
                files: [`${VIEW_PATH}/users/Users`]
            },
            {
                name: "users/login/login",
                files: [`${VIEW_PATH}/users/login/Login`]
            },
            {
                name: "users/login/login_process",
                files: [`${VIEW_PATH}/users/login/login_process`]
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
                name: "users/auth/auth_result",
                files: [`${VIEW_PATH}/users/auth/auth_result`]
            },
            {
                name: "intro/intro-estimate",
                files: [`${VIEW_PATH}/intro/IntroEstimate`]
            },
            {
                name: "intro/direct/email-direct",
                files: [`${VIEW_PATH}/intro/direct/EmailDirect`]
            },
            // {
            //     name: "ticket/main",
            //     files: [`${VIEW_PATH}/ticket/TicketPage`]
            // },
            {
                name: "photograph-comment/register",
                files: [`${VIEW_PATH}/photograph-comment/register/PhotographCommentRegister`]
            },
            // {
            //     name: "guest/quotation/guest_quotation",
            //     files: [`${VIEW_PATH}/guest/quotation/GuestQuotation`]
            // },
            {
                name: "outside/outside",
                files: [`${VIEW_PATH}/outside/OutsideContainer`]
            },
            {
                name: "outside/components/portfolio/outside_portfolio",
                files: [`${VIEW_PATH}/outside/components/portfolio/OutsidePortfolioContainer`]
            },
            {
                name: "event",
                files: [`${VIEW_PATH}/event/EventPage`]
            },
            {
                name: "estimate/outside",
                files: [`${VIEW_PATH}/estimate/outside/EstimateOutsidePage`]
            },
            {
                name: "outside/consult",
                files: [`${VIEW_PATH}/outside/consult/OutsideConsultPage`]
            },
            {
                name: "print_receipt/print_receipt",
                files: [`${VIEW_PATH}/print_receipt/PrintReceiptContainer`]
            },
            /**
             * 랜딩페이지
             */
            {
                name: "landing",
                files: [`${VIEW_PATH}/landing/LandingPage`]
            }
            // ,
            // {
            //     name: "ticket/process",
            //     files: [`${VIEW_PATH}/ticket/TicketProcessPage`]
            // }
            // {
            //     name: "payment",
            //     files: [`${VIEW_PATH}/payment/PaymentPage.jsx`]
            // }
        ],
        output: {
            path: path.desktop(`public/${MANIFEST.dist_path}`),
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
            { name: "forsnap-api", path: path.desktop("resources/management/desktop.api.js") },
            { name: "forsnap-redirect", path: path.desktop("resources/management/redirect.js") }
        ],
        expose: [
            { name: "FSN", path: path.shared("forsnap.js") }
        ]
    };
};
