<?php
require_once __DIR__."/../vendor/autoload.php";

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Monolog\Logger;
use Monolog\Handler\RotatingFileHandler;


/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

// common
define("FORSNAP_UUID", "FORSNAP_UUID");
define("USER_ID_NAME", "FORSNAP_USER_ID");
define("API_TOKEN_NAME", "FORSNAP_API_TOKEN");
define("USER_DATA", "FORSNAP_USER_DATA");
define("USER_AUTO", "FORSNAP_USER_AUTO");
define("ENTER", "ENTER");
define("API_TYPE", "public");
define("API_VERSION", "v1");

// switch
switch (gethostname()) {
    case "web-dev":
        define("HOST_DOMAIN", "http://" . $_SERVER["HTTP_HOST"]);
        define("API_SERVER", "http://api.beta-forsnap.com");
//        define("API_SERVER", "http://api.mschoo-forsnap.com");
        define("IMG_SERVER", "http://image.beta-forsnap.com");
        define("DATA_SERVER", "http://data.beta-forsnap.com");
        define("THUMB_SERVER", "http://thumbnail.beta-forsnap.com:22010");
        define("DEV", true);
        define("PRODUCTION", false);
        define("LIVE", false);
        break;
    case "web-beta":
        define("HOST_DOMAIN", "http://" . $_SERVER["HTTP_HOST"]);
        define("API_SERVER", "http://api.beta-forsnap.com");
        define("IMG_SERVER", "http://image.beta-forsnap.com");
        define("DATA_SERVER", "http://data.beta-forsnap.com");
        define("THUMB_SERVER", "http://thumbnail.beta-forsnap.com:22010");
        define("PRODUCTION", true);
        define("DEV", true);
        define("LIVE", false);
        break;
    case "stage":
        define("HOST_DOMAIN", "http://" . $_SERVER["HTTP_HOST"]);
//        define("API_SERVER", "http://internal-live-internal-webapi-elb-1137519314.ap-northeast-2.elb.amazonaws.com/");
        define("API_SERVER", "http://api.stage-forsnap.com");
        define("IMG_SERVER", "https://image.forsnap.com");
        define("DATA_SERVER", "https://data.forsnap.com");
        define("THUMB_SERVER", "https://thumbnail2.forsnap.com");
        define("PRODUCTION", true);
        define("DEV", false);
        define("LIVE", true);
        break;
    default:
        define("HOST_DOMAIN", "https://" . $_SERVER["HTTP_HOST"]);
        define("API_SERVER", "http://internal-live-internal-webapi-elb-1137519314.ap-northeast-2.elb.amazonaws.com/");
//        define("API_SERVER", "http://internal-live-internal-webapi-elb-1037671013.ap-northeast-2.elb.amazonaws.com");
        define("IMG_SERVER", "https://image.forsnap.com");
        define("DATA_SERVER", "https://data.forsnap.com");
        define("THUMB_SERVER", "https://thumbnail2.forsnap.com");
        define("PRODUCTION", true);
        define("DEV", false);
        define("LIVE", true);
        break;
}

$configuration = [
    "settings" => [
        "determineRouteBeforeAppMiddleware" => true,
        "logger" => [
            "name" => "FORSNAP",
            "level" => PRODUCTION ? Monolog\Logger::DEBUG : Monolog\Logger::DEBUG,
            "path" => "/var/log/application/front/public_front.log",
            "maxLength" => 3
        ],
        "displayErrorDetails" => !PRODUCTION
    ]
];


$container = new \Slim\Container($configuration);

/*
|--------------------------------------------------------------------------
| Log
|--------------------------------------------------------------------------
*/
$container["Logger"] = function ($container) {
    $settings = $container->get("settings")["logger"];

    $logger = new Logger("[FORSNAP]");
    $rotating = new RotatingFileHandler(
        $settings["path"],
        $settings["maxLength"],
        $settings["level"]
    );

    $logger->setHandlers([$rotating]);

    return $logger;
};

