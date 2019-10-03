<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

/**
 * 외부 링크
 * 외부 포트폴리오, 외부 견적서
 */
$app->group("/outside", function () {
    $this->get("/portfolio/{params}", function (Request $request, Response $response, $params) {
        if (is_mobile()) {
            return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
        }
        $seo = get_seo([
            "title" => "포스냅 포트폴리오입니다.",
            "description" => "포스냅에서 전달한 포트폴리오입니다. 비밀번호를 입력하시면 포트폴리오를 확인하실 수 있습니다.",
            "url" => "/outside/portfolio/" . $params
            //"image" => IMG_SERVER . "/estimate/login/p_bg.jpg"
        ]);
//        $green_log = greenLog();
        return $this->view->render($response, "views/outside/components/portfolio/outside_portfolio.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "except_ip" => $request->getAttribute("except_ip"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser")
//            "logcorp" => $green_log
        ]);
    })->setName("outside-portfolio");

    $this->get("/consult/{consult_url}", function (Request $request, Response $response, $consult_url) {
        $seo = get_seo([
            "title" => "포스냅 상담신청 내용입니다.",
            "description" => "포스냅에 요청한 상담신청 내용입니다. 비밀번호를 입력하시면 상담내용을 확인하실 수 있습니다.",
            "url" => "/outside/consult/" . $consult_url
            //"image" => ""
        ]);
//        $green_log = greenLog();
        return $this->view->render($response, "views/outside/consult/OutsideConsultPage.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "except_ip" => $request->getAttribute("except_ip"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser"),
//            "logcorp" => $green_log,
            "consult_url" => $consult_url
        ]);
    })->setName("outside/consult");
});

/**
 * 작가소개페이지
 */
$app->group("/@{name}", function () {
    $this->get("", function (Request $request, Response $response, $name) {
        if (is_mobile()) {
            return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
        }

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

        $twigName = "views/artists/about/artist_about.twig";
        if ($bot !== false || $except_ip !== false) {
            $twigName = "views/artists/about/ArtistAboutTemplate.twig";
        }

        return $this->view->render($response, $twigName, [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "except_ip" => $request->getAttribute("except_ip"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser"),
            "thumb_host" => THUMB_SERVER,
            "about" => $result["data"]
//            "logcorp" => $green_log

        ]);
    })->setName("artist-about");

    $this->get("/review", function (Request $request, Response $response, $name) {
        if (is_mobile()) {
            return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
        }

        $seo = get_seo([
            "title" => "작가 - 촬영후기",
            "description" => "촬영후기를 등록하는 공간입니다.",
            "url" => "/@" . $name . "/review"
        ]);

        $this->Logger->debug("촬영후기", [
            "seo" => $seo,
            "name" => $name
        ]);
//        $green_log = greenLog();

        return $this->view->render($response, "views/photograph-comment/register/photograph-comment-register.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "except_ip" => $request->getAttribute("except_ip"),
            "browser" => $request->getAttribute("browser")
//            "logcorp" => $green_log
        ]);
    })->setName("artist-comment");
});

/**
 * 메인 페이지
 */
$app->get("/", function (Request $request, Response $response) {
    $params = $request->getQueryParams();

    $is_si_params = false;
//    $is_mp_params = false;

    if (!empty($params) && !empty($params["si"])) {
        if ($params["si"] === "true" ? true : false) {
            $is_si_params = true;
        }
    }

//    if (!empty($params) && !empty($params["mp"])) {
//        if ($params["mp"] === "true" ? true : false) {
//            $is_mp_params = true;
//        }
//    }

    if (is_mobile() && !$is_si_params) {
        return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
    }

    $newWindow = empty($params["new"]) ? null : $params["new"];
    $this->Logger->debug("NEW WINDOW", ["new" => $newWindow]);

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

    if (!empty($newWindow)) {
        $title = "언제 어디서든 모든 촬영이 가능한, 포스냅";
        $description = "작가-고객 수수료0%, 에스크로를 통한 안전거래를 제공하는 포스냅에서 최저가 고퀄리티 촬영을 경험하세요.";
    }

//    $green_log = greenLog();

//    $time_flag = setEventPageDisplayFlag("2019-02-21 08:50:00");

    $seo = get_seo([
        "title" => $title,
        "description" => $description
    ]);

    return $this->view->render($response, "views/main/main.twig", [
        "env" => $request->getAttribute("env"),
        "manifest" => $request->getAttribute("manifest"),
        "except_ip" => $request->getAttribute("except_ip"),
        "seo" => $seo,
        "browser" => $request->getAttribute("browser")
//        "time_flag" => $time_flag
//        "logcorp" => $green_log
    ]);
})->setName("main");

