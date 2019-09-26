<?php

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Services\AuthService as AuthService;

/**
 * PAYMENT ROUTE
 */
$app->group("/payment", function () {
    $this->get("/{pay_no}/{pay_type}", function (Request $request, Response $response, $pay_no, $pay_type) {
        $seo = get_seo([
            "title" => "결제 - 포스냅",
            "description" => "",
            "url" => "/payment"
        ]);

        return $this->view->render($response, "views/payment/payment.twig", [
            "env" => $request->getAttribute("env"),
            "manifest" => $request->getAttribute("manifest"),
            "seo" => $seo,
            "browser" => $request->getAttribute("browser"),
            "pay_type" => $pay_type,
            "pay_no" => $pay_no
        ]);
    })->setName("payment_ready");
});
