<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Services\AuthService as AuthService;

/**
 * USERS ROUTE
 */
$app->group("/users", function () {
    $this->get("[/{params:.*}]", function (Request $request, Response $response, $params) {
        $this->Logger->debug("유저", ["params" => $params]);
        if ($params == "myaccount/leave" && is_mobile()) {
            return $response->withStatus(302)->withHeader("Location", get_redirect_uri());
        }

        $encode_data = "";
        $req_seq = "";
        $api_token = "";

        $seo = get_seo([
//            "title" => "유저 - 포스냅",
//            "description" => "개인정보 관리 및 상품에 관련 정보를 볼 수 있습니다.",
            "url" => "/users"
        ]);

        if ($params == "myaccount/leave") {
            $seo = get_seo([
//                "title" => "유저 - 회원탈퇴",
//                "description" => "회원탈퇴 페이지입니다.",
                "url" => "/users/myaccount/leave"
            ]);
        }

        if ($params == "chat") {
            $seo = get_seo([
                "title" => "1:1대화하기 - 포스냅",
                "description" => "촬영과 관련된 궁금한 점을 작가님께 직접 문의해보세요.",
                "url" => "/users/chat"
            ]);
        }

        if ($params === "registartist") {
            $api_token = $request->getCookieParam(API_TOKEN_NAME);
            $auth = new AuthService();
            $result = $auth->createReqSeq()->getEncodeData();

            $encode_data = $result["data"];
            $req_seq = $auth->getReqSeq();

//            $seo["title"] = "작가등록 - 포스냅";
            $seo["url"] = "/users/registartist";
        }

        $this->Logger->debug("유저", ["seo" => $seo, "$params" => $params]);

        return $this->view->render($response, "views/users/user.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "encode_data" => $encode_data,
            "req_seq" => $req_seq,
            "api_token" => $api_token,
            "browser" => $request->getAttribute("browser")
        ]);
    })->setName("user");
});
