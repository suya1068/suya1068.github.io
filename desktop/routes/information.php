<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

/**
 * INFORMATION ROUTE
 */
$app->get("/information[/{params:.*}]", function (Request $request, Response $response, $params = "introduce") {
    if (is_mobile()) {
        return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
    }

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
        "browser" => $request->getAttribute("browser")
//        "logcorp" => $green_log
    ]);
});