/*
|--------------------------------------------------------------------------
| View
|--------------------------------------------------------------------------
*/
$container["view"] = function ($container) {
    $view = new \Slim\Views\Twig(__DIR__."/../resources");
    $view->addExtension(new \Slim\Views\TwigExtension(
        $container['router'],
        $container['request']->getUri()
    ));
    return $view;
};

/*
|--------------------------------------------------------------------------
| Handler
|--------------------------------------------------------------------------
*/
$container["errorHandler"] = function ($c) {
    return function ($request, $response, $error) use ($c) {
        $c["Logger"]->error($error);

        return $c["response"]
            ->withStatus(500)
            ->withRedirect("/50x.html");
    };
};

$container["notFoundHandler"] = function ($c) {
    return function ($request, $response) use ($c) {
        return $c["response"]
            ->withStatus(404)
            ->withRedirect("/40x.html");
    };
};

$container["phpErrorHandler"] = function ($c) {
    return function ($request, $response, $error) use ($c) {
        $c["Logger"]->error($error);

        return $c["response"]
            ->withStatus(500)
            ->withRedirect('/50x.html');
    };
};

$container["foundHandler"] = function() {
    return new \Slim\Handlers\Strategies\RequestResponseArgs();
};


// COMMON CLASS
$container["API"] = function ($container) {
    return new App\Core\API($container);
};


$app = new \Slim\App($container);