/**
 * 메인 페이지
 */
//$app->get("/main_test", function (Request $request, Response $response) {
//    if (is_mobile()) {
//        return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
//    }
//    $params = $request->getQueryParams();
//
//    $newWindow = empty($params["new"]) ? null : $params["new"];
//    $this->Logger->debug("NEW WINDOW", ["new" => $newWindow]);
//
//    $title = "기업전용 사진촬영/영상제작 - 포스냅 biz";
//    $description = "광고사진촬영, CF, 바이럴 영상제작, 마음에 들 때까지! 무제한 수정 퀄리티 보장 서비스";
//
////    $enter = empty($_COOKIE[ENTER]) ? null : $_COOKIE[ENTER];
//
//    $enter_list = [
//        "indi"
//    ];
//
//    $param_search = array_search($params[ENTER], $enter_list);
//
//    if (!empty($params["enter"])
//        && $enter_list[$param_search] === "indi") {
//        $title = "언제 어디서든 모든 촬영이 가능한, 포스냅";
//        $description = "작가-고객 수수료0%, 에스크로를 통한 안전거래를 제공하는 포스냅에서 최저가 고퀄리티 촬영을 경험하세요.";
//    }
//
//    if (!empty($newWindow)) {
//        $title = "언제 어디서든 모든 촬영이 가능한, 포스냅";
//        $description = "작가-고객 수수료0%, 에스크로를 통한 안전거래를 제공하는 포스냅에서 최저가 고퀄리티 촬영을 경험하세요.";
//    }
//
//    $seo = get_seo([
//        "title" => $title,
//        "description" => $description
//    ]);
//
//    return $this->view->render($response, "views/main/test/main_test.twig", [
//        "env" => $request->getAttribute("env"),
//        "manifest" => $request->getAttribute("manifest"),
//        "seo" => $seo,
//        "browser" => $request->getAttribute("browser"),
//        "logcorp" => $request->getAttribute("logcorp")
//    ]);
//})->setName("main");

/**
 * 로그인 페이지
 */
$app->group("/login", function () {
    $this->get("", function (Request $request, Response $response) {
        if (is_mobile()) {
            return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
        }

        $seo = get_seo([
            "url" => "/login"
        ]);
//        $green_log = greenLog();

        return $this->view->render($response, "views/users/login/login.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser")
//            "logcorp" => $green_log
        ]);
    })->setName("login");

    $this->get("/process/{type}", function (Request $request, Response $response, $type = "") {
        $seo = get_seo([
            "url" => "/process/" . $type
        ]);
//        $green_log = greenLog();

        return $this->view->render($response, "views/users/login/login_process.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "sns" => ["type" => $type],
            "browser" => $request->getAttribute("browser")
//            "logcorp" => $green_log
        ]);
    })->setName("login/process");
});

/**
 * 회원가입 페이지
 */
$app->group("/join", function () {
    $this->get("", function (Request $request, Response $response) {
        if (is_mobile()) {
            return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
        }

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
        if (is_mobile()) {
            return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
        }

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

$app->get("/reserve/receipt/{buy_no}", function (Request $request, Response $response, $buy_no) {
    $seo = get_seo([
        "title" => "포스냅 구매영수증",
//        "description" => "",
        "url" => "/reserve/receipt/" . $buy_no
        //"image" => IMG_SERVER.""
    ]);

    return $this->view->render($response, "views/print_receipt/print_receipt.twig", [
        "env" => $request->getAttribute("env"),
        "manifest" => $request->getAttribute("manifest"),
        "seo" => $seo,
        "browser" => $request->getAttribute("browser")
    ]);
})->setName("print_receipt");

/**
 * 견적소개페이지 (삭제 예정)
 */
$app->get("/intro-estimate", function (Request $request, Response $response) {
    return $response->withStatus(302)->withHeader("Location", "/");
})->setName("intro-estimate");

$app->get("/email-direct", function (Request $request, Response $response) {
//    if (is_mobile()) {
//        return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
//    }

    $query = $request->getQueryParams();

    $seo = get_seo([
        "url" => "/email-direct"
    ]);
//    $green_log = greenLog();

    return $this->view->render($response, "views/intro/direct/email-direct.twig", [
        "env" => $request->getAttribute("env"),
        "manifest" => $request->getAttribute("manifest"),
        "seo" => $seo,
        "query" => json_encode($query)
//        "logcorp" => $green_log
    ]);
})->setName("email-direct");

