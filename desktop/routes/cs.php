<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

$app->group("/cs", function () {
    $this->get("[/{params:.*}]", function (Request $request, Response $response, $params = null) {
        if (is_mobile()) {
            return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
        }

        $seo = get_seo([
            "url" => "/cs"
        ]);

        $this->Logger->debug("customer-center", ["seo" => $seo, "params" => $params]);

//        $green_log = greenLog();

        return $this->view->render($response, "views/cs/cs.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "except_ip" => $request->getAttribute("except_ip"),
            "browser" => $request->getAttribute("browser")
//            "logcorp" => $green_log
        ]);

    })->setName("cs");
});