/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
*/
$app->add(function (Request $request, Response $response, callable $next) use ($app) {
    // 서비스 작업중 페이지로 이동한다
    // return $response->withStatus(503)->withRedirect('/503.html');

    $params = $request->getQueryParams();
    $newWindow = empty($params["new"]) ? null : $params["new"];

    $manifestJson = file_get_contents(__DIR__."/../public/dist/manifest.json");
    $manifest = json_decode($manifestJson, true);

    $bot = empty($_SERVER['HTTP_USER_AGENT']) ? false : is_int(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "googlebot"));

    $env = [
        "bot" => $bot,
        "analytics" => !$bot && LIVE,
    ];

    $referers = $request->getHeader("HTTP_REFERER");

    // url을 직접 치고 들어왔을 경우 enter_cookie를 제거해 준다.
    // 메인 이슈 변경, 기업메인이 기본, enter쿠키가 있는 경우는 이제 개인고객에 한해
    if (sizeof($referers) === 0) {
        $hostdomain = $_SERVER["HTTP_HOST"];    // forsnap.com
        // 만약 개발서버라면 (ex - sskim-forsnap.com:3007 ) explode한 배열의 갯수가 1이상이라면
        if (count(explode(":", $_SERVER["HTTP_HOST"])) > 1) {
            $hostdomain = parse_url($_SERVER["HTTP_HOST"])["host"];
        }

        setcookie(ENTER, "", time() - 3600, "/", ".".$hostdomain);
        unset($_COOKIE[ENTER]);
    }


    // 레퍼러가 있다면
    if (sizeof($referers) > 0) {
        $referer = parse_url($referers[0]);

        // 진석님 코드
        if (preg_match("/^m\./i", $referer["host"])) {
            setcookie(FORSNAP_UUID, "", time() - 3600, "/");
            setcookie(USER_ID_NAME, "", time() - 3600, "/");
            setcookie(API_TOKEN_NAME, "", time() - 3600, "/");
        }

//        // enter 파라미터가 있으면 설정
//        $enter = empty($params["enter"]) ? null : $params["enter"];
//
//        // 리다이렉트 url을 설정한다 (현재주소에서)
//        $uri = get_redirect_uri("");
//        // 현재 주소의 url을 파싱한 후 변수에 담는다.
//        $parseUrl = parse_url($uri);
//
//        // 현재 주소에 new 파라미터가 없고 url의 path의 . 이 없고 enter 파라미터가 있다면
//        if (empty($newWindow) && !strpos($parseUrl["path"], ".") && $enter) {
//            // 레퍼러의 search 항목이 있다면 ( forsnap.com/path?...)
//            $referer["query"] = empty($referer["query"]) ? null : $referer["query"];
//            // search 를 파싱하고 parseStr 변수에 담음
//            parse_str($referer["query"], $parseStr);
//
//            // 레퍼러에 new 파라미터가 있다면
//            if (!empty($parseStr["new"])) {
//                // 현재주소에 파라미터 new을 추가하고
//                $redirectUrl = $parseUrl["scheme"]."://".$parseUrl["host"].":".$parseUrl["port"].$parseUrl["path"].(empty($parseUrl["query"]) ? "?new=true" : "?".$parseUrl["query"]."&new=true");
//                // 리다이렉트 시켜준다.
//                return $response->withStatus(302)->withHeader("Location", $redirectUrl);
//            }
//        }
    }

    if (isset($newWindow)) {
        $hostdomain = $_SERVER["HTTP_HOST"];    // forsnap.com
        // 만약 개발서버라면 (ex - sskim-forsnap.com:3007 ) explode한 배열의 갯수가 1이상이라면
        if (count(explode(":", $_SERVER["HTTP_HOST"])) > 1) {
            $hostdomain = parse_url($_SERVER["HTTP_HOST"])["host"];
        }

        $this->Logger->debug("host_domain", ["host" => ".".$hostdomain]);

        // 개인고객 쿠키 24시간 만료시간 설정 (개발 서버 시간과 실제시간과 차이가 나서 너프하게 설정)
        setcookie(ENTER, "indi", time() + 3600 * 24,"/", ".".$hostdomain);
    }

//    session_start();
//
//    if (!isset($_COOKIE[API_TOKEN_NAME])) {
//        unset($_SESSION["member_login"]);
//        setcookie(USER_AUTO, "", time() - 3600);
//    } else if (!isset($_SESSION["member_login"])) {
//        $auto = $_COOKIE[USER_AUTO];
//
//        if ($auto === "true") {
//            $auto = true;
//        } else if ($auto === "false") {
//            $auto = false;
//        } else {
//            $auto = null;
//        }
//
//        if (is_bool($auto)) {
//            if (!$auto) {
//                unset($_SESSION["member_login"]);
//                unset($_COOKIE[USER_ID_NAME]);
//                unset($_COOKIE[API_TOKEN_NAME]);
//                unset($_COOKIE[USER_DATA]);
//                unset($_COOKIE[USER_AUTO]);
//                $host = "." . explode(":", $_SERVER["HTTP_HOST"])[0];
//                setcookie(USER_ID_NAME, "", time() - 3600, "/", $host);
//                setcookie(API_TOKEN_NAME, "", time() - 3600, "/", $host);
//                setcookie(USER_DATA, "", time() - 3600, "/", $host);
//                setcookie(USER_AUTO, "", time() - 3600, "/", $host);
//            } else {
//                $_SESSION["member_login"] = true;
//            }
//        }
//
    $target_ip = $_SERVER["REMOTE_ADDR"];
    $check_ip_str = "211.249.42.";

    $check_pos_ip = strpos($target_ip, $check_ip_str);

    $this->Logger->debug("Environment", [
        "uri" => $_SERVER["REQUEST_URI"],
        "agent" => $_SERVER["HTTP_USER_AGENT"],
        "env" => $env
    ]);

    $request = $request
        ->withAttribute("env", $env)
        ->withAttribute("manifest", $manifest)
        ->withAttribute("except_ip", $check_pos_ip)
//        ->withAttribute("logcorp", empty($logcorp_test) ? null : $logcorp_test)
        ->withAttribute("browser", getBrowser());

    return $next($request, $response);
});

require __DIR__."/../routes/web.php";
require __DIR__."/../routes/artists.php";
require __DIR__."/../routes/information.php";
require __DIR__."/../routes/products.php";
require __DIR__."/../routes/users.php";
require __DIR__."/../routes/auth.php";
require __DIR__."/../routes/policy.php";
require __DIR__."/../routes/cs.php";
require __DIR__."/../routes/estimate.php";
require __DIR__."/../routes/portfolio.php";
require __DIR__."/../routes/event.php";
//require __DIR__."/../routes/ticket.php";
require __DIR__."/../routes/landing.php";

if (!PRODUCTION) {
    require __DIR__."/../routes/demo.php";
}


return $app;
