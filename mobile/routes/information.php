<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * INFORMATION ROUTE
 */
$app->get("/information[/{params:.*}]", function (Request $request, Response $response, $params = "introduce") {
    $seo = get_seo([
        "url" => "/information/" . $params
    ]);

    $this->Logger->debug("information", ["seo" => $seo]);
//    $green_log = greenLog();

    return $this->view->render($response, "views/information/information.twig", [
        "env" => $request->getAttribute("env"),
        "manifest" => $request->getAttribute("manifest"),
        "except_ip" => $request->getAttribute("except_ip"),
        "seo" => $seo,
//        "logcorp" => $green_log,
        "browser" => $request->getAttribute("browser")
    ]);
});
