<?php
namespace App\Services;

class AuthService {
    /**
     * @var string
     * @desc 모듈 이름
     */
    private $module_name = "CPClient";

    private $state_name = "fsc_user_auth_token";

    /**
     * @var string
     * @desc 나이스로부터 부여받은 사이트 코드
     */
    private $site_code= "AD151";

    /**
     * @var string
     * @desc 나이스로부터 부여받은 사이트 패스워드
     */
    private $site_password = "Vg1KFT0KtheC";

    /**
     * @var string
     * @desc 없으면 기본 선택화면, X: 공인인증서, M: 핸드폰, C: 카드
     */
    private $auth_type = "M";

    /**
     * @var string
     * @desc Y: 취소버튼 있음 / N: 취소버튼 없음
     */
    private $pop_gubun = "N";

    /**
     * @var string
     * @desc 없으면 기본 웹 페이지 / Mobile : 모바일 페이지
     */
    private $customize = "";

    /**
     * @var string
     * @desc 요청번호
     */
    private $req_seq = "";

    /**
     * @var string
     * @desc 성공 콜백 URL
     */
    private $return_url = "";

    /**
     * @var string
     * @desc 실패 콜백 URL
     */
    private $error_url = "";


    public function __construct() {
        if(!extension_loaded($this->module_name)) {
            dl($this->module_name.".".PHP_SHLIB_SUFFIX);
        }

        $this->return_url = HOST_DOMAIN .  "/auth/success";
        $this->error_url = HOST_DOMAIN .  "/auth/fail";
    }

    public function getReqSeq() {
        return $this->req_seq;
    }

    public function createReqSeq() {
        $this->req_seq = get_cprequest_no($this->site_code);
        return $this;
    }

    /**
     * @return array|null
     * @desc 인코드된 데이터를 가져온다.
     */
    public function getEncodeData() {
        if (!isset($this->req_seq)) {
            return null;
        }

        $plain_data = $this->getPlainData($this->req_seq);
        $enc_data = get_encode_data($this->site_code, $this->site_password, $plain_data);
        $message = "OK";

        if ($enc_data == -1) {
            $message = "암복호화 시스템 오류입니다.";
        } else if ($enc_data == -2) {
            $message = "암호화 처리 오류입니다.";
        } else if ($enc_data == -3) {
            $message = "암호화 데이터 오류입니다.";
        } else if ($enc_data == -9) {
            $message = "입력 값 오류입니다.";
        }

        return ["message" => $message, "data" => $enc_data];
    }

    public function getDecodeData() {}

    /**
     * @param $req_seq
     * @return string
     * @desc 데이터를 파싱하여 string으로 반환한다.
     */
    private function getPlainData($req_seq) {
        $result = [
            "7:REQ_SEQ" => ["size" => strlen($req_seq), "value" => $req_seq],
            "8:SITECODE" => ["size" => strlen($this->site_code), "value" => $this->site_code],
            "9:AUTH_TYPE" => ["size" => strlen($this->auth_type), "value" => $this->auth_type],
            "7:RTN_URL" => ["size" => strlen($this->return_url), "value" => $this->return_url],
            "7:ERR_URL" => ["size" => strlen($this->error_url), "value" => $this->error_url],
            "11:POPUP_GUBUN" => ["size" => strlen($this->pop_gubun), "value" => $this->pop_gubun],
            "9:CUSTOMIZE" => ["size" => strlen($this->customize), "value" => $this->customize]
        ];

        return array_reduce(array_keys($result), function ($box, $name) use ($result) {
            $data = $result[$name];
            $box .= $name . $data["size"] . ":" . $data["value"];
            return $box;
        }, "");
    }
}
