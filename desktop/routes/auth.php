<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * AUTH ROUTE
 */
$app->group("/auth", function () {
    $this->post("/{name}", function (Request $request, Response $response, $name) {
        $seo = get_seo([
            "title" => "본인인증 - 포스냅",
            "description" => "예쁜 사진을 날길 수 있어요.",
            "url" => "/auth/" . $name
        ]);

        $params = $request->getParsedBody();

        $encode_data = $params["EncodeData"];
        $req_seq = $params["param_r1"];
        $headers = ["API-TOKEN" => $params["param_r2"]];
        $result = null;

        $this->Logger->debug("유저", ["seo" => $seo, "params" => $params, "headers" => $headers]);

        $result = $this->API->post("/artist/decrypt", ["enc_data" => $encode_data], $headers);
        $result["data"]["encode_data"] = $encode_data;
        $this->Logger->debug("decrpyt!", ["result" => $result]);

        if ($name === "success" && $req_seq === $result["data"]["req_seq"]) {
            $result["status"] = 200;
        } else {
            $result["status"] = 400;
        }

        $this->Logger->debug("auth " . $name, ["result" => $result]);

        return $this->view->render($response, "views/users/auth/auth_result.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "data" => json_encode($result)
        ]);
    });
});
