<?php

if (!function_exists("get_http_dev_name")) {
    function get_http_dev_name($httpHost = '') {
        $regs = "/\b(?<type>\w+).(?<name>\w+)-\w+.\w+(?:\:(?<port>\d+))?/im";
        if (preg_match($regs, $httpHost, $matches)) {
            return $matches["name"];
        }

        return "";
    }
}

if (!function_exists("get_client_ip_env")) {
    // PHP
    function get_client_ip_env() {
        if (!empty($_SERVER["HTTP_CF_CONNECTING_IP"]))
        {
            return $_SERVER["HTTP_CF_CONNECTING_IP"];
        }
        else if (!empty(getenv("HTTP_CLIENT_IP")))
        {
            return getenv("HTTP_CLIENT_IP");
        }
        else if(!empty(getenv("HTTP_X_FORWARDED_FOR")))
        {
            return getenv("HTTP_X_FORWARDED_FOR");
        }
        else if(!empty(getenv("HTTP_X_FORWARDED")))
        {
            return getenv("HTTP_X_FORWARDED");
        }
        else if(!empty(getenv("HTTP_FORWARDED_FOR")))
        {
            return getenv("HTTP_FORWARDED_FOR");
        }
        else if(!empty(getenv("HTTP_FORWARDED")))
        {
            return getenv("HTTP_FORWARDED");
        }
        else if(!empty(getenv("REMOTE_ADDR")))
        {
            return getenv("REMOTE_ADDR");
        }

        return "UNKNOWN";
    }
}

if (!function_exists("get_client_ip_server")) {
    // web-server
    function get_client_ip_server() {
        if (!empty($_SERVER["HTTP_CF_CONNECTING_IP"]))
        {
            return $_SERVER["HTTP_CF_CONNECTING_IP"];
        }
        else if (!empty($_SERVER["HTTP_CLIENT_IP"]))
        {
            return $_SERVER["HTTP_CLIENT_IP"];
        }
        else if(!empty($_SERVER["HTTP_X_FORWARDED_FOR"]))
        {
            return $_SERVER["HTTP_X_FORWARDED_FOR"];
        }
        else if(!empty($_SERVER["HTTP_X_FORWARDED"]))
        {
            return $_SERVER["HTTP_X_FORWARDED"];
        }
        else if(!empty($_SERVER["HTTP_FORWARDED_FOR"]))
        {
            return $_SERVER["HTTP_FORWARDED_FOR"];
        }
        else if(!empty($_SERVER["HTTP_FORWARDED"]))
        {
            return $_SERVER["HTTP_FORWARDED"];
        }
        else if(!empty($_SERVER["REMOTE_ADDR"]))
        {
            return $_SERVER["REMOTE_ADDR"];
        }

        return "UNKNOWN";
    }
}

if (!function_exists("is_mobile")) {
    function is_mobile() {
//    "|Kindle|Silk|KFAPW|KFARWI|KFASWI|KFFOWI|KFJW|KFMEWI|KFOT|KFS‌​AW|KFSOWI|KFTBW|KFTH‌​W|KFTT|WFFOWI".

        return preg_match("/\b(ip(hone|od|ad)|android|opera m(ob|in)i|windows (phone|ce)|blackberry|tablet".
            "|s(ymbian|eries60|amsung)|p(laybook|alm|rofile|laystation portable)|nokia|fennec|htc[\-_]".
            "|m(idp|obile)|up\.browser|[1-4][0-9]{2}x[1-4][0-9]{2})\b/i", $_SERVER["HTTP_USER_AGENT"]);
    }

}

if (!function_exists("get_redirect_uri")) {
    function get_redirect_uri($type = "mobile") {
        $scheme = !empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off" ? "https" : "http";

        return $type === "mobile"
            ? $scheme . "://m." . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"]
            : $scheme . "://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"];
    }
}

if (!function_exists("get_seo")) {
    function get_seo($data) {
        $result = [];
        $result["live"] = LIVE;
        $result["production"] = PRODUCTION;
        $result["title"] = empty($data["title"]) ? "언제 어디서든 모든 촬영이 가능한 포스냅" : $data["title"];
        $result["description"] = empty($data["description"]) ? "작가-고객 수수료0%, 에스크로를 통한 안전거래를 제공하는 포스냅에서 최저가 고퀄리티 촬영을 경험하세요." : $data["description"];
        $result["url"] = empty($data["url"]) ? HOST_DOMAIN : HOST_DOMAIN . $data["url"];
        $result["image"] = empty($data["image"]) ? IMG_SERVER . "/common/default_thumb.jpg" : $data["image"];
//        $result["image"] = empty($data["image"]) ? IMG_SERVER . "/main/top_visual/top_visual_03.jpg" : $data["image"];

        return $result;
    }
}

