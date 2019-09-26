// import agent from "shared/helper/utils/agent";
// import cookie from "forsnap-cookie";
// import CONSTANT from "shared/constant";

const ad = {
    /**
     * 구글 애널리틱스 이벤트 생성
     * @param eCategory
     * @param eAction
     * @param eLabel
     */
    gaEvent(eCategory, eAction = "", eLabel = "") {
        ga("Event.send", "event", {
            eventCategory: eCategory,
            eventAction: eAction,
            eventLabel: eLabel
        });
        // gtag("event", eAction, {
        //     "event_category": eCategory,
        //     "event_label": eLabel,
        //     // "send_to": "UA-91761764-2"
        //     "send_to": "UA-108815098-2"
        // });
    },

    gaEventOrigin(eCategory, eAction = "", eLabel = "") {
        ga("send", "event", {
            eventCategory: eCategory,
            eventAction: eAction,
            eventLabel: eLabel
        });
    },

    /**
     * 구글 Ads 상담전환 스니펫
     * @param url
     * @returns {boolean}
     */
    gtag_report_conversion(url) {
        // const callback = function () {
        //     if (typeof (url) !== "undefined") {
        //         window.location = url;
        //     }
        // };

        gtag("event", "conversion", {
            // "send_to": "AW-794445754/lJqiCLPhq5oBELqP6foC"
            "send_to": "AW-799191955/SiobCP2Ns5oBEJPniv0C"
            //"event_callback": () => callback()
        });
        return false;
    },


    /**
     * 네이버 프리미엄 로그 전환페이지 설치 이벤트
     * @param script_no - String
     *  전환 스크립트 유형
     *      - 1. 구매완료
     *      - 2. 회원가입
     *      - 3. 장바구니
     *      - 4. 신청 / 예약
     *      - 5. 기타 (대화하기)
     * @param value - String
     *  전환가치 : 특정 값이 있으면 값을 넣고 아니면 통상적인 값으로 1을 넣는다.
     */
    wcsEvent(script_no, value = "1") {
        if (wcs && wcs.cnv && wcs_do) {
            const _nasa = {};
            _nasa["cnv"] = wcs.cnv(script_no, `${value}`);
            wcs_do(_nasa);
        }
    },

    /**
     * 페이스북 픽셀 전환체크
     * 전환 코드 유형
     *      - 1. Purchase : 구매완료하거나 결제 플로우가 완료되었을 경우
     *          {params} - content_ids, content_name, content_type, contents, currency(필수), value(필수), num_items
     *      - 2. InitiateCheckout : 결제완료전 결제플로우에 진입했을 경우 ex) 결제버튼 클릭
     *          {params} - content_category, content_ids, contents, currency, num_items, value
     *      - 3. Search : 검색을 할경우
     *          {params} - content_category, content_ids, currency, search_string, value
     *      - 4. AddToWishlist : 제품을 위시리스트에 추가하는 경우
     *          {params} - content_category, content_name, content_ids, contents, currency, value
     *      - 5. ViewContent - 제품 페이지 등의 중요 페이지가 조회된 경우 ex) 상품상세 조회
     *          {params} - content_ids, content_name, content_type, contents, currency, value
     */
    fbqEvent(code, params) {
        const change_code_list = ["Purchase", "InitiateCheckout", "Search", "AddToWishlist", "ViewContent"];
        if (change_code_list.includes(code)) {
            fbq("track", code, { ...params });
        }
    }
};

export default ad;
