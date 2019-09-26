<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->group("/products", function () {
    $this->get("", function (Request $request, Response $response) {
        $browser = $request->getAttribute("browser");
        $bot = isBot($browser["name"]);
        $except_ip = $request->getAttribute("except_ip");

        $params = $request->getQueryParams();
        $newWindow = empty($params["new"]) ? null : $params["new"];
        $biz = empty($params["biz"]) ? null : $params["biz"];

        if (!empty($params["keyword"]) && md5(iconv("UTF-8", "UTF-8", $params["keyword"])) != md5($params["keyword"])) {
            $keyword = iconv("EUC-KR", "UTF-8", $params["keyword"]);
        } else if (!empty($params["keyword"])) {
            $keyword = $params["keyword"];
        } else {
            $keyword = "";
        }

        if (!empty($params["tag"]) && md5(iconv("UTF-8", "UTF-8", $params["tag"])) != md5($params["tag"])) {
            $tag = iconv("EUC-KR", "UTF-8", $params["tag"]);
        } else if (!empty($params["tag"])) {
            $tag = $params["tag"];
        } else {
            $tag = "";
        }

        if (!empty($params["category"])) {
            $category = strtoupper($params["category"]);
        } else {
            $category = "";
        }

//        $is_business = isBusinessCategory($category);
//
//        if ($is_business) {
//            return $response->withStatus(302)->withHeader("Location", get_redirect_uri("desktop"));
//        }

        if (!empty($params["region"]) && md5(iconv("UTF-8", "UTF-8", $params["region"])) != md5($params["region"])) {
            $region = iconv("EUC-KR", "UTF-8", $params["region"]);
        } else if (!empty($params["region"])) {
            $region = $params["region"];
        } else {
            $region = "";
        }

        // =================================================
        // 기업고객이 기본
        $enter = "Y";

        $indi_cookie = $request->getCookieParam(ENTER);
        // indi 쿠키가 존재하고
        // cookie 의 값이 indi (개인) 이라면
        if (isset($indi_cookie) && $indi_cookie == "indi") {
            // enter 값 = N
            $enter = "N";
        }

        if (isset($biz)) {
            $enter = "Y";
        }

        // 기업고객이 개인 카테고리 상품을 접근했을때 enter 값을 N으로 고정
        // 개인, 기업 개선 필수
        if (isset($newWindow)) {
            $enter = "N";
        }
        // ====================================================

        $headers = ["API-TOKEN" => $request->getCookieParam(API_TOKEN_NAME)];
        $page = empty($params["page"]) ? 1 : intval($params["page"]);
        $baseLimit = empty($params["limit"]) ? 6 : intval($params["limit"]);

        $data = [
            "keyword" => $keyword,
            "tag" => $tag,
            "category" => $category,
            "region" => $region,
            "sort" => empty($params["sort"]) ? "recomm" : $params["sort"],
            "page" => $page,
            "enter" => $enter,
            "new" => empty($params["new"]) ? "" : true
        ];

        if ($bot !== false || $except_ip !== false) {
            $baseLimit = empty($params["limit"]) ? 100 : intval($params["limit"]);
            $data["limit"] = $baseLimit;
            $data["offset"] = ($page - 1) * $baseLimit;
        } else {
            $data["limit"] = $page * $baseLimit;
            $data["offset"] = 0;
        }

        if (!empty($params["is_corp"]) && $params["is_corp"] === "Y") {
            $data["is_corp"] = "Y";
        }

        if (!empty($params["reserve_date"])) {
            preg_match("/^([^0][0-9]{1,3}|[0]+[1-9]{1,3})[/.-]?(0[1-9]|1[0-9])[/.-]?([0][1-9]|[1-3][0-9])$/", $params["reserve_date"], $matches);
            if ($matches) {
                $data["reserve_date"] = $params["reserve_date"];
            }
        }

        if (!empty($params["min_price"]) && is_numeric($params["min_price"])) {
            $data["min_price"] = $params["min_price"];
        }

        if (!empty($params["max_price"]) && is_numeric($params["min_price"])) {
            $data["max_price"] = $params["max_price"];
        }

        if (!empty($params["user_id"])) {
            $data["user_id"] = $params["user_id"];
        } else if (!empty($request->getCookieParam(USER_ID_NAME))) {
            $data["user_id"] = $request->getCookieParam(USER_ID_NAME);
        }

        $rsCategory = $this->API->get("/categorys");
        $categoryList = [];
        if ($rsCategory["status"] === 200) {
            if ($rsCategory["data"]) {
                $categoryList = $rsCategory["data"]["category"];
            }
        }

        $result = $this->API->get("/products", $data, $headers);
        unset($result["url"]);

        $seo = get_seo([
            "title" => categoryCodeToName($data["category"]) . "촬영 - 포스냅",
            "description" => "작가-고객 수수료0%, 에스크로를 통한 안전거래를 제공하는 포스냅에서 최저가 고퀄리티 촬영을 경험하세요.",
            "url" => "/products?category=" . $data["category"] . "&tag=" . $data["tag"]
//            "image" => IMG_SERVER . "/list/list_top_img.jpg"
        ]);

        $this->Logger->debug("상품 리스트", ["seo" => $seo, "query" => $params, "Datas" => $data]);
//        $green_log = greenLog();

        $twigName = "views/products/products_list.twig";
        if ($bot !== false || $except_ip !== false) {
            $twigName = "views/products/list/ProductListTemplate.twig";
        }
//        $time_flag = setEventPageDisplayFlag("2019-06-17 12:00:00");

        return $this->view->render($response, $twigName, [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $browser,
            "except_ip" => $request->getAttribute("except_ip"),
            "thumb_host" => THUMB_SERVER,
            "products" => [
                "result" => json_encode($result),
                "data" => $result["data"],
//                "is_biz" => $is_business,
                "is_biz" => isBusinessCategory($category),
                "params" => $data
            ],
//            "time_flag" => $time_flag,
            "category_list" => json_encode($categoryList),
//            "logcorp" => $green_log,
            "params" => json_encode(array_merge($data, ["page" => $page, "limit" => $baseLimit]))
        ]);
    })->setName("products/list");

    $this->get("/{no}", function (Request $request, Response $response, $no) {
        $this->Logger->debug("[상품상세]", ["no" => $no]);

        $browser = $request->getAttribute("browser");
        $bot = isBot($browser["name"]);
        $except_ip = $request->getAttribute("except_ip");

        // 현재 주소의 파라미터를 가져온다.
        $params = $request->getQueryParams();
        $newWindow = empty($params["new"]) ? null : $params["new"];
        $biz = empty($params["biz"]) ? null : $params["biz"];
        $inflow = empty($params["inflow"]) ? null :$params["inflow"];

        // inflow 파라미터는 inflow=enter-indi 형식으로 넘어온다.
        if (isset($inflow)) {
            // inflow 값을 - 으로 explode 한다.
            $pase_inflow = explode("-", $inflow);
            // inflow_type = naver , 유입된 사이트는 네이버이다.
            if (!empty($pase_inflow)) {
                $inflow_type = $pase_inflow[0];
                // enter_type = indi , 개인고객임을 나타낸다.
                $enter_type = $pase_inflow[1] || "";
                if (isset($enter_type) && $enter_type === "indi") {
                    $has_enter = $enter_type;
                }
            }
        }

        // =================================================
        // 기업고객이 기본
        $enter = "Y";

        $indi_cookie = $request->getCookieParam(ENTER);
        // indi 쿠키가 존재하고
        // cookie 의 값이 indi (개인) 이라면
        if (isset($indi_cookie) && $indi_cookie == "indi") {
            // enter 값 = N
            $enter = "N";
        }

        if (isset($biz)) {
            $enter = "Y";
        }

        // 기업고객이 개인 카테고리 상품을 접근했을때 enter 값을 N으로 고정
        // 개인, 기업 개선 필수
        if (isset($newWindow)) {
            $enter = "N";
        }

        // 유입된 마켓 타입과 기업변수가 있을 경우 기업 검색 파라미터를 Y로 변경한다.
        if (isset($has_enter) && isset($inflow_type)) {
            $enter = "N";
        }
        // ====================================================

        $uuid = $request->getCookieParam(FORSNAP_UUID);
        $headers = ["API-TOKEN" => $request->getCookieParam(API_TOKEN_NAME)];

        $query = [
            "uuid" => $uuid,
            "enter" => $enter
        ];
        $this->Logger->debug("query check - product_detail", ["query" => $query]);

        $result = $this->API->get("/products/".$no, $query, $headers);
//        $result = $this->API->get("/products/".$no."?uuid=".$uuid, null, $headers);
        unset($result["url"]);

        $status = $result["status"];

        if ($status !== 200) {
            $response->withStatus($status);
        }


        $data = empty($result["data"])
            ? [
                "title" => "상품 상세",
                "description" => "웨딩, 가족, 촬영 등 상품 상세내용을 보여줍니다."
            ]
            : $result["data"];

        $search_structured_data = createProductStructuredData($data);

//        // 기업상세 페이지 포트폴리오 리다이렉트 코드
//        if (!empty($data)) {
//            $category_arr = array("FOOD", "PRODUCT", "BEAUTY", "INTERIOR", "FASHION", "PROFILE_BIZ", "VIDEO_BIZ", "EVENT");
//            if (in_array($data["category"], $category_arr)) {
//                $scheme = !empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off" ? "https" : "http";
//
//                return $response->withStatus(302)->withHeader("Location", $scheme . "://" . $_SERVER["HTTP_HOST"] . "/portfolio/" . $data["product_no"]);
//            }
//        }

        // 무료작가가 상세 접근 시 포트폴리오 페이지로 리다이렉트 기능
        if (!empty($data)) {
            $category_arr = array("FOOD", "PRODUCT", "BEAUTY", "INTERIOR", "FASHION", "PROFILE_BIZ", "VIDEO_BIZ", "EVENT");
            if (in_array($data["category"], $category_arr) && empty($data["charge_artist_no"])) {
                $scheme = !empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off" ? "https" : "http";

                return $response->withStatus(302)->withHeader("Location", $scheme . "://" . $_SERVER["HTTP_HOST"] . "/portfolio/" . $data["product_no"]);
            }
        }


        $seo = get_seo([
            "title" => $data["title"] . " - 포스냅",
            "description" => $data["description"],
            "url" => "/products/" . $no,
//            "image" => empty($data["main_img"]) ? null : THUMB_SERVER . "/normal1/1200/630" . $data["main_img"]
            "image" => empty($data["thumb_img"]) ? null : THUMB_SERVER . "/normal/crop/1200x630" . $data["thumb_img"]
        ]);
//        $green_log = greenLog();

        $this->Logger->debug("상품 상세", ["seo" => $seo, "result" => $result, "search_structured_data" => $search_structured_data]);

        $twigName = "views/products/products_detail.twig";
        if ($bot !== false || $except_ip !== false) {
            $twigName = "views/products/package/ProductDetailTemplate.twig";
        }

        return $this->view->render($response, $twigName, [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "category" => $data["category"],
            "browser" => $request->getAttribute("browser"),
            "except_ip" => $request->getAttribute("except_ip"),
            "thumb_host" => THUMB_SERVER,
            "products" => [
                "result" => json_encode($result),
                "data" => $result["data"]
            ],
//            "logcorp" => $green_log,
            "search_structured_data" => json_encode($search_structured_data)
        ]);
    })->setName("products/product-detail");

    $this->get("/{no}/process", function (Request $request, Response $response, $no) {
        $this->Logger->debug("[상품 결제완료]", ["no" => $no]);

        $seo = get_seo([
//            "title" => "결제완료",
//            "description" => "결제완료",
            "url" => "/products/" . $no . "/process"
        ]);
//        $green_log = greenLog();

        $this->Logger->debug("상품 결제완료", ["seo" => $seo]);

        return $this->view->render($response, "views/products/products_process.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser"),
//            "logcorp" => $green_log,
            "product" => ["no" => $no]
        ]);
    })->setName("products/product-detail");

    // 유튜브 동영상 정보 추출
    $this->get("/youtube_parser/{id}", function (Request $request, Response $response, $videoId) {
        $this->Logger->debug("[유튜브 비디오 아이디]", ["videoId" => $videoId]);

        $reqeustUrl = "http://youtube.com/get_video_info?video_id=" . $videoId;

        $content = file_get_contents($reqeustUrl);
//        $length_seconds = $data["player_response"];

        $data = null;

        if ($content !== false) {
            parse_str($content,$data);
        }

        //$this->Logger->debug("[유튜브 데이터 파싱]", ["data" => $data]);

        if (!empty($data)) {
            return $response->withJson(json_decode($data["player_response"]), 200);
//            return $response->withJson($length_seconds, 200);
//        } else {
//            return $response->withJson("정보를 조회할 수 없습니다.", 404);
        }
    })->setName("products/youtube_parser");
});