if (!function_exists("getBrowser")) {
    function getBrowser() {
        $agent = $_SERVER["HTTP_USER_AGENT"];
        $props = ["agent" => $agent];

        if (preg_match("/edge[0-9\.\/]+/i", $agent, $match)) {
            $props["name"] = "edge";
            $props["version"] = explode("/", $match[0])[1];
        } else if (preg_match_all("/msie [0-9\.\/]+|trident[0-9\.\/]+/i", $agent, $match)) {
            $props["name"] = "ie";

            $props["match"] = implode($match, "|");
            if (sizeof($match[0]) > 1) {
                $props["version"] = explode(" ", $match[0][0])[1];
            } else {
                $version = explode("/", $match[0][0])[1];
                if ($version == 7.0) {
                    $props["version"] = "11.0";
                } else {
                    $props["version"] = "other version";
                }
            }
        } else if (preg_match("/yeti[0-9\.\/]+/i", $agent, $match)) {
            $props["name"] = "naver_search_bot";
            $props["version"] = explode("/", $match[0])[1];
        } else if (preg_match("/adsbot-naver[0-9\.\/]+/i", $agent, $match)) {
            $props["name"] = "naver_bot";
            $props["version"] = explode("/", $match[0])[1];
        } else if (preg_match("/\(naver\)\((higgs|inapp)[\w\W]+\)/i", $agent, $match)) {
            $props["name"] = "naver";
            $props["version"] = "none";
        } else if (preg_match("/\(daum|daumoa\)[0-9\.\/]+/i", $agent, $match)) {
            $props["name"] = "daum_bot";
            $props["version"] = "none";
        } else if (preg_match("/googlebot[0-9\.\/]+/i", $agent, $match)) {
            $props["name"] = "google_bot";
            $props["version"] = "none";
        } else if (preg_match("/chrome[0-9\.\/]+/i", $agent, $match)) {
            $props["name"] = "chrome";
            $props["version"] = explode("/", $match[0])[1];
        } else if (preg_match("/safari[0-9\.\/]+/i", $agent, $match)) {
            $props["name"] = "safari";
            $props["version"] = explode("/", $match[0])[1];
        } else if (preg_match("/firefox[0-9\.\/]+/i", $agent, $match)) {
            $props["name"] = "firefox";
            $props["version"] = explode("/", $match[0])[1];
        } else if (preg_match("/opera[0-9\.\/]+/i", $agent, $match)) {
            $props["name"] = "opera";
            $props["version"] = explode("/", $match[0])[1];
        } else {
            $props["name"] = "other";
            $props["version"] = "none";
        }

        return $props;
    }
}

if (!function_exists("isBot")) {
    function isBot($name) {
        switch ($name) {
            case "naver_bot":
                return true;
            case "daum_bot":
                return true;
            default:
                break;
        }

        return false;
    }
}

if (!function_exists("setEventPageDisplayFlag")) {
    function setEventPageDisplayFlag($targetDate) {
        $current_date = date("Y-m-d H:i:s");
        $str_currentDate = strtotime($current_date);
        $str_targetDate = strtotime($targetDate);

        return $str_currentDate >= $str_targetDate ? "true" : "false";
    }
}

if (!function_exists("createProductStructuredData")) {
    function createProductStructuredData($data) {
        if (empty($data["product_no"])) {
            return [];
        }

        $result = [
            "@context"          => "http://schema.org",
            "@type"             => "Product",
            "url"               => HOST_DOMAIN . "/products/" . $data["product_no"],
            "category"          => $data["category_name"],
            "name"              => $data["title"],
            "description"       => $data["description"],
            "image"             => THUMB_SERVER . "/normal/crop/1400x1000" . $data["thumb_img"],
            "brand"             => "포스냅",
            "offers"            => createProductPriceAll($data)
        ];

        if (!empty($data["review"]["total_cnt"])) {
            $result["aggregateRating"] = createProductAggregateRating($data["rating_avg"], $data["review"]["total_cnt"]);
        }

        return $result;
    }
}

