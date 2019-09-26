const FSN = window.opener.FSN.default;
const data = JSON.parse(document.getElementById("fsc_data").content);

if (data.status === 200) {
    if (FSN.auth.success) {
        FSN.auth.success(data);
    }
}

if (data.status !== 200) {
    if (FSN.auth.fail) {
        FSN.auth.fail(data);
    }
}

self.close();
