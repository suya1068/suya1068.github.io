<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * ARTISTS ROUTE
 */

$app->group("/artists", function () {
//    $this->get("/{id}/about", function (Request $request, Response $response, $id) {
//        $seo = get_seo([
//            "title" => "작가 - 소개페이지",
//            "description" => "작가의 소개를 볼 수 있습니다.",
//            "url" => "/artists/" . $id . "/about"
//        ]);
//
//        return $this->view->render($response, "views/artists/about/artist_about.twig", [
//            "env" => $request->getAttribute("env"),
//            "manifest" => $request->getAttribute("manifest"),
//            "seo" => $seo,
//            "browser" => $request->getAttribute("browser")
//        ]);
//    })->setName("artists-about");
    $this->get("/account/leave", function (Request $request, Response $response) {
        $seo = get_seo([
//            "title" => "작가 - 회원탈퇴",
//            "description" => "작가 회원탈퇴 페이지입니다.",
            "url" => "/artists/account/leave"
        ]);

        return $this->view->render($response, "views/artists/account/leave/artist_leave.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("artists-chat");

    $this->get("/chat", function (Request $request, Response $response) {
        $seo = get_seo([
            "title" => "1:1 대화하기 - 포스냅",
            "description" => "진행중인 촬영에 대해 고객과 소통할 수 있습니다.",
            "url" => "/artists/chat"
        ]);

        return $this->view->render($response, "views/artists/chat/artists_chat.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("artists-chat");

    $this->get("/quotation[/{params:.*}]", function (Request $request, Response $response) {
        $seo = get_seo([
//            "title" => "작가 - 견적서",
//            "description" => "고객이 요청한 촬영의뢰서에 견적을 냅니다.",
            "url" => "/artists/quotation"
        ]);

        return $this->view->render($response, "views/artists/estimate/estimate.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("user-quotation");

    $this->get("/estimate[/{params:.*}]", function (Request $request, Response $response) {
        $seo = get_seo([
//            "title" => "작가 - 촬영요청서",
//            "description" => "고객이 요청한 촬영의뢰서를 봅니다.",
            "url" => "/artists/estimate"
        ]);

        return $this->view->render($response, "views/artists/estimate/estimate.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("user-quotation");

    $this->get("/progress[/{status}]", function (Request $request, Response $response) {
        $seo = get_seo([
            "title" => "작가 - 진행상황",
            "description" => "",
            "url" => "/artists/progress"
        ]);

        return $this->view->render($response, "views/artists/progress/ProgressPage.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("artists/progress");

    $this->get("/[{params:.*}]", function (Request $request, Response $response, $params = null) {
        $scheme = !empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off" ? "https" : "http";
        return $response->withStatus(302)->withHeader("Location", $scheme . "://" . str_replace("m.", "", $_SERVER["HTTP_HOST"]) . $_SERVER["REQUEST_URI"]);
    });
});