if (!function_exists("createProductPriceAll")) {
    function createProductPriceAll($data) {
        $list = empty($data["package"]) ? $data["option"] : $data["package"];
        $result = [];

        foreach ($list as $key => $value) {
            array_push($result, createProductPrice($value));
        }

        return $result;
    }
}

if (!function_exists("createProductPrice")) {
    function createProductPrice($data) {
        return [
            "@type"         => "Offer",
            "priceCurrency" => "KRW",
            "price"         => $data["price"]
        ];
    }
}

if (!function_exists("createProductAggregateRating")) {
    function createProductAggregateRating($average, $count) {
        return [
            "@type" => "AggregateRating",
            "ratingValue" => (int)$average > 0 ? $average : "5",
            "reviewCount" => $count
        ];
    }
}

if (!function_exists("categoryCodeToName")) {
    function categoryCodeToName($code) {
        switch($code) {
            case "FOOD": return  "음식";
            case "PRODUCT": return  "제품";
            case "PROFILE_BIZ": return  "기업프로필";
            case "INTERIOR": return  "인테리어";
            case "EVENT": return  "행사";
            case "FASHION": return  "패션";
            case "BEAUTY": return  "코스메틱";
            case "VIDEO": return  "개인영상";
            case "SNAP": return  "스냅";
            case "PROFILE": return  "개인프로필";
            case "WEDDING": return  "웨딩";
            case "BABY": return  "베이비";
            case "DRESS_RENT": return "의상대여";
            case "MODEL": return "모델";
            case "VIDEO_BIZ": return "기업영상";
            default: return $code;
        }
    }
}

//if(!function_exists("greenLog")) {
//    function greenLog() {
//        // 녹색접속자 분석 솔류션 서버스크립트 코드
//        $logcorp_test = null;
//
//        if($logcorp_xml_send != true){
//            $ptc = strstr($_SERVER['SERVER_PROTOCOL'],"HTTPS") ? "https://" : "http://";
//            if(!isset($_SESSION)) @session_start();
//            $logsrid = $_COOKIE['logsrid'];
//            if($logsrid == ""){
//                $microtime = explode(".", microtime(true));
//                $logsrid = substr(md5(session_id()),0,26)."-".date("Ymd") . substr($microtime[0], -5). substr($microtime[1], 0, 2);
//            }
//            if(session_id()){
//                $_SESSION['logsid']=md5(session_id());
//                $_SESSION['logref']=urlencode($_SERVER['HTTP_REFERER']);
//                $logcorp_pV = "logra=".$_SERVER['REMOTE_ADDR']."&logsid=".md5(session_id())."&logsrid=".$logsrid."&logua=".urlencode($_SERVER['HTTP_USER_AGENT'])."&logha=".urlencode($_SERVER['HTTP_ACCEPT'])."&logref=".urlencode($_SERVER['HTTP_REFERER'])."&logurl=".urlencode($ptc.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'])."&cdkey=forsnap&asp=asp27";
//                $logcorp_headers =  "GET /jserver.php?".$logcorp_pV." HTTP/1.0\r\nHost: 114.108.138.227\r\nConnection: Close\r\n\r\n";
//                $logcorp_fp = @fsockopen("114.108.138.227", 80, $errno, $errstr,0.2);
//                if($logcorp_fp) {
//                    fwrite($logcorp_fp, $logcorp_headers);
//                    fclose($logcorp_fp);
//                }
//                $logcorp_xml_send = true;
//                setcookie("logsrid", $logsrid, time()+259200000, "/",str_replace("www.","",$_SERVER['SERVER_NAME']));
//            }
//            $logcorp_test = ["logsid" => $_SESSION['logsid'], "logref" => $_SESSION['logref']];
//        }
//
//        return $logcorp_test;
//    }
//}

if (!function_exists("isBusinessCategory")) {
    function isBusinessCategory($code) {
        $biz_category = [
            "PRODUCT",
            "BEAUTY",
            "FASHION",
            "FOOD",
            "PROFILE_BIZ",
            "INTERIOR",
            "EVENT",
            "VIDEO_BIZ"
        ];

        return in_array(strtoupper($code), $biz_category);
    }
}
