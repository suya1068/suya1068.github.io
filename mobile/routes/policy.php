<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

/**
 * policy ROUTE
 */
$app->group("/policy", function () {
    $this->get("/private", function (Request $request, Response $response) {
        $seo = get_seo([
//            "title" => "포스냅 개인정보 취급방침",
//            "description" => "포스냅 - 개인정보 취급방침",
            "url" => "/policy/private"
        ]);
//        $green_log = greenLog();

        return $this->view->render($response, "views/policy/private.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "except_ip" => $request->getAttribute("except_ip"),
            "seo" => $seo,
//            "logcorp" => $green_log,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("policy/private");

    $this->get("/term", function (Request $request, Response $response) {
        $seo = get_seo([
//            "title" => "포스냅 이용약관",
//            "description" => "포스냅 - 이용약관",
            "url" => "/policy/term"
        ]);
//        $green_log = greenLog();

        return $this->view->render($response, "views/policy/term.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "except_ip" => $request->getAttribute("except_ip"),
            "seo" => $seo,
//            "logcorp" => $green_log,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("policy/term");
});
