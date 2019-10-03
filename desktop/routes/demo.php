<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

/**
 * DEMO ROUTE
 */
$app->get("/demo", function (Request $request, Response $response) {
    $seo = [
        "title" => "DEMO"
    ];

    return $this->view->render($response, "views/demo/demo.twig", [
        "seo" => $seo,
        "manifest" => $request->getAttribute("manifest"),
        "browser" => $request->getAttribute("browser")
    ]);
})->setName("demo");
