<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Services\AuthService as AuthService;

/**
 * PAYMENT ROUTE
 */
$app->group("/landing", function () {
    $this->get("/201907", function (Request $request, Response $response) {
        $seo = get_seo([
            "title" => "포스냅 제품 촬영 방법",
            "description" => "촬영비 가지고 장난치지 않습니다.",
            "url" => "/landing/201907"
        ]);

        return $this->view->render($response, "views/landing/LandingPage.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("event");
});
