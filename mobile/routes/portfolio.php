<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

$app->group("/portfolio", function () {
    $this->get("/category/{code}", function (Request $request, Response $response, $code) {

        return $response->withStatus(302)->withHeader("Location", "/products?category=" . $code);
//        $browser = $request->getAttribute("browser");
//        $bot = isBot($browser["name"]);
//        $except_ip = $request->getAttribute("except_ip");
//
//        $code = strtoupper($code);
//        $category_name = "";
//
//        switch ($code) {
//            case "PRODUCT":
//                $category_name = "제품";
//                break;
//            case "BEAUTY":
//                $category_name = "뷰티";
//                break;
//            case "FOOD":
//                $category_name = "음식";
//                break;
//            case "PROFILE_BIZ":
//                $category_name = "기업프로필";
//                break;
//            case "INTERIOR":
//                $category_name = "인테리어";
//                break;
//            case "EVENT":
//                $category_name = "행사";
//                break;
//            case "FASHION":
//                $category_name = "패션";
//                break;
//            default:
//                return $response->withStatus(302)->withHeader("Location", "/");
//                break;
//        }
//
//        $seo = get_seo([
//            "title" => "포스냅 - ".$category_name." 추천포트폴리오",
//            "description" => "포스냅 " . $category_name . " 추천포트폴리오",
//            "url" => "/portfolio/category/" . $code
//            //"image" => IMG_SERVER.""
//        ]);
//
////        $green_log = greenLog();
//
//        $twigName = "views/portfolio/category/PortfolioCategoryPage.twig";
//        if ($bot !== false || $except_ip !== false) {
//            $twigName = "views/portfolio/category/PortfolioCategoryTemplate.twig";
//            $headers = ["API-TOKEN" => $request->getCookieParam(API_TOKEN_NAME)];
//            $query = [
//                "category" => $code
//            ];
//            $rs = $this->API->get("/products/main-portfolio", $query, $headers);
//            $data = $rs["data"];
//        }
//
//        return $this->view->render($response, $twigName, [
//            "env" => $request->getAttribute("env"),
//            "manifest" => $request->getAttribute("manifest"),
//            "seo" => $seo,
//            "except_ip" => $request->getAttribute("except_ip"),
//            "browser" => $request->getAttribute("browser"),
////            "logcorp" => $green_log,
//            "thumb_host" => THUMB_SERVER,
//            "portfolio" => $data,
//            "category" => [
//                "code" => $code,
//                "name" => $category_name
//            ]
//        ]);
    })->setName("portfolio/category");
});
