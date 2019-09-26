<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

/**
 * INFORMATION ROUTE
 */
$app->get("/policy[/{params:.*}]", function (Request $request, Response $response, $params) {
    if (is_mobile()) {
        return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
    }

    $seo = get_seo([
//        "title" => "개인정보 및 이용약관",
//        "description" => "예쁜 사진을 남길 수 있어요.",
        "url" => "/policy/" . $params
    ]);
//    $green_log = greenLog();

    return $this->view->render($response, "views/policy/policy.twig", [
        "env" => $request->getAttribute("env"),
        "manifest" => $request->getAttribute("manifest"),
        "except_ip" => $request->getAttribute("except_ip"),
        "seo" => $seo,
        "browser" => $request->getAttribute("browser")
//        "logcorp" => $green_log
    ]);
})->setName("policy");
