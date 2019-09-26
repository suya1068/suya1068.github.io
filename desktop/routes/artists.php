<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Services\AuthService as AuthService;

/**
 * ARTISTS ROUTE
 */
$app->group("/artists", function () {
    $this->get("[/{params:.*}]", function (Request $request, Response $response, $params = null) {
        $this->Logger->debug("작가", ["params" => $params]);
        if ($params == "account/leave" && is_mobile()) {
            return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
        }
        if ($params == "estimate/about" && is_mobile()) {
            return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
        }
        if ($params == "estimate/list" && is_mobile()) {
            return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
        }

        $seo = get_seo([
            "url" => "/artists"
        ]);

        if ($params == "account/leave") {
            $seo = get_seo([
                "url" => "/artists/account/leave"
            ]);
        }

        if ($params == "chat") {
            $seo = get_seo([
                "title" => "1:1 대화하기 - 포스냅",
                "description" => "진행중인 촬영에 대해 고객과 소통할 수 있습니다.",
                "url" => "/artists/chat"
            ]);
        }

        $req_seq = "";
        $api_token = "";

        $this->Logger->debug("아티스트", [ "seo" => $seo, "params" => $params]);

        return $this->view->render($response, "views/artists/artist.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "req_seq" => $req_seq,
            "api_token" => $api_token,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("artist");
});
