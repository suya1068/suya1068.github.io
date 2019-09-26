<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * USERS ROUTE
 */
$app->group("/users", function () {
    $this->get("", function (Request $request, Response $response) {
        $encode_data = "";
        $req_seq = "";
        $api_token = "";

        $seo = get_seo([
//            "title" => "유저 - 포스냅",
//            "description" => "개인정보 관리 및 상품에 관련 정보를 볼 수 있습니다.",
            "url" => "/users"
        ]);

        return $this->view->render($response, "views/users/mypage/mypage.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser"),
            "encode_data" => $encode_data,
            "req_seq" => $req_seq,
            "api_token" => $api_token
        ]);
    })->setName("user");

    $this->get("/myaccount", function (Request $request, Response $response) {
        $encode_data = "";
        $req_seq = "";
        $api_token = "";

        $seo = get_seo([
//            "title" => "유저 - 계정설정",
//            "description" => "개인정보 관리 및 상품에 관련 정보를 볼 수 있습니다.",
            "url" => "/users"
        ]);

        return $this->view->render($response, "views/users/mypage/pages/account/account.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser"),
            "encode_data" => $encode_data,
            "req_seq" => $req_seq,
            "api_token" => $api_token
        ]);
    })->setName("user-account");

    $this->get("/myaccount/leave", function (Request $request, Response $response) {
        $encode_data = "";
        $req_seq = "";
        $api_token = "";

        $seo = get_seo([
//            "title" => "유저 - 회원탈퇴",
//            "description" => "회원탈퇴 페이지 페이지입니다.",
            "url" => "/users/myaccount/leave"
        ]);

        return $this->view->render($response, "views/users/mypage/pages/leave/users_leave.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser"),
            "encode_data" => $encode_data,
            "req_seq" => $req_seq,
            "api_token" => $api_token
        ]);
    })->setName("user-leave");

    $this->get("/chat", function (Request $request, Response $response) {
        $encode_data = "";
        $req_seq = "";
        $api_token = "";

        $seo = get_seo([
            "title" => "1:1대화하기 - 포스냅",
            "description" => "촬영과 관련된 궁금한 점을 작가님께 직접 문의해보세요.",
            "url" => "/users/chat"
        ]);

        return $this->view->render($response, "views/users/mypage/pages/chat/chat.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser"),
            "encode_data" => $encode_data,
            "req_seq" => $req_seq,
            "api_token" => $api_token
        ]);
    })->setName("user-chat");

    $this->get("/like", function (Request $request, Response $response) {
        $encode_data = "";
        $req_seq = "";
        $api_token = "";

        $seo = get_seo([
//            "title" => "유저 - 내하트목록",
//            "description" => "즐겨찾기한 상품들의 목록을 볼 수 있습니다.",
            "url" => "/users/like"
        ]);

        return $this->view->render($response, "views/users/mypage/pages/like/like.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser"),
            "encode_data" => $encode_data,
            "req_seq" => $req_seq,
            "api_token" => $api_token
        ]);
    })->setName("user-like");

//    $this->get("/quotation[/{params:.*}]", function (Request $request, Response $response) {
//        $seo = get_seo([
//            "title" => "유저 - 촬영요청",
//            "description" => "전국에 있는 포토그래퍼, 촬영요청을 한 번에!",
//            "url" => "/users/quotation"
//        ]);
//
//        return $this->view->render($response, "views/users/quotation/quotation_request.twig", [
//            "env" => $request->getAttribute("env"),
//            "manifest" => $request->getAttribute("manifest"),
//            "seo" => $seo,
//            "browser" => $request->getAttribute("browser")
//        ]);
//    })->setName("user-quotation");

    $this->get("/estimate/{order}/offer/{offer}/process", function (Request $request, Response $response, $order, $offer) {
        $seo = get_seo([
//            "title" => "유저 - 촬영 요청서 결제 완료",
//            "description" => "촬영 요청서 결제 완료 내용을 볼 수 있습니다.",
            "url" => "/users/estimate/process"
        ]);

        return $this->view->render($response, "views/users/mypage/pages/estimate/estimate_process.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser"),
            "numbers" => ["order"=>$order, "offer"=>$offer]
        ]);
    })->setName("user-estimate");

    $this->get("/estimate[/{params:.*}]", function (Request $request, Response $response, $params = null) {

        $seo = get_seo([
//            "title" => "유저 - 나의 촬영 요청",
//            "description" => "나의 촬영 요청 정보를 살펴 볼 수 있습니다.",
            "url" => "/users/estimate"
        ]);

        return $this->view->render($response, "views/users/mypage/pages/estimate/estimate.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("user-estimate");

    $this->get("/ticket[/{params:.*}]", function (Request $request, Response $response, $params = null) {
        if ($params) {
           return $response->withStatus(302)->withHeader("Location", "/users/ticket");
        }

        $seo = get_seo([
//            "title" => "유저 - 나의 티켓",
//            "description" => "나의 티켓 현황을 볼 수 있습니다",
            "url" => "/users/tickets"
        ]);

        $this->Logger->debug("티켓", ["seo" => $seo, "params" => $params]);

        return $this->view->render($response, "views/users/mypage/pages/ticket/ticket.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("user-ticket");

    $this->get("/payment/process", function (Request $request, Response $response) {
        $seo = get_seo([
//            "title" => "유저 - 결제 완료",
//            "description" => "결제 완료 내용을 볼 수 있습니다.",
            "url" => "/users/payment/process"
        ]);

        return $this->view->render($response, "views/users/payment/process/payment_process.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("user-estimate");

    $this->get("/progress[/{status}]", function (Request $request, Response $response) {
        $seo = get_seo([
            "title" => "유저 - 진행상황",
            "description" => "",
            "url" => "/users/progress"
        ]);

        return $this->view->render($response, "views/users/progress/ProgressPage.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("users/progress");

    $this->get("/reservation/photo[/{buy_no}[/{product_no}]]", function (Request $request, Response $response) {
        $seo = get_seo([
            "title" => "유저 - 전달받은 사진",
            "description" => "",
            "url" => "/users/reservation/photo"
        ]);

        return $this->view->render($response, "views/users/reservation/photo/ReservationPhotoPage.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("users/reservation/photo");

    $this->get("/[{params:.*}]", function (Request $request, Response $response, $params = null) {
        $scheme = !empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off" ? "https" : "http";
        return $response->withStatus(302)->withHeader("Location", $scheme . "://" . str_replace("m.", "", $_SERVER["HTTP_HOST"]) . $_SERVER["REQUEST_URI"]);
    });
});
