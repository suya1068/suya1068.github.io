import redirect from "forsnap-redirect";

const FSN = window.opener.FSN.default;
const type = document.getElementById("sns-type").content;
const params = FSN.sns.parseURI(type, document.location.href);

if (params.error === "access_denied") {
    self.close();
} else if (FSN.sns.isCSRFToken(params.state)) {
    FSN.sns.removeCSRFToken();
    const redirectUrl = `${__DOMAIN__}/${__SNS__[type].redirect_uri}`;

    FSN.sns.success({
        data: {
            type,
            code: params.code,
            redirect_url: redirectUrl
        },
        status: 200,
        statusText: "OK"
    });

    self.close();
} else {
    redirect.error(window.opener);
    self.close();
}
