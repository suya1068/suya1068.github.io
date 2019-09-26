import utils from "forsnap-utils";

export default {
    init() {
        return new Promise((resolve, reject) => {
            if (!window.Kakao) {
                const script = document.createElement("script");
                script.onload = () => {
                    resolve(true);
                };
                script.onerror = () => {
                    reject(false);
                };
                script.src = "//developers.kakao.com/sdk/js/kakao.min.js";
                document.body.appendChild(script);
            } else {
                resolve(true);
            }
        }).then(() => {
            if (window.Kakao) {
                const hostDomain = location.host;
                const liveKey = "0f3f2a76a0b596812e6cac5b79b6a9f8";
                const devKey = "2e50b5025b866909ce06c3fdd8dd9425";

                let aKey = devKey;

                if (hostDomain.indexOf("stage") !== -1 || (hostDomain === "forsnap.com" || hostDomain === "m.forsnap.com")) {
                    aKey = liveKey;
                }

                window.Kakao.init(aKey);
                // 상용
                // window.Kakao.init("0f3f2a76a0b596812e6cac5b79b6a9f8");

                // 개발
                // window.Kakao.init("2e50b5025b866909ce06c3fdd8dd9425");
            }
        });
    },
    sendOpenEstimate(category, category_name, price, estimate_no, success, fail) {
        const host = location.host;
        const protocol = host === "forsnap.com" || host === "m.fornap.com" ? "https://" : "http://";

        if (window.Kakao) {
            const source = "utm_source=est_kakao&utm_medium=click";
            const params = {
                objectType: "feed",
                content: {
                    title: `포스냅 ${category_name}촬영 견적입니다.`,
                    description: `입력하신 정보로 계산된 견적입니다.\n예상견적 : ${utils.format.price(price)}원`,
                    imageUrl: "https://image.forsnap.com/common/default_thumb.jpg",
                    imageWidth: 1200,
                    imageHeight: 630,
                    link: {
                        // webUrl: "https://forsnap.com",
                        // mobileWebUrl: "https://m.forsnap.com"
                        webUrl: `${protocol}${host}?${source}`,
                        mobileWebUrl: `${protocol}${host}?${source}`
                    }
                },
                buttons: [
                    {
                        title: "상세견적 확인",
                        link: {
                            webUrl: `${protocol}${host}/products?category=${category}&estimate_no=${estimate_no}&${source}`,
                            mobileWebUrl: `${protocol}${host}/products?category=${category}&estimate_no=${estimate_no}&${source}`
                        }
                    }
                ],
                installTalk: true,
                success: obj => {
                    // console.log("success : ", obj);
                    // template_msg : Object 링크 메시지 (Link JSON 참고용)
                    // warning_msg : Object 링크 메시지를 검증한 결과
                    // argument_msg : Object argument를 검증한 결과
                    if (typeof success === "function") {
                        success(obj);
                    }
                },
                fail: () => {
                    if (typeof fail === "function") {
                        fail();
                    }
                }
            };

            window.Kakao.Link.sendDefault(params);
        }
    }
};
