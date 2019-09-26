const SNS_DEV = {
    kakao: {
        client_id: "e5861b6cf0e16ab22575ecdb5278a864",
        code_token_uri: "https://kauth.kakao.com/oauth/authorize",
        response_type: "code",
        redirect_uri: "login/process/kakao"
    },
    naver: {
        client_id: "t9G8rlgN_qNDfN9b3m44",
        code_token_uri: "https://nid.naver.com/oauth2.0/authorize",
        share_uri: "http://share.naver.com/web/shareView.nhn",
        response_type: "code",
        redirect_uri: "login/process/naver"
    },
    facebook: {
        client_id: "1772700052981399",
        code_token_uri: "https://www.facebook.com/v2.8/dialog/oauth",
        share_uri: "https://www.facebook.com/dialog/share",
        response_type: "code",
        redirect_uri: "login/process/facebook"
    }
};

const SNS_LIVE = {
    kakao: {
        client_id: "7669d7065a772ec02ac46a9eaa552ff9",
        code_token_uri: "https://kauth.kakao.com/oauth/authorize",
        response_type: "code",
        redirect_uri: "login/process/kakao"
    },
    naver: {
        client_id: "VUC7lvdpRhvwkRLzktEt",
        code_token_uri: "https://nid.naver.com/oauth2.0/authorize",
        share_uri: "http://share.naver.com/web/shareView.nhn",
        response_type: "code",
        redirect_uri: "login/process/naver"
    },
    facebook: {
        client_id: "1271772856194306",
        code_token_uri: "https://www.facebook.com/v2.8/dialog/oauth",
        share_uri: "https://www.facebook.com/dialog/share",
        response_type: "code",
        redirect_uri: "login/process/facebook"
    }
};

exports.dev = SNS_DEV;

exports.beta = SNS_DEV;

exports.stage = SNS_LIVE;

exports.live = SNS_LIVE;
