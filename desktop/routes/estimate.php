<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

/**
 * PAYMENT ROUTE
 */
$app->group("/estimate", function () {
    $this->get("/{estimate_url}", function (Request $request, Response $response, $estimate_url) {
        $seo = get_seo([
            "title" => "포스냅 견적서입니다.",
            "description" => "포스냅에서 전달한 견적서입니다. 비밀번호를 입력하시면 견적서를 확인하실 수 있습니다.",
            "url" => "/estimate/".$estimate_url,
            "image" => IMG_SERVER."/estimate/logo_estimate.png"
        ]);

        return $this->view->render($response, "views/estimate/outside/estimate_outside.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser"),
            "estimate_url" => $estimate_url
        ]);
    })->setName("estimate-outside");
});
