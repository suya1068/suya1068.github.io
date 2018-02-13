import axios from "axios";
import init from "./init";

init();
const test_checkbox = document.querySelector("input[id='push-test']");
let messaging;

const instance = axios.create({
    baseURL: "http://127.0.0.1:3000",
    timeout: 0
});

/* ================================================
 Header Config
 ================================================ */
Object.assign(instance.defaults, {
    headers: {
        common: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        post: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }
});

/* ================================================
 Interceptors - Request
 ================================================ */
instance.interceptors.request.use(config => {
    const result = config;
    return result;
}, error => {
    return console.log("axios request fail");
});

test_checkbox.addEventListener("click", function(e) {
    const checked = e.target.checked;
    if (checked) {
        messaging = firebase.messaging();
        // const that = this;
        messaging.requestPermission()
            .then(function () {
                messaging.getToken()
                    .then(function(currentToken) {
                        if (currentToken) {
                            sendTokenToServer({ token: currentToken }).then(response => {
                                console.log("response", response);
                                document.getElementById("token").innerText = "browser token: " + response.data.token;
                            }).catch(error => {
                                console.log("toServer error");
                            });
                            // updateUIForPushEnabled(currentToken);
                        }
                        // else {
                        //     // Show permission request.
                        //     console.log('No Instance ID token available. Request permission to generate one.');
                        //     // Show permission UI.
                        //     updateUIForPushPermissionRequired();
                        //     setTokenSentToServer(false);
                        // }
                    }).catch(function(err) {
                    console.log('An error occurred while retrieving token. ', err);
                    // showToken('Error retrieving Instance ID token. ', err);
                    // setTokenSentToServer(false);
                });
            }).catch(function(err) {
            console.log("error occured.");
        });

        messaging.onMessage(function(payload) {
            console.log("Message received. ", payload);
            console.log(Notification);
            // const notiTitle = payload.notification.title;
            // const notiOptions = {
            //     body: payload.notification.body,
            //     icon: payload.notification.icon
            // };
            //
            // if (Notification.permission === "granted") {
            //     let notification = new Notification(notiTitle, notiOptions);
            // }
            // [START_EXCLUDE]
            // Update the UI to include the received message.
            // [END_EXCLUDE]
        });
    }
});

function sendTokenToServer(token) {
    return instance.post("/test", stringify(token));
}

/**
 * json data를 query string으로 변환한다.
 * @name query.stringify
 * @param {object|string} [data = ""]
 * @returns {string}
 */
function stringify(data = "") {
    if (typeof data === "string") { return data; }
    if (!({}.toString.call(data) === "[object Object]")) { throw new TypeError("The type is incorrect."); }

    const result = [];

    function add(key, value) {
        result.push(`${encodeURIComponent(key)}=${encodeURIComponent(value === null ? "" : value)}`);
    }

    function param(prefix, value, root = false) {
        if (Array.isArray(value)) {
            value.forEach((subData, idx) => {
                param(`${prefix}[${idx}]`, subData);
            });
        } else if ({}.toString.call(value) === "[object Object]") {
            Object.entries(value).forEach(subData => {
                param(`${prefix}[${subData[0]}]`, subData[1]);
            });
        } else {
            add(prefix, value);
        }
    }

    Object.entries(data).forEach(subData => {
        param(subData[0], subData[1], true);
    });

    return result.join("&");
}