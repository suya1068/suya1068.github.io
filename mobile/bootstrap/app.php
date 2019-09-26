<?php
require_once __DIR__."/../vendor/autoload.php";

use Monolog\Handler\RotatingFileHandler;
use Monolog\Logger;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;


/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

// common
define("FORSNAP_UUID", "FORSNAP_UUID");
define("USER_ID_NAME", "FORSNAP_USER_ID");
define("API_TOKEN_NAME", "FORSNAP_API_TOKEN");
define("ENTER", "ENTER");
define("API_TYPE", "public");
define("API_VERSION", "v1");

// switch
switch (gethostname()) {
    case "web-dev":
        define("HOST_DOMAIN", "http://" . $_SERVER["HTTP_HOST"]);
        define("API_SERVER", "http://api.beta-forsnap.com");
        define("IMG_SERVER", "http://image.beta-forsnap.com");
        define("DATA_SERVER", "http://data.beta-forsnap.com");
//        define("THUMB_SERVER", "http://thumb.beta-forsnap.com");
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
//        define("THUMB_SERVER", "http://thumb.beta-forsnap.com");
        define("THUMB_SERVER", "http://thumbnail.beta-forsnap.com:22010");
        define("DEV", true);
        define("PRODUCTION", false);
        define("LIVE", false);
        break;
    case "stage":
        define("HOST_DOMAIN", "http://" . $_SERVER["HTTP_HOST"]);
//        define("API_SERVER", "http://internal-live-internal-webapi-elb-1137519314.ap-northeast-2.elb.amazonaws.com/");
        define("API_SERVER", "http://api.stage-forsnap.com");
        define("IMG_SERVER", "https://image.forsnap.com");
        define("DATA_SERVER", "https://data.forsnap.com");
//        define("THUMB_SERVER", "https://thumb.stage-forsnap.com");
        define("THUMB_SERVER", "https://thumbnail2.forsnap.com");
        define("DEV", false);
        define("PRODUCTION", true);
        define("LIVE", true);
        break;
    default:
        define("HOST_DOMAIN", "https://" . $_SERVER["HTTP_HOST"]);
        define("API_SERVER", "http://internal-live-internal-webapi-elb-1137519314.ap-northeast-2.elb.amazonaws.com/");
//        define("API_SERVER", "http://internal-live-internal-webapi-elb-1037671013.ap-northeast-2.elb.amazonaws.com");
        define("IMG_SERVER", "https://image.forsnap.com");
        define("DATA_SERVER", "https://data.forsnap.com");
//        define("THUMB_SERVER", "https://thumb.forsnap.com");
        define("THUMB_SERVER", "https://thumbnail2.forsnap.com");
        define("DEV", false);
        define("PRODUCTION", true);
        define("LIVE", true);
        break;
}

$configuration = [
    "settings" => [
        "determineRouteBeforeAppMiddleware" => true,
        "logger" => [
            "name" => "[FORSNAP-MOBILE]",
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
            ->withStatus(302)
            ->withRedirect("/");
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
        "analytics" => !$bot && LIVE
    ];

    //  referer
    $referers = $request->getHeader("HTTP_REFERER");

    // url을 직접 치고 들어왔을 경우 enter_cookie를 제거해 준다.
    // 메인 이슈 변경, 기업메인이 기본, enter쿠키가 있는 경우는 이제 개인고객에 한해
    if (sizeof($referers) === 0) {
        $hostdomain = $_SERVER["HTTP_HOST"];    // forsnap.com
        // 만약 개발서버라면 (ex - sskim-forsnap.com:3007 ) explode한 배열의 갯수가 1이상이라면
        if (count(explode(":", $_SERVER["HTTP_HOST"])) > 1) {
            $hostdomain = parse_url($_SERVER["HTTP_HOST"])["host"];
        }

        if (strstr($hostdomain, "m.")) {
            $hostdomain = substr($hostdomain, 2);
        }

        setcookie(ENTER, "", time() - 3600, "/", ".".$hostdomain);
        unset($_COOKIE[ENTER]);
    }

//    if (sizeof($referers) > 0) {
//        $referer = parse_url($referers[0]);
//        $referer["query"] = empty($referer["query"]) ? null : $referer["query"];
//
//        parse_str($referer["query"], $parseStr);
//        $uri = get_redirect_uri("");
//        $parseUrl = parse_url($uri);
//
//        if (empty($params["new"]) && !strpos($parseUrl["path"], ".") && !$enter) {
//            if (!empty($parseStr["new"])) {
//                $redirectUrl = $parseUrl["scheme"]."://".$parseUrl["host"].":".$parseUrl["port"].$parseUrl["path"].(empty($parseUrl["query"]) ? "?new=true" : "?".$parseUrl["query"]."&new=true");
//                $this->Logger->debug("REFERRE_RESULT 333", ["redirect_url" => $redirectUrl]);
//                return $response->withStatus(302)->withHeader("Location", $redirectUrl);
//            }
//        }
//    }

    if (isset($newWindow)) {
        $hostdomain = $_SERVER["HTTP_HOST"];
        if (count(explode(":", $_SERVER["HTTP_HOST"])) > 1) {
            $hostdomain = parse_url($_SERVER["HTTP_HOST"])["host"];
        }

        if (strstr($hostdomain, "m.")) {
            $hostdomain = substr($hostdomain, 2);
        }

        // 개인고객 쿠키 24시간 만료시간 설정 (개발 서버 시간과 실제시간과 차이가 나서 너프하게 설정)
        setcookie(ENTER, "indi", time() + (3600 * 24), "/", ".".$hostdomain);
    }

    $this->Logger->debug("Environment Mobile", [
        "agent" => $_SERVER["HTTP_USER_AGENT"],
        "env" => $env
    ]);

    $target_ip = $_SERVER["REMOTE_ADDR"];
//    $check_ip_str = "127.0.0.";
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
require __DIR__."/../routes/products.php";
require __DIR__."/../routes/users.php";
require __DIR__."/../routes/artists.php";
require __DIR__."/../routes/policy.php";
require __DIR__."/../routes/cs.php";
//require __DIR__."/../routes/ticket.php";
require __DIR__."/../routes/information.php";
require __DIR__."/../routes/portfolio.php";
require __DIR__."/../routes/event.php";
require __DIR__."/../routes/landing.php";

return $app;
