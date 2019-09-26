<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Services\AuthService as AuthService;

/**
 * PAYMENT ROUTE
 */
$app->group("/event", function () {
    $this->get("/201907", function (Request $request, Response $response) {
        $seo = get_seo([
            "title" => "포스냅 제품 연출 대행 무료 이벤트",
            "description" => "제품 촬영 때문에 고민하지마세요!",
            "url" => "/event/201907"
        ]);

        return $this->view->render($response, "views/event/EventPage.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("event");
});
