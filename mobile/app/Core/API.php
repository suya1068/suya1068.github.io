<?php
namespace App\Core;

class API {
    private $NAME = "FORSNAP";
    private $API_TYPE = API_TYPE;
    private $API_VERSION = API_VERSION;

    private $headers = [
        "Accept" => "application/json",
        "API-TYPE" => API_TYPE,
        "API-VERSION" => API_VERSION
    ];

    private $Logger;
    private $container;

    public function __construct($container) {
        $this->container = $container;
        $this->Logger = $container->Logger;
    }

    /**
     * @param $url
     * @param null $data
     * @param null $config
     * @return array|mixed
     * @description
     * GET으로 API 서버에 요청한다.
     */
    public function get($url, $data = null, $config = null) {
        $query = $this->getQueryParam($data);
        $headers = $this->getHeaders($config);

        $this->Logger->debug($this->NAME, ["url" => $url, "query" => $query, "headers" => $headers]);

        $instance = curl_init();
        curl_setopt($instance, CURLOPT_URL, API_SERVER . ($data ? $url . "?" . $query : $url));
        curl_setopt($instance, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($instance, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($instance, CURLOPT_HEADER, 0);
        curl_setopt($instance, CURLOPT_POST, 0);
        $result = curl_exec($instance);

        $info =  curl_getinfo($instance);
        $status = $info["http_code"];

        if ($result && $status == 200) {
            $result = ["status" => $status, "message" => "OK", "url" => $info["url"], "data" => json_decode($result, true)];
        } else {
            $result = $this->error($instance, $info, $result);
        }

        curl_close($instance);

        $this->Logger->debug($this->NAME . " - RESULT", ["result" => $result]);

        return $result;
    }

    public function post($url, $data = null, $config = null) {
        $query = $this->getQueryParam($data);
        $headers = $this->getHeaders($config);

        $this->Logger->info($this->NAME, ["url" => $url, "data" => $data, "query" => $query, "headers" => $headers]);

        $instance = curl_init();
        curl_setopt($instance, CURLOPT_URL, API_SERVER . $url);
        curl_setopt($instance, CURLOPT_POSTFIELDS, $query);
        curl_setopt($instance, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($instance, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($instance, CURLOPT_HEADER, 0);
        curl_setopt($instance, CURLOPT_POST, 4);
        $result = curl_exec($instance);

        $info =  curl_getinfo($instance);
        $status = $info["http_code"];

        if ($result && $status == 200) {
            $result = ["status" => $status, "message" => "OK", "url" => $info["url"], "data" => json_decode($result, true)];
        } else {
            $result = $this->error($instance, $info, $result);
        }

        curl_close($instance);
        $this->Logger->info($this->NAME . " - RESULT", ["result" => $result]);

        return $result;
    }

    /**
     * @param $instance
     * @param $info
     * @param $response
     * @return array
     * @description
     * curl 에러를 처리한다.
     */
    private function error($instance, $info, $response) {
        $status = $info["http_code"];

        $result = ["status" => $status, "message" => is_null($response) ? curl_error($instance) : $response, "url" => $info["url"]];
        $this->Logger->error($this->NAME, $result);
        return $result;
    }

    /**
     * @param $headers
     * @return array
     * @description
     * API 서버에 보내기 위한 헤더 정보를 가져온다.
     */
    private function getHeaders($headers) {
        $list = array_merge(
            [
                "API-IP" => get_client_ip_server(),
                "API-UA" => $_SERVER["HTTP_USER_AGENT"]
            ],
            $this->headers,
            $headers
        );
        $result = [];

        foreach($list as $key => $value) {
            if (isset($value)) {
                array_push($result, $key . ":". $value);
            }
        }

        return $result;
    }

    /**
     * @param $data
     * @return string
     * @description
     * query param을 가져온다.
     */
    private function getQueryParam($data) {
        if (is_null($data)) {
            return "";
        }

        if (is_string($data)) {
            return $data;
        }

        $result = [];

        foreach($data as $key => $value) {
            if (isset($value)) {
                array_push($result, $key . "=" . urlencode($value));
            }
        }

        return join($result, "&");
    }
}
