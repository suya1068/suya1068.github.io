<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * 포트폴리오 페이지
 */
$app->get("/portfolio/{no}", function (Request $request, Response $response, $no) {
    $browser = $request->getAttribute("browser");
    $bot = isBot($browser["name"]);
    $except_ip = $request->getAttribute("except_ip");

    $uuid = $request->getCookieParam(FORSNAP_UUID);
    $headers = ["API-TOKEN" => $request->getCookieParam(API_TOKEN_NAME)];

    $query = [
        "uuid" => $uuid
    ];
    $rs = $this->API->get("/products/".$no, $query, $headers);
    $data = $rs["data"];

    if ($rs["status"] === 200) {
        $seo = get_seo([
            "title" => $data["title"],
            "description" => $data["description"],
            "url" => "/portfolio/" . $no,
            "image" => empty($data["thumb_img"]) ? null : THUMB_SERVER . "/normal/crop/1200x630" . $data["thumb_img"]
        ]);
    } else {
        $data = $rs["message"];
        $seo = get_seo([
            "title" => $rs["message"] || "잘못된 상품입니다",
            "description" => $rs["message"] || "잘못된 상품입니다",
            "url" => "/portfolio/" . $no,
            "image" => null
        ]);
    }
//    $green_log = greenLog();

    $twigName = "views/products/portfolio/PortfolioPage.twig";
    if ($bot !== false || $except_ip !== false) {
        $twigName = "views/products/portfolio/PortfolioTemplate.twig";
    }

    return $this->view->render($response, $twigName, [
        "env" => $request->getAttribute("env"),
        "manifest" => $request->getAttribute("manifest"),
        "except_ip" => $request->getAttribute("except_ip"),
        "seo" => $seo,
        "product" => json_encode($data),
        "thumb_host" => THUMB_SERVER,
        "portfolio" => $data,
        "browser" => $request->getAttribute("browser")
//        "logcorp" => $green_log
    ]);
})->setName("products/portfolio");

$app->get("/simple-redirect", function (Request $request, Response $response) {
//    $seo = get_seo([
//        "title" => "",
//        "description" => "simple"
////        "url" => "/@" . $id
//    ]);
    $params = $request -> getQueryParams();

    $url = $params["url"];
    $enter = $params["enter"];

//    $this->Logger->debug("params", ["url" => $url, "enter" => $enter]);
//

    return $response->withStatus(302)->withHeader("Location", $url."?session=".$enter);
//
//    return $this->view->render($response, "views/simple/simple-redirect.twig", [
//        "env" => $request->getAttribute("env"),
//        "manifest" => $request->getAttribute("manifest"),
////        "seo" => $seo,
//        "browser" => $request->getAttribute("browser"),
//        "refresh" => $refreshMeta
//    ]);
})->setName("simple-redirect");

