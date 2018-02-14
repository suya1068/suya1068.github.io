/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__init__ = __webpack_require__(1);
// import axios from "axios";


Object(__WEBPACK_IMPORTED_MODULE_0__init__["a" /* default */])();
const test_checkbox = document.querySelector("input[id='push-test']");
const messaging = firebase.messaging();

// const instance = axios.create({
//     baseURL: "http://127.0.0.1:3000",
//     timeout: 0
// });
//
// /* ================================================
//  Header Config
//  ================================================ */
// Object.assign(instance.defaults, {
//     headers: {
//         common: {
//             Accept: "application/json",
//             "Content-Type": "application/json"
//         },
//         post: {
//             "Content-Type": "application/x-www-form-urlencoded"
//         }
//     }
// });
//
// /* ================================================
//  Interceptors - Request
//  ================================================ */
// instance.interceptors.request.use(config => {
//     const result = config;
//     return result;
// }, error => {
//     return console.log("axios request fail");
// });

test_checkbox.addEventListener("click", function(e) {
    const checked = e.target.checked;
    if (checked) {
        messaging.requestPermission()
            .then(function () {
                messaging.getToken()
                    .then(function(currentToken) {
                        document.getElementById("token").innerText = "browser token: " + currentToken;
                        if (currentToken) {
                            // sendTokenToServer({ token: currentToken }).then(response => {
                            //     console.log("response", response);
                            //     document.getElementById("token").innerText = "browser token: " + response.data.token;
                            // }).catch(error => {
                            //     console.log("toServer error");
                            // });
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
            // console.log("Message received. ", payload);
            window.alert("foreground: " + payload);

            // const notiTitle = payload.notification.title;
            // const notiOptions = {
            //     body: payload.notification.body,
            //     icon: payload.notification.icon
            // };
            //
            // if (Notification.permission === "granted") {
            //     let notification = new Notification(notiTitle, notiOptions);
            // }
        });
    }
});

// function sendTokenToServer(token) {
//     return instance.post("/test", stringify(token));
// }
//
// /**
//  * json data를 query string으로 변환한다.
//  * @name query.stringify
//  * @param {object|string} [data = ""]
//  * @returns {string}
//  */
// function stringify(data = "") {
//     if (typeof data === "string") { return data; }
//     if (!({}.toString.call(data) === "[object Object]")) { throw new TypeError("The type is incorrect."); }
//
//     const result = [];
//
//     function add(key, value) {
//         result.push(`${encodeURIComponent(key)}=${encodeURIComponent(value === null ? "" : value)}`);
//     }
//
//     function param(prefix, value, root = false) {
//         if (Array.isArray(value)) {
//             value.forEach((subData, idx) => {
//                 param(`${prefix}[${idx}]`, subData);
//             });
//         } else if ({}.toString.call(value) === "[object Object]") {
//             Object.entries(value).forEach(subData => {
//                 param(`${prefix}[${subData[0]}]`, subData[1]);
//             });
//         } else {
//             add(prefix, value);
//         }
//     }
//
//     Object.entries(data).forEach(subData => {
//         param(subData[0], subData[1], true);
//     });
//
//     return result.join("&");
// }

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Initialize Firebase
function init () {
    const config = {
        apiKey: "AIzaSyBaWpWO4ClA0yUprIvhIQNqpnVko0o8cvQ",
        authDomain: "push-notification-152502.firebaseapp.com",
        databaseURL: "https://push-notification-152502.firebaseio.com",
        projectId: "push-notification-152502",
        storageBucket: "push-notification-152502.appspot.com",
        messagingSenderId: "695645857567"
    };
    firebase.initializeApp(config);
}

/* harmony default export */ __webpack_exports__["a"] = (init);


/***/ })
/******/ ]);