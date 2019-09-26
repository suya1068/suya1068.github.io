<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;


$app->group("/ticket", function () {
    $this->get("[/{params:.*}]", function (Request $request, Response $response) {
        if (is_mobile()) {
            return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
        }
        $params = $request->getQueryParams();
        $title = "인생사진관";

        $seo = get_seo([
//            "title" => "포스냅 - " . $title,
//            "description" => $title,
            "url" => "/ticket"
//            "image" => IMG_SERVER . "/life/life_main_thumb.jpg"
        ]);

        $this->Logger->debug("포스냅 티켓", ["seo" => $seo, "query" => $params]);

        return $this->view->render($response, "views/ticket/TicketPage.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo
        ]);
    })->setName("ticket/main");

//    $this->get("/process", function (Request $request, Response $response) {
//        $seo = get_seo([
//            "title" => "결제완료",
//            "description" => "결제완료",
//            "url" => "/ticket/process"
//        ]);
//
//        $this->Logger->debug("상품 결제완료", ["seo" => $seo]);
//
//        return $this->view->render($response, "views/ticket/TicketProcessPage.twig", [
//            "env" => $request->getAttribute("env"),
//            "manifest" => $request->getAttribute("manifest"),
//            "seo" => $seo
//        ]);
//    })->setName("ticket/process");
});