$app->group("/outside", function () {
    $this->get("/portfolio/{params}", function (Request $request, Response $response, $params) {
        $seo = get_seo([
            "title" => "포스냅 포트폴리오입니다.",
            "description" => "포스냅에서 전달한 포트폴리오입니다. 비밀번호를 입력하시면 포트폴리오를 확인하실 수 있습니다.",
            "url" => "/outside/portfolio/" . $params
            //"image" => IMG_SERVER . "/estimate/login/m_bg.jpg"
        ]);
//        $green_log = greenLog();

        return $this->view->render($response, "views/outside/components/portfolio/outside_portfolio.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
//            "logcorp" => $green_log,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("outside-portfolio");
});

$app->get("/estimate/{params}", function (Request $request, Response $response, $params) {
    $scheme = !empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off" ? "https" : "http";
    return $response->withStatus(302)->withHeader("Location", $scheme . "://" . str_replace("m.", "", $_SERVER["HTTP_HOST"]) . $_SERVER["REQUEST_URI"]);
})->setName("outside-offer");

$app->group("/@{name}", function () {
    $this->get("", function (Request $request, Response $response, $name) {
        $browser = $request->getAttribute("browser");
        $bot = isBot($browser["name"]);
        $except_ip = $request->getAttribute("except_ip");

        $headers = ["API-TOKEN" => $request->getCookieParam(API_TOKEN_NAME)];

        $data = [
            "nick_name" => $name
        ];

        $result = $this->API->get("/artist/intro-public", $data, $headers);

        $profile_img = $result["data"]["profile_img"];

        $seo = get_seo([
            "title" => $name . '작가님의 상품과 후기를 확인해보세요!',
            "description" => "작가-고객 수수료0%, 에스크로를 통한 안전거래를 제공하는 포스냅에서 최저가 고퀄리티 촬영을 경험하세요.",
            "image" => empty($profile_img) ? null : THUMB_SERVER . "/normal/crop/800x400" . $profile_img,
            "url" => "/@" . $name
        ]);
//        $green_log = greenLog();

        $this->Logger->debug("작가소개페이지 - 모바일", ["seo" => $seo]);

        $twigName = "views/artists/about/artist_about.twig";
        if ($bot !== false || $except_ip !== false) {
            $twigName = "views/artists/about/ArtistAboutTemplate.twig";
        }

        return $this->view->render($response, $twigName, [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
//            "logcorp" => $green_log,
            "browser" => $request->getAttribute("browser"),
            "thumb_host" => THUMB_SERVER,
            "about" => $result["data"]
        ]);
    })->setName("artist-about");

    $this->get("/review", function (Request $request, Response $response, $name) {
        $seo = get_seo([
            "title" => "작가 - 촬영후기",
            "description" => "촬영후기를 등록하는 공간입니다.",
            "url" => "/@" . $name . "/review"
        ]);
//        $green_log = greenLog();

        $this->Logger->debug("촬영후기", [
            "seo" => $seo,
            "name" => $name
        ]);

        return $this->view->render($response, "views/photograph-comment/register/photograph-comment-register.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
//            "logcorp" => $green_log,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("artist-comment");
});

$app->get("/", function (Request $request, Response $response) {
    $params = $request->getQueryParams();

    $title = "기업전용 사진촬영/영상제작 - 포스냅 biz";
    $description = "광고사진촬영, CF, 바이럴 영상제작, 마음에 들 때까지! 무제한 수정 퀄리티 보장 서비스";

//    $enter = empty($_COOKIE[ENTER]) ? null : $_COOKIE[ENTER];

    $enter_list = [
        "indi"
    ];
    $param_search = array_search($params[ENTER], $enter_list);

    if (!empty($params["enter"])
        && $enter_list[$param_search] === "indi") {
        $title = "언제 어디서든 모든 촬영이 가능한, 포스냅";
        $description = "작가-고객 수수료0%, 에스크로를 통한 안전거래를 제공하는 포스냅에서 최저가 고퀄리티 촬영을 경험하세요.";
    }

    if (!empty($params["enter"])
        && $enter_list[$param_search] === "indi") {
        $title = "언제 어디서든 모든 촬영이 가능한, 포스냅";
        $description = "작가-고객 수수료0%, 에스크로를 통한 안전거래를 제공하는 포스냅에서 최저가 고퀄리티 촬영을 경험하세요.";
    }

    if (!empty($newWindow)) {
        $title = "언제 어디서든 모든 촬영이 가능한, 포스냅";
        $description = "작가-고객 수수료0%, 에스크로를 통한 안전거래를 제공하는 포스냅에서 최저가 고퀄리티 촬영을 경험하세요.";
    }

    $seo = get_seo([
        "title" => $title,
        "description" => $description
//        "image" => IMG_SERVER . "/main/staff_pic/20170608/m_wide_01.jpg"
    ]);

    $this->Logger->debug("seo", ["seo" => $seo, "live" => $seo["live"]]);
//    $green_log = greenLog();

    return $this->view->render($response, "views/main/main.twig", [
        "env" => $request->getAttribute("env"),
        "manifest" => $request->getAttribute("manifest"),
        "seo" => $seo,
//        "logcorp" => $green_log,
        "browser" => $request->getAttribute("browser")
    ]);
})->setName("main");

$app->group("/login", function () {
    $this->get("", function (Request $request, Response $response) {
        $seo = get_seo([
//            "title" => "LOGIN - 포스냅",
//            "description" => "남는 건 사진뿐, 포스냅과 함께 짧은 순간의 기쁨을 영원히 기억하고 남기세요",
            "url" => "/login"
            //"image" => IMG_SERVER . "/login/login_bg.jpg"
        ]);

//        $green_log = greenLog();

        return $this->view->render($response, "views/users/login/login.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
//            "logcorp" => $green_log,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("login");

    $this->get("/rest", function (Request $request, Response $response) {
        $seo = get_seo([
//            "title" => "LOGIN - 포스냅",
//            "description" => "남는 건 사진뿐, 포스냅과 함께 짧은 순간의 기쁨을 영원히 기억하고 남기세요",
            "url" => "/login/rest"
            //"image" => IMG_SERVER . "/login/login_bg.jpg"
        ]);

//        $green_log = greenLog();

        return $this->view->render($response, "views/users/login/rest/rest.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
//            "logcorp" => $green_log,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("login");


    $this->get("/process/{type}", function (Request $request, Response $response, $type = "") {
        $seo = get_seo([
//            "title" => "Login Process - 포스냅",
//            "description" => "예쁜 사진을 날길 수 있어요.",
            "url" => "/process/" . $type
            //"image" => IMG_SERVER . "/login/login_bg.jpg"
        ]);

        return $this->view->render($response, "views/users/login/login_process.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser"),
            "sns" => ["type" => $type]
        ]);
    })->setName("login/process");
});

/**
 * 회원가입 페이지
 */
$app->group("/join", function () {
    $this->get("", function (Request $request, Response $response) {
        $seo = get_seo([
            "title" => "포스냅 회원가입",
            "description" => "포스냅 이메일 회원가입",
            "url" => "/join"
            //"image" => IMG_SERVER.""
        ]);

        return $this->view->render($response, "views/users/join/JoinPage.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser"),
            "logcorp" => $request->getAttribute("logcorp")

        ]);
    })->setName("join");
});

/**
 * 회원가입 이메일/비밀번호 찾기
 */
$app->group("/forget", function () {
    $this->get("", function (Request $request, Response $response) {
        $seo = get_seo([
            "title" => "포스냅 이메일/비밀번호 찾기",
            "description" => "포스냅 이메일/비밀번호 찾기",
            "url" => "/forget"
            //"image" => IMG_SERVER.""
        ]);

        return $this->view->render($response, "views/users/forget/ForgetPage.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser"),
            "logcorp" => $request->getAttribute("logcorp")

        ]);
    })->setName("join");
});

$app->get("/intro-estimate", function (Request $request, Response $response) {
    return $response->withStatus(302)->withHeader("Location", "/");
//    $seo = get_seo([
//        "title" => "포스냅",
//        "description" => "전국에 있는 포토그래퍼, 촬영요청을 한번에!",
//        "url" => "/intro-estimate",
//        "image" => IMG_SERVER . "/landing/landing_bg.jpg"
//    ]);
//
//    return $this->view->render($response, "views/intro/intro-estimate.twig", [
//        "env" => $request->getAttribute("env"),
//        "manifest" => $request->getAttribute("manifest"),
//        "seo" => $seo,
//        "browser" => $request->getAttribute("browser")
//    ]);
})->setName("intro-estimate");

$app->get("/uc", function (Request $request, Response $response) {
    $params = $request->getQueryParams();
    $userId = $params['user_id'];
    $productNo = $params['product_no'];
    $offerNo = $params['offer_no'];

    $url = "/users/chat?utm_source=SMS&utm_medium=cpc&utm_campaign=chat_click&utm_content=U";

    if ($userId) {
        $url .= "&user_id=".$userId;
    }

    if ($productNo) {
        $url .= "&product_no=".$productNo;
    } else if ($offerNo) {
        $url .= "&offer_no=".$offerNo;
    }

    return $response->withStatus(302)->withHeader("Location", $url);
});

$app->get("/ac", function (Request $request, Response $response) {
    $params = $request->getQueryParams();
    $userId = $params['user_id'];
    $productNo = $params['product_no'];
    $offerNo = $params['offer_no'];

    $url = "/artists/chat?utm_source=SMS&utm_medium=cpc&utm_campaign=chat_click&utm_content=A";

    if ($userId) {
        $url .= "&user_id=".$userId;
    }

    if ($productNo) {
        $url .= "&product_no=".$productNo;
    } else if ($offerNo) {
        $url .= "&offer_no=".$offerNo;
    }

    return $response->withStatus(302)->withHeader("Location", $url);
});

//$app->group("/guest", function () {
//    $this->get("/quotation[/{params:.*}]", function (Request $request, Response $response, $params) {
//        $seo = get_seo([
//            "title" => "무료견적요청서 작성",
//            "description" => "3분만에 무료견적 요청하기",
//            "url" => "/guest/quotation/",
//            "image" => IMG_SERVER . "/main/staff_pic/20170608/m_wide_01.jpg"
//        ]);
//
////        $this->Logger->debug("작가소개페이지 - 데스크탑", ["seo" => $seo]);
//
//        return $this->view->render($response, "views/guest/quotation/guest_quotation.twig", [
//            "env" => $request->getAttribute("env"),
//            "manifest" => $request->getAttribute("manifest"),
//            "seo" => $seo,
//            "browser" => $request->getAttribute("browser")
//        ]);
//    })->setName("guest-quotation");
//});

// 상담요청 모바일 주소 -> 모바일 레이어 팝업으로 변경 뒤 주소 삭제
//$app->get("/consult", function (Request $request, Response $response) {
//    $seo = get_seo([
//        "title" => "간단 상담신청",
//        "description" => "간단하게 상담요청하세요",
//        "url" => "/consult",
//        "image" => IMG_SERVER . "/main/staff_pic/20170608/m_wide_01.jpg"
//    ]);
//
//    return $this->view->render($response, "views/consult/personal/personal_consult.twig", [
////    return $this->view->render($response, "views/consult/consult.twig", [
//        "env" => $request->getAttribute("env"),
//        "manifest" => $request->getAttribute("manifest"),
//        "seo" => $seo,
//        "browser" => $request->getAttribute("browser")
//    ]);
//})->setName("consult");

//$app->get("/personal_consult", function (Request $request, Response $response) {
//    $seo = get_seo([
//        "title" => "간단 개인 상담신청",
//        "description" => "간단하게 상담요청하세요",
//        "url" => "/personal_consult",
//        "image" => IMG_SERVER . "/main/staff_pic/20170608/m_wide_01.jpg"
//    ]);
//
//    return $this->view->render($response, "views/consult/personal/personal_consult.twig", [
//        "env" => $request->getAttribute("env"),
//        "manifest" => $request->getAttribute("manifest"),
//        "seo" => $seo,
//        "browser" => $request->getAttribute("browser")
//    ]);
//})->setName("consult");

$app->get("/ue/{no}", function (Request $request, Response $response, $no) {
    return $response->withStatus(302)->withHeader("Location", "/users/estimate/".$no."/content?utm_source=SMS&utm_medium=cpc&utm_campaign=estimate_click&utm_content=U&ga=".$no);
});

$app->get("/ae/{no}", function (Request $request, Response $response, $no) {
    return $response->withStatus(302)->withHeader("Location", "/artists/estimate/".$no."?utm_source=SMS&utm_medium=cpc&utm_campaign=estimate_click&utm_content=A&ga=".$no);
});

$app->get("/ut", function (Request $request, Response $response) {
    return $response->withStatus(302)->withHeader("Location", "/users/ticket?utm_source=SMS&utm_medium=cpc&utm_campaign=ticket_click&utm_content=U");
});
