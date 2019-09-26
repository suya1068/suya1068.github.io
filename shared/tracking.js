const isLive = __STATUS__ === "live";

/*
    Google Code for &#44396;&#47588;&#54168;&#51060;&#51648; Conversion Page In your html page,
    add the snippet and call goog_report_conversion when someone clicks on the chosen link or button.
 */
const goog_snippet_vars = function () {
    const w = window;
    w.google_conversion_id = 852384366;
    w.google_conversion_label = "qyDcCPyV0nEQ7rS5lgM";
    w.google_remarketing_only = false;
};

const goog_report_conversion = function (url) {
    goog_snippet_vars();
    window.google_conversion_format = "3";

    const opt = {};
    opt.onload_callback = function () {
        if (typeof (url) !== "undefined") {
            window.location = url;
        }
    };

    const conv_handler = window["google_trackConversion"];
    if (typeof (conv_handler) === "function") {
        conv_handler(opt);
    }
};

export default {
    /**
     * 웹사이트에서 발생하는 클릭 전호나 추적하기
     * @param {?string} url
     */
    conversion(url) {
        if (isLive) {
            goog_report_conversion(url);
        }
    }
};
