<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

$app->group("/cs", function () {
    $this->get("[/{params:.*}]", function (Request $request, Response $response, $params = null) {
        $seo = get_seo([
//            "title" => "공지사항 및 고객센터",
//            "description" => "궁금한 점을 물어봐요.",
            "url" => "/cs/" . $params
        ]);

        $this->Logger->debug("customer-center", ["seo" => $seo, "params" => $params]);
//        $green_log = greenLog();

        return $this->view->render($response, "views/cs/cs.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "except_ip" => $request->getAttribute("except_ip"),
            "seo" => $seo,
//            "logcorp" => $green_log,
            "browser" => $request->getAttribute("browser")
        ]);

    })->setName("cs");
});
